import type { ComponentType, SVGProps } from 'react';

export type CRT_IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const createGlyph = (pathD: string): CRT_IconComponent =>
  function IconGlyph(props) {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        height="1em"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
      >
        <path d={pathD} />
      </svg>
    );
  };

export const DefaultIcons = {
  ChevronDownIcon: createGlyph('m6 9 6 6 6-6'),
  ChevronLeftIcon: createGlyph('m15 18-6-6 6-6'),
  ChevronRightIcon: createGlyph('m9 18 6-6-6-6'),
  SearchIcon: createGlyph('m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14'),
};
