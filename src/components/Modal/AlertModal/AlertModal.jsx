import React from 'react';
import { useAtom } from 'jotai';
import { isAlertOpenAtom, alertContentAtom } from 'src/atoms/alertAtom';

import styles from './AlertModal.module.scss';

const AlertModal = () => {
  const [isAlertOpen, setIsAlertOpen] = useAtom(isAlertOpenAtom); //모달 열림 상태 및 상태변경함수
  const [alertContent] = useAtom(alertContentAtom); //모달의 제목과 메시지 상태

  if (!isAlertOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음

  const handleClose = () => setIsAlertOpen(false); // 확인 버튼 클릭 시 모달 닫기

  return (
    <div className={styles.alertModal}>
      <div className={styles.alertModalContent}>
        <h2>{alertContent.title || '알림 제목'}</h2>
        <p>{alertContent.message || '알림 메시지가 없습니다.'}</p>
        <button className={styles.alertOkBtn} onClick={handleClose}>
          확인
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
