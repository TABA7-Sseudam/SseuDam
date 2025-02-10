// src/tests/rules.test.ts
import {
    initializeTestEnvironment,
    RulesTestEnvironment,
  } from '@firebase/rules-unit-testing';
  import { doc, getDoc, setDoc } from 'firebase/firestore';
  import * as fs from 'fs';
  
  let testEnv: RulesTestEnvironment;
  
  describe('Firestore Security Rules', () => {
    beforeAll(async () => {
      testEnv = await initializeTestEnvironment({
        projectId: 'recyling-3225a',
        firestore: {
          rules: fs.readFileSync('firestore.rules', 'utf8'),
        }
      });
    });
  
    afterAll(async () => {
      await testEnv.cleanup();
    });
  
    beforeEach(async () => {
      await testEnv.clearFirestore();
    });
  
    // Users Collection Tests
    describe('Users Collection', () => {
      it('should allow users to read their own data', async () => {
        const userId = 'user123';
        const context = testEnv.authenticatedContext(userId);
        
        // 테스트 데이터 생성
        const adminContext = testEnv.authenticatedContext('admin', { role: 'admin' });
        await setDoc(doc(adminContext.firestore(), 'users', userId), {
          name: 'Test User',
          email: 'test@example.com'
        });
  
        // 사용자가 자신의 데이터 읽기
        const userDoc = doc(context.firestore(), 'users', userId);
        const snapshot = await getDoc(userDoc);
        expect(snapshot.exists()).toBeTruthy();
      });
  
      it('should allow admins to read any user data', async () => {
        const userId = 'user123';
        const adminContext = testEnv.authenticatedContext('admin', { role: 'admin' });
        
        // 테스트 데이터 생성
        await setDoc(doc(adminContext.firestore(), 'users', userId), {
          name: 'Test User',
          email: 'test@example.com'
        });
  
        // 관리자가 사용자 데이터 읽기
        const userDoc = doc(adminContext.firestore(), 'users', userId);
        const snapshot = await getDoc(userDoc);
        expect(snapshot.exists()).toBeTruthy();
      });
    });
  
    // Activity Logs Tests
    describe('Activity Logs', () => {
      it('should allow admins to read activity logs', async () => {
        const userId = 'user123';
        const adminContext = testEnv.authenticatedContext('admin', { role: 'admin' });
        
        // 테스트 로그 생성
        await setDoc(
          doc(adminContext.firestore(), `users/${userId}/user_activity_logs/log1`),
          {
            action: 'login',
            timestamp: new Date()
          }
        );
  
        // 관리자가 로그 읽기
        const logDoc = doc(
          adminContext.firestore(),
          `users/${userId}/user_activity_logs/log1`
        );
        const snapshot = await getDoc(logDoc);
        expect(snapshot.exists()).toBeTruthy();
      });
    });
  });