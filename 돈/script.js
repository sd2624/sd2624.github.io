// 카카오 SDK 초기화 확인
if (!Kakao.isInitialized()) {
    Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
}

// 질문 목록
const questions = [
    "매달 고정적으로 저축하는 금액이 정해져 있다.",
    "투자 전 철저한 분석과 리서치를 하는 편이다.",
    "비상금을 따로 모아두는 편이다.",
    "충동구매를 하지 않으려고 노력한다.",
    "장기 투자를 선호한다.",
    "재테크 관련 정보를 자주 찾아본다.",
    "수입과 지출을 꼼꼼히 기록한다.",
    "신용카드보다 체크카드를 주로 사용한다.",
    "투자 위험을 감수할 수 있다.",
    "돈을 쓸 때 계획을 세우고 지출한다.",
    "금융 상품의 특징을 잘 파악하고 가입한다.",
    "미래를 위한 보험이나 연금에 가입했다.",
    "자산 포트폴리오를 다양화하려고 노력한다.",
    "가격 대비 가치를 중요하게 생각한다.",
    "재무 목표를 세우고 실천하려 노력한다."
];

// 결과 유형
const moneyTypes = {
    conservative: {
        minScore: 15,
        maxScore: 35,
        title: "안정 추구형 머니 메이커",
        description: [
            "당신은 안정적인 재테크를 선호하는 보수적인 성향을 가지고 있습니다.",
            "위험을 최소화하고 안전한 수익을 추구하는 편입니다.",
            "예금과 적금 같은 안전한 금융상품을 선호합니다.",
            "계획적인 소비와 저축 습관이 있습니다.",
            "장기적인 관점에서 자산을 관리하려 노력합니다.",
            "급격한 수익보다는 안정적인 수익을 선호합니다.",
            "재무적 안정성을 매우 중요하게 생각합니다.",
            "위험 관리에 특히 신경 쓰는 편입니다.",
            "비상금 관리를 잘하는 편입니다.",
            "신중한 투자 결정을 내리는 것이 특징입니다."
        ]
    },
    balanced: {
        minScore: 36,
        maxScore: 55,
        title: "균형 잡힌 자산 관리자",
        description: [
            "당신은 위험과 수익의 균형을 추구하는 합리적인 성향을 가지고 있습니다.",
            "분산 투자를 통해 리스크를 관리하려 노력합니다.",
            "투자 전 충분한 정보 수집을 하는 편입니다.",
            "계획적인 포트폴리오 구성을 선호합니다.",
            "적절한 위험 감수를 통해 수익을 추구합니다.",
            "장단기 투자를 적절히 혼합하여 운용합니다.",
            "시장 상황에 따라 유연하게 대응합니다.",
            "재무 목표 설정이 명확한 편입니다.",
            "정기적인 포트폴리오 리밸런싱을 실시합니다.",
            "새로운 투자 기회를 적극적으로 탐색합니다."
        ]
    },
    aggressive: {
        minScore: 56,
        maxScore: 75,
        title: "공격적 수익 추구형",
        description: [
            "당신은 높은 수익을 위해 적극적인 투자를 하는 성향을 가지고 있습니다.",
            "새로운 투자 기회를 항상 모색하고 있습니다.",
            "위험을 감수하고 높은 수익을 추구합니다.",
            "투자 정보에 대한 높은 관심을 가지고 있습니다.",
            "시장 변화에 빠르게 대응하는 편입니다.",
            "다양한 투자 상품에 도전적으로 접근합니다.",
            "수익 극대화를 위한 전략을 수립합니다.",
            "새로운 재테크 방법을 적극 수용합니다.",
            "단기 고수익 기회를 놓치지 않으려 합니다.",
            "투자에 대한 자신감이 높은 편입니다."
        ]
    }
};

let currentQuestion = 0;
let totalScore = 0;

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeTest();
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
    document.getElementById('question-text').textContent = questions[currentQuestion];
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
    
    // 구글 광고 표시
    (adsbygoogle = window.adsbygoogle || []).push({});
}

// 결과 표시
function showResult() {
    document.getElementById('question-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';

    let resultType;
    if (totalScore <= 35) {
        resultType = moneyTypes.conservative;
    } else if (totalScore <= 55) {
        resultType = moneyTypes.balanced;
    } else {
        resultType = moneyTypes.aggressive;
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
            title: '나의 돈 관리 성향 테스트',
            description: '당신의 재테크 유형을 알아보세요!',
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