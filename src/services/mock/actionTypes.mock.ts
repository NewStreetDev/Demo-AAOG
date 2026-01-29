import { planActionTypeOptions } from '../../schemas/finca.schema';
import type { SelectOption } from '../../components/common/Forms/FormSelect';

const STORAGE_KEY = 'custom_action_types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get custom action types from localStorage
export function getCustomActionTypes(): SelectOption[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as SelectOption[];
    }
  } catch (error) {
    console.error('Error reading custom action types:', error);
  }
  return [];
}

// Save custom action types to localStorage
function saveCustomActionTypes(types: SelectOption[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(types));
  } catch (error) {
    console.error('Error saving custom action types:', error);
  }
}

// Get all action types (built-in + custom)
export async function getMockAllActionTypes(): Promise<SelectOption[]> {
  await delay(100);
  const customTypes = getCustomActionTypes();
  return [...planActionTypeOptions, ...customTypes];
}

// Add a new custom action type
export async function addMockCustomActionType(
  label: string,
  value: string
): Promise<SelectOption> {
  await delay(200);

  // Get all existing types (built-in + custom)
  const builtInValues = planActionTypeOptions.map(opt => opt.value);
  const customTypes = getCustomActionTypes();
  const customValues = customTypes.map(opt => opt.value);

  // Check for duplicates
  if (builtInValues.includes(value) || customValues.includes(value)) {
    throw new Error(`El tipo de accion "${label}" ya existe`);
  }

  // Create new option
  const newOption: SelectOption = { value, label };

  // Save to localStorage
  saveCustomActionTypes([...customTypes, newOption]);

  return newOption;
}

// Utility function to convert label to value
// "Fumigacion Aerea" -> "fumigacion_aerea"
export function labelToValue(label: string): string {
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '_'); // Replace spaces with underscores
}
