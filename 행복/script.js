// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 광고 로드 상태 관리 - 중복 로드 방지
const adLoadedState = {
    'ad-top': false,
    'ad-middle': false,
    'ad-result': false
};

// 광고 IntersectionObserver 설정
const adObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !adLoadedState[entry.target.id]) {
            const adElement = entry.target.querySelector('.adsbygoogle');
            if (adElement && !adElement.hasAttribute('data-adsbygoogle-status')) {
                try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                    adLoadedState[entry.target.id] = true;
                    console.log(`광고 로드됨: ${entry.target.id}`);
                } catch (e) {
                    console.error('광고 로드 오류:', e);
                }
            }
        }
    });
}, {
    rootMargin: '50px',
    threshold: 0.1
});

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
        "앞으로도 이런 태도를 유지하면서 더 큰 행복을 만들어가세요!",
        "새로운 도전을 통해 더욱 풍요로운 삶을 만들어보세요.",
        "현재 삶에 만족하면서도 더 큰 목표를 설정해보세요.",
        "당신의 긍정적인 태도가 주변 사람들에게도 좋은 영향을 줍니다.",
        "스스로를 격려하고 삶을 더욱 의미 있게 만들어가세요.",
        "작은 성공들을 축하하며 더 큰 행복으로 나아가세요.",
        "당신의 행복은 많은 사람들에게 영감을 줍니다!"
    ],
    [
        "당신의 행복 지수는 높은 편입니다. (75~89점)",
        "대체로 만족스러운 삶을 살고 계시네요.",
        "가끔은 자신을 위한 특별한 시간을 가져보세요.",
        "소소한 취미생활을 통해 더 큰 행복을 찾을 수 있을 거예요.",
        "감사의 마음을 표현하면 더 행복해질 수 있어요.",
        "현재 상태를 유지하며 자신에게 보상을 주는 것도 중요합니다.",
        "더 큰 만족감을 위해 새로운 경험을 시도해보세요.",
        "주변 사람들과의 관계를 더욱 깊게 만들어보세요.",
        "당신의 긍정적인 에너지가 더 많은 기회를 가져다줄 것입니다.",
        "자신이 가진 것을 소중히 여기는 태도가 돋보입니다."
    ],
    [
        "당신의 행복 지수는 보통입니다. (60~74점)",
        "평범한 일상 속에서 자신만의 행복을 찾고 계시네요.",
        "작은 것에 감사하는 마음을 가지면 더 행복해질 수 있어요.",
        "긍정적인 생각이 더 많은 행복을 가져다 줄 거예요.",
        "스스로를 격려하며 삶의 작은 즐거움을 찾아보세요.",
        "소소한 성취도 큰 행복으로 이어질 수 있습니다.",
        "가끔은 일상에서 벗어나 새로운 활동을 시도해보세요.",
        "삶의 만족도를 높이기 위해 자신에게 집중하는 시간을 가져보세요.",
        "주변 사람들과 더 많은 시간을 보내며 관계를 강화해보세요.",
        "행복은 작은 변화에서 시작됩니다."
    ],
    [
        "당신의 행복 지수가 조금 낮습니다. (40~59점)",
        "현재 약간의 스트레스를 받고 계신 것 같네요.",
        "자신을 위한 시간을 더 가져보세요.",
        "취미생활이나 운동으로 스트레스를 해소해보는 건 어떨까요?",
        "가까운 사람들에게 도움을 요청하는 것도 좋은 방법입니다.",
        "작은 목표를 세우고 이를 이루는 기쁨을 느껴보세요.",
        "규칙적인 생활을 통해 마음의 안정을 찾아보세요.",
        "감정을 표현하며 스트레스를 해소해보세요.",
        "자신에게 관대해지고 충분한 휴식을 취하는 것도 중요합니다.",
        "변화를 위해 첫걸음을 내딛어보세요."
    ],
    [
        "당신의 행복 지수가 많이 낮습니다. (0~39점)",
        "지금은 힘들 수 있지만, 이것은 일시적인 상황일 뿐이에요.",
        "전문가와 상담을 통해 도움을 받아보는 것은 어떨까요?",
        "작은 목표부터 하나씩 이뤄나가다 보면 반드시 행복이 찾아올 거예요.",
        "스스로를 위로하며 현재의 어려움을 잘 극복해보세요.",
        "가까운 사람들과 대화를 나누며 마음을 가볍게 만들어보세요.",
        "삶의 변화를 위해 새로운 활동을 시작해보는 것도 좋은 방법입니다.",
        "지금은 작은 변화라도 시도하는 것이 중요합니다.",
        "현재의 힘든 상황이 당신을 더 단단하게 만들어줄 것입니다.",
        "포기하지 않고 나아가다 보면 반드시 더 나은 날이 올 것입니다."
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

    // 3번째 질문에서 중간 광고 표시
    if (currentQuestion === 2) {
        const middleAd = document.getElementById('ad-middle');
        if (middleAd) {
            middleAd.style.display = 'block';
            adObserver.observe(middleAd);
        }
    }

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

// 결과 표시 함수
function showResult() {
    resultPage.classList.remove('hidden');
    
    // 결과 광고 표시
    const resultAd = document.getElementById('ad-result');
    if (resultAd) {
        resultAd.style.display = 'block';
        adObserver.observe(resultAd);
    }
    
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

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 페이지 로드 시 상단 광고 관찰 시작
    const topAd = document.getElementById('ad-top');
    if (topAd) {
        adObserver.observe(topAd);
    }
});

// 테스트 재시작 함수
function restartTest() {
    currentQuestion = 0;
    score = 0;
    
    // 광고 숨기기 및 관찰 중단
    const middleAd = document.getElementById('ad-middle');
    const resultAd = document.getElementById('ad-result');
    
    if (middleAd) {
        middleAd.style.display = 'none';
        adObserver.unobserve(middleAd);
    }
    if (resultAd) {
        resultAd.style.display = 'none';
        adObserver.unobserve(resultAd);
    }
    
    resultPage.classList.add('hidden');
    questionPage.classList.add('hidden');
    startPage.classList.remove('hidden');
}