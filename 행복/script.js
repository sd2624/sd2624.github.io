// 카카오 SDK 초기화 확인
if (!Kakao.isInitialized()) {
    Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
}

// 질문 목록
const questions = [
    "매일 아침 기분 좋게 일어나는 편이다.",
    "작은 일에도 감사함을 느낀다.",
    "주변 사람들과 좋은 관계를 유지하고 있다.",
    "나의 현재 생활에 만족한다.",
    "미래에 대해 긍정적으로 생각한다.",
    "취미나 관심사를 즐기며 보내는 시간이 있다.",
    "스트레스를 잘 관리하는 편이다.",
    "나만의 목표를 향해 나아가고 있다.",
    "다른 사람들을 도울 때 기쁨을 느낀다.",
    "실패해도 다시 일어설 수 있는 힘이 있다.",
    "나의 감정을 잘 표현하는 편이다.",
    "삶에서 의미있는 일을 하고 있다고 느낀다.",
    "가족이나 친구들과 충분한 시간을 보낸다.",
    "나의 건강을 잘 관리하고 있다.",
    "전반적으로 행복한 삶을 살고 있다고 생각한다."
];

// 행복 유형 결과
const happinessTypes = {
    high: {
        minScore: 56,
        maxScore: 75,
        title: "최상의 행복 지수",
        description: [
            "당신은 매우 높은 수준의 행복감을 느끼고 있습니다!",
            "긍정적인 마인드로 삶을 대하고 있어요.",
            "주변 사람들에게도 좋은 에너지를 전파하고 있습니다.",
            "감사하는 마음이 습관화되어 있네요.",
            "스트레스 관리 능력이 뛰어납니다.",
            "자신의 목표를 향해 꾸준히 나아가고 있어요.",
            "건강한 대인관계를 유지하고 있습니다.",
            "삶의 의미를 잘 찾아가고 있어요.",
            "현재에 만족하면서도 성장을 추구하고 있습니다.",
            "앞으로도 이런 행복한 상태를 잘 유지하실 수 있을 거예요!"
        ]
    },
    medium: {
        minScore: 36,
        maxScore: 55,
        title: "안정적인 행복 지수",
        description: [
            "당신은 적절한 수준의 행복감을 유지하고 있습니다.",
            "대체로 긍정적인 시각을 가지고 있어요.",
            "때로는 힘들지만 잘 극복해내고 있습니다.",
            "자신만의 페이스로 삶을 살아가고 있어요.",
            "주변 사람들과 좋은 관계를 맺고 있습니다.",
            "미래에 대한 희망을 가지고 있어요.",
            "자신의 감정을 잘 알아차리고 있습니다.",
            "성장할 수 있는 여지가 많이 남아있어요.",
            "조금 더 자신을 사랑하면 좋을 것 같습니다.",
            "작은 행복부터 천천히 찾아가보세요."
        ]
    },
    low: {
        minScore: 15,
        maxScore: 35,
        title: "행복 충전이 필요한 시기",
        description: [
            "현재 당신은 행복감이 다소 부족한 상태입니다.",
            "일시적인 어려움을 겪고 있을 수 있어요.",
            "너무 자신을 몰아세우지 마세요.",
            "작은 것부터 감사함을 찾아보세요.",
            "도움이 필요하다면 주변에 이야기해보세요.",
            "혼자만의 시간도 중요하답니다.",
            "취미 생활을 시작해보는 건 어떨까요?",
            "규칙적인 생활이 도움이 될 수 있어요.",
            "전문가의 상담을 받아보는 것도 좋습니다.",
            "이 시기도 곧 지나갈 거예요. 힘내세요!"
        ]
    }
};

let currentQuestion = 0;
let totalScore = 0;

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeTest();
    (adsbygoogle = window.adsbygoogle || []).push({});
});

// 테스트 초기화
function initializeTest() {
    document.getElementById('start-btn').addEventListener('click', startTest);
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', handleAnswer);
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
    const questionText = document.getElementById('question-text');
    questionText.style.opacity = '0';
    
    setTimeout(() => {
        questionText.textContent = questions[currentQuestion];
        questionText.style.opacity = '1';
    }, 300);

    document.querySelector('.question-counter').textContent = `${currentQuestion + 1}/15`;
    updateProgressBar();
}

// 진행바 업데이트
function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;
}

// 답변 처리
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
}

// 결과 표시
function showResult() {
    document.getElementById('question-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';

    let resultType;
    if (totalScore >= 56) {
        resultType = happinessTypes.high;
    } else if (totalScore >= 36) {
        resultType = happinessTypes.medium;
    } else {
        resultType = happinessTypes.low;
    }

    document.getElementById('result-title').textContent = resultType.title;
    document.getElementById('result-description').textContent = resultType.description.join('\n');
}

// 테스트 다시하기
document.querySelector('.retry-btn').addEventListener('click', () => {
    currentQuestion = 0;
    totalScore = 0;
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('start-section').style.display = 'block';
});

// 결과 공유하기
document.querySelector('.share-btn').addEventListener('click', () => {
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '나의 행복 지수 테스트',
            description: '당신의 현재 행복도는 얼마일까요?',
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