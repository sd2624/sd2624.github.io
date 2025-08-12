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
    
    const result = analyzeAnswers();
    displayResult(result);
}

// 답변 분석
function analyzeAnswers() {
    const reason = userAnswers[0] || {};
    const period = userAnswers[1] || {};
    const evidence = userAnswers[2] || {};
    const timing = userAnswers[3] || {};
    const jobSeeking = userAnswers[4] || {};
    const history = userAnswers[5] || {};
    
    // 점수 계산
    let totalScore = 0;
    let eligibilityLevel = "";
    let recommendation = "";
    let requiredActions = [];
    
    // 퇴사 사유 점수 (가장 중요)
    totalScore += (reason.validity || 0) * 3;
    
    // 가입 기간 점수
    totalScore += (period.eligibility || 0) * 2;
    
    // 증빙 자료 점수
    totalScore += (evidence.strength || 0);
    
    // 신청 시기 점수
    totalScore += (timing.urgency || 0);
    
    // 구직 의사 점수
    totalScore += (jobSeeking.willingness || 0);
    
    // 이전 수급 이력 (감점)
    totalScore -= (history.restriction || 0);
    
    // 결과 판정
    if (totalScore >= 20 && (reason.validity || 0) >= 4 && (period.eligibility || 0) >= 3) {
        eligibilityLevel = "수급 가능성 높음";
        recommendation = "정당한 사유 인정 가능";
        requiredActions.push("필요 서류 준비 후 신청");
        requiredActions.push("고용센터 방문 상담");
    } else if (totalScore >= 15 && (reason.validity || 0) >= 3) {
        eligibilityLevel = "수급 가능성 보통";
        recommendation = "추가 증빙 필요";
        requiredActions.push("증빙서류 보강");
        requiredActions.push("전문가 상담 권장");
    } else if ((reason.validity || 0) <= 2) {
        eligibilityLevel = "수급 어려움";
        recommendation = "정당한 사유 미충족";
        requiredActions.push("다른 지원제도 알아보기");
        requiredActions.push("재취업 활동 집중");
    } else {
        eligibilityLevel = "조건 검토 필요";
        recommendation = "일부 조건 미충족";
        requiredActions.push("부족한 조건 보완");
        requiredActions.push("고용센터 상담 필수");
    }
    
    return {
        eligibilityLevel,
        recommendation,
        requiredActions,
        totalScore,
        reasonCategory: reason.category || "미확인",
        evidenceStrength: evidence.proof || "미확인",
        deadline: timing.deadline || "미확인"
    };
}

// 결과 표시
function displayResult(result) {
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultSubtitle = document.getElementById('resultSubtitle');
    
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
    const eligibilityDiv = document.querySelector('.eligibility-analysis');
    const documentsDiv = document.querySelector('.required-documents');
    const processDiv = document.querySelector('.application-process');
    const tipsDiv = document.querySelector('.additional-tips');
    
    if (eligibilityDiv) {
        eligibilityDiv.innerHTML = `
            <h3>📊 수급 자격 분석</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>판정 결과:</strong> ${result.eligibilityLevel || '분석 중'}<br>
                    <strong>퇴사 사유:</strong> ${result.reasonCategory || '미확인'}
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
                    <strong>증빙 자료:</strong> ${result.evidenceStrength || '미확인'}<br>
                    <strong>신청 기한:</strong> ${result.deadline === 'expired' ? '기한 만료' : result.deadline === 'urgent' ? '긴급' : result.deadline || '미확인'}
                </div>
            </div>
        `;
    }
    
    if (documentsDiv) {
        documentsDiv.innerHTML = `
            <h3>📋 필요 서류</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #fff3e0, #ffcc02); padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>기본 서류</strong><br>
                    <small>• 이직확인서 (회사 발급)</small><br>
                    <small>• 신분증, 통장사본</small><br>
                    <small>• 실업급여 신청서</small>
                </div>
                <div style="background: linear-gradient(135deg, #f3e5f5, #ba68c8); color: white; padding: 15px; border-radius: 10px;">
                    <strong>추가 증빙서류</strong><br>
                    <small>• 의료진단서 (건강상 사유)</small><br>
                    <small>• 체불임금확인서 (임금체불)</small><br>
                    <small>• 근로계약서 (계약위반)</small>
                </div>
            </div>
        `;
    }
    
    if (processDiv) {
        processDiv.innerHTML = `
            <h3>📞 신청 절차</h3>
            <ol style="margin: 15px 0; padding-left: 20px;">
                ${(result.requiredActions || []).map(action => `<li style="margin: 8px 0;">${action}</li>`).join('')}
                <li style="margin: 8px 0;">워크넷 온라인 신청 또는 고용센터 방문</li>
                <li style="margin: 8px 0;">심사 결과 확인 (2-4주 소요)</li>
            </ol>
        `;
    }
    
    if (tipsDiv) {
        tipsDiv.innerHTML = `
            <h3>💡 주의사항</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #ffebee, #ef5350); color: white; padding: 15px; border-radius: 10px;">
                    <strong>신청 전 필수 확인사항</strong><br>
                    <small>• 퇴사 후 1년 내 신청 필수</small><br>
                    <small>• 증빙서류 미비 시 수급 불가</small><br>
                    <small>• 허위 신청 시 벌금 부과</small>
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
