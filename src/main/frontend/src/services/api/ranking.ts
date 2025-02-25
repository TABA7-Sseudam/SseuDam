import api from "@/api/axiosInstance";
import { RankingResponse } from "@/types/RankingResponse";
import { auth } from "@/lib/firebase/firebase"; // 🔥 Firebase 인증 추가

export const getAptRank = async (apartmentId: string): Promise<RankingResponse> => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("🚫 Firebase 사용자 인증이 필요합니다.");

        const token = await currentUser.getIdToken(true); // ✅ 최신 Firebase 토큰 가져오기

        const response = await api.get<RankingResponse>(`/rankings?apartmentId=${apartmentId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // ✅ 동적 토큰 적용
            },
        });
        return response.data;
    } catch (error: unknown) {
        console.error("Error fetching apartment ranking:", error);
        throw error;
    }
};