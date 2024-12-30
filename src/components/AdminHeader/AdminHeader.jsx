import { useNavigate } from 'react-router-dom';
import styles from './AdminHeader.module.scss';
import React, { useEffect, useState } from 'react';
import { PATH } from 'src/utils/path';
import { useSession } from 'src/hooks/useSession';
import ConfirmModal from 'src/components/Modal/ConfirmModal/ConfirmModal';

import axiosInstanceAPI from 'src/apis/axiosInstanceAPI';


const AdminHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmContent, setConfirmContent] = useState({
        title: '',
        message: '',
        onConfirm: () => { },
    });

    const navigate = useNavigate();
    const { isLoggedIn, clearSession } = useSession();

    const handleLogout = async () => {
        try {
            const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/logout`);
            if(response.data.success) {
                clearSession();
                sideNavigation(PATH.HOME);
                return { success: true, message: '로그아웃 완료'};
            } else {
                return { success: false, message: '로그아웃 진행 중 오류가 발생했습니다.'};
            }
        } catch {
            return { success: false, message: '로그아웃 진행 중 오류가 발생했습니다.'};
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const openConfirmModal = (title, message, onConfirm) => {
        setConfirmContent({ title, message, onConfirm });
        setIsConfirmOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmOpen(false);
    };

    // width를 1000px 이상으로 늘리면 isMenuOpen를 다시 false
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1000 && isMenuOpen) {
                setIsMenuOpen(false); // 화면 크기가 1000px 이상일 때 메뉴 닫기
            }
        }

        window.addEventListener('resize', handleResize); // 이벤트 리스너 등록

        return () => {
            window.removeEventListener('resize', handleResize); // 클린업
        };
    }, [isMenuOpen])

    // 예금 데이터 추가
    const handleDepositAdd = async () => {
        await fetch(`${PATH.SERVER}/api/products/insertDep`, { method: 'GET' });
    };

    // 적금 데이터 추가
    const handleInstallAdd = async () => {
        await fetch(`${PATH.SERVER}/api/products/insertIns`, { method: 'GET' });
    };

    return (
        <div className={styles.adminHeader}>
            <div className={styles.adminHeaderComponent}>
                <div className={styles.adminHeaderTitle}>관리자 페이지</div>

                <div className={styles.adminHeaderMenuBar}>
                    <button className={styles.adminButton} onClick={toggleMenu}>
                        <img src='/src/assets/icons/mobileMenuIcon.svg' alt="menu" />
                    </button>
                </div>

                <div className={styles.adminHeaderLogout} onClick={handleLogout} >로그아웃</div>
            </div>

            {/* 메뉴가 열렸을 때 SideNav 내용 렌더링 */}
            {isMenuOpen && (
                <>
                    <div
                        className={styles.overlay}
                        onClick={() => setIsMenuOpen(false)}
                    ></div>
                    <div className={`${styles.adminSideNav} ${isMenuOpen ? styles.open : ''}`}>
                        <div className={styles.sideNavContent}>
                            <div className={styles.userInfo}>
                                <span>ADMIN 님</span>
                            </div>
                            <ul className={styles.menuList}>
                                <li onClick={() => {
                                    navigate(PATH.ADMIN_MAIN);
                                    setIsMenuOpen(false);
                                }}>대시보드</li>
                                <li onClick={() => {
                                    navigate(PATH.ADMIN_USER_LIST);
                                    setIsMenuOpen(false);
                                }}>사용자 조회</li>
                                <li onClick={() => {
                                    navigate(PATH.ADMIN_INQUIRE_LIST);
                                    setIsMenuOpen(false);
                                }}>1:1 문의</li>
                                <li onClick={() => {
                                    navigate(PATH.ADMIN_EMAIL_INQUIRE_LIST);
                                    setIsMenuOpen(false);
                                }}>이메일 문의</li>
                                <li onClick={handleLogout}>로그아웃</li>
                                <li onClick={() => {
                                    navigate(PATH.ADMIN_INQUIRE_LIST);
                                    setIsMenuOpen(false);
                                }}>고객센터</li>
                                <li onClick={() =>
                                    openConfirmModal('확인', '정말 예금을 추가하시겠습니까?', async () => {
                                        await handleDepositAdd();
                                        closeConfirmModal();
                                    })
                                }>
                                    예금 추가
                                </li>
                                <li onClick={() =>
                                    openConfirmModal('확인', '정말 적금을 추가하시겠습니까?', async () => {
                                        await handleInstallAdd();
                                        closeConfirmModal();
                                    })
                                }>
                                    적금 추가
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
            <ConfirmModal
                isOpen={isConfirmOpen}
                closeModal={closeConfirmModal}
                title={confirmContent.title}
                message={confirmContent.message}
                onConfirm={confirmContent.onConfirm}
                onCancel={closeConfirmModal}
            />
        </div>
    );
};

export default AdminHeader;
