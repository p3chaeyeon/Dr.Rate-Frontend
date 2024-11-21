import RateCalc from 'src/components/RateCalc';
import styles from './ProductDetailPage.module.scss';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductDetailPage = () => {
    const id = 4;

    useEffect(() => {
        axios.get(`http://localhost:8080/product/getOneProduct/${id}`)
            .then((res) => {
                setTest(res.data)
                console.log(res.data)
            })
            .catch((e) => console.log(e))
    },[]);
    
    const [isOpen, setIsOpen] = useState(false);
    const [test, setTest] = useState({
        product: {},
        options: []
        }
    );

    const product = test.product;  // Spring에서 반환한 product 객체
    const options = test.options; 

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };


    return (
        <main>
            <section>
                <h3 className={styles.title}>{product.ctg === 'i' ? '적금' : '예금'}</h3>
                <div className={styles.topDiv}>
                    <div className={styles.image}><img src='' /></div>
                    <div className={styles.name}>
                        <p className={styles.nameOne}>{product.bankName}</p>
                        <p className={styles.nameTwo}>{product.prdName}</p>

                        <p className={styles.nameThree}>{options?.[0]?.rsrvTypeName ?? '자유적립식'}</p>
                    </div>
                    <div className={styles.rate}>
                        <p className={styles.rateOne}>{options?.[0]?.spclRate ? `최고 ${options[0].spclRate} %` : '우대조건 해당사항 없음'}</p>
                        <p className={styles.rateTwo}>기본금리 {options?.[0]?.basicRate ?? '금리 정보 없음'} %</p>
                    </div>
                </div>

                <div className={styles.btnDiv}>
                    <button className={styles.intobtn}>비교담기</button>
                    <button className={styles.gotoHomePage} onClick={() =>window.open(product.url, '_blank')}>가입하기</button>
                </div>

                {isOpen || (
                <div className={`${styles.serviceDiv} ${isOpen ? styles.open : ''}`} onClick={handleToggle}>
                    <span className={styles.serviceOne}>이자계산기</span>
                    <span className={styles.serviceTwo}>자세히</span>
                </div>
                )}

                {isOpen && (
                    <RateCalc isOpen={isOpen} options={options} onClose={handleToggle}/>
                )}

                <div className={styles.detailDiv}>

                </div>

            </section>
        </main>
    );
};

export default ProductDetailPage;