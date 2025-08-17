// 카카오 SDK 초기화
function initKakao() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('3413c1beb87e9b2f3b7fce37dde67b4d');
        console.log('카카오 SDK 초기화 완료');
    }
}

// 감정 테스트 전역 변수
let currentQuestion = 0;
let emotionScores = {};
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

// 20개 질문 데이터
const questions = [
    {
        text: "아침에 눈을 떴을 때 당신의 첫 번째 기분은?",
        answers: [
            { text: "상쾌하고 활기찬 기분", emotion: "기쁨", score: 3 },
            { text: "평범하고 차분한 상태", emotion: "평온", score: 2 },
            { text: "피곤하고 무거운 느낌", emotion: "슬픔", score: 3 },
            { text: "걱정이나 불안한 마음", emotion: "불안", score: 3 }
        ]
    },
    {
        text: "친구와 갈등이 생겼을 때 당신의 반응은?",
        answers: [
            { text: "화가 나서 감정을 표출한다", emotion: "분노", score: 3 },
            { text: "마음이 아파서 눈물이 난다", emotion: "슬픔", score: 3 },
            { text: "차분하게 대화로 해결하려 한다", emotion: "평온", score: 3 },
            { text: "혹시 내 잘못인가 걱정된다", emotion: "불안", score: 2 }
        ]
    },
    {
        text: "새로운 도전 앞에서 당신의 마음은?",
        answers: [
            { text: "설레고 기대된다", emotion: "기쁨", score: 2 },
            { text: "호기심과 관심이 생긴다", emotion: "흥미", score: 3 },
            { text: "실패할까봐 두렵다", emotion: "불안", score: 3 },
            { text: "신중하게 준비하고 싶다", emotion: "평온", score: 2 }
        ]
    },
    {
        text: "좋아하는 사람을 생각할 때 드는 감정은?",
        answers: [
            { text: "따뜻하고 행복한 마음", emotion: "사랑", score: 3 },
            { text: "설레고 즐거운 기분", emotion: "기쁨", score: 3 },
            { text: "다른 사람과 비교하며 질투심", emotion: "질투", score: 3 },
            { text: "혹시 상처받을까 걱정", emotion: "불안", score: 2 }
        ]
    },
    {
        text: "실패나 좌절을 경험했을 때 당신은?",
        answers: [
            { text: "분하고 화가 난다", emotion: "분노", score: 3 },
            { text: "깊은 슬픔에 빠진다", emotion: "슬픔", score: 3 },
            { text: "다시 도전할 용기를 찾는다", emotion: "기쁨", score: 2 },
            { text: "조용히 마음을 추스른다", emotion: "평온", score: 3 }
        ]
    },
    {
        text: "혼자만의 시간을 보낼 때 당신의 기분은?",
        answers: [
            { text: "편안하고 자유롭다", emotion: "평온", score: 3 },
            { text: "외롭고 쓸쓸하다", emotion: "슬픔", score: 3 },
            { text: "새로운 것을 시도하고 싶다", emotion: "흥미", score: 2 },
            { text: "누군가가 그리워진다", emotion: "사랑", score: 2 }
        ]
    },
    {
        text: "예상치 못한 좋은 일이 생겼을 때?",
        answers: [
            { text: "신나고 행복해서 소리를 지른다", emotion: "기쁨", score: 3 },
            { text: "믿을 수 없어서 당황한다", emotion: "불안", score: 2 },
            { text: "차분하게 기뻐한다", emotion: "평온", score: 2 },
            { text: "더 알아보고 싶어진다", emotion: "흥미", score: 3 }
        ]
    },
    {
        text: "다른 사람이 성공했다는 소식을 들었을 때?",
        answers: [
            { text: "진심으로 축하하고 기뻐한다", emotion: "기쁨", score: 2 },
            { text: "부럽고 질투심이 든다", emotion: "질투", score: 3 },
            { text: "나도 열심히 해야겠다고 생각한다", emotion: "흥미", score: 2 },
            { text: "왜 나는 안 될까 우울해진다", emotion: "슬픔", score: 3 }
        ]
    },
    {
        text: "스트레스를 받을 때 당신의 대처 방식은?",
        answers: [
            { text: "화를 내거나 짜증을 낸다", emotion: "분노", score: 3 },
            { text: "조용한 곳에서 혼자 있는다", emotion: "평온", score: 3 },
            { text: "누군가에게 털어놓는다", emotion: "사랑", score: 2 },
            { text: "계속 걱정하며 잠을 못 잔다", emotion: "불안", score: 3 }
        ]
    },
    {
        text: "미래를 생각할 때 당신의 마음은?",
        answers: [
            { text: "희망적이고 기대된다", emotion: "기쁨", score: 3 },
            { text: "걱정과 불안이 앞선다", emotion: "불안", score: 3 },
            { text: "차근차근 준비하면 된다", emotion: "평온", score: 3 },
            { text: "어떤 일이 있을지 궁금하다", emotion: "흥미", score: 2 }
        ]
    },
    {
        text: "사랑하는 사람과 헤어질 때 당신은?",
        answers: [
            { text: "깊은 슬픔과 그리움에 빠진다", emotion: "슬픔", score: 3 },
            { text: "화가 나고 분노한다", emotion: "분노", score: 3 },
            { text: "좋은 추억으로 간직한다", emotion: "사랑", score: 3 },
            { text: "새로운 시작이라고 생각한다", emotion: "기쁨", score: 2 }
        ]
    },
    {
        text: "갑작스러운 변화가 생겼을 때?",
        answers: [
            { text: "흥미롭고 재미있다", emotion: "흥미", score: 3 },
            { text: "불안하고 두렵다", emotion: "불안", score: 3 },
            { text: "적응하려고 노력한다", emotion: "평온", score: 2 },
            { text: "예전이 그리워진다", emotion: "슬픔", score: 2 }
        ]
    },
    {
        text: "다른 사람의 관심을 받을 때?",
        answers: [
            { text: "기쁘고 자신감이 생긴다", emotion: "기쁨", score: 3 },
            { text: "부담스럽고 피하고 싶다", emotion: "불안", score: 2 },
            { text: "자연스럽게 받아들인다", emotion: "평온", score: 2 },
            { text: "더 알고 싶어진다", emotion: "흥미", score: 2 }
        ]
    },
    {
        text: "꿈이나 목표에 대해 생각할 때?",
        answers: [
            { text: "설레고 기대된다", emotion: "기쁨", score: 3 },
            { text: "이룰 수 있을지 걱정된다", emotion: "불안", score: 3 },
            { text: "단계별로 계획을 세운다", emotion: "평온", score: 2 },
            { text: "더 많은 것을 시도해보고 싶다", emotion: "흥미", score: 3 }
        ]
    },
    {
        text: "과거의 실수를 떠올릴 때?",
        answers: [
            { text: "후회와 자책감에 빠진다", emotion: "슬픔", score: 3 },
            { text: "화가 나고 분하다", emotion: "분노", score: 2 },
            { text: "교훈으로 받아들인다", emotion: "평온", score: 3 },
            { text: "다시는 그러지 말아야겠다고 다짐한다", emotion: "불안", score: 2 }
        ]
    },
    {
        text: "가족이나 친구와 시간을 보낼 때?",
        answers: [
            { text: "따뜻하고 행복하다", emotion: "사랑", score: 3 },
            { text: "편안하고 자연스럽다", emotion: "평온", score: 3 },
            { text: "재미있고 즐겁다", emotion: "기쁨", score: 3 },
            { text: "때로는 혼자 있고 싶어진다", emotion: "슬픔", score: 2 }
        ]
    },
    {
        text: "새로운 사람을 만날 때 당신의 첫 느낌은?",
        answers: [
            { text: "설레고 기대된다", emotion: "기쁨", score: 2 },
            { text: "호기심이 생긴다", emotion: "흥미", score: 3 },
            { text: "긴장되고 불안하다", emotion: "불안", score: 3 },
            { text: "조심스럽게 접근한다", emotion: "평온", score: 2 }
        ]
    },
    {
        text: "자신의 외모나 능력에 대해 생각할 때?",
        answers: [
            { text: "만족하고 자신감이 있다", emotion: "기쁨", score: 3 },
            { text: "부족한 점이 걱정된다", emotion: "불안", score: 3 },
            { text: "다른 사람과 비교하며 질투난다", emotion: "질투", score: 3 },
            { text: "있는 그대로 받아들인다", emotion: "평온", score: 3 }
        ]
    },
    {
        text: "날씨가 좋은 날 창밖을 바라볼 때?",
        answers: [
            { text: "기분이 좋아지고 활력이 생긴다", emotion: "기쁨", score: 3 },
            { text: "평화롭고 고요한 마음이 든다", emotion: "평온", score: 3 },
            { text: "밖으로 나가고 싶어진다", emotion: "흥미", score: 2 },
            { text: "누군가와 함께 있고 싶다", emotion: "사랑", score: 2 }
        ]
    },
];

// 감정별 상세 분석 데이터
const emotionAnalysis = {
    '기쁨': {
        title: '행복한 낙천주의자',
        subtitle: '긍정적 에너지의 소유자',
        description: '당신은 삶의 밝은 면을 보는 능력이 뛰어나며, 주변 사람들에게 긍정적인 영향을 주는 사람입니다.',
        badge: '😊',
        color: '#FFD700',
        tips: ['감정 일기 쓰기', '감사 표현하기', '운동으로 에너지 발산'],
        advice: '긍정적인 마음을 유지하되, 때로는 현실적인 시각도 필요합니다.'
    },
    '슬픔': {
        title: '깊은 감정의 탐구자',
        subtitle: '섬세하고 공감능력이 뛰어난',
        description: '당신은 감정의 깊이를 이해하고, 타인의 마음을 잘 헤아리는 섬세한 감성의 소유자입니다.',
        badge: '😔',
        color: '#4682B4',
        tips: ['명상과 휴식', '좋아하는 음악 듣기', '신뢰하는 사람과 대화'],
        advice: '슬픔도 소중한 감정입니다. 충분히 느끼되 너무 오래 머물지는 마세요.'
    },
    '분노': {
        title: '열정적인 개혁가',
        subtitle: '정의감이 강한 실행력의 소유자',
        description: '당신은 옳지 않은 것에 대한 분노를 통해 변화를 이끌어내는 강한 의지력을 가지고 있습니다.',
        badge: '😤',
        color: '#DC143C',
        tips: ['심호흡과 진정', '운동으로 스트레스 해소', '건설적인 표현 방법 찾기'],
        advice: '분노는 변화의 동력이 될 수 있습니다. 건설적으로 활용해보세요.'
    },
    '불안': {
        title: '신중한 계획가',
        subtitle: '위험을 미리 감지하는 현명한',
        description: '당신은 미래를 준비하고 위험을 미리 감지하는 뛰어난 예측 능력을 가지고 있습니다.',
        badge: '😰',
        color: '#9370DB',
        tips: ['규칙적인 생활 패턴', '점진적 도전', '안정감 주는 활동'],
        advice: '불안은 당신을 보호하는 신호입니다. 적절한 수준에서 관리해보세요.'
    },
    '평온': {
        title: '지혜로운 중재자',
        subtitle: '균형감각이 뛰어난 안정된',
        description: '당신은 어떤 상황에서도 중심을 잃지 않는 안정된 마음의 소유자입니다.',
        badge: '😌',
        color: '#20B2AA',
        tips: ['명상과 요가', '자연과의 교감', '꾸준한 자기계발'],
        advice: '당신의 평온함이 주변에 좋은 영향을 줍니다. 이를 더욱 발전시켜보세요.'
    },
    '흥미': {
        title: '호기심 많은 탐험가',
        subtitle: '새로운 것을 추구하는 모험가',
        description: '당신은 끊임없는 호기심으로 세상을 탐험하며 새로운 가능성을 찾아내는 사람입니다.',
        badge: '🤔',
        color: '#FF6347',
        tips: ['새로운 취미 시작', '독서와 학습', '다양한 경험 쌓기'],
        advice: '호기심을 바탕으로 한 지속적인 학습이 당신의 강점입니다.'
    },
    '사랑': {
        title: '따뜻한 마음의 치유자',
        subtitle: '깊은 애정으로 세상을 포용하는',
        description: '당신은 타인에 대한 깊은 사랑과 이해로 주변 사람들에게 위로가 되는 존재입니다.',
        badge: '❤️',
        color: '#FF1493',
        tips: ['사랑하는 사람들과 시간 보내기', '봉사활동 참여', '감정 표현하기'],
        advice: '사랑은 나누면 나눌수록 커집니다. 당신의 따뜻함을 더 많이 나누어보세요.'
    },
    '질투': {
        title: '경쟁심 강한 성취자',
        subtitle: '목표 지향적이고 발전욕구가 강한',
        description: '당신은 다른 사람과의 비교를 통해 더 나은 자신이 되려는 강한 동기를 가지고 있습니다.',
        badge: '😒',
        color: '#228B22',
        tips: ['자신만의 목표 설정', '개인적 성취에 집중', '감사한 것들 되돌아보기'],
        advice: '질투심을 발전의 원동력으로 바꾸어 건설적으로 활용해보세요.'
    }
};

// 감정 목록
const emotions = ['기쁨', '슬픔', '분노', '불안', '평온', '흥미', '사랑', '질투'];

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 광고 관리자 초기화
    adManager.init();
    
    // 상단 광고 관찰 시작
    adManager.observe('adTop');
    
    // 감정 점수 초기화
    emotions.forEach(emotion => {
        emotionScores[emotion] = 0;
    });
    
    // 통계 업데이트
    updateStats();
    
    // 긴급성 메시지 업데이트
    updateUrgencyMessage();
});

// 테스트 시작 함수
function startTest() {
    console.log('startTest 함수 실행됨');
    
    const startPage = document.getElementById('startPage');
    const questionPage = document.getElementById('questionPage');
    
    if (!startPage || !questionPage) {
        console.error('필요한 페이지 요소를 찾을 수 없습니다');
        return;
    }
    
    startPage.classList.add('hidden');
    questionPage.classList.remove('hidden');
    showQuestion();
}

// 질문 표시 함수
function showQuestion() {
    const question = questions[currentQuestion];
    
    // 질문 텍스트 업데이트
    document.querySelector('.question-text').textContent = question.text;
    document.querySelector('.question-counter').textContent = `${currentQuestion + 1} / ${questions.length}`;
    
    // 진행률 바 업데이트
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.querySelector('.progress-fill').style.width = `${progress}%`;
    
    // 답변 옵션 생성
    const answersGrid = document.querySelector('.answers-grid');
    answersGrid.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const answerBtn = document.createElement('button');
        answerBtn.className = 'answer-btn';
        answerBtn.innerHTML = `
            <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
            <span class="answer-text">${answer.text}</span>
        `;
        answerBtn.onclick = () => selectAnswer(answer);
        answersGrid.appendChild(answerBtn);
    });
    
    // 3번째 질문 후 중간 광고 표시
    if (currentQuestion === 3) {
        adManager.showMidAd();
    }
}

// 답변 선택 함수
function selectAnswer(answer) {
    // 선택된 답변 저장 (안전한 방식으로 초기화)
    if (!emotionScores[answer.emotion]) {
        emotionScores[answer.emotion] = 0;
    }
    emotionScores[answer.emotion] += answer.score;
    
    // 답변 버튼 애니메이션
    event.target.classList.add('selected');
    
    setTimeout(() => {
        currentQuestion++;
        
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showLoading();
        }
    }, 500);
}

// 로딩 화면 표시
function showLoading() {
    document.getElementById('questionPage').classList.add('hidden');
    document.getElementById('loadingPage').classList.remove('hidden');
    
    // 로딩 애니메이션
    let currentStep = 0;
    const steps = document.querySelectorAll('.loading-steps .step');
    const progressBar = document.querySelector('.loading-progress');
    
    const loadingInterval = setInterval(() => {
        if (currentStep < steps.length) {
            steps.forEach(step => step.classList.remove('active'));
            steps[currentStep].classList.add('active');
            
            const progress = ((currentStep + 1) / steps.length) * 100;
            progressBar.style.width = `${progress}%`;
            
            currentStep++;
        } else {
            clearInterval(loadingInterval);
            showResult();
        }
    }, 800);
}

// 결과 표시 함수
function showResult() {
    document.getElementById('loadingPage').classList.add('hidden');
    document.getElementById('resultPage').classList.remove('hidden');
    
    // 가장 높은 점수의 감정 찾기
    const maxEmotion = Object.keys(emotionScores).reduce((a, b) => 
        emotionScores[a] > emotionScores[b] ? a : b
    );
    
    const analysis = emotionAnalysis[maxEmotion];
    
    // 결과 정보 업데이트
    document.getElementById('resultBadge').textContent = analysis.badge;
    document.getElementById('resultTitle').textContent = analysis.title;
    document.getElementById('resultSubtitle').textContent = analysis.subtitle;
    
    // 상세 분석 업데이트
    document.getElementById('primaryEmotion').innerHTML = `
        <div class="emotion-name">${maxEmotion}</div>
        <div class="emotion-percentage">${Math.round((emotionScores[maxEmotion] / getTotalScore()) * 100)}%</div>
    `;
    
    // 숨겨진 감정 (두 번째로 높은 점수)
    const sortedEmotions = Object.keys(emotionScores).sort((a, b) => emotionScores[b] - emotionScores[a]);
    const secondEmotion = sortedEmotions[1];
    document.getElementById('hiddenEmotion').innerHTML = `
        <div class="emotion-name">${secondEmotion}</div>
        <div class="emotion-percentage">${Math.round((emotionScores[secondEmotion] / getTotalScore()) * 100)}%</div>
    `;
    
    // 조언 내용 업데이트
    document.getElementById('adviceContent').textContent = analysis.advice;
    
    // 개선 팁 업데이트
    const tipsGrid = document.getElementById('tipsGrid');
    tipsGrid.innerHTML = '';
    analysis.tips.forEach(tip => {
        const tipElement = document.createElement('div');
        tipElement.className = 'tip-item';
        tipElement.textContent = tip;
        tipsGrid.appendChild(tipElement);
    });
    
    // 감정 차트 그리기
    drawEmotionChart();
    
    // 결과 광고 관찰 시작
    adManager.observe('adResult');
}

// 감정 차트 그리기 함수
function drawEmotionChart() {
    const chartContainer = document.getElementById('emotionChart');
    
    // 차트 데이터 준비
    const chartData = emotions.map(emotion => ({
        name: emotion,
        value: emotionScores[emotion],
        percentage: Math.round((emotionScores[emotion] / getTotalScore()) * 100)
    })).sort((a, b) => b.value - a.value);
    
    // 차트 HTML 생성
    chartContainer.innerHTML = `
        <div class="chart-legend">
            ${chartData.map(item => `
                <div class="legend-item">
                    <div class="legend-color" style="background: ${getEmotionColor(item.name)}"></div>
                    <span class="legend-name">${item.name}</span>
                    <span class="legend-percentage">${item.percentage}%</span>
                </div>
            `).join('')}
        </div>
        <div class="chart-visual">
            ${chartData.map(item => `
                <div class="chart-bar">
                    <div class="bar-fill" style="width: ${item.percentage}%; background: ${getEmotionColor(item.name)}"></div>
                    <span class="bar-label">${item.name} ${item.percentage}%</span>
                </div>
            `).join('')}
        </div>
    `;
}

// 감정별 색상 반환
function getEmotionColor(emotion) {
    const colors = {
        '기쁨': '#FFD700',
        '슬픔': '#4682B4',
        '분노': '#DC143C',
        '불안': '#9370DB',
        '평온': '#20B2AA',
        '흥미': '#FF6347',
        '사랑': '#FF1493',
        '질투': '#228B22'
    };
    return colors[emotion] || '#666';
}

// 총 점수 계산
function getTotalScore() {
    return Object.values(emotionScores).reduce((sum, score) => sum + score, 0);
}

// 카카오톡 공유 함수
function shareToKakao() {
    const maxEmotion = Object.keys(emotionScores).reduce((a, b) => 
        emotionScores[a] > emotionScores[b] ? a : b
    );
    const analysis = emotionAnalysis[maxEmotion];
    
    window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: '🧠 나의 감정 분석 결과',
            description: `${analysis.title} - ${analysis.subtitle}\n\n"${analysis.description}"\n\n당신도 테스트해보세요!`,
            imageUrl: 'https://sd2624.github.io/감정/emotion-test-thumbnail.jpg',
            link: {
                mobileWebUrl: 'https://sd2624.github.io/감정/',
                webUrl: 'https://sd2624.github.io/감정/',
            },
        },
        buttons: [
            {
                title: '나도 테스트하기',
                link: {
                    mobileWebUrl: 'https://sd2624.github.io/감정/',
                    webUrl: 'https://sd2624.github.io/감정/',
                },
            }
        ]
    });
}

// 테스트 다시하기 함수
function retryTest() {
    // 변수 초기화
    currentQuestion = 0;
    loadedAds.clear();
    emotions.forEach(emotion => {
        emotionScores[emotion] = 0;
    });
    
    // 페이지 전환
    document.getElementById('resultPage').classList.add('hidden');
    document.getElementById('mainPage').classList.remove('hidden');
    
    // 광고 상태 초기화
    const midAd = document.getElementById('adMid');
    if (midAd) {
        midAd.style.display = 'none';
    }
    
    // 통계 업데이트
    updateStats();
}

// 통계 업데이트 함수
function updateStats() {
    // 랜덤 통계 생성 (실제 서비스에서는 실제 데이터 사용)
    const totalTests = Math.floor(Math.random() * 10000) + 50000;
    const todayTests = Math.floor(Math.random() * 500) + 1200;
    
    document.getElementById('totalTests').textContent = totalTests.toLocaleString();
    document.getElementById('todayTests').textContent = todayTests.toLocaleString();
}

// 긴급성 메시지 업데이트
function updateUrgencyMessage() {
    const messages = [
        "⏰ 지금 이 순간의 감정을 놓치지 마세요!",
        "🔥 오늘 하루 감정 변화의 패턴을 확인해보세요!",
        "💡 당신의 숨겨진 감정을 발견할 마지막 기회!",
        "🎯 정확한 감정 분석으로 더 나은 내일을 준비하세요!"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const urgencyElement = document.querySelector('.urgency-notice p');
    if (urgencyElement) {
        urgencyElement.textContent = randomMessage;
    }
}
    
    const [primaryEmotionKey, primaryScore] = sortedEmotions[0];
    const primaryEmotion = getEmotionType(primaryEmotionKey);
    const result = emotionResults[primaryEmotion];
    
    // 메인 결과 표시
    document.getElementById('resultBadge').textContent = result.emoji;
    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('resultSubtitle').textContent = result.subtitle;
    
    // 상세 분석 표시
    document.getElementById('primaryEmotion').textContent = 
        `${result.title}: ${Math.round(primaryScore)}점`;
    
    // 두 번째로 높은 감정
    if (sortedEmotions.length > 1) {
        const [secondEmotionKey, secondScore] = sortedEmotions[1];
        const secondEmotion = getEmotionType(secondEmotionKey);
        const secondResult = emotionResults[secondEmotion];
        document.getElementById('hiddenEmotion').textContent = 
            `${secondResult.title}: ${Math.round(secondScore)}점`;
    }
    
    // 조언 표시
    document.getElementById('adviceContent').textContent = result.advice;
    
    // 감정 관리 팁 표시
    const tipsGrid = document.getElementById('tipsGrid');
    tipsGrid.innerHTML = result.tips.map(tip => 
        `<div class="tip-item">${tip}</div>`
    ).join('');
    
    // 감정 차트 생성
    createEmotionChart(emotionScores);
    
    // 결과 광고 로드
    const resultAd = document.getElementById('adResult');
    if (resultAd) {
        adObserver.observe(resultAd);
    }
}

// 감정 분석 함수
function analyzeResults() {
    const emotionScores = {};
    
    // 모든 답변의 점수 합산
    answers.forEach(answer => {
        Object.entries(answer.score).forEach(([emotion, score]) => {
            emotionScores[emotion] = (emotionScores[emotion] || 0) + score;
        });
    });
    
    return emotionScores;
}

// 감정 타입 매핑
function getEmotionType(emotionKey) {
    const emotionMapping = {
        depression: 'depression',
        anxiety: 'anxiety', 
        stress: 'anxiety',
        happiness: 'happiness',
        joy: 'happiness',
        optimism: 'happiness',
        anger: 'anger',
        calm: 'calm',
        peace: 'calm',
        excitement: 'excitement',
        energy: 'excitement',
        enthusiasm: 'excitement',
        neutral: 'neutral',
        stability: 'neutral',
        balance: 'neutral'
    };
    
    return emotionMapping[emotionKey] || 'neutral';
}

// 감정 차트 생성
function createEmotionChart(emotionScores) {
    const chartContainer = document.getElementById('emotionChart');
    
    // 상위 5개 감정만 표시
    const topEmotions = Object.entries(emotionScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    const maxScore = Math.max(...Object.values(emotionScores));
    
    chartContainer.innerHTML = `
        <div class="emotion-bars">
            ${topEmotions.map(([emotion, score]) => {
                const percentage = (score / maxScore) * 100;
                const emotionType = getEmotionType(emotion);
                const result = emotionResults[emotionType];
                
                return `
                    <div class="emotion-bar">
                        <div class="emotion-info">
                            <span class="emotion-emoji">${result.emoji}</span>
                            <span class="emotion-name">${result.title}</span>
                            <span class="emotion-score">${Math.round(score)}점</span>
                        </div>
                        <div class="emotion-progress">
                            <div class="emotion-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
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

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 로드 완료');
    
    // 카카오 SDK 초기화
    initKakao();
    
    // 전역 함수 노출 (onclick에서 사용하기 위해)
    window.startTest = startTest;
    window.shareToKakao = shareToKakao;
    window.retryTest = retryTest;
    
    // 시작 버튼에 이벤트 리스너 추가 (백업용)
    const startBtn = document.querySelector('.start-btn');
    const startBtnById = document.getElementById('startTestBtn');
    
    if (startBtn || startBtnById) {
        const button = startBtn || startBtnById;
        console.log('시작 버튼 찾음, 이벤트 리스너 추가');
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('시작 버튼 클릭됨');
            startTest();
        });
    } else {
        console.error('시작 버튼을 찾을 수 없습니다');
    }
    
    // 광고 관리자 초기화
    if (typeof adManager !== 'undefined') {
        adManager.init();
        adManager.observe('adTop');
    }
    
    console.log('감정 테스트 초기화 완료');
});