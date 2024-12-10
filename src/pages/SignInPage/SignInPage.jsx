import React, { useEffect } from 'react';

const SignInPage = () => {
    // 로그인 성공 후 accessToken을 로컬 스토리지 대신 쿠키를 사용
    useEffect(() => {
        console.log('SignInPage mounted');
    }, []);

    // 네이버 로그인
    const onNaverLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/naver";
    };

    // 카카오 로그인
    const onKakaoLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
    };

    // 구글 로그인
    const onGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    // 서버로부터 데이터를 가져오는 함수
    const getData = () => {
        // CSRF 토큰 가져오기 (쿠키에서)
        const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('XSRF-TOKEN=')).split('=')[1];

        fetch("http://localhost:8080/login", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "X-CSRF-TOKEN": csrfToken  // CSRF 토큰 헤더에 포함
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
            <section>
                <h1>OAuth2 로그인</h1>
                <button onClick={onNaverLogin}>Naver Login</button>
                <button onClick={onKakaoLogin}>Kakao Login</button>
                <button onClick={onGoogleLogin}>Google Login</button>
                <button onClick={getData}>GET DATA</button>
            </section>
        </main>
    );
};

export default SignInPage;
