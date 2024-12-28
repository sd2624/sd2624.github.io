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
    "당신의 행복 지수는 매우 높습니다!\n삶의 균형이 잘 잡혀있고 긍정적인 마인드를 가지고 계시네요.",
    "행복한 삶을 살고 계시지만, 더 높은 행복을 위한 작은 변화가 필요해요.\n소소한 취미생활을 시작해보는 건 어떨까요?",
    "평범한 일상 속에서 행복을 찾고 계시네요.\n작은 것에 감사하는 마음을 가지면 더 행복해질 수 있어요.",
    "행복 지수가 조금 낮습니다.\n자신을 위한 시간을 더 가져보세요.\n취미생활이나 운동으로 스트레스를 해소해보세요.",
    "지금은 힘들 수 있지만, 변화의 시작점에 서 있습니다.\n작은 목표부터 하나씩 이뤄나가보세요."
];

let currentQuestion = 0;
let score = 0;

// 페이지 요소들
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const loadingPage = document.getElementById('loadingPage');
const resultPage = document.getElementById('resultPage');
const popupAd = document.getElementById('popupAd');

// 시작 버튼 이벤트
document.querySelector('.start-btn').addEventListener('click', () => {
    startPage.classList.add('hidden');
    questionPage.classList.remove('hidden');
    showQuestion();
});

// 질문 표시 함수
function showQuestion() {
    const progressBar = document.querySelector('.progress');
    progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;

    const questionEl = document.querySelector('.question');
    questionEl.textContent = questions[currentQuestion];

    const answersEl = document.querySelector('.answers');
    answersEl.innerHTML = `
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
        showLoading();
    }
}

// 로딩 화면 표시
function showLoading() {
    questionPage.classList.add('hidden');
    loadingPage.classList.remove('hidden');
    popupAd.classList.remove('hidden');

    let countdown = 7;
    const countdownEl = document.querySelector('.countdown');
    
    const timer = setInterval(() => {
        countdown--;
        countdownEl.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);
}

// 결과 표시
function showResult() {
    loadingPage.classList.add('hidden');
    resultPage.classList.remove('hidden');
    popupAd.classList.add('hidden');

    const resultIndex = Math.floor(score / (questions.length * 5) * results.length);
    const resultContent = document.querySelector('.result-content');
    resultContent.innerHTML = results[Math.min(resultIndex, results.length - 1)]
        .split('\n')
        .map(line => `<p>${line}</p>`)
        .join('');
}

// 팝업 닫기 버튼
document.querySelector('.close-popup').addEventListener('click', () => {
    popupAd.classList.add('hidden');
});

// 카카오톡 공유하기
document.querySelectorAll('.kakao-share').forEach(button => {
    button.addEventListener('click', () => {
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '행복 지수 테스트',
                description: '나의 행복 지수는 얼마일까?',
                imageUrl: 'YOUR_IMAGE_URL',
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