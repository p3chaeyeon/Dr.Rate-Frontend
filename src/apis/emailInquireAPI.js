import api from './axiosInstanceAPI';

/**
 * 문의 내역 전체 목록 가져오기
 * @returns {Promise<Array>} 문의 내역 목록
 */
export const fetchInquiryList = async () => {
  try {
    const response = await api.get('/api/inquiries');
    return response.data;
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
    const response = await api.get(`/api/inquiries/${inquiryId}`);
    return response.data;
  } catch (error) {
    console.error(`문의 상세 내역 가져오기 실패 (ID: ${inquiryId}):`, error);
    throw error;
  }
};
