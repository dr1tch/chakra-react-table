import { Checkbox } from '@chakra-ui/react';

type CheckedState = boolean | 'indeterminate';

type SelectionCheckboxProps = {
  ariaLabel: string;
  checked: CheckedState;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export const SelectionCheckbox = ({
  ariaLabel,
  checked,
  disabled,
  onCheckedChange,
}: SelectionCheckboxProps) => (
  <Checkbox.Root
    aria-label={ariaLabel}
    checked={checked}
    disabled={disabled}
    onCheckedChange={(details) => onCheckedChange(details.checked === true)}
  >
    <Checkbox.HiddenInput />
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
  </Checkbox.Root>
);
