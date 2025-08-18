// [광고] AdManager 클래스 - 광고 로드 및 중복 방지 관리
class AdManager {
    constructor() {
        this.loadedAds = new Set(); // 로드된 광고 추적
    }
    
    // 광고 로드 함수
    loadAd(adId) {
        if (this.loadedAds.has(adId)) {
            console.log(`[광고] ${adId} 이미 로드됨 - 중복 방지`);
            return false;
        }
        
        const adElement = document.getElementById(adId);
        if (adElement && typeof adsbygoogle !== 'undefined') {
            try {
                // 광고 컨테이너 표시
                adElement.style.display = 'block';
                
                // 광고 푸시
                (adsbygoogle = window.adsbygoogle || []).push({});
                
                this.loadedAds.add(adId);
                console.log(`[광고] ${adId} 로드 완료`);
                return true;
            } catch (error) {
                console.warn(`[광고] ${adId} 로드 실패:`, error);
                return false;
            }
        }
        return false;
    }
    
    // 중간 광고 표시 (3번째 질문 후)
    showMidAd() {
        return this.loadAd('adMid');
    }
    
    // 결과 광고 표시
    showResultAd() {
        return this.loadAd('adResult');
    }
}

// [광고] AdManager 인스턴스 생성
const adManager = new AdManager();

// [광고] IntersectionObserver를 이용한 광고 표시 관리
const setupAdObservers = () => {
    if (typeof IntersectionObserver === 'undefined') return;
    
    const options = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    // 중간 광고 관찰자
    const midAdObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                adManager.showMidAd();
                midAdObserver.unobserve(entry.target);
            }
        });
    }, options);
    
    // 결과 광고 관찰자
    const resultAdObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                adManager.showResultAd();
                resultAdObserver.unobserve(entry.target);
            }
        });
    }, options);
    
    // 관찰 대상 등록
    const midAd = document.getElementById('adMid');
    const resultAd = document.getElementById('adResult');
    
    if (midAd) midAdObserver.observe(midAd);
    if (resultAd) resultAdObserver.observe(resultAd);
};

// AdManager 클래스 - 광고 관리 및 동적 로딩


let currentQuestionIndex = 0;
let userAnswers = [];
let totalQuestions = 20;

// 카카오 SDK 초기화
if (typeof Kakao !== 'undefined') {
    Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
}

// 질문 데이터
const questions = [
    {
        question: "월급 받는 날은 언제인가요?",
        answers: [
            { text: "1~5일", score: { early: 3, mid: 1, late: 0 } },
            { text: "10~15일", score: { early: 2, mid: 3, late: 1 } },
            { text: "20~25일", score: { early: 1, mid: 2, late: 3 } },
            { text: "말일(26~31일)", score: { early: 0, mid: 1, late: 2 } },
            { text: "부정기적", score: { early: 1, mid: 1, late: 1 } }
        ]
    },
    {
        question: "한 달 생활비는 언제 주로 지출하나요?",
        answers: [
            { text: "월초에 몰아서", score: { early: 3, mid: 1, late: 0 } },
            { text: "월 중순에 집중적으로", score: { early: 1, mid: 3, late: 1 } },
            { text: "월말에 주로", score: { early: 0, mid: 1, late: 3 } },
            { text: "매주 고르게", score: { early: 2, mid: 2, late: 2 } },
            { text: "불규칙하게", score: { early: 1, mid: 1, late: 1 } }
        ]
    },
    {
        question: "신용카드 사용 패턴은?",
        answers: [
            { text: "소액 결제 위주", score: { early: 1, mid: 2, late: 1 } },
            { text: "중간 금액 결제", score: { early: 2, mid: 3, late: 2 } },
            { text: "고액 결제 자주", score: { early: 3, mid: 2, late: 3 } },
            { text: "월말에 몰아서", score: { early: 0, mid: 1, late: 3 } },
            { text: "거의 사용 안함", score: { early: 0, mid: 1, late: 0 } }
        ]
    },
    {
        question: "돈 관리 스타일은?",
        answers: [
            { text: "매일 가계부 작성", score: { early: 2, mid: 3, late: 2 } },
            { text: "주단위로 체크", score: { early: 2, mid: 2, late: 2 } },
            { text: "월말에 정산", score: { early: 1, mid: 1, late: 3 } },
            { text: "가끔씩 확인", score: { early: 1, mid: 1, late: 1 } },
            { text: "거의 신경 안씀", score: { early: 0, mid: 0, late: 0 } }
        ]
    },
    {
        question: "비상금 준비 상황은?",
        answers: [
            { text: "충분히 준비됨", score: { early: 1, mid: 2, late: 3 } },
            { text: "어느 정도 있음", score: { early: 2, mid: 2, late: 2 } },
            { text: "조금 있음", score: { early: 2, mid: 1, late: 1 } },
            { text: "거의 없음", score: { early: 3, mid: 2, late: 1 } },
            { text: "전혀 없음", score: { early: 3, mid: 1, late: 0 } }
        ]
    },
    {
        question: "카드 연체 경험은?",
        answers: [
            { text: "한 번도 없음", score: { early: 1, mid: 3, late: 2 } },
            { text: "1-2번 있음", score: { early: 2, mid: 2, late: 2 } },
            { text: "가끔 있음", score: { early: 3, mid: 1, late: 1 } },
            { text: "자주 있음", score: { early: 3, mid: 0, late: 0 } },
            { text: "기억 안남", score: { early: 2, mid: 1, late: 1 } }
        ]
    },
    {
        question: "현재 사용 중인 카드 개수는?",
        answers: [
            { text: "1개", score: { early: 1, mid: 2, late: 1 } },
            { text: "2-3개", score: { early: 2, mid: 3, late: 2 } },
            { text: "4-5개", score: { early: 2, mid: 2, late: 3 } },
            { text: "6개 이상", score: { early: 3, mid: 1, late: 3 } },
            { text: "정확히 모름", score: { early: 1, mid: 1, late: 1 } }
        ]
    },
    {
        question: "현금흐름에서 가장 중요하게 생각하는 것은?",
        answers: [
            { text: "연체 방지", score: { early: 2, mid: 3, late: 1 } },
            { text: "이자 절약", score: { early: 1, mid: 2, late: 3 } },
            { text: "관리 편의성", score: { early: 3, mid: 2, late: 2 } },
            { text: "신용등급 관리", score: { early: 1, mid: 3, late: 2 } },
            { text: "잘 모르겠음", score: { early: 1, mid: 1, late: 1 } }
        ]
    },
    {
        question: "통장 잔고 확인 빈도는?",
        answers: [
            { text: "매일 확인", score: { early: 3, mid: 2, late: 1 } },
            { text: "주 2-3회", score: { early: 2, mid: 3, late: 2 } },
            { text: "주 1회", score: { early: 1, mid: 2, late: 2 } },
            { text: "월 2-3회", score: { early: 1, mid: 1, late: 3 } },
            { text: "거의 안봄", score: { early: 0, mid: 0, late: 1 } }
        ]
    },
    {
        question: "온라인 쇼핑 주기는?",
        answers: [
            { text: "매일", score: { early: 2, mid: 1, late: 2 } },
            { text: "주 2-3회", score: { early: 2, mid: 2, late: 2 } },
            { text: "주 1회", score: { early: 1, mid: 2, late: 2 } },
            { text: "월 2-3회", score: { early: 1, mid: 3, late: 1 } },
            { text: "거의 안함", score: { early: 1, mid: 1, late: 1 } }
        ]
    },
    {
        question: "정기 구독 서비스 개수는?",
        answers: [
            { text: "없음", score: { early: 1, mid: 1, late: 1 } },
            { text: "1-2개", score: { early: 2, mid: 2, late: 1 } },
            { text: "3-4개", score: { early: 2, mid: 3, late: 2 } },
            { text: "5-6개", score: { early: 3, mid: 2, late: 3 } },
            { text: "7개 이상", score: { early: 3, mid: 1, late: 3 } }
        ]
    },
    {
        question: "공과금 결제 방식은?",
        answers: [
            { text: "자동이체 (계좌)", score: { early: 1, mid: 2, late: 3 } },
            { text: "자동이체 (카드)", score: { early: 2, mid: 3, late: 2 } },
            { text: "직접 납부", score: { early: 3, mid: 1, late: 1 } },
            { text: "때때로 다름", score: { early: 1, mid: 1, late: 1 } },
            { text: "잘 모르겠음", score: { early: 1, mid: 1, late: 1 } }
        ]
    },
    {
        question: "카드 청구서 확인 시점은?",
        answers: [
            { text: "발송 즉시", score: { early: 3, mid: 2, late: 1 } },
            { text: "2-3일 후", score: { early: 2, mid: 3, late: 2 } },
            { text: "결제일 일주일 전", score: { early: 1, mid: 2, late: 3 } },
            { text: "결제일 하루 전", score: { early: 0, mid: 1, late: 2 } },
            { text: "결제 후", score: { early: 0, mid: 0, late: 1 } }
        ]
    },
    {
        question: "할부 이용 빈도는?",
        answers: [
            { text: "전혀 안함", score: { early: 2, mid: 3, late: 1 } },
            { text: "큰 금액만", score: { early: 1, mid: 2, late: 3 } },
            { text: "가끔 이용", score: { early: 1, mid: 1, late: 2 } },
            { text: "자주 이용", score: { early: 0, mid: 1, late: 3 } },
            { text: "대부분 할부", score: { early: 0, mid: 0, late: 2 } }
        ]
    },
    {
        question: "카드 포인트 관리는?",
        answers: [
            { text: "매월 체크하고 사용", score: { early: 3, mid: 2, late: 1 } },
            { text: "가끔 확인", score: { early: 2, mid: 3, late: 2 } },
            { text: "쌓기만 함", score: { early: 1, mid: 1, late: 2 } },
            { text: "신경 안씀", score: { early: 0, mid: 1, late: 1 } },
            { text: "포인트가 뭔지 모름", score: { early: 0, mid: 0, late: 1 } }
        ]
    },
    {
        question: "가족 카드 사용 현황은?",
        answers: [
            { text: "본인만 사용", score: { early: 3, mid: 2, late: 1 } },
            { text: "가족카드 1장", score: { early: 2, mid: 3, late: 2 } },
            { text: "가족카드 2-3장", score: { early: 1, mid: 2, late: 3 } },
            { text: "가족카드 4장 이상", score: { early: 0, mid: 1, late: 2 } },
            { text: "잘 모르겠음", score: { early: 1, mid: 1, late: 1 } }
        ]
    },
    {
        question: "카드 혜택 중요도는?",
        answers: [
            { text: "적립률이 최우선", score: { early: 1, mid: 2, late: 3 } },
            { text: "할인 혜택 중요", score: { early: 2, mid: 3, late: 2 } },
            { text: "결제 편의성", score: { early: 3, mid: 2, late: 1 } },
            { text: "연회비 무료", score: { early: 2, mid: 1, late: 2 } },
            { text: "별로 신경 안씀", score: { early: 1, mid: 1, late: 1 } }
        ]
    },
    {
        question: "신용등급 확인 빈도는?",
        answers: [
            { text: "매월 확인", score: { early: 3, mid: 2, late: 1 } },
            { text: "분기마다", score: { early: 2, mid: 3, late: 2 } },
            { text: "반기마다", score: { early: 1, mid: 2, late: 2 } },
            { text: "1년에 1번", score: { early: 1, mid: 1, late: 3 } },
            { text: "거의 안봄", score: { early: 0, mid: 0, late: 1 } }
        ]
    },
    {
        question: "현금 사용 비율은?",
        answers: [
            { text: "거의 현금만", score: { early: 1, mid: 1, late: 2 } },
            { text: "현금 70% 이상", score: { early: 1, mid: 2, late: 2 } },
            { text: "현금 50% 정도", score: { early: 2, mid: 2, late: 2 } },
            { text: "현금 30% 이하", score: { early: 2, mid: 3, late: 2 } },
            { text: "거의 카드만", score: { early: 3, mid: 2, late: 1 } }
        ]
    },
    {
        question: "카드 결제일 변경 경험은?",
        answers: [
            { text: "여러 번 변경함", score: { early: 2, mid: 1, late: 2 } },
            { text: "1-2번 변경", score: { early: 1, mid: 2, late: 1 } },
            { text: "변경 고려중", score: { early: 2, mid: 3, late: 3 } },
            { text: "변경한 적 없음", score: { early: 1, mid: 1, late: 1 } },
            { text: "변경할 수 있는지 몰랐음", score: { early: 1, mid: 1, late: 2 } }
        ]
    }
];

// 결과 타입
const resultTypes = {
    early: {
        title: "월초 결제형 (1~10일)",
        subtitle: "체계적인 관리를 선호하는 당신",
        description: `
            <div class="result-section">
                <h3>🎯 추천 결제일: 5일</h3>
                <p><strong>왜 5일일까요?</strong></p>
                <ul>
                    <li>월말 정산 후 바로 새 달 시작</li>
                    <li>월 전체 자금 계획 수립 용이</li>
                    <li>관리 체계성 극대화</li>
                </ul>
            </div>
            
            <div class="result-section">
                <h3>💡 장점</h3>
                <ul>
                    <li>✅ 월별 예산 관리 명확</li>
                    <li>✅ 가계부 작성 편리</li>
                    <li>✅ 연말정산 정리 쉬움</li>
                </ul>
            </div>
            
            <div class="result-section">
                <h3>💳 추천 신용카드</h3>
                <div class="card-recommendations">
                    <div class="card-item">
                        <h4>삼성카드 taptap O</h4>
                        <p>• 온라인 쇼핑 2% 적립<br>• 결제일 자유 변경 가능<br>• <a href="https://www.samsungcard.com" target="_blank">신청하기 →</a></p>
                    </div>
                    <div class="card-item">
                        <h4>현대카드 M</h4>
                        <p>• 모든 가맹점 0.7% 적립<br>• 간편한 앱 관리<br>• <a href="https://www.hyundaicard.com" target="_blank">신청하기 →</a></p>
                    </div>
                </div>
            </div>

            <div class="result-section">
                <h3>🔧 결제일 변경 방법</h3>
                <div class="change-methods">
                    <div class="method-item">
                        <h4>📱 모바일 앱</h4>
                        <ul>
                            <li><a href="https://play.google.com/store/apps/details?id=com.kbcard.cxh.appcard" target="_blank">KB국민카드 앱</a></li>
                            <li><a href="https://play.google.com/store/apps/details?id=com.shinhancard.smartshinhan" target="_blank">신한카드 앱</a></li>
                            <li><a href="https://play.google.com/store/apps/details?id=com.lotte.lottesmartpay" target="_blank">롯데카드 앱</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="result-section">
                <h3>📚 도움되는 사이트</h3>
                <div class="helpful-sites">
                    <div class="site-item">
                        <h4>💰 금융감독원 금융소비자정보</h4>
                        <p>신용카드 정보와 소비자 보호 가이드</p>
                        <a href="https://finlife.fss.or.kr" target="_blank">바로가기 →</a>
                    </div>
                    <div class="site-item">
                        <h4>📊 카드고릴라</h4>
                        <p>신용카드 비교 및 혜택 분석</p>
                        <a href="https://www.cardgorilla.com" target="_blank">바로가기 →</a>
                    </div>
                    <div class="site-item">
                        <h4>🏦 한국신용정보원</h4>
                        <p>신용등급 조회 및 관리</p>
                        <a href="https://www.kcredit.or.kr" target="_blank">바로가기 →</a>
                    </div>
                </div>
            </div>
            
            <div class="result-section">
                <h3>⚠️ 주의사항</h3>
                <ul>
                    <li>급여일과 결제일 간격 확인</li>
                    <li>월말 큰 지출 예상시 여유자금 필요</li>
                    <li>연체 방지를 위한 자동이체 설정</li>
                </ul>
            </div>
        `,
        tips: [
            "자동이체를 통한 확실한 결제",
            "월말 계좌 잔액 미리 확인",
            "비상자금 최소 50만원 유지"
        ]
    },
    mid: {
        title: "월중 결제형 (10~15일)",
        subtitle: "균형잡힌 현금흐름의 달인",
        description: `
            <div class="result-section">
                <h3>🎯 추천 결제일: 14일</h3>
                <p><strong>14일이 황금 결제일인 이유!</strong></p>
                <ul>
                    <li>급여 후 충분한 시간적 여유</li>
                    <li>월말까지 자금 운용 가능</li>
                    <li>심리적 부담감 최소화</li>
                </ul>
            </div>
            
            <div class="result-section">
                <h3>💡 장점</h3>
                <ul>
                    <li>✅ 최적의 현금흐름 관리</li>
                    <li>✅ 연체 위험 최소화</li>
                    <li>✅ 스트레스 없는 카드 관리</li>
                </ul>
            </div>
            
            <div class="result-section">
                <h3>🏆 14일 결제의 특별한 이점</h3>
                <ul>
                    <li>대부분 급여일(25일~말일) 후 약 15일 여유</li>
                    <li>월 중순 결제로 자금계획 수립 용이</li>
                    <li>다음 급여까지 부담없는 기간 확보</li>
                </ul>
            </div>

            <div class="result-section">
                <h3>💳 추천 신용카드 (14일 결제 최적화)</h3>
                <div class="card-recommendations">
                    <div class="card-item">
                        <h4>신한카드 Deep Dream</h4>
                        <p>• 모든 가맹점 1.5% 적립<br>• 14일 결제시 추가 혜택<br>• <a href="https://www.shinhancard.com" target="_blank">신청하기 →</a></p>
                    </div>
                    <div class="card-item">
                        <h4>KB국민 WE:SH 카드</h4>
                        <p>• 통신비, 구독료 10% 할인<br>• 간편 결제일 설정<br>• <a href="https://card.kbcard.com" target="_blank">신청하기 →</a></p>
                    </div>
                    <div class="card-item">
                        <h4>우리카드 EVERYDAY</h4>
                        <p>• 일상 소비 1% 적립<br>• 무료 부가서비스<br>• <a href="https://www.wooricard.com" target="_blank">신청하기 →</a></p>
                    </div>
                </div>
            </div>

            <div class="result-section">
                <h3>🔧 14일 결제일 변경 가이드</h3>
                <div class="change-guide">
                    <div class="step-item">
                        <h4>1단계: 카드사별 변경 방법</h4>
                        <ul>
                            <li><strong>신한카드:</strong> <a href="https://www.shinhancard.com" target="_blank">인터넷뱅킹</a> → 카드관리 → 결제일변경</li>
                            <li><strong>KB국민카드:</strong> <a href="https://card.kbcard.com" target="_blank">KB스타뱅킹</a> → 카드 → 이용한도/결제일관리</li>
                            <li><strong>삼성카드:</strong> <a href="https://www.samsungcard.com" target="_blank">삼성카드 홈페이지</a> → My카드 → 결제일변경</li>
                            <li><strong>현대카드:</strong> <a href="https://www.hyundaicard.com" target="_blank">현대카드 앱</a> → 카드관리 → 결제일변경</li>
                        </ul>
                    </div>
                    <div class="step-item">
                        <h4>2단계: 고객센터 연락처</h4>
                        <ul>
                            <li>신한카드: 1544-7000</li>
                            <li>KB국민카드: 1588-1688</li>
                            <li>삼성카드: 1588-8700</li>
                            <li>현대카드: 1577-6000</li>
                            <li>우리카드: 1588-9955</li>
                            <li>롯데카드: 1588-8000</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="result-section">
                <h3>📚 도움되는 금융 사이트</h3>
                <div class="helpful-sites">
                    <div class="site-item">
                        <h4>💰 금융감독원 통합비교공시</h4>
                        <p>각 카드사 상품 비교 및 수수료 확인</p>
                        <a href="https://finlife.fss.or.kr" target="_blank">바로가기 →</a>
                    </div>
                    <div class="site-item">
                        <h4>📊 카드비교 전문 사이트</h4>
                        <p>실시간 카드 혜택 비교 분석</p>
                        <a href="https://www.cardgorilla.com" target="_blank">카드고릴라 →</a>
                    </div>
                    <div class="site-item">
                        <h4>🏦 신용등급 관리</h4>
                        <p>무료 신용등급 조회 및 관리 팁</p>
                        <a href="https://www.allcredit.co.kr" target="_blank">올크레딧 →</a>
                    </div>
                    <div class="site-item">
                        <h4>💡 가계부 관리 앱</h4>
                        <p>자동 가계부 및 카드 사용 내역 분석</p>
                        <a href="https://www.banksalad.com" target="_blank">뱅크샐러드 →</a>
                    </div>
                </div>
            </div>
        `,
        tips: [
            "14일은 대한민국 최적 결제일",
            "급여일 기준 15일 후 설정이 이상적",
            "여러 카드도 14일로 통일 추천"
        ]
    },
    late: {
        title: "월말 결제형 (20일 이후)",
        subtitle: "급여와 함께하는 안정형",
        description: `
            <div class="result-section">
                <h3>🎯 추천 결제일: 25일</h3>
                <p><strong>급여 직후 결제의 안정감</strong></p>
                <ul>
                    <li>급여 입금 직후 즉시 정산</li>
                    <li>잔여 금액으로 한 달 생활</li>
                    <li>명확한 가용 자금 파악</li>
                </ul>
            </div>
            
            <div class="result-section">
                <h3>💡 장점</h3>
                <ul>
                    <li>✅ 급여 후 바로 정산으로 안심</li>
                    <li>✅ 남은 돈으로 명확한 계획</li>
                    <li>✅ 카드 사용 한도 자연스럽게 조절</li>
                </ul>
            </div>

            <div class="result-section">
                <h3>💳 추천 신용카드 (월말 결제형)</h3>
                <div class="card-recommendations">
                    <div class="card-item">
                        <h4>롯데카드 LOCA</h4>
                        <p>• 롯데 계열 최대 7% 할인<br>• 무료 부가서비스<br>• <a href="https://www.lottecard.co.kr" target="_blank">신청하기 →</a></p>
                    </div>
                    <div class="card-item">
                        <h4>하나카드 Club 1Q</h4>
                        <p>• 분기별 최대 2% 적립<br>• 다양한 생활 혜택<br>• <a href="https://www.hanacard.co.kr" target="_blank">신청하기 →</a></p>
                    </div>
                    <div class="card-item">
                        <h4>BC카드 Top+</h4>
                        <p>• 모든 가맹점 1% 적립<br>• 연회비 무료<br>• <a href="https://www.bccard.com" target="_blank">신청하기 →</a></p>
                    </div>
                </div>
            </div>

            <div class="result-section">
                <h3>💰 비상자금 관리 사이트</h3>
                <div class="helpful-sites">
                    <div class="site-item">
                        <h4>🏦 토스뱅크</h4>
                        <p>비상자금 적금 및 자동이체 관리</p>
                        <a href="https://www.tossbank.com" target="_blank">바로가기 →</a>
                    </div>
                    <div class="site-item">
                        <h4>💎 카카오뱅크</h4>
                        <p>모임통장 및 자동저축 서비스</p>
                        <a href="https://www.kakaobank.com" target="_blank">바로가기 →</a>
                    </div>
                    <div class="site-item">
                        <h4>📈 펀드 슈퍼마켓</h4>
                        <p>여유자금 투자 및 운용 가이드</p>
                        <a href="https://www.fundsupermarket.co.kr" target="_blank">바로가기 →</a>
                    </div>
                </div>
            </div>

            <div class="result-section">
                <h3>📱 가계부 및 자산 관리 앱</h3>
                <div class="app-recommendations">
                    <div class="app-item">
                        <h4>🥗 뱅크샐러드</h4>
                        <p>• 자동 가계부 및 자산 관리<br>• 카드 사용 패턴 분석<br>• <a href="https://play.google.com/store/apps/details?id=com.banksalad.android" target="_blank">다운로드 →</a></p>
                    </div>
                    <div class="app-item">
                        <h4>💰 머니매니저</h4>
                        <p>• 상세한 가계부 작성<br>• 예산 관리 및 알림<br>• <a href="https://play.google.com/store/apps/details?id=com.realbyteapps.moneymanagerfree" target="_blank">다운로드 →</a></p>
                    </div>
                </div>
            </div>
            
            <div class="result-section">
                <h3>⚠️ 주의사항</h3>
                <ul>
                    <li>다음 급여까지 긴 기간 관리 필요</li>
                    <li>월말 큰 지출 발생시 부담 증가</li>
                    <li>비상자금 충분히 준비 필요</li>
                </ul>
            </div>
        `,
        tips: [
            "급여일 3일 후 결제일 설정",
            "월말 대형 지출 미리 계획",
            "비상자금 100만원 이상 권장"
        ]
    }
};

// 페이지 표시 함수
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

// 테스트 시작
function startTest() {
    showPage('testPage');
    currentQuestionIndex = 0;
    userAnswers = [];
    
    // 모든 광고 숨기기 (새 테스트 시작 시)
    // adManager.hideAllAds();
    
    showQuestion();
}

// 질문 표시
function showQuestion() {
    const question = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    
    document.getElementById('progress').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = totalQuestions;
    document.getElementById('questionTitle').textContent = question.question;
    
    // 3번째 질문 이후 중간 광고 표시
    if (currentQuestionIndex >= 2) {
        adManager.loadAd('ad-middle');
    }
    
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const answerBtn = document.createElement('button');
        answerBtn.className = 'answer-btn';
        answerBtn.textContent = answer.text;
        answerBtn.onclick = () => selectAnswer(answer);
        answersContainer.appendChild(answerBtn);
    });
}

// 답변 선택
function selectAnswer(answer) {
    userAnswers.push(answer);
    
    if (currentQuestionIndex < totalQuestions - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        showAnalysisPopup();
    }
}

// 분석 팝업 표시
function showAnalysisPopup() {
    document.getElementById('popupOverlay').classList.remove('hidden');
    document.getElementById('analysisPopup').classList.remove('hidden');
    
    let countdown = 8;
    const countdownEl = document.getElementById('countdown');
    const confirmBtn = document.getElementById('confirmPopupBtn');
    
    const timer = setInterval(() => {
        countdown--;
        countdownEl.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            confirmBtn.disabled = false;
            confirmBtn.textContent = '결과 확인하기';
            confirmBtn.onclick = showResult;
        }
    }, 1000);
}

// 결과 계산 및 표시
function showResult() {
    document.getElementById('popupOverlay').classList.add('hidden');
    document.getElementById('analysisPopup').classList.add('hidden');
    
    // 점수 계산
    const scores = { early: 0, mid: 0, late: 0 };
    
    userAnswers.forEach(answer => {
        scores.early += answer.score.early;
        scores.mid += answer.score.mid;
        scores.late += answer.score.late;
    });
    
    // 최고 점수 타입 찾기
    let resultType = 'mid'; // 기본값
    let maxScore = scores.mid;
    
    if (scores.early > maxScore) {
        resultType = 'early';
        maxScore = scores.early;
    }
    if (scores.late > maxScore) {
        resultType = 'late';
        maxScore = scores.late;
    }
    
    const result = resultTypes[resultType];
    
    // 결과 표시
    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('resultSubtitle').textContent = result.subtitle;
    document.getElementById('resultContent').innerHTML = result.description;
    
    showPage('resultPage');
    
    // 결과 페이지 광고 표시
    adManager.showAd('ad-result');
}

// 카카오톡 공유
function shareKakao() {
    if (typeof Kakao !== 'undefined') {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '💳 나에게 맞는 신용카드 결제일 테스트',
                description: '14일 결제가 정말 좋을까? 나만의 최적 결제일을 찾아보세요!',
                imageUrl: 'https://sd2624.github.io/신용카드결제일/신용카드결제일.svg',
                link: {
                    mobileWebUrl: 'https://sd2624.github.io/신용카드결제일/',
                    webUrl: 'https://sd2624.github.io/신용카드결제일/'
                }
            },
            buttons: [
                {
                    title: '테스트 하기',
                    link: {
                        mobileWebUrl: 'https://sd2624.github.io/신용카드결제일/',
                        webUrl: 'https://sd2624.github.io/신용카드결제일/'
                    }
                }
            ]
        });
    }
}

// 결과 공유
function shareResult() {
    const resultTitle = document.getElementById('resultTitle').textContent;
    if (typeof Kakao !== 'undefined') {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: `💳 나의 신용카드 결제일 타입: ${resultTitle}`,
                description: '나에게 맞는 최적의 신용카드 결제일을 찾았어요! 당신도 테스트해보세요!',
                imageUrl: 'https://sd2624.github.io/신용카드결제일/신용카드결제일.svg',
                link: {
                    mobileWebUrl: 'https://sd2624.github.io/신용카드결제일/',
                    webUrl: 'https://sd2624.github.io/신용카드결제일/'
                }
            },
            buttons: [
                {
                    title: '나도 테스트하기',
                    link: {
                        mobileWebUrl: 'https://sd2624.github.io/신용카드결제일/',
                        webUrl: 'https://sd2624.github.io/신용카드결제일/'
                    }
                }
            ]
        });
    }
}

// 페이지 로드 시 초기화


// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
});