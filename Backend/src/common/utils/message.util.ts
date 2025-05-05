import * as crypto from 'crypto';
import * as forge from 'node-forge';
const bigInt = forge.jsbn.BigInteger;

export function blindMessage(
  message: string,
  publicKey: string,
): { blindMessage: string; blindingFactor: string } {
  const hashMessage = crypto.createHash('sha256').update(message).digest();
  const n = new bigInt(
    forge.pki.publicKeyFromPem(publicKey).n.toString(16),
    16,
  );
  const e = new bigInt(
    forge.pki.publicKeyFromPem(publicKey).e.toString(16),
    16,
  );
  const mBigInt = new bigInt(hashMessage.toString('hex'), 16);
  let r = new bigInt(crypto.randomBytes(32).toString('hex'), 16);
  while (r.compareTo(n) >= 0 || r.gcd(n).compareTo(bigInt.ONE) !== 0) {
    r = new bigInt(crypto.randomBytes(32).toString('hex'), 16);
  }
  return {
    blindMessage: mBigInt.multiply(r.modPow(e, n)).mod(n).toString(16),
    blindingFactor: r.toString(16),
  };
}

export function unblindMessage(
  blindMessage: string,
  blindingFactor: string,
  publicKey: string,
): string {
  const n = new bigInt(
    forge.pki.publicKeyFromPem(publicKey).n.toString(16),
    16,
  );
  const r = new bigInt(blindingFactor, 16);
  const rInv = r.modInverse(n);
  return new bigInt(blindMessage, 16).multiply(rInv).mod(n).toString(16);
}

export function verifyBlindSignature(
  blindSignature: string,
  blindMessage: string,
  publicKey: string,
): boolean {
  const n = new bigInt(
    forge.pki.publicKeyFromPem(publicKey).n.toString(16),
    16,
  );
  const e = new bigInt(
    forge.pki.publicKeyFromPem(publicKey).e.toString(16),
    16,
  );
  const mBigInt = new bigInt(blindMessage, 16);
  const sBigInt = new bigInt(blindSignature, 16);
  return sBigInt.modPow(e, n).mod(n).equals(mBigInt);
}
