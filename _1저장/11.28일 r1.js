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

// 각 질문에 대한 점수 매핑
// 1~7번: type1, 8~14번: type2, ..., 57~63번: type9
const questionTypeMapping = {};

// 1부터 63까지 질문을 각 유형에 7개씩 매핑
for (let i = 1; i <= totalQuestions; i++) {
    const typeIndex = Math.ceil(i / 7); // 1부터 9까지 유형을 순차적으로 매핑
    questionTypeMapping[i] = { 
        [`type${typeIndex}`]: 1 // 각 질문마다 해당 유형에 점수 1점 추가
    };
}

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
    const selectedValue = event.target.value;  // 선택된 값 가져오기
    
    // 선택된 값에 해당하는 점수 추가
    const questionScores = questionTypeMapping[currentQuestion];
    Object.keys(questionScores).forEach(type => {
        scores[type] += parseInt(selectedValue) * questionScores[type];
    });

    // 질문 번호 증가 후, 다음 질문 표시
    currentQuestion++;

    if (currentQuestion <= totalQuestions) {
        showQuestion(currentQuestion);
    } else {
        showResult();
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

// 결과 계산 및 표시
function showResult() {
    let maxScore = -Infinity;
    let dominantType = '';

    // 가장 높은 점수 유형 찾기
    for (let type in scores) {
        if (scores[type] > maxScore) {
            maxScore = scores[type];
            dominantType = type;
        }
    }

    // 결과 메시지 설정
    let resultMessage = '';
    switch (dominantType) {
        case 'type1':
            resultMessage = '당신은 1번 유형: 완벽주의자입니다.';
            break;
        case 'type2':
            resultMessage = '당신은 2번 유형: 헌신적인 사람입니다.';
            break;
        case 'type3':
            resultMessage = '당신은 3번 유형: 성취를 추구하는 사람입니다.';
            break;
        case 'type4':
            resultMessage = '당신은 4번 유형: 개성추구자입니다.';
            break;
        case 'type5':
            resultMessage = '당신은 5번 유형: 탐구자입니다.';
            break;
        case 'type6':
            resultMessage = '당신은 6번 유형: 충실한 사람입니다.';
            break;
        case 'type7':
            resultMessage = '당신은 7번 유형: 열정적인 사람입니다.';
            break;
        case 'type8':
            resultMessage = '당신은 8번 유형: 도전자입니다.';
            break;
        case 'type9':
            resultMessage = '당신은 9번 유형: 평화주의자입니다.';
            break;
        default:
            resultMessage = '결과를 계산할 수 없습니다.';
    }

    // 결과 표시
    resultText.innerText = resultMessage;
    resultSection.classList.remove('hidden');
}
