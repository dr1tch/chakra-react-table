export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
