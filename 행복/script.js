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
    "당신의 행복 지수는 매우 높습니다!\n삶의 균형이 잘 잡혀 있고 긍정적인 마인드를 가지고 계시네요.\n현재 당신은 주변 사람들에게 긍정적인 에너지를 전하는 중요한 역할을 하고 있습니다.\n이 상태를 유지하면서도 새로운 도전이나 목표를 설정해보는 건 어떨까요?\n이는 삶에 활력을 더하고 더욱 풍요로운 행복을 만들어줄 것입니다.\n또한, 자신이 가진 강점과 성취를 주변과 나누며 더 큰 만족감을 느낄 수 있습니다.\n지금처럼 밝고 긍정적인 태도로 주변과 자신을 행복하게 만들어가세요.\n당신은 이미 충분히 멋진 삶을 살고 있습니다!",
    "행복한 삶을 살고 계시지만, 더 높은 행복을 위해 약간의 변화가 필요합니다.\n일상 속에서 새로운 취미를 시작하거나 작은 목표를 세우고 이를 이루어보는 건 어떨까요?\n스스로에게 충분한 휴식과 자신만의 시간을 제공하는 것도 중요합니다.\n또한, 주변 사람들과의 관계를 더욱 깊게 만들기 위해 소통의 시간을 늘려보세요.\n감사하는 마음을 표현하는 습관을 들이면 행복 지수를 한 단계 더 높일 수 있습니다.\n작은 변화와 노력이 당신의 삶에 큰 차이를 가져다줄 것입니다.\n오늘부터 시작해보세요.\n작은 실천이 큰 행복으로 이어질 것입니다.",
    "평범한 일상 속에서도 행복을 찾으려는 노력이 돋보입니다.\n작은 일에 감사하는 마음을 키우고, 긍정적인 태도를 유지하면 더 큰 만족감을 느낄 수 있습니다.\n주변 사람들과 더 자주 소통하고 자신의 감정을 솔직하게 표현해보세요.\n이는 관계를 더 풍요롭게 만들고, 행복의 범위를 넓혀줄 것입니다.\n작은 습관 하나하나가 더 큰 행복으로 이어질 수 있음을 기억하세요.\n또한, 스스로의 가치를 인정하고 삶의 작은 순간들을 즐기기 위해 노력하세요.\n당신은 이미 충분히 잘하고 있으며, 앞으로 더 행복한 삶이 기다리고 있습니다.\n긍정의 씨앗이 행복으로 꽃필 것입니다.",
    "행복 지수가 다소 낮은 상태로 보입니다.\n삶에 만족감을 더하기 위해 자신만의 시간을 가지는 노력이 필요합니다.\n취미생활을 시작하거나 규칙적인 운동을 통해 몸과 마음의 활력을 되찾아보세요.\n스트레스를 해소할 수 있는 자신만의 방법을 찾아보고, 이를 일상에 적용해보는 것도 좋습니다.\n또한, 가까운 사람들과 대화를 통해 도움을 요청하거나, 자신의 감정을 나눠보세요.\n변화는 작은 실천에서 시작됩니다.\n자신에게 시간을 투자하고 작은 목표를 이루어가며 성취감을 느껴보세요.\n당신은 충분히 더 행복해질 자격이 있습니다.\n지금 이 순간부터 자신을 위한 변화를 시작해보세요.",
    "지금은 어려운 시기를 겪고 계신 것 같습니다.\n하지만 이 순간은 변화와 성장의 기회가 될 수 있습니다.\n작은 목표를 세우고 이를 하나씩 이루어나가면서 자신감을 회복해보세요.\n전문가와 상담하거나 믿을 수 있는 사람들과 마음을 나누는 것도 좋은 방법입니다.\n스트레스와 어려움을 해소하는 데 도움이 될 것입니다.\n당신은 혼자가 아니며, 주변에는 당신을 지지하는 사람들이 있습니다.\n조금씩 변화를 만들어가며 자신만의 행복을 찾아보세요.\n어려움 속에서도 희망은 항상 존재합니다.\n스스로를 믿고, 앞으로 나아가는 한 걸음을 시작해보세요."
];

let currentQuestion = 0;
let score = 0;

// DOM 요소
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const analysisPopup = document.getElementById('analysisPopup');
const questionElement = document.querySelector('.question');
const questionNumElement = document.getElementById('questionNum');
const progressBar = document.querySelector('.progress');

// 시작 버튼 이벤트
document.querySelector('.start-btn').addEventListener('click', () => {
    startPage.classList.add('hidden');
    questionPage.classList.remove('hidden');
    showQuestion();
});

// 질문 표시 함수
function showQuestion() {
    questionNumElement.textContent = currentQuestion + 1;
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    questionElement.textContent = questions[currentQuestion];

    const answersElement = document.querySelector('.answers');
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
    
    const resultIndex = Math.floor((score / (questions.length * 5)) * results.length);
    const resultContent = document.querySelector('.result-content');
    resultContent.innerHTML = results[Math.min(resultIndex, results.length - 1)]
        .split('\n')
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