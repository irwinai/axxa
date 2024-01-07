import { utils } from "web3";
import { Web3, type TransactionReceipt, type Web3BaseWalletAccount } from 'web3';
import { useWeb3 } from './common';
import { chainList } from "@/data/chain";
import { handleResult, sendAysncTransaction, TransactionResultStatus, type Transaction, type TransactionResult } from "./transaction";

export interface EvmInkTransaction extends Transaction {
    num: number; //转账数量
    tick: string; //铭文内容
}

const url = '/api?type=POST&targetUrl=https://api.evm.ink/v1/graphql/';

let request = {
    page: 1,
    pageSize: 50,
};

const generateInscriptionRequestJson = (request: any, address: string, tick: string) => {
    return {
        "query": "query GetUserInscriptions($limit: Int, $offset: Int, $order_by: [inscriptions_order_by!] = {}, $where: inscriptions_bool_exp = {}, $whereAggregate: inscriptions_bool_exp = {}) {\n  inscriptions_aggregate(where: $whereAggregate) {\n    aggregate {\n      count\n    }\n  }\n  inscriptions(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {\n    block_number\n    confirmed\n    content_uri\n    created_at\n    creator_address\n    owner_address\n    trx_hash\n    id\n    position\n    category\n    mtype\n    internal_trx_index\n    network_id\n    brc20_command {\n      reason\n      is_valid\n    }\n  }\n}",
        "variables": {
            "limit": request.pageSize,
            "offset": (request.page - 1) * request.pageSize,
            "order_by": [
                {
                    "position": "desc"
                }
            ],
            "whereAggregate": {
                "owner_address": {
                    "_eq": address.toLowerCase()
                },
                "network_id": {
                    "_eq": "eip155:56"
                },
                "brc20_command": {
                    "is_valid": {
                        "_eq": true
                    }
                },
                "content_uri": {
                    "_eq": tick
                }
            },
            "where": {
                "owner_address": {
                    "_eq": address.toLowerCase()
                },
                "network_id": {
                    "_eq": "eip155:56"
                },
                "brc20_command": {
                    "is_valid": {
                        "_eq": true
                    }
                },
                "content_uri": {
                    "_eq": tick
                }
            }
        },
        "operationName": "GetUserInscriptions"
    }
}

//evm的批量转账
export const evmBatchTransfer = async (data: EvmInkTransaction, logCallback: (result: TransactionResult) => void) => {
    // 初始化web3实例
    const web3 = useWeb3(data.rpc);

    //转账多少张，单位：张，决定了循环的次数
    let repeatTime = Math.ceil(data.num / request.pageSize);

    const account = web3.eth.accounts.privateKeyToAccount(Web3.utils.toHex(data.privateKey[0]));
    //查到所有的铭文的数据GetUserInscriptions，每次50条，然后开始循环转账
    for (let index = 0; index < repeatTime; index++) {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(generateInscriptionRequestJson(request, account.address, data.tick))
        });
        const resData = await res.json();

        if (resData.errors) {
            logCallback({ status: TransactionResultStatus.FAILED, msg: resData.errors[0].message } as TransactionResult);
            return;
        }

        if (resData.data.inscriptions.length === 0) {
            logCallback({ status: TransactionResultStatus.FAILED, msg: "没有数据了" } as TransactionResult);
            return;
        }

        //遍历结果拿到trx_hash
        let trxHashs = resData.data.inscriptions.map((item: any) => {
            return item.trx_hash;
        });
        console.log("trxHashs before: ", trxHashs);

        //最后一次循环要计算张数,只取数组前N的元素
        if (index === repeatTime - 1) {
            trxHashs = trxHashs.slice(0, data.num % request.pageSize);
        }
        console.log("trxHashs after: ", trxHashs);
        //异步循环转账
        const promises = trxHashs.map((item: any) => {
            return sendAysncTransaction(web3, data.privateKey[0], {
                privateKey: data.privateKey,
                to: data.to,
                memo: item
            });
        });
        const loopResult: any = await Promise.allSettled(promises);
        loopResult.forEach((item: any) => {
            logCallback(handleResult(item));
        });

        request.page++;
    }

}