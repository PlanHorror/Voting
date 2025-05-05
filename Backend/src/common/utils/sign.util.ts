import crypto from 'crypto';
export function signMessage(
  message: string,
  privateKey: string,
): { signedMessage: string; signature: Buffer } {
  const buffer = Buffer.from(message);
  const keyBuffer = Buffer.from(privateKey, 'base64');
  const signature = crypto.sign('sha256', buffer, {
    key: keyBuffer,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
  });
  return {
    signedMessage: buffer.toString('base64'),
    signature,
  };
}
