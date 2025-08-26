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
let currentStep = 1; // 현재 단계 추가
let currentResultStep = 1; // 결과 페이지 현재 단계 추가

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
        
        // 각 단계별 광고 리로드
        setTimeout(() => {
            if (adManager && adManager.reloadResultAd) {
                adManager.reloadResultAd(step);
            }
        }, 100);
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
    // 모바일에서는 첫 번째 단계만 보이기 (슬라이드 방식)
    showNextStep(1);
    
    // 모든 단계를 슬라이드 방식으로 처리
    for (let i = 1; i <= 4; i++) {
        const stepElement = document.getElementById(`introStep${i}`);
        if (stepElement && i !== 1) {
            stepElement.classList.add('hidden');
        }
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
    
    // 결과 페이지 광고 리로드 (각 단계별)
    reloadResultAd(step) {
        const adId = `adResult${step}`;
        const adElement = document.getElementById(adId);
        if (adElement) {
            // 기존 광고 내용 완전 제거
            const existingAd = adElement.querySelector('.adsbygoogle');
            if (existingAd) {
                existingAd.remove();
            }
            
            // 새 광고 요소 생성
            const newAd = document.createElement('ins');
            newAd.className = 'adsbygoogle';
            newAd.style.display = 'block';
            newAd.style.minHeight = '100px';
            newAd.style.maxHeight = '120px';
            newAd.setAttribute('data-ad-client', 'ca-pub-9374368296307755');
            newAd.setAttribute('data-ad-slot', '3593134392');
            newAd.setAttribute('data-ad-format', 'auto');
            newAd.setAttribute('data-full-width-responsive', 'true');
            
            adElement.appendChild(newAd);
            
            // 광고 로드
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
                console.log(`Result ad reloaded: ${adId}`);
            } catch (error) {
                console.error(`Failed to reload result ad: ${adId}`, error);
            }
        }
    },
    
    // Execute ad loading (optimized for small size)
    loadAd(adId) {
        try {
            const adElement = document.getElementById(adId);
            if (adElement && typeof (adsbygoogle) !== 'undefined') {
                // Prevent duplicate loading
                if (loadedAds.has(adId)) {
                    console.log(`Ad already loaded: ${adId}`);
                    return;
                }
                
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
                loadedAds.add(adId); // Mark as loaded
                console.log(`Ad loaded (optimized): ${adId}`);
            }
        } catch (error) {
            console.error(`Ad loading failed: ${adId}`, error);
        }
    },
    
    // Show infeed ads at specific questions (상단 광고와 동일한 방식)
    showInfeedAd(questionNum) {
        let adId = '';
        if (questionNum === 1) {
            adId = 'adInfeed1';
        }
        
        if (adId) {
            const infeedAd = document.getElementById(adId);
            if (infeedAd) {
                infeedAd.style.display = 'block';
                infeedAd.style.margin = '8px 0';
                // 상단 광고와 동일한 조건으로 처리 - 별도 로직 없음
            }
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
        description: '당신은 삶의 밝은 면을 바라보는 탁월한 능력을 가지고 있으며, 주변 사람들에게 긍정적인 영향을 미칩니다. 어려운 상황에서도 희망을 잃지 않는 강인한 정신력의 소유자입니다.',
        badge: '😊',
        color: '#FFD700',
        tips: ['매일 감사 일기 작성하기', '주변 사람들과 기쁨 나누기', '새로운 도전을 즐기기', '웃음이 나는 콘텐츠 접하기'],
        advice: '긍정적인 마음가짐을 유지하되, 때로는 현실적인 시각도 필요해요. 지나친 낙관은 준비 부족으로 이어질 수 있으니 균형을 맞춰보세요.',
        dailyPractices: [
            '아침에 일어나자마자 감사한 일 3가지 생각하기',
            '하루에 한 명에게는 진심 어린 칭찬하기',
            '매주 새로운 것 하나씩 시도해보기',
            '잠들기 전 오늘의 좋았던 순간 떠올리기'
        ],
        warningSign: '지나친 낙관으로 현실을 무시하거나, 다른 사람의 부정적 감정을 이해하지 못할 수 있어요.',
        activities: ['음악 듣기', '춤추기', '친구들과 모임', '새로운 취미 시작', '여행 계획 세우기'],
        personality: '에너지가 넘치고 사교적이며, 창의적 사고를 즐기는 성격입니다.',
        balance: '때로는 조용한 시간을 가져 내면을 돌아보는 것도 중요합니다.'
    },
    '슬픔': {
        title: '깊은 감정 탐험가',
        subtitle: '뛰어난 공감 능력을 가진 예민한 감성',
        description: '당신은 감정의 깊이를 이해하며, 타인의 마음을 잘 헤아리는 섬세한 감정의 소유자입니다. 예술적 감성이 뛰어나고 진정성 있는 인간관계를 중요하게 생각합니다.',
        badge: '😔',
        color: '#4682B4',
        tips: ['충분한 휴식과 수면', '감정을 글이나 그림으로 표현하기', '신뢰하는 사람과 대화하기', '자연과 교감하기'],
        advice: '슬픔도 소중한 감정이에요. 충분히 느끼되 너무 오래 머물지는 마세요. 전문가의 도움을 받는 것도 좋은 방법입니다.',
        dailyPractices: [
            '감정 일기 쓰기',
            '명상이나 심호흡 연습하기',
            '좋아하는 음악 듣기',
            '따뜻한 차 마시며 여유 갖기'
        ],
        warningSign: '슬픔이 너무 오래 지속되어 일상생활에 지장을 주거나, 자해 생각이 든다면 전문가 상담이 필요해요.',
        activities: ['독서', '영화 감상', '그림 그리기', '산책', '요가'],
        personality: '깊이 있는 사고를 하며, 진실한 관계를 추구하고 예술적 감성이 풍부한 성격입니다.',
        balance: '긍정적인 활동과 사람들과의 교류를 통해 감정의 균형을 맞춰보세요.'
    },
    '분노': {
        title: '열정적인 개혁가',
        subtitle: '정의감이 강한 의지력의 소유자',
        description: '당신은 옳지 않은 것에 대한 분노를 통해 변화를 이끌어내는 강한 의지력을 가지고 있습니다. 리더십이 뛰어나고 불의를 보면 가만히 있지 못하는 정의로운 성격입니다.',
        badge: '😤',
        color: '#DC143C',
        tips: ['심호흡으로 진정하기', '운동으로 스트레스 해소하기', '건설적인 표현 방법 찾기', '분노 일기 쓰기'],
        advice: '분노는 변화의 원동력이 될 수 있어요. 건설적으로 활용하되, 타인을 상처주지 않는 방법을 찾아보세요.',
        dailyPractices: [
            '화가 날 때 10초 깊게 숨쉬기',
            '규칙적인 운동으로 스트레스 해소하기',
            '분노의 원인 분석하고 해결책 찾기',
            '차분해진 후 대화하기'
        ],
        warningSign: '분노가 폭력적인 행동이나 말로 표출되거나, 다른 사람과의 관계를 해친다면 관리가 필요해요.',
        activities: ['격렬한 운동', '복싱', '큰 소리로 노래부르기', '토론', '사회봉사'],
        personality: '강한 의지력과 리더십을 가지고 있으며, 정의감이 강하고 목표 지향적인 성격입니다.',
        balance: '차분함과 인내심을 기르는 명상이나 요가 같은 활동이 도움될 것입니다.'
    },
    '불안': {
        title: '신중한 계획가',
        subtitle: '위험을 미리 감지하는 지혜로운 사람',
        description: '당신은 미래를 준비하고 위험을 미리 감지하는 뛰어난 예측 능력을 가지고 있습니다. 완벽주의적 성향이 있으며 책임감이 강한 신뢰할 수 있는 사람입니다.',
        badge: '😰',
        color: '#9370DB',
        tips: ['규칙적인 생활 패턴 유지하기', '점진적인 도전하기', '안정감을 주는 활동하기', '전문가 상담 받기'],
        advice: '불안은 당신을 보호하는 신호예요. 적정 수준에서 관리하되, 과도한 불안은 전문가의 도움을 받아보세요.',
        dailyPractices: [
            '하루 일정을 미리 계획하기',
            '작은 성취 경험 쌓기',
            '안정감 주는 루틴 만들기',
            '걱정을 글로 써서 정리하기'
        ],
        warningSign: '불안이 일상생활을 방해하거나 공황발작이 일어난다면 즉시 전문가 상담을 받으세요.',
        activities: ['독서', '퍼즐', '요가', '명상', '규칙적인 산책'],
        personality: '신중하고 계획적이며, 책임감이 강하고 디테일에 민감한 성격입니다.',
        balance: '완벽하지 않아도 괜찮다는 마음가짐과 실패를 받아들이는 연습이 필요해요.'
    },
    '평화': {
        title: '지혜로운 중재자',
        subtitle: '뛰어난 균형감각을 가진 안정된 사람',
        description: '당신은 어떤 상황에서도 중심을 잃지 않는 안정된 마음의 소유자입니다. 갈등 상황에서 중재 역할을 잘하고, 주변 사람들에게 안정감을 주는 존재입니다.',
        badge: '😌',
        color: '#20B2AA',
        tips: ['명상과 요가 실천하기', '자연과의 교감하기', '꾸준한 자기계발하기', '균형잡힌 생활하기'],
        advice: '당신의 평화로움은 주변에 좋은 영향을 줘요. 더욱 발전시키되, 때로는 적극적인 행동도 필요해요.',
        dailyPractices: [
            '매일 10분씩 명상하기',
            '자연 속에서 시간 보내기',
            '독서로 마음의 양식 쌓기',
            '감사와 만족감 표현하기'
        ],
        warningSign: '지나친 수동성으로 기회를 놓치거나, 자신의 의견을 제대로 표현하지 못할 수 있어요.',
        activities: ['명상', '요가', '정원 가꾸기', '차 마시기', '독서'],
        personality: '온화하고 안정적이며, 조화로운 관계를 중시하고 지혜로운 성격입니다.',
        balance: '때로는 적극적으로 의견을 표현하고 새로운 도전을 해보는 것도 좋겠어요.'
    },
    '흥미': {
        title: '호기심 많은 탐험가',
        subtitle: '새로운 것을 추구하는 모험가',
        description: '당신은 끝없는 호기심으로 세상을 탐험하며 새로운 가능성을 찾아내는 사람입니다. 창의적이고 혁신적인 아이디어를 내는 데 뛰어나며, 변화를 두려워하지 않습니다.',
        badge: '🤔',
        color: '#FF6347',
        tips: ['새로운 취미나 기술 배우기', '다양한 분야 독서하기', '여행이나 체험 활동하기', '창의적 프로젝트 시작하기'],
        advice: '호기심을 바탕으로 한 지속적인 학습이 당신의 강점이에요. 다만 한 가지에 집중하는 끈기도 기워보세요.',
        dailyPractices: [
            '매일 새로운 것 하나씩 배우기',
            '다양한 사람들과 대화하기',
            '창의적 아이디어 메모하기',
            '호기심 생기는 것들 탐색하기'
        ],
        warningSign: '너무 많은 것에 관심을 가져 집중력이 떨어지거나, 금방 흥미를 잃을 수 있어요.',
        activities: ['새로운 취미', '여행', '강의 듣기', '전시회 관람', '다양한 사람들과 만남'],
        personality: '호기심이 많고 창의적이며, 모험을 즐기고 새로운 경험을 추구하는 성격입니다.',
        balance: '한 가지 분야에서 깊이를 추구하는 것도 중요해요. 지속적인 집중력을 기워보세요.'
    },
    '사랑': {
        title: '따뜻한 마음의 치유자',
        subtitle: '깊은 애정으로 세상을 포용하는 사람',
        description: '당신은 타인에 대한 깊은 사랑과 이해로 주변 사람들을 위로하는 존재입니다. 공감 능력이 뛰어나고 다른 사람의 행복을 진심으로 바라는 따뜻한 마음의 소유자입니다.',
        badge: '❤️',
        color: '#FF1493',
        tips: ['사랑하는 사람과 질 좋은 시간 보내기', '봉사활동으로 사랑 실천하기', '감정을 솔직하게 표현하기', '자기 자신도 사랑하기'],
        advice: '사랑은 나누면 나눌수록 커져요. 더 많이 나누되, 자신도 소중히 여기는 것을 잊지 마세요.',
        dailyPractices: [
            '사랑하는 사람에게 마음 표현하기',
            '작은 배려와 친절 실천하기',
            '자신에게도 격려의 말 해주기',
            '감사의 마음 표현하기'
        ],
        warningSign: '다른 사람을 지나치게 우선시하여 자신을 소홀히 하거나, 경계선이 모호해질 수 있어요.',
        activities: ['가족/친구와 시간 보내기', '봉사활동', '편지 쓰기', '요리해주기', '함께 취미 활동'],
        personality: '따뜻하고 배려심이 깊으며, 타인의 감정을 잘 이해하고 돌보는 성격입니다.',
        balance: '타인을 사랑하는 만큼 자신도 사랑하고, 건강한 경계선을 설정하는 것이 중요해요.'
    },
    '질투': {
        title: '경쟁력 있는 성취자',
        subtitle: '발전 욕구가 강한 목표 지향적 사람',
        description: '당신은 타인과의 비교를 통해 더 나은 사람이 되려는 강한 동기를 가지고 있습니다. 성취욕이 높고 끊임없이 자신을 발전시키려는 의지가 강한 사람입니다.',
        badge: '😒',
        color: '#228B22',
        tips: ['자신만의 목표와 기준 설정하기', '개인적 성취에 집중하기', '감사할 것들 돌아보기', '타인의 성공 축하해주기'],
        advice: '질투를 발전의 원동력으로 건설적으로 활용해보세요. 다른 사람보다 어제의 자신보다 나은 사람이 되는 것에 집중하세요.',
        dailyPractices: [
            '자신만의 성취 기록하기',
            '타인과 비교 대신 개인 목표 설정하기',
            '감사 일기 쓰기',
            '타인의 장점에서 배울 점 찾기'
        ],
        warningSign: '질투가 인간관계를 해치거나, 부정적인 행동으로 이어진다면 관리가 필요해요.',
        activities: ['새로운 기술 배우기', '목표 달성을 위한 노력', '자기계발서 읽기', '멘토 찾기', '성취 기록하기'],
        personality: '목표 지향적이고 성취욕이 높으며, 경쟁을 통해 발전하려는 의지가 강한 성격입니다.',
        balance: '타인과의 비교보다는 자신만의 속도로 성장하는 것에 집중해보세요.'
    }
};

// 감정 목록
const emotions = ['기쁨', '슬픔', '분노', '불안', '평화', '흥미', '사랑', '질투'];

// Page initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize ad manager
    adManager.init();
    
    // 모든 광고를 페이지 로드 시 즉시 활성화 (상단 광고 방식)
    setTimeout(() => {
        const allAds = document.querySelectorAll('.adsbygoogle');
        allAds.forEach((ad, index) => {
            if (!ad.hasAttribute('data-adsbygoogle-status')) {
                try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                    console.log(`Ad ${index + 1} loaded immediately`);
                } catch (error) {
                    console.error(`Ad ${index + 1} loading failed:`, error);
                }
            }
        });
    }, 100);
    
    // Start observing ads (backup)
    adManager.observe('adTop');
    adManager.observe('adInfeed1');
    
    // 앵커 광고 등록 (모바일용)
    if (window.innerWidth <= 768) {
        adManager.observe('adAnchor');
    }
    
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
            showBeforeResult();
        }
    }, 800);
}

// Show before result page with ad
function showBeforeResult() {
    document.getElementById('loadingPage').classList.add('hidden');
    document.getElementById('beforeResultPage').classList.remove('hidden');
    
    // Load before result ad
    if (adManager && adManager.observe) {
        adManager.observe('adBeforeResult');
    }
}

// View result function
function viewResult() {
    document.getElementById('beforeResultPage').classList.add('hidden');
    document.getElementById('resultPage').classList.remove('hidden');
    
    // 모바일과 PC 모두 첫 번째 단계부터 시작
    console.log('Showing step 1 for all devices');
    showResultStep(1);
    
    // Find emotion with highest score and display result
    displayResult();
}

// Result display function
function showResult() {
    console.log('showResult called - this function is now replaced by displayResult');
    displayResult();
}

// Display result content
function displayResult() {
    console.log('displayResult called');
    
    // Find emotion with highest score
    const maxEmotion = Object.keys(emotionScores).reduce((a, b) => 
        emotionScores[a] > emotionScores[b] ? a : b
    );
    
    const analysis = emotionAnalysis[maxEmotion];
    
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
        <div class="balance-item">
            <strong>균형 조언:</strong> ${analysis.balance}
        </div>
    `;

    // Update detailed analysis with explanations
    document.getElementById('primaryEmotion').innerHTML = `
        <div class="emotion-name">${maxEmotion}</div>
        <div class="emotion-percentage">${Math.round((emotionScores[maxEmotion] / getTotalScore()) * 100)}%</div>
    `;
    
    document.getElementById('primaryExplanation').innerHTML = `
        <p><strong>${analysis.title}</strong>: ${analysis.subtitle}</p>
        <p class="emotion-detail">${analysis.description}</p>
    `;
    
    // Hidden emotion (second highest score)
    const sortedEmotions = Object.keys(emotionScores).sort((a, b) => emotionScores[b] - emotionScores[a]);
    const secondEmotion = sortedEmotions[1];
    const secondAnalysis = emotionAnalysis[secondEmotion];
    
    document.getElementById('hiddenEmotion').innerHTML = `
        <div class="emotion-name">${secondEmotion}</div>
        <div class="emotion-percentage">${Math.round((emotionScores[secondEmotion] / getTotalScore()) * 100)}%</div>
    `;
    
    document.getElementById('hiddenExplanation').innerHTML = `
        <p><strong>${secondAnalysis.title}</strong>: ${secondAnalysis.subtitle}</p>
        <p class="emotion-detail">${secondAnalysis.description}</p>
    `;

    // Emotion balance analysis
    document.getElementById('emotionBalance').innerHTML = generateBalanceAnalysis();

    // Psychological profile
    document.getElementById('psychProfile').innerHTML = generatePsychProfile(analysis);

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

    // Update warning signs
    document.getElementById('warningSignsContent').innerHTML = `
        <div class="warning-text">${analysis.warningSign}</div>
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

    // Generate emotion insights
    generateEmotionInsights();

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
    currentResultStep = 1; // 결과 단계도 초기화
    loadedAds.clear();
    emotions.forEach(emotion => {
        emotionScores[emotion] = 0;
    });
    
    // Page transition
    document.getElementById('resultPage').classList.add('hidden');
    document.getElementById('beforeResultPage').classList.add('hidden');
    document.getElementById('startPage').classList.remove('hidden');
    
    // 시작 페이지 초기화
    initializeStartPage();
    
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
        "💡 감정 분석으로 더 나은 오늘을 만들어보세요!",
        "🌟 당신의 마음 상태를 정확히 알아보세요!"
    ];
    
    const messageElement = document.querySelector('.notice-content');
    if (messageElement) {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        messageElement.innerHTML = randomMessage + "<br>당신의 진짜 감정이 궁금하지 않나요?";
    }
}

// 실시간 카운터 업데이트
function updateLiveCounter() {
    const counterElement = document.getElementById('liveCount');
    if (counterElement) {
        const currentCount = parseInt(counterElement.textContent.replace(/,/g, ''));
        const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5
        const newCount = Math.max(1000, currentCount + variation);
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
    
    // 앵커 광고 등록 (모바일용)
    if (window.innerWidth <= 768) {
        adManager.observe('adAnchor');
    }
    
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
window.viewResult = viewResult;

// 추가 분석 함수들
function generateBalanceAnalysis() {
    const total = getTotalScore();
    const emotions = Object.keys(emotionScores);
    const percentages = emotions.map(emotion => ({
        name: emotion,
        percentage: Math.round((emotionScores[emotion] / total) * 100)
    }));
    
    // 균형 점수 계산 (표준편차 이용)
    const avg = 100 / emotions.length;
    const variance = percentages.reduce((sum, emotion) => sum + Math.pow(emotion.percentage - avg, 2), 0) / emotions.length;
    const stdDev = Math.sqrt(variance);
    
    let balanceLevel = '';
    let balanceAdvice = '';
    
    if (stdDev < 10) {
        balanceLevel = '매우 균형잡힌 상태';
        balanceAdvice = '당신의 감정은 매우 안정적이고 균형잡혀 있습니다. 이 상태를 유지하는 것이 좋습니다.';
    } else if (stdDev < 20) {
        balanceLevel = '균형잡힌 상태';
        balanceAdvice = '대체로 균형잡힌 감정 상태를 보이고 있습니다. 조금 더 균형을 맞춰나가면 좋겠습니다.';
    } else if (stdDev < 30) {
        balanceLevel = '약간 불균형한 상태';
        balanceAdvice = '일부 감정이 다른 감정보다 강하게 나타나고 있습니다. 감정 조절에 관심을 가져보세요.';
    } else {
        balanceLevel = '불균형한 상태';
        balanceAdvice = '감정의 기복이 큰 편입니다. 감정 관리 기법을 배우는 것을 권합니다.';
    }
    
    return `
        <div class="balance-result">
            <h4>${balanceLevel}</h4>
            <p>${balanceAdvice}</p>
            <div class="balance-chart">
                ${percentages.map(emotion => `
                    <div class="balance-item">
                        <span class="emotion-label">${emotion.name}</span>
                        <div class="balance-bar">
                            <div class="balance-fill" style="width: ${emotion.percentage}%"></div>
                        </div>
                        <span class="balance-percent">${emotion.percentage}%</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generatePsychProfile(analysis) {
    const dominant = Object.keys(emotionScores).reduce((a, b) => emotionScores[a] > emotionScores[b] ? a : b);
    
    const profiles = {
        '기쁨': {
            traits: ['낙천적', '사교적', '에너지가 넘침', '긍정적 사고'],
            strengths: ['팀워크가 좋음', '스트레스 해소 능력', '창의적 문제해결'],
            challenges: ['현실감각 부족 가능성', '과도한 낙관주의']
        },
        '슬픔': {
            traits: ['성찰적', '공감 능력이 높음', '신중함', '예술적 감성'],
            strengths: ['깊이 있는 사고', '타인의 감정 이해', '인내심'],
            challenges: ['의욕 저하', '사회적 위축 가능성']
        },
        '분노': {
            traits: ['정의감이 강함', '추진력 있음', '목표 지향적', '리더십'],
            strengths: ['문제 해결 의지', '변화 추진력', '보호 본능'],
            challenges: ['감정 조절 필요', '대인관계 갈등 가능성']
        },
        '두려움': {
            traits: ['신중함', '계획적', '위험 인식 능력', '안전 추구'],
            strengths: ['위험 관리 능력', '세심한 준비', '신중한 판단'],
            challenges: ['새로운 도전 회피', '과도한 걱정']
        },
        '놀람': {
            traits: ['호기심이 많음', '적응력이 좋음', '개방적', '유연함'],
            strengths: ['새로운 경험 수용', '빠른 학습', '창의성'],
            challenges: ['집중력 부족 가능성', '일관성 부족']
        },
        '혐오': {
            traits: ['분별력이 있음', '기준이 명확함', '완벽주의', '선택적'],
            strengths: ['품질 관리 능력', '비판적 사고', '기준 설정'],
            challenges: ['경직성', '편견 가능성']
        }
    };
    
    const profile = profiles[dominant] || profiles['기쁨'];
    
    return `
        <div class="psych-profile">
            <h4>당신의 성격 특성</h4>
            <div class="traits-section">
                <h5>주요 특성</h5>
                <ul>
                    ${profile.traits.map(trait => `<li>${trait}</li>`).join('')}
                </ul>
            </div>
            <div class="strengths-section">
                <h5>강점</h5>
                <ul>
                    ${profile.strengths.map(strength => `<li>${strength}</li>`).join('')}
                </ul>
            </div>
            <div class="challenges-section">
                <h5>주의할 점</h5>
                <ul>
                    ${profile.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function generateEmotionInsights() {
    const total = getTotalScore();
    const insights = [];
    
    Object.keys(emotionScores).forEach(emotion => {
        const percentage = Math.round((emotionScores[emotion] / total) * 100);
        if (percentage > 20) {
            const analysis = emotionAnalysis[emotion];
            insights.push(`
                <div class="insight-item">
                    <h4>${emotion} (${percentage}%)</h4>
                    <p>${analysis.subtitle}</p>
                    <div class="insight-advice">${analysis.advice}</div>
                </div>
            `);
        }
    });
    
    document.getElementById('emotionInsights').innerHTML = insights.join('');
}
