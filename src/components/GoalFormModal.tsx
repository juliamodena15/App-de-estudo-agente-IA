import React, { useState, useEffect } from 'react';
import { X, Calendar, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { Goal, GoalFormData, GoalStatus, STATUS_CONFIG, COMMON_CATEGORIES } from '../types/goal';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  editingGoal?: Goal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingGoal,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('nao_iniciado');
  const [category, setCategory] = useState('Geral');
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  // Reset or fill form on open/change
  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description);
      setDeadline(editingGoal.deadline);
      setStatus(editingGoal.status);
      setCategory(editingGoal.category || 'Geral');
    } else {
      // Default new goal: deadline in 7 days
      const defaultDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setTitle('');
      setDescription('');
      setDeadline(defaultDeadline);
      setStatus('nao_iniciado');
      setCategory('Geral');
    }
    setErrors({});
  }, [editingGoal, isOpen]);

  if (!isOpen) return null;

  const handleShortcutDeadline = (daysAhead: number) => {
    const d = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
    setDeadline(d.toISOString().split('T')[0]);
  };

  const validate = (): boolean => {
    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, insira o título do seu objetivo.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'O título deve ter no mínimo 3 caracteres.';
    }

    if (!deadline) {
      newErrors.deadline = 'Por favor, escolha uma data de prazo.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
      category,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-indigo-50/70 via-white to-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingGoal ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
              </h2>
              <p className="text-xs text-slate-500">
                {editingGoal
                  ? 'Atualize os dados e acompanhe sua evolução'
                  : 'Defina o que você quer aprender com prazo e foco'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="goal-title" className="text-sm font-semibold text-slate-800">
                Título do Objetivo <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {title.length}/80 caracteres
              </span>
            </div>
            <input
              id="goal-title"
              type="text"
              maxLength={80}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Ex: Aprender funções e loops em JavaScript"
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="goal-description" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Descrição ou Plano de Ação <span className="text-xs font-normal text-slate-500">(opcional)</span>
            </label>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Assistir as aulas do módulo 3, fazer 5 exercícios práticos e resumir os conceitos principais no caderno."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none leading-relaxed"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Dica: divida o objetivo em pequenas tarefas para facilitar o cumprimento.
            </p>
          </div>

          {/* Deadline with shortcut buttons */}
          <div>
            <label htmlFor="goal-deadline" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Prazo para Concluir <span className="text-rose-500">*</span>
            </label>
            <div className="relative mb-2">
              <input
                id="goal-deadline"
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: undefined }));
                }}
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                  errors.deadline
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
            </div>

            {/* Quick shortcuts */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Atalhos rápidos:
              </span>
              <button
                type="button"
                onClick={() => handleShortcutDeadline(3)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                +3 dias
              </button>
              <button
                type="button"
                onClick={() => handleShortcutDeadline(7)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer"
              >
                +1 semana
              </button>
              <button
                type="button"
                onClick={() => handleShortcutDeadline(15)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                +15 dias
              </button>
              <button
                type="button"
                onClick={() => handleShortcutDeadline(30)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                +1 mês
              </button>
            </div>

            {errors.deadline && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.deadline}
              </p>
            )}
          </div>

          {/* Status Selection (Radio Cards) */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Status Inicial <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['nao_iniciado', 'em_andamento', 'concluido'] as GoalStatus[]).map((st) => {
                const config = STATUS_CONFIG[st];
                const isSelected = status === st;

                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? `${config.bgColor} ${config.borderColor} ring-2 ring-indigo-500/20 shadow-xs`
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
                      <span className="text-xs font-bold text-slate-800">{config.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {config.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label htmlFor="goal-category" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Área de Estudo <span className="text-xs font-normal text-slate-500">(opcional)</span>
            </label>
            <select
              id="goal-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              {COMMON_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm shadow-indigo-300 transition-all cursor-pointer hover:shadow"
            >
              <Sparkles className="w-4 h-4" />
              <span>{editingGoal ? 'Salvar Alterações' : 'Cadastrar Objetivo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
