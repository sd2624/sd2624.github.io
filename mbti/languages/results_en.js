// 영어 MBTI 결과 데이터
window.mbtiResults = {
    INTJ: {
        title: "The Architect",
        description: "Imaginative and strategic thinkers, with a plan for everything.",
        strengths: ["Independent", "Creative", "Decisive", "Perfectionist", "Strategic thinking"],
        weaknesses: ["Stubborn", "Critical", "Perfectionism stress", "Difficulty expressing emotions"],
        compatible: ["ENFP", "ENTP", "INFJ"],
        famous: "Elon Musk, Mark Zuckerberg, Nikola Tesla"
    },
    INTP: {
        title: "The Thinker",
        description: "Innovative inventors with an unquenchable thirst for knowledge.",
        strengths: ["Logical", "Objective", "Original", "Flexible thinking", "Intellectual curiosity"],
        weaknesses: ["Indecisive", "Indifferent", "Emotionally insensitive", "Rule ignoring", "Lack of practicality"],
        compatible: ["ENTJ", "ESTJ", "INFJ"],
        famous: "Albert Einstein, Bill Gates, Charles Darwin"
    },
    ENTJ: {
        title: "The Commander",
        description: "Bold, imaginative and strong-willed leaders, always finding a way or making one.",
        strengths: ["Leadership", "Efficiency", "Confidence", "Strategic", "Decisive"],
        weaknesses: ["Impatient", "Stubborn", "Emotionally insensitive", "Dominant", "Critical"],
        compatible: ["INFP", "INTP", "ENFJ"],
        famous: "Steve Jobs, Gordon Ramsay, Napoleon"
    },
    ENTP: {
        title: "The Debater",
        description: "Smart and curious thinkers who cannot resist an intellectual challenge.",
        strengths: ["Creative", "Enthusiastic", "Charismatic", "Intellectual", "Adaptable"],
        weaknesses: ["Lack of focus", "Stress sensitive", "Argumentative", "Lack of practicality", "Dislike routine"],
        compatible: ["INFJ", "INTJ", "ENFJ"],
        famous: "Thomas Edison, Leonardo da Vinci, Mark Twain"
    },
    INFJ: {
        title: "The Advocate",
        description: "Creative and insightful, inspired and independent perfectionists.",
        strengths: ["Empathy", "Intuitive", "Idealistic", "Harmony seeking", "Deep thinking"],
        weaknesses: ["Perfectionism", "Sensitivity", "Privacy protection", "Burnout", "Decision difficulty"],
        compatible: ["ENTP", "ENFP", "INTJ"],
        famous: "Mother Teresa, Martin Luther King Jr., Nelson Mandela"
    },
    INFP: {
        title: "The Mediator",
        description: "Poetic, kind and altruistic people, always eager to help a good cause.",
        strengths: ["Creative", "Idealistic", "Open-minded", "Passionate", "Dedicated"],
        weaknesses: ["Unrealistic", "Critical sensitivity", "Difficult decisions", "Self-criticism", "Need personal space"],
        compatible: ["ENFJ", "ENTJ", "ESFJ"],
        famous: "Shakespeare, Johnny Depp, Audrey Hepburn"
    },
    ENFJ: {
        title: "The Protagonist",
        description: "Charismatic and inspiring leaders, able to mesmerize their listeners.",
        strengths: ["Charismatic", "Altruistic", "Natural leader", "Reliable", "Tolerant"],
        weaknesses: ["Overly idealistic", "Overly sensitive", "Sensitive to change", "Self-sacrifice", "Decision difficulty"],
        compatible: ["INFP", "ISFP", "ENTP"],
        famous: "Oprah Winfrey, Barack Obama, Maya Angelou"
    },
    ENFP: {
        title: "The Campaigner",
        description: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.",
        strengths: ["Enthusiastic", "Creative", "Sociable", "Free spirit", "Friendly"],
        weaknesses: ["Lack of focus", "Stress vulnerable", "Overly emotional", "Independence issues", "Lack of practicality"],
        compatible: ["INFJ", "INTJ", "ENFJ"],
        famous: "Robin Williams, Ellen DeGeneres, Walt Disney"
    },
    ISTJ: {
        title: "The Logistician",
        description: "Practical and fact-minded, reliable and responsible.",
        strengths: ["Responsible", "Practical", "Hard-working", "Calm", "Loyal"],
        weaknesses: ["Stubborn", "Judgmental", "Self-critical", "Blame others", "Resistance to new things"],
        compatible: ["ESFP", "ESTP", "ISFJ"],
        famous: "George Washington, Warren Buffett, Queen Elizabeth II"
    },
    ISFJ: {
        title: "The Protector",
        description: "Warm-hearted and dedicated, always ready to protect their loved ones.",
        strengths: ["Supportive", "Reliable", "Patient", "Hard-working", "Enthusiastic"],
        weaknesses: ["Humble", "Overly altruistic", "Emotional suppression", "Overload", "Perfectionism"],
        compatible: ["ESFP", "ESTP", "ISTJ"],
        famous: "Mother Teresa, Rosa Parks, Kate Middleton"
    },
    ESTJ: {
        title: "The Executive",
        description: "Excellent administrators, unsurpassed at managing things or people.",
        strengths: ["Dedicated", "Strong-willed", "Direct", "Loyal", "Patient"],
        weaknesses: ["Inflexible", "Difficult relaxation", "Difficulty expressing emotions", "Status important", "Difficult innovation"],
        compatible: ["ISFP", "ISTP", "ESFJ"],
        famous: "Franklin D. Roosevelt, John D. Rockefeller, Emma Watson"
    },
    ESFJ: {
        title: "The Consul",
        description: "Extraordinarily caring, social and popular people, always eager to help.",
        strengths: ["Strong practical skills", "Strong sense of duty", "Very loyal", "Sensitive and warm", "Good collaborator"],
        weaknesses: ["Worry a lot", "Vulnerable to criticism", "Ignore personal needs", "Hard to refuse", "Overly altruistic"],
        compatible: ["ISFP", "ISTP", "ESTJ"],
        famous: "Taylor Swift, Hugh Jackman, Steve Harvey"
    },
    ISTP: {
        title: "The Virtuoso",
        description: "Bold and practical experimenters, masters of all kinds of tools.",
        strengths: ["Optimistic", "Energetic", "Creative", "Practical", "Spontaneous"],
        weaknesses: ["Stubborn", "Insensitive", "Private", "Easily bored", "Risky behavior"],
        compatible: ["ESFJ", "ESTJ", "ISFP"],
        famous: "Michael Jordan, Tom Cruise, Scarlett Johansson"
    },
    ISFP: {
        title: "The Adventurer",
        description: "Flexible and charming artists, always ready to explore new possibilities.",
        strengths: ["Charming", "Artistic", "Natural", "Curious", "Passionate"],
        weaknesses: ["Sensitive", "Independence", "Unpredictable", "Stress", "Avoid excessive competition"],
        compatible: ["ENFJ", "ESFJ", "ESTJ"],
        famous: "Michael Jackson, Prince, Bob Dylan"
    },
    ESTP: {
        title: "The Entrepreneur",
        description: "Smart, energetic and very perceptive people, who truly enjoy living on the edge.",
        strengths: ["Bold", "Rational", "Practical", "Original", "Perceptive"],
        weaknesses: ["Impatient", "Risk taking", "Lack of structure", "Lack of focus", "Sensitive"],
        compatible: ["ISFJ", "ISTJ", "ESFP"],
        famous: "Donald Trump, Ernest Hemingway, Madonna"
    },
    ESFP: {
        title: "The Entertainer",
        description: "Spontaneous, energetic and enthusiastic people - life is never boring around them.",
        strengths: ["Bold", "Practical", "Original", "Observant", "Excellent people skills"],
        weaknesses: ["Sensitive", "Conflict avoidance", "Lack of focus", "Stress", "Independence"],
        compatible: ["ISFJ", "ISTJ", "ESTP"],
        famous: "Will Smith, Marilyn Monroe, Elton John"
    }
};
