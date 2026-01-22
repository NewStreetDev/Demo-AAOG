import { BadgeCheck, Mail, Phone, ChevronRight } from 'lucide-react';
import type { Worker } from '../../types/trabajadores.types';

interface WorkerCardProps {
  worker: Worker;
  onClick?: () => void;
}

function getStatusBadgeColor(status: Worker['status']): string {
  const colors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    on_leave: 'bg-amber-100 text-amber-700',
    temporary: 'bg-blue-100 text-blue-700',
  };
  return colors[status] || colors.active;
}

function getRoleLabel(role: Worker['role']): string {
  const labels = {
    jefe: 'Jefe',
    supervisor: 'Supervisor',
    trabajador: 'Trabajador',
    especialista: 'Especialista',
    practicante: 'Practicante',
  };
  return labels[role];
}

function getStatusLabel(status: Worker['status']): string {
  const labels = {
    active: 'Activo',
    inactive: 'Inactivo',
    on_leave: 'En Permiso',
    temporary: 'Temporal',
  };
  return labels[status];
}

function getModuleLabel(module: Worker['moduleAssignment']): string {
  const labels = {
    agro: 'Agricultura',
    pecuario: 'Pecuario',
    apicultura: 'Apicultura',
    procesamiento: 'Procesamiento',
    multiple: 'Múltiple',
  };
  return labels[module];
}

export default function WorkerCard({ worker, onClick }: WorkerCardProps) {
  const statusColor = getStatusBadgeColor(worker.status);

  return (
    <div
      className="card p-5 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">
            {worker.firstName} {worker.lastName}
          </h3>
          <p className="text-sm text-gray-600 mt-0.5">{getRoleLabel(worker.role)}</p>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
          {getStatusLabel(worker.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BadgeCheck className="w-4 h-4 text-gray-400" />
          <span>{worker.documentId}</span>
        </div>
        {worker.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{worker.email}</span>
          </div>
        )}
        {worker.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{worker.phone}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Módulo: <span className="font-medium text-gray-700">{getModuleLabel(worker.moduleAssignment)}</span>
        </div>
        <button className="btn-ghost text-xs gap-1 px-2 py-1">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
