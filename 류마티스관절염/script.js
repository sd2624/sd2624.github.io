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
    adManager.showAd('ad-header');
    
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
        adManager.showAd('ad-middle');
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
    adManager.showAd('ad-result');
    
    const result = analyzeAnswers();
    displayResult(result);
}

// 답변 분석
function analyzeAnswers() {
    const painPattern = userAnswers[0] || {};
    const swelling = userAnswers[1] || {};
    const stiffness = userAnswers[2] || {};
    const systemic = userAnswers[3] || {};
    const riskFactors = userAnswers[4] || {};
    const exercise = userAnswers[5] || {};
    const dailyLife = userAnswers[6] || {};
    
    // RA 가능성 점수 계산
    let raScore = 0;
    let severity = 0;
    let riskLevel = "";
    let recommendation = "";
    let treatmentPlan = [];
    let exercisePlan = [];
    
    // 각 영역별 점수 합산
    raScore += (painPattern.severity || 0);
    raScore += (swelling.ra_score || 0);
    raScore += (stiffness.stiffness || 0);
    raScore += (systemic.inflammation || 0);
    raScore += (riskFactors.risk || 0);
    
    // 일상생활 제약도
    severity = (dailyLife.independence || 5);
    
    // 위험도 판정
    if (raScore >= 20 && (painPattern.type === "classic_ra" || swelling.symmetry >= 4)) {
        riskLevel = "류마티스 관절염 고위험";
        recommendation = "즉시 류마티스 내과 전문의 진료 필요";
        treatmentPlan.push("혈액검사 (RF, Anti-CCP, ESR, CRP)");
        treatmentPlan.push("관절 X-ray 및 초음파 검사");
        treatmentPlan.push("조기 DMARD 치료 고려");
        exercisePlan.push("급성기에는 관절 휴식");
        exercisePlan.push("염증 완화 후 수중 운동");
    } else if (raScore >= 15) {
        riskLevel = "관절염 중위험";
        recommendation = "관절염 정밀 검사 권장";
        treatmentPlan.push("류마티스 내과 상담");
        treatmentPlan.push("기본 혈액검사 및 영상검사");
        treatmentPlan.push("항염증 치료");
        exercisePlan.push("저강도 유산소 운동");
        exercisePlan.push("관절 가동범위 운동");
    } else if (raScore >= 10) {
        riskLevel = "관절염 주의";
        recommendation = "정기적인 관찰 필요";
        treatmentPlan.push("1차 의료기관 상담");
        treatmentPlan.push("생활습관 개선");
        treatmentPlan.push("증상 모니터링");
        exercisePlan.push("규칙적인 운동 습관");
        exercisePlan.push("관절 보호 운동");
    } else {
        riskLevel = "관절 건강 양호";
        recommendation = "예방적 관리 지속";
        treatmentPlan.push("건강한 생활습관 유지");
        treatmentPlan.push("정기 건강검진");
        treatmentPlan.push("관절 건강 관리");
        exercisePlan.push("다양한 운동 활동");
        exercisePlan.push("근력 및 유연성 운동");
    }
    
    return {
        riskLevel,
        recommendation,
        treatmentPlan,
        exercisePlan,
        raScore,
        severity,
        painType: painPattern.type || "일반적",
        swellingPattern: swelling.location || "없음",
        stiffnessDuration: stiffness.duration || "없음",
        systemicSymptoms: systemic.systemic || "없음",
        exerciseLevel: exercise.exercise || "없음"
    };
}

// 결과 표시
function displayResult(result) {
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultSubtitle = document.getElementById('resultSubtitle');
    
    if (resultIcon) {
        if (result.riskLevel.includes("고위험")) {
            resultIcon.textContent = '🚨';
        } else if (result.riskLevel.includes("중위험")) {
            resultIcon.textContent = '⚠️';
        } else if (result.riskLevel.includes("주의")) {
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
    const symptomDiv = document.querySelector('.symptom-analysis');
    const treatmentDiv = document.querySelector('.treatment-options');
    const exerciseDiv = document.querySelector('.exercise-program');
    const managementDiv = document.querySelector('.management-plan');
    
    if (symptomDiv) {
        symptomDiv.innerHTML = `
            <h3>🔍 증상 분석 결과</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #ffe8e8, #ffcdd2); padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>위험도:</strong> ${result.riskLevel}<br>
                    <strong>통증 유형:</strong> ${result.painType}<br>
                    <strong>부종 패턴:</strong> ${result.swellingPattern}
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
                    <strong>아침 강직:</strong> ${result.stiffnessDuration}<br>
                    <strong>전신 증상:</strong> ${result.systemicSymptoms}<br>
                    <strong>운동 수준:</strong> ${result.exerciseLevel}
                </div>
            </div>
        `;
    }
    
    if (treatmentDiv) {
        treatmentDiv.innerHTML = `
            <h3>💊 치료 방향</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #e8f5e8, #c8e6c9); padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>권장 치료법</strong><br>
                    ${result.treatmentPlan.map(plan => `<small>• ${plan}</small>`).join('<br>')}
                </div>
                <div style="background: linear-gradient(135deg, #fff3e0, #ffcc02); padding: 15px; border-radius: 10px;">
                    <strong>추가 검사 항목</strong><br>
                    <small>• 류마티스 인자 (RF) 검사</small><br>
                    <small>• 항CCP 항체 검사</small><br>
                    <small>• 염증 수치 (ESR, CRP)</small><br>
                    <small>• 관절 초음파 또는 MRI</small>
                </div>
            </div>
        `;
    }
    
    if (exerciseDiv) {
        exerciseDiv.innerHTML = `
            <h3>🏃‍♀️ 맞춤 운동 프로그램</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>추천 운동</strong><br>
                    ${result.exercisePlan.map(exercise => `<small>• ${exercise}</small>`).join('<br>')}
                </div>
                <div style="background: linear-gradient(135deg, #f3e5f5, #ce93d8); color: white; padding: 15px; border-radius: 10px;">
                    <strong>수중 운동 프로그램 (최고 우선순위)</strong><br>
                    <small>• 수영: 주 3회, 30분씩</small><br>
                    <small>• 아쿠아로빅: 주 2회, 45분씩</small><br>
                    <small>• 수중 걷기: 매일 20분씩</small>
                </div>
            </div>
        `;
    }
    
    if (managementDiv) {
        managementDiv.innerHTML = `
            <h3>📋 일상 관리 계획</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #ffeaa7, #fdcb6e); padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>생활 수칙</strong><br>
                    <small>• 충분한 휴식과 수면 (8시간)</small><br>
                    <small>• 금연 및 금주</small><br>
                    <small>• 스트레스 관리</small><br>
                    <small>• 적정 체중 유지</small>
                </div>
                <div style="background: linear-gradient(135deg, #ff7675, #e17055); color: white; padding: 15px; border-radius: 10px;">
                    <strong>주의사항</strong><br>
                    <small>• 관절에 무리가 가는 활동 피하기</small><br>
                    <small>• 염증 급성기에는 관절 휴식</small><br>
                    <small>• 정기적인 전문의 진료</small><br>
                    <small>• 약물 복용 시 부작용 모니터링</small>
                </div>
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

// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
});