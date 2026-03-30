import { db } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const assetList = db.assets.getByProject(projectId);
  return Response.json(assetList);
}

export async function POST(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const body = await request.json();

  if (!body.name || !body.fileData) {
    return Response.json({ error: 'Nome e arquivo são obrigatórios' }, { status: 400 });
  }

  const asset = db.assets.create(projectId, {
    name: body.name,
    type: body.type || 'image',
    fileName: body.fileName || 'upload.png',
    mimeType: body.mimeType || 'image/png',
    fileData: body.fileData,
    uploadedBy: body.uploadedBy || 'Anônimo',
  });

  if (!asset) return Response.json({ error: 'Projeto não encontrado' }, { status: 404 });
  return Response.json(asset, { status: 201 });
}
