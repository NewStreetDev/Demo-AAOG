import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export interface FormTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ className, error, rows = 3, ...props }, ref) => {
    return (
      <textarea
        rows={rows}
        className={cn(
          'flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
          'transition-colors duration-200 resize-none',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

FormTextArea.displayName = 'FormTextArea';

export default FormTextArea;
