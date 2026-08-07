// lib/validations/auth.ts
// Schémas zod v4 pour l'authentification

import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  role: z.enum(["PARENT", "SPECIALIST", "ADMIN"]),
  phone: z.string().optional(),
  wilaya: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const pinSchema = z.object({
  pin: z
    .string()
    .length(4, "Le PIN doit contenir exactement 4 chiffres")
    .regex(/^\d{4}$/, "Le PIN doit contenir uniquement des chiffres"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PinInput = z.infer<typeof pinSchema>;
