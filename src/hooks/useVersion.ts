import { useEffect } from 'react';

const useVersion = () => {
  const version = window.__APP_VERSION__;

  useEffect(() => {
    if (localStorage.getItem('version') !== version) {
      localStorage.setItem('version', version);
    }
  }, [version]);

  return { version };
};

export default useVersion;
