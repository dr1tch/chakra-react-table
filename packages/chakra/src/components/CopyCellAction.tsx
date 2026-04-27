import { Clipboard, IconButton } from '@chakra-ui/react';
import { Check, Copy } from 'lucide-react';

type CopyCellActionProps = {
  value: string;
};

export const CopyCellAction = ({ value }: CopyCellActionProps) => (
  <Clipboard.Root value={value}>
    <Clipboard.Trigger asChild>
      <IconButton aria-label="Copy cell value" size="xs" variant="ghost">
        <Clipboard.Indicator copied={<Check size={14} />}>
          <Copy size={14} />
        </Clipboard.Indicator>
      </IconButton>
    </Clipboard.Trigger>
  </Clipboard.Root>
);
