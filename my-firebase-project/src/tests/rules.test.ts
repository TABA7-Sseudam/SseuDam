// src/tests/rules.test.ts
import {
    initializeTestEnvironment,
    RulesTestEnvironment,
    RulesTestContext
  } from '@firebase/rules-unit-testing';
  import {
    doc,
    getDoc,
    setDoc,
    Firestore
  } from 'firebase/firestore';
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
  
    // Users Collection Tests
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
  
        await setDoc(doc(admin.firestore(), 'users', userId), {
          name: 'Bob',
          email: 'bob@example.com'
        });
  
        const snapshot = await getDoc(doc(user.firestore(), 'users', userId));
        expect(snapshot.exists()).toBeTruthy();
      });
  
      it('should allow admins to read any user data', async () => {
        const admin = testEnv.authenticatedContext('admin', { role: 'admin' });
        const userDoc = doc(admin.firestore(), 'users/charlie');
        
        await setDoc(userDoc, {
          name: 'Charlie',
          email: 'charlie@example.com'
        });
  
        const snapshot = await getDoc(userDoc);
        expect(snapshot.exists()).toBeTruthy();
      });
    });
  
    // User Sessions Tests
    describe('User Sessions', () => {
      it('should allow users to manage their own sessions', async () => {
        const userId = 'david';
        const user = testEnv.authenticatedContext(userId);
        const sessionDoc = doc(user.firestore(), `users/${userId}/user_sessions/session1`);
        
        await setDoc(sessionDoc, {
          lastAccess: new Date().toISOString(),
          device: 'Chrome'
        });
  
        const snapshot = await getDoc(sessionDoc);
        expect(snapshot.exists()).toBeTruthy();
      });
  
      it('should not allow users to access other users sessions', async () => {
        const userId = 'david';
        const otherUser = testEnv.authenticatedContext('eve');
        const sessionDoc = doc(otherUser.firestore(), `users/${userId}/user_sessions/session1`);
        
        await expect(getDoc(sessionDoc)).rejects.toThrow();
      });
    });
  
    // Password Resets Tests
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
  
      it('should not allow reading password reset data', async () => {
        const user = testEnv.authenticatedContext('frank');
        const resetDoc = doc(
          user.firestore(), 
          'users/frank/password_resets/reset1'
        );
        
        await expect(getDoc(resetDoc)).rejects.toThrow();
      });
    });
  
    // Activity Logs Tests
    describe('Activity Logs', () => {
      it('should not allow users to create or modify logs', async () => {
        const user = testEnv.authenticatedContext('gary');
        const logDoc = doc(
          user.firestore(), 
          'users/gary/user_activity_logs/log1'
        );
        
        await expect(setDoc(logDoc, {
          action: 'login',
          timestamp: new Date().toISOString()
        })).rejects.toThrow();
      });
  
      it('should allow admins to read logs', async () => {
        const admin = testEnv.authenticatedContext('admin', { role: 'admin' });
        const userId = 'gary';
        const adminDb = admin.firestore();
        
        await setDoc(doc(adminDb, 'users', userId), {
          name: 'Gary',
          email: 'gary@example.com'
        });
  
        const logPath = `users/${userId}/user_activity_logs/log1`;
        await setDoc(doc(adminDb, logPath), {
          action: 'profile_update',
          timestamp: new Date().toISOString()
        });
  
        const snapshot = await getDoc(doc(adminDb, logPath));
        expect(snapshot.exists()).toBeTruthy();
      });
    });
  
    // Email Verifications Tests
    describe('Email Verifications', () => {
      it('should allow creation of email verification', async () => {
        const user = testEnv.authenticatedContext('henry');
        const verificationDoc = doc(
          user.firestore(), 
          'users/henry/email_verifications/verification1'
        );
        
        await expect(setDoc(verificationDoc, {
          email: 'henry@example.com',
          verified: false,
          createdAt: new Date().toISOString()
        })).resolves.not.toThrow();
      });
  
      it('should not allow users to view others verification status', async () => {
        const otherUser = testEnv.authenticatedContext('ian');
        const verificationDoc = doc(
          otherUser.firestore(), 
          'users/henry/email_verifications/verification1'
        );
        
        await expect(getDoc(verificationDoc)).rejects.toThrow();
      });
    });
  
    // Rank Accounts Tests
    describe('Rank Accounts', () => {
      it('should allow public reading of rank accounts', async () => {
        // Admin creates test data
        const admin = testEnv.authenticatedContext('admin', { role: 'admin' });
        const adminDb = admin.firestore();
        const rankPath = 'users/james/rank_accounts/rank1';
        
        await setDoc(doc(adminDb, rankPath), {
          score: 100,
          rank: 1,
          updatedAt: new Date().toISOString()
        });
  
        // Public user reads data
        const publicUser = testEnv.unauthenticatedContext();
        const publicDb = publicUser.firestore();
        const snapshot = await getDoc(doc(publicDb, rankPath));
        expect(snapshot.exists()).toBeTruthy();
      });
  
      it('should not allow public users to modify rank accounts', async () => {
        const publicUser = testEnv.unauthenticatedContext();
        const rankDoc = doc(
          publicUser.firestore(), 
          'users/james/rank_accounts/rank1'
        );
        
        await expect(setDoc(rankDoc, {
          score: 999,
          rank: 1
        })).rejects.toThrow();
      });
    });
  
    // Analysis Result Data Tests
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
  
      it('should not allow users to create or modify analysis results', async () => {
        const user = testEnv.authenticatedContext('kevin');
        const resultDoc = doc(
          user.firestore(), 
          'users/kevin/AnalyisResult_data/result1'
        );
        
        await expect(setDoc(resultDoc, {
          score: 100,
          analysis: 'Modified Analysis'
        })).rejects.toThrow();
      });
    });
  });