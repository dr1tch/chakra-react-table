import type { Meta, StoryObj } from '@storybook/react';
import {
  FeatureStoryTable,
  defaultFeatureStoryArgs,
  featureStoryArgTypes,
  type FeatureStoryArgs,
} from './_helpers';

const FEATURE_NAME = 'Virtualization' as const;

const meta: Meta<FeatureStoryArgs> = {
  title: 'Features/Virtualization',
  argTypes: featureStoryArgTypes,
  args: defaultFeatureStoryArgs,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    enablePagination: false,
    enableVirtualization: true,
    virtualizationHeight: 440,
    virtualizationOverscan: 8,
    virtualizationRowHeight: 44,
    rowCount: 2000,
  },
  render: (args) => <FeatureStoryTable featureName={FEATURE_NAME} storyArgs={args} />,
};
