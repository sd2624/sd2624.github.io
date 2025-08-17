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
    
    // 중간 광고 표시
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

// 카카오 SDK 초기화
try {
    if (typeof Kakao !== 'undefined') {
        Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
        console.log('카카오 SDK 초기화 완료');
    } else {
        console.log('카카오 SDK 로드되지 않음');
    }
} catch (error) {
    console.error('카카오 SDK 초기화 오류:', error);
}

const questions = [
    {
        question: "현재 치아 상태는 어떠신가요?",
        description: "🦷 치아 상태에 따라 면책기간과 보험료가 달라집니다",
        answers: [
            { text: "매우 건강함 (6개월 내 치과 치료 없음)", condition: "excellent", score: 5, waitingPeriod: "short" },
            { text: "양호함 (1년 내 간단한 치료만)", condition: "good", score: 4, waitingPeriod: "short" },
            { text: "보통 (충치나 잇몸병 치료 경험)", condition: "fair", score: 3, waitingPeriod: "medium" },
            { text: "나쁨 (현재 치료 중이거나 필요)", condition: "poor", score: 2, waitingPeriod: "long" },
            { text: "매우 나쁨 (임플란트/틀니 필요)", condition: "very_poor", score: 1, waitingPeriod: "very_long" }
        ]
    },
    {
        question: "주로 원하는 보장 범위는?",
        description: "🔍 보장 범위에 따라 적합한 상품이 다릅니다",
        answers: [
            { text: "기본 충치 치료만", coverage: "basic", premium: "low", urgency: 1 },
            { text: "충치 + 잇몸 치료", coverage: "standard", premium: "medium", urgency: 2 },
            { text: "일반 치료 + 크라운/브릿지", coverage: "comprehensive", premium: "high", urgency: 3 },
            { text: "모든 치료 + 임플란트", coverage: "premium", premium: "very_high", urgency: 4 },
            { text: "미용 치료까지 포함", coverage: "luxury", premium: "max", urgency: 5 }
        ]
    },
    {
        question: "언제부터 보장받기를 원하시나요?",
        description: "⏰ 급할수록 면책기간이 짧은 상품을 찾아야 합니다",
        answers: [
            { text: "즉시 보장 필요 (사고 예정)", timing: "immediate", priority: 5, flexibility: "low" },
            { text: "1개월 내", timing: "asap", priority: 4, flexibility: "medium" },
            { text: "3개월 내", timing: "soon", priority: 3, flexibility: "medium" },
            { text: "6개월 내", timing: "moderate", priority: 2, flexibility: "high" },
            { text: "1년 내 (미리 준비)", timing: "planned", priority: 1, flexibility: "very_high" }
        ]
    },
    {
        question: "월 보험료 예산은 어느 정도인가요?",
        description: "💰 예산에 따라 추천 상품이 달라집니다",
        answers: [
            { text: "월 1만원 이하", budget: "very_low", level: 1, options: "limited" },
            { text: "월 1-3만원", budget: "low", level: 2, options: "basic" },
            { text: "월 3-5만원", budget: "medium", level: 3, options: "standard" },
            { text: "월 5-10만원", budget: "high", level: 4, options: "comprehensive" },
            { text: "월 10만원 이상", budget: "unlimited", level: 5, options: "premium" }
        ]
    },
    {
        question: "가입 시 가장 중요한 요소는?",
        description: "🎯 우선순위에 따라 최적 상품을 추천합니다",
        answers: [
            { text: "면책기간 최소화", priority: "waiting_period", weight: 5, factor: "speed" },
            { text: "보험료 최소화", priority: "premium", weight: 4, factor: "cost" },
            { text: "보장 범위 최대화", priority: "coverage", weight: 3, factor: "scope" },
            { text: "보험회사 신뢰성", priority: "reliability", weight: 2, factor: "trust" },
            { text: "가입 절차 간소화", priority: "convenience", weight: 1, factor: "ease" }
        ]
    },
    {
        question: "현재 나이대는?",
        description: "📅 연령에 따라 보험료와 가입 조건이 달라집니다",
        answers: [
            { text: "20대", age: "20s", riskLevel: 1, premiumRate: "low" },
            { text: "30대", age: "30s", riskLevel: 2, premiumRate: "medium" },
            { text: "40대", age: "40s", riskLevel: 3, premiumRate: "high" },
            { text: "50대", age: "50s", riskLevel: 4, premiumRate: "very_high" },
            { text: "60대 이상", age: "60plus", riskLevel: 5, premiumRate: "maximum" }
        ]
    },
    {
        question: "치과 치료 이력이 있나요?",
        description: "🏥 과거 치료 이력에 따라 가입 조건이 달라집니다",
        answers: [
            { text: "없음 (정기검진만)", history: "none", risk: 1, disclosure: "minimal" },
            { text: "스케일링/충치 치료", history: "basic", risk: 2, disclosure: "standard" },
            { text: "신경치료/크라운", history: "moderate", risk: 3, disclosure: "detailed" },
            { text: "임플란트/브릿지", history: "major", risk: 4, disclosure: "comprehensive" },
            { text: "교정/턱수술", history: "extensive", risk: 5, disclosure: "full" }
        ]
    },
    {
        question: "흡연 여부는?",
        description: "🚭 흡연은 치아건강과 보험료에 영향을 줍니다",
        answers: [
            { text: "비흡연자", smoking: "never", healthRisk: 1, premium: "standard" },
            { text: "금연 1년 이상", smoking: "quit_long", healthRisk: 2, premium: "slightly_high" },
            { text: "금연 1년 미만", smoking: "quit_recent", healthRisk: 3, premium: "high" },
            { text: "가끔 흡연 (월 1갑 이하)", smoking: "light", healthRisk: 4, premium: "very_high" },
            { text: "매일 흡연", smoking: "heavy", healthRisk: 5, premium: "maximum" }
        ]
    },
    {
        question: "직업군은?",
        description: "💼 직업에 따라 치아 손상 위험도가 다릅니다",
        answers: [
            { text: "사무직/관리직", job: "office", risk: 1, category: "low_risk" },
            { text: "서비스직/영업직", job: "service", risk: 2, category: "medium_risk" },
            { text: "의료진/교육직", job: "professional", risk: 1, category: "low_risk" },
            { text: "제조업/건설업", job: "manufacturing", risk: 4, category: "high_risk" },
            { text: "운동선수/연예인", job: "entertainment", risk: 3, category: "special_risk" }
        ]
    },
    {
        question: "치아 관리 습관은?",
        description: "🪥 일상 관리 습관이 보험료에 반영됩니다",
        answers: [
            { text: "하루 3회 이상 양치", habit: "excellent", score: 5, maintenance: "perfect" },
            { text: "하루 2회 양치", habit: "good", score: 4, maintenance: "good" },
            { text: "하루 1회 양치", habit: "average", score: 3, maintenance: "average" },
            { text: "불규칙한 양치", habit: "poor", score: 2, maintenance: "poor" },
            { text: "거의 안함", habit: "very_poor", score: 1, maintenance: "very_poor" }
        ]
    },
    {
        question: "가족력(유전적 요인)은?",
        description: "🧬 가족의 치아 건강 이력도 중요한 요소입니다",
        answers: [
            { text: "가족 모두 치아 건강", family: "excellent", genetic: 1, predisposition: "low" },
            { text: "일부 치과 치료 이력", family: "good", genetic: 2, predisposition: "medium" },
            { text: "치주질환 가족력", family: "moderate", genetic: 3, predisposition: "high" },
            { text: "심각한 치과 질환 가족력", family: "poor", genetic: 4, predisposition: "very_high" },
            { text: "잘 모름", family: "unknown", genetic: 3, predisposition: "medium" }
        ]
    },
    {
        question: "보험 가입 목적은?",
        description: "🎯 가입 목적에 따라 최적 상품이 달라집니다",
        answers: [
            { text: "예방 중심 (정기검진/스케일링)", purpose: "prevention", focus: "maintenance", coverage: "basic" },
            { text: "일반 치료 대비", purpose: "treatment", focus: "standard", coverage: "comprehensive" },
            { text: "임플란트 대비", purpose: "implant", focus: "major", coverage: "premium" },
            { text: "응급상황 대비", purpose: "emergency", focus: "urgent", coverage: "immediate" },
            { text: "종합적 보장", purpose: "comprehensive", focus: "all", coverage: "maximum" }
        ]
    },
    {
        question: "기존 보험 가입 현황은?",
        description: "📋 기존 보험과의 중복성을 확인합니다",
        answers: [
            { text: "치아보험 없음", existing: "none", overlap: 0, supplement: "full" },
            { text: "단독 치아보험 있음", existing: "dental_only", overlap: 3, supplement: "limited" },
            { text: "의료실비에 치아특약", existing: "rider", overlap: 2, supplement: "moderate" },
            { text: "종합보험에 포함", existing: "comprehensive", overlap: 4, supplement: "minimal" },
            { text: "여러 보험 중복 가입", existing: "multiple", overlap: 5, supplement: "none" }
        ]
    },
    {
        question: "선호하는 보험회사 유형은?",
        description: "🏢 보험회사 선택 기준을 알려주세요",
        answers: [
            { text: "대형 생명보험사", company: "major_life", stability: 5, service: 4 },
            { text: "손해보험사", company: "general", stability: 4, service: 4 },
            { text: "외국계 보험사", company: "foreign", stability: 3, service: 5 },
            { text: "온라인 전문", company: "online", stability: 3, service: 3 },
            { text: "상관없음 (조건 우선)", company: "any", stability: 3, service: 3 }
        ]
    },
    {
        question: "보험금 청구 편의성 중요도는?",
        description: "📱 청구 절차의 간편함을 어느 정도 중시하시나요?",
        answers: [
            { text: "매우 중요 (모바일 즉시 청구)", convenience: "critical", weight: 5, preference: "mobile" },
            { text: "중요 (온라인 청구)", convenience: "important", weight: 4, preference: "online" },
            { text: "보통 (표준 절차)", convenience: "moderate", weight: 3, preference: "standard" },
            { text: "별로 중요하지 않음", convenience: "low", weight: 2, preference: "any" },
            { text: "상관없음", convenience: "none", weight: 1, preference: "traditional" }
        ]
    },
    {
        question: "보험료 납입 방식 선호도는?",
        description: "💳 어떤 납입 방식을 선호하시나요?",
        answers: [
            { text: "월납 (부담 분산)", payment: "monthly", frequency: 12, burden: "low" },
            { text: "분기납 (할인 혜택)", payment: "quarterly", frequency: 4, burden: "medium" },
            { text: "반년납 (더 큰 할인)", payment: "semi_annual", frequency: 2, burden: "high" },
            { text: "연납 (최대 할인)", payment: "annual", frequency: 1, burden: "very_high" },
            { text: "상관없음", payment: "flexible", frequency: 0, burden: "any" }
        ]
    },
    {
        question: "치아보험 갱신 주기 선호도는?",
        description: "🔄 갱신 주기에 따라 보험료 변동성이 다릅니다",
        answers: [
            { text: "1년 갱신 (유연성 중시)", renewal: "annual", flexibility: 5, stability: 1 },
            { text: "3년 갱신 (중간)", renewal: "3year", flexibility: 3, stability: 3 },
            { text: "5년 갱신 (안정성)", renewal: "5year", flexibility: 2, stability: 4 },
            { text: "10년 이상 장기", renewal: "long_term", flexibility: 1, stability: 5 },
            { text: "상관없음", renewal: "any", flexibility: 3, stability: 3 }
        ]
    },
    {
        question: "치과 방문 빈도는?",
        description: "🏥 정기적인 치과 방문 횟수를 알려주세요",
        answers: [
            { text: "3개월마다 (정기검진)", frequency: "quarterly", prevention: 5, risk: 1 },
            { text: "6개월마다", frequency: "semi_annual", prevention: 4, risk: 2 },
            { text: "1년에 1회", frequency: "annual", prevention: 3, risk: 3 },
            { text: "문제 생길 때만", frequency: "problem_only", prevention: 2, risk: 4 },
            { text: "거의 안감", frequency: "rarely", prevention: 1, risk: 5 }
        ]
    },
    {
        question: "치아미백이나 교정에 관심이 있나요?",
        description: "✨ 미용 치료 관심도에 따라 보장 범위를 조정합니다",
        answers: [
            { text: "매우 관심 있음 (계획 중)", cosmetic: "very_interested", priority: 5, budget: "high" },
            { text: "관심 있음 (고려 중)", cosmetic: "interested", priority: 4, budget: "medium" },
            { text: "약간 관심", cosmetic: "somewhat", priority: 3, budget: "low" },
            { text: "별로 관심 없음", cosmetic: "not_much", priority: 2, budget: "minimal" },
            { text: "전혀 관심 없음", cosmetic: "none", priority: 1, budget: "zero" }
        ]
    },
    {
        question: "보험 가입 후 관리 서비스 중요도는?",
        description: "🎧 가입 후 고객 서비스의 중요성을 평가해주세요",
        answers: [
            { text: "매우 중요 (전담 상담사)", service: "premium", support: 5, expectation: "high" },
            { text: "중요 (전화/온라인 상담)", service: "standard", support: 4, expectation: "medium" },
            { text: "보통 (기본 서비스)", service: "basic", support: 3, expectation: "standard" },
            { text: "별로 중요하지 않음", service: "minimal", support: 2, expectation: "low" },
            { text: "상관없음", service: "none", support: 1, expectation: "none" }
        ]
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];

// 즉시 실행 초기화
console.log('Script 파일 로드됨!');
console.log('Questions 배열 확인:', questions ? questions.length : 'undefined');

// 전역 스코프에서 함수 테스트
window.testFunction = function() {
    console.log('전역 함수 호출 테스트 성공!');
    alert('스크립트가 정상적으로 로드되었습니다!');
};

// DOM 요소 (페이지 로드 후 재할당됨)
let startPage, questionPage, resultPage, analysisModal;

// 테스트 시작
function startTest() {
    console.log('치아보험 테스트 시작!');
    console.log('startPage 요소:', startPage);
    console.log('questionPage 요소:', questionPage);
    
    if (startPage) {
        startPage.classList.add('hidden');
        console.log('startPage 숨김 완료');
    }
    if (questionPage) {
        questionPage.classList.remove('hidden');
        console.log('questionPage 표시 완료');
    }
    
    // 총 질문 수 표시
    const totalQuestions = document.getElementById('totalQuestions');
    if (totalQuestions) {
        totalQuestions.textContent = questions.length;
        console.log('총 질문 수 설정:', questions.length);
    }
    
    currentQuestionIndex = 0;
    userAnswers = [];
    showQuestion();
}

// 전역 함수로 명시적 노출
window.startTest = startTest;

// 질문 표시
function showQuestion() {
    const question = questions[currentQuestionIndex];
    
    // 진행률 업데이트
    const progressFill = document.querySelector('.progress-fill');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    
    if (progressFill) {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    if (currentQuestionSpan) {
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
    }
    
    // 질문 내용 업데이트
    const questionTitle = document.getElementById('questionTitle');
    const questionDescription = document.getElementById('questionDescription');
    const answersContainer = document.getElementById('answersContainer');
    
    if (questionTitle) questionTitle.textContent = question.question;
    if (questionDescription) questionDescription.textContent = question.description;
    
    if (answersContainer) {
        answersContainer.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';
            answerDiv.textContent = answer.text;
            answerDiv.onclick = () => selectAnswer(answer, index);
            answersContainer.appendChild(answerDiv);
        });
    }
}

// 답변 선택
function selectAnswer(answer, index) {
    // 선택된 답변 저장
    userAnswers[currentQuestionIndex] = answer;
    
    // 시각적 피드백
    const options = document.querySelectorAll('.answer-option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    
    // 다음 질문으로 이동
    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            // 모든 질문 완료 - 분석 시작
            showAnalysisModal();
        }
    }, 500);
}

// 분석 모달 표시
function showAnalysisModal() {
    if (questionPage) questionPage.classList.add('hidden');
    if (analysisModal) analysisModal.classList.remove('hidden');
    
    // 타이머 시작
    let countdown = 6;
    const timerDisplay = document.querySelector('.timer-display');
    const steps = document.querySelectorAll('.step-item');
    
    const timer = setInterval(() => {
        if (timerDisplay) timerDisplay.textContent = countdown;
        
        // 단계별 체크 표시
        const stepIndex = 6 - countdown;
        if (steps[stepIndex]) {
            const checkElement = steps[stepIndex].querySelector('.step-check');
            if (checkElement) checkElement.textContent = '✅';
        }
        
        countdown--;
        
        if (countdown < 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);
}

// 결과 표시
function showResult() {
    if (analysisModal) analysisModal.classList.add('hidden');
    if (resultPage) resultPage.classList.remove('hidden');
    
    const result = analyzeAnswers();
    displayResult(result);
}

// 답변 분석
function analyzeAnswers() {
    console.log('전체 사용자 답변:', userAnswers);
    
    // 모든 답변 추출 (20개 질문)
    const condition = userAnswers[0];           // 치아 상태
    const coverage = userAnswers[1];            // 보장 범위
    const timing = userAnswers[2];              // 보장 시기
    const budget = userAnswers[3];              // 예산
    const priority = userAnswers[4];            // 중요 요소
    const age = userAnswers[5];                 // 나이대
    const history = userAnswers[6];             // 치료 이력
    const smoking = userAnswers[7];             // 흡연 여부
    const job = userAnswers[8];                 // 직업
    const habit = userAnswers[9];               // 관리 습관
    const family = userAnswers[10];             // 가족력
    const purpose = userAnswers[11];            // 가입 목적
    const existing = userAnswers[12];           // 기존 보험
    const company = userAnswers[13];            // 선호 보험사
    const convenience = userAnswers[14];        // 청구 편의성
    const payment = userAnswers[15];            // 납입 방식
    const renewal = userAnswers[16];            // 갱신 주기
    const frequency = userAnswers[17];          // 치과 방문 빈도
    const cosmetic = userAnswers[18];           // 미용 치료 관심
    const service = userAnswers[19];            // 관리 서비스
    
    // 종합 점수 계산
    const healthScore = condition ? condition.score : 3;
    const urgencyScore = timing ? timing.priority : 2;
    const budgetLevel = budget ? budget.level : 3;
    const riskScore = calculateRiskScore(age, smoking, job, habit, family);
    const preferenceScore = calculatePreferenceScore(priority, convenience, service);
    
    // 종합 위험도 계산
    const totalRisk = riskScore + (5 - healthScore) + (age ? age.riskLevel : 3);
    
    // 면책기간 결정
    let waitingPeriod = "3-6개월";
    let recommendation = "";
    let tips = [];
    
    if (urgencyScore >= 4 && healthScore >= 4) {
        waitingPeriod = "즉시 (사고성) / 90일 (일반)";
        recommendation = "우수 건강 상태 - 즉시 보장 가능";
        tips.push("사고성 치아손상 즉시 보장");
        tips.push("일반 치료도 90일 단축 가능");
        tips.push("건강검진서 제출로 추가 단축");
    } else if (healthScore >= 4 && totalRisk <= 8) {
        waitingPeriod = "90일";
        recommendation = "건강 우수자 - 면책기간 단축";
        tips.push("건강검진서 제출로 면책기간 단축");
        tips.push("온라인 가입 시 10-15% 할인");
        tips.push("가족 단체 가입 추가 할인");
    } else if (urgencyScore >= 4) {
        waitingPeriod = "즉시 (사고성) / 6개월 (일반)";
        recommendation = "응급 대비 - 사고성 치아보험";
        tips.push("사고성 치아손상은 즉시 보장");
        tips.push("일반 치료는 6개월 대기");
        tips.push("면책기간 단축 특약 추가 고려");
    } else if (totalRisk <= 10) {
        waitingPeriod = "3-6개월";
        recommendation = "표준 치아보험 적합";
        tips.push("면책기간 단축 특약 고려");
        tips.push("정기 검진 할인 혜택 활용");
        tips.push("자동차보험 통합 할인");
    } else if (totalRisk <= 15) {
        waitingPeriod = "6-12개월";
        recommendation = "고위험군 - 장기 대기";
        tips.push("치료 후 가입 권장");
        tips.push("금연/금주로 보험료 절약");
        tips.push("건강검진 우수자 할인 준비");
    } else {
        waitingPeriod = "12개월 이상";
        recommendation = "최고위험군 - 가입 제한 가능";
        tips.push("치과 치료 완료 후 가입");
        tips.push("생활습관 개선 후 재도전");
        tips.push("실손보험 치아특약 고려");
    }
    
    // 추가 팁 계산
    addPersonalizedTips(tips, {
        budget, payment, renewal, frequency, cosmetic, 
        company, convenience, purpose, existing
    });
    
    return {
        waitingPeriod,
        recommendation,
        tips,
        healthScore,
        urgencyScore,
        budgetLevel,
        riskScore,
        totalRisk,
        preferenceScore
    };
}

// 위험 점수 계산 함수
function calculateRiskScore(age, smoking, job, habit, family) {
    let score = 0;
    
    if (age) score += age.riskLevel || 0;
    if (smoking) score += smoking.healthRisk || 0;
    if (job) score += job.risk || 0;
    if (habit) score += (6 - (habit.score || 3));
    if (family) score += family.genetic || 0;
    
    return score;
}

// 선호도 점수 계산 함수
function calculatePreferenceScore(priority, convenience, service) {
    let score = 0;
    
    if (priority) score += priority.weight || 0;
    if (convenience) score += convenience.weight || 0;
    if (service) score += service.support || 0;
    
    return score;
}

// 개인화된 팁 추가 함수
function addPersonalizedTips(tips, preferences) {
    const { budget, payment, renewal, frequency, cosmetic, company, convenience, purpose, existing } = preferences;
    
    // 예산별 팁
    if (budget && budget.level <= 2) {
        tips.push("저예산: 기본형 보장으로 시작");
        tips.push("온라인 가입으로 할인 혜택 활용");
    } else if (budget && budget.level >= 4) {
        tips.push("충분한 예산: 포괄적 보장 선택");
        tips.push("면책기간 단축 특약 추가 권장");
    }
    
    // 납입 방식별 팁
    if (payment && payment.frequency === 1) {
        tips.push("연납 선택: 최대 15% 할인 혜택");
    } else if (payment && payment.frequency >= 4) {
        tips.push("월납 선택: 부담 분산 효과");
    }
    
    // 치과 방문 빈도별 팁
    if (frequency && frequency.prevention >= 4) {
        tips.push("정기 검진자: 예방 중심 보장 선택");
    } else if (frequency && frequency.risk >= 4) {
        tips.push("비정기 방문자: 응급 치료 보장 강화");
    }
    
    // 미용 치료 관심도별 팁
    if (cosmetic && cosmetic.priority >= 4) {
        tips.push("미용 치료 관심: 교정/미백 특약 고려");
    }
    
    // 기존 보험별 팁
    if (existing && existing.overlap >= 3) {
        tips.push("기존 보험 있음: 중복 보장 확인 필요");
    } else if (existing && existing.overlap === 0) {
        tips.push("신규 가입: 포괄적 보장 권장");
    }
}

// 결과 표시
function displayResult(result) {
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultSubtitle = document.getElementById('resultSubtitle');
    
    if (resultIcon) {
        if (result.urgencyScore >= 4) {
            resultIcon.textContent = '⚡';
        } else if (result.healthScore >= 4) {
            resultIcon.textContent = '😊';
        } else {
            resultIcon.textContent = '🦷';
        }
    }
    
    if (resultTitle) resultTitle.textContent = result.recommendation;
    if (resultSubtitle) resultSubtitle.textContent = `예상 면책기간: ${result.waitingPeriod}`;
    
    // 상세 분석 표시
    displayDetailedAnalysis(result);
}

// 상세 분석 표시
function displayDetailedAnalysis(result) {
    const waitingPeriodDiv = document.querySelector('.waiting-period-analysis');
    const recommendedProductsDiv = document.querySelector('.recommended-products');
    const costSavingsDiv = document.querySelector('.cost-savings');
    const insuranceTipsDiv = document.querySelector('.insurance-tips');
    
    if (waitingPeriodDiv) {
        waitingPeriodDiv.innerHTML = `
            <h3>📅 면책기간 분석</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>예상 면책기간:</strong> ${result.waitingPeriod}
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
                    <strong>면책기간이란?</strong><br>
                    보험 가입 후 일정 기간 동안 보험금을 지급하지 않는 기간입니다.
                </div>
            </div>
        `;
    }
    
    if (recommendedProductsDiv) {
        recommendedProductsDiv.innerHTML = `
            <h3>🏆 추천 보험사</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #fff3e0, #ffcc02); padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>1순위: DB손보</strong><br>
                    <small>• 일반진료 90일, 사고성 즉시보장</small><br>
                    <small>• 온라인 가입 할인 제공</small>
                </div>
                <div style="background: linear-gradient(135deg, #f3e5f5, #ba68c8); color: white; padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>2순위: 현대해상</strong><br>
                    <small>• 면책기간 단축 특약 제공</small><br>
                    <small>• 가족 단체 가입 할인</small>
                </div>
                <div style="background: linear-gradient(135deg, #e8f5e8, #4caf50); color: white; padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>3순위: 삼성화재</strong><br>
                    <small>• 충치치료 면책기간 단축</small><br>
                    <small>• 건강검진 우수자 할인</small>
                </div>
            </div>
        `;
    }
    
    if (costSavingsDiv) {
        costSavingsDiv.innerHTML = `
            <h3>💰 보험료 절약 팁</h3>
            <ul style="margin: 15px 0; padding-left: 20px;">
                ${result.tips.map(tip => `<li style="margin: 8px 0;">${tip}</li>`).join('')}
            </ul>
        `;
    }
    
    if (insuranceTipsDiv) {
        insuranceTipsDiv.innerHTML = `
            <h3>⚠️ 주의사항</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #ffebee, #ef5350); color: white; padding: 15px; border-radius: 10px;">
                    <strong>면책기간 중 발생한 치아 질환은 보장되지 않습니다</strong><br>
                    <small>가입 전 치과 검진을 받고 미리 치료하는 것이 좋습니다</small>
                </div>
            </div>
        `;
    }
}

// 카카오 공유
function shareKakao() {
    if (!Kakao.isInitialized()) {
        Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
    }
    
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '치아보험 면책기간 없는 상품 찾기 결과',
            description: '나에게 맞는 즉시 보장 가능한 치아보험을 찾았어요! 면책기간과 보험료까지 확인해보세요.',
            imageUrl: window.location.origin + '/치아보험/치아보험.svg',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
        },
        social: {
            likeCount: 286,
            commentCount: 45,
            sharedCount: 845,
        },
        buttons: [
            {
                title: '나도 테스트하기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
        ],
    });
}

// 상세 가이드 표시
function showDetailedGuide() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) {
        guideModal.classList.remove('hidden');
    }
}

// 가이드 모달 닫기
function closeGuideModal() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) {
        guideModal.classList.add('hidden');
    }
}

// 테스트 재시작
function restartTest() {
    if (resultPage) resultPage.classList.add('hidden');
    if (startPage) startPage.classList.remove('hidden');
    
    currentQuestionIndex = 0;
    userAnswers = [];
    
    // 진행률 초기화
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) progressFill.style.width = '0%';
}

// 키보드 이벤트
document.addEventListener('keydown', function(e) {
    // ESC로 모달 닫기
    if (e.key === 'Escape') {
        const modal = document.getElementById('analysisModal');
        const guideModal = document.getElementById('guideModal');
        
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
        if (guideModal && !guideModal.classList.contains('hidden')) {
            guideModal.classList.add('hidden');
        }
    }
    
    // 숫자 키로 답변 선택
    if (e.key >= '1' && e.key <= '5') {
        const questionPage = document.getElementById('questionPage');
        if (questionPage && !questionPage.classList.contains('hidden')) {
            const answerIndex = parseInt(e.key) - 1;
            const options = document.querySelectorAll('.answer-option');
            if (options[answerIndex]) {
                options[answerIndex].click();
            }
        }
    }
});

// 페이지 로드 시 광고 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 로드 완료!');
    
    // DOM 요소 재할당
    startPage = document.getElementById('startPage');
    questionPage = document.getElementById('questionPage');
    resultPage = document.getElementById('resultPage');
    analysisModal = document.getElementById('analysisModal');
    
    console.log('Questions 배열:', questions.length);
    console.log('첫 번째 질문:', questions[0]);
    
    // AdSense 광고 초기화
    if (typeof adsbygoogle !== 'undefined') {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
    
    // DOM 요소 확인
    console.log('startPage:', startPage);
    console.log('questionPage:', questionPage);
    console.log('resultPage:', resultPage);
    console.log('analysisModal:', analysisModal);
    
    // 시작 버튼 확인
    const startBtn = document.querySelector('.start-btn');
    console.log('시작 버튼:', startBtn);
});
