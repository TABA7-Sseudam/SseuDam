import React, { useEffect, useState, useRef } from 'react'
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
  const [loading, setLoading] = useState(true) // 로딩 상태 추가

  const statusRef = useRef<HTMLDivElement>(null) // 현황 표시 위치로 스크롤하기 위해 ref 사용

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('allApartments') || '[]')

    if (state) {
      const isExisting = savedData.some(
        (apartment: ApartmentData) => apartment.apartmentName === state.apartmentName
      )

      if (!isExisting) {
        const updatedApartments = [...savedData, state]
        localStorage.setItem('allApartments', JSON.stringify(updatedApartments))
        setAllApartments(updatedApartments)
        setSelectedApartment(state)
      } else {
        setAllApartments(savedData)
        setSelectedApartment(savedData.find((a: ApartmentData) => a.apartmentName === state.apartmentName) || null)
      }
    } else if (savedData.length > 0) {
      setAllApartments(savedData)
      setSelectedApartment(savedData[0])
    }

    setLoading(false) // 데이터 로드 후 로딩 종료
  }, [state])

  const handleApartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = allApartments.find(apartment => apartment.apartmentName === e.target.value)
    setSelectedApartment(selected || null)

    // 선택 후 자동 스크롤
    setTimeout(() => {
      statusRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleResetData = () => {
    localStorage.removeItem('allApartments')
    setAllApartments([])
    setSelectedApartment(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        분리수거 현황
      </h1>

      {/* 아파트 선택 드롭다운 */}
      <div className="mb-6 flex justify-center space-x-4">
        {allApartments.length > 0 ? (
          <>
            <select
              value={selectedApartment?.apartmentName || ''}
              onChange={handleApartmentChange}
              className="p-2 border border-gray-300 rounded-lg shadow-sm"
            >
              {allApartments
                .sort((a, b) => a.apartmentName.localeCompare(b.apartmentName))
                .map((apartment, idx) => (
                  <option key={idx} value={apartment.apartmentName}>
                    {apartment.apartmentName}
                  </option>
                ))}
            </select>
            <button
              onClick={handleResetData}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              데이터 초기화
            </button>
          </>
        ) : (
          <p className="text-gray-600 text-center">저장된 아파트 데이터가 없습니다.</p>
        )}
      </div>

      {/* 로딩 상태 표시 */}
      {loading && <p className="text-center text-gray-500">데이터를 불러오는 중입니다...</p>}

      {/* 선택된 아파트의 분리수거 현황 표시 */}
      {selectedApartment && !loading && (
        <div ref={statusRef}>
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
            {selectedApartment.apartmentName} 분리수거 현황
          </h2>

          {selectedApartment.collectionPoints.map((point, idx) => (
            <div
              key={idx}
              className="bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-green-700 mb-4">{point} 구역</h3>

              {selectedApartment.assignments[point]?.map((building, bIdx) => (
                <div key={bIdx} className="mb-4">
                  <h4 className="text-lg font-medium text-gray-800">{building} 동</h4>

                  {/* 분리수거 통 상태 표시 */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {['플라스틱', '금속', '유리', '캔', '종이', '비닐'].map((type, i) => {
                      const fillLevel = Math.floor(Math.random() * 100) // 임시 데이터

                      // 채움 수준에 따라 색상 및 메시지 변경
                      let fillColor = 'bg-green-500'
                      let statusMessage = '정상'

                      if (fillLevel > 80) {
                        fillColor = 'bg-red-500'
                        statusMessage = '가득 참!'
                      } else if (fillLevel > 50) {
                        fillColor = 'bg-yellow-500'
                        statusMessage = '절반 이상'
                      }

                      return (
                        <div
                          key={i}
                          className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition"
                        >
                          <h5 className="font-semibold text-center text-gray-700">{type}</h5>
                          <div className="w-full bg-gray-300 h-4 rounded-full mt-2">
                            <div
                              className={`h-4 ${fillColor} rounded-full transition-all duration-500`}
                              style={{ width: `${fillLevel}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600 text-center mt-1">
                            {fillLevel}% 채움
                          </p>

                          {/* 상태 메시지 표시 */}
                          {fillLevel > 50 && (
                            <p
                              className={`text-center font-semibold mt-1 ${
                                fillLevel > 80 ? 'text-red-500' : 'text-yellow-500'
                              }`}
                            >
                              ⚠️ {statusMessage}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* 설정으로 돌아가기 버튼 */}
      <button
        onClick={() => navigate('/admin')}
        className="w-full mt-6 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition"
      >
        설정으로 돌아가기
      </button>
    </div>
  )
}
