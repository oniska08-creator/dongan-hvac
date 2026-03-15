export default function AdminLoading() {
    return (
        <div className="w-full min-h-[80vh] flex flex-col gap-6 animate-pulse p-4">
            {/* 1. 페이지 타이틀 스켈레톤 */}
            <div className="flex justify-between items-center mb-4">
                <div className="space-y-3 w-1/3">
                    <div className="h-8 bg-slate-800 rounded-md w-1/2"></div>
                    <div className="h-4 bg-slate-800 rounded-md w-3/4"></div>
                </div>
                <div className="h-10 bg-slate-800 rounded-xl w-32"></div>
            </div>

            {/* 2. 메인 컨텐츠 (표/카드 영역) 스켈레톤 */}
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex-1 flex flex-col">
                {/* 2-1. 테이블 헤더 스타일 */}
                <div className="h-14 bg-slate-800/50 border-b border-slate-800 flex items-center px-6 gap-4">
                    <div className="h-4 bg-slate-800 rounded w-12"></div>
                    <div className="h-4 bg-slate-800 rounded w-24"></div>
                    <div className="h-4 bg-slate-800 rounded flex-1 mx-8 max-w-[300px]"></div>
                    <div className="h-4 bg-slate-800 rounded w-20"></div>
                    <div className="h-4 bg-slate-800 rounded w-24 ml-auto"></div>
                </div>

                {/* 2-2. 테이블 Row 5개 정도 반복 */}
                <div className="divide-y divide-slate-800/50 flex-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center px-6 py-4 gap-4">
                            <div className="h-4 bg-slate-800 rounded w-8 mx-2"></div>
                            {/* 썸네일 이미지 자리 */}
                            <div className="h-14 w-20 bg-slate-800 rounded-lg"></div>
                            {/* 메인 텍스트 영역 */}
                            <div className="flex-1 space-y-2 mx-8">
                                <div className="h-5 bg-slate-800 rounded w-1/2 max-w-[400px]"></div>
                                <div className="h-3 bg-slate-800/50 rounded w-1/3 max-w-[200px]"></div>
                            </div>
                            {/* 뱃지 및 액션 버튼 자리 */}
                            <div className="h-6 w-16 bg-slate-800 rounded-full"></div>
                            <div className="h-6 w-20 bg-slate-800 rounded ml-auto flex gap-2"></div>
                        </div>
                    ))}
                </div>

                {/* 2-3. 하단 페이지네이션 자리 */}
                <div className="h-16 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between px-6">
                    <div className="h-4 bg-slate-800 rounded w-32"></div>
                    <div className="flex gap-2">
                        <div className="h-8 w-12 bg-slate-800 rounded"></div>
                        <div className="h-8 w-8 bg-slate-800 rounded"></div>
                        <div className="h-8 w-8 bg-slate-800 rounded"></div>
                        <div className="h-8 w-12 bg-slate-800 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
