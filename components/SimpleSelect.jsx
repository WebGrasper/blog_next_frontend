import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from '../styles/SearchSelect.module.css';

const SimpleSelect = ({ options, value, onChange, placeholder = "Select option", prefix = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
        style={{ minWidth: 'unset' }}
      >
        <span className={value ? styles.selectedValue : styles.placeholder}>
          {prefix}{value || placeholder}
        </span>
        <ChevronDown size={18} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
      </div>

      {isOpen && (
        <div 
          className={styles.dropdown}
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'rgba(255, 255, 255, 0.8)',
            width: '100%',
            minWidth: '120px'
          }}
        >
          <div className={styles.optionsList}>
            {options.map((option) => (
              <div
                key={option}
                className={`${styles.option} ${value === option ? styles.optionSelected : ''}`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                <span>{option}</span>
                {value === option && <Check size={14} className={styles.checkIcon} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleSelect;
