import React, { useEffect } from 'react';

const SignInPage = () => {
    // 페이지 로드 시 URL에서 토큰을 추출하고 처리
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search); // URL의 쿼리 파라미터를 추출
        const accessToken = urlParams.get('accessToken'); // 'accessToken' 값 가져오기

        if (accessToken) {
            // 로컬 스토리지에 accessToken 저장
            localStorage.setItem('accessToken', accessToken);

            // URL에서 accessToken 파라미터 제거
            const currentUrl = window.location.href;
            const newUrl = currentUrl.split('?')[0]; // 쿼리 파라미터를 제외한 URL만 남기기
            window.history.replaceState({}, document.title, newUrl); // URL 업데이트
        }
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

    // 데이터를 가져오는 함수
    const getData = () => {
        // 로컬 스토리지에서 accessToken 가져오기
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            alert("No access token found.");
            return;
        }

        fetch("http://localhost:8080/login", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`, // 토큰을 헤더에 추가
            },
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            alert(data);
        })
        .catch((error) => alert(error));
    };

    return (
        <main>
            <section>
                <button onClick={onNaverLogin}>naver</button>
                <button onClick={onKakaoLogin}>kakao</button>
                <button onClick={onGoogleLogin}>google</button>
                <button onClick={getData}>GET DATA</button>
            </section>
        </main>
    );
};

export default SignInPage;
