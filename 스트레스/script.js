const questions = [
    {
        question: "최근 일주일 동안 잠을 잘 잤나요?",
        options: ["매우 잘 잤다", "보통이다", "잘 자지 못했다", "거의 잠을 못 잤다"]
    },
    {
        question: "일상적인 일들이 스트레스로 느껴지나요?",
        options: ["전혀 아니다", "가끔 그렇다", "자주 그렇다", "항상 그렇다"]
    },
    {
        question: "식욕에 변화가 있나요?",
        options: ["변화 없음", "약간 변화", "많이 변화", "극심한 변화"]
    },
    {
        question: "집중하기 어려운가요?",
        options: ["전혀 아니다", "가끔 그렇다", "자주 그렇다", "항상 그렇다"]
    },
    {
        question: "쉽게 짜증이 나나요?",
        options: ["전혀 아니다", "가끔 그렇다", "자주 그렇다", "항상 그렇다"]
    },
    {
        question: "머리나 근육의 통증이 있나요?",
        options: ["없음", "가끔", "자주", "항상"]
    },
    {
        question: "미래에 대해 불안감을 느끼나요?",
        options: ["전혀 아니다", "약간", "많이", "매우 많이"]
    },
    {
        question: "일이나 공부에 대한 의욕이 있나요?",
        options: ["매우 많다", "보통이다", "적다", "전혀 없다"]
    },
    {
        question: "혼자 있고 싶은 생각이 자주 드나요?",
        options: ["전혀 아니다", "가끔", "자주", "항상"]
    },
    {
        question: "전반적인 기분이 어떠신가요?",
        options: ["매우 좋음", "보통", "나쁨", "매우 나쁨"]
    }
];

let currentQuestion = 0;
let answers = [];

// 질문 표시 함수
function displayQuestion() {
    const questionDiv = document.getElementById('question');
    const optionsDiv = document.getElementById('options');
    
    questionDiv.textContent = `${currentQuestion + 1}. ${questions[currentQuestion].question}`;
    optionsDiv.innerHTML = '';
    
    questions[currentQuestion].options.forEach((option, index) => {
        const button = document.createElement('div');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => selectOption(index);
        optionsDiv.appendChild(button);
    });
}

// 옵션 선택 함수
function selectOption(index) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    
    answers[currentQuestion] = index;
    
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        setTimeout(displayQuestion, 300);
    } else {
        document.getElementById('submit-btn').style.display = 'block';
    }
}

// 결과 계산 함수
function calculateResult(score) {
    const maxScore = 30;
    const percentage = (score / maxScore) * 100;
    
    let level, description, advice, emoji;
    
    if (percentage <= 25) {
        level = "정상";
        emoji = "😊";
        description = "현재 당신의 스트레스 수준은 매우 건강한 상태입니다.";
        advice = [
            "지금의 긍정적인 생활 패턴을 지속적으로 유지하세요. 꾸준한 노력이 건강한 스트레스 관리에 큰 도움이 됩니다.",
            "규칙적인 운동을 생활화하세요. 가벼운 유산소 운동이나 스트레칭은 몸과 마음의 긴장을 완화하는 데 효과적입니다.",
            "충분한 수면을 확보하세요. 매일 일정한 시간에 잠자리에 들고, 수면 환경을 쾌적하게 만들어 심신을 재충전하세요.",
            "자신을 위한 여유 시간을 만들어 보세요. 좋아하는 취미 활동을 통해 즐거움과 만족감을 느낄 수 있습니다.",
            "가족이나 친구들과의 시간을 소중히 하세요. 긍정적인 관계는 스트레스 관리에 중요한 역할을 합니다."
        ];
    } else if (percentage <= 50) {
        level = "경미한 스트레스";
        emoji = "🙂";
        description = "약간의 스트레스가 있지만, 일상생활에 큰 지장은 없는 수준입니다.";
        advice = [
            "가벼운 운동을 통해 기분을 환기해 보세요. 산책이나 요가 같은 활동은 몸과 마음을 편안하게 만듭니다.",
            "자신만의 취미 활동에 몰입해 보세요. 좋아하는 일을 하면서 스트레스를 효과적으로 해소할 수 있습니다.",
            "충분한 휴식을 취하세요. 특히 하루 중 짧은 낮잠이나 이완 시간을 가지면 긴장을 풀고 에너지를 충전할 수 있습니다.",
            "일정한 루틴을 설정하여 하루를 계획적으로 보내 보세요. 작은 성취감이 스트레스를 줄이는 데 도움이 됩니다.",
            "심호흡이나 명상과 같은 간단한 이완 기술을 활용하여 마음을 차분하게 유지하세요."
    
        ];
    } else if (percentage <= 75) {
        level = "중등도 스트레스";
        emoji = "😟";
        description = "스트레스가 일상생활에 영향을 미치고 있습니다.";
        advice = [
            "스트레스 해소를 위해 자신에게 맞는 방법을 찾아보세요. 운동, 독서, 음악 감상 등 마음의 평화를 가져다줄 수 있는 활동을 시도해 보세요.",
            "믿을 수 있는 친구나 가족과 대화를 나누세요. 감정을 공유하는 것만으로도 위안을 얻고 스트레스가 완화될 수 있습니다.",
            "스트레스 원인을 적어보고 이를 단계적으로 해결하는 방법을 계획해 보세요. 문제를 시각화하면 해결책이 더 명확해질 수 있습니다.",
            "필요하다면 전문가와 상담을 고려하세요. 상담은 스트레스 관리에 효과적이며, 현재 상태를 개선하는 데 도움을 줄 수 있습니다.",
            "규칙적인 운동과 건강한 식습관을 유지하며, 수면 시간을 충분히 확보하세요. 신체 건강은 스트레스 회복의 중요한 요소입니다."
    
        ];
    } else {
        level = "심각한 스트레스";
        emoji = "😰";
        description = "스트레스가 매우 높은 수준입니다. 전문가의 도움이 필요할 수 있습니다.";
        advice = [
            "전문가와 상담하는 것을 강력히 추천드립니다. 심리 상담사나 정신건강 전문가와의 대화를 통해 스트레스의 원인을 파악하고 효과적인 해결 방법을 모색해 보세요.",
            "일상생활 패턴을 재점검하세요. 과도한 업무나 생활 습관을 조정하고, 더 건강하고 안정된 루틴을 만들어 보세요.",
            "가까운 정신건강의학과를 방문하여 전문가와 상담을 진행해 보세요. 필요한 경우 약물 치료나 심리 치료를 병행할 수 있습니다.",
            "혼자 해결하려고 하지 말고 신뢰할 수 있는 가족, 친구들과 현재의 상태를 공유하세요. 주변 사람들의 지원은 스트레스 완화에 큰 도움이 됩니다.",
            "휴식 시간을 확보하고, 스트레스가 심할 때는 잠시 모든 것을 내려놓고 충분한 휴식을 취하세요. 명상, 심호흡 같은 이완 기술도 시도해 볼 가치가 있습니다."
    
        ];
    }

    return { level, description, advice, percentage, emoji };
}

// 결과 표시 함수
function showResult() {
    const score = answers.reduce((sum, answer) => sum + answer, 0);
    const result = calculateResult(score);
    
    // 팝업 표시
    document.getElementById('result-popup').style.display = 'block';
    document.getElementById('result-content').style.display = 'none';
    
    // 광고 새로고침
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('광고 로드 실패:', e);
    }

    // 7초 타이머 시작
    let timeLeft = 7;
    const countdown = setInterval(() => {
        timeLeft--;
        document.getElementById('countdown').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            document.getElementById('ad-timer').style.display = 'none';
            document.getElementById('ad-space').style.display = 'none';
            
            // 결과 내용 표시
            const resultHTML = `
                <div id="result-emoji">${result.emoji}</div>
                <div class="stress-level">스트레스 레벨: ${result.level}</div>
                <div class="result-details">
                    <p>${result.description}</p>
                    <p>스트레스 점수: ${result.percentage.toFixed(1)}%</p>
                    <h3>추천 사항:</h3>
                    <ul>
                        ${result.advice.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
            
            document.getElementById('result-text').innerHTML = resultHTML;
            document.getElementById('result-content').style.display = 'block';
        }
    }, 1000);
}

// 이벤트 리스너 설정
document.getElementById('submit-btn').addEventListener('click', showResult);

document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('result-popup').style.display = 'none';
});

document.getElementById('share-kakao').addEventListener('click', () => {
    const score = answers.reduce((sum, answer) => sum + answer, 0);
    const result = calculateResult(score);
    
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '스트레스 수준 테스트 결과',
            description: `나의 스트레스 레벨: ${result.level}\n${result.description}`,
            imageUrl: window.location.origin + '/share-image.png',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
        },
        buttons: [
            {
                title: '테스트 하러가기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            }
        ]
    });
});

// 초기 질문 표시
displayQuestion();