// Traditional Chinese MBTI Results Data
window.mbtiResults = {
    INTJ: {
        title: "建築師",
        description: "富有想像力的戰略思想家，對任何事情都有計劃。",
        strengths: ["獨立", "創意", "果斷", "完美主義", "戰略思維"],
        weaknesses: ["頑固", "批判", "完美主義壓力", "難以表達情感"],
        compatible: ["ENFP", "ENTP", "INFJ"],
        famous: "伊隆·馬斯克, 馬克·祖克伯格, 尼古拉·特斯拉"
    },
    INTP: {
        title: "思想家",
        description: "創新的發明家，對知識有著永不滿足的渴望。",
        strengths: ["邏輯", "客觀", "原創", "靈活思維", "智力好奇心"],
        weaknesses: ["猶豫不決", "漠不關心", "情感不敏感", "忽視規則", "缺乏實用性"],
        compatible: ["ENTJ", "ESTJ", "INFJ"],
        famous: "阿爾伯特·愛因斯坦, 比爾·蓋茲, 查爾斯·達爾文"
    },
    ENTJ: {
        title: "指揮官",
        description: "大膽、富有想像力和意志堅強的領導者，總是找到或創造一條道路。",
        strengths: ["領導力", "效率", "自信", "戰略", "果斷"],
        weaknesses: ["不耐煩", "頑固", "情感不敏感", "支配性", "批判"],
        compatible: ["INFP", "INTP", "ENFJ"],
        famous: "史蒂夫·賈伯斯, 戈登·拉姆齊, 拿破崙"
    },
    ENTP: {
        title: "辯論家",
        description: "聰明好奇的思想家，無法抗拒智力挑戰。",
        strengths: ["創意", "熱情", "魅力", "智力", "適應性"],
        weaknesses: ["缺乏專注", "對壓力敏感", "爭論性", "缺乏實用性", "討厭常規"],
        compatible: ["INFJ", "INTJ", "ENFJ"],
        famous: "湯瑪斯·愛迪生, 李奧納多·達文西, 馬克·吐溫"
    },
    INFJ: {
        title: "提倡者",
        description: "安靜而神秘的理想主義者，但非常鼓舞人心且不知疲倦。",
        strengths: ["理想主義", "洞察力", "決心", "同理心", "創意"],
        weaknesses: ["敏感", "極其私密", "完美主義", "總是需要一個目標", "容易疲勞"],
        compatible: ["ENTP", "ENFP", "INTJ"],
        famous: "馬丁·路德·金恩, 納爾遜·曼德拉, 德蕾莎修女"
    },
    INFP: {
        title: "調停者",
        description: "詩意的利他主義者和善良的人，總是渴望幫助好的事業。",
        strengths: ["理想主義", "同理心", "創意", "靈活", "善良"],
        weaknesses: ["過於理想主義", "過於利他", "不切實際", "缺乏組織", "難以了解"],
        compatible: ["ENFJ", "ENTJ", "INFJ"],
        famous: "威廉·莎士比亞, J.R.R. 托爾金, 維吉尼亞·吳爾芙"
    },
    ENFJ: {
        title: "主角",
        description: "魅力十足且鼓舞人心的領導者，能夠迷住聽眾。",
        strengths: ["領導力", "同理心", "鼓舞", "溝通", "魅力"],
        weaknesses: ["過於理想主義", "過於敏感", "自尊心波動", "難以做出艱難決定"],
        compatible: ["INFP", "ISFP", "ENTP"],
        famous: "巴拉克·歐巴馬, 歐普拉·溫芙蕾, 約翰·藍儂"
    },
    ENFP: {
        title: "活動家",
        description: "熱情、創意和社交的自由精神，總能找到微笑的理由。",
        strengths: ["熱情", "創意", "社交", "靈活", "善良"],
        weaknesses: ["尋求認可", "缺乏組織", "壓力", "情緒化", "獨立"],
        compatible: ["INTJ", "INFJ", "ENTJ"],
        famous: "羅賓·威廉斯, 艾倫·狄珍妮, 華特·迪士尼"
    },
    ISTJ: {
        title: "後勤人員",
        description: "實用且以事實為導向，可靠性毋庸置疑。",
        strengths: ["誠實", "直接", "意志堅強", "非常負責", "冷靜"],
        weaknesses: ["頑固", "不敏感", "總是按規則", "評判", "經常自責"],
        compatible: ["ESFP", "ESTP", "ISFP"],
        famous: "華倫·巴菲特, 伊莉莎白二世女王, 喬治·華盛頓"
    },
    ISFJ: {
        title: "保護者",
        description: "非常忠誠溫暖的保護者，總是準備保衛親愛的人。",
        strengths: ["支持", "可靠", "耐心", "富有想像力", "觀察力"],
        weaknesses: ["謙虛", "壓抑感情", "超負荷", "不願改變", "過於利他"],
        compatible: ["ESTP", "ESFP", "ENFP"],
        famous: "德蕾莎修女, 凱特·密道頓, 吉米·卡特"
    },
    ESTJ: {
        title: "總經理",
        description: "優秀的管理者，在管理事物或人員方面無人能敵。",
        strengths: ["專注", "意志堅強", "直接", "誠實", "忠誠"],
        weaknesses: ["不靈活", "對不尋常的事物感到不舒服", "評判", "過於關注社會地位"],
        compatible: ["ISFP", "ISTP", "INFP"],
        famous: "法蘭克·辛納屈, 約翰·D·洛克菲勒, 林登·詹森"
    },
    ESFJ: {
        title: "執政官",
        description: "非常關懷、社交和受歡迎，總是渴望幫助。",
        strengths: ["強烈的實用感", "強烈的責任感", "非常忠誠", "敏感", "溫暖"],
        weaknesses: ["擔心社會地位", "不靈活", "不願改變", "容易受到批評傷害"],
        compatible: ["ISFP", "INFP", "ESTP"],
        famous: "比爾·柯林頓, 史蒂夫·哈維, 薩拉·裴琳"
    },
    ISTP: {
        title: "巧匠",
        description: "大膽實用的實驗者，是各種工具的大師。",
        strengths: ["樂觀", "創意", "實用", "自發", "理性"],
        weaknesses: ["頑固", "不敏感", "私密", "保守", "容易無聊"],
        compatible: ["ESTJ", "ENTJ", "ESFJ"],
        famous: "克林·伊斯威特, 湯姆·克魯斯, 丹尼爾·克雷格"
    },
    ISFP: {
        title: "冒險家",
        description: "靈活迷人的藝術家，總是準備探索新的可能性。",
        strengths: ["迷人", "對他人敏感", "富有想像力", "熱情", "好奇"],
        weaknesses: ["容易壓力", "過於競爭", "自尊心波動", "獨立"],
        compatible: ["ESTJ", "ESFJ", "ENFJ"],
        famous: "奧黛麗·赫本, 芭芭拉·史翠珊, 賈桂琳·甘迺迪·歐納西斯"
    },
    ESTP: {
        title: "企業家",
        description: "聰明、精力充沛且非常敏銳，真正享受生活在邊緣。",
        strengths: ["大膽", "理性", "實用", "原創", "敏銳"],
        weaknesses: ["不敏感", "不耐煩", "冒險", "無結構", "可能錯過大局"],
        compatible: ["ISFJ", "ISTJ", "INFJ"],
        famous: "歐內斯特·海明威, 傑克·尼克遜, 瑪丹娜"
    },
    ESFP: {
        title: "表演者",
        description: "自發、精力充沛且熱情，生活在他們周圍從不無聊。",
        strengths: ["大膽", "原創", "美學", "實用技能", "觀察力"],
        weaknesses: ["敏感", "避免衝突", "容易無聊", "長期規劃差"],
        compatible: ["ISTJ", "ISFJ", "INTJ"],
        famous: "瑪麗蓮·夢露, 貓王, 傑米·福克斯"
    }
};
