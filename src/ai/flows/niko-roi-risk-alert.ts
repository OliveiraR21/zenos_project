'use server';
/**
 * @fileOverview This file implements the Genkit flow for the Niko AI assistant to proactively alert project managers
 * about significant financial risks to a project's ROI due to task delays.
 *
 * - nikoRoiRiskAlert - A function that triggers the Niko AI assistant to check for ROI risks.
 * - NikoRoiRiskAlertInput - The input type for the nikoRoiRiskAlert function.
 * - NikoRoiRiskAlertOutput - The return type for the nikoRoiRiskAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NikoRoiRiskAlertInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  targetGainType: z.string().describe('The type of target gain for the project (e.g., "Increased Sales", "Cost Reduction", "NPS Improvement", "Operational Efficiency").'),
  targetGainValue: z.number().describe('The monetary value of the project\'s target gain.'),
  dailyCostOfDelay: z.number().describe('The calculated daily financial cost incurred due to the task delay.'),
  delayedTaskTitle: z.string().describe('The title of the task that is causing the delay.'),
  delayedTaskResponsible: z.string().describe('The person responsible for the delayed task.'),
  delayedTaskOriginalDeadline: z.string().datetime().describe('The original baseline deadline for the delayed task in ISO 8601 format.'),
  delayedTaskNewDeadline: z.string().datetime().describe('The new, dynamic deadline for the delayed task in ISO 8601 format.'),
  projectImpactDays: z.number().describe('The number of days the project\'s final deadline is pushed due to this task delay.'),
  significantRiskThresholdAmount: z.number().describe('The monetary amount at which the daily cost of delay is considered a significant financial risk.'),
});
export type NikoRoiRiskAlertInput = z.infer<typeof NikoRoiRiskAlertInputSchema>;

const NikoRoiRiskAlertOutputSchema = z.object({
  hasSignificantRisk: z.boolean().describe('True if a significant financial risk to the project\'s ROI is detected, false otherwise.'),
  alertMessage: z.string().describe('A concise, AI-generated message explaining the risk. This will be an empty string if no significant risk is detected.'),
  voltIndicatorRequired: z.boolean().describe('True if the "Volt" indicator should be shown (i.e., a significant risk is detected), false otherwise.'),
});
export type NikoRoiRiskAlertOutput = z.infer<typeof NikoRoiRiskAlertOutputSchema>;

const prompt = ai.definePrompt({
  name: 'nikoRoiRiskAlertPrompt',
  input: {schema: NikoRoiRiskAlertInputSchema},
  output: {schema: NikoRoiRiskAlertOutputSchema},
  prompt: `You are Niko, an AI assistant and expert project management consultant for Zenos Project. Your primary goal is to proactively alert project managers to significant financial risks to a project's ROI due to task delays.\n\nAnalyze the following project and task delay details:\nProject Name: {{{projectName}}}\nProject Target Gain Type: {{{targetGainType}}}\nProject Target Gain Value: $TBD{{{targetGainValue}}}\nDaily Cost of Delay: $TBD{{{dailyCostOfDelay}}}\nDelayed Task: {{{delayedTaskTitle}}}\nTask Responsible: {{{delayedTaskResponsible}}}\nOriginal Task Deadline: {{{delayedTaskOriginalDeadline}}}\nNew Task Deadline: {{{delayedTaskNewDeadline}}}\nProject Final Deadline Impact: {{projectImpactDays}} days\nSignificant Risk Threshold Amount: $TBD{{{significantRiskThresholdAmount}}} (If Daily Cost of Delay is >= this, it's a significant risk)\n\nBased on the data, determine if the 'Daily Cost of Delay' ($TBD{{{dailyCostOfDelay}}}) represents a 'significant financial risk' to the project's ROI. A risk is significant if the 'Daily Cost of Delay' is greater than or equal to the 'Significant Risk Threshold Amount' ($TBD{{{significantRiskThresholdAmount}}}).\n\nIf a significant risk IS detected:\n  - Set 'hasSignificantRisk' to true.\n  - Set 'voltIndicatorRequired' to true.\n  - Generate a concise, actionable alert message (max 2-3 sentences). The message must clearly explain the specific project, the delayed task, the daily financial impact, and how it directly affects the project's ROI and final deadline. Be direct, professional, and focus on impact and action.\n\nIf a significant risk is NOT detected:\n  - Set 'hasSignificantRisk' to false.\n  - Set 'voltIndicatorRequired' to false.\n  - Set 'alertMessage' to an empty string.\n\nExample of a concise alert message (only if risk is significant): "Alert: Project 'Alpha Launch' faces significant ROI risk. The 'Backend Integration' task by John Doe is delayed, incurring a daily cost of $500. This impacts the 'Increased Sales' target, pushing the final project deadline by 5 days, and threatens overall profitability."`,
});

const nikoRoiRiskAlertFlow = ai.defineFlow(
  {
    name: 'nikoRoiRiskAlertFlow',
    inputSchema: NikoRoiRiskAlertInputSchema,
    outputSchema: NikoRoiRiskAlertOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function nikoRoiRiskAlert(
  input: Omit<NikoRoiRiskAlertInput, 'significantRiskThresholdAmount'> & { riskThresholdPercentage: number }
): Promise<NikoRoiRiskAlertOutput> {
  const significantRiskThresholdAmount = input.targetGainValue * input.riskThresholdPercentage;
  const flowInput: NikoRoiRiskAlertInput = {
    ...input,
    significantRiskThresholdAmount,
  };
  return nikoRoiRiskAlertFlow(flowInput);
}
