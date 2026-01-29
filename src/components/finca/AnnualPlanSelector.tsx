import { useMemo } from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check, Plus, Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAnnualPlans } from '../../hooks/useAnnualPlan';
import type { AnnualPlan, AnnualPlanStatus } from '../../types/finca.types';

interface AnnualPlanSelectorProps {
  selectedPlanId: string | null;
  onPlanChange: (planId: string) => void;
  onCreateNew: () => void;
}

const statusLabels: Record<AnnualPlanStatus, string> = {
  draft: 'Borrador',
  planning: 'En Planificacion',
  active: 'Activo',
  completed: 'Completado',
};

const statusColors: Record<AnnualPlanStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  planning: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-purple-100 text-purple-700',
};

export default function AnnualPlanSelector({
  selectedPlanId,
  onPlanChange,
  onCreateNew,
}: AnnualPlanSelectorProps) {
  const { data: annualPlans = [], isLoading } = useAnnualPlans();

  // Sort plans by year descending
  const sortedPlans = useMemo(() => {
    return [...annualPlans].sort((a, b) => b.year - a.year);
  }, [annualPlans]);

  // Get current year's plan for highlighting
  const currentYear = new Date().getFullYear();

  // Find selected plan details
  const selectedPlan = useMemo(() => {
    return annualPlans.find((p) => p.id === selectedPlanId);
  }, [annualPlans, selectedPlanId]);

  if (isLoading) {
    return (
      <div className="h-10 w-64 bg-gray-100 animate-pulse rounded-lg" />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select.Root value={selectedPlanId || undefined} onValueChange={onPlanChange}>
        <Select.Trigger
          className={cn(
            'flex h-10 min-w-[250px] items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
            'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
            'transition-colors duration-200',
            'data-[placeholder]:text-gray-400'
          )}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <Select.Value placeholder="Seleccionar plan anual...">
              {selectedPlan && (
                <span className="flex items-center gap-2">
                  <span>{selectedPlan.name}</span>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[selectedPlan.status])}>
                    {statusLabels[selectedPlan.status]}
                  </span>
                </span>
              )}
            </Select.Value>
          </div>
          <Select.Icon>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[280px]"
            position="popper"
            sideOffset={4}
          >
            <Select.Viewport className="p-1">
              {sortedPlans.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  No hay planes anuales.
                  <br />
                  Crea uno para comenzar.
                </div>
              ) : (
                sortedPlans.map((plan) => (
                  <PlanOption
                    key={plan.id}
                    plan={plan}
                    isCurrentYear={plan.year === currentYear}
                  />
                ))
              )}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <button
        onClick={onCreateNew}
        className={cn(
          'flex items-center justify-center h-10 w-10 rounded-lg',
          'bg-green-600 text-white hover:bg-green-700',
          'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
          'transition-colors duration-200'
        )}
        title="Crear nuevo plan anual"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}

interface PlanOptionProps {
  plan: AnnualPlan;
  isCurrentYear: boolean;
}

function PlanOption({ plan, isCurrentYear }: PlanOptionProps) {
  return (
    <Select.Item
      value={plan.id}
      className={cn(
        'relative flex items-center justify-between px-8 py-2.5 text-sm rounded-md cursor-pointer',
        'outline-none select-none',
        'data-[highlighted]:bg-green-50 data-[highlighted]:text-green-900',
        'data-[state=checked]:text-green-700 data-[state=checked]:font-medium',
        isCurrentYear && 'bg-amber-50'
      )}
    >
      <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
        <Check className="h-4 w-4" />
      </Select.ItemIndicator>
      <div className="flex items-center gap-2">
        <Select.ItemText>
          <span className="font-medium">{plan.year}</span>
          <span className="ml-2 text-gray-600">{plan.name}</span>
        </Select.ItemText>
        {isCurrentYear && (
          <span className="text-xs text-amber-600 font-medium">Actual</span>
        )}
      </div>
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[plan.status])}>
        {statusLabels[plan.status]}
      </span>
    </Select.Item>
  );
}
