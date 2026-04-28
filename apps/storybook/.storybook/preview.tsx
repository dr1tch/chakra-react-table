import { Box, ChakraProvider, Theme, defaultSystem } from '@chakra-ui/react';
import type { Preview } from '@storybook/react';

type ThemeMode = 'light' | 'dark';

const preview: Preview = {
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global color mode for stories',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const mode = (context.globals.theme as ThemeMode) ?? 'light';

      return (
        <ChakraProvider value={defaultSystem}>
          <Theme appearance={mode} hasBackground>
            <Box minH="100vh" p="4">
              <Story />
            </Box>
          </Theme>
        </ChakraProvider>
      );
    },
  ],
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#111111' },
      ],
    },
  },
};

export default preview;
