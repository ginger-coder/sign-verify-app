import * as Crypto from 'expo-crypto';
import {
  generateKeyPair,
  hashMessage,
  signMessage,
  verifySignature,
  uint8ToBase64,
  base64ToUint8,
} from '../utils/CryptoUtils';
// 或者在 jest.setup.js 中
jest.mock('expo-crypto', () => ({
  // 模拟 CryptoDigestAlgorithm 枚举，确保 SHA256 存在
  CryptoDigestAlgorithm: {
    SHA256: 'SHA-256', // 这个值在模拟中通常不重要，只要它存在即可
  },
  // 模拟 CryptoEncoding 枚举，确保 HEX 存在
  CryptoEncoding: {
    HEX: 'hex', // 同上，这个值在模拟中通常不重要
  },
  // 模拟 digestStringAsync 函数
  // 我们用 jest.fn() 创建一个可追踪的模拟函数
  digestStringAsync: jest.fn(),
}));

// 获取对模拟的 digestStringAsync 函数的引用
// 这样做可以让我们更方便地在测试中控制它的行为
const mockDigestStringAsync = Crypto.digestStringAsync as jest.Mock;

describe('CryptoUtils 测试', () => {
  beforeEach(() => {
    // 在每个测试用例开始前，清除上一个测试用例中对模拟函数的所有调用记录和自定义实现
    mockDigestStringAsync.mockClear();
    // 如果你的函数中有 console.log 并且不希望在测试输出中看到它们，或者想验证它们，可以模拟 console.log
    // jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  // 测试密钥生成
  test('生成密钥对', () => {
    const keyPair = generateKeyPair();
    expect(keyPair.privateKey).toBeDefined();
    expect(keyPair.publicKey).toBeDefined();
    expect(keyPair.privateKey.length).toBe(64);
    expect(keyPair.publicKey.length).toBe(32);
  });

  test('对消息进行哈希 (使用模拟)', async () => {
    const message = 'Hello World';
    const differentMessage = 'Different message';

    // 定义模拟的哈希值
    const mockHashForMessage = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'; // 64位模拟哈希
    const mockHashForDifferentMessage = 'f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5'; // 另一个64位模拟哈希

    // 1. 测试第一个消息的哈希
    //    安排 mockDigestStringAsync 第一次被调用时返回 mockHashForMessage
    (mockDigestStringAsync as jest.Mock).mockResolvedValueOnce(mockHashForMessage);
    const hash = await hashMessage(message);
    // 验证哈希值不为空
    expect(hash).toBeDefined();
    // 验证哈希值是字符串类型
    expect(typeof hash).toBe('string');
    // 验证哈希值长度是64个字符（因为我们模拟返回的是64位）
    expect(hash.length).toBe(64);
    // 验证模拟函数被正确调用
    expect(mockDigestStringAsync).toHaveBeenCalledWith(
      Crypto.CryptoDigestAlgorithm.SHA256,
      message,
      { encoding: Crypto.CryptoEncoding.HEX }
    );

    // 2. 验证相同消息产生相同哈希
    //    安排 mockDigestStringAsync 第二次被调用时也返回 mockHashForMessage
    (mockDigestStringAsync as jest.Mock).mockResolvedValueOnce(mockHashForMessage);
    const hash2 = await hashMessage(message);
    expect(hash).toBe(hash2);
    // 验证模拟函数被再次以相同的参数调用
    expect(mockDigestStringAsync).toHaveBeenCalledWith(
      Crypto.CryptoDigestAlgorithm.SHA256,
      message,
      { encoding: Crypto.CryptoEncoding.HEX }
    );

    // 3. 验证不同消息产生不同哈希
    //    安排 mockDigestStringAsync 第三次被调用时返回 mockHashForDifferentMessage
    (mockDigestStringAsync as jest.Mock).mockResolvedValueOnce(mockHashForDifferentMessage);
    const differentHash = await hashMessage(differentMessage);
    expect(hash).not.toBe(differentHash);
    // 验证模拟函数被以不同的消息参数调用
    expect(mockDigestStringAsync).toHaveBeenCalledWith(
      Crypto.CryptoDigestAlgorithm.SHA256,
      differentMessage,
      { encoding: Crypto.CryptoEncoding.HEX }
    );

    // 验证总的调用次数
    expect(mockDigestStringAsync).toHaveBeenCalledTimes(3);
  });

  // 测试签名和验证
  test('签名和验证消息', () => {
    const message = 'This is a test message';
    const keyPair = generateKeyPair();

    // 测试签名
    const signature = signMessage(message, keyPair.privateKey);
    expect(signature).toBeDefined();
    expect(signature.length).toBe(64); // Ed25519 签名长度为 64 字节

    // 测试有效签名的验证
    const isValid = verifySignature(message, signature, keyPair.publicKey);
    expect(isValid).toBe(true);

    // 测试篡改消息后的验证
    const tamperedMessage = message + ' tampered';
    const invalidForTamperedMessage = verifySignature(
      tamperedMessage,
      signature,
      keyPair.publicKey
    );
    expect(invalidForTamperedMessage).toBe(false);

    // 测试使用错误公钥的验证
    const anotherKeyPair = generateKeyPair();
    const invalidForWrongKey = verifySignature(
      message,
      signature,
      anotherKeyPair.publicKey
    );
    expect(invalidForWrongKey).toBe(false);
  });

  // 测试 Uint8Array 和 base64 之间的转换
  test('Uint8Array 和 base64 转换', () => {
    const keyPair = generateKeyPair();

    // Uint8Array 转 base64
    const publicKeyBase64 = uint8ToBase64(keyPair.publicKey);
    expect(publicKeyBase64).toBeDefined();
    expect(typeof publicKeyBase64).toBe('string');

    // base64 转回 Uint8Array
    const publicKeyUint8 = base64ToUint8(publicKeyBase64);
    expect(publicKeyUint8).toBeDefined();
    expect(publicKeyUint8 instanceof Uint8Array).toBe(true);
    expect(publicKeyUint8.length).toBe(keyPair.publicKey.length);

    // 验证转换后的数据一致性
    for (let i = 0; i < keyPair.publicKey.length; i++) {
      expect(publicKeyUint8[i]).toBe(keyPair.publicKey[i]);
    }
  });

  // 测试错误处理
  test('错误处理', () => {
    // 测试 base64 解码错误
    expect(() => {
      base64ToUint8('这不是有效的base64!!!');
    }).toThrow();

    // 测试签名错误处理
    expect(() => {
      // 故意使用错误的私钥长度
      const invalidPrivateKey = new Uint8Array(10);
      signMessage('test message', invalidPrivateKey);
    }).toThrow();

    // 测试验证错误处理
    expect(() => {
      // 故意使用错误的签名长度
      const keyPair = generateKeyPair();
      const invalidSignature = new Uint8Array(10); // 非有效签名长度
      verifySignature('test message', invalidSignature, keyPair.publicKey);
    }).toThrow();
  });

  test('端到端签名和验证流程', async () => {
    // 为 hashMessage 中的 Crypto.digestStringAsync 设置模拟返回值
    const MOCKED_HASH_FOR_SIGN_SCREEN = 'mockedhashforsignscreen1234567890abcdef1234567890abcdef1234567'; // 64 chars
    (mockDigestStringAsync as jest.Mock).mockResolvedValue(MOCKED_HASH_FOR_SIGN_SCREEN);

    // 步骤1: 创建消息和密钥对 (SignScreen)
    const message = 'Hello from SignScreen!';
    // generateKeyPair() 应该使用其实际实现，我们假设它不依赖于需要特殊mock的expo-crypto部分，
    // 或者 expo-crypto.getRandomBytesAsync 已经被合理地模拟了（如果它用到了的话）。
    const keyPair = generateKeyPair();

    // 步骤2: 计算哈希 (SignScreen)
    const hash = await hashMessage(message);
    expect(hash).toBeDefined();
    // 因为 hashMessage 内部的 digestStringAsync 被模拟了，所以 hash 的值是 MOCKED_HASH_FOR_SIGN_SCREEN
    expect(hash).toBe(MOCKED_HASH_FOR_SIGN_SCREEN);
    // 验证 mockDigestStringAsync 被正确调用
    expect(mockDigestStringAsync).toHaveBeenCalledWith(
      Crypto.CryptoDigestAlgorithm.SHA256,
      message,
      { encoding: Crypto.CryptoEncoding.HEX }
    );

    // 步骤3: 签名消息 (SignScreen)
    // signMessage 使用实际的加密逻辑。
    // 注意：如果 signMessage 内部也需要哈希，并且它 *不* 调用我们这个外部的 hashMessage，
    // 而是用自己的哈希逻辑，那么它是独立于上面的 mock 的。
    // 如果它也调用了我们这个 hashMessage 函数，那么它也会得到模拟的哈希。
    // 用户的代码是 signMessage(message, ...)，意味着它要么对原始消息签名，要么内部对原始消息哈希。
    const signature = signMessage(message, keyPair.privateKey);
    expect(signature).toBeInstanceOf(Uint8Array); // 基本检查

    // 步骤4: 转换为 base64 用于显示/传输 (SignScreen)
    const signatureBase64 = uint8ToBase64(signature);
    const publicKeyBase64 = uint8ToBase64(keyPair.publicKey);
    expect(typeof signatureBase64).toBe('string');
    expect(typeof publicKeyBase64).toBe('string');

    // 步骤5: 在 VerifyScreen 中接收 base64 数据并转回 Uint8Array
    const receivedSignature = base64ToUint8(signatureBase64);
    const receivedPublicKey = base64ToUint8(publicKeyBase64);
    expect(receivedSignature).toEqual(signature); // 检查转换是否可逆
    expect(receivedPublicKey).toEqual(keyPair.publicKey); // 检查转换是否可逆

    // 步骤6: 验证签名 (VerifyScreen)
    // verifySignature 使用实际的加密逻辑。
    // 它需要与 signMessage 使用的算法和密钥对兼容。
    const isValid = verifySignature(message, receivedSignature, receivedPublicKey);
    expect(isValid).toBe(true); // 这是E2E测试的核心断言

    // 步骤7: 测试篡改消息的情况 (VerifyScreen 中输入错误信息)
    const tamperedMessage = 'Hello from SignScreen! (tampered)';
    // 验证篡改后的消息无法通过签名验证
    const isInvalid = verifySignature(tamperedMessage, receivedSignature, receivedPublicKey);
    expect(isInvalid).toBe(false);
  });

});
