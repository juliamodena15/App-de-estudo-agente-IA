import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { GoalStatus, STATUS_CONFIG } from '../types/goal';

export type SortOption = 'deadline_asc' | 'deadline_desc' | 'created_desc' | 'title_asc';

interface GoalFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: GoalStatus | 'todos';
  onStatusChange: (status: GoalStatus | 'todos') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  totalFilteredCount: number;
  totalAllCount: number;
  onResetFilters: () => void;
}

export const GoalFilters: React.FC<GoalFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalFilteredCount,
  totalAllCount,
  onResetFilters,
}) => {
  const isFiltering =
    searchTerm !== '' || statusFilter !== 'todos' || selectedCategory !== 'todas';

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs mb-6 space-y-3.5">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              type="button"
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="todas">Todas as áreas</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort */}
        <div className="sm:w-52">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="deadline_asc">Prazo mais próximo</option>
              <option value="deadline_desc">Prazo mais distante</option>
              <option value="created_desc">Mais recentes primeiro</option>
              <option value="title_asc">Título (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Pills and Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-slate-400 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Status:
          </span>

          <button
            onClick={() => onStatusChange('todos')}
            type="button"
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              statusFilter === 'todos'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({totalAllCount})
          </button>

          {(['nao_iniciado', 'em_andamento', 'concluido'] as GoalStatus[]).map((st) => {
            const config = STATUS_CONFIG[st];
            const isSelected = statusFilter === st;

            return (
              <button
                key={st}
                onClick={() => onStatusChange(st)}
                type="button"
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? `${config.bgColor} ${config.textColor} border ${config.borderColor} ring-1 ring-slate-400 font-semibold shadow-xs`
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Count info and clear button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500">
          <span>
            Exibindo <strong className="text-slate-800">{totalFilteredCount}</strong> de {totalAllCount} objetivos
          </span>
          {isFiltering && (
            <button
              onClick={onResetFilters}
              type="button"
              className="text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
