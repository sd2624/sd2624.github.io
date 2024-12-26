const tarotData = {
    // 메이저 아르카나 (22장)
    major: [
        {
            id: 0,
            name: "바보",
            image: "fool.jpg",
            keywords: ["새로운 시작", "순수", "모험", "자유"],
            meanings: {
                love: {
                    upright: "새로운 만남, 순수한 사랑, 새로운 관계의 시작",
                    reversed: "성급한 판단, 불안정한 관계, 무책임한 행동"
                },
                career: {
                    upright: "새로운 시작, 모험적인 도전, 창의적 기회",
                    reversed: "무모한 결정, 준비 부족, 경솔한 행동"
                },
                money: {
                    upright: "새로운 투자 기회, 재정적 모험",
                    reversed: "재정적 손실, 무모한 지출, 도박"
                },
                health: {
                    upright: "활력 충만, 새로운 건강 계획 시작",
                    reversed: "부주의로 인한 사고, 건강 관리 소홀"
                }
            }
        },
        {
            id: 1,
            name: "마법사",
            image: "magician.jpg",
            keywords: ["창의력", "기술", "의지력", "시작"],
            meanings: {
                love: {
                    upright: "매력적인 만남, 적극적인 구애, 열정적인 관계",
                    reversed: "거짓된 관계, 조작, 불성실"
                },
                career: {
                    upright: "새로운 기회, 창의적 해결책, 실력 발휘",
                    reversed: "재능 낭비, 기회 상실, 속임수"
                },
                money: {
                    upright: "재정적 기회, 현명한 투자, 수입 증가",
                    reversed: "사기, 금전적 손실, 잘못된 투자"
                },
                health: {
                    upright: "회복, 치유력 증가, 건강 개선",
                    reversed: "잘못된 치료, 건강 악화"
                }
            }
        },
        {
            id: 2,
            name: "여사제",
            image: "highpriestess.jpg",
            keywords: ["직관", "지혜", "비밀", "내면의 목소리"],
            meanings: {
                love: {
                    upright: "직관적 이해, 정신적 교감, 신비로운 매력",
                    reversed: "비밀 연애, 오해, 감정 억제"
                },
                career: {
                    upright: "잠재력 발견, 직관적 판단, 지혜로운 선택",
                    reversed: "판단력 부족, 비밀 유출, 혼란"
                },
                money: {
                    upright: "현명한 재정 관리, 저축, 직관적 투자",
                    reversed: "재정적 불안, 잘못된 직감, 비밀스러운 거래"
                },
                health: {
                    upright: "정신적 안정, 내면의 치유",
                    reversed: "스트레스, 불면증, 정신적 불안"
                }
            }
        },
        {
            id: 3,
            name: "여황제",
            image: "empress.jpg",
            keywords: ["풍요", "창조성", "모성", "자연"],
            meanings: {
                love: {
                    upright: "풍요로운 사랑, 결혼, 임신",
                    reversed: "불화, 불임, 과보호"
                },
                career: {
                    upright: "창의적 성과, 성공적인 프로젝트",
                    reversed: "창의력 부족, 프로젝트 실패"
                },
                money: {
                    upright: "재정적 풍요, 안정적인 수입",
                    reversed: "재정적 어려움, 과소비"
                },
                health: {
                    upright: "건강한 임신, 회복, 치유",
                    reversed: "건강 문제, 불임"
                }
            }
        },    
        {
            id: 4,
            name: "황제",
            image: "emperor.jpg",
            keywords: ["권위", "구조", "안정", "리더십"],
            meanings: {
                love: {
                    upright: "안정적인 관계, 책임감 있는 파트너",
                    reversed: "지배적인 관계, 통제"
                },
                career: {
                    upright: "승진, 리더십, 성공",
                    reversed: "권위 상실, 독단적 행동"
                },
                money: {
                    upright: "재정적 안정, 현명한 투자",
                    reversed: "재정적 손실, 과도한 통제"
                },
                health: {
                    upright: "건강 관리, 규칙적인 생활",
                    reversed: "스트레스, 고혈압"
                }
            }
        },
        {
            id: 5,
            name: "교황",
            image: "hierophant.jpg",
            keywords: ["전통", "신념", "교육", "조언"],
            meanings: {
                love: {
                    upright: "전통적인 관계, 결혼, 약속",
                    reversed: "관습 타파, 자유로운 관계"
                },
                career: {
                    upright: "멘토링, 교육, 전문성",
                    reversed: "구시대적 방식, 경직된 사고"
                },
                money: {
                    upright: "안정적인 재정, 전통적인 투자",
                    reversed: "재정적 조언 무시, 위험한 투자"
                },
                health: {
                    upright: "전문가 상담, 전통적 치료",
                    reversed: "잘못된 조언, 비전통적 치료"
                }
            }
        },
        {
            id: 6,
            name: "연인",
            image: "lovers.jpg",
            keywords: ["선택", "사랑", "조화", "관계"],
            meanings: {
                love: {
                    upright: "진정한 사랑, 조화로운 관계, 중요한 선택",
                    reversed: "불화, 이별, 잘못된 선택"
                },
                career: {
                    upright: "좋은 파트너십, 협력 관계",
                    reversed: "협력 실패, 갈등"
                },
                money: {
                    upright: "재정적 파트너십, 공동 투자",
                    reversed: "재정적 불화, 잘못된 투자 결정"
                },
                health: {
                    upright: "건강한 생활 습관, 균형",
                    reversed: "건강 관리 소홀, 불균형"
                }
            }
        },
        {
            id: 7,
            name: "전차",
            image: "chariot.jpg",
            keywords: ["진전", "의지력", "승리", "결단력"],
            meanings: {
                love: {
                    upright: "관계의 진전, 장애물 극복",
                    reversed: "관계의 정체, 방향성 상실"
                },
                career: {
                    upright: "성공, 승진, 목표 달성",
                    reversed: "실패, 방향 상실, 좌절"
                },
                money: {
                    upright: "재정적 성공, 목표 달성",
                    reversed: "재정적 손실, 목표 실패"
                },
                health: {
                    upright: "건강 회복, 의지력",
                    reversed: "건강 악화, 의욕 상실"
                }
            }
        },
        {
            id: 8,
            name: "힘",
            image: "strength.jpg",
            keywords: ["용기", "인내", "내면의 힘", "자제력"],
            meanings: {
                love: {
                    upright: "강한 사랑, 인내, 용기",
                    reversed: "자신감 부족, 지배적인 관계"
                },
                career: {
                    upright: "도전 극복, 내면의 힘",
                    reversed: "자신감 상실, 의욕 저하"
                },
                money: {
                    upright: "재정적 인내, 장기 투자",
                    reversed: "재정적 불안, 충동적 지출"
                },
                health: {
                    upright: "회복력, 정신력",
                    reversed: "체력 저하, 의지력 상실"
                }
            }
        },
        {
            id: 9,
            name: "은둔자",
            image: "hermit.jpg",
            keywords: ["내면 탐색", "고독", "지혜", "성찰"],
            meanings: {
                love: {
                    upright: "자아 성찰, 독신, 내면의 성장",
                    reversed: "고립, 외로움, 거절"
                },
                career: {
                    upright: "독립적 작업, 연구, 전문성",
                    reversed: "고립된 업무, 소통 부족"
                },
                money: {
                    upright: "신중한 재정 계획, 절약",
                    reversed: "재정적 고립, 과도한 절약"
                },
                health: {
                    upright: "명상, 휴식, 자기 치유",
                    reversed: "고립으로 인한 우울, 불안"
                }
            }
        },
        {
            id: 10,
            name: "운명의 수레바퀴",
            image: "wheel_of_fortune.jpg",
            keywords: ["운명", "전환점", "기회", "변화"],
            meanings: {
                love: {
                    upright: "운명적인 만남, 새로운 기회",
                    reversed: "불운한 관계, 변화 거부"
                },
                career: {
                    upright: "긍정적 변화, 승진 기회",
                    reversed: "부정적 변화, 실패"
                },
                money: {
                    upright: "재정적 행운, 기회",
                    reversed: "재정적 손실, 불운"
                },
                health: {
                    upright: "건강 회복, 전환점",
                    reversed: "건강 악화, 불운"
                }
            }
        },
        {
            id: 11,
            name: "정의",
            image: "justice.jpg",
            keywords: ["균형", "진실", "정의", "인과응보"],
            meanings: {
                love: {
                    upright: "공정한 관계, 진실된 사랑",
                    reversed: "불공평한 관계, 부정"
                },
                career: {
                    upright: "공정한 평가, 법적 문제 해결",
                    reversed: "부당한 대우, 불공정"
                },
                money: {
                    upright: "공정한 거래, 법적 해결",
                    reversed: "재정적 불공정, 법적 문제"
                },
                health: {
                    upright: "건강한 균형, 회복",
                    reversed: "불균형, 만성 질환"
                }
            }
        },
        {
            id: 12,
            name: "매달린 사람",
            image: "hanged_man.jpg",
            keywords: ["희생", "새로운 관점", "기다림", "포기"],
            meanings: {
                love: {
                    upright: "자기희생, 새로운 시각",
                    reversed: "불필요한 희생, 고착"
                },
                career: {
                    upright: "새로운 관점, 일시적 중단",
                    reversed: "시간 낭비, 무의미한 희생"
                },
                money: {
                    upright: "재정적 희생, 투자 중단",
                    reversed: "불필요한 손실, 낭비"
                },
                health: {
                    upright: "휴식, 재충전",
                    reversed: "회복 지연, 무기력"
                }
            }
        },
        {
            id: 13,
            name: "죽음",
            image: "death.jpg",
            keywords: ["변화", "종말", "새로운 시작", "변형"],
            meanings: {
                love: {
                    upright: "관계의 변화, 새로운 시작",
                    reversed: "변화 거부, 고착된 관계"
                },
                career: {
                    upright: "경력 전환, 새로운 시작",
                    reversed: "변화 거부, 정체"
                },
                money: {
                    upright: "재정적 변화, 새로운 시작",
                    reversed: "재정적 손실, 변화 거부"
                },
                health: {
                    upright: "생활습관 개선, 변화",
                    reversed: "건강 악화, 변화 거부"
                }
            }
        },
        {
            id: 14,
            name: "절제",
            image: "temperance.jpg",
            keywords: ["균형", "조화", "절제", "인내"],
            meanings: {
                love: {
                    upright: "조화로운 관계, 균형",
                    reversed: "불균형, 극단적 감정"
                },
                career: {
                    upright: "조화로운 업무, 팀워크",
                    reversed: "불화, 갈등"
                },
                money: {
                    upright: "균형잡힌 재정, 절약",
                    reversed: "재정적 불균형, 낭비"
                },
                health: {
                    upright: "건강한 균형, 절제",
                    reversed: "불균형, 과도함"
                }
            }
        },
        {
            id: 15,
            name: "악마",
            image: "devil.jpg",
            keywords: ["속박", "유혹", "집착", "물질주의"],
            meanings: {
                love: {
                    upright: "불건전한 관계, 집착",
                    reversed: "관계 회복, 속박에서 해방"
                },
                career: {
                    upright: "과도한 야망, 중독",
                    reversed: "속박에서 벗어남, 해방"
                },
                money: {
                    upright: "재정적 속박, 과소비",
                    reversed: "재정적 해방, 회복"
                },
                health: {
                    upright: "중독, 나쁜 습관",
                    reversed: "회복, 해방"
                }
            }
        },
        {
            id: 16,
            name: "탑",
            image: "tower.jpg",
            keywords: ["파괴", "급격한 변화", "혼돈", "계시"],
            meanings: {
                love: {
                    upright: "갑작스러운 이별, 관계의 붕괴",
                    reversed: "필요한 파괴, 변화 회피"
                },
                career: {
                    upright: "갑작스러운 변화, 해고",
                    reversed: "피할 수 없는 변화, 지연"
                },
                money: {
                    upright: "재정적 손실, 파산",
                    reversed: "재정적 회복, 손실 회피"
                },
                health: {
                    upright: "갑작스러운 건강 문제",
                    reversed: "느린 회복, 만성 질환"
                }
            }
        },
        {
            id: 17,
            name: "별",
            image: "star.jpg",
            keywords: ["희망", "영감", "평화", "치유"],
            meanings: {
                love: {
                    upright: "희망적인 관계, 영감",
                    reversed: "실망, 희망 상실"
                },
                career: {
                    upright: "꿈의 실현, 창의성",
                    reversed: "의욕 상실, 실망"
                },
                money: {
                    upright: "재정적 희망, 기회",
                    reversed: "재정적 실망, 기회 상실"
                },
                health: {
                    upright: "치유, 회복, 희망",
                    reversed: "회복 지연, 절망"
                }
            }
        },
        {
            id: 18,
            name: "달",
            image: "moon.jpg",
            keywords: ["환상", "불안", "직관", "잠재의식"],
            meanings: {
                love: {
                    upright: "불확실한 관계, 의심",
                    reversed: "속임수 발각, 진실 규명"
                },
                career: {
                    upright: "불안정, 혼란",
                    reversed: "속임수 발각, 명확성"
                },
                money: {
                    upright: "재정적 불안, 사기",
                    reversed: "사기 발각, 진실 발견"
                },
                health: {
                    upright: "정신적 불안, 불면증",
                    reversed: "회복, 안정"
                }
            }
        },
        {
            id: 19,
            name: "태양",
            image: "sun.jpg",
            keywords: ["성공", "기쁨", "행복", "활력"],
            meanings: {
                love: {
                    upright: "행복한 관계, 성공적인 결혼",
                    reversed: "일시적 불화, 과도한 낙관"
                },
                career: {
                    upright: "성공, 인정, 성취",
                    reversed: "과신, 지연된 성공"
                },
                money: {
                    upright: "재정적 성공, 풍요",
                    reversed: "일시적 어려움, 과소비"
                },
                health: {
                    upright: "건강, 활력, 회복",
                    reversed: "일시적 피로, 회복 지연"
                }
            }
        },
        {
            id: 20,
            name: "심판",
            image: "judgement.jpg",
            keywords: ["부활", "각성", "재생", "판단"],
            meanings: {
                love: {
                    upright: "관계의 재평가, 화해",
                    reversed: "후회, 판단 미루기"
                },
                career: {
                    upright: "새로운 소명, 승진",
                    reversed: "잘못된 판단, 기회 상실"
                },
                money: {
                    upright: "재정적 재생, 상환",
                    reversed: "나쁜 재정 판단, 부채"
                },
                health: {
                    upright: "건강 회복, 재생",
                    reversed: "회복 지연, 재발"
                }
            }
        },
        {
            id: 21,
            name: "세계",
            image: "world.jpg",
            keywords: ["완성", "성취", "통합", "여행"],
            meanings: {
                love: {
                    upright: "완벽한 관계, 성취",
                    reversed: "미완성, 불완전한 관계"
                },
                career: {
                    upright: "목표 달성, 성공",
                    reversed: "미완성, 지연"
                },
                money: {
                    upright: "재정적 성취, 풍요",
                    reversed: "불완전한 성공, 지연"
                },
                health: {
                    upright: "완전한 회복, 건강",
                    reversed: "불완전한 회복, 재발"
                }
            }
        },

        // 마이너 아르카나 시작
        // 완드 숫자 카드
        {
            id: "wands-ace",
            name: "완드의 에이스",
            image: "wands-ace.jpg",
            keywords: ["시작", "영감", "잠재력", "창조"],
            meanings: {
                love: {
                    upright: "새로운 열정, 영감",
                    reversed: "지연된 시작, 열정 상실"
                },
                career: {
                    upright: "새로운 기회, 창의성",
                    reversed: "기회 상실, 의욕 저하"
                },
                money: {
                    upright: "새로운 수입원, 기회",
                    reversed: "재정적 지연, 손실"
                },
                health: {
                    upright: "새로운 활력, 회복",
                    reversed: "피로, 무기력"
                }
            }
        },
        {
            id: "wands-2",
            name: "완드의 2",
            image: "wands-02.jpg",
            keywords: ["계획", "결정", "발견", "선택"],
            meanings: {
                love: {
                    upright: "새로운 가능성, 선택",
                    reversed: "우유부단, 선택 어려움"
                },
                career: {
                    upright: "경력 계획, 기회",
                    reversed: "우유부단, 방향성 상실"
                },
                money: {
                    upright: "재정 계획, 투자 기회",
                    reversed: "잘못된 투자, 결정 장애"
                },
                health: {
                    upright: "건강 계획, 결심",
                    reversed: "미루기, 실천 어려움"
                }
            }
        },
        {
            id: "wands-3",
            name: "완드의 3",
            image: "wands-03.jpg",
            keywords: ["준비", "확장", "성장", "모험"],
            meanings: {
                love: {
                    upright: "관계 발전, 성장",
                    reversed: "지연, 성장 방해"
                },
                career: {
                    upright: "경력 성장, 기회 확장",
                    reversed: "지연된 성과, 좌절"
                },
                money: {
                    upright: "투자 성장, 확장",
                    reversed: "손실, 지연된 수익"
                },
                health: {
                    upright: "건강 개선, 활력",
                    reversed: "회복 지연, 피로"
                }
            }
        },
        {
            id: "wands-4",
            name: "완드의 4",
            image: "wands-04.jpg",
            keywords: ["안정", "조화", "완성", "축하"],
            meanings: {
                love: {
                    upright: "안정된 관계, 조화",
                    reversed: "불안정, 불화"
                },
                career: {
                    upright: "성과 달성, 안정",
                    reversed: "불안정, 불완전"
                },
                money: {
                    upright: "재정적 안정, 성과",
                    reversed: "불안정, 손실"
                },
                health: {
                    upright: "건강 안정, 회복",
                    reversed: "불안정, 재발"
                }
            }
        },
        {
            id: "wands-5",
            name: "완드의 5",
            image: "wands-05.jpg",
            keywords: ["경쟁", "갈등", "도전", "열정"],
            meanings: {
                love: {
                    upright: "경쟁, 갈등",
                    reversed: "갈등 해소, 화해"
                },
                career: {
                    upright: "경쟁, 도전",
                    reversed: "과도한 경쟁, 소진"
                },
                money: {
                    upright: "재정적 경쟁, 투쟁",
                    reversed: "재정적 손실, 패배"
                },
                health: {
                    upright: "스트레스, 긴장",
                    reversed: "스트레스 해소, 휴식"
                }
            }
        },
        {
            id: "wands-6",
            name: "완드의 6",
            image: "wands-06.jpg",
            keywords: ["승리", "성공", "인정", "자부심"],
            meanings: {
                love: {
                    upright: "성공적인 관계, 인정",
                    reversed: "자만심, 오만"
                },
                career: {
                    upright: "성공, 승진, 인정",
                    reversed: "과신, 오만"
                },
                money: {
                    upright: "재정적 성공, 보상",
                    reversed: "일시적 성공, 허영"
                },
                health: {
                    upright: "건강 회복, 개선",
                    reversed: "일시적 회복, 재발"
                }
            }
        },
        {
            id: "wands-7",
            name: "완드의 7",
            image: "wands-07.jpg",
            keywords: ["도전", "방어", "결단", "용기"],
            meanings: {
                love: {
                    upright: "관계 수호, 신념",
                    reversed: "방어적 태도, 의심"
                },
                career: {
                    upright: "경쟁 우위, 도전",
                    reversed: "과도한 방어, 패배"
                },
                money: {
                    upright: "재정 방어, 보호",
                    reversed: "재정적 위험, 손실"
                },
                health: {
                    upright: "저항력, 회복",
                    reversed: "약한 면역력, 피로"
                }
            }
        },
        {
            id: "wands-8",
            name: "완드의 8",
            image: "wands-08.jpg",
            keywords: ["속도", "행동", "움직임", "진전"],
            meanings: {
                love: {
                    upright: "빠른 진전, 열정",
                    reversed: "지연, 서두름"
                },
                career: {
                    upright: "빠른 발전, 기회",
                    reversed: "과도한 서두름, 실수"
                },
                money: {
                    upright: "빠른 수익, 성장",
                    reversed: "성급한 투자, 손실"
                },
                health: {
                    upright: "빠른 회복, 개선",
                    reversed: "과로, 소진"
                }
            }
        },
        {
            id: "wands-9",
            name: "완드의 9",
            image: "wands-09.jpg",
            keywords: ["인내", "준비", "방어", "기다림"],
            meanings: {
                love: {
                    upright: "관계 수호, 인내",
                    reversed: "방어적 태도, 고집"
                },
                career: {
                    upright: "준비, 방어적 태도",
                    reversed: "소진, 포기"
                },
                money: {
                    upright: "재정 보호, 준비",
                    reversed: "재정적 부담, 손실"
                },
                health: {
                    upright: "건강 유지, 예방",
                    reversed: "피로, 약화"
                }
            }
        },
        {
            id: "wands-10",
            name: "완드의 10",
            image: "wands-10.jpg",
            keywords: ["부담", "책임", "성취", "완성"],
            meanings: {
                love: {
                    upright: "책임감, 부담",
                    reversed: "과도한 부담, 해방"
                },
                career: {
                    upright: "과도한 업무, 책임",
                    reversed: "소진, 부담 해소"
                },
                money: {
                    upright: "재정적 부담, 책임",
                    reversed: "부채 해소, 해방"
                },
                health: {
                    upright: "스트레스, 부담",
                    reversed: "회복, 해소"
                }
            }
        },
        {
            id: "wands-page",
            name: "완드의 시종",
            image: "wands-page.jpg",
            keywords: ["열정", "모험", "새로운 시작", "메시지"],
            meanings: {
                love: {
                    upright: "새로운 로맨스, 열정",
                    reversed: "지연된 소식, 미숙"
                },
                career: {
                    upright: "새로운 기회, 학습",
                    reversed: "미숙함, 실수"
                },
                money: {
                    upright: "새로운 수입, 기회",
                    reversed: "재정적 미숙, 손실"
                },
                health: {
                    upright: "활력, 회복",
                    reversed: "허약, 피로"
                }
            }
        },
        {
            id: "wands-knight",
            name: "완드의 기사",
            image: "wands-knight.jpg",
            keywords: ["행동", "모험", "열정", "충동"],
            meanings: {
                love: {
                    upright: "열정적인 구애, 모험",
                    reversed: "성급함, 불안정"
                },
                career: {
                    upright: "진취적 행동, 도전",
                    reversed: "충동적 행동, 실패"
                },
                money: {
                    upright: "과감한 투자, 도전",
                    reversed: "충동적 지출, 손실"
                },
                health: {
                    upright: "에너지 충만, 활동",
                    reversed: "과로, 소진"
                }
            }
        },
        {
            id: "wands-queen",
            name: "완드의 여왕",
            image: "wands-queen.jpg",
            keywords: ["열정", "자신감", "매력", "창의성"],
            meanings: {
                love: {
                    upright: "매력적인 관계, 열정",
                    reversed: "질투, 불안정"
                },
                career: {
                    upright: "창의성, 리더십",
                    reversed: "독단, 과신"
                },
                money: {
                    upright: "재정적 창의성, 성공",
                    reversed: "과도한 지출, 손실"
                },
                health: {
                    upright: "활력, 에너지",
                    reversed: "소진, 스트레스"
                }
            }
        },
        {
            id: "wands-king",
            name: "완드의 왕",
            image: "wands-king.jpg",
            keywords: ["비전", "리더십", "창조성", "카리스마"],
            meanings: {
                love: {
                    upright: "열정적 리더십, 보호",
                    reversed: "지배적, 독단적"
                },
                career: {
                    upright: "성공적 리더십, 성취",
                    reversed: "독단, 과신"
                },
                money: {
                    upright: "재정적 성공, 리더십",
                    reversed: "재정적 위험, 과신"
                },
                health: {
                    upright: "강한 생명력, 회복",
                    reversed: "과로, 소진"
                }
            }
        },

        // 컵 숫자 카드
        {
            id: "cups-ace",
            name: "컵의 에이스",
            image: "cups-ace.jpg",
            keywords: ["사랑", "감정", "직관", "새로운 시작"],
            meanings: {
                love: {
                    upright: "새로운 사랑, 감정적 시작",
                    reversed: "감정적 막힘, 실망"
                },
                career: {
                    upright: "창의적 시작, 영감",
                    reversed: "창의력 부족, 무기력"
                },
                money: {
                    upright: "감정적 만족, 풍요",
                    reversed: "재정적 불만족, 손실"
                },
                health: {
                    upright: "정서적 치유, 회복",
                    reversed: "정서적 불안, 우울"
                }
            }
        },
        {
            id: "cups-2",
            name: "컵의 2",
            image: "cups-02.jpg",
            keywords: ["파트너십", "사랑", "균형", "선택"],
            meanings: {
                love: {
                    upright: "로맨틱한 파트너십, 조화",
                    reversed: "불균형한 관계, 갈등"
                },
                career: {
                    upright: "좋은 협력관계, 조화",
                    reversed: "협력 실패, 갈등"
                },
                money: {
                    upright: "재정적 파트너십, 균형",
                    reversed: "재정적 불균형, 갈등"
                },
                health: {
                    upright: "정신적 균형, 조화",
                    reversed: "정신적 불균형, 스트레스"
                }
            }
        },
        {
            id: "cups-3",
            name: "컵의 3",
            image: "cups-03.jpg",
            keywords: ["축하", "기쁨", "우정", "공동체"],
            meanings: {
                love: {
                    upright: "행복한 관계, 축하",
                    reversed: "과도한 즐거움, 실망"
                },
                career: {
                    upright: "팀워크, 성공",
                    reversed: "불화, 실패"
                },
                money: {
                    upright: "재정적 축하, 성공",
                    reversed: "과소비, 낭비"
                },
                health: {
                    upright: "건강한 사회생활, 행복",
                    reversed: "과도한 음주, 불건강"
                }
            }
        },
        {
            id: "cups-4",
            name: "컵의 4",
            image: "cups-04.jpg",
            keywords: ["명상", "재평가", "권태", "불만족"],
            meanings: {
                love: {
                    upright: "관계 재평가, 권태",
                    reversed: "새로운 관심, 변화"
                },
                career: {
                    upright: "직무 불만족, 재평가",
                    reversed: "새로운 기회, 변화"
                },
                money: {
                    upright: "재정적 불만족, 정체",
                    reversed: "새로운 기회, 변화"
                },
                health: {
                    upright: "정신적 피로, 권태",
                    reversed: "회복, 활력"
                }
            }
        },
        {
            id: "cups-5",
            name: "컵의 5",
            image: "cups-05.jpg",
            keywords: ["상실", "실망", "슬픔", "회복"],
            meanings: {
                love: {
                    upright: "실연, 이별",
                    reversed: "회복, 치유"
                },
                career: {
                    upright: "실패, 좌절",
                    reversed: "회복, 새로운 기회"
                },
                money: {
                    upright: "재정적 손실, 실망",
                    reversed: "회복, 개선"
                },
                health: {
                    upright: "우울, 상실감",
                    reversed: "회복, 치유"
                }
            }
        },
        {
            id: "cups-6",
            name: "컵의 6",
            image: "cups-06.jpg",
            keywords: ["과거", "향수", "기억", "재회"],
            meanings: {
                love: {
                    upright: "과거의 사랑, 재회",
                    reversed: "과거 집착, 미련"
                },
                career: {
                    upright: "과거 경험, 재회",
                    reversed: "과거 집착, 정체"
                },
                money: {
                    upright: "과거 이익, 회복",
                    reversed: "과거 손실, 집착"
                },
                health: {
                    upright: "치유, 회복",
                    reversed: "과거 트라우마, 재발"
                }
            }
        },
        {
            id: "cups-7",
            name: "컵의 7",
            image: "cups-07.jpg",
            keywords: ["환상", "선택", "몽상", "혼란"],
            meanings: {
                love: {
                    upright: "로맨틱한 환상, 선택",
                    reversed: "현실 직시, 혼란"
                },
                career: {
                    upright: "다양한 기회, 선택",
                    reversed: "비현실적 기대, 혼란"
                },
                money: {
                    upright: "투자 기회, 선택",
                    reversed: "잘못된 판단, 손실"
                },
                health: {
                    upright: "치료 선택, 대안",
                    reversed: "잘못된 진단, 혼란"
                }
            }
        },
        {
            id: "cups-8",
            name: "컵의 8",
            image: "cups-08.jpg",
            keywords: ["떠남", "변화", "포기", "새로운 방향"],
            meanings: {
                love: {
                    upright: "관계 종료, 새출발",
                    reversed: "망설임, 미루기"
                },
                career: {
                    upright: "이직, 새로운 방향",
                    reversed: "변화 두려움, 정체"
                },
                money: {
                    upright: "재정적 변화, 투자",
                    reversed: "손실 두려움, 정체"
                },
                health: {
                    upright: "생활습관 변화, 개선",
                    reversed: "변화 거부, 정체"
                }
            }
        },
        {
            id: "cups-9",
            name: "컵의 9",
            image: "cups-09.jpg",
            keywords: ["만족", "행복", "충족", "성취"],
            meanings: {
                love: {
                    upright: "행복한 관계, 만족",
                    reversed: "표면적 행복, 불만족"
                },
                career: {
                    upright: "직무 만족, 성취",
                    reversed: "불만족, 권태"
                },
                money: {
                    upright: "재정적 만족, 풍요",
                    reversed: "물질만능, 불만족"
                },
                health: {
                    upright: "건강한 상태, 만족",
                    reversed: "표면적 건강, 불안"
                }
            }
        },
        {
            id: "cups-10",
            name: "컵의 10",
            image: "cups-10.jpg",
            keywords: ["완성된 행복", "가족", "조화", "평화"],
            meanings: {
                love: {
                    upright: "완벽한 사랑, 행복",
                    reversed: "가족 불화, 불완전"
                },
                career: {
                    upright: "완벽한 성취, 조화",
                    reversed: "불완전한 성공, 갈등"
                },
                money: {
                    upright: "재정적 풍요, 안정",
                    reversed: "재정적 불안, 손실"
                },
                health: {
                    upright: "완전한 건강, 행복",
                    reversed: "건강 불안, 걱정"
                }
            }
        },
        {
            id: "cups-page",
            name: "컵의 시종",
            image: "cups-page.jpg",
            keywords: ["감성적 소식", "직관", "새로운 아이디어", "메시지"],
            meanings: {
                love: {
                    upright: "로맨틱한 소식, 고백",
                    reversed: "실망스러운 소식, 거절"
                },
                career: {
                    upright: "창의적 기회, 영감",
                    reversed: "미숙한 아이디어, 실패"
                },
                money: {
                    upright: "재정적 기회, 소식",
                    reversed: "재정적 미숙, 손실"
                },
                health: {
                    upright: "건강한 소식, 회복",
                    reversed: "나쁜 소식, 우려"
                }
            }
        },
        {
            id: "cups-knight",
            name: "컵의 기사",
            image: "cups-knight.jpg",
            keywords: ["로맨스", "매력", "모험", "감성적 제안"],
            meanings: {
                love: {
                    upright: "로맨틱한 제안, 구애",
                    reversed: "불성실, 감정 기복"
                },
                career: {
                    upright: "창의적 제안, 기회",
                    reversed: "비현실적 계획, 실패"
                },
                money: {
                    upright: "재정적 제안, 기회",
                    reversed: "위험한 투자, 손실"
                },
                health: {
                    upright: "감정적 치유, 회복",
                    reversed: "감정적 불안, 스트레스"
                }
            }
        },
        {
            id: "cups-queen",
            name: "컵의 여왕",
            image: "cups-queen.jpg",
            keywords: ["감성", "직관", "양육", "동정심"],
            meanings: {
                love: {
                    upright: "감성적 지지, 이해",
                    reversed: "감정 조종, 과잉보호"
                },
                career: {
                    upright: "감성 지능, 창의성",
                    reversed: "감정적 불안정, 혼란"
                },
                money: {
                    upright: "직관적 투자, 풍요",
                    reversed: "감정적 소비, 낭비"
                },
                health: {
                    upright: "정서적 안정, 치유",
                    reversed: "감정적 불안, 우울"
                }
            }
        },
        {
            id: "cups-king",
            name: "컵의 왕",
            image: "cups-king.jpg",
            keywords: ["감성적 통제", "창의성", "지혜", "조화"],
            meanings: {
                love: {
                    upright: "감정적 성숙, 지지",
                    reversed: "감정 조절 실패, 조종"
                },
                career: {
                    upright: "창의적 리더십, 조화",
                    reversed: "감정적 불안정, 혼란"
                },
                money: {
                    upright: "현명한 재정 관리, 성공",
                    reversed: "재정적 불안정, 손실"
                },
                health: {
                    upright: "정서적 안정, 균형",
                    reversed: "정서적 불안, 스트레스"
                }
            }
        },

        // 소드 숫자 카드
        {
            id: "swords-ace",
            name: "소드의 에이스",
            image: "swords-ace.jpg",
            keywords: ["진실", "명확성", "통찰", "돌파구"],
            meanings: {
                love: {
                    upright: "명확한 의사소통, 진실",
                    reversed: "혼란, 거짓"
                },
                career: {
                    upright: "새로운 아이디어, 돌파구",
                    reversed: "혼란, 실패"
                },
                money: {
                    upright: "명확한 판단, 기회",
                    reversed: "잘못된 판단, 손실"
                },
                health: {
                    upright: "정확한 진단, 치료",
                    reversed: "잘못된 진단, 악화"
                }
            }
        },
        {
            id: "swords-2",
            name: "소드의 2",
            image: "swords-02.jpg",
            keywords: ["결정", "균형", "교착상태", "선택"],
            meanings: {
                love: {
                    upright: "어려운 선택, 균형",
                    reversed: "우유부단, 갈등"
                },
                career: {
                    upright: "중요한 결정, 균형",
                    reversed: "결정 불가, 혼란"
                },
                money: {
                    upright: "재정적 선택, 균형",
                    reversed: "재정적 갈등, 손실"
                },
                health: {
                    upright: "치료 선택, 균형",
                    reversed: "결정 어려움, 악화"
                }
            }
        },
        {
            id: "swords-3",
            name: "소드의 3",
            image: "swords-03.jpg",
            keywords: ["상처", "고통", "슬픔", "이별"],
            meanings: {
                love: {
                    upright: "심적 고통, 이별",
                    reversed: "회복, 치유"
                },
                career: {
                    upright: "실패, 좌절",
                    reversed: "회복, 극복"
                },
                money: {
                    upright: "재정적 손실, 고통",
                    reversed: "회복, 개선"
                },
                health: {
                    upright: "질병, 고통",
                    reversed: "회복, 치유"
                }
            }
        },
        {
            id: "swords-4",
            name: "소드의 4",
            image: "swords-04.jpg",
            keywords: ["휴식", "명상", "회복", "재충전"],
            meanings: {
                love: {
                    upright: "관계의 휴식, 성찰",
                    reversed: "불안, 스트레스"
                },
                career: {
                    upright: "휴식, 재충전",
                    reversed: "소진, 과로"
                },
                money: {
                    upright: "재정적 휴식, 계획",
                    reversed: "재정적 불안, 스트레스"
                },
                health: {
                    upright: "휴식, 회복",
                    reversed: "불면증, 불안"
                }
            }
        },
        {
            id: "swords-5",
            name: "소드의 5",
            image: "swords-05.jpg",
            keywords: ["패배", "갈등", "손실", "경쟁"],
            meanings: {
                love: {
                    upright: "갈등, 다툼",
                    reversed: "화해, 회복"
                },
                career: {
                    upright: "경쟁, 갈등",
                    reversed: "갈등 해소, 화해"
                },
                money: {
                    upright: "재정적 손실, 갈등",
                    reversed: "손실 회복, 개선"
                },
                health: {
                    upright: "스트레스, 갈등",
                    reversed: "회복, 개선"
                }
            }
        },
        {
            id: "swords-6",
            name: "소드의 6",
            image: "swords-06.jpg",
            keywords: ["전환", "여행", "회복", "변화"],
            meanings: {
                love: {
                    upright: "관계의 전환, 회복",
                    reversed: "정체, 미루기"
                },
                career: {
                    upright: "이직, 전환",
                    reversed: "변화 거부, 정체"
                },
                money: {
                    upright: "재정적 회복, 개선",
                    reversed: "재정적 정체, 악화"
                },
                health: {
                    upright: "건강 회복, 개선",
                    reversed: "회복 지연, 악화"
                }
            }
        },
        {
            id: "swords-7",
            name: "소드의 7",
            image: "swords-07.jpg",
            keywords: ["속임수", "전략", "계획", "배신"],
            meanings: {
                love: {
                    upright: "속임수, 배신",
                    reversed: "진실 발각, 해방"
                },
                career: {
                    upright: "부정직, 속임수",
                    reversed: "진실 발각, 개선"
                },
                money: {
                    upright: "재정적 사기, 손실",
                    reversed: "사기 발각, 회복"
                },
                health: {
                    upright: "잘못된 진단, 불신",
                    reversed: "진실 발견, 회복"
                }
            }
        },
        {
            id: "swords-8",
            name: "소드의 8",
            image: "swords-08.jpg",
            keywords: ["제한", "속박", "고립", "무력감"],
            meanings: {
                love: {
                    upright: "관계의 속박, 제한",
                    reversed: "해방, 자유"
                },
                career: {
                    upright: "업무 제한, 속박",
                    reversed: "해방, 개선"
                },
                money: {
                    upright: "재정적 제한, 구속",
                    reversed: "재정적 자유, 회복"
                },
                health: {
                    upright: "건강 제한, 속박",
                    reversed: "회복, 자유"
                }
            }
        },
        {
            id: "swords-9",
            name: "소드의 9",
            image: "swords-09.jpg",
            keywords: ["불안", "걱정", "악몽", "두려움"],
            meanings: {
                love: {
                    upright: "관계 불안, 걱정",
                    reversed: "불안 해소, 회복"
                },
                career: {
                    upright: "업무 스트레스, 불안",
                    reversed: "스트레스 해소, 개선"
                },
                money: {
                    upright: "재정적 불안, 걱정",
                    reversed: "불안 해소, 안정"
                },
                health: {
                    upright: "건강 불안, 걱정",
                    reversed: "불안 해소, 회복"
                }
            }
        },
        {
            id: "swords-10",
            name: "소드의 10",
            image: "swords-10.jpg",
            keywords: ["종말", "패배", "고통의 끝", "새로운 시작"],
            meanings: {
                love: {
                    upright: "관계의 종말, 고통",
                    reversed: "회복, 새로운 시작"
                },
                career: {
                    upright: "실패, 종말",
                    reversed: "새로운 시작, 회복"
                },
                money: {
                    upright: "재정적 파탄, 손실",
                    reversed: "재정적 회복, 개선"
                },
                health: {
                    upright: "심각한 질병, 위기",
                    reversed: "회복, 치유"
                }
            }
        },
        {
            id: "swords-page",
            name: "소드의 시종",
            image: "swords-page.jpg",
            keywords: ["지적 호기심", "새로운 아이디어", "진실", "통찰"],
            meanings: {
                love: {
                    upright: "솔직한 대화, 진실",
                    reversed: "잘못된 소통, 거짓"
                },
                career: {
                    upright: "새로운 아이디어, 학습",
                    reversed: "미숙함, 실수"
                },
                money: {
                    upright: "재정적 학습, 조언",
                    reversed: "잘못된 조언, 실수"
                },
                health: {
                    upright: "건강 정보, 조언",
                    reversed: "잘못된 정보, 오진"
                }
            }
        },
        {
            id: "swords-knight",
            name: "소드의 기사",
            image: "swords-knight.jpg",
            keywords: ["행동", "공격성", "직설적", "진취성"],
            meanings: {
                love: {
                    upright: "직설적 표현, 진취성",
                    reversed: "공격성, 상처"
                },
                career: {
                    upright: "빠른 행동, 진취성",
                    reversed: "성급함, 실수"
                },
                money: {
                    upright: "과감한 투자, 행동",
                    reversed: "무모한 투자, 손실"
                },
                health: {
                    upright: "적극적 치료, 행동",
                    reversed: "무모한 행동, 악화"
                }
            }
        },
        {
            id: "swords-queen",
            name: "소드의 여왕",
            image: "swords-queen.jpg",
            keywords: ["지성", "독립성", "직설적", "명확성"],
            meanings: {
                love: {
                    upright: "명확한 소통, 독립성",
                    reversed: "냉정함, 비판"
                },
                career: {
                    upright: "지적 능력, 분석력",
                    reversed: "과도한 비판, 냉정"
                },
                money: {
                    upright: "현명한 판단, 분석",
                    reversed: "냉정한 판단, 실수"
                },
                health: {
                    upright: "명확한 진단, 분석",
                    reversed: "과도한 걱정, 불안"
                }
            }
        },
        {
            id: "swords-king",
            name: "소드의 왕",
            image: "swords-king.jpg",
            keywords: ["지성", "권위", "진실", "리더십"],
            meanings: {
                love: {
                    upright: "이성적 판단, 진실",
                    reversed: "냉정, 무자비"
                },
                career: {
                    upright: "지적 리더십, 권위",
                    reversed: "독단, 가혹함"
                },
                money: {
                    upright: "현명한 판단, 성공",
                    reversed: "냉정한 결정, 손실"
                },
                health: {
                    upright: "정확한 진단, 치료",
                    reversed: "잘못된 판단, 악화"
                }
            }
        },

        // 펜타클 숫자 카드
        {
            id: "pentacles-ace",
            name: "펜타클의 에이스",
            image: "pentacles-ace.jpg",
            keywords: ["물질적 시작", "번영", "풍요", "안정"],
            meanings: {
                love: {
                    upright: "안정적 관계, 물질적 풍요",
                    reversed: "물질적 불안, 불안정"
                },
                career: {
                    upright: "새로운 기회, 성공",
                    reversed: "기회 상실, 실패"
                },
                money: {
                    upright: "재정적 기회, 풍요",
                    reversed: "재정적 손실, 실패"
                },
                health: {
                    upright: "건강 회복, 안정",
                    reversed: "건강 악화, 불안"
                }
            }
        },
        {
            id: "pentacles-2",
            name: "펜타클의 2",
            image: "pentacles-02.jpg",
            keywords: ["균형", "적응", "유연성", "변화"],
            meanings: {
                love: {
                    upright: "관계의 균형, 조화",
                    reversed: "불균형, 갈등"
                },
                career: {
                    upright: "일과 삶의 균형",
                    reversed: "불균형, 과로"
                },
                money: {
                    upright: "재정적 균형, 관리",
                    reversed: "재정적 불균형, 혼란"
                },
                health: {
                    upright: "건강한 균형, 조화",
                    reversed: "불균형, 스트레스"
                }
            }
        },
        {
            id: "pentacles-3",
            name: "펜타클의 3",
            image: "pentacles-03.jpg",
            keywords: ["숙련", "협력", "품질", "성장"],
            meanings: {
                love: {
                    upright: "관계 발전, 성장",
                    reversed: "미숙한 관계, 정체"
                },
                career: {
                    upright: "전문성 향상, 성장",
                    reversed: "미숙함, 실수"
                },
                money: {
                    upright: "재정적 성장, 발전",
                    reversed: "재정적 미숙, 손실"
                },
                health: {
                    upright: "건강 개선, 회복",
                    reversed: "회복 지연, 악화"
                }
            }
        },
        {
            id: "pentacles-4",
            name: "펜타클의 4",
            image: "pentacles-04.jpg",
            keywords: ["안정", "보안", "소유", "통제"],
            meanings: {
                love: {
                    upright: "안정적 관계, 보안",
                    reversed: "과도한 통제, 집착"
                },
                career: {
                    upright: "직업 안정, 보안",
                    reversed: "정체, 고착"
                },
                money: {
                    upright: "재정적 안정, 저축",
                    reversed: "과도한 절약, 인색"
                },
                health: {
                    upright: "안정적 건강, 관리",
                    reversed: "과도한 걱정, 강박"
                }
            }
        },
        {
            id: "pentacles-5",
            name: "펜타클의 5",
            image: "pentacles-05.jpg",
            keywords: ["어려움", "빈곤", "고립", "걱정"],
            meanings: {
                love: {
                    upright: "물질적 어려움, 걱정",
                    reversed: "상황 개선, 회복"
                },
                career: {
                    upright: "실직, 어려움",
                    reversed: "상황 개선, 기회"
                },
                money: {
                    upright: "재정적 어려움, 손실",
                    reversed: "재정 회복, 개선"
                },
                health: {
                    upright: "건강 악화, 걱정",
                    reversed: "건강 회복, 개선"
                }
            }
        },
        {
            id: "pentacles-6",
            name: "펜타클의 6",
            image: "pentacles-06.jpg",
            keywords: ["선물", "관용", "나눔", "수확"],
            meanings: {
                love: {
                    upright: "관계의 선물, 나눔",
                    reversed: "불균형한 주고받음"
                },
                career: {
                    upright: "보상, 인정",
                    reversed: "부적절한 보상, 불만"
                },
                money: {
                    upright: "재정적 도움, 선물",
                    reversed: "빚, 의존"
                },
                health: {
                    upright: "건강 회복, 도움",
                    reversed: "불완전한 회복"
                }
            }
        },
        {
            id: "pentacles-7",
            name: "펜타클의 7",
            image: "pentacles-07.jpg",
            keywords: ["인내", "투자", "발전", "평가"],
            meanings: {
                love: {
                    upright: "관계 발전, 인내",
                    reversed: "성급함, 실망"
                },
                career: {
                    upright: "경력 개발, 성장",
                    reversed: "지연된 성과, 좌절"
                },
                money: {
                    upright: "장기 투자, 인내",
                    reversed: "잘못된 투자, 손실"
                },
                health: {
                    upright: "점진적 회복, 인내",
                    reversed: "회복 지연, 좌절"
                }
            }
        },
        {
            id: "pentacles-8",
            name: "펜타클의 8",
            image: "pentacles-08.jpg",
            keywords: ["숙련", "완성도", "세부사항", "전문성"],
            meanings: {
                love: {
                    upright: "관계 발전, 헌신",
                    reversed: "완벽주의, 강박"
                },
                career: {
                    upright: "전문성 향상, 숙련",
                    reversed: "과도한 업무, 소진"
                },
                money: {
                    upright: "재정적 숙련, 성장",
                    reversed: "과도한 절약, 강박"
                },
                health: {
                    upright: "건강 관리, 개선",
                    reversed: "과도한 관리, 강박"
                }
            }
        },
        {
            id: "pentacles-9",
            name: "펜타클의 9",
            image: "pentacles-09.jpg",
            keywords: ["풍요", "독립", "자급자족", "성취"],
            meanings: {
                love: {
                    upright: "독립적 관계, 풍요",
                    reversed: "의존성, 불안정"
                },
                career: {
                    upright: "성공, 독립",
                    reversed: "과도한 일, 불만족"
                },
                money: {
                    upright: "재정적 독립, 풍요",
                    reversed: "재정적 불안, 손실"
                },
                health: {
                    upright: "건강한 생활, 자립",
                    reversed: "건강 불안, 의존"
                }
            }
        },
        {
            id: "pentacles-10",
            name: "펜타클의 10",
            image: "pentacles-10.jpg",
            keywords: ["부", "안정", "가족", "유산"],
            meanings: {
                love: {
                    upright: "안정된 가정, 풍요",
                    reversed: "가족 갈등, 불안정"
                },
                career: {
                    upright: "경력 성공, 안정",
                    reversed: "경력 정체, 불만족"
                },
                money: {
                    upright: "재정적 풍요, 유산",
                    reversed: "재정적 손실, 파산"
                },
                health: {
                    upright: "건강한 생활, 안정",
                    reversed: "건강 악화, 불안"
                }
            }
        },
        {
            id: "pentacles-page",
            name: "펜타클의 시종",
            image: "pentacles-page.jpg",
            keywords: ["학습", "실용성", "신중함", "기회"],
            meanings: {
                love: {
                    upright: "실용적 관계, 학습",
                    reversed: "미숙한 관계, 실수"
                },
                career: {
                    upright: "새로운 학습, 기회",
                    reversed: "미숙함, 실수"
                },
                money: {
                    upright: "재정 학습, 기회",
                    reversed: "재정적 미숙, 실수"
                },
                health: {
                    upright: "건강 학습, 개선",
                    reversed: "잘못된 습관, 악화"
                }
            }
        },
        {
            id: "pentacles-knight",
            name: "펜타클의 기사",
            image: "pentacles-knight.jpg",
            keywords: ["신중함", "책임감", "효율성", "헌신"],
            meanings: {
                love: {
                    upright: "신중한 관계, 헌신",
                    reversed: "느린 진전, 게으름"
                },
                career: {
                    upright: "책임감, 효율성",
                    reversed: "게으름, 비효율"
                },
                money: {
                    upright: "신중한 투자, 관리",
                    reversed: "잘못된 투자, 낭비"
                },
                health: {
                    upright: "꾸준한 관리, 개선",
                    reversed: "건강 관리 소홀"
                }
            }
        },
        {
            id: "pentacles-queen",
            name: "펜타클의 여왕",
            image: "pentacles-queen.jpg",
            keywords: ["풍요", "실용성", "안정", "관리"],
            meanings: {
                love: {
                    upright: "안정적 관계, 풍요",
                    reversed: "물질주의, 불안정"
                },
                career: {
                    upright: "실용적 성공, 안정",
                    reversed: "비효율, 불안정"
                },
                money: {
                    upright: "재정적 안정, 풍요",
                    reversed: "재정적 불안, 손실"
                },
                health: {
                    upright: "건강 관리, 안정",
                    reversed: "건강 악화, 불안"
                }
            }
        },
        {
            id: "pentacles-king",
            name: "펜타클의 왕",
            image: "pentacles-king.jpg",
            keywords: ["부", "성공", "사업가", "안정"],
            meanings: {
                love: {
                    upright: "안정적 관계, 성공",
                    reversed: "물질주의, 통제"
                },
                career: {
                    upright: "사업 성공, 리더십",
                    reversed: "과도한 통제, 실패"
                },
                money: {
                    upright: "재정적 성공, 풍요",
                    reversed: "재정적 손실, 파산"
                },
                health: {
                    upright: "건강한 생활, 안정",
                    reversed: "건강 악화, 스트레스"
                }
            }
        }
    ]
};

// 데이터 내보내기
export default tarotData;
