import { ArrowDown, ArrowUp } from 'lucide-react';

type SortIndicatorProps = {
  direction: false | 'asc' | 'desc';
};

export const SortIndicator = ({ direction }: SortIndicatorProps) => {
  if (!direction) return null;
  if (direction === 'asc') return <ArrowUp aria-hidden="true" size={12} />;
  return <ArrowDown aria-hidden="true" size={12} />;
};
