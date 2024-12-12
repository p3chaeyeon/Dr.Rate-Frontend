import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // 페이지 이동을 위한 useHistory
import styles from './SignUpPage.module.scss';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: ''
    });

    const history = useHistory();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { username, password, confirmPassword, name, email } = formData;

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', {
                username,
                password,
                name,
                email
            });

            if (response.data.success) {
                alert("회원가입이 완료되었습니다!");
                history.push('/sign-in'); // 로그인 페이지로 이동
            }
        } catch (error) {
            console.error("회원가입 중 오류가 발생했습니다:", error);
            alert("회원가입 실패");
        }
    };

    return (
        <main>
            <section className={styles.signUpPage}>
                <div className={styles.title}>
                    <h4>회원가입</h4>
                </div>
                <hr />
                <div className={styles.signUpForm}>
                    <form onSubmit={handleSignUp}>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="username"
                                placeholder="아이디"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="password"
                                name="password"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="비밀번호 확인"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="name"
                                placeholder="이름"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                name="email"
                                placeholder="이메일"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit">회원가입</button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default SignUpPage;
