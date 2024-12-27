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
// 결과 계산 로직 수정
function calculateResult(score) {
    // 각 답변은 0-3점, 총점 0-30점
    const maxScore = 30;
    const percentage = (score / maxScore) * 100;
    
    let level, description, advice;
    
    if (percentage <= 25) {
        level = "정상";
        description = "현재 당신의 스트레스 수준은 매우 건강한 상태입니다.";
        advice = [
            "현재의 생활 패턴을 잘 유지하세요",
            "규칙적인 운동을 계속하세요",
            "충분한 수면을 유지하세요"
        ];
    } else if (percentage <= 50) {
        level = "경미한 스트레스";
        description = "약간의 스트레스가 있지만, 일상생활에 큰 지장은 없는 수준입니다.";
        advice = [
            "가벼운 운동으로 기분 전환을 해보세요",
            "취미 활동을 즐겨보세요",
            "충분한 휴식을 취하세요"
        ];
    } else if (percentage <= 75) {
        level = "중등도 스트레스";
        description = "스트레스가 일상생활에 영향을 미치고 있습니다.";
        advice = [
            "스트레스 해소 방법을 찾아보세요",
            "친구나 가족과 대화를 나누어보세요",
            "필요하다면 전문가와 상담을 고려해보세요"
        ];
    } else {
        level = "심각한 스트레스";
        description = "스트레스가 매우 높은 수준입니다. 전문가의 도움이 필요할 수 있습니다.";
        advice = [
            "전문가와 상담하는 것을 추천드립니다",
            "일상생활 패턴을 재점검해보세요",
            "가까운 정신건강의학과 상담을 고려해보세요"
        ];
    }

    return { level, description, advice, percentage };
}

// showResult 함수 수정
function showResult() {
    const score = answers.reduce((sum, answer) => sum + answer, 0);
    const result = calculateResult(score);
    
    const resultHTML = `
        <div class="share-image"></div>
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
    showPopup();
}

// 카카오톡 공유 버튼 이벤트 수정
document.getElementById('share-kakao').addEventListener('click', () => {
    const score = answers.reduce((sum, answer) => sum + answer, 0);
    const result = calculateResult(score);
    
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '스트레스 수준 테스트 결과',
            description: `나의 스트레스 레벨: ${result.level}\n${result.description}`,
            imageUrl: window.location.origin + '/share-image.png', // 서버에 이미지를 올리거나 기본 이미지 사용
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