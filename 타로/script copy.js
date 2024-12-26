import tarotData from './tarot-data.js';

document.addEventListener('DOMContentLoaded', () => {
    const selectButton = document.getElementById('selectCards');
    const cardSlots = document.querySelectorAll('.card-slot');
    const shareButton = document.getElementById('shareKakao');
    let selectedCards = [];
    let cardOrientations = [];

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

    selectButton.addEventListener('click', () => {
        // 카드 초기화
        selectedCards = [];
        cardOrientations = [];
        cardSlots.forEach(slot => {
            slot.classList.remove('flipped');
            const reading = document.getElementById(`reading${slot.id.slice(-1)}`);
            reading.style.display = 'none';
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
            
            // 카드 이미지와 정보 설정
            cardFront.innerHTML = `
                <div class="card-symbol">${getCardSymbol(card.name)}</div>
                <h3>${card.name}</h3>
                <div class="card-image" style="background-image: url('images/${card.image}'); 
                     ${isUpright ? '' : 'transform: rotate(180deg)'}"></div>
            `;

            // 클릭 이벤트 추가
            cardSlot.onclick = () => revealCard(index + 1, card, isUpright);
        });

        // 선택 버튼 비활성화
        selectButton.disabled = true;
        setTimeout(() => {
            selectButton.disabled = false;
        }, 1000);
    });

    function revealCard(index, card, isUpright) {
        const cardSlot = document.getElementById(`card${index}`);
        const reading = document.getElementById(`reading${index}`);
        
        if (!cardSlot.classList.contains('flipped')) {
            cardSlot.classList.add('flipped');
            
            // 해석 표시
            reading.innerHTML = `
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
            reading.style.display = 'block';
        }

        // 모든 카드가 공개되었는지 확인
        if (document.querySelectorAll('.card-slot.flipped').length === 3) {
            shareButton.style.display = 'inline-block';
        }
    }

    // 카카오톡 공유하기
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