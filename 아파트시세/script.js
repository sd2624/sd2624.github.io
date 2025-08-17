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

// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// [AdManager] 광고 동적 로딩 및 중복 방지 클래스

const questions = [
    {
        question: "관심 있는 지역은 어디인가요?",
        answers: [
            { text: "서울 강남권 (강남, 서초, 송파, 강동)", region: "gangnam", priority: 5 },
            { text: "서울 강북권 (강북, 성북, 도봉, 노원)", region: "gangbuk", priority: 4 },
            { text: "서울 서부권 (마포, 서대문, 은평, 종로)", region: "seobu", priority: 4 },
            { text: "경기 남부 (성남, 용인, 수원, 화성)", region: "gyeonggi_south", priority: 4 },
            { text: "경기 북부 (고양, 파주, 의정부, 남양주)", region: "gyeonggi_north", priority: 3 },
            { text: "인천/부천/광명", region: "incheon", priority: 3 },
            { text: "지방 광역시 (부산, 대구, 대전, 광주)", region: "metro", priority: 2 },
            { text: "기타 지방 (강원, 충청, 전라, 경상)", region: "local", priority: 1 }
        ]
    },
    {
        question: "주로 확인하고 싶은 정보는?",
        answers: [
            { text: "실거래가 (최근 거래된 가격)", info_type: "real_price", need: 5 },
            { text: "시세 동향 (가격 변화 추이)", info_type: "trend", need: 4 },
            { text: "매물 정보 (현재 판매중인 아파트)", info_type: "listing", need: 4 },
            { text: "투자 분석 (수익률, 전망)", info_type: "investment", need: 3 },
            { text: "주변 시설 (교통, 학군, 편의시설)", info_type: "facility", need: 2 }
        ]
    },
    {
        question: "예산 범위는 어느 정도인가요?",
        answers: [
            { text: "10억 이상 (고급 아파트)", budget: "premium", level: 5 },
            { text: "5~10억 (중고급 아파트)", budget: "high", level: 4 },
            { text: "3~5억 (일반 아파트)", budget: "middle", level: 3 },
            { text: "1~3억 (소형 아파트)", budget: "low", level: 2 },
            { text: "1억 미만 (원룸, 오피스텔)", budget: "very_low", level: 1 }
        ]
    },
    {
        question: "부동산 정보 이용 목적은?",
        answers: [
            { text: "실제 매수 예정 (3개월 내)", purpose: "buying", urgency: 5 },
            { text: "매도 준비 (현재 소유 아파트)", purpose: "selling", urgency: 4 },
            { text: "투자 검토 (수익형 부동산)", purpose: "investment", urgency: 3 },
            { text: "시세 궁금 (일반적 관심)", purpose: "interest", urgency: 2 },
            { text: "학습/연구 목적", purpose: "study", urgency: 1 }
        ]
    },
    {
        question: "선호하는 정보 제공 방식은?",
        answers: [
            { text: "상세한 차트와 그래프", style: "detailed", complexity: 4 },
            { text: "간단한 요약 정보", style: "simple", complexity: 2 },
            { text: "전문가 분석 리포트", style: "expert", complexity: 5 },
            { text: "실시간 알림 서비스", style: "realtime", complexity: 3 }
        ]
    },
    {
        question: "모바일 이용 빈도는?",
        answers: [
            { text: "주로 모바일로 확인", mobile: "high", convenience: 4 },
            { text: "PC와 모바일 반반", mobile: "medium", convenience: 3 },
            { text: "주로 PC로 확인", mobile: "low", convenience: 2 },
            { text: "상관없음", mobile: "any", convenience: 3 }
        ]
    },
    {
        question: "부동산 정보 확인 경험은?",
        answers: [
            { text: "전문가 수준 (업계 종사자)", experience: "expert", sophistication: 5 },
            { text: "상당한 경험 (다수 거래)", experience: "experienced", sophistication: 4 },
            { text: "보통 수준 (몇 번 경험)", experience: "intermediate", sophistication: 3 },
            { text: "초보자 (처음 또는 적음)", experience: "beginner", sophistication: 1 }
        ]
    }
];

// 아파트 시세 사이트 정보
const apartmentSites = {
    "premium_comprehensive": {
        name: "부동산 전문 종합 패키지",
        sites: [
            {
                rank: 1,
                name: "KB부동산 Liiv ON",
                description: "KB국민은행의 부동산 플랫폼으로 정확한 시세와 실거래가 정보를 제공합니다.",
                features: ["KB시세", "실거래가", "아파트 단지정보", "대출상담"],
                url: "https://onland.kbstar.com",
                strength: "금융기관 데이터 기반 신뢰성"
            },
            {
                rank: 2,
                name: "네이버 부동산",
                description: "가장 많이 사용되는 부동산 포털로 실시간 매물과 시세 정보를 제공합니다.",
                features: ["실시간 매물", "시세그래프", "호재정보", "단지정보"],
                url: "https://land.naver.com",
                strength: "풍부한 매물 정보와 직관적 UI"
            },
            {
                rank: 3,
                name: "다음 부동산",
                description: "카카오의 부동산 서비스로 지도 기반의 편리한 검색을 제공합니다.",
                features: ["지도검색", "실거래가", "시세동향", "관심지역"],
                url: "https://realty.daum.net",
                strength: "지도 기반 직관적 검색"
            },
            {
                rank: 4,
                name: "부동산114",
                description: "오랜 역사의 부동산 전문 사이트로 상세한 시장 분석을 제공합니다.",
                features: ["시장분석", "실거래가", "분양정보", "전문가리포트"],
                url: "https://www.r114.com",
                strength: "전문적인 시장 분석 리포트"
            },
            {
                rank: 5,
                name: "직방",
                description: "모바일 최적화된 부동산 앱으로 간편한 매물 검색을 제공합니다.",
                features: ["모바일최적화", "VR투어", "실시간채팅", "가격분석"],
                url: "https://www.zigbang.com",
                strength: "모바일 친화적 인터페이스"
            }
        ]
    },
    "seoul_premium": {
        name: "서울 강남권 전문",
        sites: [
            {
                rank: 1,
                name: "KB부동산 Liiv ON",
                description: "강남권 고급 아파트 시세 정보에 특화된 금융기관 플랫폼입니다.",
                features: ["KB시세", "고급아파트", "투자분석", "대출상담"],
                url: "https://onland.kbstar.com",
                strength: "고급 아파트 전문 시세 분석"
            },
            {
                rank: 2,
                name: "부동산114",
                description: "강남권 프리미엄 아파트의 상세한 시장 동향을 제공합니다.",
                features: ["프리미엄분석", "투자리포트", "전망분석", "전문가상담"],
                url: "https://www.r114.com",
                strength: "강남권 전문 투자 분석"
            },
            {
                rank: 3,
                name: "네이버 부동산",
                description: "강남권 실시간 매물과 정확한 시세 정보를 제공합니다.",
                features: ["실시간매물", "시세그래프", "단지정보", "호재분석"],
                url: "https://land.naver.com",
                strength: "실시간 매물 업데이트"
            },
            {
                rank: 4,
                name: "아파트실거래가",
                description: "정부 공식 실거래가 데이터를 기반으로 한 정확한 정보를 제공합니다.",
                features: ["공식실거래가", "동향분석", "가격예측", "비교분석"],
                url: "https://rt.molit.go.kr",
                strength: "정부 공식 데이터 기반"
            },
            {
                rank: 5,
                name: "부동산써브",
                description: "강남권 전문 부동산 정보와 투자 컨설팅을 제공합니다.",
                features: ["전문상담", "투자컨설팅", "시장분석", "맞춤추천"],
                url: "https://www.serve.co.kr",
                strength: "전문가 투자 컨설팅"
            }
        ]
    },
    "metropolitan": {
        name: "수도권 종합 추천",
        sites: [
            {
                rank: 1,
                name: "네이버 부동산",
                description: "수도권 전체 지역의 가장 포괄적인 부동산 정보를 제공합니다.",
                features: ["전지역커버", "실시간매물", "시세동향", "교통정보"],
                url: "https://land.naver.com",
                strength: "수도권 전 지역 포괄적 정보"
            },
            {
                rank: 2,
                name: "KB부동산 Liiv ON",
                description: "수도권 아파트의 정확한 시세와 금융 정보를 함께 제공합니다.",
                features: ["정확한시세", "대출정보", "투자분석", "지역별분석"],
                url: "https://onland.kbstar.com",
                strength: "금융 연계 서비스"
            },
            {
                rank: 3,
                name: "다음 부동산",
                description: "수도권 지역의 지도 기반 부동산 검색에 최적화되어 있습니다.",
                features: ["지도검색", "교통분석", "개발계획", "생활편의"],
                url: "https://realty.daum.net",
                strength: "지역별 상세 지도 정보"
            },
            {
                rank: 4,
                name: "직방",
                description: "수도권 젊은 층에게 인기 있는 모바일 중심의 부동산 서비스입니다.",
                features: ["모바일편의", "실시간채팅", "VR투어", "가격비교"],
                url: "https://www.zigbang.com",
                strength: "모바일 최적화"
            },
            {
                rank: 5,
                name: "부동산114",
                description: "수도권 전 지역의 전문적인 시장 분석과 예측 정보를 제공합니다.",
                features: ["시장분석", "예측정보", "투자가이드", "지역전망"],
                url: "https://www.r114.com",
                strength: "전문적 시장 분석"
            }
        ]
    },
    "local_budget": {
        name: "지방/저예산 특화",
        sites: [
            {
                rank: 1,
                name: "국토교통부 실거래가",
                description: "정부에서 제공하는 공식 실거래가 정보로 가장 정확한 데이터를 제공합니다.",
                features: ["공식데이터", "무료서비스", "전국커버", "정확성"],
                url: "https://rt.molit.go.kr",
                strength: "정부 공식 데이터의 신뢰성"
            },
            {
                rank: 2,
                name: "네이버 부동산",
                description: "지방 지역까지 포괄하는 가장 많은 매물 정보를 제공합니다.",
                features: ["전국매물", "지방특화", "가격비교", "지역정보"],
                url: "https://land.naver.com",
                strength: "지방 지역 광범위한 커버리지"
            },
            {
                rank: 3,
                name: "직방",
                description: "지방 소형 아파트와 원룸 정보에 특화되어 있습니다.",
                features: ["소형아파트", "원룸특화", "저렴한매물", "간편검색"],
                url: "https://www.zigbang.com",
                strength: "소형 매물 전문"
            },
            {
                rank: 4,
                name: "다방",
                description: "지방 지역의 다양한 부동산 매물을 제공하는 통합 플랫폼입니다.",
                features: ["지방전문", "다양한매물", "중개사연결", "합리적가격"],
                url: "https://www.dabangapp.com",
                strength: "지방 지역 전문성"
            },
            {
                rank: 5,
                name: "부동산써브",
                description: "지방 부동산 투자와 저예산 구매자를 위한 전문 상담을 제공합니다.",
                features: ["투자상담", "저예산특화", "지방투자", "전문컨설팅"],
                url: "https://www.serve.co.kr",
                strength: "지방 투자 전문 컨설팅"
            }
        ]
    },
    "investment_focused": {
        name: "투자/분석 중심",
        sites: [
            {
                rank: 1,
                name: "부동산114",
                description: "가장 전문적인 부동산 투자 분석과 시장 전망을 제공합니다.",
                features: ["투자분석", "시장전망", "수익률계산", "전문가리포트"],
                url: "https://www.r114.com",
                strength: "전문적 투자 분석"
            },
            {
                rank: 2,
                name: "KB부동산 Liiv ON",
                description: "금융기관의 투자 관점에서 본 부동산 분석을 제공합니다.",
                features: ["금융분석", "투자지표", "대출연계", "수익성분석"],
                url: "https://onland.kbstar.com",
                strength: "금융 관점 투자 분석"
            },
            {
                rank: 3,
                name: "아파트투유",
                description: "아파트 투자 전문 플랫폼으로 상세한 수익률 분석을 제공합니다.",
                features: ["수익률분석", "투자가이드", "시장분석", "투자교육"],
                url: "https://www.apt2you.com",
                strength: "아파트 투자 전문"
            },
            {
                rank: 4,
                name: "네이버 부동산",
                description: "다양한 투자 정보와 시장 동향을 종합적으로 제공합니다.",
                features: ["시장동향", "투자정보", "가격분석", "호재정보"],
                url: "https://land.naver.com",
                strength: "종합적 투자 정보"
            },
            {
                rank: 5,
                name: "부동산써브",
                description: "개인 투자자를 위한 맞춤형 투자 컨설팅을 제공합니다.",
                features: ["맞춤컨설팅", "투자전략", "포트폴리오", "리스크분석"],
                url: "https://www.serve.co.kr",
                strength: "개인 맞춤 투자 전략"
            }
        ]
    }
};

// 결과 타입 정의
const resultTypes = {
    "프리미엄 종합 서비스": {
        title: "🏆 프리미엄 종합 서비스",
        subtitle: "최고 수준의 부동산 정보를 원하시는 분께!",
        badge: "👑",
        bgColor: "linear-gradient(45deg, #00b894, #00cec9)",
        description: "고급 아파트 투자나 정확한 시세 분석이 필요한 분을 위한 프리미엄 사이트들을 추천합니다.",
        category: "premium_comprehensive"
    },
    "서울 강남권 전문": {
        title: "🌟 서울 강남권 전문",
        subtitle: "강남권 부동산 전문 정보!",
        badge: "🏙️",
        bgColor: "linear-gradient(45deg, #74b9ff, #0984e3)",
        description: "서울 강남권의 고급 아파트와 프리미엄 부동산 정보에 특화된 사이트들입니다.",
        category: "seoul_premium"
    },
    "수도권 종합 추천": {
        title: "📍 수도권 종합 추천",
        subtitle: "수도권 전 지역 최적 정보!",
        badge: "🗺️",
        bgColor: "linear-gradient(45deg, #fdcb6e, #e17055)",
        description: "서울, 경기, 인천 등 수도권 전체를 아우르는 종합적인 부동산 정보를 제공합니다.",
        category: "metropolitan"
    },
    "지방/저예산 특화": {
        title: "💰 지방/저예산 특화",
        subtitle: "합리적 가격의 부동산 정보!",
        badge: "🏡",
        bgColor: "linear-gradient(45deg, #a29bfe, #6c5ce7)",
        description: "지방 지역이나 저예산으로 부동산을 찾는 분들을 위한 맞춤 사이트들입니다.",
        category: "local_budget"
    },
    "투자/분석 중심": {
        title: "📊 투자/분석 중심",
        subtitle: "전문적인 부동산 투자 분석!",
        badge: "💼",
        bgColor: "linear-gradient(45deg, #e17055, #fdcb6e)",
        description: "부동산 투자와 전문적인 시장 분석이 필요한 분들을 위한 전문 사이트들입니다.",
        category: "investment_focused"
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
    
    if (startPage) startPage.classList.add('hidden');
    if (questionPage) questionPage.classList.remove('hidden');
    
    showQuestion();
}

// 질문 표시 함수
function showQuestion() {
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
    
    // [AdManager] 3번째 질문 뒤 광고 노출
    if (window.adManager && currentQuestionIndex === 2) {
        window.adManager.showMidAd();
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
    
    // 팝업 광고 초기화
    setTimeout(() => {
        if (typeof adsbygoogle !== 'undefined') {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, 100);
    
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
    let regionType = null;
    let purposeType = null;
    let budgetLevel = 0;
    let experienceLevel = 0;
    let priorityScore = 0;
    
    userAnswers.forEach(answer => {
        if (answer.region) {
            regionType = answer.region;
        }
        if (answer.purpose) {
            purposeType = answer.purpose;
        }
        if (answer.level) {
            budgetLevel = answer.level;
        }
        if (answer.sophistication) {
            experienceLevel = answer.sophistication;
        }
        if (answer.priority) {
            priorityScore += answer.priority;
        }
        if (answer.urgency) {
            priorityScore += answer.urgency;
        }
    });
    
    // 결과 타입 결정
    let resultType;
    
    if ((regionType === 'gangnam' || budgetLevel >= 4) && experienceLevel >= 3) {
        if (purposeType === 'investment' || experienceLevel >= 4) {
            resultType = "프리미엄 종합 서비스";
        } else {
            resultType = "서울 강남권 전문";
        }
    } else if (regionType && regionType.includes('gyeonggi') || regionType === 'incheon' || regionType === 'gangbuk' || regionType === 'seobu') {
        resultType = "수도권 종합 추천";
    } else if (regionType === 'metro' || regionType === 'local' || budgetLevel <= 2) {
        resultType = "지방/저예산 특화";
    } else if (purposeType === 'investment' || purposeType === 'selling' || experienceLevel >= 4) {
        resultType = "투자/분석 중심";
    } else {
        resultType = "수도권 종합 추천";
    }
    
    analysisData = {
        resultType: resultType,
        totalScore: totalScore,
        regionType: regionType,
        purposeType: purposeType,
        budgetLevel: budgetLevel,
        experienceLevel: experienceLevel,
        priorityScore: priorityScore
    };
}

// 결과 표시 함수
function showResults() {
    if (analysisModal) analysisModal.classList.add('hidden');
    if (resultPage) resultPage.classList.remove('hidden');
    
    // [AdManager] 결과 페이지 광고 노출
    if (window.adManager) {
        window.adManager.showResultAd();
    }
    
    const result = resultTypes[analysisData.resultType];
    const siteCategory = apartmentSites[result.category];
    
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
    const sitesSummary = document.querySelector('.sites-summary');
    const recommendedSites = document.querySelector('.recommended-sites');
    const additionalInfo = document.querySelector('.additional-info');
    
    if (sitesSummary) {
        sitesSummary.innerHTML = `
            <p><strong>${result.description}</strong></p>
            <p style="margin-top: 15px; color: #0984e3; font-weight: 600;">
                총 <span style="font-size: 1.2em; color: #00b894;">${siteCategory.sites.length}개</span>의 ${siteCategory.name} 사이트를 추천합니다
            </p>
        `;
    }
    
    if (recommendedSites) {
        recommendedSites.innerHTML = `
            <h4 style="color: #0984e3; margin-bottom: 20px;">🏆 추천 사이트 TOP 5</h4>
            ${siteCategory.sites.map(site => `
                <div class="site-item">
                    <div class="site-header">
                        <div class="site-rank">${site.rank}</div>
                        <div class="site-name">${site.name}</div>
                    </div>
                    <div class="site-description">${site.description}</div>
                    <div class="site-features">
                        ${site.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <small style="color: #636e72; font-weight: 600;">💪 ${site.strength}</small>
                        <a href="${site.url}" target="_blank" class="site-link">사이트 바로가기</a>
                    </div>
                </div>
            `).join('')}
        `;
    }
    
    if (additionalInfo) {
        additionalInfo.innerHTML = `
            <div style="margin-top: 25px; padding: 20px; background: rgba(116, 185, 255, 0.1); border-radius: 15px;">
                <h5 style="color: #0984e3; margin-bottom: 12px;">💡 부동산 정보 활용 팁</h5>
                <ul style="font-size: 0.9em; color: #2d3436; line-height: 1.6; list-style: none; padding: 0;">
                    <li style="margin: 8px 0;">• <strong>실거래가 비교:</strong> 최소 3개 이상 사이트에서 확인하세요</li>
                    <li style="margin: 8px 0;">• <strong>시세 동향:</strong> 3~6개월 간의 변화 추이를 살펴보세요</li>
                    <li style="margin: 8px 0;">• <strong>정확성 검증:</strong> 국토교통부 공식 데이터와 비교하세요</li>
                    <li style="margin: 8px 0;">• <strong>종합 판단:</strong> 주변 시설, 교통, 개발 계획도 함께 고려하세요</li>
                </ul>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: rgba(253, 203, 110, 0.1); border-radius: 10px; border-left: 4px solid #fdcb6e;">
                <h6 style="color: #e17055; margin-bottom: 8px;">⚠️ 이용 시 주의사항</h6>
                <p style="font-size: 0.85em; color: #2d3436; line-height: 1.5; margin: 0;">
                    부동산 시세는 시장 상황에 따라 실시간으로 변동됩니다. 
                    실제 거래 시에는 반드시 전문가 상담을 받으시고, 
                    여러 정보원을 종합하여 신중히 판단하시기 바랍니다.
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

// 테스트 재시작 함수
function restartTest() {
    if (resultPage) resultPage.classList.add('hidden');
    if (startPage) startPage.classList.remove('hidden');
    
    currentQuestionIndex = 0;
    userAnswers = [];
    totalScore = 0;
    analysisData = {};
    
    // 진행률 초기화
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) progressBar.style.width = '0%';
}

// 카카오톡 공유 함수
function shareKakao() {
    const result = resultTypes[analysisData.resultType];
    const siteCategory = apartmentSites[result.category];
    
    const title = result ? result.title : '아파트 시세 조회 사이트 BEST 5';
    const description = result ? 
        `${result.subtitle} - ${siteCategory.name} 사이트 ${siteCategory.sites.length}개 추천!` : 
        '나에게 맞는 아파트 시세 조회 사이트를 찾아보세요!';
    
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '아파트 시세 조회 사이트 BEST 5',
                description: `${title} - ${description}`,
                imageUrl: window.location.origin + '/아파트시세/아파트시세.svg',
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
        const text = `아파트 시세 조회 사이트 BEST 5 - ${title}`;
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

// [AdManager] 광고 동적 로딩 및 중복 방지



// 전역 함수로 노출
window.startTest = startTest;
window.restartTest = restartTest;
window.shareKakao = shareKakao;
window.showDetailedSites = showDetailedSites;
window.closeSitesModal = closeSitesModal;

// 상세 사이트 정보 모달 표시
function showDetailedSites() {
    const sitesModal = document.getElementById('sitesModal');
    if (sitesModal) {
        sitesModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// 상세 사이트 정보 모달 닫기
function closeSitesModal() {
    const sitesModal = document.getElementById('sitesModal');
    if (sitesModal) {
        sitesModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// 모달 바깥 클릭 시 닫기
document.addEventListener('click', function(e) {
    const sitesModal = document.getElementById('sitesModal');
    if (sitesModal && e.target === sitesModal) {
        closeSitesModal();
    }
});

// ESC 키로 사이트 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const sitesModal = document.getElementById('sitesModal');
        if (sitesModal && !sitesModal.classList.contains('hidden')) {
            closeSitesModal();
        }
    }
});

// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
});