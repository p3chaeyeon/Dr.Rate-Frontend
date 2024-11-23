import { useState, useRef } from 'react';

const useDropdown = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleMouseEnter = () => {
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        setDropdownOpen(false);
    };

    return { isDropdownOpen, setDropdownOpen, dropdownRef, handleMouseEnter, handleMouseLeave };
};

export default useDropdown;
