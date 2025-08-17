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

// 광고 관리 클래스 - 중복 로드 방지


const questions = [
    {
        question: "주로 어떤 용도로 음악을 다운로드하시나요?",
        description: "🎯 용도에 따라 최적의 방법이 달라집니다",
        answers: [
            { text: "개인 음악 감상용", purpose: "personal_listening", complexity: 1, quality_need: 3 },
            { text: "휴대폰 벨소리/알림음", purpose: "ringtone", complexity: 1, quality_need: 2 },
            { text: "동영상 편집 배경음악", purpose: "video_editing", complexity: 3, quality_need: 4 },
            { text: "오프라인 백업 보관", purpose: "backup", complexity: 2, quality_need: 4 },
            { text: "운동/조깅용 플레이리스트", purpose: "workout", complexity: 2, quality_need: 3 },
            { text: "학습/공부용 배경음악", purpose: "study", complexity: 1, quality_need: 2 }
        ]
    },
    {
        question: "주로 사용하는 기기는?",
        description: "📱 기기별로 권장하는 방법이 다릅니다",
        answers: [
            { text: "Windows PC", device: "windows_pc", tech_level: 3, mobility: 1 },
            { text: "Mac (맥북/아이맥)", device: "mac", tech_level: 3, mobility: 2 },
            { text: "Android 스마트폰", device: "android", tech_level: 2, mobility: 5 },
            { text: "iPhone/iPad", device: "ios", tech_level: 2, mobility: 5 },
            { text: "PC와 모바일 모두", device: "multi_device", tech_level: 4, mobility: 4 },
            { text: "태블릿 위주", device: "tablet", tech_level: 2, mobility: 4 }
        ]
    },
    {
        question: "기술적 수준은 어느 정도인가요?",
        description: "🔧 기술 수준에 맞는 방법을 추천해드립니다",
        answers: [
            { text: "프로그램 설치도 어려움", tech_skill: "beginner", ease_preference: 5, program_ok: 1 },
            { text: "간단한 프로그램 설치 가능", tech_skill: "basic", ease_preference: 4, program_ok: 3 },
            { text: "웹사이트 이용 선호", tech_skill: "web_user", ease_preference: 3, program_ok: 2 },
            { text: "프로그램 설치 문제없음", tech_skill: "intermediate", ease_preference: 2, program_ok: 5 },
            { text: "명령어 도구도 사용 가능", tech_skill: "advanced", ease_preference: 1, program_ok: 5 },
            { text: "개발자/IT 전문가", tech_skill: "expert", ease_preference: 1, program_ok: 5 }
        ]
    },
    {
        question: "음질에 대한 요구사항은?",
        description: "🎵 음질에 따라 추천 사이트가 달라집니다",
        answers: [
            { text: "최고음질 필수 (320kbps)", quality_need: "highest", file_size_ok: 5, audiophile: 5 },
            { text: "고음질 선호 (256kbps)", quality_need: "high", file_size_ok: 4, audiophile: 4 },
            { text: "적당한 음질 (192kbps)", quality_need: "medium", file_size_ok: 3, audiophile: 3 },
            { text: "표준음질로 충분 (128kbps)", quality_need: "standard", file_size_ok: 2, audiophile: 2 },
            { text: "음질보다는 용량 중시", quality_need: "low", file_size_ok: 1, audiophile: 1 },
            { text: "상황에 따라 다름", quality_need: "variable", file_size_ok: 3, audiophile: 3 }
        ]
    },
    {
        question: "다운로드 빈도는?",
        description: "⏰ 사용 빈도에 따른 최적 솔루션을 찾아드립니다",
        answers: [
            { text: "매일 여러 곡", frequency: "daily_heavy", convenience_need: 5, batch_need: 5 },
            { text: "주 2-3회 정도", frequency: "regular", convenience_need: 4, batch_need: 3 },
            { text: "가끔 필요할 때만", frequency: "occasional", convenience_need: 3, batch_need: 2 },
            { text: "월 1-2회", frequency: "rare", convenience_need: 2, batch_need: 1 },
            { text: "플레이리스트 통째로", frequency: "playlist_bulk", convenience_need: 5, batch_need: 5 },
            { text: "일회성 사용", frequency: "one_time", convenience_need: 1, batch_need: 1 }
        ]
    },
    {
        question: "보안과 안전성에 대한 우려는?",
        description: "🔒 안전성 수준에 맞는 방법을 추천합니다",
        answers: [
            { text: "매우 중요 (회사 컴퓨터 등)", security_concern: "highest", ad_tolerance: 1, download_safety: 5 },
            { text: "중요함 (개인 주요 기기)", security_concern: "high", ad_tolerance: 2, download_safety: 4 },
            { text: "적당히 신경씀", security_concern: "medium", ad_tolerance: 3, download_safety: 3 },
            { text: "크게 신경 안씀", security_concern: "low", ad_tolerance: 4, download_safety: 2 },
            { text: "광고 많아도 상관없음", security_concern: "minimal", ad_tolerance: 5, download_safety: 1 },
            { text: "백신으로 충분히 보호됨", security_concern: "protected", ad_tolerance: 3, download_safety: 3 }
        ]
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];

// DOM 요소
const startPage = document.getElementById('startPage');
const questionPage = document.getElementById('questionPage');
const resultPage = document.getElementById('resultPage');
const analysisModal = document.getElementById('analysisModal');

// 테스트 시작
function startTest() {
    if (startPage) startPage.classList.add('hidden');
    if (questionPage) questionPage.classList.remove('hidden');
    
    const totalQuestions = document.getElementById('totalQuestions');
    if (totalQuestions) totalQuestions.textContent = questions.length;
    
    currentQuestionIndex = 0;
    userAnswers = [];
    showQuestion();
}

// 질문 표시
function showQuestion() {
    const question = questions[currentQuestionIndex];
    
    // 진행률 업데이트
    const progressFill = document.querySelector('.progress-fill');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    
    if (progressFill) {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    if (currentQuestionSpan) {
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
    }
    
    // 3번째 질문 후 중간 광고 표시
    if (currentQuestionIndex === 3) {
        adManager.showMidAd();
    }
    
    // 질문 내용 업데이트
    const questionTitle = document.getElementById('questionTitle');
    const questionDescription = document.getElementById('questionDescription');
    const answersContainer = document.getElementById('answersContainer');
    
    if (questionTitle) questionTitle.textContent = question.question;
    if (questionDescription) questionDescription.textContent = question.description;
    
    if (answersContainer) {
        answersContainer.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';
            answerDiv.textContent = answer.text;
            answerDiv.onclick = () => selectAnswer(answer, index);
            answersContainer.appendChild(answerDiv);
        });
    }
}

// 답변 선택
function selectAnswer(answer, index) {
    userAnswers[currentQuestionIndex] = answer;
    
    // 시각적 피드백
    const options = document.querySelectorAll('.answer-option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    
    // 다음 질문으로 이동
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showAnalysisModal();
        }
    }, 800);
}

// 분석 모달 표시
function showAnalysisModal() {
    if (questionPage) questionPage.classList.add('hidden');
    if (analysisModal) analysisModal.classList.remove('hidden');
    
    // 팝업 광고 초기화
    setTimeout(() => {
        if (typeof adsbygoogle !== 'undefined') {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, 100);
    
    // 분석 단계 애니메이션
    const steps = document.querySelectorAll('.step-item');
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('active');
            const check = step.querySelector('.step-check');
            if (check && index < 4) {
                check.textContent = '✓';
                check.style.color = '#10b981';
            }
        }, (index + 1) * 1000);
    });
    
    // 카운트다운 시작
    let countdown = 6;
    const timerDisplay = document.querySelector('.timer-display');
    
    const timer = setInterval(() => {
        if (timerDisplay) timerDisplay.textContent = countdown;
        countdown--;
        
        if (countdown < 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);
}

// 결과 표시
function showResult() {
    if (analysisModal) analysisModal.classList.add('hidden');
    if (resultPage) resultPage.classList.remove('hidden');
    
    const result = analyzeAnswers();
    displayResult(result);
    
    // 결과 페이지 광고 표시
    adManager.showResultAd();
}

// 답변 분석
function analyzeAnswers() {
    const purpose = userAnswers[0] || {};
    const device = userAnswers[1] || {};
    const techSkill = userAnswers[2] || {};
    const quality = userAnswers[3] || {};
    const frequency = userAnswers[4] || {};
    const security = userAnswers[5] || {};
    
    let recommendedMethod = "";
    let primarySite = "";
    let alternativeSites = [];
    let methodType = "";
    let steps = [];
    let safetyTips = [];
    
    // 기술 수준과 보안 요구사항 기반 분석
    const techLevel = techSkill.tech_skill || "basic";
    const securityLevel = security.security_concern || "medium";
    const deviceType = device.device || "windows_pc";
    const qualityNeed = quality.quality_need || "medium";
    
    // 추천 방법 결정
    if (techLevel === "beginner" || securityLevel === "highest") {
        recommendedMethod = "웹 기반 변환기 (초보자용)";
        primarySite = "YTMP3.cc";
        alternativeSites = ["Y2Mate", "OnlineVideoConverter"];
        methodType = "웹사이트";
        steps = [
            "유튜브에서 원하는 영상 URL 복사",
            "YTMP3.cc 사이트 접속",
            "URL 붙여넣기 후 변환 클릭",
            "변환 완료 후 다운로드"
        ];
    } else if (frequency.frequency === "daily_heavy" || frequency.frequency === "playlist_bulk") {
        recommendedMethod = "전용 프로그램 (고급 사용자용)";
        primarySite = "4K Video Downloader";
        alternativeSites = ["JDownloader 2", "yt-dlp"];
        methodType = "프로그램";
        steps = [
            "4K Video Downloader 다운로드 및 설치",
            "프로그램 실행 후 URL 붙여넣기",
            "음질 및 형식 선택",
            "다운로드 폴더 설정 후 시작"
        ];
    } else if (deviceType === "android" || deviceType === "ios") {
        recommendedMethod = "모바일 최적화 사이트";
        primarySite = "SaveFrom.net";
        alternativeSites = ["Y2Mate 모바일", "YTMP3 모바일"];
        methodType = "모바일웹";
        steps = [
            "유튜브 앱에서 공유 버튼 클릭",
            "링크 복사 선택",
            "SaveFrom.net 모바일 사이트 접속",
            "링크 붙여넣기 후 다운로드"
        ];
    } else {
        recommendedMethod = "균형잡힌 웹 기반 솔루션";
        primarySite = "Y2Mate";
        alternativeSites = ["YTMP3", "OnlineVideoConverter", "ClipConverter"];
        methodType = "웹사이트";
        steps = [
            "Y2Mate 사이트 접속",
            "유튜브 URL 입력",
            "원하는 품질 선택 (128-320kbps)",
            "변환 후 다운로드"
        ];
    }
    
    // 안전 팁 생성
    safetyTips = [
        "신뢰할 수 있는 사이트만 이용하세요",
        "개인정보 입력을 요구하는 사이트는 피하세요",
        "다운로드 전 파일을 백신으로 검사하세요",
        "광고 차단기 사용을 권장합니다"
    ];
    
    if (securityLevel === "highest") {
        safetyTips.unshift("회사 컴퓨터에서는 사용을 자제하세요");
    }
    
    return {
        recommendedMethod,
        primarySite,
        alternativeSites,
        methodType,
        steps,
        safetyTips,
        techLevel,
        securityLevel,
        deviceType,
        qualityNeed,
        purpose: purpose.purpose || "general"
    };
}

// 결과 표시
function displayResult(result) {
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultSubtitle = document.getElementById('resultSubtitle');
    
    if (resultIcon) {
        if (result.methodType === "프로그램") {
            resultIcon.textContent = '💻';
        } else if (result.methodType === "모바일웹") {
            resultIcon.textContent = '📱';
        } else {
            resultIcon.textContent = '🌐';
        }
    }
    
    if (resultTitle) resultTitle.textContent = result.recommendedMethod;
    if (resultSubtitle) resultSubtitle.textContent = `추천: ${result.primarySite}`;
    
    displayDetailedAnalysis(result);
}

// 상세 분석 표시
function displayDetailedAnalysis(result) {
    const methodDiv = document.querySelector('.recommended-method');
    const sitesDiv = document.querySelector('.site-recommendations');
    const stepsDiv = document.querySelector('.step-by-step');
    const safetyDiv = document.querySelector('.safety-tips');
    
    if (methodDiv) {
        methodDiv.innerHTML = `
            <h3>🎯 추천 방법</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #fff3cd, #ffeaa7); padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>최적 방법:</strong> ${result.recommendedMethod}<br>
                    <strong>유형:</strong> ${result.methodType}<br>
                    <strong>주 사이트:</strong> ${result.primarySite}
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
                    <strong>당신의 프로필:</strong><br>
                    기술수준: ${result.techLevel} | 보안요구: ${result.securityLevel} | 기기: ${result.deviceType}
                </div>
            </div>
        `;
    }
    
    if (sitesDiv) {
        sitesDiv.innerHTML = `
            <h3>🌟 추천 사이트</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #e8f5e8, #a8e6a3); padding: 15px; border-radius: 10px; margin: 10px 0;">
                    <strong>1순위: ${result.primarySite}</strong><br>
                    <small>• 안정성과 속도 최우선 추천</small>
                </div>
                <div style="background: linear-gradient(135deg, #e3f2fd, #90caf9); padding: 15px; border-radius: 10px;">
                    <strong>대안 사이트들:</strong><br>
                    ${result.alternativeSites.map(site => `<small>• ${site}</small>`).join('<br>')}
                </div>
            </div>
        `;
    }
    
    if (stepsDiv) {
        stepsDiv.innerHTML = `
            <h3>📋 단계별 가이드</h3>
            <ol style="margin: 15px 0; padding-left: 20px;">
                ${result.steps.map(step => `<li style="margin: 8px 0; padding: 5px 0;">${step}</li>`).join('')}
            </ol>
            <div style="background: linear-gradient(135deg, #f3e5f5, #ce93d8); color: white; padding: 15px; border-radius: 10px; margin-top: 15px;">
                <strong>💡 Pro Tip:</strong><br>
                <small>• 유튜브 URL에 'ss'를 추가하면 빠른 접근 가능</small><br>
                <small>• 예: youtube.com → ssyoutube.com</small>
            </div>
        `;
    }
    
    if (safetyDiv) {
        safetyDiv.innerHTML = `
            <h3>🔒 안전 수칙</h3>
            <div style="margin: 15px 0;">
                <div style="background: linear-gradient(135deg, #ffebee, #ffcdd2); padding: 15px; border-radius: 10px;">
                    <strong>⚠️ 필수 주의사항</strong><br>
                    ${result.safetyTips.map(tip => `<small>• ${tip}</small>`).join('<br>')}
                </div>
                <div style="background: linear-gradient(135deg, #e8f5e8, #c8e6c9); padding: 15px; border-radius: 10px; margin-top: 10px;">
                    <strong>✅ 권장사항</strong><br>
                    <small>• 개인적 용도로만 사용 (저작권 준수)</small><br>
                    <small>• 정기적으로 임시파일 정리</small><br>
                    <small>• 음원 구매도 고려해보세요</small>
                </div>
            </div>
        `;
    }
}

// 카카오 공유
function shareKakao() {
    if (!Kakao.isInitialized()) {
        Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');
    }
    
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '유튜브 음악 다운로드 맞춤 가이드 결과',
            description: '나에게 딱 맞는 유튜브 음악 다운로드 방법을 찾았어요! 안전하고 쉬운 방법을 추천받아보세요.',
            imageUrl: window.location.origin + '/유튜브음악다운로드/유튜브음악다운로드.svg',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
        },
        social: {
            likeCount: 523,
            commentCount: 134,
            sharedCount: 892,
        },
        buttons: [
            {
                title: '나도 테스트하기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
        ],
    });
}

// 테스트 재시작
function restartTest() {
    if (resultPage) resultPage.classList.add('hidden');
    if (startPage) startPage.classList.remove('hidden');
    
    currentQuestionIndex = 0;
    userAnswers = [];
    
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) progressFill.style.width = '0%';
}

// 상세 가이드 모달 표시
function showDetailedGuide() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) {
        guideModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        const checkboxes = guideModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    this.parentElement.style.backgroundColor = '#e8f5e8';
                    this.parentElement.style.color = '#065f46';
                } else {
                    this.parentElement.style.backgroundColor = '';
                    this.parentElement.style.color = '';
                }
            });
        });
    }
}

// 상세 가이드 모달 닫기
function closeGuideModal() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) {
        guideModal.classList.add('hidden');
        document.body.style.overflow = '';
        
        const checkboxes = guideModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.parentElement.style.backgroundColor = '';
            checkbox.parentElement.style.color = '';
        });
    }
}

// 키보드 이벤트
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const guideModal = document.getElementById('guideModal');
        const analysisModal = document.getElementById('analysisModal');
        
        if (guideModal && !guideModal.classList.contains('hidden')) {
            closeGuideModal();
        } else if (analysisModal && !analysisModal.classList.contains('hidden')) {
            analysisModal.classList.add('hidden');
            if (questionPage) questionPage.classList.remove('hidden');
        }
    }
    
    if (questionPage && !questionPage.classList.contains('hidden')) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 6) {
            const options = document.querySelectorAll('.answer-option');
            if (options[num - 1]) {
                options[num - 1].click();
            }
        }
    }
});

// 모달 바깥 클릭 시 닫기
document.addEventListener('click', function(e) {
    const guideModal = document.getElementById('guideModal');
    if (guideModal && e.target === guideModal) {
        closeGuideModal();
    }
});

// 페이지 로드 시 초기화


// 화면 크기 변경 대응
window.addEventListener('resize', function() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// 초기 실행
window.addEventListener('load', function() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// 전역 함수로 노출
window.startTest = startTest;
window.restartTest = restartTest;
window.shareKakao = shareKakao;
window.showDetailedGuide = showDetailedGuide;
window.closeGuideModal = closeGuideModal;

// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
});