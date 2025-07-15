import CryptoJS from "crypto-js";

//AES encryption

export const encryptAES = (text, key) => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

export const decryptAES = (cipherText, key) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
};

