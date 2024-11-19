import styles from './MyCalendarPage.module.scss';

import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react'; //React용 FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; //월간 보기
import interactionPlugin from '@fullcalendar/interaction'; //날짜 클릭
import Modal from 'react-modal'; //모달

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
    if (savingName && amount && selectedDate && endDate) {
      const startDate = new Date(selectedDate);
      const finalDate = new Date(endDate);

      const newEvents = [];
      while (startDate <= finalDate) {
        newEvents.push({
          title: `${savingName} - ${amount}원`,
          date: startDate.toISOString().split('T')[0],
          extendedProps: { logoUrl, amount },
        });

        const currentDay = startDate.getDate();
        startDate.setMonth(startDate.getMonth() + 1);
        if (startDate.getDate() !== currentDay) {
          startDate.setDate(0); //말일로 설정
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
      <h1>적금 달력</h1>
      <div
        className={`${styles.calendar} ${modalIsOpen ? styles.calendarBlur : ''}`} // 모달 열리면 흐림 효과
      >
        <FullCalendar
          ref={calendarRef}
          locale="ko"
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: '',
            right: 'title',
          }}
          titleFormat={{ year: 'numeric', month: 'long' }}
          events={events}
          dateClick={handleDateClick}
          dayCellClassNames={({ date }) => {
            const today = new Date();
            const isToday =
              date.getFullYear() === today.getFullYear() &&
              date.getMonth() === today.getMonth() &&
              date.getDate() === today.getDate();
            if (isToday) return styles.today; //오늘 날짜
            const day = date.getUTCDay();
            if (day === 6) return styles.sunday; //일요일 
            if (day === 5) return styles.saturday; //토요일 
          }}
          dayCellDidMount={(info) => {
            if (info.isToday) {
              info.el.style.backgroundColor = 'transparent'; //노란 배경 제거
              info.el.classList.add(styles.today); //커스텀 스타일 추가
            }
          }}        
          dayCellContent={({ date }) => {
            return <span style={{ display: 'block', textAlign: 'center' }}>{date.getDate()}</span>;
          }}
          datesSet={() => {
            const titleElement = document.querySelector('.fc-toolbar-title');
            if (titleElement) {
              titleElement.classList.add(styles.title); 
            }
          }}
        />
      </div>

      {/* 모달 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className={styles.modalContent} //콘텐츠 스타일
        overlayClassName={styles.modalOverlay} //오버레이 스타일
      >
        <label style={{ display: 'block', marginBottom: '10px', textAlign: 'left' }}>은행</label>
        <select
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        >
          <option value="" disabled>은행 선택</option>
          <option value="국민은행">국민은행</option>
          <option value="신한은행">신한은행</option>
          <option value="하나은행">하나은행</option>
          <option value="우리은행">우리은행</option>
          <option value="카카오뱅크">카카오뱅크</option>
        </select>
        <label style={{ display: 'block', marginBottom: '10px', textAlign: 'left' }}>적금명</label>
        <select
          value={savingName}
          onChange={(e) => setSavingName(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        >
          <option value="" disabled>적금명 선택</option>
          <option value="행복적금">행복적금</option>
          <option value="희망적금">희망적금</option>
          <option value="안전적금">안전적금</option>
        </select>

        <label style={{ display: 'block', marginBottom: '10px', textAlign: 'left' }}>시작 날짜</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />

        <label style={{ display: 'block', marginBottom: '10px', textAlign: 'left' }}>만기일</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />

        <label style={{ display: 'block', marginBottom: '10px', textAlign: 'left' }}>금액</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />

        <button
          onClick={saveEvent}
          style={{
            padding: '10px',
            width: '100%',
            backgroundColor: '#0085E4',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          저장
        </button>
      </Modal>
    </div>
  );
};

export default MyCalendarPage;
