/* src/components/Popup/AutoClosePopup */

import React, { useEffect } from 'react';
import styles from './AutoClosePopup.module.scss';
import { useNavigate } from 'react-router-dom';
import spinner from 'src/assets/icons/spinner.gif';

const AutoClosePopup = ({ isOpen, message, redirectPath, duration = 3000 }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        navigate(redirectPath);
      }, duration);

      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }
  }, [isOpen, navigate, redirectPath, duration]);

  if (!isOpen) return null; // 팝업이 닫혀있으면 렌더링하지 않음

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <div className={styles.loadingDiv}>
            <img className={styles.loadingImg} src={spinner} alt="loading" />
        </div>
        <div className={styles.messageDiv}>
            {message}
        </div>
      </div>
    </div>
  );
};

export default AutoClosePopup;

