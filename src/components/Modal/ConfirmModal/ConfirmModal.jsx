import React from 'react';
import styles from './ConfirmModal.module.scss';

const ConfirmModal = ({ isOpen, closeModal, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null; //모달이 닫혀있으면 렌더링하지 않음

  const handleBackgroundClick = (e) => {
    // 배경 클릭으로 모달 닫기
    if (e.target.classList.contains(styles.confirmModal)) {
      closeModal();
    }
  };

  return (
    <div
      className={styles.confirmModal}
      onClick={handleBackgroundClick} // 배경 클릭 핸들러
    >
      <div className={styles.confirmModalContent}>
        {/* Confirm Modal 제목 */}
        <h2>{title}</h2>

        {/* Confirm Modal 메시지 */}
        <p>{message}</p>

        {/* Confirm Modal 확인, 취소 버튼 */}
        <div className={styles.buttonContainer}>
          <button 
            className={styles.cancelButton} 
            onClick={onCancel} // 취소 버튼 기능 수행
              // 사용하는 페이지에서 수행할 기능과 closeConfirmModal(); 을 포함한 이벤트 핸들러를 생성해야함
          >
            취소
          </button>
          <button 
            className={styles.confirmButton} 
            onClick={onConfirm} // 확인 버튼 기능 수행
              // 사용하는 페이지에서 수행할 기능과 closeConfirmModal(); 을 포함한 이벤트 핸들러를 생성해야함
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;