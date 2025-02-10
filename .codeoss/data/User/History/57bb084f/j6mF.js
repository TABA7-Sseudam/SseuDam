// jest.config.js
module.exports = {
    preset: 'ts-jest',          // ts-jest preset을 사용
    testEnvironment: 'node',    // node 환경에서 실행
    testMatch: ['**/tests/**/*.test.ts'],  // .test.ts 파일을 찾음
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',  // @ 경로 매핑 (tsconfig.json의 paths 설정과 일치)
    },
  };