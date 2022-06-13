import { JSEncrypt } from 'jsencrypt'

// 加密公钥
const key = ``

// 加密
export function rsaEncrypt (msg,key) {
  const jsencrypt = new JSEncrypt()
  jsencrypt.setPublicKey(key)
  const encryptMsg = jsencrypt.encrypt(msg)
  return encryptMsg
}

// 解密私钥
const privateKey = ``

// 解密
export function rsaDecrypt (msg,privateKey) {
  const decrypt = new JSEncrypt()
  decrypt.setPrivateKey(privateKey)
  const decryptMsg = decrypt.decrypt(msg)
  return decryptMsg
}
