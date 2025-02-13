import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const Administrator: React.FC = () => {
  // 상태 관리
  const [apartmentName, setApartmentName] = useState('')
  const [buildings, setBuildings] = useState<string[]>([])
  const [collectionPoints, setCollectionPoints] = useState<string[]>([])
  const [assignments, setAssignments] = useState<{ [key: string]: string[] }>({})
  const [errorMessage, setErrorMessage] = useState('') // 에러 메시지 상태 추가
  const [successMessage, setSuccessMessage] = useState('') // 성공 메시지 상태 추가

  const navigate = useNavigate()

  // 기존 데이터 불러오기 (로컬 스토리지)
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('allApartments') || '[]')
    if (savedData.length > 0) {
      console.log('기존 저장된 데이터:', savedData)
    }
  }, [])

  // 데이터 저장 및 현황 페이지로 이동
  const handleFinish = () => {
    if (!apartmentName || buildings.length === 0 || collectionPoints.length === 0 || Object.keys(assignments).length === 0) {
      setErrorMessage('모든 필드를 채워주세요.')
      setSuccessMessage('')
      return
    }

    const data = {
      apartmentName,
      buildings,
      collectionPoints,
      assignments
    }

    // 기존 데이터와 병합하여 저장
    const existingData = JSON.parse(localStorage.getItem('allApartments') || '[]')
    const updatedData = [...existingData, data]
    localStorage.setItem('allApartments', JSON.stringify(updatedData))

    setErrorMessage('')
    setSuccessMessage('데이터가 성공적으로 저장되었습니다!')
    
    // 1초 후 현황 페이지로 이동
    setTimeout(() => navigate('/admin/status', { state: data }), 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-8">
        아파트 분리수거 관리자 페이지
      </h1>

      {/* 에러 및 성공 메시지 표시 */}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ApartmentForm apartmentName={apartmentName} setApartmentName={setApartmentName} />
        <BuildingForm buildings={buildings} setBuildings={setBuildings} />
        <CollectionPointForm collectionPoints={collectionPoints} setCollectionPoints={setCollectionPoints} />
        <AssignmentForm
          apartmentName={apartmentName}
          buildings={buildings}
          collectionPoints={collectionPoints}
          assignments={assignments}
          setAssignments={setAssignments}
        />
      </div>

      <button
        onClick={handleFinish}
        className="w-full mt-8 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
      >
        저장 및 현황 보기
      </button>
    </div>
  )
}

// ✅ 1. 아파트 이름 입력 폼 (중복 방지 및 입력 필드 개선)
const ApartmentForm: React.FC<{ apartmentName: string; setApartmentName: (name: string) => void }> = ({ apartmentName, setApartmentName }) => {
  const [inputValue, setInputValue] = useState('')

  const handleAddApartment = () => {
    if (inputValue.trim() === '') {
      alert('아파트 이름을 입력하세요.')
      return
    }
    if (apartmentName) {
      alert('아파트 이름은 하나만 입력할 수 있습니다.')
      return
    }
    setApartmentName(inputValue)
    setInputValue('')
  }

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">1. 아파트 이름 입력</h2>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="아파트 이름을 입력하세요"
        className="border p-2 w-full rounded-lg mb-4"
        disabled={!!apartmentName}
      />

      <button
        onClick={handleAddApartment}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        disabled={!!apartmentName}
      >
        아파트 추가
      </button>

      {apartmentName && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-lg flex justify-between items-center">
          추가된 아파트: <strong>{apartmentName}</strong>
          <button
            onClick={() => setApartmentName('')}
            className="text-red-500 hover:text-red-700 ml-4"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  )
}

// ✅ 2. 아파트 동 입력 폼 (삭제 기능 추가)
const BuildingForm: React.FC<{ buildings: string[]; setBuildings: (buildings: string[]) => void }> = ({ buildings, setBuildings }) => {
  const [newBuilding, setNewBuilding] = useState('')

  const addBuilding = () => {
    if (newBuilding.trim() === '') {
      alert('동 번호를 입력하세요.')
      return
    }
    if (!buildings.includes(newBuilding)) {
      setBuildings([...buildings, newBuilding])
      setNewBuilding('')
    } else {
      alert('이미 추가된 동입니다.')
    }
  }

  const removeBuilding = (building: string) => {
    setBuildings(buildings.filter(b => b !== building))
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
      <button onClick={addBuilding} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
        동 추가
      </button>

      <div className="mt-4">
        {buildings.map((building, index) => (
          <div key={index} className="p-2 bg-gray-200 rounded-lg mb-2 flex justify-between items-center">
            {building}
            <button
              onClick={() => removeBuilding(building)}
              className="text-red-500 hover:text-red-700 transition"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ✅ 3. 수거장 구역 입력 폼 (삭제 기능 추가)
const CollectionPointForm: React.FC<{ collectionPoints: string[]; setCollectionPoints: (points: string[]) => void }> = ({ collectionPoints, setCollectionPoints }) => {
  const [newPoint, setNewPoint] = useState('')

  const addCollectionPoint = () => {
    if (newPoint.trim() === '') {
      alert('수거장 이름을 입력하세요.')
      return
    }
    if (!collectionPoints.includes(newPoint)) {
      setCollectionPoints([...collectionPoints, newPoint])
      setNewPoint('')
    } else {
      alert('이미 추가된 수거장입니다.')
    }
  }

  const removeCollectionPoint = (point: string) => {
    setCollectionPoints(collectionPoints.filter(p => p !== point))
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
      <button onClick={addCollectionPoint} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
        수거장 추가
      </button>

      <div className="mt-4">
        {collectionPoints.map((point, index) => (
          <div key={index} className="p-2 bg-gray-200 rounded-lg mb-2 flex justify-between items-center">
            {point}
            <button
              onClick={() => removeCollectionPoint(point)}
              className="text-red-500 hover:text-red-700 transition"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ✅ 4. 동별 수거장 할당 폼
const AssignmentForm: React.FC<{ 
  apartmentName: string
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
              {apartmentName} - {building}
            </label>
          ))}
        </div>
      ))}
    </div>
  )
}
