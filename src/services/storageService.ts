import { Goal, GoalFormData } from '../types/goal';

const STORAGE_KEY = 'studyflow_goals_v1';

const INITIAL_DEMO_GOALS: Goal[] = [
  {
    id: 'demo-1',
    title: 'Aprender fundamentos de HTML & CSS',
    description: 'Estudar tags semânticas, seletores CSS, Flexbox e criar uma página de perfil pessoal.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    category: 'Programação & Tech',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Ler 2 capítulos de livro de Algoritmos',
    description: 'Revisar conceitos de estruturas de repetição, vetores e complexidade básica de código.',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    category: 'Faculdade / Escola',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Instalar e configurar ambiente de estudos',
    description: 'Configurar VS Code, extensões essenciais, Git e criar repositório inicial no GitHub.',
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    category: 'Programação & Tech',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const storageService = {
  /**
   * Obtém todos os objetivos salvos no localStorage.
   * Se for o primeiro acesso, carrega dados de exemplo acolhedores.
   */
  getGoals(): Goal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Primeiro acesso: inicializa com dados amigáveis
        this.saveGoals(INITIAL_DEMO_GOALS);
        return INITIAL_DEMO_GOALS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista de objetivos no localStorage.
   */
  saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cadastra um novo objetivo.
   */
  createGoal(formData: GoalFormData): Goal {
    const goals = this.getGoals();
    const newGoal: Goal = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `goal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      category: formData.category?.trim() || 'Geral',
      createdAt: new Date().toISOString(),
    };

    const updated = [newGoal, ...goals];
    this.saveGoals(updated);
    return newGoal;
  },

  /**
   * Atualiza um objetivo existente.
   */
  updateGoal(id: string, formData: Partial<GoalFormData>): Goal | null {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return null;

    const existing = goals[index];
    const updatedGoal: Goal = {
      ...existing,
      ...formData,
      title: formData.title !== undefined ? formData.title.trim() : existing.title,
      description: formData.description !== undefined ? formData.description.trim() : existing.description,
      updatedAt: new Date().toISOString(),
    };

    goals[index] = updatedGoal;
    this.saveGoals(goals);
    return updatedGoal;
  },

  /**
   * Remove um objetivo pelo ID.
   */
  deleteGoal(id: string): boolean {
    const goals = this.getGoals();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length === goals.length) return false;

    this.saveGoals(filtered);
    return true;
  },

  /**
   * Restaura os dados de exemplo para demonstração/testes.
   */
  resetToDemo(): Goal[] {
    this.saveGoals(INITIAL_DEMO_GOALS);
    return INITIAL_DEMO_GOALS;
  },

  /**
   * Limpa todos os objetivos.
   */
  clearAll(): void {
    this.saveGoals([]);
  },
};
