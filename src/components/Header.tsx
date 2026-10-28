import React from 'react';
import { Sparkles, Plus, BookOpen, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenNewGoal: () => void;
  onOpenTips: () => void;
  onResetDemo: () => void;
  totalGoals: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewGoal,
  onOpenTips,
  onResetDemo,
  totalGoals,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 backdrop-blur-md bg-white/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Study<span className="text-indigo-600">Flow</span>
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  v1.0
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                Organize seus objetivos de estudo com clareza e ritmo
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
            <button
              onClick={onOpenTips}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Ver dicas de como organizar seus estudos"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Dicas de Estudo</span>
            </button>

            {totalGoals === 0 && (
              <button
                onClick={onResetDemo}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Carregar exemplos para testar"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Carregar Exemplos</span>
              </button>
            )}

            <button
              onClick={onOpenNewGoal}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm shadow-indigo-300 transition-all cursor-pointer hover:shadow"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Novo Objetivo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
