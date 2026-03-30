export type AssetStatus = 'pendente' | 'aprovado' | 'alteracoes_solicitadas' | 'em_revisao';
export type AssetType = 'image' | 'video';

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  createdAt: string;
  updatedAt: string;
  assetIds: string[];
}

export interface Asset {
  id: string;
  projectId: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  currentVersionId: string;
  versionIds: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Version {
  id: string;
  assetId: string;
  versionNumber: number;
  fileData: string;
  fileName: string;
  mimeType: string;
  width?: number;
  height?: number;
  uploadedBy: string;
  uploadedAt: string;
  changeNote?: string;
  annotationIds: string[];
}

export interface Annotation {
  id: string;
  versionId: string;
  assetId: string;
  x: number;
  y: number;
  pinNumber: number;
  comment: string;
  author: string;
  createdAt: string;
  resolved: boolean;
  replies: Reply[];
}

export interface Reply {
  id: string;
  annotationId: string;
  comment: string;
  author: string;
  createdAt: string;
}

export interface FeedbackSummary {
  id: string;
  assetId: string;
  versionId: string;
  generatedAt: string;
  actionItems: ActionItem[];
  overallSentiment: 'positivo' | 'neutro' | 'negativo' | 'misto';
  summaryText: string;
  rawAnnotationCount: number;
}

export interface ActionItem {
  id: string;
  description: string;
  priority: 'alta' | 'media' | 'baixa';
  relatedAnnotationIds: string[];
  category: string;
}

export interface ProjectWithStats extends Project {
  totalAssets: number;
  pendingCount: number;
  approvedCount: number;
  changesRequestedCount: number;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  client: string;
}

export interface CreateAnnotationRequest {
  versionId: string;
  x: number;
  y: number;
  comment: string;
  author: string;
}

export interface UpdateAssetStatusRequest {
  status: AssetStatus;
  reviewer: string;
  comment?: string;
}
