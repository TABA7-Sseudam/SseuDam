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
        const admin = testEnv.authenticatedContext('admin', { role: 'admin' });
        const user = testEnv.authenticatedContext(userId);
  
        // Admin creates user data
        await setDoc(doc(admin.firestore(), 'users', userId), {
          name: 'Bob',
          email: 'bob@example.com'
        });
  
        // User reads their own data
        const userDoc = doc(user.firestore(), 'users', userId);
        const snapshot = await getDoc(userDoc);
        expect(snapshot.exists()).toBeTruthy();
      });
  
      it('should allow admins to read any user data', async () => {
        const userId = 'charlie';
        const admin = testEnv.authenticatedContext('admin', { role: 'admin' });
  
        // Admin creates and reads user data
        await setDoc(doc(admin.firestore(), 'users', userId), {
          name: 'Charlie',
          email: 'charlie@example.com'
        });
  
        const userDoc = doc(admin.firestore(), 'users', userId);
        const snapshot = await getDoc(userDoc);
        expect(snapshot.exists()).toBeTruthy();
      });
    });
  
    describe('Activity Logs', () => {
      it('should allow admins to read activity logs', async () => {
        const userId = 'gary';
        const admin = testEnv.authenticatedContext('admin', { role: 'admin' });
        
        // Create user document first
        await setDoc(doc(admin.firestore(), 'users', userId), {
          name: 'Gary',
          email: 'gary@example.com'
        });
  
        // Create and read log
        const logDoc = doc(admin.firestore(), `users/${userId}/user_activity_logs/log1`);
        await setDoc(logDoc, {
          action: 'login',
          timestamp: new Date()
        });
  
        const snapshot = await getDoc(logDoc);
        expect(snapshot.exists()).toBeTruthy();
      });
    });
  });