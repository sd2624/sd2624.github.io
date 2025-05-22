// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 목록
const questions = [
    "자동차의 연식이 7년 이상이신가요?",
    "자동차 보험에 가입되어 있나요?",
    "최근 6개월 내 자동차 수리를 받으셨나요?",
    "연간 소득이 4천만원 미만인가요?",
    "자동차 정기 점검을 받고 계신가요?",
    "자동차 사고 이력이 있으신가요?",
    "자동차가 생계형 수단으로 사용되나요?",
    "현재 차량이 본인 소유입니까?",
    "자동차 보험료를 정상적으로 납부중이신가요?",
    "차량 등록증을 보유하고 계신가요?"
];

// 결과 메시지
const results = [
    [
        "환급 가능성이 매우 높습니다! (90~100점)",
        "자동차 수리비 환급 대상자일 확률이 매우 높습니다.",
        "다음 요건들을 충족하시는 것으로 보입니다:",
        "- 차량 연식 및 소득 조건 충족",
        "- 정기적인 차량 관리",
        "- 필요 서류 구비 완료",
        "아래 링크를 통해 즉시 신청해보세요:",
        "1. 자동차 수리비 환급 신청: www.car-support.kr",
        "2. 차량 무상점검 예약: www.car-check.kr",
        "3. 저소득층 차량 유지비 지원: www.car-help.kr"
    ],
    [
        "환급 가능성이 있습니다. (75~89점)",
        "몇 가지 조건을 더 충족하면 환급이 가능할 것 같습니다.",
        "다음 사항들을 확인해보세요:",
        "- 차량 정기점검 기록 구비",
        "- 소득증빙 서류 준비",
        "- 차량등록증 갱신",
        "관련 정보는 아래 링크에서 확인하세요:",
        "1. 자동차 수리비 지원 안내: www.car-guide.kr",
        "2. 필요 서류 체크리스트: www.car-docs.kr",
        "3. 자동차 관리 팁: www.car-tips.kr"
    ],
    [
        "환급 가능성이 보통입니다. (60~74점)",
        "기본적인 자격 요건은 충족하시지만,",
        "추가 서류나 조건이 필요할 수 있습니다.",
        "다음 단계를 확인해보세요:",
        "1. 차량 상태 점검 리포트 발급",
        "2. 정비이력 증명서 발급",
        "3. 소득 증빙 서류 준비",
        "자세한 내용은 아래에서 확인하세요:",
        "- 환급 자격 검증: www.car-verify.kr",
        "- 필수 서류 안내: www.car-docs.kr"
    ],
    [
        "환급이 어려울 수 있습니다. (40~59점)",
        "현재는 자격 요건이 충분하지 않아 보입니다.",
        "다음 사항들을 개선해보세요:",
        "1. 정기적인 차량 점검 시행",
        "2. 차량 관련 서류 정비",
        "3. 보험 가입 상태 확인",
        "도움이 필요하시다면:",
        "- 차량 관리 상담: www.car-consult.kr",
        "- 무료 점검 예약: www.car-check.kr",
        "- 자동차 관리 교육: www.car-edu.kr"
    ],
    [
        "환급이 현재는 어렵습니다. (0~39점)",
        "기본적인 자격 요건이 충족되지 않았습니다.",
        "환급 신청을 위해 필요한 조건들:",
        "1. 차량 소유권 확인",
        "2. 정기 점검 이력 관리",
        "3. 보험 가입 필수",
        "4. 소득 기준 확인",
        "자세한 상담이 필요하시다면:",
        "- 전문가 상담: www.car-expert.kr",
        "- 자격 조건 안내: www.car-qualify.kr"
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

    // 자동차 테스트는 예/아니오 답변만 있음
    answersElement.innerHTML = `
        <button class="answer-btn" onclick="handleAnswer(5)">예</button>
        <button class="answer-btn" onclick="handleAnswer(1)">아니오</button>
    `;
}

// 답변 처리 함수
function handleAnswer(value) {
    score += value;
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showAnalysisPopup(); // 마지막 질문 후 분석 팝업 표시
    }
}

// 분석 팝업 표시 함수
function showAnalysisPopup() {
    questionPage.classList.add('hidden');
    analysisPopup.classList.remove('hidden');

    // 팝업 광고 초기화 (새로 추가)
    const popupAd = analysisPopup.querySelector('.popup-ad');
    try {
        while (popupAd.firstChild) {
            popupAd.removeChild(popupAd.firstChild);
        }
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('팝업 광고 초기화 실패:', e);
    }

    // 7초 카운트다운 후 결과 표시
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
            while (popupAd.firstChild) {
                popupAd.removeChild(popupAd.firstChild);
            }
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
                title: '자동차 수리비 환급 자격 테스트',
                description: '당신은 자동차 수리비 환급 대상자일까요?',
                imageUrl: 'https://testpro.site/자동차/images/car.png',
                link: {
                    mobileWebUrl: 'https://testpro.site/자동차',
                    webUrl: 'https://testpro.site/자동차'
                }
            },
            buttons: [
                {
                    title: '테스트 하기',
                    link: {
                        mobileWebUrl: 'https://testpro.site/자동차',
                        webUrl: 'https://testpro.site/자동차'
                    }
                }
            ]
        });
    });
});

// 페이지 로드 시 광고 초기화
window.onload = function() {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('상단 광고 초기화 실패:', e);
    }
};