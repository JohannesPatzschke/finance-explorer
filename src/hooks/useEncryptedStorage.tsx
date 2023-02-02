import { create } from 'zustand';
import EncryptedLocalStorage from '../utils/encryptedLocalStorage';

interface EncryptedStorage {
  storage: null | EncryptedLocalStorage;
  unlockStorage: (secret: string) => void;
}

const useEncryptedStorage = create<EncryptedStorage>((set) => ({
  storage: import.meta.env.VITE_STORAGE_SECRET
    ? new EncryptedLocalStorage(import.meta.env.VITE_STORAGE_SECRET)
    : null,
  unlockStorage: (secret) => set(() => ({ storage: new EncryptedLocalStorage(secret) })),
}));

export default useEncryptedStorage;
