// [광고] AdManager 클래스 - 광고 로드 및 중복 방지 관리
class AdManager {
    constructor() {
        this.loadedAds = new Set(); // 로드된 광고 추적
    }
    
    // 광고 로드 함수
    loadAd(adId) {
        if (this.loadedAds.has(adId)) {
            console.log(`[광고] ${adId} 이미 로드됨 - 중복 방지`);
            return false;
        }
        
        const adElement = document.getElementById(adId);
        if (adElement && typeof adsbygoogle !== 'undefined') {
            try {
                // 광고 컨테이너 표시
                adElement.style.display = 'block';
                
                // 광고 푸시
                (adsbygoogle = window.adsbygoogle || []).push({});
                
                this.loadedAds.add(adId);
                console.log(`[광고] ${adId} 로드 완료`);
                return true;
            } catch (error) {
                console.warn(`[광고] ${adId} 로드 실패:`, error);
                return false;
            }
        }
        return false;
    }
    
    // 중간 광고 표시 (3번째 질문 후)
    showMidAd() {
        return this.loadAd('adMid');
    }
    
    // 결과 광고 표시
    showResultAd() {
        return this.loadAd('adResult');
    }
}

// [광고] AdManager 인스턴스 생성
const adManager = new AdManager();

// [광고] IntersectionObserver를 이용한 광고 표시 관리
const setupAdObservers = () => {
    if (typeof IntersectionObserver === 'undefined') return;
    
    const options = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    // 중간 광고 관찰자
    const midAdObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                adManager.showMidAd();
                midAdObserver.unobserve(entry.target);
            }
        });
    }, options);
    
    // 결과 광고 관찰자
    const resultAdObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                adManager.showResultAd();
                resultAdObserver.unobserve(entry.target);
            }
        });
    }, options);
    
    // 관찰 대상 등록
    const midAd = document.getElementById('adMid');
    const resultAd = document.getElementById('adResult');
    
    if (midAd) midAdObserver.observe(midAd);
    if (resultAd) resultAdObserver.observe(resultAd);
};

// 카카오 SDK 초기화
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// 광고 로드 상태 관리 - 중복 로드 방지
const adLoadedState = {
    'main-ad': false,
    'popup-ad': false
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

// 전역 변수
let currentQuestion = 0;
let mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let currentLanguage = 'ko';

// 언어 변경 함수
async function changeLanguage() {
    const selectedLang = document.getElementById('language-select').value;
    console.log('언어 변경 시작:', selectedLang);
    currentLanguage = selectedLang;
    
    try {
        await loadLanguageData();
        console.log('언어 변경 완료:', currentLanguage);
        console.log('현재 translations 객체:', window.translations);
    } catch (error) {
        console.error('언어 변경 실패:', error);
    }
}

// 언어 데이터 로드
function loadLanguageData() {
    console.log('언어 데이터 로드 시작:', currentLanguage);
    return new Promise((resolve, reject) => {
        // 기존 언어 스크립트 제거
        const existingScripts = document.querySelectorAll('script[data-language]');
        console.log('기존 스크립트 제거 개수:', existingScripts.length);
        existingScripts.forEach(script => script.remove());
        
        let scriptsLoaded = 0;
        const totalScripts = 3;
        
        function onScriptLoad(scriptType) {
            scriptsLoaded++;
            console.log(`${scriptType} 로드 완료 (${scriptsLoaded}/${totalScripts})`);
            if (scriptsLoaded === totalScripts) {
                console.log('모든 언어 스크립트 로드 완료, UI 업데이트 시작');
                updateLanguageElements();
                
                // 현재 질문 섹션이 보이고 있다면 질문도 업데이트
                if (document.getElementById('question-section').style.display !== 'none') {
                    showQuestion();
                }
                
                resolve();
            }
        }
        
        function onScriptError(error, scriptType) {
            console.error(`${scriptType} 로드 오류:`, error);
            // 기본 한국어로 폴백
            if (currentLanguage !== 'ko') {
                currentLanguage = 'ko';
                loadLanguageData().then(resolve).catch(reject);
            } else {
                reject(error);
            }
        }
        
        // 번역 스크립트 로드
        const translationsScript = document.createElement('script');
        translationsScript.src = `./languages/translations_${currentLanguage}.js`;
        translationsScript.setAttribute('data-language', 'translations');
        translationsScript.onload = () => onScriptLoad('translations');
        translationsScript.onerror = (error) => onScriptError(error, 'translations');
        document.head.appendChild(translationsScript);
        console.log('번역 스크립트 로드 시작:', translationsScript.src);
        
        // 질문 스크립트 로드
        const questionsScript = document.createElement('script');
        questionsScript.src = `./languages/questions_${currentLanguage}.js`;
        questionsScript.setAttribute('data-language', 'questions');
        questionsScript.onload = () => onScriptLoad('questions');
        questionsScript.onerror = (error) => onScriptError(error, 'questions');
        document.head.appendChild(questionsScript);
        console.log('질문 스크립트 로드 시작:', questionsScript.src);
        
        // 결과 스크립트 로드
        const resultsScript = document.createElement('script');
        resultsScript.src = `./languages/results_${currentLanguage}.js`;
        resultsScript.setAttribute('data-language', 'results');
        resultsScript.onload = () => onScriptLoad('results');
        resultsScript.onerror = (error) => onScriptError(error, 'results');
        document.head.appendChild(resultsScript);
        console.log('결과 스크립트 로드 시작:', resultsScript.src);
    });
}

// 언어별 요소 업데이트
function updateLanguageElements() {
    console.log('updateLanguageElements 호출됨');
    console.log('window.translations:', window.translations);
    
    if (!window.translations) {
        console.error('translations 객체가 로드되지 않음!');
        return;
    }
    
    const texts = window.translations;
    
    // 안전하게 요소가 존재하는지 확인 후 업데이트
    const elements = [
        { id: 'main-title', prop: 'innerHTML', value: texts.mainTitle },
        { id: 'hero-title', prop: 'textContent', value: texts.heroTitle },
        { id: 'hero-desc-1', prop: 'textContent', value: texts.heroDesc1 },
        { id: 'hero-desc-2', prop: 'textContent', value: texts.heroDesc2 },
        { id: 'hero-desc-3', prop: 'textContent', value: texts.heroDesc3 },
        { id: 'hero-desc-4', prop: 'textContent', value: texts.heroDesc4 },
        { id: 'hero-desc-5', prop: 'textContent', value: texts.heroDesc5 },
        { id: 'hero-desc-6', prop: 'textContent', value: texts.heroDesc6 },
        { id: 'hero-desc-7', prop: 'textContent', value: texts.heroDesc7 },
        { id: 'intro-text', prop: 'innerHTML', value: texts.introText },
        { id: 'analysts-title', prop: 'textContent', value: texts.analystsTitle },
        { id: 'diplomats-title', prop: 'textContent', value: texts.diplomatsTitle },
        { id: 'sentinels-title', prop: 'textContent', value: texts.sentinelsTitle },
        { id: 'explorers-title', prop: 'textContent', value: texts.explorersTitle },
        { id: 'start-btn', prop: 'textContent', value: texts.startBtn },
        { id: 'analysis-text', prop: 'textContent', value: texts.analysisText },
        // 결과 페이지 요소들 추가
        { id: 'result-label', prop: 'textContent', value: texts.resultLabel || '당신의 MBTI는' },
        { id: 'result-section-title', prop: 'textContent', value: texts.resultSectionTitle || '당신의 성격 유형' },
        { id: 'traits-title', prop: 'textContent', value: texts.traitsTitle || '성격 특징' },
        { id: 'strengths-title', prop: 'textContent', value: texts.strengthsTitle || '강점' },
        { id: 'weaknesses-title', prop: 'textContent', value: texts.weaknessesTitle || '약점' },
        { id: 'compatible-title', prop: 'textContent', value: texts.compatibleTitle || '잘 맞는 유형' },
        { id: 'famous-title', prop: 'textContent', value: texts.famousTitle || '같은 유형의 유명인' },
        { id: 'compatibility-title', prop: 'textContent', value: texts.compatibilityTitle || '궁합' },
        { id: 'famous-people-title', prop: 'textContent', value: texts.famousPeopleTitle || '유명인' },
        { id: 'share-btn', prop: 'textContent', value: texts.shareBtn || '결과 공유하기' },
        { id: 'retry-btn', prop: 'textContent', value: texts.retryBtn || '다시 테스트하기' },
        { id: 'home-btn', prop: 'textContent', value: texts.homeBtn || '다른 테스트 하기' },
        { id: 'restart-btn', prop: 'textContent', value: texts.restartBtn || '다시 하기' }
    ];

    elements.forEach(element => {
        const el = document.getElementById(element.id);
        if (el) {
            el[element.prop] = element.value;
        }
    });
    
    // 결과 페이지가 현재 표시되고 있다면 결과 내용도 업데이트
    const resultSection = document.getElementById('result-section');
    if (resultSection && resultSection.style.display === 'block' && window.mbtiResults) {
        console.log('결과 페이지가 표시중이므로 결과 내용 업데이트');
        updateResultContent();
    }
}

// 결과 내용 업데이트 함수
function updateResultContent() {
    if (!window.mbtiResults) return;
    
    // 현재 MBTI 결과 재계산
    const mbtiType = 
        (mbtiScores.E > mbtiScores.I ? 'E' : 'I') +
        (mbtiScores.S > mbtiScores.N ? 'S' : 'N') +
        (mbtiScores.T > mbtiScores.F ? 'T' : 'F') +
        (mbtiScores.J > mbtiScores.P ? 'J' : 'P');
    
    const resultData = window.mbtiResults[mbtiType];
    
    if (resultData) {
        // 결과 제목과 설명 업데이트
        const resultTitle = document.getElementById('result-title');
        const resultDescription = document.getElementById('result-description');
        
        if (resultTitle) resultTitle.textContent = resultData.title;
        if (resultDescription) resultDescription.textContent = resultData.description;
        
        // 강점/약점, 궁합, 유명인 정보도 다시 업데이트
        displayStrengthsWeaknesses(resultData);
        displayCompatibility(resultData);
        displayFamousPeople(resultData);
        
        console.log('결과 내용 업데이트 완료:', mbtiType, resultData.title);
    }
}

// 테스트 시작
function startTest() {
    document.getElementById('start-section').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    currentQuestion = 0;
    mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    showQuestion();
}

// 질문 표시
function showQuestion() {
    if (!window.questions) return;
    
    const question = window.questions[currentQuestion];
    
    document.getElementById('question-text').textContent = question.text;
    document.getElementById('question-counter').textContent = `${currentQuestion + 1}/16`;
    
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons[0].textContent = question.choices[0].text;
    answerButtons[1].textContent = question.choices[1].text;
    
    // 버튼에 onclick 이벤트 직접 할당
    answerButtons[0].onclick = () => selectAnswer('A');
    answerButtons[1].onclick = () => selectAnswer('B');
    
    // 진행률 업데이트
    const progress = ((currentQuestion) / 16) * 100;
    document.querySelector('.progress').style.width = progress + '%';
}

// 답변 선택
function selectAnswer(choice) {
    if (!window.questions) return;
    
    const question = window.questions[currentQuestion];
    const selectedChoice = choice === 'A' ? question.choices[0] : question.choices[1];
    
    mbtiScores[selectedChoice.type]++;
    
    currentQuestion++;
    
    if (currentQuestion < 16) {
        showQuestion();
    } else {
        // 분석 팝업 먼저 표시
        showAnalysisPopup(async () => {
            // 분석 완료 후 결과 표시
            await showLoadingAndResult();
        });
    }
}

// 분석 팝업 함수
function showAnalysisPopup(callback) {
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
    
    // 현재 언어의 분석중 텍스트 가져오기
    const analysisText = (window.translations && window.translations.analysisText) 
        ? window.translations.analysisText 
        : "MBTI 분석중...";
        
    const waitText = (window.translations && window.translations.waitText) 
        ? window.translations.waitText 
        : "잠시만 기다려주세요...";
    
    analysisPopup.innerHTML = `
        <div class="analysis-header" style="margin-bottom: 20px;">
            <div class="analysis-icon" style="font-size: 3em; margin-bottom: 10px;">🧠</div>
            <h2 style="margin: 0; font-size: 1.6em; font-weight: bold; color: #333;">${analysisText}</h2>
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
            <p style="font-size: 1em; color: #666; margin: 0 0 20px;">${waitText}</p>
            
            <!-- 광고 영역 -->
            <div class="ad-content" style="margin: 20px 0; min-height: 200px; border: 1px solid #eee; border-radius: 8px; padding: 10px;">
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-9374368296307755"
                     data-ad-slot="3201247599"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            </div>
        </div>
        <div class="progress-bar" style="
            width: 100%;
            height: 8px;
            background: rgba(102, 126, 234, 0.2);
            border-radius: 4px;
            overflow: hidden;
            margin-top: 20px;
        ">
            <div class="progress-fill" style="
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                width: 0%;
                border-radius: 4px;
                transition: width 0.1s ease;
            "></div>
        </div>
    `;
    
    analysisOverlay.appendChild(analysisPopup);
    document.body.appendChild(analysisOverlay);
    
    // 애드센스 광고 로드
    try {
        if (!adLoadedState['popup-ad']) {
            (adsbygoogle = window.adsbygoogle || []).push({});
            adLoadedState['popup-ad'] = true;
            console.log('팝업 광고 로드됨');
        }
    } catch (e) {
        console.log('AdSense loading error:', e);
    }
    
    // 7초 동안 진행률 표시
    let progress = 0;
    const progressFill = analysisPopup.querySelector('.progress-fill');
    
    const timer = setInterval(() => {
        progress += 100 / 70; // 7초 동안 100%까지
        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);
            console.log('Analysis popup completed, calling callback...');
            setTimeout(() => {
                analysisOverlay.remove();
                if (callback) {
                    console.log('Executing callback function...');
                    callback();
                } else {
                    console.log('No callback function provided!');
                }
            }, 300); // 잠깐 대기 후 콜백 실행
        }
        progressFill.style.width = progress + '%';
    }, 100); // 0.1초마다 업데이트
}

// 로딩 및 결과 표시
async function showLoadingAndResult() {
    console.log('showLoadingAndResult called');
    document.getElementById('question-section').style.display = 'none';
    
    // 바로 결과 표시
    console.log('About to show result...');
    await showResult();
}

// 결과 표시
async function showResult() {
    console.log('showResult called');
    console.log('현재 언어:', currentLanguage);
    console.log('window.mbtiResults:', window.mbtiResults);
    console.log('window.translations:', window.translations);
    
    // 결과 표시 전에 현재 언어의 데이터가 올바르게 로드되었는지 확인
    try {
        await loadLanguageData();
        console.log('결과 표시를 위한 언어 데이터 재로드 완료');
    } catch (error) {
        console.error('언어 데이터 로드 실패:', error);
    }
    
    if (!window.mbtiResults) {
        console.error('mbtiResults not loaded!');
        return;
    }
    
    document.getElementById('result-section').style.display = 'block';
    
    // MBTI 계산
    const mbtiType = 
        (mbtiScores.E > mbtiScores.I ? 'E' : 'I') +
        (mbtiScores.S > mbtiScores.N ? 'S' : 'N') +
        (mbtiScores.T > mbtiScores.F ? 'T' : 'F') +
        (mbtiScores.J > mbtiScores.P ? 'J' : 'P');
    
    const resultData = window.mbtiResults[mbtiType];
    
    // 결과 표시
    document.getElementById('mbti-result').textContent = mbtiType;
    document.getElementById('result-title').textContent = resultData.title;
    document.getElementById('result-description').textContent = resultData.description;
    
    // 언어별 UI 요소 업데이트 (위에서 이미 loadLanguageData()를 호출했으므로 updateLanguageElements가 이미 실행됨)
    // updateLanguageElements()는 loadLanguageData() 내부에서 이미 호출됨
    
    // 성격 특징 바 차트
    displayTraitBars(mbtiType);
    
    // 강점/약점 리스트
    displayStrengthsWeaknesses(resultData);
    
    // 궁합 정보
    displayCompatibility(resultData);
    
    // 유명인 정보
    displayFamousPeople(resultData);
    
    // 이모지 표시
    displayEmoji(mbtiType);
}

// 성격 특징 바 차트 표시
function displayTraitBars(mbtiType) {
    const traitBarsContainer = document.getElementById('trait-bars');
    if (!traitBarsContainer) return;
    
    traitBarsContainer.innerHTML = '';
    
    const traits = [
        { name: 'E ←→ I', leftScore: mbtiScores.E, rightScore: mbtiScores.I, leftLabel: 'E', rightLabel: 'I' },
        { name: 'S ←→ N', leftScore: mbtiScores.S, rightScore: mbtiScores.N, leftLabel: 'S', rightLabel: 'N' },
        { name: 'T ←→ F', leftScore: mbtiScores.T, rightScore: mbtiScores.F, leftLabel: 'T', rightLabel: 'F' },
        { name: 'J ←→ P', leftScore: mbtiScores.J, rightScore: mbtiScores.P, leftLabel: 'J', rightLabel: 'P' }
    ];
    
    traits.forEach(trait => {
        const total = trait.leftScore + trait.rightScore;
        const leftPercentage = total > 0 ? (trait.leftScore / total) * 100 : 50;
        const rightPercentage = total > 0 ? (trait.rightScore / total) * 100 : 50;
        
        const traitBar = document.createElement('div');
        traitBar.className = 'trait-bar';
        traitBar.innerHTML = `
            <div class="trait-labels">
                <span class="trait-left">${trait.leftLabel} (${trait.leftScore})</span>
                <span class="trait-name">${trait.name}</span>
                <span class="trait-right">${trait.rightLabel} (${trait.rightScore})</span>
            </div>
            <div class="trait-progress">
                <div class="trait-progress-left" style="width: ${leftPercentage}%"></div>
                <div class="trait-progress-right" style="width: ${rightPercentage}%"></div>
            </div>
        `;
        traitBarsContainer.appendChild(traitBar);
    });
}

// 강점/약점 표시
function displayStrengthsWeaknesses(resultData) {
    const strengthsList = document.getElementById('strengths-list');
    const weaknessesList = document.getElementById('weaknesses-list');
    
    if (strengthsList && resultData.strengths) {
        strengthsList.innerHTML = resultData.strengths.map(strength => `<li>${strength}</li>`).join('');
    }
    
    if (weaknessesList && resultData.weaknesses) {
        weaknessesList.innerHTML = resultData.weaknesses.map(weakness => `<li>${weakness}</li>`).join('');
    }
}

// 궁합 정보 표시
function displayCompatibility(resultData) {
    const compatibleContainer = document.getElementById('compatible-list');
    
    if (compatibleContainer && resultData.compatible) {
        compatibleContainer.innerHTML = resultData.compatible.map(type => 
            `<span class="type-badge">${type}</span>`
        ).join('');
    }
}

// 유명인 정보 표시
function displayFamousPeople(resultData) {
    const famousContainer = document.getElementById('famous-list');
    
    if (famousContainer && resultData.famous) {
        famousContainer.textContent = resultData.famous;
    }
}

// 이모지 표시 함수
function displayEmoji(mbtiType) {
    const typeEmojis = {
        'INTJ': '🏗️', 'INTP': '🧠', 'ENTJ': '👑', 'ENTP': '💡',
        'INFJ': '🦄', 'INFP': '🌸', 'ENFJ': '⭐', 'ENFP': '🌈',
        'ISTJ': '🛡️', 'ISFJ': '🤱', 'ESTJ': '📊', 'ESFJ': '🤗',
        'ISTP': '🔧', 'ISFP': '🎨', 'ESTP': '🎯', 'ESFP': '🎪'
    };
    
    const emojiElement = document.getElementById('type-emoji');
    if (emojiElement) {
        emojiElement.textContent = typeEmojis[mbtiType] || '🌟';
    }
}

// 결과 공유하기
function shareResult() {
    const mbtiType = document.getElementById('mbti-result').textContent;
    const resultTitle = document.getElementById('result-title').textContent;
    
    if (typeof Kakao !== 'undefined' && Kakao.Link) {
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: `나의 MBTI는 ${mbtiType}!`,
                description: `${resultTitle} - 16가지 성격 유형 테스트 결과`,
                imageUrl: window.location.origin + '/mbti/images/mbti-share.jpg',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href
                }
            },
            buttons: [{
                title: 'MBTI 테스트 하러가기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href
                }
            }]
        });
    } else {
        // 카카오톡이 없는 경우 일반 공유
        if (navigator.share) {
            navigator.share({
                title: `나의 MBTI는 ${mbtiType}!`,
                text: `${resultTitle} - 16가지 성격 유형 테스트`,
                url: window.location.href
            });
        } else {
            // 클립보드에 복사
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('링크가 클립보드에 복사되었습니다!');
            });
        }
    }
}

// 다시 테스트하기
function retryTest() {
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('start-section').style.display = 'block';
    currentQuestion = 0;
    mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
}

// 페이지 로드 시 광고 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
    
    console.log('페이지 로드 시 광고 초기화 완료');
});

// 다시 테스트하기
function retryTest() {
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('start-section').style.display = 'block';
    currentQuestion = 0;
    mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
}

// 홈으로 가기
function goHome() {
    window.location.href = '../index.html';
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', async function() {
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
    
    try {
        console.log('AdSense initialization 완료');
    } catch (e) {
        console.log('AdSense initialization error:', e);
    }
    
    // 기본 언어 데이터 로드
    try {
        await loadLanguageData();
        console.log('초기 언어 로드 완료:', currentLanguage);
    } catch (error) {
        console.error('초기 언어 로드 실패:', error);
    }
});