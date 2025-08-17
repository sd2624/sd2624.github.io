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

// 광고 관리자 클래스 (새로 수정)

// [광고] 페이지 로드 시 초기화 및 Kakao SDK 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded 이벤트 발생');
    
    // Kakao SDK 초기화
    if (typeof Kakao !== 'undefined') {
        if (!Kakao.isInitialized()) {
            Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
            console.log('Kakao SDK 초기화 완료');
        }
    } else {
        console.warn('Kakao SDK가 로드되지 않았습니다');
    }
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
    
    console.log('페이지 초기화 완료');
});

// 이벤트 리스너 설정 함수
function setupEventListeners() {
    console.log('이벤트 리스너 설정 중...');
    
    // 시작 버튼
    const startBtn = document.querySelector('.start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startTest);
        console.log('시작 버튼 이벤트 리스너 등록 완료');
    }
    
    // 카카오 공유 버튼들
    document.querySelectorAll('.kakao-share').forEach(btn => {
        btn.addEventListener('click', shareKakao);
    });
    
    console.log('모든 이벤트 리스너 설정 완료');
}

// 질문 데이터
const questions = [
    {
        question: "현재 나이 또는 입주 예정 나이는?",
        answers: [
            { text: "65세 미만", age: "under65", urgency: 1 },
            { text: "65~70세", age: "65-70", urgency: 2 },
            { text: "70~75세", age: "70-75", urgency: 3 },
            { text: "75~80세", age: "75-80", urgency: 4 },
            { text: "80세 이상", age: "over80", urgency: 5 }
        ]
    },
    {
        question: "현재 건강 상태는 어떠신가요?",
        answers: [
            { text: "매우 건강함 (일상생활 완전 자립)", health: "excellent", care_level: 1 },
            { text: "건강함 (가벼운 불편함)", health: "good", care_level: 2 },
            { text: "보통 (일부 도움 필요)", health: "fair", care_level: 3 },
            { text: "나쁨 (상당한 도움 필요)", health: "poor", care_level: 4 },
            { text: "매우 나쁨 (전문 케어 필요)", health: "critical", care_level: 5 }
        ]
    },
    {
        question: "희망하는 지역은 어디인가요?",
        answers: [
            { text: "서울 강남권", region: "gangnam", cost_level: 5 },
            { text: "서울 기타 지역", region: "seoul", cost_level: 4 },
            { text: "경기 남부 (성남, 분당, 용인)", region: "gyeonggi_south", cost_level: 4 },
            { text: "경기 북부 (고양, 의정부, 남양주)", region: "gyeonggi_north", cost_level: 3 },
            { text: "인천", region: "incheon", cost_level: 3 },
            { text: "지방 광역시", region: "metro", cost_level: 2 },
            { text: "기타 지방", region: "local", cost_level: 1 }
        ]
    },
    {
        question: "월 예산은 어느 정도 생각하고 계신가요?",
        answers: [
            { text: "300만원 이상", budget: "premium", level: 5 },
            { text: "200~300만원", budget: "high", level: 4 },
            { text: "150~200만원", budget: "middle", level: 3 },
            { text: "100~150만원", budget: "low", level: 2 },
            { text: "100만원 미만", budget: "basic", level: 1 }
        ]
    },
    {
        question: "보증금 준비 가능 금액은?",
        answers: [
            { text: "3억원 이상", deposit: "premium", deposit_level: 5 },
            { text: "2~3억원", deposit: "high", deposit_level: 4 },
            { text: "1~2억원", deposit: "middle", deposit_level: 3 },
            { text: "5천만원~1억원", deposit: "low", deposit_level: 2 },
            { text: "5천만원 미만", deposit: "basic", deposit_level: 1 }
        ]
    },
    {
        question: "가장 중요하게 생각하는 시설은?",
        answers: [
            { text: "의료시설 (병원, 간호)", priority: "medical", importance: 5 },
            { text: "생활편의시설 (식당, 마트)", priority: "convenience", importance: 4 },
            { text: "문화시설 (도서관, 공연장)", priority: "culture", importance: 3 },
            { text: "운동시설 (헬스장, 수영장)", priority: "fitness", importance: 4 },
            { text: "사회활동시설 (동호회, 모임)", priority: "social", importance: 3 }
        ]
    },
    {
        question: "선호하는 실버타운 유형은?",
        answers: [
            { text: "고급형 (프리미엄 서비스)", type: "luxury", service_level: 5 },
            { text: "의료형 (의료서비스 중심)", type: "medical", service_level: 4 },
            { text: "활동형 (액티비티 중심)", type: "active", service_level: 3 },
            { text: "경제형 (기본 서비스)", type: "economy", service_level: 2 },
            { text: "가족형 (가족과 함께)", type: "family", service_level: 3 }
        ]
    },
    {
        question: "언제까지 입주를 계획하고 계신가요?",
        answers: [
            { text: "즉시 (3개월 내)", timing: "immediate", urgency_score: 5 },
            { text: "6개월 내", timing: "soon", urgency_score: 4 },
            { text: "1년 내", timing: "planned", urgency_score: 3 },
            { text: "2~3년 내", timing: "future", urgency_score: 2 },
            { text: "아직 확정되지 않음", timing: "undecided", urgency_score: 1 }
        ]
    }
];

// 실버타운 비용 정보
const silverTownInfo = {
    "프리미엄형": {
        name: "프리미엄형 실버타운",
        depositRange: "2~5억원",
        monthlyRange: "200~400만원",
        facilities: [
            {
                rank: 1,
                name: "서울 강남 시니어스토리",
                description: "강남 최고급 실버타운으로 5성급 호텔 수준의 서비스를 제공합니다.",
                features: ["24시간 의료진", "5성급 서비스", "개인 버틀러", "고급 레스토랑"],
                deposit: "3~5억원",
                monthly: "300~500만원",
                location: "서울 강남구"
            },
            {
                rank: 2,
                name: "분당 로얄시니어타운",
                description: "자연과 도시의 조화로운 환경에서 품격 있는 노후를 보장합니다.",
                features: ["병원 직결", "골프연습장", "문화센터", "24시간 보안"],
                deposit: "2~3억원",
                monthly: "250~350만원",
                location: "경기 성남시"
            },
            {
                rank: 3,
                name: "일산 그랜드시니어",
                description: "의료진과 호텔리어가 함께하는 새로운 개념의 실버타운입니다.",
                features: ["종합병원 인접", "프리미엄 식사", "개인 케어", "문화 프로그램"],
                deposit: "1.5~2.5억원",
                monthly: "200~300만원",
                location: "경기 고양시"
            }
        ]
    },
    "의료중심형": {
        name: "의료중심형 실버타운",
        depositRange: "1~3억원",
        monthlyRange: "150~250만원",
        facilities: [
            {
                rank: 1,
                name: "서울 메디컬시니어타운",
                description: "대학병원과 연계된 전문 의료 서비스 중심의 실버타운입니다.",
                features: ["대학병원 연계", "전문의 상주", "재활치료", "응급의료"],
                deposit: "2~3억원",
                monthly: "200~280만원",
                location: "서울 강동구"
            },
            {
                rank: 2,
                name: "부천 힐링케어타운",
                description: "치매 전문 케어와 재활 프로그램이 특화된 의료형 시설입니다.",
                features: ["치매 전문케어", "물리치료", "작업치료", "간호사 24시간"],
                deposit: "1.5~2억원",
                monthly: "150~200만원",
                location: "경기 부천시"
            },
            {
                rank: 3,
                name: "인천 실버메디케어",
                description: "종합병원 부설로 안전하고 전문적인 의료 서비스를 제공합니다.",
                features: ["병원 부설", "정기 건강검진", "약물 관리", "영양 상담"],
                deposit: "1~1.5억원",
                monthly: "120~180만원",
                location: "인천 연수구"
            }
        ]
    },
    "활동중심형": {
        name: "활동중심형 실버타운",
        depositRange: "8천만원~2억원",
        monthlyRange: "100~200만원",
        facilities: [
            {
                rank: 1,
                name: "용인 액티브시니어빌",
                description: "다양한 취미활동과 사회활동이 가능한 활기찬 실버타운입니다.",
                features: ["골프장", "수영장", "도서관", "동호회 활동"],
                deposit: "1.5~2억원",
                monthly: "150~200만원",
                location: "경기 용인시"
            },
            {
                rank: 2,
                name: "화성 라이프타운",
                description: "자연 친화적 환경에서 건강한 여가생활을 즐길 수 있습니다.",
                features: ["등산로", "텃밭", "문화센터", "카페"],
                deposit: "1~1.5억원",
                monthly: "120~160만원",
                location: "경기 화성시"
            },
            {
                rank: 3,
                name: "안양 해피시니어",
                description: "도심 접근성이 좋으면서 다양한 액티비티를 제공하는 시설입니다.",
                features: ["헬스장", "당구장", "노래방", "요리교실"],
                deposit: "8천만원~1.2억원",
                monthly: "100~140만원",
                location: "경기 안양시"
            }
        ]
    },
    "경제형": {
        name: "경제형 실버타운",
        depositRange: "3천만원~1억원",
        monthlyRange: "80~150만원",
        facilities: [
            {
                rank: 1,
                name: "평택 실버홈타운",
                description: "합리적인 비용으로 기본적인 생활 서비스를 제공하는 실버타운입니다.",
                features: ["기본 의료", "식사 제공", "청소 서비스", "버스 운행"],
                deposit: "8천만원~1억원",
                monthly: "120~150만원",
                location: "경기 평택시"
            },
            {
                rank: 2,
                name: "천안 실버빌리지",
                description: "경제적이면서도 쾌적한 환경의 지방형 실버타운입니다.",
                features: ["기본 케어", "공동 식당", "세탁 서비스", "주변 병원 연계"],
                deposit: "5천만원~8천만원",
                monthly: "100~130만원",
                location: "충남 천안시"
            },
            {
                rank: 3,
                name: "청주 그린타운",
                description: "자연환경이 좋고 비용 부담이 적은 지방 실버타운입니다.",
                features: ["자연환경", "기본 서비스", "건강관리", "교통 지원"],
                deposit: "3천만원~6천만원",
                monthly: "80~110만원",
                location: "충북 청주시"
            }
        ]
    }
};

// 결과 타입 정의
const resultTypes = {
    "프리미엄형": {
        title: "👑 프리미엄형 실버타운",
        subtitle: "최고급 서비스와 시설을 원하시는 분께!",
        badge: "🏆",
        bgColor: "linear-gradient(45deg, #74b9ff, #0984e3)",
        description: "높은 예산과 보증금으로 최상급 서비스와 시설을 이용할 수 있는 프리미엄 실버타운을 추천합니다.",
        category: "프리미엄형"
    },
    "의료중심형": {
        title: "🏥 의료중심형 실버타운",
        subtitle: "건강과 의료 서비스가 최우선!",
        badge: "⚕️",
        bgColor: "linear-gradient(45deg, #00b894, #00cec9)",
        description: "건강 상태나 의료 서비스를 중시하는 분들을 위한 의료 전문 실버타운을 추천합니다.",
        category: "의료중심형"
    },
    "활동중심형": {
        title: "🎯 활동중심형 실버타운",
        subtitle: "활기찬 노후를 위한 최적의 선택!",
        badge: "🏃",
        bgColor: "linear-gradient(45deg, #fdcb6e, #e17055)",
        description: "건강하고 활동적인 생활을 원하는 분들을 위한 다양한 액티비티 중심의 실버타운을 추천합니다.",
        category: "활동중심형"
    },
    "경제형": {
        title: "💰 경제형 실버타운",
        subtitle: "합리적인 비용으로 품질 좋은 서비스!",
        badge: "💡",
        bgColor: "linear-gradient(45deg, #a29bfe, #6c5ce7)",
        description: "경제적 부담을 줄이면서도 필요한 서비스를 받을 수 있는 합리적인 실버타운을 추천합니다.",
        category: "경제형"
    }
};

let currentQuestionIndex = 0;
let userAnswers = [];
let totalScore = 0;
let analysisData = {};

// DOM 요소
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const analysisModal = document.getElementById('analysisModal');

// 시작 함수
function startTest() {
    currentQuestionIndex = 0;
    userAnswers = [];
    totalScore = 0;
    analysisData = {};
    
    // 모든 광고 숨기기 (새 테스트 시작 시)
    adManager.hideAllAds();
    
    if (startPage) startPage.classList.add('hidden');
    if (questionPage) questionPage.classList.remove('hidden');
    
    showQuestion();
}

// 질문 표시 함수
function showQuestion() {
    console.log(`질문 ${currentQuestionIndex + 1} 표시 중...`);
    
    const progressBar = document.querySelector('.progress-bar');
    const currentQ = document.querySelector('.current-q');
    const totalQ = document.querySelector('.total-q');
    const questionTitle = document.querySelector('.question-title');
    const questionOptions = document.querySelector('.question-options');
    
    // 진행률 업데이트
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    if (progressBar) progressBar.style.width = progress + '%';
    if (currentQ) currentQ.textContent = currentQuestionIndex + 1;
    if (totalQ) totalQ.textContent = questions.length;
    
    // 3번째 질문 이후 중간 광고 표시
    if (currentQuestionIndex >= 2) {
        adManager.showMidAd();
    }
    
    // 질문과 옵션 표시
    const currentQuestion = questions[currentQuestionIndex];
    if (questionTitle) questionTitle.textContent = currentQuestion.question;
    
    if (questionOptions) {
        questionOptions.innerHTML = '';
        currentQuestion.answers.forEach((answer, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';
            optionElement.textContent = answer.text;
            optionElement.onclick = () => selectAnswer(answer, index);
            questionOptions.appendChild(optionElement);
        });
    }
}

// 답변 선택 함수
function selectAnswer(answer, index) {
    // 선택된 답변 저장
    userAnswers[currentQuestionIndex] = answer;
    
    // 점수 계산
    let questionScore = 0;
    Object.keys(answer).forEach(key => {
        if (typeof answer[key] === 'number') {
            questionScore += answer[key];
        }
    });
    
    if (userAnswers.length > currentQuestionIndex + 1) {
        // 이전 답변이 있었다면 점수에서 차감
        let prevScore = 0;
        const prevAnswer = userAnswers[currentQuestionIndex];
        Object.keys(prevAnswer).forEach(key => {
            if (typeof prevAnswer[key] === 'number') {
                prevScore += prevAnswer[key];
            }
        });
        totalScore = totalScore - prevScore + questionScore;
    } else {
        totalScore += questionScore;
    }
    
    // 시각적 피드백
    const options = document.querySelectorAll('.option-item');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    
    // 다음 질문으로 이동
    setTimeout(() => {
        currentQuestionIndex++;
        
        // 3번째 질문 완료 후 중간 광고 표시 (새로 추가)
        if (currentQuestionIndex === 3) {
            adManager.showMidAd();
        }
        
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showAnalysisModal();
        }
    }, 600);
}

// 분석 모달 표시
function showAnalysisModal() {
    if (questionPage) questionPage.classList.add('hidden');
    if (analysisModal) analysisModal.classList.remove('hidden');
    
    // 카운트다운 시작
    let countdown = 6;
    const countdownTimer = document.querySelector('.countdown-timer');
    
    const timer = setInterval(() => {
        if (countdownTimer) countdownTimer.textContent = countdown;
        countdown--;
        
        if (countdown < 0) {
            clearInterval(timer);
            analyzeResults();
            showResults();
        }
    }, 1000);
}

// 결과 분석 함수
function analyzeResults() {
    // 사용자 선택 분석
    let budgetLevel = 0;
    let healthLevel = 0;
    let regionLevel = 0;
    let priorityType = null;
    let silverTownType = null;
    
    userAnswers.forEach(answer => {
        if (answer.level) budgetLevel += answer.level;
        if (answer.deposit_level) budgetLevel += answer.deposit_level;
        if (answer.care_level) healthLevel += answer.care_level;
        if (answer.cost_level) regionLevel += answer.cost_level;
        if (answer.priority) priorityType = answer.priority;
        if (answer.type) silverTownType = answer.type;
    });
    
    // 결과 타입 결정
    let resultType;
    
    if (budgetLevel >= 8 && regionLevel >= 4) {
        resultType = "프리미엄형";
    } else if (healthLevel >= 6 || priorityType === 'medical') {
        resultType = "의료중심형";
    } else if (silverTownType === 'active' || priorityType === 'fitness' || priorityType === 'social') {
        resultType = "활동중심형";
    } else if (budgetLevel <= 4 || regionLevel <= 2) {
        resultType = "경제형";
    } else {
        resultType = "활동중심형";
    }
    
    analysisData = {
        resultType: resultType,
        totalScore: totalScore,
        budgetLevel: budgetLevel,
        healthLevel: healthLevel,
        regionLevel: regionLevel,
        priorityType: priorityType,
        silverTownType: silverTownType
    };
}

// 결과 표시 함수
function showResults() {
    if (analysisModal) analysisModal.classList.add('hidden');
    if (resultPage) resultPage.classList.remove('hidden');
    
    const result = resultTypes[analysisData.resultType];
    const facilityInfo = silverTownInfo[result.category];
    
    // 결과 페이지 광고 표시 (새로 수정)
    setTimeout(() => {
        adManager.showResultAd();
    }, 500);
    
    // 결과 헤더 업데이트
    const resultBadge = document.querySelector('.result-badge');
    const resultTitle = document.querySelector('.result-title');
    const resultSubtitle = document.querySelector('.result-subtitle');
    
    if (resultBadge) {
        resultBadge.style.background = result.bgColor;
        resultBadge.innerHTML = `<div class="badge-icon">${result.badge}</div>`;
    }
    
    if (resultTitle) resultTitle.textContent = result.title;
    if (resultSubtitle) resultSubtitle.textContent = result.subtitle;
    
    // 결과 내용 업데이트
    const costSummary = document.querySelector('.cost-summary');
    const recommendedFacilities = document.querySelector('.recommended-facilities');
    const additionalInfo = document.querySelector('.additional-info');
    
    if (costSummary) {
        costSummary.innerHTML = `
            <p><strong>${result.description}</strong></p>
            <div class="cost-breakdown">
                <div class="cost-item">
                    <div class="cost-label">입주보증금</div>
                    <div class="cost-amount">${facilityInfo.depositRange}</div>
                </div>
                <div class="cost-item">
                    <div class="cost-label">월 이용료</div>
                    <div class="cost-amount">${facilityInfo.monthlyRange}</div>
                </div>
            </div>
            <p style="margin-top: 15px; color: #4A90E2; font-weight: 600;">
                추천 ${facilityInfo.name} <span style="font-size: 1.1em; color: #e17055;">${facilityInfo.facilities.length}곳</span>
            </p>
        `;
    }
    
    if (recommendedFacilities) {
        recommendedFacilities.innerHTML = `
            <h4 style="color: #4A90E2; margin-bottom: 20px;">🏆 추천 실버타운 TOP 3</h4>
            ${facilityInfo.facilities.map(facility => `
                <div class="facility-item">
                    <div class="facility-header">
                        <div class="facility-rank">${facility.rank}</div>
                        <div class="facility-name">${facility.name}</div>
                    </div>
                    <div class="facility-description">${facility.description}</div>
                    <div class="facility-features">
                        ${facility.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                    <div class="facility-cost">
                        📍 ${facility.location} | 💰 보증금: ${facility.deposit} | 📅 월비용: ${facility.monthly}
                    </div>
                </div>
            `).join('')}
        `;
    }
    
    if (additionalInfo) {
        additionalInfo.innerHTML = `
            <div style="margin-top: 25px; padding: 20px; background: rgba(137, 207, 240, 0.1); border-radius: 15px;">
                <h5 style="color: #4A90E2; margin-bottom: 12px;">💡 실버타운 선택 가이드</h5>
                <ul style="font-size: 0.9em; color: #2d3436; line-height: 1.6; list-style: none; padding: 0;">
                    <li style="margin: 8px 0;">• <strong>사전 방문:</strong> 반드시 직접 시설을 둘러보고 체험해보세요</li>
                    <li style="margin: 8px 0;">• <strong>계약 조건:</strong> 입주 조건, 퇴거 규정, 환불 규정을 꼼꼼히 확인하세요</li>
                    <li style="margin: 8px 0;">• <strong>의료 서비스:</strong> 인근 병원과의 연계 시스템을 확인하세요</li>
                    <li style="margin: 8px 0;">• <strong>추가 비용:</strong> 기본 비용 외 발생할 수 있는 추가 비용을 문의하세요</li>
                </ul>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: rgba(253, 203, 110, 0.1); border-radius: 10px; border-left: 4px solid #fdcb6e;">
                <h6 style="color: #e17055; margin-bottom: 8px;">⚠️ 선택 시 주의사항</h6>
                <p style="font-size: 0.85em; color: #2d3436; line-height: 1.5; margin: 0;">
                    실버타운 비용은 지역, 시설, 서비스 수준에 따라 크게 차이날 수 있습니다. 
                    여러 곳을 비교 검토하시고, 가족과 충분히 상의한 후 결정하시기 바랍니다.
                </p>
            </div>
        `;
    }
}

// 테스트 재시작 함수
function restartTest() {
    currentQuestionIndex = 0;
    userAnswers = [];
    totalScore = 0;
    analysisData = {};
    
    if (resultPage) resultPage.classList.add('hidden');
    if (startPage) startPage.classList.remove('hidden');
}

// 카카오톡 공유 함수
function shareKakao() {
    const result = resultTypes[analysisData.resultType];
    const facilityInfo = silverTownInfo[result.category];
    
    const title = result ? result.title : '실버타운 가격 비교 & 보증금 안내';
    const description = result ? 
        `${result.subtitle} - ${facilityInfo.name} 추천!` : 
        '나에게 맞는 실버타운 비용을 확인해보세요!';
    
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '실버타운 가격 비교 & 보증금 안내',
                description: `${title} - ${description}`,
                imageUrl: window.location.origin + '/실버타운/실버타운.svg',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
            buttons: [
                {
                    title: '테스트 하기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });
    } else {
        // 대체 공유 방법
        const text = `실버타운 가격 비교 & 보증금 안내 - ${title}`;
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: text,
                url: url
            });
        } else {
            navigator.clipboard.writeText(`${text} ${url}`).then(() => {
                alert('링크가 클립보드에 복사되었습니다!');
            });
        }
    }
}

// startTest 함수에 디버깅 로그 추가
function startTest() {
    console.log('실버타운 테스트 시작 함수 호출됨');
    
    // 변수 초기화
    currentQuestionIndex = 0;
    userProfile = {
        age: '',
        financial: 0,
        health: 0,
        social: 0,
        urgency: 0,
        location: '',
        lifestyle: ''
    };
    totalScore = 0;
    
    console.log('실버타운 테스트 시작 - 변수 초기화 완료');
    
    // 페이지 전환
    document.getElementById('startPage').classList.add('hidden');
    document.getElementById('questionPage').classList.remove('hidden');
    
    showQuestion();
}

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('analysisModal');
        const questionPage = document.getElementById('questionPage');
        
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            if (questionPage) questionPage.classList.remove('hidden');
        }
    }
    
    // 숫자 키로 답변 선택
    if (questionPage && !questionPage.classList.contains('hidden')) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 5) {
            const options = document.querySelectorAll('.option-item');
            if (options[num - 1]) {
                options[num - 1].click();
            }
        }
    }
});

// 화면 크기 변경 대응
window.addEventListener('resize', function() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// 초기 실행
window.addEventListener('load', function() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // 광고 관리자 초기화 (새로 추가)
    setTimeout(() => {
        adManager.init();
    }, 1000);
});

// 전역 함수로 노출
window.startTest = startTest;
window.restartTest = restartTest;

// 광고 관련 함수들 (새로 추가)
function initializeAds() {
    // Google AdSense 스크립트가 로드된 후 광고 푸시
    if (typeof adsbygoogle !== 'undefined') {
        const ads = document.querySelectorAll('.adsbygoogle');
        ads.forEach(ad => {
            if (!ad.getAttribute('data-adsbygoogle-status')) {
                (adsbygoogle = window.adsbygoogle || []).push({});
            }
        });
    }
}

// AdSense 스크립트 로드 후 광고 초기화 (새로 추가)
document.addEventListener('DOMContentLoaded', initializeAds);
window.shareKakao = shareKakao;

// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    adManager.loadAd('adTop');
    setupAdObservers();
});
