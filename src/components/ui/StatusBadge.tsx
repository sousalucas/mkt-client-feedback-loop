import { AssetStatus } from '@/lib/types';
import { statusLabels, statusColors } from '@/lib/utils';

export function StatusBadge({ status, size = 'sm' }: { status: AssetStatus; size?: 'sm' | 'md' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${statusColors[status]} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          status === 'aprovado'
            ? 'bg-emerald-400'
            : status === 'alteracoes_solicitadas'
            ? 'bg-amber-400'
            : status === 'em_revisao'
            ? 'bg-blue-400'
            : 'bg-sky-400'
        }`}
      />
      {statusLabels[status]}
    </span>
  );
}
