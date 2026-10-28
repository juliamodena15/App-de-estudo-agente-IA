export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export type GoalPriority = 'baixa' | 'media' | 'alta';

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  status: GoalStatus;
  category?: string;
  createdAt: string; // ISO string
  updatedAt?: string;
}

export type GoalFormData = {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
  category?: string;
};

export const STATUS_CONFIG: Record<
  GoalStatus,
  {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    dotColor: string;
    description: string;
  }
> = {
  nao_iniciado: {
    label: 'Não iniciado',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
    dotColor: 'bg-slate-400',
    description: 'Objetivo planejado, aguardando início',
  },
  em_andamento: {
    label: 'Em andamento',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500',
    description: 'Estudo em progresso ativo',
  },
  concluido: {
    label: 'Concluído',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
    description: 'Meta alcançada com sucesso',
  },
};

export const COMMON_CATEGORIES = [
  'Programação & Tech',
  'Idiomas',
  'Faculdade / Escola',
  'Concursos & Provas',
  'Leituras & Livros',
  'Desenvolvimento Pessoal',
  'Geral',
];
