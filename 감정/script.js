// AI 감정 분석 테스트 - 6단계 페이지 분리 JavaScript

// 카카오 SDK 초기화
function initKakao() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('3413c1beb87e9b2f3b7fce37dde67b4d');
        console.log('카카오 SDK 초기화 완료');
    }
}

// 전역 변수
let currentStep = 1;
let currentQuestion = 0;
let currentResultStep = 1;
let emotionScores = {};
let answers = [];
let testResult = null;

// 페이지 이동 관리
const pageManager = {
    currentPage: 'step1',
    
    // 다음 스텝으로 이동
    nextStep() {
        if (currentStep < 6) {
            this.hideCurrentPage();
            currentStep++;
            this.showPage(`step${currentStep}`);
            this.loadStepAd(currentStep);
        }
    },
    
    // 특정 페이지 표시
    showPage(pageId) {
        // 모든 페이지 숨기기
        document.querySelectorAll('.step-page, .result-step-page').forEach(page => {
            page.classList.remove('active');
        });
        
        // 선택된 페이지 표시
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }
    },
    
    // 현재 페이지 숨기기
    hideCurrentPage() {
        const currentPage = document.getElementById(this.currentPage);
        if (currentPage) {
            currentPage.classList.remove('active');
        }
    },
    
    // 스텝별 광고 로드
    loadStepAd(step) {
        // 상단, 중간, 하단 광고를 모두 로드
        const topAdId = `adTopNative${step}`;
        const midAdId = `adMidNative${step}`;
        const bottomAdId = `adBottomCTA${step}`;
        
        // 각 광고 컨테이너가 존재하면 관찰 시작
        setTimeout(() => {
            adManager.observe(topAdId);
            adManager.observe(midAdId);
            adManager.observe(bottomAdId);
        }, 100);
    }
};

// 광고 관리자
const adManager = {
    observer: null,
    loadedAds: new Set(),
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const adContainer = entry.target;
                    const adId = adContainer.id;
                    
                    if (!this.loadedAds.has(adId)) {
                        this.loadAd(adId);
                        this.loadedAds.add(adId);
                        this.observer.unobserve(adContainer);
                    }
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });
        
        // 앵커 광고 표시
        this.showAnchorAd();
    },
    
    observe(adId) {
        const adElement = document.getElementById(adId);
        if (adElement && this.observer) {
            this.observer.observe(adElement);
        }
    },
    
    loadAd(adId) {
        try {
            const adElement = document.getElementById(adId);
            if (adElement && typeof (adsbygoogle) !== 'undefined') {
                if (window.innerWidth <= 768) {
                    adElement.style.minHeight = '60px';
                    adElement.style.maxHeight = '80px';
                } else {
                    adElement.style.minHeight = '80px';
                    adElement.style.maxHeight = '120px';
                }
                
                (adsbygoogle = window.adsbygoogle || []).push({});
                console.log(`광고 로드 완료: ${adId}`);
            }
        } catch (error) {
            console.error(`광고 로드 실패: ${adId}`, error);
        }
    },
    
    showAnchorAd() {
        setTimeout(() => {
            const anchorAd = document.getElementById('anchorAd');
            if (anchorAd) {
                anchorAd.style.display = 'block';
                this.observe('anchorAd');
            }
        }, 5000);
    }
};

// 질문 데이터
const questions = [
    {
        text: "최근 일주일 동안 기분은 어떠셨나요?",
        emoji: "😊",
        answers: [
            { text: "매우 좋았어요", scores: { joy: 5, calm: 3 } },
            { text: "좋은 편이었어요", scores: { joy: 3, calm: 2 } },
            { text: "보통이었어요", scores: { neutral: 3 } },
            { text: "좋지 않았어요", scores: { sad: 3, stress: 2 } },
            { text: "매우 안 좋았어요", scores: { sad: 5, stress: 4 } }
        ]
    },
    {
        text: "스트레스를 받을 때 주로 어떤 반응을 보이시나요?",
        emoji: "😤",
        answers: [
            { text: "화가 나고 짜증이 나요", scores: { angry: 4, stress: 3 } },
            { text: "우울해지고 의기소침해져요", scores: { sad: 4, stress: 3 } },
            { text: "불안하고 초조해져요", scores: { fear: 4, stress: 4 } },
            { text: "별로 티를 내지 않아요", scores: { calm: 3, neutral: 2 } },
            { text: "적극적으로 해결하려 노력해요", scores: { joy: 2, calm: 3 } }
        ]
    },
    {
        text: "최근에 즐거웠던 일이 있으신가요?",
        emoji: "🎉",
        answers: [
            { text: "매우 즐거운 일이 많았어요", scores: { joy: 5, calm: 2 } },
            { text: "몇 가지 즐거운 일이 있었어요", scores: { joy: 3, calm: 2 } },
            { text: "보통 정도였어요", scores: { neutral: 3 } },
            { text: "별로 즐거운 일이 없었어요", scores: { sad: 2, stress: 2 } },
            { text: "전혀 즐거운 일이 없었어요", scores: { sad: 4, stress: 3 } }
        ]
    },
    {
        text: "밤에 잠들기가 어떠신가요?",
        emoji: "😴",
        answers: [
            { text: "쉽게 잠들어요", scores: { calm: 4, joy: 1 } },
            { text: "보통 정도예요", scores: { neutral: 3 } },
            { text: "가끔 잠들기 어려워요", scores: { stress: 2, fear: 2 } },
            { text: "자주 잠들기 어려워요", scores: { stress: 4, fear: 3 } },
            { text: "거의 매일 잠들기 어려워요", scores: { stress: 5, fear: 4 } }
        ]
    },
    {
        text: "다른 사람들과의 관계는 어떠신가요?",
        emoji: "👥",
        answers: [
            { text: "매우 만족스러워요", scores: { joy: 4, calm: 3 } },
            { text: "대체로 좋아요", scores: { joy: 2, calm: 2 } },
            { text: "보통이에요", scores: { neutral: 3 } },
            { text: "약간 어려워요", scores: { stress: 2, sad: 2 } },
            { text: "매우 어려워요", scores: { stress: 4, sad: 3, fear: 2 } }
        ]
    },
    {
        text: "요즘 집중력은 어떠신가요?",
        emoji: "🎯",
        answers: [
            { text: "매우 좋아요", scores: { calm: 4, joy: 2 } },
            { text: "좋은 편이에요", scores: { calm: 2, joy: 1 } },
            { text: "보통이에요", scores: { neutral: 3 } },
            { text: "자주 흐트러져요", scores: { stress: 3, fear: 2 } },
            { text: "거의 집중할 수 없어요", scores: { stress: 5, fear: 3 } }
        ]
    },
    {
        text: "신체적으로 피로감은 어떠신가요?",
        emoji: "💪",
        answers: [
            { text: "전혀 피곤하지 않아요", scores: { joy: 3, calm: 3 } },
            { text: "가끔 피곤해요", scores: { neutral: 2, stress: 1 } },
            { text: "보통 정도로 피곤해요", scores: { neutral: 3, stress: 2 } },
            { text: "자주 피곤해요", scores: { stress: 3, sad: 2 } },
            { text: "항상 매우 피곤해요", scores: { stress: 5, sad: 3 } }
        ]
    },
    {
        text: "미래에 대한 생각은 어떠신가요?",
        emoji: "🔮",
        answers: [
            { text: "매우 긍정적이에요", scores: { joy: 5, calm: 2 } },
            { text: "대체로 긍정적이에요", scores: { joy: 3, calm: 2 } },
            { text: "보통이에요", scores: { neutral: 3 } },
            { text: "약간 불안해요", scores: { fear: 3, stress: 2 } },
            { text: "매우 불안하고 걱정돼요", scores: { fear: 5, stress: 4 } }
        ]
    },
    {
        text: "요즘 식욕은 어떠신가요?",
        emoji: "🍽️",
        answers: [
            { text: "매우 좋아요", scores: { joy: 2, calm: 3 } },
            { text: "좋은 편이에요", scores: { calm: 2, neutral: 1 } },
            { text: "보통이에요", scores: { neutral: 3 } },
            { text: "없는 편이에요", scores: { stress: 2, sad: 3 } },
            { text: "전혀 없어요", scores: { stress: 4, sad: 4 } }
        ]
    },
    {
        text: "요즘 감정 변화가 어떠신가요?",
        emoji: "🎭",
        answers: [
            { text: "매우 안정적이에요", scores: { calm: 5, joy: 2 } },
            { text: "대체로 안정적이에요", scores: { calm: 3, neutral: 1 } },
            { text: "보통이에요", scores: { neutral: 3 } },
            { text: "자주 변해요", scores: { stress: 3, fear: 2 } },
            { text: "매우 불안정해요", scores: { stress: 4, fear: 4 } }
        ]
    },
    {
        text: "새로운 일에 대한 동기는 어떠신가요?",
        emoji: "🚀",
        answers: [
            { text: "매우 높아요", scores: { joy: 4, calm: 2 } },
            { text: "높은 편이에요", scores: { joy: 2, calm: 2 } },
            { text: "보통이에요", scores: { neutral: 3 } },
            { text: "낮은 편이에요", scores: { sad: 2, stress: 2 } },
            { text: "전혀 없어요", scores: { sad: 4, stress: 3 } }
        ]
    },
    {
        text: "요즘 자신감은 어떠신가요?",
        emoji: "💪",
        answers: [
            { text: "매우 높아요", scores: { joy: 4, calm: 3 } },
            { text: "높은 편이에요", scores: { joy: 2, calm: 2 } },
            { text: "보통이에요", scores: { neutral: 3 } },
            { text: "낮은 편이에요", scores: { sad: 2, fear: 2 } },
            { text: "매우 낮아요", scores: { sad: 4, fear: 3 } }
        ]
    },
    {
        text: "혼자 있을 때의 기분은 어떠신가요?",
        emoji: "🧘",
        answers: [
            { text: "매우 편안해요", scores: { calm: 5, joy: 1 } },
            { text: "편안한 편이에요", scores: { calm: 3, neutral: 1 } },
            { text: "보통이에요", scores: { neutral: 3 } },
            { text: "약간 외로워요", scores: { sad: 3, stress: 1 } },
            { text: "매우 외롭고 우울해요", scores: { sad: 5, stress: 3 } }
        ]
    },
    {
        text: "요즘 화가 나는 일이 얼마나 자주 있나요?",
        emoji: "😠",
        answers: [
            { text: "거의 없어요", scores: { calm: 4, joy: 2 } },
            { text: "가끔 있어요", scores: { calm: 2, neutral: 2 } },
            { text: "보통 정도예요", scores: { neutral: 2, angry: 2 } },
            { text: "자주 있어요", scores: { angry: 4, stress: 3 } },
            { text: "매우 자주 있어요", scores: { angry: 5, stress: 4 } }
        ]
    },
    {
        text: "전반적으로 현재 삶에 만족하시나요?",
        emoji: "😌",
        answers: [
            { text: "매우 만족해요", scores: { joy: 5, calm: 4 } },
            { text: "만족하는 편이에요", scores: { joy: 3, calm: 2 } },
            { text: "보통이에요", scores: { neutral: 3 } },
            { text: "불만족스러워요", scores: { sad: 3, stress: 2 } },
            { text: "매우 불만족스러워요", scores: { sad: 5, stress: 4 } }
        ]
    }
];

// 페이지 이동 함수들
function nextStep() {
    pageManager.nextStep();
}

function startQuestions() {
    currentQuestion = 0;
    emotionScores = { joy: 0, sad: 0, angry: 0, fear: 0, calm: 0, neutral: 0, stress: 0 };
    answers = [];
    pageManager.showPage('step5');
    showQuestion();
}

function showQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('currentEmotionIcon').textContent = question.emoji;
    document.getElementById('questionNum').textContent = currentQuestion + 1;
    
    // 프로그레스 바 업데이트
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.querySelector('.progress-fill').style.width = progress + '%';
    
    // 답변 버튼 생성
    const answersGrid = document.getElementById('answersGrid');
    answersGrid.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer.text;
        button.onclick = () => selectAnswer(index);
        answersGrid.appendChild(button);
    });
    
    // 5번째 질문 후 중간 광고 표시
    if (currentQuestion === 4) {
        const adMidNative5 = document.getElementById('adMidNative5');
        if (adMidNative5) {
            adMidNative5.classList.remove('hidden');
            adManager.observe('adMidNative5');
        }
    }
}

function selectAnswer(answerIndex) {
    const question = questions[currentQuestion];
    const selectedAnswer = question.answers[answerIndex];
    
    // 답변 저장
    answers.push({
        question: question.text,
        answer: selectedAnswer.text,
        scores: selectedAnswer.scores
    });
    
    // 점수 누적
    Object.keys(selectedAnswer.scores).forEach(emotion => {
        emotionScores[emotion] += selectedAnswer.scores[emotion];
    });
    
    // 다음 질문으로
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        setTimeout(() => {
            showQuestion();
        }, 300);
    } else {
        // 모든 질문 완료 - 로딩 시작
        showLoading();
    }
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
    
    // 로딩 애니메이션
    let currentLoadingStep = 0;
    const loadingSteps = document.querySelectorAll('.loading-steps .step');
    
    const loadingInterval = setInterval(() => {
        if (currentLoadingStep < loadingSteps.length) {
            loadingSteps.forEach(step => step.classList.remove('active'));
            loadingSteps[currentLoadingStep].classList.add('active');
            currentLoadingStep++;
        } else {
            clearInterval(loadingInterval);
            // 결과 생성 및 표시
            generateResult();
            document.getElementById('loadingOverlay').classList.add('hidden');
            pageManager.showPage('step6');
        }
    }, 800);
}

function generateResult() {
    // 가장 높은 감정 점수 찾기
    const maxEmotion = Object.keys(emotionScores).reduce((a, b) => 
        emotionScores[a] > emotionScores[b] ? a : b
    );
    
    // 스트레스 수준 계산
    const stressLevel = Math.min(Math.round((emotionScores.stress / questions.length) * 20), 100);
    
    // 결과 타입 결정
    testResult = getResultType(maxEmotion, stressLevel);
    
    // 결과 미리보기 표시
    document.getElementById('resultBadge').textContent = testResult.badge;
    document.getElementById('resultTitle').textContent = testResult.title;
    document.getElementById('resultSubtitle').textContent = testResult.subtitle;
    document.getElementById('previewEmotion').textContent = testResult.primaryEmotion;
    document.getElementById('previewStress').textContent = `${stressLevel}%`;
}

function getResultType(primaryEmotion, stressLevel) {
    const resultTypes = {
        joy: {
            badge: "😊",
            title: "긍정적 감정 우세형",
            subtitle: "밝고 활기찬 감정 상태",
            primaryEmotion: "기쁨",
            description: "현재 당신은 긍정적이고 밝은 감정 상태를 유지하고 있습니다.",
            care: "이런 좋은 감정 상태를 지속하기 위해 규칙적인 운동과 충분한 휴식을 취하세요."
        },
        calm: {
            badge: "😌",
            title: "안정적 평온형",
            subtitle: "차분하고 균형잡힌 감정 상태",
            primaryEmotion: "평온",
            description: "당신은 안정적이고 평온한 감정 상태를 보여주고 있습니다.",
            care: "현재의 균형을 유지하면서 새로운 도전을 통해 성장해보세요."
        },
        sad: {
            badge: "😢",
            title: "감정적 회복 필요형",
            subtitle: "슬픔과 우울감이 높은 상태",
            primaryEmotion: "슬픔",
            description: "현재 슬픔이나 우울한 감정이 주를 이루고 있는 상태입니다.",
            care: "전문가 상담을 고려해보시고, 가족이나 친구들과 대화하는 시간을 늘려보세요."
        },
        angry: {
            badge: "😠",
            title: "분노 관리 필요형",
            subtitle: "화와 짜증이 높은 상태",
            primaryEmotion: "분노",
            description: "최근 분노나 화가 많이 누적된 상태로 보입니다.",
            care: "분노 조절을 위한 호흡법이나 운동을 통해 감정을 관리해보세요."
        },
        fear: {
            badge: "😰",
            title: "불안 케어 필요형",
            subtitle: "불안과 걱정이 높은 상태",
            primaryEmotion: "불안",
            description: "불안감과 걱정이 높은 수준에 있는 상태입니다.",
            care: "명상이나 요가 등을 통해 마음의 안정을 찾고, 필요시 전문가 도움을 받으세요."
        },
        neutral: {
            badge: "😐",
            title: "감정 탐색 필요형",
            subtitle: "감정 표현이 제한적인 상태",
            primaryEmotion: "무감정",
            description: "현재 감정 표현이 제한적이거나 무덤덤한 상태입니다.",
            care: "다양한 활동을 통해 감정을 표현하고 경험할 수 있는 기회를 만들어보세요."
        }
    };
    
    return resultTypes[primaryEmotion] || resultTypes.neutral;
}

function viewDetailedResult() {
    currentResultStep = 1;
    pageManager.showPage('result1');
    showDetailedResult();
    
    // Step 6 광고 로드
    setTimeout(() => {
        adManager.observe('adTopNative6');
        adManager.observe('adMidNative6');
    }, 300);
}

function showDetailedResult() {
    // 감정 분포도 생성
    generateEmotionChart();
    
    // 스트레스 분석 표시
    displayStressAnalysis();
    
    // 케어 추천 표시
    displayCareRecommendations();
    
    // 공유 요약 생성
    generateShareSummary();
}

function generateEmotionChart() {
    const breakdown = document.getElementById('emotionBreakdown');
    if (!breakdown) return;
    
    breakdown.innerHTML = '';
    
    const emotionNames = {
        joy: '기쁨',
        sad: '슬픔', 
        angry: '분노',
        fear: '불안',
        calm: '평온',
        neutral: '무감정'
    };
    
    const total = Object.values(emotionScores).reduce((a, b) => a + b, 0);
    
    Object.entries(emotionScores).forEach(([emotion, score]) => {
        if (emotion === 'stress') return;
        
        const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
        const item = document.createElement('div');
        item.className = 'emotion-item';
        item.innerHTML = `
            <span class="emotion-name">${emotionNames[emotion]}</span>
            <span class="emotion-percentage">${percentage}%</span>
        `;
        breakdown.appendChild(item);
    });
}

function displayStressAnalysis() {
    const stressLevel = Math.min(Math.round((emotionScores.stress / questions.length) * 20), 100);
    
    document.getElementById('stressLevel').textContent = `${stressLevel}점`;
    
    let stressDesc = '';
    if (stressLevel <= 20) stressDesc = '매우 낮은 스트레스 수준';
    else if (stressLevel <= 40) stressDesc = '낮은 스트레스 수준';
    else if (stressLevel <= 60) stressDesc = '보통 스트레스 수준';
    else if (stressLevel <= 80) stressDesc = '높은 스트레스 수준';
    else stressDesc = '매우 높은 스트레스 수준';
    
    document.getElementById('stressDescription').textContent = stressDesc;
    
    // 스트레스 요인 분석
    const factors = document.getElementById('stressFactors');
    if (factors) {
        factors.innerHTML = `
            <div class="stress-factor">
                <span>업무/학업</span>
                <span>${Math.min(stressLevel + 10, 100)}%</span>
            </div>
            <div class="stress-factor">
                <span>인간관계</span>
                <span>${Math.max(stressLevel - 15, 0)}%</span>
            </div>
            <div class="stress-factor">
                <span>개인적 고민</span>
                <span>${stressLevel}%</span>
            </div>
        `;
    }
}

function displayCareRecommendations() {
    const primaryCare = document.getElementById('primaryCare');
    const dailyCare = document.getElementById('dailyCare');
    const tipsContainer = document.getElementById('tipsContainer');
    
    if (primaryCare) {
        primaryCare.textContent = testResult.care;
    }
    
    if (dailyCare) {
        dailyCare.innerHTML = `
            <p>• 규칙적인 수면 패턴 유지 (7-8시간)</p>
            <p>• 적절한 운동과 스트레칭</p>
            <p>• 균형잡힌 영양 섭취</p>
            <p>• 취미 활동이나 휴식 시간 확보</p>
        `;
    }
    
    if (tipsContainer) {
        const tips = [
            '심호흡으로 마음 진정하기',
            '짧은 산책으로 기분 전환',
            '친구나 가족과 대화하기',
            '좋아하는 음악 듣기',
            '충분한 물 마시기',
            '감사 일기 쓰기'
        ];
        
        tipsContainer.innerHTML = tips.map(tip => 
            `<div class="tip-item">${tip}</div>`
        ).join('');
    }
}

function generateShareSummary() {
    const summaryContent = document.getElementById('summaryContent');
    if (summaryContent) {
        const stressLevel = Math.min(Math.round((emotionScores.stress / questions.length) * 20), 100);
        summaryContent.innerHTML = `
            <p><strong>감정 유형:</strong> ${testResult.title}</p>
            <p><strong>주요 감정:</strong> ${testResult.primaryEmotion}</p>
            <p><strong>스트레스 수준:</strong> ${stressLevel}%</p>
            <p><strong>추천 케어:</strong> ${testResult.care}</p>
        `;
    }
}

function nextResultStep() {
    if (currentResultStep < 4) {
        currentResultStep++;
        pageManager.showPage(`result${currentResultStep}`);
        adManager.observe(`adResult${currentResultStep}`);
    }
}

// 공유 기능
function shareToKakao() {
    if (!window.Kakao || !testResult) return;
    
    const stressLevel = Math.min(Math.round((emotionScores.stress / questions.length) * 20), 100);
    
    window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: `🧠 AI 감정 분석 결과: ${testResult.title}`,
            description: `나의 주요 감정: ${testResult.primaryEmotion}\n스트레스 수준: ${stressLevel}%\n\n당신의 감정 상태도 확인해보세요!`,
            imageUrl: 'https://sd2624.github.io/감정/감정.png',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href
            }
        },
        buttons: [{
            title: '나도 테스트하기',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href
            }
        }]
    });
}

function shareUrl() {
    if (navigator.share) {
        navigator.share({
            title: 'AI 감정 분석 테스트',
            text: '나의 감정 상태를 AI가 분석해줬어요! 당신도 테스트해보세요.',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('URL이 복사되었습니다!');
        });
    }
}

function retryTest() {
    // 초기화
    currentStep = 1;
    currentQuestion = 0;
    currentResultStep = 1;
    emotionScores = {};
    answers = [];
    testResult = null;
    
    // 첫 페이지로 이동
    pageManager.showPage('step1');
}

function closeAnchorAd() {
    document.getElementById('anchorAd').style.display = 'none';
}

// 실시간 카운터 애니메이션
function updateLiveCounter() {
    const counter = document.getElementById('liveCount');
    if (counter) {
        const baseCount = 1847;
        const variation = Math.floor(Math.random() * 20) - 10;
        counter.textContent = (baseCount + variation).toLocaleString();
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    initKakao();
    adManager.init();
    
    // 실시간 카운터 업데이트
    updateLiveCounter();
    setInterval(updateLiveCounter, 30000);
    
    // 첫 번째 스텝 광고 로드
    setTimeout(() => {
        adManager.observe('adTopNative1');
        adManager.observe('adMidNative1');
        adManager.observe('adBottomCTA1');
    }, 500);
});
