import tarotData from './tarot-data.js';

class TarotReading {
    constructor() {
        this.cards = tarotData.major;
        this.selectedCards = [];
        this.currentStep = 0;
        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.cardElements = document.querySelectorAll('.card');
        this.loadingScreen = document.querySelector('.loading-screen');
        this.readingResult = document.querySelector('.reading-result');
        this.shareButton = document.getElementById('shareKakao');
        this.resetButton = document.getElementById('resetReading');
    }

    addEventListeners() {
        this.shuffleBtn.addEventListener('click', () => this.startReading());
        this.cardElements.forEach(card => {
            card.addEventListener('click', (e) => this.handleCardClick(e));
        });
        this.shareButton.addEventListener('click', () => this.shareToKakao());
        this.resetButton.addEventListener('click', () => this.resetReading());
    }

    startReading() {
        this.showLoading();
        this.shuffleCards();
        this.enableCardSelection();
        this.shuffleBtn.disabled = true;
    }

    showLoading() {
        this.loadingScreen.style.display = 'flex';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 1500);
    }

    shuffleCards() {
        this.cards = [...this.cards].sort(() => Math.random() - 0.5);
    }

    enableCardSelection() {
        this.cardElements.forEach(card => {
            if (!card.classList.contains('selected')) {
                card.style.cursor = 'pointer';
            }
        });
    }

    handleCardClick(event) {
        const card = event.currentTarget;
        if (this.currentStep >= 3 || card.classList.contains('selected')) return;

        const selectedCard = this.cards[this.currentStep];
        const isReversed = Math.random() < 0.5;
        
        this.selectedCards.push({
            ...selectedCard,
            isReversed,
            position: card.dataset.position
        });

        this.displayCard(card, selectedCard, isReversed);
        this.currentStep++;

        if (this.currentStep === 3) {
            setTimeout(() => this.showResults(), 1000);
        }
    }

    displayCard(cardElement, cardData, isReversed) {
        const cardFront = cardElement.querySelector('.card-front');
        cardFront.querySelector('.card-number').textContent = cardData.id;
        cardFront.querySelector('.card-title').textContent = cardData.name;
        cardFront.querySelector('.card-symbol').setAttribute('data-card', cardData.name.toLowerCase());

        cardElement.classList.add('selected');
        if (isReversed) {
            cardFront.style.transform = 'rotate(180deg)';
        }
    }

    showResults() {
        this.readingResult.style.display = 'block';
        
        const positions = ['past', 'present', 'future'];
        positions.forEach(position => {
            const card = this.selectedCards.find(c => c.position === position);
            const reading = document.getElementById(`${position}Reading`);
            
            reading.innerHTML = `
                <h4>${card.name} ${card.isReversed ? '(역방향)' : ''}</h4>
                <p>${this.getCardMeaning(card)}</p>
            `;
        });
    }

    getCardMeaning(card) {
        const meanings = card.meanings;
        let interpretation = '';
        
        for (const aspect in meanings) {
            interpretation += `<strong>${aspect}:</strong> ${card.isReversed ? meanings[aspect].reversed : meanings[aspect].upright}<br>`;
        }
        
        return interpretation;
    }

    shareToKakao() {
        if (this.selectedCards.length !== 3) return;

        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '타로카드 운세 결과',
                description: this.getShareDescription(),
                imageUrl: 'YOUR_IMAGE_URL', // 대표 이미지 URL 필요
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                }
            },
            buttons: [
                {
                    title: '나도 타로카드 보기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    }
                }
            ]
        });
    }

    getShareDescription() {
        return this.selectedCards.map(card => 
            `${card.position}: ${card.name} ${card.isReversed ? '(역방향)' : ''}`
        ).join('\n');
    }

    resetReading() {
        this.selectedCards = [];
        this.currentStep = 0;
        this.shuffleBtn.disabled = false;
        this.readingResult.style.display = 'none';
        
        this.cardElements.forEach(card => {
            card.classList.remove('selected');
            card.querySelector('.card-front').style.transform = '';
            card.querySelector('.card-number').textContent = '';
            card.querySelector('.card-title').textContent = '';
        });
    }
}

// 페이지 로드 시 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TarotReading();
});

// 구글 애드센스 광고 로드
(adsbygoogle = window.adsbygoogle || []).push({});