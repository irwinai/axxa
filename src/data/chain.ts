import { arbitrum } from "./chain/arbitrum"
import { avalanche } from "./chain/avalanche"
import { base } from "./chain/base"
import { bsc } from "./chain/bsc"
import { celo } from "./chain/celo"
import { classic } from "./chain/classic"
import { confluxESpace } from "./chain/confluxESpace"
import { coreDao } from "./chain/coreDao"
import { cronos } from "./chain/cronos"
import { eos } from "./chain/eos"
import { fantom } from "./chain/fantom"
import { filecoin } from "./chain/filecoin"
import { gnosis } from "./chain/gnosis"
import { linea } from "./chain/linea"
import { mainnet } from "./chain/mainnet"
import { mantle } from "./chain/mantle"
import { neonMainnet } from "./chain/neonMainnet"
import { optimism } from "./chain/optimism"
import { polygon } from "./chain/polygon"
import { sepolia } from "./chain/sepolia"
import { zkSync } from "./chain/zkSync"

export const mapo = {
    id: 22776,
    name: "MAP Mainnet",
    network: "MAP Mainnet",
    nativeCurrency: {
        decimals: 18,
        name: "MAPO",
        symbol: "MAPO",
    },
    rpcUrls: {
        default: {
            http: ["https://rpc.maplabs.io"],
        },
        public: {
            http: ["https://rpc.maplabs.io"],
        },
    },
    blockExplorers: {
        default: { name: "Explorer", url: "https://mapscan.io" },
    },
}

export const opBNB = {
    id: 204,
    name: 'opBNB',
    network: 'opBNB Mainnet',
    nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
    },
    rpcUrls: {
        public: { http: ['https://opbnb-mainnet-rpc.bnbchain.org'] },
        default: { http: ['https://opbnb-mainnet-rpc.bnbchain.org'] },
    },
    blockExplorers: {
        default: { name: 'opbnbscan', url: 'https://mainnet.opbnbscan.com' },
    },

    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 512881,
        },
    },
}

export const kcc = {
    id: 321,
    name: "KCC Mainnet",
    network: "KCC Mainnet",
    nativeCurrency: {
        decimals: 18,
        name: "KCS",
        symbol: "KCS",
    },
    rpcUrls: {
        default: {
            http: ["https://kcc-rpc.com"],
        },
        public: {
            http: ["https://kcc-rpc.com"],
        },
    },
    blockExplorers: {
        default: { name: "Explorer", url: "https://explorer.kcc.io/en" },
    },
}

export const ethw = {
    id: 10001,
    name: "ETHW-mainnet",
    network: "ETHW-mainnet",
    nativeCurrency: {
        decimals: 18,
        name: "ETHW",
        symbol: "ETHW",
    },
    rpcUrls: {
        default: {
            http: ["https://mainnet.ethereumpow.org"],
        },
        public: {
            http: ["https://mainnet.ethereumpow.org"],
        },
    },
    blockExplorers: {
        default: { name: "Explorer", url: "https://mainnet.ethwscan.com" },
    },
}

export const shibarium = {
    id: 109,
    name: "Shibarium",
    network: "shibarium",
    nativeCurrency: {
        decimals: 18,
        name: "BONE",
        symbol: "BONE",
    },
    rpcUrls: {
        default: {
            http: ["https://rpc.shibrpc.com"],
        },
        public: {
            http: ["https://rpc.shibrpc.com"],
        },
    },
    blockExplorers: {
        default: { name: "Explorer", url: "https://shibariumscan.io" },
    },
}

export const chainList = {
    eth: mainnet,
    bsc,
    opBNB,
    // okc,
    polygon,
    fantom,
    avalanche,
    arbitrum,
    optimism,
    base,
    zkSync,
    classic,
    mantle,
    mapo,
    cronos,
    kcc,
    coreDao,
    ethw,
    eos,
    neonMainnet,
    linea,
    celo,
    confluxESpace,
    gnosis,
    filecoin,
    shibarium,
    sepolia,
}
