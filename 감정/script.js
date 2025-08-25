// 감정 테스트 전역 변수
let currentQuestion = 0;
let currentResultPage = 0;
let emotionScores = {};
let answers = [];
let testResult = null;

// 주요 광고 슬롯 ID (1-2개만 사용)
const primaryAdSlot = '8384240134';  // 메인 슬롯
const secondaryAdSlot = '4994254497'; // 보조 슬롯

// 카카오 SDK 초기화
function initKakao() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('3413c1beb87e9b2f3b7fce37dde67b4d');
        console.log('카카오 SDK 초기화 완료');
    }
}

// 광고 로드 함수 (리프레시 기능 포함)
function loadAd(slotId, containerId) {
    try {
        const adContainer = document.getElementById(containerId);
        if (adContainer) {
            // 기존 광고 제거
            adContainer.innerHTML = '';
            
            // 새 광고 삽입
            adContainer.innerHTML = `
                <ins class="adsbygoogle"
                     style="display:block; max-height:60px;"
                     data-ad-client="ca-pub-9374368296307755"
                     data-ad-slot="${slotId}"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>`;
            
            (adsbygoogle = window.adsbygoogle || []).push({});
            console.log(`광고 리프레시 완료: ${slotId} - ${containerId}`);
        }
    } catch (error) {
        console.error(`광고 로드 실패: ${slotId}`, error);
    }
}

// 광고 리프레시 함수
function refreshAd(containerId) {
    try {
        const adContainer = document.getElementById(containerId);
        if (adContainer) {
            // 현재 시간을 이용해 슬롯 선택 (메인/보조 교대 사용)
            const useSecondary = Math.floor(Date.now() / 10000) % 2 === 0;
            const slotId = useSecondary ? secondaryAdSlot : primaryAdSlot;
            
            // 기존 광고 완전 제거
            adContainer.innerHTML = '';
            
            // 잠시 후 새 광고 로드
            setTimeout(() => {
                loadAd(slotId, containerId);
            }, 100);
        }
    } catch (error) {
        console.error(`광고 리프레시 실패: ${containerId}`, error);
    }
}

// 초기 광고 로드
function initializeAds() {
    // 상단 광고만 초기 로드
    (adsbygoogle = window.adsbygoogle || []).push({});
}

// 설명 페이지 데이터
const explanations = [
    {
        title: "감정 테스트에 오신 것을 환영합니다",
        content: `
            <div class="explanation-content">
                <h2>🎭 감정 테스트란?</h2>
                <p>이 테스트는 당신의 현재 감정 상태와 감정 처리 방식을 분석합니다.</p>
                <ul>
                    <li>📊 과학적 근거에 기반한 20가지 질문</li>
                    <li>🎯 정확한 감정 유형 분석</li>
                    <li>💡 개인 맞춤형 감정 관리 조언</li>
                </ul>
            </div>
        `
    },
    {
        title: "테스트 진행 방법",
        content: `
            <div class="explanation-content">
                <h2>📝 진행 방법</h2>
                <p>각 질문에 대해 가장 가까운 답변을 선택해주세요.</p>
                <div class="tips">
                    <h3>💡 팁</h3>
                    <ul>
                        <li>첫 번째 직감을 믿고 답변하세요</li>
                        <li>너무 오래 고민하지 마세요</li>
                        <li>정답은 없으니 솔직하게 답변해주세요</li>
                    </ul>
                </div>
            </div>
        `
    },
    {
        title: "감정 유형 소개",
        content: `
            <div class="explanation-content">
                <h2>🌈 6가지 감정 유형</h2>
                <div class="emotion-types">
                    <div class="type-item">💚 <strong>평온형</strong> - 안정되고 차분한 감정</div>
                    <div class="type-item">❤️ <strong>열정형</strong> - 에너지 넘치는 감정</div>
                    <div class="type-item">💙 <strong>사색형</strong> - 깊이 있는 사고</div>
                    <div class="type-item">💛 <strong>활발형</strong> - 밝고 긍정적인 감정</div>
                    <div class="type-item">💜 <strong>감성형</strong> - 풍부한 감정 표현</div>
                    <div class="type-item">🖤 <strong>신중형</strong> - 신중하고 조심스러운 감정</div>
                </div>
            </div>
        `
    }
];

// 질문 데이터
const questions = [
    {
        text: "아침에 일어났을 때 가장 먼저 드는 생각은?",
        answers: [
            { text: "오늘 하루도 좋은 일이 있을 것 같아", type: "활발형", score: 3 },
            { text: "오늘 할 일들을 정리해보자", type: "신중형", score: 2 },
            { text: "조금 더 자고 싶다", type: "평온형", score: 2 },
            { text: "새로운 하루가 기대된다", type: "열정형", score: 3 }
        ]
    },
    {
        text: "친구와 갈등이 생겼을 때 당신의 반응은?",
        answers: [
            { text: "바로 해결하려고 대화를 시도한다", type: "열정형", score: 3 },
            { text: "시간을 두고 천천히 생각해본다", type: "사색형", score: 3 },
            { text: "감정이 상하지만 표현하지 않는다", type: "감성형", score: 2 },
            { text: "조심스럽게 상황을 파악한다", type: "신중형", score: 3 }
        ]
    },
    {
        text: "스트레스를 받을 때 주로 어떻게 해소하나요?",
        answers: [
            { text: "혼자만의 시간을 가진다", type: "사색형", score: 3 },
            { text: "친구들과 만나서 이야기한다", type: "활발형", score: 3 },
            { text: "음악을 듣거나 영화를 본다", type: "감성형", score: 3 },
            { text: "운동이나 취미활동을 한다", type: "열정형", score: 2 }
        ]
    },
    {
        text: "새로운 환경에 적응하는 당신의 스타일은?",
        answers: [
            { text: "빠르게 적응하고 새로운 관계를 만든다", type: "활발형", score: 3 },
            { text: "시간을 두고 천천히 적응한다", type: "신중형", score: 3 },
            { text: "관찰하며 상황을 파악한다", type: "사색형", score: 2 },
            { text: "적극적으로 참여하며 적응한다", type: "열정형", score: 3 }
        ]
    },
    {
        text: "감정적으로 힘들 때 가장 필요한 것은?",
        answers: [
            { text: "혼자만의 조용한 시간", type: "평온형", score: 3 },
            { text: "믿을 만한 사람과의 대화", type: "감성형", score: 3 },
            { text: "문제 해결을 위한 구체적인 행동", type: "열정형", score: 2 },
            { text: "상황을 객관적으로 분석하는 시간", type: "사색형", score: 3 }
        ]
    },
    {
        text: "행복한 순간을 표현하는 당신의 방식은?",
        answers: [
            { text: "주변 사람들과 기쁨을 나눈다", type: "활발형", score: 3 },
            { text: "조용히 혼자 만족감을 느낀다", type: "평온형", score: 3 },
            { text: "감동의 순간을 깊이 음미한다", type: "감성형", score: 3 },
            { text: "더 큰 목표를 향한 동력으로 삼는다", type: "열정형", score: 2 }
        ]
    },
    {
        text: "중요한 결정을 내릴 때 무엇을 가장 우선시하나요?",
        answers: [
            { text: "논리적 분석과 객관적 판단", type: "사색형", score: 3 },
            { text: "직감과 감정", type: "감성형", score: 3 },
            { text: "주변 사람들의 의견", type: "신중형", score: 2 },
            { text: "과감한 도전 정신", type: "열정형", score: 3 }
        ]
    },
    {
        text: "여가 시간에 가장 하고 싶은 활동은?",
        answers: [
            { text: "친구들과 함께하는 즐거운 활동", type: "활발형", score: 3 },
            { text: "혼자서 하는 독서나 영화 감상", type: "사색형", score: 3 },
            { text: "새로운 도전이나 모험", type: "열정형", score: 3 },
            { text: "편안하고 평화로운 휴식", type: "평온형", score: 3 }
        ]
    },
    {
        text: "다른 사람의 감정 변화를 어떻게 인식하나요?",
        answers: [
            { text: "표정이나 분위기로 빠르게 눈치챈다", type: "감성형", score: 3 },
            { text: "대화를 통해 파악하려고 한다", type: "활발형", score: 2 },
            { text: "행동 패턴을 관찰하며 분석한다", type: "사색형", score: 2 },
            { text: "직접 물어보거나 확인한다", type: "신중형", score: 3 }
        ]
    },
    {
        text: "실패나 좌절을 경험했을 때의 반응은?",
        answers: [
            { text: "빠르게 털어내고 다시 도전한다", type: "열정형", score: 3 },
            { text: "원인을 분석하고 교훈을 얻는다", type: "사색형", score: 3 },
            { text: "시간을 두고 마음을 다스린다", type: "평온형", score: 2 },
            { text: "감정적으로 받아들이고 공감을 구한다", type: "감성형", score: 3 }
        ]
    },
    {
        text: "팀 프로젝트에서 당신의 역할은?",
        answers: [
            { text: "분위기를 밝게 만드는 역할", type: "활발형", score: 3 },
            { text: "신중하게 계획을 세우는 역할", type: "신중형", score: 3 },
            { text: "아이디어를 제시하고 추진하는 역할", type: "열정형", score: 3 },
            { text: "팀원들의 의견을 조율하는 역할", type: "감성형", score: 2 }
        ]
    },
    {
        text: "감정이 복잡할 때 정리하는 방법은?",
        answers: [
            { text: "일기를 쓰거나 글로 표현한다", type: "감성형", score: 3 },
            { text: "산책이나 운동으로 기분전환한다", type: "활발형", score: 2 },
            { text: "명상이나 조용한 사색의 시간을 가진다", type: "평온형", score: 3 },
            { text: "논리적으로 분석하고 정리한다", type: "사색형", score: 3 }
        ]
    },
    {
        text: "타인과의 관계에서 가장 중요하게 생각하는 것은?",
        answers: [
            { text: "서로에 대한 이해와 공감", type: "감성형", score: 3 },
            { text: "즐겁고 유쾌한 시간 공유", type: "활발형", score: 3 },
            { text: "신뢰와 안정감", type: "신중형", score: 3 },
            { text: "서로의 성장을 위한 자극", type: "열정형", score: 2 }
        ]
    },
    {
        text: "예상치 못한 변화가 생겼을 때의 반응은?",
        answers: [
            { text: "흥미롭다고 생각하며 적응한다", type: "열정형", score: 3 },
            { text: "신중하게 상황을 분석한다", type: "사색형", score: 3 },
            { text: "불안하지만 차차 받아들인다", type: "신중형", score: 2 },
            { text: "변화에 대한 감정을 솔직히 표현한다", type: "감성형", score: 2 }
        ]
    },
    {
        text: "하루를 마무리할 때 드는 생각은?",
        answers: [
            { text: "오늘 하루 잘 보냈다는 만족감", type: "평온형", score: 3 },
            { text: "내일은 더 좋은 일이 있을 것이라는 기대", type: "활발형", score: 3 },
            { text: "오늘 있었던 일들을 되돌아본다", type: "사색형", score: 2 },
            { text: "하루 동안 느꼈던 감정들을 정리한다", type: "감성형", score: 3 }
        ]
    },
    {
        text: "목표를 달성했을 때의 기분은?",
        answers: [
            { text: "뿌듯함과 함께 다음 목표를 생각한다", type: "열정형", score: 3 },
            { text: "조용한 성취감을 느낀다", type: "평온형", score: 2 },
            { text: "과정에서 배운 것들을 정리한다", type: "사색형", score: 2 },
            { text: "기쁨을 주변 사람들과 나눈다", type: "활발형", score: 3 }
        ]
    },
    {
        text: "갈등 상황에서 당신의 해결 방식은?",
        answers: [
            { text: "감정적 공감대를 형성하려 한다", type: "감성형", score: 3 },
            { text: "논리적 해결책을 찾는다", type: "사색형", score: 3 },
            { text: "적극적으로 소통하며 해결한다", type: "열정형", score: 2 },
            { text: "신중하게 중재안을 모색한다", type: "신중형", score: 3 }
        ]
    },
    {
        text: "새로운 사람을 만날 때의 태도는?",
        answers: [
            { text: "먼저 다가가서 친근하게 대한다", type: "활발형", score: 3 },
            { text: "관찰하며 천천히 알아간다", type: "신중형", score: 3 },
            { text: "상대방의 감정 상태를 파악하려 한다", type: "감성형", score: 2 },
            { text: "자연스럽게 대화를 이어간다", type: "평온형", score: 2 }
        ]
    },
    {
        text: "인생에서 가장 중요하다고 생각하는 가치는?",
        answers: [
            { text: "도전과 성장", type: "열정형", score: 3 },
            { text: "평화와 안정", type: "평온형", score: 3 },
            { text: "진정성과 감정의 깊이", type: "감성형", score: 3 },
            { text: "지혜와 통찰력", type: "사색형", score: 3 }
        ]
    },
    {
        text: "완벽한 하루를 보내기 위해 필요한 것은?",
        answers: [
            { text: "사랑하는 사람들과의 시간", type: "활발형", score: 3 },
            { text: "개인적인 성찰과 사색의 시간", type: "사색형", score: 3 },
            { text: "마음의 평안과 여유", type: "평온형", score: 3 },
            { text: "의미 있는 성취나 진전", type: "열정형", score: 2 }
        ]
    }
];

// 감정 유형별 결과 데이터
const emotionResults = {
    "평온형": {
        title: "평온형 - 고요한 물처럼 안정된 감정",
        emoji: "💚",
        summary: "당신은 마음의 평안을 중시하며, 안정되고 차분한 감정 상태를 유지하는 타입입니다.",
        characteristics: [
            "감정의 기복이 적고 안정적입니다",
            "갈등 상황에서도 침착함을 유지합니다",
            "내면의 평화를 추구합니다",
            "조화로운 인간관계를 선호합니다"
        ],
        strengths: [
            "뛰어난 정서적 안정성",
            "스트레스 상황에서의 침착함",
            "타인에게 안정감을 제공",
            "지속적이고 꾸준한 노력"
        ],
        weaknesses: [
            "때로는 수동적으로 보일 수 있음",
            "변화에 대한 적응이 느릴 수 있음",
            "자신의 의견 표현이 부족할 수 있음"
        ],
        advice: [
            "가끔은 새로운 도전을 시도해보세요",
            "자신의 의견을 적극적으로 표현하는 연습을 하세요",
            "변화를 두려워하지 말고 점진적으로 받아들이세요",
            "당신의 안정감이 다른 사람들에게 큰 힘이 된다는 것을 기억하세요"
        ]
    },
    "열정형": {
        title: "열정형 - 타오르는 불꽃같은 에너지",
        emoji: "❤️",
        summary: "당신은 에너지가 넘치며 열정적으로 삶에 임하는 타입입니다.",
        characteristics: [
            "높은 에너지와 추진력을 가지고 있습니다",
            "목표 달성을 위해 적극적으로 행동합니다",
            "새로운 도전을 즐깁니다",
            "주변 사람들에게 동기부여를 제공합니다"
        ],
        strengths: [
            "강한 추진력과 실행력",
            "목표 지향적 사고",
            "리더십과 영향력",
            "빠른 회복력과 적응력"
        ],
        weaknesses: [
            "때로는 성급할 수 있음",
            "번아웃의 위험성",
            "세부사항을 놓칠 수 있음"
        ],
        advice: [
            "적절한 휴식과 재충전 시간을 가지세요",
            "세부적인 계획 수립에도 신경쓰세요",
            "타인의 속도를 배려하는 마음을 가지세요",
            "장기적인 관점에서 목표를 설정하세요"
        ]
    },
    "사색형": {
        title: "사색형 - 깊은 바다처럼 사려깊은 지혜",
        emoji: "💙",
        summary: "당신은 깊이 있게 생각하고 신중하게 판단하는 사색적인 타입입니다.",
        characteristics: [
            "논리적이고 분석적인 사고를 합니다",
            "깊이 있는 성찰을 즐깁니다",
            "신중한 의사결정을 내립니다",
            "지적 호기심이 강합니다"
        ],
        strengths: [
            "뛰어난 분석력과 통찰력",
            "신중하고 현명한 판단력",
            "깊이 있는 사고력",
            "문제 해결 능력"
        ],
        weaknesses: [
            "결정을 내리는데 시간이 오래 걸릴 수 있음",
            "과도한 분석으로 인한 행동 지연",
            "감정 표현이 부족할 수 있음"
        ],
        advice: [
            "때로는 직감을 믿고 빠른 결정을 내려보세요",
            "감정적인 측면도 고려하여 균형을 맞추세요",
            "분석뿐만 아니라 실행도 중요함을 기억하세요",
            "당신의 지혜를 다른 사람들과 나누세요"
        ]
    },
    "활발형": {
        title: "활발형 - 밝은 태양처럼 에너지 넘치는 마음",
        emoji: "💛",
        summary: "당신은 밝고 긍정적이며 활발한 에너지로 주변을 밝게 만드는 타입입니다.",
        characteristics: [
            "긍정적이고 밝은 성격입니다",
            "사교적이며 사람들과 어울리기를 좋아합니다",
            "활동적이고 역동적입니다",
            "유머감각이 뛰어납니다"
        ],
        strengths: [
            "뛰어난 사교성과 친화력",
            "긍정적인 에너지 전파",
            "팀워크와 협력 능력",
            "스트레스 해소 능력"
        ],
        weaknesses: [
            "때로는 깊이 있는 성찰이 부족할 수 있음",
            "혼자 있는 시간을 어려워할 수 있음",
            "집중력이 분산될 수 있음"
        ],
        advice: [
            "혼자만의 시간도 소중히 여기세요",
            "깊이 있는 사고와 성찰의 시간을 가지세요",
            "한 번에 한 가지 일에 집중하는 연습을 하세요",
            "당신의 긍정적인 에너지가 많은 사람들에게 힘이 됩니다"
        ]
    },
    "감성형": {
        title: "감성형 - 풍부한 무지개처럼 다채로운 감정",
        emoji: "💜",
        summary: "당신은 풍부한 감정과 깊은 공감 능력을 가진 감성적인 타입입니다.",
        characteristics: [
            "감정 표현이 풍부하고 솔직합니다",
            "타인의 감정을 잘 이해하고 공감합니다",
            "예술적 감각이 뛰어납니다",
            "진실된 관계를 추구합니다"
        ],
        strengths: [
            "뛰어난 공감 능력",
            "창의적이고 예술적 감각",
            "진실하고 깊은 인간관계",
            "감정적 치유 능력"
        ],
        weaknesses: [
            "감정의 기복이 클 수 있음",
            "타인의 감정에 과도하게 영향받을 수 있음",
            "객관적 판단이 어려울 수 있음"
        ],
        advice: [
            "감정과 이성의 균형을 맞추려 노력하세요",
            "자신만의 감정 정리 방법을 개발하세요",
            "경계를 설정하여 자신을 보호하세요",
            "당신의 공감 능력은 큰 장점임을 기억하세요"
        ]
    },
    "신중형": {
        title: "신중형 - 단단한 바위처럼 신뢰할 수 있는 마음",
        emoji: "🖤",
        summary: "당신은 신중하고 안정적이며 신뢰할 수 있는 성격의 소유자입니다.",
        characteristics: [
            "모든 일을 신중하게 고려합니다",
            "안정성과 확실성을 추구합니다",
            "책임감이 강합니다",
            "신뢰할 수 있는 사람입니다"
        ],
        strengths: [
            "뛰어난 책임감과 신뢰성",
            "안정적이고 일관된 행동",
            "리스크 관리 능력",
            "꾸준함과 인내력"
        ],
        weaknesses: [
            "새로운 시도를 주저할 수 있음",
            "변화에 대한 저항감",
            "때로는 과도하게 조심스러울 수 있음"
        ],
        advice: [
            "때로는 과감한 도전도 필요함을 기억하세요",
            "완벽을 추구하기보다는 진전에 집중하세요",
            "실패를 두려워하지 말고 경험으로 받아들이세요",
            "당신의 신중함이 많은 사람들에게 안정감을 줍니다"
        ]
    }
};

// 테스트 초기화
function initializeTest() {
    initKakao();
    initializeAds();
    resetTest();
    showCurrentPage();
}

// 테스트 리셋
function resetTest() {
    currentQuestion = 0;
    emotionScores = {
        "평온형": 0,
        "열정형": 0,
        "사색형": 0,
        "활발형": 0,
        "감성형": 0,
        "신중형": 0
    };
    answers = [];
}

// 현재 페이지 표시
function showCurrentPage() {
    const questionContent = document.getElementById('questionContent');
    const answersContainer = document.getElementById('answersContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // 진행률 업데이트
    const totalItems = explanations.length + questions.length;
    const progress = ((currentQuestion + 1) / totalItems) * 100;
    progressBar.style.width = progress + '%';
    progressText.textContent = `${currentQuestion + 1}/${totalItems}`;
    
    // 이전 버튼 표시 여부
    prevBtn.style.display = currentQuestion > 0 ? 'inline-block' : 'none';
    
    if (currentQuestion < explanations.length) {
        // 설명 페이지 표시
        const explanation = explanations[currentQuestion];
        questionContent.innerHTML = `
            <div class="explanation-page">
                <h1>${explanation.title}</h1>
                ${explanation.content}
            </div>
        `;
        answersContainer.innerHTML = '';
        nextBtn.textContent = '다음';
        nextBtn.disabled = false;
    } else {
        // 질문 페이지 표시
        const questionIndex = currentQuestion - explanations.length;
        const question = questions[questionIndex];
        
        questionContent.innerHTML = `
            <div class="question-page">
                <h2>${question.text}</h2>
            </div>
        `;
        
        // 답변 옵션 생성
        let answersHTML = '<div class="answers-grid">';
        question.answers.forEach((answer, index) => {
            answersHTML += `
                <button class="answer-btn" onclick="selectAnswer(${questionIndex}, ${index})">
                    ${answer.text}
                </button>
            `;
        });
        answersHTML += '</div>';
        answersContainer.innerHTML = answersHTML;
        
        nextBtn.textContent = questionIndex === questions.length - 1 ? '결과 보기' : '다음';
        nextBtn.disabled = true; // 답변 선택 전까지 비활성화
        
        // 중간 광고 표시 (10번째 질문 후)
        if (questionIndex === 10) {
            showMidAd();
        }
    }
    
    // 페이지 전환 시 광고 새로고침
    if (currentQuestion > 0) {
        refreshAds();
    }
}

// 답변 선택
function selectAnswer(questionIndex, answerIndex) {
    const question = questions[questionIndex];
    const selectedAnswer = question.answers[answerIndex];
    
    // 답변 저장
    answers[questionIndex] = selectedAnswer;
    
    // 점수 추가
    emotionScores[selectedAnswer.type] += selectedAnswer.score;
    
    // 선택된 답변 스타일 변경
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach((btn, index) => {
        btn.classList.remove('selected');
        if (index === answerIndex) {
            btn.classList.add('selected');
        }
        // 답변 선택 후 모든 버튼 비활성화
        btn.disabled = true;
    });
    
    // 다음 버튼 활성화
    document.getElementById('nextBtn').disabled = false;
    
    // 0.8초 후 자동으로 다음 질문으로 이동
    setTimeout(() => {
        nextQuestion();
    }, 800);
}

// 다음 질문/페이지
function nextQuestion() {
    if (currentQuestion < explanations.length + questions.length - 1) {
        currentQuestion++;
        showCurrentPage();
    } else {
        // 테스트 완료 - 결과 페이지로 이동
        calculateResult();
        window.location.href = 'result.html';
    }
}

// 이전 질문/페이지
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showCurrentPage();
    }
}

// 중간 광고 표시
function showMidAd() {
    const midAd = document.getElementById('adMid');
    if (midAd) {
        midAd.style.display = 'block';
        refreshAd('adMid');
    }
}

// 광고 새로고침 (페이지 전환 시)
function refreshAds() {
    // 상단 광고 새로고침
    refreshAd('adTop');
    
    // PC용 사이드 광고 새로고침
    if (window.innerWidth > 768) {
        refreshAd('sideAd');
    }
}

// 결과 계산
function calculateResult() {
    // 가장 높은 점수의 감정 유형 찾기
    let maxScore = 0;
    let resultType = "";
    
    for (const type in emotionScores) {
        if (emotionScores[type] > maxScore) {
            maxScore = emotionScores[type];
            resultType = type;
        }
    }
    
    testResult = emotionResults[resultType];
    
    // 결과를 로컬 스토리지에 저장
    localStorage.setItem('emotionTestResult', JSON.stringify(testResult));
    localStorage.setItem('emotionScores', JSON.stringify(emotionScores));
}

// 결과 페이지 초기화
function initializeResult() {
    initKakao();
    initializeAds();
    
    // 저장된 결과 불러오기
    const savedResult = localStorage.getItem('emotionTestResult');
    const savedScores = localStorage.getItem('emotionScores');
    
    if (savedResult) {
        testResult = JSON.parse(savedResult);
        emotionScores = JSON.parse(savedScores);
    } else {
        // 결과가 없으면 테스트 페이지로 리다이렉트
        window.location.href = 'question.html';
        return;
    }
    
    currentResultPage = 0;
    showResultPage();
}

// 결과 페이지 표시
function showResultPage() {
    const resultContent = document.getElementById('resultContent');
    const prevBtn = document.getElementById('prevResultBtn');
    const nextBtn = document.getElementById('nextResultBtn');
    const pageIndicator = document.getElementById('pageIndicator');
    const shareSection = document.getElementById('shareSection');
    
    // 페이지 인디케이터 업데이트
    pageIndicator.textContent = `${currentResultPage + 1}/6`;
    
    // 버튼 상태 업데이트
    prevBtn.style.display = currentResultPage > 0 ? 'inline-block' : 'none';
    nextBtn.style.display = currentResultPage < 5 ? 'inline-block' : 'none';
    shareSection.style.display = currentResultPage === 5 ? 'block' : 'none';
    
    // 결과 광고 숨기기
    document.querySelectorAll('.result-ad').forEach(ad => {
        ad.style.display = 'none';
    });
    
    let content = '';
    
    switch (currentResultPage) {
        case 0:
            // 메인 결과
            content = `
                <div class="result-main">
                    <div class="result-header">
                        <div class="result-emoji">${testResult.emoji}</div>
                        <h1>${testResult.title}</h1>
                        <p class="result-summary">${testResult.summary}</p>
                    </div>
                    
                    <div class="score-chart">
                        <h3>감정 유형별 점수</h3>
                        <div class="score-bars">
                            ${Object.entries(emotionScores).map(([type, score]) => {
                                const percentage = (score / Math.max(...Object.values(emotionScores))) * 100;
                                return `
                                    <div class="score-item">
                                        <span class="score-label">${type}</span>
                                        <div class="score-bar">
                                            <div class="score-fill" style="width: ${percentage}%"></div>
                                        </div>
                                        <span class="score-value">${score}점</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 1:
            // 특성
            content = `
                <div class="result-detail">
                    <h2>🎯 주요 특성</h2>
                    <ul class="characteristic-list">
                        ${testResult.characteristics.map(char => `<li>${char}</li>`).join('')}
                    </ul>
                </div>
            `;
            showResultAd(0);
            break;
            
        case 2:
            // 장점
            content = `
                <div class="result-detail">
                    <h2>✨ 장점</h2>
                    <ul class="strength-list">
                        ${testResult.strengths.map(strength => `<li>${strength}</li>`).join('')}
                    </ul>
                </div>
            `;
            showResultAd(1);
            break;
            
        case 3:
            // 단점
            content = `
                <div class="result-detail">
                    <h2>⚠️ 주의할 점</h2>
                    <ul class="weakness-list">
                        ${testResult.weaknesses.map(weakness => `<li>${weakness}</li>`).join('')}
                    </ul>
                </div>
            `;
            showResultAd(2);
            break;
            
        case 4:
            // 조언
            content = `
                <div class="result-detail">
                    <h2>💡 감정 관리 조언</h2>
                    <ul class="advice-list">
                        ${testResult.advice.map(advice => `<li>${advice}</li>`).join('')}
                    </ul>
                </div>
            `;
            showResultAd(3);
            break;
            
        case 5:
            // 마무리
            content = `
                <div class="result-final">
                    <h2>🌟 마무리</h2>
                    <div class="final-message">
                        <p>당신은 <strong>${testResult.title.split(' - ')[0]}</strong> 유형입니다.</p>
                        <p>모든 감정 유형은 각각 고유한 장점과 아름다움을 가지고 있습니다.</p>
                        <p>자신의 감정을 이해하고 받아들이는 것이 건강한 감정 관리의 첫걸음입니다.</p>
                        <div class="encouragement">
                            <p>💝 당신의 감정 그 자체로 충분히 소중합니다</p>
                        </div>
                    </div>
                </div>
            `;
            showResultAd(4);
            break;
    }
    
    resultContent.innerHTML = content;
}

// 결과 광고 표시 (리프레시 방식)
function showResultAd(adIndex) {
    const adId = `adResult${adIndex + 1}`;
    const adElement = document.getElementById(adId);
    if (adElement) {
        adElement.style.display = 'block';
        refreshAd(adId);
    }
}

// 다음 결과 페이지
function nextResultPage() {
    if (currentResultPage < 5) {
        currentResultPage++;
        showResultPage();
    }
}

// 이전 결과 페이지
function previousResultPage() {
    if (currentResultPage > 0) {
        currentResultPage--;
        showResultPage();
    }
}

// 카카오톡 공유
function shareToKakao() {
    if (!window.Kakao.isInitialized()) {
        initKakao();
    }
    
    window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: `감정 테스트 결과: ${testResult.title}`,
            description: testResult.summary,
            imageUrl: 'https://sd2624.github.io/감정/감정.png',
            link: {
                mobileWebUrl: 'https://sd2624.github.io/감정/',
                webUrl: 'https://sd2624.github.io/감정/'
            }
        },
        buttons: [
            {
                title: '나도 테스트하기',
                link: {
                    mobileWebUrl: 'https://sd2624.github.io/감정/',
                    webUrl: 'https://sd2624.github.io/감정/'
                }
            }
        ]
    });
}

// 테스트 다시하기
function retryTest() {
    localStorage.removeItem('emotionTestResult');
    localStorage.removeItem('emotionScores');
    window.location.href = 'index.html';
}
