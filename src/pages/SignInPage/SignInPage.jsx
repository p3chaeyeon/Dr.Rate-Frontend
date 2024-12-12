import React, { useEffect } from 'react';
import styles from './SignInPage.module.scss';

import googleIcon from 'src/assets/socialIcons/Google-Icon.png'; //icon
import kakaoIcon from 'src/assets/socialIcons/Kakao-Icon.png'; //icon
import naverIcon from 'src/assets/socialIcons/Naver-Icon.png'; //icon

const SignInPage = () => {
    // 로그인 성공 후 accessToken을 로컬 스토리지 대신 쿠키를 사용
    // useEffect(() => {
    //     console.log('SignInPage mounted');
    // }, []);

    // 네이버 로그인
    const onNaverLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/naver";
    };

    // 카카오 로그인
    const onKakaoLogin = () => {
        window.location.href = "http://localhost:8080/login/kakao";
    };

    // 구글 로그인
    const onGoogleLogin = () => {
        window.location.href = "http://localhost:8080/login/google";
    };

    // 서버로부터 데이터를 가져오는 함수
    const getData = () => {
        fetch("http://localhost:8080/login", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
            },
            credentials: "include",  // 쿠키를 함께 전송
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("Failed to fetch data");
            }
        })
        .then((data) => {
            console.log('Response Data:', data);  // 서버 응답 데이터
        }) 
        .catch((error) => {
            console.error('Error:', error);
            alert("Error occurred while fetching data.");
        });
    };

    return (
        <main>
            <section className={styles.signinPage}>
                <div className={styles.title}>
                    <h4>로그인&nbsp;&nbsp;&nbsp;/</h4><h4 className={styles.signupText}>&nbsp;&nbsp;&nbsp;회원가입</h4>
                </div>
                <hr/>
                <div className={styles.loginForm}>
                    <form>
                        <input type="text" name="username" id="username" placeholder="아이디" />
                        <input type="password" name="password" id="password" placeholder="비밀번호" />
                    </form>
                </div>
                <div className={styles.icons}>
                    <img src={naverIcon} onClick={onNaverLogin}/>
                    <img src={kakaoIcon} onClick={onKakaoLogin}/>
                    <img src={googleIcon} onClick={onGoogleLogin}/>
                </div>
                <button>로그인</button>
                <div className={styles.findUser}>
                    <p>아이디 찾기</p>
                    <p>비밀번호 찾기</p>
                    <p>회원가입</p>
                </div>
            </section>
        </main>
    );
};

export default SignInPage;
