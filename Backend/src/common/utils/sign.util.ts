import * as forge from 'node-forge';
const bigInt = forge.jsbn.BigInteger;
export function signBlindedMessage(
  message: string,
  privateKey: string,
): string {
  const n = forge.pki.privateKeyFromPem(privateKey).n;
  const d = forge.pki.privateKeyFromPem(privateKey).d;
  const processMessage = new bigInt(message, 16);
  return processMessage.modPow(d, n).toString(16);
}
