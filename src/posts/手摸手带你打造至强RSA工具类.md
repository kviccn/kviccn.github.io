---
title: 手摸手带你打造至强 RSA 工具类
date: 2022-02-12T14:18:40+08:00
tag:
  - rsa
  - base64
  - Java
  - C#
  - 加密
  - 解密
---

[太长不看，我要代码！](#完整代码)

本文不对`RSA`原理进行详细讲解，只关注于在`Java`中如何使用。

网上有很多`RSA`工具类的 demo，但是没有一个好用的。今天老李抽丝剥茧，手摸手带你打造一款属于自己的至强`RSA`工具类。

`RSA`是非对称加密算法，包含由`公钥`和`私钥`组成的密钥对，支持`公钥加密，私钥解密`和`私钥加密，公钥解密`。

## 实战

### 生成密钥对

使用`Java`提供的`KeyPairGenerator`类，我们只需提供加密算法的名称并设置密钥长度就可以生成密钥对。

```java
// 获取 RSA 算法的密钥对生成器
var keyPairGenerator = KeyPairGenerator.getInstance("RSA");
// 设置密钥长度
keyPairGenerator.initialize(1024);

var keyPair = keyPairGenerator.generateKeyPair();
```

让我们对这段代码进行封装

```java
public final class RSAUtil {
    // 加密算法
    public static final String KEY_ALGORITHM = "RSA";

    // 密钥长度
    public static final int KEY_SIZE = 1024;

    public static KeyPair generateKeyPair() throws NoSuchAlgorithmException {
        var keyPairGenerator = KeyPairGenerator.getInstance(KEY_ALGORITHM);
        keyPairGenerator.initialize(KEY_SIZE);
        return keyPairGenerator.genKeyPair();
    }
}
```

有了密钥对我们就可以通过公钥或私钥对报文进行加解密了，接下来完成加密方法和解密方法

### 实现加解密方法

```java
// 加密
public static byte[] encrypt(byte[] data, Key key) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    var cipher = Cipher.getInstance(key.getAlgorithm());
    cipher.init(Cipher.ENCRYPT_MODE, key);
    return cipher.doFinal(data);
}

// 解密
public static byte[] decrypt(byte[] data, Key key) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    var cipher = Cipher.getInstance(key.getAlgorithm());
    cipher.init(Cipher.DECRYPT_MODE, key);
    return cipher.doFinal(data);
}
```

加密和解密方法都是通过`Java`提供的`Cipher`类实现的，我们要做的只是根据加密算法获取对应的`Cipher`实例并初始化，在`Cipher::init`方法中告知`Cipher`我们要进行加密操作还是解密操作，通过`Cipher`类提供的两个常量`Cipher.ENCRYPT_MODE`和`Cipher.DECRYPT_MODE`设置。初始化完成后通过`Cipher::doFinal`方法进行加解密。

这两个方法除了设置加解密模式的参数（`Cipher.ENCRYPT_MODE | Cipher.DECRYPT_MODE`）外其他逻辑都是相同的，因此我们对其进行重构，如下：

```java
public static byte[] doCipher(int opmode, Key key, byte[] data) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    var cipher = Cipher.getInstance(key.getAlgorithm());
    cipher.init(opmode, key);
    return cipher.doFinal(data);
}
```

下面给出此时工具类的完整代码：

```java
public final class RSAUtil {
    // 加密算法
    public static final String KEY_ALGORITHM = "RSA";

    // 密钥长度
    public static final int KEY_SIZE = 1024;

    public static KeyPair generateKeyPair() throws NoSuchAlgorithmException {
        var keyPairGenerator = KeyPairGenerator.getInstance(KEY_ALGORITHM);
        keyPairGenerator.initialize(KEY_SIZE);
        return keyPairGenerator.genKeyPair();
    }

    public static byte[] doCipher(int opmode, Key key, byte[] data) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
        var cipher = Cipher.getInstance(key.getAlgorithm());
        cipher.init(opmode, key);
        return cipher.doFinal(data);
    }
}
```

下面我们对生成密钥对的方法和加解密方法进行测试，代码如下：

```java
public class App {

    public static void main(String[] args) throws NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException {
        var keyPair = RSAUtil.generateKeyPair();

        testEncryptByPublicKeyDecryptByPrivateKey(keyPair);
        testEncryptByPrivateKeyDecryptByPublicKey(keyPair);
    }

    // 公钥加密私钥解密
    public static void testEncryptByPublicKeyDecryptByPrivateKey(KeyPair keyPair) throws NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {
        var message = "冰墩墩";

        var encryptedMessage = RSAUtil.doCipher(Cipher.ENCRYPT_MODE, keyPair.getPublic(), message.getBytes(StandardCharsets.UTF_8));
        var decryptedMessage = RSAUtil.doCipher(Cipher.DECRYPT_MODE, keyPair.getPrivate(), encryptedMessage);

        System.out.println("解密后报文：" + new String(decryptedMessage));
    }

    // 私钥加密公钥解密
    public static void testEncryptByPrivateKeyDecryptByPublicKey(KeyPair keyPair) throws NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {
        var message = "雪容融";

        var encryptedMessage = RSAUtil.doCipher(Cipher.ENCRYPT_MODE, keyPair.getPrivate(), message.getBytes(StandardCharsets.UTF_8));
        var decryptedMessage = RSAUtil.doCipher(Cipher.DECRYPT_MODE, keyPair.getPublic(), encryptedMessage);

        System.out.println("解密后报文：" + new String(decryptedMessage));
    }
}
```

运行程序，控制台输出如下：

```bash
解密后报文：冰墩墩
解密后报文：雪容融
```

理论上到这里就完了，完美实现`RSA`加解密。但理论和实践之间还有一道鸿沟需要填补，接下来我们就一步步优化，实现我们的至强`RSA`工具类。

## 优化

`KeyPairGenerator`生成的密钥对内部使用字节数组保存公钥和私钥，我们需要将公钥和私钥通过`base64`编码为人类可读的形式以便阅读和存储。下面我们自定义一个类用于保存编码后的公钥和私钥。

### RSAKeyPair

```java
public final class RSAKeyPair {

    private static final Base64.Encoder Base64Encoder = Base64.getEncoder();

    // 保存原始的 keyPair
    private KeyPair keyPair;

    // 编码后的公钥
    private String publicKey;

    // 编码后的私钥
    private String privateKey;

    // 禁止外部实例化
    private RSAKeyPair() {
    }

    // 通过 of 静态方法获取 RSAKeyPair 实例
    public static RSAKeyPair of(KeyPair keyPair) {
        var rsaKeyPair = new RSAKeyPair();

        rsaKeyPair.keyPair = keyPair;
        rsaKeyPair.publicKey = Base64Encoder.encodeToString(keyPair.getPublic().getEncoded());
        rsaKeyPair.privateKey = Base64Encoder.encodeToString(keyPair.getPrivate().getEncoded());
        return rsaKeyPair;
    }

    public KeyPair getKeyPair() {
        return keyPair;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public String getPrivateKey() {
        return privateKey;
    }

    @Override
    public String toString() {
        return String.format("%s%n  publicKey: %s%n  privateKey: %s%n", RSAKeyPair.class.getSimpleName(), publicKey, privateKey);
    }
}
```

测试一下`RSAKeyPair`类，一睹密钥对真容：

```java
public class App {

    public static void main(String[] args) throws NoSuchAlgorithmException {
        var keyPair = RSAUtil.generateKeyPair();
        var rsaKeyPair = RSAKeyPair.of(keyPair);

        System.out.println(rsaKeyPair);
    }
}
```

输出如下：

```bash
RSAKeyPair
  publicKey: MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCv2jH23VSbsGFKfReQxSxlhPCvPXuLBbDAvYEqKiR+MnxJbcqXwsDIR0tO+Md5/L3zRyodBkr2jULgY21ltIrc30cERjB2KF9vN5h09TJRDobOyjYseXTp2chknRHrpywt+ghSZRs39qJs40VyENTgQ9NBiQXj2ZXucfJ+GFhFrwIDAQAB
  privateKey: MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAK/aMfbdVJuwYUp9F5DFLGWE8K89e4sFsMC9gSoqJH4yfEltypfCwMhHS074x3n8vfNHKh0GSvaNQuBjbWW0itzfRwRGMHYoX283mHT1MlEOhs7KNix5dOnZyGSdEeunLC36CFJlGzf2omzjRXIQ1OBD00GJBePZle5x8n4YWEWvAgMBAAECgYAhOgocyf81l6Mabv5n5UmZOQA9LFHOl9mo4WWpcOMKUUG4oh0YhbzlWss49brDKuU9NWIYr9q0MUbEnSTLhcyC1RZN+GLtIeuQ9ysMbs76oRY0KH8ZQiuGxZV4FX0ZCfrHsdGodDjXxmBOhMOZsvPoncPA0JY/Cy12Sdc1rzzkiQJBANvK11X5BR0HChj+RUeQMHXIqlkkDxOzX7fsR32nf3KEUZBtP27IA9P5f/2yd8zutnCdE67truqwIRFZiB4rDs0CQQDM0kzYDSdOGzQrkHUPvcI9za8LBWKQwue9Vxt4PvoLhOio1rYkAd/IcGKxZEmJZA2iFXDjmmU9CHZLVbhB8W5rAkB5YmLeZjK+vz6CYxsb1LQOuI3rwRBajvvT9bfd2311X0I0g0E/C1Oh4+8dy0yCb2tucjGGsFmj3zXEATA9iQYZAkBRhEVHG30QLe2GhRjB6hD7jffjmAIRgTC//4IUSmQz33LFd6bID+LjoC73UOWfg62VW5kxTIqMTujdtMD/pbn/AkEA10G91iABHviv6zN1OUWdo44LdEVPOrQqBgakQ+UqBCgiHRlOw0tP053ibksA15NbQpQl2k5ORA0xkJZy4rTAXQ==
```

现在我们已经有了编码后的可读形式的密钥了，但在程序中我们还是需要原始格式的密钥才能进行操作，所以接下来我们完成密钥的加载方法，即将上述文本格式的密钥还原成程序中使用的格式。

### 加载密钥

`Java`中使用`X509EncodedKeySpec`类加载公钥，使用`PCKS8EncodedKeySpec`类加载私钥。对应的加载方法如下：

```java{2,8}
public static PublicKey loadPublicKey(byte[] keyData) throws NoSuchAlgorithmException, InvalidKeySpecException {
    var keySpec = new X509EncodedKeySpec(keyData, KEY_ALGORITHM);
    var keyFactory = KeyFactory.getInstance(keySpec.getAlgorithm());
    return keyFactory.generatePublic(keySpec);
}

public static PrivateKey loadPrivateKey(byte[] keyData) throws NoSuchAlgorithmException, InvalidKeySpecException {
    var keySpec = new PKCS8EncodedKeySpec(keyData, KEY_ALGORITHM);
    var keyFactory = KeyFactory.getInstance(keySpec.getAlgorithm());
    return keyFactory.generatePrivate(keySpec);
}
```

我们在来重载两个方法，用于直接从`base64`编码后的密钥加载：

```java
public static PublicKey loadPublicKey(String keyText) throws NoSuchAlgorithmException, InvalidKeySpecException {
    return loadPublicKey(Base64Decoder.decode(keyText));
}

public static PrivateKey loadPrivateKey(String keyText) throws NoSuchAlgorithmException, InvalidKeySpecException {
    return loadPrivateKey(Base64Decoder.decode(keyText));
}
```

此时完整的工具类如下：

```java
public final class RSAUtil {

    private static final Base64.Decoder Base64Decoder = Base64.getDecoder();

    // 加密算法
    public static final String KEY_ALGORITHM = "RSA";

    // 密钥长度
    public static final int KEY_SIZE = 1024;

    public static KeyPair generateKeyPair() throws NoSuchAlgorithmException {
        var keyPairGenerator = KeyPairGenerator.getInstance(KEY_ALGORITHM);
        keyPairGenerator.initialize(KEY_SIZE);
        return keyPairGenerator.genKeyPair();
    }

    public static byte[] doCipher(int opmode, Key key, byte[] data) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
        var cipher = Cipher.getInstance(key.getAlgorithm());
        cipher.init(opmode, key);
        return cipher.doFinal(data);
    }

    public static final class KeyLoader {

        public static PublicKey loadPublicKey(byte[] keyData) throws NoSuchAlgorithmException, InvalidKeySpecException {
            var keySpec = new X509EncodedKeySpec(keyData, KEY_ALGORITHM);
            var keyFactory = KeyFactory.getInstance(keySpec.getAlgorithm());
            return keyFactory.generatePublic(keySpec);
        }

        public static PrivateKey loadPrivateKey(byte[] keyData) throws NoSuchAlgorithmException, InvalidKeySpecException {
            var keySpec = new PKCS8EncodedKeySpec(keyData, KEY_ALGORITHM);
            var keyFactory = KeyFactory.getInstance(keySpec.getAlgorithm());
            return keyFactory.generatePrivate(keySpec);
        }

        public static PublicKey loadPublicKey(String keyText) throws NoSuchAlgorithmException, InvalidKeySpecException {
            return loadPublicKey(Base64Decoder.decode(keyText));
        }

        public static PrivateKey loadPrivateKey(String keyText) throws NoSuchAlgorithmException, InvalidKeySpecException {
            return loadPrivateKey(Base64Decoder.decode(keyText));
        }
    }
}
```

测试：

```java{7,8}
public class App {

    public static void main(String[] args) throws NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeySpecException, InvalidKeyException {
        var keyPair = RSAUtil.generateKeyPair();
        var rsaKeyPair = RSAKeyPair.of(keyPair);

        var publicKey = RSAUtil.KeyLoader.loadPublicKey(rsaKeyPair.getPublicKey());
        var privateKey = RSAUtil.KeyLoader.loadPrivateKey(rsaKeyPair.getPrivateKey());

        testEncryptByPublicKeyDecryptByPrivateKey(publicKey, privateKey);
        testEncryptByPrivateKeyDecryptByPublicKey(publicKey, privateKey);
    }

    // 公钥加密私钥解密
    public static void testEncryptByPublicKeyDecryptByPrivateKey(PublicKey publicKey, PrivateKey privateKey) throws NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException {
        var message = "冰墩墩";

        var encryptedMessage = RSAUtil.doCipher(Cipher.ENCRYPT_MODE, publicKey, message.getBytes(StandardCharsets.UTF_8));
        var decryptedMessage = RSAUtil.doCipher(Cipher.DECRYPT_MODE, privateKey, encryptedMessage);

        System.out.println("解密后报文：" + new String(decryptedMessage));
    }

    // 私钥加密公钥解密
    public static void testEncryptByPrivateKeyDecryptByPublicKey(PublicKey publicKey, PrivateKey privateKey) throws NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException {
        var message = "雪容融";

        var encryptedMessage = RSAUtil.doCipher(Cipher.ENCRYPT_MODE, privateKey, message.getBytes(StandardCharsets.UTF_8));
        var decryptedMessage = RSAUtil.doCipher(Cipher.DECRYPT_MODE, publicKey, encryptedMessage);

        System.out.println("解密后报文：" + new String(decryptedMessage));
    }
}
```

输出如下：

```bash
解密后报文：冰墩墩
解密后报文：雪容融
```

现在，我们实现了生成密钥对，加载密钥，加解密报文的方法。此时你可能迫不及待的想找一段报文加密一下，以此检验刚才的劳动成果。

于是你不知道从哪里复制了这么一段话：

```txt
冰墩墩（英文：Bing Dwen Dwen，汉语拼音：bīng dūn dūn），是2022年北京冬季奥运会的吉祥物。将熊猫形象与富有超能量的冰晶外壳相结合，头部外壳造型取自冰雪运动头盔，装饰彩色光环，整体形象酷似航天员。
```

并把它粘贴到了你的代码中：

```java
public class App {

    public static void main(String[] args) throws NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeySpecException, InvalidKeyException {
        var keyPair = RSAUtil.generateKeyPair();
        var rsaKeyPair = RSAKeyPair.of(keyPair);

        var publicKey = RSAUtil.KeyLoader.loadPublicKey(rsaKeyPair.getPublicKey());
        var privateKey = RSAUtil.KeyLoader.loadPrivateKey(rsaKeyPair.getPrivateKey());

        testEncryptByPublicKeyDecryptByPrivateKey(publicKey, privateKey);
    }

    // 公钥加密私钥解密
    public static void testEncryptByPublicKeyDecryptByPrivateKey(PublicKey publicKey, PrivateKey privateKey) throws NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException {
        var message = "冰墩墩（英文：Bing Dwen Dwen，汉语拼音：bīng dūn dūn），是2022年北京冬季奥运会的吉祥物。将熊猫形象与富有超能量的冰晶外壳相结合，头部外壳造型取自冰雪运动头盔，装饰彩色光环，整体形象酷似航天员。";

        var encryptedMessage = RSAUtil.doCipher(Cipher.ENCRYPT_MODE, publicKey, message.getBytes(StandardCharsets.UTF_8));
        var decryptedMessage = RSAUtil.doCipher(Cipher.DECRYPT_MODE, privateKey, encryptedMessage);

        System.out.println("解密后报文：" + new String(decryptedMessage));
    }
}
```

当你满怀期待的运行你的程序时，`jvm`却毫不留情的给你抛了个异常：

```bash{1}
Exception in thread "main" javax.crypto.IllegalBlockSizeException: Data must not be longer than 117 bytes
	at java.base/com.sun.crypto.provider.RSACipher.doFinal(RSACipher.java:348)
	at java.base/com.sun.crypto.provider.RSACipher.engineDoFinal(RSACipher.java:405)
	at java.base/javax.crypto.Cipher.doFinal(Cipher.java:2202)
	at ink.laoli.RSAUtil.doCipher(RSAUtil.java:32)
	at ink.laoli.App.testEncryptByPublicKeyDecryptByPrivateKey(App.java:32)
	at ink.laoli.App.main(App.java:25)
```

不过还好，`jvm`还是给了你一点点提示，`Data must not be longer than 117 bytes`。这就引出了另一个知识点，让我们接着往下看。

### RSA 算法可以加解密的数据的最大长度

还记得最开始我们将密钥的长度设置为`1024`吗？

对`RSA`来说，密钥的长度决定了算法可以加解密的数据的长度。例如密钥长度为`1024`，那最多可以加密的明文长度就是`1024/8 = 128`字节，这`128`字节是包含`padding`在内的。这是因为当明文长度小于可加密的最大长度时需要用`padding`进行补齐。

只要用到了`padding`，就会占用实际的明文的空间。我们一般使用的`padding`标准有`NoPPadding、OAEPPadding、PKCS1Padding`等，其中`PKCS#1`建议的`padding`就占用了`11`个字节。所以当密钥长度为`1024`时，加密的明文的最大长度就是`1024/8 - 11 = 117`字节。是不是和`jvm`给你的温馨提示对上了？

现在我们知道了单次最多只能对`KEY_SIZE / 8 - 11`字节的明文加密，下面就好办了，只需要将原始的明文按`KEY_SIZE / 8 - 11`分段加密就行了。

先定义两个常量：

```java
// 单次加密的最大明文长度
public static final int MAX_ENCRYPT_BLOCK = KEY_SIZE / 8 - 11;

// 单次解密的最大密文长度
public static final int MAX_DECRYPT_BLOCK = KEY_SIZE / 8;
```

接下来对`doCipher`方法进行改造，使其支持分段加解密：

```java
public static byte[] doCipher(int opmode, Key key, int maxBlockSize, byte[] data) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IOException, IllegalBlockSizeException, BadPaddingException {
    var cipher = Cipher.getInstance(key.getAlgorithm());
    cipher.init(opmode, key);

    try (var result = new ByteArrayOutputStream()) {
        var dataLength = data.length;
        var cache = new byte[0];

        for (int i = 0, offset = 0; dataLength - offset > 0; i++, offset = i * maxBlockSize) {
            if (dataLength - offset > maxBlockSize) {
                cache = cipher.doFinal(data, offset, maxBlockSize);
            } else {
                cache = cipher.doFinal(data, offset, dataLength - offset);
            }
            result.write(cache, 0, cache.length);
        }
        return result.toByteArray();
    }
}
```

使用`try-with-resources`语法进行对资源的释放，通过`i`和`offset`配合循环在原始数据上进行分段加解密。

此时完整的工具类代码如下：

```java
public final class RSAUtil {

    private static final Base64.Decoder Base64Decoder = Base64.getDecoder();

    // 加密算法
    public static final String KEY_ALGORITHM = "RSA";

    // 密钥长度
    public static final int KEY_SIZE = 1024;

    // 单次加密的最大明文长度
    public static final int MAX_ENCRYPT_BLOCK = KEY_SIZE / 8 - 11;

    // 单次解密的最大密文长度
    public static final int MAX_DECRYPT_BLOCK = KEY_SIZE / 8;

    public static KeyPair generateKeyPair() throws NoSuchAlgorithmException {
        var keyPairGenerator = KeyPairGenerator.getInstance(KEY_ALGORITHM);
        keyPairGenerator.initialize(KEY_SIZE);
        return keyPairGenerator.genKeyPair();
    }

    public static byte[] doCipher(int opmode, Key key, int maxBlockSize, byte[] data) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IOException, IllegalBlockSizeException, BadPaddingException {
        var cipher = Cipher.getInstance(key.getAlgorithm());
        cipher.init(opmode, key);

        try (var result = new ByteArrayOutputStream()) {
            var dataLength = data.length;
            var cache = new byte[0];

            for (int i = 0, offset = 0; dataLength - offset > 0; i++, offset = i * maxBlockSize) {
                if (dataLength - offset > maxBlockSize) {
                    cache = cipher.doFinal(data, offset, maxBlockSize);
                } else {
                    cache = cipher.doFinal(data, offset, dataLength - offset);
                }
                result.write(cache, 0, cache.length);
            }
            return result.toByteArray();
        }
    }

    public static final class KeyLoader {

        public static PublicKey loadPublicKey(byte[] keyData) throws NoSuchAlgorithmException, InvalidKeySpecException {
            var keySpec = new X509EncodedKeySpec(keyData, KEY_ALGORITHM);
            var keyFactory = KeyFactory.getInstance(keySpec.getAlgorithm());
            return keyFactory.generatePublic(keySpec);
        }

        public static PrivateKey loadPrivateKey(byte[] keyData) throws NoSuchAlgorithmException, InvalidKeySpecException {
            var keySpec = new PKCS8EncodedKeySpec(keyData, KEY_ALGORITHM);
            var keyFactory = KeyFactory.getInstance(keySpec.getAlgorithm());
            return keyFactory.generatePrivate(keySpec);
        }

        public static PublicKey loadPublicKey(String keyText) throws NoSuchAlgorithmException, InvalidKeySpecException {
            return loadPublicKey(Base64Decoder.decode(keyText));
        }

        public static PrivateKey loadPrivateKey(String keyText) throws NoSuchAlgorithmException, InvalidKeySpecException {
            return loadPrivateKey(Base64Decoder.decode(keyText));
        }
    }
}
```

更新测试类如下：

```java
public class App {

    public static void main(String[] args) throws NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeySpecException, InvalidKeyException, IOException {
        var keyPair = RSAUtil.generateKeyPair();
        var rsaKeyPair = RSAKeyPair.of(keyPair);

        var publicKey = RSAUtil.KeyLoader.loadPublicKey(rsaKeyPair.getPublicKey());
        var privateKey = RSAUtil.KeyLoader.loadPrivateKey(rsaKeyPair.getPrivateKey());

        testEncryptByPublicKeyDecryptByPrivateKey(publicKey, privateKey);
    }

    // 公钥加密私钥解密
    public static void testEncryptByPublicKeyDecryptByPrivateKey(PublicKey publicKey, PrivateKey privateKey) throws NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException, IOException {
        var message = "冰墩墩（英文：Bing Dwen Dwen，汉语拼音：bīng dūn dūn），是2022年北京冬季奥运会的吉祥物。将熊猫形象与富有超能量的冰晶外壳相结合，头部外壳造型取自冰雪运动头盔，装饰彩色光环，整体形象酷似航天员。";

        var encryptedMessage = RSAUtil.doCipher(Cipher.ENCRYPT_MODE, publicKey, RSAUtil.MAX_ENCRYPT_BLOCK, message.getBytes(StandardCharsets.UTF_8));
        var decryptedMessage = RSAUtil.doCipher(Cipher.DECRYPT_MODE, privateKey, RSAUtil.MAX_DECRYPT_BLOCK, encryptedMessage);

        System.out.println("解密后报文：" + new String(decryptedMessage));
    }
}
```

运行输出如下：

```bash
解密后报文：冰墩墩（英文：Bing Dwen Dwen，汉语拼音：bīng dūn dūn），是2022年北京冬季奥运会的吉祥物。将熊猫形象与富有超能量的冰晶外壳相结合，头部外壳造型取自冰雪运动头盔，装饰彩色光环，整体形象酷似航天员。
```

ok，完美完成任意长度数据的加解密！

关于加解密到这里就可以结束了，但是在实际的开发当中，直接调用`doCipher`方法还是比较繁琐的，让我们继续添加一些有用的方法以便使用。

### 一些有用的方法

```java
public static byte[] encryptByPublicKey(byte[] data, String publicKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
    var publicKey = KeyLoader.loadPublicKey(publicKeyText);
    return doCipher(Cipher.ENCRYPT_MODE, publicKey, MAX_ENCRYPT_BLOCK, data);
}

public static byte[] decryptByPrivateKey(byte[] data, String privateKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
    var privateKey = KeyLoader.loadPrivateKey(privateKeyText);
    return doCipher(Cipher.DECRYPT_MODE, privateKey, MAX_DECRYPT_BLOCK, data);
}

public static byte[] encryptByPrivateKey(byte[] data, String privateKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
    var privateKey = KeyLoader.loadPrivateKey(privateKeyText);
    return doCipher(Cipher.ENCRYPT_MODE, privateKey, MAX_ENCRYPT_BLOCK, data);
}

public static byte[] decryptByPublicKey(byte[] data, String publicKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
    var publicKey = KeyLoader.loadPublicKey(publicKeyText);
    return doCipher(Cipher.DECRYPT_MODE, publicKey, MAX_DECRYPT_BLOCK, data);
}

public static String encryptByPublicKeyToBase64(String text, String publicKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
    return Base64Encoder.encodeToString(encryptByPublicKey(text.getBytes(StandardCharsets.UTF_8), publicKeyText));
}

public static String decryptBase64TextByPrivateKey(String base64Data, String privateKeyText) throws NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, InvalidKeySpecException, IOException, BadPaddingException, InvalidKeyException {
    return new String(decryptByPrivateKey(Base64Decoder.decode(base64Data), privateKeyText));
}

public static String encryptByPrivateKeyToBase64(String text, String privateKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
    return Base64Encoder.encodeToString(encryptByPrivateKey(text.getBytes(StandardCharsets.UTF_8), privateKeyText));
}

public static String decryptBase64TextByPublicKey(String base64Data, String publicKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
    return new String(decryptByPublicKey(Base64Decoder.decode(base64Data), publicKeyText));
}

public static String encryptByPublicKeyToBase64(byte[] data, String publicKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
    return Base64Encoder.encodeToString(encryptByPublicKey(data, publicKeyText));
}
```

这些方法见名知义，不多解释。

测试：

```java
public class App {

    public static void main(String[] args) throws NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, InvalidKeySpecException, IOException, BadPaddingException, InvalidKeyException {
        var keyPair = RSAUtil.generateKeyPair();
        var rsaKeyPair = RSAKeyPair.of(keyPair);

        testEncryptByPublicKeyDecryptByPrivateKey(rsaKeyPair.getPublicKey(), rsaKeyPair.getPrivateKey());
        testEncryptByPrivateKeyDecryptByPublicKey(rsaKeyPair.getPublicKey(), rsaKeyPair.getPrivateKey());
    }

    // 公钥加密私钥解密
    public static void testEncryptByPublicKeyDecryptByPrivateKey(String publicKeyText, String privateKeyText) throws NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, InvalidKeySpecException, IOException, BadPaddingException, InvalidKeyException {
        var message = "冰墩墩（英文：Bing Dwen Dwen，汉语拼音：bīng dūn dūn），是2022年北京冬季奥运会的吉祥物。将熊猫形象与富有超能量的冰晶外壳相结合，头部外壳造型取自冰雪运动头盔，装饰彩色光环，整体形象酷似航天员。";

        var encryptedMessage = RSAUtil.encryptByPublicKeyToBase64(message, publicKeyText);
        var decryptedMessage = RSAUtil.decryptBase64TextByPrivateKey(encryptedMessage, privateKeyText);

        System.out.println("解密后报文：" + decryptedMessage);
    }

    // 私钥加密公钥解密
    public static void testEncryptByPrivateKeyDecryptByPublicKey(String publicKeyText, String privateKeyText) throws NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, InvalidKeySpecException, IOException, BadPaddingException, InvalidKeyException {
        var message = "雪容融（Shuey Rhon Rhon），是2022年北京冬季残奥会的吉祥物，其以灯笼为原型进行设计创作，主色调为红色，头顶有如意环与外围的剪纸图案，面部带有不规则形状的雪块，身体可以向外散发光芒。";

        var encryptedMessage = RSAUtil.encryptByPrivateKeyToBase64(message, privateKeyText);
        var decryptedMessage = RSAUtil.decryptBase64TextByPublicKey(encryptedMessage, publicKeyText);

        System.out.println("解密后报文：" + decryptedMessage);
    }
}
```

运行结果如下：

```bash
解密后报文：冰墩墩（英文：Bing Dwen Dwen，汉语拼音：bīng dūn dūn），是2022年北京冬季奥运会的吉祥物。将熊猫形象与富有超能量的冰晶外壳相结合，头部外壳造型取自冰雪运动头盔，装饰彩色光环，整体形象酷似航天员。
解密后报文：雪容融（Shuey Rhon Rhon），是2022年北京冬季残奥会的吉祥物，其以灯笼为原型进行设计创作，主色调为红色，头顶有如意环与外围的剪纸图案，面部带有不规则形状的雪块，身体可以向外散发光芒。
```

### 完整代码

```java
package ink.laoli;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public final class RSAUtil {

    private static final Base64.Encoder Base64Encoder = Base64.getEncoder();

    private static final Base64.Decoder Base64Decoder = Base64.getDecoder();

    // 加密算法
    public static final String KEY_ALGORITHM = "RSA";

    // 密钥长度
    public static final int KEY_SIZE = 1024;

    // 单次加密的最大明文长度
    public static final int MAX_ENCRYPT_BLOCK = KEY_SIZE / 8 - 11;

    // 单次解密的最大密文长度
    public static final int MAX_DECRYPT_BLOCK = KEY_SIZE / 8;

    public static KeyPair generateKeyPair() throws NoSuchAlgorithmException {
        var keyPairGenerator = KeyPairGenerator.getInstance(KEY_ALGORITHM);
        keyPairGenerator.initialize(KEY_SIZE);
        return keyPairGenerator.genKeyPair();
    }

    public static byte[] encryptByPublicKey(byte[] data, String publicKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
        var publicKey = KeyLoader.loadPublicKey(publicKeyText);
        return doCipher(Cipher.ENCRYPT_MODE, publicKey, MAX_ENCRYPT_BLOCK, data);
    }

    public static byte[] decryptByPrivateKey(byte[] data, String privateKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
        var privateKey = KeyLoader.loadPrivateKey(privateKeyText);
        return doCipher(Cipher.DECRYPT_MODE, privateKey, MAX_DECRYPT_BLOCK, data);
    }

    public static byte[] encryptByPrivateKey(byte[] data, String privateKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
        var privateKey = KeyLoader.loadPrivateKey(privateKeyText);
        return doCipher(Cipher.ENCRYPT_MODE, privateKey, MAX_ENCRYPT_BLOCK, data);
    }

    public static byte[] decryptByPublicKey(byte[] data, String publicKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
        var publicKey = KeyLoader.loadPublicKey(publicKeyText);
        return doCipher(Cipher.DECRYPT_MODE, publicKey, MAX_DECRYPT_BLOCK, data);
    }

    public static String encryptByPublicKeyToBase64(String text, String publicKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
        return Base64Encoder.encodeToString(encryptByPublicKey(text.getBytes(StandardCharsets.UTF_8), publicKeyText));
    }

    public static String decryptBase64TextByPrivateKey(String base64Data, String privateKeyText) throws NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, InvalidKeySpecException, IOException, BadPaddingException, InvalidKeyException {
        return new String(decryptByPrivateKey(Base64Decoder.decode(base64Data), privateKeyText));
    }

    public static String encryptByPrivateKeyToBase64(String text, String privateKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
        return Base64Encoder.encodeToString(encryptByPrivateKey(text.getBytes(StandardCharsets.UTF_8), privateKeyText));
    }

    public static String decryptBase64TextByPublicKey(String base64Data, String publicKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
        return new String(decryptByPublicKey(Base64Decoder.decode(base64Data), publicKeyText));
    }

    public static String encryptByPublicKeyToBase64(byte[] data, String publicKeyText) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, IllegalBlockSizeException, IOException, BadPaddingException, InvalidKeyException {
        return Base64Encoder.encodeToString(encryptByPublicKey(data, publicKeyText));
    }

    public static byte[] doCipher(int opmode, Key key, int maxBlockSize, byte[] data) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IOException, IllegalBlockSizeException, BadPaddingException {
        var cipher = Cipher.getInstance(key.getAlgorithm());
        cipher.init(opmode, key);

        try (var result = new ByteArrayOutputStream()) {
            var dataLength = data.length;
            var cache = new byte[0];

            for (int i = 0, offset = 0; dataLength - offset > 0; i++, offset = i * maxBlockSize) {
                if (dataLength - offset > maxBlockSize) {
                    cache = cipher.doFinal(data, offset, maxBlockSize);
                } else {
                    cache = cipher.doFinal(data, offset, dataLength - offset);
                }
                result.write(cache, 0, cache.length);
            }
            return result.toByteArray();
        }
    }

    public static final class KeyLoader {

        public static PublicKey loadPublicKey(byte[] keyData) throws NoSuchAlgorithmException, InvalidKeySpecException {
            var keySpec = new X509EncodedKeySpec(keyData, KEY_ALGORITHM);
            var keyFactory = KeyFactory.getInstance(keySpec.getAlgorithm());
            return keyFactory.generatePublic(keySpec);
        }

        public static PrivateKey loadPrivateKey(byte[] keyData) throws NoSuchAlgorithmException, InvalidKeySpecException {
            var keySpec = new PKCS8EncodedKeySpec(keyData, KEY_ALGORITHM);
            var keyFactory = KeyFactory.getInstance(keySpec.getAlgorithm());
            return keyFactory.generatePrivate(keySpec);
        }

        public static PublicKey loadPublicKey(String keyText) throws NoSuchAlgorithmException, InvalidKeySpecException {
            return loadPublicKey(Base64Decoder.decode(keyText));
        }

        public static PrivateKey loadPrivateKey(String keyText) throws NoSuchAlgorithmException, InvalidKeySpecException {
            return loadPrivateKey(Base64Decoder.decode(keyText));
        }
    }
}
```

最近在做一个`C#`的项目，顺便给出部分实现：

```csharp
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Encodings;
using Org.BouncyCastle.Crypto.Engines;
using Org.BouncyCastle.Security;
using System;
using System.IO;
using System.Text;

namespace InkLaoli
{
    sealed class RSAUtil
    {
        private static readonly int KEY_SIZE = 2048;

        private static readonly int MAX_ENCRYPT_BLOCK = KEY_SIZE / 8 - 11;

        private static readonly int MAX_DECRYPT_BLOCK = KEY_SIZE / 8;

        public static byte[] EncryptByPublicKey(byte[] data, string publicKeyText)
        {
            var publicKey = PublicKeyFactory.CreateKey(Convert.FromBase64String(publicKeyText));
            return DoCipher(true, publicKey, MAX_ENCRYPT_BLOCK, data);
        }

        public static string EncryptByPublicKeyToBase64(string text, string publicKeyText)
        {
            return Convert.ToBase64String(EncryptByPublicKey(Encoding.UTF8.GetBytes(text), publicKeyText));
        }

        public static byte[] DecryptByPrivateKey(byte[] data, string privateKeyText)
        {
            var privateKey = PrivateKeyFactory.CreateKey(Convert.FromBase64String(privateKeyText));
            return DoCipher(false, privateKey, MAX_DECRYPT_BLOCK, data);
        }

        public static string DecryptBase64TextByPrivateKey(string text, string privateKeyText)
        {
            return Encoding.UTF8.GetString(DecryptByPrivateKey(Convert.FromBase64String(text), privateKeyText));
        }

        private static byte[] DoCipher(bool forEncryption, ICipherParameters parameters, int maxBlockSize, byte[] data)
        {
            var cipher = new Pkcs1Encoding(new RsaEngine());
            cipher.Init(forEncryption, parameters);

            using (var result = new MemoryStream())
            {
                var dataLength = data.Length;
                var cache = new byte[0];

                for (int i = 0, offset = 0; dataLength - offset > 0; i++, offset = i * maxBlockSize)
                {
                    if (dataLength - offset > maxBlockSize)
                    {
                        cache = cipher.ProcessBlock(data, offset, maxBlockSize);
                    } else
                    {
                        cache = cipher.ProcessBlock(data, offset, dataLength - offset);
                    }
                    result.Write(cache, 0, cache.Length);
                }
                return result.ToArray();
            }
        }
    }
}
```

`C#`的实现中使用了第三方库[BouncyCastle](https://www.bouncycastle.org/csharp/)，如需了解详情请自行查看文档。

（完）
