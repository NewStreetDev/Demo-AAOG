import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface FormCheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  id?: string;
}

const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ checked, onCheckedChange, label, disabled, error, className, id }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only peer"
          />
          <div
            className={cn(
              'h-5 w-5 rounded border border-gray-300 bg-white flex items-center justify-center cursor-pointer',
              'peer-focus:ring-2 peer-focus:ring-amber-500/20 peer-focus:border-amber-500',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              'peer-checked:bg-amber-600 peer-checked:border-amber-600',
              error && 'border-red-500'
            )}
            onClick={() => !disabled && onCheckedChange?.(!checked)}
          >
            {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
          </div>
        </div>
        {label && (
          <label
            htmlFor={id}
            onClick={() => !disabled && onCheckedChange?.(!checked)}
            className={cn(
              'text-sm text-gray-700 cursor-pointer select-none',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';

export default FormCheckbox;
