import {
  Calendar,
  Droplets,
  Thermometer,
  Award,
  Truck,
  FileText,
  Edit2,
  Trash2,
  Sun,
  Moon,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Modal } from '../common/Modals';
import { useDeleteMilkProduction } from '../../hooks/usePecuarioMutations';
import type { MilkProduction } from '../../types/pecuario.types';

interface MilkProductionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milkProduction: MilkProduction | null;
  onEdit?: (record: MilkProduction) => void;
}

const shiftConfig: Record<string, { label: string; color: string; icon: typeof Sun }> = {
  morning: {
    label: 'Manana',
    color: 'text-amber-600 bg-amber-50',
    icon: Sun,
  },
  afternoon: {
    label: 'Tarde',
    color: 'text-indigo-600 bg-indigo-50',
    icon: Moon,
  },
};

const qualityConfig: Record<string, { label: string; color: string }> = {
  A: {
    label: 'Calidad A',
    color: 'text-green-600 bg-green-50',
  },
  B: {
    label: 'Calidad B',
    color: 'text-yellow-600 bg-yellow-50',
  },
  C: {
    label: 'Calidad C',
    color: 'text-red-600 bg-red-50',
  },
};

const destinationConfig: Record<string, { label: string; color: string; icon: typeof Truck }> = {
  sale: {
    label: 'Venta',
    color: 'text-emerald-600 bg-emerald-50',
    icon: Truck,
  },
  processing: {
    label: 'Procesamiento',
    color: 'text-blue-600 bg-blue-50',
    icon: Droplets,
  },
  calves: {
    label: 'Terneros',
    color: 'text-orange-600 bg-orange-50',
    icon: Users,
  },
};

export default function MilkProductionDetailModal({
  open,
  onOpenChange,
  milkProduction,
  onEdit,
}: MilkProductionDetailModalProps) {
  const deleteMutation = useDeleteMilkProduction();

  if (!milkProduction) return null;

  const shiftInfo = shiftConfig[milkProduction.shift] || {
    label: milkProduction.shift,
    color: 'text-gray-600 bg-gray-100',
    icon: Sun,
  };
  const ShiftIcon = shiftInfo.icon;

  const qualityInfo = milkProduction.quality ? qualityConfig[milkProduction.quality] : null;

  const destinationInfo = milkProduction.destination
    ? destinationConfig[milkProduction.destination]
    : null;

  const handleDelete = async () => {
    if (window.confirm('Esta seguro de que desea eliminar este registro de produccion?')) {
      try {
        await deleteMutation.mutateAsync(milkProduction.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Error deleting milk production:', error);
      }
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de Produccion de Leche"
      description={formatDate(milkProduction.date)}
      size="md"
    >
      <div className="space-y-6">
        {/* Header with Shift Badge */}
        <div className="flex items-center justify-center gap-3">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${shiftInfo.color}`}>
            <ShiftIcon className="w-5 h-5" />
            Turno de {shiftInfo.label}
          </span>
        </div>

        {/* Main Production Stats */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
          <div className="text-center mb-4">
            <Droplets className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <p className="text-4xl font-bold text-blue-700">
              {milkProduction.totalLiters.toLocaleString()} L
            </p>
            <p className="text-sm text-blue-600">Produccion Total</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center bg-white/50 rounded-lg p-3">
              <Users className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{milkProduction.cowsMilked}</p>
              <p className="text-xs text-gray-600">Vacas ordenadas</p>
            </div>
            <div className="text-center bg-white/50 rounded-lg p-3">
              <TrendingUp className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{milkProduction.avgPerCow.toFixed(2)} L</p>
              <p className="text-xs text-gray-600">Promedio/vaca</p>
            </div>
          </div>
        </div>

        {/* Quality and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quality */}
          {qualityInfo && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Calidad</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${qualityInfo.color}`}>
                  {qualityInfo.label}
                </span>
              </div>
            </div>
          )}

          {/* Temperature */}
          {milkProduction.temperature !== undefined && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-cyan-50 rounded-lg">
                <Thermometer className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Temperatura</p>
                <p className="font-medium text-gray-900">{milkProduction.temperature.toFixed(1)} C</p>
              </div>
            </div>
          )}
        </div>

        {/* Destination */}
        {destinationInfo && (
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${destinationInfo.color.split(' ')[1]}`}>
              <destinationInfo.icon className={`w-5 h-5 ${destinationInfo.color.split(' ')[0]}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Destino</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${destinationInfo.color}`}>
                {destinationInfo.label}
              </span>
            </div>
          </div>
        )}

        {/* Date */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha</p>
            <p className="font-medium text-gray-900">{formatDate(milkProduction.date)}</p>
          </div>
        </div>

        {/* Notes */}
        {milkProduction.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
            <div className="flex items-start gap-2 bg-amber-50 rounded-lg p-3">
              <FileText className="w-4 h-4 text-amber-600 mt-0.5" />
              <p className="text-amber-800">{milkProduction.notes}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            className="btn-danger inline-flex items-center gap-2"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </button>
            {onEdit && (
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(milkProduction);
                }}
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
