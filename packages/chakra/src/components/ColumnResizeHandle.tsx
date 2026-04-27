import { Box, Icon } from '@chakra-ui/react';
import { GripVertical } from 'lucide-react';

type ColumnResizeHandleProps = {
  canResize: boolean;
  columnResizeDirection: 'ltr' | 'rtl';
  columnResizeMode: 'onChange' | 'onEnd';
  deltaOffset: number;
  isResizing: boolean;
  onResetSize: () => void;
  onResizeStart: (event: unknown) => void;
};

export const ColumnResizeHandle = ({
  canResize,
  columnResizeDirection,
  columnResizeMode,
  deltaOffset,
  isResizing,
  onResetSize,
  onResizeStart,
}: ColumnResizeHandleProps) => {
  if (!canResize) return null;

  return (
    <Box
      _hover={{ backgroundColor: 'bg.subtle' }}
      backgroundColor={isResizing ? 'bg.subtle' : 'transparent'}
      cursor="col-resize"
      h="100%"
      left={columnResizeDirection === 'rtl' ? '0' : undefined}
      ml={columnResizeDirection === 'rtl' ? '-6px' : undefined}
      mr={columnResizeDirection === 'ltr' ? '-6px' : undefined}
      onDoubleClick={onResetSize}
      onMouseDown={onResizeStart}
      onPointerDown={onResizeStart}
      onTouchStart={onResizeStart}
      position="absolute"
      right={columnResizeDirection === 'ltr' ? '0' : undefined}
      style={{
        transform:
          isResizing && columnResizeMode === 'onEnd'
            ? `translateX(${
                (columnResizeDirection === 'rtl' ? -1 : 1) * deltaOffset
              }px)`
            : undefined,
      }}
      top="0"
      touchAction="none"
      userSelect="none"
      w="14px"
      zIndex={4}
    >
      <Box
        alignItems="center"
        display="flex"
        h="100%"
        justifyContent="center"
        left="50%"
        pointerEvents="none"
        position="absolute"
        top="0"
        transform="translateX(-50%)"
        w="14px"
      >
        <Box
          backgroundColor={isResizing ? 'blue.500' : 'border.emphasized'}
          borderRadius="full"
          h="60%"
          opacity={isResizing ? 1 : 0.7}
          position="absolute"
          transition="background-color 0.12s ease, opacity 0.12s ease"
          w="2px"
        />
        <Icon
          as={GripVertical}
          boxSize="10px"
          color={isResizing ? 'blue.600' : 'fg.muted'}
          opacity={isResizing ? 1 : 0.75}
        />
      </Box>
    </Box>
  );
};
