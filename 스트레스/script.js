// 카카오 SDK 초기화
function initKakao() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('3413c1beb87e9b2f3b7fce37dde67b4d');
        console.log('카카오 SDK 초기화 완료');
    }
}

// 스트레스 테스트 전역 변수
let currentQuestion = 0;
let stressScores = {};
let answers = []; // 답변 저장 배열
let loadedAds = new Set(); // 중복 광고 로드 방지

// 스트레스 결과 데이터
const stressResults = {
    low: {
        emoji: "😌",
        title: "낮은 스트레스 상태",
        subtitle: "건강한 마음 상태를 유지하고 있습니다",
        advice: "현재 스트레스 수준이 낮고 안정적입니다. 이 상태를 유지하며 예방적 관리에 집중하세요.",
        tips: [
            "규칙적인 생활 패턴 유지하기",
            "적절한 운동과 휴식 균형",
            "취미 활동으로 여가 시간 활용",
            "사회적 관계 지속적으로 관리"
        ]
    },
    medium: {
        emoji: "😐",
        title: "보통 스트레스 상태",
        subtitle: "일상적인 스트레스를 경험하고 있습니다",
        advice: "적당한 수준의 스트레스는 정상적입니다. 스트레스 관리 기술을 배워 더 효과적으로 대처해보세요.",
        tips: [
            "깊은 호흡과 명상 연습",
            "시간 관리 기술 습득",
            "스트레스 요인 파악하고 관리",
            "충분한 수면과 휴식"
        ]
    },
    high: {
        emoji: "😰",
        title: "높은 스트레스 상태",
        subtitle: "스트레스 관리가 필요한 상황입니다",
        advice: "높은 스트레스 수준입니다. 적극적인 스트레스 관리와 생활 습관 개선이 필요합니다.",
        tips: [
            "전문가 상담 고려하기",
            "스트레스 해소 활동 늘리기",
            "업무량 조절과 우선순위 설정",
            "지지체계 활용하기"
        ]
    },
    critical: {
        emoji: "😵",
        title: "매우 높은 스트레스 상태",
        subtitle: "즉시 스트레스 관리가 필요합니다",
        advice: "매우 높은 스트레스 상태입니다. 전문적인 도움을 받아 체계적인 관리가 필요합니다.",
        tips: [
            "즉시 전문가 상담 받기",
            "휴식과 회복에 집중",
            "스트레스 원인 제거 시도",
            "지속적인 관리 계획 수립"
        ]
    }
};

// 스트레스 테스트 질문 데이터
const stressQuestions = [
    {
        question: "최근 한 달 동안 수면의 질은 어떠셨나요?",
        answers: [
            { text: "깊고 편안하게 잠을 잠", score: 1 },
            { text: "가끔 뒤척이지만 괜찮게 잠", score: 2 },
            { text: "자주 깨고 피곤함을 느낌", score: 3 },
            { text: "거의 잠들지 못하고 피로함", score: 4 }
        ]
    },
    {
        question: "일상생활에서 짜증이나 화가 나는 빈도는?",
        answers: [
            { text: "거의 화가 나지 않음", score: 1 },
            { text: "가끔 짜증이 남", score: 2 },
            { text: "자주 화가 나고 짜증남", score: 3 },
            { text: "항상 예민하고 화가 남", score: 4 }
        ]
    },
    {
        question: "업무나 학업으로 인한 부담감은 어느 정도인가요?",
        answers: [
            { text: "적당하고 관리 가능함", score: 1 },
            { text: "가끔 부담스럽지만 해낼 수 있음", score: 2 },
            { text: "자주 벅차고 힘듦", score: 3 },
            { text: "감당하기 어려울 정도로 힘듦", score: 4 }
        ]
    },
    {
        question: "신체적 증상(두통, 소화불량, 근육 긴장 등)을 얼마나 자주 경험하시나요?",
        answers: [
            { text: "거의 경험하지 않음", score: 1 },
            { text: "가끔 가벼운 증상", score: 2 },
            { text: "자주 불편한 증상", score: 3 },
            { text: "지속적으로 심한 증상", score: 4 }
        ]
    },
    {
        question: "대인관계에서 느끼는 스트레스는?",
        answers: [
            { text: "원만하고 편안함", score: 1 },
            { text: "가끔 어려움이 있지만 괜찮음", score: 2 },
            { text: "자주 갈등이나 어려움", score: 3 },
            { text: "매우 힘들고 피하고 싶음", score: 4 }
        ]
    },
    {
        question: "미래에 대한 걱정이나 불안감은?",
        answers: [
            { text: "거의 걱정하지 않음", score: 1 },
            { text: "가끔 불안하지만 견딜 만함", score: 2 },
            { text: "자주 걱정되고 불안함", score: 3 },
            { text: "극심한 불안과 걱정", score: 4 }
        ]
    },
    {
        question: "일상 활동에 대한 흥미와 동기는?",
        answers: [
            { text: "평소처럼 활기차고 즐거움", score: 1 },
            { text: "가끔 의욕이 떨어지지만 괜찮음", score: 2 },
            { text: "자주 무기력하고 의욕 없음", score: 3 },
            { text: "아무것도 하기 싫고 무기력함", score: 4 }
        ]
    },
    {
        question: "집중력과 기억력 상태는?",
        answers: [
            { text: "평소와 같이 좋음", score: 1 },
            { text: "가끔 집중하기 어려움", score: 2 },
            { text: "자주 집중력 저하와 건망증", score: 3 },
            { text: "심각한 집중력과 기억력 문제", score: 4 }
        ]
    },
    {
        question: "식욕의 변화는 어떤가요?",
        answers: [
            { text: "평소와 동일하게 규칙적임", score: 1 },
            { text: "가끔 식욕이 없거나 과식함", score: 2 },
            { text: "자주 식욕 부진이나 폭식", score: 3 },
            { text: "심각한 식욕 변화로 고민", score: 4 }
        ]
    },
    {
        question: "감정 조절이 어려운 정도는?",
        answers: [
            { text: "감정을 잘 조절할 수 있음", score: 1 },
            { text: "가끔 감정이 격해짐", score: 2 },
            { text: "자주 감정 기복이 심함", score: 3 },
            { text: "감정 조절이 매우 어려움", score: 4 }
        ]
    },
    {
        question: "사회적 활동 참여 의지는?",
        answers: [
            { text: "적극적으로 참여함", score: 1 },
            { text: "가끔 참여하지 않고 싶음", score: 2 },
            { text: "자주 사람들을 피하고 싶음", score: 3 },
            { text: "거의 모든 모임을 피함", score: 4 }
        ]
    },
    {
        question: "업무나 일상 결정을 내리는 것이 어려운가요?",
        answers: [
            { text: "평소처럼 빠르게 결정함", score: 1 },
            { text: "가끔 망설이지만 결정함", score: 2 },
            { text: "자주 결정하기 어려워함", score: 3 },
            { text: "거의 결정을 못하겠음", score: 4 }
        ]
    },
    {
        question: "신체적 에너지 수준은?",
        answers: [
            { text: "평소와 같이 활기참", score: 1 },
            { text: "가끔 피곤하지만 견딜 만함", score: 2 },
            { text: "자주 기력이 없고 피곤함", score: 3 },
            { text: "거의 항상 극도로 피곤함", score: 4 }
        ]
    },
    {
        question: "금전적 걱정이나 스트레스는?",
        answers: [
            { text: "거의 걱정하지 않음", score: 1 },
            { text: "가끔 부담스럽지만 괜찮음", score: 2 },
            { text: "자주 금전적 스트레스를 느낌", score: 3 },
            { text: "극심한 경제적 불안감", score: 4 }
        ]
    },
    {
        question: "완벽주의 성향으로 인한 스트레스는?",
        answers: [
            { text: "적당히 타협할 수 있음", score: 1 },
            { text: "가끔 완벽하지 않아 불안함", score: 2 },
            { text: "자주 완벽하지 않으면 스트레스", score: 3 },
            { text: "완벽하지 않으면 견디기 어려움", score: 4 }
        ]
    },
    {
        question: "시간에 쫓기는 느낌은 얼마나 자주 드시나요?",
        answers: [
            { text: "시간 여유가 충분함", score: 1 },
            { text: "가끔 바쁘지만 관리 가능함", score: 2 },
            { text: "자주 시간에 쫓겨 급급함", score: 3 },
            { text: "항상 시간이 부족하고 급함", score: 4 }
        ]
    },
    {
        question: "자신에 대한 자신감 수준은?",
        answers: [
            { text: "평소와 같이 자신감 있음", score: 1 },
            { text: "가끔 자신감이 떨어짐", score: 2 },
            { text: "자주 자신감 부족을 느낌", score: 3 },
            { text: "극도로 자신감이 없음", score: 4 }
        ]
    },
    {
        question: "건강에 대한 걱정은 어느 정도인가요?",
        answers: [
            { text: "건강에 대해 거의 걱정 안함", score: 1 },
            { text: "가끔 건강이 걱정됨", score: 2 },
            { text: "자주 건강 문제가 걱정됨", score: 3 },
            { text: "건강에 대한 극심한 불안", score: 4 }
        ]
    },
    {
        question: "변화나 새로운 상황에 대한 적응은?",
        answers: [
            { text: "변화를 잘 받아들임", score: 1 },
            { text: "가끔 적응하기 어려움", score: 2 },
            { text: "자주 변화가 부담스러움", score: 3 },
            { text: "변화를 매우 두려워함", score: 4 }
        ]
    },
    {
        question: "전반적인 삶의 만족도는?",
        answers: [
            { text: "전반적으로 만족함", score: 1 },
            { text: "가끔 불만족스럽지만 괜찮음", score: 2 },
            { text: "자주 불만족스럽고 힘듦", score: 3 },
            { text: "매우 불만족스럽고 절망적", score: 4 }
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
                    adElement.style.border = '1px solid rgba(102, 126, 234, 0.2)';
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
    console.log('스트레스 테스트 초기화 시작');
    
    // 카카오 SDK 초기화
    initKakao();
    
    // 광고 관리 초기화
    adManager.init();
    
    // 초기 광고 관찰
    adManager.observe('adTop');
    
    // 테스트 시작 버튼 이벤트
    const startBtn = document.getElementById('startStressTest');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            console.log('스트레스 테스트 시작');
            startStressTest();
        });
    }
    
    // 결과 다시보기 버튼 이벤트
    const retryBtn = document.getElementById('retryBtn');
    if (retryBtn) {
        retryBtn.addEventListener('click', function() {
            console.log('테스트 다시하기');
            resetTest();
        });
    }
    
    // 카카오 공유 버튼 이벤트
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            console.log('카카오 공유 버튼 클릭');
            shareKakao();
        });
    }
});

// 테스트 시작 함수
function startStressTest() {
    console.log('스트레스 테스트 시작 함수 실행');
    
    // 초기화
    currentQuestion = 0;
    stressScores = {};
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
    if (currentQuestion >= stressQuestions.length) {
        showLoadingPage();
        return;
    }
    
    const question = stressQuestions[currentQuestion];
    
    // 진행률 업데이트
    const progress = ((currentQuestion) / stressQuestions.length) * 100;
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
    
    // 질문 카운터 업데이트
    const questionCounter = document.querySelector('.question-counter');
    if (questionCounter) {
        questionCounter.textContent = `${currentQuestion + 1} / ${stressQuestions.length}`;
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
    const question = stressQuestions[currentQuestion];
    const selectedAnswer = question.answers[answerIndex];
    
    // 답변 저장
    answers.push({
        question: question.question,
        answer: selectedAnswer.text,
        score: selectedAnswer.score
    });
    
    // 스트레스 점수 누적
    if (!stressScores.total) stressScores.total = 0;
    stressScores.total += selectedAnswer.score;
    
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
    const totalScore = stressScores.total || 0;
    const maxScore = stressQuestions.length * 4;
    const percentage = (totalScore / maxScore) * 100;
    
    let resultType;
    if (percentage <= 25) {
        resultType = stressResults.low;
    } else if (percentage <= 50) {
        resultType = stressResults.medium;
    } else if (percentage <= 75) {
        resultType = stressResults.high;
    } else {
        resultType = stressResults.critical;
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
    let stats = JSON.parse(localStorage.getItem('stressTestStats') || '{}');
    
    if (!stats[resultTitle]) {
        stats[resultTitle] = 0;
    }
    stats[resultTitle]++;
    
    const totalUsers = Object.values(stats).reduce((sum, count) => sum + count, 0);
    
    localStorage.setItem('stressTestStats', JSON.stringify(stats));
    
    // 통계 표시
    const statsContainer = document.getElementById('statsContainer');
    if (statsContainer) {
        let statsHTML = `<h3>참여 통계 (총 ${totalUsers}명)</h3>`;
        
        Object.entries(stats).forEach(([type, count]) => {
            const percentage = ((count / totalUsers) * 100).toFixed(1);
            statsHTML += `
                <div class="stat-item">
                    <span class="stat-label">${type}</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="stat-value">${count}명 (${percentage}%)</span>
                </div>
            `;
        });
        
        statsContainer.innerHTML = statsHTML;
    }
}

// 테스트 재시작 함수
function resetTest() {
    console.log('테스트 재시작');
    
    // 변수 초기화
    currentQuestion = 0;
    stressScores = {};
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

// 카카오 공유 함수
function shareKakao() {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
        alert('카카오 SDK가 로드되지 않았습니다.');
        return;
    }
    
    const result = analyzeResults();
    
    window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '스트레스 수준 테스트 결과',
            description: `나의 결과: ${result.title}\n${result.subtitle}`,
            imageUrl: window.location.origin + '/share-image.png',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
        },
        buttons: [
            {
                title: '나도 테스트하기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            }
        ]
    });
}

// 테스트 시작 함수 (HTML의 onclick에서 호출)
function startTest() {
    startStressTest();
}

// 전역 함수로 노출 (HTML에서 호출하기 위해)
window.startStressTest = startStressTest;
window.startTest = startTest;
window.selectAnswer = selectAnswer;
window.resetTest = resetTest;
window.shareKakao = shareKakao;