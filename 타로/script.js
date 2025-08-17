// 카카오 SDK 초기화
function initKakao() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
        console.log('카카오 SDK 초기화 완료');
    }
}

// 타로 전역 변수
let selectedCards = [];
let tarotReading = {};
let loadedAds = new Set();

// 타로 카드 데이터 (간단한 버전)
const tarotCards = [
    { name: "바보", emoji: "🃏", meaning: "새로운 시작, 순수함, 모험" },
    { name: "마법사", emoji: "🎩", meaning: "의지력, 창조력, 능력" },
    { name: "여사제", emoji: "👸", meaning: "직감, 신비, 내면의 지혜" },
    { name: "여제", emoji: "👑", meaning: "풍요, 창조, 모성" },
    { name: "황제", emoji: "👨‍💼", meaning: "권위, 안정, 리더십" },
    { name: "교황", emoji: "⛪", meaning: "전통, 지혜, 영성" },
    { name: "연인", emoji: "💑", meaning: "사랑, 선택, 조화" },
    { name: "전차", emoji: "🏎️", meaning: "의지, 승리, 결단력" },
    { name: "힘", emoji: "💪", meaning: "용기, 인내, 내면의 힘" },
    { name: "은둔자", emoji: "🕯️", meaning: "성찰, 지혜, 내면 탐구" },
    { name: "운명의 수레바퀴", emoji: "🎰", meaning: "운명, 변화, 순환" },
    { name: "정의", emoji: "⚖️", meaning: "공정, 균형, 진실" },
    { name: "매달린 사람", emoji: "🤸", meaning: "희생, 새로운 관점, 포기" },
    { name: "죽음", emoji: "💀", meaning: "변화, 끝과 시작, 변신" },
    { name: "절제", emoji: "🍷", meaning: "균형, 조화, 절제" },
    { name: "악마", emoji: "😈", meaning: "유혹, 속박, 물질주의" },
    { name: "탑", emoji: "🏗️", meaning: "파괴, 갑작스런 변화, 깨달음" },
    { name: "별", emoji: "⭐", meaning: "희망, 치유, 영감" },
    { name: "달", emoji: "🌙", meaning: "환상, 불안, 직감" },
    { name: "태양", emoji: "☀️", meaning: "기쁨, 성공, 활력" },
    { name: "심판", emoji: "📯", meaning: "부활, 각성, 새로운 기회" },
    { name: "세계", emoji: "🌍", meaning: "완성, 성취, 여행" }
];

// 광고 관리 객체
const adManager = {
    observer: null,
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const adContainer = entry.target;
                    const adId = adContainer.id;
                    
                    if (!loadedAds.has(adId)) {
                        this.loadAd(adId);
                        loadedAds.add(adId);
                        this.observer.unobserve(adContainer);
                    }
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px' 
        });
    },
    
    observe(adId) {
        const adElement = document.getElementById(adId);
        if (adElement && this.observer) {
            this.observer.observe(adElement);
        }
    },
    
    loadAd(adId) {
        try {
            const adElement = document.getElementById(adId);
            if (adElement && typeof (adsbygoogle) !== 'undefined') {
                if (window.innerWidth <= 768) {
                    adElement.style.minHeight = '60px';
                    adElement.style.maxHeight = '80px';
                    adElement.style.border = '1px solid rgba(102, 126, 234, 0.2)';
                    adElement.style.borderRadius = '6px';
                    adElement.style.padding = '5px';
                    adElement.style.margin = '5px 0';
                } else {
                    adElement.style.minHeight = '80px';
                    adElement.style.maxHeight = '120px';
                    adElement.style.padding = '8px';
                    adElement.style.margin = '8px 0';
                }
                
                (adsbygoogle = window.adsbygoogle || []).push({});
                console.log(`광고 로드 완료: ${adId}`);
            }
        } catch (error) {
            console.error(`광고 로드 실패: ${adId}`, error);
        }
    },
    
    showMidAd() {
        const midAd = document.getElementById('adMid');
        if (midAd) {
            midAd.style.display = 'block';
            midAd.style.margin = '6px 0';
            if (window.innerWidth <= 768) {
                midAd.style.maxHeight = '70px';
            }
            this.observe('adMid');
        }
    }
};

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('타로 테스트 초기화 시작');
    
    // 카카오 SDK 초기화
    initKakao();
    
    // 광고 관리 초기화
    adManager.init();
    
    // 상단 광고 관찰 시작
    adManager.observe('adTop');
    
    // 전역 함수 노출
    window.startTarotReading = startTarotReading;
    window.selectCard = selectCard;
    window.proceedToReading = proceedToReading;
    window.resetTest = resetTest;
    window.shareKakao = shareKakao;
    
    // 10초 후 자동으로 스크롤 유도
    setTimeout(() => {
        const urgencyNotice = document.querySelector('.urgency-notice');
        if (urgencyNotice) {
            urgencyNotice.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 10000);
});

// 타로 읽기 시작 함수
function startTarotReading() {
    console.log('타로 읽기 시작');
    
    // 초기화
    selectedCards = [];
    tarotReading = {};
    
    // 섹션 전환
    document.getElementById('startPage').style.display = 'none';
    document.getElementById('cardPage').style.display = 'block';
    document.getElementById('cardPage').classList.remove('hidden');
    
    // 카드 그리드 생성
    generateCardGrid();
    updateSelectedCount();
}

// 카드 그리드 생성 함수
function generateCardGrid() {
    const cardsGrid = document.getElementById('cardsGrid');
    cardsGrid.innerHTML = '';
    
    // 15장의 카드 뒷면 생성
    for (let i = 0; i < 15; i++) {
        const cardElement = document.createElement('div');
        cardElement.className = 'tarot-card';
        cardElement.innerHTML = `
            <div class="card-back">
                <span class="card-number">${i + 1}</span>
                <div class="card-pattern">🔮</div>
            </div>
        `;
        cardElement.addEventListener('click', () => selectCard(i));
        cardsGrid.appendChild(cardElement);
    }
}

// 카드 선택 함수
function selectCard(cardIndex) {
    if (selectedCards.length >= 3) return;
    if (selectedCards.includes(cardIndex)) return;
    
    selectedCards.push(cardIndex);
    
    // 선택된 카드 시각적 표시
    const cardElements = document.querySelectorAll('.tarot-card');
    cardElements[cardIndex].classList.add('selected');
    cardElements[cardIndex].innerHTML = `
        <div class="card-back selected">
            <span class="card-number">${selectedCards.length}</span>
            <div class="card-pattern">✨</div>
        </div>
    `;
    
    updateSelectedCount();
    
    // 3장 선택 완료시
    if (selectedCards.length === 3) {
        setTimeout(() => {
            document.getElementById('proceedBtn').classList.remove('hidden');
            adManager.showMidAd();
        }, 500);
    }
}

// 선택된 카드 수 업데이트
function updateSelectedCount() {
    const countElement = document.getElementById('selectedCount');
    if (countElement) {
        countElement.textContent = selectedCards.length;
    }
}

// 운세 해석으로 진행
function proceedToReading() {
    console.log('운세 해석 시작');
    
    // 섹션 전환
    document.getElementById('cardPage').style.display = 'none';
    document.getElementById('loadingPage').style.display = 'block';
    document.getElementById('loadingPage').classList.remove('hidden');
    
    // 로딩 단계별 진행
    setTimeout(() => {
        showLoadingStep(1);
    }, 500);
    
    setTimeout(() => {
        showLoadingStep(2);
    }, 1500);
    
    setTimeout(() => {
        showLoadingStep(3);
    }, 2500);
    
    // 3초 후 결과 표시
    setTimeout(() => {
        generateTarotReading();
        showResults();
    }, 3500);
}

// 로딩 단계 표시 함수
function showLoadingStep(stepNumber) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index < stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// 타로 리딩 생성 함수
function generateTarotReading() {
    // 선택된 카드에 해당하는 타로 카드 할당
    const pastCard = tarotCards[selectedCards[0] % tarotCards.length];
    const presentCard = tarotCards[selectedCards[1] % tarotCards.length];
    const futureCard = tarotCards[selectedCards[2] % tarotCards.length];
    
    tarotReading = {
        past: {
            card: pastCard,
            meaning: `과거의 ${pastCard.name} 카드는 ${pastCard.meaning}을 의미합니다. 지나온 시간 동안의 경험이 현재의 당신을 만들었습니다.`
        },
        present: {
            card: presentCard,
            meaning: `현재의 ${presentCard.name} 카드는 ${presentCard.meaning}을 나타냅니다. 지금 이 순간 당신의 상황과 에너지를 반영합니다.`
        },
        future: {
            card: futureCard,
            meaning: `미래의 ${futureCard.name} 카드는 ${futureCard.meaning}을 예시합니다. 앞으로의 가능성과 방향을 제시합니다.`
        },
        advice: `${pastCard.name}, ${presentCard.name}, ${futureCard.name} 카드의 조합을 통해 보면, 과거의 경험을 바탕으로 현재 상황을 잘 활용하여 밝은 미래를 만들어갈 수 있습니다. 특히 ${presentCard.meaning}에 집중하여 ${futureCard.meaning}의 에너지를 받아들이시기 바랍니다.`
    };
}

// 결과 표시 함수
function showResults() {
    console.log('결과 표시');
    
    // 섹션 전환
    document.getElementById('loadingPage').style.display = 'none';
    document.getElementById('resultPage').style.display = 'block';
    document.getElementById('resultPage').classList.remove('hidden');
    
    // 결과 렌더링
    renderTarotResults();
    
    // 결과 광고 표시
    adManager.observe('adResult');
}

// 타로 결과 렌더링 함수
function renderTarotResults() {
    // 과거 카드
    document.getElementById('pastCard').textContent = tarotReading.past.card.emoji;
    document.getElementById('pastCardName').textContent = tarotReading.past.card.name;
    document.getElementById('pastCardMeaning').textContent = tarotReading.past.meaning;
    
    // 현재 카드
    document.getElementById('presentCard').textContent = tarotReading.present.card.emoji;
    document.getElementById('presentCardName').textContent = tarotReading.present.card.name;
    document.getElementById('presentCardMeaning').textContent = tarotReading.present.meaning;
    
    // 미래 카드
    document.getElementById('futureCard').textContent = tarotReading.future.card.emoji;
    document.getElementById('futureCardName').textContent = tarotReading.future.card.name;
    document.getElementById('futureCardMeaning').textContent = tarotReading.future.meaning;
    
    // 조언
    document.getElementById('adviceContent').textContent = tarotReading.advice;
}

// 테스트 재시작 함수
function resetTest() {
    console.log('타로 테스트 재시작');
    
    // 변수 초기화
    selectedCards = [];
    tarotReading = {};
    
    // 섹션 전환
    document.getElementById('resultPage').style.display = 'none';
    document.getElementById('resultPage').classList.add('hidden');
    document.getElementById('loadingPage').style.display = 'none';
    document.getElementById('loadingPage').classList.add('hidden');
    document.getElementById('cardPage').style.display = 'none';
    document.getElementById('cardPage').classList.add('hidden');
    document.getElementById('startPage').style.display = 'block';
    
    // 진행 버튼 숨기기
    document.getElementById('proceedBtn').classList.add('hidden');
}

// 카카오톡 공유 함수
function shareKakao() {
    if (!window.Kakao) {
        alert('카카오톡 공유 기능을 사용할 수 없습니다.');
        return;
    }
    
    const cards = [
        tarotReading.past.card.name,
        tarotReading.present.card.name,
        tarotReading.future.card.name
    ].join(', ');
    
    Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: '🔮 타로 카드 운세 결과',
            description: `나의 타로 카드: ${cards}\n신비로운 메시지를 확인해보세요!`,
            imageUrl: 'https://sd2624.github.io/타로/타로.png',
            link: {
                mobileWebUrl: 'https://sd2624.github.io/타로/',
                webUrl: 'https://sd2624.github.io/타로/'
            }
        },
        buttons: [
            {
                title: '나도 타로 보기',
                link: {
                    mobileWebUrl: 'https://sd2624.github.io/타로/',
                    webUrl: 'https://sd2624.github.io/타로/'
                }
            }
        ]
    });
}