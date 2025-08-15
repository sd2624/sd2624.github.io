// 전역 변수
let currentQuestionIndex = 0;
let userAnswers = [];
let totalQuestions = 0;
let isLoading = false;

// 광고 로드 관리
class AdManager {
    constructor() {
        this.loadedAds = new Set(); // 중복 로드 방지를 위한 Set
        this.observer = null;
        this.initObserver();
    }

    // IntersectionObserver 초기화
    initObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadAd(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
    }

    // 광고 로드
    loadAd(adContainer) {
        const adId = adContainer.id;
        
        // 이미 로드된 광고는 건너뛰기
        if (this.loadedAds.has(adId)) {
            return;
        }

        try {
            // AdSense 광고 푸시
            if (typeof adsbygoogle !== 'undefined') {
                (adsbygoogle = window.adsbygoogle || []).push({});
                this.loadedAds.add(adId);
                console.log(`광고 로드됨: ${adId}`);
            }
        } catch (error) {
            console.error('광고 로드 실패:', error);
        }

        // 관찰 중지
        this.observer.unobserve(adContainer);
    }

    // 광고 컨테이너 표시 및 관찰 시작
    showAd(adId) {
        const adContainer = document.getElementById(adId);
        if (adContainer) {
            adContainer.style.display = 'block';
            this.observer.observe(adContainer);
        }
    }

    // 광고 숨기기
    hideAd(adId) {
        const adContainer = document.getElementById(adId);
        if (adContainer) {
            adContainer.style.display = 'none';
            this.observer.unobserve(adContainer);
        }
    }
}

// 전역 광고 매니저 인스턴스
const adManager = new AdManager();

// 질문 데이터
const questions = [
    {
        question: "가족 구성원 수는 몇 명인가요?",
        answers: [
            { text: "1인 가구", score: 2 },
            { text: "2인 가구", score: 4 },
            { text: "3-4인 가구", score: 7 },
            { text: "5인 이상 대가족", score: 10 },
            { text: "자주 변경됨", score: 5 }
        ]
    },
    {
        question: "주로 어떤 상품을 구매하시나요?",
        answers: [
            { text: "생활용품 위주", score: 6 },
            { text: "식료품 위주", score: 8 },
            { text: "전자제품/가전", score: 5 },
            { text: "의류/패션", score: 3 },
            { text: "다양하게 구매", score: 9 }
        ]
    },
    {
        question: "월 평균 쇼핑 예산은?",
        answers: [
            { text: "10만원 미만", score: 2 },
            { text: "10-30만원", score: 5 },
            { text: "30-50만원", score: 8 },
            { text: "50-100만원", score: 10 },
            { text: "100만원 이상", score: 9 }
        ]
    },
    {
        question: "코스트코 방문 목적은?",
        answers: [
            { text: "대용량 절약 쇼핑", score: 10 },
            { text: "독점 브랜드 상품", score: 8 },
            { text: "신선식품 구매", score: 7 },
            { text: "구경 및 체험", score: 3 },
            { text: "특가 상품 구매", score: 9 }
        ]
    },
    {
        question: "저장 공간은 충분한가요?",
        answers: [
            { text: "매우 충분함", score: 10 },
            { text: "어느 정도 있음", score: 8 },
            { text: "보통", score: 6 },
            { text: "부족한 편", score: 3 },
            { text: "매우 부족함", score: 1 }
        ]
    },
    {
        question: "코스트코까지의 거리는?",
        answers: [
            { text: "30분 이내", score: 10 },
            { text: "30분-1시간", score: 8 },
            { text: "1-2시간", score: 5 },
            { text: "2시간 이상", score: 2 },
            { text: "매우 멀음", score: 1 }
        ]
    },
    {
        question: "쇼핑 주기는 어떻게 되나요?",
        answers: [
            { text: "주 1-2회", score: 8 },
            { text: "월 2-3회", score: 10 },
            { text: "월 1회", score: 7 },
            { text: "분기별", score: 4 },
            { text: "년 1-2회", score: 2 }
        ]
    },
    {
        question: "코스트코 멤버십에 대한 생각은?",
        answers: [
            { text: "이미 가입함", score: 10 },
            { text: "가입 검토 중", score: 8 },
            { text: "관심 있음", score: 6 },
            { text: "잘 모르겠음", score: 3 },
            { text: "관심 없음", score: 1 }
        ]
    }
];

// 결과 타입
const resultTypes = {
    perfect: {
        type: "완벽한 코스트코 회원",
        emoji: "🏆",
        title: "코스트코 VIP 고객",
        subtitle: "코스트코를 최대한 활용하고 계십니다!",
        description: "대가족, 충분한 저장공간, 정기적인 방문 등 코스트코 쇼핑의 모든 조건이 완벽합니다. 연회비 대비 최고의 혜택을 누리고 계세요!",
        membership: "골드스타 멤버십 (연 38,500원)",
        recommendations: [
            "🥩 커클랜드 시그니처 육류 (소고기, 돼지고기)",
            "🧻 커클랜드 화장지 대용량팩",
            "🧴 커클랜드 세제/샴푸 리필용",
            "❄️ 냉동식품 (만두, 피자, 아이스크림)",
            "🥜 견과류 대용량팩",
            "🍯 커클랜드 꿀 대용량"
        ],
        tips: [
            "매월 쿠폰북 확인하여 추가 할인 받기",
            "연말 2% 리워드 활용하기",
            "가솔린 스테이션 이용으로 추가 절약",
            "온라인 쇼핑몰도 적극 활용"
        ],
        savings: "연간 50만원 이상 절약 가능",
        links: [
            { name: "코스트코 멤버십 가입", url: "https://www.costco.co.kr/membership" },
            { name: "온라인 쇼핑몰", url: "https://www.costco.co.kr/" },
            { name: "매장 위치 안내", url: "https://www.costco.co.kr/store-finder" }
        ]
    },
    good: {
        type: "효율적인 코스트코 이용자",
        emoji: "✨",
        title: "스마트 쇼핑족",
        subtitle: "코스트코를 잘 활용하고 계십니다",
        description: "적절한 가족 구성과 쇼핑 패턴으로 코스트코의 장점을 잘 살리고 계십니다. 몇 가지 팁으로 더욱 효율적인 쇼핑이 가능해요.",
        membership: "골드스타 멤버십 추천",
        recommendations: [
            "🍚 쌀 대용량 (20kg)",
            "🧴 생활용품 세트",
            "🥛 우유/유제품 대용량",
            "🍖 정육 포장 서비스",
            "🥗 신선 샐러드 키트",
            "🍞 베이커리 상품"
        ],
        tips: [
            "냉동고 공간 최대한 활용하기",
            "친구/이웃과 나눠 구매하기",
            "계절별 특가 상품 노리기",
            "멤버십 카드 가족 공유 활용"
        ],
        savings: "연간 30만원 이상 절약 가능",
        links: [
            { name: "코스트코 쿠폰북", url: "https://www.costco.co.kr/coupons" },
            { name: "이번 주 특가", url: "https://www.costco.co.kr/weekly-deals" },
            { name: "신상품 정보", url: "https://www.costco.co.kr/new-products" }
        ]
    },
    moderate: {
        type: "선택적 코스트코 이용자",
        emoji: "🤔",
        title: "신중한 쇼핑족",
        subtitle: "상황에 따라 코스트코를 이용하세요",
        description: "코스트코가 유용할 수 있지만, 모든 상품이 필요하지는 않을 것 같습니다. 특정 카테고리에 집중해서 쇼핑하시는 것을 추천합니다.",
        membership: "비즈니스 멤버십 (연 33,000원) 고려",
        recommendations: [
            "🔋 전자제품/가전제품",
            "🧴 세제/화장품",
            "☕ 커피/음료",
            "🍫 간식/스낵류",
            "🏃‍♂️ 운동용품",
            "📚 도서/문구용품"
        ],
        tips: [
            "온라인 쇼핑몰 먼저 확인하기",
            "필요한 상품만 리스트 작성",
            "다른 마트와 가격 비교하기",
            "동행자와 함께 방문하여 비용 분담"
        ],
        savings: "연간 15만원 이상 절약 가능",
        links: [
            { name: "온라인 가격 비교", url: "https://www.costco.co.kr/compare" },
            { name: "멤버십 혜택 비교", url: "https://www.costco.co.kr/membership-benefits" },
            { name: "고객 후기", url: "https://www.costco.co.kr/reviews" }
        ]
    },
    limited: {
        type: "제한적 코스트코 이용자",
        emoji: "💭",
        title: "탐색형 쇼핑족",
        subtitle: "코스트코 가입을 신중히 고려해보세요",
        description: "현재 상황으로는 코스트코 멤버십의 장점을 충분히 활용하기 어려울 수 있습니다. 라이프스타일 변화 후 재검토를 권합니다.",
        membership: "동행 쇼핑 또는 일일 체험 추천",
        recommendations: [
            "🍕 푸드코트 이용",
            "👁️ 매장 둘러보기",
            "🎁 선물용 특별 상품",
            "🧪 샘플 체험",
            "📱 온라인몰 이용",
            "🤝 지인과 함께 방문"
        ],
        tips: [
            "가족/친구 멤버십 카드 동행 이용",
            "특별 이벤트 기간 방문",
            "온라인 쇼핑으로 먼저 체험",
            "라이프스타일 변화 시 재검토"
        ],
        savings: "연간 5만원 이상 절약 가능",
        links: [
            { name: "코스트코 체험 후기", url: "https://www.costco.co.kr/experience" },
            { name: "멤버십 가이드", url: "https://www.costco.co.kr/membership-guide" },
            { name: "FAQ", url: "https://www.costco.co.kr/faq" }
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

    // AdSense 스크립트 로드 확인
    window.adsbygoogle = window.adsbygoogle || [];
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
    // 팝업 광고 로드 (기존 코드 유지)
    setTimeout(() => {
        const popupAd = document.querySelector('.popup-ad');
        if (popupAd && typeof adsbygoogle !== 'undefined') {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, 100);
    
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
            border: 3px solid #dc2626;
        ">
            <div style="font-size: 1.5rem; font-weight: bold; color: #dc2626; margin-bottom: 15px;">
                🛒 코스트코 신규 회원 특가!
            </div>
            <div style="margin-bottom: 20px; line-height: 1.5;">
                멤버십 가입시 즉시 사용 가능한<br>
                <strong style="color: #dc2626;">1만원 쿠폰 증정!</strong>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="window.open('https://www.costco.co.kr/membership', '_blank')" style="
                    background: #dc2626;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 25px;
                    font-weight: bold;
                    cursor: pointer;
                ">가입하기</button>
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
    
    // 페이지 상단 광고 표시 (헤더 바로 아래)
    adManager.showAd('headerAd');
    
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
    answerButtons[answerIndex].style.background = 'var(--gradient-costco)';
    answerButtons[answerIndex].style.color = 'white';
    answerButtons[answerIndex].style.transform = 'scale(1.02)';
    
    // 3번째 질문 완료 후 중간 광고 표시
    if (currentQuestionIndex === 2) {
        adManager.showAd('questionAd');
    }
    
    // 다음 질문으로 이동
    setTimeout(() => {
        currentQuestionIndex++;
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
    if (percentage >= 80) {
        resultType = resultTypes.perfect;
    } else if (percentage >= 60) {
        resultType = resultTypes.good;
    } else if (percentage >= 40) {
        resultType = resultTypes.moderate;
    } else {
        resultType = resultTypes.limited;
    }
    
    displayResultContent(resultType, totalScore, percentage);
    showPage('result');
    
    // 결과 페이지 중간 광고 표시 (추천 카드와 상세 혜택 사이)
    setTimeout(() => {
        adManager.showAd('resultAd');
    }, 500);
    
    // 기존 팝업 광고도 표시
    setTimeout(showResultAd, 2000);
}

function displayResultContent(result, score, percentage) {
    if (resultBadge) resultBadge.textContent = result.emoji;
    if (resultTitle) resultTitle.textContent = result.title;
    if (resultSubtitle) resultSubtitle.textContent = result.subtitle;
    if (resultSummary) resultSummary.textContent = result.description;
    
    if (resultDetails) {
        resultDetails.innerHTML = `
            <h4>💳 추천 멤버십</h4>
            <ul>
                <li>📋 ${result.membership}</li>
                <li>💰 ${result.savings}</li>
            </ul>
            
            <h4>🛒 추천 상품</h4>
            <ul>
                ${result.recommendations.map(item => `<li>🎯 ${item}</li>`).join('')}
            </ul>
            
            <h4>💡 쇼핑 팁</h4>
            <ul>
                ${result.tips.map(tip => `<li>💡 ${tip}</li>`).join('')}
            </ul>
            
            <h4>🔗 유용한 링크</h4>
            <ul>
                ${result.links.map(link => `<li>🌐 <a href="${link.url}" target="_blank">${link.name}</a></li>`).join('')}
            </ul>
            
            <div class="action-guide">
                <strong>🛒 지금 바로 시작하세요!</strong><br>
                코스트코는 올바른 사용법만 알면 정말 큰 절약이 가능합니다. 
                위 추천 상품들로 시작해서 점차 구매 범위를 늘려보세요!
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
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.5s ease;
        ">
            <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 10px;">
                🎁 코스트코 꿀템 추천!
            </div>
            <div style="margin-bottom: 15px; font-size: 0.9rem;">
                회원들이 인정한<br>코스트코 베스트 상품들
            </div>
            <div style="display: flex; gap: 8px;">
                <button onclick="window.open('https://www.costco.co.kr/', '_blank')" style="
                    background: white;
                    color: #dc2626;
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
            title: '🛒 코스트코 추천 상품 및 멤버십 가이드',
            description: '나에게 맞는 코스트코 쇼핑법과 추천 상품을 확인해보세요!',
            imageUrl: 'https://sd2624.github.io/코스트코/코스트코.svg',
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
