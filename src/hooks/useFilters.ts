import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import produce from 'immer';
import useEncryptedStorage from './useEncryptedStorage';
import { CategoryFilterMapType } from '@models/Filters';

type FiltersStore = {
  start: Date | number | null;
  end: Date | number | null;
  categoryMap: CategoryFilterMapType;
  setFilters: (filters: Pick<FiltersStore, 'categoryMap'>) => void;
  setStart: (date: Date | null) => void;
  setEnd: (date: Date | null) => void;
  setCategory(categoryId: string, values: boolean | Array<string>): void;
};

const useFilters = create<FiltersStore>()(
  persist(
    (set) => ({
      start: null,
      end: null,
      categoryMap: {},
      setStart: (start) => set(() => ({ start })),
      setEnd: (end) => set(() => ({ end })),
      setFilters: (filters) => set(() => filters),
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
        start: state.start instanceof Date ? state.start.getTime() : state.start,
        end: state.end instanceof Date ? state.end.getTime() : state.end,
      }),
    },
  ),
);

export default useFilters;
