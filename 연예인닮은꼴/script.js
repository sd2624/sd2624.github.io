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

// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
    
    // 파일 업로드 이벤트 리스너 등록
    setupFileUpload();
});

// 파일 업로드 이벤트 설정
function setupFileUpload() {
    // 업로드 영역 클릭 시 파일 선택
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 드래그 앤 드롭 이벤트
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
            handleFileUpload(files[0]);
        }
    });
    
    // 파일 입력 이벤트
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
    
    // 분석 버튼 이벤트
    analyzeBtn.addEventListener('click', startAnalysis);
}

// 파일 업로드 처리
function handleFileUpload(file) {
    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
    }
    
    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
    }
    
    // 파일 저장
    uploadedFile = file;
    
    // 미리보기 이미지 표시
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedImage.src = e.target.result;
        uploadedImage.style.display = 'block';
        uploadArea.querySelector('.upload-placeholder').style.display = 'none';
        analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

// 분석 시작
function startAnalysis() {
    if (!uploadedFile) {
        alert('사진을 먼저 업로드해주세요.');
        return;
    }
    
    // 섹션 전환
    uploadSection.style.display = 'none';
    analyzingSection.style.display = 'block';
    
    // 중간 광고 로드
    adManager.loadAd('ad-middle');
    
    // 분석 시뮬레이션
    simulateAnalysis();
}

// 분석 시뮬레이션
function simulateAnalysis() {
    setTimeout(() => {
        // 랜덤 연예인 선택
        const celebrities = [
            '아이유', '박보영', '김태희', '송혜교', '전지현',
            '박신혜', '수지', '크리스탈', '태연', '윤아',
            '정유미', '박소담', '김고은', '한지민', '김하늘',
            '손예진', '박민영', '김사랑', '이나영', '김태리'
        ];
        
        currentCelebrity = celebrities[Math.floor(Math.random() * celebrities.length)];
        
        // 결과 표시
        showResult();
    }, 3000);
}

// 결과 표시
function showResult() {
    analyzingSection.style.display = 'none';
    resultSection.style.display = 'block';
    
    // 결과 텍스트 업데이트
    document.getElementById('celebrityName').textContent = currentCelebrity;
    document.getElementById('similarityScore').textContent = Math.floor(Math.random() * 20) + 80 + '%';
    
    // 결과 광고 로드
    adManager.loadAd('ad-result');
}