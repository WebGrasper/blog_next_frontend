import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import styles from '../styles/SearchSelect.module.css';

const SearchSelect = ({ options, value, onChange, placeholder = "Select category" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div 
        className={`${styles.trigger} ${isOpen ? styles.triggerActive : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? styles.selectedValue : styles.placeholder}>
          {value || placeholder}
        </span>
        <ChevronDown size={18} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
      </div>

      {isOpen && (
        <div 
          className={styles.dropdown}
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          <div className={styles.searchWrapper}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className={styles.optionsList}>
            {!searchTerm && (
              <div
                className={`${styles.option} ${!value ? styles.optionSelected : ''}`}
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
              >
                <span>Select category</span>
                {!value && <Check size={14} className={styles.checkIcon} />}
              </div>
            )}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className={`${styles.option} ${value === option ? styles.optionSelected : ''}`}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <span>{option}</span>
                  {value === option && <Check size={14} className={styles.checkIcon} />}
                </div>
              ))
            ) : (
              <div className={styles.noOptions}>No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
