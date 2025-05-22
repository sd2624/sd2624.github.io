// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

const questions = [
    "건강보험에 가입되어 있나요?",
    "최근 2년 내 직장을 옮기신 적이 있나요?",
    "건강보험료를 자동이체로 납부하시나요?",
    "연말정산 시 의료비 공제를 받으셨나요?",
    "가족 중 피부양자가 있으신가요?",
    "최근 3개월 내 병원 진료를 받으셨나요?",
    "국민건강보험공단 홈페이지에 가입되어 있나요?",
    "건강검진을 정기적으로 받으시나요?",
    "건강보험료를 정상적으로 납부중이신가요?",
    "실손보험에 가입되어 있나요?"
];

const results = [
    [
        "건강보험료 환급금을 받을 가능성이 매우 높습니다! (90~100점)",
        "분석 결과, 다음과 같은 환급 항목이 있을 수 있습니다:",
        "",
        "1️⃣ 건강보험료 환급금 조회 (<a href='https://www.nhis.or.kr' target='_blank'>바로가기</a>)",
        "- 과오납부 보험료 확인",
        "- 정산금 환급 확인",
        "",
        "2️⃣ 건강보험 자격득실 확인 (<a href='https://www.nhis.or.kr/member' target='_blank'>조회하기</a>)",
        "- 이중납부 보험료 확인",
        "- 자격이력 정산내역 확인",
        "",
        "3️⃣ 건강검진 관련 환급 (<a href='https://www.nhis.or.kr/checkup' target='_blank'>신청하기</a>)",
        "- 건강검진 비용 환급",
        "- 검진기관 변경에 따른 환급금"
    ],
    [
        "건강보험료 환급 가능성이 있습니다. (75~89점)",
        "다음 항목들을 확인해보세요:",
        "",
        "1️⃣ 근무지 변경 정산 (<a href='https://www.nhis.or.kr' target='_blank'>확인하기</a>)",
        "- 직장 변경시 정산금",
        "- 보험료 이중납부 확인",
        "",
        "2️⃣ 의료비 환급 확인",
        "- 본인부담상한제 해당여부",
        "- 의료비 정산 내역"
    ],
    // ...나머지 결과 배열...
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
        .map(line => `<p style="margin: 10px 0; line-height: 1.5;">${line}</p>`)
        .join('');

    // 링크 스타일 추가
    const links = resultContent.querySelectorAll('a');
    links.forEach(link => {
        link.style.color = '#4b6cb7';
        link.style.textDecoration = 'underline';
        link.style.fontWeight = 'bold';
    });
}

// 카카오톡 공유하기
document.querySelectorAll('.kakao-share').forEach(button => {
    button.addEventListener('click', () => {
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '내 돈인데 왜 안 찾아가세요? 건강보험료 환급금, 지금 바로 확인!',
                description: '숨겨진 건강보험료 환급금이 있을 수 있습니다! 지금 바로 확인해보세요!',
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

// 페이지 로드 시 광고 초기화
window.onload = function() {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('상단 광고 초기화 실패:', e);
    }
};