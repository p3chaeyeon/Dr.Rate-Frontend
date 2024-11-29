/* src/components/FavoritePanel/FavoritePanel.jsx */

import styles from './FavoritePanel.module.scss';
import React, { useState } from 'react';
import { PATH } from "src/utils/path";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { allCheckedAtom, setAllCheckedAtom } from 'src/atoms/favoriteAtoms';
import useFavorite from 'src/hooks/useFavorite';
import useSelectDropdown from 'src/hooks/useSelectDropdown';
import rightArrowIcon from 'src/assets/icons/rightArrow.svg';
import downArrowIcon from 'src/assets/icons/downDetailArrow.svg';

const FavoritePanel = ({ favoriteDataLength }) => {
    const location = useLocation();
    // const isPathActive = (paths) => paths.some((path) => location.pathname.includes(path));

    const [allChecked] = useAtom(allCheckedAtom);
    const [, setAllCheckedState] = useAtom(setAllCheckedAtom);

    const { handleIndividualCheck } = useFavorite(favoriteDataLength);
    const handleAllCheck = (e) => {
        setAllCheckedState(e.target.checked); // 전체 체크박스 상태 업데이트
    };

    /* useSelectDropdown hooks 사용 */
    const { isDropdownOpen, setDropdownOpen, handleToggleDropdown, dropdownRef } = useSelectDropdown();
    const [searchKey, setSearchKey] = useState('은행'); // 드롭다운 선택된 값

    // 드롭다운 아이템 클릭 핸들러
    const handleSelectItemClick = (value) => {
        setSearchKey(value); // 선택된 값을 업데이트
        setDropdownOpen(false); // 드롭다운 닫기
    };

    
    return (
        <div className={ styles.favoritePanel }>

            {/* 즐겨찾기 카테고리 - 예금 or 적금 */}
            <div className={ styles.favoriteCategoryDiv }>
                <div className={ styles.favoriteCategoryItem }>즐겨찾기</div>
                <div className={ styles.favoriteCategoryItem }>
                    <img src={rightArrowIcon} alt="오른쪽 화살표" className={styles.rightArrowIcon} />
                </div>
                <div className={ styles.favoriteCategoryItem }>
                    {location.pathname.includes(PATH.MY_DEPOSIT) ? '예금' : '적금'}
                </div>
            </div>


            {/* src/components/FavoritePanel/FavoritePanel.jsx */}
            {/* 즐겨찾기 삭제 & 검색바 */}
            <div className={ styles.favoriteDeleteSearchDiv }>
                
                <input 
                    type="checkbox" 
                    name="allCheck" 
                    className={ styles.allCheck }
                    checked={allChecked}
                    onChange={handleAllCheck}
                />

                <select defaultValue="bank_name">
                    {/* <optgroup label="검색 항목"> */}
                        <option value="bank_name">은행</option>
                        <option value="prd_name">상품</option>
                    {/* </optgroup> */}
                </select>

                <div
                    className={ styles.selectDiv }
                    ref={dropdownRef}
                >
                    <div 
                        onClick={ handleToggleDropdown }
                        className={`${styles.selectDefaultDiv} ${isDropdownOpen ? styles.active : ''}`}
                    >
                        <div className={ styles.selectOption }>
                            <span className={ styles.searchKey }>{searchKey}</span>
                        </div>
                        <div className= {styles.selectArrowDiv }>
                            <img
                                src={downArrowIcon}
                                alt="Arrow"
                                className={`${styles.selectDownArrow} ${isDropdownOpen ? styles.rotated : ''}`}
                            />                            
                        </div>
                    </div>
                    {isDropdownOpen && (
                        <div className={styles.selectDropdownDiv} ref={dropdownRef}>
                            <div
                                className={styles.selectDropdownItem}
                                onClick={() => handleSelectItemClick('은행')}
                                data-value="bank_name"
                            >
                                은행
                            </div>
                            <div
                                className={styles.selectDropdownItem}
                                onClick={() => handleSelectItemClick('상품')}
                                data-value="prd_name"
                            >
                                상품
                            </div>
                        </div>
                    )}  
                </div>


                <input 
                    type="text" 
                    name="favoriteSearchText" 
                    className={ styles.favoriteSearchText }
                    placeholder="검색어" 
                />

                <button className={ styles.favoriteSearchBtn }>검색</button>

                <button className={ styles.favoriteDeleteBtn }>삭제</button>
            </div>
            
        </div>
    );
};

export default FavoritePanel;