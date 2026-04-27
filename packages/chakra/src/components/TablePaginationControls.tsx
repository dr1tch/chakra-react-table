import { Box, IconButton, Pagination } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type TablePaginationControlsProps = {
  canNextPage: boolean;
  canPreviousPage: boolean;
  count: number;
  onPageChange: (page: number) => void;
  page: number;
  pageSize: number;
};

export const TablePaginationControls = ({
  canNextPage,
  canPreviousPage,
  count,
  onPageChange,
  page,
  pageSize,
}: TablePaginationControlsProps) => (
  <Pagination.Root
    count={count}
    onPageChange={(details) => onPageChange(details.page)}
    page={page}
    pageSize={pageSize}
    siblingCount={0}
  >
    <Box display="flex" gap="1">
      <Pagination.PrevTrigger asChild>
        <IconButton
          aria-label="Previous page"
          disabled={!canPreviousPage}
          size="xs"
          variant="outline"
        >
          <ChevronLeft size={14} />
        </IconButton>
      </Pagination.PrevTrigger>
      <Pagination.NextTrigger asChild>
        <IconButton aria-label="Next page" disabled={!canNextPage} size="xs" variant="outline">
          <ChevronRight size={14} />
        </IconButton>
      </Pagination.NextTrigger>
    </Box>
  </Pagination.Root>
);
