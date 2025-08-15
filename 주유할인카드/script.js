// 광고 로드 함수
function loadAds() {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.log('AdSense loading error:', e);
    }
}

// 질문 중간 광고 표시 함수
function showQuestionMidAd() {
    const midAdElement = document.getElementById('questionMidAd');
    if (midAdElement) {
        midAdElement.style.display = 'block';
        // 광고 로드
        setTimeout(() => {
            loadAds();
        }, 100);
        
        // 3초 후 다음 질문으로
        setTimeout(() => {
            midAdElement.style.display = 'none';
            showQuestion(4);
        }, 3000);
    } else {
        showQuestion(4);
    }
}

// 테스트 데이터
let currentQuestion = 0;
let answers = [];
const totalQuestions = 5;

// 카드 추천 데이터
const cardRecommendations = {
    gsfuel: {
        name: "GS칼텍스 멀티카드",
        features: [
            { icon: "⛽", title: "GS칼텍스 할인", desc: "리터당 100원 할인" },
            { icon: "💳", title: "연회비", desc: "2만원 (할인 조건 충족시 면제)" },
            { icon: "🎯", title: "특화 혜택", desc: "GS편의점 3% 할인" }
        ],
        benefits: ["리터당 100원 할인", "GS편의점 할인", "세차 할인", "자동차용품 할인"],
        detailedInfo: {
            "할인 혜택": [
                "GS칼텍스 주유소에서 리터당 100원 할인",
                "월 최대 5만원까지 할인 가능",
                "GS편의점에서 3% 할인 (월 최대 3만원)",
                "GS칼텍스 세차장 10% 할인"
            ],
            "이용 조건": [
                "월 주유 할인 한도: 5만원",
                "연회비: 2만원 (연 50만원 이상 이용시 면제)",
                "할인 적용: 신용카드 결제시"
            ],
            "추가 혜택": [
                "자동차보험 할인",
                "타이어 할인",
                "정비 서비스 할인",
                "로드어시스턴스 서비스"
            ]
        }
    },
    skoil: {
        name: "SK에너지 직불카드",
        features: [
            { icon: "⛽", title: "SK에너지 할인", desc: "리터당 120원 할인" },
            { icon: "💳", title: "연회비", desc: "무료" },
            { icon: "🎯", title: "특화 혜택", desc: "OK캐쉬백 적립" }
        ],
        benefits: ["리터당 120원 할인", "연회비 무료", "OK캐쉬백 적립", "SK스피드메이트 할인"],
        detailedInfo: {
            "할인 혜택": [
                "SK에너지 주유소에서 리터당 120원 할인",
                "월 최대 6만원까지 할인 가능",
                "OK캐쉬백 1% 적립 (월 최대 2만원)",
                "SK스피드메이트 정비 5% 할인"
            ],
            "이용 조건": [
                "월 주유 할인 한도: 6만원",
                "연회비: 무료",
                "할인 적용: 직불카드 결제시"
            ],
            "추가 혜택": [
                "SK렌터카 할인",
                "SK주유소 세차 할인",
                "자동차용품 할인",
                "주차장 할인 서비스"
            ]
        }
    },
    soil: {
        name: "S-OIL 보너스카드",
        features: [
            { icon: "⛽", title: "S-OIL 할인", desc: "리터당 80원 할인" },
            { icon: "💳", title: "연회비", desc: "1만원" },
            { icon: "🎯", title: "특화 혜택", desc: "보너스 포인트 적립" }
        ],
        benefits: ["리터당 80원 할인", "보너스 포인트 적립", "세차 할인", "편의점 할인"],
        detailedInfo: {
            "할인 혜택": [
                "S-OIL 주유소에서 리터당 80원 할인",
                "월 최대 4만원까지 할인 가능",
                "보너스 포인트 1% 적립",
                "S-OIL 세차장 15% 할인"
            ],
            "이용 조건": [
                "월 주유 할인 한도: 4만원",
                "연회비: 1만원 (연 30만원 이상 이용시 면제)",
                "할인 적용: 카드 결제시"
            ],
            "추가 혜택": [
                "편의점 2% 할인",
                "카페 할인",
                "자동차보험 할인",
                "정비 서비스 할인"
            ]
        }
    },
    hyundai: {
        name: "현대오일뱅크 POINT카드",
        features: [
            { icon: "⛽", title: "현대오일뱅크 할인", desc: "리터당 90원 할인" },
            { icon: "💳", title: "연회비", desc: "1.5만원" },
            { icon: "🎯", title: "특화 혜택", desc: "H-Point 적립" }
        ],
        benefits: ["리터당 90원 할인", "H-Point 적립", "세차 할인", "정비 할인"],
        detailedInfo: {
            "할인 혜택": [
                "현대오일뱅크 주유소에서 리터당 90원 할인",
                "월 최대 4.5만원까지 할인 가능",
                "H-Point 1% 적립",
                "현대오일뱅크 세차장 10% 할인"
            ],
            "이용 조건": [
                "월 주유 할인 한도: 4.5만원",
                "연회비: 1.5만원 (연 40만원 이상 이용시 면제)",
                "할인 적용: 카드 결제시"
            ],
            "추가 혜택": [
                "정비 서비스 할인",
                "타이어 할인",
                "자동차용품 할인",
                "고속도로 할인"
            ]
        }
    },
    premium: {
        name: "프리미엄 주유카드 (다중 브랜드)",
        features: [
            { icon: "⛽", title: "전 브랜드 할인", desc: "리터당 60원 할인" },
            { icon: "💳", title: "연회비", desc: "3만원" },
            { icon: "🎯", title: "특화 혜택", desc: "다양한 부가 서비스" }
        ],
        benefits: ["전 주유소 할인", "높은 캐시백", "다양한 제휴 할인", "프리미엄 서비스"],
        detailedInfo: {
            "할인 혜택": [
                "전국 모든 주유소에서 리터당 60원 할인",
                "월 최대 8만원까지 할인 가능",
                "생활비 1% 캐시백",
                "온라인 쇼핑 2% 할인"
            ],
            "이용 조건": [
                "월 주유 할인 한도: 8만원",
                "연회비: 3만원 (연 100만원 이상 이용시 50% 할인)",
                "할인 적용: 카드 결제시"
            ],
            "추가 혜택": [
                "공항 라운지 이용",
                "호텔 할인",
                "렌터카 할인",
                "해외 여행 보험",
                "24시간 로드어시스턴스"
            ]
        }
    }
};

// DOM 요소들
const startBtn = document.getElementById('startBtn');
const questions = document.querySelectorAll('.question');
const result = document.getElementById('result');
const analysisPopup = document.getElementById('analysisPopup');
const shareKakaoBtn = document.getElementById('shareKakao');
const restartBtn = document.getElementById('restartBtn');

// 테스트 시작
startBtn.addEventListener('click', startTest);

function startTest() {
    document.querySelector('.question-container').style.display = 'none';
    showQuestion(1);
}

// 질문 표시
function showQuestion(questionNum) {
    const question = document.getElementById(`question${questionNum}`);
    if (question) {
        question.style.display = 'block';
        
        const answerBtns = question.querySelectorAll('.answer-btn');
        answerBtns.forEach(btn => {
            btn.addEventListener('click', () => selectAnswer(btn.dataset.score, questionNum));
        });
    }
}

// 답변 선택
function selectAnswer(score, questionNum) {
    answers.push(score);
    
    // 현재 질문 숨기기
    document.getElementById(`question${questionNum}`).style.display = 'none';
    
    if (questionNum < totalQuestions) {
        // 질문 3번 후에 광고 표시
        if (questionNum === 3) {
            showQuestionMidAd();
        } else {
            showQuestion(questionNum + 1);
        }
    } else {
        showAnalysis();
    }
}

// 분석 화면 표시
function showAnalysis() {
    analysisPopup.style.display = 'block';
    
    // 분석 팝업 광고 로드
    setTimeout(() => {
        loadAds();
    }, 500);
    
    const loadingTexts = [
        '주유소별 할인율 분석 중...',
        '당신의 사용 패턴 분석 중...',
        '최적의 카드 선별 중...',
        '혜택 계산 중...',
        '최종 추천 준비 중...'
    ];
    
    let textIndex = 0;
    let countdown = 5;
    
    const textInterval = setInterval(() => {
        document.getElementById('loadingText').textContent = loadingTexts[textIndex];
        textIndex = (textIndex + 1) % loadingTexts.length;
    }, 1000);
    
    const countdownInterval = setInterval(() => {
        countdown--;
        document.getElementById('countdown').textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(textInterval);
            clearInterval(countdownInterval);
            analysisPopup.style.display = 'none';
            showResult();
        }
    }, 1000);
}

// 결과 표시
function showResult() {
    const recommendation = calculateRecommendation();
    const card = cardRecommendations[recommendation];
    
    // 카드 이름
    document.getElementById('cardName').textContent = card.name;
    
    // 카드 특징
    const featuresHTML = card.features.map(feature => 
        `<div class="feature-item">
            <div class="feature-icon">${feature.icon}</div>
            <h4>${feature.title}</h4>
            <p>${feature.desc}</p>
        </div>`
    ).join('');
    document.getElementById('cardFeatures').innerHTML = featuresHTML;
    
    // 카드 혜택
    const benefitsHTML = `
        <h4>주요 혜택</h4>
        <div class="benefit-list">
            ${card.benefits.map(benefit => `<span class="benefit-tag">${benefit}</span>`).join('')}
        </div>
    `;
    document.getElementById('cardBenefits').innerHTML = benefitsHTML;
    
    // 상세 정보
    const detailedHTML = Object.entries(card.detailedInfo).map(([title, items]) =>
        `<div class="info-section">
            <h4>${title}</h4>
            <ul>
                ${items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>`
    ).join('');
    document.getElementById('detailedBenefits').innerHTML = detailedHTML;
    
    result.style.display = 'block';
    
    // 결과 페이지 광고 로드
    setTimeout(() => {
        loadAds();
    }, 1000);
}

// 추천 알고리즘
function calculateRecommendation() {
    const answerCounts = {};
    
    // 답변 빈도 계산
    answers.forEach(answer => {
        answerCounts[answer] = (answerCounts[answer] || 0) + 1;
    });
    
    // 주유소별 선호도 체크
    if (answers[0] === 'gsfuel') return 'gsfuel';
    if (answers[0] === 'skoil') return 'skoil';
    if (answers[0] === 'soil') return 'soil';
    if (answers[0] === 'hyundai') return 'hyundai';
    
    // 사용량에 따른 추천
    if (answers[1] === 'veryhigh' || answers[1] === 'high') {
        return 'premium';
    }
    
    // 혜택 선호도에 따른 추천
    if (answers[2] === 'discount') {
        return 'skoil'; // 가장 높은 할인율
    }
    
    if (answers[2] === 'cashback') {
        return 'premium';
    }
    
    // 사용 패턴에 따른 추천
    if (answers[3] === 'business') {
        return 'premium';
    }
    
    // 기본 추천
    return 'gsfuel';
}

// 카카오톡 공유
shareKakaoBtn.addEventListener('click', function() {
    try {
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '⛽ 혜택큰 주유할인카드 추천',
                description: '나에게 맞는 최고의 주유카드를 찾았어요! 당신도 테스트해보세요!',
                imageUrl: 'https://sd2624.github.io/주유할인카드/주유할인카드.svg',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href
                }
            },
            buttons: [
                {
                    title: '나도 테스트 해보기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href
                    }
                }
            ]
        });
    } catch (error) {
        console.error('카카오톡 공유 오류:', error);
        alert('카카오톡 공유 기능을 사용할 수 없습니다.');
    }
});

// 다시 테스트하기
restartBtn.addEventListener('click', function() {
    // 초기화
    currentQuestion = 0;
    answers = [];
    
    // 모든 요소 숨기기
    questions.forEach(q => q.style.display = 'none');
    result.style.display = 'none';
    analysisPopup.style.display = 'none';
    document.getElementById('questionMidAd').style.display = 'none';
    
    // Sticky 광고 상태 초기화
    const stickyAd = document.getElementById('stickyAd');
    localStorage.removeItem('stickyAdClosed');
    stickyAd.classList.remove('hidden');
    
    // 시작 화면 표시
    document.querySelector('.question-container').style.display = 'block';
});

// 페이지 로드 시 상단 광고 로드
document.addEventListener('DOMContentLoaded', function() {
    // 상단 광고 로드
    setTimeout(() => {
        loadAds();
    }, 500);
    
    // Sticky 광고 초기화
    initStickyAd();
});

// Sticky 광고 초기화 및 제어
function initStickyAd() {
    const stickyAd = document.getElementById('stickyAd');
    const stickyAdClose = document.getElementById('stickyAdClose');
    
    // Sticky 광고 로드
    setTimeout(() => {
        loadAds();
    }, 1000);
    
    // 닫기 버튼 클릭 이벤트
    stickyAdClose.addEventListener('click', function() {
        stickyAd.classList.add('hidden');
        // 로컬스토리지에 닫힘 상태 저장
        localStorage.setItem('stickyAdClosed', 'true');
    });
    
    // 페이지 로드 시 이전에 닫혔던 상태 확인
    if (localStorage.getItem('stickyAdClosed') === 'true') {
        stickyAd.classList.add('hidden');
    }
    
    // 페이지 스크롤 시 sticky 광고 표시/숨김 (선택사항)
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 스크롤을 아래로 할 때만 체크 (사용자 경험 개선)
        if (scrollTop > lastScrollTop && scrollTop > 300) {
            // 스크롤이 300px 이상일 때만 sticky 광고 표시
            if (localStorage.getItem('stickyAdClosed') !== 'true') {
                stickyAd.classList.remove('hidden');
            }
        }
        
        lastScrollTop = scrollTop;
    }, false);
}
