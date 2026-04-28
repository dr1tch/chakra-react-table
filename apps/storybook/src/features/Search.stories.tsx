import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  FeatureStoryTable,
  defaultFeatureStoryArgs,
  featureStoryArgTypes,
  type FeatureStoryArgs,
} from './_helpers';

const FEATURE_NAME = 'Search' as const;

const meta: Meta<FeatureStoryArgs> = {
  title: 'Features/Search',
  argTypes: featureStoryArgTypes,
  args: defaultFeatureStoryArgs,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => <FeatureStoryTable featureName={FEATURE_NAME} storyArgs={args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('filters rows via global search', async () => {
      const searchInput = canvas.getByPlaceholderText('Search rows...');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'zzzzzz_not_found');
      await waitFor(() => {
        expect(canvas.getByText('No records to display')).toBeInTheDocument();
      });
    });
  },
};
