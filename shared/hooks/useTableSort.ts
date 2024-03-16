import { useCallback, useState } from 'react';

type SORT_DIRECTIONS = 'ASC' | 'DESC';

export const useTableSort = ({
  initialSort = { col: -1, direction: 'DESC' },
}: {
  initialSort?: { col: number; direction: SORT_DIRECTIONS };
}) => {
  const [sort, setSort] = useState(initialSort);

  const setCol = useCallback(
    (col: number) => {
      if (col === sort.col) {
        // if the column is already sorted in ascending order, sort in descending order
        if (sort.direction === 'ASC') {
          setSort({ col, direction: 'DESC' });
        }
        // if selecting a column in descending order, and that column is not the initial sort column, reset to default sort
        else if (col !== initialSort.col) setSort(initialSort);
        else setSort({ col, direction: 'ASC' });
      } else {
        // if selecting a new column,  sort in ascending order
        setSort({ col, direction: 'ASC' });
      }
    },
    [sort],
  );

  return {
    sort,
    setCol,
  };
};

export default useTableSort;
