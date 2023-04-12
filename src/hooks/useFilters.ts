import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import produce from 'immer';
import useEncryptedStorage from './useEncryptedStorage';
import { DateFilterType, CategoryFilterMapType } from '@models/Filters';

type FiltersStore = {
  start: DateFilterType;
  end: DateFilterType;
  categoryMap: CategoryFilterMapType;
  setFilters: (filters: Pick<FiltersStore, 'categoryMap'>) => void;
  resetFilters: () => void;
  setRange: (range: { start?: Date | null; end?: Date | null }) => void;
  setCategory(categoryId: string, values: boolean | Array<string>): void;
};

const useFilters = create<FiltersStore>()(
  persist(
    (set) => ({
      start: null,
      end: null,
      categoryMap: {},
      setFilters: (filters) => set(() => filters),
      resetFilters: () => set(() => ({ start: null, end: null, categoryMap: {} })),
      setRange: ({ start, end }) =>
        set(() => ({
          start: start instanceof Date ? start.getTime() : start,
          end: end instanceof Date ? end.getTime() : end,
        })),
      setCategory: (categoryId, values) =>
        set(
          produce<FiltersStore>((state) => {
            state.categoryMap[categoryId] = values;
          }),
        ),
    }),
    {
      name: 'filters',
      storage: createJSONStorage(() => {
        const encryptedStorage = useEncryptedStorage.getState().storage;

        if (!encryptedStorage) {
          throw new Error('No storage');
        }

        return encryptedStorage;
      }),
      partialize: (state) => ({
        categoryMap: state.categoryMap,
        start: state.start,
        end: state.end,
      }),
    },
  ),
);

export default useFilters;
