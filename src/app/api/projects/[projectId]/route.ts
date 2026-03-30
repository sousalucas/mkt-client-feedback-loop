import { db } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = db.projects.getById(projectId);
  if (!project) return Response.json({ error: 'Projeto não encontrado' }, { status: 404 });
  return Response.json(project);
}

export async function PUT(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const body = await request.json();
  const project = db.projects.update(projectId, body);
  if (!project) return Response.json({ error: 'Projeto não encontrado' }, { status: 404 });
  return Response.json(project);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const deleted = db.projects.delete(projectId);
  if (!deleted) return Response.json({ error: 'Projeto não encontrado' }, { status: 404 });
  return Response.json({ success: true });
}
