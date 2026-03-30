import { db } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  const versionList = db.versions.getByAsset(assetId);
  return Response.json(versionList);
}

export async function POST(request: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  const body = await request.json();

  if (!body.fileData) {
    return Response.json({ error: 'Arquivo é obrigatório' }, { status: 400 });
  }

  const version = db.versions.create(assetId, {
    fileName: body.fileName || 'upload.png',
    mimeType: body.mimeType || 'image/png',
    fileData: body.fileData,
    uploadedBy: body.uploadedBy || 'Anônimo',
    changeNote: body.changeNote,
  });

  if (!version) return Response.json({ error: 'Asset não encontrado' }, { status: 404 });
  return Response.json(version, { status: 201 });
}
