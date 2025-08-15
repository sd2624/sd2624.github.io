// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 광고 로드 관리 시스템
class AdManager {
    constructor() {
        this.loadedAds = new Set(); // 중복 로드 방지를 위한 Set
        this.initializeAds();
    }

    // 광고 초기화 및 IntersectionObserver 설정
    initializeAds() {
        // 페이지 로드 시 상단 광고 즉시 로드
        this.loadAd('ad-top');

        // IntersectionObserver로 광고 요소 감시
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const adId = entry.target.id;
                    this.loadAd(adId);
                }
            });
        }, {
            threshold: 0.1, // 10% 보이면 로드
            rootMargin: '50px' // 50px 여유를 두고 로드
        });

        // 모든 광고 요소 관찰
        document.querySelectorAll('.ad-section').forEach(ad => {
            observer.observe(ad);
        });
    }

    // 광고 로드 함수
    loadAd(adId) {
        if (this.loadedAds.has(adId)) {
            return; // 이미 로드된 광고는 스킵
        }

        const adElement = document.getElementById(adId);
        if (adElement && adElement.querySelector('.adsbygoogle')) {
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
                this.loadedAds.add(adId);
                console.log(`광고 로드됨: ${adId}`);
            } catch (error) {
                console.error(`광고 로드 실패: ${adId}`, error);
            }
        }
    }

    // 광고 표시 (섹션이 나타날 때 호출)
    showAd(adId) {
        const adElement = document.getElementById(adId);
        if (adElement) {
            adElement.style.display = 'block';
            // 약간의 지연 후 광고 로드
            setTimeout(() => {
                this.loadAd(adId);
            }, 100);
        }
    }

    // 광고 숨기기
    hideAd(adId) {
        const adElement = document.getElementById(adId);
        if (adElement) {
            adElement.style.display = 'none';
        }
    }
}

// 광고 매니저 인스턴스 생성
const adManager = new AdManager();

// 질문 데이터
const questions = [
    {
        question: "현재 연령대는 어떻게 되시나요?",
        description: "💡 연령에 따라 받을 수 있는 연금 종류가 달라집니다",
        answers: [
            { text: "40대 미만", age: "under40", eligibility_score: 1, future_planning: true },
            { text: "40~49세", age: "40s", eligibility_score: 2, retirement_prep: true },
            { text: "50~59세", age: "50s", eligibility_score: 3, near_retirement: true },
            { text: "60~64세", age: "early60s", eligibility_score: 4, early_pension: true },
            { text: "65세 이상", age: "65plus", eligibility_score: 5, pension_eligible: true }
        ]
    },
    {
        question: "국민연금 가입 기간은 얼마나 되시나요?",
        description: "🏛️ 국민연금 수급 자격과 연금액이 결정되는 중요한 요소입니다",
        answers: [
            { text: "가입한 적 없음", national_pension: "none", pension_years: 0, eligibility: "none" },
            { text: "10년 미만", national_pension: "short", pension_years: 5, eligibility: "insufficient" },
            { text: "10~19년", national_pension: "medium", pension_years: 15, eligibility: "basic" },
            { text: "20~29년", national_pension: "long", pension_years: 25, eligibility: "standard" },
            { text: "30년 이상", national_pension: "full", pension_years: 35, eligibility: "maximum" }
        ]
    },
    {
        question: "현재 소득 수준은 어느 정도인가요?",
        description: "💰 소득 수준에 따라 기초연금 등의 수급 자격이 결정됩니다",
        answers: [
            { text: "월 50만원 미만", income: "very_low", basic_pension_eligible: true, income_level: 1 },
            { text: "월 50~100만원", income: "low", basic_pension_eligible: true, income_level: 2 },
            { text: "월 100~200만원", income: "medium", basic_pension_eligible: "partial", income_level: 3 },
            { text: "월 200~300만원", income: "high", basic_pension_eligible: false, income_level: 4 },
            { text: "월 300만원 이상", income: "very_high", basic_pension_eligible: false, income_level: 5 }
        ]
    },
    {
        question: "현재 직업 상태는 어떻게 되시나요?",
        description: "👔 직업에 따라 가입 가능한 연금 제도가 다릅니다",
        answers: [
            { text: "회사원(사업장 가입자)", job: "employee", workplace_pension: true, retirement_fund: true },
            { text: "공무원", job: "public", public_pension: true, special_pension: true },
            { text: "자영업자", job: "self_employed", individual_pension: true, private_pension: true },
            { text: "농어업인", job: "farmer", rural_pension: true, basic_pension_priority: true },
            { text: "무직/기타", job: "unemployed", basic_pension_only: true, welfare_priority: true }
        ]
    },
    {
        question: "배우자가 있으신가요?",
        description: "👫 부부 합산 소득으로 기초연금 자격이 결정됩니다",
        answers: [
            { text: "배우자 있음 (모두 65세 이상)", spouse: "both_eligible", couple_pension: true, joint_income: true },
            { text: "배우자 있음 (한 명만 65세 이상)", spouse: "one_eligible", partial_couple: true, single_pension: true },
            { text: "배우자 있음 (모두 65세 미만)", spouse: "both_young", future_couple: true, planning_needed: true },
            { text: "배우자 없음 (이혼/사별)", spouse: "single", single_pension: true, full_eligibility: true },
            { text: "미혼", spouse: "unmarried", individual_pension: true, simple_calculation: true }
        ]
    },
    {
        question: "현재 거주하는 주택은 어떤 형태인가요?",
        description: "🏠 재산 수준도 기초연금 선정 기준에 포함됩니다",
        answers: [
            { text: "자가주택 (5억원 이상)", housing: "expensive_owned", asset_high: true, pension_limit: true },
            { text: "자가주택 (5억원 미만)", housing: "moderate_owned", asset_medium: true, partial_eligible: true },
            { text: "전세/보증금 거주", housing: "lease", asset_low: true, pension_eligible: true },
            { text: "월세 거주", housing: "rent", asset_very_low: true, full_eligible: true },
            { text: "무주택", housing: "none", minimal_asset: true, priority_eligible: true }
        ]
    },
    {
        question: "개인연금(사적연금)에 가입하고 계신가요?",
        description: "🎯 사적연금은 노후소득의 중요한 보완 수단입니다",
        answers: [
            { text: "연금저축 + 퇴직연금 모두 가입", private_pension: "full", pension_3tier: true, optimal_prep: true },
            { text: "연금저축만 가입", private_pension: "savings", tier2_only: true, additional_needed: true },
            { text: "퇴직연금만 가입", private_pension: "retirement", tier3_only: true, savings_needed: true },
            { text: "개인형IRP 가입", private_pension: "irp", tax_benefit: true, flexible_management: true },
            { text: "가입한 것 없음", private_pension: "none", urgent_prep: true, comprehensive_plan: true }
        ]
    },
    {
        question: "가장 관심 있는 연금 정보는 무엇인가요?",
        description: "📋 관심사에 따라 맞춤형 정보를 제공해드립니다",
        answers: [
            { text: "받을 수 있는 연금 종류와 금액", interest: "amount", focus: "calculation", priority: "income" },
            { text: "연금 신청 방법과 절차", interest: "application", focus: "procedure", priority: "process" },
            { text: "추가 가입할 수 있는 연금", interest: "additional", focus: "planning", priority: "preparation" },
            { text: "세금 혜택과 절약 방법", interest: "tax", focus: "benefit", priority: "optimization" },
            { text: "연금 수급 시기와 전략", interest: "timing", focus: "strategy", priority: "timing" }
        ]
    }
];

// 연금 정보 데이터베이스
const pensionDatabase = {
    basicPension: {
        name: "기초연금",
        age: "65세 이상",
        amount: "월 최대 33만원 (2024년 기준)",
        eligibility: "65세 이상 소득하위 70%",
        description: "국가에서 지급하는 기본적인 노후소득보장제도"
    },
    nationalPension: {
        name: "국민연금",
        age: "62~65세부터 (출생연도별)",
        amount: "월 평균 58만원",
        eligibility: "10년 이상 가입",
        description: "국민 모두가 가입하는 사회보험 연금"
    },
    publicPension: {
        name: "공무원연금",
        age: "60세부터",
        amount: "월 평균 245만원",
        eligibility: "20년 이상 재직",
        description: "공무원을 위한 특수직역연금"
    },
    militaryPension: {
        name: "군인연금",
        age: "40~60세",
        amount: "월 평균 180만원",
        eligibility: "20년 이상 복무",
        description: "군인을 위한 특수직역연금"
    },
    teacherPension: {
        name: "사학연금",
        age: "62세부터",
        amount: "월 평균 195만원",
        eligibility: "20년 이상 재직",
        description: "사립학교 교직원 연금"
    },
    retirementPension: {
        name: "퇴직연금",
        age: "55세부터",
        amount: "평균 2,400만원",
        eligibility: "퇴직급여제도 가입",
        description: "근로자 퇴직급여보장법에 따른 연금"
    },
    personalPension: {
        name: "연금저축",
        age: "55세부터",
        amount: "납입액에 따라 차등",
        eligibility: "가입 후 5년 경과",
        description: "세제혜택이 있는 개인연금"
    },
    irpPension: {
        name: "개인형IRP",
        age: "55세부터",
        amount: "납입액에 따라 차등",
        eligibility: "가입 조건 없음",
        description: "개인이 직접 관리하는 퇴직연금"
    },
    disabilityPension: {
        name: "장애연금",
        age: "연령 무관",
        amount: "장애정도별 차등",
        eligibility: "국민연금 가입 중 장애 발생",
        description: "장애로 인한 소득감소 보전"
    },
    survivorPension: {
        name: "유족연금",
        age: "연령 무관",
        amount: "사망자 연금액의 60%",
        eligibility: "연금수급자 또는 가입자 사망",
        description: "가족의 생계보장을 위한 연금"
    },
    farmersEtc: {
        name: "기초생활수급자 연금",
        age: "65세 이상",
        amount: "월 최대 33만원",
        eligibility: "기초생활수급자",
        description: "기초생활수급자도 받는 기초연금"
    },
    specialPension: {
        name: "특수직역연금",
        age: "직종별 차등",
        amount: "직종별 차등",
        eligibility: "해당 직역 종사",
        description: "특수한 직업에 종사하는 자를 위한 연금"
    }
};

// 결과 타입 정의
const resultTypes = {
    "최적화됨": {
        title: "🏆 연금 최적화 완성",
        subtitle: "다양한 연금에 가입하여 안정적인 노후를 준비하셨습니다!",
        badge: "👑",
        bgColor: "linear-gradient(45deg, #d4af37, #1e3a8a)",
        description: "현재 상태로도 충분한 노후소득이 예상되며, 추가 최적화가 가능합니다.",
        category: "최적화됨"
    },
    "양호함": {
        title: "✅ 연금 준비 양호",
        subtitle: "기본적인 연금은 확보하였으나 보완이 필요합니다",
        badge: "👍",
        bgColor: "linear-gradient(45deg, #3b82f6, #d4af37)",
        description: "현재 수준에서 몇 가지 보완하면 더욱 안정적인 노후가 가능합니다.",
        category: "양호함"
    },
    "보완필요": {
        title: "⚠️ 연금 보완 필요",
        subtitle: "기본 연금은 있지만 추가 준비가 시급합니다",
        badge: "📈",
        bgColor: "linear-gradient(45deg, #f59e0b, #3b82f6)",
        description: "현재로는 충분하지 않아 추가적인 연금 준비가 필요한 상황입니다.",
        category: "보완필요"
    },
    "준비부족": {
        title: "🚨 연금 준비 부족",
        subtitle: "노후 준비가 매우 부족한 상태입니다",
        badge: "⚡",
        bgColor: "linear-gradient(45deg, #ef4444, #f59e0b)",
        description: "현재 상태로는 노후소득이 크게 부족할 것으로 예상됩니다.",
        category: "준비부족"
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
    
    // 3번째 질문 후 중간 광고 표시
    if (currentQuestionIndex === 3) {
        adManager.showAd('ad-middle');
    }
    
    // 진행률 업데이트
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    if (progressFill) progressFill.style.width = progress + '%';
    if (currentNum) currentNum.textContent = currentQuestionIndex + 1;
    if (totalNum) totalNum.textContent = '/ ' + questions.length;
    
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
    
    // 분석 단계 애니메이션
    const steps = document.querySelectorAll('.step-item');
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('active');
            const check = step.querySelector('.step-check');
            if (check && index < 4) {
                check.textContent = '✓';
                check.style.color = '#d4af37';
            }
        }, (index + 1) * 1000);
    });
    
    // 카운트다운 시작
    let countdown = 5;
    const timerDisplay = document.querySelector('.timer-display');
    
    const timer = setInterval(() => {
        if (timerDisplay) timerDisplay.textContent = countdown;
        countdown--;
        
        if (countdown < 0) {
            clearInterval(timer);
            analyzeAnswers();
            showResults();
        }
    }, 1000);
}

// 답변 분석 함수
function analyzeAnswers() {
    let totalScore = 0;
    let eligiblePensions = [];
    let userAge = "under40";
    let userIncome = "medium";
    let userJob = "employee";
    
    userAnswers.forEach(answer => {
        if (answer.eligibility_score) totalScore += answer.eligibility_score;
        if (answer.age) userAge = answer.age;
        if (answer.income) userIncome = answer.income;
        if (answer.job) userJob = answer.job;
        
        // 연금 자격 확인
        if (answer.pension_eligible) eligiblePensions.push('basicPension');
        if (answer.national_pension && answer.eligibility !== "none") eligiblePensions.push('nationalPension');
        if (answer.public_pension) eligiblePensions.push('publicPension');
        if (answer.workplace_pension) eligiblePensions.push('retirementPension');
        if (answer.private_pension && answer.private_pension !== "none") eligiblePensions.push('personalPension');
        if (answer.basic_pension_eligible === true) eligiblePensions.push('basicPension');
        if (answer.rural_pension) eligiblePensions.push('basicPension');
    });
    
    // 중복 제거
    eligiblePensions = [...new Set(eligiblePensions)];
    
    // 결과 타입 결정
    let resultType;
    if (totalScore >= 18 && eligiblePensions.length >= 3) {
        resultType = "최적화됨";
    } else if (totalScore >= 12 && eligiblePensions.length >= 2) {
        resultType = "양호함";
    } else if (totalScore >= 8 || eligiblePensions.length >= 1) {
        resultType = "보완필요";
    } else {
        resultType = "준비부족";
    }
    
    analysisData = {
        resultType: resultType,
        totalScore: totalScore,
        eligiblePensions: eligiblePensions,
        userAge: userAge,
        userIncome: userIncome,
        userJob: userJob
    };
}

// 결과 표시 함수
function showResults() {
    if (analysisModal) analysisModal.classList.add('hidden');
    if (resultPage) resultPage.classList.remove('hidden');
    
    // 결과 페이지 중간 광고 표시 및 로드
    adManager.showAd('ad-result');
    
    const result = resultTypes[analysisData.resultType];
    
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
    updateResultContent();
}

// 결과 내용 업데이트
function updateResultContent() {
    const eligiblePensions = document.querySelector('.eligible-pensions');
    const pensionDetails = document.querySelector('.pension-details');
    const applicationGuide = document.querySelector('.application-guide');
    const additionalTips = document.querySelector('.additional-tips');
    
    // 받을 수 있는 연금 목록
    if (eligiblePensions) {
        eligiblePensions.innerHTML = `
            <h4 style="color: #1e3a8a; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                💰 내가 받을 수 있는 연금
            </h4>
            ${analysisData.eligiblePensions.length > 0 ? 
                analysisData.eligiblePensions.map(pension => {
                    const info = pensionDatabase[pension];
                    return `
                        <div style="background: rgba(212, 175, 55, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 16px; border-left: 4px solid #d4af37;">
                            <h5 style="color: #1e3a8a; margin-bottom: 8px;">${info.name}</h5>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
                                <div><strong>지급연령:</strong> ${info.age}</div>
                                <div><strong>예상금액:</strong> ${info.amount}</div>
                            </div>
                            <div style="margin-bottom: 8px;"><strong>자격조건:</strong> ${info.eligibility}</div>
                            <p style="color: #4b5563; font-size: 0.9em; margin: 0;">${info.description}</p>
                        </div>
                    `;
                }).join('') 
                : '<p style="color: #6b7280;">현재 조건으로는 수급 가능한 연금이 제한적입니다. 추가 준비가 필요합니다.</p>'
            }
        `;
    }
    
    // 연금 상세 정보
    if (pensionDetails) {
        pensionDetails.innerHTML = `
            <h4 style="color: #1e3a8a; margin-bottom: 20px;">📊 연금 수급 전략</h4>
            <div style="display: grid; gap: 16px;">
                <div style="background: rgba(59, 130, 246, 0.1); border-radius: 12px; padding: 16px;">
                    <h6 style="color: #3b82f6; margin-bottom: 8px;">🎯 우선 신청 연금</h6>
                    <p style="margin: 0; color: #374151;">65세가 되면 기초연금부터 먼저 신청하시고, 국민연금 수급시기를 결정하세요.</p>
                </div>
                <div style="background: rgba(212, 175, 55, 0.1); border-radius: 12px; padding: 16px;">
                    <h6 style="color: #d4af37; margin-bottom: 8px;">💡 추가 준비 방안</h6>
                    <p style="margin: 0; color: #374151;">연금저축이나 IRP 가입을 통해 세제혜택을 받으면서 노후소득을 늘릴 수 있습니다.</p>
                </div>
                <div style="background: rgba(16, 185, 129, 0.1); border-radius: 12px; padding: 16px;">
                    <h6 style="color: #10b981; margin-bottom: 8px;">⏰ 최적 수급 시기</h6>
                    <p style="margin: 0; color: #374151;">국민연금은 늦게 받을수록 연금액이 증가하니 개인 상황에 맞는 전략을 세우세요.</p>
                </div>
            </div>
        `;
    }
    
    // 신청 가이드
    if (applicationGuide) {
        applicationGuide.innerHTML = `
            <h4 style="color: #1e3a8a; margin-bottom: 20px;">📋 연금 신청 가이드</h4>
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(251, 248, 243, 0.8); border-radius: 12px;">
                    <div style="width: 40px; height: 40px; background: #d4af37; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">1</div>
                    <div>
                        <h6 style="margin: 0 0 4px 0; color: #1e3a8a;">기초연금 신청</h6>
                        <p style="margin: 0; font-size: 0.9em; color: #6b7280;">주민센터 방문 또는 복지로 온라인 신청</p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(251, 248, 243, 0.8); border-radius: 12px;">
                    <div style="width: 40px; height: 40px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">2</div>
                    <div>
                        <h6 style="margin: 0 0 4px 0; color: #1e3a8a;">국민연금 신청</h6>
                        <p style="margin: 0; font-size: 0.9em; color: #6b7280;">국민연금공단 지사 또는 온라인 신청</p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(251, 248, 243, 0.8); border-radius: 12px;">
                    <div style="width: 40px; height: 40px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">3</div>
                    <div>
                        <h6 style="margin: 0 0 4px 0; color: #1e3a8a;">개인연금 관리</h6>
                        <p style="margin: 0; font-size: 0.9em; color: #6b7280;">금융기관에서 연금저축 및 IRP 가입</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 추가 팁
    if (additionalTips) {
        additionalTips.innerHTML = `
            <h4 style="color: #1e3a8a; margin-bottom: 20px;">💡 연금 최적화 팁</h4>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="padding: 16px; background: rgba(239, 68, 68, 0.1); border-radius: 12px; border-left: 4px solid #ef4444;">
                    <h6 style="color: #ef4444; margin-bottom: 8px;">⚠️ 주의사항</h6>
                    <p style="color: #374151; font-size: 0.9em; line-height: 1.5; margin: 0;">
                        기초연금과 국민연금은 동시 수급이 가능하지만, 소득인정액 계산 시 국민연금액이 영향을 줄 수 있습니다.
                    </p>
                </div>
                <div style="padding: 16px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; border-left: 4px solid #10b981;">
                    <h6 style="color: #10b981; margin-bottom: 8px;">💰 절세 혜택</h6>
                    <p style="color: #374151; font-size: 0.9em; line-height: 1.5; margin: 0;">
                        연금저축과 IRP 가입 시 연간 최대 700만원까지 소득공제 혜택을 받을 수 있습니다.
                    </p>
                </div>
                <div style="padding: 16px; background: rgba(59, 130, 246, 0.1); border-radius: 12px; border-left: 4px solid #3b82f6;">
                    <h6 style="color: #3b82f6; margin-bottom: 8px;">📈 연금액 증가 전략</h6>
                    <p style="color: #374151; font-size: 0.9em; line-height: 1.5; margin: 0;">
                        국민연금 수급을 늦출 경우 매년 7.2%씩 연금액이 증가하여 최대 42.6%까지 늘릴 수 있습니다.
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
    
    // 광고 섹션들 숨기기 (상단 광고는 유지)
    adManager.hideAd('ad-middle');
    adManager.hideAd('ad-result');
}

// 카카오톡 공유 함수
function shareKakao() {
    const result = resultTypes[analysisData.resultType];
    
    const title = result ? result.title : '노후 연금 종류 자격 나이 총정리';
    const description = result ? 
        `${result.subtitle} - 받을 수 있는 연금: ${analysisData.eligiblePensions.length}개` : 
        '내가 받을 수 있는 모든 연금을 확인해보세요!';
    
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '노후 연금 종류 자격 나이 총정리',
                description: `${title} - ${description}`,
                imageUrl: window.location.origin + '/노후연금/노후연금.svg',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
            buttons: [
                {
                    title: '내 연금 확인하기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });
    } else {
        // 대체 공유 방법
        const text = `노후 연금 종류 자격 나이 총정리 - ${title}`;
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
    // 광고 시스템 초기화는 AdManager에서 자동 처리됨
    
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
            // 연금 관련 정보 사이트들
            const pensionLinks = [
                'https://www.4insure.or.kr/',                    // 국민연금공단
                'https://www.nps.or.kr/',                       // 국민연금 공식사이트
                'https://www.bokjiro.go.kr/',                   // 복지로 (기초연금)
                'https://www.welfaretime.go.kr/',               // 복지타임즈
                'https://pension.samsung.com/'                   // 삼성생명 연금보험
            ];
            
            // 순서대로 다른 연금 관련 사이트로 이동
            const linkIndex = index % pensionLinks.length;
            window.open(pensionLinks[linkIndex], '_blank');
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
