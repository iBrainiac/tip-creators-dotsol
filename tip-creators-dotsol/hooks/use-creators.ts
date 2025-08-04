import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, type Creator, type CreatorsResponse } from '@/services/api';

export const useCreators = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['creators', params],
    queryFn: () => apiService.getCreators(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreator = (id: string) => {
  return useQuery({
    queryKey: ['creator', id],
    queryFn: () => apiService.getCreatorDetails(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export function useTrendingCreators() {
  return useQuery({
    queryKey: ['creators', 'trending'],
    queryFn: () => apiService.getTrendingCreators(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useOnlineCreators() {
  return useQuery({
    queryKey: ['creators', 'online'],
    queryFn: () => apiService.getOnlineCreators(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useSearchCreators(query: string) {
  return useQuery({
    queryKey: ['creators', 'search', query],
    queryFn: () => apiService.searchCreators(query),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateCreator() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createCreator,
    onSuccess: () => {
      // Invalidate and refetch creators
      queryClient.invalidateQueries({ queryKey: ['creators'] });
    },
  });
}

export function useUpdateCreator() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Creator> }) =>
      apiService.updateCreator(id, updates),
    onSuccess: (updatedCreator) => {
      // Update the specific creator in cache
      queryClient.setQueryData(['creator', updatedCreator.id], updatedCreator);
      // Invalidate creators list
      queryClient.invalidateQueries({ queryKey: ['creators'] });
    },
  });
}

export function useRecordTip() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.recordTip,
    onSuccess: (tip) => {
      // Invalidate creators to update tip counts
      queryClient.invalidateQueries({ queryKey: ['creators'] });
      // Invalidate specific creator
      queryClient.invalidateQueries({ queryKey: ['creator', tip.creatorId] });
    },
  });
} 