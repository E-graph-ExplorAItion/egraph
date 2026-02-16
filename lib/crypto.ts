import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_change_me_plz'; // Fallback for dev only!
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  if (!text) return text;
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest('base64').substr(0, 32);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  if (!text) return text;
  try {
    const textParts = text.split(':');
    if (textParts.length < 2) return text; // Not encrypted or invalid format
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const key = crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest('base64').substr(0, 32);
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    // If decryption fails (e.g. legacy plain text), return original
    return text;
  }
}
