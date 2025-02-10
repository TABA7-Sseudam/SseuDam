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
          host: 'localhost',
          port: 8080,
          rules: fs.readFileSync('firestore.rules', 'utf8'),
        }
      });
    });
  
    afterAll(async () => {
      if (testEnv) {
        await testEnv.cleanup();
      }
    });
  
    beforeEach(async () => {
      if (testEnv) {
        await testEnv.clearFirestore();
      }
    });
  
    describe('Users Collection', () => {
      it('should not allow users to create their own documents', async () => {
        const alice = testEnv.authenticatedContext('alice');
        const userDoc = doc(alice.firestore(), 'users/alice');
        
        await expect(setDoc(userDoc, { 
          name: 'Alice',
          email: 'alice@example.com' 
        })).rejects.toThrow();
      });
  
      it('should allow users to read their own data', async () => {
        const userId = 'bob';
        const admin = testEnv.authenticatedContext('admin', {
          role: 'admin',
          admin: true
        });
        const user = testEnv.authenticatedContext(userId);
  
        // Admin creates test data
        const adminDb = admin.firestore();
        await setDoc(doc(adminDb, 'users', userId), {
          name: 'Bob',
          email: 'bob@example.com'
        });
  
        // User reads their own data
        const userDb = user.firestore();
        const snapshot = await getDoc(doc(userDb, 'users', userId));
        expect(snapshot.exists()).toBeTruthy();
      });
  
      it('should allow admins to read any user data', async () => {
        const userId = 'charlie';
        const admin = testEnv.authenticatedContext('admin', {
          role: 'admin',
          admin: true
        });
  
        const adminDb = admin.firestore();
        await setDoc(doc(adminDb, 'users', userId), {
          name: 'Charlie',
          email: 'charlie@example.com'
        });
  
        const snapshot = await getDoc(doc(adminDb, 'users', userId));
        expect(snapshot.exists()).toBeTruthy();
      });
    });
  
    describe('Activity Logs', () => {
      it('should allow admins to read activity logs', async () => {
        const admin = testEnv.authenticatedContext('admin', {
          role: 'admin',
          admin: true
        });
        const userId = 'gary';
        const adminDb = admin.firestore();
  
        // Create test user first
        await setDoc(doc(adminDb, 'users', userId), {
          name: 'Gary',
          email: 'gary@example.com'
        });
  
        // Create test log
        const logPath = `users/${userId}/user_activity_logs/log1`;
        await setDoc(doc(adminDb, logPath), {
          action: 'test_action',
          timestamp: new Date().toISOString()
        });
  
        // Admin reads the log
        const snapshot = await getDoc(doc(adminDb, logPath));
        expect(snapshot.exists()).toBeTruthy();
      });
    });
  });