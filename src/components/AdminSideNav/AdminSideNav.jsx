import React, { useState } from 'react';
import styles from './AdminSideNav.module.scss';
import { PATH } from 'src/utils/path';
import { useNavigate, useLocation } from 'react-router-dom';
import adminLogo from 'src/assets/images/adminLogo.png';
import dashboard from 'src/assets/images/adminDashboard.png';
import userManagement from 'src/assets/images/adminUserManagement.png';
import inquiryHistory from 'src/assets/images/adminInquiryHistory.png';
import inquiryEmailHistory from 'src/assets/images/adminEmailInquiryHistory.png';
import adminSideDeposit from 'src/assets/icons/adminSideDeposit.png';
import adminSideInstallment from 'src/assets/icons/adminSideInstallment.png';
import whiteRightArrow from 'src/assets/icons/whiteRightArrow.svg';
import ConfirmModal from 'src/components/Modal/ConfirmModal/ConfirmModal';

const AdminSideNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isPathActive = (paths) => paths.some((path) => location.pathname.includes(path));

    // ConfirmModal 상태
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmContent, setConfirmContent] = useState({
        title: '',
        message: '',
        onConfirm: () => { },
    });

    // ConfirmModal 열기 함수
    const openConfirmModal = (title, message, onConfirm) => {
        setConfirmContent({ title, message, onConfirm });
        setIsConfirmOpen(true);
    };

    // ConfirmModal 닫기 함수
    const closeConfirmModal = () => {
        setIsConfirmOpen(false);
    };

    // 예금 데이터 추가 
    const handleDepositAdd = async () => {
        await fetch(`${PATH.SERVER}/api/products/insertDep`, { method: 'GET' });
    };

    // 적금 데이터 추가 
    const handleInstallAdd = async () => {
        await fetch(`${PATH.SERVER}/api/products/insertIns`, { method: 'GET' });
    };

    return (
        <div className={styles.adminNav}>
            {/* 관리자 페이지 로고 */}
            <div className={styles.adminLogoDiv} onClick={() => navigate(PATH.ADMIN_MAIN)}>
                <img src={adminLogo} alt="admin logo" className={styles.adminLogo} />
            </div>

            {/* 관리자 메뉴 */}
            <div className={styles.adminMenuDiv}>
                <div className={styles.adminMenuList} onClick={() => navigate(PATH.ADMIN_MAIN)}>
                    <div className={styles.adminMenuItemImg}>
                        <img src={dashboard} alt="대시보드" className={styles.adminMenuImg} />
                    </div>
                    <div
                        className={styles.adminMenuItemText}
                        style={{
                            fontWeight: location.pathname.includes(PATH.ADMIN_MAIN) ? '700' : 'inherit',
                            fontSize: location.pathname.includes(PATH.ADMIN_MAIN) ? '18px' : 'inherit',
                        }}
                    >
                        대시보드
                    </div>
                </div>
                <div className={styles.adminMenuList} onClick={() => navigate(PATH.ADMIN_USER_LIST)}>
                    <div className={styles.adminMenuItemImg}>
                        <img src={userManagement} alt="사용자 조회" className={styles.adminMenuImg} />
                    </div>
                    <div
                        className={styles.adminMenuItemText}
                        style={{
                            fontWeight: location.pathname.includes(PATH.ADMIN_USER_LIST) ? '700' : 'inherit',
                            fontSize: location.pathname.includes(PATH.ADMIN_USER_LIST) ? '18px' : 'inherit',
                        }}
                    >
                        사용자 조회
                    </div>
                </div>
                <div className={styles.adminMenuList} onClick={() => navigate(PATH.ADMIN_INQUIRE_LIST)}>
                    <div className={styles.adminMenuItemImg}>
                        <img src={inquiryHistory} alt="1:1 문의 내역" className={styles.adminMenuImg} />
                    </div>
                    <div
                        className={styles.adminMenuItemText}
                        style={{
                            fontWeight: isPathActive([PATH.ADMIN_INQUIRE_LIST, PATH.ADMIN_INQUIRE]) ? '700' : 'inherit',
                            fontSize: isPathActive([PATH.ADMIN_INQUIRE_LIST, PATH.ADMIN_INQUIRE]) ? '18px' : 'inherit',
                        }}
                    >
                        1:1 문의 내역
                    </div>
                </div>
                <div className={styles.adminMenuList} onClick={() => navigate(PATH.ADMIN_EMAIL_INQUIRE_LIST)}>
                    <div className={styles.adminMenuItemImg}>
                        <img src={inquiryEmailHistory} alt="이메일 문의 내역" className={styles.adminMenuImg} />
                    </div>
                    <div
                        className={styles.adminMenuItemText}
                        style={{
                            fontWeight: isPathActive([PATH.ADMIN_EMAIL_INQUIRE_LIST, PATH.ADMIN_EMAIL_INQUIRE]) ? '700' : 'inherit',
                            fontSize: isPathActive([PATH.ADMIN_EMAIL_INQUIRE_LIST, PATH.ADMIN_EMAIL_INQUIRE]) ? '18px' : 'inherit',
                        }}
                    >
                        이메일 문의 내역
                    </div>
                </div>

                {/* 예금 추가 */}
                <div
                    className={styles.adminMenuList}
                    onClick={() =>
                        openConfirmModal('확인', '예금을 추가하시겠습니까?', async () => {
                            await handleDepositAdd();
                            closeConfirmModal();
                        })
                    }
                >
                    <div className={styles.adminMenuItemImg}>
                        <img src={adminSideDeposit} alt="예금 추가" className={styles.adminMenuImg} />
                    </div>
                    <div
                        className={styles.adminMenuItemText}
                        style={{
                            fontWeight: isPathActive([]) ? '700' : 'inherit',
                            fontSize: isPathActive([]) ? '18px' : 'inherit',
                        }}
                    >
                        예금 추가
                    </div>
                </div>

                {/* 적금 추가 */}
                <div
                    className={styles.adminMenuList}
                    onClick={() =>
                        openConfirmModal('확인', '적금을 추가하시겠습니까?', async () => {
                            await handleInstallAdd();
                            closeConfirmModal();
                        })
                    }
                >
                    <div className={styles.adminMenuItemImg}>
                        <img src={adminSideInstallment} alt="적금 추가" className={styles.adminMenuImg} />
                    </div>
                    <div
                        className={styles.adminMenuItemText}
                        style={{
                            fontWeight: isPathActive([]) ? '700' : 'inherit',
                            fontSize: isPathActive([]) ? '18px' : 'inherit',
                        }}
                    >
                        적금 추가
                    </div>
                </div>
                {/* </div> */}
            </div>{/* //<div className={ styles.adminMenuDiv }> */}

            {/* ConfirmModal */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                closeModal={closeConfirmModal}
                title={confirmContent.title}
                message={confirmContent.message}
                onConfirm={confirmContent.onConfirm} // 확인
                onCancel={closeConfirmModal} // 취소
            />

            {/* 사용자 페이지 이동 */}
            <div className={styles.userNavigateDiv} onClick={() => navigate(PATH.HOME)}>
                사용자 페이지 이동
                <img src={whiteRightArrow} alt="이동 오른쪽 >" className={styles.whiteRightArrowImg} />
            </div>
        </div>
    );
};

export default AdminSideNav;
