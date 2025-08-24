// result.js - 결과 페이지 전용 스크립트

// 결과 타입 정의 (원본과 동일)
const resultTypes = {
    joy: {
        badge: '😄',
        title: '기쁨과 행복이 가득한 마음',
        subtitle: '긍정적인 에너지로 가득 차 있습니다',
        description: '현재 당신은 삶에 대한 만족도가 높고, 긍정적인 에너지가 넘치는 상태입니다. 주변 상황을 밝게 바라보며, 새로운 도전에 대한 의욕도 가득합니다. 이런 긍정적인 마음가짐은 주변 사람들에게도 좋은 영향을 미치고 있으며, 당신의 밝은 에너지가 많은 사람들에게 희망과 용기를 전달하고 있습니다. 감정적으로 안정되어 있고, 스트레스 상황에서도 해결책을 찾으려는 의지가 강합니다.',
        advice: '이런 긍정적인 마음가짐을 유지하면서도, 현실적인 계획도 함께 세워보세요. 목표를 설정하고 단계적으로 접근하면 더 큰 성취감을 느낄 수 있습니다. 다만 너무 낙관적인 나머지 위험요소를 간과하지 않도록 주의하고, 때로는 신중한 판단도 필요합니다. 또한 행복한 순간들을 기록해두어 힘든 시기에 되돌아볼 수 있는 자료로 활용하세요.',
        tips: [
            '매일 감사한 일 3가지를 일기에 기록하세요',
            '긍정적인 사람들과 더 많은 시간을 보내세요',
            '새로운 취미나 활동에 도전하여 성취감을 높이세요',
            '규칙적인 운동으로 몸과 마음의 활력을 유지하세요',
            '목표를 세우고 작은 성공을 축하하는 습관을 기르세요',
            '어려운 상황에서도 배울 점을 찾으려 노력하세요'
        ],
        traits: ['낙관적', '에너지 넘침', '사교적', '도전적'],
        improvements: [
            { title: '목표 설정하기', desc: '긍정적인 에너지를 구체적인 목표 달성에 활용하여 더 큰 성취감을 경험하세요' },
            { title: '감사 표현하기', desc: '주변 사람들에게 고마움을 자주 표현하여 더 깊은 인간관계를 만들어가세요' },
            { title: '균형 잡기', desc: '때로는 휴식도 필요하다는 것을 잊지 말고 자신을 돌보는 시간을 가지세요' }
        ]
    },
    anxiety: {
        badge: '😰',
        title: '불안과 걱정이 많은 상태',
        subtitle: '마음이 불안정하고 걱정이 많습니다',
        description: '현재 여러 가지 걱정거리들로 인해 마음이 불안한 상태입니다. 미래에 대한 걱정이나 현재 상황에 대한 불안감이 크게 느껴지며, 때로는 통제할 수 없는 생각들이 머릿속을 맴돌고 있습니다. 이런 불안감은 현대인들이 흔히 경험하는 감정이며, 완벽하게 통제하려 하기보다는 적절히 관리하는 것이 중요합니다. 불안은 위험에 대비하려는 뇌의 자연스러운 반응이지만, 과도할 경우 일상생활에 지장을 줄 수 있습니다. 지금 느끼는 불안감을 인정하고 받아들이면서, 건전한 방법으로 해소해 나가는 것이 필요합니다.',
        advice: '불안감은 자연스러운 감정이지만, 너무 오래 지속되면 일상생활에 지장을 줄 수 있습니다. 깊은 호흡이나 명상을 통해 마음을 진정시키고, 믿을 만한 사람과 대화를 나누세요. 걱정되는 일들을 구체적으로 적어보고, 실제로 통제할 수 있는 부분과 그렇지 않은 부분을 구분해보세요. 통제할 수 없는 일에 대해서는 받아들이는 연습을, 통제할 수 있는 일에 대해서는 구체적인 행동 계획을 세우는 것이 도움됩니다.',
        tips: [
            '4-7-8 호흡법을 활용해 즉시 마음을 진정시키세요',
            '걱정거리를 종이에 적어보고 구체적인 해결 방안을 찾아보세요',
            '하루 10분 명상이나 마인드풀니스를 실천하세요',
            '충분한 수면과 규칙적인 생활 패턴을 유지하세요',
            '믿을 만한 친구나 가족과 솔직한 대화 시간을 가지세요',
            '카페인과 알코올 섭취를 줄이고 운동을 늘리세요'
        ],
        traits: ['민감함', '신중함', '세심함', '공감능력'],
        improvements: [
            { title: '마음 다스리기', desc: '명상이나 호흡법을 통해 불안감을 조절하고 현재에 집중하는 연습을 하세요' },
            { title: '문제 해결하기', desc: '걱정거리를 구체적으로 파악하고 실행 가능한 해결책을 단계별로 세워보세요' },
            { title: '지지체계 만들기', desc: '신뢰할 수 있는 사람들과의 관계를 강화하고 도움을 요청하는 것을 두려워하지 마세요' }
        ]
    },
    stress: {
        badge: '😫',
        title: '스트레스가 높은 상태',
        subtitle: '압박감과 피로감을 많이 느끼고 있습니다',
        description: '현재 과도한 업무나 책임감으로 인해 스트레스 수준이 높은 상태입니다. 신체적, 정신적 피로가 누적되어 있으며 휴식이 필요한 시점입니다. 다양한 요구사항들과 기대에 부응하려다 보니 자신을 돌볼 시간이 부족해졌을 수 있습니다. 스트레스는 단기적으로는 동기부여가 될 수 있지만, 장기간 지속되면 건강과 웰빙에 악영향을 미칠 수 있습니다. 지금이 자신의 한계를 인정하고 적절한 조치를 취할 때입니다. 완벽함보다는 균형을 추구하는 것이 중요합니다.',
        advice: '스트레스는 방치하면 건강에 악영향을 줄 수 있습니다. 우선순위를 정해 중요한 일부터 처리하고, 충분한 휴식을 취하세요. 완벽하지 않아도 괜찮다는 마음가짐을 가지고, 자신에게 너무 가혹하지 마세요. 일과 휴식의 명확한 경계를 설정하고, "노"라고 말할 수 있는 용기도 필요합니다. 스트레스의 원인을 파악하고 근본적인 해결책을 찾는 것도 중요하지만, 당장 할 수 있는 스트레스 해소법부터 실천해보세요.',
        tips: [
            '업무나 할 일의 우선순위를 정해 체계적으로 접근하세요',
            '25분 일하고 5분 휴식하는 포모도로 기법을 활용하세요',
            '스트레스 해소를 위한 나만의 방법을 찾아 정기적으로 실천하세요',
            '충분한 수면과 영양 섭취로 체력을 관리하세요',
            '운동이나 스트레칭으로 몸에 쌓인 긴장을 풀어주세요',
            '완벽하지 않아도 된다는 마음가짐을 연습하세요'
        ],
        traits: ['책임감', '성실함', '열정적', '완벽주의'],
        improvements: [
            { title: '우선순위 정하기', desc: '중요한 일과 급한 일을 구분해서 처리하고, 불필요한 일은 과감히 포기하세요' },
            { title: '휴식 계획하기', desc: '정기적인 휴식과 여가 시간을 확보하고 이를 지키기 위해 노력하세요' },
            { title: '도움 요청하기', desc: '혼자 모든 것을 해결하려 하지 말고 주변에 도움을 요청하고 업무를 분담하세요' }
        ]
    },
    sadness: {
        badge: '😢',
        title: '깊은 슬픔과 아픔이 있는 마음',
        subtitle: '마음의 상처를 치유하는 시간이 필요합니다',
        description: '현재 당신은 마음 깊은 곳에서 슬픔이나 상실감을 느끼고 있는 상태입니다. 이런 감정은 자연스러운 인간의 반응이며, 충분히 느끼고 받아들이는 것이 중요합니다. 슬픔은 때로는 우리에게 소중한 것이 무엇인지를 깨닫게 해주고, 타인의 아픔에 공감할 수 있는 능력을 길러줍니다. 지금의 어려운 시기는 결국 지나갈 것이며, 이 경험을 통해 더 깊이 있는 사람으로 성장할 수 있습니다. 혼자 견디기보다는 신뢰할 수 있는 사람들과 마음을 나누는 것이 도움이 됩니다.',
        advice: '슬픔을 억지로 감추려 하지 마세요. 눈물을 흘리고 싶다면 충분히 울어도 괜찮습니다. 다만 너무 오래 그 상태에 머물지 않도록 작은 일상의 루틴을 만들어 보세요. 가벼운 산책이나 따뜻한 차 한 잔, 좋아하는 음악 듣기 등 작은 위로가 될 수 있는 활동들을 찾아보세요. 또한 전문가의 도움이 필요하다고 느끼면 주저하지 말고 상담을 받아보세요.',
        tips: [
            '하루에 한 번은 자신에게 따뜻한 말을 건네주세요',
            '신뢰할 수 있는 사람과 마음을 나누는 시간을 가지세요',
            '규칙적인 수면과 식사로 기본적인 자기관리를 하세요',
            '가벼운 산책이나 스트레칭으로 몸을 움직여 보세요',
            '일기 쓰기나 그림 그리기 등으로 감정을 표현해보세요',
            '작은 목표를 세우고 달성하는 성취감을 느껴보세요'
        ],
        traits: ['공감적', '내성적', '신중함', '깊이 있음'],
        improvements: [
            { title: '자기 돌봄', desc: '충분한 휴식과 영양 섭취로 몸과 마음을 돌보는 시간을 가지세요' },
            { title: '소통하기', desc: '혼자 견디지 말고 믿을 수 있는 사람들과 마음을 나누세요' },
            { title: '희망 찾기', desc: '작은 것이라도 기대할 수 있는 일들을 찾아 희망을 키워나가세요' }
        ]
    },
    peace: {
        badge: '😌',
        title: '평화롭고 안정된 마음',
        subtitle: '내면의 평화를 유지하고 있습니다',
        description: '현재 마음이 평화롭고 안정된 상태입니다. 스트레스나 갈등 상황에서도 침착함을 유지하며, 조화로운 관계를 추구합니다. 당신은 자신의 감정을 잘 관리하고 있으며, 주변 상황에 휘둘리지 않는 중심을 가지고 있습니다. 이런 평온함은 주변 사람들에게도 안정감을 주며, 갈등 상황에서 중재자 역할을 할 수 있는 능력을 가지고 있습니다. 내면의 평화는 진정한 강함에서 나오는 것이며, 이는 깊은 자기 이해와 성숙함의 결과입니다.',
        advice: '평화로운 마음가짐은 큰 장점이지만, 때로는 자신의 의견을 명확히 표현하는 것도 중요합니다. 갈등을 무조건 피하기보다는 건설적인 대화를 통해 문제를 해결해보세요. 평화로움이 수동성으로 이어지지 않도록 주의하고, 필요할 때는 적극적으로 행동하는 것도 중요합니다. 자신의 가치관과 신념을 명확히 하고, 이를 바탕으로 결정을 내리는 연습을 해보세요.',
        tips: [
            '명상이나 요가를 통해 내면의 평화를 더욱 키우세요',
            '자연 속에서 시간을 보내며 마음의 여유를 가지세요',
            '독서나 음악 감상으로 정신적 풍요로움을 추구하세요',
            '정기적인 휴식과 여유 시간을 확보하세요',
            '자신의 의견을 표현하는 연습을 해보세요',
            '갈등 상황에서 중재자 역할을 해보며 소통 능력을 기르세요'
        ],
        traits: ['차분함', '인내심', '조화추구', '안정감'],
        improvements: [
            { title: '의견 표현하기', desc: '자신의 생각을 명확하게 전달하는 연습을 하고 필요시 단호함도 보이세요' },
            { title: '적극성 기르기', desc: '때로는 능동적인 자세로 변화를 이끌어가는 리더십을 발휘해보세요' },
            { title: '목표 의식', desc: '평화로움 속에서도 발전을 위한 구체적인 목표를 세우고 추진해보세요' }
        ]
    },
    energy: {
        badge: '⚡',
        title: '활력과 열정이 넘치는 상태',
        subtitle: '에너지가 충만하고 의욕적입니다',
        description: '현재 활력이 넘치고 무엇이든 해낼 수 있다는 자신감이 가득한 상태입니다. 새로운 프로젝트나 도전에 대한 열정이 높으며, 주변을 이끌어가는 리더십을 발휘하고 있습니다. 이런 강한 에너지는 주변 사람들에게도 긍정적인 영향을 미치며, 팀이나 조직에서 중요한 동력이 되고 있습니다. 창의적인 아이디어가 샘솟고, 실행력도 뛰어난 시기입니다. 다만 이런 높은 에너지 수준을 지속적으로 유지하기 위해서는 적절한 관리와 균형이 필요합니다.',
        advice: '강한 에너지는 큰 장점이지만, 방향성을 잃지 않도록 주의하세요. 체계적인 계획을 세우고 단계별로 접근하면 더 큰 성과를 얻을 수 있습니다. 또한 에너지가 과도하게 분산되지 않도록 우선순위를 명확히 하고, 중요한 일에 집중하는 것이 중요합니다. 번아웃을 예방하기 위해 충분한 휴식도 반드시 확보하세요.',
        tips: [
            '에너지를 효율적으로 배분하는 방법을 익히세요',
            '규칙적인 운동으로 체력을 지속적으로 관리하세요',
            '명확한 목표와 우선순위를 설정하여 에너지를 집중하세요',
            '충분한 휴식도 에너지 충전에 필수라는 것을 기억하세요',
            '영양 균형을 맞춘 식사로 지속적인 에너지를 유지하세요',
            '과도한 멀티태스킹보다는 한 번에 하나씩 집중하세요'
        ],
        traits: ['추진력', '리더십', '열정적', '도전정신'],
        improvements: [
            { title: '계획 수립', desc: '체계적인 계획을 통해 에너지를 효율적으로 사용하고 목표를 달성하세요' },
            { title: '균형 유지', desc: '휴식과 활동의 균형을 맞춰 번아웃을 예방하고 지속 가능한 에너지를 유지하세요' },
            { title: '팀워크', desc: '개인의 에너지를 팀 전체의 시너지로 확장하여 더 큰 성과를 창출하세요' }
        ]
    },
    confusion: {
        badge: '🤔',
        title: '혼란스럽고 복잡한 마음',
        subtitle: '현재 감정 상태가 복잡합니다',
        description: '여러 가지 감정이 복합적으로 나타나는 상태입니다. 상황에 대한 판단이 어렵고, 어떤 선택을 해야 할지 고민이 많은 시기입니다. 이런 혼란스러운 상태는 성장과 변화의 과정에서 자연스럽게 나타나는 현상입니다. 기존의 패턴이나 생각이 바뀌려고 할 때, 또는 새로운 환경이나 상황에 적응하려 할 때 흔히 경험하게 됩니다. 이 시기를 잘 극복하면 더 성숙하고 지혜로운 사람으로 성장할 수 있는 기회가 됩니다.',
        advice: '복잡한 감정은 성장의 과정에서 자연스럽게 나타날 수 있습니다. 급하게 결론을 내리려 하지 말고, 시간을 두고 차근차근 생각해보세요. 신뢰할 수 있는 사람의 조언을 구하는 것도 도움이 되며, 여러 관점에서 상황을 바라보는 연습을 해보세요. 완벽한 답을 찾으려 하기보다는 현재 상황에서 최선의 선택을 하려는 마음가짐이 중요합니다.',
        tips: [
            '일기를 써서 자신의 감정과 생각을 정리해보세요',
            '믿을 만한 사람과 깊은 대화를 나누며 다양한 관점을 들어보세요',
            '성급한 결정보다는 충분한 시간을 두고 신중히 고민하세요',
            '명상이나 산책을 통해 마음을 정리하고 내면의 소리에 귀 기울이세요',
            '작은 결정부터 연습하여 결정력을 기르세요',
            '전문가의 도움이나 상담을 받는 것도 고려해보세요'
        ],
        traits: ['성찰력', '신중함', '균형감', '적응력'],
        improvements: [
            { title: '자기 성찰', desc: '정기적으로 자신의 감정 상태를 점검하고 패턴을 파악해보세요' },
            { title: '소통 증진', desc: '가까운 사람들과 솔직한 대화 시간을 가지며 지지체계를 구축하세요' },
            { title: '건강한 루틴', desc: '규칙적인 생활 패턴을 만들어 안정감을 찾아가세요' }
        ]
    }
};

// 대안 결과 타입들 (다음 결과 보기용)
const alternativeResults = {
    optimistic: {
        badge: '😊',
        title: '긍정 에너지 충만형',
        subtitle: '밝고 긍정적인 에너지로 가득한 상태입니다',
        description: '현재 당신은 생활에 대한 만족도가 높고, 긍정적인 에너지로 가득 차 있습니다. 주변 사람들에게도 좋은 영향을 주고 있으며, 새로운 도전에 대한 의욕이 넘치는 상태입니다.',
        advice: '이런 긍정적인 에너지를 유지하면서도, 때로는 현실적인 계획과 준비도 함께 해나가시기 바랍니다. 너무 성급하게 결정하지 말고 신중함도 겸비하세요.',
        tips: [
            '매일 감사 일기를 써보세요',
            '긍정적인 사람들과 더 많은 시간을 보내세요',
            '새로운 취미나 활동에 도전해보세요',
            '운동을 통해 체력도 함께 기르세요'
        ],
        traits: ['낙관적', '에너지 넘침', '사교적', '도전적'],
        improvements: [
            { title: '감사 표현하기', desc: '주변 사람들에게 고마움을 자주 표현하세요' },
            { title: '목표 설정', desc: '긍정적인 에너지를 구체적인 목표 달성에 활용하세요' },
            { title: '균형 잡기', desc: '때로는 휴식도 필요하다는 것을 잊지 마세요' }
        ]
    },
    balanced: {
        badge: '⚖️',
        title: '균형잡힌 감정형',
        subtitle: '안정적이고 균형 잡힌 감정 상태입니다',
        description: '당신은 다양한 감정을 적절히 조절하며, 상황에 맞게 유연하게 대응하는 능력을 가지고 있습니다. 극단적인 감정보다는 중용의 지혜를 추구합니다.',
        advice: '균형 잡힌 감정은 매우 바람직한 상태입니다. 하지만 때로는 열정이나 강한 의지도 필요할 수 있으니, 필요한 순간에는 적극적인 모습도 보여주세요.',
        tips: [
            '다양한 관점에서 상황을 바라보는 연습을 하세요',
            '감정 일기를 통해 자신의 패턴을 파악해보세요',
            '새로운 경험을 통해 시야를 넓혀보세요',
            '타인의 감정에도 공감하며 소통하세요'
        ],
        traits: ['균형감', '지혜로움', '포용력', '객관성'],
        improvements: [
            { title: '열정 발휘하기', desc: '때로는 강한 열정과 의지를 보여주세요' },
            { title: '결단력 기르기', desc: '신중함과 함께 적절한 결단력도 필요합니다' },
            { title: '자신감 키우기', desc: '자신의 능력과 판단에 더 자신감을 가지세요' }
        ]
    },
    creative: {
        badge: '🎨',
        title: '창의적 감성형',
        subtitle: '풍부한 감성과 창의력을 가지고 있습니다',
        description: '당신은 감정의 변화에 민감하며, 이를 창의적인 활동으로 승화시키는 능력을 가지고 있습니다. 예술적 감각이 뛰어나고, 독창적인 아이디어를 많이 가지고 있습니다.',
        advice: '창의적인 감성은 큰 재능입니다. 이를 체계적으로 발전시켜 나가면 훌륭한 성과를 얻을 수 있습니다. 감정의 기복이 클 수 있으니 안정감도 함께 추구하세요.',
        tips: [
            '창작 활동을 통해 감정을 표현해보세요',
            '다양한 예술 작품을 감상하며 영감을 얻으세요',
            '새로운 기술이나 방법을 배워보세요',
            '다른 창작자들과 교류하며 아이디어를 나누세요'
        ],
        traits: ['창의성', '감수성', '독창성', '표현력'],
        improvements: [
            { title: '체계화하기', desc: '창의적 아이디어를 체계적으로 정리하고 발전시키세요' },
            { title: '안정감 찾기', desc: '감정 기복을 조절할 수 있는 방법을 찾아보세요' },
            { title: '실행력 기르기', desc: '좋은 아이디어를 실제로 구현하는 능력을 키우세요' }
        ]
    },
    social: {
        badge: '👥',
        title: '사회적 친화형',
        subtitle: '타인과의 관계를 중시하고 소통을 잘합니다',
        description: '당신은 다른 사람들과의 관계를 매우 중요하게 여기며, 공감 능력이 뛰어납니다. 팀워크를 발휘하는 것을 좋아하고, 갈등 상황에서는 중재 역할을 잘 수행합니다.',
        advice: '타인을 배려하는 마음은 아름답지만, 자신의 needs도 잊지 마세요. 때로는 자신을 위한 시간과 공간도 필요합니다. 건전한 경계선을 설정하는 것도 중요합니다.',
        tips: [
            '다양한 사람들과 네트워킹 기회를 만들어보세요',
            '경청 능력을 더욱 발전시켜보세요',
            '갈등 해결 스킬을 배워보세요',
            '자신만의 시간도 충분히 확보하세요'
        ],
        traits: ['사교성', '공감능력', '협동심', '배려심'],
        improvements: [
            { title: '자기 돌봄', desc: '타인을 배려하는 만큼 자신도 돌봐주세요' },
            { title: '경계 설정', desc: '건전한 인간관계를 위한 경계선을 설정하세요' },
            { title: '리더십 개발', desc: '좋은 관계 능력을 바탕으로 리더십을 발휘해보세요' }
        ]
    },
    romantic: {
        badge: '💖',
        title: '감성적 로맨틱형',
        subtitle: '풍부한 감정과 낭만을 추구합니다',
        description: '당신은 감정이 풍부하고 낭만적인 성향을 가지고 있습니다. 아름다운 것들에 대한 감각이 뛰어나며, 깊은 감정적 연결을 중시합니다. 예술이나 문학에 관심이 많을 수 있습니다.',
        advice: '감성이 풍부한 것은 큰 장점이지만, 때로는 현실적인 면도 고려해야 합니다. 감정의 기복을 잘 관리하고, 이상과 현실 사이의 균형을 찾아보세요.',
        tips: [
            '일기나 시를 써보며 감정을 표현하세요',
            '좋아하는 음악을 들으며 감정을 정화하세요',
            '자연이나 예술 작품을 감상하는 시간을 가지세요',
            '감정을 나눌 수 있는 소중한 사람을 찾으세요'
        ],
        traits: ['감성적', '로맨틱', '예술적', '직관적'],
        improvements: [
            { title: '현실 감각', desc: '감성과 함께 현실적인 판단력도 기르세요' },
            { title: '감정 조절', desc: '너무 극단적인 감정에 휩쓸리지 않도록 주의하세요' },
            { title: '실용성', desc: '아름다운 이상과 실용적 필요 사이의 균형을 찾으세요' }
        ]
    },
    analytical: {
        badge: '🧠',
        title: '분석적 사고형',
        subtitle: '논리적이고 체계적인 사고를 합니다',
        description: '당신은 문제를 논리적으로 분석하고 체계적으로 접근하는 능력이 뛰어납니다. 감정보다는 이성을 앞세우며, 객관적인 판단을 내리려고 노력합니다. 복잡한 상황도 차근차근 해결해 나갑니다.',
        advice: '분석적 사고는 훌륭한 능력이지만, 때로는 직감이나 감정도 중요한 정보가 될 수 있습니다. 너무 완벽을 추구하지 말고, 감정적인 측면도 고려해보세요.',
        tips: [
            '문제를 작은 단위로 나누어 해결하세요',
            '데이터와 사실에 기반한 판단을 하세요',
            '다양한 관점에서 문제를 바라보세요',
            '때로는 직감도 믿어보세요'
        ],
        traits: ['논리적', '체계적', '객관적', '신중함'],
        improvements: [
            { title: '감정 인식', desc: '논리뿐만 아니라 감정의 가치도 인정해보세요' },
            { title: '유연성', desc: '때로는 계획을 변경하는 것도 필요합니다' },
            { title: '소통', desc: '분석 결과를 다른 사람들이 이해하기 쉽게 전달하세요' }
        ]
    },
    adventurous: {
        badge: '🌟',
        title: '모험적 탐험형',
        subtitle: '새로운 경험과 도전을 즐깁니다',
        description: '당신은 새로운 것에 대한 호기심이 많고, 모험을 즐기는 성격입니다. 안전한 것보다는 도전적인 것을 선호하며, 변화를 두려워하지 않습니다. 다양한 경험을 통해 성장하는 타입입니다.',
        advice: '모험심은 성장의 원동력이지만, 때로는 신중함도 필요합니다. 무모한 도전보다는 계산된 위험을 감수하고, 안전장치도 마련해두세요.',
        tips: [
            '새로운 취미나 활동에 도전해보세요',
            '여행을 통해 다양한 문화를 경험하세요',
            '새로운 사람들과 만나 네트워크를 확장하세요',
            '실패를 두려워하지 말고 배움의 기회로 삼으세요'
        ],
        traits: ['모험적', '호기심', '적응력', '개방성'],
        improvements: [
            { title: '계획성', desc: '모험도 좋지만 최소한의 계획은 세워두세요' },
            { title: '안전 의식', desc: '적절한 안전장치와 준비를 하고 도전하세요' },
            { title: '지속성', desc: '새로운 것만 추구하지 말고 깊이도 추구해보세요' }
        ]
    },
    perfectionist: {
        badge: '✨',
        title: '완벽주의 추구형',
        subtitle: '높은 기준을 가지고 완벽을 추구합니다',
        description: '당신은 자신과 주변에 대해 높은 기준을 가지고 있으며, 완벽한 결과를 얻기 위해 노력합니다. 세밀함과 정확성을 중시하며, 타인보다 자신에게 더 엄격할 수 있습니다.',
        advice: '완벽을 추구하는 것은 좋지만, 때로는 완벽하지 않아도 괜찮다는 것을 받아들이세요. 과도한 스트레스를 받지 않도록 적절한 기준점을 찾는 것이 중요합니다.',
        tips: [
            '80% 완성도에도 만족할 수 있는 여유를 가지세요',
            '실수는 학습의 기회라고 생각하세요',
            '타인의 다른 방식도 인정해보세요',
            '스트레스 관리 방법을 익히세요'
        ],
        traits: ['꼼꼼함', '책임감', '높은 기준', '정확성'],
        improvements: [
            { title: '유연성 기르기', desc: '때로는 완벽하지 않아도 괜찮다는 것을 받아들이세요' },
            { title: '스트레스 관리', desc: '과도한 기준으로 인한 스트레스를 줄이세요' },
            { title: '타인 이해', desc: '다른 사람의 방식과 속도도 인정해주세요' }
        ]
    }
};

// 전역 변수
let currentResultIndex = 0;
let testResult = null;
let currentResultStep = 1;
const totalResultSteps = 6;

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // localStorage에서 테스트 결과 불러오기
    const savedResult = localStorage.getItem('emotionTestResult');
    
    if (savedResult) {
        testResult = JSON.parse(savedResult);
        currentResultIndex = 0; // 인덱스 초기화
        currentResultStep = 1; // 단계 초기화
        displayResult(testResult);
        loadAds();
        initKakao();
        initializeResultStep(1);
    } else {
        // 결과가 없으면 테스트 페이지로 리다이렉트
        window.location.href = 'index.html';
    }
});

// 결과 단계 초기화
function initializeResultStep(step) {
    // 모든 단계 숨기기
    document.querySelectorAll('.step-container').forEach(el => {
        el.classList.remove('current');
        el.classList.add('hidden');
    });
    
    // 현재 단계 표시
    const currentStepEl = document.getElementById(`resultStep${step}`);
    if (currentStepEl) {
        currentStepEl.classList.remove('hidden');
        currentStepEl.classList.add('current');
    }
    
    // 단계별 광고 로딩
    loadStepAd(step);
}

// 다음 결과 단계로 이동
function nextResultStep() {
    if (currentResultStep < totalResultSteps) {
        currentResultStep++;
        initializeResultStep(currentResultStep);
    }
}

// 단계별 광고 로딩
function loadStepAd(step) {
    setTimeout(() => {
        try {
            const adContainer = document.getElementById(`adResult${step}`);
            if (adContainer) {
                (adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.log(`단계 ${step} 광고 로딩 중 오류:`, e);
        }
    }, 100);
}

// 카카오 SDK 초기화
function initKakao() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        // 실제 카카오 앱 키로 교체 필요
        window.Kakao.init('YOUR_KAKAO_APP_KEY');
    }
}

// 결과 표시 함수
function displayResult(result) {
    // 기본 정보 표시
    document.getElementById('resultBadge').textContent = result.resultData.badge;
    document.getElementById('resultTitle').textContent = result.resultData.title;
    document.getElementById('resultSubtitle').textContent = result.resultData.subtitle;
    document.getElementById('scoreValue').textContent = `${result.score}점`;

    // 감정 분포 차트 생성
    createEmotionChart(result.typeScores);

    // 상세 분석 섹션 생성
    createAnalysisSection(result.resultData);

    // 성격 특성 표시
    createPersonalityTraits(result.resultData.traits || ['분석적', '신중함', '균형감', '적응력']);

    // 개선 방법 표시
    createImprovementSteps(result.resultData.improvements || [
        { title: '자기 성찰', desc: '정기적으로 자신의 감정 상태를 점검해보세요' },
        { title: '소통 증진', desc: '가까운 사람들과 솔직한 대화 시간을 가지세요' },
        { title: '건강한 루틴', desc: '규칙적인 생활 패턴을 만들어보세요' }
    ]);

    // 결과 카운터 업데이트
    updateResultCounter();
}

// 감정 분포 차트 생성
function createEmotionChart(typeScores) {
    const emotionNames = {
        joy: '기쁨',
        anxiety: '불안',
        stress: '스트레스',
        sadness: '슬픔',
        peace: '평화',
        energy: '활력',
        confusion: '혼란'
    };

    const maxScore = Math.max(...Object.values(typeScores));
    const barsContainer = document.getElementById('emotionBars');
    
    barsContainer.innerHTML = '';

    Object.entries(typeScores).forEach(([emotion, score]) => {
        const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
        
        const barElement = document.createElement('div');
        barElement.className = 'emotion-bar';
        barElement.innerHTML = `
            <div class="emotion-label">${emotionNames[emotion] || emotion}</div>
            <div class="emotion-progress">
                <div class="emotion-fill" style="width: 0%" data-width="${percentage}%"></div>
            </div>
            <div class="emotion-percentage">${percentage}%</div>
        `;
        
        barsContainer.appendChild(barElement);
    });

    // 애니메이션 효과
    setTimeout(() => {
        document.querySelectorAll('.emotion-fill').forEach(fill => {
            fill.style.width = fill.getAttribute('data-width');
        });
    }, 100);
}

// 상세 분석 섹션 생성
function createAnalysisSection(resultData) {
    const analysisSection = document.getElementById('analysisSection');
    
    analysisSection.innerHTML = `
        <div class="analysis-card">
            <div class="analysis-title">📊 심층 분석</div>
            <div class="analysis-text">${resultData.description}</div>
            
            <div class="analysis-subsection">
                <h4>🔍 현재 상태 진단</h4>
                <p>이 감정 유형은 현재 당신의 심리적 상태와 생활 패턴을 종합적으로 반영한 결과입니다. 
                각 개인의 독특한 경험과 환경이 만들어낸 고유한 감정적 특성을 나타냅니다.</p>
            </div>
            
            <div class="analysis-subsection">
                <h4>🌟 강점과 장점</h4>
                <p>당신의 이런 감정 상태는 여러 긍정적인 면을 가지고 있습니다. 
                이러한 특성들을 잘 활용하면 개인적 성장과 대인관계에서 큰 도움이 될 수 있습니다.</p>
            </div>
        </div>
        
        <div class="analysis-card">
            <div class="analysis-title">💡 전문가 조언</div>
            <div class="analysis-text">${resultData.advice}</div>
            
            <div class="analysis-subsection">
                <h4>⚠️ 주의사항</h4>
                <p>현재 감정 상태를 건강하게 유지하기 위해 몇 가지 주의해야 할 점들이 있습니다. 
                균형잡힌 삶을 위해 다음 사항들을 염두에 두시기 바랍니다.</p>
            </div>
            
            <div class="analysis-subsection">
                <h4>🎯 추천 활동</h4>
                <p>당신의 감정 유형에 특히 도움이 되는 활동들을 찾아 정기적으로 실천해보세요. 
                작은 변화부터 시작하여 점진적으로 삶의 질을 향상시킬 수 있습니다.</p>
            </div>
        </div>
        
        <div class="analysis-card">
            <div class="analysis-title">✨ 실전 감정 관리 가이드</div>
            <div class="tips-grid">
                ${resultData.tips.map((tip, index) => `
                    <div class="tip-item">
                        <div class="tip-icon">💎</div>
                        <div class="tip-content">
                            <strong>실천법 ${index + 1}</strong><br>
                            ${tip}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="bonus-tips">
                <h4>🎁 보너스 팁</h4>
                <div class="bonus-tip-item">
                    <span class="bonus-icon">🌱</span>
                    <span>매일 5분간 자신의 감정을 점검하는 시간을 가져보세요.</span>
                </div>
                <div class="bonus-tip-item">
                    <span class="bonus-icon">📝</span>
                    <span>감정 일기를 써서 패턴을 파악하고 성장을 기록해보세요.</span>
                </div>
                <div class="bonus-tip-item">
                    <span class="bonus-icon">🤝</span>
                    <span>신뢰할 수 있는 사람과 정기적으로 마음을 나누는 시간을 만드세요.</span>
                </div>
            </div>
        </div>
    `;
}

// 성격 특성 표시
function createPersonalityTraits(traits) {
    const traitsContainer = document.getElementById('personalityTraits');
    const traitIcons = ['🎯', '🧠', '❤️', '⚡', '🌟', '🔥', '💫', '🎨'];
    const traitDescriptions = [
        '목표 지향적이고 집중력이 뛰어납니다',
        '분석적이고 논리적 사고를 잘합니다', 
        '감정적 지능이 높고 공감 능력이 뛰어납니다',
        '에너지가 넘치고 활동적입니다',
        '창의적이고 독창적인 아이디어를 잘 냅니다',
        '열정적이고 추진력이 강합니다',
        '직감적이고 영감을 잘 받습니다',
        '예술적 감각과 미적 센스가 뛰어납니다'
    ];
    
    traitsContainer.innerHTML = `
        <div class="traits-header">
            <h3>🌈 당신의 핵심 특성</h3>
            <p>다음은 당신의 감정 유형에서 나타나는 주요 성격 특성들입니다.</p>
        </div>
        <div class="traits-grid">
            ${traits.map((trait, index) => `
                <div class="trait-item">
                    <div class="trait-icon">${traitIcons[index] || '⭐'}</div>
                    <div class="trait-content">
                        <div class="trait-label">${trait}</div>
                        <div class="trait-desc">${traitDescriptions[index] || '특별한 재능을 가지고 있습니다'}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="traits-analysis">
            <h4>💡 특성 활용법</h4>
            <p>이러한 특성들은 당신만의 고유한 강점입니다. 일상생활에서 이런 특성들을 의식적으로 활용하면 
            더 만족스럽고 성공적인 삶을 만들어갈 수 있습니다. 각 특성을 개발하고 균형있게 활용하는 것이 중요합니다.</p>
        </div>
    `;
}

// 개선 방법 표시
function createImprovementSteps(improvements) {
    const stepsContainer = document.getElementById('improvementSteps');
    
    stepsContainer.innerHTML = `
        <div class="improvement-header">
            <h3>🚀 성장을 위한 실행 계획</h3>
            <p>더 나은 자신으로 성장하기 위한 구체적이고 실천 가능한 단계별 가이드입니다.</p>
        </div>
        
        <div class="improvement-timeline">
            ${improvements.map((improvement, index) => `
                <div class="improvement-step">
                    <div class="step-number">
                        <span class="step-num">${index + 1}</span>
                        <span class="step-label">STEP</span>
                    </div>
                    <div class="step-content">
                        <div class="step-title">
                            <span class="step-icon">${index === 0 ? '🎯' : index === 1 ? '⚡' : '🌟'}</span>
                            ${improvement.title}
                        </div>
                        <div class="step-description">${improvement.desc}</div>
                        <div class="step-period">
                            <span class="period-label">권장 실행 기간:</span>
                            <span class="period-time">${index === 0 ? '1-2주' : index === 1 ? '3-4주' : '지속적으로'}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="improvement-footer">
            <div class="motivational-quote">
                <div class="quote-icon">💪</div>
                <div class="quote-text">
                    "작은 변화가 모여 큰 성장을 만듭니다. 
                    하루 한 걸음씩 꾸준히 나아가면 놀라운 변화를 경험할 수 있습니다!"
                </div>
            </div>
            
            <div class="success-tips">
                <h4>✨ 성공을 위한 팁</h4>
                <ul>
                    <li>🔄 매주 진전 상황을 점검하고 기록하세요</li>
                    <li>🎉 작은 성취도 축하하고 인정하세요</li>
                    <li>🤲 주변의 도움을 받는 것을 두려워하지 마세요</li>
                    <li>🌱 완벽함보다는 꾸준함을 추구하세요</li>
                </ul>
            </div>
        </div>
    `;
}

// 다음 결과 보기
function showNextResult() {
    const alternativeKeys = Object.keys(alternativeResults);
    currentResultIndex = (currentResultIndex + 1) % alternativeKeys.length;
    const nextKey = alternativeKeys[currentResultIndex];
    const nextResult = alternativeResults[nextKey];
    
    // 새로운 결과 데이터 생성
    const newResult = {
        ...testResult,
        resultData: nextResult,
        score: Math.floor(Math.random() * 20) + 80 // 80-99점 랜덤
    };
    
    // 결과 표시 업데이트
    displayResult(newResult);
    
    // 결과 카운터 업데이트
    updateResultCounter();
    
    // 첫 번째 단계로 이동
    currentResultStep = 1;
    initializeResultStep(1);
    
    // 광고 다시 로딩
    reloadAds();
}

// 결과 카운터 업데이트
function updateResultCounter() {
    const totalResults = Object.keys(alternativeResults).length;
    const currentNum = currentResultIndex + 1;
    const counterElement = document.getElementById('resultCounter');
    if (counterElement) {
        counterElement.textContent = `(${currentNum}/${totalResults})`;
    }
}

// 광고 로딩
function loadAds() {
    // 모든 단계 광고 로딩
    for (let i = 1; i <= 6; i++) {
        loadStepAd(i);
    }
}

// 광고 다시 로딩
function reloadAds() {
    // 기존 광고 제거
    document.querySelectorAll('.adsbygoogle').forEach(ad => {
        if (ad.getAttribute('data-adsbygoogle-status')) {
            ad.innerHTML = '';
            ad.removeAttribute('data-adsbygoogle-status');
        }
    });
    // 모든 단계 광고 새로 로딩
    setTimeout(() => {
        for (let i = 1; i <= 6; i++) {
            loadStepAd(i);
        }
    }, 100);
}

// 카카오톡 공유
function shareKakao() {
    if (!window.Kakao) {
        alert('카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
    }

    if (!window.Kakao.isInitialized()) {
        initKakao();
    }
    
    const resultTitle = document.getElementById('resultTitle').textContent;
    const resultBadge = document.getElementById('resultBadge').textContent;
    const resultSubtitle = document.getElementById('resultSubtitle').textContent;
    
    window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '내 마음속 감정 분석 테스트',
            description: `나의 결과: ${resultTitle} ${resultBadge}\n${resultSubtitle}`,
            imageUrl: 'https://sd2624.github.io/감정/감정.png',
            link: {
                mobileWebUrl: window.location.origin + '/감정/',
                webUrl: window.location.origin + '/감정/'
            }
        },
        buttons: [
            {
                title: '나도 테스트하기',
                link: {
                    mobileWebUrl: window.location.origin + '/감정/',
                    webUrl: window.location.origin + '/감정/'
                }
            }
        ]
    });
}

// URL 공유
function shareUrl() {
    const testUrl = window.location.origin + '/감정/';
    
    if (navigator.share) {
        navigator.share({
            title: '내 마음속 감정 분석 테스트',
            text: '나의 감정 상태를 분석해보세요!',
            url: testUrl
        });
    } else {
        navigator.clipboard.writeText(testUrl).then(() => {
            alert('링크가 클립보드에 복사되었습니다!');
        }).catch(() => {
            // 폴백: 프롬프트로 링크 보여주기
            prompt('이 링크를 복사해서 공유하세요:', testUrl);
        });
    }
}

// 다시 테스트하기
function restartTest() {
    // localStorage 결과 제거
    localStorage.removeItem('emotionTestResult');
    // 테스트 페이지로 이동
    window.location.href = 'index.html';
}
