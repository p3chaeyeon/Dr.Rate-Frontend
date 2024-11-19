import styles from './MyCalendarPage.module.scss';

import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react'; // React용 FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // 월간 보기
import interactionPlugin from '@fullcalendar/interaction'; // 날짜 클릭
import Modal from 'react-modal'; // 모달

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
      alert('모든 필드를 입력해주세요!');
    }
  };

  // 요일 스타일링
  const getDayClassNames = (date) => {
    const day = date.getUTCDay();
    if (day === 6) return 'sunday'; // 일요일
    if (day === 5) return 'saturday'; // 토요일
    return 'daycell';
  };

  return (
    <div className={styles.container}>
      <h1>적금 달력</h1>
      <div style={{ width: '80%', margin: '0 auto' }} className="calendar">
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
          dayCellClassNames={({ date }) => getDayClassNames(date)}
          dayCellContent={({ date }) => <span>{date.getDate()}</span>}
        />
      </div>

      {/* 모달 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: { zIndex: 1000 },
          content: {
            width: '300px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '8px',
          },
        }}
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
            backgroundColor: '#0068FF',
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
