// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// MBTI 질문 목록
const questions = [
    {
        text: "주말에 나는?",
        choices: [
            { text: "친구들과 만나서 수다 떨기👥", type: "E" },
            { text: "집에서 혼자만의 시간 보내기🏠", type: "I" }
        ]
    },
    {
        text: "새로운 정보를 받아들일 때",
        choices: [
            { text: "오감을 통해 직접 경험하며 배운다👀", type: "S" },
            { text: "상상력과 직관으로 이해한다💭", type: "N" }
        ]
    },
    {
        text: "결정을 내릴 때 주로",
        choices: [
            { text: "논리적으로 분석하여 결정한다🤔", type: "T" },
            { text: "감정과 가치관을 중요시한다💝", type: "F" }
        ]
    },
    {
        text: "일상생활에서 나는",
        choices: [
            { text: "계획을 세우고 그대로 실천한다📝", type: "J" },
            { text: "상황에 따라 유연하게 대처한다🌊", type: "P" }
        ]
    },
    {
        text: "모임에서 나는?",
        choices: [
            { text: "여러 사람과 두루두루 이야기한다🗣️", type: "E" },
            { text: "한두 명과 깊은 대화를 나눈다🤝", type: "I" }
        ]
    },
    {
        text: "문제를 해결할 때",
        choices: [
            { text: "과거의 경험을 토대로 해결한다📚", type: "S" },
            { text: "새로운 방법을 찾아 시도한다💡", type: "N" }
        ]
    },
    {
        text: "갈등 상황에서 나는",
        choices: [
            { text: "객관적 사실을 바탕으로 판단한다⚖️", type: "T" },
            { text: "서로의 감정을 고려하여 해결한다❤️", type: "F" }
        ]
    },
    {
        text: "여행을 갈 때 나는",
        choices: [
            { text: "세세한 일정을 미리 계획한다✈️", type: "J" },
            { text: "즉흥적으로 움직이는게 좋다🎲", type: "P" }
        ]
    },
    {
        text: "에너지를 얻는 방법은?",
        choices: [
            { text: "다른 사람들과 어울리기🎉", type: "E" },
            { text: "혼자만의 시간 가지기🌙", type: "I" }
        ]
    },
    {
        text: "관심을 갖는 것은?",
        choices: [
            { text: "현재의 실제적인 일들👨‍💼", type: "S" },
            { text: "미래의 가능성과 아이디어🚀", type: "N" }
        ]
    },
    {
        text: "선택할 때 중요한 것은?",
        choices: [
            { text: "합리성과 효율성📊", type: "T" },
            { text: "조화와 인간관계🤝", type: "F" }
        ]
    },
    {
        text: "일상생활 스타일은?",
        choices: [
            { text: "체계적이고 계획적으로📋", type: "J" },
            { text: "자유롭고 융통성있게🎨", type: "P" }
        ]
    }
];

// MBTI 결과 데이터
const mbtiResults = {
    "ISTJ": {
        emoji: "👨‍💼",
        title: "청렴결백한 논리주의자",
        description: "신중하고 철저하며 규칙을 중요시하는 당신! 책임감이 강하고 현실적인 성격으로 주변으로부터 신뢰를 받습니다.",
        traits: [
            "체계적이고 논리적인 사고방식",
            "높은 책임감과 성실성",
            "규칙과 전통을 중요시함",
            "신중하고 철저한 성격"
        ],
        famous: "이순재, 김병현"
    },
    "ISFJ": {
        emoji: "🤲",
        title: "용감한 수호자",
        description: "친절하고 배려심이 깊으며, 타인의 감정을 잘 이해하는 성격입니다. 가족이나 친구에게 헌신적인 성향을 보입니다.",
        traits: [
            "배려심 깊고 따뜻한 성격",
            "책임감 있고 신뢰할 수 있는 사람",
            "자기보다 남을 우선시하는 성향",
            "안정적인 환경을 선호"
        ],
        famous: "아이유, 한지민"
    },
    "INFJ": {
        emoji: "🧘‍♀️",
        title: "선의의 옹호자",
        description: "자기 자신과 타인의 감정을 깊이 이해하는 당신! 창의적이고 통찰력이 뛰어나며, 진정성을 중요시합니다.",
        traits: [
            "높은 직관력과 통찰력",
            "개인적인 의미와 가치를 중요시",
            "타인을 돕고 싶은 마음이 큼",
            "창의적이고 독창적인 아이디어"
        ],
        famous: "박보영, 송혜교"
    },
    "INTJ": {
        emoji: "🧠",
        title: "용의주도한 전략가",
        description: "철저하고 계획적인 성격으로 목표를 달성하는 데 집중하는 당신! 매우 독립적이고 분석적인 사고를 중요시합니다.",
        traits: [
            "목표 지향적이고 전략적인 사고",
            "독립적이고 논리적인 성격",
            "효율성과 결과를 중요시",
            "혼자 일하는 것을 선호"
        ],
        famous: "이재용, 송중기"
    },
    "ISTP": {
        emoji: "🔧",
        title: "만능 재주꾼",
        description: "논리적이고 실용적인 성격으로 문제 해결에 능숙한 당신! 급변하는 상황에서도 침착하게 대처하는 능력이 뛰어납니다.",
        traits: [
            "실용적이고 능동적인 사고",
            "문제 해결 능력이 뛰어남",
            "위기 상황에서도 침착함",
            "독립적이고 자유로운 성향"
        ],
        famous: "지드래곤, 김우빈"
    },
    "ISFP": {
        emoji: "🎨",
        title: "호기심 많은 예술가",
        description: "자유롭고 창의적인 성격으로, 예술적인 취미와 활동을 선호합니다. 감정을 중요시하고, 현실보다는 꿈을 추구하는 경향이 있습니다.",
        traits: [
            "자유롭고 창의적인 성향",
            "미적 감각과 예술적인 능력",
            "감정을 소중히 여김",
            "조용하고 내성적"
        ],
        famous: "수지, 김태리"
    },
    "INFP": {
        emoji: "💭",
        title: "열정적인 중재자",
        description: "자신의 가치와 원칙을 매우 중요시하는 당신! 이상주의적이며 타인의 감정을 잘 이해하고, 진심 어린 대화를 선호합니다.",
        traits: [
            "이상주의적이고 꿈이 큼",
            "타인의 감정에 민감하고 공감 능력이 뛰어남",
            "자신의 가치관에 충실",
            "조용하고 내성적"
        ],
        famous: "김연아, 정해인"
    },
    "INTP": {
        emoji: "🔬",
        title: "논리적인 사색가",
        description: "새로운 아이디어와 이론에 대해 깊이 생각하는 성격입니다. 논리적이고 분석적인 사고를 중요시하며 독창적인 아이디어를 선호합니다.",
        traits: [
            "논리적이고 분석적인 사고",
            "새로운 아이디어와 개념에 대해 관심",
            "자유로운 사고와 창의력",
            "내성적이고 독립적인 성격"
        ],
        famous: "유재석, 도경수"
    },
    "ESTP": {
        emoji: "⚡",
        title: "모험을 즐기는 사업가",
        description: "활동적이고 현실적인 성격으로, 새로운 경험을 추구하는 당신! 유연하고 재빠른 판단을 내리며, 변화를 두려워하지 않습니다.",
        traits: [
            "즉흥적이고 도전적인 성향",
            "변화와 새로운 경험을 추구",
            "재빠르고 유연한 사고",
            "위험을 감수하고 모험을 즐김"
        ],
        famous: "이병헌, 송지효"
    },
    "ESFP": {
        emoji: "🎉",
        title: "자유로운 영혼의 연예인",
        description: "사교적이고 활발한 성격으로, 주변 사람들과 함께 즐기는 것을 좋아하는 당신! 긍정적이고 유머 감각이 뛰어나며, 다른 사람들을 즐겁게 만듭니다.",
        traits: [
            "사교적이고 활동적인 성향",
            "즐거운 분위기를 만드는 능력",
            "즉흥적이고 자유로운 성격",
            "타인과의 교류를 중요시"
        ],
        famous: "정해인, 김소현"
    },
    "ENFP": {
        emoji: "🌟",
        title: "재기발랄한 활동가",
        description: "창의적이고 열정적인 성격으로, 다양한 아이디어와 가능성을 추구하는 당신! 타인의 감정을 잘 이해하고, 새로운 경험을 중요시합니다.",
        traits: [
            "창의적이고 열정적인 성향",
            "타인의 감정을 잘 이해하고 공감",
            "새로운 가능성에 대해 탐구",
            "유연하고 자유로운 사고"
        ],
        famous: "유인나, 박서준"
    },
    "ENTP": {
        emoji: "🔥",
        title: "뜨거운 논쟁을 즐기는 변론가",
        description: "논리적이고 창의적인 사고를 가진 당신! 새로운 아이디어를 제시하고 토론을 즐기며, 변화를 이끄는 능력이 뛰어납니다.",
        traits: [
            "창의적이고 혁신적인 아이디어",
            "논리적이고 독립적인 사고",
            "지적 호기심이 강함",
            "도전적이고 논쟁을 즐김"
        ],
        famous: "이성경, 김우빈"
    },
    "ESTJ": {
        emoji: "💼",
        title: "엄격한 관리자",
        description: "체계적이고 규칙을 중시하는 당신! 효율적인 시스템과 조직을 선호하며, 결과와 성과를 중요시합니다.",
        traits: [
            "체계적이고 조직적인 성향",
            "효율성을 중시하며 목표를 향해 나아감",
            "규칙과 질서를 중요시",
            "책임감이 강하고 관리 능력 뛰어남"
        ],
        famous: "박진영, 김태우"
    },
    "ESFJ": {
        emoji: "💖",
        title: "사교적인 외교관",
        description: "다른 사람과의 관계를 중요시하는 당신! 타인을 돕고 배려하는 성격으로, 친근하고 사교적인 모습을 보입니다.",
        traits: [
            "타인을 돕고 배려하는 성향",
            "사교적이고 사람을 잘 이해함",
            "조화롭고 안정적인 관계를 중시",
            "규칙과 전통을 중요시"
        ],
        famous: "전지현, 김희선"
    },
    "ENFJ": {
        emoji: "🌸",
        title: "정의로운 사회운동가",
        description: "타인과의 관계에서 큰 가치를 두며, 사람들에게 영감을 주는 성격입니다. 타인을 돕고 이끄는 능력이 뛰어나며, 진정성을 중요시합니다.",
        traits: [
            "타인을 이끄는 능력",
            "진정성 있고 공감 능력이 뛰어남",
            "사회적 책임감을 중요시",
            "사람들에게 영감을 주는 리더십"
        ],
        famous: "이민호, 전지현"
    },
    "ENTJ": {
        emoji: "👑",
        title: "대담한 통솔자",
        description: "강력한 리더십을 발휘하며, 목표를 향해 대담하게 나아가는 성격입니다. 높은 분석력과 전략적 사고로 주변을 이끌어갑니다.",
        traits: [
            "리더십과 전략적 사고 능력",
            "목표 지향적이고 대담한 성격",
            "효율성 및 성과 지향적",
            "강력한 결정력과 의사소통 능력"
        ],
        famous: "김재중, 송중기"
    }
};


let currentQuestion = 0;
let mbtiScore = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
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
    const answerButtons = document.querySelectorAll('.answer-btn');

    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    questionCounter.textContent = `${currentQuestion + 1}/${questions.length}`;
    questionText.textContent = questions[currentQuestion].text;

    questions[currentQuestion].choices.forEach((choice, index) => {
        answerButtons[index].textContent = choice.text;
        answerButtons[index].onclick = () => handleAnswer(choice.type);
    });
}

// 답변 처리 함수
function handleAnswer(type) {
    mbtiScore[type]++;
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

// 팝업 광고 초기화 함수
function initializePopupAd() {
    const popupAd = document.querySelector('.popup-ad');
    if (popupAd) {
        try {
            while (popupAd.firstChild) {
                popupAd.removeChild(popupAd.firstChild);
            }
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('팝업 광고 초기화 실패:', e);
        }
    }
}

// MBTI 결과 계산 함수
function calculateMBTI() {
    return (
        (mbtiScore.E > mbtiScore.I ? 'E' : 'I') +
        (mbtiScore.S > mbtiScore.N ? 'S' : 'N') +
        (mbtiScore.T > mbtiScore.F ? 'T' : 'F') +
        (mbtiScore.J > mbtiScore.P ? 'J' : 'P')
    );
}

// 결과 표시 함수
function showResult() {
    resultSection.style.display = 'block';
    const mbtiType = calculateMBTI();
    const result = mbtiResults[mbtiType];

    document.querySelector('.type-emoji').textContent = result.emoji;
    document.getElementById('mbti-result').textContent = mbtiType;
    document.getElementById('result-title').textContent = result.title;
    document.getElementById('result-description').textContent = result.description;

    const traitsList = document.getElementById('traits-list');
    traitsList.innerHTML = result.traits
        .map(trait => `<li>${trait}</li>`)
        .join('');

    document.getElementById('famous-list').textContent = result.famous;
}

// 공유하기 버튼
document.querySelector('.share-btn').addEventListener('click', () => {
    const mbtiType = calculateMBTI();
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '3분만에 보는 MBTI 테스트',
            description: `나의 MBTI는 ${mbtiType}입니다!`,
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
    mbtiScore = {E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0};
    resultSection.style.display = 'none';
    startSection.style.display = 'block';
});

// 페이지 로드 시 광고 초기화
window.onload = function() {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('상단 광고 초기화 실패:', e);
    }
};