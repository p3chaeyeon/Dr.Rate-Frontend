/* src/hooks/useSelectDropdown.js */
import { useState, useRef, useEffect } from 'react';

const useSelectDropdown = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // 드롭다운 열고 닫기
    const handleToggleDropdown = (event) => {
        event.stopPropagation(); // 이벤트 전파 차단
        setDropdownOpen((prev) => !prev);
    };

    // 드롭다운 바깥 클릭 감지
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) // 드롭다운 바깥 클릭인지 확인
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return {
        isDropdownOpen,
        setDropdownOpen,
        handleToggleDropdown,
        dropdownRef,
    };
};

export default useSelectDropdown;
