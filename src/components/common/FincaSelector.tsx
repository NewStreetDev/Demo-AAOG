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
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <MapPin className="w-4 h-4 text-green-700" />
        <span>{currentFinca.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-3 py-2 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase">Mis Fincas</p>
          </div>
          {fincas.map((finca) => (
            <button
              key={finca.id}
              onClick={() => {
                setCurrentFinca(finca);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              role="option"
              aria-selected={currentFinca.id === finca.id}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div className="text-left">
                  <p className="font-medium">{finca.name}</p>
                  <p className="text-xs text-gray-500">{finca.totalArea} hectáreas</p>
                </div>
              </div>
              {currentFinca.id === finca.id && (
                <Check className="w-4 h-4 text-green-700" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
