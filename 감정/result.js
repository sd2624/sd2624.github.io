// AI 감정 분석 테스트 - 결과 페이지 JavaScript

// 카카오 SDK 초기화
function initKakao() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('3413c1beb87e9b2f3b7fce37dde67b4d');
        console.log('카카오 SDK 초기화 완료');
    }
}

// 전역 변수
let currentResultStep = 1;
let testResult = null;
let emotionScores = {};

// URL에서 결과 데이터 가져오기
function getResultFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const resultData = urlParams.get('result');
    
    if (resultData) {
        try {
            const parsed = JSON.parse(decodeURIComponent(resultData));
            console.log('URL에서 받은 결과 데이터:', parsed);
            return parsed;
        } catch (e) {
            console.error('결과 데이터 파싱 오류:', e);
        }
    }
    
    // 기본 결과 데이터 (테스트용)
    const defaultResult = {
        primaryEmotion: '기쁨',
        emotionScores: { joy: 80, sad: 10, angry: 5, fear: 15, calm: 70, neutral: 30, stress: 25 },
        stressLevel: 25,
        care: '규칙적인 운동과 충분한 휴식을 통해 긍정적인 감정을 유지하세요.',
        description: '전체적으로 안정적이고 긍정적인 감정 상태를 보이고 있습니다.',
        emoji: '😊'
    };
    
    console.log('기본 결과 데이터 사용:', defaultResult);
    return defaultResult;
}

// 페이지 이동 관리
const pageManager = {
    currentPage: 'resultMain',
    
    // 특정 페이지 표시
    showPage(pageId) {
        // 모든 페이지 숨기기
        document.querySelectorAll('.step-page, .result-step-page').forEach(page => {
            page.classList.remove('active');
        });
        
        // 선택된 페이지 표시
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }
    },
    
    // 이전 페이지로
    goBack() {
        if (currentResultStep > 1) {
            currentResultStep--;
            this.showPage(`result${currentResultStep}`);
        } else {
            this.showPage('resultMain');
        }
    }
};

// 광고 관리자
const adManager = {
    observer: null,
    loadedAds: new Set(),
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const adContainer = entry.target;
                    const adId = adContainer.id;
                    
                    if (!this.loadedAds.has(adId)) {
                        this.loadAd(adId);
                        this.loadedAds.add(adId);
                        this.observer.unobserve(adContainer);
                    }
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });
        
        // 앵커 광고 표시
        this.showAnchorAd();
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
                    adElement.style.maxHeight = '100px';
                } else {
                    adElement.style.minHeight = '90px';
                    adElement.style.maxHeight = '120px';
                }
                
                (adsbygoogle = window.adsbygoogle || []).push({});
                console.log(`광고 로드 완료: ${adId}`);
            }
        } catch (error) {
            console.error(`광고 로드 실패 (${adId}):`, error);
        }
    },
    
    showAnchorAd() {
        setTimeout(() => {
            const anchorAd = document.getElementById('anchorAd');
            if (anchorAd && window.innerWidth <= 768) {
                anchorAd.style.display = 'block';
                this.loadAd('anchorAd');
            }
        }, 3000);
    }
};

// 결과 표시 함수들
function viewDetailedResult() {
    currentResultStep = 1;
    pageManager.showPage('result1');
    showDetailedResult();
    
    // 결과 페이지 광고 로드
    setTimeout(() => {
        adManager.observe('adResult1');
    }, 300);
}

function showDetailedResult() {
    // 감정 분포도 생성
    generateEmotionChart();
    
    // 스트레스 분석 표시
    displayStressAnalysis();
    
    // 케어 추천 표시
    displayCareRecommendations();
    
    // 공유 요약 생성
    generateShareSummary();
}

function generateEmotionChart() {
    const breakdown = document.getElementById('emotionBreakdown');
    if (!breakdown) return;
    
    breakdown.innerHTML = '';
    
    const emotionLabels = {
        joy: { name: '기쁨', emoji: '😊', color: '#FFD700' },
        calm: { name: '평온', emoji: '😌', color: '#87CEEB' },
        neutral: { name: '중립', emoji: '😐', color: '#D3D3D3' },
        sad: { name: '슬픔', emoji: '😢', color: '#4169E1' },
        angry: { name: '분노', emoji: '😠', color: '#FF4500' },
        fear: { name: '불안', emoji: '😰', color: '#8B008B' }
    };
    
    Object.entries(emotionScores).forEach(([emotion, score]) => {
        if (emotion === 'stress') return;
        
        const emotionData = emotionLabels[emotion];
        if (!emotionData) return;
        
        const percentage = Math.round((score / 100) * 100);
        
        const emotionItem = document.createElement('div');
        emotionItem.className = 'emotion-item';
        emotionItem.innerHTML = `
            <div class="emotion-info">
                <span class="emotion-emoji">${emotionData.emoji}</span>
                <span class="emotion-name">${emotionData.name}</span>
            </div>
            <div class="emotion-bar">
                <div class="emotion-fill" style="width: ${percentage}%; background-color: ${emotionData.color}"></div>
            </div>
            <span class="emotion-percentage">${percentage}%</span>
        `;
        
        breakdown.appendChild(emotionItem);
    });
}

function displayStressAnalysis() {
    const stressLevel = document.getElementById('stressLevel');
    const stressFactors = document.getElementById('stressFactors');
    
    if (!stressLevel || !stressFactors) return;
    
    const stress = Math.min(Math.round((emotionScores.stress / 15) * 100), 100);
    
    let stressCategory = '';
    let stressColor = '';
    let stressAdvice = '';
    
    if (stress <= 30) {
        stressCategory = '낮음';
        stressColor = '#4CAF50';
        stressAdvice = '현재 스트레스 수준이 낮아 건강한 상태입니다. 이 상태를 유지하세요.';
    } else if (stress <= 60) {
        stressCategory = '보통';
        stressColor = '#FF9800';
        stressAdvice = '적절한 스트레스 관리가 필요합니다. 규칙적인 운동과 충분한 휴식을 권장합니다.';
    } else {
        stressCategory = '높음';
        stressColor = '#F44336';
        stressAdvice = '스트레스 수준이 높습니다. 전문가 상담이나 스트레스 해소 방법을 적극적으로 찾아보세요.';
    }
    
    stressLevel.innerHTML = `
        <div class="stress-gauge">
            <div class="stress-circle" style="border-color: ${stressColor}">
                <span class="stress-number">${stress}%</span>
                <span class="stress-label">${stressCategory}</span>
            </div>
        </div>
        <p class="stress-advice">${stressAdvice}</p>
    `;
    
    stressFactors.innerHTML = `
        <h4>스트레스 주요 요인</h4>
        <ul class="stress-factor-list">
            <li>일상 생활의 변화</li>
            <li>대인 관계</li>
            <li>업무/학업 압박</li>
            <li>건강 관련 걱정</li>
        </ul>
    `;
}

function displayCareRecommendations() {
    const careRecommendations = document.getElementById('careRecommendations');
    if (!careRecommendations) return;
    
    const recommendations = [
        {
            icon: '🧘',
            title: '마음챙김 명상',
            description: '하루 10분 명상으로 마음의 안정을 찾으세요.',
            action: '명상 앱 다운로드'
        },
        {
            icon: '🏃',
            title: '규칙적인 운동',
            description: '주 3회 이상 가벼운 운동으로 스트레스를 해소하세요.',
            action: '운동 계획 세우기'
        },
        {
            icon: '💤',
            title: '충분한 수면',
            description: '7-8시간의 규칙적인 수면 패턴을 유지하세요.',
            action: '수면 일기 작성'
        },
        {
            icon: '🤝',
            title: '사회적 지지',
            description: '가족, 친구들과 감정을 나누고 소통하세요.',
            action: '소통 시간 늘리기'
        }
    ];
    
    careRecommendations.innerHTML = `
        <h3>당신에게 추천하는 케어 방법</h3>
        <div class="care-grid">
            ${recommendations.map(rec => `
                <div class="care-card">
                    <div class="care-icon">${rec.icon}</div>
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                    <button class="care-action-btn">${rec.action}</button>
                </div>
            `).join('')}
        </div>
    `;
}

function generateShareSummary() {
    const shareSummary = document.getElementById('shareSummary');
    if (!shareSummary) return;
    
    const stressLevel = Math.min(Math.round((emotionScores.stress / 15) * 100), 100);
    
    shareSummary.innerHTML = `
        <div class="share-result-card">
            <div class="share-emoji">${testResult.emoji}</div>
            <h3>나의 감정 분석 결과</h3>
            <p><strong>주요 감정:</strong> ${testResult.primaryEmotion}</p>
            <p><strong>스트레스 수준:</strong> ${stressLevel}%</p>
            <p><strong>추천 케어:</strong> ${testResult.care}</p>
        </div>
    `;
}

function nextResultStep() {
    if (currentResultStep < 4) {
        currentResultStep++;
        pageManager.showPage(`result${currentResultStep}`);
        adManager.observe(`adResult${currentResultStep}`);
    }
}

function goBack() {
    pageManager.goBack();
}

// 공유 기능
function shareToKakao() {
    if (!window.Kakao || !testResult) return;
    
    const stressLevel = Math.min(Math.round((emotionScores.stress / 15) * 100), 100);
    
    window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: 'AI 감정 분석 테스트 결과',
            description: `나의 주요 감정: ${testResult.primaryEmotion} | 스트레스 수준: ${stressLevel}%`,
            imageUrl: 'https://sd2624.github.io/감정/emotion-result.png',
            link: {
                mobileWebUrl: 'https://sd2624.github.io/감정/',
                webUrl: 'https://sd2624.github.io/감정/'
            }
        },
        buttons: [{
            title: '나도 테스트하기',
            link: {
                mobileWebUrl: 'https://sd2624.github.io/감정/',
                webUrl: 'https://sd2624.github.io/감정/'
            }
        }]
    });
}

function copyResult() {
    const stressLevel = Math.min(Math.round((emotionScores.stress / 15) * 100), 100);
    const resultText = `🧠 AI 감정 분석 결과
    
주요 감정: ${testResult.primaryEmotion} ${testResult.emoji}
스트레스 수준: ${stressLevel}%
추천 케어: ${testResult.care}

나도 테스트하기: https://sd2624.github.io/감정/`;

    navigator.clipboard.writeText(resultText).then(() => {
        alert('결과가 클립보드에 복사되었습니다!');
    }).catch(() => {
        alert('복사에 실패했습니다. 다시 시도해주세요.');
    });
}

// 액션 버튼들
function retakeTest() {
    window.location.href = 'index.html';
}

function goToOtherTests() {
    window.location.href = '../index.html';
}

function closeAnchorAd() {
    document.getElementById('anchorAd').style.display = 'none';
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('결과 페이지 초기화 시작');
    
    initKakao();
    
    // URL에서 결과 데이터 가져오기
    testResult = getResultFromURL();
    emotionScores = testResult.emotionScores;
    
    console.log('최종 결과 데이터:', testResult);
    console.log('감정 점수:', emotionScores);
    
    // 결과 미리보기 표시
    const resultIcon = document.getElementById('resultEmotionIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultDescription = document.getElementById('resultDescription');
    const previewEmotion = document.getElementById('previewEmotion');
    const previewStress = document.getElementById('previewStress');
    
    if (resultIcon) resultIcon.textContent = testResult.emoji;
    if (resultTitle) resultTitle.textContent = `당신은 "${testResult.primaryEmotion}" 감정이 강해요`;
    if (resultDescription) resultDescription.textContent = testResult.description;
    if (previewEmotion) previewEmotion.textContent = testResult.primaryEmotion;
    
    const stressLevel = Math.min(Math.round((emotionScores.stress / 15) * 100), 100);
    if (previewStress) previewStress.textContent = `${stressLevel}%`;
    
    console.log('결과 미리보기 설정 완료');
    
    // 광고 초기화
    adManager.init();
    
    // 결과 페이지 광고 로드
    setTimeout(() => {
        adManager.observe('adTopNativeResult');
        adManager.observe('adMidNativeResult');
        adManager.observe('adBottomCTAResult');
    }, 500);
    
    console.log('결과 페이지 초기화 완료');
});
