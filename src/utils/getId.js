export function getAnalysisIdCard(card, num) {
    if (num == 1) {
        //获取出生日期
        let birth = card.substring(6, 10) + "-" + card.substring(10, 12) + "-" + card.substring(12, 14);
        return birth;
    }
    if (num == 2) {
        //获取性别
        if (parseInt(card.substr(16, 1)) % 2 == 1) {
            //男
            return "男";
        } else {
            //女
            return "女";

        }
    }
    if (num == 3) {

        //获取年龄

        var myDate = new Date();

        var month = myDate.getMonth() + 1;

        var day = myDate.getDate();

        var age = myDate.getFullYear() - card.substring(6, 10) - 1;

        if (card.substring(10, 12) < month || card.substring(10, 12) == month && card.substring(12, 14) <= day) {

            age++;

        }

        return age;

    }
}
