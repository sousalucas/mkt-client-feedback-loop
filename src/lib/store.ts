import {
  Project,
  Asset,
  Version,
  Annotation,
  FeedbackSummary,
  ProjectWithStats,
  CreateProjectRequest,
  CreateAnnotationRequest,
  UpdateAssetStatusRequest,
  AssetType,
} from './types';
import { generateId, now } from './utils';

const projects = new Map<string, Project>();
const assets = new Map<string, Asset>();
const versions = new Map<string, Version>();
const annotations = new Map<string, Annotation>();
const feedbackSummaries = new Map<string, FeedbackSummary>();

function generatePlaceholderSvg(
  w: number,
  h: number,
  label: string,
  colors: [string, string]
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors[0]}"/>
        <stop offset="100%" style="stop-color:${colors[1]}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="sans-serif" font-size="${Math.min(w, h) * 0.08}" font-weight="600" opacity="0.9">${label}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function seed() {
  if (projects.size > 0) return;

  const now1 = new Date(Date.now() - 2 * 86400000).toISOString();
  const now2 = new Date(Date.now() - 86400000).toISOString();
  const now3 = new Date(Date.now() - 3600000).toISOString();

  // Project 1: Campanha Verao 2026
  const p1Id = generateId();
  const a1Id = generateId();
  const a2Id = generateId();
  const a3Id = generateId();

  // Asset 1: Banner Principal - 2 versions
  const v1_1Id = generateId();
  const v1_2Id = generateId();

  const bannerV1 = generatePlaceholderSvg(800, 400, 'Banner v1 - Campanha Verão', ['#6366F1', '#8B5CF6']);
  const bannerV2 = generatePlaceholderSvg(800, 400, 'Banner v2 - Campanha Verão', ['#8B5CF6', '#A78BFA']);

  versions.set(v1_1Id, {
    id: v1_1Id, assetId: a1Id, versionNumber: 1,
    fileData: bannerV1, fileName: 'banner_verao_v1.svg', mimeType: 'image/svg+xml',
    width: 800, height: 400, uploadedBy: 'Marina Silva', uploadedAt: now1,
    changeNote: 'Versão inicial do banner', annotationIds: [],
  });

  // Annotations on v2
  const ann1Id = generateId();
  const ann2Id = generateId();
  const ann3Id = generateId();
  const ann4Id = generateId();

  versions.set(v1_2Id, {
    id: v1_2Id, assetId: a1Id, versionNumber: 2,
    fileData: bannerV2, fileName: 'banner_verao_v2.svg', mimeType: 'image/svg+xml',
    width: 800, height: 400, uploadedBy: 'Marina Silva', uploadedAt: now2,
    changeNote: 'Ajuste nas cores e tipografia', annotationIds: [ann1Id, ann2Id, ann3Id, ann4Id],
  });

  annotations.set(ann1Id, {
    id: ann1Id, versionId: v1_2Id, assetId: a1Id,
    x: 25, y: 30, pinNumber: 1,
    comment: 'A fonte do título precisa ser mais bold. Está difícil de ler no mobile.',
    author: 'Carlos Mendes', createdAt: now2, resolved: false, replies: [
      { id: generateId(), annotationId: ann1Id, comment: 'Concordo, vou ajustar para 700 weight.', author: 'Marina Silva', createdAt: now3 },
    ],
  });
  annotations.set(ann2Id, {
    id: ann2Id, versionId: v1_2Id, assetId: a1Id,
    x: 70, y: 50, pinNumber: 2,
    comment: 'O CTA "Compre Agora" precisa de mais destaque. Talvez um botão com fundo contrastante?',
    author: 'Carlos Mendes', createdAt: now2, resolved: false, replies: [],
  });
  annotations.set(ann3Id, {
    id: ann3Id, versionId: v1_2Id, assetId: a1Id,
    x: 50, y: 15, pinNumber: 3,
    comment: 'Adorei o gradiente! Mantém essa paleta de cores.',
    author: 'Ana Beatriz', createdAt: now3, resolved: true, replies: [],
  });
  annotations.set(ann4Id, {
    id: ann4Id, versionId: v1_2Id, assetId: a1Id,
    x: 85, y: 80, pinNumber: 4,
    comment: 'O logo da marca está muito pequeno nesse canto. Aumentar pelo menos 20%.',
    author: 'Carlos Mendes', createdAt: now3, resolved: false, replies: [],
  });

  assets.set(a1Id, {
    id: a1Id, projectId: p1Id, name: 'Banner Principal', type: 'image',
    status: 'alteracoes_solicitadas', currentVersionId: v1_2Id,
    versionIds: [v1_1Id, v1_2Id], createdAt: now1, updatedAt: now2, createdBy: 'Marina Silva',
  });

  // Asset 2: Stories Instagram - 1 version
  const v2_1Id = generateId();
  const storiesSvg = generatePlaceholderSvg(540, 960, 'Stories Instagram', ['#EC4899', '#F59E0B']);
  const ann5Id = generateId();
  const ann6Id = generateId();

  versions.set(v2_1Id, {
    id: v2_1Id, assetId: a2Id, versionNumber: 1,
    fileData: storiesSvg, fileName: 'stories_verao.svg', mimeType: 'image/svg+xml',
    width: 540, height: 960, uploadedBy: 'Marina Silva', uploadedAt: now2,
    annotationIds: [ann5Id, ann6Id],
  });

  annotations.set(ann5Id, {
    id: ann5Id, versionId: v2_1Id, assetId: a2Id,
    x: 50, y: 40, pinNumber: 1,
    comment: 'Texto está cortando na borda. Precisa de safe zone maior.',
    author: 'Ana Beatriz', createdAt: now3, resolved: false, replies: [],
  });
  annotations.set(ann6Id, {
    id: ann6Id, versionId: v2_1Id, assetId: a2Id,
    x: 50, y: 85, pinNumber: 2,
    comment: 'Adicionar swipe up CTA aqui embaixo.',
    author: 'Carlos Mendes', createdAt: now3, resolved: false, replies: [],
  });

  assets.set(a2Id, {
    id: a2Id, projectId: p1Id, name: 'Stories Instagram', type: 'image',
    status: 'pendente', currentVersionId: v2_1Id,
    versionIds: [v2_1Id], createdAt: now2, updatedAt: now2, createdBy: 'Marina Silva',
  });

  // Asset 3: Email Marketing - 3 versions, approved
  const v3_1Id = generateId();
  const v3_2Id = generateId();
  const v3_3Id = generateId();
  const emailSvg1 = generatePlaceholderSvg(600, 800, 'Email Marketing v1', ['#3B82F6', '#6366F1']);
  const emailSvg2 = generatePlaceholderSvg(600, 800, 'Email Marketing v2', ['#6366F1', '#8B5CF6']);
  const emailSvg3 = generatePlaceholderSvg(600, 800, 'Email Marketing v3', ['#10B981', '#14B8A6']);

  versions.set(v3_1Id, {
    id: v3_1Id, assetId: a3Id, versionNumber: 1,
    fileData: emailSvg1, fileName: 'email_v1.svg', mimeType: 'image/svg+xml',
    width: 600, height: 800, uploadedBy: 'Marina Silva', uploadedAt: now1,
    annotationIds: [],
  });
  versions.set(v3_2Id, {
    id: v3_2Id, assetId: a3Id, versionNumber: 2,
    fileData: emailSvg2, fileName: 'email_v2.svg', mimeType: 'image/svg+xml',
    width: 600, height: 800, uploadedBy: 'Marina Silva', uploadedAt: now2,
    changeNote: 'Reestruturei o layout do email', annotationIds: [],
  });

  const ann7Id = generateId();
  versions.set(v3_3Id, {
    id: v3_3Id, assetId: a3Id, versionNumber: 3,
    fileData: emailSvg3, fileName: 'email_v3.svg', mimeType: 'image/svg+xml',
    width: 600, height: 800, uploadedBy: 'Marina Silva', uploadedAt: now3,
    changeNote: 'Versão final com ajustes', annotationIds: [ann7Id],
  });

  annotations.set(ann7Id, {
    id: ann7Id, versionId: v3_3Id, assetId: a3Id,
    x: 50, y: 50, pinNumber: 1,
    comment: 'Perfeito! Exatamente o que precisávamos. Aprovado!',
    author: 'Carlos Mendes', createdAt: now3, resolved: true, replies: [],
  });

  assets.set(a3Id, {
    id: a3Id, projectId: p1Id, name: 'Email Marketing', type: 'image',
    status: 'aprovado', currentVersionId: v3_3Id,
    versionIds: [v3_1Id, v3_2Id, v3_3Id], createdAt: now1, updatedAt: now3, createdBy: 'Marina Silva',
  });

  projects.set(p1Id, {
    id: p1Id, name: 'Campanha Verão 2026', description: 'Material completo para a campanha de verão incluindo banners, stories e email marketing.',
    client: 'Loja Tropical', createdAt: now1, updatedAt: now3, assetIds: [a1Id, a2Id, a3Id],
  });

  // Project 2: Rebranding Logo
  const p2Id = generateId();
  const a4Id = generateId();
  const a5Id = generateId();

  const v4_1Id = generateId();
  const logoA = generatePlaceholderSvg(600, 600, 'Logo A - TechStart', ['#14B8A6', '#3B82F6']);
  const ann8Id = generateId();
  const ann9Id = generateId();
  const ann10Id = generateId();

  versions.set(v4_1Id, {
    id: v4_1Id, assetId: a4Id, versionNumber: 1,
    fileData: logoA, fileName: 'logo_a.svg', mimeType: 'image/svg+xml',
    width: 600, height: 600, uploadedBy: 'Pedro Alves', uploadedAt: now2,
    annotationIds: [ann8Id, ann9Id, ann10Id],
  });

  annotations.set(ann8Id, {
    id: ann8Id, versionId: v4_1Id, assetId: a4Id,
    x: 30, y: 45, pinNumber: 1,
    comment: 'O ícone precisa transmitir mais inovação. Está muito genérico.',
    author: 'Roberto Chen', createdAt: now3, resolved: false, replies: [],
  });
  annotations.set(ann9Id, {
    id: ann9Id, versionId: v4_1Id, assetId: a4Id,
    x: 60, y: 70, pinNumber: 2,
    comment: 'A tipografia está boa mas quero ver uma versão em sans-serif também.',
    author: 'Roberto Chen', createdAt: now3, resolved: false, replies: [
      { id: generateId(), annotationId: ann9Id, comment: 'Vou preparar variações com Helvetica e Inter.', author: 'Pedro Alves', createdAt: now3 },
    ],
  });
  annotations.set(ann10Id, {
    id: ann10Id, versionId: v4_1Id, assetId: a4Id,
    x: 50, y: 20, pinNumber: 3,
    comment: 'As cores estão muito frias. Podemos testar com tons mais quentes?',
    author: 'Roberto Chen', createdAt: now3, resolved: false, replies: [],
  });

  assets.set(a4Id, {
    id: a4Id, projectId: p2Id, name: 'Logo Variação A', type: 'image',
    status: 'em_revisao', currentVersionId: v4_1Id,
    versionIds: [v4_1Id], createdAt: now2, updatedAt: now3, createdBy: 'Pedro Alves',
  });

  const v5_1Id = generateId();
  const logoB = generatePlaceholderSvg(600, 600, 'Logo B - TechStart', ['#F59E0B', '#EF4444']);

  versions.set(v5_1Id, {
    id: v5_1Id, assetId: a5Id, versionNumber: 1,
    fileData: logoB, fileName: 'logo_b.svg', mimeType: 'image/svg+xml',
    width: 600, height: 600, uploadedBy: 'Pedro Alves', uploadedAt: now2,
    annotationIds: [],
  });

  assets.set(a5Id, {
    id: a5Id, projectId: p2Id, name: 'Logo Variação B', type: 'image',
    status: 'pendente', currentVersionId: v5_1Id,
    versionIds: [v5_1Id], createdAt: now2, updatedAt: now2, createdBy: 'Pedro Alves',
  });

  projects.set(p2Id, {
    id: p2Id, name: 'Rebranding Logo', description: 'Redesign completo da identidade visual da TechStart.',
    client: 'TechStart', createdAt: now2, updatedAt: now3, assetIds: [a4Id, a5Id],
  });
}

// Auto-seed on import
seed();

function getProjectStats(project: Project): ProjectWithStats {
  const projectAssets = project.assetIds.map((id) => assets.get(id)!).filter(Boolean);
  return {
    ...project,
    totalAssets: projectAssets.length,
    pendingCount: projectAssets.filter((a) => a.status === 'pendente').length,
    approvedCount: projectAssets.filter((a) => a.status === 'aprovado').length,
    changesRequestedCount: projectAssets.filter((a) => a.status === 'alteracoes_solicitadas').length,
  };
}

export const db = {
  projects: {
    getAll(): ProjectWithStats[] {
      return Array.from(projects.values())
        .map(getProjectStats)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    },
    getById(id: string): ProjectWithStats | undefined {
      const p = projects.get(id);
      return p ? getProjectStats(p) : undefined;
    },
    create(data: CreateProjectRequest): Project {
      const id = generateId();
      const timestamp = now();
      const project: Project = {
        id, ...data, createdAt: timestamp, updatedAt: timestamp, assetIds: [],
      };
      projects.set(id, project);
      return project;
    },
    update(id: string, data: Partial<Project>): Project | undefined {
      const p = projects.get(id);
      if (!p) return undefined;
      const updated = { ...p, ...data, updatedAt: now() };
      projects.set(id, updated);
      return updated;
    },
    delete(id: string): boolean {
      const p = projects.get(id);
      if (!p) return false;
      p.assetIds.forEach((aId) => db.assets.delete(aId));
      projects.delete(id);
      return true;
    },
  },

  assets: {
    getByProject(projectId: string): Asset[] {
      const p = projects.get(projectId);
      if (!p) return [];
      return p.assetIds.map((id) => assets.get(id)!).filter(Boolean);
    },
    getById(id: string): Asset | undefined {
      return assets.get(id);
    },
    create(
      projectId: string,
      data: { name: string; type: AssetType; fileName: string; mimeType: string; fileData: string; uploadedBy: string }
    ): Asset | undefined {
      const p = projects.get(projectId);
      if (!p) return undefined;

      const assetId = generateId();
      const versionId = generateId();
      const timestamp = now();

      const version: Version = {
        id: versionId, assetId, versionNumber: 1,
        fileData: data.fileData, fileName: data.fileName, mimeType: data.mimeType,
        uploadedBy: data.uploadedBy, uploadedAt: timestamp, annotationIds: [],
      };
      versions.set(versionId, version);

      const asset: Asset = {
        id: assetId, projectId, name: data.name, type: data.type,
        status: 'pendente', currentVersionId: versionId,
        versionIds: [versionId], createdAt: timestamp, updatedAt: timestamp,
        createdBy: data.uploadedBy,
      };
      assets.set(assetId, asset);

      p.assetIds.push(assetId);
      p.updatedAt = timestamp;
      projects.set(p.id, p);

      return asset;
    },
    updateStatus(id: string, data: UpdateAssetStatusRequest): Asset | undefined {
      const a = assets.get(id);
      if (!a) return undefined;
      a.status = data.status;
      a.updatedAt = now();
      assets.set(id, a);

      const p = projects.get(a.projectId);
      if (p) {
        p.updatedAt = a.updatedAt;
        projects.set(p.id, p);
      }
      return a;
    },
    delete(id: string): boolean {
      const a = assets.get(id);
      if (!a) return false;
      a.versionIds.forEach((vId) => {
        const v = versions.get(vId);
        if (v) v.annotationIds.forEach((annId) => annotations.delete(annId));
        versions.delete(vId);
      });
      assets.delete(id);

      const p = projects.get(a.projectId);
      if (p) {
        p.assetIds = p.assetIds.filter((aId) => aId !== id);
        p.updatedAt = now();
        projects.set(p.id, p);
      }
      return true;
    },
  },

  versions: {
    getByAsset(assetId: string): Version[] {
      const a = assets.get(assetId);
      if (!a) return [];
      return a.versionIds.map((id) => versions.get(id)!).filter(Boolean);
    },
    getById(id: string): Version | undefined {
      return versions.get(id);
    },
    create(
      assetId: string,
      data: { fileName: string; mimeType: string; fileData: string; uploadedBy: string; changeNote?: string }
    ): Version | undefined {
      const a = assets.get(assetId);
      if (!a) return undefined;

      const versionId = generateId();
      const timestamp = now();
      const versionNumber = a.versionIds.length + 1;

      const version: Version = {
        id: versionId, assetId, versionNumber,
        fileData: data.fileData, fileName: data.fileName, mimeType: data.mimeType,
        uploadedBy: data.uploadedBy, uploadedAt: timestamp,
        changeNote: data.changeNote, annotationIds: [],
      };
      versions.set(versionId, version);

      a.versionIds.push(versionId);
      a.currentVersionId = versionId;
      a.status = 'em_revisao';
      a.updatedAt = timestamp;
      assets.set(assetId, a);

      const p = projects.get(a.projectId);
      if (p) {
        p.updatedAt = timestamp;
        projects.set(p.id, p);
      }

      return version;
    },
  },

  annotations: {
    getByVersion(versionId: string): Annotation[] {
      const v = versions.get(versionId);
      if (!v) return [];
      return v.annotationIds.map((id) => annotations.get(id)!).filter(Boolean);
    },
    create(data: CreateAnnotationRequest): Annotation | undefined {
      const v = versions.get(data.versionId);
      if (!v) return undefined;

      const id = generateId();
      const pinNumber = v.annotationIds.length + 1;

      const annotation: Annotation = {
        id, versionId: data.versionId, assetId: v.assetId,
        x: data.x, y: data.y, pinNumber,
        comment: data.comment, author: data.author,
        createdAt: now(), resolved: false, replies: [],
      };
      annotations.set(id, annotation);

      v.annotationIds.push(id);
      versions.set(v.id, v);

      return annotation;
    },
    resolve(id: string): Annotation | undefined {
      const a = annotations.get(id);
      if (!a) return undefined;
      a.resolved = !a.resolved;
      annotations.set(id, a);
      return a;
    },
    addReply(annotationId: string, author: string, comment: string) {
      const a = annotations.get(annotationId);
      if (!a) return undefined;
      const reply = { id: generateId(), annotationId, comment, author, createdAt: now() };
      a.replies.push(reply);
      annotations.set(annotationId, a);
      return reply;
    },
  },

  summaries: {
    getByVersion(versionId: string): FeedbackSummary | undefined {
      return Array.from(feedbackSummaries.values()).find((s) => s.versionId === versionId);
    },
    save(summary: FeedbackSummary): void {
      feedbackSummaries.set(summary.id, summary);
    },
  },
};
