// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 목록
const questions = [
    "하루에 웃는 횟수가 몇 번 정도인가요?",
    "일주일에 운동을 몇 번 하시나요?",
    "하루 평균 수면 시간은 어떻게 되나요?",
    "가족이나 친구와 대화하는 시간이 충분한가요?",
    "자신의 현재 직업에 만족하시나요?",
    "취미 생활을 즐기는 시간이 있나요?",
    "스트레스 해소법이 있나요?",
    "일과 삶의 균형이 잘 잡혀있다고 생각하시나요?",
    "하루 중 여유로운 시간을 가지고 계신가요?",
    "주변 사람들과의 관계는 원만한가요?",
    "자신의 미래에 대해 긍정적으로 생각하시나요?",
    "최근 새로운 것을 배우거나 도전해본 적이 있나요?",
    "하루 식사는 규칙적으로 하시나요?",
    "자신만의 목표가 있나요?",
    "전반적으로 현재 삶에 만족하시나요?"
];

// 결과 메시지
const results = [
    [
        "당신의 행복 지수는 매우 높습니다! (90~100점)",
        "삶의 균형이 매우 잘 잡혀있고 긍정적인 마인드를 가지고 계시네요.",
        "주변 사람들에게 좋은 에너지를 전파하고 있어요.",
        "앞으로도 이런 태도를 유지하면서 더 큰 행복을 만들어가세요!"
    ],
    [
        "당신의 행복 지수는 높은 편입니다. (75~89점)",
        "대체로 만족스러운 삶을 살고 계시네요.",
        "가끔은 자신을 위한 특별한 시간을 가져보세요.",
        "소소한 취미생활을 통해 더 큰 행복을 찾을 수 있을 거예요."
    ],
    [
        "당신의 행복 지수는 보통입니다. (60~74점)",
        "평범한 일상 속에서 자신만의 행복을 찾고 계시네요.",
        "작은 것에 감사하는 마음을 가지면 더 행복해질 수 있어요.",
        "긍정적인 생각이 더 많은 행복을 가져다 줄 거예요."
    ],
    [
        "당신의 행복 지수가 조금 낮습니다. (40~59점)",
        "현재 약간의 스트레스를 받고 계신 것 같네요.",
        "자신을 위한 시간을 더 가져보세요.",
        "취미생활이나 운동으로 스트레스를 해소해보는 건 어떨까요?"
    ],
    [
        "당신의 행복 지수가 많이 낮습니다. (0~39점)",
        "지금은 힘들 수 있지만, 이것은 일시적인 상황일 뿐이에요.",
        "전문가와 상담을 통해 도움을 받아보는 것은 어떨까요?",
        "작은 목표부터 하나씩 이뤄나가다 보면 반드시 행복이 찾아올 거예요."
    ]
];

let currentQuestion = 0;
let score = 0;

// DOM 요소
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const analysisPopup = document.getElementById('analysisPopup');

// 시작 버튼 이벤트
document.querySelector('.start-btn').addEventListener('click', () => {
    startPage.classList.add('hidden');
    questionPage.classList.remove('hidden');
    showQuestion();
});

// 질문 표시 함수
function showQuestion() {
    const progressBar = document.querySelector('.progress');
    const questionNum = document.getElementById('questionNum');
    const questionElement = document.querySelector('.question');
    const answersElement = document.querySelector('.answers');

    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    questionNum.textContent = currentQuestion + 1;
    questionElement.textContent = questions[currentQuestion];

    answersElement.innerHTML = `
        <button class="answer-btn" onclick="handleAnswer(5)">매우 그렇다</button>
        <button class="answer-btn" onclick="handleAnswer(4)">그렇다</button>
        <button class="answer-btn" onclick="handleAnswer(3)">보통이다</button>
        <button class="answer-btn" onclick="handleAnswer(2)">아니다</button>
        <button class="answer-btn" onclick="handleAnswer(1)">전혀 아니다</button>
    `;
}

// 답변 처리 함수
function handleAnswer(value) {
    score += value;
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showAnalysisPopup();
    }
}

// 분석 팝업 표시 함수
function showAnalysisPopup() {
    questionPage.classList.add('hidden');
    analysisPopup.classList.remove('hidden');

    // 팝업 광고 초기화
    initializePopupAd();

    let countdown = 7;
    const countdownElement = analysisPopup.querySelector('.countdown');
    
    const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            analysisPopup.classList.add('hidden');
            showResult();
        }
    }, 1000);
}

// 팝업 광고 초기화 함수
function initializePopupAd() {
    const popupAd = analysisPopup.querySelector('.popup-ad');
    if (popupAd) {
        try {
            // 기존 광고 제거
            while (popupAd.firstChild) {
                popupAd.removeChild(popupAd.firstChild);
            }
            
            // 새로운 광고 삽입
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('팝업 광고 초기화 실패:', e);
        }
    }
}

// 결과 표시 함수
function showResult() {
    resultPage.classList.remove('hidden');
    
    const percentage = (score / (questions.length * 5)) * 100;
    let resultIndex;
    
    if (percentage >= 90) resultIndex = 0;
    else if (percentage >= 75) resultIndex = 1;
    else if (percentage >= 60) resultIndex = 2;
    else if (percentage >= 40) resultIndex = 3;
    else resultIndex = 4;

    const resultContent = document.querySelector('.result-content');
    resultContent.innerHTML = results[resultIndex]
        .map(line => `<p>${line}</p>`)
        .join('');
}

// 카카오톡 공유하기
document.querySelectorAll('.kakao-share').forEach(button => {
    button.addEventListener('click', () => {
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '행복 지수 테스트',
                description: '나의 진정한 행복 지수는 얼마일까?',
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
});

// 페이지 로드 시 광고 초기화
window.onload = function() {
    // 상단 광고 초기화
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('상단 광고 초기화 실패:', e);
    }
};