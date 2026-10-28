import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { GoalFilters, SortOption } from './components/GoalFilters';
import { GoalCard } from './components/GoalCard';
import { GoalFormModal } from './components/GoalFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { StudyTipsModal } from './components/StudyTipsModal';
import { storageService } from './services/storageService';
import { Goal, GoalFormData, GoalStatus } from './types/goal';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);

  // Filters & Sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<GoalStatus | 'todos'>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [sortBy, setSortBy] = useState<SortOption>('deadline_asc');

  // Feedback toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3000);
  };

  // Carrega objetivos salvos no localStorage na inicialização
  useEffect(() => {
    const loaded = storageService.getGoals();
    setGoals(loaded);
  }, []);

  // Extrai lista única de categorias existentes
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    goals.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return Array.from(set).sort();
  }, [goals]);

  // Contadores para estatísticas
  const counts = useMemo(() => {
    const total = goals.length;
    const notStarted = goals.filter((g) => g.status === 'nao_iniciado').length;
    const inProgress = goals.filter((g) => g.status === 'em_andamento').length;
    const completed = goals.filter((g) => g.status === 'concluido').length;
    return { total, notStarted, inProgress, completed };
  }, [goals]);

  // Filtragem e ordenação dos objetivos
  const filteredAndSortedGoals = useMemo(() => {
    let result = [...goals];

    // Busca textual
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(term) ||
          g.description.toLowerCase().includes(term) ||
          (g.category && g.category.toLowerCase().includes(term))
      );
    }

    // Filtro por status
    if (statusFilter !== 'todos') {
      result = result.filter((g) => g.status === statusFilter);
    }

    // Filtro por categoria
    if (selectedCategory !== 'todas') {
      result = result.filter((g) => g.category === selectedCategory);
    }

    // Ordenação
    result.sort((a, b) => {
      if (sortBy === 'deadline_asc') {
        return (a.deadline || '').localeCompare(b.deadline || '');
      }
      if (sortBy === 'deadline_desc') {
        return (b.deadline || '').localeCompare(a.deadline || '');
      }
      if (sortBy === 'created_desc') {
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title, 'pt-BR');
      }
      return 0;
    });

    return result;
  }, [goals, searchTerm, statusFilter, selectedCategory, sortBy]);

  // Handler para cadastrar ou editar
  const handleSaveGoal = (formData: GoalFormData) => {
    if (editingGoal) {
      const updated = storageService.updateGoal(editingGoal.id, formData);
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        showToast('Objetivo atualizado com sucesso!');
      }
      setEditingGoal(null);
    } else {
      const created = storageService.createGoal(formData);
      setGoals((prev) => [created, ...prev]);
      showToast('Novo objetivo cadastrado!');
    }
  };

  // Handler para rápida alteração de status
  const handleQuickStatusChange = (id: string, newStatus: GoalStatus) => {
    const updated = storageService.updateGoal(id, { status: newStatus });
    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      const statusLabels: Record<GoalStatus, string> = {
        nao_iniciado: 'marcado como Não Iniciado',
        em_andamento: 'marcado como Em Andamento',
        concluido: 'concluído! Parabéns!',
      };
      showToast(`Objetivo ${statusLabels[newStatus]}`);
    }
  };

  // Confirmação de exclusão
  const handleConfirmDelete = () => {
    if (!goalToDelete) return;

    const success = storageService.deleteGoal(goalToDelete.id);
    if (success) {
      setGoals((prev) => prev.filter((g) => g.id !== goalToDelete.id));
      showToast('Objetivo excluído.');
    }
    setGoalToDelete(null);
  };

  // Restaura exemplos
  const handleResetDemo = () => {
    const demos = storageService.resetToDemo();
    setGoals(demos);
    setSearchTerm('');
    setStatusFilter('todos');
    setSelectedCategory('todas');
    showToast('Exemplos de objetivos recarregados!');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
    setSelectedCategory('todas');
  };

  const isFiltering =
    searchTerm !== '' || statusFilter !== 'todos' || selectedCategory !== 'todas';

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 text-sm animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        onOpenNewGoal={() => {
          setEditingGoal(null);
          setIsFormModalOpen(true);
        }}
        onOpenTips={() => setIsTipsModalOpen(true)}
        onResetDemo={handleResetDemo}
        totalGoals={goals.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Banner for Students */}
        <section className="mb-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-5 sm:p-7 text-white shadow-sm overflow-hidden relative">
          <div className="max-w-2xl relative z-10">
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-2">
              Jornada de Aprendizado
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              Qual é a sua próxima conquista hoje?
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed mb-4">
              Defina metas claras, acompanhe seus prazos sem ansiedade e comemore cada passo dado.
              Constância vale mais que intensidade!
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setEditingGoal(null);
                  setIsFormModalOpen(true);
                }}
                type="button"
                className="px-4 py-2 text-xs sm:text-sm font-semibold bg-white text-indigo-900 hover:bg-indigo-50 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                + Cadastrar Novo Objetivo
              </button>
              <button
                onClick={() => setIsTipsModalOpen(true)}
                type="button"
                className="px-4 py-2 text-xs sm:text-sm font-medium bg-indigo-700/60 hover:bg-indigo-700 text-white rounded-lg border border-indigo-500/40 transition-colors cursor-pointer"
              >
                Como definir metas realistas
              </button>
            </div>
          </div>
          {/* Subtle background glow */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        </section>

        {/* Quantidade de objetivos cadastrados & Resumo */}
        <StatsCards
          total={counts.total}
          notStarted={counts.notStarted}
          inProgress={counts.inProgress}
          completed={counts.completed}
          activeFilter={statusFilter}
          onSelectFilter={(newFilter) => setStatusFilter(newFilter)}
        />

        {/* Controles de Filtros e Busca */}
        {goals.length > 0 && (
          <GoalFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={availableCategories}
            totalFilteredCount={filteredAndSortedGoals.length}
            totalAllCount={goals.length}
            onResetFilters={handleResetFilters}
          />
        )}

        {/* Lista de Objetivos ou Estado Vazio */}
        {filteredAndSortedGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={(g) => {
                  setEditingGoal(g);
                  setIsFormModalOpen(true);
                }}
                onRequestDelete={(g) => setGoalToDelete(g)}
                onStatusChange={handleQuickStatusChange}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            isFiltered={isFiltering && goals.length > 0}
            onOpenNewGoal={() => {
              setEditingGoal(null);
              setIsFormModalOpen(true);
            }}
            onResetFilters={handleResetFilters}
            onRestoreDemo={goals.length === 0 ? handleResetDemo : undefined}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            <strong>StudyFlow</strong> — Aplicação de auxílio pedagógico para organização de estudos.
          </p>
          <p className="flex items-center gap-1.5">
            <span>Dados salvos localmente no seu navegador</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </p>
        </div>
      </footer>

      {/* Modais */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleSaveGoal}
        editingGoal={editingGoal}
      />

      <DeleteConfirmModal
        isOpen={!!goalToDelete}
        goal={goalToDelete}
        onClose={() => setGoalToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <StudyTipsModal
        isOpen={isTipsModalOpen}
        onClose={() => setIsTipsModalOpen(false)}
      />
    </div>
  );
}
