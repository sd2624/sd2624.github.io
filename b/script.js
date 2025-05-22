// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 목록
const questions = [
    "스마트폰을 능숙하게 다루시나요?",
    "하루에 사용 가능한 여유시간이 2시간 이상 있나요?",
    "규칙적인 생활이 가능하신가요?",
    "새로운 앱을 배우는 것에 거부감이 없으신가요?",
    "꾸준한 수익을 원하시나요?",
    "재택근무를 선호하시나요?",
    "SNS 활동을 즐기시나요?",
    "간단한 영상 편집이 가능하신가요?",
    "걷기 운동을 즐기시나요?",
    "온라인 쇼핑을 자주 하시나요?"
];

const results = [
    [
        "당신에게 강력 추천하는 수익형 앱 TOP 5",
        "테스트 결과를 분석한 결과, 다음 앱들이 가장 적합해 보입니다:",
        "",
        "1️⃣ 틱톡라이트 (<a href='http://tiktok.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 회원가입만 해도 8만원 보상!",
        "- 출석체크와 이벤트로 수익이 매우 높음",
        "",
        "2️⃣ 교보라플 (<a href='http://kyobo.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 월 20만보만 걸으면 전체 보상 획득 가능",
        "- 초보자도 쉽게 시작 가능",
        "",
        "3️⃣ 모니모 (<a href='http://monimo.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 만보기, 기상 미션으로 월 5천원 이상 수익",
        "- 다양한 앱테크 경험 가능",
        "",
        "4️⃣ AI 상담사 (<a href='http://ai-counsel.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 하루 2시간 투자로 월 50-100만원 수익",
        "- 재택으로 가능한 고수익 부업",
        "",
        "5️⃣ 영상편집/라이브커머스 (<a href='http://live-commerce.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 스마트폰만으로 쿠팡, 스마트스토어 판매 가능",
        "- 진입장벽이 낮은 수익형 부업"
    ],
    [
        "당신에게 추천하는 수익형 앱 TOP 5",
        "테스트 결과를 분석한 결과, 다음 앱들이 적합해 보입니다:",
        "",
        "1️⃣ 틱톡라이트 (<a href='http://tiktok.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 회원가입만 해도 8만원 보상!",
        "- 출석체크와 이벤트로 수익이 매우 높음",
        "",
        "2️⃣ 교보라플 (<a href='http://kyobo.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 월 20만보만 걸으면 전체 보상 획득 가능",
        "- 초보자도 쉽게 시작 가능",
        "",
        "3️⃣ 모니모 (<a href='http://monimo.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 만보기, 기상 미션으로 월 5천원 이상 수익",
        "- 다양한 앱테크 경험 가능",
        "",
        "4️⃣ AI 상담사 (<a href='http://ai-counsel.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 하루 2시간 투자로 월 50-100만원 수익",
        "- 재택으로 가능한 고수익 부업",
        "",
        "5️⃣ 영상편집/라이브커머스 (<a href='http://live-commerce.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 스마트폰만으로 쿠팡, 스마트스토어 판매 가능",
        "- 진입장벽이 낮은 수익형 부업"
    ],
    [
        "당신에게 적합한 수익형 앱 TOP 5",
        "테스트 결과를 분석한 결과, 다음 앱들이 적합해 보입니다:",
        "",
        "1️⃣ 틱톡라이트 (<a href='http://tiktok.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 회원가입만 해도 8만원 보상!",
        "- 출석체크와 이벤트로 수익이 매우 높음",
        "",
        "2️⃣ 교보라플 (<a href='http://kyobo.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 월 20만보만 걸으면 전체 보상 획득 가능",
        "- 초보자도 쉽게 시작 가능",
        "",
        "3️⃣ 모니모 (<a href='http://monimo.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 만보기, 기상 미션으로 월 5천원 이상 수익",
        "- 다양한 앱테크 경험 가능",
        "",
        "4️⃣ AI 상담사 (<a href='http://ai-counsel.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 하루 2시간 투자로 월 50-100만원 수익",
        "- 재택으로 가능한 고수익 부업",
        "",
        "5️⃣ 영상편집/라이브커머스 (<a href='http://live-commerce.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 스마트폰만으로 쿠팡, 스마트스토어 판매 가능",
        "- 진입장벽이 낮은 수익형 부업"
    ],
    [
        "당신에게 적합한 수익형 앱 TOP 5",
        "테스트 결과를 분석한 결과, 다음 앱들이 적합해 보입니다:",
        "",
        "1️⃣ 틱톡라이트 (<a href='http://tiktok.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 회원가입만 해도 8만원 보상!",
        "- 출석체크와 이벤트로 수익이 매우 높음",
        "",
        "2️⃣ 교보라플 (<a href='http://kyobo.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 월 20만보만 걸으면 전체 보상 획득 가능",
        "- 초보자도 쉽게 시작 가능",
        "",
        "3️⃣ 모니모 (<a href='http://monimo.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 만보기, 기상 미션으로 월 5천원 이상 수익",
        "- 다양한 앱테크 경험 가능",
        "",
        "4️⃣ AI 상담사 (<a href='http://ai-counsel.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 하루 2시간 투자로 월 50-100만원 수익",
        "- 재택으로 가능한 고수익 부업",
        "",
        "5️⃣ 영상편집/라이브커머스 (<a href='http://live-commerce.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 스마트폰만으로 쿠팡, 스마트스토어 판매 가능",
        "- 진입장벽이 낮은 수익형 부업"
    ],
    [
        "당신에게 적합한 수익형 앱 TOP 5",
        "테스트 결과를 분석한 결과, 다음 앱들이 적합해 보입니다:",
        "",
        "1️⃣ 틱톡라이트 (<a href='http://tiktok.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 회원가입만 해도 8만원 보상!",
        "- 출석체크와 이벤트로 수익이 매우 높음",
        "",
        "2️⃣ 교보라플 (<a href='http://kyobo.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 월 20만보만 걸으면 전체 보상 획득 가능",
        "- 초보자도 쉽게 시작 가능",
        "",
        "3️⃣ 모니모 (<a href='http://monimo.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 만보기, 기상 미션으로 월 5천원 이상 수익",
        "- 다양한 앱테크 경험 가능",
        "",
        "4️⃣ AI 상담사 (<a href='http://ai-counsel.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 하루 2시간 투자로 월 50-100만원 수익",
        "- 재택으로 가능한 고수익 부업",
        "",
        "5️⃣ 영상편집/라이브커머스 (<a href='http://live-commerce.com' target='_blank' style='color:#4b6cb7'>바로가기</a>)",
        "- 스마트폰만으로 쿠팡, 스마트스토어 판매 가능",
        "- 진입장벽이 낮은 수익형 부업"
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
                title: '수익형 앱 추천 테스트',
                description: '나에게 맞는 수익형 앱을 찾아보세요!',
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