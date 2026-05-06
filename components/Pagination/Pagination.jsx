import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';
import SimpleSelect from '../SimpleSelect';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onLimitChange, 
  limit, 
  showLimitSelector = true,
  className = ""
}) => {
  if (totalPages <= 1 && !showLimitSelector) return null;

  return (
    <div className={`${styles.paginationContainer} ${className}`}>
      {showLimitSelector && (
        <div className={styles.limitSelector}>
          <SimpleSelect
            options={[10, 15, 20, 25]}
            value={limit}
            onChange={onLimitChange}
            prefix="Show: "
          />
        </div>
      )}

      <div className={styles.controls}>
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={styles.arrowBtn}
          aria-label="Previous Page"
        >
          <ChevronLeft size={20} />
        </button>

        <div className={styles.pageInfo}>
          <span className={styles.current}>{currentPage}</span>
          <span className={styles.divider}>/</span>
          <span className={styles.total}>{totalPages || 1}</span>
        </div>

        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={styles.arrowBtn}
          aria-label="Next Page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
