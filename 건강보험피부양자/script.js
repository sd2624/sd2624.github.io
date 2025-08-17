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

// 광고 로드 상태 추적 (중복 로드 방지)
const adLoadStatus = {
    'ad-top': false,
    'ad-middle': false,
    'ad-result': false
};

// 질문 데이터
const questions = [
    {
        question: "누구의 피부양자로 등록하려고 하시나요?",
        description: "🏥 가입자와의 관계에 따라 자격요건이 달라집니다",
        answers: [
            { text: "배우자 (남편/아내)", relationship: "spouse", relationship_score: 5, age_requirement: 0 },
            { text: "자녀 (미혼 자녀)", relationship: "child", relationship_score: 5, age_requirement: 3 },
            { text: "부모 (직계존속)", relationship: "parent", relationship_score: 4, age_requirement: 2 },
            { text: "조부모 (직계존속)", relationship: "grandparent", relationship_score: 4, age_requirement: 2 },
            { text: "형제자매 (미혼, 동거)", relationship: "sibling", relationship_score: 2, age_requirement: 4 },
            { text: "기타 가족", relationship: "other", relationship_score: 1, age_requirement: 5 }
        ]
    },
    {
        question: "본인의 나이는?",
        description: "👶 연령에 따른 특별 조건이 적용될 수 있습니다",
        answers: [
            { text: "19세 미만", age_group: "minor", age_score: 5, income_requirement: 1 },
            { text: "19-30세", age_group: "young_adult", age_score: 4, income_requirement: 3 },
            { text: "31-50세", age_group: "middle_adult", age_score: 3, income_requirement: 4 },
            { text: "51-60세", age_group: "pre_senior", age_score: 3, income_requirement: 4 },
            { text: "61-65세", age_group: "early_senior", age_score: 4, income_requirement: 3 },
            { text: "66세 이상", age_group: "senior", age_score: 5, income_requirement: 2 }
        ]
    },
    {
        question: "현재 소득 상황은?",
        description: "💰 2025년 기준 소득 한도를 확인합니다",
        answers: [
            { text: "무소득 (소득 없음)", income_level: "none", income_score: 5, risk_level: 1 },
            { text: "연 1,000만원 이하", income_level: "low", income_score: 5, risk_level: 1 },
            { text: "연 1,000~2,000만원", income_level: "medium_low", income_score: 4, risk_level: 2 },
            { text: "연 2,000~3,000만원", income_level: "medium", income_score: 2, risk_level: 4 },
            { text: "연 3,000만원 초과", income_level: "high", income_score: 1, risk_level: 5 },
            { text: "소득 변동 예정", income_level: "variable", income_score: 3, risk_level: 3 }
        ]
    },
    {
        question: "소득의 종류는?",
        description: "📊 소득 유형별로 계산 방법이 다릅니다",
        answers: [
            { text: "근로소득 (급여, 시간제)", income_type: "employment", stability: 4, calculation_ease: 4 },
            { text: "사업소득 (개인사업)", income_type: "business", stability: 2, calculation_ease: 2 },
            { text: "기타소득 (프리랜서 등)", income_type: "freelance", stability: 3, calculation_ease: 3 },
            { text: "재산소득 (임대, 이자 등)", income_type: "property", stability: 3, calculation_ease: 4 },
            { text: "연금소득", income_type: "pension", stability: 5, calculation_ease: 5 },
            { text: "혼합 (여러 종류)", income_type: "mixed", stability: 2, calculation_ease: 2 }
        ]
    },
    {
        question: "현재 건강보험 상황은?",
        description: "🏥 현재 가입 상태를 확인합니다",
        answers: [
            { text: "지역가입자 (개별 납부)", current_status: "local", urgency: 4, cost_saving: 5 },
            { text: "직장가입자 (회사에서 납부)", current_status: "workplace", urgency: 2, cost_saving: 2 },
            { text: "다른 가족의 피부양자", current_status: "dependent", urgency: 3, cost_saving: 3 },
            { text: "건강보험 미가입", current_status: "uninsured", urgency: 5, cost_saving: 5 },
            { text: "가입 상태 불확실", current_status: "uncertain", urgency: 4, cost_saving: 3 },
            { text: "최근 자격 상실", current_status: "lost", urgency: 5, cost_saving: 4 }
        ]
    },
    {
        question: "가장 중요하게 생각하는 것은?",
        description: "🎯 우선순위에 따른 맞춤 가이드를 제공합니다",
        answers: [
            { text: "보험료 절약", priority: "cost_saving", guidance_type: "financial", complexity: 2 },
            { text: "빠른 등록 처리", priority: "speed", guidance_type: "procedural", complexity: 3 },
            { text: "안정적인 자격 유지", priority: "stability", guidance_type: "long_term", complexity: 4 },
            { text: "정확한 법적 요건 확인", priority: "compliance", guidance_type: "legal", complexity: 5 },
            { text: "향후 변경 가능성 대비", priority: "flexibility", guidance_type: "strategic", complexity: 4 },
            { text: "전반적인 이해", priority: "understanding", guidance_type: "educational", complexity: 3 }
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

// DOM 로드 완료 후 초기화


// IntersectionObserver를 사용한 광고 로드 관리
function initializeAdObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const adId = entry.target.id;
                loadAdIfVisible(adId);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // 모든 광고 섹션 관찰
    const adSections = document.querySelectorAll('.ad-section');
    adSections.forEach(section => {
        observer.observe(section);
    });
}

// 광고 로드 함수 (중복 로드 방지)
function loadAdIfVisible(adId) {
    if (!adLoadStatus[adId]) {
        const adElement = document.querySelector(`#${adId} .adsbygoogle`);
        if (adElement) {
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
                adLoadStatus[adId] = true;
                console.log(`광고 로드 완료: ${adId}`);
            } catch (error) {
                console.error(`광고 로드 실패: ${adId}`, error);
            }
        }
    }
}

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
    
    // 3번째 질문 뒤에 중간 광고 표시
    const middleAdSection = document.getElementById('ad-middle');
    if (currentQuestionIndex === 3) {
        middleAdSection.style.display = 'block';
        // 광고가 화면에 보이면 로드
        loadAdIfVisible('ad-middle');
    } else {
        middleAdSection.style.display = 'none';
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
            if (check && index < 5) {
                check.textContent = '✓';
                check.style.color = '#10b981';
                check.style.background = '#10b981';
                check.style.color = 'white';
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
    
    // 결과 페이지 광고 로드
    setTimeout(() => {
        loadAdIfVisible('ad-result');
    }, 100);
}

// 답변 분석
function analyzeAnswers() {
    const relationship = userAnswers[0] || {};
    const age = userAnswers[1] || {};
    const income = userAnswers[2] || {};
    const incomeType = userAnswers[3] || {};
    const currentStatus = userAnswers[4] || {};
    const priority = userAnswers[5] || {};
    
    let eligibilityStatus = "";
    let eligibilityIcon = "";
    let incomeLimit = 0;
    let requirements = [];
    let actionPlan = [];
    let riskFactors = [];
    
    // 가족관계별 기본 자격 판정
    const relationshipType = relationship.relationship || "other";
    const ageGroup = age.age_group || "middle_adult";
    const incomeLevel = income.income_level || "medium";
    
    // 소득 한도 계산
    if (relationshipType === "parent" || relationshipType === "grandparent") {
        if (ageGroup === "senior" || ageGroup === "early_senior") {
            incomeLimit = 3000; // 60세 이상 직계존속 3천만원
        } else {
            incomeLimit = 2000; // 일반 2천만원
        }
    } else if (relationshipType === "sibling") {
        incomeLimit = 2000; // 형제자매 2천만원 (추가 조건 있음)
    } else {
        incomeLimit = 2000; // 배우자, 자녀 등 2천만원
    }
    
    // 자격 현황 판정
    let qualificationScore = 0;
    qualificationScore += relationship.relationship_score || 0;
    qualificationScore += age.age_score || 0;
    qualificationScore += income.income_score || 0;
    
    if (qualificationScore >= 12) {
        eligibilityStatus = "자격 요건 충족";
        eligibilityIcon = "✅";
    } else if (qualificationScore >= 8) {
        eligibilityStatus = "조건부 자격 충족";
        eligibilityIcon = "⚠️";
    } else {
        eligibilityStatus = "자격 요건 미충족";
        eligibilityIcon = "❌";
    }
    
    // 요건 체크리스트 생성
    requirements = [
        {
            item: "가족관계 요건",
            status: relationship.relationship_score >= 3,
            description: getRelationshipRequirement(relationshipType)
        },
        {
            item: "소득 기준",
            status: income.income_score >= 3,
            description: `연간 소득 ${incomeLimit.toLocaleString()}만원 이하`
        },
        {
            item: "연령 조건",
            status: age.age_score >= 3,
            description: getAgeRequirement(relationshipType, ageGroup)
        },
        {
            item: "거주 요건",
            status: relationshipType !== "sibling" || true,
            description: relationshipType === "sibling" ? "동일 세대 거주" : "거주지 무관"
        }
    ];
    
    // 행동 계획 생성
    if (eligibilityStatus.includes("충족")) {
        actionPlan = [
            "📋 필요서류 준비: 가족관계증명서, 소득금액증명원",
            "💻 건강보험공단 홈페이지 또는 앱에서 온라인 신청",
            "📞 불명확한 사항은 1577-1000으로 문의",
            "⏰ 신청 후 2-3일 내 심사 결과 확인"
        ];
    } else {
        actionPlan = [
            "📊 소득 조정 방안 검토 (소득 분산, 지출 증빙 등)",
            "👥 다른 가족의 피부양자 등록 가능성 확인",
            "🏥 지역가입자로 가입 유지 고려",
            "📅 향후 조건 변경 시점 모니터링"
        ];
    }
    
    // 위험 요소 분석
    if (income.risk_level >= 4) {
        riskFactors.push("소득 기준 초과 위험");
    }
    if (relationshipType === "sibling") {
        riskFactors.push("형제자매 등록 조건 까다로움");
    }
    if (incomeType.stability <= 2) {
        riskFactors.push("소득 변동성으로 인한 자격상실 위험");
    }
    if (currentStatus.urgency >= 4) {
        riskFactors.push("긴급한 처리 필요");
    }
    
    return {
        eligibilityStatus,
        eligibilityIcon,
        incomeLimit,
        requirements,
        actionPlan,
        riskFactors,
        relationshipType,
        ageGroup,
        incomeLevel,
        priority: priority.priority || "understanding",
        currentStatus: currentStatus.current_status || "uncertain"
    };
}

// 가족관계별 요건 설명
function getRelationshipRequirement(relationship) {
    const requirements = {
        spouse: "혼인신고된 배우자",
        child: "미혼 자녀 (나이 무관)",
        parent: "직계존속 (부모, 조부모)",
        grandparent: "직계존속 (부모, 조부모)",
        sibling: "미혼 형제자매 + 동거",
        other: "기타 가족관계 확인 필요"
    };
    return requirements[relationship] || "관계 확인 필요";
}

// 연령별 요건 설명
function getAgeRequirement(relationship, ageGroup) {
    if (relationship === "child") {
        return ageGroup === "minor" ? "19세 미만 자동 자격" : "미혼 조건 충족 시 가능";
    } else if (relationship === "parent" || relationship === "grandparent") {
        return ageGroup === "senior" ? "60세 이상 우대 적용" : "연령 무관";
    } else if (relationship === "sibling") {
        return "미혼 + 동거 필수";
    }
    return "연령 제한 없음";
}

// 결과 표시
function displayResult(result) {
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultSubtitle = document.getElementById('resultSubtitle');
    
    if (resultIcon) resultIcon.textContent = result.eligibilityIcon;
    if (resultTitle) resultTitle.textContent = result.eligibilityStatus;
    if (resultSubtitle) resultSubtitle.textContent = `소득 한도: 연 ${result.incomeLimit.toLocaleString()}만원`;
    
    displayDetailedAnalysis(result);
}

// 상세 분석 표시
function displayDetailedAnalysis(result) {
    const eligibilityDiv = document.querySelector('.eligibility-status .status-content');
    const incomeDiv = document.querySelector('.income-analysis .income-content');
    const requirementsDiv = document.querySelector('.requirements-check .requirements-content');
    const actionDiv = document.querySelector('.action-guide .action-content');
    
    if (eligibilityDiv) {
        const statusColor = result.eligibilityStatus.includes("충족") ? 
                           (result.eligibilityStatus.includes("조건부") ? "#f59e0b" : "#10b981") : "#ef4444";
        
        eligibilityDiv.innerHTML = `
            <div style="background: linear-gradient(135deg, ${statusColor}20, ${statusColor}10); padding: 20px; border-radius: 12px; border-left: 4px solid ${statusColor};">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <span style="font-size: 2rem;">${result.eligibilityIcon}</span>
                    <div>
                        <strong style="font-size: 1.3rem; color: ${statusColor};">${result.eligibilityStatus}</strong><br>
                        <span style="color: #64748b;">2025년 기준 자격 심사 결과</span>
                    </div>
                </div>
                <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <strong>📊 종합 평가</strong><br>
                    <span style="color: #64748b;">
                        • 가족관계: ${getRelationshipRequirement(result.relationshipType)}<br>
                        • 적용 소득한도: 연 ${result.incomeLimit.toLocaleString()}만원<br>
                        • 현재 상태: ${result.currentStatus}
                    </span>
                </div>
                ${result.riskFactors.length > 0 ? `
                <div style="background: #fef3cd; padding: 15px; border-radius: 8px; margin-top: 10px; border-left: 3px solid #f59e0b;">
                    <strong style="color: #d97706;">⚠️ 주의사항</strong><br>
                    ${result.riskFactors.map(risk => `<span style="color: #92400e;">• ${risk}</span>`).join('<br>')}
                </div>
                ` : ''}
            </div>
        `;
    }
    
    if (incomeDiv) {
        incomeDiv.innerHTML = `
            <div style="background: linear-gradient(135deg, #e0f2fe, #b3e5fc); padding: 20px; border-radius: 12px;">
                <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <strong>💰 2025년 소득기준</strong><br>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
                        <div>
                            <span style="color: #1976d2; font-weight: 600;">일반 피부양자</span><br>
                            <span style="color: #424242;">연 2,000만원 이하</span>
                        </div>
                        <div>
                            <span style="color: #1976d2; font-weight: 600;">60세 이상 직계존속</span><br>
                            <span style="color: #424242;">연 3,000만원 이하</span>
                        </div>
                    </div>
                </div>
                <div style="background: #f3e5f5; padding: 15px; border-radius: 8px;">
                    <strong>📋 소득 계산 방법</strong><br>
                    <span style="color: #64748b;">
                        • 근로소득: 총급여 - 근로소득공제<br>
                        • 사업소득: 총수입 - 필요경비<br>
                        • 기타소득: 원천징수 전 소득<br>
                        • 재산소득: 이자, 배당, 임대소득
                    </span>
                </div>
            </div>
        `;
    }
    
    if (requirementsDiv) {
        requirementsDiv.innerHTML = `
            <div style="display: grid; gap: 12px;">
                ${result.requirements.map(req => `
                    <div style="display: flex; align-items: center; padding: 15px; background: ${req.status ? '#f0f9ff' : '#fef2f2'}; border-radius: 10px; border-left: 4px solid ${req.status ? '#0ea5e9' : '#f87171'};">
                        <span style="font-size: 1.5rem; margin-right: 12px;">${req.status ? '✅' : '❌'}</span>
                        <div>
                            <strong style="color: ${req.status ? '#0c4a6e' : '#991b1b'};">${req.item}</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">${req.description}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    if (actionDiv) {
        actionDiv.innerHTML = `
            <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: 20px; border-radius: 12px;">
                <div style="margin-bottom: 20px;">
                    <strong style="color: #065f46; font-size: 1.2rem;">🎯 ${result.eligibilityStatus.includes('충족') ? '등록 절차' : '개선 방안'}</strong>
                </div>
                <div style="display: grid; gap: 12px;">
                    ${result.actionPlan.map((action, index) => `
                        <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                            <span style="width: 30px; height: 30px; background: #10b981; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; font-size: 0.9rem;">${index + 1}</span>
                            <span style="color: #374151;">${action}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="background: #fef7cd; padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <strong style="color: #92400e;">💡 Pro Tip</strong><br>
                    <span style="color: #78350f; font-size: 0.9rem;">
                        ${result.priority === 'cost_saving' ? '보험료 절약을 위해서는 정확한 소득 신고가 중요합니다.' :
                          result.priority === 'speed' ? '온라인 신청이 가장 빠르며, 서류 미비 시 처리가 지연됩니다.' :
                          result.priority === 'stability' ? '자격 유지를 위해 정기적인 소득 모니터링이 필요합니다.' :
                          '건강보험공단 상담을 통해 정확한 정보를 확인하세요.'}
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
            title: '건강보험 피부양자 자격 진단 결과',
            description: '나의 상황에 맞는 건강보험 피부양자 등록 조건을 확인했어요! 2025년 최신 기준으로 정확한 자격 요건을 알아보세요.',
            imageUrl: window.location.origin + '/건강보험피부양자/건강보험피부양자.svg',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
        },
        social: {
            likeCount: 487,
            commentCount: 156,
            sharedCount: 723,
        },
        buttons: [
            {
                title: '나도 자격 확인하기',
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

// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
});