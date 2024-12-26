class FortuneApp {
    constructor() {
        this.currentSection = 0;
        this.userData = null;
        this.fortune = null;
        this.biorhythm = null;
        
        this.initializeElements();
        this.addEventListeners();
        this.initializeAds();
    }

    initializeElements() {
        // 폼 요소
        this.fortuneForm = document.getElementById('fortuneForm');
        this.nameInput = document.getElementById('name');
        this.birthdateInput = document.getElementById('birthdate');

        // 섹션 요소
        this.userFormSection = document.getElementById('userForm');
        this.fortuneSection = document.getElementById('fortuneSection');
        this.fullFortuneSection = document.getElementById('fullFortune');

        // 운세 표시 요소
        this.sectionTitle = document.getElementById('sectionTitle');
        this.fortuneContent = document.getElementById('fortuneContent');
        this.progressFill = document.getElementById('progressFill');
        this.nextButton = document.getElementById('nextButton');
        this.fullFortuneContent = document.getElementById('fullFortuneContent');

        // 바이오리듬 요소
        this.biorhythmBars = document.querySelector('.biorhythm-bars');

        // 카카오 공유 버튼
        this.kakaoShareButton = document.getElementById('kakaoShareButton');
    }

    addEventListeners() {
        // 생년월일 입력 제한
        this.birthdateInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
        });

        // 폼 제출
        this.fortuneForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // 다음 버튼
        this.nextButton.addEventListener('click', () => this.handleNext());
        
        // 카카오 공유
        this.kakaoShareButton.addEventListener('click', () => this.shareToKakao());
    }

    initializeAds() {
        try {
            // 페이지의 모든 광고 초기화
            document.querySelectorAll('.adsbygoogle').forEach(ad => {
                (adsbygoogle = window.adsbygoogle || []).push({});
            });
        } catch (e) {
            console.error('애드센스 초기화 실패:', e);
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        // 생년월일 유효성 검사
        const birthdate = this.birthdateInput.value;
        if (birthdate.length !== 6 || !/^\d{6}$/.test(birthdate)) {
            alert('올바른 생년월일 6자리를 입력해주세요.');
            return;
        }

        // 생년월일 변환 (YYMMDD -> YYYY-MM-DD)
        const year = parseInt(birthdate.substring(0, 2));
        const month = birthdate.substring(2, 4);
        const day = birthdate.substring(4, 6);
        
        // 2000년 이후 출생자 처리
        const fullYear = year + (year < 50 ? 2000 : 1900);
        
        // 날짜 유효성 검사
        const birthDate = new Date(fullYear, parseInt(month) - 1, parseInt(day));
        if (birthDate.getDate() !== parseInt(day) || 
            birthDate.getMonth() !== parseInt(month) - 1 || 
            birthDate.getFullYear() !== fullYear) {
            alert('유효하지 않은 생년월일입니다.');
            return;
        }

        this.userData = {
            name: this.nameInput.value,
            birthdate: `${fullYear}-${month}-${day}`,
            gender: document.querySelector('input[name="gender"]:checked').value
        };

        this.generateFortune();
        this.calculateBiorhythm();
        this.showFortuneSection();
    }

    generateFortune() {
        const getLuckyLevel = () => {
            const birthDate = new Date(this.userData.birthdate);
            const today = new Date();
            const sum = birthDate.getDate() + today.getDate();
            return sum % 5; // 0-4 사이의 값
        };

        const getRandomFortune = (category) => {
            const fortunes = fortuneData[category];
            const level = getLuckyLevel();
            const startIndex = level * 10;
            const endIndex = startIndex + 10;
            const selectedFortunes = fortunes.slice(startIndex, endIndex);
            return selectedFortunes[Math.floor(Math.random() * selectedFortunes.length)];
        };

        this.fortune = {
            daily: getRandomFortune('daily'),
            money: getRandomFortune('money'),
            love: getRandomFortune('love'),
            work: getRandomFortune('work'),
            health: getRandomFortune('health'),
            caution: getRandomFortune('caution')
        };
    }

    calculateBiorhythm() {
        const birthday = new Date(this.userData.birthdate);
        const today = new Date();
        const diff = Math.floor((today - birthday) / (1000 * 60 * 60 * 24));

        this.biorhythm = {
            physical: Math.round(Math.sin((2 * Math.PI * diff) / 23) * 100),
            emotional: Math.round(Math.sin((2 * Math.PI * diff) / 28) * 100),
            intellectual: Math.round(Math.sin((2 * Math.PI * diff) / 33) * 100)
        };
    }

    showFortuneSection() {
        this.userFormSection.classList.add('hidden');
        this.fortuneSection.classList.remove('hidden');
        
        // 애니메이션 효과
        setTimeout(() => {
            this.fortuneSection.classList.add('active');
        }, 100);
        
        this.updateFortuneContent();
    }

    updateFortuneContent() {
        const sections = [
            { title: '오늘의 운세', content: this.fortune.daily },
            { title: '금전운', content: this.fortune.money },
            { title: '애정운', content: this.fortune.love },
            { title: '직장운', content: this.fortune.work },
            { title: '건강운', content: this.fortune.health },
            { title: '조언', content: this.fortune.caution }
        ];

        // 콘텐츠 업데이트 애니메이션
        this.fortuneContent.style.opacity = '0';
        setTimeout(() => {
            this.sectionTitle.textContent = sections[this.currentSection].title;
            this.fortuneContent.textContent = sections[this.currentSection].content;
            this.fortuneContent.style.opacity = '1';
        }, 300);

        // 프로그레스 바 업데이트
        this.progressFill.style.width = `${((this.currentSection + 1) / sections.length) * 100}%`;
        
        // 마지막 섹션 체크
        if (this.currentSection === sections.length - 1) {
            this.nextButton.innerHTML = `
                <span class="btn-text">전체 운세 보기</span>
                <i class="fas fa-chart-bar"></i>
            `;
        }
    }

    handleNext() {
        if (this.currentSection < 5) {
            this.currentSection++;
            this.updateFortuneContent();
        } else {
            this.showFullFortune();
        }
    }

    showFullFortune() {
        this.fortuneSection.classList.remove('active');
        setTimeout(() => {
            this.fortuneSection.classList.add('hidden');
            this.fullFortuneSection.classList.remove('hidden');
            
            // 전체 운세 표시 애니메이션
            setTimeout(() => {
                this.fullFortuneSection.style.opacity = '1';
            }, 100);
            
            this.displayFullFortune();
            this.displayBiorhythm();
        }, 300);
    }

    displayFullFortune() {
        const sections = [
            { title: '오늘의 운세', content: this.fortune.daily },
            { title: '금전운', content: this.fortune.money },
            { title: '애정운', content: this.fortune.love },
            { title: '직장운', content: this.fortune.work },
            { title: '건강운', content: this.fortune.health },
            { title: '조언', content: this.fortune.caution }
        ];

        this.fullFortuneContent.innerHTML = sections.map(section => `
            <div class="fortune-item">
                <h3>${section.title}</h3>
                <p>${section.content}</p>
            </div>
        `).join('');
    }

    displayBiorhythm() {
        const getBarColor = (value) => {
            if (value > 50) return '#4CAF50';
            if (value > 0) return '#8BC34A';
            if (value > -50) return '#FFC107';
            return '#F44336';
        };

        const interpretBiorhythm = (value) => {
            if (value > 75) return "매우 좋음";
            if (value > 25) return "좋음";
            if (value > -25) return "보통";
            if (value > -75) return "나쁨";
            return "매우 나쁨";
        };

        const biorhythmTypes = {
            physical: '신체리듬',
            emotional: '감정리듬',
            intellectual: '지성리듬'
        };

        this.biorhythmBars.innerHTML = Object.entries(this.biorhythm).map(([type, value]) => `
            <div class="biorhythm-bar">
                <div class="bar-label">${biorhythmTypes[type]}</div>
                <div class="bar-container">
                    <div class="bar-fill" style="width: 0%"></div>
                </div>
                <div class="bar-value">${value}% (${interpretBiorhythm(value)})</div>
            </div>
        `).join('');

        // 바이오리듬 바 애니메이션
        setTimeout(() => {
            const bars = document.querySelectorAll('.bar-fill');
            bars.forEach((bar, index) => {
                const value = Object.values(this.biorhythm)[index];
                bar.style.width = `${Math.abs(value)}%`;
                bar.style.backgroundColor = getBarColor(value);
            });
        }, 100);
    }

    shareToKakao() {
        if (window.Kakao) {
            window.Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                    title: `${this.userData.name}님의 오늘의 운세`,
                    description: `${this.fortune.daily}\n\n바이오리듬: 신체(${this.biorhythm.physical}%) 감정(${this.biorhythm.emotional}%) 지성(${this.biorhythm.intellectual}%)`,
                    imageUrl: 'https://your-domain.com/fortune-image.jpg',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
                buttons: [
                    {
                        title: '나의 운세 보기',
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href,
                        },
                    },
                ],
            });
        }
    }
}

// 페이지 로드 애니메이션
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    const app = new FortuneApp();
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
});