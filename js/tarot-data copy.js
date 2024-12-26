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
        }

    ]
};

// 데이터 내보내기
export default tarotData;
