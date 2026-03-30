import { db } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  const asset = db.assets.getById(assetId);
  if (!asset) return Response.json({ error: 'Asset não encontrado' }, { status: 404 });

  const currentVersion = db.versions.getById(asset.currentVersionId);
  const allVersions = db.versions.getByAsset(assetId);
  const currentAnnotations = currentVersion
    ? db.annotations.getByVersion(currentVersion.id)
    : [];

  return Response.json({
    asset,
    currentVersion,
    versions: allVersions,
    annotations: currentAnnotations,
  });
}

export async function PUT(request: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  const body = await request.json();

  if (body.status) {
    const updated = db.assets.updateStatus(assetId, {
      status: body.status,
      reviewer: body.reviewer || 'Anônimo',
      comment: body.comment,
    });
    if (!updated) return Response.json({ error: 'Asset não encontrado' }, { status: 404 });
    return Response.json(updated);
  }

  return Response.json({ error: 'Ação inválida' }, { status: 400 });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  const deleted = db.assets.delete(assetId);
  if (!deleted) return Response.json({ error: 'Asset não encontrado' }, { status: 404 });
  return Response.json({ success: true });
}
