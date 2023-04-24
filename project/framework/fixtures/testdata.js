export const textToDetect = {
    word: {
        fr: {el:"succès",code:"fr",name:"FRENCH"},
        de: {el:"Erfolg",code:"de",name:"GERMAN"},
        ko: {el:"성공",code:"ko",name:"KOREAN"},
        xh: {el:"impumelelo",code:"xh",name:"XHOSA"},
        ky: {el:"ийгилик",code:"ky",name:"KYRGYZ"},
        eo: {el:"sukceson",code:"eo",name:"ESPERANTO"},
        zh: {el:"成功",code:"zh",name:"CHINESE_SIMPLIFIED"},
        ar: {el:"نجاح",code:"ar",name:"ARABIC"},
        bn: {el:"সাফল্য",code:"bn",name:"BENGALI"},
        el: {el:"επιτυχία",code:"el",name:"GREEK"},
        mg: {el:"FETY",code:"mg",name:"MALAGASY"},
        tr: {el:"başarı",code:"tr",name:"TURKISH"}
    },
    sentence: {
        fr: {el:"Nous croyons que la clé du succès est le travail acharné et la confiance en soi. Nos étudiants ont surmonté de nombreux obstacles avant d'atteindre leurs objectifs de carrière.",code:"fr",name:"FRENCH"},
        de: {el:"Wir glauben, dass der Schlüssel zum Erfolg harte Arbeit und Selbstvertrauen sind. Unsere Studenten haben viele Hindernisse überwunden, bevor sie ihre Karriereziele erreicht haben.",code:"de",name:"GERMAN"},
        ko: {el:"성공의 열쇠는 노력과 자신감이라고 믿습니다. 우리 학생들은 경력 목표를 달성하기 전에 많은 장애물을 극복했습니다.",code:"ko",name:"KOREAN"},
        xh: {el:"Sikholelwa ukuba isitshixo sempumelelo kukusebenza nzima kunye nokuzithemba. Abafundi bethu boyise imiqobo emininzi ngaphambi kokuba bafikelele usukelo lwabo lomsebenzi.",code:"xh",name:"XHOSA"},
        ky: {el:"Ийгиликтин ачкычы талыкпаган эмгек жана өзүнө болгон ишеним деп эсептейбиз. Биздин студенттер карьералык максаттарына жетүү алдында көптөгөн тоскоолдуктарды жеңип өтүштү.",code:"ky",name:"KYRGYZ"},
        eo: {el:"Ni kredas, ke la ŝlosilo al sukceso estas malfacila laboro kaj memfido. Niaj studentoj venkis multajn obstaklojn antaŭ ol atingi siajn kariercelojn.",code:"eo",name:"ESPERANTO"},
        zh: {el:"我们相信成功的关键是努力工作和自信。 我们的学生在实现职业目标之前克服了许多障碍。",code:"zh",name:"CHINESE_SIMPLIFIED"},
        ar: {el:"نعتقد أن مفتاح النجاح هو العمل الجاد والثقة بالنفس. لقد تغلب طلابنا على العديد من العقبات قبل الوصول إلى أهدافهم المهنية.",code:"ar",name:"ARABIC"},
        bn: {el:"আমরা বিশ্বাস করি যে সাফল্যের চাবিকাঠি হল কঠোর পরিশ্রম এবং আত্মবিশ্বাস। আমাদের শিক্ষার্থীরা তাদের কর্মজীবনের লক্ষ্যে পৌঁছানোর আগে অনেক বাধা অতিক্রম করেছে।",code:"bn",name:"BENGALI"},
        el: {el:"Πιστεύουμε ότι το κλειδί της επιτυχίας είναι η σκληρή δουλειά και η αυτοπεποίθηση. Οι μαθητές μας έχουν ξεπεράσει πολλά εμπόδια πριν φτάσουν τους επαγγελματικούς τους στόχους.",code:"el",name:"GREEK"},
        mg: {el:"Mino izahay fa ny fanalahidin'ny fahombiazana dia ny asa mafy sy ny fahatokisan-tena. Nandresy sakana maro ny mpianatsika talohan'ny nanatratrarana ny tanjony.",code:"mg",name:"MALAGASY"},
        tr: {el:"Başarının anahtarının çok çalışmak ve özgüven olduğuna inanıyoruz. Öğrencilerimiz kariyer hedeflerine ulaşmadan önce birçok engeli aştılar.",code:"tr",name:"TURKISH"}
    },
    symbols: "%$#:&^",
    number: 543789,
    getBatch: function() {
        let textArray = [];        
            textArray.push(this.sentence.fr);
            textArray.push(this.sentence.ko);
            textArray.push(this.sentence.ky);
            textArray.push(this.sentence.zh);
            textArray.push(this.sentence.bn);
            textArray.push(this.sentence.mg);
            textArray.push(this.word.de);
            textArray.push(this.word.xh);
            textArray.push(this.word.eo);
            textArray.push(this.word.ar);
            textArray.push(this.word.el);
            textArray.push(this.word.tr);
        return textArray;
    },
    getArrayToSend: function () {
        let toSendArray = [];
        this.getBatch().forEach(element => toSendArray.push(element.el));
        return toSendArray;
    }
} 

            
