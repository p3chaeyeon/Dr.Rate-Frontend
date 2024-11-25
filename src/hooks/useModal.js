import { useState, useCallback } from 'react';

const useModal = () => {
    const [isOpen, setIsOpen] = useState(false); //모달 열림 상태
    const [content, setContent] = useState({ title: '', message: '' }); //모달 내용 상태

    //모달열기(제목, 메세지 설정)
    const openModal = useCallback((title = '', message = '') => {
        setContent({ title, message }); //내용설정
        setIsOpen(true); //열림 상태로 변경
    },[]);

    //모달 닫기
    const closeModal = useCallback(() => setIsOpen(false), []);
    return { isOpen, openModal, closeModal, content };
    };

export default useModal;
