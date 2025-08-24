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
let answers = [];
let emotionScores = {};
let loadedAds = new Set();

// 감정 테스트 질문 데이터
const questions = [
    {
        icon: "🤔",
        text: "오늘 하루를 돌아보면, 가장 많이 느낀 감정은 무엇인가요?",
        answers: [
            { text: "기쁨과 만족감", emotions: { joy: 3, satisfaction: 2 } },
            { text: "피곤함과 스트레스", emotions: { stress: 3, fatigue: 2 } },
            { text: "불안과 걱정", emotions: { anxiety: 3, worry: 2 } },
            { text: "평온함과 안정감", emotions: { peace: 3, stability: 2 } }
        ]
    },
    {
        icon: "🚀",
        text: "새로운 도전이나 변화에 직면했을 때, 당신의 첫 반응은?",
        answers: [
            { text: "흥미롭고 기대된다", emotions: { excitement: 3, curiosity: 2 } },
            { text: "두렵지만 해볼 만하다", emotions: { fear: 2, courage: 3 } },
            { text: "스트레스를 받고 피하고 싶다", emotions: { stress: 3, avoidance: 2 } },
            { text: "신중하게 계획부터 세운다", emotions: { caution: 3, planning: 2 } }
        ]
    },
    {
        icon: "👥",
        text: "최근 인간관계에서 가장 많이 느끼는 감정은?",
        answers: [
            { text: "따뜻함과 유대감", emotions: { warmth: 3, connection: 2 } },
            { text: "외로움과 소외감", emotions: { loneliness: 3, isolation: 2 } },
            { text: "갈등과 스트레스", emotions: { conflict: 3, social_stress: 2 } },
            { text: "평범함과 안정감", emotions: { stability: 2, contentment: 1 } }
        ]
    },
    {
        icon: "💼",
        text: "일이나 학업에 대한 현재 감정 상태는?",
        answers: [
            { text: "열정적이고 의욕적이다", emotions: { passion: 3, motivation: 2 } },
            { text: "지치고 번아웃 느낌이다", emotions: { burnout: 3, exhaustion: 2 } },
            { text: "불안하고 압박감을 느낀다", emotions: { anxiety: 2, pressure: 3 } },
            { text: "만족스럽고 균형잡혀있다", emotions: { satisfaction: 3, balance: 2 } }
        ]
    },
    {
        icon: "🌙",
        text: "혼자 있는 시간에 주로 느끼는 감정은?",
        answers: [
            { text: "평화롭고 충전되는 느낌", emotions: { peace: 3, recharge: 2 } },
            { text: "외롭고 쓸쓸한 느낌", emotions: { loneliness: 3, sadness: 2 } },
            { text: "불안하고 초조한 느낌", emotions: { anxiety: 2, restlessness: 3 } },
            { text: "자유롭고 편안한 느낌", emotions: { freedom: 3, comfort: 2 } }
        ]
    },
    {
        icon: "🔮",
        text: "미래에 대해 생각할 때 드는 감정은?",
        answers: [
            { text: "희망적이고 기대감이 크다", emotions: { hope: 3, anticipation: 2 } },
            { text: "불안하고 걱정이 많다", emotions: { anxiety: 3, worry: 2 } },
            { text: "막막하고 두렵다", emotions: { fear: 3, uncertainty: 2 } },
            { text: "담담하고 준비되어 있다", emotions: { calmness: 3, preparedness: 2 } }
        ]
    },
    {
        icon: "😤",
        text: "스트레스를 받을 때 가장 자주 나타나는 반응은?",
        answers: [
            { text: "짜증이 나고 화가 난다", emotions: { anger: 3, irritation: 2 } },
            { text: "슬프고 우울해진다", emotions: { sadness: 3, depression: 2 } },
            { text: "불안하고 초조해진다", emotions: { anxiety: 3, agitation: 2 } },
            { text: "침묵하고 혼자 있고 싶어진다", emotions: { withdrawal: 3, solitude: 2 } }
        ]
    },
    {
        icon: "🎯",
        text: "성공이나 성취를 이뤘을 때의 감정은?",
        answers: [
            { text: "매우 기쁘고 자랑스럽다", emotions: { joy: 3, pride: 2 } },
            { text: "만족스럽지만 다음 목표가 걱정된다", emotions: { satisfaction: 2, anxiety: 1 } },
            { text: "잠깐의 기쁨 후 공허함을 느낀다", emotions: { emptiness: 2, fleeting_joy: 1 } },
            { text: "감사하고 평온하다", emotions: { gratitude: 3, peace: 2 } }
        ]
    },
    {
        icon: "😔",
        text: "실패나 좌절을 경험할 때의 주된 감정은?",
        answers: [
            { text: "화나고 분하다", emotions: { anger: 3, frustration: 2 } },
            { text: "슬프고 실망스럽다", emotions: { sadness: 3, disappointment: 2 } },
            { text: "두렵고 자신감이 없어진다", emotions: { fear: 2, insecurity: 3 } },
            { text: "배움의 기회로 받아들인다", emotions: { acceptance: 3, growth: 2 } }
        ]
    },
    {
        icon: "😊",
        text: "다른 사람들과 있을 때 자주 느끼는 감정은?",
        answers: [
            { text: "즐겁고 에너지가 넘친다", emotions: { joy: 2, energy: 3 } },
            { text: "피곤하고 부담스럽다", emotions: { fatigue: 2, burden: 3 } },
            { text: "불안하고 긴장된다", emotions: { anxiety: 2, tension: 3 } },
            { text: "편안하고 자연스럽다", emotions: { comfort: 3, naturalness: 2 } }
        ]
    },
    {
        icon: "🪞",
        text: "자신에 대해 생각할 때 가장 많이 드는 감정은?",
        answers: [
            { text: "만족스럽고 자랑스럽다", emotions: { satisfaction: 3, self_pride: 2 } },
            { text: "부족하고 아쉽다", emotions: { inadequacy: 3, regret: 2 } },
            { text: "혼란스럽고 확신이 안 선다", emotions: { confusion: 3, uncertainty: 2 } },
            { text: "받아들이고 사랑한다", emotions: { self_love: 3, acceptance: 2 } }
        ]
    },
    {
        icon: "✨",
        text: "지금 이 순간, 가장 간절히 원하는 감정 상태는?",
        answers: [
            { text: "더 많은 기쁨과 행복", emotions: { desired_joy: 3, happiness: 2 } },
            { text: "평온함과 안정감", emotions: { desired_peace: 3, stability: 2 } },
            { text: "자신감과 용기", emotions: { desired_confidence: 3, courage: 2 } },
            { text: "자유로움과 해방감", emotions: { desired_freedom: 3, liberation: 2 } }
        ]
    }
];

// 감정 타입별 결과 데이터
const resultTypes = {
    joy: {
        badge: "😊",
        title: "긍정적 에너지형",
        subtitle: "밝고 긍정적인 감정이 주를 이루고 있어요",
        description: "당신은 현재 전반적으로 긍정적이고 밝은 에너지를 가지고 있습니다. 기쁨과 만족감을 자주 느끼며, 새로운 도전에 대해 열린 마음을 가지고 있어요.",
        advice: "이러한 긍정적 에너지를 유지하면서도, 가끔은 자신의 감정을 점검해보는 시간을 가져보세요.",
        tips: ["긍정적 경험 일기 쓰기", "감사 인사 표현하기", "새로운 취미 시작하기"]
    },
    anxiety: {
        badge: "😰",
        title: "불안 민감형",
        subtitle: "걱정과 불안감이 많은 상태예요",
        description: "현재 불안감과 걱정이 주된 감정을 차지하고 있습니다. 미래에 대한 걱정이나 현재 상황에 대한 스트레스가 있을 수 있어요.",
        advice: "불안감은 자연스러운 감정입니다. 심호흡과 명상을 통해 마음을 진정시켜보세요.",
        tips: ["복식 호흡법 연습", "명상 앱 활용하기", "규칙적인 운동하기"]
    },
    stress: {
        badge: "😤",
        title: "스트레스 과부하형",
        subtitle: "스트레스와 피로감이 누적된 상태예요",
        description: "과도한 스트레스와 피로감을 느끼고 있습니다. 일과 생활의 균형이 무너져 있을 가능성이 있어요.",
        advice: "충분한 휴식과 스트레스 해소가 필요합니다. 작은 것부터 시작해보세요.",
        tips: ["충분한 수면 취하기", "스트레스 해소 활동", "업무와 생활 분리하기"]
    },
    sadness: {
        badge: "😢",
        title: "감정 침체형",
        subtitle: "우울하고 외로운 감정이 많아요",
        description: "슬픔과 외로움을 자주 느끼고 있습니다. 대인관계나 개인적인 문제로 힘든 시기를 보내고 있을 수 있어요.",
        advice: "혼자 견디지 말고 주변 사람들과 소통해보세요. 전문가의 도움도 고려해볼 수 있어요.",
        tips: ["친구/가족과 대화하기", "일기 쓰기", "전문 상담 받기"]
    },
    peace: {
        badge: "😌",
        title: "평온 안정형",
        subtitle: "차분하고 안정된 감정 상태예요",
        description: "전반적으로 평온하고 안정된 감정 상태를 유지하고 있습니다. 균형잡힌 생활을 하고 있어요.",
        advice: "현재의 평온함을 유지하면서, 새로운 성장 기회도 모색해보세요.",
        tips: ["현재 상태 유지하기", "새로운 목표 설정", "타인 도움주기"]
    },
    energy: {
        badge: "⚡",
        title: "역동적 에너지형",
        subtitle: "활기차고 의욕적인 상태예요",
        description: "높은 에너지와 의욕을 가지고 있습니다. 도전 정신이 강하고 적극적인 자세를 보여요.",
        advice: "긍정적인 에너지를 잘 활용하되, 과도한 피로를 주의하세요.",
        tips: ["목표 설정하고 실행", "에너지 관리하기", "휴식시간 확보"]
    },
    confusion: {
        badge: "🤔",
        title: "혼란 탐색형",
        subtitle: "혼란스럽고 확신이 서지 않는 상태예요",
        description: "현재 자신에 대해 확신이 없고 혼란스러운 상태입니다. 중요한 결정을 앞두고 있을 수 있어요.",
        advice: "혼란은 성장의 과정입니다. 천천히 자신을 탐색해보는 시간을 가져보세요.",
        tips: ["자기 탐색 시간 갖기", "신뢰할 만한 조언 구하기", "작은 결정부터 시작"]
    }
};

// 단계 전환 함수
function nextStep(step) {
    const currentStepEl = document.getElementById(`step${currentStep}`);
    const nextStepEl = document.getElementById(`step${step}`);
    
    if (currentStepEl && nextStepEl) {
        // 현재 단계 숨기기
        currentStepEl.classList.remove('current');
        currentStepEl.classList.add('prev');
        
        // 다음 단계 보이기
        nextStepEl.classList.remove('hidden');
        nextStepEl.classList.add('current');
        
        currentStep = step;
        
        // 단계별 초기화
        initializeStep(step);
    }
}

// 단계별 초기화
function initializeStep(step) {
    switch(step) {
        case 1:
            loadStepAd('adStep1');
            break;
        case 2:
            loadStepAd('adStep2');
            break;
        case 3:
            loadStepAd('adStep3');
            break;
        case 4:
            loadStepAd('adStep4');
            break;
        case 5:
            // 질문 시작
            break;
        case 6:
            loadStepAd('adResult');
            break;
    }
}

// 광고 로드
function loadStepAd(adId) {
    if (!loadedAds.has(adId)) {
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
            loadedAds.add(adId);
            console.log(`광고 로드: ${adId}`);
        } catch (e) {
            console.log('광고 로드 실패:', e);
        }
    }
}

// 질문 시작
function startQuestions() {
    currentQuestion = 0;
    answers = [];
    emotionScores = {};
    nextStep(5);
    loadQuestion();
}

// 질문 로드
function loadQuestion() {
    if (currentQuestion >= questions.length) {
        showLoading();
        return;
    }
    
    const question = questions[currentQuestion];
    
    // 질문 UI 업데이트
    document.getElementById('questionIcon').textContent = question.icon;
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('currentQuestionNum').textContent = currentQuestion + 1;
    
    // 진행률 업데이트
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    
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
    
    // 광고 표시 (3번째, 6번째, 9번째 질문 후)
    if ((currentQuestion + 1) % 3 === 0) {
        showQuestionAd();
    }
}

// 답변 선택
function selectAnswer(answerIndex) {
    const question = questions[currentQuestion];
    const selectedAnswer = question.answers[answerIndex];
    
    // 답변 저장
    answers.push({
        questionIndex: currentQuestion,
        answerIndex: answerIndex,
        emotions: selectedAnswer.emotions
    });
    
    // 감정 점수 누적
    Object.entries(selectedAnswer.emotions).forEach(([emotion, score]) => {
        emotionScores[emotion] = (emotionScores[emotion] || 0) + score;
    });
    
    // 버튼 선택 표시
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, index) => {
        btn.classList.toggle('selected', index === answerIndex);
    });
    
    // 다음 질문으로
    setTimeout(() => {
        currentQuestion++;
        loadQuestion();
    }, 800);
}

// 질문 중간 광고 표시
function showQuestionAd() {
    const adContainer = document.getElementById('adQuestion');
    if (adContainer && !loadedAds.has('adQuestion')) {
        adContainer.classList.remove('hidden');
        loadStepAd('adQuestion');
        
        // 3초 후 숨기기
        setTimeout(() => {
            adContainer.classList.add('hidden');
        }, 3000);
    }
}

// 로딩 표시
function showLoading() {
    const questionSection = document.querySelector('#step5 .question-section');
    questionSection.innerHTML = `
        <div class="loading-container">
            <div class="loading-brain">🧠</div>
            <h3>감정 분석 중...</h3>
            <div class="loading-steps">
                <div class="loading-step active">감정 패턴 분석</div>
                <div class="loading-step">심리 상태 진단</div>
                <div class="loading-step">개인별 해석</div>
                <div class="loading-step">맞춤 조언 생성</div>
            </div>
            <div class="loading-progress-bar">
                <div class="loading-progress" id="loadingProgress"></div>
            </div>
        </div>
    `;
    
    // 로딩 진행
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        const progressBar = document.getElementById('loadingProgress');
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                calculateAndShowResult();
            }, 1000);
        }
    }, 200);
    
    // 단계별 활성화
    setTimeout(() => updateLoadingStep(1), 1000);
    setTimeout(() => updateLoadingStep(2), 2000);
    setTimeout(() => updateLoadingStep(3), 3000);
}

function updateLoadingStep(stepIndex) {
    const steps = document.querySelectorAll('.loading-step');
    if (steps[stepIndex]) {
        steps[stepIndex].classList.add('active');
    }
}

// 결과 계산 및 표시
function calculateAndShowResult() {
    // 감정 타입별 점수 계산
    const emotionTypes = {
        joy: ['joy', 'happiness', 'excitement', 'satisfaction', 'desired_joy'],
        anxiety: ['anxiety', 'worry', 'fear', 'tension', 'uncertainty'],
        stress: ['stress', 'pressure', 'burnout', 'fatigue', 'exhaustion'],
        sadness: ['sadness', 'loneliness', 'depression', 'disappointment'],
        peace: ['peace', 'calmness', 'stability', 'comfort', 'desired_peace'],
        energy: ['energy', 'motivation', 'passion', 'courage', 'excitement'],
        confusion: ['confusion', 'uncertainty', 'insecurity', 'inadequacy']
    };
    
    const typeScores = {};
    Object.entries(emotionTypes).forEach(([type, emotions]) => {
        typeScores[type] = emotions.reduce((sum, emotion) => {
            return sum + (emotionScores[emotion] || 0);
        }, 0);
    });
    
    // 가장 높은 점수의 감정 타입 찾기
    const primaryEmotion = Object.entries(typeScores)
        .sort(([,a], [,b]) => b - a)[0];
    
    const resultData = resultTypes[primaryEmotion[0]] || resultTypes.confusion;
    
    // 결과 표시
    nextStep(6);
    showResult(resultData);
}

// 결과 표시
function showResult(resultData) {
    document.getElementById('resultBadge').textContent = resultData.badge;
    document.getElementById('resultTitle').textContent = resultData.title;
    document.getElementById('resultSubtitle').textContent = resultData.subtitle;
    
    // 결과 상세 내용 생성
    const resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = `
        <div class="result-analysis">
            <div class="analysis-card">
                <div class="analysis-title">📊 상세 분석</div>
                <div class="analysis-text">${resultData.description}</div>
            </div>
            <div class="analysis-card">
                <div class="analysis-title">💡 맞춤 조언</div>
                <div class="analysis-text">${resultData.advice}</div>
            </div>
            <div class="analysis-card">
                <div class="analysis-title">✨ 감정 관리 팁</div>
                <div class="tips-grid">
                    ${resultData.tips.map(tip => `
                        <div class="tip-item">
                            <div class="tip-icon">✓</div>
                            <div>${tip}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// 공유 함수들
function shareKakao() {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
        initKakao();
    }
    
    const resultBadge = document.getElementById('resultBadge').textContent;
    const resultTitle = document.getElementById('resultTitle').textContent;
    const resultSubtitle = document.getElementById('resultSubtitle').textContent;
    
    window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '내 마음속 감정 분석 테스트',
            description: `나의 결과: ${resultTitle} ${resultBadge}\n${resultSubtitle}`,
            imageUrl: 'https://sd2624.github.io/감정/감정.png',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href
            }
        },
        buttons: [
            {
                title: '나도 테스트하기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href
                }
            }
        ]
    });
}

function shareUrl() {
    if (navigator.share) {
        navigator.share({
            title: '내 마음속 감정 분석 테스트',
            text: '나의 감정 상태를 분석해보세요!',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('URL이 클립보드에 복사되었습니다!');
        });
    }
}

function restartTest() {
    // 모든 상태 초기화
    currentStep = 1;
    currentQuestion = 0;
    answers = [];
    emotionScores = {};
    
    // 모든 단계 숨기기
    document.querySelectorAll('.step-container').forEach(el => {
        el.classList.remove('current', 'prev');
        el.classList.add('hidden');
    });
    
    // 첫 번째 단계 표시
    const step1 = document.getElementById('step1');
    step1.classList.remove('hidden');
    step1.classList.add('current');
    
    initializeStep(1);
}

// 앵커 광고 관리
function closeAnchorAd() {
    document.getElementById('anchorAd').classList.add('hidden');
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 카카오 SDK 초기화
    setTimeout(initKakao, 1000);
    
    // 첫 번째 단계 초기화
    initializeStep(1);
    
    // 앵커 광고 5초 후 표시
    setTimeout(() => {
        const anchorAd = document.getElementById('anchorAd');
        if (anchorAd) {
            anchorAd.classList.remove('hidden');
            loadStepAd('anchorAd');
        }
    }, 5000);
});

// Google Analytics 이벤트 트래킹
function gtag_report_conversion(url) {
    var callback = function () {
        if (typeof(url) != 'undefined') {
            window.location = url;
        }
    };
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'send_to': 'AW-11438616604/1mSHCLiKx_4YEJzgrc4q',
            'event_callback': callback
        });
    }
    return false;
}
