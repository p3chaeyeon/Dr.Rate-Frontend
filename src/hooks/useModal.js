import { useState, useCallback } from 'react';

const useModal = () => {
    const [isAlertOpen, setIsAlertOpen] = useState(false); //alert 모달 열림상태
    const [isConfirmOpen, setIsConfirmOpen] = useState(false); //confirm 모달 열림상태

    const [alertContent, setAlertContent] = useState({ title: '', message: '' }); //alert 모달 내용
    const [confirmContent, setConfirmContent] = useState({
        title : '',
        message : '',
        onConfirm : null, //확인
        onCancel : null, //취소
    }); //confirm 모달 내용

    //alert 모달열기(제목, 메세지 설정)
    const openAlertModal = useCallback((title = '', message = '') => {
        setAlertContent({ title, message }); //내용설정
        setIsAlertOpen(true); //열림 상태로 변경
    },[]);

    //alert 모달 닫기
    const closeAlertModal = useCallback(() => setIsAlertOpen(false), []);

    //confirm 모달열기
    const openConfirmModal = useCallback(
        (title = '', message = '', onConfirm = () => {}, onCancel = () => {}) => {
            setConfirmContent({ title, message, onConfirm, onCancel });
            setIsConfirmOpen(true);
        },
        []
    );

    //confirm 모달 닫기
    const closeConfirmModal = useCallback(() => setIsConfirmOpen(false), []);

    return {
        isAlertOpen,
        openAlertModal,
        closeAlertModal,
        alertContent,
        isConfirmOpen,
        openConfirmModal,
        closeConfirmModal,
        confirmContent,
    };
}; 
    
export default useModal;
