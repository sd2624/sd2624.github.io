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

// 광고 로드 관리 시스템


const animalDatabase = {
    cat: {
        name: "고양이",
        emoji: "🐱",
        description: "우아하고 독립적인 성격으로, 자신만의 매력을 가진 사람입니다. 신비로운 아름다움과 세련된 감각을 지니고 있어요.",
        traits: ["독립적", "우아함", "신비로움", "직감적", "자유로움"],
        features: [
            { icon: "👁️", text: "아름다운 눈매" },
            { icon: "💄", text: "매혹적인 입술" },
            { icon: "✨", text: "우아한 분위기" },
            { icon: "🎭", text: "신비로운 매력" }
        ],
        charms: [
            { icon: "😸", text: "고혹적인 눈빛" },
            { icon: "💃", text: "우아한 몸짓" },
            { icon: "🎨", text: "예술적 감각" },
            { icon: "🌙", text: "신비로운 분위기" }
        ],
        recommendations: {
            fashion: [
                { name: "실크 블라우스", description: "고급스럽고 우아한 느낌", icon: "👗" },
                { name: "골드 악세서리", description: "고혹적인 매력 강조", icon: "💎" },
                { name: "와인 컬러", description: "신비로운 분위기 연출", icon: "🍷" }
            ],
            lifestyle: [
                { name: "캔들라이트 디너", description: "로맨틱한 분위기", icon: "🕯️" },
                { name: "재즈 음악", description: "세련된 취향", icon: "🎷" },
                { name: "향수 컬렉션", description: "개성적인 향기", icon: "🌸" }
            ]
        },
        personality: {
            독립성: 90,
            우아함: 95,
            신비로움: 88,
            매력도: 92
        },
        compatibility: [
            { animal: "강아지", score: "좋음", description: "서로 다른 매력으로 보완", emoji: "🐶" },
            { animal: "여우", score: "최고", description: "비슷한 신비로운 매력", emoji: "🦊" },
            { animal: "토끼", score: "보통", description: "차분한 성격이 잘 맞음", emoji: "🐰" }
        ]
    },
    dog: {
        name: "강아지",
        emoji: "🐶",
        description: "활발하고 친근한 성격으로, 누구와도 쉽게 친해지는 매력적인 사람입니다. 따뜻한 마음과 긍정적인 에너지를 가지고 있어요.",
        traits: ["친근함", "활발함", "충성심", "사교적", "긍정적"],
        features: [
            { icon: "😊", text: "밝은 미소" },
            { icon: "👀", text: "또렷한 눈동자" },
            { icon: "🌟", text: "활기찬 표정" },
            { icon: "💝", text: "따뜻한 인상" }
        ],
        charms: [
            { icon: "🤗", text: "친근한 미소" },
            { icon: "⚡", text: "활발한 에너지" },
            { icon: "💕", text: "따뜻한 마음" },
            { icon: "🎉", text: "밝은 성격" }
        ],
        recommendations: {
            fashion: [
                { name: "캐주얼 스타일", description: "편안하고 활동적인 느낌", icon: "👕" },
                { name: "밝은 컬러", description: "긍정적인 에너지 표현", icon: "🌈" },
                { name: "스포티 악세서리", description: "활발한 매력 강조", icon: "⌚" }
            ],
            lifestyle: [
                { name: "야외 활동", description: "에너지 발산", icon: "🏃" },
                { name: "친구들과 모임", description: "사교적 성향", icon: "👥" },
                { name: "카페 투어", description: "친근한 분위기", icon: "☕" }
            ]
        },
        personality: {
            친근함: 95,
            활발함: 90,
            사교성: 88,
            매력도: 85
        },
        compatibility: [
            { animal: "고양이", score: "좋음", description: "서로 다른 매력으로 보완", emoji: "🐱" },
            { animal: "햄스터", score: "최고", description: "둘 다 귀여운 매력", emoji: "🐹" },
            { animal: "곰", score: "좋음", description: "따뜻한 성격이 잘 맞음", emoji: "🐻" }
        ]
    },
    rabbit: {
        name: "토끼",
        emoji: "🐰",
        description: "순수하고 사랑스러운 매력을 가진 사람입니다. 부드러운 성격과 순진한 아름다움으로 많은 사람들의 마음을 사로잡아요.",
        traits: ["순수함", "사랑스러움", "온순함", "섬세함", "친화력"],
        features: [
            { icon: "🥺", text: "순수한 눈빛" },
            { icon: "😇", text: "천사 같은 미소" },
            { icon: "🌸", text: "부드러운 인상" },
            { icon: "💖", text: "사랑스러운 매력" }
        ],
        charms: [
            { icon: "🌺", text: "순수한 아름다움" },
            { icon: "🎀", text: "사랑스러운 외모" },
            { icon: "☁️", text: "부드러운 성격" },
            { icon: "💫", text: "천진난만함" }
        ],
        recommendations: {
            fashion: [
                { name: "파스텔 컬러", description: "순수한 매력 강조", icon: "🎨" },
                { name: "레이스 디테일", description: "로맨틱한 느낌", icon: "🎀" },
                { name: "펄 악세서리", description: "우아하고 순수한 이미지", icon: "📿" }
            ],
            lifestyle: [
                { name: "꽃구경", description: "자연과의 조화", icon: "🌹" },
                { name: "베이킹", description: "섬세한 취미", icon: "🧁" },
                { name: "독서", description: "조용한 취미", icon: "📚" }
            ]
        },
        personality: {
            순수함: 95,
            사랑스러움: 90,
            온순함: 88,
            매력도: 87
        },
        compatibility: [
            { animal: "고양이", score: "보통", description: "차분한 성격이 잘 맞음", emoji: "🐱" },
            { animal: "곰", score: "최고", description: "둘 다 온순한 성격", emoji: "🐻" },
            { animal: "햄스터", score: "좋음", description: "작고 귀여운 매력", emoji: "🐹" }
        ]
    },
    fox: {
        name: "여우",
        emoji: "🦊",
        description: "영리하고 매혹적인 매력을 가진 사람입니다. 섹시하면서도 지적인 아름다움으로 많은 사람들을 매료시켜요.",
        traits: ["영리함", "매혹적", "섹시함", "기민함", "카리스마"],
        features: [
            { icon: "😏", text: "섹시한 눈매" },
            { icon: "💋", text: "매혹적인 입술" },
            { icon: "🔥", text: "강렬한 인상" },
            { icon: "⚡", text: "날카로운 매력" }
        ],
        charms: [
            { icon: "🌟", text: "매혹적인 아우라" },
            { icon: "💃", text: "섹시한 매력" },
            { icon: "🧠", text: "지적인 매력" },
            { icon: "👑", text: "카리스마" }
        ],
        recommendations: {
            fashion: [
                { name: "레드 립스틱", description: "강렬한 매력 강조", icon: "💄" },
                { name: "블랙 드레스", description: "섹시하고 우아한 느낌", icon: "👗" },
                { name: "실버 악세서리", description: "세련된 포인트", icon: "💎" }
            ],
            lifestyle: [
                { name: "와인 테이스팅", description: "세련된 취미", icon: "🍷" },
                { name: "미술 감상", description: "지적인 문화생활", icon: "🎨" },
                { name: "댄스", description: "매혹적인 움직임", icon: "💃" }
            ]
        },
        personality: {
            영리함: 92,
            매혹성: 95,
            섹시함: 90,
            매력도: 93
        },
        compatibility: [
            { animal: "고양이", score: "최고", description: "비슷한 신비로운 매력", emoji: "🐱" },
            { animal: "강아지", score: "보통", description: "서로 다른 매력으로 흥미", emoji: "🐶" },
            { animal: "곰", score: "좋음", description: "상반된 매력의 조화", emoji: "🐻" }
        ]
    },
    bear: {
        name: "곰",
        emoji: "🐻",
        description: "따뜻하고 포근한 매력을 가진 사람입니다. 든든하고 신뢰할 수 있는 이미지로 주변 사람들에게 안정감을 줘요.",
        traits: ["따뜻함", "포근함", "든든함", "신뢰성", "포용력"],
        features: [
            { icon: "😊", text: "따뜻한 미소" },
            { icon: "🤗", text: "포근한 인상" },
            { icon: "💝", text: "친근한 외모" },
            { icon: "🛡️", text: "안정감 있는 매력" }
        ],
        charms: [
            { icon: "🤗", text: "포근한 매력" },
            { icon: "💪", text: "든든한 느낌" },
            { icon: "❤️", text: "따뜻한 마음" },
            { icon: "🏠", text: "안정감" }
        ],
        recommendations: {
            fashion: [
                { name: "니트웨어", description: "포근하고 따뜻한 느낌", icon: "🧶" },
                { name: "브라운 톤", description: "자연스럽고 편안한 느낌", icon: "🤎" },
                { name: "우드 악세서리", description: "자연친화적 이미지", icon: "🌳" }
            ],
            lifestyle: [
                { name: "홈파티", description: "따뜻한 분위기", icon: "🏠" },
                { name: "요리", description: "정성스러운 취미", icon: "👨‍🍳" },
                { name: "캠핑", description: "자연과 함께", icon: "🏕️" }
            ]
        },
        personality: {
            따뜻함: 95,
            포근함: 90,
            신뢰성: 88,
            매력도: 85
        },
        compatibility: [
            { animal: "토끼", score: "최고", description: "둘 다 온순한 성격", emoji: "🐰" },
            { animal: "강아지", score: "좋음", description: "따뜻한 성격이 잘 맞음", emoji: "🐶" },
            { animal: "햄스터", score: "좋음", description: "귀엽고 포근한 매력", emoji: "🐹" }
        ]
    },
    hamster: {
        name: "햄스터",
        emoji: "🐹",
        description: "작고 귀여운 매력을 가진 사람입니다. 애교 많고 사랑스러운 모습으로 모든 사람들의 마음을 녹여요.",
        traits: ["귀여움", "애교", "깜찍함", "활발함", "사랑스러움"],
        features: [
            { icon: "🥰", text: "귀여운 볼" },
            { icon: "✨", text: "반짝이는 눈" },
            { icon: "😽", text: "애교 있는 표정" },
            { icon: "🎀", text: "깜찍한 매력" }
        ],
        charms: [
            { icon: "🍯", text: "달콤한 애교" },
            { icon: "🌟", text: "깜찍한 매력" },
            { icon: "💕", text: "사랑스러운 모습" },
            { icon: "🎈", text: "통통 튀는 성격" }
        ],
        recommendations: {
            fashion: [
                { name: "미니 원피스", description: "깜찍하고 귀여운 느낌", icon: "👗" },
                { name: "핑크 컬러", description: "사랑스러운 이미지", icon: "🌸" },
                { name: "큐트 악세서리", description: "귀여운 포인트", icon: "🎀" }
            ],
            lifestyle: [
                { name: "카페 투어", description: "귀여운 카페 탐방", icon: "☕" },
                { name: "쇼핑", description: "귀여운 아이템 찾기", icon: "🛍️" },
                { name: "애완동물", description: "귀여운 친구들", icon: "🐾" }
            ]
        },
        personality: {
            귀여움: 95,
            애교: 90,
            깜찍함: 88,
            매력도: 87
        },
        compatibility: [
            { animal: "강아지", score: "최고", description: "둘 다 귀여운 매력", emoji: "🐶" },
            { animal: "토끼", score: "좋음", description: "작고 귀여운 매력", emoji: "🐰" },
            { animal: "곰", score: "좋음", description: "귀엽고 포근한 매력", emoji: "🐻" }
        ]
    }
};

// DOM 요소들
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const uploadedImage = document.getElementById('uploadedImage');
const analyzeBtn = document.getElementById('analyzeBtn');
const uploadSection = document.getElementById('uploadSection');
const analyzingSection = document.getElementById('analyzingSection');
const resultSection = document.getElementById('resultSection');

// 상태 변수
let uploadedFile = null;
let currentAnimal = null;

// 페이지 로드 시 초기화

}

// 결과 내용 생성
function generateResultContent(animal, score) {
    const resultContainer = document.querySelector('.result-container');
    
    resultContainer.innerHTML = `
        <h2>🎉 당신의 닮은 동물 분석 결과</h2>
        
        <!-- 메인 결과 -->
        <div class="result-card main-result">
            <div class="animal-result">
                <div class="animal-emoji-large">${animal.emoji}</div>
                <h3>당신은 <strong>${animal.name}</strong>와 닮았어요!</h3>
                <div class="similarity-score">
                    <span>유사도:</span>
                    <span>${score}%</span>
                </div>
                <p class="animal-description">${animal.description}</p>
            </div>
        </div>
        
        <!-- 상세 분석 -->
        <div class="detailed-analysis">
            <div class="analysis-grid">
                <div class="feature-card">
                    <h4>🎭 얼굴 특징</h4>
                    <div class="features-list">
                        ${animal.features.map(feature => `
                            <div class="feature-item">
                                <span class="feature-icon">${feature.icon}</span>
                                <span>${feature.text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="feature-card">
                    <h4>💖 성격 특징</h4>
                    <div class="personality-traits">
                        ${animal.traits.map(trait => `
                            <div class="trait-item">
                                <span class="trait-icon">✨</span>
                                <span>${trait}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="feature-card">
                    <h4>🌟 매력 포인트</h4>
                    <div class="charm-points">
                        ${animal.charms.map(charm => `
                            <div class="charm-item">
                                <span class="charm-icon">${charm.icon}</span>
                                <span>${charm.text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="feature-card">
                    <h4>📊 성격 지수</h4>
                    <div class="character-stats">
                        ${Object.entries(animal.personality).map(([key, value]) => `
                            <div class="stat-item">
                                <div class="stat-label">${key}</div>
                                <div class="stat-bar">
                                    <div class="stat-fill" style="width: ${value}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 캐릭터 정보 -->
        <div class="character-section">
            <h3>🎪 당신의 동물 캐릭터</h3>
            <div class="character-card">
                <div class="character-visual">
                    <div class="character-emoji">${animal.emoji}</div>
                    <div class="character-accessories">
                        <div class="accessory">👑</div>
                        <div class="accessory">✨</div>
                    </div>
                </div>
                <div class="character-info">
                    <h4>${animal.name} 타입</h4>
                    <p>${animal.description}</p>
                    <div class="character-stats">
                        ${Object.entries(animal.personality).map(([key, value]) => `
                            <div class="stat-item">
                                <div class="stat-label">${key}</div>
                                <div class="stat-bar">
                                    <div class="stat-fill" style="width: ${value}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 궁합 분석 -->
        <div class="compatibility-section">
            <h3>💕 다른 동물과의 궁합</h3>
            <div class="compatibility-grid">
                ${animal.compatibility.map(comp => `
                    <div class="compatibility-item">
                        <div class="compatibility-animals">
                            <span class="compatibility-emoji">${animal.emoji}</span>
                            <span style="font-size: 1.5rem;">❤️</span>
                            <span class="compatibility-emoji">${comp.emoji}</span>
                        </div>
                        <div class="compatibility-score ${comp.score === '최고' ? 'excellent' : comp.score === '좋음' ? 'good' : 'average'}">
                            ${comp.score}
                        </div>
                        <div class="compatibility-description">${comp.description}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- 스타일 추천 -->
        <div class="recommendations-section">
            <h3>🎨 ${animal.name}에게 어울리는 스타일</h3>
            <div class="recommendation-categories">
                <div class="category-card">
                    <h4>👗 패션 스타일</h4>
                    <div class="recommendation-items">
                        ${animal.recommendations.fashion.map(item => `
                            <div class="recommendation-item">
                                <span class="item-icon">${item.icon}</span>
                                <div class="item-text">
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-description">${item.description}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="category-card">
                    <h4>🌟 라이프스타일</h4>
                    <div class="recommendation-items">
                        ${animal.recommendations.lifestyle.map(item => `
                            <div class="recommendation-item">
                                <span class="item-icon">${item.icon}</span>
                                <div class="item-text">
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-description">${item.description}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 다시 하기 버튼 -->
        <div class="retry-section">
            <button class="retry-btn">🔄 다른 사진으로 다시 해보기</button>
        </div>
        
        <!-- 공유 버튼 -->
        <div class="share-section">
            <h3>📤 결과 공유하기</h3>
            <div class="share-buttons">
                <button class="share-btn kakao" data-type="kakao">
                    💬 카카오톡으로 공유
                </button>
                <button class="share-btn url" data-type="url">
                    🔗 링크 복사
                </button>
            </div>
        </div>
    `;
    
    // 스탯 바 애니메이션
    setTimeout(() => {
        document.querySelectorAll('.stat-fill').forEach((fill, index) => {
            setTimeout(() => {
                fill.style.width = fill.style.width;
            }, index * 200);
        });
    }, 500);
}

// 공유 처리
function handleShare(button) {
    const shareType = button.dataset.type;
    const animalName = currentAnimal ? currentAnimal.name : '동물';
    const url = window.location.href;
    const title = `나는 ${animalName}와 닮았어요! 🎉`;
    const description = currentAnimal ? currentAnimal.description : '재미있는 동물 테스트를 해보세요!';
    
    if (shareType === 'kakao') {
        shareToKakao(title, description, url);
    } else if (shareType === 'url') {
        copyToClipboard(url);
    }
}

// 카카오톡 공유
function shareToKakao(title, description, url) {
    if (window.Kakao && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: title,
                description: description,
                imageUrl: 'https://example.com/animal-test-image.jpg', // 실제 이미지 URL로 교체
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            },
            buttons: [
                {
                    title: '나도 테스트하기',
                    link: {
                        mobileWebUrl: url,
                        webUrl: url,
                    },
                },
            ],
        });
    } else {
        alert('카카오톡 공유 기능을 사용할 수 없습니다.');
    }
}

// 클립보드 복사
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('링크가 클립보드에 복사되었습니다!');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// 클립보드 복사 대체 방법
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('링크가 클립보드에 복사되었습니다!');
    } catch (err) {
        alert('링크 복사에 실패했습니다. 수동으로 복사해주세요: ' + text);
    }
    
    document.body.removeChild(textArea);
}

// 테스트 초기화
function resetTest() {
    // 섹션 표시/숨김 초기화
    uploadSection.style.display = 'block';
    analyzingSection.style.display = 'none';
    resultSection.style.display = 'none';
    
    // 광고 섹션들 숨기기 (상단 광고는 유지)
    adManager.hideAd('ad-middle');
    adManager.hideAd('ad-result');
    
    // 업로드 상태 초기화
    removeUploadedImage();
    
    // 분석 단계 초기화
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector('.progress-fill').style.width = '0%';
    
    // 변수 초기화
    currentAnimal = null;
    
    // 업로드 섹션으로 스크롤
    uploadSection.scrollIntoView({ behavior: 'smooth' });
}

// 에러 처리
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// 터치 디바이스 지원
document.addEventListener('touchstart', function() {}, { passive: true });

// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
});