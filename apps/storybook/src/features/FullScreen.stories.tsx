import type { Meta, StoryObj } from '@storybook/react';
import {
  FeatureStoryTable,
  defaultFeatureStoryArgs,
  featureStoryArgTypes,
  type FeatureStoryArgs,
} from './_helpers';

const FEATURE_NAME = 'FullScreen' as const;

const meta: Meta<FeatureStoryArgs> = {
  title: 'Features/FullScreen',
  argTypes: featureStoryArgTypes,
  args: {
    ...defaultFeatureStoryArgs,
    enableFullScreen: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => <FeatureStoryTable featureName={FEATURE_NAME} storyArgs={args} />,
};
