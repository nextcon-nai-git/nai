import { z } from "zod";

// 1. Enums (Tipos fixos)
export const RoleEnum = z.enum(["SUPER_ADMIN", "CLIENT_ADMIN", "ENGINEER", "DOCTOR", "PROVIDER"]);
export const FrequencyEnum = z.enum(["daily", "weekly", "monthly"]);
export const EmployeeStatusEnum = z.enum(["active", "leave", "fired"]);
export const TrainingStatusEnum = z.enum(["planned", "in_progress", "completed"]);

// 2. Schemas das Entidades
export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  role: RoleEnum,
  email: z.string().email("E-mail inválido"),
  companyId: z.string().optional(), // Opcional porque o SUPER_ADMIN pode não ter uma
});

export const CompanySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome da empresa é obrigatório"),
  cnpj: z.string().regex(/^\d{14}$/, "CNPJ deve conter 14 números sem pontuação"), // Validando CNPJ limpo
  segment: z.string().optional(),
  logoUrl: z.string().url().optional(),
  address: z.string().optional(),
  risk_degree: z.number().min(1).max(4).optional(), // Grau de risco geralmente é de 1 a 4
  cnae: z.string().optional(),
});

export const EmailRoutineSchema = z.object({
  id: z.string(),
  frequency: FrequencyEnum,
  customEmail: z.string().email().optional(),
  active: z.boolean().default(true),
  companyId: z.string(),
});

export const EmployeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  cpf: z.string(),
  job_role: z.object({
    id: z.string(),
    title: z.string(),
    cbo: z.string().optional(),
  }),
  status: EmployeeStatusEnum.default("active"),
});

export const TrainingSchema = z.object({
  id: z.string(),
  title: z.string(),
  companyId: z.string(),
  nrs: z.array(z.string()), // Ex: ["NR-10", "NR-35"]
  startDate: z.string(), // Ou z.date() dependendo de como você salva
  endDate: z.string(),
  totalHours: z.number().positive(),
  modality: z.string(),
  status: TrainingStatusEnum,
  students: z.array(z.string()), // Array de IDs de funcionários
});

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  type: z.string(),
  priority: z.string(),
  ai_risk_score: z.number().min(0).max(100).optional(), // IA Score de 0 a 100
});

export const PlatformFeedbackSchema = z.object({
  id: z.string(),
  userId: z.string(),
  companyId: z.string().optional(),
  rating: z.number().min(1).max(5, "A nota deve ser entre 1 e 5"),
  suggestion: z.string().optional(),
  createdAt: z.string(), 
});

// 3. Tipagens TypeScript Geradas Automaticamente
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type EmailRoutine = z.infer<typeof EmailRoutineSchema>;
export type Employee = z.infer<typeof EmployeeSchema>;
export type Training = z.infer<typeof TrainingSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type PlatformFeedback = z.infer<typeof PlatformFeedbackSchema>;
