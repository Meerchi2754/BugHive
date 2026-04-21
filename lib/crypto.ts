import crypto from "crypto";

const algorithm = "aes-256-cbc";

function getSecretKey(): Buffer {
  const secret_key = process.env.ENCRYPTION_KEY!;
  //console.log("KEY:", process.env.ENCRYPTION_KEY!);

  if (!secret_key) {
    throw new Error("ENCRYPTION_KEY environment variable is not set.");
  }
  const keyBuffer = Buffer.from(secret_key, "hex");
  if (keyBuffer.length !== 32) {
    throw new Error(
      `ENCRYPTION_KEY must be exactly 32 bytes. Current length: ${keyBuffer.length}`,
    );
  }
  return keyBuffer;
}

export function encrypt(text: string): {
  encrytToken: string;
  iv: string;
} {
  const keyBuffer = getSecretKey();

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);

  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return {
    encrytToken: encrypted,
    iv: iv.toString("hex"),
  };
}

export function decrypt(encryptData: string, iv: string): string {
  const keyBuffer = getSecretKey();

  const decipher = crypto.createDecipheriv(
    algorithm,
    keyBuffer,
    Buffer.from(iv, "hex"),
  );
  let decrypted = decipher.update(encryptData, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
}
