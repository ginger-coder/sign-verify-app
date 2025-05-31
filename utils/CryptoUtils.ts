import nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';
import * as Crypto from 'expo-crypto';

// 生成 Ed25519 密钥对
// 返回私钥（64 字节）和公钥（32 字节），用于签名和验证
export function generateKeyPair(): { privateKey: Uint8Array; publicKey: Uint8Array } {
    const keyPair = nacl.sign.keyPair(); // 使用 tweetnacl 生成密钥对
    return { privateKey: keyPair.secretKey, publicKey: keyPair.publicKey };
}

// 使用 SHA-256 对消息进行哈希
// 输入 UTF-8 消息，返回十六进制格式的哈希值
export async function hashMessage(message: string): Promise<string> {
    try {
        const hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            message,
            { encoding: Crypto.CryptoEncoding.HEX } // 输出为十六进制
        );
        return hash;
    } catch (error) {
        throw new Error(`哈希计算失败: ${(error as Error).message}`);
    }
}

// 对消息进行签名
// 使用私钥对消息签名，返回签名字节数组
export function signMessage(message: string, privateKey: Uint8Array): Uint8Array {
    try {
        const messageBytes = util.decodeUTF8(message); // 将 UTF-8 消息转换为字节数组
        return nacl.sign.detached(messageBytes, privateKey); // 使用 tweetnacl 签名
    } catch (error) {
        throw new Error(`签名失败: ${(error as Error).message}`);
    }
}

// 验证签名
// 输入消息、签名和公钥，返回验证结果（真/假）
export function verifySignature(message: string, signature: Uint8Array, publicKey: Uint8Array): boolean {
    try {
        const messageBytes = util.decodeUTF8(message); // 将 UTF-8 消息转换为字节数组
        return nacl.sign.detached.verify(messageBytes, signature, publicKey); // 使用 tweetnacl 验证
    } catch (error) {
        throw new Error(`验证失败: ${(error as Error).message}`);
    }
}

// 将 Uint8Array 转换为 base64
// 用于将签名和公钥转换为 base64 格式以显示
export function uint8ToBase64(uint8: Uint8Array): string {
    try {
        return util.encodeBase64(uint8); // 使用 tweetnacl-util 转换为 base64
    } catch (error) {
        throw new Error(`base64 编码失败: ${(error as Error).message}`);
    }
}

// 将 base64 转换为 Uint8Array
// 用于将用户输入的 base64 公钥和签名转换回字节数组
export function base64ToUint8(base64Str: string): Uint8Array {
    try {
        return util.decodeBase64(base64Str); // 使用 tweetnacl-util 解码 base64
    } catch (error) {
        throw new Error(`base64 解码失败: ${(error as Error).message}`);
    }
}