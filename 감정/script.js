// 전역 변수
let currentQuestionIndex = 0;
let answers = [];
let currentResultPage = 0;

// 설명 페이지 데이터 (3페이지)
const explanationPages = [
    {
        title: "감정 테스트에 오신 것을 환영합니다!",
        content: `
            <div class="explanation-content">
                <h2>🌟 감정 상태 진단 테스트</h2>
                <p>이 테스트는 당신의 현재 감정 상태를 과학적으로 분석하여 더 나은 감정 관리 방법을 제시합니다.</p>
                <div class="info-box">
                    <h3>✨ 테스트의 특징</h3>
                    <ul>
                        <li>📊 심리학 기반의 과학적 분석</li>
                        <li>⏱️ 약 3분 소요</li>
                        <li>🎯 개인 맞춤형 결과 제공</li>
                        <li>💡 실용적인 감정 관리 팁 제공</li>
                    </ul>
                </div>
            </div>
        `
    },
    {
        title: "테스트 진행 방법",
        content: `
            <div class="explanation-content">
                <h2>📋 진행 방법 안내</h2>
                <div class="step-guide">
                    <div class="step">
                        <span class="step-number">1</span>
                        <div class="step-content">
                            <h3>솔직한 답변</h3>
                            <p>현재 상황과 가장 가까운 답변을 선택해주세요</p>
                        </div>
                    </div>
                    <div class="step">
                        <span class="step-number">2</span>
                        <div class="step-content">
                            <h3>직감적 선택</h3>
                            <p>너무 깊게 생각하지 말고 첫 번째 느낌으로 답해주세요</p>
                        </div>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span>
                        <div class="step-content">
                            <h3>일관성 유지</h3>
                            <p>모든 질문에 성실히 답변해주세요</p>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    {
        title: "시작 전 마지막 안내",
        content: `
            <div class="explanation-content">
                <h2>🚀 준비가 되셨나요?</h2>
                <div class="final-notice">
                    <div class="notice-item">
                        <span class="notice-icon">⚡</span>
                        <p>총 <strong>20개의 질문</strong>이 준비되어 있습니다</p>
                    </div>
                    <div class="notice-item">
                        <span class="notice-icon">🎯</span>
                        <p>정확한 결과를 위해 <strong>솔직하게</strong> 답변해주세요</p>
                    </div>
                    <div class="notice-item">
                        <span class="notice-icon">🔒</span>
                        <p>모든 답변은 <strong>익명</strong>으로 처리됩니다</p>
                    </div>
                </div>
                <div class="start-notice">
                    <p>지금부터 감정 테스트를 시작합니다!</p>
                </div>
            </div>
        `
    }
];

// 질문 데이터 (20개)
const questions = [
    {
        question: "아침에 일어났을 때 기분은 어떤가요?",
        answers: [
            { text: "상쾌하고 활기찬 기분이에요", score: { positive: 3, negative: 0, neutral: 0, anxious: 0 } },
            { text: "보통이에요, 그냥 그래요", score: { positive: 0, negative: 0, neutral: 3, anxious: 0 } },
            { text: "좀 피곤하고 무기력해요", score: { positive: 0, negative: 2, neutral: 1, anxious: 0 } },
            { text: "불안하고 우울한 기분이에요", score: { positive: 0, negative: 3, neutral: 0, anxious: 2 } }
        ]
    },
    {
        question: "최근에 스트레스를 받는 일이 있었나요?",
        answers: [
            { text: "전혀 없었어요", score: { positive: 2, negative: 0, neutral: 1, anxious: 0 } },
            { text: "조금 있었지만 잘 넘겼어요", score: { positive: 1, negative: 0, neutral: 2, anxious: 0 } },
            { text: "꽤 많이 있었어요", score: { positive: 0, negative: 1, neutral: 1, anxious: 2 } },
            { text: "매우 많이 있어서 힘들어요", score: { positive: 0, negative: 3, neutral: 0, anxious: 3 } }
        ]
    },
    {
        question: "친구들과 만날 때 기분은 어떤가요?",
        answers: [
            { text: "항상 즐겁고 행복해요", score: { positive: 3, negative: 0, neutral: 0, anxious: 0 } },
            { text: "대체로 좋은 편이에요", score: { positive: 2, negative: 0, neutral: 1, anxious: 0 } },
            { text: "별로 내키지 않아요", score: { positive: 0, negative: 2, neutral: 1, anxious: 1 } },
            { text: "만나는 것 자체가 부담스러워요", score: { positive: 0, negative: 1, neutral: 0, anxious: 3 } }
        ]
    },
    {
        question: "요즘 잠은 잘 주무시나요?",
        answers: [
            { text: "잘 자고 푹 쉬어요", score: { positive: 2, negative: 0, neutral: 1, anxious: 0 } },
            { text: "보통이에요", score: { positive: 1, negative: 0, neutral: 2, anxious: 0 } },
            { text: "가끔 잠들기 어려워요", score: { positive: 0, negative: 1, neutral: 1, anxious: 2 } },
            { text: "잠을 잘 못 자겠어요", score: { positive: 0, negative: 2, neutral: 0, anxious: 3 } }
        ]
    },
    {
        question: "새로운 일에 도전할 때 어떤 기분인가요?",
        answers: [
            { text: "설레고 기대돼요", score: { positive: 3, negative: 0, neutral: 0, anxious: 0 } },
            { text: "조금 긴장되지만 해볼 만해요", score: { positive: 1, negative: 0, neutral: 1, anxious: 1 } },
            { text: "부담스럽고 걱정돼요", score: { positive: 0, negative: 1, neutral: 1, anxious: 2 } },
            { text: "하기 싫고 피하고 싶어요", score: { positive: 0, negative: 3, neutral: 0, anxious: 2 } }
        ]
    },
    {
        question: "혼자 있을 때 기분은 어떤가요?",
        answers: [
            { text: "편안하고 좋아요", score: { positive: 2, negative: 0, neutral: 1, anxious: 0 } },
            { text: "그냥 평범해요", score: { positive: 0, negative: 0, neutral: 3, anxious: 0 } },
            { text: "외롭고 쓸쓸해요", score: { positive: 0, negative: 2, neutral: 0, anxious: 1 } },
            { text: "불안하고 우울해져요", score: { positive: 0, negative: 3, neutral: 0, anxious: 3 } }
        ]
    },
    {
        question: "최근에 웃은 적이 얼마나 되나요?",
        answers: [
            { text: "매일 자주 웃어요", score: { positive: 3, negative: 0, neutral: 0, anxious: 0 } },
            { text: "가끔씩 웃어요", score: { positive: 1, negative: 0, neutral: 2, anxious: 0 } },
            { text: "별로 웃지 않아요", score: { positive: 0, negative: 2, neutral: 1, anxious: 1 } },
            { text: "거의 웃은 적이 없어요", score: { positive: 0, negative: 3, neutral: 0, anxious: 2 } }
        ]
    },
    {
        question: "일상생활에서 에너지 레벨은 어떤가요?",
        answers: [
            { text: "활기차고 에너지가 넘쳐요", score: { positive: 3, negative: 0, neutral: 0, anxious: 0 } },
            { text: "보통 수준이에요", score: { positive: 1, negative: 0, neutral: 2, anxious: 0 } },
            { text: "좀 피곤하고 무기력해요", score: { positive: 0, negative: 2, neutral: 1, anxious: 1 } },
            { text: "매우 피곤하고 지쳐있어요", score: { positive: 0, negative: 3, neutral: 0, anxious: 2 } }
        ]
    },
    {
        question: "미래에 대한 생각은 어떤가요?",
        answers: [
            { text: "희망적이고 기대돼요", score: { positive: 3, negative: 0, neutral: 0, anxious: 0 } },
            { text: "그냥 그럴 것 같아요", score: { positive: 0, negative: 0, neutral: 3, anxious: 0 } },
            { text: "좀 걱정돼요", score: { positive: 0, negative: 1, neutral: 1, anxious: 2 } },
            { text: "불안하고 암울해요", score: { positive: 0, negative: 3, neutral: 0, anxious: 3 } }
        ]
    },
    {
        question: "음식을 먹을 때 기분은 어떤가요?",
        answers: [
            { text: "맛있게 잘 먹어요", score: { positive: 2, negative: 0, neutral: 1, anxious: 0 } },
            { text: "보통이에요", score: { positive: 0, negative: 0, neutral: 3, anxious: 0 } },
            { text: "입맛이 별로 없어요", score: { positive: 0, negative: 2, neutral: 1, anxious: 1 } },
            { text: "먹는 것도 귀찮아요", score: { positive: 0, negative: 3, neutral: 0, anxious: 2 } }
        ]
    },
    {
        question: "다른 사람과 대화할 때 어떤가요?",
        answers: [
            { text: "즐겁고 활발하게 해요", score: { positive: 3, negative: 0, neutral: 0, anxious: 0 } },
            { text: "적당히 잘 해요", score: { positive: 1, negative: 0, neutral: 2, anxious: 0 } },
            { text: "조금 어색하고 부담스러워요", score: { positive: 0, negative: 1, neutral: 1, anxious: 2 } },
            { text: "매우 어렵고 피하고 싶어요", score: { positive: 0, negative: 2, neutral: 0, anxious: 3 } }
        ]
    },
    {
        question: "취미나 관심사에 대한 열정은 어떤가요?",
        answers: [
            { text: "매우 열정적이에요", score: { positive: 3, negative: 0, neutral: 0, anxious: 0 } },
            { text: "적당히 관심이 있어요", score: { positive: 1, negative: 0, neutral: 2, anxious: 0 } },
            { text: "예전보다 관심이 줄었어요", score: { positive: 0, negative: 2, neutral: 1, anxious: 1 } },
            { text: "전혀 관심이 없어요", score: { positive: 0, negative: 3, neutral: 0, anxious: 2 } }
        ]
    },
    {
        question: "몸의 컨디션은 어떤가요?",
        answers: [
            { text: "매우 좋아요", score: { positive: 2, negative: 0, neutral: 1, anxious: 0 } },
            { text: "보통이에요", score: { positive: 0, negative: 0, neutral: 3, anxious: 0 } },
            { text: "좀 안 좋아요", score: { positive: 0, negative: 2, neutral: 1, anxious: 1 } },
            { text: "매우 안 좋아요", score: { positive: 0, negative: 3, neutral: 0, anxious: 2 } }
        ]
    },
    {
        question: "집중력은 어떤가요?",
        answers: [
            { text: "잘 집중돼요", score: { positive: 2, negative: 0, neutral: 1, anxious: 0 } },
            { text: "보통이에요", score: { positive: 0, negative: 0, neutral: 3, anxious: 0 } },
            { text: "집중하기 어려워요", score: { positive: 0, negative: 2, neutral: 1, anxious: 2 } },
            { text: "전혀 집중이 안 돼요", score: { positive: 0, negative: 3, neutral: 0, anxious: 3 } }
        ]
    },
    {
        question: "감정 조절은 잘 되나요?",
        answers: [
            { text: "잘 조절돼요", score: { positive: 2, negative: 0, neutral: 1, anxious: 0 } },
            { text: "대체로 괜찮아요", score: { positive: 1, negative: 0, neutral: 2, anxious: 0 } },
            { text: "가끔 어려워요", score: { positive: 0, negative: 1, neutral: 1, anxious: 2 } },
            { text: "매우 어려워요", score: { positive: 0, negative: 3, neutral: 0, anxious: 3 } }
        ]
    },
    {
        question: "자신감은 어떤가요?",
        answers: [
            { text: "자신감이 넘쳐요", score: { positive: 3, negative: 0, neutral: 0, anxious: 0 } },
            { text: "적당히 있어요", score: { positive: 1, negative: 0, neutral: 2, anxious: 0 } },
            { text: "별로 없어요", score: { positive: 0, negative: 2, neutral: 1, anxious: 2 } },
            { text: "전혀 없어요", score: { positive: 0, negative: 3, neutral: 0, anxious: 3 } }
        ]
    },
    {
        question: "주변 환경에 대한 만족도는?",
        answers: [
            { text: "매우 만족해요", score: { positive: 3, negative: 0, neutral: 0, anxious: 0 } },
            { text: "만족하는 편이에요", score: { positive: 1, negative: 0, neutral: 2, anxious: 0 } },
            { text: "불만족스러워요", score: { positive: 0, negative: 2, neutral: 1, anxious: 1 } },
            { text: "매우 불만족해요", score: { positive: 0, negative: 3, neutral: 0, anxious: 2 } }
        ]
    },
    {
        question: "변화에 대한 적응력은?",
        answers: [
            { text: "잘 적응해요", score: { positive: 2, negative: 0, neutral: 1, anxious: 0 } },
            { text: "보통이에요", score: { positive: 0, negative: 0, neutral: 3, anxious: 0 } },
            { text: "어려워해요", score: { positive: 0, negative: 1, neutral: 1, anxious: 2 } },
            { text: "매우 힘들어해요", score: { positive: 0, negative: 2, neutral: 0, anxious: 3 } }
        ]
    },
    {
        question: "하루를 마무리할 때 기분은?",
        answers: [
            { text: "뿌듯하고 만족스러워요", score: { positive: 3, negative: 0, neutral: 0, anxious: 0 } },
            { text: "그냥 그래요", score: { positive: 0, negative: 0, neutral: 3, anxious: 0 } },
            { text: "아쉽고 후회돼요", score: { positive: 0, negative: 2, neutral: 1, anxious: 1 } },
            { text: "우울하고 불안해요", score: { positive: 0, negative: 3, neutral: 0, anxious: 3 } }
        ]
    },
    {
        question: "전반적인 삶의 만족도는?",
        answers: [
            { text: "매우 만족스러워요", score: { positive: 3, negative: 0, neutral: 0, anxious: 0 } },
            { text: "만족하는 편이에요", score: { positive: 2, negative: 0, neutral: 1, anxious: 0 } },
            { text: "보통이에요", score: { positive: 0, negative: 0, neutral: 3, anxious: 0 } },
            { text: "불만족스러워요", score: { positive: 0, negative: 3, neutral: 0, anxious: 2 } }
        ]
    }
];

// 결과 유형 데이터
const resultTypes = {
    positive: {
        title: "긍정적 감정 상태",
        emoji: "😊",
        summary: "당신은 현재 매우 긍정적이고 건강한 감정 상태를 유지하고 있습니다.",
        color: "#4CAF50"
    },
    neutral: {
        title: "안정적 감정 상태", 
        emoji: "😐",
        summary: "당신은 현재 안정적이고 평온한 감정 상태를 유지하고 있습니다.",
        color: "#FF9800"
    },
    negative: {
        title: "우울한 감정 상태",
        emoji: "😔", 
        summary: "당신은 현재 다소 우울하고 힘든 감정 상태에 있는 것 같습니다.",
        color: "#f44336"
    },
    anxious: {
        title: "불안한 감정 상태",
        emoji: "😰",
        summary: "당신은 현재 불안하고 걱정이 많은 감정 상태에 있는 것 같습니다.",
        color: "#9C27B0"
    }
};

// 결과 상세 페이지 데이터
const resultPages = {
    positive: [
        {
            title: "현재 상태 분석",
            content: `
                <div class="result-detail">
                    <h3>🌟 긍정적 감정 상태</h3>
                    <p>축하합니다! 당신은 현재 매우 건강하고 긍정적인 감정 상태를 유지하고 있습니다.</p>
                    <div class="characteristics">
                        <h4>주요 특징:</h4>
                        <ul>
                            <li>✨ 높은 에너지 레벨과 활력</li>
                            <li>🎯 명확한 목표 의식과 동기</li>
                            <li>😊 전반적으로 행복하고 만족스러운 기분</li>
                            <li>🤝 원활한 대인관계</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            title: "감정의 근원",
            content: `
                <div class="result-detail">
                    <h3>💡 긍정 감정의 원인</h3>
                    <p>당신의 긍정적인 감정은 다음과 같은 요인들에서 비롯될 수 있습니다:</p>
                    <div class="source-list">
                        <div class="source-item">
                            <span class="icon">🏆</span>
                            <div>
                                <h4>성취감</h4>
                                <p>최근 목표 달성이나 성공 경험</p>
                            </div>
                        </div>
                        <div class="source-item">
                            <span class="icon">❤️</span>
                            <div>
                                <h4>관계</h4>
                                <p>가족, 친구들과의 좋은 관계</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 광고 삽입 지점 -->
                    <div class="content-ad-break"></div>
                    
                    <div class="source-list">
                        <div class="source-item">
                            <span class="icon">🌱</span>
                            <div>
                                <h4>성장</h4>
                                <p>개인적인 발전과 성장 경험</p>
                            </div>
                        </div>
                    </div>
                    <p><strong>이러한 긍정적 요인들이 당신의 현재 상태를 만들어냈습니다.</strong> 이를 인식하고 감사하는 마음을 가지는 것이 중요합니다.</p>
                </div>
            `
        },
        {
            title: "장점과 강화 포인트",
            content: `
                <div class="result-detail">
                    <h3>🎯 현재 상태의 장점</h3>
                    <div class="advantages">
                        <div class="advantage-item">
                            <h4>🚀 높은 추진력</h4>
                            <p>목표를 향해 적극적으로 나아가는 힘이 있습니다.</p>
                        </div>
                        <div class="advantage-item">
                            <h4>🌈 낙관적 사고</h4>
                            <p>문제를 긍정적으로 바라보고 해결책을 찾습니다.</p>
                        </div>
                        <div class="advantage-item">
                            <h4>💪 회복탄력성</h4>
                            <p>어려움이 있어도 빠르게 회복하는 능력이 뛰어납니다.</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "지속 방법",
            content: `
                <div class="result-detail">
                    <h3>🔄 긍정 감정 유지 방법</h3>
                    <div class="maintenance-tips">
                        <div class="tip-category">
                            <h4>🌅 일상 습관</h4>
                            <ul>
                                <li>규칙적인 운동으로 에너지 유지</li>
                                <li>충분한 수면과 휴식</li>
                                <li>감사 일기 작성하기</li>
                            </ul>
                        </div>
                        <div class="tip-category">
                            <h4>🤝 관계 관리</h4>
                            <ul>
                                <li>소중한 사람들과 시간 보내기</li>
                                <li>긍정적인 영향을 주는 사람들과 교류</li>
                                <li>나눔과 배려 실천하기</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "추천 활동",
            content: `
                <div class="result-detail">
                    <h3>🎨 추천 활동과 취미</h3>
                    <div class="recommendations">
                        <div class="activity-group">
                            <h4>🏃‍♀️ 활동적인 취미</h4>
                            <div class="activities">
                                <span class="activity-tag">등산</span>
                                <span class="activity-tag">운동</span>
                                <span class="activity-tag">댄스</span>
                                <span class="activity-tag">여행</span>
                            </div>
                        </div>
                        <div class="activity-group">
                            <h4>🎯 창조적인 활동</h4>
                            <div class="activities">
                                <span class="activity-tag">그림 그리기</span>
                                <span class="activity-tag">음악 감상</span>
                                <span class="activity-tag">요리</span>
                                <span class="activity-tag">사진 촬영</span>
                            </div>
                        </div>
                        <div class="activity-group">
                            <h4>🧠 성장 지향적</h4>
                            <div class="activities">
                                <span class="activity-tag">독서</span>
                                <span class="activity-tag">새로운 기술 배우기</span>
                                <span class="activity-tag">언어 학습</span>
                                <span class="activity-tag">자원봉사</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    ],
    neutral: [
        {
            title: "현재 상태 분석",
            content: `
                <div class="result-detail">
                    <h3>⚖️ 안정적 감정 상태</h3>
                    <p>당신은 현재 안정적이고 균형 잡힌 감정 상태를 유지하고 있습니다.</p>
                    <div class="characteristics">
                        <h4>주요 특징:</h4>
                        <ul>
                            <li>😌 평온하고 안정된 마음가짐</li>
                            <li>⚖️ 감정의 균형이 잘 잡혀 있음</li>
                            <li>🎯 현실적이고 객관적인 판단력</li>
                            <li>🤝 적당한 수준의 사회적 관계</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            title: "안정감의 의미",
            content: `
                <div class="result-detail">
                    <h3>🏠 안정적 감정의 가치</h3>
                    <p>안정적인 감정 상태는 매우 소중한 자원입니다:</p>
                    <div class="value-list">
                        <div class="value-item">
                            <span class="icon">🧘</span>
                            <div>
                                <h4>내적 평화</h4>
                                <p>마음의 안정과 평온함을 유지</p>
                            </div>
                        </div>
                        <div class="value-item">
                            <span class="icon">🎯</span>
                            <div>
                                <h4>명확한 판단</h4>
                                <p>감정에 휘둘리지 않는 합리적 사고</p>
                            </div>
                        </div>
                        <div class="value-item">
                            <span class="icon">🌱</span>
                            <div>
                                <h4>성장 가능성</h4>
                                <p>안정된 기반에서 발전할 수 있는 여지</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "발전 가능성",
            content: `
                <div class="result-detail">
                    <h3>📈 성장을 위한 기회</h3>
                    <p>안정적인 상태를 바탕으로 더 나은 모습으로 발전할 수 있습니다:</p>
                    <div class="growth-areas">
                        <div class="growth-item">
                            <h4>🌟 긍정성 강화</h4>
                            <p>현재의 안정감을 바탕으로 더 많은 기쁨과 행복을 경험해보세요.</p>
                        </div>
                        <div class="growth-item">
                            <h4>🎭 감정 표현</h4>
                            <p>안전한 환경에서 감정을 더 자유롭게 표현해보세요.</p>
                        </div>
                        <div class="growth-item">
                            <h4>🚀 도전 정신</h4>
                            <p>안정된 기반을 바탕으로 새로운 도전을 시도해보세요.</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "균형 유지법",
            content: `
                <div class="result-detail">
                    <h3>⚖️ 감정 균형 유지 전략</h3>
                    <div class="balance-tips">
                        <div class="tip-section">
                            <h4>🌅 일상 루틴</h4>
                            <ul>
                                <li>규칙적인 생활 패턴 유지</li>
                                <li>적절한 휴식과 활동의 균형</li>
                                <li>스트레스 관리 방법 실천</li>
                            </ul>
                        </div>
                        <div class="tip-section">
                            <h4>🧘 마음챙김</h4>
                            <ul>
                                <li>명상이나 요가 등 마음 수련</li>
                                <li>현재 순간에 집중하기</li>
                                <li>감정 상태 점검하는 습관</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "활력 증진 방법",
            content: `
                <div class="result-detail">
                    <h3>⚡ 활력을 높이는 방법</h3>
                    <div class="energy-boost">
                        <div class="boost-category">
                            <h4>🏃‍♀️ 신체 활동</h4>
                            <div class="activities">
                                <span class="activity-tag">산책</span>
                                <span class="activity-tag">스트레칭</span>
                                <span class="activity-tag">수영</span>
                                <span class="activity-tag">자전거 타기</span>
                            </div>
                        </div>
                        <div class="boost-category">
                            <h4>🎨 창의적 활동</h4>
                            <div class="activities">
                                <span class="activity-tag">그림 그리기</span>
                                <span class="activity-tag">악기 연주</span>
                                <span class="activity-tag">글쓰기</span>
                                <span class="activity-tag">공예</span>
                            </div>
                        </div>
                        
                        <!-- 광고 삽입 지점 -->
                        <div class="content-ad-break"></div>
                        
                        <div class="boost-category">
                            <h4>🤝 사회적 활동</h4>
                            <div class="activities">
                                <span class="activity-tag">친구 만나기</span>
                                <span class="activity-tag">동호회 참여</span>
                                <span class="activity-tag">봉사활동</span>
                                <span class="activity-tag">새로운 모임</span>
                            </div>
                        </div>
                    </div>
                    <p><strong>작은 변화부터 시작하세요.</strong> 하루에 하나씩만 시도해도 점진적으로 활력을 되찾을 수 있습니다.</p>
                </div>
            `
        }
    ],
    negative: [
        {
            title: "현재 상태 이해",
            content: `
                <div class="result-detail">
                    <h3>💙 우울한 감정 상태</h3>
                    <p>지금 힘든 시간을 보내고 계시는군요. 이런 감정을 느끼는 것은 자연스러운 일입니다.</p>
                    <div class="understanding">
                        <h4>현재 느끼고 있을 수 있는 감정들:</h4>
                        <ul>
                            <li>😔 슬픔과 우울감</li>
                            <li>😴 무기력함과 피로감</li>
                            <li>🌧️ 희망이 보이지 않는 느낌</li>
                            <li>🏝️ 외로움과 고립감</li>
                        </ul>
                    </div>
                    <div class="comfort-message">
                        <p><strong>당신은 혼자가 아닙니다.</strong> 이런 감정들은 일시적이며, 적절한 도움과 시간을 통해 개선될 수 있습니다.</p>
                    </div>
                </div>
            `
        },
        {
            title: "우울감의 원인",
            content: `
                <div class="result-detail">
                    <h3>🔍 우울감이 생기는 이유</h3>
                    <p>우울한 기분은 다양한 원인에서 비롯될 수 있습니다:</p>
                    <div class="cause-list">
                        <div class="cause-item">
                            <span class="icon">💔</span>
                            <div>
                                <h4>인간관계</h4>
                                <p>갈등, 이별, 상실 등의 경험</p>
                            </div>
                        </div>
                        <div class="cause-item">
                            <span class="icon">⚡</span>
                            <div>
                                <h4>스트레스</h4>
                                <p>일, 학업, 경제적 부담 등</p>
                            </div>
                        </div>
                        <div class="cause-item">
                            <span class="icon">🧬</span>
                            <div>
                                <h4>생물학적 요인</h4>
                                <p>호르몬 변화, 계절 변화 등</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "회복의 첫걸음",
            content: `
                <div class="result-detail">
                    <h3>🌱 회복을 위한 작은 시작</h3>
                    <p>회복은 작은 한 걸음부터 시작됩니다. 완벽하지 않아도 괜찮습니다.</p>
                    <div class="recovery-steps">
                        <div class="step-item">
                            <h4>1️⃣ 자신을 인정하기</h4>
                            <p>현재 상태를 받아들이고 자신을 비난하지 마세요.</p>
                        </div>
                        <div class="step-item">
                            <h4>2️⃣ 작은 목표 세우기</h4>
                            <p>하루에 한 가지 작은 일이라도 해내는 것부터 시작하세요.</p>
                        </div>
                        <div class="step-item">
                            <h4>3️⃣ 도움 요청하기</h4>
                            <p>가족, 친구, 전문가에게 도움을 요청하는 것은 용기입니다.</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "일상 관리법",
            content: `
                <div class="result-detail">
                    <h3>🌅 일상 속 회복 방법</h3>
                    <div class="daily-care">
                        <div class="care-section">
                            <h4>🛌 기본 생활 관리</h4>
                            <ul>
                                <li>규칙적인 수면 패턴 유지</li>
                                <li>간단한 식사라도 챙겨 먹기</li>
                                <li>햇빛 쬐기와 산책</li>
                                <li>개인 위생 관리</li>
                            </ul>
                        </div>
                        <div class="care-section">
                            <h4>💭 마음 돌보기</h4>
                            <ul>
                                <li>부정적인 생각에 대항하기</li>
                                <li>감정 일기 쓰기</li>
                                <li>좋아하는 음악 듣기</li>
                                <li>명상이나 깊은 호흡</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "전문적 도움",
            content: `
                <div class="result-detail">
                    <h3>🤝 전문적 도움받기</h3>
                    <p>혼자서 감당하기 어려울 때는 전문가의 도움을 받는 것이 중요합니다.</p>
                    <div class="help-resources">
                        <div class="resource-item">
                            <h4>🏥 전문 상담</h4>
                            <p>심리상담사나 정신건강의학과 전문의 상담</p>
                        </div>
                        <div class="resource-item">
                            <h4>📞 상담 전화</h4>
                            <p>정신건강위기상담전화: 1577-0199</p>
                        </div>
                        <div class="resource-item">
                            <h4>👥 지원 그룹</h4>
                            <p>같은 경험을 하는 사람들과의 모임</p>
                        </div>
                    </div>
                    <div class="emergency-notice">
                        <p><strong>⚠️ 응급상황:</strong> 자해나 자살 생각이 든다면 즉시 119 또는 1588-9191(생명의전화)로 연락하세요.</p>
                    </div>
                </div>
            `
        }
    ],
    anxious: [
        {
            title: "불안감 이해하기",
            content: `
                <div class="result-detail">
                    <h3>😰 불안한 감정 상태</h3>
                    <p>불안감을 느끼고 계시는군요. 불안은 정상적인 감정이지만, 일상에 지장을 줄 때는 관리가 필요합니다.</p>
                    <div class="anxiety-signs">
                        <h4>불안의 주요 신호들:</h4>
                        <ul>
                            <li>😨 과도한 걱정과 두려움</li>
                            <li>💓 심장 두근거림이나 숨가쁨</li>
                            <li>🌀 집중력 저하와 안절부절</li>
                            <li>😴 수면 장애나 근육 긴장</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            title: "불안의 원인",
            content: `
                <div class="result-detail">
                    <h3>🎯 불안감의 뿌리</h3>
                    <p>불안감은 다양한 원인에서 비롯될 수 있습니다:</p>
                    <div class="anxiety-causes">
                        <div class="cause-item">
                            <span class="icon">🔮</span>
                            <div>
                                <h4>미래에 대한 걱정</h4>
                                <p>불확실한 상황이나 예측할 수 없는 변화</p>
                            </div>
                        </div>
                        <div class="cause-item">
                            <span class="icon">⚡</span>
                            <div>
                                <h4>스트레스 누적</h4>
                                <p>일, 학업, 인간관계에서 오는 압박감</p>
                            </div>
                        </div>
                        <div class="cause-item">
                            <span class="icon">🧠</span>
                            <div>
                                <h4>부정적 사고</h4>
                                <p>최악의 상황을 상상하는 습관</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "즉시 실천법",
            content: `
                <div class="result-detail">
                    <h3>🚨 지금 당장 할 수 있는 것들</h3>
                    <div class="immediate-help">
                        <div class="help-technique">
                            <h4>🫁 4-7-8 호흡법</h4>
                            <p>4초 들이마시고 → 7초 참고 → 8초 내쉬기</p>
                        </div>
                        <div class="help-technique">
                            <h4>👀 5-4-3-2-1 기법</h4>
                            <p>5개 보이는 것, 4개 만질 수 있는 것, 3개 들리는 것, 2개 냄새, 1개 맛</p>
                        </div>
                        <div class="help-technique">
                            <h4>🧘 근육 이완</h4>
                            <p>어깨와 목 근육을 의식적으로 이완시키기</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "불안 관리 전략",
            content: `
                <div class="result-detail">
                    <h3>🛡️ 장기적 불안 관리법</h3>
                    <div class="anxiety-management">
                        <div class="strategy-section">
                            <h4>💭 인지적 접근</h4>
                            <ul>
                                <li>걱정을 현실적으로 평가하기</li>
                                <li>"지금 이 순간"에 집중하기</li>
                                <li>부정적 사고 패턴 인식하기</li>
                                <li>감사한 것들 목록 만들기</li>
                            </ul>
                        </div>
                        <div class="strategy-section">
                            <h4>🏃‍♀️ 행동적 접근</h4>
                            <ul>
                                <li>규칙적인 운동 습관</li>
                                <li>충분한 수면 확보</li>
                                <li>카페인과 알코올 줄이기</li>
                                <li>이완 기법 연습</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "전문적 지원",
            content: `
                <div class="result-detail">
                    <h3>🤝 전문가 도움받기</h3>
                    <p>불안감이 지속되거나 일상생활에 큰 지장을 준다면 전문가의 도움을 받아보세요.</p>
                    <div class="professional-help">
                        <div class="help-option">
                            <h4>🏥 인지행동치료</h4>
                            <p>불안한 생각과 행동 패턴을 바꾸는 치료</p>
                        </div>
                        <div class="help-option">
                            <h4>💊 약물 치료</h4>
                            <p>필요시 의사와 상담하여 약물 치료 고려</p>
                        </div>
                        <div class="help-option">
                            <h4>🧘 마음챙김 치료</h4>
                            <p>명상과 마음챙김 기반 스트레스 감소법</p>
                        </div>
                    </div>
                    <div class="resources">
                        <h4>📞 도움받을 수 있는 곳:</h4>
                        <ul>
                            <li>정신건강상담전화: 1577-0199</li>
                            <li>청소년전화: 1388</li>
                            <li>지역 정신건강증진센터</li>
                        </ul>
                    </div>
                </div>
            `
        }
    ]
};

// 질문 초기화
function initializeTest() {
    currentQuestionIndex = 0;
    answers = [];
    displayCurrentQuestion();
}

// 현재 질문 표시
function displayCurrentQuestion() {
    const container = document.getElementById('questionContainer');
    const answerContainer = document.getElementById('answerContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const middleAd = document.querySelector('.middle-question-ad');
    
    // 진행률 업데이트
    const total = explanationPages.length + questions.length;
    const progress = ((currentQuestionIndex + 1) / total) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `${currentQuestionIndex + 1} / ${total}`;
    
    // 설명 페이지 또는 질문 표시
    if (currentQuestionIndex < explanationPages.length) {
        // 설명 페이지 - 광고 숨김
        const explanation = explanationPages[currentQuestionIndex];
        container.innerHTML = `
            <div class="explanation-page">
                <h2>${explanation.title}</h2>
                ${explanation.content}
            </div>
        `;
        answerContainer.innerHTML = '';
        document.getElementById('nextBtn').disabled = false;
        if (middleAd) middleAd.style.display = 'none';
    } else {
        // 질문 페이지 - 광고 표시
        const questionIndex = currentQuestionIndex - explanationPages.length;
        const question = questions[questionIndex];
        
        container.innerHTML = `
            <div class="question-page">
                <div class="question-number">질문 ${questionIndex + 1}</div>
                <h2 class="question-text">${question.question}</h2>
            </div>
        `;
        
        answerContainer.innerHTML = `
            <div class="answer-options">
                ${question.answers.map((answer, index) => `
                    <button class="answer-btn" onclick="selectAnswer(${index})">
                        ${answer.text}
                    </button>
                `).join('')}
            </div>
        `;
        
        document.getElementById('nextBtn').disabled = true;
        
        // 질문 페이지에서만 광고 표시
        if (middleAd) {
            middleAd.style.display = 'block';
            refreshAds();
        }
    }
    
    // 광고 새로고침 (5번째 질문마다)
    if (currentQuestionIndex > 0 && currentQuestionIndex % 5 === 0) {
        refreshAds();
    }
}

// 답변 선택
function selectAnswer(answerIndex) {
    const questionIndex = currentQuestionIndex - explanationPages.length;
    const selectedAnswer = questions[questionIndex].answers[answerIndex];
    
    // 답변 저장
    answers[questionIndex] = selectedAnswer;
    
    // 선택된 답변 표시
    const answerBtns = document.querySelectorAll('.answer-btn');
    answerBtns.forEach((btn, index) => {
        btn.classList.remove('selected');
        if (index === answerIndex) {
            btn.classList.add('selected');
        }
    });
    
    // 다음 버튼 활성화
    document.getElementById('nextBtn').disabled = false;
    
    // 잠시 후 자동으로 다음 질문으로 이동
    setTimeout(() => {
        nextQuestion();
    }, 500); // 0.5초 후 자동 이동
}

// 다음 질문
function nextQuestion() {
    if (currentQuestionIndex < explanationPages.length + questions.length - 1) {
        currentQuestionIndex++;
        displayCurrentQuestion();
    } else {
        // 테스트 완료, 결과 페이지로 이동
        calculateResult();
        window.location.href = 'result.html';
    }
}

// 결과 계산
function calculateResult() {
    const scores = {
        positive: 0,
        negative: 0,
        neutral: 0,
        anxious: 0
    };
    
    // 점수 합계 계산
    answers.forEach(answer => {
        Object.keys(answer.score).forEach(key => {
            scores[key] += answer.score[key];
        });
    });
    
    // 가장 높은 점수의 감정 타입 결정
    const resultType = Object.keys(scores).reduce((a, b) => 
        scores[a] > scores[b] ? a : b
    );
    
    // 결과 저장
    localStorage.setItem('testResult', JSON.stringify({
        type: resultType,
        scores: scores,
        answers: answers
    }));
}

// 결과 페이지 초기화
function initializeResult() {
    const result = JSON.parse(localStorage.getItem('testResult'));
    if (!result) {
        window.location.href = 'index.html';
        return;
    }
    
    currentResultPage = 0;
    displayResultPage(result);
}

// 결과 페이지 표시
function displayResultPage(result) {
    const container = document.getElementById('resultContainer');
    const navigation = document.getElementById('resultNavigation');
    const shareContainer = document.getElementById('shareContainer');
    const middleAd = document.getElementById('middleAd');
    const resultMiddleAd = document.getElementById('resultMiddleAd');
    const progressElement = document.getElementById('resultProgress');
    
    const resultType = resultTypes[result.type];
    const pages = resultPages[result.type];
    
    if (currentResultPage === 0) {
        // 결과 요약 페이지
        container.innerHTML = `
            <div class="result-summary">
                <div class="result-emoji">${resultType.emoji}</div>
                <h1 class="result-title" style="color: ${resultType.color}">${resultType.title}</h1>
                <p class="result-description">${resultType.summary}</p>
                
                <div class="score-breakdown">
                    <h3>감정 분석 결과</h3>
                    <div class="score-bars">
                        ${Object.entries(result.scores).map(([key, score]) => `
                            <div class="score-item">
                                <span class="score-label">${resultTypes[key].title}</span>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${(score / Math.max(...Object.values(result.scores))) * 100}%; background-color: ${resultTypes[key].color}"></div>
                                </div>
                                <span class="score-value">${score}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        shareContainer.style.display = 'none';
        if (middleAd) middleAd.style.display = 'none';
        if (resultMiddleAd) resultMiddleAd.style.display = 'none';
    } else {
        // 상세 페이지
        const pageIndex = currentResultPage - 1;
        const page = pages[pageIndex];
        
        container.innerHTML = `
            <div class="result-detail-page">
                <h2 class="detail-title">${page.title}</h2>
                ${page.content}
            </div>
        `;
        
        // 2번째, 4번째 페이지에서 결과 중간 광고 표시
        if (currentResultPage === 2 || currentResultPage === 4) {
            if (resultMiddleAd) {
                resultMiddleAd.style.display = 'block';
                refreshAds();
            }
        } else {
            if (resultMiddleAd) resultMiddleAd.style.display = 'none';
        }
        
        // 마지막 페이지에서 공유 버튼 표시
        if (currentResultPage === pages.length) {
            shareContainer.style.display = 'block';
        } else {
            shareContainer.style.display = 'none';
        }
        
        // 기존 중간 광고 표시 (3번째 페이지)
        if (currentResultPage === 3) {
            if (middleAd) {
                middleAd.style.display = 'block';
                refreshAds();
            }
        } else {
            if (middleAd) middleAd.style.display = 'none';
        }
    }
    
    // 네비게이션 업데이트
    const totalPages = pages.length + 1;
    progressElement.textContent = `${currentResultPage + 1} / ${totalPages}`;
    
    document.getElementById('prevBtn').disabled = currentResultPage === 0;
    document.getElementById('nextBtn').disabled = currentResultPage === totalPages - 1;
    
    if (currentResultPage === totalPages - 1) {
        document.getElementById('nextBtn').style.display = 'none';
    } else {
        document.getElementById('nextBtn').style.display = 'block';
    }
}

// 이전 결과 페이지
function previousResultPage() {
    if (currentResultPage > 0) {
        currentResultPage--;
        const result = JSON.parse(localStorage.getItem('testResult'));
        displayResultPage(result);
    }
}

// 다음 결과 페이지
function nextResultPage() {
    const result = JSON.parse(localStorage.getItem('testResult'));
    const maxPages = resultPages[result.type].length;
    
    if (currentResultPage < maxPages) {
        currentResultPage++;
        displayResultPage(result);
        
        // 페이지 전환 시 광고 새로고침
        refreshAds();
    }
}

// 카카오톡 공유
function shareKakao() {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
        if (typeof Kakao !== 'undefined') {
            Kakao.init('2c2ed6479d8c597005fac18db90b7649');
        } else {
            alert('카카오톡 공유 기능을 사용할 수 없습니다.');
            return;
        }
    }
    
    const result = JSON.parse(localStorage.getItem('testResult'));
    const resultType = resultTypes[result.type];
    const currentUrl = window.location.href.replace('result.html', '');
    
    window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: `나의 감정 상태: ${resultType.title} ${resultType.emoji}`,
            description: `${resultType.summary}\n\n나도 내 감정 상태를 알아보자!`,
            imageUrl: 'https://sd2624.github.io/감정/감정.png',
            link: {
                mobileWebUrl: currentUrl,
                webUrl: currentUrl
            }
        },
        buttons: [
            {
                title: '나도 테스트하기',
                link: {
                    mobileWebUrl: currentUrl,
                    webUrl: currentUrl
                }
            }
        ]
    });
}

// 테스트 다시하기
function restartTest() {
    localStorage.removeItem('testResult');
    window.location.href = 'index.html';
}

// 광고 새로고침
function refreshAds() {
    try {
        // 기존 광고 슬롯 비우기
        const adContainers = document.querySelectorAll('.adsbygoogle');
        adContainers.forEach(container => {
            if (container.innerHTML.trim() !== '') {
                // 새로운 광고 슬롯 생성
                const newAd = container.cloneNode(true);
                newAd.innerHTML = '';
                container.parentNode.replaceChild(newAd, container);
            }
        });
        
        // 광고 다시 로드
        if (typeof adsbygoogle !== 'undefined') {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    } catch (error) {
        console.log('광고 새로고침 중 오류:', error);
    }
}
