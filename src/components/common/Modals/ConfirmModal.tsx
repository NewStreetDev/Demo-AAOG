import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: 'danger' | 'warning';
}

export default function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  isLoading = false,
  variant = 'danger',
}: ConfirmModalProps) {
  const variantStyles = {
    danger: {
      icon: 'bg-red-100 text-red-600',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    warning: {
      icon: 'bg-amber-100 text-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
    },
  };

  const styles = variantStyles[variant];

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fade-in z-40" />
        <AlertDialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-[95vw] max-w-md bg-white rounded-xl shadow-xl p-6',
            'focus:outline-none z-50',
            'data-[state=open]:animate-scale-in'
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn('p-3 rounded-full', styles.icon)}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <AlertDialog.Title className="text-lg font-bold text-gray-900">
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm text-gray-600 mt-2">
                {description}
              </AlertDialog.Description>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <AlertDialog.Cancel asChild>
              <button
                className="btn-secondary"
                disabled={isLoading}
              >
                {cancelLabel}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                className={cn(
                  'px-4 py-2 rounded-lg text-white font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'inline-flex items-center gap-2',
                  styles.button
                )}
                onClick={(e) => {
                  e.preventDefault();
                  onConfirm();
                }}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {confirmLabel}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
