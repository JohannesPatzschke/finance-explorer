import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import produce from 'immer';
import useEncryptedStorage from './useEncryptedStorage';
import { CategoryFilterMapType } from '@models/Filters';

type FiltersStore = {
  categoryMap: CategoryFilterMapType;
  setCategory(categoryId: string, values: boolean | Array<string>): void;
};

const useFilters = create<FiltersStore>()(
  persist(
    (set) => ({
      categoryMap: {},
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
      partialize: (state) => ({ categoryMap: state.categoryMap }),
    },
  ),
);

export default useFilters;
