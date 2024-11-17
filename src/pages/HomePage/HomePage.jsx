// src/pages/HomePage/HomePage.jsx

import styles from "./HomePage.module.scss";
import { useNavigate } from "react-router-dom";
import { PATH } from "src/utils/path"; // 상대경로 '../../utils/path'
import React from "react";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <main>
            <section>

            {/* // <h2>Font Test</h2> */}


            <input type="checkbox" />
            {/* 테스트할 요소 추가 */}
            <p>테스트용 문단</p>
            <a href="#">링크 스타일 테스트</a>
            <ul>
                <li>목록 아이템 1</li>
                <li>목록 아이템 2</li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>테이블 헤더1</th>
                        <th>테이블 헤더2</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>데이터1</td>
                        <td>데이터2</td>
                    </tr>
                </tbody>
            </table>
            </section>
        </main>
    );
};

export default HomePage;
