import React, { useEffect, useState } from "react";
import styles from "./ProductDepListPage.module.scss";
import axios from "axios";
import { PATH } from "src/utils/path";

const ProductDepListPage = () => {
  const [selectedBanks, setSelectedBanks] = useState([]); // 선택된 은행 목록
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);


  useEffect(() => {
    fetchProductsByCtg("d"); // 초기에는 "d" 카테고리 데이터 가져오기
    fetchAllProducts(); // 모든 제품 가져오기
  }, []); // 빈 배열로 한 번만 호출

  const fetchProductsByCtg = async (ctg) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/product/getProductsByCtg/${ctg}`
      );
      setProducts(response.data); // 가져온 데이터 설정
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  console.log(products)
  console.log(allProducts);
  

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/product/getAllProducts`
      );
      setAllProducts(response.data); // 가져온 데이터 설정
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleBankChange = (e) => {
    const selectedBank = e.target.value;
    if (selectedBank && !selectedBanks.includes(selectedBank)) {
      setSelectedBanks([...selectedBanks, selectedBank]); // 새로운 은행 추가
    }
  };

  const handleBankRemove = (bank) => {
    setSelectedBanks(selectedBanks.filter((item) => item !== bank)); // 은행 삭제
  };

  const handleFilterChange = (value) => {
    console.log("필터 변경:", value); // 테스트용
    // 추가 로직 구현
  };

  const handleRateClick = () => {
    console.log("금리 높은 순 버튼 클릭"); // 테스트용
    // 추가 로직 구현
  };

  return (
    <main className={styles.productListMain}>
      <section>
        <div className={styles.mainTitle}>
          <h3>예금</h3>
        </div>

        {/* 회원/비회원 공통 보이는 필터 */}
        <div className={styles.commonFilter}>
          <div className={styles.bankSelectTitle}>은행</div>

          <div className={styles.bankSelectDiv}>
            <select className={styles.bankSelect} onChange={handleBankChange}>
              <option value="">은행 선택</option>
              <option value="KB 은행">KB 은행</option>
              <option value="우리 은행">우리 은행</option>
              <option value="국민 은행">국민 은행</option>
            </select>
          </div>

          {/* 선택된 은행 표시 */}
          <div className={styles.selectedBanksContainer}>
            {selectedBanks.map((bank, index) => (
              <div key={index} className={styles.selectedBank}>
                <span>{bank}</span>
                <button
                  onClick={() => handleBankRemove(bank)}
                  className={styles.removeBank}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 비회원 보이는 배너 */}
        <div className={styles.nonMemberBanner}>
          <div className={styles.banner}>
            <h3>
              나에게 맞는 예금 상품이 궁금하다면? <span>Click</span>
            </h3>
          </div>
        </div>

        {/* 로그인 후 보이는 필터 */}
        <div className={styles.filterTotalDiv}>
          <div className={styles.filterDiv}>
            <h4>나이</h4>
            <input
              type="number"
              name="birth"
              placeholder="나이 입력"
              onChange={handleFilterChange}
              style={{
                padding: "8px",
                width: "55%",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          <div
            className={styles.filterDiv}
            // style={{ display: "flex", alignItems: "center" }}
          >
            <h4>저축 예정 기간</h4>
            <select
              name="period"
              onChange={handleFilterChange}
              style={{
                padding: "8px",
                width: "200px",
                marginRight: "10px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">저축 예정 기간</option>
              <option value="1개월">1개월</option>
              <option value="3개월">3개월</option>
              <option value="6개월">6개월</option>
              <option value="12개월">12개월</option>
            </select>
          </div>

          <div className={styles.filterDiv}>
            <h4>이자 계산 방식</h4>
            <div className={styles.toggle}>
              <button
                className={styles.ratetype}
                style={{ width: "120px" }}
                data-value="단리"
                onClick={() => handleFilterChange("단리")}
              >
                단리
              </button>
              <button
                className={styles.ratetype}
                style={{ width: "120px" }}
                data-value="복리"
                onClick={() => handleFilterChange("복리")}
              >
                복리
              </button>
            </div>
          </div>

          <div className={styles.filterDiv}>
            <h4>가입방식</h4>
            <select
              name="type"
              onChange={handleFilterChange}
              style={{
                padding: "8px",
                width: "200px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">가입 방식</option>
              <option value="대면">대면</option>
              <option value="비대면">비대면</option>
            </select>
          </div>
          {/*버튼 hidden*/}
          {/* <button
        onClick={handleRateClick}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          backgroundColor: "#407BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        조회
      </button> */}
        </div>

        {/* <div className={styles.filterDiv}>
          <h4>가입방식</h4>
          <select
            name="type"
            onChange={handleFilterChange}
            style={{ padding: "8px", width: "200px" }}
          >
            <option value="">적립유형</option>
            <option value="대면">자유적립</option>
            <option value="비대면">정액적립</option>
          </select>
        </div>
      </section> */}
        {/* 금리순 정렬  */}
        <div className={styles.rateStandard}>
          <span>최고 금리순 | </span>
          <span>기본 금리순</span>
        </div>
        {/* 리스트 */}
            {/** db 연동 상품 리스트  */}
<div className={styles.productListDiv}>
    {products.length === 0 ? (
    <p>표시할 데이터가 없습니다.</p>
  ) : (
    allProducts.map((product, index) => (
      <div key={index} className={styles.productList}>
         <div className={styles.image}><img src={`${PATH.STORAGE_BANK}/${product.product.bankLogo}`} className={styles.productListLogo}/></div>
        <div className={styles.productListInfo}>
          <div>
            <p>{product.product.bankName}</p>
            <p>{product.product.prdName}</p>
          </div>
          <div>
            <p>최고 {product.options[0].basicRate}%</p>
            <p>기본금리 {product.options[0].spclRate}%</p>
          </div>
        </div>
        <div className={styles.productListBtn}>비교 담기</div>
      </div>
    ))

  )}
</div>
      </section>
    </main>
  );
};

export default ProductDepListPage;
