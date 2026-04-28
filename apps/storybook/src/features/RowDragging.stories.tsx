import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import {
  FeatureStoryTable,
  defaultFeatureStoryArgs,
  featureStoryArgTypes,
  type FeatureStoryArgs,
} from './_helpers';

const FEATURE_NAME = 'RowDragging' as const;

const meta: Meta<FeatureStoryArgs> = {
  title: 'Features/RowDragging',
  argTypes: featureStoryArgTypes,
  args: defaultFeatureStoryArgs,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    enableRowDragging: true,
  },
  render: (args) => <FeatureStoryTable featureName={FEATURE_NAME} storyArgs={args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('renders row drag handles and accepts pointer interactions', async () => {
      const rowDragHandles = canvas.getAllByLabelText(/Drag row/i);
      expect(rowDragHandles.length).toBeGreaterThan(2);

      const source = rowDragHandles[0];
      const target = rowDragHandles[2];

      fireEvent.pointerDown(source, { button: 0, clientX: 20, clientY: 20 });
      fireEvent.pointerMove(target, { clientX: 20, clientY: 60 });
      fireEvent.pointerUp(target, { button: 0 });

      await waitFor(() => {
        expect(canvas.getAllByLabelText(/Drag row/i).length).toBeGreaterThan(2);
      });
    });
  },
};
