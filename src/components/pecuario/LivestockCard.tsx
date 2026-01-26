import { MapPin, Calendar, Scale, ChevronRight } from 'lucide-react';
import type { Livestock } from '../../types/pecuario.types';

interface LivestockCardProps {
  animal: Livestock;
  onClick?: () => void;
}

// Labels for all categories
const categoryLabels: Record<string, string> = {
  // Bovinos
  ternero: 'Ternero', ternera: 'Ternera', novillo: 'Novillo', novilla: 'Novilla', vaca: 'Vaca', toro: 'Toro',
  // Porcinos
  lechon: 'Lechón', lechona: 'Lechona', cerdo: 'Cerdo', cerda: 'Cerda', verraco: 'Verraco',
  // Caprinos
  cabrito: 'Cabrito', cabrita: 'Cabrita', chivo: 'Chivo', cabra: 'Cabra', semental_caprino: 'Semental',
  // Bufalinos
  bucerro: 'Bucerro', bucerra: 'Bucerra', bubillo: 'Bubillo', bubilla: 'Bubilla', bufala: 'Búfala', bufalo: 'Búfalo',
  // Equinos
  potro: 'Potro', potra: 'Potra', caballo: 'Caballo', yegua: 'Yegua', semental_equino: 'Semental',
  // Ovinos
  cordero: 'Cordero', cordera: 'Cordera', borrego: 'Borrego', oveja: 'Oveja', carnero: 'Carnero',
  // Aves
  gallina: 'Gallina', gallo: 'Gallo', pollo: 'Pollo', chompipe: 'Chompipe', pato: 'Pato', pata: 'Pata', ave_otro: 'Ave',
};

// Colors by species
const speciesColors: Record<string, string> = {
  bovine: 'bg-blue-100 text-blue-700',
  porcine: 'bg-pink-100 text-pink-700',
  caprine: 'bg-amber-100 text-amber-700',
  buffalo: 'bg-gray-100 text-gray-700',
  equine: 'bg-purple-100 text-purple-700',
  ovine: 'bg-green-100 text-green-700',
  poultry: 'bg-orange-100 text-orange-700',
};

function getCategoryLabel(category: Livestock['category']): string {
  return categoryLabels[category] || category;
}

function getCategoryColor(animal: Livestock): string {
  return speciesColors[animal.species] || 'bg-gray-100 text-gray-700';
}

function getStatusInfo(status: Livestock['status']): { label: string; color: string } {
  const statusMap = {
    active: { label: 'Activo', color: 'bg-green-100 text-green-700' },
    sold: { label: 'Vendido', color: 'bg-gray-100 text-gray-600' },
    deceased: { label: 'Fallecido', color: 'bg-red-100 text-red-700' },
    transferred: { label: 'Trasladado', color: 'bg-blue-100 text-blue-600' },
  };
  return statusMap[status] || statusMap.active;
}

function calculateAge(birthDate: Date): string {
  const now = new Date();
  const birth = new Date(birthDate);
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());

  if (months < 12) {
    return `${months} meses`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) {
    return `${years} año${years > 1 ? 's' : ''}`;
  }
  return `${years}a ${remainingMonths}m`;
}

export default function LivestockCard({ animal, onClick }: LivestockCardProps) {
  const categoryLabel = getCategoryLabel(animal.category);
  const categoryColor = getCategoryColor(animal);
  const statusInfo = getStatusInfo(animal.status);

  return (
    <div
      className="card p-5 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-lg">{animal.tag}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColor}`}>
              {categoryLabel}
            </span>
          </div>
          {animal.name && (
            <p className="text-sm text-gray-600 mt-0.5">{animal.name}</p>
          )}
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{calculateAge(animal.birthDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Scale className="w-4 h-4 text-gray-400" />
          <span>{animal.weight} kg</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{animal.location}</span>
        </div>
      </div>

      {/* Breed and Parents */}
      <div className="pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          <span className="font-medium">Raza:</span> {animal.breed}
        </p>
        {(animal.motherTag || animal.fatherTag) && (
          <p className="text-xs text-gray-500 mt-1">
            {animal.motherTag && <span>Madre: {animal.motherTag}</span>}
            {animal.motherTag && animal.fatherTag && ' • '}
            {animal.fatherTag && <span>Padre: {animal.fatherTag}</span>}
          </p>
        )}
      </div>

      {/* View More */}
      <div className="flex justify-end mt-3">
        <button className="btn-ghost text-xs gap-1 px-2 py-1">
          Ver Detalles
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
