const axios = require('axios');
const ApiRequest = require('../../api.js');
const cheerio = require('cheerio');
const Stand = require('../../stand.js');
const Sender = require('../sender.js')


var methods = {};

var genres =
    `Blues
Classical
Country
Electronic
Folk
International
Jazz
Latin
New Age
Pop
R&B
Rap
Reggae
Religious
Heavy Metal,
Punk
Glam Rock
Indie Rock
Death Metal
Power Metal
Brasil
Rock
`;

var genresLink = [
    {
        "name": "\n                                Blues                            ",
        "link": "https://www.allmusic.com/genre/blues-ma0000002467"
    },
    {
        "name": "\n                                Classical                            ",
        "link": "https://www.allmusic.com/genre/classical-ma0000002521"
    },
    {
        "name": "\n                                Country                            ",
        "link": "https://www.allmusic.com/genre/country-ma0000002532"
    },
    {
        "name": "\n                                Easy Listening                            ",
        "link": "https://www.allmusic.com/genre/easy-listening-ma0000002567"
    },
    {
        "name": "\n                                Electronic                            ",
        "link": "https://www.allmusic.com/genre/electronic-ma0000002572"
    },
    {
        "name": "\n                                Folk                            ",
        "link": "https://www.allmusic.com/genre/folk-ma0000002592"
    },
    {
        "name": "\n                                Holiday                            ",
        "link": "https://www.allmusic.com/genre/holiday-ma0000012075"
    },
    {
        "name": "\n                                International                            ",
        "link": "https://www.allmusic.com/genre/international-ma0000002660"
    },
    {
        "name": "\n                                Jazz                            ",
        "link": "https://www.allmusic.com/genre/jazz-ma0000002674"
    },
    {
        "name": "\n                                Latin                            ",
        "link": "https://www.allmusic.com/genre/latin-ma0000002692"
    },
    {
        "name": "\n                                New Age                            ",
        "link": "https://www.allmusic.com/genre/new-age-ma0000002745"
    },
    {
        "name": "\n                                Pop                            ",
        "link": "https://www.allmusic.com/style/pop-ma0000012254"
    },
    {
        "name": "\n                                R&B                            ",
        "link": "https://www.allmusic.com/genre/r-b-ma0000002809"
    },
    {
        "name": "\n                                Rap                            ",
        "link": "https://www.allmusic.com/genre/rap-ma0000002816"
    },
    {
        "name": "\n                                Reggae                            ",
        "link": "https://www.allmusic.com/genre/reggae-ma0000002820"
    },
    {
        "name": "\n                                Religious                            ",
        "link": "https://www.allmusic.com/genre/religious-ma0000004431"
    },
    {
        "name": "\n                                Stage & Screen                            ",
        "link": "https://www.allmusic.com/genre/stage-screen-ma0000004432"
    },
    {
        "name": "\n                                Vocal                            ",
        "link": "https://www.allmusic.com/genre/vocal-ma0000011877"
    },
    {
        "name": 'Heavy Metal',
        'link': 'https://www.allmusic.com/subgenre/heavy-metal-ma0000002721',
    },
    {
        'name': 'Punk',
        'link': 'https://www.allmusic.com/subgenre/punk-new-wave-ma0000011872'
    },
    {
        'name': 'Glam Rock',
        'link': 'https://www.allmusic.com/style/glam-rock-ma0000002619'
    },
    {
        'name': 'Indie Rock',
        'link': 'https://www.allmusic.com/subgenre/alternative-indie-rock-ma0000012230'
    },
    {
        'name': 'Death Metal',
        'link': 'https://www.allmusic.com/style/death-metal-ma0000002547'
    },
    {
        'name': 'Power Metal',
        'link': 'https://www.allmusic.com/style/power-metal-ma0000011913'
    },
    {
        'name': 'Brasil',
        'link': 'https://www.allmusic.com/subgenre/brazilian-traditions-ma0000002477'
    },
    {
        'name': 'Rock',
        'link': 'https://www.allmusic.com/style/rock-roll-ma0000002829'
    },
]


methods.attackEnemy = async function attackEnemy(client, message, user) {
    var textMenu = ``
    var options = [];
    try {
        var user_id = message.sender.id;
        var group_id = message.from;
        // console.log(data);
        console.log(message);
        if (!message.isGroupMsg) {
            textMenu += 'Este comando deve ser enviado no grupo que você está!'
        } else {
            var data = await ApiRequest.data.api('attackEnemy', { user_id, group_id })
            if (data.enemy) {
                if (data.stand) {
                    if (data.attacked) {
                        textMenu += '*' + data.user.stand + '*  já atacou este inimigo!\n\n*Stand inimigo:* ' + data.enemy.name + '\n*Vida:* ' + data.enemy.hp +
                            '\n\nuse *#atacar* para causar dano ao Stand Inimigo\n\n';
                    } else {
                        if (data.enemy.dead) {
                            var attackers = data.attackers.map(element => {
                                return `\n*Usuário:* ${element.user}\n*Stand:* ${element.stand}\n---------------------------`;
                            })
                            textMenu += `O Stand inimigo *${data.enemy.name}* foi derrotado!\n\n Obrigado a todos os usuários de stand que atacaram: \n ${attackers}`
                            data.groups.forEach(element => {
                                Sender.sendMessageNormalGroups(client, element, textMenu, '*RESULTADO DA BATALHA*', data.attackers)
                            })
                            return true;
                        } else {
                            textMenu += '*' + data.user.stand + '*  atacou e causou dano ao inimigo!\n\n*Stand inimigo:* ' + data.enemy.name + '\n*Vida:* ' + data.enemy.hp +
                                '\n\nuse *#atacar* para causar dano ao Stand Inimigo\n\n';
                        }

                    }
                } else {
                    textMenu += 'Você ainda não conseguiu seu stand\n\nme envie *#definirstand* no privado para ganhar um! \n\n';
                }
            } else {
                if (data.stand) {
                    textMenu += 'Não tem nenhum stand inimigo por perto\n\n!';
                } else {
                    textMenu += 'Você ainda não conseguiu seu stand\n\nme envie *#definirstand* no privado para ganhar um!\n\n';
                }
            }
        }

    } catch (err) {
        console.log(err);
    }

    Sender.sendMessageOptionsEnemy(client, message, textMenu, options)
}

methods.getEnemy = async function getEnemy(client, message, user) {
    var textMenu = `*Inimigo*`
    try {
        var enemy = await ApiRequest.data.api('getEnemy')
        textMenu += '\n\n*Stand inimigo:* ' + enemy.name +
            `\n\n*Poder:* ${enemy.pwr}\n*Alcance:* ${enemy.rng}\n*Velocidade:* ${enemy.spd}\n*Stamina:* ${enemy.sta}\n*Precisão:* ${enemy.prc}\n*Potencial:* ${enemy.dev}` + '\n*Vida:* ' + enemy.hp +
            '\n\n use *#atacar* para causar dano ao Stand Inimigo';
    } catch (err) {
        console.log(err);
    }
    var options = [];
    sendMessageOptionsEnemy(client, message, textMenu, options)
}

methods.createEnemy = async function createEnemy(client, message, user) {
    var textMenu = ``

    body = message.body.replace('#criarinimigo ', '');

    var genre_link = genresLink.filter(function (el) {
        return el.name.toLowerCase().includes(body.toLowerCase().trim());
    });

    console.log(genre_link);

    if (genre_link.length > 0) {
        var stand = await Stand.data.getStand(genre_link[0].link);
        try {
            await ApiRequest.data.api('createEnemy', { stand })
        } catch (err) {
            console.log(err);
        }
        textMenu += '\n\n O Inimigo é: ' + stand
    } else {
        textMenu += '\n\n Você digitou algo errado!'
    }

    Sender.sendMessage(client, message, textMenu, 'INIMIGO')
}

methods.showStand = async function showStand(client, message, user) {
    if (message.mentionedJidList.length > 0) {
        var user_id = message.mentionedJidList[0];
        user = await ApiRequest.data.api('getStand', { user_id })
        var textMenu = `*Usuário:* @${user_id.replace('@c.us', '')} \n*Stand:* ${user.stand} `
        textMenu += `\n\n*Poder:* ${user.pwr}\n*Alcance:* ${user.rng}\n*Velocidade:* ${user.spd}\n*Stamina:* ${user.sta}\n*Precisão:* ${user.prc}\n*Potencial:* ${user.dev}`

        Sender.sendMessageNormal(client, message, textMenu, '🕺🏻 *STAND* 💃')
    }
}

methods.getMyStand = async function getMyStand(client, message, user) {
    var textMenu = ''
    if (user.stand == 'Nenhum') {
        textMenu += `Você ainda não escolheu seu stand! para selecionar me envie uma mensagem no privado com o seguinte comando:\n*#definirstand* `
    } else {
        textMenu += `*Usuário:* ${message.sender.pushname} \n*Stand:* ${user.stand} `
        textMenu += `\n\n*Poder:* ${user.pwr}\n*Alcance:* ${user.rng}\n*Velocidade:* ${user.spd}\n*Stamina:* ${user.sta}\n*Precisão:* ${user.prc}\n*Potencial:* ${user.dev}`

    }
    Sender.sendMessage(client, message, textMenu, '💃 MEU STAND 🕺🏻')
}

methods.setMyStand = async function setMyStand(client, message, user) {
    var textMenu = ``
    //SE FOR GRUPO N ACEITA
    if (message.isGroupMsg) {
        textMenu += '\n\n Este comando deve ser enviado no privado!'
    } else {
        //SE FOR NO PRIVADO
        //SE FOR AJUDA:
        if (message.body.replace('#definirstand ', '').length <= 1 || message.body.replace('#definirstand ', '') == 'ajuda' || message.body.replace('#definirstand', '').length <= 1) {
            Sender.sendMessage(client, message, `\n\nPara definir seu stand digite o comando abaixo seguido de um genêro musical:\n\n*#definirstand* genêro \n\n${genres}`, '❔ MEU STAND ❔')
            return true
        }

        //AQUI VAI FUNCIONAR :
        if (user.stand == 'Nenhum') {
            body = message.body.replace('#definirstand ', '');

            var genre_link = genresLink.filter(function (el) {
                return el.name.toLowerCase().includes(body.toLowerCase().trim());
            });

            if (genre_link.length > 0) {
                var stand = await Stand.data.getStand(genre_link[0].link);
                var user_id = message.sender.id;
                var stend = await ApiRequest.data.api('createStand', { user_id, stand })
                textMenu += '\n\n Seu stand agora é: ' + stand + `\n\n*Poder:* ${stend.pwr}\n*Alcance:* ${stend.rng}\n*Velocidade:* ${stend.spd}\n*Stamina:* ${stend.sta}\n*Precisão:* ${stend.prc}\n*Potencial:* ${stend.dev}`

            } else {
                textMenu += '\n\n Você digitou algo errado!'
            }

        } else {
            textMenu += `\nVocê já definiu seu Stand!\n\ndigite *#meustand* para ver o seu stand.`
        }
    }

    Sender.sendMessage(client, message, textMenu, '🕺🏻 MEU STAND 💃')
}

methods.redefMyStand = async function redefMyStand(client, message, user) {

    var textMenu = ``
    //SE FOR GRUPO N ACEITA
    if (message.isGroupMsg) {
        textMenu += '\n\n Este comando deve ser enviado no privado!\n*Irá consumir 100 de moedinhas!*'
    } else {
        //SE FOR NO PRIVADO
        //SE FOR AJUDA:
        if (message.body.replace('#redefinirstand ', '').length <= 1 || message.body.replace('#redefinirstand ', '') == 'ajuda' || message.body.replace('#redefinirstand', '').length <= 1) {
            Sender.sendMessage(client, message, `\n\nPara redefinir seu stand digite o comando abaixo seguido de um genêro musical:\n\n*#redefinirstand* genêro \n\n${genres} \n*Irá consumir 100 de moedinhas!!*`, '❔ MEU STAND ❔')
            return true
        }

        //AQUI VAI FUNCIONAR :
        console.log(user);
        if (user.gold >= 100) {
            body = message.body.replace('#redefinirstand ', '');

            var genre_link = genresLink.filter(function (el) {
                return el.name.toLowerCase().includes(body.toLowerCase().trim());
            });

            if (genre_link.length > 0) {
                var stand = await Stand.data.getStand(genre_link[0].link);
                var user_id = message.sender.id;
                var stend = await ApiRequest.data.api('recreateStand', { user_id, stand })
                textMenu += '\n\n Seu stand agora é: *' + stand + `*\n\n*Poder:* ${stend.pwr}\n*Alcance:* ${stend.rng}\n*Velocidade:* ${stend.spd}\n*Stamina:* ${stend.sta}\n*Precisão:* ${stend.prc}\n*Potencial:* ${stend.dev}`
            } else {
                textMenu += '\n\n Você digitou algo errado!'
            }

        } else {
            textMenu += `\nVocê não tem moedinhas suficientes!\n\ndigite *#meuperfil* para ver o seu perfil.`
        }
    }

    Sender.sendMessage(client, message, textMenu, '🕺🏻 MEU STAND 💃')
}

methods.setRandomStats = async function setRandomStats(client, message, user) {

    var textMenu = ``
    //SE FOR GRUPO N ACEITA
    if (message.isGroupMsg) {
        textMenu += '\n\n Este comando deve ser enviado no privado!'
    } else {
        //SE FOR NO PRIVADO
        //SE FOR AJUDA:
        /*
        if (message.body.replace('#statusstand ', '').length <= 1 || message.body.replace('#statusstand ', '') == 'ajuda' || message.body.replace('#statusstand', '').length <= 1) {
          Sender.sendMessage(client, message, `\n\nPara definir os status do seu stand digite o comando abaixo:\n\n*#standstatus* \n\n${genres}`, '❔ MEU STAND ❔')
          return true
        }*/
        //AQUI VAI FUNCIONAR :
        if (user.stand == 'Nenhum') {
            textMenu += `Você ainda não escolheu seu stand! para selecionar me envie uma mensagem com o seguinte comando:\n*#definirstand* `
        } else {
            console.log(user.pwr);

            if (user.pwr != '') {
                textMenu += `\nVocê já definiu seu Status!\n\ndigite *#meustand* para ver o seu stand.`
            } else {
                var user_id = message.sender.id;
                var response2 = await ApiRequest.data.api('randomStats', { user_id })
                textMenu += `Seus status foram:\n\n*Poder:* ${response2.pwr}\n*Velocidade:* ${response2.rng}\n*Stamina:* ${response2.sta}\n*Precisão:* ${response2.prc}\n*Potencial:* ${response2.dev}`
            }
            console.log(user.pwr);
        }
    }

    Sender.sendMessage(client, message, textMenu, '🕺🏻 MEU STAND 💃')
}


exports.data = methods;
