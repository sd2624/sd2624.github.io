// 카카오 SDK 초기화
if (!window.Kakao.isInitialized()) {
    window.Kakao.init('3413c1beb87e9b2f3b7fce37dde67b4d');
}

// 전역 변수
let currentQuestion = 0;
let answers = [];
let adLoadedState = {
    top: false,
    mid: false,
    result: false
};

// IntersectionObserver 설정 (광고 로드용)
const adObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const adContainer = entry.target;
            const adId = adContainer.id;
            
            if (!adLoadedState[adId.replace('ad', '').toLowerCase()]) {
                loadAd(adContainer, adId);
                adObserver.unobserve(adContainer);
            }
        }
    });
}, {
    threshold: 0.1
});

// 광고 로드 함수
function loadAd(container, adId) {
    const adKey = adId.replace('ad', '').toLowerCase();
    if (adLoadedState[adKey]) return;
    
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
        adLoadedState[adKey] = true;
        console.log(`광고 로드 완료: ${adId}`);
    } catch (error) {
        console.error(`광고 로드 실패: ${adId}`, error);
    }
}

// 감정 분석 질문 데이터
const questions = [
    {
        text: "최근 일주일 동안 기분이 어떠셨나요?",
        emoji: "🤔",
        answers: [
            { text: "매우 우울하고 슬펐다", score: { depression: 5, anxiety: 3 } },
            { text: "약간 우울했다", score: { depression: 3, anxiety: 2 } },
            { text: "평범했다", score: { neutral: 3 } },
            { text: "대체로 기분이 좋았다", score: { happiness: 3, energy: 2 } },
            { text: "매우 행복하고 즐거웠다", score: { happiness: 5, energy: 4 } }
        ]
    },
    {
        text: "스트레스를 받을 때 주로 어떻게 반응하시나요?",
        emoji: "😰",
        answers: [
            { text: "화를 내며 폭발한다", score: { anger: 5, stress: 4 } },
            { text: "짜증이 나고 예민해진다", score: { anger: 3, stress: 3 } },
            { text: "조용히 혼자만의 시간을 갖는다", score: { withdrawal: 4, calm: 2 } },
            { text: "누군가와 대화하며 해결한다", score: { social: 4, optimism: 3 } },
            { text: "운동이나 취미로 해소한다", score: { energy: 4, optimism: 3 } }
        ]
    },
    {
        text: "새로운 환경이나 사람들과 만날 때 기분은?",
        emoji: "🆕",
        answers: [
            { text: "매우 불안하고 피하고 싶다", score: { anxiety: 5, withdrawal: 4 } },
            { text: "약간 긴장되지만 적응한다", score: { anxiety: 2, adaptability: 3 } },
            { text: "크게 신경 쓰지 않는다", score: { neutral: 3, calm: 2 } },
            { text: "흥미롭고 기대된다", score: { curiosity: 4, energy: 3 } },
            { text: "매우 즐겁고 신난다", score: { excitement: 5, social: 4 } }
        ]
    },
    {
        text: "실패나 좌절을 경험했을 때의 반응은?",
        emoji: "😞",
        answers: [
            { text: "매우 우울해하며 오래 끌어간다", score: { depression: 5, persistence: 1 } },
            { text: "실망하지만 시간이 지나면 괜찮아진다", score: { resilience: 3, adaptability: 3 } },
            { text: "별로 신경 쓰지 않는다", score: { detachment: 4, calm: 3 } },
            { text: "교훈을 얻고 다시 시도한다", score: { optimism: 4, persistence: 4 } },
            { text: "더 강한 동기를 얻는다", score: { determination: 5, energy: 4 } }
        ]
    },
    {
        text: "혼자 있는 시간을 어떻게 느끼시나요?",
        emoji: "🏠",
        answers: [
            { text: "외롭고 불안하다", score: { loneliness: 5, anxiety: 3 } },
            { text: "가끔 외롭지만 견딜 만하다", score: { loneliness: 2, independence: 2 } },
            { text: "편안하고 자연스럽다", score: { independence: 4, calm: 4 } },
            { text: "창의적이고 생산적이다", score: { creativity: 4, focus: 4 } },
            { text: "매우 소중하고 필요한 시간이다", score: { self_care: 5, wisdom: 4 } }
        ]
    },
    {
        text: "다른 사람들과의 관계에서 느끼는 감정은?",
        emoji: "👥",
        answers: [
            { text: "부담스럽고 피곤하다", score: { social_fatigue: 5, withdrawal: 3 } },
            { text: "가끔 어색하고 어렵다", score: { social_anxiety: 3, uncertainty: 2 } },
            { text: "무난하고 평범하다", score: { neutral: 3, stability: 3 } },
            { text: "즐겁고 의미 있다", score: { social: 4, happiness: 3 } },
            { text: "매우 활기차고 에너지를 준다", score: { social: 5, energy: 4 } }
        ]
    },
    {
        text: "최근 수면 패턴은 어떠신가요?",
        emoji: "😴",
        answers: [
            { text: "잠을 잘 못 자고 피곤하다", score: { fatigue: 5, stress: 3 } },
            { text: "가끔 뒤척이지만 괜찮다", score: { mild_stress: 2, balance: 2 } },
            { text: "평소와 같다", score: { stability: 3, routine: 3 } },
            { text: "잘 자고 개운하다", score: { wellness: 4, energy: 3 } },
            { text: "매우 깊게 잘 자고 상쾌하다", score: { wellness: 5, vitality: 4 } }
        ]
    },
    {
        text: "일이나 학업에 대한 동기는 어떠신가요?",
        emoji: "💼",
        answers: [
            { text: "전혀 의욕이 없고 하기 싫다", score: { apathy: 5, depression: 3 } },
            { text: "별로 재미없지만 해야 한다", score: { duty: 3, mild_stress: 2 } },
            { text: "평범하게 하고 있다", score: { routine: 3, stability: 2 } },
            { text: "대체로 열심히 하고 있다", score: { diligence: 4, purpose: 3 } },
            { text: "매우 열정적이고 즐겁다", score: { passion: 5, energy: 4 } }
        ]
    },
    {
        text: "미래에 대해 어떻게 생각하시나요?",
        emoji: "🔮",
        answers: [
            { text: "걱정되고 불안하다", score: { anxiety: 5, pessimism: 4 } },
            { text: "약간 걱정되지만 관리할 수 있다", score: { concern: 2, realism: 3 } },
            { text: "그때 가서 생각하자", score: { present_focus: 4, adaptability: 3 } },
            { text: "기대되고 희망적이다", score: { optimism: 4, hope: 4 } },
            { text: "매우 설레고 확신한다", score: { confidence: 5, enthusiasm: 4 } }
        ]
    },
    {
        text: "감정 표현에 대해 어떻게 생각하시나요?",
        emoji: "🎭",
        answers: [
            { text: "감정을 숨기고 혼자 처리한다", score: { suppression: 5, withdrawal: 3 } },
            { text: "가까운 사람에게만 표현한다", score: { selectivity: 4, caution: 3 } },
            { text: "상황에 따라 다르다", score: { adaptability: 4, balance: 3 } },
            { text: "자연스럽게 표현하는 편이다", score: { openness: 4, authenticity: 4 } },
            { text: "솔직하고 직접적으로 표현한다", score: { directness: 5, confidence: 4 } }
        ]
    },
    {
        text: "변화에 대한 당신의 태도는?",
        emoji: "🔄",
        answers: [
            { text: "매우 불안하고 저항한다", score: { change_resistance: 5, anxiety: 4 } },
            { text: "조심스럽지만 적응한다", score: { caution: 3, adaptability: 3 } },
            { text: "크게 신경 쓰지 않는다", score: { flexibility: 3, calm: 3 } },
            { text: "흥미롭고 도전적이다", score: { curiosity: 4, courage: 3 } },
            { text: "매우 환영하고 즐긴다", score: { change_embrace: 5, adventure: 4 } }
        ]
    },
    {
        text: "현재 가장 중요하게 생각하는 것은?",
        emoji: "⭐",
        answers: [
            { text: "안전과 안정", score: { security: 5, stability: 4 } },
            { text: "가족과 관계", score: { family: 4, connection: 4 } },
            { text: "건강과 평화", score: { health: 4, peace: 4 } },
            { text: "성장과 발전", score: { growth: 4, ambition: 3 } },
            { text: "즐거움과 모험", score: { joy: 5, adventure: 4 } }
        ]
    }
];

// 감정 결과 데이터
const emotionResults = {
    depression: {
        title: "우울감 중심형",
        subtitle: "깊은 감정을 느끼는 섬세한 마음",
        emoji: "😔",
        description: "현재 우울한 감정이 주를 이루고 있습니다. 이는 일시적인 상태일 수 있으며, 적절한 관리와 도움을 통해 개선될 수 있습니다.",
        advice: "규칙적인 운동, 충분한 수면, 그리고 신뢰할 수 있는 사람과의 대화가 도움이 됩니다. 필요시 전문가의 도움을 받는 것을 고려해보세요.",
        tips: ["매일 15분 이상 산책하기", "일기 쓰기로 감정 정리하기", "작은 성취에도 스스로 칭찬하기", "좋아하는 음악 듣기"]
    },
    anxiety: {
        title: "불안감 중심형",
        subtitle: "미래를 걱정하는 신중한 마음",
        emoji: "😰",
        description: "불안감이 일상생활에 영향을 주고 있습니다. 이는 책임감이 강하고 신중한 성격에서 비롯될 수 있습니다.",
        advice: "깊은 호흡, 명상, 그리고 현재에 집중하는 연습이 도움이 됩니다. 걱정을 구체적으로 적어보고 해결 가능한 것과 불가능한 것을 구분해보세요.",
        tips: ["4-7-8 호흡법 연습하기", "하루 3가지 감사한 일 찾기", "걱정 시간을 정해두기", "점진적 근육 이완법 시도하기"]
    },
    happiness: {
        title: "행복감 중심형",
        subtitle: "긍정적 에너지가 넘치는 밝은 마음",
        emoji: "😊",
        description: "현재 행복한 상태를 유지하고 있습니다. 이런 긍정적인 감정을 지속하는 것이 중요합니다.",
        advice: "현재의 행복한 상태를 인식하고 감사하는 마음을 가지세요. 이 긍정적인 에너지를 주변 사람들과도 나누어보세요.",
        tips: ["행복한 순간들을 사진으로 기록하기", "주변 사람들에게 감사 표현하기", "새로운 취미 도전하기", "웃음이 나는 콘텐츠 즐기기"]
    },
    anger: {
        title: "분노감 중심형",
        subtitle: "강한 열정을 가진 역동적인 마음",
        emoji: "😠",
        description: "분노나 짜증이 자주 느껴지고 있습니다. 이는 현재 상황에 대한 불만이나 스트레스에서 비롯될 수 있습니다.",
        advice: "분노의 원인을 파악하고 건전한 방법으로 해소하는 것이 중요합니다. 운동이나 창작 활동을 통해 에너지를 긍정적으로 전환해보세요.",
        tips: ["격렬한 운동으로 에너지 발산하기", "화날 때 10까지 세기", "분노 일기 쓰기", "냉수로 세수하기"]
    },
    calm: {
        title: "평온감 중심형",
        subtitle: "내면의 평화를 찾은 안정된 마음",
        emoji: "😌",
        description: "마음의 평온함을 유지하고 있습니다. 이는 감정 조절 능력이 뛰어나고 균형 잡힌 상태를 의미합니다.",
        advice: "현재의 평온함을 소중히 여기고, 이 상태를 유지할 수 있는 생활 패턴을 만들어가세요.",
        tips: ["명상이나 요가 시간 갖기", "자연 속에서 시간 보내기", "독서로 마음 다스리기", "차분한 음악 감상하기"]
    },
    excitement: {
        title: "흥분감 중심형",
        subtitle: "새로운 도전을 즐기는 활동적인 마음",
        emoji: "🤩",
        description: "높은 에너지와 흥미로운 감정 상태입니다. 새로운 것에 대한 호기심과 열정이 가득합니다.",
        advice: "이 에너지를 생산적인 활동에 집중하고, 과도한 자극은 피하면서 균형을 유지하세요.",
        tips: ["새로운 기술이나 취미 배우기", "여행이나 모험 계획하기", "창의적인 프로젝트 시작하기", "다양한 사람들과 교류하기"]
    },
    neutral: {
        title: "중립적 안정형",
        subtitle: "균형잡힌 감정 상태의 안정된 마음",
        emoji: "😐",
        description: "감정적으로 안정된 상태입니다. 극단적인 감정보다는 일정한 균형을 유지하고 있습니다.",
        advice: "현재의 안정감을 기반으로 새로운 목표나 관심사를 찾아 삶에 활력을 더해보세요.",
        tips: ["새로운 목표 설정하기", "규칙적인 생활 패턴 유지하기", "점진적인 변화 시도하기", "자기계발 활동 시작하기"]
    }
};

// 페이지 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeAds();
    updateLiveCounter();
    
    // 실시간 참여자 수 업데이트
    setInterval(updateLiveCounter, 30000);
});

// 광고 초기화
function initializeAds() {
    const topAd = document.getElementById('adTop');
    if (topAd) {
        adObserver.observe(topAd);
    }
}

// 실시간 참여자 수 업데이트
function updateLiveCounter() {
    const counter = document.getElementById('liveCount');
    if (counter) {
        const baseCount = 1247;
        const randomVariation = Math.floor(Math.random() * 20) - 10;
        counter.textContent = (baseCount + randomVariation).toLocaleString();
    }
}

// 테스트 시작
function startTest() {
    const startPage = document.getElementById('startPage');
    const questionPage = document.getElementById('questionPage');
    
    startPage.classList.add('hidden');
    questionPage.classList.remove('hidden');
    
    currentQuestion = 0;
    answers = [];
    showQuestion();
}

// 질문 표시
function showQuestion() {
    const question = questions[currentQuestion];
    const questionText = document.querySelector('.question-text');
    const answersGrid = document.querySelector('.answers-grid');
    const progressFill = document.querySelector('.progress-fill');
    const questionCounter = document.querySelector('.question-counter');
    const emotionIcon = document.getElementById('currentEmotionIcon');
    
    // 진행률 업데이트
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    questionCounter.textContent = `${currentQuestion + 1} / ${questions.length}`;
    
    // 질문 텍스트와 이모지 업데이트
    questionText.textContent = question.text;
    emotionIcon.textContent = question.emoji;
    
    // 답변 옵션 생성
    answersGrid.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer.text;
        button.onclick = () => selectAnswer(answer, index);
        answersGrid.appendChild(button);
    });
    
    // 4번째 질문 후 중간 광고 표시
    if (currentQuestion === 3) {
        const midAd = document.getElementById('adMid');
        if (midAd) {
            midAd.style.display = 'block';
            adObserver.observe(midAd);
        }
    }
}

// 답변 선택
function selectAnswer(answer, index) {
    answers.push(answer);
    
    // 버튼 선택 효과
    const buttons = document.querySelectorAll('.answer-btn');
    buttons[index].style.background = '#667eea';
    buttons[index].style.color = 'white';
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showLoading();
        }
    }, 500);
}

// 로딩 페이지 표시
function showLoading() {
    const questionPage = document.getElementById('questionPage');
    const loadingPage = document.getElementById('loadingPage');
    
    questionPage.classList.add('hidden');
    loadingPage.classList.remove('hidden');
    
    // 로딩 단계 애니메이션
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;
    
    const stepInterval = setInterval(() => {
        if (currentStep > 0) {
            steps[currentStep - 1].classList.remove('active');
        }
        if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
            currentStep++;
        } else {
            clearInterval(stepInterval);
            setTimeout(showResult, 1000);
        }
    }, 800);
}

// 결과 분석
function analyzeResults() {
    const emotionScores = {};
    
    // 모든 답변의 점수 합산
    answers.forEach(answer => {
        Object.entries(answer.score).forEach(([emotion, score]) => {
            emotionScores[emotion] = (emotionScores[emotion] || 0) + score;
        });
    });
    
    // 가장 높은 점수의 감정 찾기
    let primaryEmotion = 'neutral';
    let maxScore = 0;
    
    Object.entries(emotionScores).forEach(([emotion, score]) => {
        if (score > maxScore) {
            maxScore = score;
            primaryEmotion = emotion;
        }
    });
    
    // 주요 감정을 결과 카테고리에 매핑
    const emotionMapping = {
        depression: 'depression',
        anxiety: 'anxiety',
        happiness: 'happiness',
        anger: 'anger',
        calm: 'calm',
        excitement: 'excitement',
        energy: 'excitement',
        stress: 'anxiety',
        loneliness: 'depression',
        social: 'happiness',
        optimism: 'happiness',
        pessimism: 'anxiety',
        confidence: 'excitement',
        worry: 'anxiety'
    };
    
    const resultCategory = emotionMapping[primaryEmotion] || 'neutral';
    
    return {
        primary: resultCategory,
        scores: emotionScores,
        details: emotionResults[resultCategory]
    };
}

// 결과 표시
function showResult() {
    const loadingPage = document.getElementById('loadingPage');
    const resultPage = document.getElementById('resultPage');
    
    loadingPage.classList.add('hidden');
    resultPage.classList.remove('hidden');
    
    const result = analyzeResults();
    
    // 결과 업데이트
    document.getElementById('resultBadge').textContent = result.details.emoji;
    document.getElementById('resultTitle').textContent = result.details.title;
    document.getElementById('resultSubtitle').textContent = result.details.subtitle;
    
    // 상세 분석 업데이트
    document.getElementById('primaryEmotion').textContent = result.details.title;
    document.getElementById('hiddenEmotion').textContent = getSecondaryEmotion(result.scores);
    
    // 조언 업데이트
    document.getElementById('adviceContent').textContent = result.details.advice;
    
    // 팁 업데이트
    const tipsGrid = document.getElementById('tipsGrid');
    tipsGrid.innerHTML = '';
    result.details.tips.forEach(tip => {
        const tipElement = document.createElement('div');
        tipElement.className = 'tip-item';
        tipElement.textContent = tip;
        tipsGrid.appendChild(tipElement);
    });
    
    // 결과 광고 표시
    const resultAd = document.getElementById('adResult');
    if (resultAd) {
        adObserver.observe(resultAd);
    }
}

// 보조 감정 찾기
function getSecondaryEmotion(scores) {
    const sortedScores = Object.entries(scores)
        .sort(([,a], [,b]) => b - a);
    
    if (sortedScores.length > 1) {
        const secondaryEmotion = sortedScores[1][0];
        const emotionNames = {
            anxiety: '불안감',
            happiness: '행복감',
            stress: '스트레스',
            energy: '활력',
            calm: '평온함',
            anger: '분노',
            social: '사교성',
            loneliness: '외로움'
        };
        return emotionNames[secondaryEmotion] || '복합 감정';
    }
    return '단일 감정';
}

// 결과 공유
function shareResult() {
    const result = analyzeResults();
    const shareData = {
        title: '내 마음속 감정 분석 결과',
        text: `나의 감정 유형: ${result.details.title}\n${result.details.subtitle}`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        shareToKakao();
    }
}

// 카카오톡 공유
function shareToKakao() {
    const result = analyzeResults();
    
    window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: '내 마음속 감정 분석 테스트',
            description: `${result.details.title} - ${result.details.subtitle}`,
            imageUrl: 'https://sd2624.github.io/감정/emotion.png',
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

// 카카오톡 공유하기 (결과 페이지용)
function shareToKakao() {
    if (!window.Kakao.isInitialized()) {
        alert('카카오톡 공유 서비스를 준비 중입니다. 잠시 후 다시 시도해주세요.');
        return;
    }

    // 현재 결과 가져오기
    const resultTitle = document.getElementById('resultTitle')?.textContent || '감정 분석 결과';
    const resultEmoji = document.getElementById('resultBadge')?.textContent || '😊';
    const resultDescription = document.getElementById('resultSubtitle')?.textContent || '나의 감정 상태를 분석해보세요';

    window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: `${resultEmoji} ${resultTitle}`,
            description: `${resultDescription}\n\n친구들도 감정 테스트 해보세요! 👇`,
            imageUrl: 'https://sd2624.github.io/감정/emotion.png',
            link: {
                mobileWebUrl: 'https://sd2624.github.io/감정/',
                webUrl: 'https://sd2624.github.io/감정/'
            }
        },
        social: {
            likeCount: Math.floor(Math.random() * 100) + 50,
            commentCount: Math.floor(Math.random() * 30) + 10,
            sharedCount: Math.floor(Math.random() * 20) + 5
        },
        buttons: [
            {
                title: '나도 감정 테스트하기',
                link: {
                    mobileWebUrl: 'https://sd2624.github.io/감정/',
                    webUrl: 'https://sd2624.github.io/감정/'
                }
            }
        ],
        success: function(response) {
            console.log('카카오톡 공유 성공:', response);
        },
        fail: function(error) {
            console.error('카카오톡 공유 실패:', error);
            alert('카카오톡 공유에 실패했습니다.\n카카오톡 앱이 설치되어 있는지 확인해주세요.');
        }
    });
}

// 결과 공유하기 (일반)
function shareResult() {
    shareToKakao();
}

// 테스트 다시하기
function retryTest() {
    const resultPage = document.getElementById('resultPage');
    const startPage = document.getElementById('startPage');
    
    resultPage.classList.add('hidden');
    startPage.classList.remove('hidden');
    
    // 상태 초기화
    currentQuestion = 0;
    answers = [];
    
    // 중간 광고 숨기기
    const midAd = document.getElementById('adMid');
    if (midAd) {
        midAd.style.display = 'none';
    }
}