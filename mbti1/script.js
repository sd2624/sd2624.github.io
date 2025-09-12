let currentQuestion = 0;
const questions = [
    {
        text: "파티나 모임에서 나는",
        options: [
            "새로운 사람들과 대화하는 것을 즐긴다",
            "아는 사람들과 조용히 대화하는 것을 선호한다"
        ],
        type: ["E", "I"]
    },
    {
        text: "에너지를 얻는 방식은",
        options: [
            "다른 사람들과 어울리면서",
            "혼자만의 시간을 가지면서"
        ],
        type: ["E", "I"]
    },
    {
        text: "처음 보는 사람을 만났을 때",
        options: [
            "먼저 말을 걸고 대화를 시작한다",
            "상대방이 말을 걸어주기를 기다린다"
        ],
        type: ["E", "I"]
    },
    {
        text: "주말에 나는 주로",
        options: [
            "친구들과 만나서 시간을 보낸다",
            "집에서 혼자만의 시간을 보낸다"
        ],
        type: ["E", "I"]
    },
    {
        text: "스트레스 해소 방법으로",
        options: [
            "친구들과 만나서 이야기한다",
            "혼자 조용히 시간을 보낸다"
        ],
        type: ["E", "I"]
    },
    {
        text: "문제를 해결할 때",
        options: [
            "구체적인 사실과 경험을 중요시한다",
            "직관과 전체적인 그림을 중요시한다"
        ],
        type: ["S", "N"]
    },
    {
        text: "새로운 정보를 받아들일 때",
        options: [
            "세부적인 내용과 실제 사례를 찾는다",
            "숨겨진 의미와 가능성을 찾는다"
        ],
        type: ["S", "N"]
    },
    {
        text: "책을 읽을 때 선호하는 것은",
        options: [
            "현실적이고 구체적인 이야기",
            "상상력이 풍부한 공상 소설"
        ],
        type: ["S", "N"]
    },
    {
        text: "일을 할 때 나는",
        options: [
            "정해진 방식대로 차근차근 진행한다",
            "새로운 방식을 시도하며 진행한다"
        ],
        type: ["S", "N"]
    },
    {
        text: "나의 관심사는",
        options: [
            "현재의 실제적인 일들",
            "미래의 가능성과 아이디어"
        ],
        type: ["S", "N"]
    },
    {
        text: "의사결정을 할 때",
        options: [
            "논리적인 분석을 통해 결정한다",
            "감정과 가치관을 고려하여 결정한다"
        ],
        type: ["T", "F"]
    },
    {
        text: "갈등 상황에서 나는",
        options: [
            "객관적 사실을 바탕으로 해결한다",
            "모든 사람의 감정을 고려한다"
        ],
        type: ["T", "F"]
    },
    {
        text: "친구가 고민을 털어놓을 때",
        options: [
            "해결책을 제시한다",
            "공감하며 들어준다"
        ],
        type: ["T", "F"]
    },
    {
        text: "나는 주로",
        options: [
            "머리로 판단하는 편이다",
            "마음으로 결정하는 편이다"
        ],
        type: ["T", "F"]
    },
    {
        text: "누군가를 평가할 때",
        options: [
            "능력과 성과를 중요시한다",
            "성실성과 노력을 중요시한다"
        ],
        type: ["T", "F"]
    },
    {
        text: "일정을 계획할 때",
        options: [
            "미리 세부적으로 계획을 세운다",
            "상황에 따라 유연하게 조정한다"
        ],
        type: ["J", "P"]
    },
    {
        text: "여행을 갈 때",
        options: [
            "세부 일정을 미리 정해둔다",
            "즉흥적으로 결정한다"
        ],
        type: ["J", "P"]
    },
    {
        text: "물건을 정리할 때",
        options: [
            "체계적으로 분류하여 정리한다",
            "필요할 때 찾기 쉽게 둔다"
        ],
        type: ["J", "P"]
    },
    {
        text: "업무나 과제를",
        options: [
            "계획에 맞춰 미리 끝낸다",
            "마감 직전에 집중해서 한다"
        ],
        type: ["J", "P"]
    },
    {
        text: "일상생활에서 나는",
        options: [
            "규칙적이고 체계적인 것을 좋아한다",
            "자유롭고 융통성 있는 것을 좋아한다"
        ],
        type: ["J", "P"]
    }
];

let answers = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
};

// 테스트 시작
function startTest() {
    document.getElementById('startPage').style.display = 'none';
    document.getElementById('questionPage').style.display = 'block';
    showQuestion();
}

// 질문 표시
function showQuestion() {
    if (currentQuestion >= questions.length) {
        showResult();
        return;
    }

    // 진행률 업데이트
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
    document.querySelector('.progress-text').textContent = `${currentQuestion + 1}/20 페이지`;

    // 질문 텍스트 업데이트
    document.getElementById('questionText').textContent = questions[currentQuestion].text;

    // 옵션 버튼 업데이트
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    questions[currentQuestion].options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
    });
}

// 답변 선택
function selectAnswer(choice) {
    const question = questions[currentQuestion];
    answers[question.type[choice]]++;
    currentQuestion++;
    showQuestion();
}

// 결과 표시
function showResult() {
    const result = [
        answers.E > answers.I ? 'E' : 'I',
        answers.S > answers.N ? 'S' : 'N',
        answers.T > answers.F ? 'T' : 'F',
        answers.J > answers.P ? 'J' : 'P'
    ].join('').toLowerCase();

    window.location.href = `results/${result}.html`;
}
