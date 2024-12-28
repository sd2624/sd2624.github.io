// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 전역 변수
let currentQuestion = 0;
let scores = {
    lion: 0,
    dolphin: 0,
    wolf: 0,
    eagle: 0,
    owl: 0
};

// 질문 목록
const questions = [
    {
        text: "어려운 상황에서 당신의 첫 반응은?",
        options: [
            { text: "신중하게 상황을 분석한다", type: "owl" },
            { text: "본능적으로 빠르게 대처한다", type: "wolf" },
            { text: "다른 사람들과 협력 방안을 찾는다", type: "dolphin" },
            { text: "도전 정신을 가지고 맞선다", type: "lion" }
        ]
    },
    {
        text: "당신이 가장 편안함을 느끼는 환경은?",
        options: [
            { text: "조용한 개인 공간", type: "owl" },
            { text: "자연 속의 넓은 공간", type: "eagle" },
            { text: "활기찬 도시의 중심", type: "lion" },
            { text: "사람들과 함께하는 공간", type: "dolphin" }
        ]
    },
    {
        text: "스트레스 상황에서 당신은?",
        options: [
            { text: "혼자만의 시간을 가지며 생각한다", type: "eagle" },
            { text: "적극적으로 문제를 해결한다", type: "lion" },
            { text: "다른 사람과 대화하며 풀어낸다", type: "dolphin" },
            { text: "차분히 해결책을 찾아본다", type: "owl" }
        ]
    },
    {
        text: "당신의 이상적인 주말은?",
        options: [
            { text: "모험적인 활동을 즐긴다", type: "wolf" },
            { text: "친구들과 시간을 보낸다", type: "dolphin" },
            { text: "새로운 것을 배운다", type: "owl" },
            { text: "자유롭게 혼자만의 시간을 보낸다", type: "eagle" }
        ]
    },
    {
        text: "팀 프로젝트에서 당신의 역할은?",
        options: [
            { text: "팀을 이끄는 리더", type: "lion" },
            { text: "아이디어를 제시하는 참모", type: "owl" },
            { text: "분위기를 만드는 무드메이커", type: "dolphin" },
            { text: "실질적인 실행자", type: "wolf" }
        ]
    },
    {
        text: "어려운 결정을 내릴 때 당신은?",
        options: [
            { text: "논리적으로 분석한다", type: "owl" },
            { text: "직관을 믿고 결정한다", type: "wolf" },
            { text: "다른 사람의 조언을 구한다", type: "dolphin" },
            { text: "결단력 있게 선택한다", type: "lion" }
        ]
    },
    {
        text: "당신이 추구하는 삶의 가치는?",
        options: [
            { text: "자유와 모험", type: "eagle" },
            { text: "지혜와 성장", type: "owl" },
            { text: "성공과 인정", type: "lion" },
            { text: "조화와 평화", type: "dolphin" }
        ]
    },
    {
        text: "새로운 도전 앞에서 당신은?",
        options: [
            { text: "신중하게 계획을 세운다", type: "owl" },
            { text: "열정적으로 도전한다", type: "lion" },
            { text: "다른 사람과 함께한다", type: "dolphin" },
            { text: "자유롭게 시도해본다", type: "eagle" }
        ]
    },
    {
        text: "갈등 상황에서 당신은?",
        options: [
            { text: "중립적 입장에서 중재한다", type: "owl" },
            { text: "적극적으로 해결한다", type: "lion" },
            { text: "평화로운 해결을 추구한다", type: "dolphin" },
            { text: "독립적인 판단을 한다", type: "eagle" }
        ]
    },
    {
        text: "당신의 가장 큰 강점은?",
        options: [
            { text: "지혜로운 통찰력", type: "owl" },
            { text: "강인한 리더십", type: "lion" },
            { text: "따뜻한 포용력", type: "dolphin" },
            { text: "자유로운 도전정신", type: "eagle" }
        ]
    }
];

// 동물 결과 데이터
const animalResults = {
    lion: {
        title: "카리스마 넘치는 황금사자",
        image: "사자.png",
        description: "당신은 타고난 리더십과 카리스마를 가진 사자입니다. 강인한 의지와 결단력으로 목표를 향해 나아가는 당신은 주변 사람들에게 신뢰와 존경을 받습니다.",
        traits: [
            "강력한 리더십과 카리스마",
            "명확한 목표의식",
            "책임감이 강하고 신뢰성 있음",
            "도전을 두려워하지 않는 용기"
        ]
    },
    dolphin: {
        title: "따뜻한 마음의 돌고래",
        image: "돌고래.png",
        description: "당신은 뛰어난 공감능력과 친화력을 가진 돌고래입니다. 긍정적인 에너지로 주변 사람들에게 기쁨을 주고, 조화로운 관계를 만드는 재능이 있습니다.",
        traits: [
            "뛰어난 공감능력과 친화력",
            "긍정적이고 밝은 에너지",
            "협동심과 배려심이 강함",
            "창의적인 문제해결 능력"
        ]
    },
    wolf: {
        title: "지혜로운 늑대",
        image: "늑대.png",
        description: "당신은 강한 직관력과 판단력을 가진 늑대입니다. 독립적이면서도 협동심이 있어, 혼자서도 잘하지만 팀에서도 뛰어난 능력을 발휘합니다.",
        traits: [
            "강한 직관력과 통찰력",
            "충성심과 책임감이 강함",
            "전략적 사고능력",
            "독립적이면서도 협동적인 성격"
        ]
    },
    eagle: {
        title: "고고한 독수리",
        image: "독수리.png",
        description: "당신은 넓은 시야와 통찰력을 가진 독수리입니다. 자유로운 영혼과 도전정신으로 새로운 가능성을 향해 끊임없이 날아오릅니다.",
        traits: [
            "넓은 시야와 통찰력",
            "독립적이고 자유로운 영혼",
            "목표를 향한 강한 집중력",
            "결단력 있는 판단력"
        ]
    },
    owl: {
        title: "지혜로운 올빼미",
        image: "올뺴미.png",
        description: "당신은 깊은 지혜와 통찰력을 가진 올빼미입니다. 차분하고 신중한 성격으로 문제의 본질을 꿰뚫어보는 능력이 있습니다.",
        traits: [
            "깊은 지혜와 통찰력",
            "차분하고 신중한 성격",
            "뛰어난 관찰력과 분석력",
            "독립적인 사고방식"
        ]
    }
};

// 테스트 시작
function startTest() {
    document.getElementById('start').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    showQuestion();
}

// 질문 표시
function showQuestion() {
    const progressBar = document.querySelector('.progress');
    const questionCounter = document.querySelector('.question-counter');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.querySelector('.options-container');

    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    questionCounter.textContent = `${currentQuestion + 1}/${questions.length}`;
    questionText.textContent = questions[currentQuestion].text;

    optionsContainer.innerHTML = '';
    questions[currentQuestion].options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option.text;
        button.onclick = () => selectOption(option.type);
        optionsContainer.appendChild(button);
    });
}

// 옵션 선택
function selectOption(type) {
    scores[type]++;
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showAnalysisPopup();
    }
}

// 분석 팝업 표시
function showAnalysisPopup() {
    document.getElementById('question-section').style.display = 'none';
    document.getElementById('analysis-popup').style.display = 'flex';
    
    // 팝업 광고 초기화
    try {
        const popupAd = document.querySelector('.popup-ad');
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('팝업 광고 초기화 실패:', e);
    }
    
    let countdown = 7;
    const countdownElement = document.querySelector('.countdown');
    
    const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);
}

// 결과 계산
function calculateResult() {
    return Object.entries(scores).reduce((a, b) => b[1] > a[1] ? b : a)[0];
}

// 결과 표시
function showResult() {
    document.getElementById('analysis-popup').style.display = 'none';
    document.getElementById('result').style.display = 'block';

    const resultType = calculateResult();
    const result = animalResults[resultType];

    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('animal-image').style.backgroundImage = `url(${result.image})`;
    document.getElementById('resultDescription').textContent = result.description;
    
    const traitsList = document.getElementById('traits-list');
    traitsList.innerHTML = result.traits
        .map(trait => `<li>${trait}</li>`)
        .join('');
}

// 카카오톡 공유
function shareOnKakao() {
    const resultType = calculateResult();
    const result = animalResults[resultType];
    
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '나의 수호동물 테스트',
            description: `당신의 수호동물은 "${result.title}" 입니다!`,
            imageUrl: window.location.origin + '/' + result.image,
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
}

// 다시하기
function retryTest() {
    currentQuestion = 0;
    scores = {lion: 0, dolphin: 0, wolf: 0, eagle: 0, owl: 0};
    document.getElementById('result').style.display = 'none';
    document.getElementById('start').style.display = 'block';
}

// 광고 초기화
window.onload = function() {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('광고 초기화 실패:', e);
    }
};