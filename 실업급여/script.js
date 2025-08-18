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

// 질문 데이터
const questions = [
    {
        question: "퇴사 사유가 무엇인가요?",
        description: "⚖️ 정당한 사유 여부를 판단하는 가장 중요한 요소입니다",
        answers: [
            { text: "본인 질병/부상으로 근무 불가", reason: "health_self", validity: 5, category: "정당한사유" },
            { text: "가족 질병/부상으로 간병 필요", reason: "health_family", validity: 5, category: "정당한사유" },
            { text: "임신, 출산, 육아", reason: "pregnancy", validity: 5, category: "정당한사유" },
            { text: "임금 체불 (1개월분 이상)", reason: "unpaid_wages", validity: 5, category: "정당한사유" },
            { text: "근로계약 위반 (조건 불일치)", reason: "contract_violation", validity: 4, category: "정당한사유" },
            { text: "직장 내 괴롭힘/성희롱", reason: "harassment", validity: 5, category: "정당한사유" },
            { text: "사업장 이전으로 통근 곤란", reason: "relocation", validity: 4, category: "정당한사유" },
            { text: "단순 이직 희망", reason: "personal", validity: 1, category: "개인사유" }
        ]
    },
    {
        question: "고용보험 가입 기간은 얼마나 되나요?",
        description: "📅 수급 자격의 기본 조건을 확인합니다",
        answers: [
            { text: "180일 이상", period: "qualified", months: 6, eligibility: 5 },
            { text: "90일~179일", period: "insufficient", months: 4, eligibility: 2 },
            { text: "90일 미만", period: "not_qualified", months: 2, eligibility: 1 },
            { text: "잘 모르겠음", period: "unknown", months: 0, eligibility: 3 }
        ]
    },
    {
        question: "퇴사 증빙서류를 보유하고 있나요?",
        description: "📋 정당한 사유 입증을 위한 증빙자료가 필요합니다",
        answers: [
            { text: "의료진단서/소견서 있음", evidence: "medical", strength: 5, proof: "strong" },
            { text: "임금체불 확인서/통장내역", evidence: "financial", strength: 5, proof: "strong" },
            { text: "회사 공문/이메일/녹음파일", evidence: "company_docs", strength: 4, proof: "medium" },
            { text: "목격자/동료 증언", evidence: "witness", strength: 3, proof: "medium" },
            { text: "구두 약속만 있음", evidence: "verbal", strength: 2, proof: "weak" },
            { text: "증빙자료 없음", evidence: "none", strength: 1, proof: "none" }
        ]
    },
    {
        question: "퇴사 시점이 언제인가요?",
        description: "⏰ 신청 기한 내에 있는지 확인합니다",
        answers: [
            { text: "1개월 내", timing: "recent", urgency: 5, deadline: "safe" },
            { text: "3개월 내", timing: "moderate", urgency: 4, deadline: "safe" },
            { text: "6개월 내", timing: "considerable", urgency: 3, deadline: "safe" },
            { text: "1년 내", timing: "approaching", urgency: 2, deadline: "urgent" },
            { text: "1년 이상", timing: "expired", urgency: 1, deadline: "expired" }
        ]
    },
    {
        question: "현재 구직 의사가 있으신가요?",
        description: "💼 실업급여는 재취업 의지가 있는 경우에만 지급됩니다",
        answers: [
            { text: "적극적으로 구직 중", job_seeking: "active", willingness: 5, activity: "high" },
            { text: "구직 계획 있음", job_seeking: "planned", willingness: 4, activity: "medium" },
            { text: "휴식 후 구직 예정", job_seeking: "delayed", willingness: 3, activity: "low" },
            { text: "창업/프리랜서 고려", job_seeking: "self_employed", willingness: 2, activity: "alternative" },
            { text: "당분간 일할 계획 없음", job_seeking: "none", willingness: 1, activity: "none" }
        ]
    },
    {
        question: "이전에 실업급여를 받은 적이 있나요?",
        description: "🔄 이전 수급 이력이 있으면 제한사항이 있을 수 있습니다",
        answers: [
            { text: "받은 적 없음", history: "none", restriction: 1, status: "clean" },
            { text: "3년 이전에 받음", history: "old", restriction: 2, status: "eligible" },
            { text: "1-3년 전에 받음", history: "recent", restriction: 3, status: "limited" },
            { text: "1년 내에 받음", history: "very_recent", restriction: 4, status: "restricted" },
            { text: "잘 모르겠음", history: "unknown", restriction: 2, status: "check_needed" }
        ]
    },
    {
        question: "현재 나이대는?",
        description: "👤 연령에 따라 수급 기간과 조건이 달라질 수 있습니다",
        answers: [
            { text: "20대", age: "20s", experience: 1, flexibility: 5 },
            { text: "30대", age: "30s", experience: 3, flexibility: 4 },
            { text: "40대", age: "40s", experience: 4, flexibility: 3 },
            { text: "50대", age: "50s", experience: 5, flexibility: 2 },
            { text: "60대 이상", age: "60plus", experience: 5, flexibility: 1 }
        ]
    },
    {
        question: "최종 학력은?",
        description: "🎓 학력에 따라 구직 활동 및 수급 조건이 달라집니다",
        answers: [
            { text: "고등학교 졸업", education: "high_school", level: 1, job_market: "limited" },
            { text: "전문대학 졸업", education: "college", level: 2, job_market: "moderate" },
            { text: "대학교 졸업", education: "university", level: 3, job_market: "broad" },
            { text: "대학원 졸업", education: "graduate", level: 4, job_market: "specialized" },
            { text: "기타/해당없음", education: "other", level: 2, job_market: "variable" }
        ]
    },
    {
        question: "이전 직장에서 근무 기간은?",
        description: "⏱️ 근무 기간이 길수록 실업급여 수급 기간이 길어집니다",
        answers: [
            { text: "6개월 미만", duration: "very_short", benefit_period: 1, stability: 1 },
            { text: "6개월~1년", duration: "short", benefit_period: 2, stability: 2 },
            { text: "1년~3년", duration: "medium", benefit_period: 3, stability: 3 },
            { text: "3년~5년", duration: "long", benefit_period: 4, stability: 4 },
            { text: "5년 이상", duration: "very_long", benefit_period: 5, stability: 5 }
        ]
    },
    {
        question: "이전 직장의 업종은?",
        description: "🏢 업종에 따라 재취업 난이도가 다를 수 있습니다",
        answers: [
            { text: "제조업", industry: "manufacturing", demand: 4, stability: 4 },
            { text: "서비스업", industry: "service", demand: 5, stability: 3 },
            { text: "IT/기술직", industry: "tech", demand: 5, stability: 4 },
            { text: "금융/보험", industry: "finance", demand: 3, stability: 5 },
            { text: "건설업", industry: "construction", demand: 4, stability: 2 },
            { text: "기타", industry: "other", demand: 3, stability: 3 }
        ]
    },
    {
        question: "월 평균 임금은?",
        description: "💰 이전 임금 수준에 따라 실업급여 금액이 결정됩니다",
        answers: [
            { text: "200만원 미만", salary: "low", benefit_amount: 1, living_cost: 1 },
            { text: "200만원~300만원", salary: "medium_low", benefit_amount: 2, living_cost: 2 },
            { text: "300만원~400만원", salary: "medium", benefit_amount: 3, living_cost: 3 },
            { text: "400만원~500만원", salary: "medium_high", benefit_amount: 4, living_cost: 4 },
            { text: "500만원 이상", salary: "high", benefit_amount: 5, living_cost: 5 }
        ]
    },
    {
        question: "부양가족이 있나요?",
        description: "👨‍👩‍👧‍👦 부양가족 수에 따라 실업급여 가산급이 지급됩니다",
        answers: [
            { text: "없음", dependents: "none", count: 0, allowance: 0 },
            { text: "1명", dependents: "one", count: 1, allowance: 1 },
            { text: "2명", dependents: "two", count: 2, allowance: 2 },
            { text: "3명", dependents: "three", count: 3, allowance: 3 },
            { text: "4명 이상", dependents: "many", count: 4, allowance: 4 }
        ]
    },
    {
        question: "현재 거주지역은?",
        description: "🏠 지역에 따라 구직 기회와 생활비가 다릅니다",
        answers: [
            { text: "서울", region: "seoul", job_opportunity: 5, living_cost: 5 },
            { text: "수도권 (경기/인천)", region: "metro", job_opportunity: 4, living_cost: 4 },
            { text: "광역시", region: "major_city", job_opportunity: 3, living_cost: 3 },
            { text: "중소도시", region: "small_city", job_opportunity: 2, living_cost: 2 },
            { text: "농어촌", region: "rural", job_opportunity: 1, living_cost: 1 }
        ]
    },
    {
        question: "보유 기술이나 자격증이 있나요?",
        description: "🎯 전문 기술이나 자격증은 재취업에 도움이 됩니다",
        answers: [
            { text: "국가기술자격증 보유", skills: "national_cert", employability: 5, specialty: "high" },
            { text: "민간자격증 보유", skills: "private_cert", employability: 3, specialty: "medium" },
            { text: "실무 경험/기술", skills: "experience", employability: 4, specialty: "medium" },
            { text: "어학능력 우수", skills: "language", employability: 3, specialty: "medium" },
            { text: "특별한 기술 없음", skills: "none", employability: 1, specialty: "low" }
        ]
    },
    {
        question: "재취업 희망 분야는?",
        description: "🚀 희망 분야에 따라 구직 전략이 달라집니다",
        answers: [
            { text: "이전과 같은 분야", field: "same", adaptation: 5, success_rate: 4 },
            { text: "관련 분야로 전환", field: "related", adaptation: 4, success_rate: 3 },
            { text: "완전히 다른 분야", field: "different", adaptation: 2, success_rate: 2 },
            { text: "창업/자영업", field: "business", adaptation: 3, success_rate: 2 },
            { text: "아직 정하지 못함", field: "undecided", adaptation: 1, success_rate: 1 }
        ]
    },
    {
        question: "주변 지인 중 채용 정보를 제공할 수 있는 사람이 있나요?",
        description: "🤝 인적 네트워크는 구직에 큰 도움이 됩니다",
        answers: [
            { text: "많은 인맥 보유", network: "extensive", support: 5, opportunity: 5 },
            { text: "일부 도움 가능", network: "moderate", support: 3, opportunity: 3 },
            { text: "가족/친구만", network: "limited", support: 2, opportunity: 2 },
            { text: "거의 없음", network: "minimal", support: 1, opportunity: 1 },
            { text: "전혀 없음", network: "none", support: 0, opportunity: 0 }
        ]
    },
    {
        question: "현재 건강 상태는?",
        description: "🏥 건강 상태는 구직 활동과 수급 기간에 영향을 줍니다",
        answers: [
            { text: "매우 건강함", health: "excellent", work_capacity: 5, limitation: 0 },
            { text: "양호함", health: "good", work_capacity: 4, limitation: 1 },
            { text: "보통", health: "fair", work_capacity: 3, limitation: 2 },
            { text: "약간 문제 있음", health: "poor", work_capacity: 2, limitation: 3 },
            { text: "건강상 제약 많음", health: "very_poor", work_capacity: 1, limitation: 4 }
        ]
    },
    {
        question: "구직 활동을 위한 시간 여유는?",
        description: "⏰ 구직 활동에 할애할 수 있는 시간을 확인합니다",
        answers: [
            { text: "하루 종일 가능", time: "full_time", intensity: 5, efficiency: 5 },
            { text: "하루 4-6시간", time: "part_time", intensity: 4, efficiency: 4 },
            { text: "하루 2-3시간", time: "limited", intensity: 3, efficiency: 3 },
            { text: "주말만 가능", time: "weekend_only", intensity: 2, efficiency: 2 },
            { text: "거의 시간 없음", time: "minimal", intensity: 1, efficiency: 1 }
        ]
    },
    {
        question: "경제적 여유 상황은?",
        description: "💳 경제적 여유에 따라 구직 전략이 달라집니다",
        answers: [
            { text: "6개월 이상 여유", financial: "stable", pressure: 1, flexibility: 5 },
            { text: "3-6개월 여유", financial: "moderate", pressure: 2, flexibility: 4 },
            { text: "1-3개월 여유", financial: "tight", pressure: 3, flexibility: 3 },
            { text: "1개월 미만", financial: "urgent", pressure: 4, flexibility: 2 },
            { text: "즉시 소득 필요", financial: "critical", pressure: 5, flexibility: 1 }
        ]
    },
    {
        question: "컴퓨터/인터넷 활용 능력은?",
        description: "💻 디지털 역량은 현대 구직의 필수 요소입니다",
        answers: [
            { text: "매우 능숙함", digital: "expert", job_search: 5, competitiveness: 5 },
            { text: "능숙함", digital: "good", job_search: 4, competitiveness: 4 },
            { text: "보통", digital: "average", job_search: 3, competitiveness: 3 },
            { text: "기초 수준", digital: "basic", job_search: 2, competitiveness: 2 },
            { text: "거의 못함", digital: "poor", job_search: 1, competitiveness: 1 }
        ]
    },
    {
        question: "워크넷 등 구직 사이트 이용 경험이 있나요?",
        description: "🌐 온라인 구직 경험은 효율적인 구직에 도움됩니다",
        answers: [
            { text: "자주 이용함", online_job: "frequent", efficiency: 5, knowledge: 5 },
            { text: "가끔 이용함", online_job: "occasional", efficiency: 3, knowledge: 3 },
            { text: "이용해본 적 있음", online_job: "tried", efficiency: 2, knowledge: 2 },
            { text: "들어만 봤음", online_job: "heard", efficiency: 1, knowledge: 1 },
            { text: "전혀 모름", online_job: "unknown", efficiency: 0, knowledge: 0 }
        ]
    },
    {
        question: "실업급여 신청 절차에 대해 얼마나 알고 있나요?",
        description: "📋 신청 절차를 알면 더 빠른 수급이 가능합니다",
        answers: [
            { text: "매우 잘 알고 있음", procedure: "expert", readiness: 5, speed: 5 },
            { text: "어느 정도 알고 있음", procedure: "good", readiness: 4, speed: 4 },
            { text: "기본적인 것만 알고 있음", procedure: "basic", readiness: 3, speed: 3 },
            { text: "조금만 알고 있음", procedure: "little", readiness: 2, speed: 2 },
            { text: "전혀 모름", procedure: "none", readiness: 1, speed: 1 }
        ]
    },
    {
        question: "향후 계획은?",
        description: "🎯 장기적인 계획이 구직 전략에 영향을 줍니다",
        answers: [
            { text: "빠른 재취업", plan: "quick_job", urgency: 5, strategy: "broad" },
            { text: "신중한 직장 선택", plan: "careful_selection", urgency: 3, strategy: "selective" },
            { text: "기술 습득 후 취업", plan: "skill_development", urgency: 2, strategy: "long_term" },
            { text: "창업 준비", plan: "startup", urgency: 2, strategy: "entrepreneurial" },
            { text: "진로 재고민", plan: "career_change", urgency: 1, strategy: "exploratory" }
        ]
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];

// DOM 요소
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const analysisModal = document.getElementById('analysisModal');

// [AdManager] 광고 동적 로딩 및 중복 방지

function startTest() {
    if (startPage) startPage.classList.add('hidden');
    if (questionPage) questionPage.classList.remove('hidden');
    
    // 총 질문 수 표시
    const totalQuestions = document.getElementById('totalQuestions');
    if (totalQuestions) totalQuestions.textContent = questions.length;
    
    currentQuestionIndex = 0;
    userAnswers = [];
    showQuestion();
}

// 질문 표시
function showQuestion() {
    const question = questions[currentQuestionIndex];
    
    // 진행률 업데이트
    const progressFill = document.querySelector('.progress-fill');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    
    if (progressFill) {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    if (currentQuestionSpan) {
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
    }
    
    // 질문 내용 업데이트
    const questionTitle = document.getElementById('questionTitle');
    const questionDescription = document.getElementById('questionDescription');
    const answersContainer = document.getElementById('answersContainer');
    
    if (questionTitle) questionTitle.textContent = question.question;
    if (questionDescription) questionDescription.textContent = question.description;
    
    if (answersContainer) {
        answersContainer.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';
            answerDiv.textContent = answer.text;
            answerDiv.onclick = () => selectAnswer(answer, index);
            answersContainer.appendChild(answerDiv);
        });
    }

    
}

// 답변 선택
function selectAnswer(answer, index) {
    // 선택된 답변 저장
    userAnswers[currentQuestionIndex] = answer;
    
    // 시각적 피드백
    const options = document.querySelectorAll('.answer-option');
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
    }, 800);
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
    const steps = document.querySelectorAll('.step-item');
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('active');
            const check = step.querySelector('.step-check');
            if (check && index < 4) {
                check.textContent = '✓';
                check.style.color = '#4caf50';
            }
        }, (index + 1) * 1000);
    });
    
    // 카운트다운 시작
    let countdown = 6;
    const timerDisplay = document.querySelector('.timer-display');
    
    const timer = setInterval(() => {
        if (timerDisplay) timerDisplay.textContent = countdown;
        countdown--;
        
        if (countdown < 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);
}

// 결과 표시
function showResult() {
    if (analysisModal) analysisModal.classList.add('hidden');
    if (resultPage) resultPage.classList.remove('hidden');
    
    // 답변 분석 및 결과 표시
    const analysisResult = analyzeAnswers();
    displayResult(analysisResult);
    
    // 결과 페이지 광고 로드
    setTimeout(() => {
        if (typeof adsbygoogle !== 'undefined') {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, 500);
}

// 답변 분석
function analyzeAnswers() {
    console.log('전체 사용자 답변:', userAnswers);
    
    // 모든 답변 추출 (20개 질문)
    const reason = userAnswers[0] || {};           // 퇴사 사유
    const period = userAnswers[1] || {};           // 고용보험 가입 기간
    const evidence = userAnswers[2] || {};         // 증빙서류
    const timing = userAnswers[3] || {};           // 퇴사 시점
    const jobSeeking = userAnswers[4] || {};       // 구직 의사
    const history = userAnswers[5] || {};          // 이전 수급 이력
    const age = userAnswers[6] || {};              // 나이대
    const education = userAnswers[7] || {};        // 학력
    const duration = userAnswers[8] || {};         // 근무 기간
    const industry = userAnswers[9] || {};         // 업종
    const salary = userAnswers[10] || {};          // 임금
    const dependents = userAnswers[11] || {};      // 부양가족
    const region = userAnswers[12] || {};          // 거주지역
    const skills = userAnswers[13] || {};          // 보유 기술
    const field = userAnswers[14] || {};           // 재취업 희망 분야
    const network = userAnswers[15] || {};         // 인적 네트워크
    const health = userAnswers[16] || {};          // 건강 상태
    const time = userAnswers[17] || {};            // 구직 활동 시간
    const financial = userAnswers[18] || {};       // 경제적 여유
    const digital = userAnswers[19] || {};         // 디지털 역량
    
    // 종합 점수 계산
    let totalScore = 0;
    let basicEligibility = 0;    // 기본 수급 자격
    let additionalSupport = 0;   // 추가 지원 가능성
    let reemploymentProspect = 0; // 재취업 전망
    
    // 1. 기본 수급 자격 점수 (60점 만점)
    basicEligibility += (reason.validity || 0) * 6;      // 퇴사 사유 (30점)
    basicEligibility += (period.eligibility || 0) * 4;   // 가입 기간 (20점)
    basicEligibility += (evidence.strength || 0) * 2;    // 증빙자료 (10점)
    
    // 2. 추가 지원 가능성 (30점 만점)
    additionalSupport += (dependents.allowance || 0) * 3;  // 부양가족 (15점)
    additionalSupport += (duration.benefit_period || 0) * 3; // 근무기간 (15점)
    
    // 3. 재취업 전망 (40점 만점)
    reemploymentProspect += (skills.employability || 0) * 2;    // 보유기술 (10점)
    reemploymentProspect += (education.level || 0) * 2;        // 학력 (10점)
    reemploymentProspect += (network.support || 0) * 2;        // 인적네트워크 (10점)
    reemploymentProspect += (digital.competitiveness || 0) * 2; // 디지털역량 (10점)
    
    // 감점 요소
    totalScore = basicEligibility + additionalSupport + reemploymentProspect;
    totalScore -= (history.restriction || 0) * 5;  // 이전 수급 이력 감점
    totalScore -= (timing.urgency <= 1 ? 10 : 0);  // 신청 기한 초과 감점
    
    // 결과 판정
    let eligibilityLevel = "";
    let recommendation = "";
    let requiredActions = [];
    let benefitAmount = "";
    let benefitPeriod = "";
    
    if (basicEligibility >= 40 && (reason.validity || 0) >= 4) {
        eligibilityLevel = "수급 가능성 매우 높음 (90% 이상)";
        recommendation = "즉시 신청 가능";
        requiredActions.push("고용센터 방문하여 신청서 작성");
        requiredActions.push("필요 서류 준비하여 제출");
        requiredActions.push("구직활동 계획서 작성");
        
        // 급여 계산
        const salaryLevel = salary.benefit_amount || 3;
        benefitAmount = `월 ${80 + (salaryLevel * 30)}만원 ~ ${120 + (salaryLevel * 40)}만원`;
        benefitPeriod = `${3 + (duration.benefit_period || 0)}개월 ~ ${6 + (duration.benefit_period || 0)}개월`;
        
    } else if (basicEligibility >= 30 && (reason.validity || 0) >= 3) {
        eligibilityLevel = "수급 가능성 높음 (70-90%)";
        recommendation = "추가 서류 준비 후 신청";
        requiredActions.push("부족한 증빙서류 보완");
        requiredActions.push("고용센터 상담 후 신청");
        requiredActions.push("정당한 사유 상세 설명서 작성");
        
        benefitAmount = `월 ${70 + (salary.benefit_amount || 3) * 25}만원 ~ ${110 + (salary.benefit_amount || 3) * 35}만원`;
        benefitPeriod = `${3 + Math.floor((duration.benefit_period || 0) * 0.8)}개월 ~ ${5 + Math.floor((duration.benefit_period || 0) * 0.8)}개월`;
        
    } else if (basicEligibility >= 20) {
        eligibilityLevel = "수급 가능성 보통 (40-70%)";
        recommendation = "전문가 상담 후 신중 검토";
        requiredActions.push("노무사 또는 변호사 상담");
        requiredActions.push("추가 증빙자료 수집");
        requiredActions.push("이의신청 준비");
        
        benefitAmount = "심사 결과에 따라 결정";
        benefitPeriod = "기본 수급 기간 적용";
        
    } else if ((reason.validity || 0) <= 2) {
        eligibilityLevel = "수급 어려움 (20% 미만)";
        recommendation = "다른 지원 제도 활용";
        requiredActions.push("국민취업지원제도 신청 검토");
        requiredActions.push("생계급여 등 복지혜택 확인");
        requiredActions.push("직업훈련 프로그램 참여");
        
        benefitAmount = "해당없음";
        benefitPeriod = "해당없음";
        
    } else {
        eligibilityLevel = "조건 검토 필요 (20-40%)";
        recommendation = "고용센터 직접 상담 필수";
        requiredActions.push("고용센터 전문상담사와 면담");
        requiredActions.push("개별 사정 상세 설명");
        requiredActions.push("대안 지원책 문의");
        
        benefitAmount = "상담 후 결정";
        benefitPeriod = "상담 후 결정";
    }
    
    // 개인화된 조언 추가
    addPersonalizedAdvice(requiredActions, {
        age, health, financial, time, region, skills, network, field
    });
    
    return {
        eligibilityLevel,
        recommendation,
        requiredActions,
        benefitAmount,
        benefitPeriod,
        totalScore,
        basicEligibility,
        additionalSupport,
        reemploymentProspect,
        reasonCategory: reason.category || "미확인",
        evidenceStrength: evidence.proof || "미확인",
        deadline: timing.deadline || "미확인"
    };
}

// 개인화된 조언 추가 함수
function addPersonalizedAdvice(actions, personalInfo) {
    const { age, health, financial, time, region, skills, network, field } = personalInfo;
    
    // 연령별 조언
    if (age && age.age === "50s" || age.age === "60plus") {
        actions.push("중장년 특화 취업 프로그램 확인");
        actions.push("국민내일배움카드 활용");
    }
    
    // 건강상 제약 있는 경우
    if (health && health.limitation >= 3) {
        actions.push("장애인 고용촉진 제도 확인");
        actions.push("재택근무 가능 직종 탐색");
    }
    
    // 경제적 여유 부족한 경우
    if (financial && financial.pressure >= 4) {
        actions.push("긴급복지지원 신청 검토");
        actions.push("임시일자리 병행 고려");
    }
    
    // 구직시간 부족한 경우
    if (time && time.intensity <= 2) {
        actions.push("온라인 구직활동 적극 활용");
        actions.push("단시간 근무 일자리 우선 탐색");
    }
    
    // 지방 거주자
    if (region && region.job_opportunity <= 2) {
        actions.push("광역 구직활동 고려");
        actions.push("지역일자리창출사업 확인");
    }
    
    // 전문기술 부족
    if (skills && skills.employability <= 2) {
        actions.push("직업능력개발훈련 우선 참여");
        actions.push("자격증 취득 계획 수립");
    }
    
    // 인맥 부족
    if (network && network.support <= 1) {
        actions.push("직업훈련기관 네트워킹 활용");
        actions.push("동문회, 동호회 등 인적네트워크 확대");
    }
}

// 결과 표시
function displayResult(result) {
    console.log('displayResult 호출됨:', result);
    
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultSubtitle = document.getElementById('resultSubtitle');
    
    console.log('결과 엘리먼트들:', { resultIcon, resultTitle, resultSubtitle });
    
    if (resultIcon) {
        if (result.eligibilityLevel.includes("높음")) {
            resultIcon.textContent = '✅';
        } else if (result.eligibilityLevel.includes("보통")) {
            resultIcon.textContent = '⚠️';
        } else {
            resultIcon.textContent = '❌';
        }
    }
    
    if (resultTitle) resultTitle.textContent = result.eligibilityLevel;
    if (resultSubtitle) resultSubtitle.textContent = result.recommendation;
    
    // 상세 분석 표시
    displayDetailedAnalysis(result);
}

// 상세 분석 표시
function displayDetailedAnalysis(result) {
    console.log('displayDetailedAnalysis 호출됨:', result);
    
    const eligibilityDiv = document.querySelector('.eligibility-analysis');
    const documentsDiv = document.querySelector('.required-documents');
    const processDiv = document.querySelector('.application-process');
    const tipsDiv = document.querySelector('.additional-tips');
    
    console.log('상세 분석 엘리먼트들:', { eligibilityDiv, documentsDiv, processDiv, tipsDiv });
    
    if (eligibilityDiv) {
        eligibilityDiv.innerHTML = `
            <h3>📊 수급 자격 분석</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>수급 가능성:</strong> ${result.eligibilityLevel || '분석 중'}<br>
                    <strong>퇴사 사유:</strong> ${result.reasonCategory || '미확인'}<br>
                    <strong>예상 급여액:</strong> ${result.benefitAmount || '미확인'}
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
                    <strong>예상 수급 기간:</strong> ${result.benefitPeriod || '미확인'}<br>
                    <strong>증빙 자료 수준:</strong> ${result.evidenceStrength || '미확인'}<br>
                    <strong>신청 시급성:</strong> ${result.deadline === 'expired' ? '기한 만료 위험' : result.deadline === 'urgent' ? '긴급 신청 필요' : '여유 있음'}
                </div>
            </div>
        `;
        console.log('수급 자격 분석 HTML 설정 완료');
    }
    
    if (documentsDiv) {
        documentsDiv.innerHTML = `
            <h3>📋 필요 서류 체크리스트</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #fff3e0, #ffcc02); padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>✅ 필수 서류</strong><br>
                    <small>• 이직확인서 (회사에서 발급)</small><br>
                    <small>• 신분증 (주민등록증, 운전면허증)</small><br>
                    <small>• 통장사본 (급여 입금용)</small><br>
                    <small>• 실업급여 신청서 (고용센터 작성)</small>
                </div>
                <div style="background: linear-gradient(135deg, #f3e5f5, #ba68c8); color: white; padding: 15px; border-radius: 10px;">
                    <strong>📄 추가 증빙서류 (해당시)</strong><br>
                    <small>• 의료진단서/소견서 (건강상 사유)</small><br>
                    <small>• 임금체불확인서 (체불임금 사유)</small><br>
                    <small>• 사업장 이전 증명서류</small><br>
                    <small>• 가족관계증명서 (부양가족 있는 경우)</small>
                </div>
            </div>
        `;
    }
    
    if (processDiv) {
        processDiv.innerHTML = `
            <h3>🏢 신청 절차 안내</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #e8f5e8, #4caf50); color: white; padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>Step 1: 고용센터 방문</strong><br>
                    <small>거주지 관할 고용센터 또는 마지막 근무지 관할 고용센터</small>
                </div>
                <div style="background: linear-gradient(135deg, #fff3e0, #ff9800); color: white; padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>Step 2: 상담 및 서류 제출</strong><br>
                    <small>전문상담사와 면담 후 구비서류 제출</small>
                </div>
                <div style="background: linear-gradient(135deg, #f3e5f5, #9c27b0); color: white; padding: 15px; border-radius: 10px;">
                    <strong>Step 3: 심사 및 결과 통보</strong><br>
                    <small>보통 1-2주 소요, 결과에 따라 급여 지급 시작</small>
                </div>
            </div>
        `;
    }
    
    if (tipsDiv) {
        tipsDiv.innerHTML = `
            <h3>💡 맞춤 행동 계획</h3>
            <ul style="margin: 15px 0; padding-left: 20px;">
                ${result.requiredActions.map(action => `<li style="margin: 8px 0;">${action}</li>`).join('')}
            </ul>
            <div style="background: linear-gradient(135deg, #ffebee, #ef5350); color: white; padding: 15px; border-radius: 10px; margin-top: 15px;">
                <strong>⚠️ 중요 주의사항</strong><br>
                <small>• 실업급여는 이직일로부터 12개월 이내 신청해야 합니다</small><br>
                <small>• 구직활동을 성실히 이행해야 계속 수급 가능합니다</small><br>
                <small>• 허위 신고시 급여 환수 및 법적 처벌 대상입니다</small>
            </div>
        `;
    }
}

// 카카오 공유
function shareKakao() {
    if (!Kakao.isInitialized()) {
        Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
    }
    
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '자발적 퇴사 실업급여 수급 가능성 결과',
            description: '내 퇴사 사유가 실업급여 수급 대상인지 확인했어요! 정당한 사유와 신청 방법을 알아보세요.',
            imageUrl: window.location.origin + '/실업급여/실업급여.svg',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
        },
        social: {
            likeCount: 312,
            commentCount: 67,
            sharedCount: 892,
        },
        buttons: [
            {
                title: '나도 테스트하기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
        ],
    });
}

// 테스트 재시작
function restartTest() {
    if (resultPage) resultPage.classList.add('hidden');
    if (startPage) startPage.classList.remove('hidden');
    
    currentQuestionIndex = 0;
    userAnswers = [];
    
    // 진행률 초기화
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) progressFill.style.width = '0%';
}

// 키보드 이벤트
document.addEventListener('keydown', function(e) {
    // ESC로 모달 닫기
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
        if (num >= 1 && num <= 8) {
            const options = document.querySelectorAll('.answer-option');
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
    // 광고 관리자 초기화
    window.adManager = new AdManager();
});

// 전역 함수로 노출
window.startTest = startTest;
window.restartTest = restartTest;
window.shareKakao = shareKakao;
window.showDetailedGuide = showDetailedGuide;
window.closeGuideModal = closeGuideModal;

// 상세 가이드 모달 표시
function showDetailedGuide() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) {
        guideModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // 체크리스트 이벤트 리스너 추가
        const checkboxes = guideModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    this.parentElement.style.backgroundColor = 'var(--success-color)';
                    this.parentElement.style.color = 'white';
                } else {
                    this.parentElement.style.backgroundColor = '';
                    this.parentElement.style.color = '';
                }
            });
        });
    }
}

// 상세 가이드 모달 닫기
function closeGuideModal() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) {
        guideModal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // 체크박스 초기화
        const checkboxes = guideModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.parentElement.style.backgroundColor = '';
            checkbox.parentElement.style.color = '';
        });
    }
}

// 모달 바깥 클릭 시 닫기
document.addEventListener('click', function(e) {
    const guideModal = document.getElementById('guideModal');
    if (guideModal && e.target === guideModal) {
        closeGuideModal();
    }
});

// ESC 키로 가이드 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const guideModal = document.getElementById('guideModal');
        if (guideModal && !guideModal.classList.contains('hidden')) {
            closeGuideModal();
        }
    }
});

// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
});

// 전역 함수 노출 (HTML에서 직접 호출용)
window.startTest = startTest;
window.selectAnswer = selectAnswer;
window.showDetailedGuide = showDetailedGuide;
window.closeGuideModal = closeGuideModal;
window.shareKakao = shareKakao;
window.restartTest = restartTest;

// 누락된 함수들 추가
function restartTest() {
    if (resultPage) resultPage.classList.add('hidden');
    if (startPage) startPage.classList.remove('hidden');
    
    // 초기화
    currentQuestionIndex = 0;
    userAnswers = [];
}

function showDetailedGuide() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) {
        guideModal.classList.remove('hidden');
    }
}

function closeGuideModal() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) {
        guideModal.classList.add('hidden');
    }
}