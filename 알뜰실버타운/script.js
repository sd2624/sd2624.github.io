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

// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// [AdManager] 광고 동적 로딩 및 중복 방지 클래스

const questions = [
    {
        question: "현재 연령이 어떻게 되시나요?",
        answers: [
            { text: "60세 이상 ~ 65세 미만", age: "60-65", score: 3 },
            { text: "65세 이상 ~ 70세 미만", age: "65-70", score: 5 },
            { text: "70세 이상 ~ 75세 미만", age: "70-75", score: 5 },
            { text: "75세 이상", age: "75+", score: 5 },
            { text: "60세 미만", age: "under60", score: 0 }
        ]
    },
    {
        question: "월 소득 수준은 어느 정도인가요?",
        answers: [
            { text: "기초생활수급자", income: "basic", score: 5 },
            { text: "차상위계층", income: "near_poor", score: 4 },
            { text: "중위소득 50% 이하", income: "low", score: 4 },
            { text: "중위소득 80% 이하", income: "middle", score: 3 },
            { text: "중위소득 100% 이하", income: "normal", score: 2 },
            { text: "중위소득 100% 초과", income: "high", score: 1 }
        ]
    },
    {
        question: "현재 거주 상황은 어떠신가요?",
        answers: [
            { text: "무주택자 (전세/월세 거주)", housing: "none", score: 5 },
            { text: "소형 주택 소유 (85㎡ 이하)", housing: "small", score: 3 },
            { text: "일반 주택 소유", housing: "normal", score: 1 },
            { text: "고시원/쪽방 거주", housing: "poor", score: 5 },
            { text: "가족과 동거 중", housing: "family", score: 3 }
        ]
    },
    {
        question: "희망하는 지역은 어디인가요?",
        answers: [
            { text: "서울특별시", region: "seoul", availability: 3 },
            { text: "경기도", region: "gyeonggi", availability: 4 },
            { text: "인천광역시", region: "incheon", availability: 4 },
            { text: "부산/대구/광주/대전", region: "metro", availability: 5 },
            { text: "기타 지방", region: "local", availability: 5 }
        ]
    },
    {
        question: "건강 상태는 어떠신가요?",
        answers: [
            { text: "일상생활 완전 독립 가능", health: "excellent", care_need: 1 },
            { text: "일부 도움 필요 (가사, 외출)", health: "good", care_need: 2 },
            { text: "상당한 도움 필요", health: "fair", care_need: 3 },
            { text: "전문 케어 필요", health: "poor", care_need: 4 },
            { text: "장기요양등급 보유", health: "care", care_need: 5 }
        ]
    },
    {
        question: "가족 상황은 어떻게 되시나요?",
        answers: [
            { text: "독거 (혼자 거주)", family: "alone", priority: 5 },
            { text: "부부만 거주", family: "couple", priority: 4 },
            { text: "자녀와 함께 거주", family: "with_children", priority: 2 },
            { text: "기타 가족과 거주", family: "extended", priority: 3 },
            { text: "돌봄이 필요한 상황", family: "need_care", priority: 5 }
        ]
    },
    {
        question: "고령자복지주택에 대해 얼마나 알고 계신가요?",
        answers: [
            { text: "처음 들어봄", knowledge: "none", info_need: 5 },
            { text: "이름만 들어봄", knowledge: "little", info_need: 4 },
            { text: "기본적인 내용은 알고 있음", knowledge: "basic", info_need: 3 },
            { text: "어느 정도 잘 알고 있음", knowledge: "good", info_need: 2 },
            { text: "신청 경험이 있음", knowledge: "expert", info_need: 1 }
        ]
    }
];

// 고령자복지주택 정보
const housingInfo = {
    "우선순위": {
        name: "우선순위 대상",
        eligibility: "매우 높음",
        description: "기초생활수급자, 차상위계층, 독거노인 등 우선 공급 대상에 해당합니다.",
        benefits: [
            "임대료 최대 50% 할인",
            "보증금 무이자 대출 지원",
            "우선 입주 권한",
            "생활관리사 지원"
        ],
        requirements: [
            "만 65세 이상 (일부 60세 이상)",
            "무주택자 또는 소형 주택 소유자",
            "소득 기준 충족",
            "독립생활 가능자"
        ],
        locations: [
            {
                name: "서울 은평구 고령자복지주택",
                type: "임대형",
                rooms: "1인실 위주",
                rent: "월 15~25만원",
                deposit: "300~500만원"
            },
            {
                name: "경기 성남시 실버하우징",
                type: "임대형",
                rooms: "1~2인실",
                rent: "월 12~20만원", 
                deposit: "200~400만원"
            },
            {
                name: "부산 해운대구 고령자주택",
                type: "임대형",
                rooms: "1인실",
                rent: "월 10~18만원",
                deposit: "150~350만원"
            }
        ]
    },
    "일반자격": {
        name: "일반 신청 자격",
        eligibility: "높음",
        description: "연령과 소득 기준을 충족하여 고령자복지주택 신청이 가능합니다.",
        benefits: [
            "시세 대비 30% 할인된 임대료",
            "안전하고 편리한 주거환경",
            "의료·복지 서비스 연계",
            "커뮤니티 활동 참여"
        ],
        requirements: [
            "만 60세 이상 (지역별 차이)",
            "중위소득 80% 이하",
            "무주택 또는 소형주택 소유",
            "신체·정신적 독립생활 가능"
        ],
        locations: [
            {
                name: "인천 연수구 시니어하우스",
                type: "임대형",
                rooms: "1~2인실",
                rent: "월 20~30만원",
                deposit: "500~800만원"
            },
            {
                name: "대전 유성구 고령자주택",
                type: "임대형", 
                rooms: "1인실",
                rent: "월 15~25만원",
                deposit: "300~600만원"
            },
            {
                name: "광주 광산구 실버타운",
                type: "임대형",
                rooms: "1~2인실",
                rent: "월 18~28만원",
                deposit: "400~700만원"
            }
        ]
    },
    "검토필요": {
        name: "추가 검토 필요",
        eligibility: "보통",
        description: "일부 조건이 부족하지만 다른 지원 제도나 추후 신청 가능성이 있습니다.",
        benefits: [
            "향후 신청 기회 확보",
            "다른 주거 지원 제도 안내",
            "조건 충족 시 우선 연락",
            "관련 정보 지속 제공"
        ],
        requirements: [
            "연령 조건 재검토",
            "소득 기준 조정 확인",
            "주택 소유 현황 점검",
            "가족 상황 변화 대기"
        ],
        locations: [
            {
                name: "서울 강서구 고령자주택 (예정)",
                type: "신규 건설",
                rooms: "미정",
                rent: "시세 대비 30% 할인 예정",
                deposit: "정부 지원 예정"
            },
            {
                name: "경기 수원시 실버하우징 (계획)",
                type: "리모델링",
                rooms: "1~2인실 예정",
                rent: "월 20만원대 예상",
                deposit: "500만원 내외 예상"
            }
        ]
    },
    "부적격": {
        name: "현재 신청 어려움",
        eligibility: "낮음",
        description: "현재는 신청 조건에 부합하지 않지만, 다른 주거 지원 방안을 안내받을 수 있습니다.",
        benefits: [
            "다른 주거 복지 제도 안내",
            "민간 실버타운 정보 제공",
            "향후 정책 변화 시 연락",
            "관련 상담 서비스 연결"
        ],
        requirements: [
            "현재 기준 미충족",
            "소득 수준 재검토 필요",
            "연령 조건 미달",
            "주택 소유 현황 부적격"
        ],
        locations: [
            {
                name: "민간 실버타운 A",
                type: "분양형",
                rooms: "다양한 평형",
                rent: "시세 수준",
                deposit: "분양가 별도"
            },
            {
                name: "민간 임대주택 B",
                type: "임대형",
                rooms: "1~3인실",
                rent: "월 40~80만원",
                deposit: "1000~3000만원"
            }
        ]
    }
};

// 결과 타입 정의
const resultTypes = {
    "우선순위": {
        title: "🏆 우선순위 신청 대상",
        subtitle: "고령자복지주택 우선 공급 대상입니다!",
        badge: "✅",
        bgColor: "linear-gradient(45deg, #27ae60, #2ecc71)",
        description: "귀하는 고령자복지주택 우선 공급 대상에 해당합니다. 빠른 신청을 권장드립니다.",
        category: "우선순위"
    },
    "일반자격": {
        title: "✓ 신청 자격 충족",
        subtitle: "고령자복지주택 신청이 가능합니다!",
        badge: "👍",
        bgColor: "linear-gradient(45deg, #3498db, #74b9ff)",
        description: "기본 신청 자격을 충족하여 고령자복지주택 입주 신청이 가능합니다.",
        category: "일반자격"
    },
    "검토필요": {
        title: "⚠️ 추가 검토 필요",
        subtitle: "일부 조건 확인 후 신청 가능합니다",
        badge: "📋",
        bgColor: "linear-gradient(45deg, #f39c12, #fdcb6e)",
        description: "일부 조건에서 추가 검토가 필요하지만 신청 가능성이 있습니다.",
        category: "검토필요"
    },
    "부적격": {
        title: "❌ 현재 신청 어려움",
        subtitle: "다른 주거 지원 방안을 안내받으세요",
        badge: "ℹ️",
        bgColor: "linear-gradient(45deg, #e74c3c, #fd79a8)",
        description: "현재는 신청이 어렵지만 다른 주거 복지 제도를 안내받을 수 있습니다.",
        category: "부적격"
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
    
    // [AdManager] 3번째 질문 뒤 광고 노출
    if (window.adManager && currentQuestionIndex === 2) {
        window.adManager.showMidAd();
    }
}

// 답변 선택 함수
function selectAnswer(answer, index) {
    // 선택된 답변 저장
    userAnswers[currentQuestionIndex] = answer;
    
    // 점수 계산
    if (answer.score !== undefined) {
        if (userAnswers.length > currentQuestionIndex + 1) {
            // 이전 답변이 있었다면 점수에서 차감
            const prevScore = userAnswers[currentQuestionIndex].score || 0;
            totalScore = totalScore - prevScore + answer.score;
        } else {
            totalScore += answer.score;
        }
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
    
    // 분석 단계 애니메이션
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('active');
        }, (index + 1) * 1000);
    });
    
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
    // 사용자 답변 분석
    let ageScore = 0;
    let incomeScore = 0;
    let housingScore = 0;
    let priorityFactors = 0;
    
    userAnswers.forEach(answer => {
        if (answer.age && answer.age !== 'under60') ageScore = 1;
        if (answer.income) {
            if (['basic', 'near_poor', 'low'].includes(answer.income)) incomeScore = 2;
            else if (['middle', 'normal'].includes(answer.income)) incomeScore = 1;
        }
        if (answer.housing) {
            if (['none', 'poor'].includes(answer.housing)) housingScore = 2;
            else if (['small', 'family'].includes(answer.housing)) housingScore = 1;
        }
        if (answer.family === 'alone' || answer.health === 'care') priorityFactors++;
    });
    
    // 총 점수 계산
    const eligibilityScore = ageScore + incomeScore + housingScore + priorityFactors;
    
    // 결과 타입 결정
    let resultType;
    if (eligibilityScore >= 6 && ageScore === 1) {
        resultType = "우선순위";
    } else if (eligibilityScore >= 4 && ageScore === 1) {
        resultType = "일반자격";
    } else if (eligibilityScore >= 2 || ageScore === 1) {
        resultType = "검토필요";
    } else {
        resultType = "부적격";
    }
    
    analysisData = {
        resultType: resultType,
        totalScore: totalScore,
        eligibilityScore: eligibilityScore,
        ageScore: ageScore,
        incomeScore: incomeScore,
        housingScore: housingScore,
        priorityFactors: priorityFactors
    };
}

// 결과 표시 함수
function showResults() {
    if (analysisModal) analysisModal.classList.add('hidden');
    if (resultPage) resultPage.classList.remove('hidden');
    
    // [AdManager] 결과 페이지 광고 노출
    if (window.adManager) {
        window.adManager.showResultAd();
    }
    
    const result = resultTypes[analysisData.resultType];
    const housingData = housingInfo[result.category];
    
    // 결과 헤더 업데이트
    const resultBadge = document.querySelector('.result-badge');
    const resultTitle = document.querySelector('.result-title');
    const resultSubtitle = document.querySelector('.result-subtitle');
    
    if (resultBadge) {
        resultBadge.style.background = result.bgColor;
        resultBadge.innerHTML = `<div style="font-size: 1.2em;">${result.badge}</div>`;
    }
    
    if (resultTitle) resultTitle.textContent = result.title;
    if (resultSubtitle) resultSubtitle.textContent = result.subtitle;
    
    // 결과 내용 업데이트
    const eligibilitySummary = document.querySelector('.eligibility-summary');
    const recommendedHousing = document.querySelector('.recommended-housing');
    const applicationGuide = document.querySelector('.application-guide');
    
    if (eligibilitySummary) {
        eligibilitySummary.innerHTML = `
            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h4 style="color: #ffffff; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    📊 신청 자격 분석 결과
                </h4>
                <p style="color: #ecf0f1; line-height: 1.6; margin-bottom: 15px;">
                    <strong>${result.description}</strong>
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                    <div style="text-align: center; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                        <div style="font-size: 1.5em; color: #e74c3c; font-weight: 700;">${housingData.eligibility}</div>
                        <div style="font-size: 0.9em; color: #bdc3c7;">자격 가능성</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                        <div style="font-size: 1.5em; color: #27ae60; font-weight: 700;">${analysisData.eligibilityScore}/7</div>
                        <div style="font-size: 0.9em; color: #bdc3c7;">조건 충족도</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    if (recommendedHousing) {
        recommendedHousing.innerHTML = `
            <h4 style="color: #ffffff; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                🏠 추천 고령자복지주택
            </h4>
            ${housingData.locations.map((location, index) => `
                <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #e74c3c;">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                        <h5 style="color: #ffffff; font-size: 1.1em; margin: 0;">${location.name}</h5>
                        <span style="background: #e74c3c; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8em;">${location.type}</span>
                    </div>
                    <div style="color: #bdc3c7; font-size: 0.9em; line-height: 1.5;">
                        <div style="margin: 5px 0;">🏠 규모: ${location.rooms}</div>
                        <div style="margin: 5px 0;">💰 임대료: ${location.rent}</div>
                        <div style="margin: 5px 0;">🏦 보증금: ${location.deposit}</div>
                    </div>
                </div>
            `).join('')}
        `;
    }
    
    if (applicationGuide) {
        applicationGuide.innerHTML = `
            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px;">
                <h4 style="color: #ffffff; margin-bottom: 15px;">✅ 주요 혜택</h4>
                <ul style="color: #bdc3c7; line-height: 1.6; padding-left: 20px; margin-bottom: 20px;">
                    ${housingData.benefits.map(benefit => `<li style="margin: 8px 0;">${benefit}</li>`).join('')}
                </ul>
                
                <h4 style="color: #ffffff; margin-bottom: 15px;">📋 신청 요건</h4>
                <ul style="color: #bdc3c7; line-height: 1.6; padding-left: 20px; margin-bottom: 20px;">
                    ${housingData.requirements.map(req => `<li style="margin: 8px 0;">${req}</li>`).join('')}
                </ul>
                
                <div style="background: rgba(231, 76, 60, 0.1); border-radius: 8px; padding: 15px; border-left: 4px solid #e74c3c;">
                    <h5 style="color: #e74c3c; margin-bottom: 8px;">🚨 신청 시 주의사항</h5>
                    <p style="color: #bdc3c7; font-size: 0.9em; line-height: 1.5; margin: 0;">
                        고령자복지주택은 지역별로 신청 시기와 조건이 다를 수 있습니다. 
                        정확한 정보는 해당 지역 주거복지센터나 구청에 문의하시기 바랍니다.
                    </p>
                </div>
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
    const housingData = housingInfo[result.category];
    
    const title = result ? result.title : '알뜰실버타운 고령자복지주택 신청';
    const description = result ? 
        `${result.subtitle} - ${housingData.name}` : 
        '나의 고령자복지주택 신청 자격을 확인해보세요!';
    
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '알뜰실버타운 고령자복지주택 신청',
                description: `${title} - ${description}`,
                imageUrl: window.location.origin + '/알뜰실버타운/알뜰실버타운.svg',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
            buttons: [
                {
                    title: '자격 확인하기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });
    } else {
        // 대체 공유 방법
        const text = `알뜰실버타운 고령자복지주택 신청 - ${title}`;
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

// 이벤트 리스너 설정 함수
function setupEventListeners() {
    console.log('이벤트 리스너 설정 중...');
    
    // 테스트 시작 버튼
    const startBtn = document.querySelector('.start-button');
    if (startBtn) {
        startBtn.addEventListener('click', startTest);
        console.log('테스트 시작 버튼 이벤트 리스너 등록됨');
    }
    
    // 기본 버튼들
    const primaryBtns = document.querySelectorAll('.primary-btn');
    primaryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.open('https://www.lh.or.kr', '_blank');
        });
    });
    
    // 카카오 공유 버튼들
    const kakaoShares = document.querySelectorAll('.kakao-share');
    kakaoShares.forEach(share => {
        share.addEventListener('click', shareKakao);
    });
    
    // 다시하기 버튼들
    const restartBtns = document.querySelectorAll('.restart-btn');
    restartBtns.forEach(btn => {
        btn.addEventListener('click', restartTest);
    });
    
    console.log('모든 이벤트 리스너 등록 완료');
}

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
        if (num >= 1 && num <= 6) {
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
    
    // [AdManager] 광고 관리자 초기화
    window.adManager = new AdManager();
});

// 전역 함수로 노출
window.startTest = startTest;
window.restartTest = restartTest;
window.shareKakao = shareKakao;

// 전역 함수로 노출
window.startTest = startTest;
window.restartTest = restartTest;
window.shareKakao = shareKakao;

// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('알뜰실버타운 페이지 로드됨');
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
});