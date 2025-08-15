// 광고 관리 클래스 - 새로 추가
class AdManager {
    constructor() {
        this.loadedAds = new Set();
    }

    loadAd(container) {
        if (!container || this.loadedAds.has(container)) return;
        
        container.style.display = 'block';
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
            this.loadedAds.add(container);
        } catch (e) {
            console.error('Ad loading error:', e);
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadAd(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // 중간 광고와 결과 광고 관찰
        const midAd = document.querySelector('.ad-container.mid');
        const resultAd = document.querySelector('.ad-container.result');
        
        if (midAd) observer.observe(midAd);
        if (resultAd) observer.observe(resultAd);
    }
}

// 광고 관리자 인스턴스 생성
const adManager = new AdManager();

// 카카오 SDK 초기화
if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
    Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
}

// 전역 변수
let currentQuestion = 0;
let answers = [];
let testStarted = false;

// 질문 데이터
const questions = [
    {
        id: 1,
        question: "주로 어떤 방식으로 결제하시나요?",
        answers: [
            { text: "온라인 쇼핑이 많아요", emoji: "🛒", type: "online" },
            { text: "오프라인 매장에서 주로 결제해요", emoji: "🏪", type: "offline" },
            { text: "둘 다 비슷하게 사용해요", emoji: "⚖️", type: "mixed" },
            { text: "현금 사용을 선호해요", emoji: "💵", type: "cash" }
        ]
    },
    {
        id: 2,
        question: "월 평균 체크카드 사용 금액은?",
        answers: [
            { text: "50만원 미만", emoji: "💰", type: "low" },
            { text: "50만원 ~ 100만원", emoji: "💳", type: "medium" },
            { text: "100만원 ~ 200만원", emoji: "💎", type: "high" },
            { text: "200만원 이상", emoji: "👑", type: "vip" }
        ]
    },
    {
        id: 3,
        question: "가장 중요하게 생각하는 혜택은?",
        answers: [
            { text: "수수료 면제 (ATM, 이체)", emoji: "🏦", type: "fee" },
            { text: "적립 혜택 (포인트, 캐시백)", emoji: "🎁", type: "reward" },
            { text: "할인 혜택 (가맹점, 브랜드)", emoji: "🏷️", type: "discount" },
            { text: "편의성 (간편결제, 앱)", emoji: "📱", type: "convenience" }
        ]
    },
    {
        id: 4,
        question: "주로 사용하는 은행은?",
        answers: [
            { text: "국민은행", emoji: "🏛️", type: "kb" },
            { text: "신한은행", emoji: "🏢", type: "shinhan" },
            { text: "우리은행", emoji: "🏦", type: "woori" },
            { text: "인터넷은행 (카카오뱅크, 토스뱅크)", emoji: "📱", type: "internet" }
        ]
    },
    {
        id: 5,
        question: "ATM 사용 빈도는?",
        answers: [
            { text: "거의 사용 안 함", emoji: "❌", type: "never" },
            { text: "월 1-2회", emoji: "📅", type: "rare" },
            { text: "주 1-2회", emoji: "🔄", type: "regular" },
            { text: "거의 매일", emoji: "⏰", type: "frequent" }
        ]
    },
    {
        id: 6,
        question: "해외 사용 계획은?",
        answers: [
            { text: "해외 여행을 자주 가요", emoji: "✈️", type: "frequent" },
            { text: "가끔 해외 여행을 가요", emoji: "🌍", type: "occasional" },
            { text: "온라인 해외 쇼핑을 해요", emoji: "🛍️", type: "online" },
            { text: "해외 사용 계획 없음", emoji: "🏠", type: "domestic" }
        ]
    },
    {
        id: 7,
        question: "가장 선호하는 혜택 유형은?",
        answers: [
            { text: "카페/베이커리 할인", emoji: "☕", type: "cafe" },
            { text: "마트/편의점 할인", emoji: "🛒", type: "mart" },
            { text: "주유소/교통비 할인", emoji: "⛽", type: "transport" },
            { text: "통신비/구독 서비스 할인", emoji: "📱", type: "subscription" }
        ]
    },
    {
        id: 8,
        question: "연회비에 대한 생각은?",
        answers: [
            { text: "무조건 연회비 없는 카드", emoji: "🆓", type: "free" },
            { text: "혜택이 좋다면 연회비 OK", emoji: "💰", type: "paid" },
            { text: "연회비는 5만원 이하로", emoji: "💳", type: "limited" },
            { text: "혜택만 좋으면 연회비 상관없음", emoji: "💎", type: "premium" }
        ]
    }
];

// 결과 타입
const resultTypes = {
    cashback: {
        title: "💰 캐시백 혜택형",
        subtitle: "실속 있는 혜택을 추구하는 당신",
        description: `
            <div class="result-section">
                <h3>🎯 추천 체크카드 TOP 3</h3>
                <div class="card-recommendations">
                    <div class="card-item">
                        <h4>1위. 토스뱅크 체크카드</h4>
                        <p>• 모든 가맹점 1% 캐시백<br>• 연회비 무료<br>• 간편한 앱 관리<br>• <a href="https://www.tossbank.com" target="_blank">신청하기 →</a></p>
                    </div>
                    <div class="card-item">
                        <h4>2위. 카카오뱅크 체크카드</h4>
                        <p>• 온라인 2% 적립<br>• ATM 수수료 면제<br>• 카카오페이 연동<br>• <a href="https://www.kakaobank.com" target="_blank">신청하기 →</a></p>
                    </div>
                    <div class="card-item">
                        <h4>3위. 신한 Deep Dream 체크카드</h4>
                        <p>• 모든 가맹점 1.5% 적립<br>• 월 한도 30만원<br>• 다양한 부가서비스<br>• <a href="https://www.shinhancard.com" target="_blank">신청하기 →</a></p>
                    </div>
                </div>
            </div>
            
            <div class="result-section">
                <h3>💡 캐시백 최대화 팁</h3>
                <ul>
                    <li>월 사용 한도 확인하고 최대 활용</li>
                    <li>적립률이 높은 카테고리 우선 사용</li>
                    <li>캐시백 지급 조건과 시기 확인</li>
                    <li>여러 카드 조합으로 혜택 극대화</li>
                </ul>
            </div>

            <div class="result-section">
                <h3>📱 도움되는 앱 & 사이트</h3>
                <div class="helpful-sites">
                    <div class="site-item">
                        <h4>💰 캐시백 비교 사이트</h4>
                        <p>실시간 체크카드 캐시백 비교</p>
                        <a href="https://www.cardgorilla.com" target="_blank">카드고릴라 →</a>
                    </div>
                    <div class="site-item">
                        <h4>🏦 은행별 체크카드 비교</h4>
                        <p>주요 은행 체크카드 혜택 비교</p>
                        <a href="https://finlife.fss.or.kr" target="_blank">금융감독원 →</a>
                    </div>
                </div>
            </div>
        `,
        tips: [
            "캐시백 적립 한도를 확인하세요",
            "여러 카드를 조합해서 사용하면 더 유리해요",
            "온라인과 오프라인 적립률을 비교해보세요"
        ]
    },
    convenience: {
        title: "📱 편의성 중시형",
        subtitle: "간편하고 스마트한 카드 사용을 선호하는 당신",
        description: `
            <div class="result-section">
                <h3>🎯 추천 체크카드 TOP 3</h3>
                <div class="card-recommendations">
                    <div class="card-item">
                        <h4>1위. 카카오뱅크 체크카드</h4>
                        <p>• 카카오페이 완벽 연동<br>• 실시간 알림 서비스<br>• 간편한 한도 설정<br>• <a href="https://www.kakaobank.com" target="_blank">신청하기 →</a></p>
                    </div>
                    <div class="card-item">
                        <h4>2위. 토스뱅크 체크카드</h4>
                        <p>• 직관적인 앱 인터페이스<br>• 즉시 카드 발급<br>• 가계부 자동 연동<br>• <a href="https://www.tossbank.com" target="_blank">신청하기 →</a></p>
                    </div>
                    <div class="card-item">
                        <h4>3위. KB국민 스타뱅킹 체크카드</h4>
                        <p>• 스타뱅킹 앱 연동<br>• 다양한 간편결제<br>• 전국 ATM 무료<br>• <a href="https://card.kbcard.com" target="_blank">신청하기 →</a></p>
                    </div>
                </div>
            </div>
            
            <div class="result-section">
                <h3>💡 편의성 최대화 팁</h3>
                <ul>
                    <li>모바일 앱에서 실시간 사용 내역 확인</li>
                    <li>간편결제 서비스 등록 (삼성페이, 애플페이)</li>
                    <li>자동이체와 정기결제 설정</li>
                    <li>카드 분실 시 즉시 정지 기능 활용</li>
                </ul>
            </div>

            <div class="result-section">
                <h3>📱 편의 기능 활용법</h3>
                <div class="helpful-sites">
                    <div class="site-item">
                        <h4>📲 모바일 뱅킹 가이드</h4>
                        <p>스마트 뱅킹 완벽 활용법</p>
                        <a href="https://www.kakaobank.com/guide" target="_blank">카카오뱅크 가이드 →</a>
                    </div>
                    <div class="site-item">
                        <h4>💳 간편결제 설정법</h4>
                        <p>삼성페이, 애플페이 설정 가이드</p>
                        <a href="https://www.samsungpay.com" target="_blank">삼성페이 →</a>
                    </div>
                </div>
            </div>
        `,
        tips: [
            "모바일 앱의 알림 기능을 적극 활용하세요",
            "간편결제로 더 빠르고 안전하게 결제하세요",
            "자동가계부 기능으로 가계 관리를 효율화하세요"
        ]
    },
    premium: {
        title: "💎 프리미엄형",
        subtitle: "최고의 혜택과 서비스를 추구하는 당신",
        description: `
            <div class="result-section">
                <h3>🎯 추천 체크카드 TOP 3</h3>
                <div class="card-recommendations">
                    <div class="card-item">
                        <h4>1위. 우리 WON 체크카드</h4>
                        <p>• 모든 가맹점 2% 적립<br>• 프리미엄 부가서비스<br>• VIP 전용 혜택<br>• <a href="https://www.wooricard.com" target="_blank">신청하기 →</a></p>
                    </div>
                    <div class="card-item">
                        <h4>2위. 신한 Deep Dream 체크카드</h4>
                        <p>• 최대 1.5% 무제한 적립<br>• 해외 수수료 면제<br>• 라운지 이용 서비스<br>• <a href="https://www.shinhancard.com" target="_blank">신청하기 →</a></p>
                    </div>
                    <div class="card-item">
                        <h4>3위. 하나 Club 1Q 체크카드</h4>
                        <p>• 분기별 최대 2% 적립<br>• 프리미엄 컨시어지<br>• 골프/레저 할인<br>• <a href="https://www.hanacard.co.kr" target="_blank">신청하기 →</a></p>
                    </div>
                </div>
            </div>
            
            <div class="result-section">
                <h3>💡 프리미엄 혜택 극대화</h3>
                <ul>
                    <li>VIP 등급 유지를 위한 최소 사용금액 관리</li>
                    <li>프리미엄 부가서비스 적극 활용</li>
                    <li>해외 이용 시 수수료 혜택 확인</li>
                    <li>컨시어지 서비스로 편의성 증대</li>
                </ul>
            </div>

            <div class="result-section">
                <h3>🏆 프리미엄 서비스 안내</h3>
                <div class="helpful-sites">
                    <div class="site-item">
                        <h4>✈️ 공항 라운지 서비스</h4>
                        <p>프리미엄 카드 라운지 이용 가이드</p>
                        <a href="https://www.shinhancard.com/pconts/html/customer/service/MOBFM082.html" target="_blank">라운지 서비스 →</a>
                    </div>
                    <div class="site-item">
                        <h4>🎭 문화/레저 할인</h4>
                        <p>공연, 전시, 골프 등 프리미엄 할인</p>
                        <a href="https://www.hanacard.co.kr" target="_blank">하나카드 혜택 →</a>
                    </div>
                </div>
            </div>
        `,
        tips: [
            "연회비 대비 혜택을 계산해서 선택하세요",
            "프리미엄 서비스를 적극 활용하세요",
            "해외 이용 시 수수료 혜택을 꼭 확인하세요"
        ]
    },
    basic: {
        title: "🏦 기본 실속형",
        subtitle: "안정적이고 기본에 충실한 당신",
        description: `
            <div class="result-section">
                <h3>🎯 추천 체크카드 TOP 3</h3>
                <div class="card-recommendations">
                    <div class="card-item">
                        <h4>1위. KB국민 스타뱅킹 체크카드</h4>
                        <p>• 연회비 무료<br>• 전국 ATM 수수료 면제<br>• 기본 적립 혜택<br>• <a href="https://card.kbcard.com" target="_blank">신청하기 →</a></p>
                    </div>
                    <div class="card-item">
                        <h4>2위. 우리 플러스 체크카드</h4>
                        <p>• 수수료 면제 혜택<br>• 안정적인 서비스<br>• 전국 지점 이용<br>• <a href="https://www.wooricard.com" target="_blank">신청하기 →</a></p>
                    </div>
                    <div class="card-item">
                        <h4>3위. 신한 S-Line 체크카드</h4>
                        <p>• 기본 수수료 면제<br>• 다양한 생활 혜택<br>• 안전한 보안 시스템<br>• <a href="https://www.shinhancard.com" target="_blank">신청하기 →</a></p>
                    </div>
                </div>
            </div>
            
            <div class="result-section">
                <h3>💡 기본 혜택 활용법</h3>
                <ul>
                    <li>본인 은행 ATM 우선 이용으로 수수료 절약</li>
                    <li>기본 적립 혜택 꾸준히 활용</li>
                    <li>인터넷뱅킹으로 이체 수수료 절약</li>
                    <li>월 사용 한도 내에서 계획적 사용</li>
                </ul>
            </div>

            <div class="result-section">
                <h3>🏦 기본 서비스 가이드</h3>
                <div class="helpful-sites">
                    <div class="site-item">
                        <h4>💰 수수료 절약 가이드</h4>
                        <p>ATM, 이체 수수료 완전 절약법</p>
                        <a href="https://finlife.fss.or.kr" target="_blank">금융감독원 →</a>
                    </div>
                    <div class="site-item">
                        <h4>🏛️ 은행별 서비스 비교</h4>
                        <p>주요 은행 체크카드 기본 서비스</p>
                        <a href="https://www.cardgorilla.com" target="_blank">카드고릴라 →</a>
                    </div>
                </div>
            </div>
        `,
        tips: [
            "수수료 면제 혜택을 최대한 활용하세요",
            "기본 적립도 모으면 큰 혜택이 됩니다",
            "안전하고 안정적인 서비스가 최고의 혜택입니다"
        ]
    }
};

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('페이지 로드 완료');
    // AdSense 광고 로드
    if (typeof adsbygoogle !== 'undefined') {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
});

// 테스트 시작
function startTest() {
    console.log('테스트 시작');
    testStarted = true;
    currentQuestion = 0;
    answers = [];
    
    document.getElementById('startPage').classList.add('hidden');
    document.getElementById('testPage').classList.remove('hidden');
    
    showQuestion();
}

// 질문 표시
function showQuestion() {
    const question = questions[currentQuestion];
    const progressPercent = ((currentQuestion + 1) / questions.length) * 100;
    
    // 진행률 업데이트
    document.getElementById('progressBar').style.width = progressPercent + '%';
    document.getElementById('questionNumber').textContent = currentQuestion + 1;
    
    // 질문 제목 업데이트
    document.getElementById('questionTitle').textContent = question.question;
    
    // 답변 옵션 생성
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const answerElement = document.createElement('div');
        answerElement.className = 'answer-option';
        answerElement.onclick = () => selectAnswer(index, answer.type);
        
        answerElement.innerHTML = `
            <span class="answer-emoji">${answer.emoji}</span>
            <span class="answer-text">${answer.text}</span>
        `;
        
        answersContainer.appendChild(answerElement);
    });
}

// 답변 선택
function selectAnswer(index, type) {
    // 선택 효과
    const options = document.querySelectorAll('.answer-option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    
    // 답변 저장
    answers[currentQuestion] = type;
    
    // 3번째 질문 완료 후 중간 광고 표시 - 새로 추가
    if (currentQuestion === 2) {
        showMidAd();
    }
    
    // 잠시 후 다음 질문으로
    setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion();
        } else {
            showAnalysisPopup();
        }
    }, 500);
}

// 중간 광고 표시 함수 - 새로 추가
function showMidAd() {
    const midAd = document.querySelector('.ad-container.mid');
    if (midAd) {
        adManager.loadAd(midAd);
    }
}

// 분석 팝업 표시
function showAnalysisPopup() {
    console.log('분석 팝업 표시');
    document.getElementById('popupOverlay').classList.remove('hidden');
    document.getElementById('analysisPopup').classList.remove('hidden');
    
    // 팝업 광고 로드 - 새로 추가
    setTimeout(() => {
        const popupAd = document.querySelector('.popup-ad');
        if (popupAd && !adManager.loadedAds.has(popupAd)) {
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
                adManager.loadedAds.add(popupAd);
            } catch (e) {
                console.error('Popup ad loading error:', e);
            }
        }
    }, 100);
    
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

// 결과 분석 및 표시
function showResult() {
    console.log('결과 페이지 표시');
    
    // 팝업 닫기
    document.getElementById('popupOverlay').classList.add('hidden');
    document.getElementById('analysisPopup').classList.add('hidden');
    
    const result = analyzeAnswers();
    
    document.getElementById('testPage').classList.add('hidden');
    document.getElementById('resultPage').classList.remove('hidden');
    
    // 결과 광고 표시 - 새로 추가
    showResultAd();
    
    // 결과 표시
    document.getElementById('resultIcon').textContent = '💳';
    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('resultSubtitle').textContent = result.subtitle;
    document.getElementById('resultDescription').innerHTML = result.description;
    
    // 팁 표시
    const tipsContainer = document.getElementById('resultTips');
    tipsContainer.innerHTML = '';
    result.tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsContainer.appendChild(li);
    });
}

// 결과 광고 표시 함수 - 새로 추가
function showResultAd() {
    const resultAd = document.querySelector('.ad-container.result');
    if (resultAd) {
        adManager.loadAd(resultAd);
    }
}

// 답변 분석
function analyzeAnswers() {
    const scores = {
        cashback: 0,
        convenience: 0,
        premium: 0,
        basic: 0
    };
    
    // 답변별 점수 계산
    answers.forEach((answer, index) => {
        switch (index) {
            case 0: // 결제 방식
                if (answer === 'online') scores.convenience += 2;
                if (answer === 'offline') scores.basic += 2;
                if (answer === 'mixed') scores.cashback += 2;
                if (answer === 'cash') scores.basic += 3;
                break;
            case 1: // 사용 금액
                if (answer === 'low') scores.basic += 2;
                if (answer === 'medium') scores.cashback += 2;
                if (answer === 'high') scores.premium += 2;
                if (answer === 'vip') scores.premium += 3;
                break;
            case 2: // 중요 혜택
                if (answer === 'fee') scores.basic += 3;
                if (answer === 'reward') scores.cashback += 3;
                if (answer === 'discount') scores.premium += 2;
                if (answer === 'convenience') scores.convenience += 3;
                break;
            case 3: // 은행
                if (answer === 'internet') scores.convenience += 3;
                else scores.basic += 1;
                break;
            case 4: // ATM 사용
                if (answer === 'never') scores.convenience += 2;
                if (answer === 'frequent') scores.basic += 3;
                else scores.cashback += 1;
                break;
            case 5: // 해외 사용
                if (answer === 'frequent') scores.premium += 3;
                if (answer === 'domestic') scores.basic += 2;
                else scores.cashback += 1;
                break;
            case 6: // 선호 혜택
                if (answer === 'cafe') scores.convenience += 2;
                if (answer === 'mart') scores.cashback += 2;
                if (answer === 'transport') scores.basic += 2;
                if (answer === 'subscription') scores.premium += 2;
                break;
            case 7: // 연회비
                if (answer === 'free') scores.basic += 3;
                if (answer === 'paid') scores.cashback += 2;
                if (answer === 'limited') scores.convenience += 2;
                if (answer === 'premium') scores.premium += 3;
                break;
        }
    });
    
    // 최고 점수 타입 찾기
    let maxScore = 0;
    let resultType = 'basic';
    
    Object.keys(scores).forEach(type => {
        if (scores[type] > maxScore) {
            maxScore = scores[type];
            resultType = type;
        }
    });
    
    return resultTypes[resultType];
}

// 테스트 다시하기
function restartTest() {
    currentQuestion = 0;
    answers = [];
    testStarted = false;
    
    document.getElementById('resultPage').classList.add('hidden');
    document.getElementById('startPage').classList.remove('hidden');
}

// 결과 공유하기
function shareResult() {
    const resultTitle = document.getElementById('resultTitle').textContent;
    const url = window.location.href;
    
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        try {
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: '💳 체크카드 추천 순위 BEST 테스트',
                    description: `내 결과: ${resultTitle}\n\n나에게 딱 맞는 체크카드를 찾아보세요!`,
                    imageUrl: 'https://sd2624.github.io/체크카드추천/체크카드추천.svg',
                    link: {
                        mobileWebUrl: url,
                        webUrl: url,
                    },
                },
                buttons: [
                    {
                        title: '나도 테스트하기',
                        link: {
                            mobileWebUrl: url,
                            webUrl: url,
                        },
                    },
                ],
            });
        } catch (error) {
            console.error('카카오 공유 오류:', error);
            // 기본 클립보드 복사
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                    alert('🔗 링크가 복사되었습니다!');
                });
            }
        }
    } else {
        // 기본 클립보드 복사
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                alert('🔗 링크가 복사되었습니다!');
            });
        }
    }
}

// 페이지 로드 시 초기화 - 새로 추가
document.addEventListener('DOMContentLoaded', function() {
    // 최상단 광고 로드
    const topAd = document.querySelector('.ad-container.top');
    if (topAd) {
        adManager.loadAd(topAd);
    }
    
    // IntersectionObserver 설정
    adManager.setupIntersectionObserver();
});
