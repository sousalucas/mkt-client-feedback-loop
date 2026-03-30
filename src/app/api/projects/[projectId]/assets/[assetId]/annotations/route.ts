import { db } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  const url = new URL(request.url);
  const versionId = url.searchParams.get('versionId');

  if (versionId) {
    return Response.json(db.annotations.getByVersion(versionId));
  }

  const asset = db.assets.getById(assetId);
  if (!asset) return Response.json([], { status: 200 });
  return Response.json(db.annotations.getByVersion(asset.currentVersionId));
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.versionId || !body.comment) {
    return Response.json({ error: 'Versão e comentário são obrigatórios' }, { status: 400 });
  }

  const annotation = db.annotations.create({
    versionId: body.versionId,
    x: body.x || 50,
    y: body.y || 50,
    comment: body.comment,
    author: body.author || 'Anônimo',
  });

  if (!annotation) return Response.json({ error: 'Versão não encontrada' }, { status: 404 });
  return Response.json(annotation, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();

  if (body.action === 'resolve' && body.annotationId) {
    const updated = db.annotations.resolve(body.annotationId);
    if (!updated) return Response.json({ error: 'Anotação não encontrada' }, { status: 404 });
    return Response.json(updated);
  }

  if (body.action === 'reply' && body.annotationId && body.comment) {
    const reply = db.annotations.addReply(body.annotationId, body.author || 'Anônimo', body.comment);
    if (!reply) return Response.json({ error: 'Anotação não encontrada' }, { status: 404 });
    return Response.json(reply);
  }

  return Response.json({ error: 'Ação inválida' }, { status: 400 });
}
