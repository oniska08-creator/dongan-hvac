"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// 밀리초 단위 세팅 (1시간)
const AUTO_LOGOUT_TIME = 60 * 60 * 1000;

export default function AutoLogoutWrapper({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const router = useRouter();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = useCallback(() => {
        // unauthenticated면 어차피 페이지 접근이 안되므로 타이머 동작 불필요
        if (status !== 'authenticated') return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // AUTO_LOGOUT_TIME 후 자동 로그아웃 트리거
        timeoutRef.current = setTimeout(async () => {
            alert("보안을 위해 장시간 활동이 없어 자동으로 로그아웃 되었습니다.");
            await signOut({ redirect: false });
            router.push('/login');
        }, AUTO_LOGOUT_TIME);
    }, [status, router]);

    useEffect(() => {
        // 사용자 인터랙션을 감지하는 이벤트 리스너 목록
        const events = [
            "mousemove",
            "keydown",
            "click",
            "scroll",
            "touchstart"
        ];

        // 이벤트가 발생할 때마다 타이머를 리셋 (스로틀링을 걸어 성능 저하를 방지할 수 있지만, setTimeout 리셋 수준은 매우 가벼움)
        const handleInteraction = () => {
            resetTimer();
        };

        // 이벤트 리스너 등록
        events.forEach(event => {
            window.addEventListener(event, handleInteraction, { passive: true });
        });

        // 초기 타이머 설정
        resetTimer();

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            events.forEach(event => window.removeEventListener(event, handleInteraction));
        };
    }, [resetTimer]);

    // 인터벌을 활용해, 브라우저 탭이 백그라운드에 있다가 돌아왔을 때 세션이 이미 죽어있다면 쫓아내는 추가 로직 (세션 maxAge 동기화 검증용)
    useEffect(() => {
        const interval = setInterval(() => {
            if (status === 'unauthenticated') {
                router.push('/login');
            }
        }, 10000); // 10초마다 세션 상태 체크

        return () => clearInterval(interval);
    }, [status, router]);

    return <>{children}</>;
}
