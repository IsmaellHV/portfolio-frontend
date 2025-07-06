import { AES, enc } from 'crypto-js';

export class AdapterEncrypt {
  public static encrypt(_text: string, key: string): string {
    const cipher = AES.encrypt(_text, key);
    const encrypted: string = cipher.toString();
    return encrypted;
  }

  public static decrypt(_text: string, key: string): string {
    const bytes = AES.decrypt(_text, key);
    const decrypted: string = bytes.toString(enc.Utf8);
    return decrypted;
  }

  public static compareCryptoText(text: string, textEncrypt: string, key: string): boolean {
    const decrypted: string = AdapterEncrypt.decrypt(textEncrypt, key);
    return decrypted === text;
  }

  public static encryptWithReplace(text: string, key: string): string {
    const cipher = AES.encrypt(text, key);
    let encrypted: string = cipher.toString();

    Object.keys(AdapterEncrypt.replacements).forEach((searchValue) => {
      const replaceValue = AdapterEncrypt.replacements[searchValue];
      encrypted = encrypted.split(searchValue).join(replaceValue);
    });

    return encrypted;
  }

  public static decryptWithReplace(text: string, key: string): string {
    Object.keys(AdapterEncrypt.reverseReplacements).forEach((searchValue) => {
      const replaceValue = AdapterEncrypt.reverseReplacements[searchValue];
      text = text.split(searchValue).join(replaceValue);
    });
    const bytes = AES.decrypt(text, key);
    const decrypted: string = bytes.toString(enc.Utf8);
    return decrypted;
  }

  private static replacements: { [key: string]: string } = {
    U2FsdGVkX1: '\\',
  };

  private static reverseReplacements: { [key: string]: string } = {
    '\\': 'U2FsdGVkX1',
  };
}
