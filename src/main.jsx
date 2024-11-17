/* src/Main.jsx */

import { StrictMode } from 'react'
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './styles/init.css';
import './index.css'
import "src/styles/font.css";
import "src/styles/color.css";
import App from './App.jsx'
import Header from './components/Header/Header.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Router>
      <Header />
      <App />
  </Router>
  // </StrictMode>,
)
