import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { processProductImages } from '@/lib/storage';

export async function GET() {
    try {
        // Debugging available models
        const modelNames = Object.keys(prisma);
        console.log('Available Prisma Models:', modelNames);

        if (!(prisma as any).companyInfo) {
            console.error('CRITICAL: companyInfo model is not found in Prisma Client');
            return NextResponse.json({ error: 'CompanyInfo model not found in DB client' }, { status: 500 });
        }

        let companyInfo = await (prisma as any).companyInfo.findFirst({
            where: { id: 1 }
        });

        // Initialize if not exists
        if (!companyInfo) {
            const initialHistory = [
                { year: "2026", title: "스마트 공조 시스템 글로벌 진출", desc: "AI 기반 빌딩 에너지 관리 시스템(BEMS) 해외 수출 계약 체결" },
                { year: "2020", title: "친환경 환기시스템 라인업 확대", desc: "초미세먼지 대응 전열교환기 자체 개발 및 특허 취득" },
                { year: "2012", title: "대형 상업시설 시공 누적 1,000건 돌파", desc: "주요 대기업 사옥 및 복합 쇼핑몰 공조 시스템 전담 시공사 선정" },
                { year: "2004", title: "DongAn HVAC 설립", desc: "최고의 기술력과 신뢰를 바탕으로 공조설비 전문 기업 출범" },
            ];
            companyInfo = await (prisma as any).companyInfo.create({
                data: {
                    id: 1,
                    title: "회사소개",
                    subTitle: "20년의 고집, 보이지 않는 곳에서 공간의 완벽을 만듭니다.",
                    contentTitle: "최적의 공기를 설계하는 완벽한 기술력",
                    content1: "공기는 생명이며, 최적의 환경은 비즈니스의 성공과 삶의 질을 결정짓는 핵심 요소입니다. 우리는 단순히 기계적인 시공을 넘어, 당신의 공간에 가장 적합한 숨결을 예술적으로 디자인합니다.",
                    content2: "국내 최고 수준의 공조 엔지니어링 역량을 바탕으로 냉난방 에너지 효율을 극대화하고, 사후 관리까지 책임지는 철저한 장인정신을 통해 보이지 않는 곳에서 공간의 완벽함을 완성합니다.",
                    imageUrl: "/images/about/hvac_main.png",
                    history: initialHistory as any
                }
            });
        }

        // If history is missing from existing record, provide defaults
        const history = companyInfo.history || [];

        return NextResponse.json({ companyInfo, history });
    } catch (error) {
        console.error('Company Info Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch company info' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { companyInfo, history } = body;

        if (!(prisma as any).companyInfo) {
            return NextResponse.json({ error: 'CompanyInfo model not found in DB client' }, { status: 500 });
        }

        // 이미지 처리 (Base64 변환 지원)
        const processed = await processProductImages({ 
            imageUrl: companyInfo?.imageUrl 
        });

        // Use prisma.companyInfo (camelCase) correctly
        await (prisma as any).companyInfo.upsert({
            where: { id: 1 },
            update: {
                title: companyInfo?.title || "회사소개",
                subTitle: companyInfo?.subTitle,
                description: companyInfo?.description,
                contentTitle: companyInfo?.contentTitle,
                content1: companyInfo?.content1,
                content2: companyInfo?.content2,
                imageUrl: processed.imageUrl || "/images/about/hvac_main.png",
                history: history as any,
                updatedAt: new Date()
            },
            create: {
                id: 1,
                title: companyInfo?.title || "회사소개",
                subTitle: companyInfo?.subTitle,
                description: companyInfo?.description,
                contentTitle: companyInfo?.contentTitle,
                content1: companyInfo?.content1,
                content2: companyInfo?.content2,
                imageUrl: processed.imageUrl || "/images/about/hvac_main.png",
                history: history as any
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Company Info Update Error:', error);
        return NextResponse.json({ error: 'Failed to update company info' }, { status: 500 });
    }
}
