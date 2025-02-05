import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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

      {/* ✅ 사용자 프로필 섹션 (간격 추가) */}
      <div className="d-flex justify-content-between align-items-center bg-white p-4 rounded-lg shadow mt-5">
        {/* 왼쪽 사용자 정보 */}
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
    </div>
  );
}