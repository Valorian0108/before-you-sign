"use client";
import styles from "../../../uni.module.css";
import { useStoreWallet } from "../../Wallet/walletContext";
import { useFrontendProvider } from "../provider/providerContext";
import { useEffect, useState } from "react";
import { walletV6, validateAndParseAddress, WalletAccountV6 } from "starknet";
import { WALLET_API } from "@starknet-io/types-js";
import { myFrontendProviders } from "@/utils/constants";
import {
  providerIndexForChainId,
  type Strk20NetworkIndex,
} from "@/utils/network";
import { createStore, type Store } from "@starknet-io/get-starknet-discovery";
import type {
  WalletWithStarknetFeatures,
} from '@starknet-io/get-starknet-wallet-standard/features';


// Normalize wallet identifiers so starknetkit's connector id / SWO name
// ("argentX", "Ready", "Braavos") can be matched against the wallet-standard
// wallet's display name ("Argent X", "Braavos", ...).
function normalizeId(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export default function SelectWallet({ variant = "ctaBig" }: { variant?: "nav" | "ctaBig" }) {

  const setMyWallet = useStoreWallet(state => state.setMyStarknetWalletObject);

  const setMyWalletAccount = useStoreWallet(state => state.setMyWalletAccount);
  const myFrontendProviderIndex = useFrontendProvider(state => state.currentFrontendProviderIndex);
  const { setCurrentFrontendProviderIndex } = useFrontendProvider(state => state);

  const isConnected = useStoreWallet(state => state.isConnected);
  const setConnected = useStoreWallet(state => state.setConnected);
  const disconnectWallet = useStoreWallet(state => state.disconnectWallet);
  const address = useStoreWallet(state => state.address);

  const setWalletApi = useStoreWallet(state => state.setWalletApiList);

  const setChain = useStoreWallet(state => state.setChain);
  const setAddressAccount = useStoreWallet(state => state.setAddressAccount);

  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string>("");
  const [pickerOpen, setPickerOpen] = useState(false);
  // Detected Starknet wallets, in render state so the picker updates as wallets register.
  const [wallets, setWallets] = useState<WalletWithStarknetFeatures[]>([]);

  // Create the discovery store once on mount so wallets have time to register
  // before the user opens the picker. eip1193Adapters:[] keeps MetaMask out entirely
  // (no EIP-6963 MetaMask bridging / Snap probing).
  useEffect(() => {
    const store: Store = createStore({ eip1193Adapters: [] });
    setWallets(store.getWallets().slice());
    const unsub = store.subscribe((next) => setWallets(next.slice()));
    return () => unsub();
  }, []);

  // Show every detected wallet except MetaMask (its Snap probing spams an unlock popup)
  // and Braavos (excluded from this starter's picker).
  const pickable = wallets.filter((w) => {
    const id = normalizeId(w.name);
    return !id.includes("metamask") && !id.includes("braavos");
  });

  // Unchanged connection flow: takes the wallet-standard wallet and populates
  // the zustand store with a WalletAccountV6 + account/chain/permissions.
  async function handleSelectedWallet(selectedWallet: WalletWithStarknetFeatures) {
    setMyWallet(selectedWallet); // zustand
    console.log("Trying to connect wallet=", selectedWallet);

    const preferredIndex = (myFrontendProviderIndex === 0 || myFrontendProviderIndex === 2
      ? myFrontendProviderIndex
      : 2) as Strk20NetworkIndex;

    // Add timeout to requestAccounts to prevent hanging
    const result = await Promise.race([
      walletV6.requestAccounts(selectedWallet),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Wallet connection timeout")), 15000))
    ]) as any;

    if (typeof result == "string") {
      console.log("This Wallet is not compatible.");
      throw new Error("Wallet is not compatible");
    }
    console.log("Current account addr =", result);
    if (Array.isArray(result)) {
      const addr = validateAndParseAddress(result[0]);
      setAddressAccount(addr); // zustand
    }

    const isConnectedWallet: boolean = await Promise.race([
      walletV6.getPermissions(selectedWallet)
        .then((res: any) =>
          (res as WALLET_API.Permission[]).includes(WALLET_API.Permission.ACCOUNTS)
        ),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Permissions check timeout")), 10000))
    ]);
    setConnected(isConnectedWallet); // zustand

    let providerIndex = preferredIndex;
    if (isConnectedWallet) {
      const chainId = await Promise.race([
        walletV6.requestChainId(selectedWallet) as Promise<string>,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Chain ID request timeout")), 10000))
      ]);
      setChain(chainId);
      const detected = providerIndexForChainId(chainId);
      if (detected !== null) {
        providerIndex = detected;
      }
      setCurrentFrontendProviderIndex(providerIndex);
      console.log("Provider index:", providerIndex, "wallet chainId:", chainId);
    }

    const myWA = await Promise.race([
      WalletAccountV6.connect(
        myFrontendProviders[providerIndex],
        selectedWallet
      ),
      new Promise((_, reject) => setTimeout(() => reject(new Error("WalletAccount connection timeout")), 15000))
    ]);
    setMyWalletAccount(myWA);
    console.log("WalletAccount created=", myWA);

    setWalletApi(await walletV6.supportedSpecs(selectedWallet));
  }

  // Open the wallet picker so the user can choose (Ready, Xverse, ...).
  const openPicker = () => {
    setError("");
    setPickerOpen(true);
  };

  // Connect the wallet the user picked from the modal.
  //
  // We deliberately do NOT use starknetkit's connect() here: it bundles
  // get-starknet-core, whose MetaMask detection (waitForMetaMaskProvider, retries:3)
  // repeatedly dispatches EIP-6963 discovery and probes MetaMask's Starknet Snap,
  // spamming its unlock popup. eip1193Adapters:[] above keeps MetaMask out of discovery
  // entirely, and only the picked wallet ever receives a request().
  async function selectWallet(w: WalletWithStarknetFeatures) {
    setError("");
    setConnecting(true);
    try {
      await handleSelectedWallet(w);
      setPickerOpen(false);
    } catch (err: any) {
      console.log("Wallet connection failed.\n", err);
      // Clean up state on failure
      setMyWallet(undefined);
      setConnected(false);
      setAddressAccount("");
      setChain("");
      setMyWalletAccount(undefined);
      setError(err?.message ?? "Wallet connection failed.");
    } finally {
      setConnecting(false);
    }
  }

  const shortAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  const picker = pickerOpen ? (
    <div className={styles.modalOverlay} onClick={() => !connecting && setPickerOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <span className={styles.modalTitle}>Connect a wallet</span>
          <button
            className={styles.modalClose}
            onClick={() => setPickerOpen(false)}
            aria-label="Close"
            disabled={connecting}
          >
            ×
          </button>
        </div>

        {pickable.length ? (
          <div className={styles.walletList}>
            {pickable.map((w) => (
              <button
                key={w.name}
                className={styles.walletRow}
                onClick={() => selectWallet(w)}
                disabled={connecting}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.walletIcon} src={w.icon} alt="" />
                <span className={styles.walletName}>{w.name}</span>
                <span className={styles.walletGo}>{connecting ? "…" : "→"}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.walletHint}>
            No Starknet wallet detected. Install{" "}
            <a href="https://www.ready.co/" target="_blank" rel="noreferrer">Ready</a> or{" "}
            <a href="https://www.xverse.app/" target="_blank" rel="noreferrer">Xverse</a>.
          </div>
        )}

        {error ? <div className={styles.errorText}>{error}</div> : null}
      </div>
    </div>
  ) : null;

  // Nav variant: a compact Connect pill, or the connected address with disconnect.
  if (variant === "nav") {
    if (isConnected && address) {
      return (
        <button
          className={styles.addrPill}
          onClick={() => disconnectWallet()}
          title="Disconnect"
        >
          <span className={styles.addrDot} />
          {shortAddr}
          <span className={styles.addrDisconnect}>Disconnect</span>
        </button>
      );
    }
    return (
      <>
        <button className={styles.connectPill} onClick={openPicker}>
          Connect
        </button>
        {picker}
      </>
    );
  }

  // Default (ctaBig): the large solid connect CTA shown in the panel until a
  // wallet is connected.
  return (
    <>
      <button className={styles.btnCta} onClick={openPicker}>
        Connect a Wallet
      </button>
      {picker}
    </>
  );
}
