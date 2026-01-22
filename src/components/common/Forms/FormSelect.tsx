import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function FormSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Seleccionar...',
  error,
  disabled,
  className,
}: FormSelectProps) {
  // Radix Select doesn't handle empty strings well, use undefined for unselected state
  const selectValue = value === '' ? undefined : value;

  return (
    <Select.Root value={selectValue} onValueChange={onValueChange} disabled={disabled}>
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
            {options.map((option) => (
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
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
