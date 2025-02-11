// src/types/apartment.ts

export interface ApartmentData {
  name: string                    // 아파트 이름
  buildings: string[]             // 아파트 동 리스트
  collectionPoints: string[]      // 수거장 구역 리스트
  assignments: { [key: string]: string[] }  // 수거장 -> 동 연결 관계
  bins: { [key: string]: BinStatus[] }     // 수거장 -> 각 통의 상태
}

export interface BinStatus {
  type: string         // 분리수거 항목 (플라스틱, 금속 등)
  fillLevel: number    // 채움 정도 (0 ~ 100%)
}
