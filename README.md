# 프로젝트 실행
## 로컬 실행
```
git clone https://github.com/BitCamp-Final-Project/Dr.Rate-Frontend.git
cd dr_rate_front
git pull origin dev

npm install --global yarn
yarn --version # 1.22.22
yarn install

yarn add react-router-dom  # 클라이언트 측 라우팅 지원
yarn add axios             # HTTP 요청을 처리
yarn add jotai             # 경량 상태 관리
yarn add sass              # scss 사용 라이브러리
yarn add @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction @fullcalendar/core
yarn add react-modal       # @FullCalendar 라이브러리 설치, modal

yarn dev

```



## 빌드
`yarn build`

---

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
