// [광고] AdManager 클래스 - 광고 로드 및 중복 방지 관리
class AdManager {
    constructor() {
        this.loadedAds = new Set(); // 로드된 광고 추적
    }
    
    // 광고 로드 함수
    loadAd(adId) {
        if (this.loadedAds.has(adId)) {
            console.log(`[광고] ${adId} 이미 로드됨 - 중복 방지`);
            return false;
        }
        
        const adElement = document.getElementById(adId);
        if (adElement && typeof adsbygoogle !== 'undefined') {
            try {
                // 광고 컨테이너 표시
                adElement.style.display = 'block';
                
                // 광고 푸시
                (adsbygoogle = window.adsbygoogle || []).push({});
                
                this.loadedAds.add(adId);
                console.log(`[광고] ${adId} 로드 완료`);
                return true;
            } catch (error) {
                console.warn(`[광고] ${adId} 로드 실패:`, error);
                return false;
            }
        }
        return false;
    }
    
    // 중간 광고 표시 (3번째 질문 후)
    showMidAd() {
        return this.loadAd('adMid');
    }
    
    // 결과 광고 표시
    showResultAd() {
        return this.loadAd('adResult');
    }
}

// [광고] AdManager 인스턴스 생성
const adManager = new AdManager();

// [광고] IntersectionObserver를 이용한 광고 표시 관리
const setupAdObservers = () => {
    if (typeof IntersectionObserver === 'undefined') return;
    
    const options = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    // 중간 광고 관찰자
    const midAdObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                adManager.showMidAd();
                midAdObserver.unobserve(entry.target);
            }
        });
    }, options);
    
    // 결과 광고 관찰자
    const resultAdObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                adManager.showResultAd();
                resultAdObserver.unobserve(entry.target);
            }
        });
    }, options);
    
    // 관찰 대상 등록
    const midAd = document.getElementById('adMid');
    const resultAd = document.getElementById('adResult');
    
    if (midAd) midAdObserver.observe(midAd);
    if (resultAd) resultAdObserver.observe(resultAd);
};

// 사랑 성향 테스트 질문 데이터
const questions = [
    {
        question: "첫 데이트 장소를 정할 때 당신의 선택은?",
        answers: [
            { text: "분위기 좋은 카페에서 대화", type: "romantic", score: 3 },
            { text: "영화관에서 영화 감상", type: "companion", score: 2 },
            { text: "놀이공원에서 신나게", type: "passionate", score: 3 },
            { text: "조용한 박물관이나 전시회", type: "thoughtful", score: 2 }
        ]
    },
    {
        question: "연인과 갈등이 생겼을 때 당신의 해결 방식은?",
        answers: [
            { text: "즉시 대화로 해결하려 한다", type: "passionate", score: 3 },
            { text: "시간을 두고 차분히 생각한다", type: "thoughtful", score: 3 },
            { text: "감정을 표현하며 솔직하게 말한다", type: "romantic", score: 2 },
            { text: "서로 양보하며 타협점을 찾는다", type: "companion", score: 3 }
        ]
    },
    {
        question: "연인에게 사랑을 표현하는 당신만의 방식은?",
        answers: [
            { text: "로맨틱한 편지나 메시지", type: "romantic", score: 3 },
            { text: "실용적인 선물이나 도움", type: "companion", score: 3 },
            { text: "스킨십이나 직접적인 표현", type: "passionate", score: 3 },
            { text: "시간을 내어 함께 있어주기", type: "thoughtful", score: 2 }
        ]
    },
    {
        question: "이상적인 연애 기간에 대한 당신의 생각은?",
        answers: [
            { text: "평생 함께할 수 있을 만큼 길게", type: "companion", score: 3 },
            { text: "서로를 충분히 알 수 있을 정도", type: "thoughtful", score: 3 },
            { text: "감정이 식지 않을 만큼 적당히", type: "passionate", score: 2 },
            { text: "운명이라면 기간은 중요하지 않다", type: "romantic", score: 3 }
        ]
    },
    {
        question: "연인과의 미래를 계획할 때 가장 중요하게 생각하는 것은?",
        answers: [
            { text: "서로에 대한 변하지 않는 사랑", type: "romantic", score: 3 },
            { text: "현실적인 조건과 안정성", type: "companion", score: 3 },
            { text: "함께 꿈꾸는 목표와 열정", type: "passionate", score: 3 },
            { text: "서로를 이해하고 존중하는 마음", type: "thoughtful", score: 3 }
        ]
    },
    {
        question: "연인이 힘들어할 때 당신의 위로 방법은?",
        answers: [
            { text: "따뜻한 말과 포옹으로 위로", type: "romantic", score: 3 },
            { text: "실질적인 해결책을 함께 찾기", type: "companion", score: 3 },
            { text: "즐거운 일로 기분 전환시키기", type: "passionate", score: 2 },
            { text: "조용히 곁에서 들어주기", type: "thoughtful", score: 3 }
        ]
    },
    {
        question: "연인과 함께 있을 때 가장 행복한 순간은?",
        answers: [
            { text: "서로를 바라보며 웃을 때", type: "romantic", score: 3 },
            { text: "일상을 편안하게 공유할 때", type: "companion", score: 3 },
            { text: "새로운 도전을 함께 할 때", type: "passionate", score: 3 },
            { text: "깊은 대화를 나눌 때", type: "thoughtful", score: 3 }
        ]
    },
    {
        question: "연애에서 가장 중요하다고 생각하는 요소는?",
        answers: [
            { text: "마음이 통하는 감정적 교감", type: "romantic", score: 3 },
            { text: "서로를 믿고 의지하는 신뢰", type: "companion", score: 3 },
            { text: "서로에게 끌리는 매력", type: "passionate", score: 3 },
            { text: "가치관과 생각이 맞는 것", type: "thoughtful", score: 3 }
        ]
    },
    {
        question: "연인과의 기념일을 보내는 당신의 스타일은?",
        answers: [
            { text: "특별한 장소에서 로맨틱하게", type: "romantic", score: 3 },
            { text: "집에서 편안하게 함께", type: "companion", score: 2 },
            { text: "흥미진진한 액티비티로", type: "passionate", score: 3 },
            { text: "의미 있는 장소에서 조용히", type: "thoughtful", score: 2 }
        ]
    },
    {
        question: "연인에게 실망했을 때 당신의 반응은?",
        answers: [
            { text: "상처받은 마음을 솔직하게 표현", type: "romantic", score: 2 },
            { text: "대화를 통해 문제를 해결하려 함", type: "companion", score: 3 },
            { text: "감정을 드러내며 즉각 반응", type: "passionate", score: 2 },
            { text: "시간을 두고 신중하게 생각", type: "thoughtful", score: 3 }
        ]
    },
    {
        question: "연인과 헤어질 위기에 놓였을 때 당신의 선택은?",
        answers: [
            { text: "사랑한다면 끝까지 붙잡는다", type: "romantic", score: 3 },
            { text: "현실적으로 관계를 재평가한다", type: "companion", score: 2 },
            { text: "감정에 따라 결정한다", type: "passionate", score: 2 },
            { text: "서로를 위해 최선의 선택을 고민", type: "thoughtful", score: 3 }
        ]
    },
    {
        question: "연인과의 소통에서 가장 중요하게 생각하는 것은?",
        answers: [
            { text: "마음을 전하는 감정적 표현", type: "romantic", score: 3 },
            { text: "서로의 일상과 생각 공유", type: "companion", score: 3 },
            { text: "솔직하고 직접적인 대화", type: "passionate", score: 3 },
            { text: "깊이 있고 진정성 있는 대화", type: "thoughtful", score: 3 }
        ]
    }
];

// 사랑 성향 결과 데이터
const results = {
    romantic: {
        title: "💕 로맨틱형",
        subtitle: "감성적이고 낭만적인 사랑을 추구하는 당신",
        description: "당신은 사랑에 있어서 감정과 낭만을 가장 중요하게 생각하는 로맨틱한 성향의 소유자입니다. 영화나 소설 같은 이상적인 사랑을 꿈꾸며, 연인과의 감정적 교감을 무엇보다 소중히 여깁니다.",
        characteristics: [
            "감정 표현이 풍부하고 솔직함",
            "로맨틱한 분위기와 이벤트를 좋아함",
            "연인과의 감정적 유대감을 중시",
            "사랑에 대한 이상이 높음",
            "상상력이 풍부하고 창의적"
        ],
        loveStyle: "연애에서는 마치 영화의 주인공처럼 낭만적인 순간들을 만들어가는 것을 좋아합니다. 편지, 선물, 서프라이즈 등으로 사랑을 표현하며, 연인과의 특별한 추억 만들기를 중요하게 생각합니다.",
        compatibility: "같은 로맨틱형이나 이해심이 깊은 신중형과 잘 어울립니다. 현실적인 동반자형과도 서로 보완하며 균형 잡힌 관계를 만들 수 있습니다.",
        advice: "때로는 현실적인 면도 고려하고, 상대방의 표현 방식을 이해하려 노력하세요. 지나친 이상은 실망으로 이어질 수 있습니다.",
        icon: "💕",
        bgColor: "linear-gradient(135deg, #ff9a9e, #fecfef)",
        textColor: "#d63384"
    },
    passionate: {
        title: "🔥 열정형",
        subtitle: "강렬하고 역동적인 사랑을 추구하는 당신",
        description: "당신은 사랑에 있어서 강렬한 감정과 열정을 중요하게 생각하는 타입입니다. 뜨거운 사랑을 추구하며, 연인과 함께 새로운 도전과 모험을 즐기는 것을 좋아합니다.",
        characteristics: [
            "감정 표현이 직접적이고 강렬함",
            "새로운 경험과 도전을 좋아함",
            "즉흥적이고 활동적인 성향",
            "연인과의 깊은 유대감을 빠르게 형성",
            "변화와 자극을 추구함"
        ],
        loveStyle: "연애에서는 강렬하고 열정적인 사랑을 추구합니다. 연인과 함께 다양한 활동을 하며 추억을 쌓고, 감정을 솔직하고 직접적으로 표현하는 것을 좋아합니다.",
        compatibility: "같은 열정형이나 모험을 좋아하는 이상형과 잘 맞습니다. 안정을 추구하는 동반자형과는 서로 다른 매력으로 끌릴 수 있습니다.",
        advice: "때로는 상대방의 속도에 맞춰주고, 안정적인 관계의 소중함도 인정해보세요. 지나친 강렬함은 상대를 부담스럽게 할 수 있습니다.",
        icon: "🔥",
        bgColor: "linear-gradient(135deg, #ff6b6b, #ffa726)",
        textColor: "#d32f2f"
    },
    companion: {
        title: "🤝 동반자형",
        subtitle: "안정적이고 신뢰할 수 있는 사랑을 추구하는 당신",
        description: "당신은 사랑에 있어서 안정성과 신뢰를 가장 중요하게 생각하는 동반자형입니다. 평생을 함께할 수 있는 든든한 파트너를 원하며, 서로를 지지하고 믿는 관계를 추구합니다.",
        characteristics: [
            "안정적이고 신뢰할 수 있는 성격",
            "현실적이고 실용적인 사고",
            "상대방에 대한 배려심이 깊음",
            "갈등보다는 조화를 추구",
            "장기적인 관점에서 관계를 봄"
        ],
        loveStyle: "연애에서는 서로를 의지하고 지지하는 든든한 관계를 만들어갑니다. 일상을 함께 나누고, 서로의 꿈과 목표를 응원하며, 실질적인 도움을 주는 것을 사랑의 표현으로 생각합니다.",
        compatibility: "같은 동반자형이나 신중형과 가장 잘 어울립니다. 로맨틱형과도 서로 부족한 부분을 채워주며 좋은 관계를 만들 수 있습니다.",
        advice: "때로는 감정적인 표현도 중요함을 기억하고, 상대방의 로맨틱한 면도 이해하려 노력하세요. 너무 현실적이기만 하면 재미없을 수 있습니다.",
        icon: "🤝",
        bgColor: "linear-gradient(135deg, #4fc3f7, #29b6f6)",
        textColor: "#0277bd"
    },
    thoughtful: {
        title: "💭 신중형",
        subtitle: "깊이 있고 진정성 있는 사랑을 추구하는 당신",
        description: "당신은 사랑에 있어서 깊이와 진정성을 중요하게 생각하는 신중한 타입입니다. 겉모습보다는 내면을 보며, 시간을 두고 천천히 발전시켜가는 관계를 선호합니다.",
        characteristics: [
            "신중하고 사려깊은 성격",
            "내면의 깊이를 중요시함",
            "감정을 깊이 있게 표현",
            "상대방을 이해하려 노력함",
            "진정성 있는 관계를 추구"
        ],
        loveStyle: "연애에서는 서두르지 않고 천천히 서로를 알아가는 것을 좋아합니다. 깊은 대화를 통해 마음을 나누고, 진정한 이해를 바탕으로 한 사랑을 추구합니다.",
        compatibility: "같은 신중형이나 안정적인 동반자형과 잘 어울립니다. 로맨틱형과도 서로의 감성을 이해하며 깊은 관계를 만들 수 있습니다.",
        advice: "때로는 좀 더 적극적으로 감정을 표현하고, 상대방의 다른 방식도 받아들여보세요. 너무 신중하면 기회를 놓칠 수 있습니다.",
        icon: "💭",
        bgColor: "linear-gradient(135deg, #81c784, #66bb6a)",
        textColor: "#388e3c"
    },
    ideal: {
        title: "🌟 이상형",
        subtitle: "완벽하고 특별한 사랑을 추구하는 당신",
        description: "당신은 사랑에 있어서 완벽함과 특별함을 추구하는 이상주의적 성향을 가지고 있습니다. 평범함보다는 독특하고 의미 있는 사랑을 원하며, 높은 기준을 가지고 있습니다.",
        characteristics: [
            "이상이 높고 완벽주의적",
            "독창적이고 창의적인 사고",
            "특별함을 추구하는 성향",
            "미적 감각이 뛰어남",
            "자신만의 가치관이 뚜렷함"
        ],
        loveStyle: "연애에서는 평범하지 않은 특별한 관계를 만들고 싶어합니다. 독특한 데이트나 의미 있는 활동을 통해 서로만의 특별한 추억을 만들어가는 것을 좋아합니다.",
        compatibility: "비슷한 이상을 가진 이상형이나 열정적인 열정형과 잘 어울립니다. 현실적인 동반자형과는 서로 다른 관점을 통해 배울 수 있습니다.",
        advice: "완벽한 사랑은 없다는 것을 인정하고, 상대방의 있는 그대로의 모습도 사랑해보세요. 지나친 이상은 실망을 가져올 수 있습니다.",
        icon: "🌟",
        bgColor: "linear-gradient(135deg, #ce93d8, #ba68c8)",
        textColor: "#7b1fa2"
    },
    complex: {
        title: "🎭 복합형",
        subtitle: "다양한 사랑의 모습을 가진 당신",
        description: "당신은 한 가지 사랑 스타일로 정의하기 어려운 복합적인 성향을 가지고 있습니다. 상황과 상대에 따라 다양한 모습을 보이며, 풍부한 감정과 표현력을 가지고 있습니다.",
        characteristics: [
            "다면적이고 복합적인 성격",
            "상황에 따른 적응력이 뛰어남",
            "다양한 감정 표현이 가능",
            "여러 관점을 이해할 수 있음",
            "변화하는 매력을 가짐"
        ],
        loveStyle: "연애에서는 때로는 로맨틱하게, 때로는 열정적으로, 때로는 안정적으로 다양한 모습을 보입니다. 상대방과 상황에 맞춰 유연하게 사랑을 표현하는 것이 특징입니다.",
        compatibility: "어떤 타입과도 잘 어울릴 수 있는 장점이 있습니다. 상대방의 성향을 이해하고 맞춰줄 수 있는 능력이 뛰어납니다.",
        advice: "자신의 진정한 감정이 무엇인지 파악하고, 일관성 있는 모습도 보여주세요. 너무 변화무쌍하면 상대가 혼란스러워할 수 있습니다.",
        icon: "🎭",
        bgColor: "linear-gradient(135deg, #ffb74d, #ffa726)",
        textColor: "#f57c00"
    }
};

// 전역 변수
let currentQuestion = 0;
let loveScores = {};
let answers = [];
let totalQuestions = questions.length;

// DOM 요소
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const analysisPopup = document.getElementById('analysisPopup');

// 이벤트 리스너 설정 함수
function setupEventListeners() {
    console.log('이벤트 리스너 설정 중...');
    
    // 시작 버튼
    const startBtn = document.querySelector('.start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startTest);
        console.log('시작 버튼 이벤트 리스너 등록 완료');
    }
    
    // 카카오 공유 버튼들
    document.querySelectorAll('.kakao-share').forEach(btn => {
        btn.addEventListener('click', shareKakao);
    });
    
    console.log('모든 이벤트 리스너 설정 완료');
}

// 테스트 시작
function startTest() {
    console.log('사랑 성향 테스트 시작 함수 호출됨');
    
    // 변수 초기화
    currentQuestion = 0;
    loveScores = {
        romantic: 0,
        passionate: 0,
        companion: 0,
        thoughtful: 0,
        ideal: 0,
        complex: 0
    };
    answers = [];
    
    console.log('사랑 성향 테스트 시작 - 변수 초기화 완료');
    
    startPage.classList.add('hidden');
    questionPage.classList.remove('hidden');
    showQuestion();
}

// 질문 표시
function showQuestion() {
    console.log(`질문 ${currentQuestion + 1} 표시 중...`);
    
    const question = questions[currentQuestion];
    const questionElement = document.querySelector('.question');
    const answersElement = document.querySelector('.answers');
    const questionNumElement = document.getElementById('questionNum');
    const progressElement = document.querySelector('.progress');
    
    questionElement.textContent = question.question;
    questionNumElement.textContent = `${currentQuestion + 1}/${totalQuestions}`;
    
    console.log(`질문 표시: ${currentQuestion + 1}/${totalQuestions}`);
    
    // 진행률 업데이트
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;
    progressElement.style.width = progress + '%';
    
    // 3번째 질문 후 중간 광고 표시
    if (currentQuestion === 3) {
        adManager.showMidAd();
    }
    
    // 답변 옵션 생성
    answersElement.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const answerElement = document.createElement('div');
        answerElement.className = 'answer';
        answerElement.textContent = answer.text;
        answerElement.addEventListener('click', () => selectAnswer(index, answer.type, answer.score));
        answersElement.appendChild(answerElement);
    });
    
    console.log(`답변 옵션 ${question.answers.length}개 생성 완료`);
}

// 답변 선택
function selectAnswer(index, type, score) {
    const answerElements = document.querySelectorAll('.answer');
    
    // 모든 답변의 선택 상태 제거
    answerElements.forEach(el => el.classList.remove('selected'));
    
    // 선택한 답변 표시
    answerElements[index].classList.add('selected');
    
    // 이전에 이 질문에 답한 적이 있다면 점수 차감
    if (answers[currentQuestion]) {
        const prevAnswer = answers[currentQuestion];
        loveScores[prevAnswer.type] -= prevAnswer.score;
    }
    
    // 스코어 저장 및 누적
    answers[currentQuestion] = {
        questionIndex: currentQuestion,
        answerIndex: index,
        type: type,
        score: score
    };
    
    loveScores[type] += score;
    
    console.log(`질문 ${currentQuestion + 1}: ${type} +${score}점 | 현재 점수:`, loveScores);
    
    // 다음 질문으로 이동 (딜레이 추가)
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < totalQuestions) {
            showQuestion();
        } else {
            console.log('최종 점수:', loveScores);
            showAnalysis();
        }
    }, 500);
}

// 분석 팝업 표시
function showAnalysis() {
    console.log('분석 팝업 표시 시작');
    
    questionPage.classList.add('hidden');
    analysisPopup.classList.remove('hidden');
    
    // 카운트다운 시작
    let countdown = 8;
    const countdownElement = document.querySelector('.countdown');
    
    console.log('카운트다운 시작: 8초');
    
    const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        console.log(`카운트다운: ${countdown}초 남음`);
        
        if (countdown <= 0) {
            clearInterval(timer);
            console.log('카운트다운 완료 - 결과 페이지로 이동');
            showResult();
        }
    }, 1000);
}

// 결과 표시
function showResult() {
    console.log('결과 페이지 표시 시작');
    
    analysisPopup.classList.add('hidden');
    resultPage.classList.remove('hidden');
    
    // 가장 높은 점수의 사랑 성향 찾기
    const resultType = getResultType();
    console.log(`결과 타입: ${resultType}`, loveScores);
    
    // 결과 데이터 가져오기
    const result = results[resultType];
    if (!result) {
        console.error(`결과 데이터를 찾을 수 없습니다: ${resultType}`);
        return;
    }
    
    // 결과 표시
    const resultImg = document.querySelector('.result-img');
    const resultContent = document.querySelector('.result-content');
    
    if (resultImg) {
        resultImg.style.background = result.bgColor;
        resultImg.innerHTML = `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 60px;">${result.icon}</div>`;
    }
    
    if (resultContent) {
        resultContent.innerHTML = `
            <h3 style="font-size: 1.8em; margin-bottom: 10px; color: ${result.textColor}; font-weight: bold;">${result.title}</h3>
            <p style="font-size: 1.1em; color: #666; margin-bottom: 20px;">${result.subtitle}</p>
            <p style="margin-bottom: 25px; font-size: 1.1em; line-height: 1.6;">${result.description}</p>
            
            <div style="background: white; padding: 25px; border-radius: 15px; text-align: left; border-left: 5px solid ${result.textColor}; margin-bottom: 20px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
                <h4 style="color: ${result.textColor}; margin-bottom: 15px; font-size: 1.3em;">✨ 주요 특징</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    ${result.characteristics.map(item => `<li style="margin-bottom: 8px; line-height: 1.5;">${item}</li>`).join('')}
                </ul>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; text-align: left; border: 2px solid ${result.textColor}20; margin-bottom: 20px;">
                <h4 style="color: ${result.textColor}; margin-bottom: 15px; font-size: 1.3em;">💕 연애 스타일</h4>
                <p style="line-height: 1.6; margin: 0;">${result.loveStyle}</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 25px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #2196F3;">
                <h4 style="color: #1976d2; margin-bottom: 15px; font-size: 1.3em;">💑 궁합</h4>
                <p style="line-height: 1.6; margin: 0;">${result.compatibility}</p>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
                <h4 style="color: #856404; margin-bottom: 10px;">💡 연애 조언</h4>
                <p style="color: #856404; font-size: 0.95em; line-height: 1.5; margin: 0;">
                    ${result.advice}
                </p>
            </div>
            
            <div style="background: ${result.bgColor}; padding: 20px; border-radius: 10px; font-weight: bold; color: white; text-align: center; border: 2px solid ${result.textColor};">
                🎯 당신의 사랑 성향: ${result.title}
            </div>
        `;
    }
    
    // 결과 페이지 광고 표시
    adManager.showResultAd();
    
    console.log('결과 표시 완료');
}

// 결과 타입 결정 함수
function getResultType() {
    let maxScore = 0;
    let resultType = 'complex';
    
    // 가장 높은 점수 찾기
    for (const [type, score] of Object.entries(loveScores)) {
        if (score > maxScore) {
            maxScore = score;
            resultType = type;
        }
    }
    
    // 점수가 비슷한 경우 복합형으로 분류
    const scoreValues = Object.values(loveScores);
    const sortedScores = scoreValues.sort((a, b) => b - a);
    
    if (sortedScores[0] - sortedScores[1] <= 2) {
        resultType = 'complex';
    }
    
    console.log(`결과 결정: ${resultType} (최고점수: ${maxScore})`);
    return resultType;
}

// 카카오 공유
function shareKakao() {
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        const resultType = getResultType();
        const result = results[resultType];
        
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '내 사랑 성향 분석 테스트',
                description: `나의 사랑 성향은 ${result.title}! 당신의 연애 스타일은?`,
                imageUrl: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcvZE8M%2FbtsN7fPuC9x%2FGksZxnHw5e4fCfljxwN5Hk%2Fimg.jpg',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href
                }
            },
            buttons: [
                {
                    title: '테스트 하기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href
                    }
                }
            ]
        });
    } else {
        // 카카오 SDK가 없을 경우 URL 복사
        copyToClipboard();
    }
}

// URL 클립보드 복사
function copyToClipboard() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('링크가 복사되었습니다!');
        });
    } else {
        // 구형 브라우저 대응
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('링크가 복사되었습니다!');
    }
}

// 이미지 우클릭 방지
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

// F12 개발자 도구 방지 (기본적인 수준)
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        return false;
    }
});

// 텍스트 선택 방지
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

// 드래그 방지
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});

// 전역 함수로 노출
window.startTest = startTest;
window.shareKakao = shareKakao;

// [광고] 페이지 로드 시 초기화 및 Kakao SDK 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded 이벤트 발생');
    
    // Kakao SDK 초기화
    if (typeof Kakao !== 'undefined') {
        if (!Kakao.isInitialized()) {
            Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
            console.log('Kakao SDK 초기화 완료');
        }
    } else {
        console.warn('Kakao SDK가 로드되지 않았습니다');
    }
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
    
    console.log('페이지 초기화 완료');
});
