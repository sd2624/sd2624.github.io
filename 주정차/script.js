// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 데이터
const questions = [
    {
        question: "거주 지역은 어디인가요?",
        answers: [
            { text: "서울특별시", region: "seoul" },
            { text: "부산광역시", region: "busan" },
            { text: "대구광역시", region: "daegu" },
            { text: "인천광역시", region: "incheon" },
            { text: "광주광역시", region: "gwangju" },
            { text: "대전광역시", region: "daejeon" },
            { text: "울산광역시", region: "ulsan" },
            { text: "세종특별자치시", region: "sejong" },
            { text: "경기도", region: "gyeonggi" },
            { text: "기타 지역", region: "other" }
        ]
    },
    {
        question: "주로 주차하는 장소는 어디인가요?",
        answers: [
            { text: "아파트 단지 내", score: 1 },
            { text: "상업지역 도로변", score: 3 },
            { text: "주택가 골목길", score: 2 },
            { text: "대형마트/쇼핑몰", score: 2 }
        ]
    },
    {
        question: "하루 평균 주차 시간은?",
        answers: [
            { text: "2시간 미만", score: 1 },
            { text: "2~4시간", score: 2 },
            { text: "4~8시간", score: 3 },
            { text: "8시간 이상", score: 3 }
        ]
    },
    {
        question: "주정차 위반으로 과태료를 받은 경험이 있나요?",
        answers: [
            { text: "없음", score: 1 },
            { text: "1~2회", score: 2 },
            { text: "3~5회", score: 3 },
            { text: "6회 이상", score: 3 }
        ]
    },
    {
        question: "주로 운전하는 시간대는?",
        answers: [
            { text: "출퇴근 시간대 (7~9시, 18~20시)", score: 3 },
            { text: "오전 시간대 (9~12시)", score: 2 },
            { text: "오후 시간대 (13~17시)", score: 2 },
            { text: "저녁/야간 (20시 이후)", score: 1 }
        ]
    },
    {
        question: "주정차 단속에 대한 정보를 어떻게 얻고 싶나요?",
        answers: [
            { text: "SMS 문자 알림", score: 3 },
            { text: "모바일 앱 푸시 알림", score: 2 },
            { text: "이메일 알림", score: 1 },
            { text: "카카오톡 알림", score: 2 }
        ]
    },
    {
        question: "주차장 이용 빈도는?",
        answers: [
            { text: "거의 매일", score: 3 },
            { text: "주 3~4회", score: 2 },
            { text: "주 1~2회", score: 1 },
            { text: "가끔 이용", score: 1 }
        ]
    },
    {
        question: "주정차 관련 정보에 대한 관심도는?",
        answers: [
            { text: "매우 관심 있음", score: 3 },
            { text: "관심 있음", score: 2 },
            { text: "보통", score: 1 },
            { text: "관심 없음", score: 0 }
        ]
    }
];

// 지역별 서비스 데이터
const regionServices = {
    seoul: {
        title: "🏙️ 서울특별시 주정차 단속 알림 서비스",
        description: "서울시에서 제공하는 스마트 주정차 단속 알림 서비스를 이용하실 수 있습니다.",
        features: "• 실시간 단속 정보 제공\n• SMS/카카오톡 알림\n• 25개 자치구 전체 서비스\n• 24시간 운영",
        guidance: "📱 신청 방법:\n1. 서울시 홈페이지 접속\n2. 휴대폰 번호 등록\n3. 알림 수신 동의\n4. 서비스 이용 시작",
        icon: "🏙️",
        links: [
            { text: "서울시 주정차 알림 신청", url: "https://news.seoul.go.kr" },
            { text: "서울시 교통정보센터", url: "https://topis.seoul.go.kr" },
            { text: "서울시청 홈페이지", url: "https://seoul.go.kr" },
            { text: "서울시 모바일 앱", url: "https://m.seoul.go.kr" }
        ],
        available: true
    },
    busan: {
        title: "🌊 부산광역시 주정차 단속 알림 서비스",
        description: "부산시 주정차 단속 알림 서비스로 해운대, 서면 등 주요 지역의 단속 정보를 받아보세요.",
        features: "• 주요 관광지 단속 정보\n• 실시간 SMS 알림\n• 16개 구·군 서비스\n• 주말 특별 운영",
        guidance: "📱 신청 절차:\n1. 부산시 통합홈페이지 접속\n2. 주정차 알림 서비스 메뉴\n3. 개인정보 입력 및 동의\n4. 알림 서비스 활성화",
        icon: "🌊",
        links: [
            { text: "부산시 주정차 알림 서비스", url: "https://www.busan.go.kr" },
            { text: "부산교통공사", url: "https://www.humetro.busan.kr" },
            { text: "부산시 교통정보", url: "https://its.busan.go.kr" },
            { text: "부산시청", url: "https://www.busan.go.kr" }
        ],
        available: true
    },
    gyeonggi: {
        title: "🏘️ 경기도 주정차 단속 알림 서비스",
        description: "경기도 31개 시·군별 맞춤형 주정차 단속 알림 서비스를 제공합니다.",
        features: "• 31개 시·군 개별 서비스\n• 지역별 맞춤 정보\n• 모바일 최적화\n• 무료 서비스 제공",
        guidance: "📱 이용 안내:\n1. 거주 시·군청 홈페이지 접속\n2. 교통/주차 메뉴 확인\n3. 알림 서비스 신청\n4. 지역별 서비스 이용",
        icon: "🏘️",
        links: [
            { text: "경기도청 교통정보", url: "https://www.gg.go.kr" },
            { text: "경기도 시군 통합", url: "https://www.gg.go.kr/bbs/board.do?bsIdx=464" },
            { text: "수원시 주정차 정보", url: "https://www.suwon.go.kr" },
            { text: "성남시 교통정보", url: "https://www.seongnam.go.kr" }
        ],
        available: true
    },
    incheon: {
        title: "✈️ 인천광역시 주정차 단속 알림 서비스",
        description: "인천시 공항, 항만 지역을 포함한 전 지역 주정차 단속 알림 서비스입니다.",
        features: "• 공항/항만 특화 서비스\n• 10개 구·군 서비스\n• 관광객 대상 서비스\n• 다국어 지원",
        guidance: "📱 서비스 신청:\n1. 인천시 홈페이지 방문\n2. 교통/주차 섹션 이동\n3. 알림 서비스 등록\n4. 맞춤 알림 설정",
        icon: "✈️",
        links: [
            { text: "인천시 교통정보", url: "https://www.incheon.go.kr" },
            { text: "인천공항 주차정보", url: "https://www.airport.kr" },
            { text: "인천시청", url: "https://www.incheon.go.kr" },
            { text: "인천교통공사", url: "https://www.ictr.or.kr" }
        ],
        available: true
    },
    other: {
        title: "🌐 전국 주정차 단속 알림 서비스 안내",
        description: "전국 지자체별 주정차 단속 알림 서비스 정보를 확인하고 신청하세요.",
        features: "• 전국 지자체 서비스 안내\n• 지역별 서비스 비교\n• 통합 정보 제공\n• 신청 방법 안내",
        guidance: "📱 이용 방법:\n1. 거주 지역 확인\n2. 해당 지자체 홈페이지 접속\n3. 교통/주차 관련 메뉴 검색\n4. 알림 서비스 신청",
        icon: "🌐",
        links: [
            { text: "정부24 통합서비스", url: "https://www.gov.kr" },
            { text: "행정안전부", url: "https://www.mois.go.kr" },
            { text: "국토교통부 교통정보", url: "https://www.molit.go.kr" },
            { text: "지자체 통합정보", url: "https://www.korealii.go.kr" }
        ],
        available: false
    }
};

let currentQuestion = 0;
let totalScore = 0;
let answers = [];
let userRegion = '';

// DOM 요소
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const analysisPopup = document.getElementById('analysisPopup');

// 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    // 광고 초기화
    if (typeof adsbygoogle !== 'undefined') {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
    
    // 시작 버튼
    document.querySelector('.start-btn').addEventListener('click', startTest);
    
    // 카카오 공유 버튼
    document.querySelectorAll('.kakao-share').forEach(btn => {
        btn.addEventListener('click', shareKakao);
    });
});

// 테스트 시작
function startTest() {
    // 변수 초기화
    currentQuestion = 0;
    totalScore = 0;
    answers = [];
    userRegion = '';
    
    console.log('주정차 테스트 시작 - 변수 초기화 완료');
    
    startPage.classList.add('hidden');
    questionPage.classList.remove('hidden');
    showQuestion();
}

// 질문 표시
function showQuestion() {
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
    
    // 답변 옵션 생성
    answersElement.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const answerElement = document.createElement('div');
        answerElement.className = 'answer';
        answerElement.textContent = answer.text;
        
        if (currentQuestion === 0) {
            // 첫 번째 질문은 지역 선택
            answerElement.addEventListener('click', () => selectRegion(index, answer.region, answer.text));
        } else {
            // 나머지 질문은 점수 기반
            answerElement.addEventListener('click', () => selectAnswer(index, answer.score));
        }
        
        answersElement.appendChild(answerElement);
    });
}

// 지역 선택
function selectRegion(index, region, regionName) {
    const answerElements = document.querySelectorAll('.answer');
    
    // 모든 답변의 선택 상태 제거
    answerElements.forEach(el => el.classList.remove('selected'));
    
    // 선택한 답변 표시
    answerElements[index].classList.add('selected');
    
    // 지역 정보 저장
    userRegion = region;
    answers[currentQuestion] = {
        questionIndex: currentQuestion,
        answerIndex: index,
        region: region,
        regionName: regionName
    };
    
    console.log(`선택된 지역: ${regionName} (${region})`);
    
    // 다음 질문으로 이동
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showAnalysis();
        }
    }, 500);
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
    
    // 다음 질문으로 이동
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            console.log(`최종 점수: ${totalScore}점, 지역: ${userRegion}`);
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
    
    let countdown = 6;
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
    
    // 지역별 서비스 정보 가져오기
    const serviceInfo = regionServices[userRegion] || regionServices['other'];
    
    // 결과 표시
    const resultImg = document.querySelector('.result-img');
    const resultContent = document.querySelector('.result-content');
    
    // 우선순위 계산 (점수 기반)
    let priority = "높음";
    let priorityColor = "#4CAF50";
    
    if (totalScore >= 18) {
        priority = "매우 높음";
        priorityColor = "#2196F3";
    } else if (totalScore >= 12) {
        priority = "높음";
        priorityColor = "#4CAF50";
    } else if (totalScore >= 6) {
        priority = "보통";
        priorityColor = "#FF9800";
    } else {
        priority = "낮음";
        priorityColor = "#9E9E9E";
    }
    
    resultImg.style.background = `linear-gradient(135deg, ${priorityColor}, ${priorityColor}CC)`;
    resultImg.innerHTML = `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 60px;">${serviceInfo.icon}</div>`;
    
    resultContent.innerHTML = `
        <h3 style="font-size: 1.8em; margin-bottom: 20px; color: #1565c0; font-weight: bold;">${serviceInfo.title}</h3>
        <p style="margin-bottom: 25px; font-size: 1.2em; line-height: 1.6;">${serviceInfo.description}</p>
        
        <div style="background: white; padding: 25px; border-radius: 15px; text-align: left; white-space: pre-line; border-left: 5px solid #2196F3; margin-bottom: 20px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
            <h4 style="color: #1565c0; margin-bottom: 15px; font-size: 1.3em;">✨ 서비스 특징</h4>
            ${serviceInfo.features}
        </div>
        
        <div style="background: #f3f8ff; padding: 25px; border-radius: 15px; text-align: left; white-space: pre-line; border: 2px solid #2196F3; margin-bottom: 20px;">
            <h4 style="color: #1565c0; margin-bottom: 15px; font-size: 1.3em;">📋 신청 안내</h4>
            ${serviceInfo.guidance}
        </div>
        
        <div style="background: #e3f2fd; padding: 25px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #2196F3;">
            <h4 style="color: #1976d2; margin-bottom: 15px; font-size: 1.3em;">🔗 바로가기 링크</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                ${serviceInfo.links.map(link => `
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
        
        <div style="background: linear-gradient(135deg, #e8f4f8, #d4edda); padding: 20px; border-radius: 10px; font-weight: bold; color: #1565c0; text-align: center; border: 2px solid #2196F3;">
            🎯 서비스 우선순위: ${priority}
            <br>
            <span style="font-size: 0.9em; font-weight: normal; color: #666;">※ 분석 점수 ${totalScore}점을 기반으로 산출되었습니다</span>
        </div>
        
        <div style="margin-top: 25px; padding: 20px; background: #fff3cd; border-radius: 10px; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-bottom: 10px;">ℹ️ 이용 안내</h4>
            <p style="color: #856404; font-size: 0.95em; line-height: 1.5;">
                주정차 단속 알림 서비스는 지자체별로 운영 방식이 다를 수 있습니다. 
                정확한 서비스 내용과 신청 방법은 해당 지역 홈페이지에서 확인하시기 바랍니다.
            </p>
        </div>
    `;
}

// 카카오 공유
function shareKakao() {
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '주정차 단속 알림 서비스 신청 안내',
                description: '내 지역 주정차 단속 알림 서비스를 신청하고 과태료를 미리 예방하세요!',
                imageUrl: 'https://via.placeholder.com/400x300/2196F3/FFFFFF?text=주정차+알림',
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
