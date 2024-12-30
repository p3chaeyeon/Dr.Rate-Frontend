import styles from './MyWithdrawPage.module.scss';
import axiosInstanceAPI from 'src/apis/axiosInstanceAPI';
import { PATH } from 'src/utils/path';
import { useSession } from 'src/hooks/useSession';
import { useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import MyNav from 'src/components/MyNav';

import { useAtom } from 'jotai';
import useModal from 'src/hooks/useModal';
import { userData } from 'src/atoms/userData';
import ConfirmModal from 'src/components/Modal/ConfirmModal';

const MyWithdrawPage = () => {
    const navigate = useNavigate();
    const [myData, setMyData] = useAtom(userData); // Jotai Atom 사용

    const [isPasswordErrorVisible, setIsPasswordErrorVisible] = useState(false); // 상태 추가
    const [isCheckErrorVisible, setIsCheckErrorVisible] = useState(false); // 상태 추가

    const { clearSession } = useSession();

    // 확인 버튼 클릭 핸들러
    const handleConfirm = () => {
        // 페이지 이동, 서버 요청 등 필요한 로직 작성 ex) navigate(PATH.SIGN_IN);
        const deleteAccount = async () => {
            try {
                const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/deleteAccount`, formData);
                if(response.data.success) {
                        clearSession();
                        navigate(`${PATH.HOME}`);
                } else {
                    console.log("회원탈퇴 진행 중 오류 발생 : ", response);
                }
            } catch(error) {
                console.error("회원탈퇴 진행 중 오류 발생 : ", error);
            }
        }
        deleteAccount();
        closeConfirmModal(); // ConfirmModal 닫기
    };

    // 취소 버튼 클릭 핸들러
    const handleCancel = () => {
        // 취소 시 필요한 로직 작성
        closeConfirmModal(); // ConfirmModal 닫기
    };   
    

    const {
        isConfirmOpen,
        openConfirmModal,
        closeConfirmModal,
        confirmContent,
    } = useModal();

    //데이터 받아오기 (atom에 데이터가 없을 경우)
    useEffect(() => {
        if(myData) {
            if(myData.userId === null) {
                setFormData((prev) => ({
                    ...prev,
                    userId: myData.email,
                }));
            }else {
                setFormData((prev) => ({
                    ...prev,
                    userId: myData.userId,
                })); //엘스이프
            }
        } else if(!myData) {
            const userDTO = async () => {
            try { // atom에 데이터가 없을경우
                console.log("데이터 없음");
                const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/myInfo`);
                setMyData(response.data.result);  // 데이터 업데이트
                if(response.data.result.userId === null) {
                    setFormData((prev) => ({
                        ...prev,
                        userId: response.data.result.email,
                    }));
                } 
                setFormData((prev) => ({
                    ...prev,
                    userId: response.data.result.userId,
                }));
            } catch (error) {
                console.error('데이터 가져오기 실패:', error);
            }
        };
        userDTO();
        } else {
            console.log("데이터 가져오기 실패");
        }
    }, [myData, setMyData]);

    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        checkVal1: false,
        checkVal2: false,
        checkVal3: false,
        checkVal4: false,
        checkVal5: false,
        essentialCheck: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
          setFormData({ ...formData, [name]: checked });
        } else {
          setFormData({ ...formData, [name]: value });
        }
      };

    const handleDeleteAcccount = async () => {
        setIsPasswordErrorVisible(false);
        setIsCheckErrorVisible(false);
        if(formData.password === '') {
            setFormData((prev) => ({
                ...prev,
                password: null,
            }));
        }
        if(myData.password !== formData.password) {
            if(myData.password === null && formData.password === ''){
                return;
            }
            setIsPasswordErrorVisible(true);
            return;
        } else if(!formData.essentialCheck) {
            setIsCheckErrorVisible(true);
            return;
        }
        const confirmMessage = (
            <>
                <span>회원탈퇴 하시면 사용자의 모든 정보가 사라집니다.<br/>그래도 탈퇴 하시겠습니까?</span>
            </>
        );
        openConfirmModal("회원탈퇴 하시겠습니까?", confirmMessage, handleConfirm, handleCancel);
    }

    return (
        <main>
            <MyNav />

            <section className={ styles.MyWithdrawSection }>
                <div className={ styles.MyWithdraw }>
                    
                    <form className={ styles.MyWithdrawForm }>
                        <div className={`${styles.title}`}>
                            <h3>회원탈퇴</h3>
                            <p>회원 탈퇴를 원하시면 아래 정보를 입력한 후 탈퇴 버튼을 클릭하세요</p>
                        </div>
                        <div className={`${styles.tagBox}`}>
                            <p className={`${styles.tagName}`}>아이디</p>
                            <input type="text" className={`${styles.myData}`} 
                                    value={formData.userId || ''}
                                    placeholder="아이디입력" 
                                    onChange={handleChange}
                                    readOnly />
                        </div>
                        <div className={`${styles.tagBox}`}>
                            <p className={`${styles.tagName}`}>비밀번호 확인</p>
                            <input type="password" className={`${styles.myData}`}
                                    name="password" 
                                    value={formData.password || ''}
                                    placeholder="비밀번호 입력 ( 소셜로그인은 제외 )" 
                                    onChange={handleChange} />
                        </div>

                        <div className={`${styles.passwordError}`}
                            style={{
                                visibility: isPasswordErrorVisible ? 'visible' : 'hidden', // 상태에 따라 visibility 변경
                        }}>비밀번호가 일치하지 않습니다.</div>
                        
                        <div className={`${styles.checkBox}`}>
                            <p className={`${styles.titletext}`}>탈퇴 사유 (선택)</p>
                            <div className={`${styles.checkValue}`}>
                                <label>
                                    <input type="checkbox" 
                                        name="checkVal1"
                                        checked={formData.checkVal1} 
                                        onChange={handleChange}/>
                                    <h4>서비스 불만족 : </h4><p>&nbsp;"서비스 품질이 기대에 미치지 못했습니다."</p>
                                </label>
                            </div>
                            <div className={`${styles.checkValue}`}>
                                <label>
                                    <input type="checkbox" 
                                        name="checkVal2"
                                        checked={formData.checkVal2} 
                                        onChange={handleChange}/>
                                    <h4>사용 빈도 감소 : </h4><p>&nbsp;"이용 빈도가 적어졌습니다."</p>
                                </label>
                            </div>
                            <div className={`${styles.checkValue}`}>
                                <label>
                                    <input type="checkbox" 
                                        name="checkVal3"
                                        checked={formData.checkVal3} 
                                        onChange={handleChange}/>
                                    <h4>개인정보 우려 : </h4><p>&nbsp;"개인정보 보호에 대한 우려가 있습니다."</p>
                                </label>
                            </div>
                            <div className={`${styles.checkValue}`}>
                                <label>
                                    <input type="checkbox" 
                                        name="checkVal4"
                                        checked={formData.checkVal4} 
                                        onChange={handleChange}/>
                                    <h4>사용자 인터페이스 불편 : </h4><p>&nbsp;"웹사이트/앱의 인터페이스가 불편합니다."</p>
                                </label>
                            </div>
                            <div className={`${styles.checkValue}`}>
                                <label>
                                    <input type="checkbox" 
                                        name="checkVal5"
                                        checked={formData.checkVal5} 
                                        onChange={handleChange}/>
                                    <h4>기타 개인 사유 : </h4><p className={`${styles.separateText}`}>&nbsp;"개인적인 사유로 더 이상 이용하지 않기로 했습니다."</p>
                                </label>
                            </div>
                            <hr/>
                            <div className={`${styles.essentialCheck}`}>
                                <label>
                                    <input type="checkbox" 
                                        name="essentialCheck"
                                        checked={formData.essentialCheck} 
                                        onChange={handleChange}/>
                                    <h4>정보 삭제 동의 (필수) : </h4><p>&nbsp;"모든 정보를 삭제하는데 동의합니다."</p>
                                </label>
                                <button type="button" className={`${styles.withdrawButton}`} onClick={handleDeleteAcccount}>탈퇴하기</button>
                            </div>
                            <div className={`${styles.errorText}`}
                                style={{
                                    visibility: isCheckErrorVisible ? 'visible' : 'hidden', // 상태에 따라 visibility 변경
                            }}>비밀번호와 정보 삭제 등의 체크박스를 입력해주세요.</div>
                        </div>
                    </form>
                </div>
            </section>
            <ConfirmModal
                isOpen={isConfirmOpen}           
                closeModal={closeConfirmModal}   
                title={confirmContent.title}     
                message={confirmContent.message} 
                onConfirm={confirmContent.onConfirm} 
                onCancel={confirmContent.onCancel}   
            /> 
        </main>
    );
};

export default MyWithdrawPage;