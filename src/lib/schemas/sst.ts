
import { z } from "zod";

/**
 * Schemas de validação rigorosa para dados SST (eSocial Ready)
 */

export const EmployeeSchema = z.object({
  id: z.string().min(1, "Matrícula é obrigatória"),
  name: z.string().min(3, "Nome muito curto"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  companyId: z.string().min(1, "Vínculo com empresa é obrigatório"),
  jobRole: z.string().min(1, "Cargo é obrigatório"),
  admissionDate: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "LEAVE"]),
  isPcd: z.boolean().default(false),
});

export const CompanySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(3),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido"),
  segment: z.enum(["CONSTRUCTION", "HOSPITAL", "INDUSTRY", "GENERAL"]),
  city: z.string(),
  state: z.string().length(2),
});

export const RiskSchema = z.object({
  id: z.string(),
  category: z.enum(["Fisico", "Quimico", "Biologico", "Ergonomico", "Acidente"]),
  hazard: z.string().min(1),
  intensity: z.string().optional(),
  technique: z.string().optional(),
  controlMeasures: z.array(z.string()),
});

export type EmployeeInput = z.infer<typeof EmployeeSchema>;
export type CompanyInput = z.infer<typeof CompanySchema>;
export type RiskInput = z.infer<typeof RiskSchema>;
