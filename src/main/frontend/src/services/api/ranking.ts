import api from "@/api/axiosInstance";
import { RankingResponse } from "@/types/RankingResponse";

// ✅ Firebase 사용자 토큰 하드코딩 (테스트용)
const getFirebaseToken = async (): Promise<string> => {
  // 아래 하드코딩된 토큰을 사용합니다.
  return "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBjYmJiZDI2NjNhY2U4OTU4YTFhOTY4ZmZjNDQxN2U4MDEyYmVmYmUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmVjeWxpbmctMzIyNWEiLCJhdWQiOiJyZWN5bGluZy0zMjI1YSIsImF1dGhfdGltZSI6MTc0MDEyMzI0NSwidXNlcl9pZCI6IlU0TjJTR3dZSjZRMHV5c25oZVlLSHdtSWlTQTIiLCJzdWIiOiJVNE4yU0d3WUo2UTB1eXNuaGVZS0h3bUlpU0EyIiwiaWF0IjoxNzQwMTIzMjQ3LCJleHAiOjE3NDAxMjY4NDcsImVtYWlsIjoiY3Jvc2Vmcm9nQG5hbmVyLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJjcm9zZWZyb2dAbmFuZXIuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.vyFmFMZIy4Jv8Cc9l3ovo4yLTv20PGb-cAidI7wWjEpy0pUksbmmvnh0UbRmPbumQTdTVZIIPfqhkOsDdeu6tDcRmuN-Tg4a0pUuwT_U_N0bIP1NFLbgTlmlkw9ZhPVTDLF78csv2QUy0EP3FknVXvtOntuMth1KgvDa0uJC2D12BfBg_vrKhP7Du-qtVBUC1QeJ1Tzhr-ULoG6x0Z8Y1qX0GPWNC5OJquFYpRF186UZd-VgQDS93LGAUgUnOHTuzbI-Gq6o0fZnmnkzDGS0s8L1NxABIIsMBBvjOzG_RseRn2HJ0vmMCf40-_QoiKCNxeRQUBQa56VbepBno0XP9g";
};

export const getAptRank = async (apartmentId: string): Promise<RankingResponse> => {
    try {
        const token = await getFirebaseToken();
        const response = await api.get<RankingResponse>(`/rankings?apartmentId=${apartmentId}`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error: unknown) {
        console.error("Error fetching apartment ranking:", error);
        throw error;
    }
};