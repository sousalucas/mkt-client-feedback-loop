import { db } from '@/lib/store';
import { CreateProjectRequest } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const projects = db.projects.getAll();
  return Response.json(projects);
}

export async function POST(request: Request) {
  const body: CreateProjectRequest = await request.json();
  if (!body.name || !body.client) {
    return Response.json({ error: 'Nome e cliente são obrigatórios' }, { status: 400 });
  }
  const project = db.projects.create(body);
  return Response.json(project, { status: 201 });
}
