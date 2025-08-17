// Kakao SDK initialization
function initKakao() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('3413c1beb87e9b2f3b7fce37dde67b4d');
        console.log('Kakao SDK initialized');
    }
}

// Stress test global variables
let currentQuestion = 0;
let stressScores = {};
let answers = []; // Answer storage array
let loadedAds = new Set(); // Prevent duplicate ad loading

// Stress result data
const stressResults = {
    low: {
        emoji: "😌",
        title: "Low Stress Level",
        subtitle: "You are maintaining a healthy mental state",
        advice: "Your current stress level is low and stable. Focus on preventive management while maintaining this state.",
        tips: [
            "Maintain regular life patterns",
            "Balance proper exercise and rest",
            "Use leisure time for hobbies",
            "Continuously manage social relationships"
        ]
    },
    medium: {
        emoji: "😐",
        title: "Moderate Stress Level",
        subtitle: "You are experiencing everyday stress",
        advice: "A moderate level of stress is normal. Learn stress management techniques to cope more effectively.",
        tips: [
            "Practice deep breathing and meditation",
            "Learn time management skills",
            "Identify and manage stress factors",
            "Get adequate sleep and rest"
        ]
    },
    high: {
        emoji: "😰",
        title: "High Stress Level",
        subtitle: "Stress management is needed",
        advice: "You have a high stress level. Active stress management and lifestyle improvements are needed.",
        tips: [
            "Consider professional counseling",
            "Increase stress-relieving activities",
            "Control workload and set priorities",
            "Utilize support systems"
        ]
    },
    critical: {
        emoji: "😵",
        title: "Very High Stress Level",
        subtitle: "Immediate stress management is required",
        advice: "You have a very high stress level. Professional help is needed for systematic management.",
        tips: [
            "Seek professional consultation immediately",
            "Focus on rest and recovery",
            "Attempt to remove stress sources",
            "Establish continuous management plan"
        ]
    }
};

// Stress test question data
const stressQuestions = [
    {
        question: "How was your sleep quality in the past month?",
        answers: [
            { text: "Deep and comfortable sleep", score: 1 },
            { text: "Sometimes tossing but sleeping okay", score: 2 },
            { text: "Frequently waking up and feeling tired", score: 3 },
            { text: "Barely able to sleep and exhausted", score: 4 }
        ]
    },
    {
        question: "How often do you feel irritated or angry in daily life?",
        answers: [
            { text: "Rarely get angry", score: 1 },
            { text: "Sometimes get irritated", score: 2 },
            { text: "Often angry and irritated", score: 3 },
            { text: "Always sensitive and angry", score: 4 }
        ]
    },
    {
        question: "How much burden do you feel from work or studies?",
        answers: [
            { text: "Moderate and manageable", score: 1 },
            { text: "Sometimes burdensome but manageable", score: 2 },
            { text: "Often overwhelming and difficult", score: 3 },
            { text: "Too difficult to handle", score: 4 }
        ]
    },
    {
        question: "How often do you experience physical symptoms (headaches, indigestion, muscle tension)?",
        answers: [
            { text: "Rarely experience them", score: 1 },
            { text: "Sometimes mild symptoms", score: 2 },
            { text: "Frequently uncomfortable symptoms", score: 3 },
            { text: "Persistently severe symptoms", score: 4 }
        ]
    },
    {
        question: "How much stress do you feel in interpersonal relationships?",
        answers: [
            { text: "Harmonious and comfortable", score: 1 },
            { text: "Sometimes difficult but okay", score: 2 },
            { text: "Frequent conflicts or difficulties", score: 3 },
            { text: "Very difficult and want to avoid", score: 4 }
        ]
    },
    {
        question: "How much worry or anxiety do you have about the future?",
        answers: [
            { text: "Rarely worry", score: 1 },
            { text: "Sometimes anxious but bearable", score: 2 },
            { text: "Often worried and anxious", score: 3 },
            { text: "Extreme anxiety and worry", score: 4 }
        ]
    },
    {
        question: "What is your interest and motivation for daily activities?",
        answers: [
            { text: "Energetic and enjoyable as usual", score: 1 },
            { text: "Sometimes lose motivation but okay", score: 2 },
            { text: "Often lethargic and unmotivated", score: 3 },
            { text: "Don't want to do anything and feel listless", score: 4 }
        ]
    },
    {
        question: "How is your concentration and memory?",
        answers: [
            { text: "Good as usual", score: 1 },
            { text: "Sometimes difficult to concentrate", score: 2 },
            { text: "Frequent poor concentration and forgetfulness", score: 3 },
            { text: "Serious concentration and memory problems", score: 4 }
        ]
    },
    {
        question: "How has your appetite changed?",
        answers: [
            { text: "Regular as usual", score: 1 },
            { text: "Sometimes no appetite or overeating", score: 2 },
            { text: "Frequent loss of appetite or binge eating", score: 3 },
            { text: "Serious appetite changes causing concern", score: 4 }
        ]
    },
    {
        question: "How difficult is it to control your emotions?",
        answers: [
            { text: "Can control emotions well", score: 1 },
            { text: "Sometimes emotions get intense", score: 2 },
            { text: "Frequent severe mood swings", score: 3 },
            { text: "Very difficult to control emotions", score: 4 }
        ]
    },
    {
        question: "What is your willingness to participate in social activities?",
        answers: [
            { text: "Actively participate", score: 1 },
            { text: "Sometimes don't want to participate", score: 2 },
            { text: "Often want to avoid people", score: 3 },
            { text: "Avoid almost all gatherings", score: 4 }
        ]
    },
    {
        question: "Is it difficult to make decisions at work or in daily life?",
        answers: [
            { text: "Make decisions quickly as usual", score: 1 },
            { text: "Sometimes hesitate but make decisions", score: 2 },
            { text: "Often find it difficult to decide", score: 3 },
            { text: "Almost unable to make decisions", score: 4 }
        ]
    },
    {
        question: "What is your physical energy level?",
        answers: [
            { text: "Energetic as usual", score: 1 },
            { text: "Sometimes tired but bearable", score: 2 },
            { text: "Often lacking energy and tired", score: 3 },
            { text: "Almost always extremely tired", score: 4 }
        ]
    },
    {
        question: "How much financial worry or stress do you have?",
        answers: [
            { text: "Rarely worry", score: 1 },
            { text: "Sometimes burdensome but okay", score: 2 },
            { text: "Often feel financial stress", score: 3 },
            { text: "Extreme economic anxiety", score: 4 }
        ]
    },
    {
        question: "How much stress do you feel from perfectionist tendencies?",
        answers: [
            { text: "Can compromise moderately", score: 1 },
            { text: "Sometimes anxious when not perfect", score: 2 },
            { text: "Often stressed when not perfect", score: 3 },
            { text: "Unbearable when not perfect", score: 4 }
        ]
    },
    {
        question: "How often do you feel rushed for time?",
        answers: [
            { text: "Have plenty of time", score: 1 },
            { text: "Sometimes busy but manageable", score: 2 },
            { text: "Often rushed and hurried", score: 3 },
            { text: "Always short on time and urgent", score: 4 }
        ]
    },
    {
        question: "What is your confidence level?",
        answers: [
            { text: "Confident as usual", score: 1 },
            { text: "Sometimes lose confidence", score: 2 },
            { text: "Often feel lack of confidence", score: 3 },
            { text: "Extremely lacking confidence", score: 4 }
        ]
    },
    {
        question: "How much do you worry about your health?",
        answers: [
            { text: "Rarely worry about health", score: 1 },
            { text: "Sometimes worry about health", score: 2 },
            { text: "Often worry about health problems", score: 3 },
            { text: "Extreme anxiety about health", score: 4 }
        ]
    },
    {
        question: "How well do you adapt to changes or new situations?",
        answers: [
            { text: "Accept changes well", score: 1 },
            { text: "Sometimes difficult to adapt", score: 2 },
            { text: "Often find changes burdensome", score: 3 },
            { text: "Very afraid of changes", score: 4 }
        ]
    },
    {
        question: "What is your overall life satisfaction?",
        answers: [
            { text: "Generally satisfied", score: 1 },
            { text: "Sometimes dissatisfied but okay", score: 2 },
            { text: "Often dissatisfied and difficult", score: 3 },
            { text: "Very dissatisfied and hopeless", score: 4 }
        ]
    }
];

// Ad management object
const adManager = {
    observer: null,
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const adContainer = entry.target;
                    const adId = adContainer.id;
                    
                    if (!loadedAds.has(adId)) {
                        this.loadAd(adId);
                        loadedAds.add(adId);
                        this.observer.unobserve(adContainer);
                    }
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px' 
        });
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
                    adElement.style.maxHeight = '80px';
                    adElement.style.border = '1px solid rgba(102, 126, 234, 0.2)';
                    adElement.style.borderRadius = '6px';
                    adElement.style.padding = '5px';
                    adElement.style.margin = '5px 0';
                } else {
                    adElement.style.minHeight = '80px';
                    adElement.style.maxHeight = '120px';
                    adElement.style.padding = '8px';
                    adElement.style.margin = '8px 0';
                }
                
                (adsbygoogle = window.adsbygoogle || []).push({});
                console.log(`Ad loaded: ${adId}`);
            }
        } catch (error) {
            console.error(`Ad load failed: ${adId}`, error);
        }
    },
    
    showMidAd() {
        const midAd = document.getElementById('adMid');
        if (midAd) {
            midAd.style.display = 'block';
            midAd.style.margin = '6px 0';
            if (window.innerWidth <= 768) {
                midAd.style.maxHeight = '70px';
            }
            this.observe('adMid');
        }
    }
};

// DOM load completion initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Stress test initialization started');
    
    // Initialize Kakao SDK
    initKakao();
    
    // Initialize ad management
    adManager.init();
    
    // Initial ad observation
    adManager.observe('adTop');
    
    // Test start button event
    const startBtn = document.getElementById('startStressTest');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            console.log('Stress test started');
            startStressTest();
        });
    }
    
    // Retry button event
    const retryBtn = document.getElementById('retryBtn');
    if (retryBtn) {
        retryBtn.addEventListener('click', function() {
            console.log('Test retry');
            resetTest();
        });
    }
    
    // Kakao share button event
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            console.log('Kakao share button clicked');
            shareKakao();
        });
    }
});

// Test start function
function startStressTest() {
    console.log('Stress test start function executed');
    
    // Initialize
    currentQuestion = 0;
    stressScores = {};
    answers = [];
    
    // Section show/hide
    document.getElementById('startPage').style.display = 'none';
    document.getElementById('questionPage').style.display = 'block';
    document.getElementById('questionPage').classList.remove('hidden');
    document.getElementById('resultPage').style.display = 'none';
    
    showQuestion();
}

// Question display function
function showQuestion() {
    if (currentQuestion >= stressQuestions.length) {
        showLoadingPage();
        return;
    }
    
    const question = stressQuestions[currentQuestion];
    
    // Update progress
    const progress = ((currentQuestion) / stressQuestions.length) * 100;
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
    
    // Update question counter
    const questionCounter = document.querySelector('.question-counter');
    if (questionCounter) {
        questionCounter.textContent = `${currentQuestion + 1} / ${stressQuestions.length}`;
    }
    
    // Update question text
    const questionText = document.querySelector('.question-text');
    if (questionText) {
        questionText.textContent = question.question;
    }
    
    // Create answer buttons
    const answersGrid = document.querySelector('.answers-grid');
    if (answersGrid) {
        const answersHTML = question.answers.map((answer, index) => `
            <button class="answer-btn" onclick="selectAnswer(${index})" data-score="${answer.score}">
                ${answer.text}
            </button>
        `).join('');
        
        answersGrid.innerHTML = answersHTML;
    }
    
    // Show mid ad (after 4th question)
    if (currentQuestion === 3) {
        adManager.showMidAd();
    }
}

// Answer selection function
function selectAnswer(answerIndex) {
    const question = stressQuestions[currentQuestion];
    const selectedAnswer = question.answers[answerIndex];
    
    // Save answer
    answers.push({
        question: question.question,
        answer: selectedAnswer.text,
        score: selectedAnswer.score
    });
    
    // Accumulate stress score
    if (!stressScores.total) stressScores.total = 0;
    stressScores.total += selectedAnswer.score;
    
    console.log(`Question ${currentQuestion + 1} answer: ${selectedAnswer.text} (score: ${selectedAnswer.score})`);
    
    currentQuestion++;
    
    // Move to next question
    setTimeout(() => {
        showQuestion();
    }, 300);
}

// Loading page display function
function showLoadingPage() {
    console.log('Loading page display');
    
    // Section transition
    document.getElementById('questionPage').style.display = 'none';
    document.getElementById('loadingPage').style.display = 'block';
    document.getElementById('loadingPage').classList.remove('hidden');
    
    // Loading step progression
    setTimeout(() => {
        showLoadingStep(1);
    }, 500);
    
    setTimeout(() => {
        showLoadingStep(2);
    }, 1500);
    
    setTimeout(() => {
        showLoadingStep(3);
    }, 2500);
    
    // Show results after 3 seconds
    setTimeout(() => {
        showResults();
    }, 3500);
}

// Loading step display function
function showLoadingStep(stepNumber) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index < stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Result analysis function
function analyzeResults() {
    const totalScore = stressScores.total || 0;
    const maxScore = stressQuestions.length * 4;
    const percentage = (totalScore / maxScore) * 100;
    
    let resultType;
    if (percentage <= 25) {
        resultType = stressResults.low;
    } else if (percentage <= 50) {
        resultType = stressResults.medium;
    } else if (percentage <= 75) {
        resultType = stressResults.high;
    } else {
        resultType = stressResults.critical;
    }
    
    return {
        ...resultType,
        score: totalScore,
        percentage: percentage.toFixed(1)
    };
}

// Result display function
function showResults() {
    console.log('Result display function executed');
    
    // Section transition
    document.getElementById('questionPage').style.display = 'none';
    document.getElementById('loadingPage').style.display = 'none';
    document.getElementById('resultPage').style.display = 'block';
    document.getElementById('resultPage').classList.remove('hidden');
    
    // Analyze results
    const result = analyzeResults();
    
    // Render results
    renderResults(result);
    
    // Update statistics
    updateStats(result.title);
    
    // Show result ad
    adManager.observe('adResult');
}

// Result rendering function
function renderResults(result) {
    // Update result badge
    const resultBadge = document.getElementById('resultBadge');
    if (resultBadge) {
        resultBadge.textContent = result.emoji;
    }
    
    // Update result title
    const resultTitle = document.getElementById('resultTitle');
    if (resultTitle) {
        resultTitle.textContent = result.title;
    }
    
    // Update result subtitle
    const resultSubtitle = document.getElementById('resultSubtitle');
    if (resultSubtitle) {
        resultSubtitle.textContent = result.subtitle;
    }
    
    // Update score display
    const resultScore = document.getElementById('resultScore');
    if (resultScore) {
        resultScore.textContent = `Total Score: ${result.score} points (${result.percentage}%)`;
    }
    
    // Update advice content
    const adviceContent = document.getElementById('adviceContent');
    if (adviceContent) {
        adviceContent.textContent = result.advice;
    }
    
    // Update tips content
    const tipsContent = document.getElementById('tipsContent');
    if (tipsContent) {
        const tipsHTML = result.tips.map(tip => `<li>${tip}</li>`).join('');
        tipsContent.innerHTML = tipsHTML;
    }
}

// Statistics update function
function updateStats(resultTitle) {
    let stats = JSON.parse(localStorage.getItem('stressTestStats') || '{}');
    
    if (!stats[resultTitle]) {
        stats[resultTitle] = 0;
    }
    stats[resultTitle]++;
    
    const totalUsers = Object.values(stats).reduce((sum, count) => sum + count, 0);
    
    localStorage.setItem('stressTestStats', JSON.stringify(stats));
    
    // Display statistics
    const statsContainer = document.getElementById('statsContainer');
    if (statsContainer) {
        let statsHTML = `<h3>Participation Statistics (Total ${totalUsers} people)</h3>`;
        
        Object.entries(stats).forEach(([type, count]) => {
            const percentage = ((count / totalUsers) * 100).toFixed(1);
            statsHTML += `
                <div class="stat-item">
                    <span class="stat-label">${type}</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="stat-value">${count} people (${percentage}%)</span>
                </div>
            `;
        });
        
        statsContainer.innerHTML = statsHTML;
    }
}

// Test restart function
function resetTest() {
    console.log('Test restart');
    
    // Initialize variables
    currentQuestion = 0;
    stressScores = {};
    answers = [];
    
    // Section transition
    document.getElementById('resultPage').style.display = 'none';
    document.getElementById('resultPage').classList.add('hidden');
    document.getElementById('loadingPage').style.display = 'none';
    document.getElementById('loadingPage').classList.add('hidden');
    document.getElementById('questionPage').style.display = 'none';
    document.getElementById('questionPage').classList.add('hidden');
    document.getElementById('startPage').style.display = 'block';
    
    // Initialize progress
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
}

// Kakao share function
function shareKakao() {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
        alert('Kakao SDK is not loaded.');
        return;
    }
    
    const result = analyzeResults();
    
    window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: 'Stress Level Test Results',
            description: `My result: ${result.title}\n${result.subtitle}`,
            imageUrl: window.location.origin + '/share-image.png',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
        },
        buttons: [
            {
                title: 'Take Test Too',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            }
        ]
    });
}

// Test start function (called from HTML onclick)
function startTest() {
    startStressTest();
}

// Expose as global functions (for calling from HTML)
window.startStressTest = startStressTest;
window.startTest = startTest;
window.selectAnswer = selectAnswer;
window.resetTest = resetTest;
window.shareKakao = shareKakao;