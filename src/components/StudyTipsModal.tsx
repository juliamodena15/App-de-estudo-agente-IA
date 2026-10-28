import React from 'react';
import { X, Sparkles, CheckCircle2, Target, Calendar, Flame } from 'lucide-react';

interface StudyTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudyTipsModal: React.FC<StudyTipsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const tips = [
    {
      icon: Target,
      title: '1. Seja específico e direto',
      description:
        'Em vez de "Estudar Matemática", prefira "Resolver 10 exercícios de frações". Metas claras reduzem a procrastinação.',
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      icon: Calendar,
      title: '2. Prazos realistas e curtos',
      description:
        'Prazos muito longos facilitam adiar. Defina marcos para os próximos 3 a 7 dias para manter o ritmo constante.',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      icon: Flame,
      title: '3. Um objetivo por vez no status "Em andamento"',
      description:
        'Evite iniciar 10 coisas ao mesmo tempo. Foque em 1 ou 2 metas ativas até concluí-las para não se sentir sobrecarregado.',
      color: 'text-rose-600 bg-rose-50',
    },
    {
      icon: CheckCircle2,
      title: '4. Celebre cada conquista',
      description:
        'Ao marcar como "Concluído", reconheça seu esforço! O cérebro adora o sentimento de progresso.',
      color: 'text-emerald-600 bg-emerald-50',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 bg-gradient-to-r from-amber-50/80 via-white to-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Guia do Estudante Iniciante
              </h2>
              <p className="text-xs text-slate-500">
                Como transformar estudos em um hábito leve e contínuo
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

        <div className="p-6 space-y-4">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100"
              >
                <div className={`p-2 rounded-lg shrink-0 ${tip.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {tip.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Entendido, vamos aos estudos!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
