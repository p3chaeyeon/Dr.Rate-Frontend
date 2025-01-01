import styles from './MyEditPage.module.scss';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyNav from 'src/components/MyNav';
import axiosInstanceAPI from 'src/apis/axiosInstanceAPI';
import { useSession } from 'src/hooks/useSession';
import AlertModal from 'src/components/Modal/AlertModal'; // AlertModal import
import ConfirmModal from 'src/components/Modal/ConfirmModal';
import { PATH } from 'src/utils/path';
import useModal from 'src/hooks/useModal';

import { useAtom } from 'jotai';
import { userData } from 'src/atoms/userData';

// API 호출 함수들 import
import {
    validatePassword,
    validateEmail,
    sendEmailVerification,
    confirmEmailVerification,
} from 'src/apis/signUpAPI.js';

const MyEditPage = () => {
    const navigate = useNavigate();
    const [myData, setMyData] = useAtom(userData); // Jotai Atom 사용
    /* 상태 관리 */
    const { clearSession } = useSession();
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [email, setEmail] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [emailError, setEmailError] = useState(''); // 이메일 오류 메시지 상태 추가
    const [passwordError, setPasswordError] = useState('');
    const [confirmPwdError, setConfirmPwdError] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(true); // 이메일 인증 여부 상태 추가

    const {
        isAlertOpen,      // AlertModal이 열려 있는지 여부 (true/false 상태)
        openAlertModal,   // AlertModal을 열기 위한 함수
        closeAlertModal,  // AlertModal을 닫기 위한 함수
        alertContent,    // AlertModal의 제목(title)과 메시지(message)를 담고 있는 객체

        isConfirmOpen,
        openConfirmModal,
        closeConfirmModal,
        confirmContent,
    } = useModal();

    //데이터 받아오기
    useEffect(() => {
        if(myData) {
            setUsername(myData.username || '');
            setUserId(myData.userId || '');
            setEmail(myData.email || '');
        } else if (!myData) {
            const userDTO = async () => {
                try {
                    const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/myInfo`);
                    setMyData(response.data.result);
                    setUsername(response.data.result.username || '');
                    setUserId(response.data.result.userId || '');
                    setEmail(response.data.result.email || '');
                    console.log("데이터 가져오기 성공")
                } catch (error) {
                    console.log("데이터 가져오기 실패 : ", error);
                }
            };
            userDTO();
        } else {
            console.log("이펙트 실패");
        }
    }, [myData, navigate]);

    // 비밀번호 검증
    const handlePasswordBlur = () => {
        if (!validatePassword(password)) {
            setPasswordError("비밀번호는 8~12자 영문, 숫자, 특수문자를 포함해야 합니다.");
        } else {
            setPasswordError('');
        }
    };

    // 비밀번호 확인 검증
    const handleConfirmPwdBlur = () => {
        if (password !== confirmPwd) {
            setConfirmPwdError("비밀번호가 일치하지 않습니다.");
        } else {
            setConfirmPwdError('');
        }
    };

     // 이메일 변경 상태
    const [isEmailChanged, setIsEmailChanged] = useState(false);

    // 초기 이메일과 비교
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setIsEmailChanged(newEmail !== (myData?.email || ''));
        setIsEmailVerified(false);
    };

    // 이메일 인증 처리
    const handleEmailVerification = async () => {
        if (!validateEmail(email)) {
            setEmailError("올바른 이메일 형식이 아닙니다.");
            return;
        }
        setEmailError('');

        const result = await sendEmailVerification(email);
        openAlertModal(
            "메일 전송",
            result.message,
        );
    };

    // 이메일 인증 코드 확인
    const handleEmailConfirmation = async () => {
        const result = await confirmEmailVerification(email, authCode);
        openAlertModal(
            result.success ? "인증 성공" : "인증 실패",
            result.message,
        );
        if (result.success) setIsEmailVerified(true);
    };
    
    // 사용자 정보 수정 처리
    const handleMyInfoEdit = async () => {
        // 유효성 검사
        if (!username || !userId || !password || !confirmPwd || !email) {
            openAlertModal(
                "정보 수정 오류",
                "회원 정보를 입력해주세요.",
            );
            return;
        }
        if (!isEmailVerified) {
            openAlertModal(
                "이메일 인증 오류",
                "이메일 인증을 해주세요",
            );
            return;
        }
        if (passwordError || confirmPwdError || !password || !confirmPwd) {
            openAlertModal(
                "정보 수정 오류",
                "입력 정보를 확인해주세요.",
            );
            return;
        }
        const confirmMessage = (
            <>
                <span>정보를 수정하면 다시 로그인해야 됩니다.</span>
            </>
        );
        openConfirmModal("회원정보를 수정하시겠습니까?", confirmMessage, handleConfirm, handleCancel);
    };

    //초기화 버튼 클릭
    const handleReset = () => {
        if (myData) {
            setUsername(myData.username || '');
            setUserId(myData.userId || '');
            setPassword(myData.password || '');
            setConfirmPwd('');
            setEmail(myData.email || '');
            setAuthCode('');
            setPasswordError('');
            setConfirmPwdError('');
            setEmailError('');
        }
    }


     // 확인 버튼 클릭 핸들러
    const handleConfirm = () => {
        // 페이지 이동, 서버 요청 등 필요한 로직 작성 ex) navigate(PATH.SIGN_IN);
        const editConfirm = async () => {
            try {
                const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/myInfoEdit`, {
                    username,
                    userId,
                    password,
                    email,
                });
                if(response.data.success) {
                        clearSession();
                        navigate(`${PATH.HOME}`);
                } else {
                    openAlertModal(
                        "정보 수정 실패",
                        "회원정보 수정 중 문제가 발생했습니다.",
                    );
                }
            } catch(error) {
                console.error("회원탈퇴 진행 중 오류 발생 : ", error);
            }
        }
        editConfirm();
        closeConfirmModal(); // ConfirmModal 닫기
    };
    // 취소 시 필요한 로직 작성
    const handleCancel = () => {
        closeConfirmModal(); // ConfirmModal 닫기
    };   

    return (
        <main>
            <MyNav />

            <section className={ styles.myEditSection }>
                <div className={styles.myInfoEdit}>
                    <form>
                        <div className={`${styles.tagBox}`}>
                            <p className={`${styles.tagName}`}>이름</p>
                            <input type="text" className={`${styles.myData}`} 
                                    value={username}
                                    placeholder="이름입력" 
                                    onChange={(e) => setUsername(e.target.value)} />
                        </div>

                        <div className={`${styles.tagBox} ${styles.emailBox}`}>
                            <p className={`${styles.tagName}`}>이메일</p>
                            <input type="text" className={`${styles.myData}`} 
                            value={email}
                            placeholder="이메일입력"
                            onChange={handleEmailChange} />
                            {isEmailChanged && (
                            <button type="button"
                                onClick={handleEmailVerification}
                                className={styles.verifyButton}
                            >
                                인증 메일 전송
                            </button>
                            )}
                        </div>

                        {isEmailChanged && (
                        <div className={`${styles.tagBox}`}>
                            <p className={`${styles.tagName}`}>인증 코드</p>
                            <input type="text" className={`${styles.myData}`}
                                name="auth_code"
                                id="auth_code"
                                placeholder="인증 코드"
                                value={authCode}
                                onChange={(e) => setAuthCode(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleEmailConfirmation}
                                className={styles.verifyButton}
                            >
                                인증 코드 확인
                            </button>
                        </div>
                        )}

                        {emailError && <p className={styles.errorText}>{emailError}</p>}
                        <div className={`${styles.tagBox}`}>
                            <p className={`${styles.tagName}`}>아이디</p>
                            <input type="text" className={`${styles.myData}`} 
                                    value={userId} 
                                    readOnly />
                        </div>

                        <div className={`${styles.tagBox}`}>
                            <p className={`${styles.tagName}`}>비밀번호</p>
                            <input type="password" className={`${styles.myData}`} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    onBlur={handlePasswordBlur} />
                        </div>
                        {passwordError && <p className={styles.errorText}>{passwordError}</p>}

                        <div className={`${styles.tagBox}`}>
                            <p className={`${styles.tagName}`}>비밀번호 재입력</p>
                            <input type="password" className={`${styles.myData}`} 
                                    value={confirmPwd}
                                    onChange={(e) => setConfirmPwd(e.target.value)}
                                    onBlur={handleConfirmPwdBlur} />
                        </div>
                        {confirmPwdError && <p className={styles.errorText}>{confirmPwdError}</p>}

                        <div className={`${styles.buttonBox}`}>
                            <div className={`${styles.editandreset}`}>
                                <button type="button" onClick={handleMyInfoEdit}>수정하기</button>
                                <button type="button" onClick={handleReset} className={`${styles.resetButton}`}>초기화</button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            {/* 모달 표시 */}
            <AlertModal
                isOpen={isAlertOpen}
                closeModal={closeAlertModal}
                title={alertContent.title}
                message={alertContent.message}
            />
            <ConfirmModal
                isOpen={isConfirmOpen}           
                closeModal={closeConfirmModal}   
                title={confirmContent.title}     
                message={confirmContent.message} 
                onConfirm={confirmContent.onConfirm} 
                onCancel={confirmContent.onCancel}   
            /> 
        </main>
    );
};

export default MyEditPage;