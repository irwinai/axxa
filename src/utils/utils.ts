// 将16进制转换为普通字符串
const hexTosString = (hex: string): string => {
    const str = Buffer.from(hex, "hex").toString();
    return str;
}
// 将普通字符串转换为16进制
const stringToHex = (str: string): string => {
    const hex = Buffer.from(str).toString("hex");
    return hex;
}