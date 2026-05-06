import { useState, useCallback } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && (totalPages === 0 || newPage <= totalPages)) {
      setPage(newPage);
    }
  }, [totalPages]);

  const handleLimitChange = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  }, []);

  const updatePaginationData = useCallback((data) => {
    if (data) {
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 0);
    }
  }, []);

  return {
    page,
    limit,
    totalCount,
    totalPages,
    handlePageChange,
    handleLimitChange,
    updatePaginationData,
    setPage
  };
};
