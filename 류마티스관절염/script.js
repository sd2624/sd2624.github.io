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

// 광고 관리 클래스


const questions = [
    {
        question: "관절 통증의 패턴은 어떤가요?",
        description: "🕐 통증이 나타나는 시간과 지속 정도를 알려주세요",
        answers: [
            { text: "아침에 심하고 1시간 이상 지속", pattern: "morning_stiffness", severity: 5, type: "classic_ra" },
            { text: "활동 후 악화되고 휴식 시 완화", pattern: "activity_related", severity: 3, type: "osteoarthritis" },
            { text: "밤에 심해지고 잠을 깨움", pattern: "night_pain", severity: 4, type: "inflammatory" },
            { text: "날씨 변화 시 심해짐", pattern: "weather_related", severity: 3, type: "general_arthritis" },
            { text: "지속적이고 변화 없음", pattern: "constant", severity: 4, type: "chronic" },
            { text: "간헐적이고 예측 불가", pattern: "intermittent", severity: 2, type: "mild" }
        ]
    },
    {
        question: "관절 부종의 특징은?",
        description: "🔍 붓기의 위치와 대칭성을 확인해주세요",
        answers: [
            { text: "양쪽 손목, 손가락이 대칭적으로 부음", location: "hands_symmetric", symmetry: 5, ra_score: 5 },
            { text: "한쪽만 부어있음", location: "unilateral", symmetry: 2, ra_score: 2 },
            { text: "무릎, 발목 등 큰 관절만", location: "large_joints", symmetry: 3, ra_score: 3 },
            { text: "손가락 끝마디만", location: "finger_tips", symmetry: 2, ra_score: 1 },
            { text: "부종이 없음", location: "none", symmetry: 1, ra_score: 1 },
            { text: "부종이 왔다 갔다 함", location: "intermittent", symmetry: 2, ra_score: 2 }
        ]
    },
    {
        question: "아침 강직 정도는?",
        description: "🌅 아침에 일어났을 때 관절이 뻣뻣한 정도와 지속시간",
        answers: [
            { text: "1시간 이상 지속되고 매일 발생", duration: "over_1hour", frequency: "daily", stiffness: 5 },
            { text: "30분-1시간 정도", duration: "30min_1hour", frequency: "frequent", stiffness: 4 },
            { text: "15-30분 정도", duration: "15_30min", frequency: "occasional", stiffness: 3 },
            { text: "10분 이내", duration: "under_10min", frequency: "rare", stiffness: 2 },
            { text: "아침 강직이 없음", duration: "none", frequency: "never", stiffness: 1 },
            { text: "간헐적으로 발생", duration: "variable", frequency: "intermittent", stiffness: 2 }
        ]
    },
    {
        question: "전신 증상이 있나요?",
        description: "🌡️ 관절 외 다른 증상들을 체크해주세요",
        answers: [
            { text: "피로감, 미열, 체중감소", systemic: "multiple", fatigue: 5, inflammation: 5 },
            { text: "심한 피로감만", systemic: "fatigue_only", fatigue: 4, inflammation: 3 },
            { text: "가끔 미열", systemic: "fever_only", fatigue: 2, inflammation: 4 },
            { text: "식욕부진", systemic: "appetite_loss", fatigue: 3, inflammation: 3 },
            { text: "전신 증상 없음", systemic: "none", fatigue: 1, inflammation: 1 },
            { text: "수면 장애", systemic: "sleep_disorder", fatigue: 3, inflammation: 2 }
        ]
    },
    {
        question: "가족력이나 위험요인이 있나요?",
        description: "👨‍👩‍👧‍👦 유전적 요인과 개인 특성을 알려주세요",
        answers: [
            { text: "류마티스 관절염 가족력 있음", family_history: "ra_positive", gender: "any", risk: 5 },
            { text: "여성, 40-60세", family_history: "none", gender: "female_risk_age", risk: 4 },
            { text: "자가면역질환 가족력", family_history: "autoimmune", gender: "any", risk: 4 },
            { text: "흡연력 있음", family_history: "none", gender: "smoker", risk: 3 },
            { text: "특별한 위험요인 없음", family_history: "none", gender: "low_risk", risk: 1 },
            { text: "스트레스가 많음", family_history: "none", gender: "stress", risk: 2 }
        ]
    },
    {
        question: "현재 운동 습관은?",
        description: "🏃‍♀️ 평소 신체 활동 정도를 알려주세요",
        answers: [
            { text: "규칙적으로 운동함 (주 3회 이상)", exercise: "regular", intensity: "moderate", activity: 5 },
            { text: "가끔 운동함 (주 1-2회)", exercise: "occasional", intensity: "light", activity: 3 },
            { text: "거의 운동 안 함", exercise: "rarely", intensity: "minimal", activity: 1 },
            { text: "통증 때문에 운동 중단", exercise: "stopped", intensity: "none", activity: 1 },
            { text: "가벼운 스트레칭만", exercise: "stretching_only", intensity: "light", activity: 2 },
            { text: "수중 운동 선호", exercise: "water_exercise", intensity: "moderate", activity: 4 }
        ]
    },
    {
        question: "일상생활 제한 정도는?",
        description: "🏠 관절 문제로 인한 생활의 불편함 정도",
        answers: [
            { text: "심각한 제약 (자립 어려움)", limitation: "severe", independence: 1, quality: 1 },
            { text: "중간 정도 제약 (도움 필요)", limitation: "moderate", independence: 3, quality: 3 },
            { text: "가벼운 제약 (일부 불편)", limitation: "mild", independence: 4, quality: 4 },
            { text: "거의 제약 없음", limitation: "minimal", independence: 5, quality: 5 },
            { text: "특정 동작만 어려움", limitation: "specific_tasks", independence: 4, quality: 4 },
            { text: "제약 없음", limitation: "none", independence: 5, quality: 5 }
        ]
    },
    {
        question: "관절 통증의 강도는?",
        description: "💔 현재 느끼는 통증의 정도를 평가해주세요",
        answers: [
            { text: "견딜 수 없을 정도로 심함 (9-10점)", intensity: "severe", pain_level: 10, impact: 5 },
            { text: "매우 심함 (7-8점)", intensity: "very_high", pain_level: 8, impact: 4 },
            { text: "보통 정도 (5-6점)", intensity: "moderate", pain_level: 6, impact: 3 },
            { text: "가벼움 (3-4점)", intensity: "mild", pain_level: 4, impact: 2 },
            { text: "매우 가벼움 (1-2점)", intensity: "minimal", pain_level: 2, impact: 1 },
            { text: "통증 없음 (0점)", intensity: "none", pain_level: 0, impact: 0 }
        ]
    },
    {
        question: "관절의 열감이나 발적이 있나요?",
        description: "🔥 관절 주변의 열감과 붉어짐을 확인해주세요",
        answers: [
            { text: "여러 관절에 심한 열감과 발적", inflammation: "multiple_severe", heat: 5, redness: 5 },
            { text: "한두 관절에 뚜렷한 열감", inflammation: "few_moderate", heat: 4, redness: 3 },
            { text: "가끔 미미한 열감", inflammation: "occasional_mild", heat: 2, redness: 2 },
            { text: "열감은 있으나 발적 없음", inflammation: "heat_only", heat: 3, redness: 1 },
            { text: "발적만 있고 열감 없음", inflammation: "redness_only", heat: 1, redness: 3 },
            { text: "열감이나 발적 없음", inflammation: "none", heat: 0, redness: 0 }
        ]
    },
    {
        question: "손목과 손가락의 변형이 있나요?",
        description: "✋ 관절의 모양 변화를 확인해주세요",
        answers: [
            { text: "심한 변형으로 기능 저하", deformity: "severe", function: 1, progression: 5 },
            { text: "중간 정도 변형 있음", deformity: "moderate", function: 3, progression: 4 },
            { text: "경미한 변형 시작", deformity: "mild", function: 4, progression: 3 },
            { text: "변형은 없으나 부기만", deformity: "swelling_only", function: 4, progression: 2 },
            { text: "변형 없음", deformity: "none", function: 5, progression: 1 },
            { text: "잘 모르겠음", deformity: "uncertain", function: 3, progression: 2 }
        ]
    },
    {
        question: "류마티스 결절이 있나요?",
        description: "🔍 팔꿈치나 손등에 작은 혹 같은 것이 있는지 확인",
        answers: [
            { text: "여러 곳에 뚜렷한 결절", nodules: "multiple", location: "various", ra_specific: 5 },
            { text: "팔꿈치에 결절 있음", nodules: "elbow", location: "elbow", ra_specific: 4 },
            { text: "손등이나 손가락에 있음", nodules: "hands", location: "hands", ra_specific: 4 },
            { text: "작고 눈에 잘 안 띄는 것 같음", nodules: "small", location: "unclear", ra_specific: 2 },
            { text: "결절 없음", nodules: "none", location: "none", ra_specific: 0 },
            { text: "다른 부위의 덩어리 있음", nodules: "other", location: "other", ra_specific: 1 }
        ]
    },
    {
        question: "혈액검사를 받아본 적이 있나요?",
        description: "🩸 류마티스 인자나 염증 수치 검사 결과",
        answers: [
            { text: "류마티스 인자 양성", blood_test: "rf_positive", inflammation: "high", diagnosis: 5 },
            { text: "염증 수치 높음 (ESR, CRP)", blood_test: "inflammation_high", inflammation: "high", diagnosis: 4 },
            { text: "모든 검사 정상", blood_test: "normal", inflammation: "normal", diagnosis: 1 },
            { text: "검사 받지 않음", blood_test: "not_done", inflammation: "unknown", diagnosis: 2 },
            { text: "일부 수치만 비정상", blood_test: "partial_abnormal", inflammation: "mild", diagnosis: 3 },
            { text: "결과를 모름", blood_test: "unknown_result", inflammation: "unknown", diagnosis: 2 }
        ]
    },
    {
        question: "증상 시작 시기는?",
        description: "📅 관절 증상이 언제부터 시작되었나요?",
        answers: [
            { text: "6개월 이상 전부터", onset: "chronic", duration: "over_6months", severity: 5 },
            { text: "3-6개월 전부터", onset: "subacute", duration: "3_6months", severity: 4 },
            { text: "1-3개월 전부터", onset: "recent", duration: "1_3months", severity: 3 },
            { text: "몇 주 전부터", onset: "acute", duration: "weeks", severity: 2 },
            { text: "며칠 전부터", onset: "very_recent", duration: "days", severity: 1 },
            { text: "정확히 기억 안 남", onset: "unclear", duration: "unknown", severity: 3 }
        ]
    },
    {
        question: "약물 치료 경험이 있나요?",
        description: "💊 관절염을 위해 복용 중이거나 복용했던 약물",
        answers: [
            { text: "메토트렉세이트 등 항류마티스약", medication: "dmards", effectiveness: "specialized", treatment: 5 },
            { text: "스테로이드 복용 중", medication: "steroids", effectiveness: "high", treatment: 4 },
            { text: "일반 진통소염제만", medication: "nsaids", effectiveness: "moderate", treatment: 3 },
            { text: "약물 치료 받지 않음", medication: "none", effectiveness: "none", treatment: 1 },
            { text: "한약이나 건강보조식품", medication: "alternative", effectiveness: "low", treatment: 2 },
            { text: "진통제 효과 없음", medication: "ineffective", effectiveness: "poor", treatment: 2 }
        ]
    },
    {
        question: "관절 외 다른 부위 증상은?",
        description: "👁️ 눈, 피부, 폐 등 다른 장기의 증상",
        answers: [
            { text: "안구건조, 구강건조 심함", extra_articular: "sicca_syndrome", organs: "eyes_mouth", autoimmune: 5 },
            { text: "피부 발진이나 결절", extra_articular: "skin_lesions", organs: "skin", autoimmune: 4 },
            { text: "호흡곤란이나 기침", extra_articular: "lung_symptoms", organs: "lungs", autoimmune: 4 },
            { text: "심장 두근거림", extra_articular: "heart_symptoms", organs: "heart", autoimmune: 3 },
            { text: "관절 외 증상 없음", extra_articular: "none", organs: "none", autoimmune: 1 },
            { text: "기타 증상 있음", extra_articular: "other", organs: "other", autoimmune: 2 }
        ]
    },
    {
        question: "현재 스트레스 수준은?",
        description: "😰 일상생활에서 느끼는 스트레스 정도",
        answers: [
            { text: "매우 높음 (수면장애, 불안)", stress: "very_high", impact: "severe", mental_health: 5 },
            { text: "높음 (자주 짜증, 피로)", stress: "high", impact: "moderate", mental_health: 4 },
            { text: "보통 수준", stress: "moderate", impact: "mild", mental_health: 3 },
            { text: "낮음", stress: "low", impact: "minimal", mental_health: 2 },
            { text: "거의 없음", stress: "minimal", impact: "none", mental_health: 1 },
            { text: "스트레스 관리 잘 됨", stress: "managed", impact: "controlled", mental_health: 1 }
        ]
    },
    {
        question: "식이 습관은 어떤가요?",
        description: "🍎 평소 식사 패턴과 영양 상태",
        answers: [
            { text: "항염 식품 위주로 섭취", diet: "anti_inflammatory", nutrition: "excellent", health: 5 },
            { text: "균형 잡힌 식사", diet: "balanced", nutrition: "good", health: 4 },
            { text: "일반적인 식사", diet: "regular", nutrition: "average", health: 3 },
            { text: "가공식품을 자주 섭취", diet: "processed", nutrition: "poor", health: 2 },
            { text: "불규칙한 식사", diet: "irregular", nutrition: "poor", health: 2 },
            { text: "식욕부진으로 잘 못 먹음", diet: "poor_appetite", nutrition: "inadequate", health: 1 }
        ]
    },
    {
        question: "수면의 질은?",
        description: "😴 밤에 잠을 잘 자는지 확인해주세요",
        answers: [
            { text: "통증 때문에 자주 깸", sleep: "pain_interrupted", quality: "poor", rest: 1 },
            { text: "잠들기 어려움", sleep: "difficulty_falling", quality: "poor", rest: 2 },
            { text: "자주 깨지만 다시 잠듦", sleep: "frequent_waking", quality: "fair", rest: 3 },
            { text: "보통 수준", sleep: "average", quality: "fair", rest: 3 },
            { text: "잘 잠", sleep: "good", quality: "good", rest: 4 },
            { text: "매우 깊게 잠", sleep: "excellent", quality: "excellent", rest: 5 }
        ]
    },
    {
        question: "관절 보호를 위한 노력은?",
        description: "🛡️ 관절 건강을 위해 실천하는 것들",
        answers: [
            { text: "물리치료, 보조기구 사용", protection: "comprehensive", care: "excellent", prevention: 5 },
            { text: "규칙적인 스트레칭과 운동", protection: "exercise_focused", care: "good", prevention: 4 },
            { text: "가끔 온찜질이나 마사지", protection: "occasional", care: "fair", prevention: 3 },
            { text: "무리하지 않으려 노력", protection: "activity_modification", care: "fair", prevention: 3 },
            { text: "특별한 노력 안 함", protection: "none", care: "poor", prevention: 1 },
            { text: "잘못된 방법 사용", protection: "inappropriate", care: "poor", prevention: 1 }
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

// 테스트 시작
function startTest() {
    if (startPage) startPage.classList.add('hidden');
    if (questionPage) questionPage.classList.remove('hidden');
    
    // 헤더 광고 표시
    adManager.loadAd('ad-header');
    
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
    
    // 3번째 질문 이후 중간 광고 표시
    if (currentQuestionIndex >= 2) {
        adManager.loadAd('ad-middle');
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
    
    // 분석 단계 애니메이션
    const steps = document.querySelectorAll('.step-item');
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('active');
            const check = step.querySelector('.step-check');
            if (check && index < 4) {
                check.textContent = '✓';
                check.style.color = '#27ae60';
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
    
    // 결과 페이지 광고 표시
    adManager.loadAd('ad-result');
    
    const result = analyzeAnswers();
    displayResult(result);
}

// 답변 분석
function analyzeAnswers() {
    console.log('analyzeAnswers 호출됨. 전체 답변:', userAnswers);
    
    // 20개 질문 답변 추출
    const painPattern = userAnswers[0] || {};        // 관절 통증 패턴
    const swelling = userAnswers[1] || {};           // 관절 부종
    const stiffness = userAnswers[2] || {};          // 아침 강직
    const systemic = userAnswers[3] || {};           // 전신 증상
    const riskFactors = userAnswers[4] || {};        // 가족력/위험요인
    const exercise = userAnswers[5] || {};           // 운동 습관
    const dailyLife = userAnswers[6] || {};          // 일상생활 제한
    const painIntensity = userAnswers[7] || {};      // 통증 강도
    const inflammation = userAnswers[8] || {};        // 열감/발적
    const deformity = userAnswers[9] || {};          // 관절 변형
    const nodules = userAnswers[10] || {};           // 류마티스 결절
    const bloodTest = userAnswers[11] || {};         // 혈액검사
    const symptomOnset = userAnswers[12] || {};      // 증상 시작 시기
    const medication = userAnswers[13] || {};        // 약물 치료
    const extraSymptoms = userAnswers[14] || {};     // 관절 외 증상
    const stress = userAnswers[15] || {};            // 스트레스
    const diet = userAnswers[16] || {};              // 식이 습관
    const sleep = userAnswers[17] || {};             // 수면의 질
    const protection = userAnswers[18] || {};        // 관절 보호 노력
    
    // RA 가능성 점수 계산 (더 정밀한 계산)
    let raScore = 0;
    let inflammationScore = 0;
    let functionalScore = 0;
    let managementScore = 0;
    
    // 핵심 RA 증상 점수 (가중치 적용)
    raScore += (painPattern.severity || 0) * 1.5;        // 통증 패턴 (중요)
    raScore += (swelling.ra_score || 0) * 2;             // 대칭적 부종 (매우 중요)
    raScore += (stiffness.stiffness || 0) * 1.8;         // 아침 강직 (매우 중요)
    raScore += (nodules.ra_specific || 0) * 1.5;         // 류마티스 결절
    raScore += (bloodTest.diagnosis || 0) * 2.2;         // 혈액검사 (매우 중요)
    raScore += (deformity.progression || 0) * 1.3;       // 관절 변형
    
    // 염증 점수
    inflammationScore += (systemic.inflammation || 0);
    inflammationScore += (inflammation.heat || 0);
    inflammationScore += (inflammation.redness || 0);
    inflammationScore += (extraSymptoms.autoimmune || 0);
    
    // 기능적 점수 (일상생활 영향)
    functionalScore += (6 - (dailyLife.independence || 5));  // 역산
    functionalScore += (painIntensity.impact || 0);
    functionalScore += (sleep.rest === undefined ? 3 : (6 - sleep.rest));  // 역산
    
    // 관리 점수 (생활습관 및 치료)
    managementScore += (exercise.activity || 0);
    managementScore += (protection.prevention || 0);
    managementScore += (diet.health || 0);
    managementScore += (medication.treatment || 0);
    managementScore -= (stress.mental_health || 0);  // 스트레스는 감점
    
    // 총 점수 계산 (100점 만점으로 정규화)
    const totalScore = Math.min(100, Math.round(
        (raScore * 0.4 + inflammationScore * 0.3 + functionalScore * 0.2 + Math.max(0, managementScore) * 0.1)
    ));
    
    // 위험도 판정 및 추천사항
    let riskLevel = "";
    let recommendation = "";
    let treatmentPlan = [];
    let exercisePlan = [];
    let urgency = "";
    
    console.log('점수 계산:', { raScore, inflammationScore, functionalScore, managementScore, totalScore });
    
    if (totalScore >= 75 || (raScore >= 15 && inflammationScore >= 12)) {
        riskLevel = "류마티스 관절염 고위험 (80-100%)";
        recommendation = "즉시 류마티스 내과 전문의 진료가 필요합니다";
        urgency = "응급";
        treatmentPlan.push("혈액검사: RF, Anti-CCP, ESR, CRP");
        treatmentPlan.push("관절 X-ray 및 초음파 검사");
        treatmentPlan.push("조기 DMARD 치료 시작 고려");
        treatmentPlan.push("생물학적 제제 치료 검토");
        exercisePlan.push("급성기: 관절 휴식 및 보호");
        exercisePlan.push("염증 완화 후 수중 운동");
        exercisePlan.push("물리치료사 지도하 관절가동운동");
        
    } else if (totalScore >= 55 || (raScore >= 10 && inflammationScore >= 8)) {
        riskLevel = "관절염 중위험 (50-80%)";
        recommendation = "류마티스 내과 전문의 상담을 권장합니다";
        urgency = "주의";
        treatmentPlan.push("류마티스 내과 전문의 상담");
        treatmentPlan.push("기본 혈액검사 및 관절 영상검사");
        treatmentPlan.push("항염증 치료 시작");
        treatmentPlan.push("정기적인 모니터링");
        exercisePlan.push("저강도 유산소 운동 (걷기, 수영)");
        exercisePlan.push("관절 가동범위 운동");
        exercisePlan.push("근력강화 운동 (등장성)");
        
    } else if (totalScore >= 35 || raScore >= 6) {
        riskLevel = "관절염 경계선 (30-50%)";
        recommendation = "관절 건강 관리 및 추적 관찰이 필요합니다";
        urgency = "관찰";
        treatmentPlan.push("정형외과 또는 류마티스내과 상담");
        treatmentPlan.push("기본 건강검진 및 염증 수치 확인");
        treatmentPlan.push("생활습관 개선");
        treatmentPlan.push("3-6개월 후 재평가");
        exercisePlan.push("규칙적인 유산소 운동");
        exercisePlan.push("스트레칭 및 요가");
        exercisePlan.push("체중 관리");
        
    } else {
        riskLevel = "관절염 저위험 (30% 미만)";
        recommendation = "현재 상태 유지 및 예방 관리가 중요합니다";
        urgency = "예방";
        treatmentPlan.push("건강한 생활습관 유지");
        treatmentPlan.push("정기 건강검진");
        treatmentPlan.push("관절 건강 교육");
        treatmentPlan.push("연 1회 관절 상태 점검");
        exercisePlan.push("다양한 운동 (유산소, 근력, 유연성)");
        exercisePlan.push("관절에 무리가 안 가는 스포츠");
        exercisePlan.push("균형감각 및 coordination 운동");
    }
    
    // 개별 맞춤 조언 추가
    const personalizedAdvice = [];
    
    // 통증 관리
    if (painIntensity.pain_level >= 7) {
        personalizedAdvice.push("심한 통증 관리: 냉온찜질, 적절한 진통제 사용");
    }
    
    // 수면 관리
    if (sleep.quality === "poor") {
        personalizedAdvice.push("수면 개선: 취침 전 스트레칭, 침실 환경 개선");
    }
    
    // 스트레스 관리
    if (stress.impact === "severe" || stress.impact === "moderate") {
        personalizedAdvice.push("스트레스 관리: 명상, 호흡법, 전문 상담 고려");
    }
    
    // 식이 조언
    if (diet.nutrition === "poor" || diet.nutrition === "inadequate") {
        personalizedAdvice.push("항염 식품 섭취: 오메가-3, 항산화 식품 증가");
    }
    
    // 운동 조언
    if (exercise.activity <= 2) {
        personalizedAdvice.push("점진적 운동 시작: 관절에 무리 없는 활동부터");
    }
    
    return {
        riskLevel,
        recommendation,
        treatmentPlan,
        exercisePlan,
        personalizedAdvice,
        urgency,
        totalScore,
        raScore: Math.round(raScore),
        inflammationScore,
        functionalScore,
        managementScore,
        symptomDuration: symptomOnset.duration || "unknown",
        medicationResponse: medication.effectiveness || "unknown",
        hasSystemicSymptoms: extraSymptoms.autoimmune >= 3
    };
}

// 결과 표시
function displayResult(result) {
    console.log('displayResult 호출됨:', result);
    
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultSubtitle = document.getElementById('resultSubtitle');
    
    if (resultIcon) {
        if (result.urgency === "응급") {
            resultIcon.textContent = '🚨';
        } else if (result.urgency === "주의") {
            resultIcon.textContent = '⚠️';
        } else if (result.urgency === "관찰") {
            resultIcon.textContent = '🔍';
        } else {
            resultIcon.textContent = '✅';
        }
    }
    
    if (resultTitle) resultTitle.textContent = result.riskLevel;
    if (resultSubtitle) resultSubtitle.textContent = result.recommendation;
    
    displayDetailedAnalysis(result);
}

// 상세 분석 표시
function displayDetailedAnalysis(result) {
    console.log('displayDetailedAnalysis 호출됨:', result);
    
    const symptomDiv = document.querySelector('.symptom-analysis');
    const treatmentDiv = document.querySelector('.treatment-options');
    const exerciseDiv = document.querySelector('.exercise-program');
    const managementDiv = document.querySelector('.management-plan');
    
    if (symptomDiv) {
        symptomDiv.innerHTML = `
            <h3>📊 상세 분석 결과</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>총 위험도 점수:</strong> ${result.totalScore}/100점<br>
                    <strong>RA 특이점수:</strong> ${result.raScore}점<br>
                    <strong>염증 점수:</strong> ${result.inflammationScore}점<br>
                    <strong>기능장애 점수:</strong> ${result.functionalScore}점
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
                    <strong>증상 지속기간:</strong> ${getSymptomDurationText(result.symptomDuration)}<br>
                    <strong>약물 반응:</strong> ${getMedicationResponseText(result.medicationResponse)}<br>
                    <strong>전신 증상:</strong> ${result.hasSystemicSymptoms ? '있음' : '없음'}
                </div>
            </div>
        `;
    }
    
    if (treatmentDiv) {
        treatmentDiv.innerHTML = `
            <h3>🏥 추천 치료 계획</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #fff3e0, #ffcc02); padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>🚨 긴급도: ${result.urgency}</strong>
                </div>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    ${result.treatmentPlan.map(plan => `<li style="margin: 8px 0;">${plan}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (exerciseDiv) {
        exerciseDiv.innerHTML = `
            <h3>🏃‍♀️ 맞춤 운동 프로그램</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #e8f5e8, #4caf50); color: white; padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>추천 운동 계획</strong>
                </div>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    ${result.exercisePlan.map(exercise => `<li style="margin: 8px 0;">${exercise}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (managementDiv) {
        managementDiv.innerHTML = `
            <h3>💡 개인 맞춤 관리법</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #f3e5f5, #ba68c8); color: white; padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>맞춤형 생활 관리 조언</strong>
                </div>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    ${result.personalizedAdvice.map(advice => `<li style="margin: 8px 0;">${advice}</li>`).join('')}
                </ul>
                <div style="background: linear-gradient(135deg, #ffebee, #ef5350); color: white; padding: 15px; border-radius: 10px; margin-top: 15px;">
                    <strong>⚠️ 주의사항</strong><br>
                    <small>• 이 결과는 참고용이며 정확한 진단은 의료진과 상담하세요</small><br>
                    <small>• 증상이 악화되거나 새로운 증상이 나타나면 즉시 병원 방문</small><br>
                    <small>• 정기적인 추적 관찰과 전문의 진료가 중요합니다</small>
                </div>
            </div>
        `;
    }
}

// 보조 함수들
function getSymptomDurationText(duration) {
    const durationMap = {
        "over_6months": "6개월 이상",
        "3_6months": "3-6개월",
        "1_3months": "1-3개월", 
        "weeks": "수 주",
        "days": "수 일",
        "unknown": "불명확"
    };
    return durationMap[duration] || "알 수 없음";
}

function getMedicationResponseText(response) {
    const responseMap = {
        "specialized": "전문 약물 사용 중",
        "high": "좋은 반응",
        "moderate": "보통 반응",
        "poor": "효과 미미",
        "none": "약물 치료 안 함",
        "unknown": "알 수 없음"
    };
    return responseMap[response] || "정보 없음";
}

// 카카오 공유
function shareKakao() {
    if (!Kakao.isInitialized()) {
        Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
    }
    
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '류마티스 관절염 종합 진단 결과',
            description: '나의 관절 건강 상태와 맞춤형 관리법을 확인했어요! 증상부터 운동법까지 완전 가이드를 받아보세요.',
            imageUrl: window.location.origin + '/류마티스관절염/류마티스관절염.svg',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
        },
        social: {
            likeCount: 428,
            commentCount: 89,
            sharedCount: 1247,
        },
        buttons: [
            {
                title: '나도 진단받기',
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
    
    // 광고 숨기기
    adManager.hideAllAds();
    
    currentQuestionIndex = 0;
    userAnswers = [];
    
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) progressFill.style.width = '0%';
}

// 상세 가이드 모달 표시
function showDetailedGuide() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) {
        guideModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        const checkboxes = guideModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    this.parentElement.style.backgroundColor = '#e8f5e8';
                    this.parentElement.style.color = '#2d5016';
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
        
        const checkboxes = guideModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.parentElement.style.backgroundColor = '';
            checkbox.parentElement.style.color = '';
        });
    }
}

// 키보드 이벤트
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const guideModal = document.getElementById('guideModal');
        const analysisModal = document.getElementById('analysisModal');
        
        if (guideModal && !guideModal.classList.contains('hidden')) {
            closeGuideModal();
        } else if (analysisModal && !analysisModal.classList.contains('hidden')) {
            analysisModal.classList.add('hidden');
            if (questionPage) questionPage.classList.remove('hidden');
        }
    }
    
    if (questionPage && !questionPage.classList.contains('hidden')) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 6) {
            const options = document.querySelectorAll('.answer-option');
            if (options[num - 1]) {
                options[num - 1].click();
            }
        }
    }
});

// 모달 바깥 클릭 시 닫기
document.addEventListener('click', function(e) {
    const guideModal = document.getElementById('guideModal');
    if (guideModal && e.target === guideModal) {
        closeGuideModal();
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

// 전역 함수로 노출
window.startTest = startTest;
window.restartTest = restartTest;
window.shareKakao = shareKakao;
window.showDetailedGuide = showDetailedGuide;
window.closeGuideModal = closeGuideModal;

// 누락된 함수들 추가
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

function closeGuideModal() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) {
        guideModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
});