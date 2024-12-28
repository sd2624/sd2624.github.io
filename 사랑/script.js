// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 질문 목록
const questions = [
    "상대방의 칭찬과 인정의 말이 나에게 큰 의미가 있다.",
    "함께 보내는 시간이 가장 소중하다.",
    "스킨십을 통해 사랑을 느낀다.",
    "상대방이 나를 위해 무언가를 해줄 때 사랑받는다고 느낀다.",
    "선물을 받을 때 특별한 사랑을 느낀다.",
    "진심 어린 감사의 말을 들을 때 행복하다.",
    "상대방과 대화하며 시간을 보내는 것이 좋다.",
    "손을 잡거나 안아주는 것이 좋다.",
    "상대방이 나를 도와줄 때 사랑을 느낀다.",
    "작은 선물이나 깜짝 이벤트를 받으면 기쁘다."
];

// 결과 유형
const results = {
    words: {
        title: "인정하는 말",
        description: "당신은 말을 통해 사랑을 표현하고 받아들이는 타입입니다.\n칭찬과 감사의 말이 큰 의미로 다가옵니다.\n진심 어린 대화를 통해 사랑을 느낍니다.\n따뜻한 한마디가 큰 위로와 힘이 됩니다.\n표현되지 않은 사랑은 잘 느끼지 못합니다.\n말로 하는 칭찬이 당신에게는 큰 선물이 됩니다.\n상대방의 말 한마디가 마음 깊이 남습니다.\n소소한 감사의 표현도 큰 의미로 다가옵니다.\n진심 어린 대화로 관계가 깊어집니다.\n사랑은 표현될 때 더 강하게 느껴집니다."
    },
    time: {
        title: "함께하는 시간",
        description: "당신은 함께 보내는 시간을 통해 사랑을 느끼는 타입입니다.\n상대방과의 특별한 순간들이 큰 의미를 가집니다.\n같이 보낸 시간이 사랑을 확인시켜줍니다.\n의미 있는 대화와 활동이 관계를 더욱 깊게 만듭니다.\n일상 속 작은 순간도 함께하면 특별해집니다.\n시간을 내어주는 것이 최고의 사랑 표현입니다.\n함께 있는 시간이 길수록 안정감을 느낍니다.\n소중한 사람과의 시간은 가장 큰 행복입니다.\n혼자가 아닌 함께하는 활동에 더 큰 만족감을 느낍니다.\n시간을 공유할 때 사랑이 더욱 확실해집니다."
    },
    touch: {
        title: "스킨십",
        description: "당신은 신체적 접촉을 통해 사랑을 표현하고 받아들이는 타입입니다.\n포옹이나 손잡기가 따뜻한 위로로 다가옵니다.\n작은 터치 하나도 큰 의미를 가집니다.\n스킨십은 당신에게 사랑을 확인하는 방법입니다.\n상대방의 가까움에서 사랑을 느낍니다.\n따뜻한 포옹은 하루의 피로를 잊게 합니다.\n스킨십이 없는 관계에서는 사랑을 느끼기 어렵습니다.\n가벼운 터치가 관계를 더 가깝게 만듭니다.\n사랑은 말보다는 행동으로 느껴질 때가 많습니다.\n상대방의 손길에서 큰 안도감을 얻습니다."
    },
    service: {
        title: "봉사와 도움",
        description: "당신은 실질적인 도움과 배려를 통해 사랑을 느끼는 타입입니다.\n상대방의 작은 배려가 큰 의미로 다가옵니다.\n실질적인 도움에서 진심을 느낍니다.\n작은 행동 하나하나가 큰 사랑으로 느껴집니다.\n사소한 배려가 당신에게는 큰 감동을 줍니다.\n상대방의 헌신이 관계를 깊게 만듭니다.\n도움을 주고받는 것이 사랑의 표현입니다.\n작은 행동에도 진심이 담겼다고 느낍니다.\n일상에서의 작은 배려가 큰 기쁨이 됩니다.\n상대방의 노력이 사랑으로 다가옵니다."
    },
    gifts: {
        title: "선물",
        description: "당신은 선물을 통해 사랑을 표현하고 받아들이는 타입입니다.\n작은 선물에도 큰 감동을 받습니다.\n깜짝 이벤트가 특별한 의미를 가집니다.\n선물은 사랑을 확인하는 중요한 방법입니다.\n준비된 선물에서 상대방의 진심을 느낍니다.\n작은 정성이 큰 기쁨을 줍니다.\n소소한 선물에도 큰 행복을 느낍니다.\n사랑은 행동으로 표현될 때 더 확실해집니다.\n특별한 날의 선물이 관계를 더 가깝게 만듭니다.\n선물은 당신에게 소중한 사랑의 표현입니다."
    }
};

let currentQuestion = 0;
let scores = {
    words: 0,
    time: 0,
    touch: 0,
    service: 0,
    gifts: 0
};

// DOM 요소
const startSection = document.getElementById('start-section');
const questionSection = document.getElementById('question-section');
const resultSection = document.getElementById('result-section');
const adPopup = document.getElementById('ad-popup');

// 시작 버튼 이벤트
document.getElementById('start-btn').addEventListener('click', () => {
    startSection.style.display = 'none';
    questionSection.style.display = 'block';
    showQuestion();
});

// 질문 표시 함수
function showQuestion() {
    const progressBar = document.querySelector('.progress');
    const questionCounter = document.querySelector('.question-counter');
    const questionText = document.getElementById('question-text');

    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    questionCounter.textContent = `${currentQuestion + 1}/${questions.length}`;
    questionText.textContent = questions[currentQuestion];
}

// 답변 버튼 이벤트
document.querySelectorAll('.answer-btn').forEach((button, index) => {
    button.addEventListener('click', () => {
        const score = 5 - index; // 5,4,3,2,1 점수 부여
        const types = ['words', 'time', 'touch', 'service', 'gifts'];
        scores[types[currentQuestion % 5]] += score;
        
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showAdPopup();
        }
    });
});

// 광고 팝업 표시 함수
function showAdPopup() {
    adPopup.style.display = 'flex';
    
    // 팝업 광고 초기화
    initializePopupAd();

    let countdown = 7;
    const countdownElement = document.querySelector('.countdown');
    
    const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            adPopup.style.display = 'none';
            showResult();
        }
    }, 1000);
}

// 팝업 광고 초기화 함수
function initializePopupAd() {
    const popupAd = document.querySelector('.popup-ad');
    if (popupAd) {
        try {
            // 기존 광고 제거
            while (popupAd.firstChild) {
                popupAd.removeChild(popupAd.firstChild);
            }
            
            // 새로운 광고 삽입
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('팝업 광고 초기화 실패:', e);
        }
    }
}

// 결과 표시 함수
function showResult() {
    questionSection.style.display = 'none';
    resultSection.style.display = 'block';

    // 최고 점수 유형 찾기
    let maxType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    // 결과 표시
    document.getElementById('result-title').textContent = results[maxType].title;
    document.getElementById('result-description').textContent = results[maxType].description;

    // 차트 데이터 준비
    const labels = {
        words: "인정하는 말",
        time: "함께하는 시간",
        touch: "스킨십",
        service: "봉사와 도움",
        gifts: "선물"
    };

    // 기존 차트 제거 (있다면)
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.innerHTML = '<canvas id="resultChart"></canvas>';

    // 새 차트 생성
    const ctx = document.getElementById('resultChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.values(labels),
            datasets: [{
                label: '사랑의 언어 점수',
                data: Object.keys(labels).map(key => scores[key]),
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                borderColor: 'rgba(255, 107, 107, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 107, 107, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255, 107, 107, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    pointLabels: {
                        color: '#666',
                        font: {
                            size: 12,
                            family: "'Noto Sans KR', sans-serif"
                        }
                    },
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// 공유하기 버튼
document.querySelector('.share-btn').addEventListener('click', () => {
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '나의 사랑의 언어 테스트',
            description: '당신의 사랑을 표현하는 방식을 알아보세요!',
            imageUrl: 'YOUR_IMAGE_URL', // 실제 이미지 URL로 교체 필요
            link: {
                mobileWebUrl: 'https://testpro.site',
                webUrl: 'https://testpro.site'
            }
        },
        buttons: [
            {
                title: '테스트 하기',
                link: {
                    mobileWebUrl: 'https://testpro.site',
                    webUrl: 'https://testpro.site'
                }
            }
        ]
    });
});

// 다시하기 버튼
document.querySelector('.retry-btn').addEventListener('click', () => {
    currentQuestion = 0;
    scores = {words: 0, time: 0, touch: 0, service: 0, gifts: 0};
    resultSection.style.display = 'none';
    startSection.style.display = 'block';
});

// 페이지 로드 시 광고 초기화
window.onload = function() {
    // 상단 광고 초기화
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('상단 광고 초기화 실패:', e);
    }
};