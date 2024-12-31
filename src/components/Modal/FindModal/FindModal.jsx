import React, { useState, useEffect } from 'react';
import styles from './FindModal.module.scss';

import {
    sendIdByEmail,
    validateUserByEmailAndId,
    confirmEmailVerification,
    sendFindPwdCode,
    resetUserPassword,
    validatePassword,
} from "src/apis/signUpAPI.js";

const FindModal = ({ isOpen, closeModal, mode = 'id' }) => {
    const [user_email, setUserEmail] = useState('');
    const [user_id, setUserId] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState(''); // 비밀번호 유효성 검사 메시지
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState(''); // 비밀번호 확인 메시지
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [isMatched, setIsMatched] = useState(false); // 아이디와 이메일 매칭 여부

    useEffect(() => {
        if (isOpen) {
            setUserEmail('');
            setUserId('');
            setAuthCode('');
            setNewPassword('');
            setConfirmPassword('');
            setMessage('');
            setMessageType('');
            setIsVerified(false);
            setIsMatched(false);
            setPasswordMessage('');
            setConfirmPasswordMessage('');
        }
    }, [isOpen]);

    // 비밀번호 유효성 검사
    const handlePasswordBlur = () => {
        if (!validatePassword(newPassword)) {
            setPasswordMessage('비밀번호는 8~12자이며, 영문, 숫자, 특수문자를 포함해야 합니다.');
        } else {
            setPasswordMessage('');
        }
    };

    // 비밀번호 확인 검사
    const handleConfirmPasswordBlur = () => {
        if (newPassword !== confirmPassword) {
            setConfirmPasswordMessage('비밀번호가 일치하지 않습니다.');
        } else {
            setConfirmPasswordMessage('');
        }
    };

    // 아이디와 이메일 검증
    const handleValidateUser = async () => {
        if (!user_id || !user_email) {
            setMessage("아이디와 이메일을 입력해주세요.");
            setMessageType("error");
            setIsMatched(false);
            return;
        }
        try {
            const result = await validateUserByEmailAndId(user_id, user_email);
            if (result.success) {
                setMessage("아이디와 이메일이 일치합니다.");
                setMessageType("success");
                setIsMatched(true);
            } else {
                setMessage(result.message || "아이디와 이메일이 일치하지 않습니다.");
                setMessageType("error");
                setIsMatched(false);
            }
        } catch (error) {
            setMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
            setMessageType("error");
            setIsMatched(false);
        }
    };

    // 이메일을 이용한 아이디 찾기
    const handleFindId = async () => {
        if (!user_email) {
            setMessage('이메일을 입력해주세요.');
            setMessageType('error');
            return;
        }
        try {
            const result = await sendIdByEmail(user_email);
            setMessage(result.message);
            setMessageType(result.success ? 'success' : 'error');
        } catch (error) {
            setMessage('서버 오류가 발생했습니다. 다시 시도해주세요.');
            setMessageType('error');
        }
    };

    // 비밀번호 재설정을 위한 인증번호 전송
    const handleSendVerification = async () => {
        if (!isMatched) {
            setMessage('아이디와 이메일을 확인해주세요.');
            setMessageType('error');
            return;
        }
        try {
            const result = await sendFindPwdCode(user_email);
            setMessage(result.message);
            setMessageType(result.success ? 'success' : 'error');
        } catch (error) {
            setMessage('서버 오류가 발생했습니다. 다시 시도해주세요.');
            setMessageType('error');
        }
    };

    // 비밀번호 재설정을 위한 인증 코드 확인
    const handleVerifyCode = async () => {
        if (!authCode) {
            setMessage('인증 코드를 입력해주세요.');
            setMessageType('error');
            return;
        }
        try {
            const result = await confirmEmailVerification(user_email, authCode);
            setMessage(result.message);
            setMessageType(result.success ? 'success' : 'error');
            if (result.success) setIsVerified(true);
        } catch (error) {
            setMessage('서버 오류가 발생했습니다. 다시 시도해주세요.');
            setMessageType('error');
        }
    };

    // 비밀번호 재설정
    const handleResetPassword = async () => {
        if (!isVerified) {
            setMessage('이메일 인증을 완료해주세요.');
            setMessageType('error');
            return;
        }
        if (passwordMessage) {
            setMessage('비밀번호를 올바르게 입력해주세요.');
            setMessageType('error');
            return;
        }
        if (confirmPasswordMessage) {
            setMessage('비밀번호 확인이 일치하지 않습니다.');
            setMessageType('error');
            return;
        }
        try {
            const result = await resetUserPassword(user_id, newPassword);
            setMessage(result.message);
            setMessageType(result.success ? 'success' : 'error');
            if (result.success) closeModal();
        } catch (error) {
            setMessage('서버 오류가 발생했습니다. 다시 시도해주세요.');
            setMessageType('error');
        }
    };

    return (
        isOpen && (
            <div
                className={styles.findModal}
                onClick={(e) => {
                    if (e.target.classList.contains(styles.findModal)) closeModal();
                }}
            >
                <div className={styles.findModalContent}>
                    <h2>{mode === 'id' ? '아이디 찾기' : '비밀번호 찾기'}</h2>

                    {mode === 'id' && (
                        <div>
                            <input
                                type="email"
                                placeholder="이메일을 입력하세요"
                                value={user_email}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                            <button onClick={handleFindId}>아이디 찾기</button>
                        </div>
                    )}

                    {mode === 'pw' && (
                        <>
                            <input
                                type="text"
                                placeholder="아이디를 입력하세요"
                                value={user_id}
                                onChange={(e) => setUserId(e.target.value)}
                                onBlur={handleValidateUser}
                            />
                            <input
                                type="email"
                                placeholder="이메일을 입력하세요"
                                value={user_email}
                                onChange={(e) => setUserEmail(e.target.value)}
                                onBlur={handleValidateUser}
                            />
                            <button onClick={handleSendVerification}>인증 메일 전송</button>

                            {isVerified && (
                                <>
                                    <input
                                        type="password"
                                        placeholder="새로운 비밀번호"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        onBlur={handlePasswordBlur}
                                    />
                                    {passwordMessage && (
                                        <p className={`${styles.message} ${styles.error}`}>
                                            {passwordMessage}
                                        </p>
                                    )}
                                    <input
                                        type="password"
                                        placeholder="비밀번호 확인"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onBlur={handleConfirmPasswordBlur}
                                    />
                                    {confirmPasswordMessage && (
                                        <p className={`${styles.message} ${styles.error}`}>
                                            {confirmPasswordMessage}
                                        </p>
                                    )}
                                    <button onClick={handleResetPassword}>비밀번호 재설정</button>
                                </>
                            )}

                            {!isVerified && (
                                <>
                                    <input
                                        type="text"
                                        placeholder="인증 코드를 입력하세요"
                                        value={authCode}
                                        onChange={(e) => setAuthCode(e.target.value)}
                                    />
                                    <button onClick={handleVerifyCode}>인증 코드 확인</button>
                                </>
                            )}
                        </>
                    )}

                    {message && (
                        <p
                            className={`${styles.message} ${
                                messageType === 'success' ? styles.success : styles.error
                            }`}
                        >
                            {message}
                        </p>
                    )}
                </div>
            </div>
        )
    );
};

export default FindModal;
