import { useTheme, useColorMode } from '@chakra-ui/react';

export default function useBackgroundColor() {
  const { colorMode } = useColorMode();
  const theme = useTheme();

  return colorMode === 'light' ? theme.colors.white : theme.colors.gray[800];
}
