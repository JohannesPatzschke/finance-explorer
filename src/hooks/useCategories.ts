import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import produce from 'immer';
import { CategoryObject, CategoryType } from '../models/Category';

import useEncryptedStorage from './useEncryptedStorage';

const defaultCategories: Array<CategoryType> = [
  {
    id: 'first',
    name: 'Lebensmittel',
    groups: [
      {
        id: 'rewe',
        name: 'REWE',
        expressions: [
          {
            id: 'Rewee',
            value: '\\bREWE\\b',
            isRegExp: true,
          },
        ],
      },
      {
        id: 'beimsz',
        name: 'Bäcker',
        expressions: [
          {
            id: 'beims',
            value: '\\bbeims\\b',
            isRegExp: true,
          },
          {
            id: 'Steinecke',
            value: 'Steinecke',
            isRegExp: false,
          },
        ],
      },
    ],
  },
  {
    id: 'second',
    name: 'Lebensmittel',
    groups: [
      {
        id: 'rewe',
        name: 'REWE',
        expressions: [
          {
            id: 'Rewee',
            value: '\\bREWE\\b',
            isRegExp: true,
          },
        ],
      },
      {
        id: 'beimsz',
        name: 'Bäcker',
        expressions: [
          {
            id: 'beims',
            value: '\\bbeims\\b',
            isRegExp: true,
          },
          {
            id: 'Steinecke',
            value: 'Steinecke',
            isRegExp: false,
          },
        ],
      },
    ],
  },
];

type CategoriesStore = {
  categories: Array<CategoryType>;
  getGroupName: (categoryId: string, groupId: string) => { category: string; group: string };
  addCategory: (category: CategoryType) => void;
  saveCategory: (category: CategoryType) => void;
};

const useCategories = create<CategoriesStore>()(
  persist(
    (set, get) => ({
      categories: defaultCategories,
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
