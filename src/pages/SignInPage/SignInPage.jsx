import React, { useState } from 'react';
import axios from 'axios';
import styles from './SignInPage.module.scss';

import googleIcon from 'src/assets/socialIcons/Google-Icon.png';
import kakaoIcon from 'src/assets/socialIcons/Kakao-Icon.png';
import naverIcon from 'src/assets/socialIcons/Naver-Icon.png';

const SignInPage = () => {
    const [isSignup, setIsSignup] = useState(false); // 로그인/회원가입 전환 상태

    const handleOAuthLogin = async (provider) => {
        try {
            const response = await axios.get(`http://localhost:8080/oauth2/authorization/${provider}`, {
                withCredentials: true,
            });

            const { token } = response.data;
            if (token) {
                localStorage.setItem("accessToken", token);
                window.location.href = "http://localhost:5173/";
            }
        } catch (error) {
            console.error(`Failed to login with ${provider}:`, error);
            alert(`${provider} 로그인 중 오류가 발생했습니다.`);
        }
    };

    return (
        <main>
            <section className={styles.signinPage}>
                <div className={styles.title}>
                    <h4
                        className={`${styles.titleText} ${!isSignup && styles.active}`}
                        onClick={() => setIsSignup(false)}
                    >
                        로그인
                    </h4>
                    <span className={styles.separator}>/</span>
                    <h4
                        className={`${styles.titleText} ${isSignup && styles.active}`}
                        onClick={() => setIsSignup(true)}
                    >
                        회원가입
                    </h4>
                </div>
                <hr/>
                <div className={styles.loginForm}>
                    <form>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="아이디"
                            />
                        </div>
                        {isSignup && (
                            <div className={styles.inputWrapper}>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="이메일"
                                />
                            </div>
                        )}
                        <div className={styles.inputWrapper}>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="비밀번호"
                            />
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
                <button>{isSignup ? '회원가입' : '로그인'}</button>
                {!isSignup && (
                    <div className={styles.findUser}>
                        <p>아이디 찾기</p>/<p>비밀번호 찾기</p>
                    </div>
                )}
            </section>
        </main>
    );
};

export default SignInPage;
