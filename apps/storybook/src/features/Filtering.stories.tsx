import type { Meta, StoryObj } from '@storybook/react';
import { FeatureStoryTable } from './_helpers';

const meta: Meta = {
  title: 'Features/Filtering',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <FeatureStoryTable featureName="Filtering" />,
};
