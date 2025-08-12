// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 데이터
const questions = [
    {
        question: "현재 신용등급은 어느 정도인가요?",
        description: "💳 신용등급에 따라 이용 가능한 대출 상품이 달라집니다",
        answers: [
            { text: "1~3등급 (우수)", credit_score: "excellent", eligibility: 5, interest_rate: 1 },
            { text: "4~6등급 (양호)", credit_score: "good", eligibility: 4, interest_rate: 2 },
            { text: "7~8등급 (보통)", credit_score: "fair", eligibility: 3, interest_rate: 3 },
            { text: "9~10등급 (낮음)", credit_score: "poor", eligibility: 2, interest_rate: 4 },
            { text: "신용불량/연체", credit_score: "bad", eligibility: 1, interest_rate: 5 },
            { text: "신용등급 모름", credit_score: "unknown", eligibility: 3, interest_rate: 3 }
        ]
    },
    {
        question: "현재 소득 상황은?",
        description: "💰 소득 유형과 수준에 따른 대출 조건이 결정됩니다",
        answers: [
            { text: "정규직 (연소득 3천만원 이상)", income_type: "regular_high", stability: 5, loan_limit: 5 },
            { text: "정규직 (연소득 3천만원 미만)", income_type: "regular_low", stability: 4, loan_limit: 4 },
            { text: "비정규직/계약직", income_type: "irregular", stability: 3, loan_limit: 3 },
            { text: "자영업/프리랜서", income_type: "self_employed", stability: 2, loan_limit: 3 },
            { text: "일용직/아르바이트", income_type: "daily", stability: 2, loan_limit: 2 },
            { text: "무직/소득 없음", income_type: "unemployed", stability: 1, loan_limit: 1 }
        ]
    },
    {
        question: "기존 대출이 있나요?",
        description: "🏦 기존 대출 현황에 따라 추천 상품이 달라집니다",
        answers: [
            { text: "대출 없음", existing_debt: "none", debt_burden: 1, refinancing: 1 },
            { text: "은행 대출만 있음", existing_debt: "bank_only", debt_burden: 2, refinancing: 2 },
            { text: "저축은행/캐피탈 대출", existing_debt: "savings_capital", debt_burden: 3, refinancing: 4 },
            { text: "카드대출/현금서비스", existing_debt: "card_loan", debt_burden: 4, refinancing: 5 },
            { text: "대부업체 이용", existing_debt: "private_loan", debt_burden: 5, refinancing: 5 },
            { text: "다중채무 상황", existing_debt: "multiple", debt_burden: 5, refinancing: 5 }
        ]
    },
    {
        question: "대출을 원하는 주된 목적은?",
        description: "🎯 대출 목적에 맞는 특화 상품을 추천해드립니다",
        answers: [
            { text: "생활비/급전", purpose: "living_expense", urgency: 5, special_program: 2 },
            { text: "기존 대출 갈아타기", purpose: "refinancing", urgency: 3, special_program: 5 },
            { text: "사업자금", purpose: "business", urgency: 4, special_program: 4 },
            { text: "의료비", purpose: "medical", urgency: 5, special_program: 3 },
            { text: "교육비", purpose: "education", urgency: 3, special_program: 3 },
            { text: "기타 목적", purpose: "other", urgency: 3, special_program: 2 }
        ]
    },
    {
        question: "희망하는 대출 금액은?",
        description: "💵 필요한 대출 규모에 따라 적합한 상품을 찾아드립니다",
        answers: [
            { text: "500만원 이하", loan_amount: "small", product_match: 4, approval_chance: 5 },
            { text: "500~1,000만원", loan_amount: "medium_small", product_match: 5, approval_chance: 4 },
            { text: "1,000~2,000만원", loan_amount: "medium", product_match: 4, approval_chance: 3 },
            { text: "2,000~3,000만원", loan_amount: "large", product_match: 3, approval_chance: 2 },
            { text: "3,000만원 이상", loan_amount: "very_large", product_match: 2, approval_chance: 1 },
            { text: "금액 미정", loan_amount: "undecided", product_match: 3, approval_chance: 3 }
        ]
    },
    {
        question: "담보나 보증인 제공이 가능한가요?",
        description: "🏠 담보나 보증인 여부에 따라 조건이 개선될 수 있습니다",
        answers: [
            { text: "부동산 담보 가능", collateral: "property", security: 5, rate_improvement: 5 },
            { text: "자동차 담보 가능", collateral: "vehicle", security: 3, rate_improvement: 3 },
            { text: "보증인 섭외 가능", collateral: "guarantor", security: 4, rate_improvement: 4 },
            { text: "예금 담보 가능", collateral: "deposit", security: 3, rate_improvement: 3 },
            { text: "신용보증기금 이용", collateral: "credit_guarantee", security: 3, rate_improvement: 2 },
            { text: "담보/보증인 없음", collateral: "none", security: 1, rate_improvement: 1 }
        ]
    },
    {
        question: "가장 중요하게 생각하는 조건은?",
        description: "⭐ 우선순위에 따른 맞춤 상품을 추천해드립니다",
        answers: [
            { text: "낮은 금리", priority: "low_rate", focus: "interest", guidance_type: "rate_focused" },
            { text: "빠른 승인", priority: "quick_approval", focus: "speed", guidance_type: "speed_focused" },
            { text: "높은 한도", priority: "high_limit", focus: "amount", guidance_type: "limit_focused" },
            { text: "심사 통과율", priority: "approval_rate", focus: "approval", guidance_type: "approval_focused" },
            { text: "상환 조건", priority: "repayment", focus: "flexible", guidance_type: "flexible_focused" },
            { text: "종합적 조건", priority: "balanced", focus: "overall", guidance_type: "balanced" }
        ]
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];

// DOM 요소
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const analysisModal = document.getElementById('analysisModal');

// 테스트 시작
function startTest() {
    if (startPage) startPage.classList.add('hidden');
    if (questionPage) questionPage.classList.remove('hidden');
    
    const totalQuestions = document.getElementById('totalQuestions');
    if (totalQuestions) totalQuestions.textContent = questions.length;
    
    currentQuestionIndex = 0;
    userAnswers = [];
    showQuestion();
}

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
            if (check && index < 6) {
                check.textContent = '✓';
                check.style.background = '#1e40af';
                check.style.color = 'white';
            }
        }, (index + 1) * 1000);
    });
    
    // 카운트다운 시작
    let countdown = 7;
    const timerDisplay = document.querySelector('.timer-display');
    
    const timer = setInterval(() => {
        if (timerDisplay) timerDisplay.textContent = countdown;
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
    const credit = userAnswers[0] || {};
    const income = userAnswers[1] || {};
    const debt = userAnswers[2] || {};
    const purpose = userAnswers[3] || {};
    const amount = userAnswers[4] || {};
    const collateral = userAnswers[5] || {};
    const priority = userAnswers[6] || {};
    
    let primaryRecommendation = {};
    let alternatives = [];
    let applicationSteps = [];
    let importantNotes = [];
    
    // 신용등급과 소득 상황 기반 분석
    const creditScore = credit.credit_score || "fair";
    const incomeType = income.income_type || "regular_low";
    const debtSituation = debt.existing_debt || "none";
    const loanPurpose = purpose.purpose || "living_expense";
    
    // 주 추천 상품 결정
    if (creditScore === "bad" || debtSituation === "multiple" || incomeType === "unemployed") {
        // 신용불량자, 다중채무자, 무직자
        if (loanPurpose === "refinancing" && debtSituation !== "none") {
            primaryRecommendation = {
                name: "바꿔드림론",
                provider: "서민금융진흥원",
                rate: "연 11.0% ~ 16.0%",
                limit: "최대 2,000만원",
                features: ["기존 고금리 대출 정리", "신용등급 개선 효과", "상환 부담 경감"],
                icon: "🔄"
            };
        } else {
            primaryRecommendation = {
                name: "미소금융 대출",
                provider: "미소금융중앙재단",
                rate: "연 4.5% ~ 8.5%",
                limit: "최대 7,000만원",
                features: ["가장 저금리", "무직자도 가능", "창업 지원"],
                icon: "😊"
            };
        }
        
        alternatives = [
            { name: "햇살론", rate: "연 10.5% ~ 15.5%", provider: "서민금융진흥원" },
            { name: "신용회복위원회 지원", rate: "상황별 상이", provider: "신용회복위원회" }
        ];
        
    } else if (creditScore === "poor" || creditScore === "fair") {
        // 중저신용자
        primaryRecommendation = {
            name: "햇살론",
            provider: "서민금융진흥원",
            rate: "연 10.5% ~ 15.5%",
            limit: "최대 3,000만원",
            features: ["대표 서민대출", "신청 절차 간편", "전국 지점 이용"],
            icon: "☀️"
        };
        
        alternatives = [
            { name: "새희망홀씨", rate: "연 9.5% ~ 12.5%", provider: "신용보증기금" },
            { name: "미소금융", rate: "연 4.5% ~ 8.5%", provider: "미소금융중앙재단" }
        ];
        
    } else {
        // 중상위 신용자
        primaryRecommendation = {
            name: "새희망홀씨",
            provider: "신용보증기금",
            rate: "연 9.5% ~ 12.5%",
            limit: "최대 3,000만원",
            features: ["상대적 저금리", "안정적 조건", "신용보증 지원"],
            icon: "🌱"
        };
        
        alternatives = [
            { name: "햇살론", rate: "연 10.5% ~ 15.5%", provider: "서민금융진흥원" },
            { name: "은행 신용대출", rate: "연 3% ~ 8%", provider: "시중은행" }
        ];
    }
    
    // 신청 가이드 생성
    applicationSteps = [
        `${primaryRecommendation.provider} 홈페이지 접속`,
        "본인 신용등급 확인 (KCB, NICE 등)",
        "소득증빙서류 준비 (재직증명서, 소득금액증명원 등)",
        "온라인 사전 심사 신청",
        "필요 서류 제출 (신분증, 주민등록등본 등)",
        "심사 결과 확인 (보통 1-3일 소요)",
        "최종 승인 시 대출 실행"
    ];
    
    // 중요 안내사항 생성
    importantNotes = [
        "대출 신청 전 본인의 상환 능력을 정확히 파악하세요",
        "여러 곳에 동시 신청하면 신용등급에 악영향을 줄 수 있습니다",
        "정부지원대출은 소득 기준과 자격 요건이 있으니 사전 확인하세요"
    ];
    
    if (creditScore === "bad" || debtSituation === "multiple") {
        importantNotes.push("신용회복위원회 상담을 먼저 받아보시기 바랍니다");
    }
    
    if (incomeType === "unemployed") {
        importantNotes.push("무직자의 경우 소득 증빙이 어려우니 대안 방법을 준비하세요");
    }
    
    return {
        primaryRecommendation,
        alternatives,
        applicationSteps,
        importantNotes,
        creditScore,
        incomeType,
        debtSituation,
        priority: priority.priority || "balanced"
    };
}

// 결과 표시
function displayResult(result) {
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultSubtitle = document.getElementById('resultSubtitle');
    
    if (resultIcon) resultIcon.textContent = result.primaryRecommendation.icon;
    if (resultTitle) resultTitle.textContent = result.primaryRecommendation.name;
    if (resultSubtitle) resultSubtitle.textContent = result.primaryRecommendation.provider;
    
    displayDetailedAnalysis(result);
}

// 상세 분석 표시
function displayDetailedAnalysis(result) {
    const primaryDiv = document.querySelector('.primary-recommendation .primary-content');
    const alternativeDiv = document.querySelector('.alternative-options .alternative-content');
    const applicationDiv = document.querySelector('.application-guide .application-content');
    const notesDiv = document.querySelector('.important-notes .notes-content');
    
    if (primaryDiv) {
        primaryDiv.innerHTML = `
            <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 25px; border-radius: 15px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                    <span style="font-size: 3rem;">${result.primaryRecommendation.icon}</span>
                    <div>
                        <h3 style="font-size: 1.8rem; margin-bottom: 8px;">${result.primaryRecommendation.name}</h3>
                        <p style="font-size: 1.1rem; opacity: 0.9;">${result.primaryRecommendation.provider}</p>
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <strong>금리</strong><br>
                            <span style="font-size: 1.2rem;">${result.primaryRecommendation.rate}</span>
                        </div>
                        <div>
                            <strong>한도</strong><br>
                            <span style="font-size: 1.2rem;">${result.primaryRecommendation.limit}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <strong style="font-size: 1.1rem;">🎯 주요 특징</strong><br>
                    ${result.primaryRecommendation.features.map(feature => `<span style="display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 12px; margin: 5px 3px 0 0; border-radius: 20px; font-size: 0.9rem;">• ${feature}</span>`).join('')}
                </div>
            </div>
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #1e40af;">
                <strong style="color: #1e40af;">💡 왜 이 상품을 추천하나요?</strong><br>
                <span style="color: #64748b; margin-top: 10px; display: block;">
                    ${result.creditScore === 'bad' ? '신용이 어려운 상황에서도 이용 가능한 정부지원 상품입니다.' :
                      result.creditScore === 'poor' || result.creditScore === 'fair' ? '중저신용자에게 가장 접근성이 좋은 대표적인 서민대출입니다.' :
                      '안정적인 조건과 합리적인 금리를 제공하는 정책금융 상품입니다.'}
                </span>
            </div>
        `;
    }
    
    if (alternativeDiv) {
        alternativeDiv.innerHTML = `
            <div style="display: grid; gap: 15px;">
                ${result.alternatives.map((alt, index) => `
                    <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); padding: 20px; border-radius: 12px; border-left: 4px solid #64748b;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: #1e293b; font-size: 1.2rem;">${index + 2}순위: ${alt.name}</strong><br>
                                <span style="color: #64748b;">${alt.provider}</span>
                            </div>
                            <div style="text-align: right;">
                                <span style="color: #1e40af; font-weight: 600;">${alt.rate}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="background: #fef3cd; padding: 15px; border-radius: 10px; margin-top: 15px; border-left: 3px solid #f59e0b;">
                <strong style="color: #92400e;">📋 대안 검토 팁</strong><br>
                <span style="color: #78350f; font-size: 0.9rem;">
                    1순위 상품이 거절되더라도 포기하지 마세요. 각 기관별로 심사 기준이 다르므로 대안 상품도 충분히 가능성이 있습니다.
                </span>
            </div>
        `;
    }
    
    if (applicationDiv) {
        applicationDiv.innerHTML = `
            <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: 20px; border-radius: 12px;">
                <div style="margin-bottom: 20px;">
                    <strong style="color: #065f46; font-size: 1.2rem;">📋 단계별 신청 가이드</strong>
                </div>
                <div style="display: grid; gap: 12px;">
                    ${result.applicationSteps.map((step, index) => `
                        <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                            <span style="width: 30px; height: 30px; background: #059669; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; font-size: 0.9rem;">${index + 1}</span>
                            <span style="color: #374151;">${step}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <strong style="color: #0277bd;">⏰ 예상 소요 시간</strong><br>
                    <span style="color: #01579b; font-size: 0.9rem;">
                        • 온라인 신청: 10-15분<br>
                        • 심사 기간: 1-3일<br>
                        • 대출 실행: 승인 후 당일
                    </span>
                </div>
            </div>
        `;
    }
    
    if (notesDiv) {
        notesDiv.innerHTML = `
            <div style="background: linear-gradient(135deg, #fef2f2, #fecaca); padding: 20px; border-radius: 12px;">
                <div style="margin-bottom: 20px;">
                    <strong style="color: #991b1b; font-size: 1.2rem;">⚠️ 반드시 확인하세요</strong>
                </div>
                <div style="display: grid; gap: 12px;">
                    ${result.importantNotes.map(note => `
                        <div style="display: flex; align-items: flex-start; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #dc2626;">
                            <span style="color: #dc2626; font-size: 1.2rem; margin-right: 12px;">•</span>
                            <span style="color: #374151; line-height: 1.5;">${note}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="background: #1e293b; color: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <strong>🔒 사기 대출 주의</strong><br>
                    <span style="font-size: 0.9rem; opacity: 0.9;">
                        • 선입금이나 수수료를 요구하는 업체는 100% 사기입니다<br>
                        • 정부지원대출은 공식 홈페이지에서만 신청하세요<br>
                        • 의심스러운 문자나 전화를 받으면 해당 기관에 직접 확인하세요
                    </span>
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
            title: '정부지원대출 맞춤 추천 결과',
            description: '나의 신용상태와 소득조건에 맞는 정부지원대출을 찾았어요! 무직자, 신용불량자도 이용 가능한 서민대출 정보를 확인하세요.',
            imageUrl: window.location.origin + '/정부지원대출/정부지원대출.svg',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
        },
        social: {
            likeCount: 612,
            commentCount: 203,
            sharedCount: 934,
        },
        buttons: [
            {
                title: '나도 대출 찾기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
        ],
    });
}

// 테스트 재시작
function restartTest() {
    if (resultPage) resultPage.classList.add('hidden');
    if (startPage) startPage.classList.remove('hidden');
    
    currentQuestionIndex = 0;
    userAnswers = [];
    
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) progressFill.style.width = '0%';
}

// 상세 가이드 모달 표시
function showDetailedGuide() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) {
        guideModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        const checkboxes = guideModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    this.parentElement.style.backgroundColor = '#e8f5e8';
                    this.parentElement.style.color = '#065f46';
                } else {
                    this.parentElement.style.backgroundColor = '';
                    this.parentElement.style.color = '';
                }
            });
        });
    }
}

// 상세 가이드 모달 닫기
function closeGuideModal() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) {
        guideModal.classList.add('hidden');
        document.body.style.overflow = '';
        
        const checkboxes = guideModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.parentElement.style.backgroundColor = '';
            checkbox.parentElement.style.color = '';
        });
    }
}

// 키보드 이벤트
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const guideModal = document.getElementById('guideModal');
        const analysisModal = document.getElementById('analysisModal');
        
        if (guideModal && !guideModal.classList.contains('hidden')) {
            closeGuideModal();
        } else if (analysisModal && !analysisModal.classList.contains('hidden')) {
            analysisModal.classList.add('hidden');
            if (questionPage) questionPage.classList.remove('hidden');
        }
    }
    
    if (questionPage && !questionPage.classList.contains('hidden')) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 6) {
            const options = document.querySelectorAll('.answer-option');
            if (options[num - 1]) {
                options[num - 1].click();
            }
        }
    }
});

// 모달 바깥 클릭 시 닫기
document.addEventListener('click', function(e) {
    const guideModal = document.getElementById('guideModal');
    if (guideModal && e.target === guideModal) {
        closeGuideModal();
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
window.showDetailedGuide = showDetailedGuide;
window.closeGuideModal = closeGuideModal;
