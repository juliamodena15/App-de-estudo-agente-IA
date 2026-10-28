/**
 * Utilitários de data e formatação para prazos em português
 */

export function formatDateBR(dateString: string): string {
  if (!dateString) return 'Sem prazo';
  // Avoid timezone offset issue when parsing YYYY-MM-DD
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
  return dateString;
}

export interface DeadlineAnalysis {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  daysRemaining: number;
  badgeStyle: string;
}

export function analyzeDeadline(deadlineString: string, isCompleted: boolean): DeadlineAnalysis {
  if (!deadlineString) {
    return {
      label: 'Sem prazo',
      isOverdue: false,
      isToday: false,
      daysRemaining: 0,
      badgeStyle: 'bg-slate-100 text-slate-600',
    };
  }

  if (isCompleted) {
    return {
      label: formatDateBR(deadlineString),
      isOverdue: false,
      isToday: false,
      daysRemaining: 0,
      badgeStyle: 'bg-emerald-50 text-emerald-700',
    };
  }

  const parts = deadlineString.split('-');
  if (parts.length !== 3) {
    return {
      label: deadlineString,
      isOverdue: false,
      isToday: false,
      daysRemaining: 0,
      badgeStyle: 'bg-slate-100 text-slate-600',
    };
  }

  const targetDate = new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10)
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return {
      label: daysAgo === 1 ? 'Atrasado há 1 dia' : `Atrasado há ${daysAgo} dias`,
      isOverdue: true,
      isToday: false,
      daysRemaining: diffDays,
      badgeStyle: 'bg-rose-50 text-rose-700 border border-rose-200 font-medium',
    };
  }

  if (diffDays === 0) {
    return {
      label: 'Vence hoje!',
      isOverdue: false,
      isToday: true,
      daysRemaining: 0,
      badgeStyle: 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold animate-pulse',
    };
  }

  if (diffDays === 1) {
    return {
      label: 'Vence amanhã',
      isOverdue: false,
      isToday: false,
      daysRemaining: 1,
      badgeStyle: 'bg-amber-50 text-amber-800 border border-amber-200',
    };
  }

  if (diffDays <= 7) {
    return {
      label: `Faltam ${diffDays} dias`,
      isOverdue: false,
      isToday: false,
      daysRemaining: diffDays,
      badgeStyle: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    };
  }

  return {
    label: `Prazo: ${formatDateBR(deadlineString)}`,
    isOverdue: false,
    isToday: false,
    daysRemaining: diffDays,
    badgeStyle: 'bg-slate-100 text-slate-700',
  };
}
