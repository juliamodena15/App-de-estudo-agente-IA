import React from 'react';
import { Target, Clock, CheckCircle2, CircleDashed } from 'lucide-react';
import { GoalStatus } from '../types/goal';

interface StatsCardsProps {
  total: number;
  notStarted: number;
  inProgress: number;
  completed: number;
  activeFilter: GoalStatus | 'todos';
  onSelectFilter: (status: GoalStatus | 'todos') => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  total,
  notStarted,
  inProgress,
  completed,
  activeFilter,
  onSelectFilter,
}) => {
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const cards = [
    {
      id: 'todos' as const,
      label: 'Total Cadastrado',
      count: total,
      subtext: total === 1 ? '1 objetivo no total' : `${total} objetivos no total`,
      icon: Target,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50/70',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-200',
      defaultBorder: 'border-slate-200/80',
    },
    {
      id: 'nao_iniciado' as const,
      label: 'Não Iniciados',
      count: notStarted,
      subtext: 'Planejados para começar',
      icon: CircleDashed,
      iconColor: 'text-slate-600',
      bgColor: 'bg-slate-100/80',
      activeBorder: 'border-slate-500 ring-2 ring-slate-200',
      defaultBorder: 'border-slate-200/80',
    },
    {
      id: 'em_andamento' as const,
      label: 'Em Andamento',
      count: inProgress,
      subtext: 'Foco ativo agora',
      icon: Clock,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      activeBorder: 'border-amber-500 ring-2 ring-amber-200',
      defaultBorder: 'border-slate-200/80',
    },
    {
      id: 'concluido' as const,
      label: 'Concluídos',
      count: completed,
      subtext: `${completionPercentage}% concluído`,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-200',
      defaultBorder: 'border-slate-200/80',
    },
  ];

  return (
    <section className="mb-6">
      {/* Progress Bar Header */}
      {total > 0 && (
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs mb-4">
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Progresso geral dos estudos
            </span>
            <span className="text-slate-900 font-semibold">{completionPercentage}% concluído</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Grid of Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeFilter === card.id;

          return (
            <button
              key={card.id}
              onClick={() => onSelectFilter(card.id)}
              type="button"
              className={`text-left p-3.5 sm:p-4 rounded-xl bg-white border transition-all cursor-pointer hover:shadow-xs ${
                isSelected ? card.activeBorder : `${card.defaultBorder} hover:border-slate-300`
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-lg ${card.bgColor} ${card.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.count}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 truncate">
                {card.subtext}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
