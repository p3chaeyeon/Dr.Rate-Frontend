import React from 'react';
import styles from './AlertModal.module.scss';

const AlertModal = ({ isOpen, closeModal, title, message, onConfirm }) => {
  if (!isOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음

  const handleBackgroundClick = (e) => {
    // 배경 클릭으로 모달 닫기
    if (e.target.classList.contains(styles.alertModal)) {
      if (onConfirm) onConfirm();
      closeModal(); // closeModal 함수 실행
    }
  };

  const handleClose = () => {
    if (onConfirm) onConfirm(); // onConfirm 콜백 실행
    closeModal(); // 모달 닫기
  };

  return (
    <div
      className={styles.alertModal}
      onClick={handleBackgroundClick} // 배경 클릭 핸들러
    >
      <div className={styles.alertModalContent}>
        {/* Alert Modal 제목 */}
        <h2>{title}</h2>

        {/* Alert Modal 메시지 */}
        <p>{message}</p>

        {/* Alert Modal 확인 버튼 */}
        <button
          className={styles.alertOkBtn}
          onClick={handleClose} // 버튼 클릭 시 모달 닫기
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
