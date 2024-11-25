import React from 'react';
import styles from './ConfirmModal.module.scss';

const ConfirmModal = ({ isOpen, closeModal, title, message, onConfirm, onCancel }) => {
    if(!isOpen) return null; //모달이 닫혀있으면 렌더링하지 않음

    const handleBackgroundClick = (e) => {
        if(e.target.classList.contains(styles.confirmModal)) {
            closeModal();
        }
    };

    return (
        <div className={styles.confirmModal} onClick={handleBackgroundClick}>
        <div className={styles.confirmModalContent}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className={styles.buttonContainer}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            확인
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;