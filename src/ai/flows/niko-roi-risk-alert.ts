'use server';
/**
 * @fileOverview Este arquivo implementa o fluxo Genkit para o assistente de IA Niko para alertar proativamente
 * os gerentes de projeto sobre riscos financeiros significativos para o ROI de um projeto devido a atrasos nas tarefas.
 *
 * - nikoRoiRiskAlert - Uma função que aciona o assistente de IA Niko para verificar os riscos de ROI.
 * - NikoRoiRiskAlertInput - O tipo de entrada para a função nikoRoiRiskAlert.
 * - NikoRoiRiskAlertOutput - O tipo de retorno para a função nikoRoiRiskAlert.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NikoRoiRiskAlertInputSchema = z.object({
  projectName: z.string().describe('O nome do projeto.'),
  targetGainType: z.string().describe('O tipo de ganho alvo para o projeto (ex: "Aumento de Vendas", "Redução de Custos", "Melhoria do NPS", "Eficiência Operacional").'),
  targetGainValue: z.number().describe("O valor monetário do ganho alvo do projeto."),
  dailyCostOfDelay: z.number().describe("O custo financeiro diário calculado incorrido devido ao atraso da tarefa."),
  delayedTaskTitle: z.string().describe("O título da tarefa que está causando o atraso."),
  delayedTaskResponsible: z.string().describe("A pessoa responsável pela tarefa atrasada."),
  delayedTaskOriginalDeadline: z.string().datetime().describe("O prazo base original para a tarefa atrasada no formato ISO 8601."),
  delayedTaskNewDeadline: z.string().datetime().describe("O novo prazo dinâmico para a tarefa atrasada no formato ISO 8601."),
  projectImpactDays: z.number().describe("O número de dias que o prazo final do projeto é adiado devido a este atraso de tarefa."),
  significantRiskThresholdAmount: z.number().describe("O valor monetário a partir do qual o custo diário do atraso é considerado um risco financeiro significativo."),
});
export type NikoRoiRiskAlertInput = z.infer<typeof NikoRoiRiskAlertInputSchema>;

const NikoRoiRiskAlertOutputSchema = z.object({
  hasSignificantRisk: z.boolean().describe('Verdadeiro se um risco financeiro significativo para o ROI do projeto for detectado, falso caso contrário.'),
  alertMessage: z.string().describe('Uma mensagem concisa, gerada por IA, explicando o risco. Será uma string vazia se nenhum risco significativo for detectado.'),
  voltIndicatorRequired: z.boolean().describe('Verdadeiro se o indicador "Volt" deve ser mostrado (ou seja, um risco significativo é detectado), falso caso contrário.'),
});
export type NikoRoiRiskAlertOutput = z.infer<typeof NikoRoiRiskAlertOutputSchema>;

const prompt = ai.definePrompt({
  name: 'nikoRoiRiskAlertPrompt',
  input: {schema: NikoRoiRiskAlertInputSchema},
  output: {schema: NikoRoiRiskAlertOutputSchema},
  prompt: `Você é Niko, um assistente de IA e consultor especialista em gerenciamento de projetos para o Zenos Project. Seu objetivo principal é alertar proativamente os gerentes de projeto sobre riscos financeiros significativos para o ROI de um projeto devido a atrasos nas tarefas.\n\nAnalise os seguintes detalhes do projeto e do atraso da tarefa:\nNome do Projeto: {{{projectName}}}\nTipo de Ganho Alvo do Projeto: {{{targetGainType}}}\nValor do Ganho Alvo do Projeto: R$ {{{targetGainValue}}}\nCusto Diário do Atraso: R$ {{{dailyCostOfDelay}}}\nTarefa Atrasada: {{{delayedTaskTitle}}}\nResponsável pela Tarefa: {{{delayedTaskResponsible}}}\nPrazo Original da Tarefa: {{{delayedTaskOriginalDeadline}}}\nNovo Prazo da Tarefa: {{{delayedTaskNewDeadline}}}\nImpacto no Prazo Final do Projeto: {{projectImpactDays}} dias\nValor do Limite de Risco Significativo: R$ {{{significantRiskThresholdAmount}}} (Se o Custo Diário do Atraso for >= a este valor, é um risco significativo)\n\nCom base nos dados, determine se o 'Custo Diário do Atraso' (R$ {{{dailyCostOfDelay}}}) representa um 'risco financeiro significativo' para o ROI do projeto. Um risco é significativo se o 'Custo Diário do Atraso' for maior ou igual ao 'Valor do Limite de Risco Significativo' (R$ {{{significantRiskThresholdAmount}}}).\n\nSe um risco significativo for detectado:\n  - Defina 'hasSignificantRisk' como true.\n  - Defina 'voltIndicatorRequired' como true.\n  - Gere uma mensagem de alerta concisa e acionável (máximo 2-3 frases). A mensagem deve explicar claramente o projeto específico, a tarefa atrasada, o impacto financeiro diário e como isso afeta diretamente o ROI e o prazo final do projeto. Seja direto, profissional e foque no impacto e na ação.\n\nSe um risco significativo NÃO for detectado:\n  - Defina 'hasSignificantRisk' como false.\n  - Defina 'voltIndicatorRequired' como false.\n  - Defina 'alertMessage' como uma string vazia.\n\nExemplo de uma mensagem de alerta concisa (somente se o risco for significativo): "Alerta: O projeto 'Lançamento Alfa' enfrenta um risco de ROI significativo. A tarefa 'Integração de Backend' de João Pereira está atrasada, incorrendo em um custo diário de R$500. Isso impacta a meta de 'Aumento de Vendas', adiando o prazo final do projeto em 5 dias e ameaça a lucratividade geral."`,
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
  // Gracefully handle missing API key to prevent app crashes.
  if (!process.env.GEMINI_API_KEY) {
    console.warn(
      "GEMINI_API_KEY is not set. Niko AI alerts are disabled. Add your key to the .env file to enable them."
    );
    return {
      hasSignificantRisk: false,
      alertMessage: "",
      voltIndicatorRequired: false,
    };
  }

  const significantRiskThresholdAmount = input.targetGainValue * input.riskThresholdPercentage;
  const flowInput: NikoRoiRiskAlertInput = {
    ...input,
    significantRiskThresholdAmount,
  };
  
  try {
    return await nikoRoiRiskAlertFlow(flowInput);
  } catch (error: any) {
    // Log the actual error for debugging, but don't let it crash the app.
    console.error("Niko AI Alert failed:", error.message || error);
    // Return a default "no risk" state to the UI.
    // This prevents the error overlay from showing for API-related issues like rate limiting.
    return {
      hasSignificantRisk: false,
      alertMessage: "",
      voltIndicatorRequired: false,
    };
  }
}
