import React from 'react';
import { useSetAtom } from 'jotai';
import AlertModal from './AlertModal';
import { isAlertOpenAtom, alertContentAtom } from '../atoms/alertAtom';

const Test01 = () => {
  const setIsAlertOpen = useSetAtom(isAlertOpenAtom);
  const setAlertContent = useSetAtom(alertContentAtom);

  const handleOpenModal = () => {
    setAlertContent({
      title: '모달 제목 예제',
      message: '여기에 표시될 모달 내용입니다.',
    });
    setIsAlertOpen(true);
  };

  return (
    <div>
      <button onClick={handleOpenModal}>모달 열기</button>
      <AlertModal />
    </div>
  );
};

export default Test01;
