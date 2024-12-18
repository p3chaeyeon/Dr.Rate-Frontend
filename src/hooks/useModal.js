import { useState, useCallback } from 'react';

const useModal = () => {

    /* State : Alert Modal 관련 상태 */
    const [isAlertOpen, setIsAlertOpen] = useState(false); // Alert Modal 열림 상태
    const [alertContent, setAlertContent] = useState({ 
        title: '',         // Alert Modal 제목
        message: ''        // Alert Modal 메시지
    }); // Alert Modal 내용


    /* State : Confirm Modal 관련 상태 */
    const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Confirm Modal 열림 상태

    const [confirmContent, setConfirmContent] = useState({
        title : '',         // Confirm Modal 제목
        message : '',       // Confirm Modal 메시지
        onConfirm : null,   // Confirm 버튼 핸들러
        onCancel : null,    // Cancel 버튼 핸들러
    }); // Confirm Modal 내용


    /* Functions : Alert Modal 열기 */
    const openAlertModal = useCallback(
        (title = "", message = "", onConfirm = null) => {
          setAlertContent({ title, message, onConfirm }); // onConfirm 콜백 추가
          setIsAlertOpen(true); // Alert Modal 열림 상태로 변경
        },
        []
      );

    /* Functions : Alert Modal 닫기 */
    const closeAlertModal = useCallback(() => {
        setIsAlertOpen(false); // Alert Modal 닫힘 상태로 변경 
    }, []);


    /* Functions : Confirm Modal 열기 */
    const openConfirmModal = useCallback(
        (title = '', message = '', onConfirm = () => {}, onCancel = () => {}) => {
            setConfirmContent({ title, message, onConfirm, onCancel });    // Confirm Modal 제목, 메시지, 확인 버튼 기능, 취소 버튼 기능 설정
            setIsConfirmOpen(true);                                        // Confirm Modal 열림 상태로 변경
        }, []
    );

    /* Functions : Confirm Modal 닫기 */
    const closeConfirmModal = useCallback(() => {
        setIsConfirmOpen(false); // Confirm Modal 닫힘 상태로 변경
    }, []);

    return {
        // Alert Modal 상태와 제어 함수
        isAlertOpen,
        openAlertModal,
        closeAlertModal,
        alertContent,

        // Confirm Modal 상태와 제어 함수
        isConfirmOpen,
        openConfirmModal,
        closeConfirmModal,
        confirmContent,
    };
}; 
    
export default useModal;
