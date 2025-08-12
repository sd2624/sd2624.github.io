// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 데이터
const questions = [
    {
        question: "주로 어떤 방송을 시청하시나요?",
        answers: [
            { text: "지상파 (KBS, MBC, SBS)", type: "terrestrial", priority: 4 },
            { text: "종합편성 (JTBC, 채널A, MBN)", type: "general", priority: 3 },
            { text: "케이블 (tvN, OCN, 스포츠)", type: "cable", priority: 2 },
            { text: "해외 채널", type: "foreign", priority: 1 }
        ]
    },
    {
        question: "TV 시청 시간대는 주로 언제인가요?",
        answers: [
            { text: "오전 시간 (6~12시)", time: "morning", convenience: 3 },
            { text: "오후 시간 (12~18시)", time: "afternoon", convenience: 2 },
            { text: "저녁 시간 (18~24시)", time: "evening", convenience: 4 },
            { text: "새벽 시간 (24~6시)", time: "night", convenience: 1 }
        ]
    },
    {
        question: "주로 사용하는 기기는 무엇인가요?",
        answers: [
            { text: "스마트폰", device: "mobile", mobility: 4 },
            { text: "태블릿", device: "tablet", mobility: 3 },
            { text: "PC/노트북", device: "pc", mobility: 2 },
            { text: "스마트TV", device: "tv", mobility: 1 }
        ]
    },
    {
        question: "인터넷 연결 환경은 어떤가요?",
        answers: [
            { text: "초고속 인터넷 (100Mbps 이상)", speed: 4, quality: 4 },
            { text: "일반 광랜 (50~100Mbps)", speed: 3, quality: 3 },
            { text: "무선 인터넷 (10~50Mbps)", speed: 2, quality: 2 },
            { text: "모바일 데이터", speed: 1, quality: 1 }
        ]
    },
    {
        question: "어떤 장르를 선호하시나요?",
        answers: [
            { text: "뉴스/시사/다큐", genre: "news", preference: "information" },
            { text: "드라마/영화", genre: "drama", preference: "entertainment" },
            { text: "예능/버라이어티", genre: "variety", preference: "fun" },
            { text: "스포츠/게임", genre: "sports", preference: "live" }
        ]
    },
    {
        question: "광고에 대한 생각은?",
        answers: [
            { text: "광고 없이 시청하고 싶음", ads: "no", tolerance: 1 },
            { text: "짧은 광고는 괜찮음", ads: "short", tolerance: 3 },
            { text: "무료라면 광고 상관없음", ads: "ok", tolerance: 4 },
            { text: "광고도 재미있게 봄", ads: "enjoy", tolerance: 4 }
        ]
    },
    {
        question: "화질에 대한 기대치는?",
        answers: [
            { text: "4K 초고화질 필수", quality: "4k", expectation: 4 },
            { text: "FHD 고화질 선호", quality: "fhd", expectation: 3 },
            { text: "HD 화질이면 충분", quality: "hd", expectation: 2 },
            { text: "화질보다 안정성", quality: "stable", expectation: 1 }
        ]
    },
    {
        question: "새로운 플랫폼 이용에 대한 성향은?",
        answers: [
            { text: "최신 서비스를 빠르게 시도", adoption: "early", tech: 4 },
            { text: "검증된 후 사용", adoption: "careful", tech: 3 },
            { text: "익숙한 것만 사용", adoption: "conservative", tech: 2 },
            { text: "변화를 싫어함", adoption: "resistant", tech: 1 }
        ]
    }
];

// 결과 타입 정의
const resultTypes = {
    "무료 스트리밍 마스터": {
        title: "🏆 무료 스트리밍 마스터",
        description: "축하합니다! 당신은 최신 무료 스트리밍 서비스의 최적 사용자입니다.",
        badge: "👑",
        bgColor: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
        summary: "다양한 무료 플랫폼을 활용하여 최고의 TV 시청 경험을 즐길 수 있습니다.",
        details: `
            <h4>🎯 추천 플랫폼</h4>
            <ul>
                <li>📺 <a href="https://www.wavve.com/" target="_blank">웨이브(Wavve)</a> 무료 버전 - 지상파 실시간 방송</li>
                <li>🎬 <a href="https://www.tving.com/" target="_blank">티빙(TVING)</a> 무료 회원 - 다양한 예능/드라마</li>
                <li>📱 <a href="https://tv.youtube.com/" target="_blank">유튜브 TV</a> - 해외 채널 및 라이브 방송</li>
                <li>🌐 <a href="https://onair.kbs.co.kr/" target="_blank">KBS 온에어</a> - 실시간 스트리밍</li>
                <li>🎥 <a href="https://www.afreecatv.com/" target="_blank">아프리카TV</a> - 개인 방송 및 스포츠 중계</li>
                <li>📺 <a href="https://webtv.dothome.co.kr/index.php" target="_blank">웹TV</a> - 한국 실시간 TV 모음</li>
            </ul>
            
            <h4>💡 활용 팁</h4>
            <ul>
                <li>✅ 여러 플랫폼을 번갈아 사용하여 광고 최소화</li>
                <li>✅ VPN 활용으로 해외 무료 채널 시청</li>
                <li>✅ 스마트TV 앱으로 큰 화면 시청</li>
                <li>✅ 모바일 앱으로 언제 어디서나 시청</li>
            </ul>`,
        action: "지금 바로 무료 플랫폼들을 확인해보세요!"
    },
    "지상파 무료 시청러": {
        title: "📺 지상파 무료 시청러",
        description: "지상파 방송을 무료로 안정적으로 시청하는 것이 최우선입니다.",
        badge: "📻",
        bgColor: "linear-gradient(45deg, #4ecdc4, #45b7d1)",
        summary: "KBS, MBC, SBS 등 지상파 채널을 무료로 고화질 시청할 수 있습니다.",
        details: `
            <h4>📺 무료 지상파 시청 방법</h4>
            <ul>
                <li>🌐 <a href="https://my.kbs.co.kr/" target="_blank">KBS my K</a> - 무료 실시간 방송 및 다시보기</li>
                <li>📱 <a href="https://www.imbc.com/" target="_blank">MBC 홈페이지</a> - PC/모바일 무료 시청</li>
                <li>📺 <a href="https://onair.sbs.co.kr/" target="_blank">SBS 온에어</a> - 실시간 방송 무료 제공</li>
                <li>🎬 <a href="https://www.ebs.co.kr/" target="_blank">EBS 온라인클래스</a> - 교육 방송 무료 시청</li>
                <li>📻 <a href="https://radio.kbs.co.kr/" target="_blank">KBS 라디오</a> - 다양한 라디오 채널</li>
                <li>📺 <a href="https://webtv.dothome.co.kr/index.php" target="_blank">웹TV</a> - 한국 실시간 TV 모음</li>
            </ul>
            
            <h4>🎯 최적화 방법</h4>
            <ul>
                <li>✅ 지상파 통합 시청 앱 설치</li>
                <li>✅ 크롬캐스트로 TV 화면 연결</li>
                <li>✅ 고화질 스트리밍을 위한 안정적 인터넷 연결</li>
                <li>✅ 다시보기 서비스 적극 활용</li>
            </ul>`,
        action: "지상파 무료 시청을 시작해보세요!"
    },
    "종합편성 애호가": {
        title: "🎪 종합편성 애호가",
        description: "JTBC, 채널A, MBN 등 종합편성채널을 선호하는 당신을 위한 가이드입니다.",
        badge: "🎭",
        bgColor: "linear-gradient(45deg, #764ba2, #667eea)",
        summary: "종합편성채널의 다양한 프로그램을 무료로 시청할 수 있는 방법들을 제공합니다.",
        details: `
            <h4>📺 종합편성 무료 시청</h4>
            <ul>
                <li>🎬 <a href="https://onair.jtbc.joins.com/" target="_blank">JTBC 온에어</a> - 드라마, 예능 무료 스트리밍</li>
                <li>📺 <a href="https://www.ichannela.com/" target="_blank">채널A 홈페이지</a> - 시사, 교양 프로그램</li>
                <li>📺 <a href="https://www.mbn.co.kr/" target="_blank">MBN 다시보기</a> - 뉴스, 시사 프로그램</li>
                <li>🎥 <a href="https://www.tvchosun.com/" target="_blank">TV조선 온라인</a> - 정치, 경제 프로그램</li>
                <li>� <a href="https://webtv.dothome.co.kr/index.php" target="_blank">웹TV</a> - 한국 실시간 TV 모음</li>
                <li>�📱 각 방송사 모바일 앱 활용</li>
            </ul>
            
            <h4>💰 절약 팁</h4>
            <ul>
                <li>✅ 무료 회원가입으로 추가 혜택</li>
                <li>✅ 프로그램별 개별 시청</li>
                <li>✅ 하이라이트 클립 우선 시청</li>
                <li>✅ 소셜미디어 공식 계정 팔로우</li>
            </ul>`,
        action: "종합편성 무료 시청을 경험해보세요!"
    },
    "케이블 무료 탐험가": {
        title: "🔍 케이블 무료 탐험가",
        description: "케이블 채널을 무료로 시청하는 다양한 방법을 찾는 탐험가입니다.",
        badge: "🗺️",
        bgColor: "linear-gradient(45deg, #ff8a80, #ff6b6b)",
        summary: "tvN, OCN, 스포츠 채널 등을 무료로 즐길 수 있는 합법적인 방법들을 안내합니다.",
        details: `
            <h4>🎬 케이블 무료 시청 방법</h4>
            <ul>
                <li>📺 <a href="https://www.youtube.com/c/tvNDRAMA" target="_blank">tvN 공식 유튜브</a> - 하이라이트 및 예고편</li>
                <li>🎥 <a href="https://www.ocn.co.kr/" target="_blank">OCN 홈페이지</a> - 선별된 영화 무료 제공</li>
                <li>⚽ <a href="https://sports.news.naver.com/" target="_blank">네이버 스포츠</a> - 스포츠 하이라이트</li>
                <li>🎭 <a href="https://www.comedytv.co.kr/" target="_blank">코미디TV</a> - 웹사이트 무료 다시보기</li>
                <li>🍳 <a href="https://www.olivetv.co.kr/" target="_blank">올리브</a> - 요리 프로그램 무료 시청</li>
                <li>📺 <a href="https://webtv.dothome.co.kr/index.php" target="_blank">웹TV</a> - 한국 실시간 TV 모음</li>
            </ul>
            
            <h4>🎯 스마트한 시청법</h4>
            <ul>
                <li>✅ 무료 체험 기간 적극 활용</li>
                <li>✅ 프로모션 이벤트 참여</li>
                <li>✅ 공식 SNS 팔로우로 무료 콘텐츠 확인</li>
                <li>✅ 파트너십 혜택 활용</li>
            </ul>`,
        action: "케이블 채널 무료 시청을 시작하세요!"
    },
    "글로벌 스트리머": {
        title: "🌍 글로벌 스트리머",
        description: "해외 콘텐츠와 글로벌 채널을 무료로 시청하는 방법을 찾는 글로벌 마인드 소유자입니다.",
        badge: "🛸",
        bgColor: "linear-gradient(45deg, #45b7d1, #96c93d)",
        summary: "전 세계 무료 스트리밍 서비스와 해외 채널을 합법적으로 시청할 수 있습니다.",
        details: `
            <h4>🌐 글로벌 무료 스트리밍</h4>
            <ul>
                <li>📺 <a href="https://tv.youtube.com/" target="_blank">YouTube TV</a> - 전 세계 뉴스 채널</li>
                <li>🎬 <a href="https://tubitv.com/" target="_blank">Tubi TV</a> - 해외 영화, 드라마 무료</li>
                <li>📺 <a href="https://pluto.tv/" target="_blank">Pluto TV</a> - 해외 라이브 채널</li>
                <li>🎥 <a href="https://www.imdb.com/tv/" target="_blank">IMDb TV</a> - 아마존 무료 스트리밍</li>
                <li>📻 <a href="https://tunein.com/" target="_blank">TuneIn Radio</a> - 전 세계 라디오</li>
                <li>📺 <a href="https://webtv.dothome.co.kr/index.php" target="_blank">웹TV</a> - 한국 실시간 TV 모음</li>
            </ul>
            
            <h4>🔧 활용 도구</h4>
            <ul>
                <li>✅ 무료 VPN 서비스 활용</li>
                <li>✅ 다국어 자막 지원 확인</li>
                <li>✅ 시차 고려한 라이브 시청</li>
                <li>✅ 모바일 앱 다운로드</li>
            </ul>`,
        action: "글로벌 무료 스트리밍을 탐험해보세요!"
    }
};

// 현재 질문 인덱스
let currentQuestion = 0;
let answers = {};

// 페이지 요소들
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const analysisPopup = document.getElementById('analysisPopup');

// 테스트 다시하기
function restartTest() {
    currentQuestion = 0;
    answers = {};
    
    resultPage.classList.add('hidden');
    startPage.classList.remove('hidden');
}

// 테스트 시작
function startTest() {
    startPage.classList.add('hidden');
    questionPage.classList.remove('hidden');
    showQuestion();
}

// 질문 표시
function showQuestion() {
    const question = questions[currentQuestion];
    const questionText = document.querySelector('.question-text');
    const answersGrid = document.querySelector('.answers-grid');
    const progressFill = document.querySelector('.progress-fill');
    const questionCounter = document.querySelector('.question-counter');
    
    questionText.textContent = question.question;
    questionCounter.textContent = `${currentQuestion + 1} / ${questions.length}`;
    
    // 진행률 업데이트
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    
    // 답변 버튼 생성
    answersGrid.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer.text;
        button.onclick = () => selectAnswer(index);
        answersGrid.appendChild(button);
    });
}

// 답변 선택
function selectAnswer(answerIndex) {
    const question = questions[currentQuestion];
    const selectedAnswer = question.answers[answerIndex];
    
    // 답변 저장
    answers[currentQuestion] = selectedAnswer;
    
    // 다음 질문 또는 결과 표시
    currentQuestion++;
    if (currentQuestion < questions.length) {
        setTimeout(() => {
            showQuestion();
        }, 300);
    } else {
        showAnalysis();
    }
}

// 분석 팝업 표시
function showAnalysis() {
    questionPage.classList.add('hidden');
    analysisPopup.classList.remove('hidden');
    
    let countdown = 5;
    const countdownDisplay = document.querySelector('.countdown-display');
    
    const timer = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);
    
    // 광고 로드
    setTimeout(() => {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }, 1000);
}

// 결과 분석 및 표시
function showResult() {
    analysisPopup.classList.add('hidden');
    resultPage.classList.remove('hidden');
    
    const result = analyzeAnswers();
    displayResult(result);
}

// 답변 분석
function analyzeAnswers() {
    let scores = {
        terrestrial: 0,
        general: 0,
        cable: 0,
        foreign: 0,
        tech: 0,
        convenience: 0,
        quality: 0
    };
    
    // 점수 계산
    Object.values(answers).forEach(answer => {
        Object.keys(answer).forEach(key => {
            if (scores.hasOwnProperty(key)) {
                scores[key] += answer[key] || 0;
            }
        });
    });
    
    // 최적 결과 타입 결정
    let resultType;
    if (scores.tech >= 12 && scores.convenience >= 10) {
        resultType = "무료 스트리밍 마스터";
    } else if (scores.terrestrial >= 3) {
        resultType = "지상파 무료 시청러";
    } else if (scores.general >= 3) {
        resultType = "종합편성 애호가";
    } else if (scores.cable >= 2) {
        resultType = "케이블 무료 탐험가";
    } else {
        resultType = "글로벌 스트리머";
    }
    
    return resultTypes[resultType];
}

// 결과 표시
function displayResult(result) {
    document.querySelector('.result-title').textContent = result.title;
    document.querySelector('.result-badge').textContent = result.badge;
    document.querySelector('.result-summary').textContent = result.summary;
    document.querySelector('.result-details').innerHTML = result.details;
    document.querySelector('.action-guide').innerHTML = `<strong>💫 ${result.action}</strong>`;
    
    // 카카오 공유 설정
    setupKakaoShare(result);
}

// 카카오 공유 설정
function setupKakaoShare(result) {
    const kakaoButtons = document.querySelectorAll('.kakao-share');
    
    kakaoButtons.forEach(button => {
        button.onclick = () => {
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: `나는 ${result.title}!`,
                    description: result.summary,
                    imageUrl: 'https://sd2624.github.io/실시간TV/tv.svg',
                    link: {
                        mobileWebUrl: 'https://sd2624.github.io/실시간TV/',
                        webUrl: 'https://sd2624.github.io/실시간TV/'
                    }
                },
                buttons: [
                    {
                        title: '나도 테스트하기',
                        link: {
                            mobileWebUrl: 'https://sd2624.github.io/실시간TV/',
                            webUrl: 'https://sd2624.github.io/실시간TV/'
                        }
                    }
                ]
            });
        };
    });
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 광고 초기화
    (adsbygoogle = window.adsbygoogle || []).push({});
});
