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

// 광고 관리 클래스 - 중복 로드 방지


const questions = [
    {
        question: "현재 차량 구매 예산은 어느 정도인가요?",
        hint: "💡 예산에 따라 리스와 구매의 경제성이 달라집니다",
        answers: [
            { text: "2000만원 미만", budget: "low", score: 4 },
            { text: "2000~3000만원", budget: "mid_low", score: 3 },
            { text: "3000~4000만원", budget: "middle", score: 2 },
            { text: "4000~5000만원", budget: "mid_high", score: 2 },
            { text: "5000만원 이상", budget: "high", score: 1 }
        ]
    },
    {
        question: "월 소득 수준은 어떻게 되시나요?",
        hint: "💰 소득 대비 리스료가 적정한지 확인해야 합니다",
        answers: [
            { text: "300만원 미만", income: "low", score: 2 },
            { text: "300~500만원", income: "mid_low", score: 3 },
            { text: "500~700만원", income: "middle", score: 4 },
            { text: "700~1000만원", income: "mid_high", score: 4 },
            { text: "1000만원 이상", income: "high", score: 3 }
        ]
    },
    {
        question: "차량 이용 패턴은 어떠신가요?",
        hint: "🚗 주행거리에 따라 리스 제약이 클 수 있습니다",
        answers: [
            { text: "주말/가끔 이용", usage: "light", mileage: "low", score: 5 },
            { text: "출퇴근 위주", usage: "commute", mileage: "medium", score: 4 },
            { text: "업무용 + 개인용", usage: "mixed", mileage: "high", score: 2 },
            { text: "장거리 운전 자주", usage: "long_distance", mileage: "very_high", score: 1 },
            { text: "매일 많이 이용", usage: "heavy", mileage: "very_high", score: 1 }
        ]
    },
    {
        question: "차량 관리에 대한 성향은?",
        hint: "🔧 리스 차량은 원상복구 비용이 높을 수 있습니다",
        answers: [
            { text: "깔끔하게 관리하는 편", care: "excellent", score: 5 },
            { text: "보통 수준으로 관리", care: "good", score: 4 },
            { text: "기본적인 관리만", care: "basic", score: 3 },
            { text: "관리에 신경 안 씀", care: "poor", score: 1 },
            { text: "흠집, 손상 자주 발생", care: "bad", score: 0 }
        ]
    },
    {
        question: "자동차에 대한 관심도는?",
        hint: "🎯 관심도에 따라 리스의 만족도가 달라집니다",
        answers: [
            { text: "최신 모델을 선호", interest: "high", model_preference: "latest", score: 5 },
            { text: "브랜드/디자인 중시", interest: "brand", model_preference: "premium", score: 4 },
            { text: "기능/성능 위주", interest: "function", model_preference: "practical", score: 3 },
            { text: "경제성이 최우선", interest: "economy", model_preference: "economic", score: 2 },
            { text: "이동 수단 정도", interest: "low", model_preference: "basic", score: 3 }
        ]
    },
    {
        question: "향후 3~4년 계획은?",
        hint: "📅 생활 변화 계획이 리스 계약에 영향을 줍니다",
        answers: [
            { text: "현재 상황 유지 예정", stability: "stable", score: 5 },
            { text: "이직/이사 가능성 있음", stability: "uncertain", score: 2 },
            { text: "결혼/출산 계획", stability: "life_change", score: 3 },
            { text: "사업/투자 계획", stability: "business", score: 2 },
            { text: "해외 거주 가능성", stability: "overseas", score: 1 }
        ]
    },
    {
        question: "금융 상품 이용 경험은?",
        hint: "💳 금융 이해도가 리스 계약 이해에 중요합니다",
        answers: [
            { text: "다양한 금융상품 경험", financial: "expert", score: 4 },
            { text: "대출/할부 경험 있음", financial: "experienced", score: 4 },
            { text: "기본적인 이용만", financial: "basic", score: 3 },
            { text: "거의 이용 안 함", financial: "beginner", score: 2 },
            { text: "금융상품 잘 모름", financial: "novice", score: 1 }
        ]
    },
    {
        question: "리스에 대해 얼마나 알고 계신가요?",
        hint: "📚 정확한 이해 없이는 손해를 볼 수 있습니다",
        answers: [
            { text: "계약조건까지 자세히 알고 있음", knowledge: "expert", score: 5 },
            { text: "기본적인 내용은 알고 있음", knowledge: "good", score: 4 },
            { text: "대략적으로만 알고 있음", knowledge: "basic", score: 3 },
            { text: "이름만 들어봤음", knowledge: "little", score: 2 },
            { text: "거의 모름", knowledge: "none", score: 1 }
        ]
    }
];

// 리스 유형별 정보
const leaseTypes = {
    "매우적합": {
        title: "🏆 리스가 매우 적합",
        subtitle: "리스의 장점을 최대한 활용할 수 있는 조건입니다!",
        badge: "✅",
        bgColor: "linear-gradient(45deg, #4a7c26, #7fb069)",
        description: "귀하의 조건에서는 리스가 구매보다 유리한 선택입니다.",
        category: "매우적합"
    },
    "적합": {
        title: "👍 리스가 적합",
        subtitle: "조건을 잘 확인하면 리스가 유리할 수 있습니다",
        badge: "✓",
        bgColor: "linear-gradient(45deg, #7fb069, #a8d08d)",
        description: "몇 가지 주의사항만 확인하면 리스가 좋은 선택입니다.",
        category: "적합"
    },
    "주의필요": {
        title: "⚠️ 신중한 검토 필요",
        subtitle: "리스와 구매를 신중히 비교해보세요",
        badge: "⚖️",
        bgColor: "linear-gradient(45deg, #ff8c42, #ffab73)",
        description: "리스와 구매 각각의 장단점을 꼼꼼히 따져보세요.",
        category: "주의필요"
    },
    "부적합": {
        title: "❌ 리스보다 구매 권장",
        subtitle: "현재 조건에서는 구매가 더 유리합니다",
        badge: "🚫",
        bgColor: "linear-gradient(45deg, #ff6b35, #ff8c69)",
        description: "리스보다는 구매나 다른 방법을 고려해보세요.",
        category: "부적합"
    }
};

// 숨겨진 사실 정보
const hiddenFacts = {
    "매우적합": {
        title: "💡 리스 활용 극대화 팁",
        facts: [
            {
                icon: "💰",
                title: "세금 혜택 활용",
                content: "개인사업자/법인은 리스료를 비용처리하여 세금 절약 가능",
                importance: "high"
            },
            {
                icon: "🔄",
                title: "업그레이드 전략",
                content: "계약 만료 전 6개월부터 연장 혜택 협상 시작",
                importance: "medium"
            },
            {
                icon: "📋",
                title: "숨겨진 혜택",
                content: "보험료 할인, 정비 서비스, 대차 서비스 등 부가 혜택 확인",
                importance: "medium"
            }
        ],
        recommendations: [
            "리스 전문 업체 3곳 이상 견적 비교",
            "월 주행거리를 여유있게 설정",
            "종합보험 가입 여부 꼼꼼히 확인",
            "중도 해지 조건 사전 협의"
        ]
    },
    "적합": {
        title: "⚡ 리스 성공 핵심 포인트",
        facts: [
            {
                icon: "📊",
                title: "실제 비용 계산",
                content: "리스료 외 보험료, 세금, 정비비 등 숨겨진 비용 포함 계산",
                importance: "high"
            },
            {
                icon: "⏰",
                title: "계약 시기 전략",
                content: "연말/분기말에 더 좋은 조건으로 계약 가능",
                importance: "medium"
            },
            {
                icon: "🛡️",
                title: "보험 최적화",
                content: "리스 회사 보험보다 개별 가입이 저렴할 수 있음",
                importance: "medium"
            }
        ],
        recommendations: [
            "총 비용을 구매 비용과 정확히 비교",
            "차량 관리 상태 철저히 유지",
            "계약서 세부 조건 꼼꼼히 검토",
            "주행거리 여유분 10-20% 확보"
        ]
    },
    "주의필요": {
        title: "🚨 리스 함정 주의사항",
        facts: [
            {
                icon: "💸",
                title: "숨겨진 비용 폭탄",
                content: "중도 해지 시 잔여 리스료의 60-80% 위약금 발생",
                importance: "high"
            },
            {
                icon: "🔧",
                title: "원상복구 비용",
                content: "사소한 흠집도 수만원-수십만원 청구 가능",
                importance: "high"
            },
            {
                icon: "📏",
                title: "주행거리 제한",
                content: "초과 시 km당 150-300원 추가 요금 부과",
                importance: "medium"
            }
        ],
        recommendations: [
            "구매와 리스 총비용 정밀 분석",
            "생활 패턴 변화 가능성 고려",
            "차량 관리 능력 객관적 평가",
            "계약 조건 법무 검토 권장"
        ]
    },
    "부적합": {
        title: "💥 리스 피해야 하는 이유",
        facts: [
            {
                icon: "📈",
                title: "장기적 손실",
                content: "4년 리스 후에도 내 차가 아님, 구매 시 자산 보유",
                importance: "high"
            },
            {
                icon: "🎯",
                title: "높은 이용 비용",
                content: "귀하의 이용 패턴에서는 구매가 40% 이상 경제적",
                importance: "high"
            },
            {
                icon: "⛓️",
                title: "각종 제약",
                content: "주행거리, 차량 변경, 해외 이용 등 많은 제약 존재",
                importance: "medium"
            }
        ],
        recommendations: [
            "중고차 구매 적극 검토",
            "할부 금리와 리스 비용 비교",
            "차량 공유 서비스 이용 고려",
            "가족/지인 차량 이용 방안 검토"
        ]
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
    const progressFill = document.querySelector('.progress-fill');
    const currentStep = document.querySelector('.current-step');
    const totalSteps = document.querySelector('.total-steps');
    const questionText = document.querySelector('.question-text');
    const optionsContainer = document.querySelector('.options-container');
    const questionHint = document.querySelector('.question-hint');
    
    // 진행률 업데이트
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    if (progressFill) progressFill.style.width = progress + '%';
    if (currentStep) currentStep.textContent = currentQuestionIndex + 1;
    if (totalSteps) totalSteps.textContent = '/ ' + questions.length;
    
    // 3번째 질문 후 중간 광고 표시
    if (currentQuestionIndex === 3) {
        adManager.showMidAd();
    }
    
    // 질문과 옵션 표시
    const currentQuestion = questions[currentQuestionIndex];
    if (questionText) questionText.textContent = currentQuestion.question;
    if (questionHint) questionHint.textContent = currentQuestion.hint;
    
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        currentQuestion.answers.forEach((answer, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';
            optionElement.textContent = answer.text;
            optionElement.onclick = () => selectAnswer(answer, index);
            optionsContainer.appendChild(optionElement);
        });
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
    }, 700);
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
            const status = step.querySelector('.step-status');
            if (status) {
                if (index < 2) {
                    status.textContent = '완료';
                    status.style.background = '#4a7c26';
                } else if (index === 2) {
                    status.textContent = '진행중';
                    status.style.background = '#ff8c42';
                } else {
                    status.textContent = '대기';
                    status.style.background = '#bdc3c7';
                }
            }
        }, (index + 1) * 800);
    });
    
    // 카운트다운 시작
    let countdown = 5;
    const countdownNumber = document.querySelector('.countdown-number');
    
    const timer = setInterval(() => {
        if (countdownNumber) countdownNumber.textContent = countdown;
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
    // 점수 기반 결과 타입 결정
    let resultType;
    
    if (totalScore >= 30) {
        resultType = "매우적합";
    } else if (totalScore >= 22) {
        resultType = "적합";
    } else if (totalScore >= 15) {
        resultType = "주의필요";
    } else {
        resultType = "부적합";
    }
    
    // 추가 분석 데이터
    let budgetLevel = 0;
    let usagePattern = 'normal';
    let careLevel = 'good';
    let knowledgeLevel = 'basic';
    
    userAnswers.forEach(answer => {
        if (answer.budget) {
            budgetLevel = answer.score;
        }
        if (answer.usage) {
            usagePattern = answer.usage;
        }
        if (answer.care) {
            careLevel = answer.care;
        }
        if (answer.knowledge) {
            knowledgeLevel = answer.knowledge;
        }
    });
    
    analysisData = {
        resultType: resultType,
        totalScore: totalScore,
        budgetLevel: budgetLevel,
        usagePattern: usagePattern,
        careLevel: careLevel,
        knowledgeLevel: knowledgeLevel
    };
}

// 결과 표시 함수
function showResults() {
    if (analysisModal) analysisModal.classList.add('hidden');
    if (resultPage) resultPage.classList.remove('hidden');
    
    const result = leaseTypes[analysisData.resultType];
    const hiddenInfo = hiddenFacts[result.category];
    
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
    const analysisSummary = document.querySelector('.analysis-summary');
    const hiddenFactsElement = document.querySelector('.hidden-facts');
    const recommendationsElement = document.querySelector('.recommendations');
    
    if (analysisSummary) {
        analysisSummary.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.9); border-radius: 20px; padding: 25px; margin-bottom: 20px; border: 2px solid rgba(122, 176, 105, 0.3);">
                <h4 style="color: #2d5016; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    📊 종합 분석 결과
                </h4>
                <p style="color: #2d3436; line-height: 1.6; margin-bottom: 20px; font-size: 1.1em;">
                    <strong>${result.description}</strong>
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div style="text-align: center; padding: 20px; background: rgba(122, 176, 105, 0.1); border-radius: 15px;">
                        <div style="font-size: 2em; color: #4a7c26; font-weight: 800; margin-bottom: 5px;">${analysisData.totalScore}/40</div>
                        <div style="font-size: 0.9em; color: #636e72;">리스 적합도</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: rgba(255, 107, 53, 0.1); border-radius: 15px;">
                        <div style="font-size: 2em; color: #ff6b35; font-weight: 800; margin-bottom: 5px;">${Math.round((analysisData.totalScore / 40) * 100)}%</div>
                        <div style="font-size: 0.9em; color: #636e72;">추천도</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    if (hiddenFactsElement) {
        hiddenFactsElement.innerHTML = `
            <h4 style="color: #2d5016; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                ${hiddenInfo.title}
            </h4>
            ${hiddenInfo.facts.map(fact => `
                <div style="background: rgba(255, 255, 255, 0.8); border-radius: 15px; padding: 20px; margin-bottom: 15px; border-left: 4px solid ${fact.importance === 'high' ? '#ff6b35' : '#ff8c42'};">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                        <span style="font-size: 1.5em;">${fact.icon}</span>
                        <h5 style="color: #2d5016; font-size: 1.1em; margin: 0;">${fact.title}</h5>
                        ${fact.importance === 'high' ? '<span style="background: #ff6b35; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.7em;">중요</span>' : ''}
                    </div>
                    <p style="color: #2d3436; font-size: 0.95em; line-height: 1.5; margin: 0;">${fact.content}</p>
                </div>
            `).join('')}
        `;
    }
    
    if (recommendationsElement) {
        recommendationsElement.innerHTML = `
            <div style="background: rgba(122, 176, 105, 0.1); border-radius: 20px; padding: 25px; border: 2px solid rgba(122, 176, 105, 0.3);">
                <h4 style="color: #2d5016; margin-bottom: 15px;">✅ 맞춤 행동 가이드</h4>
                <ul style="color: #2d3436; line-height: 1.8; padding-left: 0; list-style: none;">
                    ${hiddenInfo.recommendations.map(rec => `
                        <li style="margin: 12px 0; padding: 10px 15px; background: rgba(255, 255, 255, 0.7); border-radius: 10px; border-left: 3px solid #4a7c26;">
                            • ${rec}
                        </li>
                    `).join('')}
                </ul>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(255, 107, 53, 0.1); border-radius: 12px; border-left: 4px solid #ff6b35;">
                    <h5 style="color: #ff6b35; margin-bottom: 8px;">🚨 절대 놓치면 안 되는 체크포인트</h5>
                    <p style="color: #2d3436; font-size: 0.9em; line-height: 1.5; margin: 0;">
                        리스 계약 전 반드시 여러 업체 비교견적을 받아보시고, 
                        계약서의 모든 조건을 꼼꼼히 확인하세요. 
                        특히 중도해지 위약금과 원상복구 기준은 반드시 문의하시기 바랍니다.
                    </p>
                </div>
            </div>
        `;
    }
    
    // 결과 페이지 광고 로드 (새로 추가)
    setTimeout(() => {
        adManager.showResultAd();
    }, 500);
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
    const result = leaseTypes[analysisData.resultType];
    
    const title = result ? result.title : '자동차 리스 장단점 - 숨겨진 사실';
    const description = result ? 
        `${result.subtitle} - 내 점수: ${analysisData.totalScore}/40점` : 
        '자동차 리스의 숨겨진 장단점을 확인해보세요!';
    
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '자동차 리스 장단점 - 숨겨진 사실',
                description: `${title} - ${description}`,
                imageUrl: window.location.origin + '/자동차리스/자동차리스.svg',
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
        const text = `자동차 리스 장단점 - ${title}`;
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
    console.log('자동차리스 이벤트 리스너 설정 중...');
    
    // 테스트 시작 버튼
    const startBtn = document.querySelector('.start-button');
    if (startBtn) {
        startBtn.addEventListener('click', startTest);
        console.log('테스트 시작 버튼 이벤트 리스너 등록됨');
    }
    
    // 기본 액션 버튼들
    const primaryActions = document.querySelectorAll('.primary-action');
    primaryActions.forEach(btn => {
        btn.addEventListener('click', () => {
            window.open('https://www.carleasing.co.kr', '_blank');
        });
    });
    
    // 공유 버튼들
    const shareButtons = document.querySelectorAll('.share-button');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', shareKakao);
    });
    
    // 다시하기 버튼들
    const retryButtons = document.querySelectorAll('.retry-button');
    retryButtons.forEach(btn => {
        btn.addEventListener('click', restartTest);
    });
    
    console.log('자동차리스 모든 이벤트 리스너 등록 완료');
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
        if (num >= 1 && num <= 5) {
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
    
    // 광고 관리자 초기화 및 상단 광고 로드 (새로 추가)
    adManager.init();
});

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

// 전역 함수로 노출
window.startTest = startTest;
window.restartTest = restartTest;
window.shareKakao = shareKakao;

// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('자동차리스 페이지 로드됨');
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 광고 초기화
    initializeAds();
    adManager.loadAd('adTop');
    setupAdObservers();
});
