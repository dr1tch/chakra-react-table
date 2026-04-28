export const moveItemToIndex = <T,>(items: T[], sourceIndex: number, targetIndex: number): T[] => {
  if (sourceIndex < 0 || sourceIndex >= items.length) return items;
  if (targetIndex < 0 || targetIndex >= items.length) return items;
  if (sourceIndex === targetIndex) return items;
  const next = [...items];
  const [moved] = next.splice(sourceIndex, 1);
  if (moved === undefined) return items;
  next.splice(targetIndex, 0, moved);
  return next;
};

export const reorderById = (items: string[], sourceId: string, targetId: string): string[] => {
  if (!sourceId || !targetId || sourceId === targetId) return items;
  const sourceIndex = items.indexOf(sourceId);
  const targetIndex = items.indexOf(targetId);
  if (sourceIndex < 0 || targetIndex < 0) return items;
  return moveItemToIndex(items, sourceIndex, targetIndex);
};

export const columnDropId = (columnId: string) => `col-drop:${columnId}`;
export const rowDropId = (rowId: string) => `row-drop:${rowId}`;
export const columnDragId = (columnId: string) => `col-drag:${columnId}`;
export const rowDragId = (rowId: string) => `row-drag:${rowId}`;
