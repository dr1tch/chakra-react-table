import type { Meta, StoryObj } from '@storybook/react';
import { FeatureStoryTable } from './_helpers';

const meta: Meta = {
  title: 'Features/RowPinning',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <FeatureStoryTable featureName="RowPinning" />,
};
