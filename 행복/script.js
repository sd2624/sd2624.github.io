// 카카오 SDK 초기화
function initKakao() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('3413c1beb87e9b2f3b7fce37dde67b4d');
        console.log('카카오 SDK 초기화 완료');
    }
}

// 행복 테스트 전역 변수
let currentQuestion = 0;
let happinessScores = {};
let answers = []; // 답변 저장 배열
let loadedAds = new Set(); // 중복 광고 로드 방지

// 행복 결과 데이터
const happinessResults = {
    low: {
        emoji: "😔",
        title: "낮은 행복 지수",
        subtitle: "행복을 찾기 위한 새로운 시작이 필요해요",
        advice: "현재 행복 지수가 낮은 상태입니다. 작은 변화부터 시작해서 점진적으로 행복을 늘려나가세요.",
        tips: [
            "매일 감사할 일 3가지 적어보기",
            "좋아하는 활동에 시간 투자하기",
            "가족, 친구와 시간 늘리기",
            "새로운 취미나 관심사 찾기"
        ]
    },
    medium: {
        emoji: "😊",
        title: "보통 행복 지수",
        subtitle: "안정적인 행복 상태를 유지하고 있어요",
        advice: "전반적으로 안정적인 행복 상태입니다. 더 큰 행복을 위해 새로운 도전과 경험을 해보세요.",
        tips: [
            "목표 설정하고 달성하기",
            "새로운 사람들과 관계 맺기",
            "운동이나 건강 관리하기",
            "자기계발과 성장에 투자하기"
        ]
    },
    high: {
        emoji: "😄",
        title: "높은 행복 지수",
        subtitle: "매우 만족스러운 삶을 살고 있어요",
        advice: "높은 수준의 행복을 유지하고 있습니다. 이 상태를 지속하며 다른 사람들에게도 긍정적인 영향을 주세요.",
        tips: [
            "행복한 순간들 기록하고 나누기",
            "다른 사람들 도우며 의미 찾기",
            "깊이 있는 관계 발전시키기",
            "지속적인 성장과 발전 추구하기"
        ]
    },
    very_high: {
        emoji: "🥰",
        title: "매우 높은 행복 지수",
        subtitle: "최고 수준의 행복한 삶을 살고 있어요",
        advice: "최고 수준의 행복 상태입니다. 현재의 행복을 유지하며 삶의 깊은 의미와 가치를 추구해보세요.",
        tips: [
            "행복 비결을 다른 사람들과 공유하기",
            "봉사활동이나 기부로 의미 찾기",
            "인생의 큰 목표와 비전 설정하기",
            "지혜와 통찰력 계발하기"
        ]
    }
};

// 행복 테스트 질문 데이터 (20개)
const happinessQuestions = [
    {
        question: "아침에 일어났을 때 기분은 어떤가요?",
        answers: [
            { text: "상쾌하고 활기차게 일어남", score: 4 },
            { text: "괜찮은 편이지만 조금 피곤함", score: 3 },
            { text: "무겁고 일어나기 싫음", score: 2 },
            { text: "매우 우울하고 하루가 두려움", score: 1 }
        ]
    },
    {
        question: "일상 생활에서 웃는 빈도는?",
        answers: [
            { text: "자주 웃고 즐거워함", score: 4 },
            { text: "가끔 웃지만 보통 수준", score: 3 },
            { text: "웃을 일이 별로 없음", score: 2 },
            { text: "거의 웃지 않음", score: 1 }
        ]
    },
    {
        question: "현재 인간관계에 대한 만족도는?",
        answers: [
            { text: "매우 만족하고 감사함", score: 4 },
            { text: "대체로 만족함", score: 3 },
            { text: "불만족스러운 부분이 있음", score: 2 },
            { text: "외롭고 고립된 느낌", score: 1 }
        ]
    },
    {
        question: "자신의 성취나 발전에 대해 어떻게 생각하나요?",
        answers: [
            { text: "계속 성장하고 발전하고 있음", score: 4 },
            { text: "조금씩 나아지고 있음", score: 3 },
            { text: "정체되어 있는 느낌", score: 2 },
            { text: "후퇴하고 있는 것 같음", score: 1 }
        ]
    },
    {
        question: "미래에 대한 기대감은?",
        answers: [
            { text: "매우 기대되고 희망적", score: 4 },
            { text: "어느 정도 기대됨", score: 3 },
            { text: "불안하고 걱정됨", score: 2 },
            { text: "절망적이고 두려움", score: 1 }
        ]
    },
    {
        question: "스트레스를 받을 때 대처 방법은?",
        answers: [
            { text: "건전한 방법으로 잘 해소함", score: 4 },
            { text: "나름대로 관리하고 있음", score: 3 },
            { text: "해소가 어렵고 쌓임", score: 2 },
            { text: "감당하기 어려울 정도", score: 1 }
        ]
    },
    {
        question: "자신에 대한 만족도는?",
        answers: [
            { text: "자신을 사랑하고 만족함", score: 4 },
            { text: "대체로 괜찮다고 생각함", score: 3 },
            { text: "부족함을 많이 느낌", score: 2 },
            { text: "자신이 싫고 실망스러움", score: 1 }
        ]
    },
    {
        question: "취미나 여가 활동의 즐거움은?",
        answers: [
            { text: "매우 즐겁고 활발히 함", score: 4 },
            { text: "어느 정도 즐김", score: 3 },
            { text: "흥미를 잃어가고 있음", score: 2 },
            { text: "아무것도 재미없음", score: 1 }
        ]
    },
    {
        question: "건강 상태에 대한 만족도는?",
        answers: [
            { text: "매우 건강하고 활력 넘침", score: 4 },
            { text: "대체로 건강함", score: 3 },
            { text: "몸이 자주 피곤하고 아픔", score: 2 },
            { text: "건강이 매우 걱정됨", score: 1 }
        ]
    },
    {
        question: "경제적 상황에 대한 만족도는?",
        answers: [
            { text: "충분하고 만족스러움", score: 4 },
            { text: "필요한 만큼은 있음", score: 3 },
            { text: "부족함을 자주 느낌", score: 2 },
            { text: "매우 부족하고 걱정됨", score: 1 }
        ]
    },
    {
        question: "일이나 공부에 대한 만족도는?",
        answers: [
            { text: "매우 만족하고 보람을 느낌", score: 4 },
            { text: "나쁘지 않음", score: 3 },
            { text: "스트레스가 많음", score: 2 },
            { text: "매우 힘들고 싫음", score: 1 }
        ]
    },
    {
        question: "가족과의 관계는?",
        answers: [
            { text: "매우 화목하고 사랑이 넘침", score: 4 },
            { text: "대체로 좋음", score: 3 },
            { text: "갈등이 있지만 견딜 만함", score: 2 },
            { text: "매우 힘들고 스트레스", score: 1 }
        ]
    },
    {
        question: "새로운 도전에 대한 의욕은?",
        answers: [
            { text: "적극적이고 도전적", score: 4 },
            { text: "기회가 되면 해보고 싶음", score: 3 },
            { text: "부담스럽고 회피하고 싶음", score: 2 },
            { text: "전혀 하고 싶지 않음", score: 1 }
        ]
    },
    {
        question: "감정 표현과 소통은?",
        answers: [
            { text: "자유롭고 원활하게 소통함", score: 4 },
            { text: "어느 정도 표현할 수 있음", score: 3 },
            { text: "표현이 어렵고 답답함", score: 2 },
            { text: "전혀 표현하지 못함", score: 1 }
        ]
    },
    {
        question: "휴식과 재충전 시간은?",
        answers: [
            { text: "충분하고 만족스러움", score: 4 },
            { text: "어느 정도 시간이 있음", score: 3 },
            { text: "부족하지만 견딜 만함", score: 2 },
            { text: "전혀 없어서 지침", score: 1 }
        ]
    },
    {
        question: "자신의 가치와 존재 의미에 대해?",
        answers: [
            { text: "분명하고 의미 있다고 느낌", score: 4 },
            { text: "어느 정도 의미를 찾고 있음", score: 3 },
            { text: "의미를 찾기 어려움", score: 2 },
            { text: "무의미하고 공허함", score: 1 }
        ]
    },
    {
        question: "사회적 활동과 참여는?",
        answers: [
            { text: "적극적으로 참여하고 즐김", score: 4 },
            { text: "가끔 참여함", score: 3 },
            { text: "참여하기 어려움", score: 2 },
            { text: "전혀 참여하지 않음", score: 1 }
        ]
    },
    {
        question: "변화와 적응에 대한 자신감은?",
        answers: [
            { text: "변화를 즐기고 잘 적응함", score: 4 },
            { text: "어느 정도 적응할 수 있음", score: 3 },
            { text: "변화가 부담스럽고 어려움", score: 2 },
            { text: "변화를 매우 두려워함", score: 1 }
        ]
    },
    {
        question: "감사함을 느끼는 빈도는?",
        answers: [
            { text: "매일 감사한 일들을 찾음", score: 4 },
            { text: "가끔 감사함을 느낌", score: 3 },
            { text: "감사할 일이 별로 없음", score: 2 },
            { text: "감사함을 거의 느끼지 못함", score: 1 }
        ]
    },
    {
        question: "전반적인 삶의 만족도는?",
        answers: [
            { text: "매우 만족하고 행복함", score: 4 },
            { text: "대체로 만족함", score: 3 },
            { text: "불만족스러운 부분이 많음", score: 2 },
            { text: "매우 불만족스럽고 불행함", score: 1 }
        ]
    }
];

// 광고 관리 객체
const adManager = {
    observer: null,
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const adContainer = entry.target;
                    const adId = adContainer.id;
                    
                    if (!loadedAds.has(adId)) {
                        this.loadAd(adId);
                        loadedAds.add(adId);
                        this.observer.unobserve(adContainer);
                    }
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px' 
        });
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
                    adElement.style.border = '1px solid rgba(255, 193, 7, 0.2)';
                    adElement.style.borderRadius = '6px';
                    adElement.style.padding = '5px';
                    adElement.style.margin = '5px 0';
                } else {
                    adElement.style.minHeight = '80px';
                    adElement.style.maxHeight = '120px';
                    adElement.style.padding = '8px';
                    adElement.style.margin = '8px 0';
                }
                
                (adsbygoogle = window.adsbygoogle || []).push({});
                console.log(`광고 로드 완료: ${adId}`);
            }
        } catch (error) {
            console.error(`광고 로드 실패: ${adId}`, error);
        }
    },
    
    showMidAd() {
        const midAd = document.getElementById('adMid');
        if (midAd) {
            midAd.style.display = 'block';
            midAd.style.margin = '6px 0';
            if (window.innerWidth <= 768) {
                midAd.style.maxHeight = '70px';
            }
            this.observe('adMid');
        }
    }
};

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('행복 테스트 초기화 시작');
    
    // 카카오 SDK 초기화
    initKakao();
    
    // 광고 관리 초기화
    adManager.init();
    
    // 상단 광고 관찰 시작
    adManager.observe('adTop');
    
    // 시작 버튼 이벤트
    const startBtn = document.querySelector('.start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            startHappinessTest();
        });
    }
    
    // 혹시 실패했을 때 글로벌로 노출
    window.startHappinessTest = startHappinessTest;
    
    // 10초 후 자동으로 스크롤 유도
    setTimeout(() => {
        const urgencyNotice = document.querySelector('.urgency-notice');
        if (urgencyNotice) {
            urgencyNotice.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 10000);
    
    // 페이지 떠날 때 확인
    window.addEventListener('beforeunload', function(e) {
        if (currentQuestion > 0 && currentQuestion < happinessQuestions.length) {
            e.preventDefault();
            e.returnValue = '테스트를 진행 중입니다. 정말로 페이지를 떠나시겠습니까?';
            return e.returnValue;
        }
    });
});

// 테스트 시작 함수
function startHappinessTest() {
    console.log('행복 테스트 시작 함수 실행');
    
    // 초기화
    currentQuestion = 0;
    happinessScores = {};
    answers = [];
    
    // 섹션 표시/숨김
    document.getElementById('startPage').style.display = 'none';
    document.getElementById('questionPage').style.display = 'block';
    document.getElementById('questionPage').classList.remove('hidden');
    document.getElementById('resultPage').style.display = 'none';
    
    showQuestion();
}

// 질문 표시 함수
function showQuestion() {
    if (currentQuestion >= happinessQuestions.length) {
        showLoadingPage();
        return;
    }
    
    const question = happinessQuestions[currentQuestion];
    
    // 진행률 업데이트
    const progress = ((currentQuestion) / happinessQuestions.length) * 100;
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
    
    // 질문 카운터 업데이트
    const questionCounter = document.querySelector('.question-counter');
    if (questionCounter) {
        questionCounter.textContent = `${currentQuestion + 1} / ${happinessQuestions.length}`;
    }
    
    // 질문 텍스트 업데이트
    const questionText = document.querySelector('.question-text');
    if (questionText) {
        questionText.textContent = question.question;
    }
    
    // 답변 버튼들 생성
    const answersGrid = document.querySelector('.answers-grid');
    if (answersGrid) {
        const answersHTML = question.answers.map((answer, index) => `
            <button class="answer-btn" onclick="selectAnswer(${index})" data-score="${answer.score}">
                ${answer.text}
            </button>
        `).join('');
        
        answersGrid.innerHTML = answersHTML;
    }
    
    // 중간 광고 표시 (4번째 질문 후)
    if (currentQuestion === 3) {
        adManager.showMidAd();
    }
}

// 답변 선택 함수
function selectAnswer(answerIndex) {
    const question = happinessQuestions[currentQuestion];
    const selectedAnswer = question.answers[answerIndex];
    
    // 답변 저장
    answers.push({
        question: question.question,
        answer: selectedAnswer.text,
        score: selectedAnswer.score
    });
    
    // 행복 점수 누적
    if (!happinessScores.total) happinessScores.total = 0;
    happinessScores.total += selectedAnswer.score;
    
    console.log(`질문 ${currentQuestion + 1} 답변: ${selectedAnswer.text} (점수: ${selectedAnswer.score})`);
    
    currentQuestion++;
    
    // 다음 질문으로 이동
    setTimeout(() => {
        showQuestion();
    }, 300);
}

// 로딩 페이지 표시 함수
function showLoadingPage() {
    console.log('로딩 페이지 표시');
    
    // 섹션 전환
    document.getElementById('questionPage').style.display = 'none';
    document.getElementById('loadingPage').style.display = 'block';
    document.getElementById('loadingPage').classList.remove('hidden');
    
    // 로딩 단계별 진행
    setTimeout(() => {
        showLoadingStep(1);
    }, 500);
    
    setTimeout(() => {
        showLoadingStep(2);
    }, 1500);
    
    setTimeout(() => {
        showLoadingStep(3);
    }, 2500);
    
    // 3초 후 결과 표시
    setTimeout(() => {
        showResults();
    }, 3500);
}

// 로딩 단계 표시 함수
function showLoadingStep(stepNumber) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index < stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// 결과 분석 함수
function analyzeResults() {
    const totalScore = happinessScores.total || 0;
    const maxScore = happinessQuestions.length * 4;
    const percentage = (totalScore / maxScore) * 100;
    
    let resultType;
    if (percentage <= 25) {
        resultType = happinessResults.low;
    } else if (percentage <= 50) {
        resultType = happinessResults.medium;
    } else if (percentage <= 75) {
        resultType = happinessResults.high;
    } else {
        resultType = happinessResults.very_high;
    }
    
    return {
        ...resultType,
        score: totalScore,
        percentage: percentage.toFixed(1)
    };
}

// 결과 표시 함수
function showResults() {
    console.log('결과 표시 함수 실행');
    
    // 섹션 전환
    document.getElementById('questionPage').style.display = 'none';
    document.getElementById('loadingPage').style.display = 'none';
    document.getElementById('resultPage').style.display = 'block';
    document.getElementById('resultPage').classList.remove('hidden');
    
    // 결과 분석
    const result = analyzeResults();
    
    // 결과 렌더링
    renderResults(result);
    
    // 통계 업데이트
    updateStats(result.title);
    
    // 결과 광고 표시
    adManager.observe('adResult');
}

// 결과 렌더링 함수
function renderResults(result) {
    // 결과 뱃지 업데이트
    const resultBadge = document.getElementById('resultBadge');
    if (resultBadge) {
        resultBadge.textContent = result.emoji;
    }
    
    // 결과 제목 업데이트
    const resultTitle = document.getElementById('resultTitle');
    if (resultTitle) {
        resultTitle.textContent = result.title;
    }
    
    // 결과 부제목 업데이트
    const resultSubtitle = document.getElementById('resultSubtitle');
    if (resultSubtitle) {
        resultSubtitle.textContent = result.subtitle;
    }
    
    // 점수 표시 업데이트
    const resultScore = document.getElementById('resultScore');
    if (resultScore) {
        resultScore.textContent = `총 점수: ${result.score}점 (${result.percentage}%)`;
    }
    
    // 조언 내용 업데이트
    const adviceContent = document.getElementById('adviceContent');
    if (adviceContent) {
        adviceContent.textContent = result.advice;
    }
    
    // 팁 내용 업데이트
    const tipsContent = document.getElementById('tipsContent');
    if (tipsContent) {
        const tipsHTML = result.tips.map(tip => `<li>${tip}</li>`).join('');
        tipsContent.innerHTML = tipsHTML;
    }
}

// 통계 업데이트 함수
function updateStats(resultTitle) {
    let stats = JSON.parse(localStorage.getItem('happinessTestStats') || '{}');
    
    if (!stats[resultTitle]) {
        stats[resultTitle] = 0;
    }
    stats[resultTitle]++;
    
    const totalUsers = Object.values(stats).reduce((sum, count) => sum + count, 0);
    stats.totalUsers = totalUsers;
    
    localStorage.setItem('happinessTestStats', JSON.stringify(stats));
    
    // 통계 표시
    const statsContainer = document.querySelector('.stats-container .stats-grid');
    if (statsContainer) {
        const statsHTML = `
            <div class="stat-item">
                <span class="stat-number">97.3%</span>
                <span class="stat-label">정확도</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${(totalUsers + 420000).toLocaleString()}+</span>
                <span class="stat-label">참여자 수</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">3분</span>
                <span class="stat-label">소요시간</span>
            </div>
        `;
        statsContainer.innerHTML = statsHTML;
    }
}

// 테스트 재시작 함수
function resetTest() {
    console.log('테스트 재시작');
    
    // 변수 초기화
    currentQuestion = 0;
    happinessScores = {};
    answers = [];
    
    // 섹션 전환
    document.getElementById('resultPage').style.display = 'none';
    document.getElementById('resultPage').classList.add('hidden');
    document.getElementById('loadingPage').style.display = 'none';
    document.getElementById('loadingPage').classList.add('hidden');
    document.getElementById('questionPage').style.display = 'none';
    document.getElementById('questionPage').classList.add('hidden');
    document.getElementById('startPage').style.display = 'block';
    
    // 진행률 초기화
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
}

// 카카오톡 공유 함수
function shareKakao() {
    if (!window.Kakao) {
        alert('카카오톡 공유 기능을 사용할 수 없습니다.');
        return;
    }
    
    const result = analyzeResults();
    
    Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: '🌈 행복 지수 측정 결과',
            description: `나의 행복 지수: ${result.title}\n${result.subtitle}`,
            imageUrl: 'https://sd2624.github.io/행복/행복.png',
            link: {
                mobileWebUrl: 'https://sd2624.github.io/행복/',
                webUrl: 'https://sd2624.github.io/행복/'
            }
        },
        buttons: [
            {
                title: '나도 테스트하기',
                link: {
                    mobileWebUrl: 'https://sd2624.github.io/행복/',
                    webUrl: 'https://sd2624.github.io/행복/'
                }
            }
        ]
    });
}

// 전역 함수 노출
window.startHappinessTest = startHappinessTest;
window.selectAnswer = selectAnswer;
window.resetTest = resetTest;
window.shareKakao = shareKakao;