import { useState } from 'react';
import { testAPI } from '@/services/api';

export const APITestPage = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [detailedResults, setDetailedResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    setDetailedResults(null);
    setError(null);
    
    try {
      // 콘솔에도 로그를 남기면서 화면에도 표시
      console.log("API 테스트 시작...");
      setTestResults(prev => [...prev, "API 테스트 시작..."]);

      // API 테스트 실행
      const results = await testAPI();

      // 결과 표시
      console.log("API 테스트 완료!");
      setTestResults(prev => [...prev, "API 테스트 완료!"]);
      setDetailedResults(results);
    } catch (error) {
      // 에러 처리
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("테스트 실패:", errorMessage);
      setTestResults(prev => [...prev, `테스트 실패: ${errorMessage}`]);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">API 테스트</h1>
        <button 
          onClick={runTests}
          disabled={isLoading}
          className={`px-4 py-2 rounded ${
            isLoading 
              ? 'bg-gray-400' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isLoading ? '테스트 중...' : '테스트 실행'}
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">테스트 항목:</h2>
        <ul className="list-disc pl-5 mb-4">
          <li>사용자 생성 API</li>
          <li>랭킹 조회 API</li>
        </ul>
      </div>

      {testResults.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">테스트 결과:</h2>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`my-1 ${
                  result.includes('실패') 
                    ? 'text-red-400' 
                    : 'text-green-400'
                }`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>오류:</strong> {error}
        </div>
      )}

      {detailedResults && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">상세 결과:</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">생성된 사용자:</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(detailedResults.userCreation, null, 2)}
            </pre>
            <h3 className="font-semibold mt-4 mb-2">랭킹 목록:</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(detailedResults.rankings, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};