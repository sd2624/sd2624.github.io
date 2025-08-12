// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 데이터
const questions = [
    {
        question: "현재 보유하고 있는 신분증은 무엇인가요?",
        answers: [
            { text: "운전면허증만 보유", type: "license", priority: 3 },
            { text: "주민등록증만 보유", type: "id", priority: 2 },
            { text: "둘 다 보유", type: "both", priority: 1 },
            { text: "아무것도 없음", type: "none", priority: 4 }
        ]
    },
    {
        question: "현재 보유한 신분증의 발급 연도는?",
        answers: [
            { text: "2020년 이전", urgency: 4, tech: 1 },
            { text: "2020~2022년", urgency: 3, tech: 2 },
            { text: "2023~2024년", urgency: 2, tech: 3 },
            { text: "2025년", urgency: 1, tech: 4 }
        ]
    },
    {
        question: "스마트폰 사용 빈도는 어느 정도인가요?",
        answers: [
            { text: "하루 종일 사용", digital: 4, convenience: 4 },
            { text: "필요할 때만 사용", digital: 3, convenience: 3 },
            { text: "기본 기능만 사용", digital: 2, convenience: 2 },
            { text: "거의 사용하지 않음", digital: 1, convenience: 1 }
        ]
    },
    {
        question: "신분 확인이 필요한 상황은 얼마나 자주 있나요?",
        answers: [
            { text: "거의 매일", frequency: 4, need: 4 },
            { text: "주 2-3회", frequency: 3, need: 3 },
            { text: "월 2-3회", frequency: 2, need: 2 },
            { text: "거의 없음", frequency: 1, need: 1 }
        ]
    },
    {
        question: "온라인 서비스 이용에 대한 성향은?",
        answers: [
            { text: "최신 기술을 빠르게 받아들임", innovation: 4, digital: 4 },
            { text: "편리하면 적극 사용", innovation: 3, digital: 3 },
            { text: "신중하게 접근", innovation: 2, digital: 2 },
            { text: "기존 방식 선호", innovation: 1, digital: 1 }
        ]
    },
    {
        question: "신분증 분실 또는 도난 경험이 있나요?",
        answers: [
            { text: "여러 번 경험", security: 4, urgency: 4 },
            { text: "한 번 경험", security: 3, urgency: 3 },
            { text: "거의 분실할 뻔", security: 2, urgency: 2 },
            { text: "전혀 없음", security: 1, urgency: 1 }
        ]
    },
    {
        question: "새로운 신분증에 가장 기대하는 기능은?",
        answers: [
            { text: "모바일 연동 기능", expectation: "mobile" },
            { text: "강화된 보안", expectation: "security" },
            { text: "빠른 발급", expectation: "speed" },
            { text: "기존과 동일", expectation: "traditional" }
        ]
    },
    {
        question: "신분증 발급을 위해 선호하는 방법은?",
        answers: [
            { text: "온라인 신청", method: "online", convenience: 4 },
            { text: "모바일 앱", method: "mobile", convenience: 4 },
            { text: "무인 발급기", method: "kiosk", convenience: 3 },
            { text: "직접 방문", method: "visit", convenience: 1 }
        ]
    }
];

// 결과 타입 정의
const resultTypes = {
    "디지털 얼리어답터": {
        title: "🚀 디지털 얼리어답터",
        description: "축하합니다! 당신은 새로운 디지털 신분증의 최적 사용자입니다.",
        badge: "🏆",
        bgColor: "linear-gradient(45deg, #667eea, #764ba2)",
        summary: "최신 기술을 빠르게 받아들이고 디지털 환경에 익숙한 당신에게는 모바일 디지털 신분증이 완벽합니다.",
        details: `
            <h4>🎯 맞춤 혜택</h4>
            <ul>
                <li>📱 모바일 디지털 신분증 우선 발급</li>
                <li>💰 얼리어답터 할인 혜택 (발급수수료 50% 할인)</li>
                <li>⚡ 즉시 발급 서비스</li>
                <li>🔐 생체인증 연동 서비스</li>
                <li>🎁 디지털 지갑 연동 보너스</li>
            </ul>
            
            <h4>📋 발급 절차</h4>
            <ol>
                <li>모바일 앱 다운로드</li>
                <li>본인인증 (생체정보 등록)</li>
                <li>기존 신분증 사진 업로드</li>
                <li>즉시 발급 완료</li>
            </ol>
        `,
        actions: [
            { text: "🏛️ 정부24 디지털신분증", url: "https://www.gov.kr" },
            { text: "📱 모바일 신분증 앱", url: "https://play.google.com" },
            { text: "💳 디지털 지갑 연동", url: "https://www.gov.kr" },
            { text: "🔒 생체인증 등록", url: "https://www.nicepass.co.kr" }
        ]
    },
    "스마트 업그레이더": {
        title: "📱 스마트 업그레이더",
        description: "기존 방식에서 한 단계 업그레이드할 준비가 된 당신!",
        badge: "⭐",
        bgColor: "linear-gradient(45deg, #4facfe, #00f2fe)",
        summary: "편리함을 추구하면서도 신중한 접근을 선호하는 당신에게는 하이브리드 신분증이 적합합니다.",
        details: `
            <h4>🎯 추천 서비스</h4>
            <ul>
                <li>💳 물리적 카드 + 디지털 기능</li>
                <li>📞 온라인/오프라인 병행 발급</li>
                <li>🛡️ 단계적 보안 업그레이드</li>
                <li>🎯 맞춤형 기능 선택</li>
                <li>📚 사용법 가이드 제공</li>
            </ul>
            
            <h4>📋 발급 과정</h4>
            <ol>
                <li>온라인 사전 신청</li>
                <li>필요 서류 준비</li>
                <li>가까운 발급소 방문 또는 우편 발급</li>
                <li>디지털 기능 활성화 (선택)</li>
            </ol>
        `,
        actions: [
            { text: "🏛️ 온라인 신청", url: "https://www.gov.kr" },
            { text: "📍 발급소 찾기", url: "https://www.safekorea.go.kr" },
            { text: "📄 필요서류 안내", url: "https://www.hikorea.go.kr" },
            { text: "💡 사용법 가이드", url: "https://www.gov.kr" }
        ]
    },
    "안정형 전환자": {
        title: "🛡️ 안정형 전환자",
        description: "신중하면서도 필요에 의한 현명한 선택을 하는 당신!",
        badge: "✅",
        bgColor: "linear-gradient(45deg, #43e97b, #38f9d7)",
        summary: "기존 방식을 선호하지만 보안과 편의성 향상이 필요한 당신에게는 표준 업그레이드가 적합합니다.",
        details: `
            <h4>🎯 안정적 혜택</h4>
            <ul>
                <li>🆔 기존 신분증과 동일한 사용법</li>
                <li>🔒 보안 기능만 강화</li>
                <li>📞 전화 상담 지원</li>
                <li>🏢 방문 발급 우선</li>
                <li>📋 상세한 안내서 제공</li>
            </ul>
            
            <h4>📋 발급 절차</h4>
            <ol>
                <li>전화 또는 방문 상담</li>
                <li>기존 신분증 지참 방문</li>
                <li>서류 작성 및 사진 촬영</li>
                <li>2-3일 후 수령</li>
            </ol>
        `,
        actions: [
            { text: "📞 상담센터 연결", url: "tel:1588-2100" },
            { text: "🏢 가까운 발급소", url: "https://www.safekorea.go.kr" },
            { text: "📋 발급 안내서", url: "https://www.hikorea.go.kr" },
            { text: "❓ 자주묻는질문", url: "https://www.gov.kr" }
        ]
    },
    "기본형 유지자": {
        title: "📄 기본형 유지자",
        description: "현재 상황에서는 기존 신분증 유지가 가장 적합합니다.",
        badge: "📝",
        bgColor: "linear-gradient(45deg, #ffa726, #fb8c00)",
        summary: "급하게 변경할 필요는 없지만, 향후 필요시 쉽게 업그레이드할 수 있는 정보를 제공합니다.",
        details: `
            <h4>🎯 현재 상황</h4>
            <ul>
                <li>📄 기존 신분증으로 충분</li>
                <li>⏰ 여유를 두고 천천히 결정</li>
                <li>📚 정보 수집 단계</li>
                <li>💡 필요시 언제든 변경 가능</li>
                <li>🔔 변경 시기 알림 서비스</li>
            </ul>
            
            <h4>📋 향후 계획</h4>
            <ol>
                <li>기존 신분증 유효기간 확인</li>
                <li>새로운 정보 지속적 모니터링</li>
                <li>필요시 상담 후 결정</li>
                <li>단계적 변경 고려</li>
            </ol>
        `,
        actions: [
            { text: "📅 유효기간 확인", url: "https://www.safekorea.go.kr" },
            { text: "📧 알림 서비스 신청", url: "https://www.gov.kr" },
            { text: "📞 상담 예약", url: "https://www.hikorea.go.kr" },
            { text: "📰 최신 정보", url: "https://www.gov.kr" }
        ]
    }
};

let currentQuestionIndex = 0;
let userResponses = [];
let analysisResult = {};

// DOM 요소
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const analysisPopup = document.getElementById('analysisPopup');

// 시작 함수
function startTest() {
    console.log('startTest function called');
    
    currentQuestionIndex = 0;
    userResponses = [];
    analysisResult = {};
    
    const startPage = document.getElementById('startPage');
    const questionPage = document.getElementById('questionPage');
    
    console.log('Start page element:', !!startPage);
    console.log('Question page element:', !!questionPage);
    
    if (startPage) {
        startPage.classList.add('hidden');
        console.log('Start page hidden');
    }
    if (questionPage) {
        questionPage.classList.remove('hidden');
        console.log('Question page shown');
    }
    showQuestion();
}

// 질문 표시 함수
function showQuestion() {
    const progressFill = document.querySelector('.progress-fill');
    const questionCounter = document.querySelector('.question-counter');
    const questionText = document.querySelector('.question-text');
    const answersGrid = document.querySelector('.answers-grid');
    
    // 진행률 업데이트
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    if (questionCounter) {
        questionCounter.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
    }
    
    // 질문과 답변 표시
    const currentQuestion = questions[currentQuestionIndex];
    if (questionText) {
        questionText.textContent = currentQuestion.question;
    }
    
    if (answersGrid) {
        answersGrid.innerHTML = '';
        currentQuestion.answers.forEach((answer, index) => {
            const answerElement = document.createElement('div');
            answerElement.className = 'answer-option';
            answerElement.textContent = answer.text;
            answerElement.onclick = () => selectAnswer(answer, index);
            answersGrid.appendChild(answerElement);
        });
    }
}

// 답변 선택 함수
function selectAnswer(answer, index) {
    // 선택된 답변 저장
    userResponses[currentQuestionIndex] = answer;
    
    // 시각적 피드백
    const answers = document.querySelectorAll('.answer-option');
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
    }, 600);
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
    
    // 팝업 광고 초기화
    setTimeout(() => {
        if (typeof adsbygoogle !== 'undefined') {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, 100);
    
    // 카운트다운 시작
    let countdown = 5;
    const countdownElement = document.querySelector('.countdown-display');
    
    const timer = setInterval(() => {
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }
        countdown--;
        
        if (countdown < 0) {
            clearInterval(timer);
            analyzeResults();
            showResult();
        }
    }, 1000);
}

// 결과 분석 함수
function analyzeResults() {
    let scores = {
        digital: 0,
        urgency: 0,
        convenience: 0,
        security: 0,
        innovation: 0,
        frequency: 0
    };
    
    let preferences = {
        expectation: '',
        method: '',
        type: ''
    };
    
    // 응답 분석
    userResponses.forEach((response, index) => {
        // 점수 계산
        Object.keys(scores).forEach(key => {
            if (response[key]) {
                scores[key] += response[key];
            }
        });
        
        // 선호도 저장
        if (response.expectation) preferences.expectation = response.expectation;
        if (response.method) preferences.method = response.method;
        if (response.type) preferences.type = response.type;
    });
    
    // 결과 타입 결정
    let resultType;
    const totalDigital = scores.digital + scores.innovation + scores.convenience;
    const totalUrgency = scores.urgency + scores.frequency + scores.security;
    
    if (totalDigital >= 10 && scores.innovation >= 3) {
        resultType = "디지털 얼리어답터";
    } else if (totalDigital >= 7 && totalUrgency >= 6) {
        resultType = "스마트 업그레이더";
    } else if (totalUrgency >= 4 || scores.security >= 3) {
        resultType = "안정형 전환자";
    } else {
        resultType = "기본형 유지자";
    }
    
    analysisResult = {
        type: resultType,
        scores: scores,
        preferences: preferences,
        recommendation: resultTypes[resultType]
    };
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
    
    const result = analysisResult.recommendation;
    
    // 결과 내용 업데이트
    const resultTitle = document.querySelector('.result-title');
    const resultBadge = document.querySelector('.result-badge');
    const resultSummary = document.querySelector('.result-summary');
    const resultDetails = document.querySelector('.result-details');
    const actionGuide = document.querySelector('.action-guide');
    
    if (resultTitle) {
        resultTitle.textContent = result.title;
    }
    
    if (resultBadge) {
        resultBadge.style.background = result.bgColor;
        resultBadge.textContent = result.badge;
    }
    
    if (resultSummary) {
        resultSummary.innerHTML = `
            <h3>${result.description}</h3>
            <p>${result.summary}</p>
        `;
    }
    
    if (resultDetails) {
        resultDetails.innerHTML = result.details;
    }
    
    if (actionGuide) {
        actionGuide.innerHTML = `
            <h4>🔗 바로가기 링크</h4>
            <div class="guide-links">
                ${result.actions.map(action => `
                    <a href="${action.url}" target="_blank" class="guide-link">
                        ${action.text}
                    </a>
                `).join('')}
            </div>
            <div style="margin-top: 30px; padding: 20px; background: rgba(102, 126, 234, 0.1); border-radius: 15px;">
                <h4 style="color: #667eea; margin-bottom: 10px;">💡 추가 정보</h4>
                <p style="color: #333; font-size: 0.95em; line-height: 1.5;">
                    2025년 하반기부터 새로운 신분증 시스템이 본격 도입됩니다. 
                    미리 준비하여 더 편리하고 안전한 신분증을 이용해보세요!
                </p>
            </div>
        `;
    }
}

// 테스트 재시작 함수
function restartTest() {
    currentQuestionIndex = 0;
    userResponses = [];
    analysisResult = {};
    
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
    const result = analysisResult.recommendation;
    const title = result ? result.title : '2025년 새로운 신분증 발급 안내';
    const description = result ? result.description : '나에게 맞는 신분증 발급 방법을 확인해보세요!';
    
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '신분증 발급 안내 테스트',
                description: `${title} - ${description}`,
                imageUrl: window.location.origin + '/신분증/신분증.svg',
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
        const text = `신분증 발급 안내 테스트 - ${title}`;
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
    console.log('DOM Content Loaded');
    
    // 광고 초기화
    if (typeof adsbygoogle !== 'undefined') {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
    
    // 이벤트 리스너 등록
    const startBtn = document.querySelector('.start-btn');
    const actionBtns = document.querySelectorAll('.action-btn');
    const kakaoShares = document.querySelectorAll('.kakao-share');
    
    console.log('Start button found:', !!startBtn);
    
    if (startBtn) {
        console.log('Adding click listener to start button');
        startBtn.addEventListener('click', function(e) {
            console.log('Start button clicked');
            e.preventDefault();
            startTest();
        });
    }
    
    actionBtns.forEach(btn => {
        if (btn.textContent.includes('다른 테스트')) {
            btn.addEventListener('click', () => {
                window.location.href = 'https://testpro.site';
            });
        }
    });
    
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
        if (num >= 1 && num <= 4) {
            const answers = document.querySelectorAll('.answer-option');
            if (answers[num - 1]) {
                answers[num - 1].click();
            }
        }
    }
});

// 전역 함수로 노출
window.startTest = startTest;
window.restartTest = restartTest;
window.shareKakao = shareKakao;

// 화면 크기 변경 대응
window.addEventListener('resize', function() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// 초기 실행
window.addEventListener('load', function() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});
