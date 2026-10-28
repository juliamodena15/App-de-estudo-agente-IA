import React from 'react';
import { Calendar, Edit3, Trash2, Tag, Check, ArrowRight } from 'lucide-react';
import { Goal, GoalStatus, STATUS_CONFIG } from '../types/goal';
import { analyzeDeadline } from '../utils/dateUtils';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onRequestDelete: (goal: Goal) => void;
  onStatusChange: (id: string, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onRequestDelete,
  onStatusChange,
}) => {
  const isCompleted = goal.status === 'concluido';
  const statusConfig = STATUS_CONFIG[goal.status];
  const deadlineInfo = analyzeDeadline(goal.deadline, isCompleted);

  // Status transitions
  const nextStatusMap: Record<GoalStatus, GoalStatus> = {
    nao_iniciado: 'em_andamento',
    em_andamento: 'concluido',
    concluido: 'nao_iniciado',
  };

  const nextStatusActionLabel: Record<GoalStatus, string> = {
    nao_iniciado: 'Iniciar estudo',
    em_andamento: 'Concluir meta',
    concluido: 'Reabrir meta',
  };

  return (
    <div
      className={`group bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
        isCompleted
          ? 'border-emerald-200 bg-emerald-50/20'
          : deadlineInfo.isOverdue
          ? 'border-rose-200 hover:border-rose-300'
          : 'border-slate-200/90 hover:border-indigo-200'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Top bar: Status & Category */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
              {statusConfig.label}
            </span>

            {goal.category && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                <Tag className="w-3 h-3 text-slate-400" />
                {goal.category}
              </span>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(goal)}
              type="button"
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Editar objetivo"
              aria-label="Editar objetivo"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRequestDelete(goal)}
              type="button"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Excluir objetivo"
              aria-label="Excluir objetivo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-base font-bold text-slate-900 leading-snug mb-2 ${
            isCompleted ? 'line-through text-slate-500 font-semibold' : ''
          }`}
        >
          {goal.title}
        </h3>

        {/* Description */}
        {goal.description ? (
          <p
            className={`text-sm text-slate-600 line-clamp-3 mb-4 whitespace-pre-line leading-relaxed ${
              isCompleted ? 'text-slate-400' : ''
            }`}
          >
            {goal.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mb-4">Sem descrição detalhada.</p>
        )}
      </div>

      {/* Footer: Deadline & Quick Advance */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50/70 border-t border-slate-100 rounded-b-xl flex items-center justify-between gap-2 flex-wrap">
        {/* Deadline Indicator */}
        <div className="flex items-center gap-1.5 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className={`px-2 py-0.5 rounded-md text-xs ${deadlineInfo.badgeStyle}`}>
            {deadlineInfo.label}
          </span>
        </div>

        {/* Fast Action to change status */}
        <button
          onClick={() => onStatusChange(goal.id, nextStatusMap[goal.status])}
          type="button"
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            isCompleted
              ? 'text-slate-600 hover:bg-slate-200/70'
              : goal.status === 'em_andamento'
              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
              : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
          }`}
          title={`Avançar status para: ${STATUS_CONFIG[nextStatusMap[goal.status]].label}`}
        >
          {isCompleted ? (
            <span>Reabrir</span>
          ) : goal.status === 'em_andamento' ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Concluir</span>
            </>
          ) : (
            <>
              <span>Iniciar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
