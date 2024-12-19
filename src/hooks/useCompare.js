import React, { useCallback, useState } from 'react';

const useCompare = () => {
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [compareContent, setCompareContent] = useState({
        title: '',
        onCompare: () => {},
        onCancel: () => {}
    })

    /* 열기 */
    const openCompareModal = useCallback(
        (title = '', onCompare = () => {}, onCancel = () => {}) => {
            setCompareContent({ title, onCompare, onCancel }); 
            setIsCompareOpen(true);
        }, []
    );

    /* 닫기 */
    const closeCompareModal = useCallback(() => {
        setIsCompareOpen(false);
    }, []);

    return {
        isCompareOpen,
        openCompareModal,
        closeCompareModal,
        compareContent
    };
};

export default useCompare;