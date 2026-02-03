'use server';
/**
 * @fileOverview Generates risk mitigation plans using generative AI based on identified risks and the environment.
 *
 * - riskMitigationPlanGenerator - A function that generates a risk mitigation plan.
 * - RiskMitigationPlanInput - The input type for the riskMitigationPlanGenerator function.
 * - RiskMitigationPlanOutput - The return type for the riskMitigationPlanGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiskMitigationPlanInputSchema = z.object({
  identifiedRisks: z.string().describe('A detailed description of the identified risks.'),
  environment: z.string().describe('A description of the work environment where the risks are present.'),
});
export type RiskMitigationPlanInput = z.infer<typeof RiskMitigationPlanInputSchema>;

const RiskMitigationPlanOutputSchema = z.object({
  mitigationPlan: z.string().describe('A comprehensive risk mitigation plan based on best practices.'),
});
export type RiskMitigationPlanOutput = z.infer<typeof RiskMitigationPlanOutputSchema>;

export async function riskMitigationPlanGenerator(input: RiskMitigationPlanInput): Promise<RiskMitigationPlanOutput> {
  return riskMitigationPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'riskMitigationPlanPrompt',
  input: {schema: RiskMitigationPlanInputSchema},
  output: {schema: RiskMitigationPlanOutputSchema},
  prompt: `You are an expert safety technician. Generate a best practice risk mitigation plan based on the identified risks and the environment.

Identified Risks: {{{identifiedRisks}}}
Environment: {{{environment}}}

Mitigation Plan:`,
});

const riskMitigationPlanFlow = ai.defineFlow(
  {
    name: 'riskMitigationPlanFlow',
    inputSchema: RiskMitigationPlanInputSchema,
    outputSchema: RiskMitigationPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
