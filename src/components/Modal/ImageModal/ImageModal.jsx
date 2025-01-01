import React from 'react';
import styles from './ImageModal.module.scss';

const ImageModal = ({ isOpen, closeModal, image, onConfirm }) => {
  if (!isOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음

  const handleBackgroundClick = (e) => {
    // 배경 클릭으로 모달 닫기
    if (e.target.classList.contains(styles.imageModal)) {
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
      className={styles.imageModal}
      onClick={handleBackgroundClick} // 배경 클릭 핸들러
    >
      <div className={styles.imageModalContent}>
        <img src={image} className={styles.imgAlert} />
        {/* Alert Modal 확인 버튼 */}
        <button
          className={styles.imageOkBtn}
          onClick={handleClose} // 버튼 클릭 시 모달 닫기
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
