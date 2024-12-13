import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // useNavigate 추가
import styles from './SignInPage.module.scss';

import googleIcon from 'src/assets/socialIcons/Google-Icon.png';
import kakaoIcon from 'src/assets/socialIcons/Kakao-Icon.png';
import naverIcon from 'src/assets/socialIcons/Naver-Icon.png';

const SignInPage = () => {
    const navigate = useNavigate();  // navigate 훅 사용

    // 로그인 후 JWT 처리 함수
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

    // 회원가입 페이지로 이동
    const handleSignUpClick = () => {
        navigate('/signUp');  // 회원가입 페이지로 이동
    };

    return (
        <main>
            <section className={styles.signinPage}>
                <div className={styles.title}>
                    <h4>로그인&nbsp;&nbsp;&nbsp;/</h4>
                    <h4 className={styles.signupText} onClick={handleSignUpClick}>&nbsp;&nbsp;&nbsp;회원가입</h4>
                </div>

                <div className={styles.loginForm}>
                    <form>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="user_id"
                                id="user_id"
                                placeholder="아이디"
                            />
                            <label htmlFor="user_id">아이디</label>
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="password"
                                name="user_pwd"
                                id="user_pwd"
                                placeholder="비밀번호"
                            />
                            <label htmlFor="user_pwd">비밀번호</label>
                        </div>
                    </form>
                </div>
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
                <button>로그인</button>
                <div className={styles.findUser}>
                    <p>아이디 찾기</p>/<p>비밀번호 찾기</p>
                </div>
            </section>
        </main>
    );
};

export default SignInPage;
