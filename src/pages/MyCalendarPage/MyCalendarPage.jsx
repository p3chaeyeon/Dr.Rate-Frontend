//Jotai 및 관련 라이브러리 import
import React, { useRef } from 'react';
import { atom, useAtom } from 'jotai';
import FullCalendar from '@fullcalendar/react'; // React용 FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // 월간 보기
import interactionPlugin from '@fullcalendar/interaction'; // 날짜 클릭
import Modal from 'react-modal'; // 모달
import kookminLogo from '/src/assets/bank/kookminLogo.png';
import shinhanLogo from '/src/assets/bank/shinhanLogo.png';
import hanaLogo from '/src/assets/bank/hanaLogo.png';
import wooriLogo from '/src/assets/bank/wooriLogo.png';
import kakaoLogo from '/src/assets/bank/kakaoLogo.png';
import nonghyupLogo from '/src/assets/bank/nonghyupLogo.png';
import tossLogo from '/src/assets/bank/tossLogo.png';

import styles from './MyCalendarPage.module.scss';

// Jotai 상태 관리
const eventsAtom = atom([]); // 이벤트 목록 저장
const modalIsOpenAtom = atom(false); // 모달 열림 상태
const selectedDateAtom = atom(''); // 선택된 날짜 저장
const savingNameAtom = atom(''); // 상품 이름 저장
const amountAtom = atom(''); // 금액 저장
const logoUrlAtom = atom(''); // 로고 URL 저장
const endDateAtom = atom(''); // 만기일 저장

// 모달 초기 설정
Modal.setAppElement('#root');

const MyCalendarPage = () => {
  const [events, setEvents] = useAtom(eventsAtom);
  const [modalIsOpen, setModalIsOpen] = useAtom(modalIsOpenAtom);
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [savingName, setSavingName] = useAtom(savingNameAtom);
  const [amount, setAmount] = useAtom(amountAtom);
  const [logoUrl, setLogoUrl] = useAtom(logoUrlAtom);
  const [endDate, setEndDate] = useAtom(endDateAtom);

  const calendarRef = useRef(null); // 캘린더 참조

  // 은행 로고 URL 매핑
  const bankLogos = {
    국민은행: kookminLogo,
    신한은행: shinhanLogo,
    하나은행: hanaLogo,
    우리은행: wooriLogo,
    카카오뱅크: kakaoLogo,
    농협은행: nonghyupLogo,
    토스뱅크: tossLogo,
  };

  // 날짜 클릭 시 모달 열기
  const handleDateClick = (info) => {
    const selectedDateEventsCount = events.filter(
      (event) => event.date === info.dateStr
    ).length;
  
    // 이미 3개의 이벤트가 있는 경우 모달을 열지 않고 alert 표시
    if (selectedDateEventsCount >= 3) {
      alert('한 날짜에 최대 3개의 목록만 추가할 수 있습니다!');
      return; // 함수 종료
    }  
    setSelectedDate(info.dateStr);
    setModalIsOpen(true);
  };

  // 오늘 날짜로 이동
  const goToToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
  };

  // 이벤트 저장
  const saveEvent = () => {
    if (savingName && amount && selectedDate && endDate && logoUrl) {
      const startDate = new Date(selectedDate);
      const finalDate = new Date(endDate);

      const newEvents = [];
      while (startDate <= finalDate) {
        newEvents.push({
          title: `${savingName} - ${amount}원`,
          date: startDate.toISOString().split('T')[0],
          extendedProps: {
            logoUrl: bankLogos[logoUrl], // 로고 URL 추가
            amount,
          },
        });

        const currentDay = startDate.getDate();
        startDate.setMonth(startDate.getMonth() + 1);
        if (startDate.getDate() !== currentDay) {
          startDate.setDate(0); // 말일로 설정
        }
      }
      setEvents((prevEvents) => {
        const updatedEvents = [...prevEvents, ...newEvents];
        return updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date)); // 날짜 순서로 정렬
      });
      setModalIsOpen(false);
      setSavingName('');
      setAmount('');
      setLogoUrl('');
      setSelectedDate('');
      setEndDate('');
    } else {
      alert('모든 정보를 입력해주세요!');
    }
  };

  return (
    <div className={styles.calendar}>
      <div
        className={`${styles.calendar} ${modalIsOpen ? styles.calendarBlur : ''}`} // 흐림효과 추가
      >
        <FullCalendar
          ref={calendarRef}
          locale="ko" // 한글
          plugins={[dayGridPlugin, interactionPlugin]} // 월간보기, 날짜클릭
          initialView="dayGridMonth"
          eventOrder="" // 이벤트 순서
          headerToolbar={{
            left: 'title',
            center: '',
            right: 'prev,today,next',
          }}
          buttonText={{
            today: '오늘',
            prev: '<', // 이전 버튼을 '<'로 표시
            next: '>', // 다음 버튼을 '>'로 표시
          }}
          titleFormat={{ year: 'numeric', month: 'long' }}
          events={events}
          contentHeight={1300} // 달력 주 고정된 높이
          dateClick={handleDateClick}
          dayCellClassNames={({ date }) => {
            const today = new Date();
            const isToday =
              date.getFullYear() === today.getFullYear() && // 일치여부
              date.getMonth() === today.getMonth() &&
              date.getDate() === today.getDate();
            if (isToday) return styles.today; // 오늘 날짜
            const day = date.getUTCDay();
            if (day === 6) return styles.sunday; // 일요일
            if (day === 5) return styles.saturday; // 토요일
          }}
          dayCellDidMount={(info) => {
            info.el.classList.add(styles.mycellstyle);
            if (info.isToday) {
              info.el.classList.add(styles.today); // 오늘 날짜
            }
          }}
          eventDidMount={(info) => {
            info.el.classList.add(styles.eventStyle); // 이벤트 스타일
          }}
          dayCellContent={({ date }) => {
            return <span>{date.getDate()}</span>; // 일 표시
          }}
          datesSet={() => {
            const frames = document.querySelectorAll('.fc-daygrid-day-frame');
            frames.forEach((frame) => {
              frame.classList.add(styles.expandedPadding); // 각 셀 크기
            });

            const titleElement = document.querySelector('.fc-toolbar-title');
            if (titleElement) {
              titleElement.classList.add(styles.title); // 날짜 css
            }

            const tableElement = document.querySelector('.fc-scrollgrid');
            if (tableElement) {
              tableElement.classList.add(styles.noBorderTop); // 윗선 제거
            }

            const prevButton = document.querySelector('.fc-prev-button');
            if (prevButton) {
              prevButton.classList.add(styles.transparentButton); // 이전버튼
            }

            const nextButton = document.querySelector('.fc-next-button');
            if (nextButton) {
              nextButton.classList.add(styles.transparentButton); // 다음버튼
            }

            const todayButton = document.querySelector('.fc-today-button');
            if (todayButton) {
              todayButton.classList.add(styles.transparentButton); // 오늘버튼
            }
          }}
          eventContent={(eventInfo) => {
            const logo = eventInfo.event.extendedProps.logoUrl;
            return (
              <div className={styles.eventContainer}>
                {logo && (
                  <img
                    src={logo}
                    alt="Bank Logo"
                    className={styles.eventLogo}
                  />
                )}
                <div>
                  <div className={styles.eventTitleContainer}>
                    <div className={styles.eventTitle}>
                      {eventInfo.event.title.split(' - ')[0]}
                    </div>
                    <div className={styles.tooltip}>
                      {eventInfo.event.title.split(' - ')[0]}
                    </div>
                  </div>
                  <div className={styles.eventAmount}>
                    {eventInfo.event.title.split(' - ')[1]}
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* 모달 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className={styles.modalContent} // 모달 스타일
        overlayClassName={styles.modalOverlay} // 배경
      >
        <label className={styles.modalLabel}>은행</label>
        <select
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          className={styles.modalSelect}
        >
          <option value="" disabled>
            은행 선택
          </option>
          {Object.keys(bankLogos).map((bank) => (
            <option key={bank} value={bank}>
              {bank}
            </option>
          ))}
        </select>
        <label className={styles.modalLabel}>적금명</label>
        <select
          value={savingName}
          onChange={(e) => setSavingName(e.target.value)}
          className={styles.modalSelect}
        >
          <option value="" disabled>
            적금명 선택
          </option>
          <option value="KB Dream 정기적금">KB Dream 정기적금</option>
          <option value="하나 더블업 정기적금">하나 더블업 정기적금</option>
          <option value="안전적금">안전적금</option>
          <option value="행복적금">행복적금</option>
          <option value="희망적금">희망적금</option>
          <option value="긴글자용테스트입니다용">긴글자용테스트입니다용</option>
        </select>

        <label className={styles.modalLabel}>시작 날짜</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={styles.modalInput}
        />
        <label className={styles.modalLabel}>만기일</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={styles.modalInput}
        />
        <label className={styles.modalLabel}>금액</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.modalInput}
        />
        <button onClick={saveEvent} className={styles.modalButton}>
          저장
        </button>
      </Modal>
    </div>
  );
};

export default MyCalendarPage;
