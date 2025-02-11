import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Administrator: React.FC = () => {
  // 상태 관리
  const [apartmentName, setApartmentName] = useState('')
  const [buildings, setBuildings] = useState<string[]>([])
  const [collectionPoints, setCollectionPoints] = useState<string[]>([])
  const [assignments, setAssignments] = useState<{ [key: string]: string[] }>({})

  const navigate = useNavigate()

  // 데이터 저장 및 현황 페이지로 이동
  const handleFinish = () => {
    if (!apartmentName || buildings.length === 0 || collectionPoints.length === 0 || Object.keys(assignments).length === 0) {
      alert('모든 필드를 채워주세요.')
      return
    }

    // 데이터 저장 (로컬 스토리지 또는 상태 전달)
    const data = {
      apartmentName,
      buildings,
      collectionPoints,
      assignments
    }

    localStorage.setItem('apartmentData', JSON.stringify(data))  // 로컬 스토리지 저장
    navigate('/admin/status', { state: data })  // 현황 페이지로 이동
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-8">아파트 분리수거 관리자 페이지</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 아파트 이름 입력 */}
        <ApartmentForm apartmentName={apartmentName} setApartmentName={setApartmentName} />

        {/* 아파트 동 입력 */}
        <BuildingForm buildings={buildings} setBuildings={setBuildings} />

        {/* 수거장 구역 입력 */}
        <CollectionPointForm collectionPoints={collectionPoints} setCollectionPoints={setCollectionPoints} />

        {/* 동별 수거장 할당 */}
        <AssignmentForm 
          apartmentName={apartmentName}  // ✅ 아파트 이름 전달
          buildings={buildings} 
          collectionPoints={collectionPoints} 
          assignments={assignments} 
          setAssignments={setAssignments} 
        />
      </div>

      {/* 저장 및 현황 보기 버튼 */}
      <button
        onClick={handleFinish}
        className="w-full mt-8 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
      >
        저장 및 현황 보기
      </button>
    </div>
  )
}

// ✅ 1. 아파트 이름 입력 폼 (버튼 추가!)
const ApartmentForm: React.FC<{ apartmentName: string; setApartmentName: (name: string) => void }> = ({ apartmentName, setApartmentName }) => {
  const [inputValue, setInputValue] = useState('')  // 입력 필드 상태 관리

  // 아파트 이름 추가 함수
  const handleAddApartment = () => {
    if (inputValue.trim() === '') {
      alert('아파트 이름을 입력하세요.')
      return
    }
    setApartmentName(inputValue)  // 상태에 아파트 이름 저장
    setInputValue('')             // 입력 필드 초기화
  }

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">1. 아파트 이름 입력</h2>
      
      {/* 입력 필드 */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="아파트 이름을 입력하세요"
        className="border p-2 w-full rounded-lg mb-4"
      />

      {/* ✅ 추가 버튼 */}
      <button
        onClick={handleAddApartment}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        아파트 추가
      </button>

      {/* ✅ 추가된 아파트 이름 표시 */}
      {apartmentName && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-lg">
          추가된 아파트: <strong>{apartmentName}</strong>
        </div>
      )}
    </div>
  )
}

// ✅ 2. 아파트 동 입력 폼
const BuildingForm: React.FC<{ buildings: string[]; setBuildings: (buildings: string[]) => void }> = ({ buildings, setBuildings }) => {
  const [newBuilding, setNewBuilding] = useState('')

  const addBuilding = () => {
    if (newBuilding && !buildings.includes(newBuilding)) {
      setBuildings([...buildings, newBuilding])
      setNewBuilding('')
    }
  }

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">2. 아파트 동 입력</h2>
      <input
        type="text"
        value={newBuilding}
        onChange={(e) => setNewBuilding(e.target.value)}
        placeholder="동 번호 입력 (예: 101동)"
        className="border p-2 w-full rounded-lg mb-4"
      />
      <button onClick={addBuilding} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">동 추가</button>

      <div className="mt-4">
        {buildings.map((building, index) => (
          <div key={index} className="p-2 bg-gray-200 rounded-lg mb-2">{building}</div>
        ))}
      </div>
    </div>
  )
}

// ✅ 3. 수거장 구역 입력 폼
const CollectionPointForm: React.FC<{ collectionPoints: string[]; setCollectionPoints: (points: string[]) => void }> = ({ collectionPoints, setCollectionPoints }) => {
  const [newPoint, setNewPoint] = useState('')

  const addCollectionPoint = () => {
    if (newPoint && !collectionPoints.includes(newPoint)) {
      setCollectionPoints([...collectionPoints, newPoint])
      setNewPoint('')
    }
  }

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">3. 수거장 구역 입력</h2>
      <input
        type="text"
        value={newPoint}
        onChange={(e) => setNewPoint(e.target.value)}
        placeholder="수거장 이름 입력 (예: A구역)"
        className="border p-2 w-full rounded-lg mb-4"
      />
      <button onClick={addCollectionPoint} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">수거장 추가</button>

      <div className="mt-4">
        {collectionPoints.map((point, index) => (
          <div key={index} className="p-2 bg-gray-200 rounded-lg mb-2">{point}</div>
        ))}
      </div>
    </div>
  )
}

// ✅ 4. 동별 수거장 할당 폼 (아파트 이름 추가)
const AssignmentForm: React.FC<{ 
  apartmentName: string              // ✅ 아파트 이름 받기
  buildings: string[]
  collectionPoints: string[]
  assignments: { [key: string]: string[] }
  setAssignments: (assignments: { [key: string]: string[] }) => void 
}> = ({ apartmentName, buildings, collectionPoints, assignments, setAssignments }) => {
  
  const toggleAssignment = (building: string, point: string) => {
    const updatedAssignments = { ...assignments }
    if (updatedAssignments[point]?.includes(building)) {
      updatedAssignments[point] = updatedAssignments[point].filter(b => b !== building)
    } else {
      updatedAssignments[point] = [...(updatedAssignments[point] || []), building]
    }
    setAssignments(updatedAssignments)
  }

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">4. 동별 수거장 연결</h2>
      {collectionPoints.length === 0 && <p className="text-red-500">먼저 수거장을 추가하세요.</p>}

      {collectionPoints.map((point, idx) => (
        <div key={idx} className="mb-4">
          {/* ✅ 아파트 이름과 수거장 이름 표시 */}
          <h3 className="font-semibold text-lg text-green-600">
            {apartmentName} - {point}
          </h3>

          {buildings.map((building, bIdx) => (
            <label key={bIdx} className="block mt-2">
              <input
                type="checkbox"
                checked={assignments[point]?.includes(building) || false}
                onChange={() => toggleAssignment(building, point)}
                className="mr-2"
              />
              {/* ✅ 아파트 이름 + 동 표시 */}
              {apartmentName} - {building}
            </label>
          ))}
        </div>
      ))}
    </div>
  )
}
