import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface FormMultiSelectProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function FormMultiSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Seleccionar...',
  error,
  disabled,
  className,
}: FormMultiSelectProps) {
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onValueChange(value.filter((v) => v !== optionValue));
    } else {
      onValueChange([...value, optionValue]);
    }
  };

  const selectedLabels = options.filter((opt) => value.includes(opt.value));

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
            'transition-colors duration-200',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
        >
          <div className="flex-1 flex items-center gap-1 overflow-hidden min-w-0">
            {selectedLabels.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : (
              <div className="flex items-center gap-1 flex-wrap">
                {selectedLabels.map((opt) => (
                  <span
                    key={opt.value}
                    className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full"
                  >
                    {opt.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0 ml-2" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[var(--radix-dropdown-menu-trigger-width)]"
          sideOffset={4}
          align="start"
        >
          <div className="p-1 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <DropdownMenu.CheckboxItem
                key={option.value}
                checked={value.includes(option.value)}
                onCheckedChange={() => handleToggle(option.value)}
                onSelect={(e) => e.preventDefault()}
                className={cn(
                  'relative flex items-center px-8 py-2 text-sm rounded-md cursor-pointer',
                  'outline-none select-none',
                  'data-[highlighted]:bg-green-50 data-[highlighted]:text-green-900',
                  value.includes(option.value) && 'text-green-700 font-medium'
                )}
              >
                <DropdownMenu.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <Check className="h-4 w-4" />
                </DropdownMenu.ItemIndicator>
                {option.label}
              </DropdownMenu.CheckboxItem>
            ))}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
