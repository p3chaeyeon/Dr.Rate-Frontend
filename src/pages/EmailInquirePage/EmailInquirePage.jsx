import React, { useEffect, useState } from 'react';
import styles from './EmailInquirePage.module.scss';
import { PATH } from 'src/utils/path';
import { useNavigate } from 'react-router-dom';
import axiosInstanceAPI from 'src/apis/axiosInstanceAPI';
import useModal from 'src/hooks/useModal';
import ConfirmModal from 'src/components/Modal/ConfirmModal';
import AlertModal from 'src/components/Modal/AlertModal';

import { useAtom } from 'jotai';
import { userData } from 'src/atoms/userData';
import xIcon from 'src/assets/icons/xIcon.svg';

const EmailInquirePage = () => {
  const navigate = useNavigate();
  const [myData, setMyData] = useAtom(userData); // Jotai Atom 사용

  const {
    isAlertOpen,
    openAlertModal,
    closeAlertModal,
    alertContent,

    isConfirmOpen,
    openConfirmModal,
    closeConfirmModal,
    confirmContent,
  } = useModal();

  const [formData, setFormData] = useState({
    inquireCtg: "", // 문의 유형
    inquireUser: "", // 이름
    inquireEmail: "", // email
    inquireTitle: "", // 제목
    inquireContent: "", // 문의 내용
    fileUuid: null, // 첨부파일
    agreeToPrivacy: false,
  });

  const [errors, setErrors] = useState({
    inquireCtg: false,
    inquireTitle: false,
    inquireContent: false,
    agreeToPrivacy: false,
  });

  //데이터 
  useEffect(() => {
    const userDTO = async () => {
      try {
        if (myData) {
          setFormData((prev) => ({
            ...prev,
            inquireUser: myData.username,
            inquireEmail: myData.email,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    }
    userDTO();
  }, [myData, navigate]);

  // 첨부 파일 삭제
  const handleResetFile = () => {
    setFormData((prev) => ({ ...prev, fileUuid: null }));

    // 파일 입력 필드 초기화
    const fileInput = document.getElementById("file");
    if (fileInput) {
      fileInput.value = ""; // 
    }
  };

  // 초기화
  const handleResetForm = () => {
    setFormData({
      inquireCtg: "",
      inquireUser: myData.username || "",
      inquireEmail: myData.email || "",
      inquireTitle: "",
      inquireContent: "",
      fileUuid: null,
      agreeToPrivacy: false,
    });

    // 파일 입력 필드 초기화
    const fileInput = document.getElementById("file");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // 입력값
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, fileUuid: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 입력 유효성 검사
  const validateForm = () => {
    const newErrors = {
      inquireCtg: !formData.inquireCtg,
      inquireTitle: !formData.inquireTitle.trim(),
      inquireContent: !formData.inquireContent.trim(),
      agreeToPrivacy: !formData.agreeToPrivacy,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // 확인 버튼 클릭 핸들러
  const handleSubmitInquire = () => {
    const inquireDTO = async () => {

      if (!validateForm()) {
        openAlertModal("필수 입력 항목을 확인해 주세요.");
        return;
      }
      try {
        const formDataToSend = new FormData();
        // 보내는 폼 데이터에 추가
        formDataToSend.append("inquireCtg", formData.inquireCtg);
        formDataToSend.append("inquireUser", formData.inquireUser);
        formDataToSend.append("inquireEmail", formData.inquireEmail);
        formDataToSend.append("inquireTitle", formData.inquireTitle);
        formDataToSend.append("inquireContent", formData.inquireContent);
        // formDataToSend.append("agreeToPrivacy", formData.agreeToPrivacy);

        // 폼데이터에 파일추가
        if (formData.fileUuid) {
          formDataToSend.append("fileUuid", formData.fileUuid); // 파일 추가
        }
        const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/emailinquire/save`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data", // 중요!
            },
          }
        );
        if (response.data.success) {
          navigate(`${PATH.MY_EMAIL_INQUIRE}`);
        } else {
          console.log("이메일 전송 중 오류 발생 : ", response);
        }
      } catch (error) {
        console.error("이메일 전송 중 오류 발생 : ", error);
      }
    }
    inquireDTO();
    closeConfirmModal(); // ConfirmModal 닫기
  };
  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    closeConfirmModal(); // ConfirmModal 닫기
  };

  const handleSubmit = async () => {
    openConfirmModal("전송 하시겠습니까?", null, handleSubmitInquire, handleCancel);
  }

  return (
    <main className={styles.EmailInquireMain}>
      <section className={styles.commonSection}>
        <div className={styles.topContainer}>
          <h1 className={styles.title}>이메일 문의하기</h1>
          <p className={styles.subTitle}>
            빠른 문의 처리는 <a href="/userInquire" className={styles.link}>관리자 1:1 문의</a>를 이용해 주세요.
          </p>

          {/* 문의 유형 */}
          <div className={styles.divGroup}>
            <select
              id="inquiryType"
              name="inquireCtg"
              value={formData.inquireCtg}
              onChange={handleChange}
              className={styles.selectInput}
            >
              <option value="">문의 유형</option>
              <option value="serviceImprovement">서비스 개선 제안</option>
              <option value="systemError">시스템 오류 제보</option>
            </select>
            {errors.inquireCtg && <p className={styles.errorMsg}>문의 유형을 선택해 주세요.</p>}
            <small className={styles.hintInquiryType}>
              <br></br>
              • 앱 개선 제안은 '서비스 개선 제안'으로 선택해 주세요
              <br></br>
              • 앱 장애 신고는 '시스템 오류 제보'로 선택해 주세요
            </small>
          </div>

          {/* 이름 */}
          <div className={styles.divGroup}>
            <input
              type="text"
              id="name"
              name="inquireUser"
              value={formData.inquireUser || ""}
              onChange={handleChange}
              className={styles.textInput}
              placeholder="이름"
              readOnly
            />
          </div>

          {/* Email */}
          <div className={styles.divGroup}>
            <input
              type="email"
              id="email"
              name="inquireEmail"
              value={formData.inquireEmail}
              onChange={handleChange}
              className={styles.textInput}
              placeholder="이메일"
              readOnly
            />
          </div>

          {/* 제목 */}
          <div className={styles.divGroup}>
            <input
              type="text"
              id="subject"
              name="inquireTitle"
              value={formData.inquireTitle}
              onChange={handleChange}
              className={styles.textInput}
              placeholder="제목"
            />
            {errors.inquireTitle && <p className={styles.errorMsg}>제목을 입력해 주세요.</p>}
          </div>

          {/* 문의 내용 */}
          <div className={styles.divGroup}>
            <textarea
              id="message"
              name="inquireContent"
              value={formData.inquireContent}
              onChange={handleChange}
              className={styles.textArea}
              placeholder="문의 내용"
              maxLength="500"
            />
            <br></br>
            {errors.inquireContent && <p className={styles.errorMsg}>문의 내용을 입력해 주세요.</p>}
            <small className={styles.hint}>
              {formData.inquireContent.length}자 / 최대 500자
            </small>
          </div>

          {/* 첨부파일 */}
          <div className={styles.divGroup}>
            <div className={styles.fileUploadWrapper}>
              <input
                type="text"
                readOnly
                value={formData.fileUuid ? formData.fileUuid.name : ""}
                placeholder=""
                className={styles.fileInputText}
              />
              {/* x 아이콘 */}
              {formData.fileUuid && (
                <img
                  src={xIcon}
                  alt="첨부 파일"
                  className={styles.fileIcon}
                  onClick={handleResetFile}
                />
              )}
              <label htmlFor="file" className={styles.fileButton}>
                첨부 파일
              </label>
              <input
                type="file"
                id="file"
                name="fileUuid"
                onChange={handleChange}
                className={styles.fileInput}
              />
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleResetForm}
              >
                초기화
              </button>
            </div>
          </div>

          {/* 이용 동의 */}
          <div className={styles.privacyContainer}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="agreeToPrivacy"
                checked={formData.agreeToPrivacy}
                onChange={handleChange}
                className={styles.checkbox}
              />
              개인정보 수집 및 이용동의 <span className={styles.required}>*</span>
            </label>
            <div className={styles.privacyDetails}>
              <p>1. 수집하는 개인정보 항목: 이름, 이메일</p>
              <p>2. 수집 목적: 문의자 확인, 문의에 대한 회신 등의 처리</p>
              <p>3. 보유 기간: 목적 달성 후 파기, 단, 관계법령에 따라 또는 회사 정책에 따른 정보보유사유가 발생하여 보존할 필요가 있는 경우에는 필요한 기간 동안 해당 정보를 보관합니다.
                전자상거래 등에서의 소비자 보호에 관한 법률, 전자금융거래법, 통신비밀보호법 등 법령에서 일정 기간 정보의 보관을 규정하는 경우, 이 기간 동안 법령의 규정에 따라 개인 정보를 보관하며, 다른 목적으로는 절대 이용하지 않습니다. (개인정보처리방침 참고)</p>
              <p>
                4. 귀하는 회사의 정보수집에 대해 동의하지 않거나 거부할 수 있습니다.
                다만, 이때 원활한 문의 및 서비스 이용 등이 제한될 수 있습니다.
              </p>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="button"
            className={`${styles.submitButton} ${!formData.agreeToPrivacy ? styles.disabled : ""
              }`}
            disabled={!formData.agreeToPrivacy}
            onClick={handleSubmitInquire}
          >
            제출하기
          </button>
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
      <AlertModal
        isOpen={isAlertOpen}
        closeModal={closeAlertModal}
        title={alertContent.title}
        message={alertContent.message}
      />
    </main>
  );
};

export default EmailInquirePage;