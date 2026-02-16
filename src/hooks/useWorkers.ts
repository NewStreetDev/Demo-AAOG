import { useQuery } from '@tanstack/react-query';
import { getMockWorkers } from '../services/mock/workers.mock';

export function useWorkers() {
  return useQuery({
    queryKey: ['workers'],
    queryFn: getMockWorkers,
  });
}
