import type { Meta, StoryObj } from '@storybook/react';
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
};
