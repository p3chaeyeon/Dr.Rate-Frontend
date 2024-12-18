import { PATH } from "src/utils/path";

export const trackVisitor = async (authToken = null) => {
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
    const storedToday = localStorage.getItem("visited_today");
    const guestId = getGuestId();

    // 오늘 날짜와 저장된 날짜가 다르면 업데이트 및 API 호출
    if (storedToday !== today) {
        console.log("새로운 날짜: 방문 기록 갱신 및 API 호출");

        try {
            const response = await fetch(`${PATH.SERVER}/api/trackVisit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken ? `Bearer ${authToken}` : "",
                },
                body: JSON.stringify({ guestId }),
            });

            if (response.ok) {
                console.log("방문 기록 성공");
                localStorage.setItem("visited_today", today); // 오늘 날짜 갱신
            } else {
                console.error("방문 기록 실패");
            }
        } catch (error) {
            console.error("API 호출 오류:", error);
        }
    } else {
        console.log("오늘 이미 방문 기록이 있음. API 호출 스킵");
    }
};

// guestId를 가져오거나 생성
const getGuestId = () => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random()}`;
        localStorage.setItem("guestId", guestId);
        console.log("새로운 guestId 생성:", guestId);
    }
    return guestId;
};
