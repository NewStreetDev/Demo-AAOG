export interface Worker {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'inactive';
}

const workersStore: Worker[] = [
  { id: 'w1', name: 'Juan Garcia', role: 'Encargado General', status: 'active' },
  { id: 'w2', name: 'Roberto Sanchez', role: 'Tecnico Agricola', status: 'active' },
  { id: 'w3', name: 'Maria Lopez', role: 'Veterinaria', status: 'active' },
  { id: 'w4', name: 'Carlos Rodriguez', role: 'Operador', status: 'active' },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getMockWorkers(): Promise<Worker[]> {
  await delay(200);
  return [...workersStore];
}
