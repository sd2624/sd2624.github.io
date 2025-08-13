// 전역 변수
let currentQuestionIndex = 0;
let userAnswers = [];
let totalQuestions = 8;

// 카카오 SDK 초기화
if (typeof Kakao !== 'undefined') {
    Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
}

// 질문 데이터
const questions = [
    {
        question: "월급 받는 날은 언제인가요?",
        answers: [
            { text: "1~5일", score: { early: 3, mid: 1, late: 0 } },
            { text: "10~15일", score: { early: 2, mid: 3, late: 1 } },
            { text: "20~25일", score: { early: 1, mid: 2, late: 3 } },
            { text: "말일(26~31일)", score: { early: 0, mid: 1, late: 2 } },
            { text: "부정기적", score: { early: 1, mid: 1, late: 1 } }
        ]
    },
    {
        question: "한 달 생활비는 언제 주로 지출하나요?",
        answers: [
            { text: "월초에 몰아서", score: { early: 3, mid: 1, late: 0 } },
            { text: "월 중순에 집중적으로", score: { early: 1, mid: 3, late: 1 } },
            { text: "월말에 주로", score: { early: 0, mid: 1, late: 3 } },
            { text: "매주 고르게", score: { early: 2, mid: 2, late: 2 } },
            { text: "불규칙하게", score: { early: 1, mid: 1, late: 1 } }
        ]
    },
    {
        question: "신용카드 사용 패턴은?",
        answers: [
            { text: "소액 결제 위주", score: { early: 1, mid: 2, late: 1 } },
            { text: "중간 금액 결제", score: { early: 2, mid: 3, late: 2 } },
            { text: "고액 결제 자주", score: { early: 3, mid: 2, late: 3 } },
            { text: "월말에 몰아서", score: { early: 0, mid: 1, late: 3 } },
            { text: "거의 사용 안함", score: { early: 0, mid: 1, late: 0 } }
        ]
    },
    {
        question: "돈 관리 스타일은?",
        answers: [
            { text: "매일 가계부 작성", score: { early: 2, mid: 3, late: 2 } },
            { text: "주단위로 체크", score: { early: 2, mid: 2, late: 2 } },
            { text: "월말에 정산", score: { early: 1, mid: 1, late: 3 } },
            { text: "가끔씩 확인", score: { early: 1, mid: 1, late: 1 } },
            { text: "거의 신경 안씀", score: { early: 0, mid: 0, late: 0 } }
        ]
    },
    {
        question: "비상금 준비 상황은?",
        answers: [
            { text: "충분히 준비됨", score: { early: 1, mid: 2, late: 3 } },
            { text: "어느 정도 있음", score: { early: 2, mid: 2, late: 2 } },
            { text: "조금 있음", score: { early: 2, mid: 1, late: 1 } },
            { text: "거의 없음", score: { early: 3, mid: 2, late: 1 } },
            { text: "전혀 없음", score: { early: 3, mid: 1, late: 0 } }
        ]
    },
    {
        question: "카드 연체 경험은?",
        answers: [
            { text: "한 번도 없음", score: { early: 1, mid: 3, late: 2 } },
            { text: "1-2번 있음", score: { early: 2, mid: 2, late: 2 } },
            { text: "가끔 있음", score: { early: 3, mid: 1, late: 1 } },
            { text: "자주 있음", score: { early: 3, mid: 0, late: 0 } },
            { text: "기억 안남", score: { early: 2, mid: 1, late: 1 } }
        ]
    },
    {
        question: "현재 사용 중인 카드 개수는?",
        answers: [
            { text: "1개", score: { early: 1, mid: 2, late: 1 } },
            { text: "2-3개", score: { early: 2, mid: 3, late: 2 } },
            { text: "4-5개", score: { early: 2, mid: 2, late: 3 } },
            { text: "6개 이상", score: { early: 3, mid: 1, late: 3 } },
            { text: "정확히 모름", score: { early: 1, mid: 1, late: 1 } }
        ]
    },
    {
        question: "현금흐름에서 가장 중요하게 생각하는 것은?",
        answers: [
            { text: "연체 방지", score: { early: 2, mid: 3, late: 1 } },
            { text: "이자 절약", score: { early: 1, mid: 2, late: 3 } },
            { text: "관리 편의성", score: { early: 3, mid: 2, late: 2 } },
            { text: "신용등급 관리", score: { early: 1, mid: 3, late: 2 } },
            { text: "잘 모르겠음", score: { early: 1, mid: 1, late: 1 } }
        ]
    }
];

// 결과 타입
const resultTypes = {
    early: {
        title: "월초 결제형 (1~10일)",
        subtitle: "체계적인 관리를 선호하는 당신",
        description: `
            <div class="result-section">
                <h3>🎯 추천 결제일: 5일</h3>
                <p><strong>왜 5일일까요?</strong></p>
                <ul>
                    <li>월말 정산 후 바로 새 달 시작</li>
                    <li>월 전체 자금 계획 수립 용이</li>
                    <li>관리 체계성 극대화</li>
                </ul>
            </div>
            
            <div class="result-section">
                <h3>💡 장점</h3>
                <ul>
                    <li>✅ 월별 예산 관리 명확</li>
                    <li>✅ 가계부 작성 편리</li>
                    <li>✅ 연말정산 정리 쉬움</li>
                </ul>
            </div>
            
            <div class="result-section">
                <h3>⚠️ 주의사항</h3>
                <ul>
                    <li>급여일과 결제일 간격 확인</li>
                    <li>월말 큰 지출 예상시 여유자금 필요</li>
                    <li>연체 방지를 위한 자동이체 설정</li>
                </ul>
            </div>
        `,
        tips: [
            "자동이체를 통한 확실한 결제",
            "월말 계좌 잔액 미리 확인",
            "비상자금 최소 50만원 유지"
        ]
    },
    mid: {
        title: "월중 결제형 (10~15일)",
        subtitle: "균형잡힌 현금흐름의 달인",
        description: `
            <div class="result-section">
                <h3>🎯 추천 결제일: 14일</h3>
                <p><strong>14일이 황금 결제일인 이유!</strong></p>
                <ul>
                    <li>급여 후 충분한 시간적 여유</li>
                    <li>월말까지 자금 운용 가능</li>
                    <li>심리적 부담감 최소화</li>
                </ul>
            </div>
            
            <div class="result-section">
                <h3>💡 장점</h3>
                <ul>
                    <li>✅ 최적의 현금흐름 관리</li>
                    <li>✅ 연체 위험 최소화</li>
                    <li>✅ 스트레스 없는 카드 관리</li>
                </ul>
            </div>
            
            <div class="result-section">
                <h3>🏆 14일 결제의 특별한 이점</h3>
                <ul>
                    <li>대부분 급여일(25일~말일) 후 약 15일 여유</li>
                    <li>월 중순 결제로 자금계획 수립 용이</li>
                    <li>다음 급여까지 부담없는 기간 확보</li>
                </ul>
            </div>
        `,
        tips: [
            "14일은 대한민국 최적 결제일",
            "급여일 기준 15일 후 설정이 이상적",
            "여러 카드도 14일로 통일 추천"
        ]
    },
    late: {
        title: "월말 결제형 (20일 이후)",
        subtitle: "급여와 함께하는 안정형",
        description: `
            <div class="result-section">
                <h3>🎯 추천 결제일: 25일</h3>
                <p><strong>급여 직후 결제의 안정감</strong></p>
                <ul>
                    <li>급여 입금 직후 즉시 정산</li>
                    <li>잔여 금액으로 한 달 생활</li>
                    <li>명확한 가용 자금 파악</li>
                </ul>
            </div>
            
            <div class="result-section">
                <h3>💡 장점</h3>
                <ul>
                    <li>✅ 급여 후 바로 정산으로 안심</li>
                    <li>✅ 남은 돈으로 명확한 계획</li>
                    <li>✅ 카드 사용 한도 자연스럽게 조절</li>
                </ul>
            </div>
            
            <div class="result-section">
                <h3>⚠️ 주의사항</h3>
                <ul>
                    <li>다음 급여까지 긴 기간 관리 필요</li>
                    <li>월말 큰 지출 발생시 부담 증가</li>
                    <li>비상자금 충분히 준비 필요</li>
                </ul>
            </div>
        `,
        tips: [
            "급여일 3일 후 결제일 설정",
            "월말 대형 지출 미리 계획",
            "비상자금 100만원 이상 권장"
        ]
    }
};

// 페이지 표시 함수
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

// 테스트 시작
function startTest() {
    showPage('testPage');
    currentQuestionIndex = 0;
    userAnswers = [];
    showQuestion();
}

// 질문 표시
function showQuestion() {
    const question = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    
    document.getElementById('progress').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = totalQuestions;
    document.getElementById('questionTitle').textContent = question.question;
    
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const answerBtn = document.createElement('button');
        answerBtn.className = 'answer-btn';
        answerBtn.textContent = answer.text;
        answerBtn.onclick = () => selectAnswer(answer);
        answersContainer.appendChild(answerBtn);
    });
}

// 답변 선택
function selectAnswer(answer) {
    userAnswers.push(answer);
    
    if (currentQuestionIndex < totalQuestions - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        showAnalysisPopup();
    }
}

// 분석 팝업 표시
function showAnalysisPopup() {
    document.getElementById('popupOverlay').classList.remove('hidden');
    document.getElementById('analysisPopup').classList.remove('hidden');
    
    let countdown = 8;
    const countdownEl = document.getElementById('countdown');
    const confirmBtn = document.getElementById('confirmPopupBtn');
    
    const timer = setInterval(() => {
        countdown--;
        countdownEl.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            confirmBtn.disabled = false;
            confirmBtn.textContent = '결과 확인하기';
            confirmBtn.onclick = showResult;
        }
    }, 1000);
}

// 결과 계산 및 표시
function showResult() {
    document.getElementById('popupOverlay').classList.add('hidden');
    document.getElementById('analysisPopup').classList.add('hidden');
    
    // 점수 계산
    const scores = { early: 0, mid: 0, late: 0 };
    
    userAnswers.forEach(answer => {
        scores.early += answer.score.early;
        scores.mid += answer.score.mid;
        scores.late += answer.score.late;
    });
    
    // 최고 점수 타입 찾기
    let resultType = 'mid'; // 기본값
    let maxScore = scores.mid;
    
    if (scores.early > maxScore) {
        resultType = 'early';
        maxScore = scores.early;
    }
    if (scores.late > maxScore) {
        resultType = 'late';
        maxScore = scores.late;
    }
    
    const result = resultTypes[resultType];
    
    // 결과 표시
    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('resultSubtitle').textContent = result.subtitle;
    document.getElementById('resultContent').innerHTML = result.description;
    
    showPage('resultPage');
}

// 카카오톡 공유
function shareKakao() {
    if (typeof Kakao !== 'undefined') {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '💳 나에게 맞는 신용카드 결제일 테스트',
                description: '14일 결제가 정말 좋을까? 나만의 최적 결제일을 찾아보세요!',
                imageUrl: 'https://sd2624.github.io/신용카드결제일/신용카드결제일.svg',
                link: {
                    mobileWebUrl: 'https://sd2624.github.io/신용카드결제일/',
                    webUrl: 'https://sd2624.github.io/신용카드결제일/'
                }
            },
            buttons: [
                {
                    title: '테스트 하기',
                    link: {
                        mobileWebUrl: 'https://sd2624.github.io/신용카드결제일/',
                        webUrl: 'https://sd2624.github.io/신용카드결제일/'
                    }
                }
            ]
        });
    }
}

// 결과 공유
function shareResult() {
    const resultTitle = document.getElementById('resultTitle').textContent;
    if (typeof Kakao !== 'undefined') {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: `💳 나의 신용카드 결제일 타입: ${resultTitle}`,
                description: '나에게 맞는 최적의 신용카드 결제일을 찾았어요! 당신도 테스트해보세요!',
                imageUrl: 'https://sd2624.github.io/신용카드결제일/신용카드결제일.svg',
                link: {
                    mobileWebUrl: 'https://sd2624.github.io/신용카드결제일/',
                    webUrl: 'https://sd2624.github.io/신용카드결제일/'
                }
            },
            buttons: [
                {
                    title: '나도 테스트하기',
                    link: {
                        mobileWebUrl: 'https://sd2624.github.io/신용카드결제일/',
                        webUrl: 'https://sd2624.github.io/신용카드결제일/'
                    }
                }
            ]
        });
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // AdSense 광고 로드
    if (typeof adsbygoogle !== 'undefined') {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
});
