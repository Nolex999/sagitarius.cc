import fs from 'fs';
import path from 'path';

/**
 * Utility to patch a binary file by searching for a placeholder string 
 * and replacing it with another string.
 */
export async function patchLoader(templatePath: string, key: string): Promise<Buffer> {
  const placeholder = "SAGITARIUS-KEY-PLACEHOLDER-FOR-SERVER-PATCHING-TOOL-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-PLACEHOLDER-FOR-SERVE-PATCH-PATCH-KEY-HERE";
  const placeholderBuffer = Buffer.from(placeholder, 'utf-8');
  
  if (!fs.existsSync(templatePath)) {
    throw new Error('Template loader not found at ' + templatePath);
  }

  const binary = fs.readFileSync(templatePath);
  const index = binary.indexOf(placeholderBuffer);

  if (index === -1) {
    throw new Error('Could not find key placeholder in binary. Is the template correct?');
  }

  // Create a 128-byte buffer for the actual key, padded with zeros
  const keyBuffer = Buffer.alloc(128, 0);
  keyBuffer.write(key, 0, 'utf-8');

  // Create a copy of the binary and patch it
  const patchedBinary = Buffer.from(binary);
  keyBuffer.copy(patchedBinary, index);

  return patchedBinary;
}

export async function patchLoaderFromBuffer(binary: Buffer, key: string): Promise<Buffer> {
  const placeholder = "SAGITARIUS-KEY-PLACEHOLDER-FOR-SERVER-PATCHING-TOOL-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-PLACEHOLDER-FOR-SERVE-PATCH-PATCH-KEY-HERE";
  const placeholderBuffer = Buffer.from(placeholder, 'utf-8');
  
  const index = binary.indexOf(placeholderBuffer);
  if (index === -1) {
    throw new Error('Could not find key placeholder in binary.');
  }

  const keyBuffer = Buffer.alloc(128, 0);
  keyBuffer.write(key, 0, 'utf-8');

  const patchedBinary = Buffer.from(binary);
  keyBuffer.copy(patchedBinary, index);

  return patchedBinary;
}
