
let score = {
    wisdom: 0,
    power: 0,
    harmony: 0,
    freedom: 0,
    leadership: 0
};

const results = {
    owl: {
        title: "🦉 지혜로운 올빼미",
        image: "https://testpro.site/k-test/동물/1.png",
        description: "당신은 깊은 통찰력과 지혜를 가진 사람입니다. 조용히 관찰하고 신중하게 판단하며, 밤늦게까지 고민하고 연구하는 것을 즐깁니다. 당신의 조언은 많은 사람들에게 도움이 되며, 문제 해결에 있어 탁월한 능력을 보여줍니다."
    },
    wolf: {
        title: "🐺 용맹한 늑대",
        image: "https://testpro.site/k-test/동물/늑대.png",
        description: "당신은 강인한 의지와 뛰어난 실행력을 가진 사람입니다. 목표를 향해 끊임없이 전진하며, 어려움 앞에서도 굴하지 않는 용기를 가지고 있습니다. 팀워크를 중시하면서도 독립적인 성향을 가지고 있습니다."
    },
    dolphin: {
        title: "🐬 조화로운 돌고래",
        image: "https://testpro.site/k-test/동물/돌고래.png",
        description: "당신은 뛰어난 공감능력과 사교성을 가진 사람입니다. 다른 사람들과의 조화를 중요시하며, 주변 사람들에게 기쁨과 즐거움을 전파하는 능력이 있습니다. 긍정적인 에너지로 주변을 밝게 만듭니다."
    },
    eagle: {
        title: "🦅 자유로운 독수리",
        image: "https://testpro.site/k-test/동물/독수리.png",
        description: "당신은 자유롭고 독립적인 영혼의 소유자입니다. 넓은 시야와 통찰력으로 세상을 바라보며, 자신만의 길을 개척하는 것을 즐깁니다. 높은 이상과 목표를 향해 끊임없이 도전하는 모험가입니다."
    },
    lion: {
        title: "🦁 카리스마 있는 사자",
        image: "https://testpro.site/k-test/동물/사자.png",
        description: "당신은 타고난 리더십과 카리스마를 가진 사람입니다. 당당하고 용감하며, 다른 사람들을 이끄는 데 탁월한 능력을 보여줍니다. 책임감이 강하고 목표를 향해 끊임없이 전진하는 리더의 자질을 갖추고 있습니다."
    }
};

function startTest() {
    document.getElementById('start').classList.remove('active');
    document.getElementById('q1').classList.add('active');
    updateProgress(1);
}

function nextQuestion(questionNumber, trait) {
    score[trait]++;
    
    const currentQuestion = document.querySelector('.section.active');
    
    if (questionNumber === 10) {
        currentQuestion.classList.remove('active');
        showAnalysisPopup();
    } else {
        const nextQuestionId = 'q' + (questionNumber + 1);
        currentQuestion.classList.remove('active');
        document.getElementById(nextQuestionId).classList.add('active');
        updateProgress(questionNumber + 1);
    }
}

function showAnalysisPopup() {
    const popup = document.getElementById('analysisPopup');
    const showResultBtn = document.getElementById('showResultBtn');
    popup.style.display = 'block';
    
    // 3초 후에 결과 확인 버튼 표시
    setTimeout(() => {
        showResultBtn.style.display = 'block';
    }, 3000);

    showResultBtn.onclick = function() {
        popup.style.display = 'none';
        document.getElementById('result').classList.add('active');
        showResult();
    };
}

function updateProgress(questionNumber) {
    const progress = (questionNumber / 10) * 100;
    document.getElementById('progress').style.width = progress + '%';
}

function showResult() {
    let maxTrait = Object.keys(score).reduce((a, b) => score[a] > score[b] ? a : b);
    
    let resultAnimal;
    switch(maxTrait) {
        case 'wisdom':
            resultAnimal = 'owl';
            break;
        case 'power':
            resultAnimal = 'wolf';
            break;
        case 'harmony':
            resultAnimal = 'dolphin';
            break;
        case 'freedom':
            resultAnimal = 'eagle';
            break;
        case 'leadership':
            resultAnimal = 'lion';
            break;
    }
    
    document.getElementById('resultTitle').textContent = results[resultAnimal].title;
    document.getElementById('resultImage').src = results[resultAnimal].image;
    document.getElementById('resultDescription').textContent = results[resultAnimal].description;
}

function shareOnKakao() {
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '나의 수호동물 테스트 결과',
            description: document.getElementById('resultTitle').textContent,
            imageUrl: document.getElementById('resultImage').src,
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
}