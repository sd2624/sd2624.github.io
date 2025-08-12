// 연예인 데이터베이스
const celebrityDatabase = {
    korean: [
        {
            name: "송혜교",
            category: "한국 배우",
            description: "우아하고 고급스러운 미모로 유명한 톱스타입니다. 깔끔하고 세련된 이미지가 매력적이에요.",
            features: [
                { icon: "👁️", text: "맑고 깊은 눈매" },
                { icon: "💄", text: "우아한 입술" },
                { icon: "✨", text: "고급스러운 분위기" },
                { icon: "🌸", text: "부드러운 인상" }
            ],
            charms: [
                { icon: "👑", text: "우아한 기품" },
                { icon: "💎", text: "고급스러운 매력" },
                { icon: "🌹", text: "세련된 스타일" },
                { icon: "✨", text: "자연스러운 아름다움" }
            ],
            actingStyle: [
                { icon: "🎭", text: "자연스러운 연기" },
                { icon: "💕", text: "로맨틱 장르 특화" },
                { icon: "🌟", text: "감정 표현력" }
            ]
        },
        {
            name: "박보검",
            category: "한국 배우",
            description: "훈훈하고 따뜻한 이미지로 많은 사랑을 받는 배우입니다. 친근하면서도 남성적인 매력을 가지고 있어요.",
            features: [
                { icon: "😊", text: "따뜻한 미소" },
                { icon: "👀", text: "선량한 눈빛" },
                { icon: "💪", text: "남성적인 턱선" },
                { icon: "🌟", text: "밝은 인상" }
            ],
            charms: [
                { icon: "😇", text: "천사 같은 미소" },
                { icon: "💝", text: "따뜻한 마음" },
                { icon: "🤗", text: "친근한 매력" },
                { icon: "⭐", text: "믿음직한 이미지" }
            ],
            actingStyle: [
                { icon: "🎬", text: "진정성 있는 연기" },
                { icon: "💕", text: "로맨스 연기" },
                { icon: "🌈", text: "밝은 에너지" }
            ]
        },
        {
            name: "수지",
            category: "가수 겸 배우",
            description: "청순하고 자연스러운 아름다움으로 '국민 첫사랑'이라 불리는 스타입니다. 밝고 사랑스러운 매력이 돋보여요.",
            features: [
                { icon: "🥺", text: "순수한 눈빛" },
                { icon: "😊", text: "사랑스러운 미소" },
                { icon: "🌸", text: "청순한 이미지" },
                { icon: "✨", text: "자연스러운 매력" }
            ],
            charms: [
                { icon: "💖", text: "사랑스러운 매력" },
                { icon: "🌺", text: "청순한 아름다움" },
                { icon: "😇", text: "순수한 이미지" },
                { icon: "🎀", text: "귀여운 매력" }
            ],
            actingStyle: [
                { icon: "🎭", text: "자연스러운 연기" },
                { icon: "💕", text: "로맨틱 코미디" },
                { icon: "🌟", text: "밝은 캐릭터" }
            ]
        },
        {
            name: "이민호",
            category: "한국 배우",
            description: "완벽한 비주얼과 키로 '꽃미남'의 대표주자입니다. 세련되고 카리스마 있는 매력을 가지고 있어요.",
            features: [
                { icon: "👁️", text: "깊은 눈매" },
                { icon: "👃", text: "높은 콧대" },
                { icon: "💪", text: "남성적인 턱선" },
                { icon: "✨", text: "세련된 분위기" }
            ],
            charms: [
                { icon: "👑", text: "왕자님 같은 비주얼" },
                { icon: "💎", text: "완벽한 조화" },
                { icon: "🔥", text: "카리스마" },
                { icon: "⭐", text: "스타 오라" }
            ],
            actingStyle: [
                { icon: "🎬", text: "로맨스 장르" },
                { icon: "💪", text: "액션 연기" },
                { icon: "👑", text: "카리스마틱한 연기" }
            ]
        }
    ],
    hollywood: [
        {
            name: "엠마 스톤",
            category: "할리우드 배우",
            description: "개성 있고 매력적인 연기로 아카데미상을 수상한 배우입니다. 독특하면서도 사랑스러운 매력을 가지고 있어요.",
            features: [
                { icon: "👀", text: "큰 눈과 표현력" },
                { icon: "😊", text: "매력적인 미소" },
                { icon: "🔥", text: "개성 있는 매력" },
                { icon: "✨", text: "유니크한 분위기" }
            ],
            charms: [
                { icon: "🎭", text: "뛰어난 연기력" },
                { icon: "😄", text: "유머러스함" },
                { icon: "💫", text: "개성적인 매력" },
                { icon: "🌟", text: "자신감" }
            ],
            actingStyle: [
                { icon: "🎭", text: "코미디 연기" },
                { icon: "💕", text: "로맨틱 코미디" },
                { icon: "🎪", text: "뮤지컬 연기" }
            ]
        },
        {
            name: "라이언 고슬링",
            category: "할리우드 배우",
            description: "섬세하고 감성적인 연기로 유명한 배우입니다. 신비롭고 매력적인 분위기를 가지고 있어요.",
            features: [
                { icon: "👁️", text: "신비로운 눈빛" },
                { icon: "💭", text: "사색적인 표정" },
                { icon: "😏", text: "매혹적인 미소" },
                { icon: "🌙", text: "몽환적인 분위기" }
            ],
            charms: [
                { icon: "🎭", text: "깊이 있는 연기" },
                { icon: "🌙", text: "신비로운 매력" },
                { icon: "💫", text: "감성적인 면" },
                { icon: "🎶", text: "예술적 감각" }
            ],
            actingStyle: [
                { icon: "🎭", text: "드라마틱한 연기" },
                { icon: "💕", text: "로맨스 연기" },
                { icon: "🎶", text: "뮤지컬 연기" }
            ]
        }
    ],
    kpop: [
        {
            name: "지수 (BLACKPINK)",
            category: "K-POP 아이돌",
            description: "우아하고 고급스러운 비주얼로 '인간 구찌'라 불리는 글로벌 스타입니다. 세련되고 시크한 매력이 돋보여요.",
            features: [
                { icon: "👑", text: "고급스러운 분위기" },
                { icon: "👁️", text: "시크한 눈매" },
                { icon: "💄", text: "완벽한 입술" },
                { icon: "✨", text: "모델 같은 비주얼" }
            ],
            charms: [
                { icon: "👑", text: "퀸카 오라" },
                { icon: "💎", text: "고급스러운 매력" },
                { icon: "🔥", text: "시크한 카리스마" },
                { icon: "🌟", text: "글로벌 스타" }
            ],
            actingStyle: [
                { icon: "🎤", text: "파워풀한 보컬" },
                { icon: "💃", text: "우아한 퍼포먼스" },
                { icon: "📸", text: "모델 포즈" }
            ]
        },
        {
            name: "정국 (BTS)",
            category: "K-POP 아이돌",
            description: "'황금막내'라 불리며 모든 분야에 뛰어난 재능을 보이는 글로벌 스타입니다. 완벽한 비주얼과 실력을 겸비했어요.",
            features: [
                { icon: "🐰", text: "토끼 같은 매력" },
                { icon: "👀", text: "큰 눈과 긴 속눈썹" },
                { icon: "😊", text: "밝은 미소" },
                { icon: "💪", text: "운동선수 체격" }
            ],
            charms: [
                { icon: "🌟", text: "올라운더 재능" },
                { icon: "😇", text: "순수한 매력" },
                { icon: "💪", text: "완벽한 체격" },
                { icon: "🎤", text: "뛰어난 실력" }
            ],
            actingStyle: [
                { icon: "🎤", text: "감성적인 보컬" },
                { icon: "💃", text: "파워풀한 댄스" },
                { icon: "🎭", text: "다양한 컨셉" }
            ]
        }
    ],
    japanese: [
        {
            name: "하시모토 칸나",
            category: "일본 배우",
            description: "천사 같은 미모로 일본에서 가장 인기 있는 배우 중 하나입니다. 청순하고 사랑스러운 매력을 가지고 있어요.",
            features: [
                { icon: "😇", text: "천사 같은 미소" },
                { icon: "👁️", text: "맑은 눈빛" },
                { icon: "🌸", text: "청순한 분위기" },
                { icon: "💕", text: "사랑스러운 매력" }
            ],
            charms: [
                { icon: "👼", text: "천사 같은 외모" },
                { icon: "🌸", text: "청순한 매력" },
                { icon: "💖", text: "사랑스러운 이미지" },
                { icon: "✨", text: "자연스러운 아름다움" }
            ],
            actingStyle: [
                { icon: "🎭", text: "자연스러운 연기" },
                { icon: "💕", text: "로맨스 장르" },
                { icon: "🌈", text: "밝은 캐릭터" }
            ]
        }
    ],
    chinese: [
        {
            name: "판빙빙",
            category: "중국 배우",
            description: "동양적이면서도 글로벌한 매력을 가진 중화권 대표 배우입니다. 강렬하고 카리스마 있는 매력이 돋보여요.",
            features: [
                { icon: "👑", text: "여왕 같은 기품" },
                { icon: "👁️", text: "강렬한 눈매" },
                { icon: "💄", text: "섹시한 입술" },
                { icon: "✨", text: "카리스마 있는 분위기" }
            ],
            charms: [
                { icon: "👑", text: "여왕 같은 카리스마" },
                { icon: "🔥", text: "강렬한 매력" },
                { icon: "💎", text: "고급스러운 아름다움" },
                { icon: "🌟", text: "글로벌 스타" }
            ],
            actingStyle: [
                { icon: "🎭", text: "카리스마틱한 연기" },
                { icon: "👑", text: "황후 역할" },
                { icon: "💪", text: "강인한 캐릭터" }
            ]
        }
    ]
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
let currentCelebrity = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadKakaoSDK();
});

// 이벤트 리스너 초기화
function initializeEventListeners() {
    // 파일 업로드 관련
    fileInput.addEventListener('change', handleFileSelect);
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // 분석 버튼
    analyzeBtn.addEventListener('click', startAnalysis);
    
    // 다시 하기 버튼 (동적 생성)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('retry-btn')) {
            resetTest();
        }
        if (e.target.classList.contains('remove-image')) {
            removeUploadedImage();
        }
        if (e.target.classList.contains('share-btn')) {
            handleShare(e.target);
        }
    });
    
    // 연예인 카테고리 미리보기 클릭
    document.querySelectorAll('.celebrity-preview').forEach(preview => {
        preview.addEventListener('click', function() {
            const category = this.dataset.category;
            scrollToUpload();
        });
    });
}

// 카카오 SDK 로드
function loadKakaoSDK() {
    if (!window.Kakao) {
        const script = document.createElement('script');
        script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js';
        script.integrity = 'sha384-mXVrIX2T/Kszp6Z0aEWaA8Nm7J6/ZeWXbL8UpGRjKwWe56Srd/uxjMSXT541S9h6';
        script.crossOrigin = 'anonymous';
        script.onload = function() {
            if (window.Kakao && !Kakao.isInitialized()) {
                Kakao.init('YOUR_JAVASCRIPT_KEY'); // 실제 키로 교체 필요
            }
        };
        document.head.appendChild(script);
    }
}

// 업로드 섹션으로 스크롤
function scrollToUpload() {
    uploadSection.scrollIntoView({ behavior: 'smooth' });
}

// 파일 선택 처리
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

// 드래그 오버
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

// 드래그 리브
function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

// 드롭 처리
function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

// 파일 처리
function processFile(file) {
    // 파일 유효성 검사
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB 제한
        alert('파일 크기는 10MB 이하로 업로드해주세요.');
        return;
    }
    
    uploadedFile = file;
    
    // 이미지 미리보기
    const reader = new FileReader();
    reader.onload = function(e) {
        showUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
}

// 업로드된 이미지 표시
function showUploadedImage(imageSrc) {
    uploadedImage.innerHTML = `
        <img src="${imageSrc}" alt="업로드된 이미지">
        <button class="remove-image" title="이미지 삭제">×</button>
    `;
    uploadedImage.style.display = 'block';
    
    // 업로드 영역 숨기기
    document.querySelector('.upload-placeholder').style.display = 'none';
    
    // 분석 버튼 활성화
    analyzeBtn.disabled = false;
}

// 업로드된 이미지 제거
function removeUploadedImage() {
    uploadedImage.style.display = 'none';
    document.querySelector('.upload-placeholder').style.display = 'block';
    analyzeBtn.disabled = true;
    uploadedFile = null;
    fileInput.value = '';
}

// 분석 시작
function startAnalysis() {
    if (!uploadedFile) {
        alert('먼저 사진을 업로드해주세요.');
        return;
    }
    
    // 업로드 섹션 숨기고 분석 섹션 표시
    uploadSection.style.display = 'none';
    analyzingSection.style.display = 'block';
    
    // 분석 애니메이션 시작
    startAnalyzingAnimation();
    
    // 4초 후 결과 표시
    setTimeout(() => {
        showResult();
    }, 4000);
}

// 분석 애니메이션
function startAnalyzingAnimation() {
    const steps = document.querySelectorAll('.step');
    const progressFill = document.querySelector('.progress-fill');
    let currentStep = 0;
    
    const stepTexts = [
        '얼굴 특징점 추출 중...',
        '연예인 데이터베이스 매칭 중...',
        '유사도 계산 중...',
        '매력 포인트 분석 중...',
        '결과 생성 중...'
    ];
    
    function activateStep() {
        if (currentStep > 0) {
            steps[currentStep - 1].classList.remove('active');
        }
        
        if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
            steps[currentStep].textContent = stepTexts[currentStep];
            
            // 진행률 업데이트
            const progress = ((currentStep + 1) / steps.length) * 100;
            progressFill.style.width = progress + '%';
            
            currentStep++;
            setTimeout(activateStep, 800);
        }
    }
    
    activateStep();
}

// 결과 표시
function showResult() {
    // 랜덤 연예인 선택
    const allCategories = Object.keys(celebrityDatabase);
    const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
    const categoryData = celebrityDatabase[randomCategory];
    const randomCelebrity = categoryData[Math.floor(Math.random() * categoryData.length)];
    
    currentCelebrity = randomCelebrity;
    
    // 랜덤 유사도 점수 (75-95%)
    const similarityScore = Math.floor(Math.random() * 21) + 75;
    
    // 분석 섹션 숨기고 결과 섹션 표시
    analyzingSection.style.display = 'none';
    resultSection.style.display = 'block';
    
    // 결과 내용 생성
    generateResultContent(randomCelebrity, similarityScore, randomCategory);
    
    // 결과 섹션으로 스크롤
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// 결과 내용 생성
function generateResultContent(celebrity, score, category) {
    const resultContainer = document.querySelector('.result-container');
    
    // 다른 닮은꼴들 생성
    const otherMatches = generateOtherMatches(category, celebrity.name);
    
    resultContainer.innerHTML = `
        <h2>🎉 당신의 연예인 닮은꼴 분석 결과</h2>
        
        <!-- 메인 결과 -->
        <div class="result-card main-result">
            <div class="celebrity-result">
                <div class="celebrity-image">🌟</div>
                <h3>당신은 <strong>${celebrity.name}</strong>과 닮았어요!</h3>
                <div class="celebrity-category">${celebrity.category}</div>
                <div class="similarity-score">
                    <span>유사도:</span>
                    <span>${score}%</span>
                </div>
                <p class="celebrity-description">${celebrity.description}</p>
            </div>
        </div>
        
        <!-- 상세 분석 -->
        <div class="detailed-analysis">
            <div class="analysis-grid">
                <div class="feature-card">
                    <h4>🎭 얼굴 특징</h4>
                    <div class="features-list">
                        ${celebrity.features.map(feature => `
                            <div class="feature-item">
                                <span class="feature-icon">${feature.icon}</span>
                                <span>${feature.text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="feature-card">
                    <h4>🌟 매력 포인트</h4>
                    <div class="charm-points">
                        ${celebrity.charms.map(charm => `
                            <div class="charm-item">
                                <span class="charm-icon">${charm.icon}</span>
                                <span>${charm.text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="feature-card">
                    <h4>🎬 연기/퍼포먼스 스타일</h4>
                    <div class="acting-style">
                        ${celebrity.actingStyle.map(style => `
                            <div class="acting-item">
                                <span class="acting-icon">${style.icon}</span>
                                <span>${style.text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="feature-card">
                    <h4>✨ 스타 포인트</h4>
                    <div class="style-recommendations">
                        <div class="style-item">
                            <span class="style-icon">👑</span>
                            <span>카리스마 있는 분위기</span>
                        </div>
                        <div class="style-item">
                            <span class="style-icon">📸</span>
                            <span>사진발 받는 각도</span>
                        </div>
                        <div class="style-item">
                            <span class="style-icon">💫</span>
                            <span>독특한 매력 포인트</span>
                        </div>
                        <div class="style-item">
                            <span class="style-icon">🎭</span>
                            <span>표현력 있는 연기</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 다른 닮은꼴들 -->
        <div class="other-matches-section">
            <h3>🎯 다른 닮은꼴들</h3>
            <div class="other-matches-grid">
                ${otherMatches.map(match => `
                    <div class="other-match-item">
                        <div class="other-match-image">⭐</div>
                        <div class="other-match-name">${match.name}</div>
                        <div class="other-match-score">${match.score}%</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- 스타일 추천 -->
        <div class="style-recommendations-section">
            <h3>💄 ${celebrity.name} 스타일 따라하기</h3>
            <div class="recommendation-categories">
                <div class="category-card">
                    <h4>💄 메이크업 스타일</h4>
                    <div class="recommendation-items">
                        <div class="recommendation-item">
                            <span class="item-icon">👁️</span>
                            <div class="item-text">
                                <div class="item-name">아이 메이크업</div>
                                <div class="item-description">깊이 있는 눈매 연출</div>
                            </div>
                        </div>
                        <div class="recommendation-item">
                            <span class="item-icon">💄</span>
                            <div class="item-text">
                                <div class="item-name">립 메이크업</div>
                                <div class="item-description">자연스러운 컬러감</div>
                            </div>
                        </div>
                        <div class="recommendation-item">
                            <span class="item-icon">✨</span>
                            <div class="item-text">
                                <div class="item-name">하이라이트</div>
                                <div class="item-description">윤기 있는 피부 표현</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="category-card">
                    <h4>👗 패션 스타일</h4>
                    <div class="recommendation-items">
                        <div class="recommendation-item">
                            <span class="item-icon">👗</span>
                            <div class="item-text">
                                <div class="item-name">드레스 스타일</div>
                                <div class="item-description">우아하고 세련된 원피스</div>
                            </div>
                        </div>
                        <div class="recommendation-item">
                            <span class="item-icon">💎</span>
                            <div class="item-text">
                                <div class="item-name">액세서리</div>
                                <div class="item-description">고급스러운 포인트 아이템</div>
                            </div>
                        </div>
                        <div class="recommendation-item">
                            <span class="item-icon">👠</span>
                            <div class="item-text">
                                <div class="item-name">신발</div>
                                <div class="item-description">우아한 하이힐</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="category-card">
                    <h4>💇‍♀️ 헤어 스타일</h4>
                    <div class="recommendation-items">
                        <div class="recommendation-item">
                            <span class="item-icon">💇‍♀️</span>
                            <div class="item-text">
                                <div class="item-name">헤어컷</div>
                                <div class="item-description">얼굴형에 맞는 스타일</div>
                            </div>
                        </div>
                        <div class="recommendation-item">
                            <span class="item-icon">🎨</span>
                            <div class="item-text">
                                <div class="item-name">헤어컬러</div>
                                <div class="item-description">피부톤에 어울리는 컬러</div>
                            </div>
                        </div>
                        <div class="recommendation-item">
                            <span class="item-icon">✨</span>
                            <div class="item-text">
                                <div class="item-name">헤어 케어</div>
                                <div class="item-description">윤기 나는 모발 관리</div>
                            </div>
                        </div>
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
}

// 다른 닮은꼴들 생성
function generateOtherMatches(excludeCategory, excludeName) {
    const allCelebrities = [];
    
    // 모든 카테고리에서 연예인 수집 (현재 결과 제외)
    Object.keys(celebrityDatabase).forEach(category => {
        celebrityDatabase[category].forEach(celebrity => {
            if (celebrity.name !== excludeName) {
                allCelebrities.push(celebrity);
            }
        });
    });
    
    // 랜덤하게 3명 선택
    const shuffled = allCelebrities.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    return selected.map(celebrity => ({
        name: celebrity.name,
        score: Math.floor(Math.random() * 20) + 60 // 60-79%
    }));
}

// 공유 처리
function handleShare(button) {
    const shareType = button.dataset.type;
    const celebrityName = currentCelebrity ? currentCelebrity.name : '연예인';
    const url = window.location.href;
    const title = `나는 ${celebrityName}와 닮았어요! 🌟`;
    const description = currentCelebrity ? currentCelebrity.description : '재미있는 연예인 닮은꼴 테스트를 해보세요!';
    
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
                imageUrl: 'https://example.com/celebrity-test-image.jpg', // 실제 이미지 URL로 교체
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
    
    // 업로드 상태 초기화
    removeUploadedImage();
    
    // 분석 단계 초기화
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector('.progress-fill').style.width = '0%';
    
    // 변수 초기화
    currentCelebrity = null;
    
    // 업로드 섹션으로 스크롤
    uploadSection.scrollIntoView({ behavior: 'smooth' });
}

// 에러 처리
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// 터치 디바이스 지원
document.addEventListener('touchstart', function() {}, { passive: true });
