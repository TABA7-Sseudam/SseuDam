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
        // Admin context with custom claims
        const admin = testEnv.authenticatedContext('admin', {
          role: 'admin',
          admin: true
        });
  
        // Regular user context
        const userId = 'bob';
        const user = testEnv.authenticatedContext(userId);
  
        // Admin creates the test data
        const userRef = doc(admin.firestore(), 'users', userId);
        await setDoc(userRef, {
          name: 'Bob',
          email: 'bob@example.com'
        });
  
        // User tries to read their own data
        const snapshot = await getDoc(doc(user.firestore(), 'users', userId));
        expect(snapshot.exists()).toBeTruthy();
      });
  
      it('should allow admins to read any user data', async () => {
        // Create admin context with proper claims
        const admin = testEnv.authenticatedContext('admin', {
          role: 'admin',
          admin: true
        });
  
        // Create test user data
        const userId = 'charlie';
        const userRef = doc(admin.firestore(), 'users', userId);
        await setDoc(userRef, {
          name: 'Charlie',
          email: 'charlie@example.com'
        });
  
        // Admin tries to read the data
        const snapshot = await getDoc(userRef);
        expect(snapshot.exists()).toBeTruthy();
      });
    });
  
    describe('Activity Logs', () => {
      it('should allow admins to read activity logs', async () => {
        // Create admin context with proper claims
        const admin = testEnv.authenticatedContext('admin', {
          role: 'admin',
          admin: true
        });
  
        const userId = 'gary';
        
        // Create test user
        await setDoc(doc(admin.firestore(), 'users', userId), {
          name: 'Gary',
          email: 'gary@example.com'
        });
  
        // Create test log
        const logRef = doc(admin.firestore(), `users/${userId}/user_activity_logs/log1`);
        await setDoc(logRef, {
          action: 'test_action',
          timestamp: new Date().toISOString()
        });
  
        // Admin tries to read the log
        const snapshot = await getDoc(logRef);
        expect(snapshot.exists()).toBeTruthy();
      });
    });
  });