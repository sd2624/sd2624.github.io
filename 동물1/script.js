// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

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
        text: "당신의 이상적인 주말 보내기 방식은?",
        options: [
            { text: "혼자만의 취미 활동하기", type: "eagle" },
            { text: "친구들과 즐거운 시간 보내기", type: "dolphin" },
            { text: "새로운 도전이나 활동 시도하기", type: "lion" },
            { text: "조용히 책을 읽거나 공부하기", type: "owl" }
        ]
    },
    {
        text: "팀 프로젝트에서 당신이 선호하는 역할은?",
        options: [
            { text: "팀을 이끌고 방향을 제시하는 리더", type: "lion" },
            { text: "팀원들 간의 조화를 이루는 조정자", type: "dolphin" },
            { text: "전략과 계획을 세우는 전략가", type: "owl" },
            { text: "독립적으로 일을 처리하는 실행자", type: "wolf" }
        ]
    },
    {
        text: "스트레스 상황에서 당신의 해소 방법은?",
        options: [
            { text: "혼자만의 시간을 가지며 생각 정리", type: "eagle" },
            { text: "운동이나 활동적인 일로 해소", type: "wolf" },
            { text: "친구들과 대화하며 풀어내기", type: "dolphin" },
            { text: "목표를 향해 더 열심히 노력하기", type: "lion" }
        ]
    },
    {
        text: "당신이 추구하는 가장 중요한 가치는?",
        options: [
            { text: "자유와 독립성", type: "eagle" },
            { text: "지혜와 통찰력", type: "owl" },
            { text: "성공과 성취", type: "lion" },
            { text: "조화와 평화", type: "dolphin" }
        ]
    },
    {
        text: "새로운 환경에서 당신의 적응 방식은?",
        options: [
            { text: "상황을 먼저 관찰하고 분석한다", type: "owl" },
            { text: "적극적으로 나서서 주도한다", type: "lion" },
            { text: "자연스럽게 어울리며 적응한다", type: "dolphin" },
            { text: "독립적으로 자신의 길을 찾는다", type: "eagle" }
        ]
    },
    {
        text: "당신의 의사결정 방식은?",
        options: [
            { text: "논리적 분석을 통한 판단", type: "owl" },
            { text: "직관과 본능적인 판단", type: "wolf" },
            { text: "다른 사람들의 의견 참고", type: "dolphin" },
            { text: "결단력 있는 빠른 판단", type: "lion" }
        ]
    },
    {
        text: "당신이 꿈꾸는 이상적인 미래는?",
        options: [
            { text: "자유롭게 세상을 탐험하는 삶", type: "eagle" },
            { text: "영향력 있는 리더가 되는 것", type: "lion" },
            { text: "깊이 있는 전문가가 되는 것", type: "owl" },
            { text: "사람들과 조화롭게 사는 것", type: "dolphin" }
        ]
    },
    {
        text: "다른 사람들이 보는 당신의 이미지는?",
        options: [
            { text: "카리스마 있고 신뢰감 있는", type: "lion" },
            { text: "지혜롭고 통찰력 있는", type: "owl" },
            { text: "자유롭고 독립적인", type: "eagle" },
            { text: "친근하고 따뜻한", type: "dolphin" }
        ]
    }
];

// 동물 결과 데이터
const animalResults = {
    lion: {
        title: "카리스마 넘치는 황금사자",
        image: "사자.png",
        description: "당신의 수호동물은 용맹하고 카리스마 넘치는 사자입니다. 타고난 리더십과 강인한 정신력을 가지고 있습니다.",
        traits: [
            "강력한 리더십과 카리스마",
            "명확한 목표의식",
            "책임감이 강하고 신뢰성 있음",
            "도전을 두려워하지 않는 용기"
        ],
        advice: "당신의 강인한 의지로 목표를 향해 나아가세요. 하지만 때로는 부드러운 리더십도 필요함을 잊지 마세요."
    },
    dolphin: {
        title: "따뜻한 마음의 돌고래",
        image: "돌고래.png",
        description: "당신의 수호동물은 친근하고 지적인 돌고래입니다. 뛰어난 공감능력과 소통능력을 가지고 있습니다.",
        traits: [
            "뛰어난 공감능력과 친화력",
            "긍정적이고 밝은 에너지",
            "협동심과 배려심이 강함",
            "창의적인 문제해결 능력"
        ],
        advice: "당신의 따뜻한 마음으로 주변 사람들에게 긍정적인 영향을 주세요. 때로는 자신을 위한 시간도 필요합니다."
    },
    wolf: {
        title: "지혜로운 늑대",
        image: "늑대.png",
        description: "당신의 수호동물은 충성스럽고 지혜로운 늑대입니다. 강한 직관력과 판단력을 가지고 있습니다.",
        traits: [
            "강한 직관력과 통찰력",
            "충성심과 책임감이 강함",
            "전략적 사고능력",
            "독립적이면서도 협동적인 성격"
        ],
        advice: "당신의 날카로운 직관을 믿으세요. 하지만 혼자만의 판단에 의존하지 말고 다른 이들의 의견도 들어보세요."
    },
    eagle: {
        title: "고고한 독수리",
        image: "독수리.png",
        description: "당신의 수호동물은 고고하고 날카로운 독수리입니다. 넓은 시야와 통찰력을 가지고 있습니다.",
        traits: [
            "넓은 시야와 통찰력",
            "독립적이고 자유로운 영혼",
            "목표를 향한 강한 집중력",
            "결단력 있는 판단력"
        ],
        advice: "높은 곳에서 전체를 바라보는 시야를 가지세요. 때로는 세세한 부분도 놓치지 말아야 합니다."
    },
    owl: {
        title: "지혜로운 올빼미",
        image: "1.png",
        description: "당신의 수호동물은 지혜롭고 통찰력 있는 올빼미입니다. 깊은 지혜와 날카로운 관찰력을 가지고 있습니다.",
        traits: [
            "깊은 지혜와 통찰력",
            "차분하고 신중한 성격",
            "뛰어난 관찰력과 분석력",
            "독립적인 사고방식"
        ],
        advice: "당신의 지혜를 믿으세요. 하지만 때로는 직관적인 판단도 필요함을 기억하세요."
    }
};

let currentQuestion = 0;
let scores = {
    lion: 0,
    dolphin: 0,
    wolf: 0,
    eagle: 0,
    owl: 0
};

// 테스트 시작
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-section').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    showQuestion();
});

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
    document.getElementById('result-section').style.display = 'block';

    const resultType = calculateResult();
    const result = animalResults[resultType];

    document.getElementById('animal-image').style.backgroundImage = `url(${result.image})`;
    document.getElementById('animal-title').textContent = result.title;
    document.getElementById('animal-description').textContent = result.description;
    
    const traitsList = document.getElementById('traits-list');
    traitsList.innerHTML = result.traits
        .map(trait => `<li>${trait}</li>`)
        .join('');
    
    document.getElementById('animal-advice').textContent = result.advice;
}

// 카카오톡 공유
document.querySelector('.share-btn').addEventListener('click', () => {
    const resultType = calculateResult();
    const result = animalResults[resultType];
    
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '나의 수호동물 테스트',
            description: `당신의 수호동물은 "${result.title}" 입니다!`,
            imageUrl: result.image,
            link: {
                mobileWebUrl: 'https://testpro.site',
                webUrl: 'https://testpro.site'
            }
        },
        buttons: [
            {
                title: '테스트 하기',
                link: {
                    mobileWebUrl: 'https://testpro.site',
                    webUrl: 'https://testpro.site'
                }
            }
        ]
    });
});

// 다시하기
document.querySelector('.retry-btn').addEventListener('click', () => {
    currentQuestion = 0;
    scores = {lion: 0, dolphin: 0, wolf: 0, eagle: 0, owl: 0};
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('start-section').style.display = 'block';
});

// 광고 초기화
window.onload = function() {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('광고 초기화 실패:', e);
    }
};