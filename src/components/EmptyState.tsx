import React from 'react';
import { BookOpen, SearchX, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenNewGoal: () => void;
  onResetFilters?: () => void;
  onRestoreDemo?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenNewGoal,
  onResetFilters,
  onRestoreDemo,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1.5">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
          Não encontramos nenhum objetivo correspondente aos critérios de busca ou filtros aplicados.
        </p>
        <div className="flex items-center justify-center gap-3">
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              type="button"
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Limpar todos os filtros
            </button>
          )}
          <button
            onClick={onOpenNewGoal}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar objetivo</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
        <BookOpen className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        Nenhum objetivo cadastrado ainda
      </h3>
      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
        Bem-vindo ao <strong>StudyFlow</strong>! Dê o primeiro passo na sua jornada de aprendizado cadastrando o que você deseja estudar nos próximos dias.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={onOpenNewGoal}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm shadow-indigo-300 transition-all cursor-pointer hover:shadow"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Primeiro Objetivo</span>
        </button>

        {onRestoreDemo && (
          <button
            onClick={onRestoreDemo}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Carregar Objetivos de Exemplo</span>
          </button>
        )}
      </div>
    </div>
  );
};
