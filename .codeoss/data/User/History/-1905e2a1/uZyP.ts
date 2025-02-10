// src/tests/rules.test.ts의 일부 테스트 케이스 수정

// Password Resets 테스트 수정
describe('Password Resets', () => {
    it('should allow creation of password reset requests', async () => {
      const user = testEnv.authenticatedContext('frank');
      const resetDoc = doc(
        user.firestore(), 
        'users/frank/password_resets/reset1'
      );
      
      await expect(setDoc(resetDoc, {
        requestedAt: new Date().toISOString(),
        completed: false
      })).resolves.not.toThrow();
    });
  });
  
  // Rank Accounts 테스트 수정
  describe('Rank Accounts', () => {
    it('should allow public reading of rank accounts', async () => {
      // 먼저 admin이 데이터 생성
      const admin = testEnv.authenticatedContext('admin', { role: 'admin' });
      const adminDb = admin.firestore();
      const rankPath = 'users/james/rank_accounts/rank1';
      
      await setDoc(doc(adminDb, rankPath), {
        score: 100,
        rank: 1,
        updatedAt: new Date().toISOString()
      });
  
      // 비인증 사용자가 읽기 시도
      const publicUser = testEnv.unauthenticatedContext();
      const publicDb = publicUser.firestore();
      const snapshot = await getDoc(doc(publicDb, rankPath));
      expect(snapshot.exists()).toBeTruthy();
    });
  });
  
  // Analysis Result Data 테스트 수정
  describe('Analysis Result Data', () => {
    it('should allow users to read their own analysis results', async () => {
      const userId = 'kevin';
      const admin = testEnv.authenticatedContext('admin', { role: 'admin' });
      const adminDb = admin.firestore();
      
      // Admin creates test data
      await setDoc(doc(adminDb, 'users', userId), {
        name: 'Kevin',
        email: 'kevin@example.com'
      });
  
      const resultPath = `users/${userId}/AnalyisResult_data/result1`;
      await setDoc(doc(adminDb, resultPath), {
        score: 85,
        analysis: 'Test Analysis',
        createdAt: new Date().toISOString()
      });
  
      // User reads their result
      const user = testEnv.authenticatedContext(userId);
      const userDb = user.firestore();
      const snapshot = await getDoc(doc(userDb, resultPath));
      expect(snapshot.exists()).toBeTruthy();
    });
  });