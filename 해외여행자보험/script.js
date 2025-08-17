// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 데이터
const questions = [
    {
        question: "현재 어디에 계신가요?",
        description: "📍 현재 위치에 따라 가입 가능한 보험이 달라집니다",
        answers: [
            { text: "한국 (출국 전)", location: "korea", eligibility: "full", premium_factor: 1.0 },
            { text: "해외 여행 중 (관광비자)", location: "overseas_travel", eligibility: "limited", premium_factor: 1.5 },
            { text: "해외 장기 체류 (워킹홀리데이)", location: "working_holiday", eligibility: "limited", premium_factor: 2.0 },
            { text: "해외 거주 (영주권/시민권)", location: "overseas_resident", eligibility: "very_limited", premium_factor: 3.0 },
            { text: "기타 해외 체류", location: "other_overseas", eligibility: "case_by_case", premium_factor: 2.5 }
        ]
    },
    {
        question: "해외에 머무른 기간은 얼마나 되시나요?",
        description: "📅 체류 기간이 길수록 가입 제한이 많아집니다",
        answers: [
            { text: "1개월 미만", duration: "short", restriction_level: 1, urgency: "low" },
            { text: "1~3개월", duration: "medium", restriction_level: 2, urgency: "medium" },
            { text: "3~6개월", duration: "long", restriction_level: 3, urgency: "high" },
            { text: "6개월~1년", duration: "very_long", restriction_level: 4, urgency: "very_high" },
            { text: "1년 이상", duration: "permanent", restriction_level: 5, urgency: "urgent" }
        ]
    },
    {
        question: "현재 건강 상태는 어떠신가요?",
        description: "🏥 건강 상태는 보험 가입의 핵심 요소입니다",
        answers: [
            { text: "매우 건강함 (병원 방문 없음)", health: "excellent", medical_risk: 1, premium_adj: 0 },
            { text: "양호함 (감기 등 경미한 질환만)", health: "good", medical_risk: 2, premium_adj: 0.1 },
            { text: "보통 (정기 검진 정도)", health: "fair", medical_risk: 3, premium_adj: 0.2 },
            { text: "약간 안좋음 (복용 중인 약 있음)", health: "poor", medical_risk: 4, premium_adj: 0.5 },
            { text: "치료 중인 질환 있음", health: "sick", medical_risk: 5, premium_adj: 1.0 }
        ]
    },
    {
        question: "현재 머무르고 있는 국가/지역은?",
        description: "🌍 국가별로 보험 가입 정책이 다릅니다",
        answers: [
            { text: "미국/캐나다", country: "north_america", risk_level: 4, available_options: 3 },
            { text: "유럽 (서유럽)", country: "europe", risk_level: 2, available_options: 4 },
            { text: "일본/호주/뉴질랜드", country: "developed_asia", risk_level: 1, available_options: 5 },
            { text: "동남아시아", country: "southeast_asia", risk_level: 3, available_options: 4 },
            { text: "기타 지역", country: "others", risk_level: 5, available_options: 2 }
        ]
    },
    {
        question: "여행자보험 가입이 필요한 이유는?",
        description: "🎯 목적에 따라 추천하는 보험 종류가 달라집니다",
        answers: [
            { text: "예방 차원 (아직 문제없음)", purpose: "prevention", priority: "comprehensive", urgency_score: 1 },
            { text: "의료비가 걱정됨", purpose: "medical_concern", priority: "medical", urgency_score: 2 },
            { text: "사고/도난 대비", purpose: "accident_theft", priority: "accident", urgency_score: 2 },
            { text: "비자/입국 요구사항", purpose: "visa_requirement", priority: "legal", urgency_score: 3 },
            { text: "긴급 상황 발생", purpose: "emergency", priority: "immediate", urgency_score: 5 }
        ]
    },
    {
        question: "보험료 예산은 어느 정도 생각하고 계신가요?",
        description: "💰 예산에 따라 가입 가능한 상품이 결정됩니다",
        answers: [
            { text: "월 3만원 이하", budget: "low", coverage_level: 1, options_available: 2 },
            { text: "월 3~5만원", budget: "medium_low", coverage_level: 2, options_available: 3 },
            { text: "월 5~10만원", budget: "medium", coverage_level: 3, options_available: 4 },
            { text: "월 10~15만원", budget: "high", coverage_level: 4, options_available: 5 },
            { text: "비용보다 보장이 우선", budget: "premium", coverage_level: 5, options_available: 6 }
        ]
    },
    {
        question: "언제까지 보험이 필요하신가요?",
        description: "📆 보험 기간에 따라 가입 방식이 달라집니다",
        answers: [
            { text: "1개월 이내", period: "short_term", flexibility: "high", cost_efficiency: "good" },
            { text: "1~3개월", period: "medium_term", flexibility: "medium", cost_efficiency: "fair" },
            { text: "3~6개월", period: "long_term", flexibility: "low", cost_efficiency: "poor" },
            { text: "6개월~1년", period: "annual", flexibility: "very_low", cost_efficiency: "very_poor" },
            { text: "1년 이상/무기한", period: "permanent", flexibility: "none", cost_efficiency: "worst" }
        ]
    }
];

// 결과 타입 정의
const resultTypes = {
    "즉시가입가능": {
        title: "✅ 즉시 가입 가능",
        subtitle: "현재 상황에서 바로 가입할 수 있는 상품이 있습니다!",
        badge: "🎯",
        bgColor: "linear-gradient(45deg, #16a085, #0ea5e9)",
        description: "여러 보험사에서 온라인으로 즉시 가입이 가능한 상태입니다.",
        category: "즉시가입가능"
    },
    "조건부가능": {
        title: "⚠️ 조건부 가입 가능",
        subtitle: "일부 제한이 있지만 가입 가능한 상품이 있습니다",
        badge: "📋",
        bgColor: "linear-gradient(45deg, #f59e0b, #16a085)",
        description: "몇 가지 조건을 충족하거나 추가 절차를 거치면 가입할 수 있습니다.",
        category: "조건부가능"
    },
    "제한적가능": {
        title: "🔒 제한적 가입 가능",
        subtitle: "가입 가능하지만 보장 범위가 제한적입니다",
        badge: "⚡",
        bgColor: "linear-gradient(45deg, #dc2626, #f59e0b)",
        description: "일부 보험사에서만 가입 가능하며, 보장 내용이 제한될 수 있습니다.",
        category: "제한적가능"
    },
    "가입어려움": {
        title: "❌ 가입 어려움",
        subtitle: "현재 상황에서는 일반적인 가입이 어렵습니다",
        badge: "🚫",
        bgColor: "linear-gradient(45deg, #dc2626, #991b1b)",
        description: "대부분의 보험사에서 가입을 거부하거나 매우 제한적인 조건만 제공합니다.",
        category: "가입어려움"
    }
};

// 보험 가입 정보
const insuranceOptions = {
    immediate: [
        { name: "삼성화재 여행자보험", type: "온라인 즉시가입", coverage: "의료비 1억원", premium: "월 45,000원" },
        { name: "현대해상 해외여행보험", type: "실시간 가입", coverage: "종합보장", premium: "월 38,000원" },
        { name: "DB손해보험 여행보험", type: "24시간 가입", coverage: "의료비 5천만원", premium: "월 32,000원" }
    ],
    conditional: [
        { name: "메리츠화재 해외보험", type: "심사 후 가입", coverage: "기본 의료비", premium: "월 55,000원" },
        { name: "KB손해보험 여행보험", type: "건강고지 필요", coverage: "제한적 보장", premium: "월 48,000원" }
    ],
    limited: [
        { name: "한화손해보험 특별가입", type: "특수조건", coverage: "응급의료만", premium: "월 75,000원" },
        { name: "롯데손해보험 해외거주자", type: "거주자 전용", coverage: "최소보장", premium: "월 68,000원" }
    ],
    difficult: []
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
                check.style.color = '#16a085';
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
            analyzeEligibility();
            showResults();
        }
    }, 1000);
}

// 가입 자격 분석 함수
function analyzeEligibility() {
    let eligibilityScore = 0;
    let restrictionLevel = 0;
    let riskLevel = 0;
    let urgencyScore = 0;
    
    userAnswers.forEach(answer => {
        // 기본 자격 점수
        if (answer.eligibility === "full") eligibilityScore += 5;
        else if (answer.eligibility === "limited") eligibilityScore += 3;
        else if (answer.eligibility === "very_limited") eligibilityScore += 1;
        else if (answer.eligibility === "case_by_case") eligibilityScore += 2;
        
        // 제한 수준
        if (answer.restriction_level) restrictionLevel += answer.restriction_level;
        if (answer.medical_risk) riskLevel += answer.medical_risk;
        if (answer.risk_level) riskLevel += answer.risk_level;
        if (answer.urgency_score) urgencyScore += answer.urgency_score;
    });
    
    // 결과 타입 결정
    let resultType;
    if (eligibilityScore >= 20 && restrictionLevel <= 8 && riskLevel <= 6) {
        resultType = "즉시가입가능";
    } else if (eligibilityScore >= 12 && restrictionLevel <= 15) {
        resultType = "조건부가능";
    } else if (eligibilityScore >= 6) {
        resultType = "제한적가능";
    } else {
        resultType = "가입어려움";
    }
    
    analysisData = {
        resultType: resultType,
        eligibilityScore: eligibilityScore,
        restrictionLevel: restrictionLevel,
        riskLevel: riskLevel,
        urgencyScore: urgencyScore
    };
}

// 결과 표시 함수
function showResults() {
    if (analysisModal) analysisModal.classList.add('hidden');
    if (resultPage) resultPage.classList.remove('hidden');
    
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
    const eligibilityStatus = document.querySelector('.eligibility-status');
    const availableOptions = document.querySelector('.available-options');
    const applicationGuide = document.querySelector('.application-guide');
    const importantNotes = document.querySelector('.important-notes');
    
    const result = resultTypes[analysisData.resultType];
    
    // 가입 자격 상태
    if (eligibilityStatus) {
        eligibilityStatus.innerHTML = `
            <h4 style="color: #1e40af; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                📋 가입 자격 분석 결과
            </h4>
            <div style="background: rgba(30, 64, 175, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h5 style="color: #1e40af; margin-bottom: 12px;">${result.title}</h5>
                <p style="color: #4b5563; line-height: 1.6; margin: 0;">${result.description}</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
                <div style="text-align: center; padding: 16px; background: rgba(22, 160, 133, 0.1); border-radius: 12px;">
                    <div style="font-size: 1.5em; color: #16a085; font-weight: bold; margin-bottom: 4px;">${analysisData.eligibilityScore}</div>
                    <div style="font-size: 0.9em; color: #6b7280;">자격 점수</div>
                </div>
                <div style="text-align: center; padding: 16px; background: rgba(245, 158, 11, 0.1); border-radius: 12px;">
                    <div style="font-size: 1.5em; color: #f59e0b; font-weight: bold; margin-bottom: 4px;">${analysisData.restrictionLevel}</div>
                    <div style="font-size: 0.9em; color: #6b7280;">제한 수준</div>
                </div>
                <div style="text-align: center; padding: 16px; background: rgba(220, 38, 38, 0.1); border-radius: 12px;">
                    <div style="font-size: 1.5em; color: #dc2626; font-weight: bold; margin-bottom: 4px;">${analysisData.riskLevel}</div>
                    <div style="font-size: 0.9em; color: #6b7280;">위험 수준</div>
                </div>
            </div>
        `;
    }
    
    // 가입 가능한 상품
    if (availableOptions) {
        let optionsHtml = '';
        let availableInsurance = [];
        
        if (analysisData.resultType === "즉시가입가능") {
            availableInsurance = insuranceOptions.immediate;
        } else if (analysisData.resultType === "조건부가능") {
            availableInsurance = insuranceOptions.conditional;
        } else if (analysisData.resultType === "제한적가능") {
            availableInsurance = insuranceOptions.limited;
        } else {
            availableInsurance = insuranceOptions.difficult;
        }
        
        if (availableInsurance.length > 0) {
            optionsHtml = availableInsurance.map(insurance => `
                <div style="background: rgba(254, 252, 232, 0.8); border-radius: 12px; padding: 20px; margin-bottom: 16px; border-left: 4px solid #16a085;">
                    <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 12px;">
                        <h6 style="color: #1e40af; margin: 0; flex: 1;">${insurance.name}</h6>
                        <span style="background: #16a085; color: white; padding: 4px 12px; border-radius: 16px; font-size: 0.8em;">${insurance.type}</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
                        <div><strong>보장한도:</strong> ${insurance.coverage}</div>
                        <div><strong>예상보험료:</strong> ${insurance.premium}</div>
                    </div>
                </div>
            `).join('');
        } else {
            optionsHtml = '<p style="color: #6b7280; text-align: center; padding: 20px;">현재 상황에서 가입 가능한 일반적인 상품이 없습니다.</p>';
        }
        
        availableOptions.innerHTML = `
            <h4 style="color: #1e40af; margin-bottom: 20px;">🏥 가입 가능한 보험 상품</h4>
            ${optionsHtml}
        `;
    }
    
    // 가입 가이드
    if (applicationGuide) {
        let guideSteps = [];
        
        if (analysisData.resultType === "즉시가입가능") {
            guideSteps = [
                { step: 1, title: "온라인 가입", desc: "보험사 홈페이지에서 즉시 가입 가능" },
                { step: 2, title: "결제 완료", desc: "신용카드 또는 계좌이체로 결제" },
                { step: 3, title: "보험증서 발급", desc: "이메일로 즉시 보험증서 수신" }
            ];
        } else if (analysisData.resultType === "조건부가능") {
            guideSteps = [
                { step: 1, title: "건강고지서 작성", desc: "현재 건강상태를 정확히 고지" },
                { step: 2, title: "심사 대기", desc: "보험사 심사 (1-3일 소요)" },
                { step: 3, title: "조건부 승인", desc: "일부 조건이나 할증으로 가입" }
            ];
        } else {
            guideSteps = [
                { step: 1, title: "전문 상담", desc: "보험사 해외담당자와 상담 필요" },
                { step: 2, title: "특별심사", desc: "개별 심사를 통한 가입 검토" },
                { step: 3, title: "제한적 승인", desc: "일부 보장만 가능할 수 있음" }
            ];
        }
        
        applicationGuide.innerHTML = `
            <h4 style="color: #1e40af; margin-bottom: 20px;">📞 가입 절차 안내</h4>
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${guideSteps.map(step => `
                    <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(254, 252, 232, 0.8); border-radius: 12px;">
                        <div style="width: 40px; height: 40px; background: #1e40af; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${step.step}</div>
                        <div>
                            <h6 style="margin: 0 0 4px 0; color: #1e40af;">${step.title}</h6>
                            <p style="margin: 0; font-size: 0.9em; color: #6b7280;">${step.desc}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // 중요 안내사항
    if (importantNotes) {
        importantNotes.innerHTML = `
            <h4 style="color: #1e40af; margin-bottom: 20px;">⚠️ 중요 안내사항</h4>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="padding: 16px; background: rgba(220, 38, 38, 0.1); border-radius: 12px; border-left: 4px solid #dc2626;">
                    <h6 style="color: #dc2626; margin-bottom: 8px;">보장 개시일 확인</h6>
                    <p style="color: #374151; font-size: 0.9em; line-height: 1.5; margin: 0;">
                        가입 후 보장이 시작되는 시점을 반드시 확인하세요. 일부 보험은 가입 즉시, 일부는 다음 날부터 보장됩니다.
                    </p>
                </div>
                <div style="padding: 16px; background: rgba(245, 158, 11, 0.1); border-radius: 12px; border-left: 4px solid #f59e0b;">
                    <h6 style="color: #f59e0b; margin-bottom: 8px;">기존 질병 면책</h6>
                    <p style="color: #374151; font-size: 0.9em; line-height: 1.5; margin: 0;">
                        가입 전에 이미 앓고 있던 질병이나 발생한 사고는 보상받을 수 없습니다.
                    </p>
                </div>
                <div style="padding: 16px; background: rgba(22, 160, 133, 0.1); border-radius: 12px; border-left: 4px solid #16a085;">
                    <h6 style="color: #16a085; margin-bottom: 8px;">긴급 연락처 저장</h6>
                    <p style="color: #374151; font-size: 0.9em; line-height: 1.5; margin: 0;">
                        보험가입 후 24시간 긴급상황 연락처를 휴대폰에 저장해두세요.
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
    
    const title = result ? result.title : '해외에서 여행자보험 가입 가능할까';
    const description = result ? 
        `${result.subtitle} - 자격점수: ${analysisData.eligibilityScore}점` : 
        '해외에서도 여행자보험 가입이 가능한지 확인해보세요!';
    
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '해외에서 여행자보험 가입 가능할까',
                description: `${title} - ${description}`,
                imageUrl: window.location.origin + '/해외여행자보험/해외여행자보험.svg',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
            buttons: [
                {
                    title: '가입 가능성 확인하기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });
    } else {
        // 대체 공유 방법
        const text = `해외에서 여행자보험 가입 가능할까 - ${title}`;
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
    const otherTestBtns = document.querySelectorAll('.other-test-btn');
    const shareBtns = document.querySelectorAll('.share-btn');
    const restartBtns = document.querySelectorAll('.restart-btn');
    
    if (startBtn) {
        startBtn.addEventListener('click', startTest);
    }
    
    detailBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // 여행자보험 가입 사이트들
            const insuranceLinks = [
                'https://direct.samsung.co.kr/travel/',  // 삼성화재 여행자보험
                'https://www.hi.co.kr/travel/',         // 현대해상 해외여행보험
                'https://direct.dbgeneral.co.kr/travel/', // DB손해보험 여행보험
                'https://www.meritzfire.com/travel/',   // 메리츠화재 해외보험
                'https://direct.kbinsure.co.kr/travel/'  // KB손해보험 여행보험
            ];
            
            // 순서대로 다른 보험사 링크로 이동
            const linkIndex = index % insuranceLinks.length;
            window.open(insuranceLinks[linkIndex], '_blank');
        });
    });
    
    otherTestBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = '../index.html';
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
