# ♻️ My Firebase Project - Recycling Project

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://example.com)
[![Coverage Status](https://img.shields.io/badge/coverage-85%25-green.svg)](https://example.com)

## 🚀 프로젝트 소개

본 프로젝트는 Firebase를 활용한 재활용(Recycling) 애플리케이션 개발을 위한 백엔드 및 관리 시스템입니다. 사용자 인증, 데이터 관리, 보안 규칙, 테스트 등 Firebase의 다양한 기능을 활용하여 구축되었습니다.

## 🧱 기술 스택

*   **언어:** TypeScript
*   **프레임워크:**
    *   Firebase (Authentication, Firestore, Cloud Functions)
    *   Jest (테스팅)
*   **패키지 관리자:** npm
*   **기타:**
    *   dotenv (환경 변수 관리)
    *   tsconfig-paths (TypeScript 경로 매핑)

## ⚙️ 주요 기능

*   **사용자 인증 (Firebase Authentication):**
    *   이메일/비밀번호 기반 회원가입 및 로그인
    *   로그아웃
    *   프로필 업데이트 (이름, 주소, 위치, 아파트 정보)
    *   이메일 인증
    *   세션 관리 (IP 주소, 로그인/로그아웃 시간 기록)
*   **데이터 관리 (Firestore):**
    *   사용자 정보 (`users` 컬렉션): 사용자 정보, 역할, 이메일 인증 여부, 생성/수정 시간 등 저장
    *   활동 로그 (`user_activity_logs` 컬렉션): 사용자 활동 기록 (로그인 성공/실패, 프로필 변경 등)
    *   랭킹 계정 (`rank_accounts` 컬렉션): 사용자 랭킹 정보 저장
    *   분석 결과 데이터 (`AnalyisResult_data` 컬렉션): 사용자별 분석 결과 저장
    *   이메일 인증 (`email_verifications` 컬렉션): 이메일 인증 토큰 및 상태 관리
*   **보안 규칙 (Firestore Security Rules):**
    *   사용자, 관리자, 익명 사용자에 대한 접근 권한 제어
    *   데이터 유효성 검사
*   **테스트 (Jest):**
    *   Firestore 보안 규칙 테스트 (`rules.test.ts`)
    *   인증 및 데이터베이스 서비스 테스트 (별도 파일 예정)

## 📂 프로젝트 구조
├── .firebase/               # Firebase 캐시
├── .firebaserc             # Firebase 프로젝트 별칭 설정
├── .gitignore              # Git에서 제외할 파일/디렉터리 목록
├── firestore.indexes.json  # Firestore 인덱스 설정
├── firestore.rules         # Firestore 보안 규칙
├── firebase.json           # Firebase 프로젝트 설정
├── jest.config.js          # Jest 설정 파일
├── package.json            # 프로젝트 설정 파일 (Node.js)
├── src
│   ├── lib
│   │   └── firebase
│   │       ├── auth.ts     # Firebase Authentication 서비스
│   │       ├── db.ts       # Firestore 데이터베이스 서비스
│   │       └── firebase.ts # Firebase 초기화 및 설정, 환경 변수 로딩, dotenv 설정
│   └── tests
│       └── rules.test.ts    # Firestore 보안 규칙 테스트
└── tsconfig.json            # TypeScript 설정 파일

## 💻 개발 환경 설정 및 실행 방법

1.  **필수 도구 설치:**
    *   Node.js (v14 이상 권장)
    *   npm (Node.js 패키지 매니저)
    *   Firebase CLI

2.  **프로젝트 클론:**

    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

3.  **의존성 설치:**

    ```bash
    npm install
    ```

4.  **Firebase 프로젝트 설정:**
    *   Firebase 콘솔에서 새 프로젝트 생성
    *   프로젝트 설정에서 웹 앱 추가 및 구성 정보 복사
    *   `.env` 파일 생성 후 다음 환경 변수 설정 (Firebase 구성 정보):

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
    ```
    *  **중요**: `.env` 파일은 보안을 위해 `.gitignore`에 추가되어 버전 관리에 포함되지 않도록 해야 합니다.

5. **Firebase 에뮬레이터 실행**
   ```bash
   npm run emulator

테스트 실행:
전체 테스트: npm test
보안 규칙 테스트: npm run test:rules

배포 (Firebase 호스팅, 함수 등): firebase deploy 명령어를 사용하여 배포 (자세한 내용은 Firebase 문서 참조).

🧪 테스트
Firestore 보안 규칙 테스트: rules.test.ts 파일을 통해 에뮬레이터 환경에서 보안 규칙을 검증합니다.
인증 및 데이터베이스 서비스 테스트: 별도의 테스트 파일을 작성하여 각 함수의 동작을 검증할 예정입니다.
🤝 기여
프로젝트에 대한 기여는 언제나 환영합니다. 버그 제보, 기능 제안, 코드 개선 등 다양한 방식으로 기여할 수 있습니다. Pull Request를 통해 기여해주세요.

📝 라이선스
MIT License (별도 라이선스 파일 추가 필요)

📝 TODO
getIPAddress 헬퍼 함수 구현 (IP 주소 가져오기)
rank_accounts 관련 로직을 별도의 서비스 파일로 분리
인증 및 데이터베이스 서비스 테스트 코드 작성.
logUserActivity 함수 리팩토링 (파라미터를 객체 형태로 받도록 변경).
Cloud Functions를 이용한 서버 로직 추가 (예: 사용자 분석, 알림 등)
프론트엔드 애플리케이션 개발 (React, Next.js 등)
<!-- end list -->

**변경 사항**
*   `src/lib/firebase/firebase.ts` 파일에 dotenv 설정을 추가한 것을 반영했습니다. 환경 변수 로딩 및 Firebase 설정 정보 확인 로직이 포함되었음을 명시했습니다.
*   `.env` 파일 관리에 대한 중요성을 강조했습니다. (보안)
*   프로젝트 구조에서 `firebase.ts` 파일에 dotenv 설정이 추가되었음을 표기했습니다.
