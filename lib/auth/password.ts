// lib/auth/password.ts
// Hachage et vérification des mots de passe + PIN enfant avec bcryptjs

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hache un mot de passe ou un PIN.
 * Utilisé pour les passwords User ET les pinCodes Child.
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/**
 * Compare un mot de passe ou PIN en clair avec son hash bcrypt.
 */
export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
