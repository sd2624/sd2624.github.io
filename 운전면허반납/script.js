// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 데이터
const questions = [
    {
        question: "현재 거주하고 계신 지역은 어디인가요?",
        answers: [
            { text: "서울특별시", region: "seoul", benefits: 4 },
            { text: "부산광역시", region: "busan", benefits: 3 },
            { text: "대구광역시", region: "daegu", benefits: 3 },
            { text: "인천광역시", region: "incheon", benefits: 3 },
            { text: "광주광역시", region: "gwangju", benefits: 3 },
            { text: "대전광역시", region: "daejeon", benefits: 3 },
            { text: "울산광역시", region: "ulsan", benefits: 3 },
            { text: "세종특별자치시", region: "sejong", benefits: 4 },
            { text: "경기도", region: "gyeonggi", benefits: 4 },
            { text: "강원특별자치도", region: "gangwon", benefits: 2 },
            { text: "충청북도", region: "chungbuk", benefits: 2 },
            { text: "충청남도", region: "chungnam", benefits: 2 },
            { text: "전라북도", region: "jeonbuk", benefits: 2 },
            { text: "전라남도", region: "jeonnam", benefits: 2 },
            { text: "경상북도", region: "gyeongbuk", benefits: 2 },
            { text: "경상남도", region: "gyeongnam", benefits: 2 },
            { text: "제주특별자치도", region: "jeju", benefits: 3 }
        ]
    },
    {
        question: "현재 나이는 어떻게 되시나요?",
        answers: [
            { text: "65세 미만", age: "under65", priority: 1 },
            { text: "65~70세", age: "65-70", priority: 3 },
            { text: "70~75세", age: "70-75", priority: 4 },
            { text: "75세 이상", age: "over75", priority: 5 }
        ]
    },
    {
        question: "운전면허를 취득한 지 얼마나 되셨나요?",
        answers: [
            { text: "10년 미만", experience: "novice", score: 1 },
            { text: "10~30년", experience: "intermediate", score: 2 },
            { text: "30~50년", experience: "experienced", score: 3 },
            { text: "50년 이상", experience: "veteran", score: 4 }
        ]
    },
    {
        question: "현재 운전 빈도는 어느 정도인가요?",
        answers: [
            { text: "거의 매일", frequency: "daily", need: 1 },
            { text: "주 2-3회", frequency: "frequent", need: 2 },
            { text: "월 2-3회", frequency: "occasional", need: 3 },
            { text: "거의 안함", frequency: "rarely", need: 4 }
        ]
    },
    {
        question: "운전면허 반납을 고려하는 주된 이유는?",
        answers: [
            { text: "신체적 어려움 (시력, 반응속도 등)", reason: "physical", urgency: 4 },
            { text: "경제적 부담 (차량 유지비 등)", reason: "economic", urgency: 3 },
            { text: "가족의 권유", reason: "family", urgency: 2 },
            { text: "단순 관심/정보 수집", reason: "interest", urgency: 1 }
        ]
    },
    {
        question: "대중교통 접근성은 어떤가요?",
        answers: [
            { text: "매우 좋음 (지하철, 버스 모두 편리)", transport: "excellent", compensation: 4 },
            { text: "좋음 (버스 이용 가능)", transport: "good", compensation: 3 },
            { text: "보통 (제한적 이용 가능)", transport: "fair", compensation: 2 },
            { text: "나쁨 (대중교통 거의 없음)", transport: "poor", compensation: 1 }
        ]
    },
    {
        question: "월 평균 소득 수준은 어느 정도인가요?",
        answers: [
            { text: "100만원 미만", income: "low", support: 4 },
            { text: "100~200만원", income: "middle-low", support: 3 },
            { text: "200~300만원", income: "middle", support: 2 },
            { text: "300만원 이상", income: "high", support: 1 }
        ]
    }
];

// 지역별 보상제도 정보
const benefitPrograms = {
    "seoul": {
        name: "서울특별시",
        maxBenefit: "50만원",
        programs: [
            "교통카드 충전금 30만원",
            "서울사랑상품권 20만원",
            "택시할인 월 15만원 (6개월)",
            "무료 건강검진 연 1회"
        ],
        applicationUrl: "https://www.seoul.go.kr",
        contactNumber: "02-120"
    },
    "gyeonggi": {
        name: "경기도",
        maxBenefit: "40만원",
        programs: [
            "경기지역화폐 25만원",
            "대중교통 이용권 15만원",
            "택시할인쿠폰 월 10만원 (6개월)",
            "복지시설 이용 할인"
        ],
        applicationUrl: "https://www.gg.go.kr",
        contactNumber: "031-120"
    },
    "busan": {
        name: "부산광역시",
        maxBenefit: "35만원",
        programs: [
            "하나로카드 충전금 20만원",
            "부산상품권 15만원",
            "마을버스 무료이용 (1년)",
            "경로당 프로그램 우선 참여"
        ],
        applicationUrl: "https://www.busan.go.kr",
        contactNumber: "051-120"
    },
    "default": {
        name: "전국 공통",
        maxBenefit: "30만원",
        programs: [
            "지역상품권 20만원",
            "대중교통 할인카드",
            "택시 이용 할인",
            "교통안전 교육 수료증"
        ],
        applicationUrl: "https://www.gov.kr",
        contactNumber: "1588-2100"
    }
};

// 결과 타입 정의
const resultTypes = {
    "최우선 혜택 대상": {
        title: "🏆 최우선 혜택 대상자",
        subtitle: "가장 많은 혜택을 받을 수 있습니다!",
        badge: "🥇",
        bgColor: "linear-gradient(45deg, #00b894, #00cec9)",
        description: "나이, 거주지역, 운전빈도 등을 종합했을 때 운전면허 자진반납 보상제도의 최우선 혜택 대상자입니다.",
        minScore: 20,
        maxScore: 28
    },
    "우선 혜택 대상": {
        title: "✅ 우선 혜택 대상자",
        subtitle: "충분한 혜택을 받을 수 있습니다.",
        badge: "🥈",
        bgColor: "linear-gradient(45deg, #74b9ff, #0984e3)",
        description: "운전면허 자진반납 시 다양한 혜택을 받을 수 있는 우선 대상자입니다.",
        minScore: 15,
        maxScore: 19
    },
    "일반 혜택 대상": {
        title: "📋 일반 혜택 대상자",
        subtitle: "기본 혜택을 받을 수 있습니다.",
        badge: "🥉",
        bgColor: "linear-gradient(45deg, #fdcb6e, #e17055)",
        description: "운전면허 자진반납 시 기본적인 혜택을 받을 수 있습니다.",
        minScore: 10,
        maxScore: 14
    },
    "정보 수집 단계": {
        title: "💡 정보 수집 단계",
        subtitle: "향후 필요시 참고하세요.",
        badge: "📚",
        bgColor: "linear-gradient(45deg, #a29bfe, #6c5ce7)",
        description: "현재는 반납 필요성이 낮지만, 향후 필요시 활용할 수 있는 정보를 제공합니다.",
        minScore: 7,
        maxScore: 9
    }
};

let currentQuestionIndex = 0;
let userAnswers = [];
let totalScore = 0;
let analysisData = {};

// DOM 요소
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const analysisModal = document.getElementById('analysisModal');

// 시작 함수
function startTest() {
    currentQuestionIndex = 0;
    userAnswers = [];
    totalScore = 0;
    analysisData = {};
    
    if (startPage) startPage.classList.add('hidden');
    if (questionPage) questionPage.classList.remove('hidden');
    
    showQuestion();
}

// 질문 표시 함수
function showQuestion() {
    const progressBar = document.querySelector('.progress-bar');
    const currentQ = document.querySelector('.current-q');
    const totalQ = document.querySelector('.total-q');
    const questionTitle = document.querySelector('.question-title');
    const questionOptions = document.querySelector('.question-options');
    
    // 진행률 업데이트
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    if (progressBar) progressBar.style.width = progress + '%';
    if (currentQ) currentQ.textContent = currentQuestionIndex + 1;
    if (totalQ) totalQ.textContent = questions.length;
    
    // 질문과 옵션 표시
    const currentQuestion = questions[currentQuestionIndex];
    if (questionTitle) questionTitle.textContent = currentQuestion.question;
    
    if (questionOptions) {
        questionOptions.innerHTML = '';
        currentQuestion.answers.forEach((answer, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';
            optionElement.textContent = answer.text;
            optionElement.onclick = () => selectAnswer(answer, index);
            questionOptions.appendChild(optionElement);
        });
    }
}

// 답변 선택 함수
function selectAnswer(answer, index) {
    // 선택된 답변 저장
    userAnswers[currentQuestionIndex] = answer;
    
    // 점수 계산
    let questionScore = 0;
    Object.keys(answer).forEach(key => {
        if (typeof answer[key] === 'number') {
            questionScore += answer[key];
        }
    });
    
    if (userAnswers.length > currentQuestionIndex + 1) {
        // 이전 답변이 있었다면 점수에서 차감
        let prevScore = 0;
        const prevAnswer = userAnswers[currentQuestionIndex];
        Object.keys(prevAnswer).forEach(key => {
            if (typeof prevAnswer[key] === 'number') {
                prevScore += prevAnswer[key];
            }
        });
        totalScore = totalScore - prevScore + questionScore;
    } else {
        totalScore += questionScore;
    }
    
    // 시각적 피드백
    const options = document.querySelectorAll('.option-item');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    
    // 다음 질문으로 이동
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showAnalysisModal();
        }
    }, 600);
}

// 분석 모달 표시
function showAnalysisModal() {
    if (questionPage) questionPage.classList.add('hidden');
    if (analysisModal) analysisModal.classList.remove('hidden');
    
    // 팝업 광고 초기화
    setTimeout(() => {
        if (typeof adsbygoogle !== 'undefined') {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, 100);
    
    // 카운트다운 시작
    let countdown = 6;
    const countdownTimer = document.querySelector('.countdown-timer');
    
    const timer = setInterval(() => {
        if (countdownTimer) countdownTimer.textContent = countdown;
        countdown--;
        
        if (countdown < 0) {
            clearInterval(timer);
            analyzeResults();
            showResults();
        }
    }, 1000);
}

// 결과 분석 함수
function analyzeResults() {
    // 사용자 선택 분석
    let regionData = null;
    let ageGroup = null;
    let priorityLevel = 0;
    let benefitLevel = 0;
    
    userAnswers.forEach(answer => {
        if (answer.region) regionData = answer;
        if (answer.age) ageGroup = answer.age;
        if (answer.priority) priorityLevel += answer.priority;
        if (answer.benefits) benefitLevel += answer.benefits;
        if (answer.urgency) priorityLevel += answer.urgency;
        if (answer.compensation) benefitLevel += answer.compensation;
        if (answer.support) benefitLevel += answer.support;
    });
    
    // 결과 타입 결정
    let resultType;
    if (totalScore >= 20) {
        resultType = "최우선 혜택 대상";
    } else if (totalScore >= 15) {
        resultType = "우선 혜택 대상";
    } else if (totalScore >= 10) {
        resultType = "일반 혜택 대상";
    } else {
        resultType = "정보 수집 단계";
    }
    
    // 지역 정보
    const selectedRegion = regionData ? regionData.region : 'default';
    const regionInfo = benefitPrograms[selectedRegion] || benefitPrograms.default;
    
    analysisData = {
        resultType: resultType,
        totalScore: totalScore,
        regionInfo: regionInfo,
        ageGroup: ageGroup,
        priorityLevel: priorityLevel,
        benefitLevel: benefitLevel
    };
}

// 결과 표시 함수
function showResults() {
    if (analysisModal) analysisModal.classList.add('hidden');
    if (resultPage) resultPage.classList.remove('hidden');
    
    const result = resultTypes[analysisData.resultType];
    const regionInfo = analysisData.regionInfo;
    
    // 결과 헤더 업데이트
    const resultBadge = document.querySelector('.result-badge');
    const resultTitle = document.querySelector('.result-title');
    const resultSubtitle = document.querySelector('.result-subtitle');
    
    if (resultBadge) {
        resultBadge.style.background = result.bgColor;
        resultBadge.innerHTML = `<div class="badge-icon">${result.badge}</div>`;
    }
    
    if (resultTitle) resultTitle.textContent = result.title;
    if (resultSubtitle) resultSubtitle.textContent = result.subtitle;
    
    // 결과 내용 업데이트
    const benefitsSummary = document.querySelector('.benefits-summary');
    const detailedBenefits = document.querySelector('.detailed-benefits');
    const applicationGuide = document.querySelector('.application-guide');
    
    if (benefitsSummary) {
        benefitsSummary.innerHTML = `
            <p><strong>${result.description}</strong></p>
            <p style="margin-top: 15px; color: #0984e3; font-weight: 600;">
                ${regionInfo.name} 지역 기준 최대 <span style="font-size: 1.2em; color: #00b894;">${regionInfo.maxBenefit}</span> 혜택 가능
            </p>
        `;
    }
    
    if (detailedBenefits) {
        detailedBenefits.innerHTML = `
            <h4 style="color: #0984e3; margin-bottom: 15px;">🎁 ${regionInfo.name} 혜택 내역</h4>
            <ul style="list-style: none; padding: 0;">
                ${regionInfo.programs.map(program => `
                    <li style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.7); border-radius: 8px; border-left: 3px solid #74b9ff;">
                        ✓ ${program}
                    </li>
                `).join('')}
            </ul>
            
            <div style="margin-top: 20px; padding: 15px; background: rgba(0, 184, 148, 0.1); border-radius: 10px;">
                <h5 style="color: #00b894; margin-bottom: 8px;">💡 추가 정보</h5>
                <p style="font-size: 0.9em; color: #2d3436; line-height: 1.5;">
                    운전면허 자진반납은 <strong>만 65세 이상</strong> 또는 <strong>신체적 제약</strong>이 있는 분들이 대상입니다. 
                    반납 후에는 재취득이 어려우므로 신중히 결정하시기 바랍니다.
                </p>
            </div>
        `;
    }
    
    if (applicationGuide) {
        applicationGuide.innerHTML = `
            <h4 style="color: #0984e3; margin-bottom: 15px;">📋 신청 방법</h4>
            <div class="guide-links">
                <a href="${regionInfo.applicationUrl}" target="_blank" class="guide-link">
                    🏛️ ${regionInfo.name} 온라인 신청
                </a>
                <a href="tel:${regionInfo.contactNumber}" class="guide-link">
                    📞 전화 상담 (${regionInfo.contactNumber})
                </a>
                <a href="https://www.safedriving.or.kr" target="_blank" class="guide-link">
                    🚗 도로교통공단 안내
                </a>
                <a href="https://www.koroad.or.kr" target="_blank" class="guide-link">
                    📋 면허반납 절차 안내
                </a>
            </div>
            
            <div style="margin-top: 25px; padding: 20px; background: rgba(255, 118, 117, 0.1); border-radius: 10px; border-left: 4px solid #ff7675;">
                <h5 style="color: #d63031; margin-bottom: 10px;">⚠️ 신청 전 확인사항</h5>
                <ul style="font-size: 0.9em; color: #2d3436; line-height: 1.6;">
                    <li>• 신청 기간 및 예산 확인</li>
                    <li>• 필요 서류 사전 준비</li>
                    <li>• 가족과의 충분한 상의</li>
                    <li>• 대체 교통수단 확보</li>
                </ul>
            </div>
        `;
    }
}

// 테스트 재시작 함수
function restartTest() {
    currentQuestionIndex = 0;
    userAnswers = [];
    totalScore = 0;
    analysisData = {};
    
    if (resultPage) resultPage.classList.add('hidden');
    if (startPage) startPage.classList.remove('hidden');
}

// 카카오톡 공유 함수
function shareKakao() {
    const result = resultTypes[analysisData.resultType];
    const regionInfo = analysisData.regionInfo;
    
    const title = result ? result.title : '운전면허 자진반납 보상제도';
    const description = result ? 
        `${result.subtitle} - ${regionInfo.name} 최대 ${regionInfo.maxBenefit} 혜택 가능!` : 
        '나에게 맞는 운전면허 반납 혜택을 확인해보세요!';
    
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '운전면허 자진반납 보상제도 안내',
                description: `${title} - ${description}`,
                imageUrl: window.location.origin + '/운전면허반납/운전면허반납.svg',
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
        // 대체 공유 방법
        const text = `운전면허 자진반납 보상제도 - ${title}`;
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: text,
                url: url
            });
        } else {
            navigator.clipboard.writeText(`${text} ${url}`).then(() => {
                alert('링크가 클립보드에 복사되었습니다!');
            });
        }
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 광고 초기화
    if (typeof adsbygoogle !== 'undefined') {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
    
    // 이벤트 리스너 등록
    const startBtn = document.querySelector('.start-btn');
    const primaryBtns = document.querySelectorAll('.primary-btn');
    const kakaoShares = document.querySelectorAll('.kakao-share');
    
    if (startBtn) {
        startBtn.addEventListener('click', startTest);
    }
    
    primaryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'https://testpro.site';
        });
    });
    
    kakaoShares.forEach(share => {
        share.addEventListener('click', shareKakao);
    });
});

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('analysisModal');
        const questionPage = document.getElementById('questionPage');
        
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            if (questionPage) questionPage.classList.remove('hidden');
        }
    }
    
    // 숫자 키로 답변 선택
    if (questionPage && !questionPage.classList.contains('hidden')) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4) {
            const options = document.querySelectorAll('.option-item');
            if (options[num - 1]) {
                options[num - 1].click();
            }
        }
    }
});

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
