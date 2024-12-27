// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

const questions = [
    "최근 일주일 동안 기분이 좋았나요?",
    "스트레스를 많이 받고 있다고 느끼시나요?",
    "충분한 휴식을 취하고 있나요?",
    "주변 사람들과의 관계는 원만한가요?",
    "일이나 공부에 집중이 잘 되나요?",
    "미래에 대해 긍정적으로 생각하나요?",
    "자신에 대해 만족하시나요?",
    "규칙적인 생활을 하고 있나요?",
    "취미 생활을 즐기고 있나요?",
    "전반적으로 행복하다고 느끼시나요?"
];

const results = [
    {
        title: "매우 안정적인 감정 상태",
        description: "당신은 현재 매우 안정적이고 긍정적인 감정 상태를 유지하고 있습니다. 계속해서 이런 좋은 상태를 유지하세요!",
        icon: "😊"
    },
    {
        title: "약간의 스트레스",
        description: "일상적인 스트레스가 있지만, 대체로 잘 관리되고 있습니다. 가끔은 휴식을 취하는 것이 좋겠어요.",
        icon: "🙂"
    },
    {
        title: "주의가 필요한 상태",
        description: "스트레스가 쌓여있는 상태입니다. 충분한 휴식과 함께 즐거운 활동을 해보는 것은 어떨까요?",
        icon: "😔"
    }
];

let currentQuestion = 0;
let totalScore = 0;

document.getElementById('start-btn').addEventListener('click', startTest);
document.getElementById('retry-btn').addEventListener('click', resetTest);
document.getElementById('kakao-share-btn').addEventListener('click', shareToKakao);

function startTest() {
    document.getElementById('start-section').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    document.getElementById('question-text').textContent = questions[currentQuestion];
    document.querySelector('.progress').style.width = `${(currentQuestion + 1) * 10}%`;
    
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach(button => {
        button.addEventListener('click', handleAnswer);
    });
}

function handleAnswer(e) {
    const score = parseInt(e.target.dataset.score);
    totalScore += score;
    
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showAdPopup();
    }
}

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

function showResult() {
    document.getElementById('question-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
    
    const averageScore = totalScore / questions.length;
    let resultIndex;
    
    if (averageScore >= 4) {
        resultIndex = 0;
    } else if (averageScore >= 3) {
        resultIndex = 1;
    } else {
        resultIndex = 2;
    }
    
    const result = results[resultIndex];
    document.getElementById('result-title').textContent = result.title;
    document.getElementById('result-description').textContent = result.description;
    document.querySelector('.result-icon').textContent = result.icon;
}

function resetTest() {
    currentQuestion = 0;
    totalScore = 0;
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('start-section').style.display = 'block';
}

function shareToKakao() {
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '나의 감정 상태 테스트',
            description: '나의 현재 감정 상태는 어떨까요? 테스트해보세요!',
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
}