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

// 광고 관리 클래스 - 새로 추가


Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 데이터
const questions = [
    {
        question: "사고가 발생한 장소는 어디인가요?",
        description: "📍 사고 장소에 따라 과실비율과 처리 방법이 달라집니다",
        answers: [
            { text: "아파트 단지 내 주차장", location: "apt_parking", liability_factor: 1.2, difficulty: "medium" },
            { text: "대형마트/백화점 주차장", location: "mall_parking", liability_factor: 1.0, difficulty: "easy" },
            { text: "도로변 주차구역", location: "street_parking", liability_factor: 1.5, difficulty: "hard" },
            { text: "지하주차장", location: "underground", liability_factor: 1.1, difficulty: "medium" },
            { text: "회사 주차장", location: "office_parking", liability_factor: 1.0, difficulty: "easy" }
        ]
    },
    {
        question: "상대방 차량의 상태는 어떠했나요?",
        description: "🚗 상대방 차량의 상태가 과실비율에 중요한 영향을 미칩니다",
        answers: [
            { text: "정상적으로 주차되어 있었음", parking_status: "normal", fault_ratio: 0, responsibility: "low" },
            { text: "주차선을 벗어나 있었음", parking_status: "over_line", fault_ratio: 30, responsibility: "medium" },
            { text: "불법 주정차 상태였음", parking_status: "illegal", fault_ratio: 50, responsibility: "high" },
            { text: "차량이 움직이고 있었음", parking_status: "moving", fault_ratio: 70, responsibility: "shared" },
            { text: "문이 열려있거나 사람이 타고 있었음", parking_status: "occupied", fault_ratio: 40, responsibility: "medium" }
        ]
    },
    {
        question: "나의 운전 상황은 어땠나요?",
        description: "🚙 본인의 운전 상황도 과실비율 결정에 중요합니다",
        answers: [
            { text: "천천히 주차하려고 했음", driving_status: "parking", my_fault: 20, speed_factor: 0.8 },
            { text: "주차장에서 천천히 이동 중이었음", driving_status: "slow_moving", my_fault: 30, speed_factor: 0.9 },
            { text: "일반 속도로 이동 중이었음", driving_status: "normal_speed", my_fault: 50, speed_factor: 1.2 },
            { text: "후진 중이었음", driving_status: "reversing", my_fault: 60, speed_factor: 1.5 },
            { text: "급하게 이동하고 있었음", driving_status: "hurrying", my_fault: 80, speed_factor: 2.0 }
        ]
    },
    {
        question: "접촉 부위는 어디인가요?",
        description: "🎯 접촉 부위에 따라 사고 상황과 과실이 판단됩니다",
        answers: [
            { text: "상대방 차량 옆면", contact_area: "side", damage_type: "scratch", severity: "minor" },
            { text: "상대방 차량 앞/뒤 범퍼", contact_area: "bumper", damage_type: "dent", severity: "medium" },
            { text: "상대방 차량 문짝", contact_area: "door", damage_type: "dent", severity: "medium" },
            { text: "상대방 차량 휠/타이어", contact_area: "wheel", damage_type: "scratch", severity: "minor" },
            { text: "여러 부위 손상", contact_area: "multiple", damage_type: "multiple", severity: "major" }
        ]
    },
    {
        question: "사고 당시 목격자가 있었나요?",
        description: "👥 목격자의 존재는 사고 처리에 큰 도움이 됩니다",
        answers: [
            { text: "목격자가 있고 연락처도 확보했음", witness: "available", evidence_strength: 5, processing_ease: "very_easy" },
            { text: "목격자는 있었지만 연락처 없음", witness: "present", evidence_strength: 3, processing_ease: "medium" },
            { text: "CCTV가 있는 것을 확인했음", witness: "cctv", evidence_strength: 4, processing_ease: "easy" },
            { text: "목격자도 CCTV도 없음", witness: "none", evidence_strength: 1, processing_ease: "difficult" },
            { text: "확인하지 못했음", witness: "unknown", evidence_strength: 2, processing_ease: "medium" }
        ]
    },
    {
        question: "현재 어떤 보험에 가입되어 있나요?",
        description: "🛡️ 가입한 보험 종류에 따라 처리 방법이 달라집니다",
        answers: [
            { text: "종합보험 (대인+대물+차량)", insurance_type: "comprehensive", coverage_level: 5, deductible: "low" },
            { text: "대인+대물보험만", insurance_type: "liability", coverage_level: 3, deductible: "none" },
            { text: "운전자보험도 가입", insurance_type: "plus_driver", coverage_level: 4, deductible: "medium" },
            { text: "잘 모르겠음", insurance_type: "unknown", coverage_level: 2, deductible: "unknown" },
            { text: "보험 미가입", insurance_type: "none", coverage_level: 0, deductible: "full" }
        ]
    },
    {
        question: "피해 규모는 어느 정도인가요?",
        description: "💰 피해 규모에 따라 처리 절차와 방법이 결정됩니다",
        answers: [
            { text: "경미한 흠집 (10만원 이하)", damage_cost: "minor", estimated_cost: 50000, process_type: "simple" },
            { text: "중간 정도 손상 (10-50만원)", damage_cost: "medium", estimated_cost: 200000, process_type: "normal" },
            { text: "심한 손상 (50-100만원)", damage_cost: "major", estimated_cost: 700000, process_type: "complex" },
            { text: "매우 심한 손상 (100만원 이상)", damage_cost: "severe", estimated_cost: 1500000, process_type: "expert" },
            { text: "정확히 모르겠음", damage_cost: "unknown", estimated_cost: 300000, process_type: "assessment" }
        ]
    }
];

// 결과 타입 정의
const resultTypes = {
    "본인과실높음": {
        title: "⚠️ 본인 과실 비중이 높은 상황",
        subtitle: "과실비율 70-100%, 적극적인 합의 추진 필요",
        badge: "🚨",
        bgColor: "linear-gradient(45deg, #e53e3e, #c53030)",
        description: "본인 측 과실이 높아 상대방과의 원만한 합의가 중요합니다.",
        category: "본인과실높음"
    },
    "과실반반": {
        title: "⚖️ 쌍방 과실 상황",
        subtitle: "과실비율 40-60%, 객관적 증거 확보 중요",
        badge: "⚡",
        bgColor: "linear-gradient(45deg, #d69e2e, #b7791f)",
        description: "양측 모두 과실이 있어 정확한 사실관계 확인이 필요합니다.",
        category: "과실반반"
    },
    "상대과실높음": {
        title: "✅ 상대방 과실 비중이 높은 상황",
        subtitle: "과실비율 70-100%, 적극적인 손해배상 청구 가능",
        badge: "💪",
        bgColor: "linear-gradient(45deg, #38a169, #2f855a)",
        description: "상대방 과실이 높아 적극적인 배상 청구가 가능한 상황입니다.",
        category: "상대과실높음"
    },
    "단순처리": {
        title: "📋 단순 처리 가능 상황",
        subtitle: "경미한 사고, 신속한 보험 처리 가능",
        badge: "⚡",
        bgColor: "linear-gradient(45deg, #3182ce, #2c5282)",
        description: "경미한 사고로 간단한 보험 처리가 가능한 상황입니다.",
        category: "단순처리"
    }
};

// 보험사 연락처 정보
const insuranceContacts = {
    comprehensive: [
        { name: "삼성화재", phone: "1588-5114", feature: "24시간 접수" },
        { name: "현대해상", phone: "1588-5656", feature: "모바일 접수" },
        { name: "DB손해보험", phone: "1588-0100", feature: "원스톱 서비스" },
        { name: "메리츠화재", phone: "1566-7711", feature: "신속 처리" }
    ],
    liability: [
        { name: "삼성화재", phone: "1588-5114", feature: "대물 전담" },
        { name: "현대해상", phone: "1588-5656", feature: "사고 접수" },
        { name: "KB손해보험", phone: "1544-0114", feature: "빠른 처리" }
    ],
    plus_driver: [
        { name: "운전자보험 고객센터", phone: "1588-0000", feature: "운전자보험 전담" },
        { name: "자동차보험 고객센터", phone: "1588-1111", feature: "종합 상담" }
    ],
    unknown: [
        { name: "보험개발원", phone: "1588-3570", feature: "보험 조회" },
        { name: "자동차보험 통합콜센터", phone: "1588-9999", feature: "종합 안내" }
    ]
};

let currentQuestionIndex = 0;
let userAnswers = [];
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
    analysisData = {};
    
    if (startPage) startPage.classList.add('hidden');
    if (questionPage) questionPage.classList.remove('hidden');
    
    showQuestion();
}

// 질문 표시 함수
function showQuestion() {
    const progressFill = document.querySelector('.progress-fill');
    const currentNum = document.querySelector('.current-num');
    const totalNum = document.querySelector('.total-num');
    const questionTitle = document.querySelector('.question-title');
    const questionDesc = document.querySelector('.question-desc');
    const answersGrid = document.querySelector('.answers-grid');
    
    // 진행률 업데이트
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    if (progressFill) progressFill.style.width = progress + '%';
    if (currentNum) currentNum.textContent = currentQuestionIndex + 1;
    if (totalNum) totalNum.textContent = '/ ' + questions.length;
    
    // 질문과 옵션 표시
    const currentQuestion = questions[currentQuestionIndex];
    if (questionTitle) questionTitle.textContent = currentQuestion.question;
    if (questionDesc) questionDesc.textContent = currentQuestion.description;
    
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
    userAnswers[currentQuestionIndex] = answer;
    
    // 시각적 피드백
    const options = document.querySelectorAll('.answer-option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    
    // 3번째 질문 완료 후 중간 광고 표시 - 새로 추가
    if (currentQuestionIndex === 2) {
        showMidAd();
    }
    
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

// 중간 광고 표시 함수 - 새로 추가
function showMidAd() {
    const midAd = document.querySelector('.ad-container.mid');
    if (midAd) {
        adManager.loadAd(midAd);
    }
}

// 결과 광고 표시 함수 - 새로 추가
function showResultAd() {
    const resultAd = document.querySelector('.ad-container.result');
    if (resultAd) {
        adManager.loadAd(resultAd);
    }
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
                check.style.color = '#38a169';
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
            analyzeFaultRatio();
            showResults();
        }
    }, 1000);
}

// 과실비율 분석 함수
function analyzeFaultRatio() {
    let totalFaultScore = 0;
    let severityScore = 0;
    let complexityScore = 0;
    let evidenceScore = 0;
    
    userAnswers.forEach(answer => {
        // 과실 점수 계산
        if (answer.fault_ratio !== undefined) totalFaultScore += answer.fault_ratio;
        if (answer.my_fault !== undefined) totalFaultScore += answer.my_fault;
        
        // 심각도 점수
        if (answer.estimated_cost) severityScore += answer.estimated_cost / 100000;
        if (answer.severity === "major") severityScore += 3;
        else if (answer.severity === "medium") severityScore += 2;
        else if (answer.severity === "minor") severityScore += 1;
        
        // 복잡도 점수
        if (answer.difficulty === "hard") complexityScore += 3;
        else if (answer.difficulty === "medium") complexityScore += 2;
        else if (answer.difficulty === "easy") complexityScore += 1;
        
        // 증거 점수
        if (answer.evidence_strength) evidenceScore += answer.evidence_strength;
    });
    
    // 결과 타입 결정
    let resultType;
    if (totalFaultScore >= 120 || userAnswers.some(a => a.my_fault >= 80)) {
        resultType = "본인과실높음";
    } else if (totalFaultScore <= 40 || userAnswers.some(a => a.fault_ratio >= 70)) {
        resultType = "상대과실높음";
    } else if (severityScore <= 2 && complexityScore <= 5) {
        resultType = "단순처리";
    } else {
        resultType = "과실반반";
    }
    
    analysisData = {
        resultType: resultType,
        faultScore: totalFaultScore,
        severityScore: severityScore,
        complexityScore: complexityScore,
        evidenceScore: evidenceScore,
        estimatedFaultRatio: Math.min(Math.max(totalFaultScore, 0), 100)
    };
}

// 결과 표시 함수
function showResults() {
    if (analysisModal) analysisModal.classList.add('hidden');
    if (resultPage) resultPage.classList.remove('hidden');
    
    // 결과 광고 표시 - 새로 추가
    showResultAd();
    
    const result = resultTypes[analysisData.resultType];
    
    // 결과 헤더 업데이트
    const resultIcon = document.querySelector('.result-icon');
    const resultTitle = document.querySelector('.result-title');
    const resultSummary = document.querySelector('.result-summary');
    
    if (resultIcon) {
        resultIcon.style.background = result.bgColor;
        resultIcon.innerHTML = `<div style="font-size: 1.8em;">${result.badge}</div>`;
    }
    
    if (resultTitle) resultTitle.textContent = result.title;
    if (resultSummary) resultSummary.textContent = result.subtitle;
    
    // 결과 내용 업데이트
    updateResultContent();
}

// 결과 내용 업데이트
function updateResultContent() {
    const faultAnalysis = document.querySelector('.fault-analysis');
    const processSteps = document.querySelector('.process-steps');
    const requiredDocuments = document.querySelector('.required-documents');
    const insuranceContactsDiv = document.querySelector('.insurance-contacts');
    
    const result = resultTypes[analysisData.resultType];
    
    // 과실 분석
    if (faultAnalysis) {
        faultAnalysis.innerHTML = `
            <h4 style="color: #1a365d; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                ⚖️ 과실비율 분석 결과
            </h4>
            <div style="background: rgba(26, 54, 93, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h5 style="color: #1a365d; margin-bottom: 12px;">예상 과실비율: ${analysisData.estimatedFaultRatio}%</h5>
                <p style="color: #4a5568; line-height: 1.6; margin: 0;">${result.description}</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px;">
                <div style="text-align: center; padding: 16px; background: rgba(229, 62, 62, 0.1); border-radius: 12px;">
                    <div style="font-size: 1.5em; color: #e53e3e; font-weight: bold; margin-bottom: 4px;">${analysisData.faultScore}</div>
                    <div style="font-size: 0.9em; color: #6b7280;">과실 점수</div>
                </div>
                <div style="text-align: center; padding: 16px; background: rgba(214, 158, 46, 0.1); border-radius: 12px;">
                    <div style="font-size: 1.5em; color: #d69e2e; font-weight: bold; margin-bottom: 4px;">${analysisData.severityScore.toFixed(1)}</div>
                    <div style="font-size: 0.9em; color: #6b7280;">심각도</div>
                </div>
                <div style="text-align: center; padding: 16px; background: rgba(56, 161, 105, 0.1); border-radius: 12px;">
                    <div style="font-size: 1.5em; color: #38a169; font-weight: bold; margin-bottom: 4px;">${analysisData.evidenceScore}</div>
                    <div style="font-size: 0.9em; color: #6b7280;">증거 강도</div>
                </div>
            </div>
        `;
    }
    
    // 처리 절차
    if (processSteps) {
        let steps = [];
        
        if (analysisData.resultType === "본인과실높음") {
            steps = [
                { step: 1, title: "즉시 사과 및 책임 인정", desc: "상대방에게 진심으로 사과하고 책임을 인정" },
                { step: 2, title: "보험사 신고", desc: "본인 보험사에 즉시 사고 신고" },
                { step: 3, title: "합의 협상", desc: "상대방과 원만한 합의 추진" },
                { step: 4, title: "보험금 지급", desc: "보험사를 통한 손해배상 처리" }
            ];
        } else if (analysisData.resultType === "상대과실높음") {
            steps = [
                { step: 1, title: "증거 수집", desc: "사고 현장 사진, 목격자 진술 확보" },
                { step: 2, title: "경찰 신고", desc: "정확한 사실관계 확인을 위한 신고" },
                { step: 3, title: "보험사 신고", desc: "상대방 과실 입증자료와 함께 신고" },
                { step: 4, title: "손해배상 청구", desc: "적극적인 손해배상 청구" }
            ];
        } else if (analysisData.resultType === "단순처리") {
            steps = [
                { step: 1, title: "현장 정리", desc: "간단한 현장 사진 촬영" },
                { step: 2, title: "보험사 접수", desc: "양측 보험사에 동시 접수" },
                { step: 3, title: "손해사정", desc: "보험사 손해사정사 현장 확인" },
                { step: 4, title: "신속 처리", desc: "빠른 수리 및 보험금 지급" }
            ];
        } else {
            steps = [
                { step: 1, title: "정확한 조사", desc: "전문기관을 통한 정밀 조사" },
                { step: 2, title: "양측 보험사 협의", desc: "보험사 간 과실비율 협의" },
                { step: 3, title: "전문가 감정", desc: "필요시 전문 감정기관 의뢰" },
                { step: 4, title: "최종 합의", desc: "객관적 자료 바탕 최종 합의" }
            ];
        }
        
        processSteps.innerHTML = `
            <h4 style="color: #1a365d; margin-bottom: 20px;">📞 처리 절차 안내</h4>
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${steps.map(step => `
                    <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(247, 250, 252, 0.8); border-radius: 12px;">
                        <div style="width: 40px; height: 40px; background: #1a365d; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${step.step}</div>
                        <div>
                            <h6 style="margin: 0 0 4px 0; color: #1a365d;">${step.title}</h6>
                            <p style="margin: 0; font-size: 0.9em; color: #6b7280;">${step.desc}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // 필요서류
    if (requiredDocuments) {
        const documents = [
            "자동차 등록증",
            "운전면허증",
            "보험증권",
            "사고 현장 사진",
            "상대방 연락처",
            "목격자 진술서 (있는 경우)",
            "경찰서 사고확인원 (신고한 경우)",
            "진료비 영수증 (부상이 있는 경우)"
        ];
        
        requiredDocuments.innerHTML = `
            <h4 style="color: #1a365d; margin-bottom: 20px;">📄 필요 서류</h4>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                ${documents.map(doc => `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(247, 250, 252, 0.8); border-radius: 8px;">
                        <div style="width: 24px; height: 24px; background: #38a169; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8em;">✓</div>
                        <span style="color: #2d3748; font-size: 0.9em;">${doc}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // 보험사 연락처
    if (insuranceContactsDiv) {
        const insuranceType = userAnswers.find(a => a.insurance_type)?.insurance_type || 'unknown';
        const contacts = insuranceContacts[insuranceType] || insuranceContacts.unknown;
        
        insuranceContactsDiv.innerHTML = `
            <h4 style="color: #1a365d; margin-bottom: 20px;">📞 보험사 연락처</h4>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                ${contacts.map(contact => `
                    <div style="display: flex; justify-content: between; align-items: center; padding: 16px; background: rgba(247, 250, 252, 0.8); border-radius: 12px; border-left: 4px solid #1a365d;">
                        <div style="flex: 1;">
                            <h6 style="color: #1a365d; margin-bottom: 4px;">${contact.name}</h6>
                            <p style="color: #4a5568; font-size: 0.9em; margin: 0;">${contact.feature}</p>
                        </div>
                        <div style="background: #1a365d; color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold;">
                            ${contact.phone}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// 테스트 재시작 함수
function restartTest() {
    currentQuestionIndex = 0;
    userAnswers = [];
    analysisData = {};
    
    if (resultPage) resultPage.classList.add('hidden');
    if (startPage) startPage.classList.remove('hidden');
}

// 카카오톡 공유 함수
function shareKakao() {
    const result = resultTypes[analysisData.resultType];
    
    const title = result ? result.title : '주차된차 접촉사고 보험처리 방법';
    const description = result ? 
        `${result.subtitle} - 예상 과실비율: ${analysisData.estimatedFaultRatio}%` : 
        '주차된차 접촉사고 시 올바른 보험처리 방법을 확인하세요!';
    
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '주차된차 접촉사고 보험처리 방법',
                description: `${title} - ${description}`,
                imageUrl: window.location.origin + '/주차접촉사고/주차접촉사고.svg',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
            buttons: [
                {
                    title: '처리 방법 확인하기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });
    } else {
        // 대체 공유 방법
        const text = `주차된차 접촉사고 보험처리 방법 - ${title}`;
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

    }
    
    // 이벤트 리스너 등록
    const startBtn = document.querySelector('.start-btn');
    const detailBtns = document.querySelectorAll('.detail-btn');
    const otherTestBtns = document.querySelectorAll('.other-test-btn');
    const shareBtns = document.querySelectorAll('.share-btn');
    const restartBtns = document.querySelectorAll('.restart-btn');
    
    if (startBtn) {
        startBtn.addEventListener('click', startTest);
    }
    
    detailBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // 자동차보험 관련 사이트들
            const insuranceLinks = [
                'https://direct.samsung.co.kr/auto/',        // 삼성화재 자동차보험
                'https://www.hi.co.kr/auto/',               // 현대해상 자동차보험
                'https://direct.dbgeneral.co.kr/auto/',     // DB손해보험 자동차보험
                'https://www.meritzfire.com/auto/',         // 메리츠화재 자동차보험
                'https://direct.kbinsure.co.kr/auto/'       // KB손해보험 자동차보험
            ];
            
            // 순서대로 다른 보험사 링크로 이동
            const linkIndex = index % insuranceLinks.length;
            window.open(insuranceLinks[linkIndex], '_blank');
        });
    });
    
    otherTestBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    });
    
    shareBtns.forEach(btn => {
        btn.addEventListener('click', shareKakao);
    });
    
    restartBtns.forEach(btn => {
        btn.addEventListener('click', restartTest);
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
        if (num >= 1 && num <= 5) {
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
});

// 전역 함수로 노출
window.startTest = startTest;
window.restartTest = restartTest;
window.shareKakao = shareKakao;
window.showDetailedMethod = showDetailedMethod;
window.closeDetailModal = closeDetailModal;

// 상세 처리 방법 모달 표시
function showDetailedMethod() {
    const detailModal = document.getElementById('detailModal');
    if (detailModal) {
        detailModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // 체크리스트 이벤트 리스너 추가
        const checkboxes = detailModal.querySelectorAll('input[type="checkbox"]');
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

// 상세 처리 방법 모달 닫기
function closeDetailModal() {
    const detailModal = document.getElementById('detailModal');
    if (detailModal) {
        detailModal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // 체크박스 초기화
        const checkboxes = detailModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.parentElement.style.backgroundColor = '';
            checkbox.parentElement.style.color = '';
        });
    }
}

// 모달 바깥 클릭 시 닫기
document.addEventListener('click', function(e) {
    const detailModal = document.getElementById('detailModal');
    if (detailModal && e.target === detailModal) {
        closeDetailModal();
    }
});

// ESC 키로 상세 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const detailModal = document.getElementById('detailModal');
        if (detailModal && !detailModal.classList.contains('hidden')) {
            closeDetailModal();
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