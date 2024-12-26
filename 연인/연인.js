// 연인.js

document.addEventListener('DOMContentLoaded', () => {
    let currentQuestion = 1;
    const totalQuestions = 45;
    const maxScorePerType = 9 * 2; // 각 유형당 최대 점수 (9문항 * 선택값 최대 2)
    const progressBar = document.getElementById('progressBar');
    const testSection = document.getElementById('testSection');
    const resultSection = document.getElementById('resultSection');
    const resultText = document.getElementById('resultText');
    const showResultButton = document.getElementById('showResultButton');
    const startTestButton = document.getElementById('startTest');
    const questionsContainer = document.getElementById('questionsContainer');
    
    // 팝업 요소
    const adPopup = document.getElementById('adPopup');
    const popupOverlay = document.querySelector('.popup-overlay');
    const confirmAdPopupBtn = adPopup.querySelector('.confirm-popup-btn');
    const adsenseContainer = document.querySelector('#adsense-container');
    const counter = document.querySelector('#counter');
    let countdown;

    // 질문 완료 안내 팝업 요소
    const incompletePopup = document.getElementById('incompletePopup');
    const incompletePopupOverlay = document.getElementById('incompletePopupOverlay');
    const confirmIncompleteBtn = incompletePopup.querySelector('.confirm-incomplete-btn');

    // 각 유형에 대한 점수
    let scores = {
        type1: 0, // 미련형
        type2: 0, // 분노형
        type3: 0, // 후회형
        type4: 0, // 무덤덤형
        type5: 0  // 무감정형(공허·냉소)
    };
    
    // 각 질문에 대한 점수 매핑 (각 유형별로 9개의 질문)
    const questionTypeMapping = {
        1: 'type1', 2: 'type1', 3: 'type1', 4: 'type1', 5: 'type1', 6: 'type1', 7: 'type1', 8: 'type1', 9: 'type1',
        10: 'type2', 11: 'type2', 12: 'type2', 13: 'type2', 14: 'type2', 15: 'type2', 16: 'type2', 17: 'type2', 18: 'type2',
        19: 'type3', 20: 'type3', 21: 'type3', 22: 'type3', 23: 'type3', 24: 'type3', 25: 'type3', 26: 'type3', 27: 'type3',
        28: 'type4', 29: 'type4', 30: 'type4', 31: 'type4', 32: 'type4', 33: 'type4', 34: 'type4', 35: 'type4', 36: 'type4',
        37: 'type5', 38: 'type5', 39: 'type5', 40: 'type5', 41: 'type5', 42: 'type5', 43: 'type5', 44: 'type5', 45: 'type5'
    };
    
    // 질문 데이터
    const questions = {
        1: "헤어진 후에도 상대방의 소셜 미디어를 자주 확인하며, 상대방의 일상을 엿보려는 충동을 느끼나요?",
        2: "상대방과 다시 만날 수 있을 것이라는 희망을 품고, 재회의 순간을 자주 상상하거나 계획하나요?",
        3: "헤어진 이후에도 상대방이 보낸 선물이나 사진 같은 물건을 정리하지 못하고 간직하고 있나요?",
        4: "상대방이 이별을 결정한 이유에 대해 깊이 고민하며 이해하려고 애쓰고 있나요?",
        5: "상대방에게 연락을 하고 싶은 마음이 자주 들고, 어떻게든 다시 연결되고 싶다는 생각을 하나요?",
        6: "이별 이후에도 상대방이 언젠가 다시 나를 사랑하게 될 것이라는 희망을 놓지 않고 있나요?",
        7: "상대방이 나 없이 행복할 수 있다는 사실을 받아들이기가 어려운가요?",
        8: "주변 사람들에게도 상대방에 대한 이야기를 자주 꺼내며 상대방과의 추억을 공유하나요?",
        9: "상대방도 나를 그리워하고 있을 거라는 믿음을 가지고 싶어 하나요?",
        10: "헤어진 이유가 온전히 상대방 탓이라고 생각하며, 상대방이 모든 문제를 일으켰다고 믿고 있나요?",
        11: "상대방에 대한 부정적인 감정이나 불만을 주변 사람들에게 자주 이야기하며 분노를 표출하나요?",
        12: "헤어진 후에도 상대방에 대한 분노가 가라앉지 않아 화가 나는 순간이 많나요?",
        13: "상대방이 나를 배신했다고 느끼며, 그런 감정이 이별 후에도 계속 남아 있나요?",
        14: "상대방이 나보다 더 행복하게 사는 것을 상상하거나 용납하기가 힘든가요?",
        15: "이별 이후 상대방의 장점보다는 단점만 더 뚜렷하게 떠오르고 있나요?",
        16: "상대방이 언젠가 자신의 선택을 후회하게 만들고 싶다는 생각을 자주 하나요?",
        17: "주변 사람들에게 상대방에 대해 부정적인 이야기를 하면서 속이 조금이라도 풀린다고 느끼나요?",
        18: "상대방에게 복수하고 싶다는 생각이 들거나 상대방에게 나쁜 일이 생기길 바란 적이 있나요?",
        19: "이별의 원인이 전적으로 상대방의 행동이나 성격 때문이라고 믿고 있나요?",
        20: "이별 후 내가 상대방에게 더 잘했더라면 결과가 달라졌을 것이라고 자주 생각하나요?",
        21: "이별은 막을 수 있었던 일이라고 느끼며, 이를 피하지 못한 것을 후회하나요?",
        22: "내가 했던 말이나 행동 중 잘못되었다고 느낀 부분이 자꾸 떠올라 괴롭나요?",
        23: "상대방에게 마지막으로 진심으로 사과하고 싶은 마음이 아직 남아 있나요?",
        24: "내 실수나 행동이 이별의 결정적인 원인이라고 느끼며 자책하고 있나요?",
        25: "상대방과 나눴던 대화나 갈등의 순간들이 머릿속에서 자주 떠오르나요?",
        26: "시간을 되돌릴 수 있다면 모든 것을 바꾸고, 다시는 같은 실수를 반복하지 않을 것 같나요?",
        27: "내가 더 노력했더라면 이별을 막을 수 있었을 것이라고 생각하나요?",
        28: "상대방을 실망시킨 기억이 마음에 남아 이별 이후에도 자주 떠오르나요?",
        29: "내가 느끼는 후회와 자책감을 상대방이 알아주었으면 좋겠다고 생각하나요?",
        30: "이별 후에도 감정적으로 크게 동요하지 않고 비교적 평온하게 일상을 보내고 있나요?",
        31: "헤어진 것을 자연스러운 일로 받아들이며, 큰 어려움 없이 일상에 적응하고 있나요?",
        32: "상대방과의 좋은 추억만 간직하려고 하며, 이별의 아픔을 크게 신경 쓰지 않으려 하나요?",
        33: "주변 사람들이 이별에 대해 물어보더라도 별다른 감정 없이 차분하게 대답할 수 있나요?",
        34: "이별 이후에도 일상생활에서 크게 달라진 점 없이 평소처럼 지내고 있나요?",
        35: "이별을 나 자신이 더 성장하기 위한 자연스러운 과정이라고 받아들이고 있나요?",
        36: "상대방과의 관계를 논리적으로 되돌아보며, 이별이 필연적이었다고 느끼나요?",
        37: "이별이 두 사람 모두에게 더 나은 선택이었다는 점에서 동의할 수 있나요?",
        38: "이별 후에도 평소와 비슷한 감정을 유지하며 큰 변화나 충격을 느끼지 못하고 있나요?",
        39: "헤어진 후 상대방에 대한 특별한 감정이나 애정이 남아 있지 않다고 느끼나요?",
        40: "이별 후 공허함이나 외로움보다는 아무런 감정을 느끼지 않고 있나요?",
        41: "상대방이 내 삶에서 더 이상 중요한 의미를 가지지 않는다고 느끼고 있나요?",
        42: "이별 후 공허함과 외로움이 크게 느껴져서 삶이 무의미하게 느껴질 때가 있나요?",
        43: "이별 이후 인간관계 전반에 대해 냉소적인 태도가 생기고 신뢰를 잃은 것 같나요?",
        44: "이별 후 감정적으로 무뎌져서 상대방에 대한 기억이 생생하게 떠오르지 않나요?",
        45: "상대방과의 이별이 아무 의미가 없다고 느끼며, 감정적으로 무감각해졌나요?"
    };
    
    // 라디오 버튼 값 설정
    const radioValues = [
        { value: -2, label: "전혀 그렇지 않다" },
        { value: -1, label: "" },
        { value: 0, label: "" },
        { value: 1, label: "" },
        { value: 2, label: "매우 그렇다" }
    ];
    
    // 질문 생성 함수
    function generateQuestions() {
        for (let i = 1; i <= totalQuestions; i++) {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question', 'hidden');
            questionDiv.setAttribute('data-question', i);
            
            const questionText = document.createElement('p');
            questionText.textContent = questions[i] || `질문 ${i} 내용...`;
            questionDiv.appendChild(questionText);
            
            const radioContainer = document.createElement('div');
            radioContainer.classList.add('radioContainer');
            
            radioValues.forEach((radio, index) => {
                if (index === 0) {
                    const spanFalse = document.createElement('span');
                    spanFalse.classList.add('false');
                    spanFalse.textContent = radio.label;
                    radioContainer.appendChild(spanFalse);
                }
                
                const label = document.createElement('label');
                label.classList.add('labelContainer');
                
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `q${i}`;
                input.value = radio.value;
                
                const checkmark = document.createElement('span');
                checkmark.classList.add('checkmark');
                
                label.appendChild(input);
                label.appendChild(checkmark);
                radioContainer.appendChild(label);
                
                if (index === radioValues.length - 1) {
                    const spanTrue = document.createElement('span');
                    spanTrue.classList.add('true');
                    spanTrue.textContent = radio.label;
                    radioContainer.appendChild(spanTrue);
                }
            });
            
            questionDiv.appendChild(radioContainer);
            questionsContainer.appendChild(questionDiv);
        }
        console.log('All questions generated.');
    }
    
    // 질문 표시 함수
    function showQuestion(questionNumber) {
        const questions = document.querySelectorAll('.question');
        questions.forEach(q => q.classList.add('hidden'));
        const current = document.querySelector(`.question[data-question="${questionNumber}"]`);
        if (current) {
            current.classList.remove('hidden');
            console.log(`Showing question ${questionNumber}`);
        } else {
            console.log(`No question found for ${questionNumber}`);
        }

        // 진행 상황 업데이트
        updateProgressBar();
    }
    
    // 진행 바 업데이트 함수
    function updateProgressBar() {
        const percentage = (currentQuestion / totalQuestions) * 100;
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${Math.round(percentage)}%`;
        console.log(`Progress: ${percentage}%`);
    }
    
    // 답변 처리 함수
    function handleAnswer(event) {
        const selectedValue = parseInt(event.target.value, 10);  // 선택된 값 가져오기
        console.log(`Selected value: ${selectedValue}`);
    
        if (isNaN(selectedValue)) return;
    
        // 선택된 값에 해당하는 점수 추가 (해당 유형에 점수 반영)
        const questionType = questionTypeMapping[currentQuestion];
        console.log(`Question Type: ${questionType}`);
        scores[questionType] += selectedValue;
        console.log(`Score for ${questionType}: ${scores[questionType]}`);
    
        // 질문 번호 증가 후, 다음 질문 표시
        currentQuestion++;
        console.log(`Current Question: ${currentQuestion}`);
    
        if (currentQuestion <= totalQuestions) {
            showQuestion(currentQuestion);
        } else {
            // 모든 질문을 끝낸 후 "결과 보기" 버튼 활성화
            showResultButton.disabled = false;
            console.log(`All questions completed. Show Result button enabled.`);
        }
    }
    
    // 테스트 시작 버튼 클릭 시
    startTestButton.addEventListener('click', () => {
        document.querySelector('header').classList.add('hidden');
        testSection.classList.remove('hidden');
        showQuestion(currentQuestion);
        console.log('Test started');
    });
    
    // 이벤트 위임을 통한 라디오 버튼 이벤트 리스너 추가
    testSection.addEventListener('change', (event) => {
        if (event.target.matches('input[type="radio"]')) {
            handleAnswer(event);
        }
    });
    
    // 결과 보기 버튼 클릭 시 팝업 열기
    showResultButton.addEventListener('click', () => {
        if (currentQuestion > totalQuestions) {
            // 모든 질문이 완료된 경우 팝업 열기
            adPopup.style.display = 'block'; // 팝업 표시
            popupOverlay.style.display = 'block'; // 배경 표시
            loadAd(); // 광고 로드
            startCountdown(); // 카운트다운 시작
            console.log('Show Result button clicked: all questions completed');
        } else {
            // 질문이 완료되지 않은 경우 안내 팝업 열기
            incompletePopup.style.display = 'block';
            incompletePopupOverlay.style.display = 'block';
            console.log('Show Result button clicked: incomplete');
        }
    });
    
    // 광고 팝업의 확인 버튼 클릭 시 팝업 닫기 및 결과 표시
    confirmAdPopupBtn.addEventListener('click', () => {
        // 팝업 닫기
        adPopup.style.display = 'none'; // 팝업 숨기기
        popupOverlay.style.display = 'none'; // 배경 숨기기
        console.log('Ad popup confirmed and closed');
    
        // 광고 제거 및 카운트다운 정지
        clearAd(); // 광고 제거
        clearInterval(countdown); // 카운트다운 정지
    
        // 결과 표시
        showResult(); // 결과 표시
        console.log('Showing result');
    });
    
    // 질문 완료 안내 팝업의 확인 버튼 클릭 시 팝업 닫기
    confirmIncompleteBtn.addEventListener('click', () => {
        incompletePopup.style.display = 'none';
        incompletePopupOverlay.style.display = 'none';
        console.log('Incomplete popup confirmed and closed');
    });
    
    // 배경 클릭 시 팝업 닫기
    popupOverlay.addEventListener('click', () => {
        adPopup.style.display = 'none';
        popupOverlay.style.display = 'none';
        incompletePopup.style.display = 'none'; // 질문 완료 안내 팝업 숨기기
        incompletePopupOverlay.style.display = 'none'; // 질문 완료 안내 팝업 배경 숨기기
        clearAd(); // 광고 제거
        clearInterval(countdown); // 카운트다운 정지
        console.log('Popup overlay clicked: popups closed');
    });
    
    // 광고 로드 함수
    function loadAd() {
        const adScript = document.createElement('script');
        adScript.async = true;
        adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9374368296307755";
        document.head.appendChild(adScript);
        console.log('Ad script loaded');
    
        const adContainer = document.createElement('ins');
        adContainer.classList.add('adsbygoogle');
        adContainer.style.display = 'block';
        adContainer.setAttribute('data-ad-client', 'ca-pub-9374368296307755');
        adContainer.setAttribute('data-ad-slot', '3201247599');
        adContainer.setAttribute('data-ad-format', 'auto');
        adContainer.setAttribute('data-full-width-responsive', 'true');
    
        adsenseContainer.appendChild(adContainer);
        console.log('Ad container appended');
    
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
    
    // 광고 제거 함수
    function clearAd() {
        adsenseContainer.innerHTML = '';
        console.log('Ads cleared');
    }
    
    // 카운트다운 함수
    function startCountdown() {
        let timeLeft = 7;
        counter.textContent = `${timeLeft}초 결과값 확인중 입니다..`;
        console.log(`Countdown started: ${timeLeft} seconds`);
    
        countdown = setInterval(() => {
            timeLeft--;
            counter.textContent = `${timeLeft}초 결과값 확인중 입니다..`;
            console.log(`Countdown: ${timeLeft} seconds left`);
            if (timeLeft <= 0) {
                clearInterval(countdown);
                counter.textContent = "결과값이 나왔습니다";
                // "확인" 버튼 활성화
                confirmAdPopupBtn.disabled = false;
                confirmAdPopupBtn.classList.add('enabled');
                console.log('Countdown ended: Confirm button enabled');
            }
        }, 1000);
    }
    
    // 결과 계산 및 표시 함수
    function showResult() {
        // 점수 내림차순으로 정렬
        const sortedScores = Object.keys(scores)
            .map(type => ({ type, score: scores[type] }))
            .sort((a, b) => b.score - a.score);
    
        // 결과 메시지 생성
        let resultDetails = sortedScores.map((item, index) => {
            const percentage = (item.score / maxScorePerType) * 100;  // 각 유형의 최대 점수를 기준으로 퍼센트 계산
            return `
                <div class="result-item">
                    <div class="result-type">${index + 1}. ${getTypeName(item.type)}</div>
                    <div class="result-score">${percentage.toFixed(2)}%</div>
                    <div><a href="#" class="more-info" data-type="${item.type}" aria-label="${getTypeName(item.type)} 자세히 알아보기">자세히 알아보기</a></div>
                </div>
            `;
        }).join('');
    
        resultText.innerHTML = `<h2>당신의 연인 유형은:</h2>${resultDetails}`;
        resultSection.classList.remove('hidden');
        console.log('Result section displayed');
    
        // "자세히 알아보기" 클릭 이벤트 추가
        document.querySelectorAll('.more-info').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const type = e.target.getAttribute('data-type');
                showDetailedPage(type);
            });
        });
    
        // 소셜 미디어 공유 버튼 추가
        addShareButtons();
        console.log('Share buttons added');
    }
    
    // 소셜 미디어 공유 버튼 추가 함수
    function addShareButtons() {
        const shareButtons = [
            { id: 'facebookShare', alt: '페이스북 공유', icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png' },
            { id: 'twitterShare', alt: '트위터 공유', icon: 'https://cdn-icons-png.flaticon.com/512/124/124021.png' },
            { id: 'kakaoShare', alt: '카카오톡 공유', icon: '/k-test/log/카톡.png' },
            { id: 'urlShare', alt: 'URL 복사', icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png' },     
        ];
    
        const shareContainer = document.createElement('div');
        shareContainer.classList.add('share-buttons');
    
        // 각 버튼을 생성하여 추가
        shareButtons.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.id = button.id;
            buttonElement.classList.add('share-button');
            buttonElement.setAttribute('aria-label', button.alt);
            buttonElement.innerHTML = `<img src="${button.icon}" alt="${button.alt}" />`;
    
            // 공유 버튼 클릭 이벤트
            buttonElement.addEventListener('click', () => {
                shareContent(button.id);
            });
    
            shareContainer.appendChild(buttonElement);
        });
    
        // 공유 버튼을 결과 화면에 추가
        resultSection.appendChild(shareContainer);
        console.log('Share buttons appended to result section');
    }
    
    // 콘텐츠 공유 함수 (각 소셜 미디어 버튼 클릭 시)
    function shareContent(platform) {
        const url = window.location.href;  // 현재 페이지 URL
        const text = '나의 연인 유형은? 확인해보세요!';
    
        switch(platform) {
            case 'facebookShare':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'instagramShare':
                // 인스타그램은 URL 공유가 직접적으로 지원되지 않음
                alert('인스타그램에서는 URL 공유가 지원되지 않습니다.');
                break;
            case 'twitterShare':
                window.open(`https://twitter.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                break;
            case 'urlShare':
                navigator.clipboard.writeText(url)
                    .then(() => {
                        alert('URL이 클립보드에 복사되었습니다!');
                    })
                    .catch(err => {
                        console.error('URL 복사 실패:', err);
                        alert('URL 복사에 실패했습니다. 수동으로 복사해 주세요.');
                    });
                break;
                case 'kakaoShare':
                    // 카카오톡 공유 기능
                    Kakao.Link.sendDefault({
                        objectType: 'feed',
                        content: {
                            title: '나의 유형은?',
                            description: text,
                            imageUrl: 'https://testpro.site/k-test/연인/연인.png',  // 공유할 이미지 URL (필요시 수정)
                            link: {
                                mobileWebUrl: url,
                                webUrl: url
                            }
                        },
                        buttons: [
                            {
                                title: '자세히 보기',
                                link: {
                                    mobileWebUrl: url,
                                    webUrl: url
                                }
                            }
                        ]
                    });
                    break;    
            default:
                break;
        }
    }
    
    // 유형 이름 반환 함수
    function getTypeName(type) {
        switch (type) {
            case 'type1': return '미련형';
            case 'type2': return '분노형';
            case 'type3': return '후회형';
            case 'type4': return '무덤덤형';
            case 'type5': return '무감정형(공허·냉소)';
            default: return '';
        }
    }
    
    // 자세히 알아보기 페이지로 이동 함수
    function showDetailedPage(type) {
        // 각 유형에 맞는 페이지 URL 설정
        const pageUrls = {
            type1: 'https://testpro.site/k-test/연인/미련형',
            type2: 'https://testpro.site/k-test/연인/분노형',
            type3: 'https://testpro.site/k-test/연인/후회형',
            type4: 'https://testpro.site/k-test/연인/무덤덤형',
            type5: 'https://testpro.site/k-test/연인/무감정형'
        };

        // 해당 페이지로 이동
        window.location.href = pageUrls[type];
    }
    
    // 질문 생성
    generateQuestions();
});
