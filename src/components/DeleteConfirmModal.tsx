import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Goal } from '../types/goal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  goal: Goal | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  goal,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !goal) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Excluir Objetivo?
                </h3>
                <button
                  onClick={onClose}
                  type="button"
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                Você tem certeza de que deseja remover este objetivo de estudo? Esta ação não poderá ser desfeita.
              </p>

              {/* Goal preview box */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Objetivo selecionado:
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {goal.title}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Sim, excluir objetivo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
