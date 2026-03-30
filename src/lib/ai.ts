import Anthropic from '@anthropic-ai/sdk';
import { Annotation, FeedbackSummary, ActionItem } from './types';
import { generateId, now } from './utils';

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_api_key_here') {
    return null;
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export function isAIAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_api_key_here';
}

export async function summarizeFeedback(
  assetName: string,
  projectName: string,
  clientName: string,
  versionNumber: number,
  versionId: string,
  assetId: string,
  feedbackAnnotations: Annotation[]
): Promise<FeedbackSummary | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  const annotationsText = feedbackAnnotations
    .map(
      (a) =>
        `Pin #${a.pinNumber} (posição: ${a.x.toFixed(0)}%, ${a.y.toFixed(0)}%):
  "${a.comment}" — por ${a.author}
  Status: ${a.resolved ? 'Resolvido' : 'Pendente'}${
          a.replies.length > 0
            ? '\n  Respostas:\n' + a.replies.map((r) => `    "${r.comment}" — por ${r.author}`).join('\n')
            : ''
        }`
    )
    .join('\n\n');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6-20250514',
    max_tokens: 1024,
    system: `Você é um assistente especializado em design e marketing. Analise as anotações de feedback de um cliente sobre um material de marketing e gere um resumo acionável para o designer. Responda SEMPRE em português brasileiro. Retorne APENAS um JSON válido sem markdown.`,
    messages: [
      {
        role: 'user',
        content: `Asset: "${assetName}"
Projeto: "${projectName}"
Cliente: "${clientName}"
Versão: ${versionNumber}

Anotações do cliente:
${annotationsText}

Gere um JSON com esta estrutura exata:
{
  "summaryText": "resumo narrativo consolidado de todo feedback em 2-3 frases",
  "overallSentiment": "positivo" ou "neutro" ou "negativo" ou "misto",
  "actionItems": [
    {
      "description": "o que o designer precisa fazer",
      "priority": "alta" ou "media" ou "baixa",
      "category": "tipografia" ou "cores" ou "layout" ou "conteudo" ou "imagem" ou "outro",
      "relatedPinNumbers": [1, 2]
    }
  ]
}`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const parsed = JSON.parse(text);

    const actionItems: ActionItem[] = (parsed.actionItems || []).map(
      (item: { description: string; priority: string; category: string; relatedPinNumbers?: number[] }) => ({
        id: generateId(),
        description: item.description,
        priority: item.priority as 'alta' | 'media' | 'baixa',
        category: item.category,
        relatedAnnotationIds: (item.relatedPinNumbers || []).map((pin: number) => {
          const ann = feedbackAnnotations.find((a) => a.pinNumber === pin);
          return ann?.id || '';
        }).filter(Boolean),
      })
    );

    const summary: FeedbackSummary = {
      id: generateId(),
      assetId,
      versionId,
      generatedAt: now(),
      actionItems,
      overallSentiment: parsed.overallSentiment || 'neutro',
      summaryText: parsed.summaryText || '',
      rawAnnotationCount: feedbackAnnotations.length,
    };

    return summary;
  } catch {
    return null;
  }
}
