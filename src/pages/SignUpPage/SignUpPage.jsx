import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertModal from 'src/components/modal/AlertModal'; // AlertModal import
import styles from './SignUpPage.module.scss';

import googleIcon from 'src/assets/socialIcons/Google-Icon.png';
import kakaoIcon from 'src/assets/socialIcons/Kakao-Icon.png';
import naverIcon from 'src/assets/socialIcons/Naver-Icon.png';
import { PATH } from 'src/utils/path.js';

const SignUpPage = () => {
    const navigate = useNavigate();

    /* 상태 관리 */
    const [user_name, setUserName] = useState('');
    const [user_id, setUserId] = useState('');
    const [user_pwd, setUserPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [user_email, setUserEmail] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [idError, setIdError] = useState(''); // 아이디 중복 오류 메시지 상태 추가
    const [emailError, setEmailError] = useState(''); // 이메일 오류 메시지 상태 추가
    const [passwordError, setPasswordError] = useState('');
    const [confirmPwdError, setConfirmPwdError] = useState('');
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태 관리
    const [modalTitle, setModalTitle] = useState(''); // 모달 제목
    const [modalMessage, setModalMessage] = useState(''); // 모달 메시지
    const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 여부 상태 추가

    // 비밀번호 정규 표현식 (영문, 숫자, 특수문자를 포함한 8~12자)
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
        return regex.test(password);
    };

    // 아이디 정규 표현식
    const validateUserId = (id) => {
        const regex = /^[a-zA-Z0-9]{5,15}$/; // 알파벳과 숫자 조합, 5~15자
        return regex.test(id);
    };

    // 이메일 정규 표현식
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handlePasswordBlur = () => {
        if (!validatePassword(user_pwd)) {
            setPasswordError("비밀번호는 8~12자 영문, 숫자, 특수문자를 포함해야 합니다.");
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPwdBlur = () => {
        if (user_pwd !== confirmPwd) {
            setConfirmPwdError("비밀번호가 일치하지 않습니다.");
        } else {
            setConfirmPwdError('');
        }
    };

    // 아이디 중복 체크
    const handleIdBlur = async () => {
        if (!user_id) {
            setIdError('');
            return;
        }
        if (!validateUserId(user_id)) {
            setIdError("아이디는 5~15자의 영문과 숫자만 사용할 수 있습니다.");
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8080/api/existId?userId=${user_id}`);
            console.log(response);

            // 아이디가 사용 가능한 경우
            if (response.status === 200 && response.data.success) {
                setIdError('사용 가능한 아이디입니다.');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setIdError('이미 가입된 아이디입니다.');
                } else {
                    setIdError('아이디 중복 확인에 실패했습니다.');
                }
            } else {
                console.error("아이디 중복 확인 오류:", error);
                setIdError('아이디 중복 확인에 실패했습니다.');
            }
        }
    };

    // 이메일 정규 표현식 추가 및 메일 전송 처리 함수
    const handleEmailVerification = async () => {
        if (!validateEmail(user_email)) {
            setEmailError("올바른 이메일 형식이 아닙니다.");
            return;
        }
        setEmailError('');

        try {
            const response = await axios.post(`http://localhost:8080/api/email/verify?email=${user_email}`);
            const { success, code, message } = response.data;

            if (success) {
                setModalTitle("메일 전송");
                setModalMessage("인증 메일이 전송되었습니다.");
            } else {
                if (code === "USER401") {
                    setModalTitle("중복 이메일");
                    setModalMessage("이미 가입된 이메일입니다.");
                } else if (code === "USER500") {
                    setModalTitle("메일 전송 실패");
                    setModalMessage("메일 전송에 실패했습니다.");
                } else {
                    setModalTitle("오류 발생");
                    setModalMessage(message || "알 수 없는 오류가 발생했습니다.");
                }
            }
        } catch (error) {
            console.error("메일 인증 오류:", error);
            setModalTitle("서버 오류");
            setModalMessage("서버와의 통신 중 오류가 발생했습니다.");
        } finally {
            setShowModal(true);
        }
    };

    // 인증 코드 인증 처리 함수
    const handleEmailConfirmation = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/email/verifications?email=${user_email}&code=${authCode}`);
            if (response.data.success) {
                setIsEmailVerified(true);
                setModalTitle("인증 성공");
                setModalMessage("이메일 인증이 완료되었습니다.");
            } else {
                setModalTitle("인증 실패");
                setModalMessage("인증 코드가 올바르지 않습니다.");
            }
            setShowModal(true);
        } catch (error) {
            console.error("인증 확인 오류:", error);
            setModalTitle("인증 실패");
            setModalMessage("인증 확인 중 오류가 발생했습니다.");
            setShowModal(true);
        }
    };

    const handleSignUp = async () => {
        if (!user_name || !user_id || !user_pwd || !confirmPwd || !user_email) {
            setModalTitle("회원가입 오류");
            setModalMessage("회원 정보를 입력해주세요.");
            setShowModal(true);
            return;
        }

        if (!isEmailVerified) {
            setModalTitle("이메일 인증 오류");
            setModalMessage("이메일 인증을 해주세요");
            setShowModal(true);
            return;
        }

        if (passwordError || confirmPwdError || !user_pwd || !confirmPwd) {
            setModalTitle("회원가입 오류");
            setModalMessage("입력 정보를 확인해주세요.");
            setShowModal(true);
            return;
        }

        if (idError === '이미 가입된 아이디입니다.') {
            setModalTitle("아이디 중복 오류");
            setModalMessage("이미 사용 중인 아이디입니다.");
            setShowModal(true);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/signup', {
                username: user_name,
                userId: user_id,
                password: user_pwd,
                email: user_email,
            });

            if (response.data.success) {
                setModalTitle("회원가입 성공");
                setModalMessage("회원가입이 완료되었습니다.");
                setShowModal(true);

                setUserName('');
                setUserId('');
                setUserPwd('');
                setConfirmPwd('');
                setUserEmail('');
                setAuthCode('');
                setIsEmailVerified(false);

                setTimeout(() => {
                    navigate(PATH.SIGN_IN);
                }, 2000);
            }
        } catch (error) {
            console.error("회원가입 오류:", error);
            setModalTitle("회원가입 실패");
            setModalMessage("회원가입 중 오류가 발생했습니다.");
            setShowModal(true);
        }
    };

    // 소셜로그인 후 JWT 처리 함수
    const handleOAuthLogin = async (provider) => {
        window.location.href = `http://localhost:8080/login/${provider}`;
    };

    // 로그인 타이틀 클릭시 로그인 페이지로 이동
    const handleTitleClick = () => {
        navigate(`${PATH.SIGN_IN}`);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <main>
            <section className={styles.signUpPage}>
                <div className={styles.title}>
                    <h4 onClick={handleTitleClick} className={styles.signinText}>로그인&nbsp;&nbsp;&nbsp;/</h4>
                    <h4>&nbsp;&nbsp;&nbsp;회원가입</h4>
                </div>

                <div className={styles.signUpForm}>
                    <form>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="user_name"
                                id="user_name"
                                placeholder="이름"
                                value={user_name}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <label htmlFor="user_name">이름</label>
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="user_id"
                                id="user_id"
                                placeholder="아이디"
                                value={user_id}
                                onChange={(e) => setUserId(e.target.value)}
                                onBlur={handleIdBlur}
                            />
                            <label htmlFor="user_id">아이디</label>
                        </div>
                        {idError && (
                            <p
                                className={`${styles.errorText} ${idError === '사용 가능한 아이디입니다.' ? styles.success : styles.failure}`}
                            >
                                {idError}
                            </p>
                        )}

                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                name="user_email"
                                id="user_email"
                                placeholder="이메일"
                                value={user_email}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                            <label htmlFor="user_email">이메일</label>
                            <button
                                type="button"
                                onClick={handleEmailVerification}
                                className={styles.verifyButton}
                            >
                                인증 메일 전송
                            </button>
                        </div>
                        {emailError && <p className={styles.errorText}>{emailError}</p>}

                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="auth_code"
                                id="auth_code"
                                placeholder="인증 코드"
                                value={authCode}
                                onChange={(e) => setAuthCode(e.target.value)}
                            />
                            <label htmlFor="auth_code">인증 코드</label>
                            <button
                                type="button"
                                onClick={handleEmailConfirmation}
                                className={styles.verifyButton}
                            >
                                인증 코드 확인
                            </button>
                        </div>

                        <div className={styles.inputWrapper}>
                            <input
                                type="password"
                                name="user_pwd"
                                id="user_pwd"
                                placeholder="비밀번호"
                                value={user_pwd}
                                onChange={(e) => setUserPwd(e.target.value)}
                                onBlur={handlePasswordBlur}
                            />
                            <label htmlFor="user_pwd">비밀번호</label>
                        </div>
                        {passwordError && <p className={styles.errorText}>{passwordError}</p>}

                        <div className={styles.inputWrapper}>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="비밀번호 확인"
                                value={confirmPwd}
                                onChange={(e) => setConfirmPwd(e.target.value)}
                                onBlur={handleConfirmPwdBlur}
                            />
                            <label htmlFor="confirmPassword">비밀번호 확인</label>
                        </div>
                        {confirmPwdError && <p className={styles.errorText}>{confirmPwdError}</p>}
                    </form>
                </div>

                <button onClick={handleSignUp}>회원가입</button>

                <div className={styles.icons}>
                    <img
                        src={naverIcon}
                        alt="Naver Login"
                        onClick={() => handleOAuthLogin('naver')}
                    />
                    <img
                        src={kakaoIcon}
                        alt="Kakao Login"
                        onClick={() => handleOAuthLogin('kakao')}
                    />
                    <img
                        src={googleIcon}
                        alt="Google Login"
                        onClick={() => handleOAuthLogin('google')}
                    />
                </div>

                <div className={styles.findUser}>
                    <p>아이디 찾기</p>/<p>비밀번호 찾기</p>
                </div>
            </section>

            {/* 모달 표시 */}
            <AlertModal
                isOpen={showModal}
                closeModal={handleCloseModal}
                title={modalTitle}
                message={modalMessage}
            />
        </main>
    );
};

export default SignUpPage;
