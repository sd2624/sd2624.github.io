// Initialize Kakao SDK
Kakao.init('1a44c2004824d4e16e69f1fc7e81d82c');

// List of questions
const questions = [
    "Have you felt good over the past week?",
    "Do you feel highly stressed?",
    "Are you getting enough rest?",
    "Are your relationships with others harmonious?",
    "Can you concentrate well on work or studies?",
    "Do you think positively about the future?",
    "Are you satisfied with yourself?",
    "Are you living a regular and structured life?",
    "Are you enjoying hobbies?",
    "Do you feel generally happy?"
];

// Result types
const results = [
    {
        title: "Very Stable Emotional State",
        description: "You are emotionally stable and effectively managing stress. You maintain a positive attitude in life and demonstrate a healthy approach to relationships and self-care. Adequate rest and regular routines contribute significantly to sustaining your current state. To maintain this balance, continue engaging in activities and routines that suit you. Strengthening your current strategies will help you cope flexibly with unexpected stress.",
        icon: "😊"
    },
    {
        title: "Mild Stress",
        description: "You feel some everyday stress but manage it well overall. Fatigue may result from excessive work or responsibilities, but taking appropriate breaks and applying stress-relief methods should prevent it from becoming a major issue. Try simple activities like walking, listening to music, or meditating to relieve stress. Regular self-checks and seeking help when needed are also important. These small changes can have a positive long-term impact.",
        icon: "🙂"
    },
    {
        title: "Attention Needed",
        description: "You are currently under accumulated stress, which could affect your physical and mental health if unresolved. Proactive steps are needed to relieve pressure from excessive work or interpersonal challenges. Take sufficient rest and engage in activities that bring you positive energy. Identify the root causes of your stress and plan for improvements. Seeking help from a mental health professional could also be beneficial for managing stress and regaining a healthy mindset.",
        icon: "😔"
    }
];

// Global variables
let currentQuestion = 0;
let totalScore = 0;

// Execute after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize event listeners
    document.getElementById('start-btn').addEventListener('click', startTest);
    document.getElementById('retry-btn').addEventListener('click', resetTest);
    document.getElementById('kakao-share-btn').addEventListener('click', shareToKakao);
});

// Start the test
function startTest() {
    document.getElementById('start-section').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    showQuestion();
}

// Display the question
function showQuestion() {
    document.getElementById('question-text').textContent = questions[currentQuestion];
    updateProgressBar();
    setupAnswerButtons();
}

// Update the progress bar
function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;
}

// Set up answer buttons
function setupAnswerButtons() {
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach(button => {
        button.removeEventListener('click', handleAnswer);
        button.addEventListener('click', handleAnswer);
    });
}

// Handle the answer
function handleAnswer(e) {
    const score = parseInt(e.target.dataset.score);
    totalScore += score;
    
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showAdPopup();
    }
}

// Show ad popup
function showAdPopup() {
    const popup = document.getElementById('ad-popup');
    popup.style.display = 'block';
    
    let countdown = 7;
    const countdownElement = document.querySelector('.countdown');
    
    const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            popup.style.display = 'none';
            showResult();
        }
    }, 1000);
    
    // Display Google ad
    (adsbygoogle = window.adsbygoogle || []).push({});
}

// Display the result
function showResult() {
    document.getElementById('question-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
    
    const averageScore = totalScore / questions.length;
    let resultIndex;
    
    if (averageScore >= 4) {
        resultIndex = 0; // Very stable
    } else if (averageScore >= 3) {
        resultIndex = 1; // Mild stress
    } else {
        resultIndex = 2; // Attention needed
    }
    
    const result = results[resultIndex];
    document.getElementById('result-title').textContent = result.title;
    document.getElementById('result-description').textContent = result.description;
    document.querySelector('.result-icon').textContent = result.icon;
}

// Reset the test
function resetTest() {
    currentQuestion = 0;
    totalScore = 0;
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('start-section').style.display = 'block';
}

// Share to KakaoTalk
function shareToKakao() {
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: 'My Emotional State Test',
            description: 'How is your current emotional state? Take the test!',
            imageUrl: 'https://example.com/your-image.jpg', // Replace with the actual image URL
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href
            }
        },
        buttons: [
            {
                title: 'Take the Test',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href
                }
            }
        ]
    });
}
