import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface ApartmentData {
  apartmentName: string
  collectionPoints: string[]
  assignments: {
    [key: string]: string[] // 구역별 동 목록
  }
}

export const CollectionStatusPage: React.FC = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [allApartments, setAllApartments] = useState<ApartmentData[]>([])
  const [selectedApartment, setSelectedApartment] = useState<ApartmentData | null>(null)

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('allApartments') || '[]')
    setAllApartments(savedData)

    if (state) {
      setSelectedApartment(state)
    } else if (savedData.length > 0) {
      setSelectedApartment(savedData[0]) // 기본값으로 첫 번째 아파트 선택
    }
  }, [state])

  const handleApartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = allApartments.find(apartment => apartment.apartmentName === e.target.value)
    setSelectedApartment(selected || null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        분리수거 현황
      </h1>

      {/* 아파트 선택 드롭다운 */}
      <div className="mb-6 flex justify-center">
        <select
          value={selectedApartment?.apartmentName || ''}
          onChange={handleApartmentChange}
          className="p-2 border border-gray-300 rounded-lg"
        >
          {allApartments.map((apartment, idx) => (
            <option key={idx} value={apartment.apartmentName}>
              {apartment.apartmentName}
            </option>
          ))}
        </select>
      </div>

      {/* 선택된 아파트의 분리수거 현황 표시 */}
      {selectedApartment?.collectionPoints?.map((point, idx) => (
        <div key={idx} className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{point} 구역</h2>

          {selectedApartment.assignments[point]?.map((building, bIdx) => (
            <div key={bIdx} className="mb-4">
              <h3 className="text-xl font-semibold">{building} 동</h3>

              {/* 분리수거 통 상태 표시 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {['플라스틱', '금속', '유리', '캔', '종이', '비닐'].map((type, i) => {
                  const fillLevel = Math.floor(Math.random() * 100) // 임시 데이터 (랜덤 채움 상태)

                  return (
                    <div key={i} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-center">{type}</h4>
                      <div className="w-full bg-gray-300 h-4 rounded-full mt-2">
                        <div
                          className="h-4 bg-green-500 rounded-full"
                          style={{ width: `${fillLevel}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 text-center mt-1">{fillLevel}% 채움</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={() => navigate('/admin')}
        className="w-full mt-6 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
      >
        설정으로 돌아가기
      </button>
    </div>
  )
}
