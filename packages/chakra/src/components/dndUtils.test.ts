import { describe, expect, it } from 'vitest';
import { moveItemToIndex, reorderById } from './dndUtils';

describe('dndUtils', () => {
  it('moves an item by index', () => {
    expect(moveItemToIndex(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
  });

  it('returns original items when indexes are invalid', () => {
    const items = ['a', 'b', 'c'];
    expect(moveItemToIndex(items, -1, 2)).toEqual(items);
    expect(moveItemToIndex(items, 1, 99)).toEqual(items);
  });

  it('reorders by id', () => {
    expect(reorderById(['first', 'second', 'third'], 'first', 'third')).toEqual([
      'second',
      'third',
      'first',
    ]);
  });

  it('does not reorder when ids are missing', () => {
    const items = ['first', 'second', 'third'];
    expect(reorderById(items, 'missing', 'third')).toEqual(items);
    expect(reorderById(items, 'first', 'missing')).toEqual(items);
  });
});
