import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import {
  FeatureStoryTable,
  defaultFeatureStoryArgs,
  featureStoryArgTypes,
  type FeatureStoryArgs,
} from './_helpers';

const FEATURE_NAME = 'ColumnDragging' as const;

const meta: Meta<FeatureStoryArgs> = {
  title: 'Features/ColumnDragging',
  argTypes: featureStoryArgTypes,
  args: defaultFeatureStoryArgs,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    enableColumnDragging: true,
  },
  render: (args) => <FeatureStoryTable featureName={FEATURE_NAME} storyArgs={args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('renders column drag handles and accepts pointer interactions', async () => {
      const source = canvas.getByLabelText('Drag column firstName');
      const target = canvas.getByLabelText('Drag column lastName');

      fireEvent.pointerDown(source, { button: 0, clientX: 20, clientY: 20 });
      fireEvent.pointerMove(target, { clientX: 40, clientY: 20 });
      fireEvent.pointerUp(target, { button: 0 });

      await waitFor(() => {
        expect(canvas.getByLabelText('Drag column firstName')).toBeInTheDocument();
        expect(canvas.getByLabelText('Drag column lastName')).toBeInTheDocument();
      });
    });
  },
};
