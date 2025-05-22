// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

const questions = [
    "현재 통신사 서비스를 이용중이신가요?",
    "최근 2년 내 통신사를 변경하신 적이 있나요?",
    "약정 기간이 만료된 적이 있나요?",
    "통신비 자동이체를 이용하시나요?",
    "가족결합 할인을 받고 계신가요?",
    "통신사 멤버십을 사용하고 계신가요?",
    "스마트폰 할부금을 납부하고 계신가요?",
    "데이터 요금제를 사용중이신가요?",
    "부가서비스에 가입되어 있나요?",
    "통신비 고지서를 확인하시나요?"
];

const results = [
    [
        "통신비 환급 가능성이 매우 높습니다! (90~100점)",
        "통신비 미환급금을 받을 확률이 매우 높습니다.",
        "다음 요건들을 충족하시는 것으로 보입니다:",
        "- 통신사 이용 조건 충족",
        "- 정기적인 요금 납부",
        "- 필요 서류 구비 완료",
        "아래 링크를 통해 즉시 확인해보세요:",
        "1. 통신비 미환급금 조회: <a href='https://www.msit.go.kr' target='_blank'>www.msit.go.kr</a>",
        "2. 통신사별 환급금 확인:",
        "- SKT: <a href='https://www.sktrefund.co.kr' target='_blank'>www.sktrefund.co.kr</a>",
        "- KT: <a href='https://care.kt.com/refund' target='_blank'>care.kt.com/refund</a>",
        "- LG U+: <a href='https://www.uplus.co.kr/refund' target='_blank'>www.uplus.co.kr/refund</a>"
    ],
    [
        "통신비 미환급금을 받을 가능성이 있습니다! (70~89점)",
        "분석 결과, 다음 사항들을 확인해보시면 좋을 것 같습니다:",
        "- 통신사 이동 시 발생한 정산금 확인",
        "- 약정만료 후 요금제 점검",
        "아래 링크를 통해 확인해보세요:",
        "1. 통신비 미환급금 항목: <a href='https://www.msit.go.kr' target='_blank'>www.msit.go.kr</a>",
        "2. 할인혜택 점검:",
        "- 가족결합 할인 대상 확인",
        "- 멤버십 할인 혜택 확인",
        "3. 부가서비스 확인:",
        "- 불필요한 부가서비스 정리",
        "- 요금제 최적화 상담"
    ],
    [
        "몇 가지 환급 항목이 있을 수 있습니다. (50~69점)",
        "다음 사항들을 체크해보세요:",
        "- 약정만료 여부 확인",
        "- 요금제 적정성 검토",
        "아래 링크를 통해 확인해보세요:",
        "1. 기본 확인사항: <a href='https://www.msit.go.kr' target='_blank'>www.msit.go.kr</a>",
        "2. 할인혜택 검토:",
        "- 통신사 케이블TV 결합",
        "- 인터넷 결합상품 확인",
        "3. 통신비 절감 방법:",
        "- 데이터 사용량 분석",
        "- 알뜰폰 전환 검토"
    ],
    [
        "현재는 환급 가능성이 낮습니다. (30~49점)",
        "하지만 다음 사항들을 체크해보시면 도움이 될 것 같습니다:",
        "- 현재 요금제 검토",
        "- 사용 패턴 분석",
        "아래 링크를 통해 확인해보세요:",
        "1. 기본 점검사항: <a href='https://www.msit.go.kr' target='_blank'>www.msit.go.kr</a>",
        "2. 절약 팁:",
        "- 데이터 절약 모드 활용",
        "- 와이파이 활용 극대화",
        "3. 추천 사항:",
        "- 알뜰폰 요금제 비교",
        "- 약정할인 재검토"
    ],
    [
        "지금은 환급이 어려울 수 있습니다. (0~29점)",
        "통신비 절감을 위해 다음 사항들을 참고해보세요:",
        "- 통신사 해지내역 확인",
        "- 미납요금 확인",
        "아래 링크를 통해 확인해보세요:",
        "1. 기본 확인: <a href='https://www.msit.go.kr' target='_blank'>www.msit.go.kr</a>",
        "2. 절약 방법:",
        "- 저가 요금제 전환 검토",
        "- 결합상품 재정비",
        "3. 조언:",
        "- 정기적인 요금 검토 필요",
        "- 통신비 관리 앱 활용"
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
                title: '내 돈인데 안 받으면 손해! 통신비 미환급금 신청 꿀팁 공개',
                description: '숨겨진 통신비 환급금이 있을 수 있습니다! 지금 바로 확인해보세요!',
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