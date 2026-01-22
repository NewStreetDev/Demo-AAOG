import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, MapPin } from 'lucide-react';
import { useFinca } from '../../contexts/FincaContext';

export default function FincaSelector() {
  const { currentFinca, fincas, setCurrentFinca } = useFinca();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentFinca) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-200"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center ring-1 ring-green-200/50 transition-transform duration-200 group-hover:scale-110">
          <MapPin className="w-4 h-4 text-green-600" strokeWidth={2.5} />
        </div>
        <span className="max-w-[160px] truncate">{currentFinca.name}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/80 py-2 z-50 animate-slide-down">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mis Fincas</p>
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-hide py-1">
            {fincas.map((finca) => {
              const isSelected = currentFinca.id === finca.id;
              return (
                <button
                  key={finca.id}
                  onClick={() => {
                    setCurrentFinca(finca);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 ${
                    isSelected
                      ? 'bg-green-50 text-green-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-br from-green-100 to-emerald-100 ring-green-200/50'
                        : 'bg-gray-50 ring-gray-200/50'
                    }`}>
                      <MapPin className={`w-5 h-5 ${isSelected ? 'text-green-600' : 'text-gray-400'}`} strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold ${isSelected ? 'text-green-900' : 'text-gray-900'}`}>
                        {finca.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {finca.totalArea} hectáreas
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
