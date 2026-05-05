import React from 'react';
import styles from './ConfirmModal.module.css';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  description = "This action cannot be undone.",
  confirmText = "Yes, Delete",
  cancelText = "No, Cancel",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className={styles.iconWrapper}>
          <AlertTriangle size={32} className={styles[type + 'Icon']} />
        </div>
        
        <div className={styles.textWrapper}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
        
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            {cancelText}
          </button>
          <button 
            className={`${styles.confirmBtn} ${styles[type + 'Btn']}`} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
