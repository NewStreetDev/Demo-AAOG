import { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronDown, Check, Plus, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { labelToValue } from '../../../services/mock/actionTypes.mock';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectWithAddProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  // New props for add functionality
  onAddNew: (label: string, value: string) => void;
  addButtonLabel?: string;
  addModalTitle?: string;
}

// Special value for "add new" action
const ADD_NEW_VALUE = '__ADD_NEW__';
// Special value to represent "none" selection
const NONE_VALUE = '__NONE__';

export default function FormSelectWithAdd({
  value,
  onValueChange,
  options,
  placeholder = 'Seleccionar...',
  error,
  disabled,
  className,
  onAddNew,
  addButtonLabel = '+ Agregar tipo',
  addModalTitle = 'Nuevo Tipo',
}: FormSelectWithAddProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [addError, setAddError] = useState('');

  // Convert empty string to special value for Radix
  const selectValue = value === '' ? NONE_VALUE : (value || undefined);

  // Transform options
  const transformedOptions = options.map(opt => ({
    ...opt,
    value: opt.value === '' ? NONE_VALUE : opt.value,
  }));

  const handleValueChange = (newValue: string) => {
    if (newValue === ADD_NEW_VALUE) {
      // Open the add modal instead of changing value
      setIsAddModalOpen(true);
      return;
    }
    // Convert NONE_VALUE back to empty string
    onValueChange(newValue === NONE_VALUE ? '' : newValue);
  };

  const handleAddSubmit = () => {
    const trimmedName = newTypeName.trim();

    if (!trimmedName) {
      setAddError('El nombre es requerido');
      return;
    }

    if (trimmedName.length < 2) {
      setAddError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    const generatedValue = labelToValue(trimmedName);

    // Check if value already exists
    const existingValues = options.map(opt => opt.value);
    if (existingValues.includes(generatedValue)) {
      setAddError('Este tipo ya existe');
      return;
    }

    // Call the callback
    onAddNew(trimmedName, generatedValue);

    // Select the new value
    onValueChange(generatedValue);

    // Close modal and reset
    setIsAddModalOpen(false);
    setNewTypeName('');
    setAddError('');
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setNewTypeName('');
    setAddError('');
  };

  const generatedValue = newTypeName.trim() ? labelToValue(newTypeName.trim()) : '';

  return (
    <>
      <Select.Root value={selectValue} onValueChange={handleValueChange} disabled={disabled}>
        <Select.Trigger
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
            'transition-colors duration-200',
            'data-[placeholder]:text-gray-400',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            position="popper"
            sideOffset={4}
          >
            <Select.Viewport className="p-1">
              {transformedOptions.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'relative flex items-center px-8 py-2 text-sm rounded-md cursor-pointer',
                    'outline-none select-none',
                    'data-[highlighted]:bg-green-50 data-[highlighted]:text-green-900',
                    'data-[state=checked]:text-green-700 data-[state=checked]:font-medium'
                  )}
                >
                  <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <Check className="h-4 w-4" />
                  </Select.ItemIndicator>
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}

              {/* Separator */}
              <div className="h-px bg-gray-200 my-1" />

              {/* Add New Button */}
              <Select.Item
                value={ADD_NEW_VALUE}
                className={cn(
                  'relative flex items-center px-3 py-2 text-sm rounded-md cursor-pointer',
                  'outline-none select-none',
                  'text-green-600 font-medium',
                  'data-[highlighted]:bg-green-50 data-[highlighted]:text-green-700'
                )}
              >
                <Plus className="h-4 w-4 mr-2" />
                <Select.ItemText>{addButtonLabel}</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {/* Add New Type Modal */}
      <Dialog.Root open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fade-in z-[60]" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-[95vw] max-w-sm bg-white rounded-xl shadow-xl',
              'focus:outline-none z-[70]',
              'data-[state=open]:animate-scale-in'
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Dialog.Title className="text-lg font-bold text-gray-900">
                {addModalTitle}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTypeName}
                  onChange={(e) => {
                    setNewTypeName(e.target.value);
                    setAddError('');
                  }}
                  placeholder="Ej: Fumigacion"
                  className={cn(
                    'w-full h-10 px-3 rounded-lg border text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
                    'transition-colors duration-200',
                    addError ? 'border-red-500' : 'border-gray-300'
                  )}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubmit();
                    }
                  }}
                />
                {addError && (
                  <p className="text-sm text-red-500 mt-1">{addError}</p>
                )}
              </div>

              {generatedValue && (
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Identificador:</span>{' '}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">{generatedValue}</code>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddSubmit}
                  className="btn-primary"
                >
                  Agregar
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
