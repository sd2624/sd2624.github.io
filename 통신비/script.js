// 전역 변수
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswers = [];

// 질문 데이터
const questions = [
    {
        question: "어떤 지역에 거주하고 계신가요?",
        answers: [
            { text: "서울특별시", value: "seoul" },
            { text: "부산광역시", value: "busan" },
            { text: "대구광역시", value: "daegu" },
            { text: "인천광역시", value: "incheon" },
            { text: "광주광역시", value: "gwangju" },
            { text: "대전광역시", value: "daejeon" },
            { text: "울산광역시", value: "ulsan" },
            { text: "세종특별자치시", value: "sejong" },
            { text: "경기도", value: "gyeonggi" },
            { text: "강원특별자치도", value: "gangwon" },
            { text: "충청북도", value: "chungbuk" },
            { text: "충청남도", value: "chungnam" },
            { text: "전라북도", value: "jeonbuk" },
            { text: "전라남도", value: "jeonnam" },
            { text: "경상북도", value: "gyeongbuk" },
            { text: "경상남도", value: "gyeongnam" },
            { text: "제주특별자치도", value: "jeju" }
        ]
    },
    {
        question: "현재 어떤 통신사를 이용하고 계신가요?",
        answers: [
            { text: "SKT", value: "skt" },
            { text: "KT", value: "kt" },
            { text: "LG U+", value: "lgu" },
            { text: "알뜰폰 (MVNO)", value: "mvno" },
            { text: "기타", value: "etc" }
        ]
    },
    {
        question: "통신비 미환급금 조회를 해보신 적이 있나요?",
        answers: [
            { text: "네, 조회해봤습니다", value: "yes" },
            { text: "아니요, 처음입니다", value: "no" },
            { text: "조회 방법을 몰랐습니다", value: "unknown" }
        ]
    },
    {
        question: "주로 어떤 통신 서비스를 많이 이용하시나요?",
        answers: [
            { text: "음성통화 위주", value: "voice" },
            { text: "데이터 위주", value: "data" },
            { text: "문자메시지 위주", value: "sms" },
            { text: "모든 서비스 골고루", value: "all" }
        ]
    },
    {
        question: "통신비 관련 정보를 주로 어디서 얻으시나요?",
        answers: [
            { text: "통신사 공식 홈페이지", value: "official" },
            { text: "온라인 커뮤니티", value: "community" },
            { text: "뉴스/미디어", value: "news" },
            { text: "주변 지인", value: "friend" }
        ]
    }
];

// 지역별 결과 데이터
const regionResults = {
    seoul: {
        title: "서울특별시 통신비 미환급금 조회",
        description: "서울시에서는 통신비 미환급금 조회를 위한 다양한 온라인 서비스를 제공하고 있습니다.",
        info: "서울시 시민들은 온라인 민원24 시스템을 통해 간편하게 조회할 수 있으며, 구청 별로도 전용 창구가 운영되고 있습니다.",
        links: [
            { text: "서울시 온라인 민원24", url: "https://www.seoul.go.kr", icon: "🏛️" },
            { text: "통신비 환급금 조회 시스템", url: "https://refund.go.kr", icon: "💰" },
            { text: "서울시 소비자보호센터", url: "https://consumer.seoul.go.kr", icon: "🛡️" }
        ]
    },
    busan: {
        title: "부산광역시 통신비 미환급금 조회",
        description: "부산시는 시민 편의를 위한 통합 조회 시스템을 운영하고 있습니다.",
        info: "부산시민들은 부산시청 홈페이지나 구·군청을 통해 통신비 미환급금을 조회할 수 있으며, 온라인과 오프라인 모두 지원됩니다.",
        links: [
            { text: "부산시청 민원포털", url: "https://www.busan.go.kr", icon: "🏛️" },
            { text: "부산 소비자분쟁조정위원회", url: "https://consumer.busan.go.kr", icon: "⚖️" },
            { text: "통신비 환급 신청", url: "https://refund.go.kr", icon: "💰" }
        ]
    },
    gyeonggi: {
        title: "경기도 통신비 미환급금 조회",
        description: "경기도는 31개 시·군별로 다양한 조회 방법을 제공하고 있습니다.",
        info: "거주하는 시·군청 홈페이지나 경기도청 통합 시스템을 통해 조회 가능하며, 각 지역별 소비자센터에서도 도움을 받을 수 있습니다.",
        links: [
            { text: "경기도청 민원포털", url: "https://www.gg.go.kr", icon: "🏛️" },
            { text: "경기도 소비자정보센터", url: "https://consumer.gg.go.kr", icon: "📊" },
            { text: "통신비 환급금 조회", url: "https://refund.go.kr", icon: "💰" }
        ]
    },
    default: {
        title: "전국 통신비 미환급금 조회",
        description: "거주 지역과 관계없이 전국 어디서나 이용 가능한 조회 시스템입니다.",
        info: "해당 지역의 시·군·구청 홈페이지나 전국 통합 민원포털을 통해 조회할 수 있으며, 방문 신청도 가능합니다.",
        links: [
            { text: "정부24 민원포털", url: "https://www.gov.kr", icon: "🏛️" },
            { text: "통신비 환급금 조회 시스템", url: "https://refund.go.kr", icon: "💰" },
            { text: "한국소비자원", url: "https://www.kca.go.kr", icon: "🛡️" },
            { text: "통신위원회", url: "https://www.kcc.go.kr", icon: "📡" }
        ]
    }
};

// DOM 요소
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const analysisPopup = document.getElementById('analysisPopup');

// 시작 함수
function startTest() {
    const startPage = document.getElementById('startPage');
    const questionPage = document.getElementById('questionPage');
    
    if (startPage) {
        startPage.classList.add('hidden');
    }
    if (questionPage) {
        questionPage.classList.remove('hidden');
    }
    showQuestion();
}

// 질문 표시 함수
function showQuestion() {
    const progressBar = document.querySelector('.progress');
    const questionCounter = document.querySelector('.question-counter');
    const questionElement = document.querySelector('.question');
    const answersElement = document.querySelector('.answers');
    
    // 진행률 업데이트
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
    if (questionCounter) {
        questionCounter.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
    }
    
    // 질문과 답변 표시
    const currentQuestion = questions[currentQuestionIndex];
    if (questionElement) {
        questionElement.textContent = currentQuestion.question;
    }
    
    if (answersElement) {
        answersElement.innerHTML = '';
        currentQuestion.answers.forEach((answer, index) => {
            const answerElement = document.createElement('div');
            answerElement.className = 'answer';
            answerElement.textContent = answer.text;
            answerElement.onclick = () => selectAnswer(answer, index);
            answersElement.appendChild(answerElement);
        });
    }
}

// 답변 선택 함수
function selectAnswer(answer, index) {
    // 선택된 답변 저장
    selectedAnswers[currentQuestionIndex] = answer;
    
    // 시각적 피드백
    const answers = document.querySelectorAll('.answer');
    answers.forEach(ans => ans.classList.remove('selected'));
    answers[index].classList.add('selected');
    
    // 잠시 후 다음 질문으로
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showAnalysisPopup();
        }
    }, 500);
}

// 분석 팝업 표시
function showAnalysisPopup() {
    const questionPage = document.getElementById('questionPage');
    const analysisPopup = document.getElementById('analysisPopup');
    
    if (questionPage) {
        questionPage.classList.add('hidden');
    }
    if (analysisPopup) {
        analysisPopup.classList.remove('hidden');
    }
    
    // 카운트다운 시작
    let countdown = 3;
    const countdownElement = document.querySelector('.countdown');
    
    const timer = setInterval(() => {
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }
        countdown--;
        
        if (countdown < 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);
}

// 결과 표시 함수
function showResult() {
    const analysisPopup = document.getElementById('analysisPopup');
    const resultPage = document.getElementById('resultPage');
    
    if (analysisPopup) {
        analysisPopup.classList.add('hidden');
    }
    if (resultPage) {
        resultPage.classList.remove('hidden');
    }
    
    // 선택된 지역 정보 가져오기
    const selectedRegion = selectedAnswers[0]?.value || 'default';
    const result = regionResults[selectedRegion] || regionResults.default;
    
    // 결과 내용 업데이트
    const resultTitle = document.querySelector('.result-title');
    const resultContent = document.querySelector('.result-content');
    
    if (resultTitle) {
        resultTitle.textContent = result.title;
    }
    
    if (resultContent) {
        resultContent.innerHTML = `
            <h3>${result.description}</h3>
            <p style="margin-top: 20px;">${result.info}</p>
            <div class="result-links" style="margin-top: 30px;">
                <h4 style="margin-bottom: 15px;">📋 바로가기 링크</h4>
                ${result.links.map(link => `
                    <a href="${link.url}" target="_blank" class="result-link" style="
                        display: inline-block;
                        margin: 5px 10px;
                        padding: 10px 20px;
                        background: linear-gradient(45deg, #FF8F00, #FF6F00);
                        color: white;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: bold;
                        transition: all 0.3s ease;
                        box-shadow: 0 3px 10px rgba(255, 143, 0, 0.3);
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(255, 143, 0, 0.4)'"
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 10px rgba(255, 143, 0, 0.3)'"
                    >
                        ${link.icon} ${link.text}
                    </a>
                `).join('')}
            </div>
            <div style="margin-top: 30px; padding: 20px; background: #fff3e0; border-radius: 10px; border-left: 4px solid #FF8F00;">
                <h4 style="color: #E65100; margin-bottom: 10px;">💡 추가 정보</h4>
                <p style="color: #333; font-size: 0.95em; line-height: 1.5;">
                    통신비 미환급금은 과납한 통신료, 위약금 과징수, 서비스 중단으로 인한 환급금 등이 포함됩니다. 
                    정기적으로 조회하여 놓친 환급금이 없는지 확인해보세요.
                </p>
            </div>
        `;
    }
    
    // 결과 이미지 업데이트
    const resultImg = document.querySelector('.result-img');
    if (resultImg) {
        resultImg.style.background = 'linear-gradient(45deg, #FF8F00, #FF6F00, #E65100)';
        resultImg.innerHTML = '<div style="font-size: 60px; line-height: 150px;">💰</div>';
    }
}

// 테스트 재시작 함수
function restartTest() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswers = [];
    
    const resultPage = document.getElementById('resultPage');
    const startPage = document.getElementById('startPage');
    
    if (resultPage) {
        resultPage.classList.add('hidden');
    }
    if (startPage) {
        startPage.classList.remove('hidden');
    }
}

// 카카오톡 공유 함수
function shareKakao() {
    const selectedRegion = selectedAnswers[0]?.value || 'default';
    const result = regionResults[selectedRegion] || regionResults.default;
    
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '통신비 미환급금 조회 테스트',
                description: `${result.title} - 나의 지역별 조회방법을 확인해보세요!`,
                imageUrl: window.location.origin + '/통신비/통신비.svg',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
            buttons: [
                {
                    title: '테스트 하기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });
    } else {
        // 카카오톡 SDK가 없을 경우 대체 공유 방법
        const text = `통신비 미환급금 조회 테스트 - ${result.title}`;
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: text,
                url: url
            });
        } else {
            // 클립보드에 복사
            navigator.clipboard.writeText(`${text} ${url}`).then(() => {
                alert('링크가 클립보드에 복사되었습니다!');
            });
        }
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 카카오 SDK 초기화 (실제 앱 키로 교체 필요)
    if (typeof Kakao !== 'undefined') {
        if (!Kakao.isInitialized()) {
            Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c'); // 실제 카카오 앱 키로 교체
        }
    }
    
    // 첫 번째 질문 준비 (하지만 숨겨진 상태로)
    if (questions.length > 0) {
        showQuestion();
    }
    
    // 이벤트 리스너 등록
    const startBtn = document.querySelector('.start-btn');
    const retryBtn = document.querySelector('.retry-btn');
    const kakaoShares = document.querySelectorAll('.kakao-share');
    
    if (startBtn) {
        startBtn.addEventListener('click', startTest);
    }
    
    if (retryBtn) {
        retryBtn.addEventListener('click', restartTest);
    }
    
    kakaoShares.forEach(share => {
        share.addEventListener('click', shareKakao);
    });
});

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    const analysisPopup = document.getElementById('analysisPopup');
    const questionPage = document.getElementById('questionPage');
    
    if (e.key === 'Escape') {
        if (analysisPopup && !analysisPopup.classList.contains('hidden')) {
            analysisPopup.classList.add('hidden');
            if (questionPage) {
                questionPage.classList.remove('hidden');
            }
        }
    }
    
    // 숫자 키로 답변 선택
    if (questionPage && !questionPage.classList.contains('hidden')) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 9) {
            const answers = document.querySelectorAll('.answer');
            if (answers[num - 1]) {
                answers[num - 1].click();
            }
        }
    }
});

// 화면 크기 변경 대응
window.addEventListener('resize', function() {
    // 모바일에서 주소창 숨김/표시 대응
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// 초기 실행
window.addEventListener('load', function() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});
