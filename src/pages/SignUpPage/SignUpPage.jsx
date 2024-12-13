import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // useNavigate 추가
import styles from './SignUpPage.module.scss';

import googleIcon from 'src/assets/socialIcons/Google-Icon.png';
import kakaoIcon from 'src/assets/socialIcons/Kakao-Icon.png';
import naverIcon from 'src/assets/socialIcons/Naver-Icon.png';

const SignUpPage = () => {
    const navigate = useNavigate();  // navigate 훅 사용

    // 상태 관리
    const [user_id, setUserId] = useState('');
    const [user_pwd, setUserPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [user_email, setUserEmail] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPwdError, setConfirmPwdError] = useState('');

    // 비밀번호 유효성 검사 함수
    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
        return regex.test(password);
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

    // 메일 인증 처리 함수
    const handleEmailVerification = async () => {
        try {
            await axios.post('http://localhost:8080/api/email/verify', { email: user_email });
            alert('인증 메일이 전송되었습니다.');
        } catch (error) {
            console.error("메일 인증 오류:", error);
            alert("메일 인증 중 오류가 발생했습니다.");
        }
    };

    // 회원가입 처리 함수
    const handleSignUp = async () => {
        if (passwordError || confirmPwdError || !user_pwd || !confirmPwd) {
            alert("입력 정보를 확인해주세요.");
            return;
        }
        try {
            // 서버로 회원가입 요청
            const response = await axios.post('http://localhost:8080/api/signup', {
                user_id,
                user_pwd,
                user_email,
            });

            if (response.data.success) {
                alert("회원가입이 완료되었습니다.");
                window.location.href = "http://localhost:5173/signIn"; // 로그인 페이지로 이동
            }
        } catch (error) {
            console.error("회원가입 오류:", error);
            alert("회원가입 중 오류가 발생했습니다.");
        }
    };

    // 소셜로그인 후 JWT 처리 함수
    const handleOAuthLogin = async (provider) => {
        try {
            // 소셜 로그인 URL 요청
            const response = await axios.get(`http://localhost:8080/oauth2/authorization/${provider}`, {
                withCredentials: true, // 쿠키를 함께 전송
            });

            // 백엔드로부터 JWT를 가져옴
            const { token } = response.data;
            if (token) {
                console.log("Received JWT:", token);
                localStorage.setItem("accessToken", token); // JWT를 localStorage에 저장
                window.location.href = "http://localhost:5173/"; // 메인 페이지로 이동
            }
        } catch (error) {
            console.error(`Failed to login with ${provider}:`, error);
            alert(`${provider} 로그인 중 오류가 발생했습니다.`);
        }
    };

    // 로그인 타이틀 클릭시 로그인 페이지로 이동
    const handleTitleClick = () => {
        navigate('/signIn');  // 로그인 페이지로 이동
    };

    return (
        <main>
            <section className={styles.signUpPage}>
                <div className={styles.title}>
                    <h4 >회원가입&nbsp;&nbsp;&nbsp;/</h4>
                    <h4 onClick={handleTitleClick} className={styles.signinText}>&nbsp;&nbsp;&nbsp;로그인</h4>
                </div>

                <div className={styles.signUpForm}>
                    <form>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="user_id"
                                id="user_id"
                                placeholder="아이디"
                                value={user_id}
                                onChange={(e) => setUserId(e.target.value)}
                            />
                            <label htmlFor="user_id">아이디</label>
                        </div>

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
                            {passwordError && <p className={styles.errorText}>{passwordError}</p>}
                        </div>

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
                            {confirmPwdError && <p className={styles.errorText}>{confirmPwdError}</p>}
                        </div>
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
        </main>
    );
};

export default SignUpPage;
