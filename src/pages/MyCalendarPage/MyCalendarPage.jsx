import React, { useState, useRef } from 'react';
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

// 모달 초기 설정
Modal.setAppElement('#root');

const MyCalendarPage = () => {
  const [events, setEvents] = useState([]); // 이벤트 목록 저장
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 창 열림 상태
  const [selectedDate, setSelectedDate] = useState(''); // 선택된 날짜 저장
  const [savingName, setSavingName] = useState(''); // 상품 이름 저장
  const [amount, setAmount] = useState(''); // 금액 저장
  const [logoUrl, setLogoUrl] = useState(''); // 로고 URL 저장
  const [endDate, setEndDate] = useState(''); // 만기일 저장

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
    setSelectedDate(info.dateStr);
    setModalIsOpen(true);
  };

  // 오늘 날짜로 이동
  const goToToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
  };

  // 새로운 이벤트 저장
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

      setEvents([...events, ...newEvents]);
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
        className={`${styles.calendar} ${modalIsOpen ? styles.calendarBlur : ''}`} // 모달 열리면 흐림 효과
      >
        <FullCalendar
          ref={calendarRef}
          locale="ko"
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,today,next',
            center: '',
            right: 'title',
          }}
          buttonText={{
            today: '오늘', // 'Today'를 '오늘'로 변경
            prev: '<', // 이전 버튼을 '<'로 표시
            next: '>', // 다음 버튼을 '>'로 표시
          }}
          titleFormat={{ year: 'numeric', month: 'long' }}
          events={events}
          contentHeight={810} // 주 고정된 높이
          dateClick={handleDateClick}
          dayCellClassNames={({ date }) => {
            const today = new Date();
            const isToday =
              date.getFullYear() === today.getFullYear() &&
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
            return <span>{date.getDate()}</span>;
          }}
          datesSet={() => {
            const frames = document.querySelectorAll('.fc-daygrid-day-frame');
            frames.forEach((frame) => {
              frame.classList.add(styles.expandedPadding); // 각 셀 크기
            });

            const titleElement = document.querySelector('.fc-toolbar-title');
            if (titleElement) {
              titleElement.classList.add(styles.title);
            }

            const tableElement = document.querySelector('.fc-scrollgrid');
            if (tableElement) {
              tableElement.classList.add(styles.noBorderTop); // 윗선 제거
            }

            const prevButton = document.querySelector('.fc-prev-button');
            if (prevButton) {
              prevButton.classList.add(styles.transparentButton);
            }

            const nextButton = document.querySelector('.fc-next-button');
            if (nextButton) {
              nextButton.classList.add(styles.transparentButton);
            }

            const todayButton = document.querySelector('.fc-today-button');
            if (todayButton) {
              todayButton.classList.add(styles.transparentButton);
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
                  <div className={styles.eventTitle}>{eventInfo.event.title.split(' - ')[0]}</div>
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
        className={styles.modalContent} // 콘텐츠 스타일
        overlayClassName={styles.modalOverlay} // 오버레이 스타일
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
