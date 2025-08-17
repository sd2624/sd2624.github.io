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





Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 데이터
const questions = [
    {
        question: "이성과의 첫 만남에서 당신의 행동은?",
        answers: [
            { text: "적극적으로 말을 걸고 이끈다", agen: 3, teto: 0 },
            { text: "자연스럽게 대화를 시작한다", agen: 2, teto: 1 },
            { text: "상대방이 말을 걸 때까지 기다린다", agen: 0, teto: 2 },
            { text: "수줍어하며 소극적으로 행동한다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인과의 데이트 계획을 세울 때?",
        answers: [
            { text: "내가 모든 계획을 세우고 주도한다", agen: 3, teto: 0 },
            { text: "함께 의논해서 계획을 세운다", agen: 2, teto: 1 },
            { text: "상대방 의견을 먼저 물어본다", agen: 1, teto: 2 },
            { text: "상대방이 계획해주길 바란다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "갈등 상황에서 당신의 태도는?",
        answers: [
            { text: "직접적으로 문제를 제기하고 해결한다", agen: 3, teto: 0 },
            { text: "차근차근 대화로 풀어간다", agen: 2, teto: 1 },
            { text: "시간을 두고 천천히 접근한다", agen: 1, teto: 2 },
            { text: "회피하거나 참고 넘어간다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "친구들 사이에서 당신의 포지션은?",
        answers: [
            { text: "리더 역할을 하며 분위기를 이끈다", agen: 3, teto: 0 },
            { text: "활발하게 참여하고 의견을 낸다", agen: 2, teto: 1 },
            { text: "조용히 따라가며 분위기를 맞춘다", agen: 1, teto: 2 },
            { text: "주로 듣는 역할을 한다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "좋아하는 사람에게 고백할 때?",
        answers: [
            { text: "직접적이고 확실하게 표현한다", agen: 3, teto: 0 },
            { text: "로맨틱한 분위기에서 고백한다", agen: 2, teto: 1 },
            { text: "은근한 신호를 보내며 눈치를 본다", agen: 1, teto: 2 },
            { text: "상대방이 먼저 표현하길 기다린다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "스트레스를 받을 때 해소 방법은?",
        answers: [
            { text: "운동이나 활동적인 것으로 해소", agen: 3, teto: 0 },
            { text: "친구들과 만나서 수다떨기", agen: 2, teto: 1 },
            { text: "혼자만의 시간을 가지며 정리", agen: 1, teto: 2 },
            { text: "조용히 휴식을 취한다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "새로운 환경에 적응하는 방식은?",
        answers: [
            { text: "빠르게 적응하고 주도권을 잡는다", agen: 3, teto: 0 },
            { text: "점차 관계를 넓혀가며 적응한다", agen: 2, teto: 1 },
            { text: "천천히 관찰하며 조심스럽게 적응", agen: 1, teto: 2 },
            { text: "적응하기까지 오랜 시간이 필요", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인에게 바라는 관계는?",
        answers: [
            { text: "내가 주도하고 상대방이 따라오는 관계", agen: 3, teto: 0 },
            { text: "서로 대등하고 균형 잡힌 관계", agen: 2, teto: 1 },
            { text: "서로 배려하고 양보하는 관계", agen: 1, teto: 2 },
            { text: "상대방이 나를 보호해주는 관계", agen: 0, teto: 3 }
        ]
    },
    {
        question: "의사결정을 할 때 당신의 스타일은?",
        answers: [
            { text: "빠르고 확신에 찬 결정을 한다", agen: 3, teto: 0 },
            { text: "정보를 수집한 후 합리적으로 결정", agen: 2, teto: 1 },
            { text: "여러 사람의 의견을 들어본다", agen: 1, teto: 2 },
            { text: "결정을 미루거나 다른 사람에게 맡긴다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "파티나 모임에서 당신의 모습은?",
        answers: [
            { text: "중심에서 분위기를 주도한다", agen: 3, teto: 0 },
            { text: "적극적으로 참여하고 즐긴다", agen: 2, teto: 1 },
            { text: "조용히 관찰하며 적당히 참여", agen: 1, teto: 2 },
            { text: "구석에서 조용히 있는다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인과의 스킨십에 대한 당신의 성향은?",
        answers: [
            { text: "적극적으로 먼저 시도한다", agen: 3, teto: 0 },
            { text: "자연스럽게 분위기에 맞춰 한다", agen: 2, teto: 1 },
            { text: "상대방의 반응을 보며 조심스럽게", agen: 1, teto: 2 },
            { text: "수줍어하며 소극적이다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "어려운 일이 생겼을 때 당신의 반응은?",
        answers: [
            { text: "정면돌파로 적극적으로 해결", agen: 3, teto: 0 },
            { text: "계획을 세워 차근차근 해결", agen: 2, teto: 1 },
            { text: "주변에 도움을 요청한다", agen: 1, teto: 2 },
            { text: "회피하거나 포기하고 싶어진다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "이성에게 어필하는 당신만의 매력은?",
        answers: [
            { text: "강한 카리스마와 리더십", agen: 3, teto: 0 },
            { text: "밝고 긍정적인 에너지", agen: 2, teto: 1 },
            { text: "따뜻하고 배려심 깊은 성격", agen: 1, teto: 2 },
            { text: "순수하고 신비로운 매력", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인과 의견이 다를 때 당신의 행동은?",
        answers: [
            { text: "내 의견을 관철시키려 노력한다", agen: 3, teto: 0 },
            { text: "서로의 의견을 조율하려 한다", agen: 2, teto: 1 },
            { text: "상대방 의견을 존중하며 맞춘다", agen: 1, teto: 2 },
            { text: "갈등을 피하고 양보한다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "이상형에 대한 당신의 기준은?",
        answers: [
            { text: "나를 존중하고 따라주는 사람", agen: 3, teto: 0 },
            { text: "서로 발전시켜주는 파트너", agen: 2, teto: 1 },
            { text: "나를 아껴주고 보살펴주는 사람", agen: 1, teto: 2 },
            { text: "나를 보호하고 이끌어주는 사람", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인과 싸웠을 때 화해하는 방법은?",
        answers: [
            { text: "먼저 적극적으로 화해를 시도한다", agen: 3, teto: 0 },
            { text: "솔직하게 대화로 해결한다", agen: 2, teto: 1 },
            { text: "시간을 두고 자연스럽게 풀어간다", agen: 1, teto: 2 },
            { text: "상대방이 먼저 다가올 때까지 기다린다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "새로운 사람들과의 첫 모임에서?",
        answers: [
            { text: "먼저 자기소개하고 분위기를 주도", agen: 3, teto: 0 },
            { text: "밝게 인사하고 적극적으로 참여", agen: 2, teto: 1 },
            { text: "조용히 관찰하며 천천히 어울림", agen: 1, teto: 2 },
            { text: "말을 걸어줄 때까지 소극적으로 대기", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인의 친구들과 처음 만날 때?",
        answers: [
            { text: "활발하게 대화하며 친해지려 노력", agen: 3, teto: 0 },
            { text: "자연스럽게 어울리며 좋은 인상 남기기", agen: 2, teto: 1 },
            { text: "예의 바르게 행동하며 조심스럽게 접근", agen: 1, teto: 2 },
            { text: "연인 뒤에 숨어서 말수 적게 행동", agen: 0, teto: 3 }
        ]
    },
    {
        question: "데이트 중 예상치 못한 상황이 발생하면?",
        answers: [
            { text: "즉석에서 새로운 계획을 세운다", agen: 3, teto: 0 },
            { text: "침착하게 대안을 찾아본다", agen: 2, teto: 1 },
            { text: "연인과 상의해서 결정한다", agen: 1, teto: 2 },
            { text: "당황하며 연인에게 의존한다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인이 다른 이성과 친하게 지내는 것을 봤을 때?",
        answers: [
            { text: "직접 이야기해서 명확히 한다", agen: 3, teto: 0 },
            { text: "차분히 대화로 감정을 표현한다", agen: 2, teto: 1 },
            { text: "속마음을 숨기고 지켜본다", agen: 1, teto: 2 },
            { text: "혼자 속상해하며 참는다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인에게 깜짝 선물을 준비할 때?",
        answers: [
            { text: "임팩트 있는 서프라이즈를 기획한다", agen: 3, teto: 0 },
            { text: "상대방이 좋아할 만한 걸 직접 선택", agen: 2, teto: 1 },
            { text: "주변 사람들에게 조언을 구한다", agen: 1, teto: 2 },
            { text: "무엇을 해야 할지 몰라 고민만 한다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인의 가족을 처음 만날 때?",
        answers: [
            { text: "당당하고 자신감 있게 인사한다", agen: 3, teto: 0 },
            { text: "정중하고 예의 바르게 행동한다", agen: 2, teto: 1 },
            { text: "조심스럽게 눈치를 보며 행동", agen: 1, teto: 2 },
            { text: "긴장해서 말도 제대로 못한다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인과의 미래에 대해 이야기할 때?",
        answers: [
            { text: "구체적인 계획을 제시하며 이끈다", agen: 3, teto: 0 },
            { text: "서로의 생각을 나누며 계획한다", agen: 2, teto: 1 },
            { text: "연인의 의견을 먼저 듣고 맞춘다", agen: 1, teto: 2 },
            { text: "구체적인 계획은 연인에게 맡긴다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인이 힘들어할 때 당신의 방식은?",
        answers: [
            { text: "적극적으로 해결책을 제시한다", agen: 3, teto: 0 },
            { text: "따뜻하게 위로하며 함께 해결", agen: 2, teto: 1 },
            { text: "조용히 곁에서 지켜봐준다", agen: 1, teto: 2 },
            { text: "어떻게 해야 할지 몰라 당황한다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인과의 기념일 계획을 세울 때?",
        answers: [
            { text: "특별한 이벤트를 기획해서 놀래킨다", agen: 3, teto: 0 },
            { text: "둘만의 로맨틱한 시간을 계획", agen: 2, teto: 1 },
            { text: "연인이 좋아할 만한 걸 조심스럽게 준비", agen: 1, teto: 2 },
            { text: "연인이 계획해주길 은근히 바란다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인과의 취미활동을 선택할 때?",
        answers: [
            { text: "내가 좋아하는 활동을 제안한다", agen: 3, teto: 0 },
            { text: "서로 관심 있는 것을 찾아본다", agen: 2, teto: 1 },
            { text: "연인이 좋아하는 것을 우선시한다", agen: 1, teto: 2 },
            { text: "연인이 결정해주길 기다린다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인에게 관심을 표현하는 방식은?",
        answers: [
            { text: "직접적이고 확실하게 표현한다", agen: 3, teto: 0 },
            { text: "다양한 방법으로 자연스럽게 표현", agen: 2, teto: 1 },
            { text: "은은하고 섬세하게 표현한다", agen: 1, teto: 2 },
            { text: "표현하기 어려워서 망설인다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인과 여행을 갈 때 당신의 역할은?",
        answers: [
            { text: "전체 일정을 계획하고 이끈다", agen: 3, teto: 0 },
            { text: "함께 계획하고 역할을 나눈다", agen: 2, teto: 1 },
            { text: "연인을 도우며 서포트 역할", agen: 1, teto: 2 },
            { text: "연인이 모든 걸 해주길 바란다", agen: 0, teto: 3 }
        ]
    },
    {
        question: "연인이 질투할 만한 상황에서?",
        answers: [
            { text: "당당하게 내 행동을 설명한다", agen: 3, teto: 0 },
            { text: "차근차근 오해를 풀어준다", agen: 2, teto: 1 },
            { text: "조심스럽게 연인 기분을 맞춰준다", agen: 1, teto: 2 },
            { text: "위축되고 어떻게 해야 할지 모른다", agen: 0, teto: 3 }
        ]
    }
];

// 성별 질문 (마지막에 추가)
const genderQuestion = {
    question: "당신의 성별은?",
    answers: [
        { text: "남성", gender: "male" },
        { text: "여성", gender: "female" }
    ]
};

// 결과 데이터
const results = {
    agen_male: {
        title: "💪 에겐남 (Alpha Male)",
        description: "당신은 주도적이고 카리스마 넘치는 에겐남입니다! 모든 상황에서 리더십을 발휘하며, 자신감 있고 적극적인 성격의 소유자입니다.",
        characteristics: "• 강한 리더십과 추진력\n• 결정력이 빠르고 확신에 참\n• 연인 관계에서 주도권을 가짐\n• 목표 지향적이고 성취욕이 강함\n• 도전을 두려워하지 않음",
        loveStyle: "연애에서는 적극적으로 어프로치하며, 연인을 보호하고 이끌어가는 스타일입니다. 로맨틱한 이벤트를 기획하고 서프라이즈를 좋아합니다.",
        compatibility: "테토녀와 가장 잘 맞으며, 서로 보완적인 관계를 형성할 수 있습니다.",
        icon: "💪",
        bgColor: "linear-gradient(135deg, #e17055, #d63031)",
        advice: "때로는 상대방의 의견도 경청하고, 너무 강하게 나가지 않도록 주의하세요."
    },
    teto_male: {
        title: "🌙 테토남 (Gentle Male)",
        description: "당신은 차분하고 배려심 깊은 테토남입니다! 조용하지만 깊이 있는 매력으로 사람들에게 안정감을 주는 성격입니다.",
        characteristics: "• 차분하고 신중한 성격\n• 배려심이 깊고 공감능력이 뛰어남\n• 갈등을 피하고 평화를 추구\n• 내적 성장과 자기계발에 관심\n• 진실한 관계를 중요시함",
        loveStyle: "연애에서는 천천히 깊어지는 관계를 선호하며, 연인의 마음을 세심하게 헤아리는 스타일입니다. 진심 어린 대화와 정서적 교감을 중시합니다.",
        compatibility: "에겐녀와 잘 어울리며, 서로의 에너지를 균형있게 맞춰갈 수 있습니다.",
        icon: "🌙",
        bgColor: "linear-gradient(135deg, #6c5ce7, #a29bfe)",
        advice: "때로는 더 적극적으로 자신의 의견을 표현하고, 주도력을 발휘해보세요."
    },
    agen_female: {
        title: "✨ 에겐녀 (Alpha Female)",
        description: "당신은 활발하고 독립적인 에겐녀입니다! 자신만의 주관이 뚜렷하며, 밝고 긍정적인 에너지로 주변을 밝게 만드는 매력적인 여성입니다.",
        characteristics: "• 독립적이고 자주적인 성격\n• 밝고 활발한 에너지\n• 사교적이며 친화력이 좋음\n• 자신의 목표와 꿈이 분명함\n• 솔직하고 직설적인 표현",
        loveStyle: "연애에서는 대등한 관계를 추구하며, 함께 성장하고 발전하는 파트너십을 원합니다. 자신의 감정을 솔직하게 표현하는 스타일입니다.",
        compatibility: "테토남과 좋은 궁합을 보이며, 서로 다른 매력으로 보완하는 관계가 됩니다.",
        icon: "✨",
        bgColor: "linear-gradient(135deg, #fd79a8, #e84393)",
        advice: "때로는 상대방을 배려하고, 부드러운 표현 방식도 시도해보세요."
    },
    teto_female: {
        title: "🌸 테토녀 (Gentle Female)",
        description: "당신은 순수하고 따뜻한 테토녀입니다! 부드럽고 배려심 깊은 성격으로 주변 사람들에게 편안함과 힐링을 주는 매력적인 여성입니다.",
        characteristics: "• 순수하고 따뜻한 마음\n• 배려심이 깊고 섬세함\n• 조화와 평화를 추구\n• 감수성이 풍부하고 공감능력이 뛰어남\n• 겸손하고 예의바른 성격",
        loveStyle: "연애에서는 깊고 진실한 감정을 중시하며, 상대방을 아끼고 보살피는 것을 좋아합니다. 로맨틱하고 감성적인 순간들을 소중히 여깁니다.",
        compatibility: "에겐남과 최고의 궁합을 보이며, 서로를 보완하는 완벽한 조합입니다.",
        icon: "🌸",
        bgColor: "linear-gradient(135deg, #fdcb6e, #ffeaa7)",
        advice: "자신의 의견도 소중하니 때로는 더 적극적으로 표현해보세요."
    }
};

let currentQuestion = 0;
let agenScore = 0;
let tetoScore = 0;
let answers = [];
let userGender = '';
let totalQuestions = questions.length + 1; // 성별 질문 포함

// DOM 요소
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const analysisPopup = document.getElementById('analysisPopup');

// 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    
});

// 테스트 시작
function startTest() {
    // 변수 초기화
    currentQuestion = 0;
    agenScore = 0;
    tetoScore = 0;
    answers = [];
    userGender = '';
    
    console.log('성향 테스트 시작 - 변수 초기화 완료');
    
    startPage.classList.add('hidden');
    questionPage.classList.remove('hidden');
    showQuestion();
}

// 질문 표시
function showQuestion() {
    let question, questionCount;
    
    if (currentQuestion < questions.length) {
        // 일반 질문
        question = questions[currentQuestion];
        questionCount = currentQuestion + 1;
    } else {
        // 성별 질문 (마지막)
        question = genderQuestion;
        questionCount = currentQuestion + 1;
    }
    
    const questionElement = document.querySelector('.question');
    const answersElement = document.querySelector('.answers');
    const questionNumElement = document.getElementById('questionNum');
    const progressElement = document.querySelector('.progress');
    
    questionElement.textContent = question.question;
    questionNumElement.textContent = questionCount;
    
    // 진행률 업데이트
    const progress = (questionCount / totalQuestions) * 100;
    progressElement.style.width = progress + '%';
    
    
}

// 답변 선택
function selectAnswer(index, agenPoints, tetoPoints) {
    const answerElements = document.querySelectorAll('.answer');
    
    // 모든 답변의 선택 상태 제거
    answerElements.forEach(el => el.classList.remove('selected'));
    
    // 선택한 답변 표시
    answerElements[index].classList.add('selected');
    
    // 이전에 이 질문에 답한 적이 있다면 점수 차감
    if (answers[currentQuestion]) {
        agenScore -= answers[currentQuestion].agen;
        tetoScore -= answers[currentQuestion].teto;
    }
    
    // 스코어 저장 및 누적
    answers[currentQuestion] = {
        questionIndex: currentQuestion,
        answerIndex: index,
        agen: agenPoints,
        teto: tetoPoints
    };
    
    agenScore += agenPoints;
    tetoScore += tetoPoints;
    
    console.log(`질문 ${currentQuestion + 1}: 에겐 +${agenPoints}, 테토 +${tetoPoints} | 총점: 에겐 ${agenScore}, 테토 ${tetoScore}`);
    
    // 다음 질문으로 이동
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < totalQuestions) {
            showQuestion();
        } else {
            console.log(`최종 점수: 에겐 ${agenScore}점, 테토 ${tetoScore}점, 성별: ${userGender}`);
            showAnalysis();
        }
    }, 500);
}

// 성별 선택
function selectGender(index, gender) {
    const answerElements = document.querySelectorAll('.answer');
    
    // 모든 답변의 선택 상태 제거
    answerElements.forEach(el => el.classList.remove('selected'));
    
    // 선택한 답변 표시
    answerElements[index].classList.add('selected');
    
    userGender = gender;
    
    console.log(`선택된 성별: ${gender}`);
    
    // 결과로 이동
    setTimeout(() => {
        currentQuestion++;
        console.log(`최종 점수: 에겐 ${agenScore}점, 테토 ${tetoScore}점, 성별: ${userGender}`);
        showAnalysis();
    }, 500);
}

// 분석 팝업 표시
function showAnalysis() {
    questionPage.classList.add('hidden');
    analysisPopup.classList.remove('hidden');
    
    
}

// 결과 표시
function showResult() {
    analysisPopup.classList.add('hidden');
    resultPage.classList.remove('hidden');
    
    
}

// 결과 키 결정
function getResultKey() {
    const isAgen = agenScore > tetoScore;
    const genderSuffix = userGender === 'male' ? 'male' : 'female';
    
    if (isAgen) {
        return `agen_${genderSuffix}`;
    } else {
        return `teto_${genderSuffix}`;
    }
}

// 카카오 공유
function shareKakao() {
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        const resultKey = getResultKey();
        const result = results[resultKey];
        
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '에겐남/테토남/에겐녀/테토녀 성향 분석',
                description: `나는 ${result.title}! 당신의 성향도 확인해보세요!`,
                imageUrl: 'https://via.placeholder.com/400x300/fd79a8/FFFFFF?text=성향+테스트',
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

// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    adManager.loadAd('adTop');
    setupAdObservers();
});
