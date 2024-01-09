import { useAccountStore } from "@/stores/store";
import Web3 from "web3";
import { useWeb3 } from "./common";
import * as bip39 from 'bip39';

export const connectWallet = async () => {
    // 使用MetaMask提供的web3实例
    const windowConst = window as any;
    if (windowConst.ethereum) {
        const web3: any = useWeb3();
        // 请求用户授权
        windowConst.ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts: any) {
            // 授权成功，accounts 是用户的以太坊地址数组
            // 可以在这里执行后续操作
            const store: any = useAccountStore();
            store.account = accounts[0];

        }).catch(function (error: any) {
            // 用户拒绝了授权请求或发生了错误
            console.error(error);
        });


    }
};
// 监听用户切换钱包
export const accountsChangeListener = () => {
    const windowConst = window as any;
    if (windowConst.ethereum) {
        windowConst.ethereum.on('accountsChanged', function (newAccounts: any) {
            // 用户切换了钱包，newAccounts 是用户的新以太坊地址数组
            // 可以在这里执行钱包切换后的操作
            const store: any = useAccountStore();
            store.account = newAccounts[0];
        });
    }
}


export const disconnectWallet = async () => {
    const store: any = useAccountStore();
    store.$reset();
};

export const createWallet = async (provider: string, mnemonicLen: number) => {
    const web3: any = useWeb3(provider);

    // 生成一个随机的助记词
    const mnemonic = bip39.generateMnemonic((mnemonicLen / 3) * 32);

    // 从助记词中获取种子
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // 使用种子创建以太坊钱包
    const wallets = web3.eth.accounts.wallet.create(1, seed);

    const wallet = wallets[0];

    return { "address": wallet.address, "privateKey": wallet.privateKey, mnemonic };

};
