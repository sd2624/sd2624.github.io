let currentQuestion = 1;
const totalQuestions = 63;
const progressBar = document.getElementById('progressBar');
const testSection = document.getElementById('testSection');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');

// 각 유형에 대한 점수
let scores = {
    type1: 0, // 완벽주의자
    type2: 0, // 헌신자
    type3: 0, // 성취자
    type4: 0, // 개성추구자
    type5: 0, // 탐구자
    type6: 0, // 충실한 사람
    type7: 0, // 열정적인 사람
    type8: 0, // 도전자
    type9: 0  // 평화주의자
};

// 각 질문에 대한 점수 매핑 (각 유형별로 7개의 질문)
const questionTypeMapping = {
    1: 'type1', 2: 'type1', 3: 'type1', 4: 'type1', 5: 'type1', 6: 'type1', 7: 'type1', // 1~7번 질문 type1
    8: 'type2', 9: 'type2', 10: 'type2', 11: 'type2', 12: 'type2', 13: 'type2', 14: 'type2', // 8~14번 질문 type2
    15: 'type3', 16: 'type3', 17: 'type3', 18: 'type3', 19: 'type3', 20: 'type3', 21: 'type3', // 15~21번 질문 type3
    22: 'type4', 23: 'type4', 24: 'type4', 25: 'type4', 26: 'type4', 27: 'type4', 28: 'type4', // 22~28번 질문 type4
    29: 'type5', 30: 'type5', 31: 'type5', 32: 'type5', 33: 'type5', 34: 'type5', 35: 'type5', // 29~35번 질문 type5
    36: 'type6', 37: 'type6', 38: 'type6', 39: 'type6', 40: 'type6', 41: 'type6', 42: 'type6', // 36~42번 질문 type6
    43: 'type7', 44: 'type7', 45: 'type7', 46: 'type7', 47: 'type7', 48: 'type7', 49: 'type7', // 43~49번 질문 type7
    50: 'type8', 51: 'type8', 52: 'type8', 53: 'type8', 54: 'type8', 55: 'type8', 56: 'type8', // 50~56번 질문 type8
    57: 'type9', 58: 'type9', 59: 'type9', 60: 'type9', 61: 'type9', 62: 'type9', 63: 'type9'  // 57~63번 질문 type9
};

// 질문 표시
function showQuestion(questionNumber) {
    const questions = document.querySelectorAll('.question');
    questions.forEach(q => q.classList.add('hidden'));
    const current = document.querySelector(`.question[data-question="${questionNumber}"]`);
    current.classList.remove('hidden');

    // 진행 상황 업데이트
    updateProgressBar();
}

// 진행 바 업데이트
function updateProgressBar() {
    const percentage = (currentQuestion / totalQuestions) * 100;
    progressBar.style.width = `${percentage}%`;
    progressBar.textContent = `${Math.round(percentage)}%`;
}

// 라디오 버튼 선택 시 점수 누적 및 자동으로 다음 질문으로 이동
function handleAnswer(event) {
    const selectedValue = parseInt(event.target.value);  // 선택된 값 가져오기
    
    // 선택된 값에 해당하는 점수 추가 (해당 유형에 점수 반영)
    const questionType = questionTypeMapping[currentQuestion];
    scores[questionType] += selectedValue;

    // 질문 번호 증가 후, 다음 질문 표시
    currentQuestion++;

    if (currentQuestion <= totalQuestions) {
        showQuestion(currentQuestion);
    } else {
        // 63번째 질문을 끝낸 후 "결과 보기" 버튼 표시
        document.getElementById('showResultButton').classList.remove('hidden');
    }
}

// 시작 버튼 클릭 시
document.getElementById('startTest').addEventListener('click', () => {
    document.querySelector('header').classList.add('hidden');
    testSection.classList.remove('hidden');
    showQuestion(currentQuestion);
});

// 라디오 버튼에 이벤트 리스너 추가
document.querySelectorAll('.question input[type="radio"]').forEach(input => {
    input.addEventListener('change', handleAnswer);
});

// 결과 보기 버튼 클릭 시 결과 화면으로 전환
document.getElementById('showResultButton').addEventListener('click', () => {
    showResult();
});

// 결과 계산 및 표시
function showResult() {
    let resultMessage = '당신의 에니어그램 유형은:\n\n';
    let resultDetails = [];
    let sortedScores = [];

    // 각 유형의 점수를 배열에 저장하여 내림차순으로 정렬
    for (let type in scores) {
        sortedScores.push({ type: type, score: scores[type] });
    }

    // 점수 내림차순으로 정렬
    sortedScores.sort((a, b) => b.score - a.score);

    // 결과 메시지 설정
    sortedScores.forEach((item, index) => {
        const percentage = (item.score / 63) * 100;  // 63점 기준으로 퍼센트 계산
        resultDetails.push(`${index + 1}. ${getTypeName(item.type)}: ${percentage.toFixed(2)}%`);
    });

    resultMessage += resultDetails.join('\n');

    // 7초 뒤에 결과 표시
    setTimeout(() => {
        resultText.innerText = resultMessage;
        resultSection.classList.remove('hidden');
    }, 7000);  // 7초(7000ms) 후에 실행
}

// 유형 이름 반환 함수
function getTypeName(type) {
    switch (type) {
        case 'type1': return '완벽주의자';
        case 'type2': return '헌신자';
        case 'type3': return '성취자';
        case 'type4': return '개성추구자';
        case 'type5': return '탐구자';
        case 'type6': return '충실한 사람';
        case 'type7': return '열정적인 사람';
        case 'type8': return '도전자';
        case 'type9': return '평화주의자';
        default: return '';
    }
}
