// 광고 관리자 클래스 (새로 추가)
class AdManager {
    constructor() {
        this.loadedAds = new Set();
        this.observers = new Map();
    }

    init() {
        this.showTopAd();
        this.setupMidAdObserver();
        this.setupResultAdObserver();
    }

    showTopAd() {
        if (!this.loadedAds.has('top')) {
            setTimeout(() => {
                this.loadAd('top');
            }, 1000);
        }
    }

    showMidAd() {
        const midAdContainer = document.querySelector('.ad-container.mid');
        if (midAdContainer && !this.loadedAds.has('mid')) {
            midAdContainer.style.display = 'block';
            this.loadAd('mid');
        }
    }

    showResultAd() {
        const resultAdContainer = document.querySelector('.ad-container.result');
        if (resultAdContainer && !this.loadedAds.has('result')) {
            resultAdContainer.style.display = 'block';
            this.loadAd('result');
        }
    }

    setupMidAdObserver() {
        const midAdContainer = document.querySelector('.ad-container.mid');
        if (midAdContainer) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.loadedAds.has('mid')) {
                        this.showMidAd();
                        observer.disconnect();
                    }
                });
            });
            observer.observe(midAdContainer);
            this.observers.set('mid', observer);
        }
    }

    setupResultAdObserver() {
        const resultAdContainer = document.querySelector('.ad-container.result');
        if (resultAdContainer) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.loadedAds.has('result')) {
                        this.showResultAd();
                        observer.disconnect();
                    }
                });
            });
            observer.observe(resultAdContainer);
            this.observers.set('result', observer);
        }
    }

    loadAd(position) {
        if (!this.loadedAds.has(position)) {
            try {
                const adContainer = document.querySelector(`.ad-container.${position}`);
                if (adContainer) {
                    const adElement = adContainer.querySelector('.adsbygoogle');
                    if (adElement && !adElement.getAttribute('data-adsbygoogle-status')) {
                        (adsbygoogle = window.adsbygoogle || []).push({});
                        this.loadedAds.add(position);
                        console.log(`${position} 광고 로드 완료`);
                    }
                }
            } catch (error) {
                console.error(`${position} 광고 로드 실패:`, error);
            }
        }
    }
}

// 광고 관리자 인스턴스 생성 (새로 추가)
const adManager = new AdManager();

// 전역 변수
let currentQuestionIndex = 0;
let userAnswers = [];
let totalQuestions = 0;
let isLoading = false;

// 질문 데이터
const questions = [
    {
        question: "주택 유형은 무엇인가요?",
        answers: [
            { text: "아파트 (일반주택)", score: 5 },
            { text: "단독주택", score: 7 },
            { text: "상가주택", score: 3 },
            { text: "원룸/오피스텔", score: 2 },
            { text: "기타", score: 1 }
        ]
    },
    {
        question: "월평균 전기 사용량은 얼마나 되나요?",
        answers: [
            { text: "200kWh 미만 (절약형)", score: 1 },
            { text: "200-300kWh (일반형)", score: 3 },
            { text: "300-450kWh (많이 사용)", score: 7 },
            { text: "450-600kWh (고사용량)", score: 9 },
            { text: "600kWh 이상 (초과사용)", score: 10 }
        ]
    },
    {
        question: "여름철 에어컨 사용 패턴은?",
        answers: [
            { text: "거의 사용 안함", score: 1 },
            { text: "밤에만 잠깐", score: 3 },
            { text: "필요할 때만", score: 5 },
            { text: "하루 6-8시간", score: 8 },
            { text: "거의 24시간", score: 10 }
        ]
    },
    {
        question: "겨울철 난방 방식은?",
        answers: [
            { text: "도시가스 보일러", score: 2 },
            { text: "전기 보일러", score: 8 },
            { text: "전기 히터", score: 6 },
            { text: "에어컨 난방", score: 7 },
            { text: "기타", score: 3 }
        ]
    },
    {
        question: "주요 전기제품 사용량은?",
        answers: [
            { text: "필수 가전만 사용", score: 2 },
            { text: "일반적인 사용", score: 4 },
            { text: "다양한 가전 보유", score: 6 },
            { text: "고전력 가전 다수", score: 8 },
            { text: "모든 가전 풀옵션", score: 10 }
        ]
    },
    {
        question: "전기요금 절약을 위한 노력은?",
        answers: [
            { text: "매우 적극적", score: 1 },
            { text: "어느 정도 노력", score: 3 },
            { text: "보통", score: 5 },
            { text: "별로 신경 안씀", score: 8 },
            { text: "전혀 신경 안씀", score: 10 }
        ]
    },
    {
        question: "가족 구성원 수는?",
        answers: [
            { text: "1인 가구", score: 2 },
            { text: "2인 가구", score: 4 },
            { text: "3-4인 가구", score: 6 },
            { text: "5인 이상", score: 8 },
            { text: "대가족", score: 10 }
        ]
    },
    {
        question: "전기요금 인상에 대한 인식은?",
        answers: [
            { text: "매우 부담스럽다", score: 10 },
            { text: "부담스럽다", score: 8 },
            { text: "보통이다", score: 5 },
            { text: "별로 부담 안된다", score: 3 },
            { text: "전혀 부담 안된다", score: 1 }
        ]
    }
];

// 결과 타입
const resultTypes = {
    low: {
        range: "100-200kWh",
        emoji: "🌱",
        title: "전기 절약왕",
        subtitle: "훌륭한 전기 절약 습관을 가지고 계십니다!",
        description: "현재 전기 사용량이 매우 적절한 수준입니다. 전기요금 인상에도 상대적으로 부담이 적을 것으로 예상됩니다.",
        monthlyBill: "월 평균 25,000-35,000원",
        savingTips: [
            "💡 LED 전구로 교체하여 추가 절약",
            "🔌 사용하지 않는 전자제품 플러그 뽑기",
            "❄️ 냉장고 적정 온도 유지 (냉장 3-4℃, 냉동 -18℃)",
            "🌡️ 에어컨 적정 온도 유지 (여름 26-28℃)"
        ],
        improvements: [
            "현재 절약 습관 유지",
            "스마트 플러그 활용으로 대기전력 차단",
            "태양광 발전 설치 검토",
            "에너지 효율 1등급 가전제품 사용"
        ],
        links: [
            { name: "에너지 효율등급", url: "https://eep.energy.or.kr/" },
            { name: "전기요금 계산기", url: "https://cyber.kepco.co.kr/" },
            { name: "에너지 절약 팁", url: "https://www.kemco.or.kr/" }
        ]
    },
    medium: {
        range: "200-400kWh",
        emoji: "⚖️",
        title: "표준 사용자",
        subtitle: "일반적인 전기 사용 패턴입니다",
        description: "평균적인 전기 사용량으로 인상된 요금의 영향을 어느 정도 받을 것으로 예상됩니다. 몇 가지 절약 방법으로 요금을 줄일 수 있어요.",
        monthlyBill: "월 평균 50,000-80,000원",
        savingTips: [
            "🌡️ 에어컨 1도만 높여도 7% 절약",
            "💧 온수 사용량 줄이기",
            "📺 TV 밝기 조절하여 전력 절약",
            "🍳 인덕션보다 가스레인지 활용"
        ],
        improvements: [
            "누진세 2구간 진입 방지 (300kWh 이하 유지)",
            "고효율 가전제품으로 교체",
            "시간대별 요금제 검토",
            "월별 사용량 모니터링"
        ],
        links: [
            { name: "한국전력 요금제", url: "https://cyber.kepco.co.kr/" },
            { name: "가전제품 효율등급", url: "https://eep.energy.or.kr/" },
            { name: "전력거래소", url: "https://www.kpx.or.kr/" }
        ]
    },
    high: {
        range: "400-600kWh",
        emoji: "⚠️",
        title: "고사용량 가구",
        subtitle: "전기요금 절약이 시급합니다!",
        description: "전기 사용량이 많아 누진세 3구간에 해당됩니다. 전기요금 인상으로 상당한 부담 증가가 예상되니 즉시 절약 대책이 필요해요.",
        monthlyBill: "월 평균 100,000-150,000원",
        savingTips: [
            "🏠 단열 개선으로 냉난방 효율 향상",
            "⏰ 시간대별 요금제 변경 검토",
            "🔄 오래된 가전제품 교체",
            "☀️ 태양광 발전 설치 검토"
        ],
        improvements: [
            "누진세 2구간 이하로 사용량 줄이기 (450kWh → 350kWh)",
            "에너지 진단 서비스 신청",
            "고효율 보일러 교체",
            "스마트 홈 시스템 도입"
        ],
        links: [
            { name: "에너지 진단 서비스", url: "https://www.kemco.or.kr/" },
            { name: "신재생에너지", url: "https://www.knrec.or.kr/" },
            { name: "건물 에너지 효율", url: "https://bepa.go.kr/" }
        ]
    },
    extreme: {
        range: "600kWh 이상",
        emoji: "🆘",
        title: "초고사용량 경고",
        subtitle: "즉시 전면적인 절약 대책이 필요합니다!",
        description: "전기 사용량이 매우 높아 누진세 최고 구간입니다. 전기요금 인상으로 월 요금이 크게 증가할 것으로 예상되니 전면적인 개선이 시급합니다.",
        monthlyBill: "월 평균 200,000원 이상",
        savingTips: [
            "🚨 즉시 에너지 사용 패턴 점검",
            "🏗️ 주택 단열 전면 개선",
            "🔋 에너지저장장치(ESS) 설치",
            "💡 전 가전제품 고효율로 교체"
        ],
        improvements: [
            "목표: 사용량 30% 이상 절감",
            "전문가 에너지 진단 필수",
            "태양광 발전 설치 적극 검토",
            "전기차 충전 패턴 최적화"
        ],
        links: [
            { name: "에너지 전문 컨설팅", url: "https://www.kemco.or.kr/" },
            { name: "신재생에너지 지원", url: "https://www.knrec.or.kr/" },
            { name: "건물 에너지 진단", url: "https://bepa.go.kr/" }
        ]
    }
};

// DOM 요소
let startPage, questionPage, loadingPage, resultPage;
let progressBar, progressText, questionTitle, answersContainer;
let resultBadge, resultTitle, resultSubtitle, resultSummary, resultDetails;

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    totalQuestions = questions.length;
    
    // 팝업 광고 표시
    setTimeout(showPopupAd, 3000);
    
    // 카카오 SDK 초기화
    if (typeof Kakao !== 'undefined') {
        Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
    }
});

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
            border: 3px solid #fbbf24;
        ">
            <div style="font-size: 1.5rem; font-weight: bold; color: #f59e0b; margin-bottom: 15px;">
                ⚡ 전기요금 폭탄 대비!
            </div>
            <div style="margin-bottom: 20px; line-height: 1.5;">
                에너지 효율 1등급 가전제품<br>
                <strong style="color: #dc2626;">최대 50% 할인 특가!</strong>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="window.open('https://eep.energy.or.kr/', '_blank')" style="
                    background: #fbbf24;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 25px;
                    font-weight: bold;
                    cursor: pointer;
                ">확인하기</button>
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
    answerButtons[answerIndex].style.background = 'var(--gradient-electric)';
    answerButtons[answerIndex].style.color = 'white';
    answerButtons[answerIndex].style.transform = 'scale(1.02)';
    
    // 다음 질문으로 이동
    setTimeout(() => {
        currentQuestionIndex++;
        
        // 3번째 질문 완료 후 중간 광고 표시 (새로 추가)
        if (currentQuestionIndex === 3) {
            adManager.showMidAd();
        }
        
        displayQuestion();
    }, 500);
}

function showLoading() {
    showPage('loading');
    
    let countdown = 7;
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
    if (percentage <= 30) {
        resultType = resultTypes.low;
    } else if (percentage <= 60) {
        resultType = resultTypes.medium;
    } else if (percentage <= 80) {
        resultType = resultTypes.high;
    } else {
        resultType = resultTypes.extreme;
    }
    
    displayResultContent(resultType, totalScore, percentage);
    showPage('result');
    
    // 결과 페이지 광고 표시 (새로 수정)
    setTimeout(() => {
        adManager.showResultAd();
    }, 500);
}

function displayResultContent(result, score, percentage) {
    if (resultBadge) resultBadge.textContent = result.emoji;
    if (resultTitle) resultTitle.textContent = result.title;
    if (resultSubtitle) resultSubtitle.textContent = result.subtitle;
    if (resultSummary) resultSummary.textContent = result.description;
    
    if (resultDetails) {
        resultDetails.innerHTML = `
            <h4>📊 예상 전기요금</h4>
            <ul>
                <li>💰 ${result.monthlyBill}</li>
                <li>📈 예상 사용량: ${result.range}</li>
            </ul>
            
            <h4>⚡ 즉시 절약 팁</h4>
            <ul>
                ${result.savingTips.map(tip => `<li>💡 ${tip}</li>`).join('')}
            </ul>
            
            <h4>🎯 개선 방법</h4>
            <ul>
                ${result.improvements.map(improvement => `<li>🚀 ${improvement}</li>`).join('')}
            </ul>
            
            <h4>🔗 유용한 링크</h4>
            <ul>
                ${result.links.map(link => `<li>🌐 <a href="${link.url}" target="_blank">${link.name}</a></li>`).join('')}
            </ul>
            
            <div class="action-guide">
                <strong>💡 지금 바로 실행하세요!</strong><br>
                전기요금 인상으로 가계 부담이 늘어나고 있습니다. 
                위 절약 팁들을 실천하여 전기요금을 크게 줄일 수 있어요!
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
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.5s ease;
        ">
            <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 10px;">
                💡 고효율 가전제품 추천!
            </div>
            <div style="margin-bottom: 15px; font-size: 0.9rem;">
                전기요금 절약을 위한<br>에너지 효율 1등급 제품들
            </div>
            <div style="display: flex; gap: 8px;">
                <button onclick="window.open('https://eep.energy.or.kr/', '_blank')" style="
                    background: white;
                    color: #f59e0b;
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
            title: '⚡ 전기요금 인상 현황 및 계산법',
            description: '2024년 전기요금 인상으로 우리집 전기요금이 얼마나 올랐는지 확인해보세요!',
            imageUrl: 'https://sd2624.github.io/전기요금/전기요금.svg',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href
            }
        },
        buttons: [
            {
                title: '나도 계산하기',
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

// 광고 관련 함수들 (새로 추가)
function initializeAds() {
    // Google AdSense 스크립트가 로드된 후 광고 푸시
    if (typeof adsbygoogle !== 'undefined') {
        const ads = document.querySelectorAll('.adsbygoogle');
        ads.forEach(ad => {
            if (!ad.getAttribute('data-adsbygoogle-status')) {
                (adsbygoogle = window.adsbygoogle || []).push({});
            }
        });
    }
}

// 페이지 로드 시 광고 관리자 초기화 (새로 추가)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        adManager.init();
    }, 1000);
});

// AdSense 스크립트 로드 후 광고 초기화 (새로 추가)
window.addEventListener('load', initializeAds);
window.shareKakao = shareKakao;
