//Jotai 및 관련 라이브러리 import
import React, { useRef, useEffect, useState } from 'react';
import { atom, useAtom } from 'jotai';
import FullCalendar from '@fullcalendar/react'; // React용 FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // 월간 보기
import interactionPlugin from '@fullcalendar/interaction'; // 날짜 클릭
import Modal from 'react-modal'; // 모달

import MyNav from 'src/components/MyNav'; //MyNav
import AlertModal from "src/components/Modal/AlertModal/AlertModal"; //AlertModal
import useModal from 'src/hooks/useModal'; //useModal 훅 추가

import { PATH } from "src/utils/path"; //경로
import leftArrowIcon from 'src/assets/icons/leftArrow.svg'; //icon
import rightArrowIcon from 'src/assets/icons/rightArrow.svg';

import styles from './MyCalendarPage.module.scss';

// Jotai 상태 관리
const eventsAtom = atom([]); // 이벤트 목록 저장
const modalIsOpenAtom = atom(false); // 모달 열림 상태
const selectedDateAtom = atom(''); // 선택된 날짜 저장
const savingNameAtom = atom(''); // 상품 이름 저장
const amountAtom = atom(''); // 금액 저장
const logoUrlAtom = atom(''); // 로고 URL 저장
const endDateAtom = atom(''); // 만기일 저장
const isSmallScreenAtom = atom(window.innerWidth <= 1000); //화면 크기 변경 시 상태 업데이트
const expandedDatesAtom = atom({}); // 특정 날짜의 이벤트가 펼쳐졌는지 관리

// 은행 로고 URL 매핑
const bankLogos = {
  국민은행: "kookminLogo.png",
  신한은행: "shinhanLogo.png",
  하나은행: "hanaLogo.png",
  우리은행: "wooriLogo.png",
  카카오뱅크: "kakaoLogo.png",
  농협은행: "nonghyupLogo.png",
  토스뱅크: "tossLogo.png",
};

// 모달 초기 설정
Modal.setAppElement('#root');

const MyCalendarPage = () => {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom); //선택날짜
  const [modalIsOpen, setModalIsOpen] = useAtom(modalIsOpenAtom); //모달열림
  const [savingName, setSavingName] = useAtom(savingNameAtom); //적금명
  const [logoUrl, setLogoUrl] = useAtom(logoUrlAtom); //은행로고
  const [endDate, setEndDate] = useAtom(endDateAtom); //만기일
  const [amount, setAmount] = useAtom(amountAtom); //금액
  const [events, setEvents] = useAtom(eventsAtom); //이벤트목록
  const [isSmallScreen, setIsSmallScreen] = useAtom(isSmallScreenAtom);
  const [expandedDates, setExpandedDates] = useAtom(expandedDatesAtom);
  const [animatingDates, setAnimatingDates] = useState({});

  // 이벤트 필터링 로직
  const smallScreenFilteredEvents = events.filter((event) => {
    if (isSmallScreen) {
      return (
        expandedDates[event.date] || // 확장된 날짜면 모든 이벤트 표시
        events.findIndex((e) => e.date === event.date) ===
        events.indexOf(event) // 아니면 첫 번째 이벤트만 표시
      );
    }
    return true; // 전체 화면에서는 모든 이벤트 표시
  });

  // 로고 클릭 핸들러
  const handleLogoClick = (date) => {
    // 기존 이벤트 흐림 처리
    setAnimatingDates((prev) => ({
      ...prev,
      [date]: true, // 애니메이션 시작
    }));

    setTimeout(() => {
      setExpandedDates((prev) => ({
        ...prev,
        [date]: !prev[date], // 클릭한 날짜의 확장 상태를 토글
      }));

      // 애니메이션 종료 후 기존 이벤트 밝기 복구
      setTimeout(() => {
        setAnimatingDates((prev) => ({
          ...prev,
          [date]: false, // 애니메이션 종료
        }));
      }, 500); // CSS `transition` 속성과 동일한 시간
    }, 500); // CSS `transition` 속성과 동일한 시간
  };

  //화면크기 상태
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1000); // 화면 크기 변경 시 상태 업데이트
    };
    window.addEventListener('resize', handleResize); // resize 이벤트 리스너 등록
    return () => window.removeEventListener('resize', handleResize); // 컴포넌트 언마운트 시 리스너 제거
  }, [setIsSmallScreen]);

  const calendarRef = useRef(null); // 캘린더 참조

  //useModal 훅
  const { isAlertOpen, openAlertModal, closeAlertModal, alertContent } = useModal();

  // 작은 화면에서는 각 날짜의 첫 번째 이벤트만 표시
  const filteredEvents = isSmallScreen
    ?
    events.filter(
      (event, index, self) =>
        self.findIndex((e) => e.date === event.date) === index
    )
    : // 큰 화면에서는 모든 이벤트 표시
    events;

  // 날짜 클릭 시 모달 열기
  const handleDateClick = (info) => {
    //이벤트 개수 확인
    const selectedDateEventsCount = events.filter(
      (event) => event.date === info.dateStr
    ).length;

    //3개까지 허용
    if (selectedDateEventsCount >= 3) {
      openAlertModal('실패', '하루에 최대 3개의 상품만 추가할 수 있습니다!');
      return;
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

      const numericAmount = parseInt(amount.replace(/,/g, ''), 10); //쉼표 제거 후 숫자로 변환
      const formattedAmount = numericAmount.toLocaleString(); //쉼표 추가

      const newEvents = []; //새로운 이벤트 리스트
      while (startDate <= finalDate) {
        newEvents.push({
          title: `${savingName} - ${formattedAmount}원`,
          date: startDate.toISOString().split('T')[0],
          extendedProps: {
            logoUrl: bankLogos[logoUrl], // 파일명만 저장
            amount: numericAmount, //금액
          },
        });

        //매월 같은날짜 반복
        const currentDay = startDate.getDate();
        startDate.setMonth(startDate.getMonth() + 1);
        if (startDate.getDate() !== currentDay) {
          startDate.setDate(0); // 말일로 설정
        }
      }
      //기존이벤트와 새로운 이벤트 병합
      setEvents((prevEvents) => {
        const updatedEvents = [...prevEvents, ...newEvents];
        return updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date)); // 날짜 순서로 정렬
      });
      //초기화
      setModalIsOpen(false);
      setSavingName('');
      setAmount('');
      setLogoUrl('');
      setSelectedDate('');
      setEndDate('');
    } else {
      openAlertModal('작성 불가', '모든 정보를 입력해주세요!');
    }
  };

  return (
    <main>
      <MyNav />
      <section>
        <AlertModal
          isOpen={isAlertOpen} closeModal={closeAlertModal} title={alertContent.title} message={alertContent.message}
        />
        <div
          className={`${styles.calendar} ${modalIsOpen ? styles.calendarBlur : ''}`} // 흐림효과 추가
        >
          <FullCalendar
            ref={calendarRef}
            locale="ko" // 한글
            plugins={[dayGridPlugin, interactionPlugin]} // 월간보기, 날짜클릭
            initialView="dayGridMonth" //초기화면설정
            eventOrder="" // 이벤트 순서
            headerToolbar={{
              left: 'title',
              center: '',
              right: 'prev,today,next',
            }}
            buttonText={{
              today: '오늘',
              prev: '',
              next: '',
            }}
            titleFormat={{ year: 'numeric', month: 'long' }}
            events={isSmallScreen ? smallScreenFilteredEvents : filteredEvents} //이벤트목록
            contentHeight="auto" // 달력 주 고정된 높이
            dateClick={handleDateClick} //날짜클릭
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
              const day = date.getDate(); //날짜 가져오기
              const formattedDay = day < 10 ? `0${day}` : `${day}`; //한 자릿수면 앞에 0 추가
              return <span>{formattedDay}</span>; //날짜 표시
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

              const prevButton = document.querySelector('.fc-prev-button'); //이전버튼
              const nextButton = document.querySelector('.fc-next-button'); //다음버튼

              const defaultIcons = document.querySelectorAll('.fc-icon'); //기본 icon요소
              defaultIcons.forEach((icon) => (icon.style.display = 'none')); //숨기기          

              //이전 버튼에 커스텀 아이콘 추가
              if (prevButton && !prevButton.querySelector('img')) {
                const prevImg = document.createElement('img');
                prevImg.src = leftArrowIcon;
                prevImg.alt = '이전';
                prevButton.className = styles.transparentButton;
                prevButton.appendChild(prevImg);
              }

              if (nextButton && !nextButton.querySelector('img')) {
                const nextImg = document.createElement('img');
                nextImg.src = rightArrowIcon;
                nextImg.alt = '다음';
                nextButton.className = styles.transparentButton;
                nextButton.appendChild(nextImg);
              }

              const todayButton = document.querySelector('.fc-today-button');
              if (todayButton) {
                todayButton.classList.add(styles.transparentButton); // 오늘버튼
              }
            }}
            eventContent={(eventInfo) => {
              const logoFileName = eventInfo.event.extendedProps.logoUrl; // 파일명만 가져옴
              const logoUrl = `${PATH.STORAGE_BANK}/${logoFileName}`; // 경로 결합
              const date = eventInfo.event.startStr;

              const eventsForDate = events.filter((event) => event.date === date);
              const isFirstEvent =
                eventsForDate.length > 0 && eventsForDate[0].title === eventInfo.event.title;

              const isExpanded = expandedDates[date];
              const isAnimating = animatingDates[date];

              return (
                <div
                  className={`${styles.eventContainer}`}
                  style={{
                    opacity: isAnimating ? 0.5 : 1, // 애니메이션 동안 흐림 효과
                    transition: 'opacity 1s ease-in-out',
                  }}
                >
                  {logoFileName && (
                    <div className={styles.logoWrapper}>
                      <img
                        src={logoUrl} // 완전한 URL
                        alt="Bank Logo"
                        className={styles.eventLogo}
                        style={{
                          visibility: 'visible',
                          opacity: 1,
                          transition: 'opacity 1s ease-in-out',
                        }}
                      />
                      {isSmallScreen && isFirstEvent && (
                        <button
                          className={`${styles.expandButton} ${styles.hoverOnly}`}
                          onClick={() => handleLogoClick(date)}
                        >
                          {isExpanded ? '－' : '＋'}
                        </button>
                      )}
                    </div>
                  )}
                  {(isExpanded || !isSmallScreen) && (
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
                  )}
                </div>
              );
            }}
          />
        </div>
      </section>

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
          min={selectedDate || undefined} // 시작일 이후로만 선택 가능
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
    </main>
  );
};

export default MyCalendarPage;

