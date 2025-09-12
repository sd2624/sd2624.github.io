// 중국어 간체 MBTI 결과 데이터
window.mbtiResults = {
    INTJ: {
        title: "建筑师",
        description: "富有想象力和战略思维的你，对每件事都有计划。",
        strengths: ["独立", "创造性", "果断", "完美主义", "战略思维"],
        weaknesses: ["固执", "批判性", "完美主义压力", "情感表达困难"],
        compatible: ["ENFP", "ENTP", "INFJ"],
        famous: "埃隆·马斯克, 马克·扎克伯格, 尼古拉·特斯拉"
    },
    INTP: {
        title: "逻辑学家",
        description: "创新的发明家，对知识有着无尽的渴望。",
        strengths: ["逻辑性", "客观", "独创性", "灵活思维", "求知欲"],
        weaknesses: ["优柔寡断", "冷漠", "情感迟钝", "忽视规则", "缺乏实用性"],
        compatible: ["ENTJ", "ESTJ", "INFJ"],
        famous: "阿尔伯特·爱因斯坦, 比尔·盖茨, 查尔斯·达尔文"
    },
    ENTJ: {
        title: "指挥官",
        description: "大胆、富有想象力的强意志领导者，总能找到或创造出路。",
        strengths: ["领导力", "效率", "自信", "战略性", "果断"],
        weaknesses: ["急躁", "固执", "情感迟钝", "专制", "批判性"],
        compatible: ["INFP", "INTP", "ENFJ"],
        famous: "史蒂夫·乔布斯, 戈登·拉姆齐, 拿破仑"
    },
    ENTP: {
        title: "辩论家",
        description: "聪明好奇的思想家，无法抗拒智力挑战。",
        strengths: ["创造性", "热情", "魅力", "智慧", "适应力"],
        weaknesses: ["注意力不集中", "压力敏感", "好争论", "缺乏实用性", "讨厌例行公事"],
        compatible: ["INFJ", "INTJ", "ENFJ"],
        famous: "托马斯·爱迪生, 列奥纳多·达·芬奇, 马克·吐温"
    },
    INFJ: {
        title: "提倡者",
        description: "善意的倡导者，总是为理想而努力的理想主义者。",
        strengths: ["同理心", "直觉", "理想主义", "追求和谐", "深度思考"],
        weaknesses: ["完美主义", "敏感", "隐私保护", "倦怠", "决策困难"],
        compatible: ["ENTP", "ENFP", "INTJ"],
        famous: "特蕾莎修女, 马丁·路德·金, 纳尔逊·曼德拉"
    },
    INFP: {
        title: "调停者",
        description: "诗意而善良的利他主义者，总是准备为善事而行动。",
        strengths: ["创造性", "理想主义", "开放", "热情", "奉献"],
        weaknesses: ["不现实", "对批评敏感", "决策困难", "自我批评", "需要个人空间"],
        compatible: ["ENFJ", "ENTJ", "ESFJ"],
        famous: "莎士比亚, 约翰尼·德普, 奥黛丽·赫本"
    },
    ENFJ: {
        title: "主人公",
        description: "富有魅力和启发性的领导者，能够迷住听众。",
        strengths: ["魅力", "利他", "天生领导者", "可靠", "宽容"],
        weaknesses: ["过度理想主义", "过度敏感", "对变化敏感", "自我牺牲", "决策困难"],
        compatible: ["INFP", "ISFP", "ENTP"],
        famous: "奥普拉·温弗瑞, 巴拉克·奥巴马, 玛雅·安吉洛"
    },
    ENFP: {
        title: "活动家",
        description: "热情创造的社交自由灵魂，总能找到微笑的理由。",
        strengths: ["热情", "创造性", "社交", "自由精神", "友善"],
        weaknesses: ["注意力不集中", "压力脆弱", "过度情绪化", "独立性问题", "缺乏实用性"],
        compatible: ["INFJ", "INTJ", "ENFJ"],
        famous: "罗宾·威廉姆斯, 艾伦·德杰尼勒斯, 华特·迪士尼"
    },
    ISTJ: {
        title: "物流师",
        description: "实用和事实导向，可靠负责。",
        strengths: ["责任感", "实用", "勤奋", "冷静", "忠诚"],
        weaknesses: ["固执", "判断性", "自我批评", "责备他人", "抗拒新事物"],
        compatible: ["ESFP", "ESTP", "ISFJ"],
        famous: "乔治·华盛顿, 沃伦·巴菲特, 伊丽莎白二世"
    },
    ISFJ: {
        title: "守护者",
        description: "温暖心灵和奉献精神，总是准备保护所爱的人。",
        strengths: ["支持性", "可靠", "耐心", "勤奋", "热情"],
        weaknesses: ["谦逊", "过度利他", "情感压抑", "过载", "完美主义"],
        compatible: ["ESFP", "ESTP", "ISTJ"],
        famous: "特蕾莎修女, 罗莎·帕克斯, 凯特·米德尔顿"
    },
    ESTJ: {
        title: "总经理",
        description: "优秀的管理者，在管理事物或人方面无人能及。",
        strengths: ["奉献", "意志坚强", "直接", "忠诚", "耐心"],
        weaknesses: ["顽固", "难以放松", "情感表达困难", "重视地位", "创新困难"],
        compatible: ["ISFP", "ISTP", "ESFJ"],
        famous: "富兰克林·罗斯福, 约翰·D·洛克菲勒, 艾玛·沃森"
    },
    ESFJ: {
        title: "执政官",
        description: "非常关心、社交和受欢迎的人，总是急于帮助。",
        strengths: ["强实用技能", "强责任感", "非常忠诚", "敏感温暖", "良好合作者"],
        weaknesses: ["担心很多", "对批评脆弱", "忽视个人需求", "难以拒绝", "过度利他"],
        compatible: ["ISFP", "ISTP", "ESTJ"],
        famous: "泰勒·斯威夫特, 休·杰克曼, 史蒂夫·哈维"
    },
    ISTP: {
        title: "鉴赏家",
        description: "大胆实用的实验者，掌握各种工具。",
        strengths: ["乐观", "精力充沛", "创造性", "实用", "自发"],
        weaknesses: ["固执", "迟钝", "重视隐私", "容易厌倦", "冒险行为"],
        compatible: ["ESFJ", "ESTJ", "ISFP"],
        famous: "迈克尔·乔丹, 汤姆·克鲁斯, 斯嘉丽·约翰逊"
    },
    ISFP: {
        title: "探险家",
        description: "灵活迷人的艺术家，总是准备探索新的可能性。",
        strengths: ["迷人", "艺术性", "自然", "好奇", "热情"],
        weaknesses: ["敏感", "独立性", "不可预测", "压力", "避免过度竞争"],
        compatible: ["ENFJ", "ESFJ", "ESTJ"],
        famous: "迈克尔·杰克逊, 普林斯, 鲍勃·迪伦"
    },
    ESTP: {
        title: "企业家",
        description: "聪明、精力充沛、非常敏锐的人，真正享受生活。",
        strengths: ["大胆", "理性", "实用", "原创", "敏锐"],
        weaknesses: ["缺乏耐心", "冒险", "缺乏结构", "注意力不集中", "敏感"],
        compatible: ["ISFJ", "ISTJ", "ESFP"],
        famous: "唐纳德·特朗普, 欧内斯特·海明威, 麦当娜"
    },
    ESFP: {
        title: "表演者",
        description: "自发、精力充沛、热情的人——和他们在一起生活从不无聊。",
        strengths: ["大胆", "实用", "原创", "观察力", "优秀人际技能"],
        weaknesses: ["敏感", "避免冲突", "注意力不集中", "压力", "独立性"],
        compatible: ["ISFJ", "ISTJ", "ESTP"],
        famous: "威尔·史密斯, 玛丽莲·梦露, 埃尔顿·约翰"
    }
};
