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
if (typeof Kakao !== 'undefined') {
    Kakao.init('2c2ed6479d8c597005fac18db90b7649');
}

// 광고 로드 관리


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

// 관상 데이터베이스
const physiognomyDatabase = {
    faceShapes: [
        { name: "계란형", description: "균형감과 조화로움을 의미하며, 원만한 인간관계를 유지하는 성격", fortune: "길상" },
        { name: "둥근형", description: "온화하고 포용력이 있으며, 복이 많고 인복이 좋은 관상", fortune: "대길" },
        { name: "사각형", description: "의지가 강하고 책임감이 뛰어나며, 성실한 성격의 소유자", fortune: "길상" },
        { name: "긴형", description: "지적이고 세심하며, 예술적 감각이 뛰어난 관상", fortune: "중길" },
        { name: "역삼각형", description: "창의적이고 독창적이며, 리더십이 뛰어난 관상", fortune: "길상" },
        { name: "마름모형", description: "카리스마가 있고 강인한 의지력을 가진 관상", fortune: "중길" }
    ],
    
    eyeShapes: [
        { name: "아몬드형", description: "지적이고 세심한 성격을 나타내며, 통찰력이 뛰어남", fortune: "지혜운 상승" },
        { name: "둥근 눈", description: "순수하고 감정이 풍부하며, 사교성이 좋은 성격", fortune: "인기운 상승" },
        { name: "가늘고 긴 눈", description: "침착하고 신중하며, 깊이 있는 사고력을 가짐", fortune: "학업운 상승" },
        { name: "크고 또렷한 눈", description: "적극적이고 열정적이며, 리더십이 뛰어남", fortune: "사업운 상승" },
        { name: "쌍꺼풀이 있는 눈", description: "감수성이 풍부하고 예술적 재능이 있음", fortune: "예술운 상승" },
        { name: "쌍꺼풀이 없는 눈", description: "현실적이고 실용적이며, 끈기가 강함", fortune: "재물운 상승" }
    ],
    
    noseShapes: [
        { name: "직선형", description: "정직하고 성실한 성격으로 재물운이 좋음을 의미", fortune: "재물운 대길" },
        { name: "매부리코", description: "개성이 강하고 독립적이며, 성취욕이 강함", fortune: "성공운 상승" },
        { name: "들창코", description: "낙천적이고 긍정적이며, 사람들과 잘 어울림", fortune: "대인운 상승" },
        { name: "작고 오똑한 코", description: "섬세하고 품위있으며, 예술적 감각이 뛰어남", fortune: "품격운 상승" },
        { name: "크고 당당한 코", description: "자신감이 넘치고 리더십이 있으며, 권위를 갖춤", fortune: "권력운 상승" },
        { name: "넓은 콧구멍", description: "관대하고 너그러우며, 재물을 모으는 능력이 좋음", fortune: "축재운 상승" }
    ],
    
    mouthShapes: [
        { name: "적당한 크기", description: "소통 능력이 뛰어나고 사교적인 성격을 나타냄", fortune: "대인운 길상" },
        { name: "큰 입", description: "호방하고 대범하며, 말솜씨가 뛰어나고 인기가 많음", fortune: "인기운 대길" },
        { name: "작은 입", description: "신중하고 조심스러우며, 비밀을 잘 지키는 성격", fortune: "신뢰운 상승" },
        { name: "도톰한 입술", description: "정이 많고 감정이 풍부하며, 애정운이 좋음", fortune: "애정운 대길" },
        { name: "얇은 입술", description: "논리적이고 분석적이며, 말을 신중하게 함", fortune: "지혜운 상승" },
        { name: "웃는 입", description: "긍정적이고 밝은 성격으로 주변을 행복하게 만듦", fortune: "행복운 대길" }
    ],
    
    overallFortunes: [
        {
            type: "복스러운 관상",
            description: "전체적으로 균형 잡힌 얼굴형으로 온화하고 복스러운 인상을 주는 관상입니다.",
            wealth: 4, love: 5, business: 3, health: 4,
            advice: "당신의 관상은 전체적으로 균형이 잘 잡혀 있어 안정적인 인생을 살아갈 수 있는 좋은 관상입니다. 특히 인간관계에서 복을 받을 운명이므로 사람들과의 인연을 소중히 하세요."
        },
        {
            type: "귀한 관상",
            description: "고귀하고 품격있는 인상으로 타고난 리더의 기질을 보여주는 관상입니다.",
            wealth: 5, love: 4, business: 5, health: 4,
            advice: "타고난 리더의 자질을 가지고 있습니다. 자신의 능력을 믿고 큰 꿈을 펼쳐보세요. 다만 겸손함을 잃지 않는 것이 중요합니다."
        },
        {
            type: "총명한 관상",
            description: "지적이고 영리한 인상으로 학문과 지혜의 운이 강한 관상입니다.",
            wealth: 3, love: 4, business: 4, health: 5,
            advice: "뛰어난 지적 능력을 가지고 있습니다. 꾸준한 학습과 자기계발을 통해 전문성을 기르면 큰 성공을 이룰 수 있습니다."
        },
        {
            type: "친화력 좋은 관상",
            description: "온화하고 다정한 인상으로 사람들이 좋아하는 관상입니다.",
            wealth: 4, love: 5, business: 3, health: 4,
            advice: "뛰어난 친화력과 소통 능력을 가지고 있습니다. 인간관계를 바탕으로 한 사업이나 활동에서 좋은 결과를 얻을 수 있습니다."
        },
        {
            type: "강인한 관상",
            description: "의지가 강하고 불굴의 정신력을 보여주는 관상입니다.",
            wealth: 4, love: 3, business: 5, health: 5,
            advice: "강인한 의지력과 추진력을 가지고 있습니다. 어려운 일도 포기하지 않고 끝까지 해내는 능력이 있으니 도전을 두려워하지 마세요."
        },
        {
            type: "예술적 관상",
            description: "섬세하고 감성적인 인상으로 예술적 재능이 뛰어난 관상입니다.",
            wealth: 3, love: 5, business: 3, health: 4,
            advice: "뛰어난 예술적 감각과 창의력을 가지고 있습니다. 자신만의 독특한 개성을 살려 창작 활동이나 문화 분야에서 두각을 나타낼 수 있습니다."
        }
    ]
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
    
    // 중간 광고 표시 및 로드
    adManager.loadAd('ad-middle');
    
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
    // 랜덤 관상 결과 생성
    const randomFace = getRandomElement(physiognomyDatabase.faceShapes);
    const randomEye = getRandomElement(physiognomyDatabase.eyeShapes);
    const randomNose = getRandomElement(physiognomyDatabase.noseShapes);
    const randomMouth = getRandomElement(physiognomyDatabase.mouthShapes);
    const randomOverall = getRandomElement(physiognomyDatabase.overallFortunes);
    
    // 결과 표시
    document.getElementById('faceTypeName').textContent = randomOverall.type;
    document.getElementById('faceTypeScore').textContent = '★'.repeat(Math.floor(Math.random() * 2) + 4) + '☆'.repeat(5 - Math.floor(Math.random() * 2) - 4);
    document.getElementById('faceDescription').textContent = randomOverall.description;
    
    document.getElementById('faceShapeName').textContent = randomFace.name;
    document.getElementById('faceShapeMeaning').textContent = randomFace.description;
    
    document.getElementById('eyeShapeName').textContent = randomEye.name;
    document.getElementById('eyeShapeMeaning').textContent = randomEye.description;
    
    document.getElementById('noseShapeName').textContent = randomNose.name;
    document.getElementById('noseShapeMeaning').textContent = randomNose.description;
    
    document.getElementById('mouthShapeName').textContent = randomMouth.name;
    document.getElementById('mouthShapeMeaning').textContent = randomMouth.description;
    
    // 운세 점수
    document.getElementById('wealthScore').textContent = '★'.repeat(randomOverall.wealth) + '☆'.repeat(5 - randomOverall.wealth);
    document.getElementById('loveScore').textContent = '★'.repeat(randomOverall.love) + '☆'.repeat(5 - randomOverall.love);
    document.getElementById('businessScore').textContent = '★'.repeat(randomOverall.business) + '☆'.repeat(5 - randomOverall.business);
    document.getElementById('healthScore').textContent = '★'.repeat(randomOverall.health) + '☆'.repeat(5 - randomOverall.health);
    
    // 운세 설명
    const fortunes = generateFortuneDescriptions(randomOverall);
    document.getElementById('wealthFortune').textContent = fortunes.wealth;
    document.getElementById('loveFortune').textContent = fortunes.love;
    document.getElementById('businessFortune').textContent = fortunes.business;
    document.getElementById('healthFortune').textContent = fortunes.health;
    
    // 조언
    document.getElementById('adviceContent').innerHTML = `<p>${randomOverall.advice}</p>`;
    
    // 섹션 전환
    analyzingSection.style.display = 'none';
    resultSection.style.display = 'block';
    retrySection.style.display = 'block';
    shareSection.style.display = 'block';
    
    // 결과 페이지 중간 광고 표시 및 로드
    adManager.loadAd('ad-result');
    
    // 스크롤을 결과 섹션으로 이동
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

function generateFortuneDescriptions(overall) {
    const wealthDescriptions = [
        "꾸준한 노력으로 안정적인 재물을 축적할 수 있는 관상입니다.",
        "재물운이 좋아 경제적으로 풍요로운 삶을 살 수 있습니다.",
        "투자나 사업에서 좋은 성과를 거둘 수 있는 관상입니다.",
        "돈을 모으는 능력이 뛰어나 부를 축적할 수 있습니다.",
        "재정 관리에 신중함이 필요하지만 전체적으로 안정적입니다."
    ];
    
    const loveDescriptions = [
        "따뜻한 인상으로 좋은 인연을 만날 수 있는 관상입니다.",
        "애정운이 뛰어나 행복한 연애와 결혼생활을 할 수 있습니다.",
        "매력적인 관상으로 이성에게 인기가 많을 것입니다.",
        "진실한 사랑을 찾을 수 있는 복스러운 관상입니다.",
        "가족운도 좋아 화목한 가정을 이룰 수 있습니다."
    ];
    
    const businessDescriptions = [
        "신중하고 계획적인 접근으로 성공할 수 있는 관상입니다.",
        "리더십이 뛰어나 사업에서 큰 성취를 이룰 수 있습니다.",
        "창의적인 아이디어로 새로운 분야에서 성공할 수 있습니다.",
        "인맥을 통한 사업 기회가 많이 생길 것입니다.",
        "끈기있게 노력하면 원하는 목표를 달성할 수 있습니다."
    ];
    
    const healthDescriptions = [
        "전체적으로 건강한 관상이나 스트레스 관리가 중요합니다.",
        "체력이 좋고 건강한 삶을 살 수 있는 관상입니다.",
        "규칙적인 생활과 운동으로 건강을 유지하세요.",
        "정신적인 건강도 좋아 스트레스에 잘 대처할 수 있습니다.",
        "장수하며 건강한 노년을 보낼 수 있는 관상입니다."
    ];
    
    return {
        wealth: getRandomElement(wealthDescriptions),
        love: getRandomElement(loveDescriptions),
        business: getRandomElement(businessDescriptions),
        health: getRandomElement(healthDescriptions)
    };
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
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
    
    // 광고 섹션들 숨기기 (상단 광고는 유지)
    document.getElementById('ad-middle').style.display = 'none';
    document.getElementById('ad-result').style.display = 'none';
    
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
            title: '🔮 AI 관상 분석 결과',
            description: '사진 한 장으로 알아보는 나의 관상과 운세! 당신도 지금 확인해보세요.',
            imageUrl: 'https://sd2624.github.io/관상/관상.svg',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href
            }
        },
        buttons: [
            {
                title: '나도 관상 보러가기',
                link: {
                    mobileWebUrl: 'https://sd2624.github.io/관상/',
                    webUrl: 'https://sd2624.github.io/관상/'
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

// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
});