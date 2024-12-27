import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertModal from 'src/components/modal/AlertModal';
import styles from './SignInPage.module.scss';

import googleIcon from 'src/assets/socialIcons/Google-Icon.png';
import kakaoIcon from 'src/assets/socialIcons/Kakao-Icon.png';
import naverIcon from 'src/assets/socialIcons/Naver-Icon.png';
import { PATH } from 'src/utils/path';

const SignInPage = () => {
    const navigate = useNavigate();

    // 모달 상태 관리
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    // 일반 로그인 상태 관리
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    // 로그인 처리 함수
    const handleLogin = async () => {
        try {
            // --- [FormData 방식] ---
            const formData = new FormData();
            // 스프링 시큐리티 기본 필드명: "username", "password"
            formData.append('username', userId);
            formData.append('password', password);

            const response = await axios.post(`${PATH.SERVER}/api/signIn`, formData, {
                // FormData 전송 시 자동으로 multipart/form-data 로 전송됨
                // 만약 application/x-www-form-urlencoded 방식으로 보내고 싶다면
                // transformRequest 등을 활용해야 합니다.
                withCredentials: true,
            });

            // 헤더에서 토큰 가져오기
            const token = response.headers?.authorization?.replace('Bearer ', '');
            if (token) {
                localStorage.setItem('Authorization', token);
                navigate(`${PATH.HOME}`);
            } else {
                setModalTitle('로그인 실패');
                setModalMessage('아이디 또는 비밀번호가 잘못되었습니다.');
                setShowModal(true);
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            setModalTitle('로그인 실패');
            setModalMessage(
                error.response?.data?.message || '로그인 중 오류가 발생했습니다.'
            );
            setShowModal(true);
        }
    };

    // 회원가입 페이지 이동
    const handleSignUpClick = () => {
        navigate(`${PATH.SIGN_UP}`);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <main>
            <section className={styles.signinPage}>
                <div className={styles.title}>
                    <h4>로그인&nbsp;&nbsp;&nbsp;/</h4>
                    <h4 className={styles.signupText} onClick={handleSignUpClick}>
                        &nbsp;&nbsp;&nbsp;회원가입
                    </h4>
                </div>

                <div className={styles.loginForm}>
                    <form>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="userId"
                                // 실제 전송은 FormData로 "username" 필드에 담을 예정
                                placeholder="아이디"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            />
                            <label htmlFor="username">아이디</label>
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="password">비밀번호</label>
                        </div>
                    </form>
                </div>

                <button onClick={handleLogin}>로그인</button>

                <div className={styles.icons}>
                    <img
                        src={naverIcon}
                        alt="Naver Login"
                        onClick={() => (window.location.href = `${PATH.SERVER}/api/signIn/naver`)}
                    />
                    <img
                        src={kakaoIcon}
                        alt="Kakao Login"
                        onClick={() => (window.location.href = `${PATH.SERVER}/api/signIn/kakao`)}
                    />
                    <img
                        src={googleIcon}
                        alt="Google Login"
                        onClick={() => (window.location.href = `${PATH.SERVER}/api/signIn/google`)}
                    />
                </div>
                <div className={styles.findUser}>
                    <p>아이디 찾기</p>/<p>비밀번호 찾기</p>
                </div>
            </section>

            <AlertModal
                isOpen={showModal}
                closeModal={handleCloseModal}
                title={modalTitle}
                message={modalMessage}
            />
        </main>
    );
};

export default SignInPage;
