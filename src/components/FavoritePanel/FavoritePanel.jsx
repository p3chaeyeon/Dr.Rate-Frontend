/* src/components/FavoritePanel/FavoritePanel.jsx */

import styles from './FavoritePanel.module.scss';
import React from 'react';
import { PATH } from "src/utils/path";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { allCheckedAtom, setAllCheckedAtom } from 'src/atoms/favoriteAtoms';
import useFavorite from 'src/hooks/useFavorite';
import rightArrowIcon from 'src/assets/icons/rightArrow.svg';

const FavoritePanel = ({ favoriteDataLength }) => {
    const location = useLocation();
    // const isPathActive = (paths) => paths.some((path) => location.pathname.includes(path));

    const [allChecked] = useAtom(allCheckedAtom);
    const [, setAllCheckedState] = useAtom(setAllCheckedAtom);

    const { handleIndividualCheck } = useFavorite(favoriteDataLength);

    const handleAllCheck = (e) => {
        setAllCheckedState(e.target.checked); // 전체 체크박스 상태 업데이트
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
                    <optgroup label="검색 항목">
                        <option value="bank_name">은행</option>
                        <option value="prd_name">상품</option>
                    </optgroup>
                </select>

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