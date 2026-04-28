import { ChakraProvider, Theme, defaultSystem } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import TableBasicMeta from '../TableBasic.stories';
import { FeatureStoryTable, featureNames } from './_helpers';

const renderWithProviders = (ui: ReactNode) =>
  render(
    <ChakraProvider value={defaultSystem}>
      <Theme appearance="light" hasBackground>
        {ui}
      </Theme>
    </ChakraProvider>,
  );

describe('storybook features', () => {
  it.each(featureNames)('renders feature: %s', (featureName) => {
    renderWithProviders(
      <FeatureStoryTable
        featureName={featureName}
        storyArgs={{ pageSize: 6, rowCount: 24, seedOffset: 0 }}
      />,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders table basic story', () => {
    const BasicComponent = TableBasicMeta.component;
    renderWithProviders(<BasicComponent />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
