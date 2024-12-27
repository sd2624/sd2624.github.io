// 카카오 SDK 초기화 완료 확인
if (!Kakao.isInitialized()) {
    Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
}

// 질문 목록
const questions = [
    "상대방이 '사랑해'라고 말해주는 것이 가장 행복하다.",
    "함께 시간을 보내는 것이 가장 중요하다고 생각한다.",
    "상대방의 작은 선물에도 큰 감동을 받는다.",
    "상대방이 나를 위해 무언가를 해줄 때 사랑받는다고 느낀다.",
    "스킨십이나 포옹을 통해 애정을 느낀다.",
    "상대방의 칭찬이나 인정하는 말에 기쁨을 느낀다.",
    "상대방과 함께 있는 시간 자체가 소중하다.",
    "특별한 날 받은 선물을 오래도록 간직한다.",
    "상대방이 집안일을 도와줄 때 사랑을 느낀다.",
    "손을 잡거나 안아주는 것으로 위로받는다."
];

// 사랑의 언어 유형
const loveLanguages = {
    words: {
        score: 0,
        title: "인정하는 말",
        description: 
            "당신은 말로 표현되는 사랑을 가장 크게 느끼는 타입입니다.\n" +
            "칭찬, 감사, 사랑을 담은 말 한 마디가 당신에게 큰 의미를 줍니다.\n" +
            "상대방이 진심을 담아 말을 건넬 때 깊은 애정을 느낍니다.\n" +
            "당신에게 말은 단순한 소통 이상의 감정 전달 도구입니다.\n" +
            "상대의 따뜻한 말 한 마디가 하루를 빛나게 만듭니다.\n" +
            "감정적인 순간에는 위로와 격려의 말이 당신에게 큰 힘이 됩니다.\n" +
            "사랑한다는 표현은 단순한 단어가 아니라 관계의 깊이를 상징합니다.\n" +
            "꾸준한 언어적 표현은 당신의 행복감을 지속적으로 높입니다.\n" +
            "상대방의 말 속에서 진정성을 찾으며 관계의 가치를 느낍니다.\n" +
            "당신에게 있어서 사랑의 표현은 진심 어린 말이 핵심입니다."
    },
    time: {
        score: 0,
        title: "함께하는 시간",
        description: 
            "당신은 상대방과 함께 보내는 시간을 통해 사랑을 가장 크게 느끼는 타입입니다.\n" +
            "온전히 집중된 시간은 당신에게 큰 위안과 기쁨을 줍니다.\n" +
            "함께 있는 동안의 모든 순간이 특별하게 느껴집니다.\n" +
            "사랑은 시간이라는 선물로 표현된다고 믿습니다.\n" +
            "단순히 같은 공간에 있는 것만으로도 안정을 찾습니다.\n" +
            "계획된 데이트보다 자연스러운 동행에서 더 큰 행복을 느낍니다.\n" +
            "상대방이 당신에게 시간을 내어줄 때 깊은 애정을 느낍니다.\n" +
            "함께하는 시간은 당신에게 추억을 만드는 가장 큰 기회입니다.\n" +
            "바쁜 일상 속에서도 나를 위한 시간을 내주는 상대에게 감사함을 느낍니다.\n" +
            "당신에게 있어서 사랑은 함께 나누는 시간이 핵심입니다."
    },
    gifts: {
        score: 0,
        title: "선물",
        description: 
            "당신은 선물을 통해 사랑을 가장 크게 느끼는 타입입니다.\n" +
            "선물의 크기나 값어치보다 그 안에 담긴 진심을 소중히 여깁니다.\n" +
            "상대방이 당신을 생각하며 준비한 작은 선물에 깊은 감동을 느낍니다.\n" +
            "특별한 날이 아니더라도 선물 속에 담긴 배려를 높이 평가합니다.\n" +
            "물질적 가치를 넘어선 마음의 표현으로 선물을 받아들입니다.\n" +
            "선물은 관계의 애정을 확인하고 기념하는 특별한 도구로 여깁니다.\n" +
            "작은 손편지나 직접 만든 선물이 특히 큰 감동을 줍니다.\n" +
            "선물은 당신에게 사랑과 기억을 상징하는 중요한 요소입니다.\n" +
            "상대가 당신을 위해 고민하고 준비한 노력이 고스란히 전해집니다.\n" +
            "당신에게 있어서 선물은 진심이 담긴 사랑의 표현입니다."
    },
    service: {
        score: 0,
        title: "봉사",
        description: 
            "당신은 상대방의 행동과 도움을 통해 사랑을 가장 크게 느끼는 타입입니다.\n" +
            "작은 배려나 도움의 행동이 당신에게 큰 감동을 줍니다.\n" +
            "상대가 나를 위해 시간을 내어주는 모습에서 사랑을 느낍니다.\n" +
            "특별히 요청하지 않아도 자발적으로 도와주는 행동이 소중합니다.\n" +
            "상대의 노력과 헌신이 관계에 깊이를 더한다고 생각합니다.\n" +
            "상대가 가사나 일을 돕는 행동에서 진정성을 느낍니다.\n" +
            "봉사는 당신에게 사랑과 신뢰를 표현하는 중요한 방식입니다.\n" +
            "일상 속에서 서로를 돕는 모습이 당신의 애정을 강화합니다.\n" +
            "작은 행동 하나에도 큰 사랑과 배려를 느낄 수 있습니다.\n" +
            "당신에게 있어서 봉사는 진심 어린 사랑의 실천입니다."
    },
    touch: {
        score: 0,
        title: "스킨십",
        description: 
            "당신은 신체 접촉을 통해 사랑을 가장 크게 느끼는 타입입니다.\n" +
            "포옹이나 손을 잡는 작은 행동이 당신에게 큰 위로를 줍니다.\n" +
            "상대방의 신체 접촉에서 안정감과 사랑을 느낍니다.\n" +
            "특별한 말보다 따뜻한 포옹이 더 큰 의미로 다가옵니다.\n" +
            "스킨십은 당신에게 관계의 친밀감을 상징하는 요소입니다.\n" +
            "긴장된 순간에 상대방의 손길이 마음의 안정을 가져옵니다.\n" +
            "스킨십은 단순한 접촉이 아니라 마음의 교감이라고 생각합니다.\n" +
            "서로의 온기를 느끼며 사랑의 깊이를 체감합니다.\n" +
            "스킨십을 통해 상대방의 진심과 애정을 확인할 수 있습니다.\n" +
            "당신에게 있어서 스킨십은 가장 직접적인 사랑의 표현입니다."
    }
};

let currentQuestion = 0;

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeTest();
});

// 테스트 초기화
function initializeTest() {
    document.getElementById('start-btn').addEventListener('click', startTest);
    document.querySelectorAll('.answer-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => handleAnswer(5 - index));
    });
}

// 테스트 시작
function startTest() {
    document.getElementById('start-section').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    showQuestion();
}

// 질문 표시
function showQuestion() {
    document.getElementById('question-text').textContent = questions[currentQuestion];
    document.querySelector('.question-counter').textContent = `${currentQuestion + 1}/10`;
    updateProgressBar();
}

// 진행바 업데이트
function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;
}

// 답변 처리
function handleAnswer(score) {
    const types = ['words', 'time', 'gifts', 'service', 'touch'];
    const questionType = types[currentQuestion % 5];
    loveLanguages[questionType].score += score;

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showAdPopup();
    }
}

// 광고 팝업 표시
function showAdPopup() {
    const popup = document.getElementById('ad-popup');
    popup.style.display = 'block';
    
    let countdown = 7;
    const countdownElement = document.querySelector('.countdown');
    
    const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            popup.style.display = 'none';
            showResult();
        }
    }, 1000);
    
    // 구글 광고 표시
    (adsbygoogle = window.adsbygoogle || []).push({});
}

// 결과 표시
function showResult() {
    document.getElementById('question-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';

    // 최고 점수 찾기
    let maxScore = 0;
    let primaryLanguage = '';
    
    for (let type in loveLanguages) {
        if (loveLanguages[type].score > maxScore) {
            maxScore = loveLanguages[type].score;
            primaryLanguage = type;
        }
    }

    // 결과 표시
    const result = loveLanguages[primaryLanguage];
    document.getElementById('result-title').textContent = result.title;
    document.getElementById('result-description').textContent = result.description;

    // 결과 차트 표시 (선택사항)
    createResultChart();
}

// 결과 차트 생성
function createResultChart() {
    const ctx = document.getElementById('resultChart').getContext('2d');
    const data = {
        labels: ['인정하는 말', '함께하는 시간', '선물', '봉사', '스킨십'],
        datasets: [{
            data: [
                loveLanguages.words.score,
                loveLanguages.time.score,
                loveLanguages.gifts.score,
                loveLanguages.service.score,
                loveLanguages.touch.score
            ],
            backgroundColor: [
                '#FF6B6B',
                '#4ECDC4',
                '#45B7D1',
                '#96CEB4',
                '#FFEEAD'
            ]
        }]
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// 테스트 다시하기
document.querySelector('.retry-btn').addEventListener('click', () => {
    currentQuestion = 0;
    for (let type in loveLanguages) {
        loveLanguages[type].score = 0;
    }
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('start-section').style.display = 'block';
});

// 결과 공유하기
document.querySelector('.share-btn').addEventListener('click', () => {
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '나의 사랑의 언어 테스트',
            description: '당신의 사랑의 언어를 알아보세요!',
            imageUrl: 'YOUR_IMAGE_URL',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href
            }
        },
        buttons: [
            {
                title: '테스트 하러가기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href
                }
            }
        ]
    });
});