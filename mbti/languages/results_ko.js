// 한국어 MBTI 결과 데이터
window.mbtiResults = {
    INTJ: {
        title: "건축가",
        description: "상상력이 풍부하고 전략적인 사고를 하는 당신은 모든 일에 계획을 가지고 있습니다.",
        strengths: ["독립적", "창의적", "결단력 있음", "완벽주의", "전략적 사고"],
        weaknesses: ["고집이 셈", "비판적", "완벽주의로 인한 스트레스", "감정 표현 어려움"],
        compatible: ["ENFP", "ENTP", "INFJ"],
        famous: "일론 머스크, 마크 저커버그, 니콜라 테슬라"
    },
    INTP: {
        title: "논리술사",
        description: "혁신적인 발명가로, 지식에 대한 끝없는 갈증을 가지고 있습니다.",
        strengths: ["논리적", "객관적", "독창적", "유연한 사고", "지적 호기심"],
        weaknesses: ["우유부단", "무관심", "감정적 둔감", "규칙 무시", "실용성 부족"],
        compatible: ["ENTJ", "ESTJ", "INFJ"],
        famous: "알버트 아인슈타인, 빌 게이츠, 찰스 다윈"
    },
    ENTJ: {
        title: "통솔자",
        description: "대담하고 상상력이 풍부한 강력한 의지의 소유자로, 언제나 길을 찾거나 만들어갑니다.",
        strengths: ["리더십", "효율성", "자신감", "전략적", "결단력"],
        weaknesses: ["성급함", "고집", "감정적 둔감", "지배적", "비판적"],
        compatible: ["INFP", "INTP", "ENFJ"],
        famous: "스티브 잡스, 고든 램지, 나폴레옹"
    },
    ENTP: {
        title: "변론가",
        description: "똑똑하고 호기심이 많은 사색가로, 지적 도전을 거부할 수 없습니다.",
        strengths: ["창의적", "열정적", "카리스마", "지적", "적응력"],
        weaknesses: ["집중력 부족", "스트레스에 민감", "논쟁적", "실용성 부족", "루틴 싫어함"],
        compatible: ["INFJ", "INTJ", "ENFJ"],
        famous: "토마스 에디슨, 레오나르도 다빈치, 마크 트웨인"
    },
    INFJ: {
        title: "옹호자",
        description: "선의의 옹호자로, 언제나 대의를 위해 노력하는 이상주의자입니다.",
        strengths: ["공감 능력", "직관적", "이상주의", "조화 추구", "깊은 사고"],
        weaknesses: ["완벽주의", "민감함", "사생활 보호", "번아웃", "결정 어려움"],
        compatible: ["ENTP", "ENFP", "INTJ"],
        famous: "마더 테레사, 마틴 루터 킹, 넬슨 만델라"
    },
    INFP: {
        title: "중재자",
        description: "시적이고 친절한 이타주의자로, 언제나 선을 행할 준비가 되어 있습니다.",
        strengths: ["창의적", "이상주의", "개방적", "열정적", "헌신적"],
        weaknesses: ["비현실적", "비판에 민감", "어려운 결정", "자기비판", "개인적 공간 필요"],
        compatible: ["ENFJ", "ENTJ", "ESFJ"],
        famous: "셰익스피어, 조니 뎁, 오드리 헵번"
    },
    ENFJ: {
        title: "선도자",
        description: "카리스마 있고 영감을 주는 지도자로, 듣는 이들을 매혹시킵니다.",
        strengths: ["카리스마", "이타적", "자연스러운 리더", "신뢰할 만함", "관용"],
        weaknesses: ["지나친 이상주의", "지나친 민감함", "변동에 민감", "자기희생", "결정 어려움"],
        compatible: ["INFP", "ISFP", "ENTP"],
        famous: "오프라 윈프리, 버락 오바마, 마야 안젤루"
    },
    ENFP: {
        title: "활동가",
        description: "열정적이고 창의적인 사교적인 자유로운 영혼으로, 언제나 웃을 이유를 찾을 수 있습니다.",
        strengths: ["열정적", "창의적", "사교적", "자유로운 정신", "친근함"],
        weaknesses: ["집중력 부족", "스트레스에 취약", "지나친 감정적", "독립성 문제", "실용성 부족"],
        compatible: ["INFJ", "INTJ", "ENFJ"],
        famous: "로빈 윌리엄스, 엘렌 드제너러스, 월트 디즈니"
    },
    ISTJ: {
        title: "현실주의자",
        description: "실용적이고 현실에 발을 딛고 있는 신뢰할 수 있는 사람입니다.",
        strengths: ["책임감", "실용적", "근면", "차분함", "충성심"],
        weaknesses: ["고집", "판단적", "자기비판", "타인 비난", "새로운 것에 대한 저항"],
        compatible: ["ESFP", "ESTP", "ISFJ"],
        famous: "조지 워싱턴, 워렌 버핏, 엘리자베스 2세"
    },
    ISFJ: {
        title: "수호자",
        description: "따뜻한 마음과 헌신적인 성격으로, 언제나 사랑하는 사람들을 보호할 준비가 되어 있습니다.",
        strengths: ["지지적", "신뢰할 만함", "참을성", "근면", "열정적"],
        weaknesses: ["겸손", "과도한 이타심", "감정 억제", "과부하", "완벽주의"],
        compatible: ["ESFP", "ESTP", "ISTJ"],
        famous: "마더 테레사, 로사 파크스, 케이트 미들턴"
    },
    ESTJ: {
        title: "경영자",
        description: "뛰어난 관리자로, 사물이나 사람을 관리하는 데 타의 추종을 불허합니다.",
        strengths: ["헌신적", "강한 의지", "직설적", "충성심", "참을성"],
        weaknesses: ["완고함", "어려운 휴식", "감정 표현 어려움", "상태 중요시", "어려운 혁신"],
        compatible: ["ISFP", "ISTP", "ESFJ"],
        famous: "프랭클린 루즈벨트, 존 D. 록펠러, 엠마 왓슨"
    },
    ESFJ: {
        title: "집정관",
        description: "매우 배려심이 많고 사교적이며 인기가 많은, 언제나 도움을 주려 하는 사람입니다.",
        strengths: ["강한 실용적 기술", "강한 의무감", "매우 충성심", "민감하고 따뜻함", "좋은 협력자"],
        weaknesses: ["걱정이 많음", "비판에 취약", "개인 요구 무시", "거부하기 어려움", "지나친 이타심"],
        compatible: ["ISFP", "ISTP", "ESTJ"],
        famous: "테일러 스위프트, 휴 잭맨, 스티브 하비"
    },
    ISTP: {
        title: "만능재주꾼",
        description: "대담하고 실용적인 실험정신의 소유자로, 모든 종류의 도구를 자유자재로 다룹니다.",
        strengths: ["낙관적", "에너지 넘침", "창의적", "실용적", "자발적"],
        weaknesses: ["고집", "무감각", "사생활 중시", "쉽게 지루함", "위험한 행동"],
        compatible: ["ESFJ", "ESTJ", "ISFP"],
        famous: "마이클 조던, 톰 크루즈, 스카를렛 요한슨"
    },
    ISFP: {
        title: "모험가",
        description: "유연하고 매력적인 예술가로, 언제나 새로운 가능성을 탐험할 준비가 되어 있습니다.",
        strengths: ["매력적", "예술적", "자연스러움", "호기심", "열정적"],
        weaknesses: ["섬세함", "독립성", "예측 불가", "스트레스", "지나친 경쟁 회피"],
        compatible: ["ENFJ", "ESFJ", "ESTJ"],
        famous: "마이클 잭슨, 프린스, 밥 딜런"
    },
    ESTP: {
        title: "사업가",
        description: "똑똑하고 에너지 넘치며 매우 민감한 사람으로, 진정으로 삶을 즐깁니다.",
        strengths: ["대담함", "합리적", "실용적", "독창적", "민감함"],
        weaknesses: ["참을성 부족", "위험 감수", "구조 부족", "집중력 부족", "민감함"],
        compatible: ["ISFJ", "ISTJ", "ESFP"],
        famous: "도널드 트럼프, 어니스트 헤밍웨이, 마돈나"
    },
    ESFP: {
        title: "연예인",
        description: "자발적이고 열정적이며 사교적인 사람으로, 삶과 사람에 대한 사랑이 넘칩니다.",
        strengths: ["대담함", "실용적", "원래 성격", "관찰력", "우수한 인간관계 기술"],
        weaknesses: ["민감함", "갈등 회피", "집중력 부족", "스트레스", "독립성"],
        compatible: ["ISFJ", "ISTJ", "ESTP"],
        famous: "윌 스미스, 마릴린 먼로, 엘튼 존"
    }
};
