import React from 'react';
import { CheckCircle, Info, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl bg-stone-900 text-white shadow-xl border border-stone-700 text-xs animate-in slide-in-from-bottom-2 fade-in duration-200"
        >
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-amber-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
          <span className="flex-1 font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
