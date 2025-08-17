// 카카오 SDK 초기화
if (typeof Kakao !== 'undefined') {
    Kakao.init('2c2ed6479d8c597005fac18db90b7649');
}

// DOM 요소들
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const uploadedImage = document.getElementById('uploadedImage');
const previewImage = document.getElementById('previewImage');
const removeImage = document.getElementById('removeImage');
const analyzeBtn = document.getElementById('analyzeBtn');

const uploadSection = document.getElementById('uploadSection');
const analyzingSection = document.getElementById('analyzingSection');
const resultSection = document.getElementById('resultSection');
const retrySection = document.getElementById('retrySection');
const shareSection = document.getElementById('shareSection');

let selectedFile = null;

// 퍼스널 컬러 데이터베이스
const personalColorDatabase = {
    seasons: {
        spring: {
            name: '봄 웜톤',
            icon: '🌸',
            description: '따뜻하고 생동감 넘치는 컬러가 어울리는 타입입니다. 밝고 화사한 색상으로 활기찬 이미지를 연출할 수 있습니다.',
            palette: [
                { color: '#FFB6C1', name: '라이트 핑크' },
                { color: '#FFE4B5', name: '모카신' },
                { color: '#98FB98', name: '페일 그린' },
                { color: '#87CEEB', name: '스카이 블루' },
                { color: '#DDA0DD', name: '플럼' },
                { color: '#F0E68C', name: '카키' },
                { color: '#FFA07A', name: '라이트 샐몬' },
                { color: '#20B2AA', name: '라이트 씨 그린' }
            ],
            makeup: {
                lipstick: [
                    { color: '#FF6B9D', name: '코랄 핑크' },
                    { color: '#FF8C69', name: '샐몬 핑크' },
                    { color: '#FFB347', name: '피치' }
                ],
                eyeshadow: [
                    { color: '#F4A460', name: '샌디 브라운' },
                    { color: '#DEB887', name: '버렐우드' },
                    { color: '#D2B48C', name: '탄' }
                ],
                blusher: [
                    { color: '#FFB6C1', name: '라이트 핑크' },
                    { color: '#FFA07A', name: '라이트 샐몬' },
                    { color: '#F0E68C', name: '카키' }
                ]
            },
            hair: [
                { color: '#D2691E', name: '초콜릿 브라운' },
                { color: '#CD853F', name: '페루' },
                { color: '#DAA520', name: '골든로드' },
                { color: '#B8860B', name: '다크 골든로드' }
            ],
            best: [
                { color: '#FFE4B5', name: '모카신' },
                { color: '#F0E68C', name: '카키' },
                { color: '#98FB98', name: '페일 그린' },
                { color: '#FFB6C1', name: '라이트 핑크' }
            ],
            avoid: [
                { color: '#2F4F4F', name: '다크 슬레이트 그레이' },
                { color: '#696969', name: '딤 그레이' },
                { color: '#000000', name: '블랙' },
                { color: '#8B008B', name: '다크 마젠타' }
            ],
            accessories: {
                jewelry: '골드 톤',
                bag: '브라운, 베이지 계열',
                glasses: '토터쉘, 라이트 브라운',
                shoes: '베이지, 누드, 브라운'
            },
            tips: [
                { title: '컬러 조합', content: '베이스 컬러는 아이보리나 크림색을 선택하고, 포인트 컬러로 밝은 컬러를 사용하세요.' },
                { title: '메이크업', content: '따뜻한 톤의 메이크업으로 건강하고 생기있는 이미지를 연출하세요.' },
                { title: '헤어', content: '따뜻한 브라운 계열이나 하이라이트로 입체감을 주는 것이 좋습니다.' },
                { title: '패션', content: '밝고 화사한 컬러의 의상으로 활기찬 분위기를 연출하세요.' }
            ]
        },
        summer: {
            name: '여름 쿨톤',
            icon: '☀️',
            description: '시원하고 우아한 컬러가 어울리는 타입입니다. 부드럽고 세련된 색상으로 품격있는 이미지를 연출할 수 있습니다.',
            palette: [
                { color: '#E6E6FA', name: '라벤더' },
                { color: '#F0F8FF', name: '앨리스 블루' },
                { color: '#FAEBD7', name: '앤틱 화이트' },
                { color: '#D8BFD8', name: '시슬' },
                { color: '#DDA0DD', name: '플럼' },
                { color: '#B0E0E6', name: '파우더 블루' },
                { color: '#F5F5DC', name: '베이지' },
                { color: '#E0E0E0', name: '라이트 그레이' }
            ],
            makeup: {
                lipstick: [
                    { color: '#DA70D6', name: '로즈 핑크' },
                    { color: '#DB7093', name: '페일 바이올렛 레드' },
                    { color: '#DDA0DD', name: '플럼' }
                ],
                eyeshadow: [
                    { color: '#E6E6FA', name: '라벤더' },
                    { color: '#D8BFD8', name: '시슬' },
                    { color: '#C0C0C0', name: '실버' }
                ],
                blusher: [
                    { color: '#FFB6C1', name: '라이트 핑크' },
                    { color: '#F0F8FF', name: '앨리스 블루' },
                    { color: '#E6E6FA', name: '라벤더' }
                ]
            },
            hair: [
                { color: '#8B4513', name: '새들 브라운' },
                { color: '#A0522D', name: '시에나' },
                { color: '#696969', name: '딤 그레이' },
                { color: '#2F4F4F', name: '다크 슬레이트 그레이' }
            ],
            best: [
                { color: '#E6E6FA', name: '라벤더' },
                { color: '#B0E0E6', name: '파우더 블루' },
                { color: '#F0F8FF', name: '앨리스 블루' },
                { color: '#D8BFD8', name: '시슬' }
            ],
            avoid: [
                { color: '#FF4500', name: '오렌지 레드' },
                { color: '#FFD700', name: '골드' },
                { color: '#FF8C00', name: '다크 오렌지' },
                { color: '#FFA500', name: '오렌지' }
            ],
            accessories: {
                jewelry: '실버, 화이트골드 톤',
                bag: '그레이, 네이비, 화이트 계열',
                glasses: '실버, 블랙, 클리어',
                shoes: '블랙, 그레이, 네이비'
            },
            tips: [
                { title: '컬러 조합', content: '화이트를 베이스로 하고 쿨톤 컬러로 포인트를 주세요.' },
                { title: '메이크업', content: '차가운 톤의 메이크업으로 세련되고 지적인 이미지를 연출하세요.' },
                { title: '헤어', content: '애쉬 브라운이나 차가운 톤의 컬러가 잘 어울립니다.' },
                { title: '패션', content: '모노톤이나 파스텔 컬러로 우아한 분위기를 연출하세요.' }
            ]
        },
        autumn: {
            name: '가을 웜톤',
            icon: '🍂',
            description: '깊고 풍부한 컬러가 어울리는 타입입니다. 따뜻하고 성숙한 색상으로 고급스러운 이미지를 연출할 수 있습니다.',
            palette: [
                { color: '#8B4513', name: '새들 브라운' },
                { color: '#A0522D', name: '시에나' },
                { color: '#CD853F', name: '페루' },
                { color: '#D2691E', name: '초콜릿' },
                { color: '#B22222', name: '파이어 브릭' },
                { color: '#556B2F', name: '다크 올리브 그린' },
                { color: '#8B0000', name: '다크 레드' },
                { color: '#2F4F4F', name: '다크 슬레이트 그레이' }
            ],
            makeup: {
                lipstick: [
                    { color: '#B22222', name: '파이어 브릭' },
                    { color: '#8B0000', name: '다크 레드' },
                    { color: '#CD853F', name: '페루' }
                ],
                eyeshadow: [
                    { color: '#8B4513', name: '새들 브라운' },
                    { color: '#A0522D', name: '시에나' },
                    { color: '#D2691E', name: '초콜릿' }
                ],
                blusher: [
                    { color: '#CD853F', name: '페루' },
                    { color: '#D2691E', name: '초콜릿' },
                    { color: '#A0522D', name: '시에나' }
                ]
            },
            hair: [
                { color: '#8B4513', name: '새들 브라운' },
                { color: '#A0522D', name: '시에나' },
                { color: '#654321', name: '다크 브라운' },
                { color: '#D2691E', name: '초콜릿 브라운' }
            ],
            best: [
                { color: '#8B4513', name: '새들 브라운' },
                { color: '#556B2F', name: '다크 올리브 그린' },
                { color: '#B22222', name: '파이어 브릭' },
                { color: '#CD853F', name: '페루' }
            ],
            avoid: [
                { color: '#FF69B4', name: '핫 핑크' },
                { color: '#00FFFF', name: '시안' },
                { color: '#FFFF00', name: '옐로우' },
                { color: '#FF1493', name: '딥 핑크' }
            ],
            accessories: {
                jewelry: '골드, 브론즈 톤',
                bag: '브라운, 카키, 버건디 계열',
                glasses: '토터쉘, 다크 브라운',
                shoes: '브라운, 버건디, 다크 그린'
            },
            tips: [
                { title: '컬러 조합', content: '어스톤 컬러를 베이스로 하고 깊은 컬러로 포인트를 주세요.' },
                { title: '메이크업', content: '따뜻하고 깊은 톤의 메이크업으로 성숙한 매력을 강조하세요.' },
                { title: '헤어', content: '따뜻한 브라운 계열이 가장 잘 어울립니다.' },
                { title: '패션', content: '어스톤 컬러와 버건디 등으로 고급스러운 분위기를 연출하세요.' }
            ]
        },
        winter: {
            name: '겨울 쿨톤',
            icon: '❄️',
            description: '선명하고 강렬한 컬러가 어울리는 타입입니다. 대비가 뚜렷한 색상으로 시크하고 도시적인 이미지를 연출할 수 있습니다.',
            palette: [
                { color: '#000000', name: '블랙' },
                { color: '#FFFFFF', name: '화이트' },
                { color: '#FF0000', name: '레드' },
                { color: '#0000FF', name: '블루' },
                { color: '#800080', name: '퍼플' },
                { color: '#008000', name: '그린' },
                { color: '#C0C0C0', name: '실버' },
                { color: '#4B0082', name: '인디고' }
            ],
            makeup: {
                lipstick: [
                    { color: '#FF0000', name: '레드' },
                    { color: '#8B008B', name: '다크 마젠타' },
                    { color: '#4B0082', name: '인디고' }
                ],
                eyeshadow: [
                    { color: '#696969', name: '딤 그레이' },
                    { color: '#2F4F4F', name: '다크 슬레이트 그레이' },
                    { color: '#4B0082', name: '인디고' }
                ],
                blusher: [
                    { color: '#FF69B4', name: '핫 핑크' },
                    { color: '#DA70D6', name: '오키드' },
                    { color: '#C0C0C0', name: '실버' }
                ]
            },
            hair: [
                { color: '#000000', name: '제트 블랙' },
                { color: '#2F4F4F', name: '다크 슬레이트 그레이' },
                { color: '#696969', name: '딤 그레이' },
                { color: '#4B0082', name: '인디고 블랙' }
            ],
            best: [
                { color: '#000000', name: '블랙' },
                { color: '#FFFFFF', name: '화이트' },
                { color: '#FF0000', name: '레드' },
                { color: '#0000FF', name: '블루' }
            ],
            avoid: [
                { color: '#F0E68C', name: '카키' },
                { color: '#FFE4B5', name: '모카신' },
                { color: '#DEB887', name: '버렐우드' },
                { color: '#D2691E', name: '초콜릿' }
            ],
            accessories: {
                jewelry: '실버, 플래티넘 톤',
                bag: '블랙, 화이트, 레드 계열',
                glasses: '블랙, 실버, 클리어',
                shoes: '블랙, 화이트, 레드'
            },
            tips: [
                { title: '컬러 조합', content: '블랙과 화이트의 대비를 활용하고 선명한 컬러로 포인트를 주세요.' },
                { title: '메이크업', content: '강렬하고 선명한 컬러의 메이크업으로 도시적인 매력을 강조하세요.' },
                { title: '헤어', content: '진한 블랙이나 애쉬 계열이 잘 어울립니다.' },
                { title: '패션', content: '모노톤 베이스에 선명한 포인트 컬러로 시크한 분위기를 연출하세요.' }
            ]
        }
    }
};

// 파일 업로드 이벤트
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelection(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
    }
});

// 파일 선택 처리
function handleFileSelection(file) {
    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
    }
    
    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        return;
    }
    
    selectedFile = file;
    
    // 이미지 미리보기
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadPlaceholder.style.display = 'none';
        uploadedImage.style.display = 'block';
        analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

// 이미지 제거
removeImage.addEventListener('click', (e) => {
    e.stopPropagation();
    selectedFile = null;
    uploadPlaceholder.style.display = 'block';
    uploadedImage.style.display = 'none';
    analyzeBtn.disabled = true;
    fileInput.value = '';
});

// 분석 시작
analyzeBtn.addEventListener('click', startAnalysis);

function startAnalysis() {
    if (!selectedFile) {
        alert('사진을 먼저 업로드해주세요.');
        return;
    }
    
    // 섹션 전환
    uploadSection.style.display = 'none';
    analyzingSection.style.display = 'block';
    
    // 분석 애니메이션 시작
    simulateAnalysis();
}

function simulateAnalysis() {
    const steps = document.querySelectorAll('.step');
    const progressFill = document.querySelector('.progress-fill');
    let currentStep = 0;
    
    const stepInterval = setInterval(() => {
        if (currentStep > 0) {
            steps[currentStep - 1].classList.remove('active');
        }
        
        if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
            progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
            currentStep++;
        } else {
            clearInterval(stepInterval);
            setTimeout(() => {
                showResults();
            }, 1000);
        }
    }, 1500);
}

function showResults() {
    // 랜덤 계절 선택
    const seasonKeys = Object.keys(personalColorDatabase.seasons);
    const randomSeason = seasonKeys[Math.floor(Math.random() * seasonKeys.length)];
    const seasonData = personalColorDatabase.seasons[randomSeason];
    
    // 결과 표시
    document.getElementById('seasonIcon').textContent = seasonData.icon;
    document.getElementById('seasonName').textContent = seasonData.name;
    document.getElementById('seasonDescription').textContent = seasonData.description;
    
    // 컬러 팔레트 생성
    const colorPalette = document.getElementById('colorPalette');
    colorPalette.innerHTML = '';
    seasonData.palette.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color.color;
        swatch.setAttribute('data-color-name', color.name);
        colorPalette.appendChild(swatch);
    });
    
    // 메이크업 컬러
    displayMakeupColors('lipstickColors', 'lipstickNames', seasonData.makeup.lipstick);
    displayMakeupColors('eyeshadowColors', 'eyeshadowNames', seasonData.makeup.eyeshadow);
    displayMakeupColors('blusherColors', 'blusherNames', seasonData.makeup.blusher);
    
    // 헤어 컬러
    displayHairColors(seasonData.hair);
    
    // 패션 컬러
    displayFashionColors('bestColors', seasonData.best);
    displayFashionColors('avoidColors', seasonData.avoid);
    
    // 조언 텍스트
    document.getElementById('bestColorAdvice').textContent = '이 컬러들은 당신의 피부톤을 밝게 만들어 줍니다.';
    document.getElementById('avoidColorAdvice').textContent = '이 컬러들은 피부를 칙칙해 보이게 할 수 있습니다.';
    
    // 액세서리 추천
    document.getElementById('jewelryRecommendation').textContent = seasonData.accessories.jewelry;
    document.getElementById('bagRecommendation').textContent = seasonData.accessories.bag;
    document.getElementById('glassesRecommendation').textContent = seasonData.accessories.glasses;
    document.getElementById('shoesRecommendation').textContent = seasonData.accessories.shoes;
    
    // 헤어 조언
    document.getElementById('hairAdvice').textContent = `${seasonData.name}에게는 ${seasonData.hair.map(h => h.name).join(', ')} 계열이 잘 어울립니다.`;
    
    // 스타일링 팁
    displayStylingTips(seasonData.tips);
    
    // 섹션 전환
    analyzingSection.style.display = 'none';
    resultSection.style.display = 'block';
    retrySection.style.display = 'block';
    shareSection.style.display = 'block';
    
    // 스크롤을 결과 섹션으로 이동
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

function displayMakeupColors(containerId, namesId, colors) {
    const container = document.getElementById(containerId);
    const namesElement = document.getElementById(namesId);
    
    container.innerHTML = '';
    colors.forEach(color => {
        const sample = document.createElement('div');
        sample.className = 'color-sample';
        sample.style.backgroundColor = color.color;
        container.appendChild(sample);
    });
    
    namesElement.textContent = colors.map(c => c.name).join(', ');
}

function displayHairColors(colors) {
    const container = document.getElementById('hairColors');
    container.innerHTML = '';
    
    colors.forEach(color => {
        const hairColor = document.createElement('div');
        hairColor.className = 'hair-color';
        
        const sample = document.createElement('div');
        sample.className = 'hair-color-sample';
        sample.style.backgroundColor = color.color;
        
        const name = document.createElement('div');
        name.className = 'hair-color-name';
        name.textContent = color.name;
        
        hairColor.appendChild(sample);
        hairColor.appendChild(name);
        container.appendChild(hairColor);
    });
}

function displayFashionColors(containerId, colors) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    colors.forEach(color => {
        const sample = document.createElement('div');
        sample.className = 'color-sample';
        sample.style.backgroundColor = color.color;
        sample.title = color.name;
        container.appendChild(sample);
    });
}

function displayStylingTips(tips) {
    const container = document.getElementById('stylingTips');
    container.innerHTML = '';
    
    tips.forEach(tip => {
        const tipItem = document.createElement('div');
        tipItem.className = 'tip-item';
        
        const title = document.createElement('h5');
        title.textContent = tip.title;
        
        const content = document.createElement('p');
        content.textContent = tip.content;
        
        tipItem.appendChild(title);
        tipItem.appendChild(content);
        container.appendChild(tipItem);
    });
}

// 테스트 다시 하기
function resetTest() {
    selectedFile = null;
    uploadPlaceholder.style.display = 'block';
    uploadedImage.style.display = 'none';
    analyzeBtn.disabled = true;
    fileInput.value = '';
    
    // 모든 섹션 숨기기
    analyzingSection.style.display = 'none';
    resultSection.style.display = 'none';
    retrySection.style.display = 'none';
    shareSection.style.display = 'none';
    
    // 업로드 섹션 표시
    uploadSection.style.display = 'block';
    
    // 분석 단계 초기화
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index === 0) step.classList.add('active');
    });
    
    document.querySelector('.progress-fill').style.width = '0%';
    
    // 맨 위로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 카카오톡 공유
function shareKakao() {
    if (typeof Kakao === 'undefined') {
        alert('카카오톡 공유 기능을 사용할 수 없습니다.');
        return;
    }
    
    Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: '🎨 퍼스널 컬러 진단 결과',
            description: '나만의 컬러 팔레트를 찾았어요! 당신도 지금 확인해보세요.',
            imageUrl: 'https://sd2624.github.io/퍼스널컬러/퍼스널컬러.svg',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href
            }
        },
        buttons: [
            {
                title: '나도 퍼스널 컬러 찾기',
                link: {
                    mobileWebUrl: 'https://sd2624.github.io/퍼스널컬러/',
                    webUrl: 'https://sd2624.github.io/퍼스널컬러/'
                }
            }
        ]
    });
}

// URL 복사
function copyUrl() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            alert('URL이 클립보드에 복사되었습니다!');
        }).catch(() => {
            fallbackCopyTextToClipboard(url);
        });
    } else {
        fallbackCopyTextToClipboard(url);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('URL이 클립보드에 복사되었습니다!');
    } catch (err) {
        alert('URL 복사에 실패했습니다.');
    }
    
    document.body.removeChild(textArea);
}

// 전역 함수로 노출
window.resetTest = resetTest;
window.shareKakao = shareKakao;
window.copyUrl = copyUrl;
