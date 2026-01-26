import { MapPin, Phone, Mail, Edit, User } from 'lucide-react';
import type { Finca } from '../../types/finca.types';

interface FincaOverviewCardProps {
  finca: Finca;
  onEdit: () => void;
}

export default function FincaOverviewCard({ finca, onEdit }: FincaOverviewCardProps) {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{finca.name}</h2>
          <div className="flex items-center gap-2 mt-1 text-green-100">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{finca.location.address}</span>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          title="Editar finca"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-green-100 text-xs uppercase tracking-wider">Area Total</p>
          <p className="text-xl font-bold mt-1">{finca.totalArea} ha</p>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-green-100 text-xs uppercase tracking-wider">Estado</p>
          <p className="text-xl font-bold mt-1">
            {finca.status === 'active' ? 'Activa' : 'Inactiva'}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
        <div className="flex items-center gap-2 text-sm text-green-100">
          <User className="w-4 h-4" />
          <span>{finca.owner}</span>
        </div>
        {finca.contactPhone && (
          <div className="flex items-center gap-2 text-sm text-green-100">
            <Phone className="w-4 h-4" />
            <span>{finca.contactPhone}</span>
          </div>
        )}
        {finca.contactEmail && (
          <div className="flex items-center gap-2 text-sm text-green-100">
            <Mail className="w-4 h-4" />
            <span>{finca.contactEmail}</span>
          </div>
        )}
      </div>

      {finca.description && (
        <p className="mt-4 text-sm text-green-100 line-clamp-2">
          {finca.description}
        </p>
      )}
    </div>
  );
}
