import React from 'react';
import styles from './AlertModal.module.scss';

const AlertModal = ({ isOpen, closeModal, title, message }) => {
  if (!isOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음

  const handleBackgroundClick = (e) => {
    //바탕 클릭 닫기
    if (e.target.classList.contains(styles.alertModal)) {
      closeModal(); 
    }
  };

  return (
    <div className={styles.alertModal} onClick={handleBackgroundClick}>
      <div className={styles.alertModalContent}>
        <h2>{title}</h2>
        <p>{message}</p>
        <button className={styles.alertOkBtn} onClick={closeModal}>
          확인
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
