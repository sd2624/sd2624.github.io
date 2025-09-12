let currentQuestion = 0;
let mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let questions = [];

// 페이지 로드시 질문 데이터 로드
async function loadQuestions() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = './languages/questions_ko.js';
        script.onload = () => {
            questions = window.questions;
            resolve();
        };
        script.onerror = () => reject('질문 데이터를 로드하는데 실패했습니다.');
        document.head.appendChild(script);
    });
}

// 질문 표시 함수
function showQuestion() {
    const questionText = document.getElementById('question-text');
    const answerA = document.getElementById('answer-a');
    const answerB = document.getElementById('answer-b');
    const questionCounter = document.getElementById('question-counter');
    const progress = document.querySelector('.progress');
    
    // 모든 질문을 답했는지 확인
    if (currentQuestion >= questions.length) {
        finishTest();
        return;
    }
    
    // 현재 질문과 답변 표시
    const question = questions[currentQuestion];
    questionText.textContent = question.text;
    answerA.textContent = question.choices[0].text;
    answerB.textContent = question.choices[1].text;
    
    // 진행률 업데이트
    questionCounter.textContent = `${currentQuestion + 1}/${questions.length}`;
    progress.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    
    // 3번째 질문 후에 광고 표시
    if (currentQuestion === 3) {
        const adMid = document.getElementById('adMid');
        if (adMid) {
            adMid.style.display = 'block';
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error('AdSense error:', e);
            }
        }
    }
}

// 답변 선택 처리
function selectAnswer(choice) {
    const question = questions[currentQuestion];
    const selectedChoice = choice === 'A' ? question.choices[0] : question.choices[1];
    
    // 점수 추가
    mbtiScores[selectedChoice.type]++;
    
    // 다음 질문으로
    currentQuestion++;
    showQuestion();
}

// 테스트 완료 처리
function finishTest() {
    // 분석 팝업 표시
    const analysisOverlay = document.createElement('div');
    analysisOverlay.className = 'analysis-overlay';
    analysisOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const analysisPopup = document.createElement('div');
    analysisPopup.className = 'analysis-popup';
    analysisPopup.style.cssText = `
        background: white;
        border-radius: 15px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 15px 40px rgba(0,0,0,0.3);
    `;
    
    analysisPopup.innerHTML = `
        <div class="analysis-header" style="margin-bottom: 20px;">
            <div class="analysis-icon" style="font-size: 3em; margin-bottom: 10px;">🧠</div>
            <h2 style="margin: 0; font-size: 1.6em; font-weight: bold; color: #333;">MBTI 분석중...</h2>
        </div>
        <div class="analysis-content" style="margin: 20px 0;">
            <div class="loading-spinner" style="
                width: 40px;
                height: 40px;
                border: 3px solid rgba(102, 126, 234, 0.3);
                border-top: 3px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
            "></div>
            <p style="font-size: 1em; color: #666; margin: 0 0 20px;">잠시만 기다려주세요...</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    analysisOverlay.appendChild(analysisPopup);
    document.body.appendChild(analysisOverlay);

    // 3초 후에 결과 페이지로 이동
    setTimeout(() => {
        // MBTI 결과 계산
        const result = 
            (mbtiScores.E > mbtiScores.I ? 'E' : 'I') +
            (mbtiScores.S > mbtiScores.N ? 'S' : 'N') +
            (mbtiScores.T > mbtiScores.F ? 'T' : 'F') +
            (mbtiScores.J > mbtiScores.P ? 'J' : 'P');
            
        // 결과 페이지로 이동
        sessionStorage.setItem('mbtiResult', result);
        sessionStorage.setItem('mbtiScores', JSON.stringify(mbtiScores));
        window.location.href = 'index.html#result-section';
    }, 3000);
}

// 페이지 로드시 질문 로드 후 첫 질문 표시
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadQuestions();
        showQuestion();
    } catch (error) {
        console.error('질문을 로드하는데 실패했습니다:', error);
    }
});
