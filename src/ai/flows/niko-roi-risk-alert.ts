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
  daysAhead: z.number().describe("O número de dias que o projeto está adiantado. É 0 se o projeto não estiver adiantado."),
  significantRiskThresholdAmount: z.number().describe("O valor monetário a partir do qual o custo diário do atraso é considerado um risco financeiro significativo."),
});
export type NikoRoiRiskAlertInput = z.infer<typeof NikoRoiRiskAlertInputSchema>;

const NikoRoiRiskAlertOutputSchema = z.object({
  hasSignificantRisk: z.boolean().describe('Verdadeiro se um risco financeiro significativo para o ROI do projeto for detectado, falso caso contrário.'),
  alertMessage: z.string().describe('Uma mensagem concisa, gerada por IA, explicando o risco ou o status positivo do projeto.'),
  voltIndicatorRequired: z.boolean().describe('Verdadeiro se o indicador "Volt" deve ser mostrado (ou seja, um risco significativo é detectado), falso caso contrário.'),
});
export type NikoRoiRiskAlertOutput = z.infer<typeof NikoRoiRiskAlertOutputSchema>;

const prompt = ai.definePrompt({
  name: 'nikoRoiRiskAlertPrompt',
  input: {schema: NikoRoiRiskAlertInputSchema},
  output: {schema: NikoRoiRiskAlertOutputSchema},
  prompt: `Você é Niko, um assistente de IA e consultor especialista em gerenciamento de projetos para o Zenos Project. Seu objetivo principal é fornecer resumos executivos (The Bottom Line) e alertar proativamente sobre riscos financeiros para o ROI de um projeto.\n\nAnalise os seguintes detalhes do projeto e do atraso da tarefa:\nNome do Projeto: {{{projectName}}}\nTipo de Ganho Alvo do Projeto: {{{targetGainType}}}\nValor do Ganho Alvo do Projeto: R$ {{{targetGainValue}}}\nCusto Diário do Atraso: R$ {{{dailyCostOfDelay}}}\nTarefa Atrasada: {{{delayedTaskTitle}}}\nResponsável pela Tarefa: {{{delayedTaskResponsible}}}\nPrazo Original da Tarefa: {{{delayedTaskOriginalDeadline}}}\nNovo Prazo da Tarefa: {{{delayedTaskNewDeadline}}}\nImpacto no Prazo Final do Projeto: {{projectImpactDays}} dias\nDias de Folga no Cronograma: {{daysAhead}} dias\nValor do Limite de Risco Significativo: R$ {{{significantRiskThresholdAmount}}} (Se o Custo Diário do Atraso for >= a este valor, é um risco significativo)\n\nCom base nos dados, determine se o 'Custo Diário do Atraso' (R$ {{{dailyCostOfDelay}}}) representa um 'risco financeiro significativo' para o ROI do projeto. Um risco é significativo se o 'Custo Diário do Atraso' for maior ou igual ao 'Valor do Limite de Risco Significativo' (R$ {{{significantRiskThresholdAmount}}}).\n\nSe um risco significativo for detectado:\n  - Defina 'hasSignificantRisk' como true.\n  - Defina 'voltIndicatorRequired' como true.\n  - Gere uma mensagem de alerta concisa e acionável (máximo 2-3 frases) para 'alertMessage'. A mensagem deve ter tom de consultor de crise, explicando o projeto, a tarefa gargalo, o impacto financeiro e o que está em jogo para o ROI.\n\nSe um risco significativo NÃO for detectado:\n  - Defina 'hasSignificantRisk' como false.\n  - Defina 'voltIndicatorRequired' como false.\n  - Gere uma mensagem de resumo positiva e encorajadora (máximo 2-3 frases) para 'alertMessage'. A mensagem deve informar que o projeto está em dia, mencionar a folga de '{{daysAhead}}' dias (se for maior que zero), e reforçar a importância de manter o foco para garantir o ganho de R$ {{{targetGainValue}}}.\n\nExemplo de mensagem de alerta (risco significativo): "Alerta: O projeto 'Lançamento Alfa' enfrenta um risco de ROI. A tarefa 'Integração de Backend' está atrasada, gerando um prejuízo diário de R$500 e adiando o prazo final. A lucratividade do projeto está em jogo, precisamos ajustar a rota."\n\nExemplo de resumo positivo (sem risco): "O projeto 'Lançamento Alfa' está em dia, com uma folga de 5 dias no cronograma. Excelente trabalho da equipe! Manter o ritmo é crucial para garantir o ganho de R$ 1.500.000."`,
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
      alertMessage: "As análises de IA estão desativadas. Adicione uma chave de API para habilitá-las.",
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
      alertMessage: "Não foi possível gerar o resumo da IA no momento.",
      voltIndicatorRequired: false,
    };
  }
}
