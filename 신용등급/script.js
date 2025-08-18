// [광고] AdManager 클래스 - 광고 로드 및 중복 방지 관리
class AdManager {
    constructor() {
        this.loadedAds = new Set(); // 로드된 광고 추적
    }
    
    // 광고 로드 함수
    loadAd(adId) {
        if (this.loadedAds.has(adId)) {
            console.log(`[광고] ${adId} 이미 로드됨 - 중복 방지`);
            return false;
        }
        
        const adElement = document.getElementById(adId);
        if (adElement && typeof adsbygoogle !== 'undefined') {
            try {
                // 광고 컨테이너 표시
                adElement.style.display = 'block';
                
                // 광고 푸시
                (adsbygoogle = window.adsbygoogle || []).push({});
                
                this.loadedAds.add(adId);
                console.log(`[광고] ${adId} 로드 완료`);
                return true;
            } catch (error) {
                console.warn(`[광고] ${adId} 로드 실패:`, error);
                return false;
            }
        }
        return false;
    }
    
    // 중간 광고 표시 (3번째 질문 후)
    showMidAd() {
        return this.loadAd('adMid');
    }
    
    // 결과 광고 표시
    showResultAd() {
        return this.loadAd('adResult');
    }
}

// [광고] AdManager 인스턴스 생성
const adManager = new AdManager();

// [광고] IntersectionObserver를 이용한 광고 표시 관리
const setupAdObservers = () => {
    if (typeof IntersectionObserver === 'undefined') return;
    
    const options = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    // 중간 광고 관찰자
    const midAdObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                adManager.showMidAd();
                midAdObserver.unobserve(entry.target);
            }
        });
    }, options);
    
    // 결과 광고 관찰자
    const resultAdObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                adManager.showResultAd();
                resultAdObserver.unobserve(entry.target);
            }
        });
    }, options);
    
    // 관찰 대상 등록
    const midAd = document.getElementById('adMid');
    const resultAd = document.getElementById('adResult');
    
    if (midAd) midAdObserver.observe(midAd);
    if (resultAd) resultAdObserver.observe(resultAd);
};

// AdManager 클래스 - 광고 관리 및 동적 로딩


let currentQuestionIndex = 0;
let userAnswers = [];
let totalQuestions = 0;
let isLoading = false;

// 질문 데이터
const questions = [
    {
        question: "현재 신용등급이 어느 정도인지 아시나요?",
        answers: [
            { text: "1-3등급 (우수)", score: 10 },
            { text: "4-6등급 (보통)", score: 6 },
            { text: "7-9등급 (미흡)", score: 3 },
            { text: "10등급 (최하위)", score: 1 },
            { text: "잘 모르겠다", score: 0 }
        ]
    },
    {
        question: "신용카드 결제를 얼마나 자주 연체하시나요?",
        answers: [
            { text: "연체한 적 없음", score: 10 },
            { text: "1년에 1-2회 정도", score: 7 },
            { text: "분기마다 1회 정도", score: 4 },
            { text: "월 1회 이상", score: 1 },
            { text: "매월 연체", score: 0 }
        ]
    },
    {
        question: "현재 신용카드 이용 한도 대비 사용률은?",
        answers: [
            { text: "30% 미만", score: 10 },
            { text: "30-50%", score: 7 },
            { text: "50-70%", score: 4 },
            { text: "70-90%", score: 2 },
            { text: "90% 이상", score: 0 }
        ]
    },
    {
        question: "현재 보유하고 있는 신용카드 개수는?",
        answers: [
            { text: "1-2장", score: 10 },
            { text: "3-4장", score: 8 },
            { text: "5-6장", score: 5 },
            { text: "7-8장", score: 3 },
            { text: "9장 이상", score: 1 }
        ]
    },
    {
        question: "대출 상품을 얼마나 이용하고 계시나요?",
        answers: [
            { text: "대출 이용 안함", score: 10 },
            { text: "주택담보대출만", score: 8 },
            { text: "신용대출 1-2개", score: 6 },
            { text: "신용대출 3개 이상", score: 3 },
            { text: "대부업체 이용", score: 0 }
        ]
    },
    {
        question: "금융거래 기간은 얼마나 되시나요?",
        answers: [
            { text: "10년 이상", score: 10 },
            { text: "5-10년", score: 8 },
            { text: "3-5년", score: 6 },
            { text: "1-3년", score: 4 },
            { text: "1년 미만", score: 2 }
        ]
    },
    {
        question: "최근 1년간 신용정보 조회 횟수는?",
        answers: [
            { text: "2회 이하", score: 10 },
            { text: "3-5회", score: 7 },
            { text: "6-10회", score: 4 },
            { text: "11-15회", score: 2 },
            { text: "16회 이상", score: 0 }
        ]
    },
    {
        question: "연소득 대비 총 부채 비율은?",
        answers: [
            { text: "30% 미만", score: 10 },
            { text: "30-50%", score: 8 },
            { text: "50-70%", score: 5 },
            { text: "70-100%", score: 2 },
            { text: "100% 이상", score: 0 }
        ]
    },
    {
        question: "현재 직업 및 근속기간은?",
        answers: [
            { text: "대기업/공무원 5년 이상", score: 10 },
            { text: "중견기업 3년 이상", score: 8 },
            { text: "중소기업 2년 이상", score: 6 },
            { text: "프리랜서/계약직", score: 4 },
            { text: "무직/아르바이트", score: 1 }
        ]
    },
    {
        question: "월 소득 수준은 어느 정도인가요?",
        answers: [
            { text: "500만원 이상", score: 10 },
            { text: "300-500만원", score: 8 },
            { text: "200-300만원", score: 6 },
            { text: "100-200만원", score: 4 },
            { text: "100만원 미만", score: 2 }
        ]
    },
    {
        question: "통신비, 공과금 연체 경험은?",
        answers: [
            { text: "연체한 적 없음", score: 10 },
            { text: "1년에 1-2회", score: 7 },
            { text: "분기마다 1회", score: 4 },
            { text: "월 1회 이상", score: 2 },
            { text: "자주 연체", score: 0 }
        ]
    },
    {
        question: "보유하고 있는 부동산은?",
        answers: [
            { text: "자가 아파트/주택", score: 10 },
            { text: "전세", score: 7 },
            { text: "월세", score: 4 },
            { text: "부모님 집 거주", score: 2 },
            { text: "기타 임시거주", score: 1 }
        ]
    },
    {
        question: "적금이나 예금 보유 현황은?",
        answers: [
            { text: "5천만원 이상", score: 10 },
            { text: "1천-5천만원", score: 8 },
            { text: "500-1천만원", score: 6 },
            { text: "100-500만원", score: 4 },
            { text: "100만원 미만", score: 2 }
        ]
    },
    {
        question: "보험 가입 현황은?",
        answers: [
            { text: "생명보험, 손해보험 모두", score: 10 },
            { text: "생명보험만", score: 7 },
            { text: "손해보험만", score: 5 },
            { text: "간병보험만", score: 3 },
            { text: "보험 미가입", score: 1 }
        ]
    },
    {
        question: "신용카드 현금서비스 이용 빈도는?",
        answers: [
            { text: "전혀 이용 안함", score: 10 },
            { text: "1년에 1-2회", score: 7 },
            { text: "분기마다 1회", score: 4 },
            { text: "월 1회 이상", score: 2 },
            { text: "자주 이용", score: 0 }
        ]
    },
    {
        question: "할부거래 이용 패턴은?",
        answers: [
            { text: "할부 이용 안함", score: 10 },
            { text: "무이자 할부만", score: 8 },
            { text: "6개월 이하 할부", score: 6 },
            { text: "12개월 이하 할부", score: 4 },
            { text: "장기 할부 자주 이용", score: 2 }
        ]
    },
    {
        question: "금융기관과의 거래 다양성은?",
        answers: [
            { text: "은행, 카드사, 보험사 모두", score: 10 },
            { text: "은행, 카드사", score: 8 },
            { text: "은행만", score: 6 },
            { text: "카드사만", score: 4 },
            { text: "거래기관 1곳만", score: 2 }
        ]
    },
    {
        question: "연체 발생 시 해결 방식은?",
        answers: [
            { text: "연체 경험 없음", score: 10 },
            { text: "즉시 해결", score: 8 },
            { text: "1주일 이내 해결", score: 6 },
            { text: "1개월 이내 해결", score: 3 },
            { text: "장기간 방치", score: 0 }
        ]
    },
    {
        question: "신용관리에 대한 관심도는?",
        answers: [
            { text: "매우 관심 많고 정기 확인", score: 10 },
            { text: "관심 있고 가끔 확인", score: 8 },
            { text: "보통 수준의 관심", score: 6 },
            { text: "별로 관심 없음", score: 3 },
            { text: "전혀 관심 없음", score: 1 }
        ]
    },
    {
        question: "향후 금융 계획은?",
        answers: [
            { text: "체계적 재정관리 계획", score: 10 },
            { text: "주택구입 계획", score: 8 },
            { text: "투자 계획", score: 6 },
            { text: "현상 유지", score: 4 },
            { text: "특별한 계획 없음", score: 2 }
        ]
    }
];

// 결과 타입
const resultTypes = {
    excellent: {
        grade: "1-3등급",
        emoji: "🥇",
        title: "우수한 신용등급",
        subtitle: "신용관리를 매우 잘하고 계십니다!",
        description: "현재 신용등급이 우수한 상태입니다. 이 상태를 유지하며 더욱 발전시킬 수 있는 방법들을 알려드릴게요.",
        tips: [
            "🏦 1금융권 우대금리 상품 이용",
            "💳 프리미엄 신용카드 발급 가능",
            "🏠 주택담보대출 우대조건 적용",
            "📈 투자용 대출 상품 이용 가능"
        ],
        improvements: [
            "현재 신용등급 유지를 위한 지속적인 관리",
            "신용카드 이용한도 30% 이하 유지",
            "연체 없는 완벽한 결제 이력 관리",
            "다양한 금융상품 포트폴리오 구성"
        ],
        links: [
            { name: "신용등급 확인하기", url: "https://www.allcredit.co.kr/" },
            { name: "1금융권 대출상품", url: "https://www.kbstar.com/" },
            { name: "프리미엄 카드 신청", url: "https://card.kbcard.com/" }
        ]
    },
    good: {
        grade: "4-6등급",
        emoji: "🥈",
        title: "양호한 신용등급",
        subtitle: "조금만 더 노력하면 우수등급 도달!",
        description: "현재 신용등급이 양호한 상태입니다. 몇 가지 개선사항을 통해 더 높은 등급으로 올라갈 수 있어요.",
        tips: [
            "🔄 기존 대출 연체 없이 상환",
            "💳 신용카드 적정 이용률 유지",
            "📊 신용정보 주기적 확인",
            "🏪 다양한 금융기관 이용"
        ],
        improvements: [
            "신용카드 이용한도 50% 이하로 조절",
            "기존 대출 조기상환 고려",
            "연체 이력 개선 및 관리",
            "신용정보 조회 횟수 줄이기"
        ],
        links: [
            { name: "신용등급 상승 가이드", url: "https://www.kcb.co.kr/" },
            { name: "대출 재정비 상담", url: "https://www.nhbank.com/" },
            { name: "카드 한도 조정", url: "https://www.shinhancard.com/" }
        ]
    },
    fair: {
        grade: "7-9등급",
        emoji: "🥉",
        title: "개선 필요한 신용등급",
        subtitle: "체계적인 관리로 신용등급 향상 가능!",
        description: "현재 신용등급이 낮은 편입니다. 하지만 체계적인 관리를 통해 충분히 개선할 수 있어요.",
        tips: [
            "📋 신용정보 정확성 확인",
            "💰 소액이라도 연체 없이 상환",
            "🔄 대출 통합 및 정리",
            "📱 모바일 뱅킹 이용 늘리기"
        ],
        improvements: [
            "연체 이력 완전 해결",
            "신용카드 개수 적정 수준으로 조정",
            "대출 원금 꾸준히 상환",
            "정기적인 신용관리 습관 형성"
        ],
        links: [
            { name: "신용회복위원회", url: "https://www.ccrs.or.kr/" },
            { name: "금융소비자보호", url: "https://www.fss.or.kr/" },
            { name: "무료 신용상담", url: "https://counsel.crefia.or.kr/" }
        ]
    },
    poor: {
        grade: "10등급",
        emoji: "🆘",
        title: "시급한 신용회복 필요",
        subtitle: "전문가 도움으로 신용회복 시작!",
        description: "현재 신용등급이 매우 낮은 상태입니다. 전문가의 도움을 받아 체계적인 신용회복이 필요해요.",
        tips: [
            "🚨 즉시 연체 해결",
            "👨‍💼 신용회복 전문가 상담",
            "📝 채무조정 신청 검토",
            "💪 단계별 신용회복 계획"
        ],
        improvements: [
            "모든 연체금 즉시 해결",
            "불필요한 신용카드 해지",
            "신용회복위원회 상담 신청",
            "채무조정 프로그램 참여"
        ],
        links: [
            { name: "신용회복위원회", url: "https://www.ccrs.or.kr/" },
            { name: "개인회생 신청", url: "https://www.scourt.go.kr/" },
            { name: "금융감독원 상담", url: "https://www.fss.or.kr/" }
        ]
    }
};

// DOM 요소
let startPage, questionPage, loadingPage, resultPage;
let progressBar, progressText, questionTitle, answersContainer;
let resultBadge, resultTitle, resultSubtitle, resultSummary, resultDetails;

// 초기화


function initializeElements() {
    startPage = document.getElementById('startPage');
    questionPage = document.getElementById('questionPage');
    loadingPage = document.getElementById('loadingPage');
    resultPage = document.getElementById('resultPage');
    
    progressBar = document.querySelector('.progress-fill');
    progressText = document.querySelector('.progress-text');
    questionTitle = document.querySelector('.question-title');
    answersContainer = document.querySelector('.answers-container');
    
    resultBadge = document.querySelector('.result-badge');
    resultTitle = document.querySelector('.result-title');
    resultSubtitle = document.querySelector('.result-subtitle');
    resultSummary = document.querySelector('.result-summary');
    resultDetails = document.querySelector('.result-details');
}

function setupEventListeners() {
    // 시작 버튼
    const startButton = document.querySelector('.cta-button');
    if (startButton) {
        startButton.addEventListener('click', startTest);
    }
    
    // 다시하기 버튼
    const retryButton = document.querySelector('.action-button[onclick="startTest()"]');
    if (retryButton) {
        retryButton.addEventListener('click', startTest);
    }
    
    // 공유 버튼들
    setupShareButtons();
}

function setupShareButtons() {
    // 카카오톡 공유
    const kakaoButtons = document.querySelectorAll('.share-button.kakao, .action-button.share');
    kakaoButtons.forEach(button => {
        button.addEventListener('click', shareKakao);
    });
}

function showPopupAd() {
    const popupHtml = `
        <div id="popupAd" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 400px;
            width: 90%;
            text-align: center;
            border: 3px solid #059669;
        ">
            <div style="font-size: 1.5rem; font-weight: bold; color: #059669; margin-bottom: 15px;">
                🎯 신용등급 향상 특가!
            </div>
            <div style="margin-bottom: 20px; line-height: 1.5;">
                전문가 1:1 신용관리 상담<br>
                <strong style="color: #dc2626;">지금 신청시 50% 할인!</strong>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="window.open('https://www.ccrs.or.kr/', '_blank')" style="
                    background: #059669;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 25px;
                    font-weight: bold;
                    cursor: pointer;
                ">신청하기</button>
                <button onclick="closePopupAd()" style="
                    background: #64748b;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                ">닫기</button>
            </div>
        </div>
        <div id="popupOverlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        " onclick="closePopupAd()"></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function closePopupAd() {
    const popup = document.getElementById('popupAd');
    const overlay = document.getElementById('popupOverlay');
    if (popup) popup.remove();
    if (overlay) overlay.remove();
}

// 전역 함수로 정의
window.closePopupAd = closePopupAd;

function startTest() {
    currentQuestionIndex = 0;
    userAnswers = [];
    totalQuestions = questions.length;
    
    // 모든 광고 숨기기 (새 테스트 시작 시)
    // adManager.hideAllAds();
    
    showPage('question');
    displayQuestion();
}

function showPage(pageType) {
    // 모든 페이지 숨기기
    [startPage, questionPage, loadingPage, resultPage].forEach(page => {
        if (page) page.classList.add('hidden');
    });
    
    // 선택된 페이지 보이기
    switch(pageType) {
        case 'start':
            if (startPage) startPage.classList.remove('hidden');
            break;
        case 'question':
            if (questionPage) questionPage.classList.remove('hidden');
            break;
        case 'loading':
            if (loadingPage) loadingPage.classList.remove('hidden');
            break;
        case 'result':
            if (resultPage) resultPage.classList.remove('hidden');
            break;
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= totalQuestions) {
        showLoading();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    
    // 진행률 업데이트
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${currentQuestionIndex + 1} / ${totalQuestions}`;
    
    // 3번째 질문 이후 중간 광고 표시
    if (currentQuestionIndex >= 2) {
        adManager.loadAd('ad-middle');
    }
    
    // 질문 표시
    if (questionTitle) questionTitle.textContent = question.question;
    
    // 답변 옵션 생성
    if (answersContainer) {
        answersContainer.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const answerButton = document.createElement('button');
            answerButton.className = 'answer-option';
            answerButton.textContent = answer.text;
            answerButton.addEventListener('click', () => selectAnswer(index));
            answersContainer.appendChild(answerButton);
        });
    }
}

function selectAnswer(answerIndex) {
    const question = questions[currentQuestionIndex];
    const selectedAnswer = question.answers[answerIndex];
    
    userAnswers.push({
        questionIndex: currentQuestionIndex,
        answerIndex: answerIndex,
        score: selectedAnswer.score
    });
    
    // 시각적 피드백
    const answerButtons = document.querySelectorAll('.answer-option');
    answerButtons[answerIndex].style.background = 'var(--gradient-credit)';
    answerButtons[answerIndex].style.color = 'white';
    answerButtons[answerIndex].style.transform = 'scale(1.02)';
    
    // 다음 질문으로 이동
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 500);
}

function showLoading() {
    showPage('loading');
    
    let countdown = 3;
    const countdownElement = document.querySelector('.countdown');
    
    const countdownInterval = setInterval(() => {
        if (countdownElement) countdownElement.textContent = countdown;
        countdown--;
        
        if (countdown < 0) {
            clearInterval(countdownInterval);
            showResult();
        }
    }, 1000);
}

function showResult() {
    const totalScore = userAnswers.reduce((sum, answer) => sum + answer.score, 0);
    const maxScore = questions.length * 10;
    const percentage = (totalScore / maxScore) * 100;
    
    let resultType;
    if (percentage >= 80) {
        resultType = resultTypes.excellent;
    } else if (percentage >= 60) {
        resultType = resultTypes.good;
    } else if (percentage >= 40) {
        resultType = resultTypes.fair;
    } else {
        resultType = resultTypes.poor;
    }
    
    displayResultContent(resultType, totalScore, percentage);
    showPage('result');
    
    // 결과 페이지 광고 표시
    adManager.showAd('ad-result');
    
    // 결과 팝업 광고 표시
    setTimeout(showResultAd, 2000);
}

function displayResultContent(result, score, percentage) {
    if (resultBadge) resultBadge.textContent = result.emoji;
    if (resultTitle) resultTitle.textContent = result.title;
    if (resultSubtitle) resultSubtitle.textContent = result.subtitle;
    if (resultSummary) resultSummary.textContent = result.description;
    
    if (resultDetails) {
        resultDetails.innerHTML = `
            <h4>🎯 즉시 실행 가능한 팁</h4>
            <ul>
                ${result.tips.map(tip => `<li>✅ ${tip}</li>`).join('')}
            </ul>
            
            <h4>📈 신용등급 향상 방법</h4>
            <ul>
                ${result.improvements.map(improvement => `<li>🚀 ${improvement}</li>`).join('')}
            </ul>
            
            <h4>🔗 유용한 링크</h4>
            <ul>
                ${result.links.map(link => `<li>🌐 <a href="${link.url}" target="_blank">${link.name}</a></li>`).join('')}
            </ul>
            
            <div class="action-guide">
                <strong>💡 지금 바로 실행하세요!</strong><br>
                신용등급은 하루아침에 변하지 않습니다. 꾸준한 관리가 핵심이에요. 
                위 링크들을 통해 전문가 상담을 받고 체계적인 신용관리를 시작하세요!
            </div>
        `;
    }
}

function showResultAd() {
    const resultAdHtml = `
        <div id="resultAd" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.5s ease;
        ">
            <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 10px;">
                💳 맞춤형 신용카드 추천!
            </div>
            <div style="margin-bottom: 15px; font-size: 0.9rem;">
                당신의 신용등급에 맞는<br>최적의 카드를 찾아보세요
            </div>
            <div style="display: flex; gap: 8px;">
                <button onclick="window.open('https://card.kbcard.com/', '_blank')" style="
                    background: white;
                    color: #1e40af;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: bold;
                    cursor: pointer;
                ">확인하기</button>
                <button onclick="closeResultAd()" style="
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    cursor: pointer;
                ">닫기</button>
            </div>
        </div>
        <style>
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        </style>
    `;
    
    document.body.insertAdjacentHTML('beforeend', resultAdHtml);
    
    // 10초 후 자동 닫기
    setTimeout(closeResultAd, 10000);
}

function closeResultAd() {
    const resultAd = document.getElementById('resultAd');
    if (resultAd) {
        resultAd.style.animation = 'slideIn 0.5s ease reverse';
        setTimeout(() => resultAd.remove(), 500);
    }
}

// 전역 함수로 정의
window.closeResultAd = closeResultAd;

function shareKakao() {
    if (typeof Kakao === 'undefined') {
        alert('카카오톡 공유 기능을 사용할 수 없습니다.');
        return;
    }
    
    Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: '💳 신용등급 향상 가이드',
            description: '나의 신용등급을 확인하고 향상시키는 방법을 알아보세요!',
            imageUrl: 'https://sd2624.github.io/신용등급/신용등급.svg',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href
            }
        },
        buttons: [
            {
                title: '나도 확인하기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href
                }
            }
        ]
    });
}

// 전역 함수로 정의 (HTML에서 호출)
window.startTest = startTest;
window.shareKakao = shareKakao;

// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소 초기화
    initializeElements();
    
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
});