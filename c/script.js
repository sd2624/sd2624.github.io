// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 목록
const questions = [
    "현재 대출이 있으신가요?",
    "다중 대출을 사용하고 계신가요?",
    "최근 3개월 내 연체 이력이 있으신가요?",
    "연소득이 3천만원 이상이신가요?",
    "4대 보험에 가입되어 있나요?",
    "신용점수가 680점 이상인가요?",
    "재직기간이 6개월 이상이신가요?",
    "주택을 소유하고 계신가요?",
    "현재 대출 이자율이 7% 이상인가요?",
    "부채가 연소득을 초과하나요?"
];

const results = [
    [
        "대출 통합 및 금리 인하 가능성이 높습니다!",
        "분석 결과, 다음과 같은 해결책을 추천드립니다:",
        "",
        "1️⃣ 정부지원 저금리 대환대출 (<a href='http://gov-loan.kr' target='_blank' style='color:#4b6cb7'>자격조건 확인하기</a>)",
        "- 최대 2.5% 금리로 대출 통합 가능",
        "- 연간 최대 500만원 이자 절감",
        "",
        "2️⃣ 신용점수 무료 상담 (<a href='http://credit-help.kr' target='_blank' style='color:#4b6cb7'>상담신청</a>)",
        "- 맞춤형 신용점수 개선 방법 제공",
        "- 대출 금리 인하 전략 수립",
        "",
        "3️⃣ 생활자금 지원 프로그램 (<a href='http://life-support.kr' target='_blank' style='color:#4b6cb7'>지원내용 보기</a>)",
        "- 생활비 지원 최대 월 50만원",
        "- 취업 지원 및 직업 교육 연계"
    ],
    [
        "대출 통합 및 금리 인하 가능성이 있습니다.",
        "다음과 같은 해결책을 고려해보세요:",
        "",
        "1️⃣ 정부지원 저금리 대환대출 (<a href='http://gov-loan.kr' target='_blank' style='color:#4b6cb7'>자격조건 확인하기</a>)",
        "- 최대 3.0% 금리로 대출 통합 가능",
        "- 연간 최대 300만원 이자 절감",
        "",
        "2️⃣ 신용점수 무료 상담 (<a href='http://credit-help.kr' target='_blank' style='color:#4b6cb7'>상담신청</a>)",
        "- 맞춤형 신용점수 개선 방법 제공",
        "- 대출 금리 인하 전략 수립",
        "",
        "3️⃣ 생활자금 지원 프로그램 (<a href='http://life-support.kr' target='_blank' style='color:#4b6cb7'>지원내용 보기</a>)",
        "- 생활비 지원 최대 월 30만원",
        "- 취업 지원 및 직업 교육 연계"
    ],
    [
        "대출 통합 및 금리 인하 가능성이 보통입니다.",
        "다음과 같은 해결책을 고려해보세요:",
        "",
        "1️⃣ 정부지원 저금리 대환대출 (<a href='http://gov-loan.kr' target='_blank' style='color:#4b6cb7'>자격조건 확인하기</a>)",
        "- 최대 3.5% 금리로 대출 통합 가능",
        "- 연간 최대 200만원 이자 절감",
        "",
        "2️⃣ 신용점수 무료 상담 (<a href='http://credit-help.kr' target='_blank' style='color:#4b6cb7'>상담신청</a>)",
        "- 맞춤형 신용점수 개선 방법 제공",
        "- 대출 금리 인하 전략 수립",
        "",
        "3️⃣ 생활자금 지원 프로그램 (<a href='http://life-support.kr' target='_blank' style='color:#4b6cb7'>지원내용 보기</a>)",
        "- 생활비 지원 최대 월 20만원",
        "- 취업 지원 및 직업 교육 연계"
    ],
    [
        "대출 통합 및 금리 인하 가능성이 낮습니다.",
        "다음과 같은 해결책을 고려해보세요:",
        "",
        "1️⃣ 정부지원 저금리 대환대출 (<a href='http://gov-loan.kr' target='_blank' style='color:#4b6cb7'>자격조건 확인하기</a>)",
        "- 최대 4.0% 금리로 대출 통합 가능",
        "- 연간 최대 100만원 이자 절감",
        "",
        "2️⃣ 신용점수 무료 상담 (<a href='http://credit-help.kr' target='_blank' style='color:#4b6cb7'>상담신청</a>)",
        "- 맞춤형 신용점수 개선 방법 제공",
        "- 대출 금리 인하 전략 수립",
        "",
        "3️⃣ 생활자금 지원 프로그램 (<a href='http://life-support.kr' target='_blank' style='color:#4b6cb7'>지원내용 보기</a>)",
        "- 생활비 지원 최대 월 10만원",
        "- 취업 지원 및 직업 교육 연계"
    ],
    [
        "대출 통합 및 금리 인하 가능성이 매우 낮습니다.",
        "다음과 같은 해결책을 고려해보세요:",
        "",
        "1️⃣ 정부지원 저금리 대환대출 (<a href='http://gov-loan.kr' target='_blank' style='color:#4b6cb7'>자격조건 확인하기</a>)",
        "- 최대 4.5% 금리로 대출 통합 가능",
        "- 연간 최대 50만원 이자 절감",
        "",
        "2️⃣ 신용점수 무료 상담 (<a href='http://credit-help.kr' target='_blank' style='color:#4b6cb7'>상담신청</a>)",
        "- 맞춤형 신용점수 개선 방법 제공",
        "- 대출 금리 인하 전략 수립",
        "",
        "3️⃣ 생활자금 지원 프로그램 (<a href='http://life-support.kr' target='_blank' style='color:#4b6cb7'>지원내용 보기</a>)",
        "- 생활비 지원 최대 월 5만원",
        "- 취업 지원 및 직업 교육 연계"
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
                title: '대출 이자에 허덕이지 마세요! 지금 당장 이 방법 써보세요',
                description: '대출 이자 부담 줄이는 특별한 방법을 확인해보세요!',
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
    // 상단 광고 초기화
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('상단 광고 초기화 실패:', e);
    }
};