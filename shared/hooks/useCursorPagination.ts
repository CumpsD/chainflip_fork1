import { type Dispatch, type SetStateAction, useMemo, useState } from 'react';

export type CursorPageInfo = {
  startCursor?: string;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  endCursor?: string;
};

export type Cursor = {
  before?: string;
  after?: string;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  pageNumber: number;
  next(): void;
  previous(): void;
  setCursorPageInfo: Dispatch<SetStateAction<CursorPageInfo>>;
  cursorPageInfo: CursorPageInfo;
};

export default function useCursorPagination(): Cursor {
  const [before, setBefore] = useState<string>();
  const [after, setAfter] = useState<string>();
  const [pageNumber, setPageNumber] = useState(1);
  const [cursorPageInfo, setCursorPageInfo] = useState<CursorPageInfo>({});

  const { hasNextPage, hasPreviousPage, startCursor, endCursor } = cursorPageInfo;

  const cursor = useMemo(
    () => ({
      hasNextPage,
      hasPreviousPage: hasPreviousPage && pageNumber > 1,
      before,
      after,
      startCursor,
      endCursor,
      pageNumber,
      next() {
        setPageNumber(pageNumber + 1);
        setBefore(undefined);
        setAfter(endCursor);
      },
      previous() {
        setPageNumber(pageNumber - 1);
        setBefore(startCursor);
        setAfter(undefined);
      },
      cursorPageInfo,
      setCursorPageInfo,
    }),
    [before, after, cursorPageInfo],
  );

  return cursor;
}
