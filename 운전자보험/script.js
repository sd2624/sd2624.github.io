// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 광고 관리 클래스 - 중복 로드 방지
class AdManager {
    constructor() {
        this.loadedAds = new Set();
        this.observers = new Map();
    }

    // 광고 로드 함수
    loadAd(adId) {
        if (this.loadedAds.has(adId)) {
            return; // 이미 로드된 광고는 다시 로드하지 않음
        }
        
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
            this.loadedAds.add(adId);
            console.log(`광고 로드됨: ${adId}`);
        } catch (error) {
            console.error(`광고 로드 실패: ${adId}`, error);
        }
    }

    // 중간 광고 표시 (3번째 질문 후)
    showMidAd() {
        const midAd = document.getElementById('midAd');
        if (midAd && !this.loadedAds.has('midAd')) {
            midAd.style.display = 'block';
            
            // IntersectionObserver로 화면에 보일 때 광고 로드
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadAd('midAd');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(midAd);
            this.observers.set('midAd', observer);
        }
    }

    // 결과 광고 표시
    showResultAd() {
        const resultAd = document.getElementById('resultAd');
        if (resultAd && !this.loadedAds.has('resultAd')) {
            // IntersectionObserver로 화면에 보일 때 광고 로드
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadAd('resultAd');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(resultAd);
            this.observers.set('resultAd', observer);
        }
    }
}

// AdManager 인스턴스 생성
const adManager = new AdManager();

// 질문 데이터
const questions = [
    {
        question: "운전자님의 연령대는?",
        description: "💡 연령대에 따라 사고 위험도와 보험료가 결정됩니다",
        answers: [
            { text: "20대 (20~29세)", age: "20s", risk_score: 4, base_premium: 35000 },
            { text: "30대 (30~39세)", age: "30s", risk_score: 2, base_premium: 28000 },
            { text: "40대 (40~49세)", age: "40s", risk_score: 1, base_premium: 22000 },
            { text: "50대 (50~59세)", age: "50s", risk_score: 2, base_premium: 25000 },
            { text: "60대 이상", age: "60+", risk_score: 3, base_premium: 32000 }
        ]
    },
    {
        question: "운전 경력은 어느 정도 되시나요?",
        description: "🚗 운전 경력은 사고 확률과 직결되는 중요한 요소입니다",
        answers: [
            { text: "1년 미만", experience: "novice", risk_multiplier: 1.5, premium_adj: 8000 },
            { text: "1~3년", experience: "beginner", risk_multiplier: 1.3, premium_adj: 5000 },
            { text: "3~5년", experience: "intermediate", risk_multiplier: 1.1, premium_adj: 2000 },
            { text: "5~10년", experience: "experienced", risk_multiplier: 1.0, premium_adj: 0 },
            { text: "10년 이상", experience: "expert", risk_multiplier: 0.9, premium_adj: -3000 }
        ]
    },
    {
        question: "주로 운전하시는 차량 종류는?",
        description: "🚙 차량 종류에 따라 사고 시 피해 규모가 달라집니다",
        answers: [
            { text: "경차", vehicle: "compact", premium_factor: 0.8, safety_score: 3 },
            { text: "소형차", vehicle: "small", premium_factor: 0.9, safety_score: 4 },
            { text: "중형차", vehicle: "medium", premium_factor: 1.0, safety_score: 4 },
            { text: "대형차/SUV", vehicle: "large", premium_factor: 1.2, safety_score: 5 },
            { text: "수입차", vehicle: "import", premium_factor: 1.4, safety_score: 5 }
        ]
    },
    {
        question: "연간 주행거리는 대략 얼마나 되시나요?",
        description: "📊 주행거리가 많을수록 사고 노출 빈도가 증가합니다",
        answers: [
            { text: "5,000km 미만", mileage: "very_low", risk_factor: 0.7, premium_adj: -5000 },
            { text: "5,000~10,000km", mileage: "low", risk_factor: 0.9, premium_adj: -2000 },
            { text: "10,000~15,000km", mileage: "medium", risk_factor: 1.0, premium_adj: 0 },
            { text: "15,000~20,000km", mileage: "high", risk_factor: 1.2, premium_adj: 3000 },
            { text: "20,000km 이상", mileage: "very_high", risk_factor: 1.4, premium_adj: 6000 }
        ]
    },
    {
        question: "최근 3년간 교통사고 경험이 있으신가요?",
        description: "⚠️ 사고 이력은 보험료에 직접적인 영향을 미칩니다",
        answers: [
            { text: "사고 경험 없음", accident: "none", premium_discount: 0.15, risk_adj: 0 },
            { text: "경미한 접촉사고 1회", accident: "minor_once", premium_discount: 0.05, risk_adj: 2000 },
            { text: "경미한 사고 2회 이상", accident: "minor_multiple", premium_discount: 0, risk_adj: 5000 },
            { text: "중대한 사고 1회", accident: "major_once", premium_discount: -0.1, risk_adj: 8000 },
            { text: "중대한 사고 2회 이상", accident: "major_multiple", premium_discount: -0.2, risk_adj: 12000 }
        ]
    },
    {
        question: "현재 가입 중인 자동차보험 보장 수준은?",
        description: "🛡️ 기존 보험과 중복을 피하고 보완할 영역을 확인합니다",
        answers: [
            { text: "의무보험만 가입", current_coverage: "basic", supplement_need: 5, premium_base: 45000 },
            { text: "기본 종합보험", current_coverage: "standard", supplement_need: 4, premium_base: 35000 },
            { text: "고급 종합보험", current_coverage: "premium", supplement_need: 2, premium_base: 20000 },
            { text: "최고급 보험", current_coverage: "luxury", supplement_need: 1, premium_base: 15000 },
            { text: "잘 모르겠음", current_coverage: "unknown", supplement_need: 3, premium_base: 30000 }
        ]
    },
    {
        question: "직업군은 어디에 해당하시나요?",
        description: "💼 직업에 따른 운전 패턴과 위험도를 고려합니다",
        answers: [
            { text: "사무직/관리직", job: "office", risk_level: 1, premium_adj: 0 },
            { text: "영업직/외근직", job: "sales", risk_level: 3, premium_adj: 4000 },
            { text: "전문직/의료진", job: "professional", risk_level: 1, premium_adj: -2000 },
            { text: "서비스업/자영업", job: "service", risk_level: 2, premium_adj: 2000 },
            { text: "운수업/배달업", job: "transport", risk_level: 5, premium_adj: 8000 }
        ]
    },
    {
        question: "월 보험료 예산은 어느 정도로 생각하고 계신가요?",
        description: "💰 예산에 맞는 최적의 보장 구성을 추천해드립니다",
        answers: [
            { text: "1만원 이하", budget: "very_low", coverage_level: 1, premium_target: 8000 },
            { text: "1~2만원", budget: "low", coverage_level: 2, premium_target: 15000 },
            { text: "2~3만원", budget: "medium", coverage_level: 3, premium_target: 25000 },
            { text: "3~4만원", budget: "high", coverage_level: 4, premium_target: 35000 },
            { text: "4만원 이상", budget: "very_high", coverage_level: 5, premium_target: 45000 }
        ]
    },
    {
        question: "운전자보험에서 가장 중요하게 생각하는 보장은?",
        description: "🎯 우선순위에 따라 맞춤형 보장 구성을 제안합니다",
        answers: [
            { text: "의료비/치료비 보장", priority: "medical", focus_area: "treatment", weight: 1.3 },
            { text: "휴업손해/소득 보장", priority: "income", focus_area: "compensation", weight: 1.2 },
            { text: "법적 처리 지원", priority: "legal", focus_area: "support", weight: 1.1 },
            { text: "종합적 보장", priority: "comprehensive", focus_area: "total", weight: 1.0 },
            { text: "저렴한 보험료", priority: "price", focus_area: "economy", weight: 0.8 }
        ]
    }
];

// 보험료 계산 정보
const premiumCalculator = {
    baseRates: {
        "20s": { min: 28000, max: 42000, avg: 35000 },
        "30s": { min: 22000, max: 34000, avg: 28000 },
        "40s": { min: 18000, max: 26000, avg: 22000 },
        "50s": { min: 20000, max: 30000, avg: 25000 },
        "60+": { min: 26000, max: 38000, avg: 32000 }
    },
    marketAverage: {
        overall: 25000,
        byAge: {
            "20s": 35000,
            "30s": 28000, 
            "40s": 22000,
            "50s": 25000,
            "60+": 32000
        }
    },
    coverageOptions: {
        1: { name: "기본형", coverage: "1억원", features: ["기본 의료비", "법적 지원"] },
        2: { name: "표준형", coverage: "2억원", features: ["의료비 확대", "휴업손해", "법적 지원"] },
        3: { name: "안심형", coverage: "3억원", features: ["종합 의료비", "휴업손해", "법적 지원", "가족 보장"] },
        4: { name: "프리미엄형", coverage: "5억원", features: ["최고 의료비", "완전 휴업손해", "전문 법적 지원", "가족 보장"] },
        5: { name: "최고급형", coverage: "10억원", features: ["무제한 의료비", "완전 소득 보장", "VIP 법적 지원", "가족 보장", "해외 보장"] }
    }
};

// 결과 타입 정의
const resultTypes = {
    "매우저렴": {
        title: "💰 매우 저렴한 보험료",
        subtitle: "시장 평균보다 30% 이상 저렴합니다!",
        badge: "🏆",
        bgColor: "linear-gradient(45deg, #9caf88, #6b8db5)",
        description: "귀하의 조건에서는 평균보다 훨씬 저렴한 보험료로 가입이 가능합니다.",
        category: "매우저렴"
    },
    "저렴": {
        title: "✅ 평균보다 저렴",
        subtitle: "시장 평균보다 10-30% 저렴한 조건입니다",
        badge: "👍",
        bgColor: "linear-gradient(45deg, #daa520, #d2691e)",
        description: "양호한 조건으로 평균보다 저렴한 보험료 혜택을 받을 수 있습니다.",
        category: "저렴"
    },
    "평균": {
        title: "📊 시장 평균 수준",
        subtitle: "표준적인 보험료 수준입니다",
        badge: "⚖️",
        bgColor: "linear-gradient(45deg, #cd5c5c, #d2691e)",
        description: "일반적인 조건으로 시장 평균 수준의 보험료가 예상됩니다.",
        category: "평균"
    },
    "높음": {
        title: "⚠️ 평균보다 높음",
        subtitle: "위험 요인으로 인해 보험료가 높을 수 있습니다",
        badge: "📈",
        bgColor: "linear-gradient(45deg, #8b4513, #cd5c5c)",
        description: "일부 위험 요인으로 인해 평균보다 높은 보험료가 예상됩니다.",
        category: "높음"
    }
};

let currentQuestionIndex = 0;
let userAnswers = [];
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
    analysisData = {};
    
    if (startPage) startPage.classList.add('hidden');
    if (questionPage) questionPage.classList.remove('hidden');
    
    showQuestion();
}

// 질문 표시 함수
function showQuestion() {
    const progressFill = document.querySelector('.progress-fill');
    const currentNum = document.querySelector('.current-num');
    const totalNum = document.querySelector('.total-num');
    const questionTitle = document.querySelector('.question-title');
    const questionDesc = document.querySelector('.question-desc');
    const answersGrid = document.querySelector('.answers-grid');
    
    // 진행률 업데이트
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    if (progressFill) progressFill.style.width = progress + '%';
    if (currentNum) currentNum.textContent = currentQuestionIndex + 1;
    if (totalNum) totalNum.textContent = '/ ' + questions.length;
    
    // 3번째 질문 후 중간 광고 표시
    if (currentQuestionIndex === 3) {
        adManager.showMidAd();
    }
    
    // 질문과 옵션 표시
    const currentQuestion = questions[currentQuestionIndex];
    if (questionTitle) questionTitle.textContent = currentQuestion.question;
    if (questionDesc) questionDesc.textContent = currentQuestion.description;
    
    if (answersGrid) {
        answersGrid.innerHTML = '';
        currentQuestion.answers.forEach((answer, index) => {
            const answerElement = document.createElement('div');
            answerElement.className = 'answer-option';
            answerElement.textContent = answer.text;
            answerElement.onclick = () => selectAnswer(answer, index);
            answersGrid.appendChild(answerElement);
        });
    }
}

// 답변 선택 함수
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
            showAnalysisModal();
        }
    }, 800);
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
    
    // 계산 단계 애니메이션
    const steps = document.querySelectorAll('.calc-step');
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('active');
            const check = step.querySelector('.step-check');
            if (check && index < 3) {
                check.textContent = '✓';
                check.style.color = '#9caf88';
            }
        }, (index + 1) * 1000);
    });
    
    // 카운트다운 시작
    let countdown = 6;
    const timerDisplay = document.querySelector('.timer-display');
    
    const timer = setInterval(() => {
        if (timerDisplay) timerDisplay.textContent = countdown;
        countdown--;
        
        if (countdown < 0) {
            clearInterval(timer);
            calculatePremium();
            showResults();
        }
    }, 1000);
}

// 보험료 계산 함수
function calculatePremium() {
    let basePremium = 25000; // 기본 보험료
    let riskScore = 0;
    let adjustments = 0;
    let userAge = "40s";
    let userBudget = 25000;
    let coverageLevel = 3;
    
    userAnswers.forEach(answer => {
        if (answer.base_premium) basePremium = answer.base_premium;
        if (answer.age) userAge = answer.age;
        if (answer.premium_target) userBudget = answer.premium_target;
        if (answer.coverage_level) coverageLevel = answer.coverage_level;
        if (answer.risk_score) riskScore += answer.risk_score;
        if (answer.premium_adj) adjustments += answer.premium_adj;
        if (answer.risk_multiplier) basePremium *= answer.risk_multiplier;
        if (answer.premium_factor) basePremium *= answer.premium_factor;
        if (answer.risk_factor) basePremium *= answer.risk_factor;
        if (answer.premium_discount) basePremium *= (1 + answer.premium_discount);
    });
    
    // 최종 보험료 계산
    const finalPremium = Math.round(basePremium + adjustments);
    const marketAvg = premiumCalculator.marketAverage.byAge[userAge];
    const savingAmount = Math.max(0, marketAvg - finalPremium);
    const savingPercent = Math.round((savingAmount / marketAvg) * 100);
    
    // 결과 타입 결정
    let resultType;
    if (savingPercent >= 30) {
        resultType = "매우저렴";
    } else if (savingPercent >= 10) {
        resultType = "저렴";
    } else if (savingPercent >= -10) {
        resultType = "평균";
    } else {
        resultType = "높음";
    }
    
    analysisData = {
        resultType: resultType,
        finalPremium: finalPremium,
        marketAverage: marketAvg,
        savingAmount: savingAmount,
        savingPercent: savingPercent,
        riskScore: riskScore,
        userAge: userAge,
        userBudget: userBudget,
        coverageLevel: coverageLevel
    };
}

// 결과 표시 함수
function showResults() {
    if (analysisModal) analysisModal.classList.add('hidden');
    if (resultPage) resultPage.classList.remove('hidden');
    
    const result = resultTypes[analysisData.resultType];
    const coverage = premiumCalculator.coverageOptions[analysisData.coverageLevel];
    
    // 결과 헤더 업데이트
    const resultIcon = document.querySelector('.result-icon');
    const resultTitle = document.querySelector('.result-title');
    const resultSummary = document.querySelector('.result-summary');
    
    if (resultIcon) {
        resultIcon.style.background = result.bgColor;
        resultIcon.innerHTML = `<div style="font-size: 1.2em;">${result.badge}</div>`;
    }
    
    if (resultTitle) resultTitle.textContent = result.title;
    if (resultSummary) resultSummary.textContent = result.subtitle;
    
    // 결과 내용 업데이트
    const premiumAnalysis = document.querySelector('.premium-analysis');
    const marketComparison = document.querySelector('.market-comparison');
    const savingTips = document.querySelector('.saving-tips');
    
    if (premiumAnalysis) {
        premiumAnalysis.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.9); border-radius: 20px; padding: 25px; border: 2px solid #daa520;">
                <h4 style="color: #8b4513; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    💰 내 맞춤 보험료 분석
                </h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div style="text-align: center; padding: 20px; background: rgba(218, 165, 32, 0.1); border-radius: 15px;">
                        <div style="font-size: 2.2em; color: #d2691e; font-weight: 800; margin-bottom: 8px;">${analysisData.finalPremium.toLocaleString()}원</div>
                        <div style="font-size: 0.9em; color: #36454f;">내 적정 보험료</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: rgba(156, 175, 136, 0.1); border-radius: 15px;">
                        <div style="font-size: 2.2em; color: #9caf88; font-weight: 800; margin-bottom: 8px;">${analysisData.marketAverage.toLocaleString()}원</div>
                        <div style="font-size: 0.9em; color: #36454f;">시장 평균</div>
                    </div>
                </div>
                <p style="color: #36454f; line-height: 1.6; text-align: center; font-size: 1.1em;">
                    <strong>${result.description}</strong>
                </p>
            </div>
        `;
    }
    
    if (marketComparison) {
        const isPositive = analysisData.savingAmount > 0;
        marketComparison.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.9); border-radius: 20px; padding: 25px; border: 2px solid ${isPositive ? '#9caf88' : '#cd5c5c'};">
                <h4 style="color: #8b4513; margin-bottom: 20px;">📊 시장 평균 대비 분석</h4>
                <div style="text-align: center; padding: 25px; background: ${isPositive ? 'rgba(156, 175, 136, 0.1)' : 'rgba(205, 92, 92, 0.1)'}; border-radius: 15px; margin-bottom: 20px;">
                    <div style="font-size: 2.5em; color: ${isPositive ? '#9caf88' : '#cd5c5c'}; font-weight: 800; margin-bottom: 10px;">
                        ${isPositive ? '-' : '+'}${Math.abs(analysisData.savingAmount).toLocaleString()}원
                    </div>
                    <div style="font-size: 1.2em; color: #36454f; margin-bottom: 8px;">
                        ${isPositive ? '절약 가능 금액' : '추가 예상 금액'}
                    </div>
                    <div style="font-size: 1em; color: #36454f; opacity: 0.8;">
                        (${isPositive ? '평균 대비 ' + analysisData.savingPercent + '% 절약' : '평균 대비 ' + Math.abs(analysisData.savingPercent) + '% 높음'})
                    </div>
                </div>
                
                <div style="background: rgba(218, 165, 32, 0.1); border-radius: 15px; padding: 20px;">
                    <h5 style="color: #d2691e; margin-bottom: 15px;">📋 추천 보장 구성</h5>
                    <div style="color: #36454f; line-height: 1.6;">
                        <div style="margin: 8px 0;"><strong>보장 수준:</strong> ${coverage.name} (${coverage.coverage})</div>
                        <div style="margin: 8px 0;"><strong>주요 혜택:</strong> ${coverage.features.join(', ')}</div>
                        <div style="margin: 8px 0;"><strong>월 예상 보험료:</strong> ${analysisData.finalPremium.toLocaleString()}원</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    if (savingTips) {
        savingTips.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.9); border-radius: 20px; padding: 25px; border: 2px solid #6b8db5;">
                <h4 style="color: #8b4513; margin-bottom: 20px;">💡 보험료 절약 꿀팁</h4>
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <div style="padding: 15px; background: rgba(107, 141, 181, 0.1); border-radius: 12px; border-left: 4px solid #6b8db5;">
                        <h6 style="color: #6b8db5; margin-bottom: 8px;">🎯 할인 혜택 활용</h6>
                        <p style="color: #36454f; font-size: 0.9em; line-height: 1.5; margin: 0;">
                            무사고 할인, 안전운전 할인, 온라인 가입 할인 등을 적극 활용하세요. 
                            최대 30% 할인 혜택을 받을 수 있습니다.
                        </p>
                    </div>
                    
                    <div style="padding: 15px; background: rgba(156, 175, 136, 0.1); border-radius: 12px; border-left: 4px solid #9caf88;">
                        <h6 style="color: #9caf88; margin-bottom: 8px;">📱 디지털 혜택</h6>
                        <p style="color: #36454f; font-size: 0.9em; line-height: 1.5; margin: 0;">
                            앱 가입, 전자약관 동의, 카드자동납부 등으로 추가 할인을 받을 수 있습니다.
                        </p>
                    </div>
                    
                    <div style="padding: 15px; background: rgba(218, 165, 32, 0.1); border-radius: 12px; border-left: 4px solid #daa520;">
                        <h6 style="color: #daa520; margin-bottom: 8px;">🔄 정기 점검</h6>
                        <p style="color: #36454f; font-size: 0.9em; line-height: 1.5; margin: 0;">
                            연 1회 이상 보험료를 비교하고, 운전 패턴 변화에 맞춰 보장을 조정하세요.
                        </p>
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(205, 92, 92, 0.1); border-radius: 12px; border-left: 4px solid #cd5c5c;">
                    <h6 style="color: #cd5c5c; margin-bottom: 8px;">⚠️ 주의사항</h6>
                    <p style="color: #36454f; font-size: 0.9em; line-height: 1.5; margin: 0;">
                        너무 저렴한 보험은 보장 범위가 제한적일 수 있습니다. 
                        보험료와 보장 내용을 균형있게 고려하여 선택하세요.
                    </p>
                </div>
            </div>
        `;
    }
}

// 테스트 재시작 함수
function restartTest() {
    currentQuestionIndex = 0;
    userAnswers = [];
    analysisData = {};
    
    if (resultPage) resultPage.classList.add('hidden');
    if (startPage) startPage.classList.remove('hidden');
}

// 카카오톡 공유 함수
function shareKakao() {
    const result = resultTypes[analysisData.resultType];
    
    const title = result ? result.title : '운전자보험 적정보험료 평균';
    const description = result ? 
        `${result.subtitle} - 내 보험료: ${analysisData.finalPremium.toLocaleString()}원` : 
        '내 조건에 맞는 운전자보험 적정보험료를 확인해보세요!';
    
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '운전자보험 적정보험료 평균',
                description: `${title} - ${description}`,
                imageUrl: window.location.origin + '/운전자보험/운전자보험.svg',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
            buttons: [
                {
                    title: '보험료 확인하기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });
    } else {
        // 대체 공유 방법
        const text = `운전자보험 적정보험료 평균 - ${title}`;
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

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 광고 초기화
    if (typeof adsbygoogle !== 'undefined') {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
    
    // 이벤트 리스너 등록
    const startBtn = document.querySelector('.start-btn');
    const detailBtns = document.querySelectorAll('.detail-btn');
    const shareBtns = document.querySelectorAll('.share-btn');
    const restartBtns = document.querySelectorAll('.restart-btn');
    
    if (startBtn) {
        startBtn.addEventListener('click', startTest);
    }
    
    detailBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // 운전자보험 가입 사이트들
            const insuranceLinks = [
                'https://direct.samsung.co.kr/product/car.html',  // 삼성화재 운전자보험
                'https://www.hi.co.kr/product/car/',             // 현대해상 운전자보험
                'https://direct.dbgeneral.co.kr/car/',           // DB손해보험 운전자보험
                'https://www.meritzfire.com/product/car/',       // 메리츠화재 운전자보험
                'https://direct.kbinsure.co.kr/car/'             // KB손해보험 운전자보험
            ];
            
            // 순서대로 다른 보험사 링크로 이동
            const linkIndex = index % insuranceLinks.length;
            window.open(insuranceLinks[linkIndex], '_blank');
        });
    });
    
    shareBtns.forEach(btn => {
        btn.addEventListener('click', shareKakao);
    });
    
    restartBtns.forEach(btn => {
        btn.addEventListener('click', restartTest);
    });
});

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
            const options = document.querySelectorAll('.answer-option');
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
});

// 전역 함수로 노출
window.startTest = startTest;
window.restartTest = restartTest;
window.shareKakao = shareKakao;
