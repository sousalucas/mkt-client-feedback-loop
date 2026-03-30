import { db } from '@/lib/store';
import { isAIAvailable, summarizeFeedback } from '@/lib/ai';

export const dynamic = 'force-dynamic';

export async function POST(_request: Request, { params }: { params: Promise<{ projectId: string; assetId: string }> }) {
  const { projectId, assetId } = await params;

  if (!isAIAvailable()) {
    return Response.json({ error: 'API key da Anthropic não configurada. Adicione ANTHROPIC_API_KEY no .env.local' }, { status: 503 });
  }

  const project = db.projects.getById(projectId);
  const asset = db.assets.getById(assetId);
  if (!project || !asset) {
    return Response.json({ error: 'Projeto ou asset não encontrado' }, { status: 404 });
  }

  const currentVersion = db.versions.getById(asset.currentVersionId);
  if (!currentVersion) {
    return Response.json({ error: 'Versão não encontrada' }, { status: 404 });
  }

  const feedbackAnnotations = db.annotations.getByVersion(currentVersion.id);
  if (feedbackAnnotations.length === 0) {
    return Response.json({ error: 'Nenhuma anotação encontrada para gerar resumo' }, { status: 400 });
  }

  try {
    const summary = await summarizeFeedback(
      asset.name,
      project.name,
      project.client,
      currentVersion.versionNumber,
      currentVersion.id,
      assetId,
      feedbackAnnotations
    );

    if (!summary) {
      return Response.json({ error: 'Falha ao gerar resumo com IA' }, { status: 500 });
    }

    db.summaries.save(summary);
    return Response.json(summary);
  } catch (error) {
    console.error('AI summarization error:', error);
    return Response.json({ error: 'Erro interno ao processar com IA' }, { status: 500 });
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  const asset = db.assets.getById(assetId);
  if (!asset) return Response.json(null);

  const summary = db.summaries.getByVersion(asset.currentVersionId);
  return Response.json(summary || null);
}
