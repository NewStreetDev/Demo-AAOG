import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import type { GeneralPlan } from '../types/finca.types';
import { GeneralPlanFormModal, GeneralPlanDetailModal } from '../components/finca';
import { CalendarView } from '../components/common/Calendar';
import { useGeneralPlans } from '../hooks/useFinca';

export default function Agro() {
  // Modal state for Plans
  const [selectedPlan, setSelectedPlan] = useState<GeneralPlan | null>(null);
  const [planFormModalOpen, setPlanFormModalOpen] = useState(false);
  const [planDetailModalOpen, setPlanDetailModalOpen] = useState(false);
  const [preselectedDate, setPreselectedDate] = useState<Date | null>(null);

  // Plan handlers
  const handlePlanClick = (_plan: GeneralPlan) => {
    // Popover handles this - no action needed here
  };

  const handlePlanView = (plan: GeneralPlan) => {
    setSelectedPlan(plan);
    setPlanDetailModalOpen(true);
  };

  const handlePlanEdit = (plan: GeneralPlan) => {
    setSelectedPlan(plan);
    setPlanDetailModalOpen(false);
    setPreselectedDate(null);
    setPlanFormModalOpen(true);
  };

  const handleNewPlan = () => {
    setSelectedPlan(null);
    setPreselectedDate(null);
    setPlanFormModalOpen(true);
  };

  const handlePlanDayClick = (date: Date) => {
    setSelectedPlan(null);
    setPreselectedDate(date);
    setPlanFormModalOpen(true);
  };

  const { data: allPlans, isLoading: plansLoading } = useGeneralPlans();

  // Filter plans for agro module
  const agroPlans = useMemo(() => {
    if (!allPlans) return [];
    return allPlans.filter(plan => plan.targetModule === 'agro');
  }, [allPlans]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Agrícola
          </h1>
          <p className="text-sm text-gray-600">
            Planificación de actividades agrícolas
          </p>
        </div>
        <button
          onClick={handleNewPlan}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Acción
        </button>
      </div>

      {/* Calendar View */}
      {plansLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
          <div className="h-12 bg-gray-100 rounded-lg mb-4" />
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <CalendarView
          plans={agroPlans}
          onDayClick={handlePlanDayClick}
          onPlanClick={handlePlanClick}
          onPlanEdit={handlePlanEdit}
          onPlanView={handlePlanView}
          defaultModule="agro"
          showModuleColors={false}
        />
      )}

      {/* Plan Modals - filtered to agro module */}
      <GeneralPlanFormModal
        open={planFormModalOpen}
        onOpenChange={(open) => {
          setPlanFormModalOpen(open);
          if (!open) setPreselectedDate(null);
        }}
        plan={selectedPlan}
        defaultModule="agro"
        preselectedDate={preselectedDate}
        onSuccess={() => {
          setSelectedPlan(null);
          setPreselectedDate(null);
        }}
      />
      <GeneralPlanDetailModal
        open={planDetailModalOpen}
        onOpenChange={setPlanDetailModalOpen}
        plan={selectedPlan}
        onEdit={handlePlanEdit}
        onDeleteSuccess={() => setSelectedPlan(null)}
      />
    </div>
  );
}
