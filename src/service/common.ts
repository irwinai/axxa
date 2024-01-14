import { Web3, utils } from 'web3';
import EvmTokens from '@/data/evm-tokens';


export const useWeb3 = (provider: any = null) => {
    if (provider == null) {
        // @ts-ignore
        provider = window.ethereum
    } else {
        // 创建自定义的HttpProvider选项
        const httpOptions: any = {
            providerOptions: {
                headers: {
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'cross-site',
                },
            } as RequestInit,
        };
        provider = new Web3.providers.HttpProvider(provider, httpOptions);
    }
    const web3 = new Web3(provider);

    // const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

    // Log the current block number to the console
    web3.eth
        .getBlockNumber()
        .then(result => {
            console.log('Current block number: ' + result);
        })
        .catch(error => {
            console.error(error);
        });
    return web3;
}

//处理EVM铭文数据，解析成json格式数据
export const getEvmTokenJson = (tick: string, protocol: string) => {
    return EvmTokens.data.filter((item: any) => {
        return item.tick === tick && item.protocol === protocol
    }).map((item: any) => {
        return {
            p: item.protocol,
            op: 'mint',
            tick: item.tick,
            amt: (item.mint_limit / item.decimal_digits).toString(),
        };
    })[0];
};

//处理EVM铭文数据，解析成json字符串
export const getEvmTokenJsonStr = (tick: string, protocol: string) => {
    return JSON.stringify(getEvmTokenJson(tick, protocol));
};

//解析成mint格式数据
export const getEvmTokenMint = (tick: string, protocol: string) => {
    return "data:," + getEvmTokenJsonStr(tick, protocol);
};

//解析成mint格式hex数据，他们的数据格式不同，是\\x开头，不是0x开头
export const getEvmTokenMintHex = (tick: string, protocol: string) => {
    return "\\x" + utils.stringToHex(getEvmTokenMint(tick, protocol)).slice(2);
};

//解析成mint格式hex数据 比如返回的\\xdata:,{} 转成json的格式
export const getEvmTokenJsonFromHex = (tickHex: string) => {
    return utils.hexToString(tickHex.slice(2)).slice(6); //截断前面的data:,
};

export const trimAll = (str: string | undefined) => {
    if (str) {
        return str.replace(/\s+/g, '');
    }
    return str;
}

export const isPrivateKey = (privateKey: string) => {
    const key: any = trimAll(privateKey);
    return /^[a-fA-F0-9]{64}$/.test(key) || /^0x[a-fA-F0-9]{64}$/.test(key);
}
