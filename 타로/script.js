import tarotData from './tarot-data.js';

document.addEventListener('DOMContentLoaded', () => {
    const selectButton = document.getElementById('selectCards');
    const cardSlots = document.querySelectorAll('.card-slot');
    const shareButton = document.getElementById('shareKakao');
    const loadingPopup = document.getElementById('loadingPopup');
    let selectedCards = [];
    let cardOrientations = [];
    let allCardsSelected = false;
    
    // 광고 로드 상태 관리 - 중복 로드 방지
    const adLoadedState = {
        'ad-top': false,
        'ad-middle': false,
        'ad-result': false
    };

    // 광고 IntersectionObserver 설정
    const adObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !adLoadedState[entry.target.id]) {
                const adElement = entry.target.querySelector('.adsbygoogle');
                if (adElement && !adElement.hasAttribute('data-adsbygoogle-status')) {
                    try {
                        (adsbygoogle = window.adsbygoogle || []).push({});
                        adLoadedState[entry.target.id] = true;
                        console.log(`광고 로드됨: ${entry.target.id}`);
                    } catch (e) {
                        console.error('광고 로드 오류:', e);
                    }
                }
            }
        });
    }, {
        rootMargin: '50px',
        threshold: 0.1
    });

    // 페이지 로드 시 상단 광고 관찰 시작
    const topAd = document.getElementById('ad-top');
    if (topAd) {
        adObserver.observe(topAd);
    }

    function getCardSymbol(cardName) {
        const symbols = {
            // 메이저 아르카나
            "바보": "🃏",
            "마법사": "🎭",
            "여사제": "🌙",
            "여황제": "👑",
            "황제": "👑",
            "교황": "⚜️",
            "연인": "❤️",
            "전차": "⚔️",
            "힘": "🦁",
            "은둔자": "🏮",
            "운명의 수레바퀴": "🎡",
            "정의": "⚖️",
            "매달린 사람": "🙃",
            "죽음": "💀",
            "절제": "🌊",
            "악마": "😈",
            "탑": "🗼",
            "별": "⭐",
            "달": "🌕",
            "태양": "☀️",
            "심판": "📯",
            "세계": "🌍",
            // 펜타클
            "펜타클의 에이스": "💰",
            "펜타클의 2": "🔄",
            "펜타클의 3": "👨‍🎓",
            "펜타클의 4": "💎",
            "펜타클의 5": "🏥",
            "펜타클의 6": "🎁",
            "펜타클의 7": "🌱",
            "펜타클의 8": "⚒️",
            "펜타클의 9": "🏰",
            "펜타클의 10": "👨‍👩‍👧‍👦",
            "펜타클의 시종": "📚",
            "펜타클의 기사": "🛡️",
            "펜타클의 여왕": "👸",
            "펜타클의 왕": "👑"
        };
        return symbols[cardName] || "🌟";
    }

    function showLoadingAndAd() {
        loadingPopup.style.display = 'flex';
        
        // 중간 광고 표시 및 관찰 시작
        const middleAd = document.getElementById('ad-middle');
        if (middleAd) {
            middleAd.style.display = 'block';
            adObserver.observe(middleAd);
        }

        setTimeout(() => {
            loadingPopup.style.display = 'none';
            alert('타로 카드 분석이 완료되었습니다!');
            
            // 모든 카드의 해석을 한번에 표시
            selectedCards.forEach((card, index) => {
                const reading = document.getElementById(`reading${index + 1}`);
                const isUpright = cardOrientations[index];
                displayReading(reading, card, isUpright);
                
                // 두 번째 reading 후에 결과 광고 표시
                if (index === 1) {
                    const resultAd = document.getElementById('ad-result');
                    if (resultAd) {
                        resultAd.style.display = 'block';
                        adObserver.observe(resultAd);
                    }
                }
            });
            
            shareButton.style.display = 'inline-block';
        }, 7000);
    }

    selectButton.addEventListener('click', () => {
        // 카드 초기화
        selectedCards = [];
        cardOrientations = [];
        allCardsSelected = false;
        shareButton.style.display = 'none';
        
        // 광고 숨기기 및 관찰 중단
        const middleAd = document.getElementById('ad-middle');
        const resultAd = document.getElementById('ad-result');
        
        if (middleAd) {
            middleAd.style.display = 'none';
            adObserver.unobserve(middleAd);
        }
        if (resultAd) {
            resultAd.style.display = 'none';
            adObserver.unobserve(resultAd);
        }
        
        cardSlots.forEach(slot => {
            slot.classList.remove('flipped');
            const reading = document.getElementById(`reading${slot.id.slice(-1)}`);
            reading.style.display = 'none';
            reading.innerHTML = '';
        });

        // 랜덤으로 3장의 카드 선택 및 방향 결정
        const shuffledCards = [...tarotData.major].sort(() => Math.random() - 0.5);
        selectedCards = shuffledCards.slice(0, 3);
        cardOrientations = selectedCards.map(() => Math.random() < 0.5);

        // 카드 표시
        selectedCards.forEach((card, index) => {
            const cardSlot = cardSlots[index];
            const cardFront = cardSlot.querySelector('.card-front');
            const isUpright = cardOrientations[index];
            
            cardFront.innerHTML = `
                <div class="card-symbol">${getCardSymbol(card.name)}</div>
                <h3>${card.name}</h3>
                <div class="card-image" style="background-image: url('images/${card.image}'); 
                     ${isUpright ? '' : 'transform: rotate(180deg)'}"></div>
            `;

            cardSlot.onclick = () => revealCard(index + 1);
        });

        selectButton.disabled = true;
        setTimeout(() => {
            selectButton.disabled = false;
        }, 1000);
    });

    function revealCard(index) {
        const cardSlot = document.getElementById(`card${index}`);
        
        if (!cardSlot.classList.contains('flipped')) {
            cardSlot.classList.add('flipped');
            
            // 모든 카드가 선택되었는지 확인
            if (document.querySelectorAll('.card-slot.flipped').length === 3 && !allCardsSelected) {
                allCardsSelected = true;
                showLoadingAndAd();
            }
        }
    }

    function displayReading(readingElement, card, isUpright) {
        readingElement.innerHTML = `
            <h3>
                <span class="card-emoji">${getCardSymbol(card.name)}</span>
                ${card.name} (${isUpright ? '정방향' : '역방향'})
            </h3>
            <p><strong>키워드:</strong> ${card.keywords.join(', ')}</p>
            <p><strong>해석:</strong> ${card.interpretation.설명}</p>
            <div class="meaning-section">
                <h4>🔮 운세 해석:</h4>
                <p><strong>💕 사랑:</strong> ${isUpright ? card.meanings.사랑.정방향 : card.meanings.사랑.역방향}</p>
                <p><strong>💼 직업/목표:</strong> ${isUpright ? card.meanings.직업목표_성취_열망.정방향 : card.meanings.직업목표_성취_열망.역방향}</p>
                <p><strong>💰 재정:</strong> ${isUpright ? card.meanings.경제적.정방향 : card.meanings.경제적.역방향}</p>
                <p><strong>🏥 건강:</strong> ${isUpright ? card.meanings.건강.정방향 : card.meanings.건강.역방향}</p>
            </div>
            <p><strong>💫 메시지:</strong> ${isUpright ? card.interpretation.긍정적인 : card.interpretation.부정적인}</p>
        `;
        readingElement.style.display = 'block';
    }

    shareButton.addEventListener('click', () => {
        const readings = selectedCards.map((card, index) => {
            const isUpright = cardOrientations[index];
            return `${getCardSymbol(card.name)} ${card.name}(${isUpright ? '정방향' : '역방향'})`;
        }).join('\n');

        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '🔮 오늘의 타로 운세',
                description: `선택된 카드:\n${readings}`,
                imageUrl: 'YOUR_IMAGE_URL',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
            buttons: [
                {
                    title: '타로 보러가기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });
    });
});