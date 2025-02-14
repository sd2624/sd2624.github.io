// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 목록
const questions = [
    "지난 한 주 동안 기분이 좋았나요?",
    "스트레스를 많이 받고 있나요?",
    "충분한 휴식을 취하고 있나요?",
    "다른 사람들과의 관계가 조화롭나요?",
    "일이나 학업에 집중이 잘 되나요?",
    "미래에 대해 긍정적으로 생각하나요?",
    "자신에게 만족하고 있나요?",
    "규칙적이고 체계적인 생활을 하고 있나요?",
    "취미 생활을 즐기고 있나요?",
    "전반적으로 행복하다고 느끼나요?"
];

// 결과 유형
const results = [
    {
        title: "매우 안정적인 감정 상태",
        description: "당신은 감정적으로 안정적이며 스트레스를 효과적으로 관리하고 있습니다. 삶에 대해 긍정적인 태도를 유지하며, 건강한 대인관계와 자기 관리 능력을 갖추고 있습니다. 충분한 휴식과 규칙적인 생활이 현재 상태를 유지하는 데 크게 기여합니다. 이 균형을 유지하기 위해 자신에게 맞는 활동과 루틴을 계속 실천하세요. 현재의 전략을 강화하면 예상치 못한 스트레스도 유연하게 대처할 수 있습니다.",
        icon: "😊"
    },
    {
        title: "경미한 스트레스",
        description: "일상적인 스트레스를 조금 느끼지만 전반적으로 잘 관리하고 있습니다. 과도한 업무나 책임으로 인해 피로감을 느낄 수 있지만, 적절한 휴식과 스트레스 해소 방법을 적용하면 큰 문제가 되지 않을 것입니다. 산책, 음악 감상, 명상과 같은 간단한 활동을 시도해 보세요. 정기적인 자기 점검과 필요할 때 도움을 요청하는 것도 중요합니다. 이러한 작은 변화들이 장기적으로 긍정적인 영향을 미칠 수 있습니다.",
        icon: "🙂"
    },
    {
        title: "주의가 필요한 상태",
        description: "현재 스트레스가 누적되어 있으며, 해결하지 않으면 신체적·정신적 건강에 영향을 미칠 수 있습니다. 과도한 업무나 인간관계의 부담에서 오는 압박을 해소하기 위한 적극적인 조치가 필요합니다. 충분한 휴식을 취하고 긍정적인 에너지를 얻을 수 있는 활동에 참여하세요. 스트레스의 근본 원인을 파악하고 개선 계획을 세우는 것이 중요합니다. 정신 건강 전문가의 도움을 받는 것도 스트레스를 관리하고 건강한 마음가짐을 되찾는 데 도움이 될 수 있습니다.",
        icon: "😔"
    }
];

// 전역 변수
let currentQuestion = 0;
let totalScore = 0;

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 이벤트 리스너 초기화
    document.getElementById('start-btn').addEventListener('click', startTest);
    document.getElementById('retry-btn').addEventListener('click', resetTest);
    document.getElementById('kakao-share-btn').addEventListener('click', shareToKakao);
});

// 테스트 시작
function startTest() {
    document.getElementById('start-section').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    showQuestion();
}

// 질문 표시
function showQuestion() {
    document.getElementById('question-text').textContent = questions[currentQuestion];
    updateProgressBar();
    setupAnswerButtons();
}

// 진행 상태 업데이트
function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;
}

// 답변 버튼 설정
function setupAnswerButtons() {
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach(button => {
        button.removeEventListener('click', handleAnswer);
        button.addEventListener('click', handleAnswer);
    });
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
    
    // Google 광고 표시
    (adsbygoogle = window.adsbygoogle || []).push({});
}

// 결과 표시
function showResult() {
    document.getElementById('question-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
    
    const averageScore = totalScore / questions.length;
    let resultIndex;
    
    if (averageScore >= 4) {
        resultIndex = 0; // 매우 안정적
    } else if (averageScore >= 3) {
        resultIndex = 1; // 경미한 스트레스
    } else {
        resultIndex = 2; // 주의가 필요함
    }
    
    const result = results[resultIndex];
    document.getElementById('result-title').textContent = result.title;
    document.getElementById('result-description').textContent = result.description;
    document.querySelector('.result-icon').textContent = result.icon;
}

// 테스트 초기화
function resetTest() {
    currentQuestion = 0;
    totalScore = 0;
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('start-section').style.display = 'block';
}

// 카카오톡 공유
function shareToKakao() {
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '나의 감정 상태 테스트',
            description: '현재 감정 상태는 어떤가요? 테스트를 진행해보세요!',
            imageUrl: 'https://example.com/your-image.jpg', // 실제 이미지 URL로 변경
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href
            }
        },
        buttons: [
            {
                title: '테스트하러 가기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href
                }
            }
        ]
    });
}
