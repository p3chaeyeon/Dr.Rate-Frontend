// src/utils/formatDate.js

/**
 * 날짜를 주어진 포맷 문자열에 맞게 변환(초안; 나중에 커스텀하기)
 * @param {Date|string|number} date - 포맷팅할 날짜 (Date 객체, 문자열, 타임스탬프 모두 가능)
 * @param {string} format - 포맷 문자열 (예: 'YYYY-MM-DD', 'MM/DD/YYYY')
 * @returns {string} 포맷팅된 날짜 문자열
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);

    // 유효한 날짜인지 확인
    if (isNaN(d.getTime())) {
        throw new Error('Invalid date provided');
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    // 포맷 문자열 대체
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}




/* formatDate 를 사용할 jsx 파일 코드 참고 */
// import { formatDate } from './utils/formatDate';

// // 현재 날짜를 'YYYY-MM-DD' 형식으로 포맷팅
// const today = formatDate(new Date());
// console.log(today); // 예: "2024-11-15"

// // 특정 날짜를 'MM/DD/YYYY' 형식으로 포맷팅
// const customDate = formatDate('2024-01-01', 'MM/DD/YYYY');
// console.log(customDate); // "01/01/2024"

// // 타임스탬프를 'YYYY-MM-DD HH:mm:ss' 형식으로 포맷팅
// const timestamp = formatDate(1700000000000, 'YYYY-MM-DD HH:mm:ss');
// console.log(timestamp); // "2024-11-14 07:33:20"
