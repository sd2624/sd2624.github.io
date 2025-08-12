// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 데이터
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
    
    // 총 질문 수 표시
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
                check.style.color = '#4caf50';
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
}

// 답변 분석
function analyzeAnswers() {
    const condition = userAnswers[0];
    const coverage = userAnswers[1];
    const timing = userAnswers[2];
    const budget = userAnswers[3];
    const priority = userAnswers[4];
    
    // 점수 계산
    const healthScore = condition.score;
    const urgencyScore = timing.priority;
    const budgetLevel = budget.level;
    
    // 면책기간 계산
    let waitingPeriod = "3-6개월";
    let recommendation = "";
    let tips = [];
    
    if (healthScore >= 4 && urgencyScore <= 2) {
        waitingPeriod = "90일";
        recommendation = "면책기간 단축 가능";
        tips.push("건강검진서 제출로 면책기간 단축");
        tips.push("온라인 가입 시 10% 할인");
    } else if (urgencyScore >= 4) {
        waitingPeriod = "즉시 (사고성만)";
        recommendation = "사고성 치아보험 추천";
        tips.push("사고성 치아손상은 즉시 보장");
        tips.push("일반 치료는 90일 대기");
    } else {
        waitingPeriod = "3-12개월";
        recommendation = "일반 치아보험";
        tips.push("면책기간 단축 특약 고려");
        tips.push("가족 단체 가입 할인");
    }
    
    return {
        waitingPeriod,
        recommendation,
        tips,
        healthScore,
        urgencyScore,
        budgetLevel
    };
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
            </div>
        `;
    }
    
    if (costSavingsDiv) {
        costSavingsDiv.innerHTML = `
            <h3>💰 보험료 절약 팁</h3>
            <ul style="margin: 15px 0; padding-left: 20px;">
                ${result.tips.map(tip => `<li style="margin: 8px 0;">${tip}</li>`).join('')}
                <li style="margin: 8px 0;">자동차보험과 통합 시 할인</li>
                <li style="margin: 8px 0;">건강검진 우수자 할인 적용</li>
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

// 팝업 광고 표시
function showPopupAd() {
    setTimeout(() => {
        if (typeof adsbygoogle !== 'undefined') {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, 100);
}

// 키보드 이벤트
document.addEventListener('keydown', function(e) {
    // ESC로 모달 닫기
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
window.showDetailedGuide = showDetailedGuide;
window.closeGuideModal = closeGuideModal;

// 상세 가이드 모달 표시
function showDetailedGuide() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) {
        guideModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// 상세 가이드 모달 닫기
function closeGuideModal() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) {
        guideModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// 모달 바깥 클릭 시 닫기
document.addEventListener('click', function(e) {
    const guideModal = document.getElementById('guideModal');
    if (guideModal && e.target === guideModal) {
        closeGuideModal();
    }
});

// ESC 키로 가이드 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const guideModal = document.getElementById('guideModal');
        if (guideModal && !guideModal.classList.contains('hidden')) {
            closeGuideModal();
        }
    }
});
