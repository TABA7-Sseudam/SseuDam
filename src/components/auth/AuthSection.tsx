// src/components/auth/AuthSection.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>회원가입/로그인</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground">
            모바일앱에서 요소가 세로 정렬됩니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1">
              로그인
            </Button>
            <Button variant="outline" className="flex-1">
              회원가입
            </Button>
          </div>
          <Button className="w-full bg-black hover:bg-black/90 text-white">
            게스트로 시작하기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
