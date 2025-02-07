import { useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  onClose: () => void;
  imageSrc?: string;     // 이미지 경로 (선택적)
  title?: string;        // 모달 제목 (선택적)
  description?: string;  // 설명 (선택적)
  children?: ReactNode;  // 추가 콘텐츠 (선택적)
}

export function Modal({ onClose, imageSrc, title, description, children }: ModalProps) {  
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}  // 배경 클릭 시 모달 닫기
    >
      <div 
        className="bg-white rounded-lg shadow-lg w-full md:w-2/3 lg:w-1/2 relative"
        onClick={(e) => e.stopPropagation()}  // 모달 내부 클릭 시 닫힘 방지
      >
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* 모달 내용 */}
        <div className="p-6">
          {title && <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>}
          
          {imageSrc && (
            <img 
              src={`${imageSrc}?v=${new Date().getTime()}`} 
              alt={title || "분리배출 가이드 이미지"} 
              className="w-full sm:max-h-60 md:max-h-80 lg:max-h-[500px] object-contain mb-4 rounded-lg"
              onError={(e) => {
                console.error(`이미지를 불러오는 데 실패했습니다: ${imageSrc}`);
                (e.target as HTMLImageElement).src = '/images/default.png';  // 대체 이미지 경로
              }}
            />
          )}

          {description && <p className="text-gray-600 mb-4 text-center">{description}</p>}
          
          {children}  {/* 추가적인 콘텐츠가 있으면 렌더링 */}
          
          <div className="flex justify-center">
            <Button variant="outline" onClick={onClose}>닫기</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
