// Kakao SDK 초기화
function initKakao() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('3413c1beb87e9b2f3b7fce37dde67b4d');
        console.log('Kakao SDK initialized');
    }
}

// 전역 변수
let currentQuestion = 0;
let personalityScores = { agen: 0, teto: 0 };
let answers = [];
let loadedAds = new Set();
let currentStep = 1;
let currentResultStep = 1;

// 단계별 네비게이션 함수
function showNextStep(step) {
    // 모든 단계 숨기기
    for (let i = 1; i <= 4; i++) {
        const stepElement = document.getElementById(`introStep${i}`);
        if (stepElement) {
            stepElement.classList.add('hidden');
        }
    }
    
    // 선택된 단계 보이기
    const targetStep = document.getElementById(`introStep${step}`);
    if (targetStep) {
        targetStep.classList.remove('hidden');
        currentStep = step;
        
        // 스크롤을 맨 위로
        document.querySelector('.start-page').scrollTop = 0;
        window.scrollTo(0, 0);
    }
}

// 결과 페이지 단계별 네비게이션 함수
function showResultStep(step) {
    console.log('showResultStep called with step:', step);
    
    // 모든 결과 단계 숨기기
    for (let i = 1; i <= 5; i++) {
        const stepElement = document.getElementById(`resultStep${i}`);
        if (stepElement) {
            stepElement.classList.add('hidden');
        }
    }
    
    // 선택된 단계 보이기
    const targetStep = document.getElementById(`resultStep${step}`);
    if (targetStep) {
        targetStep.classList.remove('hidden');
        currentResultStep = step;
        
        console.log('Showing step:', step);
        
        // 스크롤을 맨 위로
        window.scrollTo(0, 0);
        
        // 각 단계별 광고 로드
        const adId = `adResult${step}`;
        if (adManager && adManager.observe) {
            adManager.observe(adId);
        }
    } else {
        console.error('Step element not found:', `resultStep${step}`);
    }
}

// 모바일 감지 함수
function isMobile() {
    return window.innerWidth <= 768;
}

// 페이지 로드 시 모바일이면 첫 번째 단계만 보이기
function initializeStartPage() {
    if (isMobile()) {
        // 모바일에서는 첫 번째 단계만 보이기
        showNextStep(1);
    } else {
        // 데스크톱에서는 모든 내용 보이기 (hidden 클래스 제거)
        for (let i = 1; i <= 4; i++) {
            const stepElement = document.getElementById(`introStep${i}`);
            if (stepElement) {
                stepElement.classList.remove('hidden');
            }
        }
        
        // 데스크톱에서는 step-navigation 숨기기
        const stepNavs = document.querySelectorAll('.step-navigation');
        stepNavs.forEach(nav => nav.style.display = 'none');
        
        // 데스크톱에서는 mobile-only 버튼 숨기기
        const mobileButtons = document.querySelectorAll('.mobile-only');
        mobileButtons.forEach(btn => btn.style.display = 'none');
        
        // 데스크톱에서는 desktop-only 버튼 보이기
        const desktopButtons = document.querySelectorAll('.desktop-only');
        desktopButtons.forEach(btn => btn.style.display = 'block');
    }
}

// 윈도우 크기 변경 시 대응
window.addEventListener('resize', () => {
    initializeStartPage();
});

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
                    adElement.style.border = '1px solid rgba(255, 154, 158, 0.2)';
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

// 16개 질문 데이터 (에겐/테토 성향 테스트)
const questions = [
    {
        text: "이성과의 첫 만남에서 당신의 행동은?",
        answers: [
            { text: "적극적으로 말을 걸고 이끈다", agen: 3, teto: 0 },
            { text: "자연스럽게 대화를 시작한다", agen: 2, teto: 1 },
            { text: "상대방이 말을 걸 때까지 기다린다", agen: 0, teto: 2 },
            { text: "수줍어하며 소극적으로 행동한다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "연인과의 데이트 계획을 세울 때?",
        answers: [
            { text: "내가 모든 계획을 세우고 주도한다", agen: 3, teto: 0 },
            { text: "함께 의논해서 계획을 세운다", agen: 2, teto: 1 },
            { text: "상대방의 의견을 먼저 들어본다", agen: 1, teto: 2 },
            { text: "상대방이 계획해주길 바란다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "갈등 상황에서 당신의 대처 방식은?",
        answers: [
            { text: "바로 문제를 해결하려고 적극적으로 나선다", agen: 3, teto: 0 },
            { text: "차분하게 대화로 풀어나간다", agen: 2, teto: 1 },
            { text: "시간을 두고 천천히 해결한다", agen: 1, teto: 2 },
            { text: "갈등을 피하고 조용히 넘어간다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "친구들과의 모임에서 당신은?",
        answers: [
            { text: "모임을 주도하고 분위기를 이끈다", agen: 3, teto: 0 },
            { text: "활발하게 참여하며 대화를 즐긴다", agen: 2, teto: 1 },
            { text: "조용히 듣고 가끔 의견을 말한다", agen: 1, teto: 2 },
            { text: "주로 듣기만 하고 얌전히 있다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "새로운 환경에 적응할 때?",
        answers: [
            { text: "빠르게 적응하고 주도권을 잡는다", agen: 3, teto: 0 },
            { text: "적극적으로 새로운 사람들과 어울린다", agen: 2, teto: 1 },
            { text: "조심스럽게 천천히 적응해나간다", agen: 1, teto: 2 },
            { text: "적응하는데 시간이 오래 걸린다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "연인에게 애정 표현을 할 때?",
        answers: [
            { text: "과감하고 직접적으로 표현한다", agen: 3, teto: 0 },
            { text: "상황에 맞게 적절히 표현한다", agen: 2, teto: 1 },
            { text: "은은하고 조심스럽게 표현한다", agen: 1, teto: 2 },
            { text: "표현하기 어려워서 망설인다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "위기 상황에서 당신의 반응은?",
        answers: [
            { text: "즉시 행동에 나서서 해결하려 한다", agen: 3, teto: 0 },
            { text: "침착하게 상황을 파악하고 대응한다", agen: 2, teto: 1 },
            { text: "신중하게 생각해본 후 행동한다", agen: 1, teto: 2 },
            { text: "당황스러워서 다른 사람의 도움을 구한다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "연인과 의견이 다를 때?",
        answers: [
            { text: "내 의견을 강하게 주장한다", agen: 3, teto: 0 },
            { text: "논리적으로 설득하려고 노력한다", agen: 2, teto: 1 },
            { text: "상대방 의견도 충분히 들어본다", agen: 1, teto: 2 },
            { text: "대부분 상대방 의견에 맞춰준다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "스트레스를 받을 때 당신은?",
        answers: [
            { text: "운동이나 활동으로 적극적으로 해소한다", agen: 3, teto: 0 },
            { text: "친구들과 만나서 스트레스를 푼다", agen: 2, teto: 1 },
            { text: "혼자만의 시간을 가지며 쉰다", agen: 1, teto: 2 },
            { text: "조용히 참고 견딘다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "연인의 관심을 끌고 싶을 때?",
        answers: [
            { text: "직접적이고 확실한 방법을 사용한다", agen: 3, teto: 0 },
            { text: "재미있는 이벤트나 깜짝 선물을 준비한다", agen: 2, teto: 1 },
            { text: "소소한 관심과 배려를 보여준다", agen: 1, teto: 2 },
            { text: "조용히 기다리며 눈치를 본다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "팀 프로젝트에서 당신의 역할은?",
        answers: [
            { text: "리더가 되어 팀을 이끈다", agen: 3, teto: 0 },
            { text: "적극적으로 아이디어를 제시한다", agen: 2, teto: 1 },
            { text: "맡은 역할을 성실히 수행한다", agen: 1, teto: 2 },
            { text: "다른 사람들을 도와주는 역할을 한다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "연인과의 스킨십에 대해서?",
        answers: [
            { text: "적극적이고 주도적으로 한다", agen: 3, teto: 0 },
            { text: "자연스럽게 상황에 맞춰 한다", agen: 2, teto: 1 },
            { text: "조심스럽고 부드럽게 한다", agen: 1, teto: 2 },
            { text: "수줍어하며 소극적이다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "자신의 매력을 어필할 때?",
        answers: [
            { text: "자신감 넘치게 당당하게 어필한다", agen: 3, teto: 0 },
            { text: "유머나 재치로 자연스럽게 어필한다", agen: 2, teto: 1 },
            { text: "은근하고 세련되게 어필한다", agen: 1, teto: 2 },
            { text: "어필하기보다는 자연스러운 모습을 보인다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "연인과 헤어질 위기에 처했을 때?",
        answers: [
            { text: "적극적으로 관계 회복을 위해 노력한다", agen: 3, teto: 0 },
            { text: "진지하게 대화를 시도한다", agen: 2, teto: 1 },
            { text: "상대방의 마음을 이해하려 노력한다", agen: 1, teto: 2 },
            { text: "조용히 기다리며 상대방의 선택을 존중한다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "파티나 모임에서 당신은?",
        answers: [
            { text: "파티의 중심이 되어 분위기를 주도한다", agen: 3, teto: 0 },
            { text: "많은 사람들과 어울리며 즐긴다", agen: 2, teto: 1 },
            { text: "친한 사람들과만 조용히 대화한다", agen: 1, teto: 2 },
            { text: "구석에서 조용히 관찰만 한다", agen: 0, teto: 3 }
        ]
    },
    {
        text: "연인에게 선물을 받을 때 당신의 반응은?",
        answers: [
            { text: "크게 기뻐하며 감사 인사를 확실히 한다", agen: 3, teto: 0 },
            { text: "기쁨을 표현하고 고마움을 전한다", agen: 2, teto: 1 },
            { text: "수줍어하면서도 고마워한다", agen: 1, teto: 2 },
            { text: "부끄러워하며 조용히 고마워한다", agen: 0, teto: 3 }
        ]
    }
];

// 성향 분석 데이터
const personalityAnalysis = {
    '에겐남': {
        title: '에겐남 (Alpha Male)',
        subtitle: '카리스마 넘치는 주도적 남성',
        description: '당신은 자신감이 넘치고 상황을 주도하는 매력적인 남성입니다. 리더십이 강하며 연인을 보호하고 이끌어가는 든든한 존재로, 결단력과 추진력이 뛰어납니다.',
        badge: '💪',
        color: '#FF6B35',
        tips: ['자신감을 유지하되 겸손함도 잃지 않기', '연인의 의견도 충분히 들어주기', '강함 속에서도 세심한 배려 보이기', '때로는 vulnerable한 모습도 보여주기'],
        advice: '강한 리더십은 당신의 큰 매력이에요. 다만 때로는 상대방의 의견도 충분히 들어주는 것이 더 깊은 관계를 만들 수 있습니다.',
        dailyPractices: [
            '연인의 의견을 먼저 물어보고 경청하기',
            '작은 배려와 서비스로 사랑 표현하기',
            '자신의 감정을 솔직하게 표현하기',
            '상대방을 존중하는 마음 갖기'
        ],
        compatibility: '테토녀와 가장 잘 맞으며, 에겐녀와는 서로 자극을 주며 성장할 수 있는 관계입니다.',
        activities: ['스포츠 데이트', '드라이브', '모험적인 액티비티', '리더십 발휘할 수 있는 활동', '보호자 역할 데이트'],
        personality: '자신감 넘치고 결단력이 있으며, 책임감이 강하고 보호 본능이 뛰어난 성격입니다.',
        charm: '강한 카리스마와 든든함, 문제 해결 능력과 리더십이 주요 매력 포인트입니다.'
    },
    '테토남': {
        title: '테토남 (Gentle Male)',
        subtitle: '따뜻하고 배려심 깊은 남성',
        description: '당신은 상대방을 세심하게 배려하고 따뜻한 마음으로 대하는 젠틀한 남성입니다. 감성적이고 로맨틱하며, 상대방의 마음을 잘 헤아리는 감수성이 풍부한 매력을 가지고 있습니다.',
        badge: '🌙',
        color: '#4A90E2',
        tips: ['자신의 의견도 당당하게 표현하기', '때로는 주도적인 모습 보여주기', '자신감을 기르는 노력하기', '경계선을 명확히 설정하기'],
        advice: '부드럽고 배려 깊은 성격은 큰 매력이에요. 때로는 자신의 의견을 더 적극적으로 표현하는 것도 좋겠어요.',
        dailyPractices: [
            '자신의 의견을 명확하게 표현하기',
            '상대방에게 의존하지 않고 독립적으로 행동하기',
            '자신만의 매력을 발견하고 개발하기',
            '때로는 주도권을 잡고 이끌어보기'
        ],
        compatibility: '에겐녀와 가장 잘 맞으며, 테토녀와는 서로를 이해하고 공감하는 편안한 관계를 만들 수 있습니다.',
        activities: ['감성적인 데이트', '문화 활동', '조용한 카페', '깊은 대화', '예술 관람'],
        personality: '섬세하고 배려심이 깊으며, 감성이 풍부하고 상대방을 잘 이해하는 성격입니다.',
        charm: '따뜻한 마음과 세심한 배려, 깊은 공감 능력과 로맨틱함이 주요 매력 포인트입니다.'
    },
    '에겐녀': {
        title: '에겐녀 (Alpha Female)',
        subtitle: '당당하고 매력적인 여성',
        description: '당신은 자신만의 확고한 가치관을 가지고 당당하게 살아가는 매력적인 여성입니다. 독립적이고 주체적이며, 자신의 길을 개척해나가는 강인한 매력과 지적인 아름다움을 겸비하고 있습니다.',
        badge: '✨',
        color: '#E91E63',
        tips: ['때로는 feminine한 면도 보여주기', '상대방을 의존할 줄도 알기', '강함 속에서도 부드러움 표현하기', '파트너십을 중요하게 생각하기'],
        advice: '독립적이고 당당한 모습이 매력적이에요. 때로는 연약한 모습도 보여주면서 상대방이 보호하고 싶은 마음이 들게 하는 것도 좋아요.',
        dailyPractices: [
            '상대방의 도움을 받아들이는 것도 배우기',
            '때로는 의존하고 보호받는 경험하기',
            'feminine한 매력도 발휘해보기',
            '파트너와의 협력과 조화 중시하기'
        ],
        compatibility: '테토남과 가장 잘 맞으며, 에겐남과는 서로 자극하며 성장할 수 있는 관계입니다.',
        activities: ['새로운 도전', '자기계발 활동', '지적인 대화', '여행', '커리어 관련 활동'],
        personality: '독립적이고 주체적이며, 지적이고 당당한 성격으로 자신만의 길을 걸어가는 사람입니다.',
        charm: '강한 의지력과 독립성, 지적인 매력과 당당함이 주요 매력 포인트입니다.'
    },
    '테토녀': {
        title: '테토녀 (Soft Female)',
        subtitle: '순수하고 사랑스러운 여성',
        description: '당신은 순수하고 따뜻한 마음을 가진 사랑스러운 여성입니다. 상대방을 믿고 의지하며, 사랑받고 보호받는 것을 자연스럽게 받아들이는 feminine한 매력이 가득한 사람입니다.',
        badge: '🌸',
        color: '#F8BBD9',
        tips: ['자신의 의견도 표현하는 용기 갖기', '독립적인 면도 기르기', '주체적으로 선택하고 결정하기', '자신만의 강점 발견하기'],
        advice: '순수하고 따뜻한 마음이 큰 매력이에요. 자신의 의견도 더 적극적으로 표현하면서 균형잡힌 관계를 만들어가세요.',
        dailyPractices: [
            '자신의 생각과 의견 당당하게 표현하기',
            '독립적으로 할 수 있는 일들 늘려가기',
            '자신만의 꿈과 목표 설정하기',
            '상대방에게만 의존하지 않고 자립심 기르기'
        ],
        compatibility: '에겐남과 가장 잘 맞으며, 테토남과는 서로를 이해하고 보완하는 따뜻한 관계를 만들 수 있습니다.',
        activities: ['로맨틱한 데이트', '보호받는 느낌의 활동', '감성적인 취미', '함께하는 일상', '케어받는 경험'],
        personality: '순수하고 따뜻하며, 상대방을 신뢰하고 feminine한 매력이 가득한 성격입니다.',
        charm: '순수한 마음과 사랑스러움, 상대방을 믿고 따르는 따뜻함이 주요 매력 포인트입니다.'
    }
};

// Page initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize ad manager
    adManager.init();
    
    // Start observing top ad
    adManager.observe('adTop');
    
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
    // Save selected answer
    personalityScores.agen += answer.agen;
    personalityScores.teto += answer.teto;
    
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
    console.log('showResult called');
    document.getElementById('loadingPage').classList.add('hidden');
    document.getElementById('resultPage').classList.remove('hidden');
    
    // 모바일과 PC 모두 첫 번째 단계부터 시작
    console.log('Showing step 1 for all devices');
    showResultStep(1);
    
    // Determine personality type based on scores
    const personalityType = determinePersonalityType();
    const analysis = personalityAnalysis[personalityType];
    
    // Update result information
    document.getElementById('resultBadge').textContent = analysis.badge;
    document.getElementById('resultTitle').textContent = analysis.title;
    document.getElementById('resultSubtitle').textContent = analysis.subtitle;
    document.getElementById('resultDescription').textContent = analysis.description;

    // Update personality summary
    document.getElementById('personalitySummary').innerHTML = `
        <div class="personality-item">
            <strong>성격 특성:</strong> ${analysis.personality}
        </div>
        <div class="charm-item">
            <strong>매력 포인트:</strong> ${analysis.charm}
        </div>
    `;

    // Update chart information
    updatePersonalityChart();

    // Update detailed analysis
    updateDetailedAnalysis(analysis);

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

    // Update daily practices
    const dailyPractices = document.getElementById('dailyPractices');
    dailyPractices.innerHTML = '';
    analysis.dailyPractices.forEach((practice, index) => {
        const practiceElement = document.createElement('div');
        practiceElement.className = 'practice-item';
        practiceElement.innerHTML = `<span class="practice-number">${index + 1}</span>${practice}`;
        dailyPractices.appendChild(practiceElement);
    });

    // Update compatibility info
    document.getElementById('compatibilityContent').innerHTML = `
        <div class="compatibility-text">${analysis.compatibility}</div>
    `;

    // Update recommended activities
    const activitiesGrid = document.getElementById('recommendedActivities');
    activitiesGrid.innerHTML = '';
    analysis.activities.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        activityElement.textContent = activity;
        activitiesGrid.appendChild(activityElement);
    });

    // Generate personality insights
    generatePersonalityInsights();
    
    // Start observing result ad
    adManager.observe('adResult');
}

// Determine personality type based on scores
function determinePersonalityType() {
    // First, ask for gender if not set (you can modify this logic)
    // For now, we'll determine based on context or add gender selection
    
    if (personalityScores.agen > personalityScores.teto) {
        // More Agen characteristics
        return Math.random() > 0.5 ? '에겐남' : '에겐녀'; // You can add gender selection logic here
    } else {
        // More Teto characteristics
        return Math.random() > 0.5 ? '테토남' : '테토녀'; // You can add gender selection logic here
    }
}

// Update personality chart
function updatePersonalityChart() {
    const chartContainer = document.getElementById('personalityChart');
    const total = personalityScores.agen + personalityScores.teto;
    const agenPercentage = Math.round((personalityScores.agen / total) * 100);
    const tetoPercentage = Math.round((personalityScores.teto / total) * 100);
    
    chartContainer.innerHTML = `
        <div class="chart-legend">
            <div class="legend-item">
                <div class="legend-color" style="background: #ff9a9e"></div>
                <span class="legend-name">에겐 성향</span>
                <span class="legend-percentage">${agenPercentage}%</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #fad0c4"></div>
                <span class="legend-name">테토 성향</span>
                <span class="legend-percentage">${tetoPercentage}%</span>
            </div>
        </div>
        <div class="chart-visual">
            <div class="chart-bar">
                <div class="bar-fill" style="width: ${agenPercentage}%; background: #ff9a9e"></div>
                <span class="bar-label">에겐 성향 ${agenPercentage}%</span>
            </div>
            <div class="chart-bar">
                <div class="bar-fill" style="width: ${tetoPercentage}%; background: #fad0c4"></div>
                <span class="bar-label">테토 성향 ${tetoPercentage}%</span>
            </div>
        </div>
    `;
}

// Update detailed analysis
function updateDetailedAnalysis(analysis) {
    const total = personalityScores.agen + personalityScores.teto;
    const dominantType = personalityScores.agen > personalityScores.teto ? '에겐' : '테토';
    const dominantPercentage = Math.round((Math.max(personalityScores.agen, personalityScores.teto) / total) * 100);
    
    document.getElementById('primaryPersonality').innerHTML = `
        <div class="personality-name">${dominantType} 성향</div>
        <div class="personality-percentage">${dominantPercentage}%</div>
    `;
    
    document.getElementById('primaryExplanation').innerHTML = `
        <p><strong>${analysis.title}</strong>: ${analysis.subtitle}</p>
        <p class="personality-detail">${analysis.description}</p>
    `;
    
    // Hidden charm (opposite tendency)
    const hiddenType = dominantType === '에겐' ? '테토' : '에겐';
    const hiddenPercentage = 100 - dominantPercentage;
    
    document.getElementById('hiddenCharm').innerHTML = `
        <div class="personality-name">숨겨진 ${hiddenType} 매력</div>
        <div class="personality-percentage">${hiddenPercentage}%</div>
    `;
    
    const hiddenDescription = hiddenType === '에겐' 
        ? '때로는 주도적이고 당당한 모습을 보여줄 수 있는 잠재력이 있습니다.'
        : '때로는 부드럽고 배려심 깊은 모습을 보여줄 수 있는 매력이 있습니다.';
    
    document.getElementById('hiddenExplanation').innerHTML = `
        <p class="personality-detail">${hiddenDescription}</p>
    `;

    // Personality balance analysis
    document.getElementById('personalityBalance').innerHTML = generateBalanceAnalysis();
}

// Generate balance analysis
function generateBalanceAnalysis() {
    const total = personalityScores.agen + personalityScores.teto;
    const agenPercentage = (personalityScores.agen / total) * 100;
    const tetoPercentage = (personalityScores.teto / total) * 100;
    const difference = Math.abs(agenPercentage - tetoPercentage);
    
    let balanceLevel = '';
    let balanceAdvice = '';
    
    if (difference < 20) {
        balanceLevel = '균형잡힌 성향';
        balanceAdvice = '에겐과 테토 성향이 균형잡혀 있어 상황에 따라 유연하게 대처할 수 있습니다.';
    } else if (difference < 40) {
        balanceLevel = '한쪽으로 기운 성향';
        balanceAdvice = '한 쪽 성향이 강하지만 반대 성향의 매력도 충분히 발휘할 수 있습니다.';
    } else {
        balanceLevel = '뚜렷한 성향';
        balanceAdvice = '매우 뚜렷한 성향을 가지고 있어 자신만의 확실한 매력이 있습니다.';
    }
    
    return `
        <div class="balance-result">
            <h4>${balanceLevel}</h4>
            <p>${balanceAdvice}</p>
            <div class="balance-chart">
                <div class="balance-item">
                    <span class="personality-label">에겐</span>
                    <div class="balance-bar">
                        <div class="balance-fill" style="width: ${agenPercentage}%"></div>
                    </div>
                    <span class="balance-percent">${Math.round(agenPercentage)}%</span>
                </div>
                <div class="balance-item">
                    <span class="personality-label">테토</span>
                    <div class="balance-bar">
                        <div class="balance-fill" style="width: ${tetoPercentage}%"></div>
                    </div>
                    <span class="balance-percent">${Math.round(tetoPercentage)}%</span>
                </div>
            </div>
        </div>
    `;
}

// Generate personality insights
function generatePersonalityInsights() {
    const total = personalityScores.agen + personalityScores.teto;
    const agenPercentage = Math.round((personalityScores.agen / total) * 100);
    const tetoPercentage = Math.round((personalityScores.teto / total) * 100);
    
    const insights = [];
    
    if (agenPercentage > 60) {
        insights.push(`
            <div class="insight-item">
                <h4>강한 에겐 성향 (${agenPercentage}%)</h4>
                <p>주도적이고 적극적인 성격으로 리더십을 발휘하는 것을 좋아합니다.</p>
                <div class="insight-advice">때로는 상대방의 의견을 더 많이 들어보는 것도 좋겠어요.</div>
            </div>
        `);
    }
    
    if (tetoPercentage > 60) {
        insights.push(`
            <div class="insight-item">
                <h4>강한 테토 성향 (${tetoPercentage}%)</h4>
                <p>부드럽고 배려심이 깊어 상대방을 편안하게 만드는 매력이 있습니다.</p>
                <div class="insight-advice">자신의 의견도 더 적극적으로 표현해보세요.</div>
            </div>
        `);
    }
    
    if (Math.abs(agenPercentage - tetoPercentage) < 20) {
        insights.push(`
            <div class="insight-item">
                <h4>균형잡힌 성향</h4>
                <p>상황에 따라 에겐과 테토의 매력을 모두 발휘할 수 있는 균형잡힌 성격입니다.</p>
                <div class="insight-advice">이런 균형감은 많은 사람들에게 매력적으로 느껴질 거예요.</div>
            </div>
        `);
    }
    
    document.getElementById('personalityInsights').innerHTML = insights.join('');
}

// 카카오톡 공유 기능
function shareToKakao() {
    const personalityType = determinePersonalityType();
    const analysis = personalityAnalysis[personalityType];
    
    window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: '💕 나의 에겐/테토 성향 분석 결과',
            description: `${analysis.title} - ${analysis.subtitle}\n\n"${analysis.description}"\n\n당신도 테스트해보세요!`,
            imageUrl: 'https://sd2624.github.io/에겐/에겐.svg',
            link: {
                mobileWebUrl: 'https://sd2624.github.io/에겐/',
                webUrl: 'https://sd2624.github.io/에겐/',
            },
        },
        buttons: [
            {
                title: '테스트 하기',
                link: {
                    mobileWebUrl: 'https://sd2624.github.io/에겐/',
                    webUrl: 'https://sd2624.github.io/에겐/',
                },
            }
        ]
    });
}

// Retry test function
function retryTest() {
    // Initialize variables
    currentQuestion = 0;
    currentResultStep = 1;
    personalityScores = { agen: 0, teto: 0 };
    loadedAds.clear();
    
    // Page transition
    document.getElementById('resultPage').classList.add('hidden');
    document.getElementById('startPage').classList.remove('hidden');
    
    // 시작 페이지 초기화
    initializeStartPage();
    
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
    const totalTests = Math.floor(Math.random() * 10000) + 35000;
    const todayTests = Math.floor(Math.random() * 200) + 896;
    
    const totalElement = document.getElementById('totalTests');
    const todayElement = document.getElementById('todayTests');
    
    if (totalElement) totalElement.textContent = totalTests.toLocaleString();
    if (todayElement) todayElement.textContent = todayTests.toLocaleString();
}

// 긴급성 메시지 업데이트
function updateUrgencyMessage() {
    const messages = [
        "⏰ 지금 당신의 연애 성향을 놓치지 마세요!",
        "🔥 오늘 나의 매력 포인트를 확인해보세요!",
        "💡 성향 분석으로 더 나은 연애를 시작해보세요!",
        "🌟 당신만의 독특한 매력을 발견해보세요!"
    ];
    
    const messageElement = document.querySelector('.notice-content');
    if (messageElement) {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        messageElement.innerHTML = randomMessage + "<br>당신의 진짜 매력이 궁금하지 않나요?";
    }
}

// 실시간 카운터 업데이트
function updateLiveCounter() {
    const counterElement = document.getElementById('liveCount');
    if (counterElement) {
        const currentCount = parseInt(counterElement.textContent.replace(/,/g, ''));
        const variation = Math.floor(Math.random() * 8) - 3; // -3 to +5
        const newCount = Math.max(800, currentCount + variation);
        counterElement.textContent = newCount.toLocaleString();
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - initializing...');
    
    // Kakao SDK 초기화
    initKakao();
    
    // 시작 페이지 초기화 (모바일/데스크톱 구분)
    initializeStartPage();
    
    // 광고 관리자 초기화
    adManager.init();
    
    // 상단 광고 옵저버 등록
    adManager.observe('adTop');
    
    // 통계 업데이트
    updateStats();
    
    // 긴급성 메시지 업데이트
    updateUrgencyMessage();
    
    // 실시간 카운터 주기적 업데이트
    setInterval(updateLiveCounter, 3000);
    
    // 긴급성 메시지 주기적 업데이트
    setInterval(updateUrgencyMessage, 8000);
    
    console.log('Initialization complete');
});

// 전역 함수로 노출 (HTML onclick에서 사용)
window.showNextStep = showNextStep;
window.showResultStep = showResultStep;
window.startTest = startTest;
window.shareToKakao = shareToKakao;
window.retryTest = retryTest;
window.shareUrl = shareUrl;
