import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaCoins, FaTicketAlt } from "react-icons/fa"; // 아이콘 추가

export function Rewards() {
  useEffect(() => {
    import("bootstrap");
  }, []);

  return (
    <div className="container mt-4">
      {/* ✅ 슬라이드 배너 */}
      <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="3000">
            <img
              src="/slide1.jpg"
              className="d-block w-100"
              alt="Slide 1"
              style={{ height: "40vh", objectFit: "cover" }}
            />
          </div>
          <div className="carousel-item" data-bs-interval="3000">
            <img
              src="/slide2.jpg"
              className="d-block w-100"
              alt="Slide 2"
              style={{ height: "40vh", objectFit: "cover" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="/slide3.jpg"
              className="d-block w-100"
              alt="Slide 3"
              style={{ height: "40vh", objectFit: "cover" }}
            />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* ✅ 사용자 프로필 섹션 */}
      <div className="d-flex justify-content-between align-items-center bg-white p-4 rounded-lg shadow-lg border mt-5">
        {/* 사용자 정보 */}
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle bg-secondary" style={{ width: "80px", height: "80px" }}></div>
          <div>
            <h2 className="h5 fw-bold">사용자이름</h2>
            <p className="text-muted m-0">누적 포인트: XX | 현재 등급: XXpoint | 🗑 분리배출 견습생</p>
            <p className="text-muted m-0">누적된 포인트를 확인하고 보상을 받아가세요!</p>
          </div>
        </div>

        {/* ✅ 버튼 (동작 없음) */}
        <div className="d-flex gap-3">
          <Button variant="outline">포인트 내역</Button>
          <Button className="bg-black text-white">상점으로 이동</Button>
        </div>
      </div>

      {/* ✅ 포인트 및 쿠폰 카드 (흰색 배경, 내부 색상 유지) */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-lg border">
        <div className="row g-3">
          {/* 보유 포인트 */}
          <div className="col-md-6">
            <div className="p-4 rounded-3 border bg-light d-flex flex-column"> {/* ✨ 내부 배경색 유지, 부모 카드만 흰색 */}
              <div className="d-flex align-items-center gap-2">
                <FaCoins size={22} className="text-warning" />
                <h5 className="mb-0 fw-bold">보유 포인트</h5>
              </div>
              <h1 className="fw-bold mt-2 text-orange">900 <span className="fs-4 text-dark">포인트</span></h1>
            </div>
          </div>

          {/* 보유 쿠폰 */}
          <div className="col-md-6">
            <div className="p-4 rounded-3 border bg-light d-flex flex-column"> {/* ✨ 내부 배경색 유지, 부모 카드만 흰색 */}
              <div className="d-flex align-items-center gap-2">
                <FaTicketAlt size={22} className="text-danger" />
                <h5 className="mb-0 fw-bold">보유 쿠폰</h5>
              </div>
              <h1 className="fw-bold mt-2 text-orange">2 <span className="fs-4 text-dark">장</span></h1>
            </div>
          </div>

          {/* 개별 쿠폰 정보 */}
          <div className="col-12">
            <div className="p-3 rounded-3 border bg-light d-flex align-items-center"> {/* ✨ 내부 배경색 유지, 부모 카드만 흰색 */}
              <FaTicketAlt size={20} className="text-danger me-2" />
              <div>
                <h6 className="fw-bold mb-0">🎉 신규가입 쿠폰</h6>
                <small className="text-muted">종량제 봉투 5L 10매</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 포인트 사용 버튼 (하단 고정) */}
      {/* <div className="mt-4"> */}
        {/* <Button className="w-100 py-3 text-white fs-5 fw-bold bg-black"> */}
          {/* 상점으로 이동 */}
        {/* </Button> */}
      {/* </div> */}
    </div>
  );
}
