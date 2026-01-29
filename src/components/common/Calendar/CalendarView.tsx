import { useState, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Calendar as CalendarIcon,
  CalendarClock,
  Asterisk,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameMonth,
  isToday,
  isWithinInterval,
  isBefore,
  isAfter,
  getDaysInMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '../../../utils/cn';
import type { GeneralPlan } from '../../../types/finca.types';
import type { SystemModule } from '../../../types/common.types';
import { planActionTypeOptions } from '../../../schemas/finca.schema';
import PlanPopover from './PlanPopover';

type ViewMode = 'month' | 'week' | 'gantt';

interface CalendarViewProps {
  plans: GeneralPlan[];
  onDayClick: (date: Date) => void;
  onPlanClick: (plan: GeneralPlan) => void;
  onPlanEdit?: (plan: GeneralPlan) => void;
  onPlanView: (plan: GeneralPlan) => void;
  defaultModule?: string;
  showModuleColors?: boolean;
  onAddAction?: () => void;  // Called when "+ Agregar accion" is clicked
  groupByActionType?: boolean;  // Enable grouped view in Gantt (default: true)
  showPlanningIndicators?: boolean;  // Show unplanned/rescheduled indicators (default: auto-detect based on plans)
}

const moduleColors: Record<SystemModule | 'general', string> = {
  general: 'bg-green-500',
  agro: 'bg-blue-500',
  pecuario: 'bg-yellow-500',
  apicultura: 'bg-amber-500',
  procesamiento: 'bg-purple-500',
  activos: 'bg-gray-500',
  infraestructura: 'bg-teal-500',
};

const moduleColorsBorder: Record<SystemModule | 'general', string> = {
  general: 'border-l-green-500',
  agro: 'border-l-blue-500',
  pecuario: 'border-l-yellow-500',
  apicultura: 'border-l-amber-500',
  procesamiento: 'border-l-purple-500',
  activos: 'border-l-gray-500',
  infraestructura: 'border-l-teal-500',
};

const dayNamesShort = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
const dayNamesFull = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

function getPlansForDate(plans: GeneralPlan[], date: Date): GeneralPlan[] {
  return plans.filter((plan) => {
    const scheduledDate = new Date(plan.scheduledDate);
    const dueDate = plan.dueDate ? new Date(plan.dueDate) : scheduledDate;

    // Normalize dates to start of day for comparison
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const normalizedStart = new Date(
      scheduledDate.getFullYear(),
      scheduledDate.getMonth(),
      scheduledDate.getDate()
    );
    const normalizedEnd = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate()
    );

    return isWithinInterval(normalizedDate, {
      start: normalizedStart,
      end: normalizedEnd,
    });
  });
}

// Month names in Spanish for Gantt view
const monthNamesShort = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

// Helper function to get array of 12 month start dates for a year
function getMonthsInYear(year: number): Date[] {
  return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
}

// Helper function to get plans that appear in a given year
function getPlansForYear(plans: GeneralPlan[], year: number): GeneralPlan[] {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  return plans.filter((plan) => {
    const scheduledDate = new Date(plan.scheduledDate);
    const dueDate = plan.dueDate ? new Date(plan.dueDate) : scheduledDate;

    // Plan appears in year if it overlaps with the year at all
    return !(isAfter(scheduledDate, yearEnd) || isBefore(dueDate, yearStart));
  });
}

// Helper function to calculate bar position and width for a plan
interface BarPosition {
  startMonth: number; // 0-11
  startOffset: number; // percentage within start month (0-100)
  endMonth: number; // 0-11
  endOffset: number; // percentage within end month (0-100)
  totalSpan: number; // total months spanned
}

// Helper function to get action type label
function getActionTypeLabel(actionType: string): string {
  const option = planActionTypeOptions.find(opt => opt.value === actionType);
  return option?.label || actionType;
}

// Helper function to group plans by action type
interface GroupedPlans {
  actionType: string;
  label: string;
  plans: GeneralPlan[];
}

// Helper function to check if a plan is unplanned (added during execution, not from initial planning)
function isUnplannedPlan(plan: GeneralPlan): boolean {
  return plan.planPhase === 'execution' && !plan.isFromPlanning;
}

// Helper function to check if a plan has been rescheduled (dates changed from original)
function isRescheduledPlan(plan: GeneralPlan): boolean {
  if (plan.planPhase !== 'execution' || !plan.isFromPlanning) return false;
  if (!plan.originalScheduledDate) return false;

  const currentDate = new Date(plan.scheduledDate).getTime();
  const originalDate = new Date(plan.originalScheduledDate).getTime();

  return currentDate !== originalDate;
}

// Helper function to format original date for tooltip
function formatOriginalDate(date: Date): string {
  return format(new Date(date), "d 'de' MMMM", { locale: es });
}

function groupPlansByActionType(plans: GeneralPlan[]): GroupedPlans[] {
  // Group plans by action type
  const groupMap = new Map<string, GeneralPlan[]>();

  plans.forEach(plan => {
    const actionType = plan.actionType || 'otro';
    if (!groupMap.has(actionType)) {
      groupMap.set(actionType, []);
    }
    groupMap.get(actionType)!.push(plan);
  });

  // Convert to array and sort groups alphabetically by label
  const groups: GroupedPlans[] = [];
  groupMap.forEach((groupPlans, actionType) => {
    // Sort plans within group by scheduledDate
    const sortedPlans = [...groupPlans].sort((a, b) => {
      return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
    });

    groups.push({
      actionType,
      label: getActionTypeLabel(actionType),
      plans: sortedPlans,
    });
  });

  // Sort groups alphabetically by label
  groups.sort((a, b) => a.label.localeCompare(b.label, 'es'));

  return groups;
}

function getBarPosition(plan: GeneralPlan, year: number): BarPosition | null {
  const scheduledDate = new Date(plan.scheduledDate);
  const dueDate = plan.dueDate ? new Date(plan.dueDate) : scheduledDate;

  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  // Clamp dates to current year
  const effectiveStart = isBefore(scheduledDate, yearStart) ? yearStart : scheduledDate;
  const effectiveEnd = isAfter(dueDate, yearEnd) ? yearEnd : dueDate;

  // If plan doesn't appear in this year at all
  if (isAfter(effectiveStart, yearEnd) || isBefore(effectiveEnd, yearStart)) {
    return null;
  }

  const startMonth = effectiveStart.getMonth();
  const endMonth = effectiveEnd.getMonth();

  // Calculate offset within month as percentage
  const startDayOfMonth = effectiveStart.getDate();
  const daysInStartMonth = getDaysInMonth(effectiveStart);
  const startOffset = ((startDayOfMonth - 1) / daysInStartMonth) * 100;

  const endDayOfMonth = effectiveEnd.getDate();
  const daysInEndMonth = getDaysInMonth(effectiveEnd);
  const endOffset = (endDayOfMonth / daysInEndMonth) * 100;

  const totalSpan = endMonth - startMonth + 1;

  return {
    startMonth,
    startOffset,
    endMonth,
    endOffset,
    totalSpan,
  };
}

export default function CalendarView({
  plans,
  onDayClick,
  onPlanClick,
  onPlanEdit,
  onPlanView,
  defaultModule,
  showModuleColors = true,
  onAddAction,
  groupByActionType = true,
  showPlanningIndicators,
}: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [ganttYear, setGanttYear] = useState(new Date().getFullYear());
  const [selectedPlan, setSelectedPlan] = useState<GeneralPlan | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const ganttScrollRef = useRef<HTMLDivElement>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Filter plans by module if defaultModule is specified
  const filteredPlans = useMemo(() => {
    if (!defaultModule) return plans;
    return plans.filter(
      (plan) => plan.targetModule === defaultModule || !plan.targetModule
    );
  }, [plans, defaultModule]);

  // Auto-detect if we should show planning indicators
  // Show indicators when there are execution phase plans
  const shouldShowPlanningIndicators = useMemo(() => {
    if (showPlanningIndicators !== undefined) return showPlanningIndicators;
    // Auto-detect: show if any plan is in execution phase
    return filteredPlans.some(plan => plan.planPhase === 'execution');
  }, [filteredPlans, showPlanningIndicators]);

  // Check if we have any unplanned or rescheduled plans (for legend visibility)
  const hasUnplannedPlans = useMemo(() => {
    return filteredPlans.some(plan => isUnplannedPlan(plan));
  }, [filteredPlans]);

  const hasRescheduledPlans = useMemo(() => {
    return filteredPlans.some(plan => isRescheduledPlan(plan));
  }, [filteredPlans]);

  // Navigation handlers
  const goToToday = () => {
    setCurrentDate(new Date());
    setGanttYear(new Date().getFullYear());
  };

  const goToPrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setGanttYear(ganttYear - 1);
    }
  };

  const goToNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setGanttYear(ganttYear + 1);
    }
  };

  // Generate calendar days for month view
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentDate]);

  // Generate calendar days for week view
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days: Date[] = [];

    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }

    return days;
  }, [currentDate]);

  const handlePlanClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    plan: GeneralPlan
  ) => {
    event.stopPropagation();
    setSelectedPlan(plan);
    setPopoverAnchor(event.currentTarget);
    onPlanClick(plan);
  };

  const handleDayClick = (date: Date, event: React.MouseEvent) => {
    // Only trigger if clicking directly on the day cell, not on a plan
    if ((event.target as HTMLElement).closest('.plan-chip')) return;
    onDayClick(date);
  };

  const closePopover = () => {
    setSelectedPlan(null);
    setPopoverAnchor(null);
  };

  // Render a plan chip
  const renderPlanChip = (plan: GeneralPlan, truncate: boolean = true) => {
    const module = plan.targetModule || 'general';
    const colorClass = showModuleColors
      ? moduleColorsBorder[module]
      : moduleColorsBorder['general'];

    // Visual indicator flags
    const isUnplanned = shouldShowPlanningIndicators && isUnplannedPlan(plan);
    const isRescheduled = shouldShowPlanningIndicators && isRescheduledPlan(plan);

    // Build tooltip for rescheduled plans
    const rescheduledTooltip = isRescheduled && plan.originalScheduledDate
      ? `Fecha original: ${formatOriginalDate(plan.originalScheduledDate)}`
      : undefined;

    return (
      <button
        key={plan.id}
        onClick={(e) => handlePlanClick(e, plan)}
        title={rescheduledTooltip}
        className={cn(
          'plan-chip w-full text-left px-2 py-1 text-xs rounded-md',
          'hover:bg-gray-100 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1',
          colorClass,
          truncate && 'truncate',
          // Unplanned: dashed border, lighter background
          isUnplanned
            ? 'border-l-2 border-dashed bg-gray-50/70'
            : 'border-l-2 bg-gray-50',
          // Rescheduled: subtle accent
          isRescheduled && 'ring-1 ring-amber-300'
        )}
      >
        <span className={cn(
          'flex items-center gap-1',
          truncate ? 'truncate' : 'line-clamp-2'
        )}>
          {/* Unplanned indicator */}
          {isUnplanned && (
            <Asterisk className="w-3 h-3 flex-shrink-0 text-gray-500" />
          )}
          {/* Rescheduled indicator */}
          {isRescheduled && (
            <CalendarClock className="w-3 h-3 flex-shrink-0 text-amber-600" />
          )}
          <span className={truncate ? 'truncate' : ''}>
            {plan.title}
          </span>
        </span>
      </button>
    );
  };

  // Month View
  const renderMonthView = () => {
    const maxVisiblePlans = 2;

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {/* Day headers */}
        {dayNamesShort.map((day) => (
          <div
            key={day}
            className="bg-gray-50 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}

        {/* Day cells */}
        {monthDays.map((day, index) => {
          const dayPlans = getPlansForDate(filteredPlans, day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const hasMorePlans = dayPlans.length > maxVisiblePlans;

          return (
            <div
              key={index}
              onClick={(e) => handleDayClick(day, e)}
              className={cn(
                'bg-white min-h-[100px] p-1.5 cursor-pointer transition-colors hover:bg-gray-50',
                !isCurrentMonth && 'bg-gray-50/50'
              )}
            >
              {/* Day number */}
              <div className="flex justify-end mb-1">
                <span
                  className={cn(
                    'w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full',
                    isCurrentDay && 'bg-green-600 text-white',
                    !isCurrentDay && isCurrentMonth && 'text-gray-900',
                    !isCurrentDay && !isCurrentMonth && 'text-gray-400'
                  )}
                >
                  {format(day, 'd')}
                </span>
              </div>

              {/* Plans */}
              <div className="space-y-1">
                {dayPlans.slice(0, maxVisiblePlans).map((plan) => renderPlanChip(plan))}
                {hasMorePlans && (
                  <div className="text-xs text-gray-500 font-medium px-2">
                    +{dayPlans.length - maxVisiblePlans} mas
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Week View
  const renderWeekView = () => {
    const maxVisiblePlans = 6;

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {/* Day headers with full date */}
        {weekDays.map((day, index) => {
          const isCurrentDay = isToday(day);
          return (
            <div
              key={index}
              className={cn(
                'bg-gray-50 py-3 text-center',
                isCurrentDay && 'bg-green-50'
              )}
            >
              <div className="text-xs font-medium text-gray-500 uppercase">
                {dayNamesFull[index]}
              </div>
              <div
                className={cn(
                  'text-lg font-bold mt-1',
                  isCurrentDay ? 'text-green-600' : 'text-gray-900'
                )}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}

        {/* Day cells with more space */}
        {weekDays.map((day, index) => {
          const dayPlans = getPlansForDate(filteredPlans, day);
          const isCurrentDay = isToday(day);
          const hasMorePlans = dayPlans.length > maxVisiblePlans;

          return (
            <div
              key={index}
              onClick={(e) => handleDayClick(day, e)}
              className={cn(
                'bg-white min-h-[300px] p-2 cursor-pointer transition-colors hover:bg-gray-50',
                isCurrentDay && 'bg-green-50/30'
              )}
            >
              {/* Plans */}
              <div className="space-y-1.5">
                {dayPlans.slice(0, maxVisiblePlans).map((plan) =>
                  renderPlanChip(plan, false)
                )}
                {hasMorePlans && (
                  <div className="text-xs text-gray-500 font-medium px-2 py-1">
                    +{dayPlans.length - maxVisiblePlans} mas
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Get plans sorted by scheduled date for Gantt view
  const ganttPlans = useMemo(() => {
    const plansForYear = getPlansForYear(filteredPlans, ganttYear);
    return plansForYear.sort((a, b) => {
      return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
    });
  }, [filteredPlans, ganttYear]);

  // Get plans grouped by action type for Gantt view
  const groupedGanttPlans = useMemo(() => {
    return groupPlansByActionType(ganttPlans);
  }, [ganttPlans]);

  // Toggle group collapsed state
  const toggleGroupCollapsed = (actionType: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(actionType)) {
        newSet.delete(actionType);
      } else {
        newSet.add(actionType);
      }
      return newSet;
    });
  };

  // Render a single plan row for Gantt view
  const renderGanttPlanRow = (
    plan: GeneralPlan,
    months: Date[],
    currentMonth: number,
    currentYear: number,
    isLast: boolean,
    showTreeLine: boolean = false
  ) => {
    const barPos = getBarPosition(plan, ganttYear);
    const module = plan.targetModule || 'general';
    const barColorClass = showModuleColors
      ? moduleColors[module]
      : moduleColors['general'];

    // Visual indicator flags
    const isUnplanned = shouldShowPlanningIndicators && isUnplannedPlan(plan);
    const isRescheduled = shouldShowPlanningIndicators && isRescheduledPlan(plan);

    // Build title/tooltip
    let barTitle = `${plan.title}: ${format(new Date(plan.scheduledDate), 'd MMM', { locale: es })} - ${plan.dueDate ? format(new Date(plan.dueDate), 'd MMM', { locale: es }) : format(new Date(plan.scheduledDate), 'd MMM', { locale: es })}`;
    if (isRescheduled && plan.originalScheduledDate) {
      barTitle += ` (Fecha original: ${formatOriginalDate(plan.originalScheduledDate)})`;
    }
    if (isUnplanned) {
      barTitle += ' [No planificado]';
    }

    return (
      <div
        key={plan.id}
        className="flex border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
      >
        {/* Plan title - sticky */}
        <div
          className="w-48 md:w-56 flex-shrink-0 px-3 py-2 border-r border-gray-200 bg-white sticky left-0 z-10 group"
          title={plan.title}
        >
          <div className="flex items-center">
            {showTreeLine && (
              <span className="text-gray-400 mr-1 font-mono text-xs flex-shrink-0">
                {isLast ? '\u2514\u2500' : '\u251C\u2500'}
              </span>
            )}
            {/* Indicator icons in title */}
            {isUnplanned && (
              <Asterisk className="w-3 h-3 flex-shrink-0 text-gray-500 mr-1" />
            )}
            {isRescheduled && (
              <CalendarClock className="w-3 h-3 flex-shrink-0 text-amber-600 mr-1" />
            )}
            <span className="text-sm text-gray-900 truncate block">
              {plan.title}
            </span>
          </div>
          {/* Tooltip on hover */}
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block z-20">
            <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap max-w-xs">
              {plan.title}
              {isUnplanned && <span className="block text-gray-300">No planificado</span>}
              {isRescheduled && plan.originalScheduledDate && (
                <span className="block text-amber-300">
                  Fecha original: {formatOriginalDate(plan.originalScheduledDate)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Timeline columns */}
        <div className="flex flex-1 relative">
          {months.map((_, monthIndex) => {
            const isCurrentMonthCol = monthIndex === currentMonth && ganttYear === currentYear;
            return (
              <div
                key={monthIndex}
                className={cn(
                  'flex-1 min-w-[60px] border-r border-gray-100 last:border-r-0 min-h-[40px]',
                  isCurrentMonthCol && 'bg-green-50/30'
                )}
              />
            );
          })}

          {/* Gantt bar overlay */}
          {barPos && (
            <button
              onClick={(e) => handlePlanClick(e, plan)}
              className={cn(
                'plan-chip absolute top-1/2 -translate-y-1/2 h-6 rounded-md cursor-pointer',
                'hover:opacity-80 transition-opacity',
                'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1',
                barColorClass,
                // Unplanned: dashed border with stripes pattern
                isUnplanned && 'border-2 border-dashed border-white/50',
                // Rescheduled: amber ring indicator
                isRescheduled && 'ring-2 ring-amber-400'
              )}
              style={{
                left: `calc(${(barPos.startMonth / 12) * 100}% + ${(barPos.startOffset / 100) * (100 / 12)}%)`,
                width: barPos.totalSpan === 1
                  ? `calc(${((barPos.endOffset - barPos.startOffset) / 100) * (100 / 12)}%)`
                  : `calc(${((barPos.totalSpan - 1) / 12) * 100}% + ${((100 - barPos.startOffset) / 100) * (100 / 12)}% + ${(barPos.endOffset / 100) * (100 / 12)}% - ${(barPos.startOffset / 100) * (100 / 12)}%)`,
                minWidth: '8px',
                // Add subtle opacity for unplanned bars
                opacity: isUnplanned ? 0.85 : 1,
              }}
              title={barTitle}
            />
          )}
        </div>
      </div>
    );
  };

  // Render grouped Gantt view
  const renderGroupedGanttView = () => {
    const months = getMonthsInYear(ganttYear);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return (
      <div className="overflow-hidden rounded-lg border border-gray-200">
        {/* Scrollable container */}
        <div
          ref={ganttScrollRef}
          className="overflow-x-auto"
        >
          <div className="min-w-[900px]">
            {/* Header row with months */}
            <div className="flex bg-gray-50 border-b border-gray-200">
              {/* Action type column header - sticky */}
              <div className="w-48 md:w-56 flex-shrink-0 px-3 py-2 font-semibold text-sm text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
                Tipo Accion
              </div>
              {/* Month columns */}
              <div className="flex flex-1">
                {months.map((_, index) => {
                  const isCurrentMonthCol = index === currentMonth && ganttYear === currentYear;
                  return (
                    <div
                      key={index}
                      className={cn(
                        'flex-1 min-w-[60px] px-1 py-2 text-center text-xs font-semibold text-gray-600 border-r border-gray-100 last:border-r-0',
                        isCurrentMonthCol && 'bg-green-50 text-green-700'
                      )}
                    >
                      {monthNamesShort[index]}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grouped plan rows */}
            {groupedGanttPlans.map((group) => {
              const isCollapsed = collapsedGroups.has(group.actionType);

              return (
                <div key={group.actionType}>
                  {/* Group header row */}
                  <div
                    className="flex border-b border-gray-100 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => toggleGroupCollapsed(group.actionType)}
                  >
                    {/* Group title - sticky */}
                    <div className="w-48 md:w-56 flex-shrink-0 px-3 py-2 border-r border-gray-200 bg-gray-50 hover:bg-gray-100 sticky left-0 z-10 transition-colors">
                      <div className="flex items-center gap-2">
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 text-gray-500 transition-transform',
                            isCollapsed && '-rotate-90'
                          )}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {group.label} ({group.plans.length})
                        </span>
                      </div>
                    </div>

                    {/* Empty timeline columns for header */}
                    <div className="flex flex-1">
                      {months.map((_, monthIndex) => {
                        const isCurrentMonthCol = monthIndex === currentMonth && ganttYear === currentYear;
                        return (
                          <div
                            key={monthIndex}
                            className={cn(
                              'flex-1 min-w-[60px] border-r border-gray-100 last:border-r-0 min-h-[36px]',
                              isCurrentMonthCol && 'bg-green-50/30'
                            )}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Plans in this group (when expanded) */}
                  {!isCollapsed && group.plans.map((plan, planIndex) =>
                    renderGanttPlanRow(
                      plan,
                      months,
                      currentMonth,
                      currentYear,
                      planIndex === group.plans.length - 1,
                      true // showTreeLine
                    )
                  )}
                </div>
              );
            })}

            {/* Add action row */}
            {onAddAction && (
              <div
                className="flex border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={onAddAction}
              >
                {/* Add action button - sticky */}
                <div className="w-48 md:w-56 flex-shrink-0 px-3 py-2 border-r border-gray-200 bg-white hover:bg-gray-50 sticky left-0 z-10 transition-colors">
                  <div className="flex items-center gap-2 text-green-600 hover:text-green-700">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Agregar accion</span>
                  </div>
                </div>

                {/* Empty timeline columns */}
                <div className="flex flex-1">
                  {months.map((_, monthIndex) => {
                    const isCurrentMonthCol = monthIndex === currentMonth && ganttYear === currentYear;
                    return (
                      <div
                        key={monthIndex}
                        className={cn(
                          'flex-1 min-w-[60px] border-r border-gray-100 last:border-r-0 min-h-[40px]',
                          isCurrentMonthCol && 'bg-green-50/30'
                        )}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Flat Gantt view (original behavior)
  const renderFlatGanttView = () => {
    const months = getMonthsInYear(ganttYear);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return (
      <div className="overflow-hidden rounded-lg border border-gray-200">
        {/* Scrollable container */}
        <div
          ref={ganttScrollRef}
          className="overflow-x-auto"
        >
          <div className="min-w-[900px]">
            {/* Header row with months */}
            <div className="flex bg-gray-50 border-b border-gray-200">
              {/* Plan title column header - sticky */}
              <div className="w-48 md:w-56 flex-shrink-0 px-3 py-2 font-semibold text-sm text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
                Plan
              </div>
              {/* Month columns */}
              <div className="flex flex-1">
                {months.map((_, index) => {
                  const isCurrentMonthCol = index === currentMonth && ganttYear === currentYear;
                  return (
                    <div
                      key={index}
                      className={cn(
                        'flex-1 min-w-[60px] px-1 py-2 text-center text-xs font-semibold text-gray-600 border-r border-gray-100 last:border-r-0',
                        isCurrentMonthCol && 'bg-green-50 text-green-700'
                      )}
                    >
                      {monthNamesShort[index]}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Plan rows */}
            {ganttPlans.map((plan, index) =>
              renderGanttPlanRow(
                plan,
                months,
                currentMonth,
                currentYear,
                index === ganttPlans.length - 1,
                false // no tree lines in flat view
              )
            )}

            {/* Add action row */}
            {onAddAction && (
              <div
                className="flex border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={onAddAction}
              >
                {/* Add action button - sticky */}
                <div className="w-48 md:w-56 flex-shrink-0 px-3 py-2 border-r border-gray-200 bg-white hover:bg-gray-50 sticky left-0 z-10 transition-colors">
                  <div className="flex items-center gap-2 text-green-600 hover:text-green-700">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Agregar accion</span>
                  </div>
                </div>

                {/* Empty timeline columns */}
                <div className="flex flex-1">
                  {months.map((_, monthIndex) => {
                    const isCurrentMonthCol = monthIndex === currentMonth && ganttYear === currentYear;
                    return (
                      <div
                        key={monthIndex}
                        className={cn(
                          'flex-1 min-w-[60px] border-r border-gray-100 last:border-r-0 min-h-[40px]',
                          isCurrentMonthCol && 'bg-green-50/30'
                        )}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Gantt View
  const renderGanttView = () => {
    // Show empty state only when there are no plans and no add action callback
    if (ganttPlans.length === 0 && !onAddAction) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <CalendarIcon className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-lg font-medium">No hay planes para {ganttYear}</p>
          <p className="text-sm">Los planes aparecen aqui cuando tienen fechas en este ano</p>
        </div>
      );
    }

    // Empty state with add action button
    if (ganttPlans.length === 0 && onAddAction) {
      const months = getMonthsInYear(ganttYear);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div
            ref={ganttScrollRef}
            className="overflow-x-auto"
          >
            <div className="min-w-[900px]">
              {/* Header row with months */}
              <div className="flex bg-gray-50 border-b border-gray-200">
                <div className="w-48 md:w-56 flex-shrink-0 px-3 py-2 font-semibold text-sm text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
                  {groupByActionType ? 'Tipo Accion' : 'Plan'}
                </div>
                <div className="flex flex-1">
                  {months.map((_, index) => {
                    const isCurrentMonthCol = index === currentMonth && ganttYear === currentYear;
                    return (
                      <div
                        key={index}
                        className={cn(
                          'flex-1 min-w-[60px] px-1 py-2 text-center text-xs font-semibold text-gray-600 border-r border-gray-100 last:border-r-0',
                          isCurrentMonthCol && 'bg-green-50 text-green-700'
                        )}
                      >
                        {monthNamesShort[index]}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add action row */}
              <div
                className="flex border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={onAddAction}
              >
                <div className="w-48 md:w-56 flex-shrink-0 px-3 py-2 border-r border-gray-200 bg-white hover:bg-gray-50 sticky left-0 z-10 transition-colors">
                  <div className="flex items-center gap-2 text-green-600 hover:text-green-700">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Agregar accion</span>
                  </div>
                </div>
                <div className="flex flex-1">
                  {months.map((_, monthIndex) => {
                    const isCurrentMonthCol = monthIndex === currentMonth && ganttYear === currentYear;
                    return (
                      <div
                        key={monthIndex}
                        className={cn(
                          'flex-1 min-w-[60px] border-r border-gray-100 last:border-r-0 min-h-[40px]',
                          isCurrentMonthCol && 'bg-green-50/30'
                        )}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Render grouped or flat view based on prop
    if (groupByActionType) {
      return renderGroupedGanttView();
    }

    return renderFlatGanttView();
  };

  // Get display title
  const getDisplayTitle = () => {
    if (viewMode === 'month') {
      return format(currentDate, "MMMM 'de' yyyy", { locale: es });
    } else if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

      if (isSameMonth(weekStart, weekEnd)) {
        return `${format(weekStart, 'd')} - ${format(weekEnd, "d 'de' MMMM 'de' yyyy", { locale: es })}`;
      } else {
        return `${format(weekStart, "d 'de' MMM", { locale: es })} - ${format(weekEnd, "d 'de' MMM 'de' yyyy", { locale: es })}`;
      }
    } else {
      return String(ganttYear);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title and navigation */}
          <div className="flex items-center gap-4">
            {/* View toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  viewMode === 'month'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Mes
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  viewMode === 'week'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Semana
              </button>
              <button
                onClick={() => setViewMode('gantt')}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  viewMode === 'gantt'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Gantt
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={goToPrevious}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hoy
              </button>
              <button
                onClick={goToNext}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Current period display */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {getDisplayTitle()}
            </h2>
          </div>
        </div>

        {/* Module color legend (only when showing module colors) */}
        {showModuleColors && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 font-medium mr-2">Modulos:</div>
            {Object.entries(moduleColors).map(([module, color]) => (
              <div key={module} className="flex items-center gap-1.5">
                <div className={cn('w-2.5 h-2.5 rounded-full', color)} />
                <span className="text-xs text-gray-600 capitalize">
                  {module === 'agro' ? 'Agricultura' : module}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Planning indicators legend (when in execution phase) */}
        {shouldShowPlanningIndicators && (hasUnplannedPlans || hasRescheduledPlans) && (
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 font-medium">Leyenda:</div>
            {/* Planned indicator */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-3 bg-gray-300 rounded-sm border-l-2 border-gray-500" />
              <span className="text-xs text-gray-600">Planificado</span>
            </div>
            {/* Unplanned indicator */}
            {hasUnplannedPlans && (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  <Asterisk className="w-3 h-3 text-gray-500" />
                  <div className="w-5 h-3 bg-gray-200 rounded-sm border-l-2 border-dashed border-gray-400" />
                </div>
                <span className="text-xs text-gray-600">No planificado</span>
              </div>
            )}
            {/* Rescheduled indicator */}
            {hasRescheduledPlans && (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  <CalendarClock className="w-3 h-3 text-amber-600" />
                  <div className="w-5 h-3 bg-gray-300 rounded-sm ring-1 ring-amber-400" />
                </div>
                <span className="text-xs text-gray-600">Reprogramado</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Calendar content */}
      <div className="p-4">
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'gantt' && renderGanttView()}
      </div>

      {/* Plan Popover */}
      {selectedPlan && (
        <PlanPopover
          plan={selectedPlan}
          anchorEl={popoverAnchor}
          open={!!selectedPlan}
          onClose={closePopover}
          onView={onPlanView}
          onEdit={onPlanEdit}
        />
      )}
    </div>
  );
}
