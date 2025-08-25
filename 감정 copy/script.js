// Kakao SDK initialization
function initKakao() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('3413c1beb87e9b2f3b7fce37dde67b4d');
        console.log('Kakao SDK initialized');
    }
}

// Emotion test global variables
let currentQuestion = 0;
let emotionScores = {};
let answers = []; // Answer storage array
let loadedAds = new Set(); // Prevent duplicate ad loading

// Ad management object - using IntersectionObserver
const adManager = {
    observer: null,
    
    // Initialize ad manager
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const adContainer = entry.target;
                    const adId = adContainer.id;
                    
                    // Prevent duplicate loading
                    if (!loadedAds.has(adId)) {
                        this.loadAd(adId);
                        loadedAds.add(adId);
                        this.observer.unobserve(adContainer); // Load only once
                    }
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px' 
        });
    },
    
    // Start observing ad container
    observe(adId) {
        const adElement = document.getElementById(adId);
        if (adElement && this.observer) {
            this.observer.observe(adElement);
        }
    },
    
    // Execute ad loading (optimized for small size)
    loadAd(adId) {
        try {
            const adElement = document.getElementById(adId);
            if (adElement && typeof (adsbygoogle) !== 'undefined') {
                // Mobile/PC ad optimization (small size)
                if (window.innerWidth <= 768) {
                    // Mobile: very small
                    adElement.style.minHeight = '60px';
                    adElement.style.maxHeight = '80px';
                    adElement.style.border = '1px solid rgba(102, 126, 234, 0.2)';
                    adElement.style.borderRadius = '6px';
                    adElement.style.padding = '5px';
                    adElement.style.margin = '5px 0';
                } else {
                    // PC: slightly larger
                    adElement.style.minHeight = '80px';
                    adElement.style.maxHeight = '120px';
                    adElement.style.padding = '8px';
                    adElement.style.margin = '8px 0';
                }
                
                (adsbygoogle = window.adsbygoogle || []).push({});
                console.log(`Ad loaded (optimized): ${adId}`);
            }
        } catch (error) {
            console.error(`Ad loading failed: ${adId}`, error);
        }
    },
    
    // Show middle ad (after 3rd question) - small size
    showMidAd() {
        const midAd = document.getElementById('adMid');
        if (midAd) {
            midAd.style.display = 'block';
            // Minimize space between question and answer
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
        text: "아침에 일어났을 때 첫 번째로 드는 기분은?",
        answers: [
            { text: "상쾌하고 활기찬 기분", emotion: "기쁨", score: 3 },
            { text: "평범하고 차분한 기분", emotion: "평화", score: 2 },
            { text: "피곤하고 무거운 기분", emotion: "슬픔", score: 3 },
            { text: "걱정이나 불안한 기분", emotion: "불안", score: 3 }
        ]
    },
    {
        text: "친구와 갈등이 생겼을 때 어떻게 반응하나요?",
        answers: [
            { text: "화가 나서 감정을 표출한다", emotion: "분노", score: 3 },
            { text: "상처받아서 눈물이 난다", emotion: "슬픔", score: 3 },
            { text: "대화를 통해 차분히 해결하려 한다", emotion: "평화", score: 3 },
            { text: "내가 잘못한 건 아닌지 걱정한다", emotion: "불안", score: 2 }
        ]
    },
    {
        text: "새로운 도전에 직면했을 때 어떤 기분이 드나요?",
        answers: [
            { text: "설레고 기대가 된다", emotion: "기쁨", score: 2 },
            { text: "호기심이 생기고 흥미롭다", emotion: "흥미", score: 3 },
            { text: "실패할까봐 두렵다", emotion: "불안", score: 3 },
            { text: "신중하게 준비하고 싶다", emotion: "평화", score: 2 }
        ]
    },
    {
        text: "좋아하는 사람을 생각할 때 어떤 감정이 올라오나요?",
        answers: [
            { text: "따뜻하고 행복한 감정", emotion: "사랑", score: 3 },
            { text: "설레고 즐거운 기분", emotion: "기쁨", score: 3 },
            { text: "다른 사람과 비교하며 질투", emotion: "질투", score: 3 },
            { text: "상처받을까봐 걱정", emotion: "불안", score: 2 }
        ]
    },
    {
        text: "실패나 좌절을 경험했을 때 당신은?",
        answers: [
            { text: "분하고 화가 난다", emotion: "분노", score: 3 },
            { text: "깊은 슬픔에 빠진다", emotion: "슬픔", score: 3 },
            { text: "다시 도전할 용기를 찾는다", emotion: "기쁨", score: 2 },
            { text: "조용히 마음을 다잡는다", emotion: "평화", score: 3 }
        ]
    },
    {
        text: "혼자만의 시간을 보낼 때 어떤 기분이 드나요?",
        answers: [
            { text: "편안하고 자유롭다", emotion: "평화", score: 3 },
            { text: "외롭고 쓸쓸하다", emotion: "슬픔", score: 3 },
            { text: "새로운 것을 시도해보고 싶다", emotion: "흥미", score: 2 },
            { text: "누군가가 그립다", emotion: "사랑", score: 2 }
        ]
    },
    {
        text: "예상치 못하게 좋은 일이 생겼을 때?",
        answers: [
            { text: "신나서 행복하고 소리치고 싶다", emotion: "기쁨", score: 3 },
            { text: "믿기지 않아서 당황스럽다", emotion: "불안", score: 2 },
            { text: "차분하게 기쁨을 느낀다", emotion: "평화", score: 2 },
            { text: "더 자세히 알고 싶어진다", emotion: "흥미", score: 3 }
        ]
    },
    {
        text: "다른 사람의 성공 소식을 들었을 때?",
        answers: [
            { text: "진심으로 축하하고 기뻐한다", emotion: "기쁨", score: 2 },
            { text: "부럽고 질투가 난다", emotion: "질투", score: 3 },
            { text: "나도 더 열심히 해야겠다고 생각한다", emotion: "흥미", score: 2 },
            { text: "왜 나는 안 될까 하며 우울해진다", emotion: "슬픔", score: 3 }
        ]
    },
    {
        text: "스트레스를 받을 때 어떻게 대처하나요?",
        answers: [
            { text: "화를 내거나 짜증을 낸다", emotion: "분노", score: 3 },
            { text: "조용한 곳에서 혼자 있는다", emotion: "평화", score: 3 },
            { text: "누군가에게 이야기한다", emotion: "사랑", score: 2 },
            { text: "계속 걱정하며 잠을 못 잔다", emotion: "불안", score: 3 }
        ]
    },
    {
        text: "미래를 생각할 때 어떤 감정이 드나요?",
        answers: [
            { text: "희망적이고 설렌다", emotion: "기쁨", score: 3 },
            { text: "걱정되고 불안하다", emotion: "불안", score: 3 },
            { text: "차근차근 준비해 나간다", emotion: "평화", score: 3 },
            { text: "어떻게 될지 궁금하다", emotion: "흥미", score: 2 }
        ]
    },
    {
        text: "사랑하는 사람과 이별해야 할 때?",
        answers: [
            { text: "깊은 슬픔과 그리움에 빠진다", emotion: "슬픔", score: 3 },
            { text: "화가 나고 분하다", emotion: "분노", score: 3 },
            { text: "좋은 추억으로 간직한다", emotion: "사랑", score: 3 },
            { text: "새로운 시작이라고 생각한다", emotion: "기쁨", score: 2 }
        ]
    },
    {
        text: "갑작스러운 변화가 생겼을 때?",
        answers: [
            { text: "흥미롭고 재미있다", emotion: "흥미", score: 3 },
            { text: "불안하고 무섭다", emotion: "불안", score: 3 },
            { text: "적응하려고 노력한다", emotion: "평화", score: 2 },
            { text: "예전이 그립다", emotion: "슬픔", score: 2 }
        ]
    },
    {
        text: "다른 사람들의 관심을 받을 때?",
        answers: [
            { text: "기쁘고 자신감이 생긴다", emotion: "기쁨", score: 3 },
            { text: "부담스러워서 피하고 싶다", emotion: "불안", score: 2 },
            { text: "자연스럽게 받아들인다", emotion: "평화", score: 2 },
            { text: "더 알고 싶어진다", emotion: "흥미", score: 2 }
        ]
    },
    {
        text: "꿈이나 목표를 생각할 때?",
        answers: [
            { text: "설레고 기대가 된다", emotion: "기쁨", score: 3 },
            { text: "이룰 수 있을지 걱정된다", emotion: "불안", score: 3 },
            { text: "단계적으로 계획을 세운다", emotion: "평화", score: 2 },
            { text: "많은 것을 시도해보고 싶다", emotion: "흥미", score: 3 }
        ]
    },
    {
        text: "과거의 실수를 떠올릴 때?",
        answers: [
            { text: "후회와 자책에 빠진다", emotion: "슬픔", score: 3 },
            { text: "화가 나고 분하다", emotion: "분노", score: 2 },
            { text: "교훈으로 받아들인다", emotion: "평화", score: 3 },
            { text: "다시는 그러지 않겠다고 다짐한다", emotion: "불안", score: 2 }
        ]
    },
    {
        text: "가족이나 친구들과 시간을 보낼 때?",
        answers: [
            { text: "따뜻하고 행복하다", emotion: "사랑", score: 3 },
            { text: "편안하고 자연스럽다", emotion: "평화", score: 3 },
            { text: "재미있고 즐겁다", emotion: "기쁨", score: 3 },
            { text: "가끔 혼자 있고 싶다", emotion: "슬픔", score: 2 }
        ]
    },
    {
        text: "새로운 사람을 만날 때 첫 번째 감정은?",
        answers: [
            { text: "설레고 기대가 된다", emotion: "기쁨", score: 2 },
            { text: "궁금하다", emotion: "흥미", score: 3 },
            { text: "긴장되고 불안하다", emotion: "불안", score: 3 },
            { text: "조심스럽게 접근한다", emotion: "평화", score: 2 }
        ]
    },
    {
        text: "자신의 외모나 능력에 대해 생각할 때?",
        answers: [
            { text: "만족스럽고 자신있다", emotion: "기쁨", score: 3 },
            { text: "부족한 점이 걱정된다", emotion: "불안", score: 3 },
            { text: "다른 사람과 비교하며 질투난다", emotion: "질투", score: 3 },
            { text: "있는 그대로 받아들인다", emotion: "평화", score: 3 }
        ]
    },
    {
        text: "맑은 날 창밖을 바라볼 때?",
        answers: [
            { text: "기분이 좋고 활기찬다", emotion: "기쁨", score: 3 },
            { text: "평화롭고 고요하다", emotion: "평화", score: 3 },
            { text: "밖으로 나가고 싶다", emotion: "흥미", score: 2 },
            { text: "누군가와 함께 있고 싶다", emotion: "사랑", score: 2 }
        ]
    },
];

// 상세한 감정 분석 데이터
const emotionAnalysis = {
    '기쁨': {
        title: '행복한 낙관주의자',
        subtitle: '긍정 에너지의 소유자',
        description: '당신은 삶의 밝은 면을 바라보는 탁월한 능력을 가지고 있으며, 주변 사람들에게 긍정적인 영향을 미칩니다.',
        badge: '😊',
        color: '#FFD700',
        tips: ['감정 일기 쓰기', '감사 표현하기', '운동으로 에너지 발산'],
        advice: '긍정적인 마음가짐을 유지하되, 때로는 현실적인 시각도 필요해요.'
    },
    '슬픔': {
        title: '깊은 감정 탐험가',
        subtitle: '뛰어난 공감 능력을 가진 예민한 감성',
        description: '당신은 감정의 깊이를 이해하며, 타인의 마음을 잘 헤아리는 섬세한 감정의 소유자입니다.',
        badge: '😔',
        color: '#4682B4',
        tips: ['명상과 휴식', '좋아하는 음악 듣기', '신뢰하는 사람과 대화'],
        advice: '슬픔도 소중한 감정이에요. 충분히 느끼되 너무 오래 머물지는 마세요.'
    },
    '분노': {
        title: '열정적인 개혁가',
        subtitle: '정의감이 강한 의지력의 소유자',
        description: '당신은 옳지 않은 것에 대한 분노를 통해 변화를 이끌어내는 강한 의지력을 가지고 있습니다.',
        badge: '😤',
        color: '#DC143C',
        tips: ['심호흡으로 진정하기', '운동으로 스트레스 해소', '건설적인 표현 방법 찾기'],
        advice: '분노는 변화의 원동력이 될 수 있어요. 건설적으로 활용해보세요.'
    },
    '불안': {
        title: '신중한 계획가',
        subtitle: '위험을 미리 감지하는 지혜로운 사람',
        description: '당신은 미래를 준비하고 위험을 미리 감지하는 뛰어난 예측 능력을 가지고 있습니다.',
        badge: '😰',
        color: '#9370DB',
        tips: ['규칙적인 생활 패턴', '점진적인 도전', '안정감을 주는 활동'],
        advice: '불안은 당신을 보호하는 신호예요. 적정 수준에서 관리해보세요.'
    },
    '평화': {
        title: '지혜로운 중재자',
        subtitle: '뛰어난 균형감각을 가진 안정된 사람',
        description: '당신은 어떤 상황에서도 중심을 잃지 않는 안정된 마음의 소유자입니다.',
        badge: '😌',
        color: '#20B2AA',
        tips: ['명상과 요가', '자연과의 교감', '꾸준한 자기계발'],
        advice: '당신의 평화로움은 주변에 좋은 영향을 줘요. 더욱 발전시켜보세요.'
    },
    '흥미': {
        title: '호기심 많은 탐험가',
        subtitle: '새로운 것을 추구하는 모험가',
        description: '당신은 끝없는 호기심으로 세상을 탐험하며 새로운 가능성을 찾아내는 사람입니다.',
        badge: '🤔',
        color: '#FF6347',
        tips: ['새로운 취미 시작', '독서와 학습', '다양한 경험 쌓기'],
        advice: '호기심을 바탕으로 한 지속적인 학습이 당신의 강점이에요.'
    },
    '사랑': {
        title: '따뜻한 마음의 치유자',
        subtitle: '깊은 애정으로 세상을 포용하는 사람',
        description: '당신은 타인에 대한 깊은 사랑과 이해로 주변 사람들을 위로하는 존재입니다.',
        badge: '❤️',
        color: '#FF1493',
        tips: ['사랑하는 사람과 시간 보내기', '봉사활동 참여', '감정 표현하기'],
        advice: '사랑은 나누면 나눌수록 커져요. 더 많이 나눠보세요.'
    },
    '질투': {
        title: '경쟁력 있는 성취자',
        subtitle: '발전 욕구가 강한 목표 지향적 사람',
        description: '당신은 타인과의 비교를 통해 더 나은 사람이 되려는 강한 동기를 가지고 있습니다.',
        badge: '😒',
        color: '#228B22',
        tips: ['자신만의 목표 설정', '개인적 성취에 집중', '감사할 것들 돌아보기'],
        advice: '질투를 발전의 원동력으로 건설적으로 활용해보세요.'
    }
};

// 감정 목록
const emotions = ['기쁨', '슬픔', '분노', '불안', '평화', '흥미', '사랑', '질투'];

// Page initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize ad manager
    adManager.init();
    
    // Start observing top ad
    adManager.observe('adTop');
    
    // Initialize emotion scores
    emotions.forEach(emotion => {
        emotionScores[emotion] = 0;
    });
    
    // Update statistics
    updateStats();
    
    // Update urgency message
    updateUrgencyMessage();
});

// Test start function
function startTest() {
    console.log('startTest function executed');
    
    const startPage = document.getElementById('startPage');
    const questionPage = document.getElementById('questionPage');
    
    if (!startPage || !questionPage) {
        console.error('Cannot find required page elements');
        return;
    }
    
    startPage.classList.add('hidden');
    questionPage.classList.remove('hidden');
    showQuestion();
}

// Question display function
function showQuestion() {
    const question = questions[currentQuestion];
    
    // Update question text
    document.querySelector('.question-text').textContent = question.text;
    document.querySelector('.question-counter').textContent = `${currentQuestion + 1} / ${questions.length}`;
    
    // Update progress bar
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.querySelector('.progress-fill').style.width = `${progress}%`;
    
    // Create answer options
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
    
    // Show middle ad after 3rd question
    if (currentQuestion === 3) {
        adManager.showMidAd();
    }
}

// Answer selection function
function selectAnswer(answer) {
    // Save selected answer (safe initialization)
    if (!emotionScores[answer.emotion]) {
        emotionScores[answer.emotion] = 0;
    }
    emotionScores[answer.emotion] += answer.score;
    
    // Answer button animation
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

// Loading screen display
function showLoading() {
    document.getElementById('questionPage').classList.add('hidden');
    document.getElementById('loadingPage').classList.remove('hidden');
    
    // Loading animation
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

// Result display function
function showResult() {
    document.getElementById('loadingPage').classList.add('hidden');
    document.getElementById('resultPage').classList.remove('hidden');
    
    // Find emotion with highest score
    const maxEmotion = Object.keys(emotionScores).reduce((a, b) => 
        emotionScores[a] > emotionScores[b] ? a : b
    );
    
    const analysis = emotionAnalysis[maxEmotion];
    
    // Update result information
    document.getElementById('resultBadge').textContent = analysis.badge;
    document.getElementById('resultTitle').textContent = analysis.title;
    document.getElementById('resultSubtitle').textContent = analysis.subtitle;
    
    // Update detailed analysis
    document.getElementById('primaryEmotion').innerHTML = `
        <div class="emotion-name">${maxEmotion}</div>
        <div class="emotion-percentage">${Math.round((emotionScores[maxEmotion] / getTotalScore()) * 100)}%</div>
    `;
    
    // Hidden emotion (second highest score)
    const sortedEmotions = Object.keys(emotionScores).sort((a, b) => emotionScores[b] - emotionScores[a]);
    const secondEmotion = sortedEmotions[1];
    document.getElementById('hiddenEmotion').innerHTML = `
        <div class="emotion-name">${secondEmotion}</div>
        <div class="emotion-percentage">${Math.round((emotionScores[secondEmotion] / getTotalScore()) * 100)}%</div>
    `;
    
    // Update advice content
    document.getElementById('adviceContent').textContent = analysis.advice;
    
    // Update improvement tips
    const tipsGrid = document.getElementById('tipsGrid');
    tipsGrid.innerHTML = '';
    analysis.tips.forEach(tip => {
        const tipElement = document.createElement('div');
        tipElement.className = 'tip-item';
        tipElement.textContent = tip;
        tipsGrid.appendChild(tipElement);
    });
    
    // Draw emotion chart
    drawEmotionChart();
    
    // Start observing result ad
    adManager.observe('adResult');
}

// Emotion chart drawing function
function drawEmotionChart() {
    const chartContainer = document.getElementById('emotionChart');
    
    // Prepare chart data
    const chartData = emotions.map(emotion => ({
        name: emotion,
        value: emotionScores[emotion],
        percentage: Math.round((emotionScores[emotion] / getTotalScore()) * 100)
    })).sort((a, b) => b.value - a.value);
    
    // Generate chart HTML
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
        '평화': '#20B2AA',
        '흥미': '#FF6347',
        '사랑': '#FF1493',
        '질투': '#228B22'
    };
    return colors[emotion] || '#666';
}

// Calculate total score
function getTotalScore() {
    return Object.values(emotionScores).reduce((sum, score) => sum + score, 0);
}

// 카카오톡 공유 기능
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
                title: '테스트 하기',
                link: {
                    mobileWebUrl: 'https://sd2624.github.io/감정/',
                    webUrl: 'https://sd2624.github.io/감정/',
                },
            }
        ]
    });
}

// Retry test function
function retryTest() {
    // Initialize variables
    currentQuestion = 0;
    loadedAds.clear();
    emotions.forEach(emotion => {
        emotionScores[emotion] = 0;
    });
    
    // Page transition
    document.getElementById('resultPage').classList.add('hidden');
    document.getElementById('startPage').classList.remove('hidden');
    
    // Initialize ad state
    const midAd = document.getElementById('adMid');
    if (midAd) {
        midAd.style.display = 'none';
    }
    
    // Update statistics
    updateStats();
}

// URL share function
function shareUrl() {
    const url = window.location.href;
    
    if (navigator.clipboard && window.isSecureContext) {
        // Clipboard API 사용
        navigator.clipboard.writeText(url).then(function() {
            console.log('URL copied to clipboard successfully');
            showToast('URL이 성공적으로 복사되었습니다!');
        }, function(err) {
            console.error('Failed to copy URL: ', err);
            fallbackCopyTextToClipboard(url);
        });
    } else {
        // 구형 브라우저를 위한 대체 방법
        fallbackCopyTextToClipboard(url);
    }
}

// 텍스트 복사를 위한 대체 기능
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // 하단으로 스크롤 방지
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'URL이 성공적으로 복사되었습니다!' : 'URL 복사에 실패했습니다';
        console.log(msg);
        showToast(msg);
    } catch (err) {
        console.error('Failed to copy URL: ', err);
        showToast('복사에 실패했습니다. 수동으로 복사해주세요: ' + text);
    }
    
    document.body.removeChild(textArea);
}

// Toast message display function
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Toast styles
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 10000;
        animation: fadeInOut 3s ease-in-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    // Add animation CSS if not exists
    if (!document.querySelector('#toast-animation-style')) {
        const style = document.createElement('style');
        style.id = 'toast-animation-style';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
                15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Statistics update function
function updateStats() {
    // Generate random statistics (use actual data in real service)
    const totalTests = Math.floor(Math.random() * 10000) + 50000;
    const todayTests = Math.floor(Math.random() * 500) + 1200;
    
    const totalElement = document.getElementById('totalTests');
    const todayElement = document.getElementById('todayTests');
    
    if (totalElement) totalElement.textContent = totalTests.toLocaleString();
    if (todayElement) todayElement.textContent = todayTests.toLocaleString();
}

// 긴급성 메시지 업데이트
function updateUrgencyMessage() {
    const messages = [
        "⏰ 지금 이 순간의 감정을 놓치지 마세요!",
        "🔥 오늘 나의 감정 변화 패턴을 확인해보세요!",
        "💡 숨겨진 감정을 발견할 마지막 기회!",
        "🎯 정확한 감정 분석으로 더 나은 내일을 준비하세요!"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const urgencyElement = document.querySelector('.urgency-notice .notice-content');
    if (urgencyElement) {
        urgencyElement.textContent = randomMessage;
    }
}

// DOM load completion initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM load completed');
    
    // Initialize Kakao SDK
    initKakao();
    
    // Expose global functions (for use in onclick)
    window.startTest = startTest;
    window.shareToKakao = shareToKakao;
    window.retryTest = retryTest;
    window.shareUrl = shareUrl;
    
    // Add event listener to start button (backup)
    const startBtn = document.querySelector('.start-btn');
    const startBtnById = document.getElementById('startTestBtn');
    
    if (startBtn || startBtnById) {
        const button = startBtn || startBtnById;
        console.log('Start button found, adding event listener');
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Start button clicked');
            startTest();
        });
    } else {
        console.error('Cannot find start button');
    }
    
    // Initialize ad manager
    if (typeof adManager !== 'undefined') {
        adManager.init();
        adManager.observe('adTop');
    }
    
    console.log('Emotion test initialization completed');
});
