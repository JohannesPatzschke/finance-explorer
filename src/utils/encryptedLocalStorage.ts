import CryptoJS from 'crypto-js';

export default class EncryptedLocalStorage {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  clear() {
    return localStorage.clear();
  }

  setItem(key: string, value: string) {
    const encryptedValue = CryptoJS.AES.encrypt(value, this.secret).toString();

    return localStorage.setItem(key, encryptedValue);
  }

  getItem(key: string) {
    const decryptedValue = CryptoJS.AES.decrypt(
      localStorage.getItem(key) ?? '',
      this.secret,
    ).toString(CryptoJS.enc.Utf8);

    return decryptedValue;
  }

  removeItem(key: string) {
    return localStorage.removeItem(key);
  }
}
