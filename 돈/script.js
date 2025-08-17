// 카카오 SDK 초기화
function initKakao() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('3413c1beb87e9b2f3b7fce37dde67b4d');
        console.log('카카오 SDK 초기화 완료');
    }
}

// 돈 관리 테스트 전역 변수
let currentQuestion = 0;
let moneyScores = {};
let answers = []; // 답변 저장 배열
let loadedAds = new Set(); // 중복 광고 로드 방지

// 광고 관리 객체 - IntersectionObserver 사용
const adManager = {
    observer: null,
    
    // 광고 관리자 초기화
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const adContainer = entry.target;
                    const adId = adContainer.id;
                    
                    // 중복 로드 방지
                    if (!loadedAds.has(adId)) {
                        this.loadAd(adId);
                        loadedAds.add(adId);
                        this.observer.unobserve(adContainer); // 한 번만 로드
                    }
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px' 
        });
    },
    
    // 광고 컨테이너 관찰 시작
    observe(adId) {
        const adElement = document.getElementById(adId);
        if (adElement && this.observer) {
            this.observer.observe(adElement);
        }
    },
    
    // 광고 로드 실행 (작은 크기로 최적화)
    loadAd(adId) {
        try {
            const adElement = document.getElementById(adId);
            if (adElement && typeof (adsbygoogle) !== 'undefined') {
                // 모바일/PC별 광고 최적화 (작은 크기)
                if (window.innerWidth <= 768) {
                    // 모바일: 매우 작게
                    adElement.style.minHeight = '60px';
                    adElement.style.maxHeight = '80px';
                    adElement.style.border = '1px solid rgba(102, 126, 234, 0.2)';
                    adElement.style.borderRadius = '6px';
                    adElement.style.padding = '5px';
                    adElement.style.margin = '5px 0';
                } else {
                    // PC: 조금 더 크게
                    adElement.style.minHeight = '80px';
                    adElement.style.maxHeight = '120px';
                    adElement.style.padding = '8px';
                    adElement.style.margin = '8px 0';
                }
                
                (adsbygoogle = window.adsbygoogle || []).push({});
                console.log(`광고 로드 완료 (최적화): ${adId}`);
            }
        } catch (error) {
            console.error(`광고 로드 실패: ${adId}`, error);
        }
    },
    
    // 중간 광고 표시 (3번째 질문 후) - 작은 크기
    showMidAd() {
        const midAd = document.getElementById('adMid');
        if (midAd) {
            midAd.style.display = 'block';
            // 질문과 답변 사이 여백 최소화
            midAd.style.margin = '6px 0';
            if (window.innerWidth <= 768) {
                midAd.style.maxHeight = '70px';
            }
            this.observe('adMid');
        }
    }
};

// 12개 질문 데이터
const questions = [
    {
        text: "월급을 받으면 가장 먼저 하는 일은?",
        answers: [
            { text: "바로 적금통장에 넣는다", type: "절약형", score: 3 },
            { text: "생활비부터 계산한다", type: "계획형", score: 2 },
            { text: "투자할 곳을 찾아본다", type: "투자형", score: 3 },
            { text: "갖고 싶던 걸 산다", type: "소비형", score: 3 }
        ]
    },
    {
        text: "투자에 대한 당신의 생각은?",
        answers: [
            { text: "안전한 게 최고다", type: "안정형", score: 3 },
            { text: "조금씩 공부하며 시작", type: "신중형", score: 2 },
            { text: "큰 수익을 위해 과감하게", type: "적극형", score: 3 },
            { text: "전문가에게 맡긴다", type: "위임형", score: 2 }
        ]
    },
    {
        text: "갑자기 100만원이 생긴다면?",
        answers: [
            { text: "통장에 고이 모셔둔다", type: "절약형", score: 3 },
            { text: "생활비나 빚 갚는데 쓴다", type: "현실형", score: 2 },
            { text: "주식이나 코인에 투자", type: "투자형", score: 3 },
            { text: "여행이나 쇼핑을 간다", type: "소비형", score: 3 }
        ]
    },
    {
        text: "가계부 작성에 대한 당신의 스타일은?",
        answers: [
            { text: "매일 꼼꼼히 기록한다", type: "계획형", score: 3 },
            { text: "가끔 확인해본다", type: "관리형", score: 2 },
            { text: "앱으로 간단하게", type: "디지털형", score: 2 },
            { text: "머릿속으로만 계산", type: "직감형", score: 1 }
        ]
    },
    {
        text: "신용카드 사용 패턴은?",
        answers: [
            { text: "현금처럼 신중하게", type: "신중형", score: 3 },
            { text: "포인트나 할인 위주", type: "혜택형", score: 2 },
            { text: "일단 긁고 나중에 생각", type: "즉흥형", score: 1 },
            { text: "거의 사용하지 않음", type: "현금형", score: 3 }
        ]
    },
    {
        text: "부동산 투자에 대한 관심도는?",
        answers: [
            { text: "매우 관심 있고 공부 중", type: "투자형", score: 3 },
            { text: "안정적이라 생각함", type: "안정형", score: 2 },
            { text: "너무 어려워 보임", type: "보수형", score: 1 },
            { text: "리스크가 걱정됨", type: "신중형", score: 2 }
        ]
    },
    {
        text: "보험은 어떻게 관리하나요?",
        answers: [
            { text: "꼼꼼히 비교 후 가입", type: "계획형", score: 3 },
            { text: "최소한만 가입", type: "실용형", score: 2 },
            { text: "추천받은 대로", type: "위임형", score: 1 },
            { text: "별로 관심 없음", type: "무관심형", score: 1 }
        ]
    },
    {
        text: "은퇴 준비는 언제부터?",
        answers: [
            { text: "이미 시작했다", type: "선구자형", score: 3 },
            { text: "30대부터 계획 중", type: "계획형", score: 2 },
            { text: "40대쯤 시작하면 될 듯", type: "여유형", score: 1 },
            { text: "아직 생각해본 적 없음", type: "현재형", score: 1 }
        ]
    },
    {
        text: "주식 투자 경험은?",
        answers: [
            { text: "꾸준히 하고 있다", type: "투자형", score: 3 },
            { text: "조금씩 공부 중", type: "학습형", score: 2 },
            { text: "한두 번 해봤다", type: "경험형", score: 1 },
            { text: "전혀 없다", type: "보수형", score: 1 }
        ]
    },
    {
        text: "돈 관리의 최우선 목표는?",
        answers: [
            { text: "안전하게 보존하기", type: "보존형", score: 3 },
            { text: "꾸준히 불리기", type: "성장형", score: 2 },
            { text: "큰 수익 만들기", type: "수익형", score: 3 },
            { text: "자유롭게 쓰기", type: "자유형", score: 2 }
        ]
    },
    {
        text: "경제 뉴스나 정보는?",
        answers: [
            { text: "매일 챙겨본다", type: "정보형", score: 3 },
            { text: "가끔 관심 있게", type: "관심형", score: 2 },
            { text: "필요할 때만", type: "실용형", score: 1 },
            { text: "거의 안 본다", type: "무관심형", score: 1 }
        ]
    },
    {
        text: "돈 관리에서 가장 어려운 점은?",
        answers: [
            { text: "계획대로 안 되는 것", type: "계획형", score: 2 },
            { text: "정보가 너무 많음", type: "정보형", score: 2 },
            { text: "의지력이 부족함", type: "의지형", score: 1 },
            { text: "시간이 없음", type: "바쁨형", score: 1 }
        ]
    }
];

// 돈 관리 유형별 결과 데이터
const moneyTypes = {
    "절약형": {
        name: "절약의 달인",
        icon: "💰",
        description: "돈을 모으는 것에 타고난 재능이 있는 당신! 계획적이고 신중한 소비로 안정적인 재정 관리를 하고 있어요.",
        strengths: ["뛰어난 절약 능력", "계획적 소비", "안정적 자산 관리"],
        weaknesses: ["투자 기회 놓칠 수 있음", "과도한 절약으로 인한 스트레스"],
        advice: "절약만큼 투자도 중요해요. 안전한 투자상품부터 시작해보세요.",
        tips: ["적금과 함께 안전한 펀드 투자", "가계부 작성으로 절약 포인트 발견", "목표 설정으로 동기부여"]
    },
    "투자형": {
        name: "투자의 고수",
        icon: "📈",
        description: "적극적인 투자로 자산을 불리는 당신! 리스크를 감수하며 더 큰 수익을 추구하는 적극적인 투자자예요.",
        strengths: ["높은 수익 추구", "투자 감각", "적극적 자산 운용"],
        weaknesses: ["높은 리스크", "감정적 투자 위험"],
        advice: "분산투자와 장기투자 원칙을 지키며 안정성도 함께 고려해보세요.",
        tips: ["포트폴리오 분산 투자", "감정 조절과 장기 관점", "정기적인 투자 점검"]
    },
    "계획형": {
        name: "재정 관리 전문가",
        icon: "📊",
        description: "체계적이고 계획적인 돈 관리의 달인! 목표를 세우고 차근차근 실행하는 모범적인 재정 관리자예요.",
        strengths: ["체계적 관리", "목표 지향적", "균형잡힌 투자"],
        weaknesses: ["과도한 계획으로 인한 스트레스", "융통성 부족"],
        advice: "계획은 유지하되 시장 상황에 따른 유연한 대응도 필요해요.",
        tips: ["정기적인 계획 점검", "비상 자금 준비", "투자 비중 조절"]
    },
    "소비형": {
        name: "라이프 스타일 투자자",
        icon: "💳",
        description: "현재를 즐기며 살아가는 당신! 돈은 쓰라고 있는 것이라는 철학으로 적극적인 소비 생활을 해요.",
        strengths: ["현재 만족도 높음", "적극적 소비", "경험 중시"],
        weaknesses: ["저축 부족", "미래 준비 소홀"],
        advice: "현재 즐기는 것도 좋지만, 미래를 위한 최소한의 준비는 필요해요.",
        tips: ["자동 이체로 강제 저축", "소비 우선순위 정하기", "투자를 소비의 일종으로 생각"]
    },
    "안정형": {
        name: "안전 제일주의자",
        icon: "🏦",
        description: "안전하고 확실한 것을 선호하는 당신! 리스크보다는 안정성을 중시하며 보수적인 투자를 선호해요.",
        strengths: ["안정적 자산 보존", "리스크 관리", "꾸준한 저축"],
        weaknesses: ["낮은 수익률", "인플레이션 리스크"],
        advice: "안전성도 중요하지만, 적절한 투자로 인플레이션을 이겨내는 것도 필요해요.",
        tips: ["안전한 펀드부터 시작", "목돈 마련 후 부동산 투자", "정기적인 투자 교육"]
    },
    "신중형": {
        name: "신중한 투자자",
        icon: "🤔",
        description: "신중하고 꼼꼼한 당신! 충분한 검토와 분석을 통해 현명한 투자 결정을 내리는 타입이에요.",
        strengths: ["철저한 분석", "리스크 관리", "현명한 판단"],
        weaknesses: ["기회 놓칠 수 있음", "과도한 분석"],
        advice: "분석도 중요하지만, 때로는 과감한 결정도 필요해요.",
        tips: ["분석과 실행의 균형", "소액부터 시작", "경험을 통한 학습"]
    }
};

// 실시간 카운터 애니메이션
function animateLiveCounter() {
    const counter = document.getElementById('liveCount');
    if (!counter) return;
    
    let count = 1200;
    const increment = () => {
        count += Math.floor(Math.random() * 3) + 1;
        counter.textContent = count.toLocaleString();
    };
    
    // 초기값 설정
    counter.textContent = count.toLocaleString();
    
    // 10초마다 증가
    setInterval(increment, 10000);
}

// 테스트 시작 함수
function startTest() {
    console.log('테스트 시작');
    
    // 상단 광고 로드
    adManager.observe('adTop');
    
    // 페이지 전환
    document.getElementById('startPage').classList.add('hidden');
    document.getElementById('questionPage').classList.remove('hidden');
    
    // 첫 번째 질문 로드
    currentQuestion = 0;
    moneyScores = {};
    answers = [];
    
    loadQuestion();
}

// 질문 로드 함수
function loadQuestion() {
    if (currentQuestion >= questions.length) {
        showLoading();
        return;
    }
    
    const question = questions[currentQuestion];
    
    // 진행률 업데이트
    updateProgress();
    
    // 질문 텍스트 설정
    document.querySelector('.question-text').textContent = question.text;
    
    // 답변 버튼 생성
    const answersGrid = document.querySelector('.answers-grid');
    answersGrid.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer.text;
        button.onclick = () => selectAnswer(answer);
        answersGrid.appendChild(button);
    });
    
    // 3번째 질문 후 중간 광고 표시
    if (currentQuestion === 2) {
        adManager.showMidAd();
    }
}

// 답변 선택 함수
function selectAnswer(answer) {
    // 답변 저장
    answers.push(answer);
    
    // 점수 계산
    if (!moneyScores[answer.type]) {
        moneyScores[answer.type] = 0;
    }
    moneyScores[answer.type] += answer.score;
    
    // 다음 질문으로
    currentQuestion++;
    
    // 버튼 클릭 효과
    event.target.style.transform = 'scale(0.95)';
    setTimeout(() => {
        loadQuestion();
    }, 200);
}

// 진행률 업데이트
function updateProgress() {
    const progress = (currentQuestion / questions.length) * 100;
    document.querySelector('.progress-fill').style.width = `${progress}%`;
    document.querySelector('.question-counter').textContent = `${currentQuestion + 1} / ${questions.length}`;
}

// 로딩 페이지 표시
function showLoading() {
    document.getElementById('questionPage').classList.add('hidden');
    document.getElementById('loadingPage').classList.remove('hidden');
    
    // 로딩 애니메이션
    let step = 0;
    const steps = document.querySelectorAll('.loading-steps .step');
    const progressBar = document.querySelector('.loading-progress');
    
    const interval = setInterval(() => {
        if (step < steps.length) {
            steps[step].classList.add('active');
            step++;
            progressBar.style.width = `${(step / steps.length) * 100}%`;
        } else {
            clearInterval(interval);
            setTimeout(showResult, 1000);
        }
    }, 800);
}

// 결과 표시
function showResult() {
    // 최고 점수 유형 찾기
    let maxScore = 0;
    let resultType = "절약형";
    
    for (const [type, score] of Object.entries(moneyScores)) {
        if (score > maxScore) {
            maxScore = score;
            resultType = type;
        }
    }
    
    const result = moneyTypes[resultType];
    
    // 페이지 전환
    document.getElementById('loadingPage').classList.add('hidden');
    document.getElementById('resultPage').classList.remove('hidden');
    
    // 결과 광고 로드
    adManager.observe('adResult');
    
    // 결과 내용 설정
    document.getElementById('resultBadge').textContent = result.icon;
    document.getElementById('resultTitle').textContent = result.name;
    document.getElementById('resultSubtitle').textContent = result.description;
    
    // 상세 분석 설정
    document.getElementById('primaryMoney').innerHTML = `
        <div class="score-icon">${result.icon}</div>
        <div class="score-text">${result.name}</div>
    `;
    
    // 조언 설정
    document.getElementById('adviceContent').textContent = result.advice;
    
    // 팁 설정
    const tipsGrid = document.getElementById('tipsGrid');
    tipsGrid.innerHTML = '';
    result.tips.forEach(tip => {
        const tipElement = document.createElement('div');
        tipElement.className = 'tip-item';
        tipElement.innerHTML = `<div class="tip-icon">💡</div><div class="tip-text">${tip}</div>`;
        tipsGrid.appendChild(tipElement);
    });
    
    // 차트 생성 (간단한 막대그래프)
    createChart(moneyScores);
}

// 차트 생성 함수
function createChart(scores) {
    const chartContainer = document.getElementById('moneyChart');
    chartContainer.innerHTML = '';
    
    const maxScore = Math.max(...Object.values(scores));
    
    for (const [type, score] of Object.entries(scores)) {
        const percentage = (score / maxScore) * 100;
        
        const chartItem = document.createElement('div');
        chartItem.className = 'chart-item';
        chartItem.innerHTML = `
            <div class="chart-label">${type}</div>
            <div class="chart-bar">
                <div class="chart-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="chart-value">${score}점</div>
        `;
        chartContainer.appendChild(chartItem);
    }
}

// 카카오톡 공유
function shareToKakao() {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
        initKakao();
    }
    
    const currentUrl = window.location.href;
    const resultType = Object.keys(moneyScores).reduce((a, b) => moneyScores[a] > moneyScores[b] ? a : b);
    const result = moneyTypes[resultType];
    
    window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: `나의 돈 관리 성향: ${result.name} ${result.icon}`,
            description: `${result.description}\n\n나도 내 재테크 성향을 알아보자!`,
            imageUrl: 'https://sd2624.github.io/돈/재테크.png',
            link: {
                mobileWebUrl: currentUrl,
                webUrl: currentUrl
            }
        },
        buttons: [
            {
                title: '나도 테스트하기',
                link: {
                    mobileWebUrl: currentUrl,
                    webUrl: currentUrl
                }
            }
        ]
    });
}

// URL 공유
function shareUrl() {
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: '나의 돈 관리 성향 테스트',
            text: '내 재테크 성향을 알아보세요!',
            url: url
        });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            alert('링크가 복사되었습니다!');
        });
    } else {
        // 폴백: 수동 복사
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('링크가 복사되었습니다!');
    }
}

// 테스트 다시하기
function retryTest() {
    // 초기화
    currentQuestion = 0;
    moneyScores = {};
    answers = [];
    
    // 페이지 전환
    document.getElementById('resultPage').classList.add('hidden');
    document.getElementById('startPage').classList.remove('hidden');
    
    // 스크롤 맨 위로
    window.scrollTo(0, 0);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('페이지 로드 완료');
    
    // 카카오 SDK 초기화
    initKakao();
    
    // 광고 관리자 초기화
    adManager.init();
    
    // 실시간 카운터 애니메이션 시작
    animateLiveCounter();
    
    // 상단 광고 즉시 로드
    adManager.observe('adTop');
});
