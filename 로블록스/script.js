// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 광고 관리 클래스
class AdManager {
    constructor() {
        this.loadedAds = new Set();
        this.initIntersectionObserver();
    }

    // Intersection Observer 초기화
    initIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadAd(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
        }
    }

    // 광고 로드
    loadAd(adElement) {
        const adId = adElement.id;
        if (!this.loadedAds.has(adId)) {
            try {
                const adIns = adElement.querySelector('.adsbygoogle');
                if (adIns && !adIns.hasAttribute('data-adsbygoogle-status')) {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                    this.loadedAds.add(adId);
                    console.log(`광고 로드됨: ${adId}`);
                }
            } catch (error) {
                console.error(`광고 로드 실패 (${adId}):`, error);
            }
        }
    }

    // 광고 표시
    showAd(adId) {
        const adElement = document.getElementById(adId);
        if (adElement) {
            adElement.style.display = 'block';
            if (this.observer) {
                this.observer.observe(adElement);
            } else {
                // Intersection Observer를 지원하지 않는 경우 바로 로드
                this.loadAd(adElement);
            }
        }
    }

    // 광고 숨기기
    hideAd(adId) {
        const adElement = document.getElementById(adId);
        if (adElement) {
            adElement.style.display = 'none';
        }
    }

    // 모든 광고 숨기기
    hideAllAds() {
        ['ad-header', 'ad-middle', 'ad-result'].forEach(adId => {
            this.hideAd(adId);
        });
    }
}

// 광고 관리자 인스턴스 생성
const adManager = new AdManager();

// 질문 데이터
const questions = [
    {
        question: "로블록스 플레이 경력은 얼마나 되시나요?",
        answers: [
            { text: "1년 이상 베테랑", experience: "veteran", priority: 4 },
            { text: "6개월~1년", experience: "intermediate", priority: 3 },
            { text: "1~6개월", experience: "beginner", priority: 2 },
            { text: "이제 막 시작", experience: "newbie", priority: 1 }
        ]
    },
    {
        question: "주로 어떤 게임을 플레이하시나요?",
        answers: [
            { text: "어드벤처/RPG 게임", genre: "adventure", type: "items" },
            { text: "시뮬레이션 게임", genre: "simulation", type: "robux" },
            { text: "액션/PvP 게임", genre: "action", type: "cosmetic" },
            { text: "다양하게 플레이", genre: "various", type: "mixed" }
        ]
    },
    {
        question: "현재 보유한 로벅스는 얼마나 되나요?",
        answers: [
            { text: "1000 로벅스 이상", robux: "rich", need: 1 },
            { text: "100~1000 로벅스", robux: "moderate", need: 2 },
            { text: "10~100 로벅스", robux: "poor", need: 3 },
            { text: "거의 없음 (10 미만)", robux: "broke", need: 4 }
        ]
    },
    {
        question: "로벅스를 주로 어디에 사용하시나요?",
        answers: [
            { text: "아바타 꾸미기 (의상/액세서리)", spending: "avatar", preference: "cosmetic" },
            { text: "게임패스 구매", spending: "gamepass", preference: "gameplay" },
            { text: "개발자 상품 구매", spending: "developer", preference: "support" },
            { text: "잘 사용하지 않음", spending: "save", preference: "hoarder" }
        ]
    },
    {
        question: "프로모션 코드 입력 경험이 있나요?",
        answers: [
            { text: "자주 입력해봄", code_exp: "expert", tech: 4 },
            { text: "몇 번 해봄", code_exp: "intermediate", tech: 3 },
            { text: "한두 번 해봄", code_exp: "beginner", tech: 2 },
            { text: "한 번도 없음", code_exp: "newbie", tech: 1 }
        ]
    },
    {
        question: "소셜미디어 활동은 어느 정도인가요?",
        answers: [
            { text: "매일 적극적으로", social: "active", engagement: 4 },
            { text: "가끔 확인", social: "moderate", engagement: 3 },
            { text: "거의 안 함", social: "passive", engagement: 2 },
            { text: "전혀 안 함", social: "none", engagement: 1 }
        ]
    },
    {
        question: "새로운 이벤트에 대한 관심도는?",
        answers: [
            { text: "항상 최신 정보 확인", interest: "high", activity: 4 },
            { text: "가끔 확인", interest: "medium", activity: 3 },
            { text: "우연히 알게 되면", interest: "low", activity: 2 },
            { text: "별로 관심 없음", interest: "none", activity: 1 }
        ]
    },
    {
        question: "어떤 방식의 혜택을 선호하시나요?",
        answers: [
            { text: "즉시 받을 수 있는 혜택", reward_type: "instant", patience: 1 },
            { text: "미션 완료 후 혜택", reward_type: "mission", patience: 3 },
            { text: "이벤트 참여 혜택", reward_type: "event", patience: 2 },
            { text: "무엇이든 상관없음", reward_type: "any", patience: 4 }
        ]
    }
];

// 결과 타입 정의
const resultTypes = {
    "프로모션 코드 마스터": {
        title: "🏆 프로모션 코드 마스터",
        description: "축하합니다! 당신은 로블록스 프로모션 코드의 최고 전문가입니다.",
        badge: "👑",
        bgColor: "linear-gradient(45deg, #00b4d8, #0077b6)",
        summary: "다양한 프로모션 코드와 이벤트를 통해 최대한의 혜택을 누릴 수 있습니다.",
        details: `
            <h4>🎯 최신 프로모션 코드</h4>
            <ul>
                <li>💎 <a href="https://www.roblox.com/promocodes" target="_blank">로블록스 공식 프로모코드</a> - 정기 업데이트</li>
                <li>🎁 <a href="https://twitter.com/Roblox" target="_blank">로블록스 공식 트위터</a> - 한정 코드 발표</li>
                <li>📺 <a href="https://www.youtube.com/user/roblox" target="_blank">로블록스 유튜브</a> - 이벤트 코드 공개</li>
                <li>🎮 <a href="https://developer.roblox.com/" target="_blank">로블록스 개발자 허브</a> - 개발자 전용 혜택</li>
                <li>🌟 <a href="https://blog.roblox.com/" target="_blank">로블록스 공식 블로그</a> - 업데이트 정보</li>
            </ul>
            
            <h4>💡 고급 획득 팁</h4>
            <ul>
                <li>✅ 로블록스 이벤트 페이지 정기 확인</li>
                <li>✅ 파트너 브랜드 협업 이벤트 참여</li>
                <li>✅ 로블록스 개발자 컨퍼런스 참석</li>
                <li>✅ 커뮤니티 이벤트 적극 참여</li>
            </ul>`,
        action: "최신 프로모션 코드를 지금 확인하세요!"
    },
    "이벤트 헌터": {
        title: "🎪 이벤트 헌터",
        description: "로블록스 이벤트와 특별 프로모션을 찾아내는 전문가입니다.",
        badge: "🎯",
        bgColor: "linear-gradient(45deg, #0077b6, #023e8a)",
        summary: "다양한 이벤트를 통해 독점 아이템과 로벅스를 획득할 수 있습니다.",
        details: `
            <h4>🎉 현재 진행 중인 이벤트</h4>
            <ul>
                <li>🎊 <a href="https://www.roblox.com/events" target="_blank">로블록스 공식 이벤트</a> - 계절별 특별 이벤트</li>
                <li>🎬 <a href="https://www.roblox.com/catalog" target="_blank">영화/애니메이션 콜라보</a> - 한정 아이템</li>
                <li>🎵 <a href="https://www.roblox.com/concerts" target="_blank">버추얼 콘서트</a> - 음악 이벤트</li>
                <li>🏆 <a href="https://developer.roblox.com/en-us/articles/developer-challenges" target="_blank">개발자 챌린지</a> - 창작 이벤트</li>
                <li>📱 <a href="https://www.roblox.com/premium" target="_blank">프리미엄 혜택</a> - 월간 로벅스</li>
            </ul>
            
            <h4>🎯 이벤트 참여 전략</h4>
            <ul>
                <li>✅ 이벤트 캘린더 정기 확인</li>
                <li>✅ 소셜미디어 알림 설정</li>
                <li>✅ 커뮤니티 정보 공유 참여</li>
                <li>✅ 이벤트 미션 완료</li>
            </ul>`,
        action: "진행 중인 이벤트를 확인해보세요!"
    },
    "코드 수집가": {
        title: "📋 코드 수집가",
        description: "프로모션 코드를 체계적으로 수집하고 관리하는 스타일입니다.",
        badge: "📚",
        bgColor: "linear-gradient(45deg, #023e8a, #001d3d)",
        summary: "모든 유효한 프로모션 코드를 놓치지 않고 수집하여 혜택을 극대화합니다.",
        details: `
            <h4>📝 코드 수집 사이트</h4>
            <ul>
                <li>🔍 <a href="https://www.rbxcodes.com/" target="_blank">RBX Codes</a> - 최신 코드 모음</li>
                <li>📱 <a href="https://robloxcodes.net/" target="_blank">Roblox Codes</a> - 코드 검증 사이트</li>
                <li>🎮 <a href="https://www.robloxpromocodes.com/" target="_blank">프로모코드 전문 사이트</a></li>
                <li>💬 <a href="https://discord.gg/roblox" target="_blank">로블록스 디스코드</a> - 커뮤니티 정보</li>
                <li>📰 <a href="https://www.gamepur.com/roblox" target="_blank">게임 뉴스 사이트</a> - 코드 소식</li>
            </ul>
            
            <h4>🗂️ 체계적 관리법</h4>
            <ul>
                <li>✅ 코드 입력 기록 관리</li>
                <li>✅ 만료일 추적</li>
                <li>✅ 새 코드 알림 설정</li>
                <li>✅ 친구들과 정보 공유</li>
            </ul>`,
        action: "체계적인 코드 수집을 시작하세요!"
    },
    "소셜 네트워커": {
        title: "🌐 소셜 네트워커",
        description: "소셜미디어를 통해 프로모션 정보를 빠르게 입수하는 전문가입니다.",
        badge: "📱",
        bgColor: "linear-gradient(45deg, #90e0ef, #00b4d8)",
        summary: "소셜미디어 네트워크를 활용하여 가장 빠르게 프로모션 정보를 획득합니다.",
        details: `
            <h4>📱 소셜미디어 채널</h4>
            <ul>
                <li>🐦 <a href="https://twitter.com/Roblox" target="_blank">로블록스 트위터</a> - 실시간 업데이트</li>
                <li>📘 <a href="https://www.facebook.com/roblox" target="_blank">로블록스 페이스북</a> - 공식 소식</li>
                <li>📸 <a href="https://www.instagram.com/roblox/" target="_blank">로블록스 인스타그램</a> - 비하인드 컨텐츠</li>
                <li>🎵 <a href="https://www.tiktok.com/@roblox" target="_blank">로블록스 틱톡</a> - 트렌드 정보</li>
                <li>💬 <a href="https://www.reddit.com/r/roblox/" target="_blank">로블록스 레딧</a> - 커뮤니티 토론</li>
            </ul>
            
            <h4>🚀 소셜 활용 전략</h4>
            <ul>
                <li>✅ 알림 설정으로 실시간 정보 확인</li>
                <li>✅ 인플루언서 팔로우</li>
                <li>✅ 커뮤니티 활동 참여</li>
                <li>✅ 정보 공유로 네트워크 확장</li>
            </ul>`,
        action: "소셜미디어에서 최신 정보를 확인하세요!"
    },
    "신규 플레이어": {
        title: "🌱 신규 플레이어",
        description: "로블록스를 이제 막 시작한 당신을 위한 완벽한 가이드입니다.",
        badge: "🎮",
        bgColor: "linear-gradient(45deg, #caf0f8, #90e0ef)",
        summary: "로블록스 초보자도 쉽게 따라할 수 있는 프로모션 코드 입력 방법을 안내합니다.",
        details: `
            <h4>📚 초보자 가이드</h4>
            <ul>
                <li>🎯 <a href="https://www.roblox.com/promocodes" target="_blank">프로모코드 입력 페이지</a> - 기본 사용법</li>
                <li>📖 <a href="https://en.help.roblox.com/hc/en-us" target="_blank">로블록스 도움말</a> - 완전 초보 가이드</li>
                <li>🎬 <a href="https://www.youtube.com/results?search_query=roblox+promo+codes+2025" target="_blank">유튜브 튜토리얼</a> - 영상 가이드</li>
                <li>💡 <a href="https://www.roblox.com/develop" target="_blank">로블록스 스튜디오</a> - 게임 개발 시작</li>
                <li>👥 <a href="https://www.roblox.com/groups" target="_blank">로블록스 그룹</a> - 커뮤니티 참여</li>
            </ul>
            
            <h4>🚀 시작 단계</h4>
            <ul>
                <li>✅ 계정 설정 완료</li>
                <li>✅ 첫 번째 프로모코드 입력</li>
                <li>✅ 무료 아이템 수령</li>
                <li>✅ 친구 추가 및 그룹 가입</li>
            </ul>`,
        action: "로블록스 여행을 시작해보세요!"
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
    
    // 광고 숨기기
    adManager.hideAllAds();
    
    resultPage.classList.add('hidden');
    startPage.classList.remove('hidden');
}

// 테스트 시작
function startTest() {
    startPage.classList.add('hidden');
    questionPage.classList.remove('hidden');
    
    // 헤더 광고 표시
    adManager.showAd('ad-header');
    
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
    
    // 3번째 질문 이후 중간 광고 표시
    if (currentQuestion >= 2) {
        adManager.showAd('ad-middle');
    }
    
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
}

// 결과 분석 및 표시
function showResult() {
    analysisPopup.classList.add('hidden');
    resultPage.classList.remove('hidden');
    
    // 결과 페이지 광고 표시
    adManager.showAd('ad-result');
    
    const result = analyzeAnswers();
    displayResult(result);
}

// 답변 분석
function analyzeAnswers() {
    let scores = {
        experience: 0,
        tech: 0,
        social: 0,
        activity: 0,
        need: 0
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
    if (scores.experience >= 3 && scores.tech >= 12) {
        resultType = "프로모션 코드 마스터";
    } else if (scores.activity >= 12 && scores.social >= 8) {
        resultType = "이벤트 헌터";
    } else if (scores.experience >= 2 && scores.need >= 8) {
        resultType = "코드 수집가";
    } else if (scores.social >= 10) {
        resultType = "소셜 네트워커";
    } else {
        resultType = "신규 플레이어";
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
                    imageUrl: 'https://sd2624.github.io/로블록스/roblox.svg',
                    link: {
                        mobileWebUrl: 'https://sd2624.github.io/로블록스/',
                        webUrl: 'https://sd2624.github.io/로블록스/'
                    }
                },
                buttons: [
                    {
                        title: '나도 테스트하기',
                        link: {
                            mobileWebUrl: 'https://sd2624.github.io/로블록스/',
                            webUrl: 'https://sd2624.github.io/로블록스/'
                        }
                    }
                ]
            });
        };
    });
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 헤더 광고를 즉시 표시하지 않고 테스트 시작 시에만 표시
    console.log('DOM 로드 완료 - AdManager 준비됨');
});
