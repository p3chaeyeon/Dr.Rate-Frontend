/* src/utils/shortNameToFullName.js; 짧은 이름과 풀네임 매핑(농협은행, 카카오뱅크, 토스뱅크) */

export const shortToFullMap = {
    '토스뱅크': '토스뱅크 주식회사',
    '카카오뱅크': '주식회사 카카오뱅크',
    '농협은행': '농협은행주식회사',
  };
  
  // 셀렉트박스용 짧은 이름 >> 실제로 상태에 저장할 풀네임 매핑
  export function shortToFull(shortName) {
    return shortToFullMap[shortName] || shortName;
  }
  
  // banks 배열에 들어있는 풀네임 >> 셀렉트박스용 짧은 이름
  export function fullToShort(fullName) {
    for (const key in shortToFullMap) {
      if (shortToFullMap[key] === fullName) {
        return key;
      }
    }
    return fullName;
  }
  