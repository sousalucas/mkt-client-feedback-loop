export function generateId(): string {
  return crypto.randomUUID();
}

export function now(): string {
  return new Date().toISOString();
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function relativeTime(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, 'ano'],
    [2592000, 'mes'],
    [86400, 'dia'],
    [3600, 'hora'],
    [60, 'minuto'],
  ];

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) {
      const plural = count > 1 ? (label === 'mes' ? 'es' : 's') : '';
      return `ha ${count} ${label}${plural}`;
    }
  }
  return 'agora mesmo';
}

export function avatarColor(name: string): string {
  const colors = [
    '#5b8def', '#7ba4f7', '#38bdf8', '#34d399',
    '#a78bfa', '#f87171', '#fbbf24', '#14b8a6',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const statusLabels: Record<string, string> = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  alteracoes_solicitadas: 'Alterações Solicitadas',
  em_revisao: 'Em Revisão',
};

export const statusColors: Record<string, string> = {
  pendente: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  aprovado: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  alteracoes_solicitadas: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  em_revisao: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};
