/* src/pages/ProductListPage/ProductListPage.jsx */

import React, { useState } from 'react';
import styles from './ProductInsListPage.module.scss';


const ProductInsListPage = () => {
  const [selectedBank, setSelectedBank] = useState("");

  const handleChange = (event) => {
    setSelectedBank(event.target.value);
  };

  return (
    <main>
      <section className={styles.listSection}>
        <div className={styles.listTitleDiv}>
          적금
        </div>

        <div className={styles.filterDiv}>
          <div className={styles.commitFilterDiv}>
            <div className={styles.bankSelectDiv}>
              <div className={styles.bank}>은행</div>
              <select
                className={styles.bankSelect}
                value={selectedBank}
                onChange={handleChange}
              >
                <option value="" disabled>
                  은행 선택
                </option>
                <option value="woori">우리은행</option>
                <option value="shinhan">신한은행</option>
                <option value="hana">하나은행</option>
                <option value="kookmin">국민은행</option>
                <option value="toss">토스뱅크</option>
                <option value="kakao">카카오뱅크</option>
                <option value="nh">농협은행</option>
              </select>

            </div>
            <div className={styles.bankSelectedDiv}>
              
            </div>

          </div>
          <div className={styles.logFilterDiv}>
            <div className={styles.nonMemberFilterDiv}></div>
            <div className={styles.memberFilterDiv}></div>
          </div>
        </div>
        
      </section>
      
    </main>
  );
};

export default ProductInsListPage;

