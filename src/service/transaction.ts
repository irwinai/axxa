import { ref, computed } from 'vue'
import { Web3, type TransactionReceipt, type Web3BaseWalletAccount } from 'web3';
import { trimAll, useWeb3 } from './common';
import moment from 'moment';
import { ca, tr } from 'element-plus/es/locales.mjs';
import crypto from 'crypto-js';

export interface Transaction {
    from?: string;
    privateKey: string[];
    rpc?: string;
    to: string;
    memo?: string; //备注内容
    gas?: string; //额外gas
}

export interface TransactionResult {
    status: TransactionResultStatus,
    msg: string;
    successCount: number;
}
export enum TransactionResultStatus {
    SUCCESS,
    FAILED
}

let isStop = false;

export const sendAysncTransaction = async (web3: any, privateKey: string, data: Transaction) => {
    //钱包添加账户,私钥处理，0x开头与否无所谓
    const account = web3.eth.accounts.privateKeyToAccount(Web3.utils.toHex(privateKey));

    let memo = trimAll(data.memo) || '';
    //id占位符处理，eth支持，其他的未知
    if (memo && memo.includes('{{id}}')) {
        const randomNumber = await generateRandomNumber();
        memo = memo.replace('{{id}}', randomNumber);
    }
    console.log('memo', memo);

    if (!memo.startsWith('0x')) {
        memo = Web3.utils.stringToHex(memo);
    }
    //这个指的是gas的个数，通常转账是21000个
    const gasLimit = await web3.eth.estimateGas({
        from: account.address,
        to: data.to || account.address,
        data: memo
    })

    //gasPrice通常都是200gwei，这里的单位是wei
    const gasPrice = await web3.eth.getGasPrice();
    const gasPriceInt = web3.utils.toBigInt(gasPrice.toString());
    const userGasPriceInt = web3.utils.toBigInt(web3.utils.toWei(data.gas || 0, 'gwei').toString());

    const nonce = await web3.eth.getTransactionCount(account.address, 'pending');

    //签名
    const signedTransaction = await account.signTransaction({
        from: account.address,
        to: data.to || account.address,
        gasLimit: gasLimit,
        gasPrice: gasPriceInt + userGasPriceInt,
        // maxFeePerGas: gasPrice, //就是gasprice，最大的gasprice
        // maxPriorityFeePerGas: web3.utils.toWei(data.gas, 'gwei'), //tip
        data: memo,
        nonce: nonce
    });

    //发送交易
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    return receipt.transactionHash;
}

const generateRandomNumber = async () => {
    const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
    const encryptedNumber = crypto.SHA256(randomSixDigitNumber.toString()).toString();
    try {
        const result: any = await fetch('https://api.ethscriptions.com/api/ethscriptions/exists/' + encryptedNumber)
        let data = await result.json();
        if (data.result) {
            generateRandomNumber();
        }
    } catch (e) {
        console.log(e);
        generateRandomNumber();
    }
    return randomSixDigitNumber.toString();
}

/**
 * gas: 总体的gas费用
 * gasPrice：gas 单价，表示每单位 gas 的成本
 * maxFeePerGas：指定最大的每单位 gas 的手续费，
 * maxPriorityFeePerGas：在 EIP-1559 中引入的，用于确定交易的最大优先手续费
 * gasLimit：最大的gas消耗量，上限
 * 传统方式指定gasPrice和gasLimit，EIP-1559方式指定maxFeePerGas和maxPriorityFeePerGas
 * 默认举例：比如transfer的gas=21000，gasPrice=200gwei，那么消耗gas=21000*200gwei=0.0042eth
 * 
 * gas总额计算方式不变：gas总额 = gaslimit * gasprice
 * 但是升级之后：gasprice= basefee+maxPriorityFeePerGas(矿工小费)，maxFeePerGas就是指定最大的gasprice，basefee不管，这个是动态计算的
 */
export const batchInscription = async (data: Transaction, delayTime: number, logCallback: (result: TransactionResult) => void) => {
    isStop = false;

    const timer = setInterval(async () => {
        if (isStop) {
            console.log('退出循环');
            clearInterval(timer);
            return;
        }
        // 初始化web3实例
        const web3 = useWeb3(data.rpc);
        const promises = data.privateKey.map((item: any) => {
            return sendAysncTransaction(web3, item, data);
        });
        const loopResult = await Promise.allSettled(promises);
        loopResult.forEach((item: any, index) => {
            logCallback(handleResult(item));
        });
    }, delayTime);
}

let successCount = 0;
//异常信息的获取，因为异常信息有时候的msg不同，有时候是message，有时候是reason
export const handleResult = (item: any): TransactionResult => {
    let msg: string = '';
    let status: TransactionResultStatus;
    if (item.status === 'fulfilled') {
        msg = item.value.receipt;
        successCount++;
        status = TransactionResultStatus.SUCCESS;
    } else {
        if (item.reason.reason) {
            msg = item.reason.reason;
        } else {
            msg = item.reason.innerError ? (item.reason.innerError.data?.message || item.reason.innerError.message) : item.reason.message;
        }
        status = TransactionResultStatus.FAILED;
    }
    return {
        status: status,
        msg: msg,
        successCount: successCount
    };

}

export const shouldExitLoop = () => {
    isStop = true;
}