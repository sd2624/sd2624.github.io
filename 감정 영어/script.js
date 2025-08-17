// Kakao SDK initialization
function initKakao() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('3413c1beb87e9b2f3b7fce37dde67b4d');
        console.log('Kakao SDK initialized');
    }
}

// Emotion test global variables
let currentQuestion = 0;
let emotionScores = {};
let answers = []; // Answer storage array
let loadedAds = new Set(); // Prevent duplicate ad loading

// Ad management object - using IntersectionObserver
const adManager = {
    observer: null,
    
    // Initialize ad manager
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const adContainer = entry.target;
                    const adId = adContainer.id;
                    
                    // Prevent duplicate loading
                    if (!loadedAds.has(adId)) {
                        this.loadAd(adId);
                        loadedAds.add(adId);
                        this.observer.unobserve(adContainer); // Load only once
                    }
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px' 
        });
    },
    
    // Start observing ad container
    observe(adId) {
        const adElement = document.getElementById(adId);
        if (adElement && this.observer) {
            this.observer.observe(adElement);
        }
    },
    
    // Execute ad loading (optimized for small size)
    loadAd(adId) {
        try {
            const adElement = document.getElementById(adId);
            if (adElement && typeof (adsbygoogle) !== 'undefined') {
                // Mobile/PC ad optimization (small size)
                if (window.innerWidth <= 768) {
                    // Mobile: very small
                    adElement.style.minHeight = '60px';
                    adElement.style.maxHeight = '80px';
                    adElement.style.border = '1px solid rgba(102, 126, 234, 0.2)';
                    adElement.style.borderRadius = '6px';
                    adElement.style.padding = '5px';
                    adElement.style.margin = '5px 0';
                } else {
                    // PC: slightly larger
                    adElement.style.minHeight = '80px';
                    adElement.style.maxHeight = '120px';
                    adElement.style.padding = '8px';
                    adElement.style.margin = '8px 0';
                }
                
                (adsbygoogle = window.adsbygoogle || []).push({});
                console.log(`Ad loaded (optimized): ${adId}`);
            }
        } catch (error) {
            console.error(`Ad loading failed: ${adId}`, error);
        }
    },
    
    // Show middle ad (after 3rd question) - small size
    showMidAd() {
        const midAd = document.getElementById('adMid');
        if (midAd) {
            midAd.style.display = 'block';
            // Minimize space between question and answer
            midAd.style.margin = '6px 0';
            if (window.innerWidth <= 768) {
                midAd.style.maxHeight = '70px';
            }
            this.observe('adMid');
        }
    }
};

// 20 questions data
const questions = [
    {
        text: "When you wake up in the morning, what's your first feeling?",
        answers: [
            { text: "Fresh and energetic", emotion: "joy", score: 3 },
            { text: "Normal and calm", emotion: "peace", score: 2 },
            { text: "Tired and heavy", emotion: "sadness", score: 3 },
            { text: "Worried or anxious", emotion: "anxiety", score: 3 }
        ]
    },
    {
        text: "When you have a conflict with a friend, how do you react?",
        answers: [
            { text: "Get angry and express emotions", emotion: "anger", score: 3 },
            { text: "Feel hurt and start crying", emotion: "sadness", score: 3 },
            { text: "Try to solve it calmly through conversation", emotion: "peace", score: 3 },
            { text: "Worry if it's my fault", emotion: "anxiety", score: 2 }
        ]
    },
    {
        text: "Facing a new challenge, how do you feel?",
        answers: [
            { text: "Excited and looking forward", emotion: "joy", score: 2 },
            { text: "Feel curious and interested", emotion: "interest", score: 3 },
            { text: "Afraid of failure", emotion: "anxiety", score: 3 },
            { text: "Want to prepare carefully", emotion: "peace", score: 2 }
        ]
    },
    {
        text: "When you think about someone you like, what emotion comes up?",
        answers: [
            { text: "Warm and happy feelings", emotion: "love", score: 3 },
            { text: "Exciting and joyful mood", emotion: "joy", score: 3 },
            { text: "Jealousy comparing to others", emotion: "jealousy", score: 3 },
            { text: "Worry about getting hurt", emotion: "anxiety", score: 2 }
        ]
    },
    {
        text: "When you experience failure or setback, you?",
        answers: [
            { text: "Feel frustrated and angry", emotion: "anger", score: 3 },
            { text: "Fall into deep sadness", emotion: "sadness", score: 3 },
            { text: "Find courage to try again", emotion: "joy", score: 2 },
            { text: "Quietly compose yourself", emotion: "peace", score: 3 }
        ]
    },
    {
        text: "When you spend time alone, how do you feel?",
        answers: [
            { text: "Comfortable and free", emotion: "peace", score: 3 },
            { text: "Lonely and melancholy", emotion: "sadness", score: 3 },
            { text: "Want to try something new", emotion: "interest", score: 2 },
            { text: "Miss someone", emotion: "love", score: 2 }
        ]
    },
    {
        text: "When something unexpectedly good happens?",
        answers: [
            { text: "Get excited and happy, want to shout", emotion: "joy", score: 3 },
            { text: "Can't believe it, feel confused", emotion: "anxiety", score: 2 },
            { text: "Feel happy calmly", emotion: "peace", score: 2 },
            { text: "Want to learn more about it", emotion: "interest", score: 3 }
        ]
    },
    {
        text: "When you hear news of someone else's success?",
        answers: [
            { text: "Sincerely congratulate and feel happy", emotion: "joy", score: 2 },
            { text: "Feel envious and jealous", emotion: "jealousy", score: 3 },
            { text: "Think I should work harder too", emotion: "interest", score: 2 },
            { text: "Feel depressed wondering why not me", emotion: "sadness", score: 3 }
        ]
    },
    {
        text: "How do you cope when you're stressed?",
        answers: [
            { text: "Get angry or irritated", emotion: "anger", score: 3 },
            { text: "Stay alone in a quiet place", emotion: "peace", score: 3 },
            { text: "Talk to someone about it", emotion: "love", score: 2 },
            { text: "Keep worrying and can't sleep", emotion: "anxiety", score: 3 }
        ]
    },
    {
        text: "When you think about the future, how do you feel?",
        answers: [
            { text: "Hopeful and excited", emotion: "joy", score: 3 },
            { text: "Worried and anxious", emotion: "anxiety", score: 3 },
            { text: "Taking it step by step", emotion: "peace", score: 3 },
            { text: "Curious about what will happen", emotion: "interest", score: 2 }
        ]
    },
    {
        text: "When you have to say goodbye to someone you love?",
        answers: [
            { text: "Fall into deep sadness and longing", emotion: "sadness", score: 3 },
            { text: "Feel angry and furious", emotion: "anger", score: 3 },
            { text: "Cherish it as good memories", emotion: "love", score: 3 },
            { text: "Think of it as a new beginning", emotion: "joy", score: 2 }
        ]
    },
    {
        text: "When sudden changes occur?",
        answers: [
            { text: "Find it interesting and fun", emotion: "interest", score: 3 },
            { text: "Feel anxious and scared", emotion: "anxiety", score: 3 },
            { text: "Try to adapt", emotion: "peace", score: 2 },
            { text: "Miss the old days", emotion: "sadness", score: 2 }
        ]
    },
    {
        text: "When you receive attention from others?",
        answers: [
            { text: "Feel happy and confident", emotion: "joy", score: 3 },
            { text: "Feel burdened and want to avoid", emotion: "anxiety", score: 2 },
            { text: "Accept it naturally", emotion: "peace", score: 2 },
            { text: "Want to know more", emotion: "interest", score: 2 }
        ]
    },
    {
        text: "When you think about your dreams or goals?",
        answers: [
            { text: "Feel excited and expectant", emotion: "joy", score: 3 },
            { text: "Worry if you can achieve them", emotion: "anxiety", score: 3 },
            { text: "Make step-by-step plans", emotion: "peace", score: 2 },
            { text: "Want to try many things", emotion: "interest", score: 3 }
        ]
    },
    {
        text: "When you remember past mistakes?",
        answers: [
            { text: "Fall into regret and self-blame", emotion: "sadness", score: 3 },
            { text: "Feel angry and frustrated", emotion: "anger", score: 2 },
            { text: "Accept it as a lesson", emotion: "peace", score: 3 },
            { text: "Promise not to do it again", emotion: "anxiety", score: 2 }
        ]
    },
    {
        text: "When you spend time with family or friends?",
        answers: [
            { text: "Feel warm and happy", emotion: "love", score: 3 },
            { text: "Feel comfortable and natural", emotion: "peace", score: 3 },
            { text: "Feel fun and enjoyable", emotion: "joy", score: 3 },
            { text: "Sometimes want to be alone", emotion: "sadness", score: 2 }
        ]
    },
    {
        text: "When you meet new people, what's your first feeling?",
        answers: [
            { text: "Feel excited and expectant", emotion: "joy", score: 2 },
            { text: "Feel curious", emotion: "interest", score: 3 },
            { text: "Feel nervous and anxious", emotion: "anxiety", score: 3 },
            { text: "Approach carefully", emotion: "peace", score: 2 }
        ]
    },
    {
        text: "When you think about your appearance or abilities?",
        answers: [
            { text: "Feel satisfied and confident", emotion: "joy", score: 3 },
            { text: "Worry about shortcomings", emotion: "anxiety", score: 3 },
            { text: "Feel jealous comparing to others", emotion: "jealousy", score: 3 },
            { text: "Accept as they are", emotion: "peace", score: 3 }
        ]
    },
    {
        text: "When you look out the window on a nice day?",
        answers: [
            { text: "Feel good and energetic", emotion: "joy", score: 3 },
            { text: "Feel peaceful and quiet", emotion: "peace", score: 3 },
            { text: "Want to go outside", emotion: "interest", score: 2 },
            { text: "Want to be with someone", emotion: "love", score: 2 }
        ]
    },
];

// Detailed emotion analysis data
const emotionAnalysis = {
    'joy': {
        title: 'Happy Optimist',
        subtitle: 'Owner of positive energy',
        description: 'You have an excellent ability to see the bright side of life and have a positive influence on people around you.',
        badge: '😊',
        color: '#FFD700',
        tips: ['Write emotion diary', 'Express gratitude', 'Release energy through exercise'],
        advice: 'Maintain a positive mindset, but sometimes you need a realistic perspective too.'
    },
    'sadness': {
        title: 'Deep Emotion Explorer',
        subtitle: 'Sensitive with excellent empathy',
        description: 'You understand the depth of emotions and are a sensitive owner of emotions who understands others\' hearts well.',
        badge: '😔',
        color: '#4682B4',
        tips: ['Meditation and rest', 'Listen to favorite music', 'Talk with trusted people'],
        advice: 'Sadness is also a precious emotion. Feel it fully but don\'t stay too long.'
    },
    'anger': {
        title: 'Passionate Reformer',
        subtitle: 'Owner of strong will with sense of justice',
        description: 'You have strong willpower to bring about change through anger at what is not right.',
        badge: '😤',
        color: '#DC143C',
        tips: ['Deep breathing and calming', 'Stress relief through exercise', 'Find constructive expression methods'],
        advice: 'Anger can be a driving force for change. Try to use it constructively.'
    },
    'anxiety': {
        title: 'Prudent Planner',
        subtitle: 'Wise person who detects risks in advance',
        description: 'You have excellent predictive ability to prepare for the future and detect risks in advance.',
        badge: '😰',
        color: '#9370DB',
        tips: ['Regular life patterns', 'Gradual challenges', 'Activities that provide stability'],
        advice: 'Anxiety is a signal that protects you. Try to manage it at an appropriate level.'
    },
    'peace': {
        title: 'Wise Mediator',
        subtitle: 'Stable person with excellent sense of balance',
        description: 'You are a stable mind owner who doesn\'t lose center in any situation.',
        badge: '😌',
        color: '#20B2AA',
        tips: ['Meditation and yoga', 'Communion with nature', 'Steady self-development'],
        advice: 'Your peace has a good influence on your surroundings. Try to develop it further.'
    },
    'interest': {
        title: 'Curious Explorer',
        subtitle: 'Adventurer seeking new things',
        description: 'You are a person who explores the world with endless curiosity and finds new possibilities.',
        badge: '🤔',
        color: '#FF6347',
        tips: ['Start new hobbies', 'Reading and learning', 'Accumulate various experiences'],
        advice: 'Continuous learning based on curiosity is your strength.'
    },
    'love': {
        title: 'Warm-hearted Healer',
        subtitle: 'One who embraces the world with deep affection',
        description: 'You are an existence that comforts people around you with deep love and understanding for others.',
        badge: '❤️',
        color: '#FF1493',
        tips: ['Spend time with loved ones', 'Participate in volunteer work', 'Express emotions'],
        advice: 'Love grows as you share it. Share your warmth more.'
    },
    'jealousy': {
        title: 'Competitive Achiever',
        subtitle: 'Goal-oriented with strong desire for development',
        description: 'You have strong motivation to become a better person through comparison with others.',
        badge: '😒',
        color: '#228B22',
        tips: ['Set your own goals', 'Focus on personal achievements', 'Look back on things to be grateful for'],
        advice: 'Try to use jealousy constructively as a driving force for development.'
    }
};

// Emotion list
const emotions = ['joy', 'sadness', 'anger', 'anxiety', 'peace', 'interest', 'love', 'jealousy'];

// Page initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize ad manager
    adManager.init();
    
    // Start observing top ad
    adManager.observe('adTop');
    
    // Initialize emotion scores
    emotions.forEach(emotion => {
        emotionScores[emotion] = 0;
    });
    
    // Update statistics
    updateStats();
    
    // Update urgency message
    updateUrgencyMessage();
});

// Test start function
function startTest() {
    console.log('startTest function executed');
    
    const startPage = document.getElementById('startPage');
    const questionPage = document.getElementById('questionPage');
    
    if (!startPage || !questionPage) {
        console.error('Cannot find required page elements');
        return;
    }
    
    startPage.classList.add('hidden');
    questionPage.classList.remove('hidden');
    showQuestion();
}

// Question display function
function showQuestion() {
    const question = questions[currentQuestion];
    
    // Update question text
    document.querySelector('.question-text').textContent = question.text;
    document.querySelector('.question-counter').textContent = `${currentQuestion + 1} / ${questions.length}`;
    
    // Update progress bar
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.querySelector('.progress-fill').style.width = `${progress}%`;
    
    // Create answer options
    const answersGrid = document.querySelector('.answers-grid');
    answersGrid.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const answerBtn = document.createElement('button');
        answerBtn.className = 'answer-btn';
        answerBtn.innerHTML = `
            <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
            <span class="answer-text">${answer.text}</span>
        `;
        answerBtn.onclick = () => selectAnswer(answer);
        answersGrid.appendChild(answerBtn);
    });
    
    // Show middle ad after 3rd question
    if (currentQuestion === 3) {
        adManager.showMidAd();
    }
}

// Answer selection function
function selectAnswer(answer) {
    // Save selected answer (safe initialization)
    if (!emotionScores[answer.emotion]) {
        emotionScores[answer.emotion] = 0;
    }
    emotionScores[answer.emotion] += answer.score;
    
    // Answer button animation
    event.target.classList.add('selected');
    
    setTimeout(() => {
        currentQuestion++;
        
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showLoading();
        }
    }, 500);
}

// Loading screen display
function showLoading() {
    document.getElementById('questionPage').classList.add('hidden');
    document.getElementById('loadingPage').classList.remove('hidden');
    
    // Loading animation
    let currentStep = 0;
    const steps = document.querySelectorAll('.loading-steps .step');
    const progressBar = document.querySelector('.loading-progress');
    
    const loadingInterval = setInterval(() => {
        if (currentStep < steps.length) {
            steps.forEach(step => step.classList.remove('active'));
            steps[currentStep].classList.add('active');
            
            const progress = ((currentStep + 1) / steps.length) * 100;
            progressBar.style.width = `${progress}%`;
            
            currentStep++;
        } else {
            clearInterval(loadingInterval);
            showResult();
        }
    }, 800);
}

// Result display function
function showResult() {
    document.getElementById('loadingPage').classList.add('hidden');
    document.getElementById('resultPage').classList.remove('hidden');
    
    // Find emotion with highest score
    const maxEmotion = Object.keys(emotionScores).reduce((a, b) => 
        emotionScores[a] > emotionScores[b] ? a : b
    );
    
    const analysis = emotionAnalysis[maxEmotion];
    
    // Update result information
    document.getElementById('resultBadge').textContent = analysis.badge;
    document.getElementById('resultTitle').textContent = analysis.title;
    document.getElementById('resultSubtitle').textContent = analysis.subtitle;
    
    // Update detailed analysis
    document.getElementById('primaryEmotion').innerHTML = `
        <div class="emotion-name">${maxEmotion}</div>
        <div class="emotion-percentage">${Math.round((emotionScores[maxEmotion] / getTotalScore()) * 100)}%</div>
    `;
    
    // Hidden emotion (second highest score)
    const sortedEmotions = Object.keys(emotionScores).sort((a, b) => emotionScores[b] - emotionScores[a]);
    const secondEmotion = sortedEmotions[1];
    document.getElementById('hiddenEmotion').innerHTML = `
        <div class="emotion-name">${secondEmotion}</div>
        <div class="emotion-percentage">${Math.round((emotionScores[secondEmotion] / getTotalScore()) * 100)}%</div>
    `;
    
    // Update advice content
    document.getElementById('adviceContent').textContent = analysis.advice;
    
    // Update improvement tips
    const tipsGrid = document.getElementById('tipsGrid');
    tipsGrid.innerHTML = '';
    analysis.tips.forEach(tip => {
        const tipElement = document.createElement('div');
        tipElement.className = 'tip-item';
        tipElement.textContent = tip;
        tipsGrid.appendChild(tipElement);
    });
    
    // Draw emotion chart
    drawEmotionChart();
    
    // Start observing result ad
    adManager.observe('adResult');
}

// Emotion chart drawing function
function drawEmotionChart() {
    const chartContainer = document.getElementById('emotionChart');
    
    // Prepare chart data
    const chartData = emotions.map(emotion => ({
        name: emotion,
        value: emotionScores[emotion],
        percentage: Math.round((emotionScores[emotion] / getTotalScore()) * 100)
    })).sort((a, b) => b.value - a.value);
    
    // Generate chart HTML
    chartContainer.innerHTML = `
        <div class="chart-legend">
            ${chartData.map(item => `
                <div class="legend-item">
                    <div class="legend-color" style="background: ${getEmotionColor(item.name)}"></div>
                    <span class="legend-name">${item.name}</span>
                    <span class="legend-percentage">${item.percentage}%</span>
                </div>
            `).join('')}
        </div>
        <div class="chart-visual">
            ${chartData.map(item => `
                <div class="chart-bar">
                    <div class="bar-fill" style="width: ${item.percentage}%; background: ${getEmotionColor(item.name)}"></div>
                    <span class="bar-label">${item.name} ${item.percentage}%</span>
                </div>
            `).join('')}
        </div>
    `;
}

// Return color by emotion
function getEmotionColor(emotion) {
    const colors = {
        'joy': '#FFD700',
        'sadness': '#4682B4',
        'anger': '#DC143C',
        'anxiety': '#9370DB',
        'peace': '#20B2AA',
        'interest': '#FF6347',
        'love': '#FF1493',
        'jealousy': '#228B22'
    };
    return colors[emotion] || '#666';
}

// Calculate total score
function getTotalScore() {
    return Object.values(emotionScores).reduce((sum, score) => sum + score, 0);
}

// KakaoTalk sharing function
function shareToKakao() {
    const maxEmotion = Object.keys(emotionScores).reduce((a, b) => 
        emotionScores[a] > emotionScores[b] ? a : b
    );
    const analysis = emotionAnalysis[maxEmotion];
    
    window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: '🧠 My Emotional Analysis Result',
            description: `${analysis.title} - ${analysis.subtitle}\n\n"${analysis.description}"\n\nTake the test yourself!`,
            imageUrl: 'https://sd2624.github.io/감정 영어/emotion-test-thumbnail.jpg',
            link: {
                mobileWebUrl: 'https://sd2624.github.io/감정 영어/',
                webUrl: 'https://sd2624.github.io/감정 영어/',
            },
        },
        buttons: [
            {
                title: 'Take Test',
                link: {
                    mobileWebUrl: 'https://sd2624.github.io/감정 영어/',
                    webUrl: 'https://sd2624.github.io/감정 영어/',
                },
            }
        ]
    });
}

// Retry test function
function retryTest() {
    // Initialize variables
    currentQuestion = 0;
    loadedAds.clear();
    emotions.forEach(emotion => {
        emotionScores[emotion] = 0;
    });
    
    // Page transition
    document.getElementById('resultPage').classList.add('hidden');
    document.getElementById('startPage').classList.remove('hidden');
    
    // Initialize ad state
    const midAd = document.getElementById('adMid');
    if (midAd) {
        midAd.style.display = 'none';
    }
    
    // Update statistics
    updateStats();
}

// URL share function
function shareUrl() {
    const url = window.location.href;
    
    if (navigator.clipboard && window.isSecureContext) {
        // Use Clipboard API
        navigator.clipboard.writeText(url).then(function() {
            console.log('URL copied to clipboard successfully');
            showToast('URL copied successfully!');
        }, function(err) {
            console.error('Failed to copy URL: ', err);
            fallbackCopyTextToClipboard(url);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(url);
    }
}

// Fallback function for copying text
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'URL copied successfully!' : 'Failed to copy URL';
        console.log(msg);
        showToast(msg);
    } catch (err) {
        console.error('Failed to copy URL: ', err);
        showToast('Copy failed. Please copy manually: ' + text);
    }
    
    document.body.removeChild(textArea);
}

// Toast message display function
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Toast styles
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 10000;
        animation: fadeInOut 3s ease-in-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    // Add animation CSS if not exists
    if (!document.querySelector('#toast-animation-style')) {
        const style = document.createElement('style');
        style.id = 'toast-animation-style';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
                15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Statistics update function
function updateStats() {
    // Generate random statistics (use actual data in real service)
    const totalTests = Math.floor(Math.random() * 10000) + 50000;
    const todayTests = Math.floor(Math.random() * 500) + 1200;
    
    const totalElement = document.getElementById('totalTests');
    const todayElement = document.getElementById('todayTests');
    
    if (totalElement) totalElement.textContent = totalTests.toLocaleString();
    if (todayElement) todayElement.textContent = todayTests.toLocaleString();
}

// Update urgency message
function updateUrgencyMessage() {
    const messages = [
        "⏰ Don't miss your emotions at this moment!",
        "🔥 Check your emotional change patterns today!",
        "💡 Last chance to discover your hidden emotions!",
        "🎯 Prepare for a better tomorrow with accurate emotional analysis!"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const urgencyElement = document.querySelector('.urgency-notice .notice-content');
    if (urgencyElement) {
        urgencyElement.textContent = randomMessage;
    }
}

// DOM load completion initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM load completed');
    
    // Initialize Kakao SDK
    initKakao();
    
    // Expose global functions (for use in onclick)
    window.startTest = startTest;
    window.shareToKakao = shareToKakao;
    window.retryTest = retryTest;
    window.shareUrl = shareUrl;
    
    // Add event listener to start button (backup)
    const startBtn = document.querySelector('.start-btn');
    const startBtnById = document.getElementById('startTestBtn');
    
    if (startBtn || startBtnById) {
        const button = startBtn || startBtnById;
        console.log('Start button found, adding event listener');
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Start button clicked');
            startTest();
        });
    } else {
        console.error('Cannot find start button');
    }
    
    // Initialize ad manager
    if (typeof adManager !== 'undefined') {
        adManager.init();
        adManager.observe('adTop');
    }
    
    console.log('Emotion test initialization completed');
});
