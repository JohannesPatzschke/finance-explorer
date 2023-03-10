import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import produce from 'immer';
import { CategoryObject, CategoryType } from '../models/Category';

import useEncryptedStorage from './useEncryptedStorage';
import defaultCategories from '../constants/defaultCategories.json';

type CategoriesStore = {
  categories: Array<CategoryType>;
  setCategories: (categories: Array<CategoryType>) => void;
  resetCategories: () => void;
  getCategoryName: (categoryId: string) => { category: string };
  getGroupName: (categoryId: string, groupId: string) => { category: string; group: string };
  addCategory: (category: CategoryType) => void;
  saveCategory: (category: CategoryType) => void;
  removeCategory: (categoryId: string) => void;
};

const useCategories = create<CategoriesStore>()(
  persist(
    (set, get) => ({
      categories: defaultCategories,
      setCategories: (categories) => set(() => ({ categories })),
      resetCategories: () => set(() => ({ categories: defaultCategories })),
      getCategoryName: (categoryId) => {
        // TODO resolve with map
        const category = get().categories.find(({ id }) => id === categoryId);

        return { category: category?.name ?? '' };
      },
      getGroupName: (categoryId, groupId) => {
        // TODO resolve with map
        const category = get().categories.find(({ id }) => id === categoryId);
        const group = category?.groups?.find(({ id }) => id === groupId);

        return { category: category?.name ?? '', group: group?.name ?? '' };
      },
      addCategory: (category) => {
        CategoryObject.parse(category);

        return set(
          produce<CategoriesStore>((state) => {
            state.categories.push(category);
          }),
        );
      },
      saveCategory: (category) => {
        CategoryObject.parse(category);

        return set(
          produce<CategoriesStore>((state) => {
            const index = state.categories.findIndex(({ id }) => id === category.id);

            if (index !== -1) {
              state.categories[index] = category;
            }
          }),
        );
      },
      removeCategory: (categoryId) =>
        set(
          produce<CategoriesStore>((state) => {
            const index = state.categories.findIndex(({ id }) => id === categoryId);

            if (index !== -1) {
              state.categories.splice(index, 1);
            }
          }),
        ),
    }),
    {
      name: 'categories',
      storage: createJSONStorage(() => {
        const encryptedStorage = useEncryptedStorage.getState().storage;

        if (!encryptedStorage) {
          throw new Error('No storage');
        }

        return encryptedStorage;
      }),
      partialize: (state) => ({ categories: state.categories }),
    },
  ),
);

export default useCategories;
