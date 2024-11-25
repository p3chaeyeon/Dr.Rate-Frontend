import { atom } from "jotai";

//열림상태 true, 닫힘 false
export const isAlertOpenAtom = atom(false);

//알림 모달의 제목과 메시지를 관리하는 atom
export const alertContentAtom = atom({
  title: "",
  message: "",
});
