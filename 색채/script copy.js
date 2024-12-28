// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 색채 질문 목록
const questions = [
    {
        text: "지금 당신의 기분을 가장 잘 표현하는 색은?",
        colors: [
            { hex: "#FF6B6B", name: "밝은 빨강" },
            { hex: "#4ECDC4", name: "청록색" },
            { hex: "#FFE66D", name: "노란색" },
            { hex: "#95E1D3", name: "민트색" }
        ]
    },
    {
        text: "당신의 이상적인 휴가지의 색깔은?",
        colors: [
            { hex: "#48B1BF", name: "하늘색" },
            { hex: "#06BEB6", name: "에메랄드" },
            { hex: "#FFB88C", name: "살구색" },
            { hex: "#DDD6F3", name: "라벤더" }
        ]
    },
    {
        text: "스트레스를 받을 때 보고 싶은 색은?",
        colors: [
            { hex: "#96E6A1", name: "연두색" },
            { hex: "#D4FC79", name: "라임색" },
            { hex: "#84FAB0", name: "민트색" },
            { hex: "#8FD3F4", name: "하늘색" }
        ]
    },
    {
        text: "당신의 방을 꾸민다면 어떤 색으로 하고 싶나요?",
        colors: [
            { hex: "#FA709A", name: "분홍색" },
            { hex: "#FEE140", name: "노란색" },
            { hex: "#00C6FB", name: "파란색" },
            { hex: "#A8EDEA", name: "민트색" }
        ]
    },
    {
        text: "가장 마음이 안정되는 색은?",
        colors: [
            { hex: "#F5F7FA", name: "화이트" },
            { hex: "#B8C6DB", name: "그레이" },
            { hex: "#E2D1C3", name: "베이지" },
            { hex: "#96E6A1", name: "연두색" }
        ]
    },
    {
        text: "당신이 생각하는 사랑의 색은?",
        colors: [
            { hex: "#FF9A9E", name: "연분홍" },
            { hex: "#FF6B6B", name: "빨간색" },
            { hex: "#FBC2EB", name: "라이트핑크" },
            { hex: "#F6D5F7", name: "파스텔퍼플" }
        ]
    },
    {
        text: "당신의 이상적인 직장 인테리어 색은?",
        colors: [
            { hex: "#E6E9F0", name: "밝은회색" },
            { hex: "#FFFFFF", name: "화이트" },
            { hex: "#F0F2F0", name: "아이보리" },
            { hex: "#E0EAFC", name: "연하늘색" }
        ]
    },
    {
        text: "당신의 에너지를 가장 잘 표현하는 색은?",
        colors: [
            { hex: "#FFD700", name: "골드" },
            { hex: "#FF7F50", name: "코랄" },
            { hex: "#40E0D0", name: "터콰이즈" },
            { hex: "#9370DB", name: "보라" }
        ]
    },
    {
        text: "우울할 때 보고 싶은 색은?",
        colors: [
            { hex: "#FFF3B0", name: "레몬크림" },
            { hex: "#AAFFA9", name: "연두" },
            { hex: "#A1C4FD", name: "파스텔블루" },
            { hex: "#FFB6C1", name: "라이트핑크" }
        ]
    },
    {
        text: "당신이 꿈꾸는 미래의 색은?",
        colors: [
            { hex: "#A1FFCE", name: "민트" },
            { hex: "#FAFFD1", name: "레몬" },
            { hex: "#A8C0FF", name: "하늘" },
            { hex: "#FFB8B8", name: "살구" }
        ]
    }
];

// 색채 결과 데이터
const colorResults = {
    warm: {
        title: "따뜻한 감성의 소유자",
        description: 
            "당신은 따뜻하고 포근한 에너지를 가진 사람입니다.\n" + 
            "사랑과 관심으로 주변 사람들을 보살피는 것을 좋아하며,\n" + 
            "풍부한 감성으로 예술적인 감각을 지니고 있습니다.\n" + 
            "당신의 따뜻한 마음은 주변 사람들에게 큰 위로가 됩니다.\n" + 
            "당신은 언제나 주변 사람들에게 긍정적이고 따뜻한 영향을 미칩니다.\n" + 
            "사랑과 배려로 가득한 당신의 존재는 항상 따뜻한 분위기를 만들어냅니다.\n" + 
            "또한, 예술적인 감각은 당신을 더욱 특별한 사람으로 만듭니다.\n" + 
            "당신은 다른 사람들에게 영감을 주며, 창의적이고 감동적인 모습을 보입니다.\n" + 
            "당신의 에너지는 주변을 더욱 밝고 행복한 곳으로 변화시킵니다.\n" + 
            "따뜻한 마음과 긍정적인 기운을 통해 사람들에게 위로를 선사합니다.\n",
        traits: [
            "따뜻한 마음으로 타인을 배려하는 성격",
            "풍부한 감성과 예술적 재능 보유",
            "부드럽고 친근한 분위기 연출",
            "사랑이 넘치고 포근한 에너지"
        ],
        recommendedColors: [
            { color: "#FFB88C", name: "살구색" },
            { color: "#FA709A", name: "로즈핑크" },
            { color: "#FFE66D", name: "레몬옐로우" },
            { color: "#E2D1C3", name: "베이지" }
        ]
    },
    cool: {
        title: "차분한 지성의 소유자",
        description: 
            "당신은 차분하고 이성적인 성격의 소유자입니다.\n" + 
            "깊이 있는 통찰력과 논리적인 사고로 문제를 해결하는 능력이 뛰어나며,\n" + 
            "신중하고 안정적인 에너지를 가지고 있습니다.\n" + 
            "당신의 침착한 판단력은 주변 사람들에게 신뢰를 줍니다.\n" + 
            "당신은 언제나 상황을 냉철하게 분석하고, 최선의 결정을 내리려 합니다.\n" + 
            "당신의 신중함과 논리적인 사고는 주변 사람들에게 큰 도움을 줍니다.\n" + 
            "차분한 성격은 다른 사람들에게 안정감을 주며, 갈등을 해소하는 데 중요한 역할을 합니다.\n" + 
            "당신의 깊은 통찰력은 문제를 해결할 때 큰 장점으로 작용합니다.\n" + 
            "논리적이고 정확한 판단으로 주변에 신뢰를 쌓아갑니다.\n" + 
            "당신의 차분한 에너지는 언제나 믿음직스럽고 안정적입니다.\n",
        traits: [
            "논리적이고 체계적인 사고방식",
            "차분하고 안정적인 성격",
            "깊이 있는 통찰력과 지혜",
            "신중하고 정확한 판단력"
        ],
        recommendedColors: [
            { color: "#4ECDC4", name: "민트블루" },
            { color: "#00C6FB", name: "스카이블루" },
            { color: "#8FD3F4", name: "파스텔블루" },
            { color: "#DDD6F3", name: "라벤더" }
        ]
    },
    bright: {
        title: "밝은 에너지의 소유자",
        description: 
            "당신은 밝고 긍정적인 에너지가 넘치는 사람입니다.\n" + 
            "주변 사람들에게 활력을 주는 매력적인 성격으로,\n" + 
            "창의적이고 독특한 아이디어로 새로운 시도를 즐깁니다.\n" + 
            "당신의 밝은 에너지는 주변을 환하게 만듭니다.\n" + 
            "긍정적이고 활발한 성격은 언제나 사람들에게 좋은 영향을 미칩니다.\n" + 
            "주위 사람들에게 긍정적인 변화를 일으키며, 활력을 불어넣습니다.\n" + 
            "당신의 창의성은 항상 새로운 아이디어와 도전을 끌어냅니다.\n" + 
            "밝은 에너지는 언제나 주변을 밝고 희망찬 분위기로 만들어줍니다.\n" + 
            "주변 사람들이 당신과 함께 있을 때 긍정적인 기운을 느끼게 됩니다.\n" + 
            "당신의 에너지는 세상을 더 밝고 즐겁게 만듭니다.\n",
        traits: [
            "긍정적이고 밝은 성격",
            "창의적이고 독특한 아이디어",
            "활발하고 적극적인 태도",
            "주변에 활력을 주는 매력"
        ],
        recommendedColors: [
            { color: "#FEE140", name: "밝은 노랑" },
            { color: "#96E6A1", name: "라이트그린" },
            { color: "#D4FC79", name: "라임" },
            { color: "#FFE66D", name: "레몬" }
        ]
    }
};

let currentQuestion = 0;
let colorScores = {
    warm: 0,
    cool: 0,
    bright: 0
};

// DOM 요소
const startSection = document.getElementById('start-section');
const questionSection = document.getElementById('question-section');
const resultSection = document.getElementById('result-section');
const adPopup = document.getElementById('ad-popup');

// 시작 버튼 이벤트
document.getElementById('start-btn').addEventListener('click', () => {
    startSection.style.display = 'none';
    questionSection.style.display = 'block';
    showQuestion();
});

// 질문 표시 함수
function showQuestion() {
    const progressBar = document.querySelector('.progress');
    const questionCounter = document.querySelector('.question-counter');
    const questionText = document.getElementById('question-text');
    const colorChoices = document.querySelector('.color-choices');

    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    questionCounter.textContent = `${currentQuestion + 1}/${questions.length}`;
    questionText.textContent = questions[currentQuestion].text;

    // 색상 선택지 생성
    colorChoices.innerHTML = '';
    questions[currentQuestion].colors.forEach(color => {
        const choice = document.createElement('div');
        choice.className = 'color-choice';
        choice.style.backgroundColor = color.hex;
        choice.setAttribute('title', color.name); // 툴팁으로 색상 이름 표시
        choice.onclick = () => handleAnswer(color);
        colorChoices.appendChild(choice);
    });
}

// 답변 처리 함수
function handleAnswer(color) {
    // 색상에 따른 점수 계산
    if (color.hex.includes('FF') || color.hex.includes('FA') || color.hex.includes('E2')) {
        colorScores.warm++;
    } else if (color.hex.includes('4E') || color.hex.includes('00') || color.hex.includes('8F')) {
        colorScores.cool++;
    } else {
        colorScores.bright++;
    }

    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showAdPopup();
    }
}

// 광고 팝업 표시 함수
function showAdPopup() {
    questionSection.style.display = 'none';
    adPopup.style.display = 'flex';
    
    // 팝업 광고 초기화
    initializePopupAd();

    let countdown = 7;
    const countdownElement = document.querySelector('.countdown');
    
    const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            adPopup.style.display = 'none';
            showResult();
        }
    }, 1000);
}

// 결과 계산 함수
function calculateResult() {
    const maxScore = Math.max(colorScores.warm, colorScores.cool, colorScores.bright);
    if (colorScores.warm === maxScore) return 'warm';
    if (colorScores.cool === maxScore) return 'cool';
    return 'bright';
}

// 결과 표시 함수
function showResult() {
    resultSection.style.display = 'block';
    const resultType = calculateResult();
    const result = colorResults[resultType];

    // 메인 컬러 설정
    document.querySelector('.main-color').style.backgroundColor = result.recommendedColors[0].color;
    
    // 서브 컬러 설정
    const subColors = document.querySelectorAll('.sub-color');
    subColors[0].style.backgroundColor = result.recommendedColors[1].color;
    subColors[1].style.backgroundColor = result.recommendedColors[2].color;

    // 결과 텍스트 설정
    document.getElementById('color-result').textContent = result.title;
    document.getElementById('result-title').textContent = result.title;
    document.getElementById('result-description').textContent = result.description;

    // 특징 리스트 설정
    const traitsList = document.getElementById('traits-list');
    traitsList.innerHTML = result.traits
        .map(trait => `<li>${trait}</li>`)
        .join('');

    // 추천 색상 표시
    const recommendedColors = document.getElementById('recommended-colors');
    recommendedColors.innerHTML = result.recommendedColors
        .map(color => `
            <div class="recommended-color" style="background-color: ${color.color}">
                <span class="color-name">${color.name}</span>
            </div>
        `)
        .join('');
}

// 공유하기 버튼
document.querySelector('.share-btn').addEventListener('click', () => {
    const resultType = calculateResult();
    const result = colorResults[resultType];
    
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '나의 색채 심리 테스트',
            description: `당신은 "${result.title}" 입니다!\n${result.description.slice(0, 50)}...`,
            imageUrl: 'YOUR_IMAGE_URL', // 실제 이미지 URL로 교체 필요
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

// 다시하기 버튼
document.querySelector('.retry-btn').addEventListener('click', () => {
    currentQuestion = 0;
    colorScores = {warm: 0, cool: 0, bright: 0};
    resultSection.style.display = 'none';
    startSection.style.display = 'block';
});

// 광고 초기화 함수
function initializePopupAd() {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('광고 초기화 실패:', e);
    }
}

// 페이지 로드 시 광고 초기화
window.onload = function() {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('상단 광고 초기화 실패:', e);
    }
};