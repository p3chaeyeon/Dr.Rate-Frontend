// src/apis/axiosInstanceAPI.js

import axios from 'axios';
import { PATH } from 'src/utils/path'; // 경로 import

// axios 인스턴스 생성
const api = axios.create({
  baseURL: `${PATH.SERVER}`, // 서버의 기본 URL
  timeout: 10000,  // 타임아웃 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터
api.interceptors.request.use(
  (config) => {
    // 토큰을 가져옴
    let token = localStorage.getItem('Authorization'); // 토큰 가져오기

    // 토큰이 존재하고, "Bearer " 접두사가 없는 경우만 추가
    if (token && !token.startsWith('Bearer ')) {
      token = `Bearer ${token}`;
    }

    // 헤더에 토큰 추가
    if (token) {
      config.headers['Authorization'] = token;
    }

    return config; // 요청 계속 진행
  },
  (error) => Promise.reject(error) // 요청 에러 처리
);

// Response 인터셉터
api.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로 반환
  async (error) => {
    const originalRequest = error.config; // 원래 요청 정보

    // 403 에러 처리
    if (error.response?.status === 403) {
      console.log("403 에러 발생, 원래 요청:", originalRequest);

      // 재시도 방지 플래그 확인
      if (originalRequest._retry) {
        console.warn("이미 재시도한 요청입니다.");
        return Promise.reject(error);
      }

      // 재시도 플래그 설정
      originalRequest._retry = true;

      try {
        // 현재 토큰 가져오기
        const currentAccessToken = localStorage.getItem('Authorization');
        // 토큰 갱신 요청
        const response = await api.post('/api/reissue', { access_token: `Bearer ${currentAccessToken}` });
        console.log("리이슈 요청");
        // 새로운 토큰 확인
        const newAccessToken = response.data.result;
        console.log("새로운 토큰 = " + newAccessToken);
        // 새로운 토큰 저장
        localStorage.setItem('Authorization', `${newAccessToken}`);
        // 원래 요청에 새로운 토큰 설정
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // 원래 요청 재전송
        return api(originalRequest);
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);

        // 갱신 실패 시 로그인 페이지로 이동
        window.location.href = PATH.SIGN_IN;
        return Promise.reject(refreshError);
      }
    }

    console.error("응답 에러:", error); // 다른 에러 로그 출력
    return Promise.reject(error);
  }
);

/**
 * 문의 내역 전체 목록 가져오기
 * @returns {Promise<Array>} 문의 내역 목록
 */
export const fetchInquiryList = async () => {
  try {
    const response = await api.get('/api/inquiries'); // 서버에 요청
    return response.data; // 데이터 반환
  } catch (error) {
    console.error('문의 내역 가져오기 실패:', error);
    throw error;
  }
};

/**
 * 특정 문의 상세 내역 가져오기
 * @param {string} inquiryId - 문의 ID
 * @returns {Promise<Object>} 문의 상세 데이터
 */
export const fetchInquiryDetail = async (inquiryId) => {
  try {
    const response = await api.get(`/api/inquiries/${inquiryId}`); // 문의 ID로 요청
    return response.data; // 데이터 반환
  } catch (error) {
    console.error(`문의 상세 내역 가져오기 실패 (ID: ${inquiryId}):`, error);
    throw error;
  }
};


export default api;