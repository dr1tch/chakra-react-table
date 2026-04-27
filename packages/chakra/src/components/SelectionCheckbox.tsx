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
    mt="0.5"
    onCheckedChange={(details) => onCheckedChange(details.checked === true)}
    size="sm"
  >
    <Checkbox.HiddenInput />
    <Checkbox.Control />
  </Checkbox.Root>
);
