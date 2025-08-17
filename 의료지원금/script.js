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

// [광고] 페이지 로드 시 초기화 및 Kakao SDK 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded 이벤트 발생');
    
    // Kakao SDK 초기화
    if (typeof Kakao !== 'undefined') {
        if (!Kakao.isInitialized()) {
            Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
            console.log('Kakao SDK 초기화 완료');
        }
    } else {
        console.warn('Kakao SDK가 로드되지 않았습니다');
    }
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
    
    console.log('페이지 초기화 완료');
});


const questions = [
    {
        question: "현재 나이는 어떻게 되시나요?",
        answers: [
            { text: "20세 미만", score: 0 },
            { text: "20~39세", score: 1 },
            { text: "40~59세", score: 2 },
            { text: "60세 이상", score: 3 }
        ]
    },
    {
        question: "현재 어떤 관절 부위에 불편함이 있으신가요?",
        answers: [
            { text: "팔목 (손목 포함)", score: 2 },
            { text: "발목", score: 2 },
            { text: "허리", score: 3 },
            { text: "무릎", score: 3 }
        ]
    },
    {
        question: "관절 통증이 시작된 지 얼마나 되셨나요?",
        answers: [
            { text: "1개월 미만", score: 1 },
            { text: "1~6개월", score: 2 },
            { text: "6개월~1년", score: 3 },
            { text: "1년 이상", score: 3 }
        ]
    },
    {
        question: "일상생활에서 관절 통증으로 인한 불편함 정도는?",
        answers: [
            { text: "거의 없음", score: 0 },
            { text: "가끔 불편함", score: 1 },
            { text: "자주 불편함", score: 2 },
            { text: "매우 심한 불편함", score: 3 }
        ]
    },
    {
        question: "현재 직업이나 주요 활동은 무엇인가요?",
        answers: [
            { text: "사무직 (장시간 앉아서 근무)", score: 2 },
            { text: "육체노동직", score: 3 },
            { text: "주부/가사일", score: 2 },
            { text: "학생/무직", score: 1 }
        ]
    },
    {
        question: "최근 1년간 관절 관련 병원 진료를 받은 적이 있나요?",
        answers: [
            { text: "없음", score: 0 },
            { text: "1~2회", score: 1 },
            { text: "3~5회", score: 2 },
            { text: "6회 이상", score: 3 }
        ]
    },
    {
        question: "가족 중에 관절염이나 관절 질환이 있는 분이 계신가요?",
        answers: [
            { text: "없음", score: 0 },
            { text: "부모님 중 한 분", score: 1 },
            { text: "부모님 모두", score: 2 },
            { text: "조부모님까지 포함하여 여러 명", score: 3 }
        ]
    },
    {
        question: "현재 건강보험 가입 상태는 어떻게 되시나요?",
        answers: [
            { text: "직장가입자", score: 2 },
            { text: "지역가입자", score: 2 },
            { text: "의료급여 수급자", score: 3 },
            { text: "미가입", score: 0 }
        ]
    },
    {
        question: "월 평균 소득 수준은 어떻게 되시나요?",
        answers: [
            { text: "200만원 미만", score: 3 },
            { text: "200~400만원", score: 2 },
            { text: "400~600만원", score: 1 },
            { text: "600만원 이상", score: 0 }
        ]
    },
    {
        question: "운동이나 신체활동은 얼마나 자주 하시나요?",
        answers: [
            { text: "거의 안 함", score: 1 },
            { text: "주 1~2회", score: 2 },
            { text: "주 3~4회", score: 2 },
            { text: "거의 매일", score: 1 }
        ]
    },
    {
        question: "관절 치료를 위해 지출할 의향이 있는 금액은?",
        answers: [
            { text: "50만원 미만", score: 1 },
            { text: "50~100만원", score: 2 },
            { text: "100~200만원", score: 3 },
            { text: "200만원 이상", score: 3 }
        ]
    },
    {
        question: "의료 지원금에 대한 정보를 어디서 주로 얻으시나요?",
        answers: [
            { text: "인터넷 검색", score: 1 },
            { text: "지인 추천", score: 1 },
            { text: "병원에서", score: 2 },
            { text: "정부 공식 채널", score: 2 }
        ]
    }
];

// 결과 데이터
const results = [
    {
        title: "🎉 최우선 지원 대상자",
        description: "축하합니다! 2025년 관절 치료비 지원금 최우선 대상자로 분류되었습니다. 최대 200만원까지 지원받을 수 있으며, 신청 절차가 간소화됩니다.",
        details: "• 지원금액: 최대 200만원\n• 본인부담률: 10%\n• 신청기간: 연중 상시\n• 승인률: 95% 이상\n• 특별혜택: 우선 심사",
        guidance: "📋 신청 방법:\n1. 가까운 보건소 방문\n2. 온라인 신청 (복지포털)\n3. 주민센터 방문 신청\n\n📞 문의처:\n• 보건복지부 콜센터: 129\n• 지역 보건소\n• 국민건강보험공단: 1577-1000",
        links: [
            { text: "복지로 포털 바로가기", url: "https://www.bokjiro.go.kr" },
            { text: "국민건강보험공단", url: "https://www.nhis.or.kr" },
            { text: "보건복지부", url: "https://www.mohw.go.kr" },
            { text: "내 지역 보건소 찾기", url: "https://www.mohw.go.kr/react/jb/sjb030301vw.jsp" }
        ],
        icon: "🏆",
        minScore: 25,
        maxScore: 36,
        bgColor: "linear-gradient(135deg, #4CAF50, #45a049)"
    },
    {
        title: "✅ 일반 지원 대상자",
        description: "2025년 관절 치료비 지원금 일반 대상자로 확인되었습니다. 최대 150만원까지 지원받을 수 있습니다.",
        details: "• 지원금액: 최대 150만원\n• 본인부담률: 20%\n• 신청기간: 연중 상시\n• 승인률: 80% 이상\n• 추가서류: 소득증명서",
        guidance: "📋 신청 절차:\n1. 의료진 진단서 발급\n2. 소득증명서 준비\n3. 온라인 또는 방문 신청\n4. 심사 후 승인 (2-3주 소요)\n\n📞 상담 문의:\n• 의료급여 상담센터: 1588-0009\n• 지역 보건소",
        links: [
            { text: "복지로 포털 신청", url: "https://www.bokjiro.go.kr" },
            { text: "의료급여 안내", url: "https://www.nhis.or.kr/nhis/together/wbhaec06200m01.do" },
            { text: "건강보험공단 지사찾기", url: "https://www.nhis.or.kr/nhis/minwon/wbmina0100m01.do" },
            { text: "의료비 지원 정보", url: "https://www.mohw.go.kr/react/policy/policy_bd_vw.jsp" }
        ],
        icon: "✅",
        minScore: 18,
        maxScore: 24,
        bgColor: "linear-gradient(135deg, #2196F3, #1976D2)"
    },
    {
        title: "📋 조건부 지원 대상자",
        description: "일부 조건을 충족하면 관절 치료비 지원을 받을 수 있습니다. 최대 100만원까지 지원 가능합니다.",
        details: "• 지원금액: 최대 100만원\n• 본인부담률: 30%\n• 신청기간: 분기별\n• 승인률: 65% 이상\n• 추가조건: 소득 및 의료진단서",
        guidance: "📋 추가 조건 확인:\n1. 소득 수준 재검토\n2. 의료진 상담 필수\n3. 추가 서류 준비\n4. 분기별 신청 기간 확인\n\n💡 팁:\n• 다른 지원 제도와 중복 신청 가능\n• 지역별 추가 지원 프로그램 확인",
        links: [
            { text: "소득 기준 확인", url: "https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do" },
            { text: "의료급여 신청", url: "https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52005M.do" },
            { text: "지역별 복지정보", url: "https://www.localinfo.or.kr" },
            { text: "의료비 지원제도 안내", url: "https://www.mohw.go.kr/react/jb/sjb030301vw.jsp" }
        ],
        icon: "📋",
        minScore: 12,
        maxScore: 17,
        bgColor: "linear-gradient(135deg, #FF9800, #F57C00)"
    },
    {
        title: "ℹ️ 지원 대상 미해당",
        description: "현재 조건으로는 지원 대상에 해당하지 않습니다. 하지만 다른 의료 지원 제도를 안내해드릴 수 있습니다.",
        details: "• 대안방안: 일반 건강보험 혜택\n• 할인프로그램: 병원별 할인제도\n• 상담신청: 무료 의료상담\n• 정기검진: 국가건강검진 활용",
        guidance: "🔍 다른 지원 방법:\n1. 일반 건강보험 본인부담금 상한제\n2. 의료급여 신청 검토\n3. 병원별 할인 프로그램\n4. 지역 의료복지 센터 상담\n\n📞 무료 상담:\n• 복지로 상담센터: 129\n• 지역 의료복지 센터",
        links: [
            { text: "건강보험 본인부담금 상한제", url: "https://www.nhis.or.kr/nhis/together/wbhaec06800m01.do" },
            { text: "의료급여 신청 안내", url: "https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52005M.do" },
            { text: "복지로 포털", url: "https://www.bokjiro.go.kr" },
            { text: "지역 의료복지센터 찾기", url: "https://www.localinfo.or.kr" }
        ],
        icon: "💡",
        minScore: 0,
        maxScore: 11,
        bgColor: "linear-gradient(135deg, #607D8B, #455A64)"
    }
];

let currentQuestion = 0;
let totalScore = 0;
let answers = [];

// DOM 요소
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const analysisPopup = document.getElementById('analysisPopup');

// 이벤트 리스너 설정
function setupEventListeners() {
    console.log('이벤트 리스너 설정 중...');
    
    // 시작 버튼
    const startBtn = document.querySelector('.start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startTest);
        console.log('시작 버튼 이벤트 리스너 등록 완료');
    }
    
    // 카카오 공유 버튼들
    document.querySelectorAll('.kakao-share').forEach(btn => {
        btn.addEventListener('click', shareKakao);
    });
    
    console.log('모든 이벤트 리스너 설정 완료');
}

// 테스트 시작
function startTest() {
    console.log('테스트 시작 함수 호출됨');
    
    // 변수 초기화
    currentQuestion = 0;
    totalScore = 0;
    answers = [];
    
    console.log('테스트 시작 - 변수 초기화 완료');
    
    startPage.classList.add('hidden');
    questionPage.classList.remove('hidden');
    showQuestion();
}
// 질문 표시
function showQuestion() {
    console.log(`질문 ${currentQuestion + 1} 표시 중...`);
    
    const question = questions[currentQuestion];
    const questionElement = document.querySelector('.question');
    const answersElement = document.querySelector('.answers');
    const questionNumElement = document.getElementById('questionNum');
    const progressElement = document.querySelector('.progress');
    
    questionElement.textContent = question.question;
    questionNumElement.textContent = currentQuestion + 1;
    
    // 진행률 업데이트
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressElement.style.width = progress + '%';
    
    // 3번째 질문 후 중간 광고 표시
    if (currentQuestion === 3) {
        adManager.showMidAd();
    }
    
    // 답변 옵션 생성
    answersElement.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const answerElement = document.createElement('div');
        answerElement.className = 'answer';
        answerElement.textContent = answer.text;
        answerElement.addEventListener('click', () => selectAnswer(index, answer.score));
        answersElement.appendChild(answerElement);
    });
}

// 답변 선택
function selectAnswer(index, score) {
    const answerElements = document.querySelectorAll('.answer');
    
    // 모든 답변의 선택 상태 제거
    answerElements.forEach(el => el.classList.remove('selected'));
    
    // 선택한 답변 표시
    answerElements[index].classList.add('selected');
    
    // 이전에 이 질문에 답한 적이 있다면 점수 차감
    if (answers[currentQuestion]) {
        totalScore -= answers[currentQuestion].score;
    }
    
    // 스코어 저장 및 누적
    answers[currentQuestion] = {
        questionIndex: currentQuestion,
        answerIndex: index,
        score: score
    };
    
    totalScore += score;
    
    console.log(`질문 ${currentQuestion + 1}: 선택한 답변 점수 ${score}, 총 점수: ${totalScore}`);
    
    // 다음 질문으로 이동 (딜레이 추가)
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            console.log(`최종 점수: ${totalScore}점`);
            showAnalysis();
        }
    }, 500);
}

// 분석 팝업 표시
function showAnalysis() {
    questionPage.classList.add('hidden');
    analysisPopup.classList.remove('hidden');
    
    // 팝업 광고 초기화
    setTimeout(() => {
        if (typeof adsbygoogle !== 'undefined') {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, 100);
    
    let countdown = 8;
    const countdownElement = document.querySelector('.countdown');
    
    const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);
}

// 결과 표시
function showResult() {
    analysisPopup.classList.add('hidden');
    resultPage.classList.remove('hidden');
    
    // 결과 결정
    const result = getResult(totalScore);
    
    // 결과 표시
    const resultImg = document.querySelector('.result-img');
    const resultContent = document.querySelector('.result-content');
    
    resultImg.style.background = result.bgColor;
    resultImg.innerHTML = `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 60px;">${result.icon}</div>`;
    
    resultContent.innerHTML = `
        <h3 style="font-size: 1.8em; margin-bottom: 20px; color: #2c5530; font-weight: bold;">${result.title}</h3>
        <p style="margin-bottom: 25px; font-size: 1.2em; line-height: 1.6;">${result.description}</p>
        
        <div style="background: white; padding: 25px; border-radius: 15px; text-align: left; white-space: pre-line; border-left: 5px solid #4CAF50; margin-bottom: 20px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
            <h4 style="color: #2c5530; margin-bottom: 15px; font-size: 1.3em;">💰 지원 상세 내용</h4>
            ${result.details}
        </div>
        
        <div style="background: #f0f8f0; padding: 25px; border-radius: 15px; text-align: left; white-space: pre-line; border: 2px solid #4CAF50; margin-bottom: 20px;">
            <h4 style="color: #2c5530; margin-bottom: 15px; font-size: 1.3em;">📋 신청 안내</h4>
            ${result.guidance}
        </div>
        
        <div style="background: #e3f2fd; padding: 25px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #2196F3;">
            <h4 style="color: #1976d2; margin-bottom: 15px; font-size: 1.3em;">🔗 관련 링크</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                ${result.links.map(link => `
                    <a href="${link.url}" target="_blank" style="
                        display: block;
                        padding: 12px 16px;
                        background: white;
                        color: #1976d2;
                        text-decoration: none;
                        border-radius: 8px;
                        border: 1px solid #2196F3;
                        text-align: center;
                        font-weight: 500;
                        transition: all 0.3s ease;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    " onmouseover="this.style.background='#2196F3'; this.style.color='white'; this.style.transform='translateY(-2px)'" 
                       onmouseout="this.style.background='white'; this.style.color='#1976d2'; this.style.transform='translateY(0)'">
                        ${link.text}
                    </a>
                `).join('')}
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #e8f5e8, #d4edda); padding: 20px; border-radius: 10px; font-weight: bold; color: #2c5530; text-align: center; border: 2px solid #4CAF50;">
            🎯 분석 결과: ${totalScore}점 (${questions.length * 3}점 만점)
            <br>
            <span style="font-size: 0.9em; font-weight: normal; color: #666;">※ 실제 지원 여부는 관련 기관에서 최종 심사됩니다</span>
        </div>
        
        <div style="margin-top: 25px; padding: 20px; background: #fff3cd; border-radius: 10px; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-bottom: 10px;">⚠️ 중요 안내</h4>
            <p style="color: #856404; font-size: 0.95em; line-height: 1.5;">
                이 테스트는 참고용이며, 실제 지원금 신청 시에는 관련 기관의 정확한 심사를 받아야 합니다. 
                개인별 상황에 따라 결과가 달라질 수 있으니 정확한 정보는 해당 기관에 문의하시기 바랍니다.
            </p>
        </div>
    `;
    
    // 결과 페이지 광고 표시
    adManager.showResultAd();
}

// 결과 결정 함수
function getResult(score) {
    console.log(`결과 결정: ${score}점으로 분석 중...`);
    
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (score >= result.minScore && score <= result.maxScore) {
            console.log(`결과 매칭: ${result.title} (${result.minScore}-${result.maxScore}점 범위)`);
            return result;
        }
    }
    
    // 기본값 반환 (가장 낮은 등급)
    console.log(`기본 결과 반환: ${results[results.length - 1].title}`);
    return results[results.length - 1];
}

// 카카오 공유
function shareKakao() {
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '2025년 관절 치료비 지원금 자격 확인',
                description: '팔목·발목·허리·무릎 치료비 최대 200만원 지원! 나도 받을 수 있을까?',
                imageUrl: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcvZE8M%2FbtsN7fPuC9x%2FGksZxnHw5e4fCfljxwN5Hk%2Fimg.jpg',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href
                }
            },
            buttons: [
                {
                    title: '테스트 하기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href
                    }
                }
            ]
        });
    } else {
        // 카카오 SDK가 없을 경우 URL 복사
        copyToClipboard();
    }
}

// URL 클립보드 복사
function copyToClipboard() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('링크가 복사되었습니다!');
        });
    } else {
        // 구형 브라우저 대응
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('링크가 복사되었습니다!');
    }
}

// 이미지 우클릭 방지
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

// F12 개발자 도구 방지 (기본적인 수준)
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        return false;
    }
});

// 텍스트 선택 방지
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

// 드래그 방지
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});

// 전역 함수로 노출
window.startTest = startTest;
window.shareKakao = shareKakao;