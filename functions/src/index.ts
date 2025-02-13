import { onRequest } from 'firebase-functions/v2/https';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase 초기화
initializeApp();
const db = getFirestore();

// Express 앱 설정
const app = express();
app.use(cors({ origin: true })); // 모든 출처 허용. 프로덕션에서는 제한해야 함.
app.use(express.json());

// 타입 정의 (선택 사항)
interface User {
    username: string;
    email: string;
    apartment?: string; // 선택 사항으로 변경
    location?: string;  // 선택 사항으로 변경
    nickname?: string;  // 선택 사항으로 변경
    role: 'user' | 'admin';
    email_verified: boolean;
    created_at: Date;
    updated_at: Date;
    points?: number; // 선택 사항
    recycleCount?: number; // 선택 사항
}

// 1. 분석 결과 API
app.post('/analysis-results', async (req: Request, res: Response) => {
    try {
        const { earned, inearned, material, points, success_percent, user_id } = req.body;

        const docRef = await db.collection('AnalysisResult_data').add({
            earned,
            inearned,
            material,
            points,
            success_percent,
            user_id,
            created_at: new Date()
        });

        return res.status(201).json({ id: docRef.id, message: '분석 결과가 저장되었습니다.' });
    } catch (error) {
        console.error("Error adding analysis result:", error); // 에러 로깅
        return res.status(500).json({ error: '분석 결과 저장 중 오류가 발생했습니다.' });
    }
});

// 2. 이메일 인증 API
app.post('/email-verifications', async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await db.collection('email_verifications').add({
            userId,
            verificationToken: Math.random().toString(36).substring(2, 15),
            created_at: new Date(),
            expires_at: expiresAt,
            verified: false
        });

        return res.status(201).json({ message: '이메일 인증이 요청되었습니다.' });
    } catch (error) {
        console.error("Error requesting email verification:", error); // 에러 로깅
        return res.status(500).json({ error: '이메일 인증 요청 중 오류가 발생했습니다.' });
    }
});

// 3. 비밀번호 재설정 API
app.post('/password-resets', async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await db.collection('password_resets').add({
            userId,
            resetToken: Math.random().toString(36).substring(2, 15),
            created_at: new Date(),
            expires_at: expiresAt
        });

        return res.status(201).json({ message: '비밀번호 재설정이 요청되었습니다.' });
    } catch (error) {
        console.error("Error requesting password reset:", error); // 에러 로깅
        return res.status(500).json({ error: '비밀번호 재설정 요청 중 오류가 발생했습니다.' });
    }
});

// 4. 랭킹 계정 API
app.get('/rank-accounts', async (_req: Request, res: Response) => {
    try {
        const rankingsSnapshot = await db.collection('rank_accounts')
            .orderBy('accumulated_points', 'desc')
            .limit(100)
            .get();

        const rankings = rankingsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return res.status(200).json(rankings);
    } catch (error) {
        console.error("Error getting rankings:", error);  // 에러 로깅
        return res.status(500).json({ error: '랭킹 조회 중 오류가 발생했습니다.' });
    }
});

app.post('/rank-accounts', async (req: Request, res: Response) => {
    try {
        const { username, monthly_points = 0 } = req.body;

        const docRef = await db.collection('rank_accounts').add({
            username,
            accumulated_points: monthly_points,  // accumulated_points를 monthly_points로 초기화
            monthly_points,
            ranking: 0,
            month: new Date().getMonth() + 1
        });

        return res.status(201).json({
            id: docRef.id,
            message: '랭킹 정보가 생성되었습니다.'
        });
    } catch (error) {
        console.error("Error creating rank account:", error); // 에러 로깅
        return res.status(500).json({ error: '랭킹 정보 생성 중 오류가 발생했습니다.' });
    }
});

// 5. 사용자 활동 로그 API
app.post('/user-activity-logs', async (req: Request, res: Response) => {
    try {
        const { userId, action, deviceInfo } = req.body;

        const docRef = await db.collection('user_activity_logs').add({
            userId,
            action,
            deviceInfo,
            timestamp: new Date()
        });

        return res.status(201).json({
            id: docRef.id,
            message: '활동이 기록되었습니다.'
        });
    } catch (error) {
        console.error("Error logging user activity:", error); // 에러 로깅
        return res.status(500).json({ error: '활동 기록 중 오류가 발생했습니다.' });
    }
});

// 6. 사용자 세션 API
app.post('/user-sessions', async (req: Request, res: Response) => {
    try {
        const { userId, deviceInfo } = req.body;

        const sessionDoc = await db.collection('user_sessions').add({
            userId,
            deviceInfo,
            loginTime: new Date(),
            status: 'active'
        });

        return res.status(201).json({
            sessionId: sessionDoc.id,
            message: '세션이 생성되었습니다.'
        });
    } catch (error) {
        console.error("Error creating user session:", error); // 에러 로깅
        return res.status(500).json({ error: '세션 생성 중 오류가 발생했습니다.' });
    }
});

// 7. 사용자 API
app.post('/users', async (req: Request, res: Response) => {
    try {
        const userData: Partial<User> = { // Partial<User> 사용
            username: req.body.username,
            email: req.body.email,
            apartment: req.body.apartment,
            location: req.body.location,
            nickname: req.body.nickname,
            role: 'user', // 여기서 role을 지정
            email_verified: false, // 여기서 email_verified를 지정
            created_at: new Date(),
            updated_at: new Date()
        };



        const userDoc = await db.collection('users').add(userData as User); // as User로 타입 단언

        return res.status(201).json({
            userId: userDoc.id,
            message: '사용자가 생성되었습니다.'
        });
    } catch (error) {
        console.error("Error creating user:", error); // 에러 로깅
        return res.status(500).json({ error: '사용자 생성 중 오류가 발생했습니다.' });
    }
});

// 사용자 조회 API
app.get('/users/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        return res.status(200).json(userDoc.data());
    } catch (error) {
        console.error("Error getting user:", error);  // 에러 로깅
        return res.status(500).json({ error: '사용자 조회 중 오류가 발생했습니다.' });
    }
});

// Cloud Functions로 내보내기 (v2, region 설정)
export const api = onRequest({ region: 'asia-northeast3' }, app);