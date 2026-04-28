import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  FeatureStoryTable,
  defaultFeatureStoryArgs,
  featureStoryArgTypes,
  type FeatureStoryArgs,
} from './_helpers';

const FEATURE_NAME = 'Pagination' as const;

const meta: Meta<FeatureStoryArgs> = {
  title: 'Features/Pagination',
  argTypes: featureStoryArgTypes,
  args: defaultFeatureStoryArgs,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => <FeatureStoryTable featureName={FEATURE_NAME} storyArgs={args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('moves to next page', async () => {
      const nextButton = canvas.getByLabelText('Next page');
      await userEvent.click(nextButton);
      await waitFor(() => {
        expect(canvas.getByText(/Page 2 of/i)).toBeInTheDocument();
      });
    });
  },
};
