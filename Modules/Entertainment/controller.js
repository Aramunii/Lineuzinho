const axios = require('axios');
const cheerio = require('cheerio');
const Sender = require('../sender.js')
const translate = require('translate');
const Path = require('path')
const fs = require('fs');

var methods = {

};

methods.desciclopedia = async function desciclopedia(client, message) {
    var response = await axios.get('http://desciclopedia.org/wiki/Especial:Aleat%C3%B3ria')

    var $ = cheerio.load(response.data);

    var title = $('.firstHeading').text();
    var content = $('.mw-parser-output').text();

    var text = `*${title}* \n\n ${content} \n\n`

    Sender.sendMessage(client, message, text, '📚🤪 DESCICLOPÉDIA 🤪📚')
}

methods.loteryMake = function loteryMake(client, message) {
    var numbers = [];
    for (i = 1; i <= 6; i++) {
        var random = getRandomInt(1, 60);
        while (numbers.includes(random)) {
            random = getRandomInt(1, 60);
        }
        random = random.toString();
        random = replaceToEmoji(random);
        numbers.push(random)
    }
    var text = `  \n*Os números sorteados vão ser :*\n${numbers.join('  -  ')}\n~é verdade este bilhete~`
    Sender.sendMessage(client, message, text, '🍀 MEGA-SENA 🍀');
}

methods.getDecision = async function getDecision(client, message) {
    var result = message.body.replace('#decida', '')
    if (result == ' ajuda' || result == '') {
        sendMessage(client, message, `\n\nEx: *#decida* opção1,opção2,opção3 - Escolhe uma opção aleatoriamente dentre as opções. `, '❔ LINEUZINHO DECIDE ❔');
        return true;
    }

    var decisions = message.body.replace('#decida', '').split(',');
    var item = decisions[Math.floor(Math.random() * decisions.length)];
    var text = `\n\nMinha escolha é:  *${item.trim()}* \n\nSe você não queria fazer isto, agora vai!`;
    Sender.sendMessage(client, message, text, '🎲 LINEUZINHO DECIDE 🎲');
    return true;
}

methods.animalGame = function animalGame(client, message) {
    var numArr = new Array("001 - Avestruz", "002 - Avestruz", "003 - Avestruz", "004 - Avestruz", "005 - Águia", "006 - Águia", "007 - Águia", "008 - Águia", "009 - Burro", "010 - Burro", "011 - Burro", "012 - Burro", "013 - Borboleta", "014 - Borboleta", "015 - Borboleta", "016 - Borboleta", "017 - Cachorro", "018 - Cachorro", "019 - Cachorro", "020 - Cachorro", "021 - Cabra", "022 - Cabra", "023 - Cabra", "024 - Cabra", "025 - Carneiro", "026 - Carneiro", "027 - Carneiro", "028 - Carneiro", "029 - Camelo", "030 - Camelo", "031 - Camelo", "032 - Camelo", "033 - Cobra", "034 - Cobra", "035 - Cobra", "036 - Cobra", "037 - Coelho", "038 - Coelho", "039 - Coelho", "040 - Coelho", "041 - Cavalo", "042 - Cavalo", "043 - Cavalo", "044 - Cavalo", "045 - Elefante", "046 - Elefante", "047 - Elefante", "048 - Elefante", "049 - Galo", "050 - Galo", "051 - Galo", "052 - Galo", "053 - Gato", "054 - Gato", "055 - Gato", "056 - Gato", "057 - Jacaré", "058 - Jacaré", "059 - Jacaré", "060 - Jacaré", "061 - Leão", "062 - Leão", "063 - Leão", "064 - Leão", "065 - Macaco", "066 - Macaco", "067 - Macaco", "068 - Macaco", "069 - Porco", "070 - Porco", "071 - Porco", "072 - Porco", "073 - Pavão", "074 - Pavão", "075 - Pavão", "076 - Pavão", "077 - Peru", "078 - Peru", "079 - Peru", "080 - Peru", "081 - Touro", "082 - Touro", "083 - Touro", "084 - Touro", "085 - Tigre", "086 - Tigre", "087 - Tigre", "088 - Tigre", "089 - Urso", "090 - Urso", "091 - Urso", "092 - Urso", "093 - Veado", "094 - Veado", "095 - Veado", "096 - Veado", "097 - Vaca", "098 - Vaca", "099 - Vaca", "100 - Vaca", "101 - Avestruz", "102 - Avestruz", "103 - Avestruz", "104 - Avestruz", "105 - Águia", "106 - Águia", "107 - Águia", "108 - Águia", "109 - Burro", "110 - Burro", "111 - Burro", "112 - Burro", "113 - Borboleta", "114 - Borboleta", "115 - Borboleta", "116 - Borboleta", "117 - Cachorro", "118 - Cachorro", "119 - Cachorro", "120 - Cachorro", "121 - Cabra", "122 - Cabra", "123 - Cabra", "124 - Cabra", "125 - Carneiro", "126 - Carneiro", "127 - Carneiro", "128 - Carneiro", "129 - Camelo", "130 - Camelo", "131 - Camelo", "132 - Camelo", "133 - Cobra", "134 - Cobra", "135 - Cobra", "136 - Cobra", "137 - Coelho", "138- Coelho", "139- Coelho", "140- Coelho", "141 - Cavalo", "142 - Cavalo", "143 - Cavalo", "144 - Cavalo", "145 - Elefante", "146 - Elefante", "147 - Elefante", "148 - Elefante", "149 - Galo", "150 - Galo", "151 - Galo", "152 - Galo", "153 - Gato", "154 - Gato", "155 - Gato", "156 - Gato", "157 - Jacaré", "158 - Jacaré", "159 - Jacaré", "160 - Jacaré", "161 - Leão", "162 - Leão", "163 - Leão", "164 - Leão", "165 - Macaco", "166 - Macaco", "167 - Macaco", "168 - Macaco", "169 - Porco", "170 - Porco", "171 - Porco", "172 - Porco", "173 - Pavão", "174 - Pavão", "175 - Pavão", "176 - Pavão", "177 - Peru", "178 - Peru", "179 - Peru", "180 - Peru", "181 - Touro", "182 - Touro", "183 - Touro", "184 - Touro", "185 - Tigre", "186 - Tigre", "187 - Tigre", "188 - Tigre", "189 - Urso", "190 - Urso", "191 - Urso", "192 - Urso", "193 - Veado", "194 - Veado", "195 - Veado", "196 - Veado", "197 - Vaca", "198 - Vaca", "199 - Vaca", "200 - Vaca", "201 - Avestruz", "202 - Avestruz", "203 - Avestruz", "204 - Avestruz", "205 - Águia", "206 - Águia", "207 - Águia", "208 - Águia", "209 - Burro", "210 - Burro", "211 - Burro", "212 - Burro", "213 - Borboleta", "214 - Borboleta", "215 - Borboleta", "216  - Borboleta", "217 - Cachorro", "218 - Cachorro", "219 - Cachorro", "220 - Cachorro", "221 - Cabra", "222 - Cabra", "223 - Cabra", "224 - Cabra", "225 - Carneiro", "226 - Carneiro", "227 - Carneiro", "228 - Carneiro", "229 - Camelo", "230 - Camelo", "231 - Camelo", "232 - Camelo", "233 - Cobra", "234 - Cobra", "235 - Cobra", "236 - Cobra", "237 - Coelho", "238 - Coelho", "239 - Coelho", "240 - Coelho", "241 - Cavalo", "242 - Cavalo", "243 - Cavalo", "244 - Cavalo", "245 - Elefante", "246 - Elefante", "247 - Elefante", "248 - Elefante", "249 - Galo", "250 - Galo", "251 - Galo", "252 - Galo", "253 - Gato", "254 - Gato", "255 - Gato", "256 - Gato", "257 - Jacaré", "258 - Jacaré", "259 - Jacaré", "260 - Jacaré", "261 - Leão", "262 - Leão", "263 - Leão", "264 - Leão", "265 - Macaco", "266 - Macaco", "267 - Macaco", "268 - Macaco", "269 - Porco", "270 - Porco", "271 - Porco", "272 - Porco", "273 - Pavão", "274 - Pavão", "275 - Pavão", "276 - Pavão", "277 - Peru", "278 - Peru", "279 - Peru", "280 - Peru", "281 - Touro", "282 - Touro", "283 - Touro", "284 - Touro", "285 - Tigre", "286 - Tigre", "287 - Tigre", "288 - Tigre", "289 - Urso", "290 - Urso", "291 - Urso", "292 - Urso", "293 - Veado", "294 - Veado", "295 - Veado", "296 - Veado", "297 - Vaca", "298 - Vaca", "299 - Vaca", "300 - Vaca", "301 - Avestruz", "302 - Avestruz", "303 - Avestruz", "304 - Avestruz", "305 - Águia", "306 - Águia", "307 - Águia", "308 - Águia", "309 - Burro", "310 - Burro", "311 - Burro", "312 - Burro", "313 - Borboleta", "314 - Borboleta", "315 - Borboleta", "316 - Borboleta", "317 - Cachorro", "318 - Cachorro", "319 - Cachorro", "320 - Cachorro", "321 - Cabra", "322 - Cabra", "323 - Cabra", "324 - Cabra", "325 - Carneiro", "326 - Carneiro", "327 - Carneiro", "328 - Carneiro", "329 - Camelo", "330 - Camelo", "331 - Camelo", "332 - Camelo", "333 - Cobra", "334 - Cobra", "335 - Cobra", "336 - Cobra", "337 - Coelho", "338 - Coelho", "339 - Coelho", "340 - Coelho", "341- Cavalo", "342- Cavalo", "343- Cavalo", "344- Cavalo", "345 - Elefante", "346 - Elefante", "347 - Elefante", "348 - Elefante", "349 - Galo", "350 - Galo", "351 - Galo", "352 - Galo", "353 - Gato", "354 - Gato", "355 - Gato", "356 - Gato", "357 - Jacaré", "358 - Jacaré", "359 - Jacaré", "360 - Jacaré", "361 - Leão", "362 - Leão", "363 - Leão", "364 - Leão", "365 - Macaco", "366 - Macaco", "367 - Macaco", "368 - Macaco", "369 - Porco", "370 - Porco", "371 - Porco", "372 - Porco", "373 - Pavão", "374 - Pavão", "375 - Pavão", "376 - Pavão", "377 - Peru", "378 - Peru", "379 - Peru", "380 - Peru", "381 - Touro", "382 - Touro", "383 - Touro", "384 - Touro", "385 - Tigre", "386 - Tigre", "387 - Tigre", "388 - Tigre", "389 - Urso", "390 - Urso", "391 - Urso", "392 - Urso", "393 - Veado", "394 - Veado", "395 - Veado", "396 - Veado", "397 - Vaca", "398 - Vaca", "399 - Vaca", "400 - Vaca", "401 - Avestruz", "402 - Avestruz", "403 - Avestruz", "404 - Avestruz", "405 - Águia", "406 - Águia", "407 - Águia", "408 - Águia", "409 - Burro", "410 - Burro", "411 - Burro", "412 - Burro", "413 - Borboleta", "414 - Borboleta", "415 - Borboleta", "416 - Borboleta", "417 - Cachorro", "418 - Cachorro", "419 - Cachorro", "420 - Cachorro", "421 - Cabra", "422 - Cabra", "423 - Cabra", "424 - Cabra", "425 - Carneiro", "426 - Carneiro", "427 - Carneiro", "428 - Carneiro", "429 - Camelo", "430 - Camelo", "431 - Camelo", "432 - Camelo", "433 - Cobra", "434 - Cobra", "435 - Cobra", "436 - Cobra", "437 - Coelho", "438 - Coelho", "439 - Coelho", "440 - Coelho", "441 - Cavalo", "442 - Cavalo", "443 - Cavalo", "444 - Cavalo", "445 - Elefante", "446 - Elefante", "447 - Elefante", "448 - Elefante", "449 - Galo", "450 - Galo", "451 - Galo", "452 - Galo", "453 - Gato", "454 - Gato", "455 - Gato", "456 - Gato", "457 - Jacaré", "458 - Jacaré", "459 - Jacaré", "460 - Jacaré", "461 - Leão", "462 - Leão", "463 - Leão", "464 - Leão", "465 - Macaco", "466 - Macaco", "467 - Macaco", "468 - Macaco", "469 - Porco", "470 - Porco", "471 - Porco", "472 - Porco", "473 - Pavão", "474 - Pavão", "475 - Pavão", "476 - Pavão", "477 - Peru", "478 - Peru", "479 - Peru", "480 - Peru", "481 - Touro", "482 - Touro", "483 - Touro", "484 - Touro", "485 - Tigre", "486 - Tigre", "487 - Tigre", "488 - Tigre", "489 - Urso", "490 - Urso", "491 - Urso", "492 - Urso", "493 - Veado", "494 - Veado", "495 - Veado", "496 - Veado", "497 - Vaca", "498 - Vaca", "499 - Vaca", "500 - Vaca", "501 - Avestruz", "502 - Avestruz", "503 - Avestruz", "504 - Avestruz", "505 - Águia", "506 - Águia", "507 - Águia", "508 - Águia", "509 - Burro", "510 - Burro", "511 - Burro", "512 - Burro", "513 - Borboleta", "514 - Borboleta", "515 - Borboleta", "516 - Borboleta", "517 - Cachorro", "518 - Cachorro", "519 - Cachorro", "520 - Cachorro", "521 - Cabra", "522 - Cabra", "523 - Cabra", "524 - Cabra", "525 - Carneiro", "526 - Carneiro", "527 - Carneiro", "528 - Carneiro", "529 - Camelo", "530 - Camelo", "531 - Camelo", "532 - Camelo", "533 - Cobra", "534 - Cobra", "535 - Cobra", "536 - Cobra", "537 - Coelho", "538 - Coelho", "539 - Coelho", "540 - Coelho", "541- Cavalo", "542- Cavalo", "543- Cavalo", "544- Cavalo", "545 - Elefante", "546 - Elefante", "547 - Elefante", "548 - Elefante", "549 - Galo", "550 - Galo", "551 - Galo", "552 - Galo", "553 - Gato", "554 - Gato", "555 - Gato", "556 - Gato", "557 - Jacaré", "558 - Jacaré", "559 - Jacaré", "560 - Jacaré", "561 - Leão", "562 - Leão", "563 - Leão", "564 - Leão", "565 - Macaco", "566 - Macaco", "567 - Macaco", "568 - Macaco", "569 - Porco", "570 - Porco", "571 - Porco", "572 - Porco", "573 - Pavão", "574 - Pavão", "575 - Pavão", "576 - Pavão", "577 - Peru", "578 - Peru", "579 - Peru", "580 - Peru", "581 - Touro", "582 - Touro", "583 - Touro", "584 - Touro", "585 - Tigre", "586 - Tigre", "587 - Tigre", "588 - Tigre", "589 - Urso", "590 - Urso", "591 - Urso", "592 - Urso", "593 - Veado", "594 - Veado", "595 - Veado", "596 - Veado", "597 - Vaca", "598 - Vaca", "599 - Vaca", "600 - Vaca", "601 - Avestruz", "602 - Avestruz", "603 - Avestruz", "604 - Avestruz", "605 - Águia", "606 - Águia", "607 - Águia", "608 - Águia", "609 - Burro", "610 - Burro", "611 - Burro", "612 - Burro", "613 - Borboleta", "614 - Borboleta", "615 - Borboleta", "616 - Borboleta", "617 - Cachorro", "618 - Cachorro", "619 - Cachorro", "620 - Cachorro", "621 - Cabra", "622 - Cabra", "623 - Cabra", "624 - Cabra", "625 - Carneiro", "626 - Carneiro", "627 - Carneiro", "628 - Carneiro", "629 - Camelo", "630 - Camelo", "631 - Camelo", "632 - Camelo", "633 - Cobra", "634 - Cobra", "635 - Cobra", "636 - Cobra", "637 - Coelho", "638 - Coelho", "639 - Coelho", "640 - Coelho", "641 - Cavalo", "642 - Cavalo", "643 - Cavalo", "644 - Cavalo", "645 - Elefante", "646 - Elefante", "647 - Elefante", "648 - Elefante", "649 - Galo", "650 - Galo", "651 - Galo", "652 - Galo", "653 - Gato", "654 - Gato", "655 - Gato", "656 - Gato", "657 - Jacaré", "658 - Jacaré", "659 - Jacaré", "660 - Jacaré", "661 - Leão", "662 - Leão", "663 - Leão", "664 - Leão", "665 - Macaco", "666 - Macaco", "667 - Macaco", "668 - Macaco", "669 - Porco", "670 - Porco", "671 - Porco", "672 - Porco", "673 - Pavão", "674 - Pavão", "675 - Pavão", "676 - Pavão", "677 - Peru", "678 - Peru", "679 - Peru", "680 - Peru", "681 - Touro", "682 - Touro", "683 - Touro", "684 - Touro", "685 - Tigre", "686 - Tigre", "687 - Tigre", "688 - Tigre", "689 - Urso", "690 - Urso", "691 - Urso", "692 - Urso", "693 - Veado", "694 - Veado", "695 - Veado", "696 - Veado", "697 - Vaca", "698 - Vaca", "699 - Vaca", "700 - Vaca", "701 - Avestruz", "702 - Avestruz", "703 - Avestruz", "704 - Avestruz", "705 - Águia", "706 - Águia", "707 - Águia", "708 - Águia", "709 - Burro", "710 - Burro", "711 - Burro", "712 - Burro", "713 - Borboleta", "714 - Borboleta", "715 - Borboleta", "716 - Borboleta", "717 - Cachorro", "718 - Cachorro", "719 - Cachorro", "720 - Cachorro", "721 - Cabra", "722 - Cabra", "723 - Cabra", "724 - Cabra", "725 - Carneiro", "726 - Carneiro", "727 - Carneiro", "728 - Carneiro", "729 - Camelo", "730 - Camelo", "731 - Camelo", "732 - Camelo", "733 - Cobra", "734 - Cobra", "735 - Cobra", "736 - Cobra", "737 - Coelho", "738 - Coelho", "739 - Coelho", "740 - Coelho", "741 - Cavalo", "742 - Cavalo", "743 - Cavalo", "744 - Cavalo", "745 - Elefante", "746 - Elefante", "747 - Elefante", "748 - Elefante", "749 - Galo", "750 - Galo", "751 - Galo", "752 - Galo", "753 - Gato", "754 - Gato", "755 - Gato", "756 - Gato", "757 - Jacaré", "758 - Jacaré", "759 - Jacaré", "760 - Jacaré", "761 - Leão", "762 - Leão", "763 - Leão", "764 - Leão", "765 - Macaco", "766 - Macaco", "767 - Macaco", "768 - Macaco", "769 - Porco", "770 - Porco", "771 - Porco", "772 - Porco", "773 - Pavão", "774 - Pavão", "775 - Pavão", "776 - Pavão", "777 - Peru", "778 - Peru", "779 - Peru", "780 - Peru", "781 - Touro", "782 - Touro", "783 - Touro", "784 - Touro", "785 - Tigre", "786 - Tigre", "787 - Tigre", "788 - Tigre", "789 - Urso", "790 - Urso", "791 - Urso", "792 - Urso", "793 - Veado", "794 - Veado", "795 - Veado", "796 - Veado", "797 - Vaca", "798 - Vaca", "799 - Vaca", "800 - Vaca", "801 - Avestruz", "802 - Avestruz", "803 - Avestruz", "804 - Avestruz", "805 - Águia", "806 - Águia", "807 - Águia", "808 - Águia", "809 - Burro", "810 - Burro", "811 - Burro", "812 - Burro", "813 - Borboleta", "814 - Borboleta", "815 - Borboleta", "816 - Borboleta", "817 - Cachorro", "818 - Cachorro", "819 - Cachorro", "820 - Cachorro", "821 - Cabra", "822 - Cabra", "823 - Cabra", "824 - Cabra", "825 - Carneiro", "826 - Carneiro", "827 - Carneiro", "828 - Carneiro", "829 - Camelo", "830 - Camelo", "831 - Camelo", "832 - Camelo", "833 - Cobra", "834 - Cobra", "835 - Cobra", "836 - Cobra", "837 - Coelho", "838 - Coelho", "839 - Coelho", "840 - Coelho", "841 - Cavalo", "842 - Cavalo", "843 - Cavalo", "844 - Cavalo", "845 - Elefante", "846 - Elefante", "847 - Elefante", "848 - Elefante", "849 - Galo", "850 - Galo", "851 - Galo", "852 - Galo", "853 - Gato", "854 - Gato", "855 - Gato", "856 - Gato", "857 - Jacaré", "858 - Jacaré", "859 - Jacaré", "860 - Jacaré", "861 - Leão", "862 - Leão", "863 - Leão", "864 - Leão", "865 - Macaco", "866 - Macaco", "867 - Macaco", "868 - Macaco", "869 - Porco", "870 - Porco", "871 - Porco", "872 - Porco", "873 - Pavão", "874 - Pavão", "875 - Pavão", "876 - Pavão", "877 - Peru", "878 - Peru", "879 - Peru", "880 - Peru", "881 - Touro", "882 - Touro", "883 - Touro", "884 - Touro", "885 - Tigre", "886 - Tigre", "887 - Tigre", "888 - Tigre", "889 - Urso", "890 - Urso", "891 - Urso", "892 - Urso", "893 - Veado", "894 - Veado", "895 - Veado", "896 - Veado", "897 - Vaca", "898 - Vaca", "899 - Vaca", "900 - Vaca", "901 - Avestruz", "902 - Avestruz", "903 - Avestruz", "904 - Avestruz", "905 - Águia", "906 - Águia", "907 - Águia", "908 - Águia", "909 - Burro", "910 - Burro", "911 - Burro", "912 - Burro", "913 - Borboleta", "914 - Borboleta", "915 - Borboleta", "916 - Borboleta", "917 - Cachorro", "918 - Cachorro", "919 - Cachorro", "920 - Cachorro", "921 - Cabra", "922 - Cabra", "923 - Cabra", "924 - Cabra", "925 - Carneiro", "926 - Carneiro", "927 - Carneiro", "928 - Carneiro", "929 - Camelo", "930 - Camelo", "931 - Camelo", "932 - Camelo", "933 - Cobra", "934 - Cobra", "935 - Cobra", "936 - Cobra", "937 - Coelho", "938 - Coelho", "939 - Coelho", "940 - Coelho", "941 - Cavalo", "942 - Cavalo", "943 - Cavalo", "944 - Cavalo", "945 - Elefante", "946 - Elefante", "947 - Elefante", "948 - Elefante", "949 - Galo", "950 - Galo", "951 - Galo", "952 - Galo", "953 - Gato", "954 - Gato", "955 - Gato", "956 - Gato", "957 - Jacaré", "958 - Jacaré", "959 - Jacaré", "960 - Jacaré", "961 - Leão", "962 - Leão", "963 - Leão", "964 - Leão", "965 - Macaco", "966 - Macaco", "967 - Macaco", "968 - Macaco", "969 - Porco", "970 - Porco", "971 - Porco", "972 - Porco", "973 - Pavão", "974 - Pavão", "975 - Pavão", "976 - Pavão", "977 - Peru", "978 - Peru", "979 - Peru", "980 - Peru", "981 - Touro", "982 - Touro", "983 - Touro", "984 - Touro", "985 - Tigre", "986 - Tigre", "987 - Tigre", "988 - Tigre", "989 - Urso", "990 - Urso", "991 - Urso", "992 - Urso", "993 - Veado", "994 - Veado", "995 - Veado", "996 - Veado", "997 - Vaca", "998 - Vaca", "999 - Vaca", "000 - Vaca"); // Add elements here
    var currNum = Math.round((numArr.length - 1) * Math.random());
    var text = `\nAposta 10zão no : *${numArr[currNum]}*`
    Sender.sendMessage(client, message, text, '🐖 *JOGO DO BICHO* 🐄')
}

methods.getRandomFact = async function getRandomFact(client, message) {
    var response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
    const text = await translate(response.data.text, "pt");
    Sender.sendMessage(client, message, text, '📚 UM FATO INÚTIL 📚')
}

methods.getCat = async function getCat(client, message) {
    await downloadImage();
    Sender.sendImageName(client, message, 'gato.jpg')
}

methods.getDog = async function getDog(client, message) {
    const url = 'https://random.dog/woof.json'
    const responseDog = await axios.get(url);
    var link = responseDog.data;
    link = link.url
    var type = link.split('.')[2]

    await downloadImageDog(link, 'dog.' + type);
    if (type == 'mp4' || type == 'gif') {
        Sender.sendVideoGif(client, message, 'dog.' + type)
    } else if (type == 'jpg' || type == 'jpeg' || type == 'PNG' || type == 'webm') {
        console.log('a');
        Sender.sendImageName(client, message, 'dog.' + type)
    }
}


methods.getDuck = async function getDuck(client, message) {
    const url = 'https://random-d.uk/api/v2/quack'
    const responseDog = await axios.get(url);
    var link = responseDog.data;
    link = link.url
    var type = link.split('.')[2]

    await downloadImageDog(link, 'duck.' + type);
    if (type == 'mp4' || type == 'gif') {
        Sender.sendVideoGif(client, message, 'duck.' + type)
    } else if (type == 'jpg' || type == 'jpeg' || type == 'PNG' || type == 'webm') {
        console.log('a');
        Sender.sendImageName(client, message, 'duck.' + type)
    }
}



methods.desmotive = async function desmotive(client, message) {
    var desmotiv = [
        "“Hoje é o primeiro dia do resto da sua vida. Mas ontem também foi, e veja como acabou.”",
        "“A vida é o que acontece quando você está ocupado lendo frases motivacionais.”",
        "“Levante a mão se você já recebeu conselhos não solicitados suficientes sobre o que deve ser feito com os limões que a vida pode ou não lhe dar.”",
        "“É tudo uma ladeira abaixo a partir daqui.”",
        "“Não descanse antes de reclamar de tudo.”",
        "“Pode ser que o seu propósito na vida seja servir de aviso para os outros.”",
        "“As piores coisas da sua vida provavelmente ainda não aconteceram com você.”",
        "“A vida é uma série de coisas que preferiríamos não fazer.”",
        "“Algumas pessoas nascem perdedoras, outras precisam aprender da maneira mais difícil.”",
        "“Desistentes nunca vencem e os vencedores nunca param de falar sobre como venceram.”",
        "“Nunca é tarde para falhar.”",
        "“Tente bastante e não se preocupe se falhar, porque todos esperavam isso.”",
        "“A estrada para o sucesso está sempre em construção.”",
        "“Não há limite para o que você pode ser se mentir para si mesmo.”",
        "“Será fácil? Não. Vale a pena? Absolutamente não!”",
        "“Você tentou o seu melhor e falhou miseravelmente. A lição é: nunca tente.”",
        "“Quando as coisas ficam difíceis, as difíceis ficam ainda mais difíceis.”",
        "“A vida é difícil, mas é ainda mais difícil se você for idiota.”",
        "“O elevador para o sucesso está quebrado. Você terá que usar as escadas, um degrau de cada vez.”",
        "“O primeiro passo para o fracasso é tentar.”",
        "“Nem tudo é uma lição. Às vezes, você simplesmente falha. “",
        "“Aqueles que duvidam de sua capacidade provavelmente têm um motivo válido.”",
        "“Cada dia é uma nova chance para você errar novamente.”",
        "“A única coisa que todas as suas falhas têm em comum é você.”",
        "“Sempre há espaço na vida para fazer mais merda. Sempre.”",
        "“Sua vida só sobe para que você possa cair de uma nova altura.”",
        "“Estou corajosamente indo a lugar nenhum.”",
        "“Quem disse que dinheiro não compra felicidade não sabia onde comprar.”",
        "“Todo mundo tem um propósito na vida. Talvez o meu esteja assistindo televisão.”",
        "“É melhor a vida ser um destino porque esta jornada é uma merda.”",
        "“Sou naturalmente engraçado porque minha vida é uma piada.”",
        "“O sentido da vida é encontrar o seu dom. Boa sorte com isso.”",
        "“Hoje será um dia como qualquer outro dia.”",
        "“Vida é dor. Qualquer pessoa que diga o contrário está vendendo alguma coisa.”",
        "“Quando a vida te derrubar, fique aí e tire uma soneca.”",
        "“Se você nunca tentar nada novo, perderá muitas das grandes decepções da vida.”",
        "“Você só morre uma vez.”",
        "“A vida é 10% do que acontece com você, os outros 90% acontece quando você tem dinheiro.”",
        "“Sempre peça dinheiro emprestado a um pessimista. Ele não vai esperar pelo dinheiro de volta.”",
        "“Por que resta tanto mês no fim do dinheiro?”",
        "“As melhores coisas da vida são as mais caras.”",
        "“Todos os dias é sexta-feira quando você está desempregado.”",
        "“Sempre chego tarde ao escritório, mas compenso saindo mais cedo.”",
        "“É verdade que o trabalho árduo nunca matou ninguém, mas eu prefiro não me arriscar.”",
        "Se você odeia seu trabalho, existe um grupo de apoio para isso chamado Todomundo, e eles se encontram me um bar.”",
        "“A recompensa pelo bom trabalho é mais trabalho.”",
        "“Sempre haverá alguém no Youtube que sabe fazer melhor do que você.”",
        "“Trabalhe duro, reclame ainda mais. “",
        "“Eu não quero fazer coisas. As coisas são uma merda.”",
        "“Nunca é tarde para voltar para a cama.”",
        "“Não se preocupe, nada nunca estará tão ruim que não possa piorar”",
    ]

    var currNum = Math.round((desmotiv.length - 1) * Math.random());
    var text = `*${desmotiv[currNum]}*`
    Sender.sendMessage(client, message, text, '')
}

async function downloadImageDog(url, type) {

    const path = 'Modules/images/' + type
    const writer = fs.createWriteStream(path)
    const response = await axios.get(url, {
        responseType: 'stream'
    })

    response.data.pipe(writer)


    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })

}

async function downloadImage() {
    const url = 'https://cataas.com/cat/cute'
    const path = 'Modules/images/' + 'gato.jpg'
    const writer = fs.createWriteStream(path)

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function replaceToEmoji(number) {
    var number = number.split("");
    finalNumber = '';

    number.forEach(element => {
        element = element.replace('0', '0️⃣')
        element = element.replace('1', '1️⃣')
        element = element.replace('2', '2️⃣')
        element = element.replace('3', '3️⃣')
        element = element.replace('4', '4️⃣')
        element = element.replace('5', '5️⃣')
        element = element.replace('6', '6️⃣')
        element = element.replace('7', '7️⃣')
        element = element.replace('8', '8️⃣')
        element = element.replace('9', '9️⃣')
        element = element.replace('10', '🔟')
        finalNumber += element
    })

    return finalNumber
}

exports.data = methods;
