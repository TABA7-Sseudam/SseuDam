// src/tests/rules.test.ts
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import * as fs from 'fs';

// Firebase Emulator 설정
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

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
    it('should not allow users to create their own documents', async () => {
      const alice = testEnv.authenticatedContext('alice');
      const userDoc = doc(alice.firestore(), 'users/alice');
      
      await expect(setDoc(userDoc, { 
        name: 'Alice',
        email: 'alice@example.com' 
      })).rejects.toThrow();
    });

    it('should allow users to read their own data', async () => {
      const bob = testEnv.authenticatedContext('bob');
      const userDoc = doc(bob.firestore(), 'users/bob');
      
      // Admin creates the document
      const admin = testEnv.authenticatedContext('admin', { role: 'admin' });
      await setDoc(doc(admin.firestore(), 'users/bob'), {
        name: 'Bob',
        email: 'bob@example.com'
      });

      // User tries to read their own data
      const snapshot = await getDoc(userDoc);
      expect(snapshot.exists()).toBe(true);
    });

    it('should allow admins to read any user data', async () => {
      const admin = testEnv.authenticatedContext('admin', { role: 'admin' });
      const userDoc = doc(admin.firestore(), 'users/charlie');
      
      await setDoc(userDoc, {
        name: 'Charlie',
        email: 'charlie@example.com'
      });

      const snapshot = await getDoc(userDoc);
      expect(snapshot.exists()).toBe(true);
    });
  });

  // User Sessions Tests
  describe('User Sessions', () => {
    it('should allow users to manage their own sessions', async () => {
      const david = testEnv.authenticatedContext('david');
      const sessionDoc = doc(david.firestore(), 'users/david/user_sessions/session1');
      
      await setDoc(sessionDoc, {
        lastAccess: new Date(),
        device: 'Chrome'
      });

      const snapshot = await getDoc(sessionDoc);
      expect(snapshot.exists()).toBe(true);
    });
  });

  // Email Verifications Tests
  describe('Email Verifications', () => {
    it('should allow creation of email verification', async () => {
      const eve = testEnv.authenticatedContext('eve');
      const verificationDoc = doc(
        eve.firestore(), 
        'users/eve/email_verifications/verification1'
      );
      
      await expect(setDoc(verificationDoc, {
        email: 'eve@example.com',
        verified: false,
        createdAt: new Date()
      })).resolves.not.toThrow();
    });
  });

  // Activity Logs Tests
  describe('Activity Logs', () => {
    it('should not allow users to create activity logs', async () => {
      const frank = testEnv.authenticatedContext('frank');
      const logDoc = doc(
        frank.firestore(), 
        'users/frank/user_activity_logs/log1'
      );
      
      await expect(setDoc(logDoc, {
        action: 'login',
        timestamp: new Date()
      })).rejects.toThrow();
    });

    it('should allow admins to read activity logs', async () => {
      const admin = testEnv.authenticatedContext('admin', { role: 'admin' });
      const userLogDoc = doc(
        admin.firestore(), 
        'users/gary/user_activity_logs/log1'
      );
      
      await setDoc(userLogDoc, {
        action: 'profile_update',
        timestamp: new Date()
      });

      const snapshot = await getDoc(userLogDoc);
      expect(snapshot.exists()).toBe(true);
    });
  });
});