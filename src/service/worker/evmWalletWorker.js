import { createWallet } from '@/service/wallet';
// 监听主线程发送的消息
self.onmessage = function (event) {
    const { type, provider, num, mnemonicLen } = event.data;
    if (type === 'createWallets') {
        createWalletsAsync(provider, num, mnemonicLen);
    }
};

// 创建钱包的异步函数
const createWalletsAsync = async (provider, num, mnemonicLen) => {
    for (let index = 0; index < num; index++) {
        const wallet = await createWallet(provider, mnemonicLen); // 根据实际情况创建钱包的逻辑
        // 向主线程发送钱包创建完成的消息
        self.postMessage({ type: 'walletCreated', data: wallet });
    }
};

