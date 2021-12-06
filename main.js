const wppconnect = require('@wppconnect-team/wppconnect');
const axios = require('axios');
const movieRandom = require('./movie.js');
const gameSearch = require('./game.js');
const Steam = require('./steam.js');
const Stand = require('./stand.js');
const Path = require('path')
const ApiRequest = require('./api.js');
var user = [];

wppconnect
  .create({
    session: 'ZapWatch2',
    puppeteerOptions: {
      userDataDir: './tokens/ZapWatch2', // or your custom directory
    },
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));

async function start(client) {
  client.onMessage(async (message) => {
    try {
      var user_id = message.sender.id;
      var pushname = message.sender.pushname
      user = await ApiRequest.data.api('register', { user_id, pushname })

      if (typeof message.body != 'undefined') {
        var body = message.body.toLowerCase();
      } else {
        body = '';
      }
      if (body.includes('#menu')) {
        var menu = body.replace('#menu', '').trim();
        console.log(menu)
        switch (menu) {
          case '1':
            createMenuUtil(client, message);
            break;
          case '2':
            createMenuEntertain(client, message);
            break;
          case '3':
            createMenuJojo(client, message);
            break;
          default:
            createMenu(client, message);
        }
      } else if (body === '#assistir') {
        await getMovie(client, message);
      } else if (body.includes('#game')) {
        await getGame(client, message);
      } else if (body.includes('#decida')) {
        await getDecision(client, message);
      } else if (body.includes('#steam')) {
        await getSteam(client, message)
      } else if (body.includes('#megasena')) {
        loteryMake(client, message)
      } else if (body.includes('#jogodobicho')) {
        animalGame(client, message)
      } else if (body.includes('#meuperfil')) {
        var user_id = message.sender.id;
        var pushname = message.sender.pushname;
        user = await ApiRequest.data.api('register', { user_id, pushname })
        getMyProfile(client, message)

      } else if (body.includes('#meustand')) {
        getMyStand(client, message)
      } else if (body.includes('#definirstand')) {
        await setMyStand(client, message)
      } else if (body.includes('#redefinirstand')) {
        await redefMyStand(client, message)
      } else if (body.includes('#stand')) {
        await showStand(client, message)
      } else if (body.includes('#statusstand')) {
        console.log(body);
        await setRandomStats(client, message)
      } else if (body.includes('#criarinimigo')) {
        await createEnemy(client, message)
      } else if (body.includes('#inimigo')) {
        await getEnemy(client, message);
      } else if (body.includes('#atacar')) {
        attackEnemy(client, message)
      } else if (body.includes('#jojo')) {
        createMenuJojo(client, message);
      } else if (body.includes('#desciclopedia')) {
        var response = await axios.get('http://desciclopedia.org/wiki/Especial:Aleat%C3%B3ria')

        var $ = cheerio.load(response.data);

        var title = $('.firstHeading').text();
        var content = $('.mw-parser-output').text();

        var text = `*${title}* \n\n ${content} \n\n`

        sendMessage(client, message, text, '📚🤪 DESCICLOPÉDIA 🤪📚')
      } else if (body.includes('#gato')) {

        var response = await axios.get('https://cataas.com/cat/cute', {
          responseType: 'arraybuffer'
        })

        await client
          .sendImageFromBase64(
            message.from,
            text.img_link,
            'gatinho.jfif',
            '',
            message.id.toString()
          )
          .then((result) => {
            console.log('Result: ', result); //return object success
          })
          .catch((erro) => {
            sendMessage(client, message, 'Ocorreu um erro tente novamente mais tarde! ou reporte o erro!')
            console.error('Error when sending: ', erro); //return object error
          });

      }

    } catch (error) {
      console.log(error);
    }

    //  console.log(await client.getAllGroups());


  });
}

async function attackEnemy(client, message) {
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
                sendMessageNormalGroups(client, element, textMenu, '*RESULTADO DA BATALHA*', data.attackers)
              })
              //sendMessageNormal(client, message, textMenu, '*RESULTADO DA BATALHA*')
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

  sendMessageOptionsEnemy(client, message, textMenu, options)
}

async function getEnemy(client, message) {
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

async function createEnemy(client, message) {
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

  sendMessage(client, message, textMenu, 'INIMIGO')
}

async function showStand(client, message) {
  if (message.mentionedJidList.length > 0) {
    var user_id = message.mentionedJidList[0];
    user = await ApiRequest.data.api('getStand', { user_id })
    var textMenu = `*Usuário:* @${user_id.replace('@c.us', '')} \n*Stand:* ${user.stand} `
    textMenu += `\n\n*Poder:* ${user.pwr}\n*Alcance:* ${user.rng}\n*Velocidade:* ${user.spd}\n*Stamina:* ${user.sta}\n*Precisão:* ${user.prc}\n*Potencial:* ${user.dev}`

    sendMessageNormal(client, message, textMenu, '🕺🏻 *STAND* 💃')
  }
}

function getMyStand(client, message) {
  var textMenu = ''
  if (user.stand == 'Nenhum') {
    textMenu += `Você ainda não escolheu seu stand! para selecionar me envie uma mensagem no privado com o seguinte comando:\n*#definirstand* `
  } else {
    textMenu += `*Usuário:* ${message.sender.pushname} \n*Stand:* ${user.stand} `
    textMenu += `\n\n*Poder:* ${user.pwr}\n*Alcance:* ${user.rng}\n*Velocidade:* ${user.spd}\n*Stamina:* ${user.sta}\n*Precisão:* ${user.prc}\n*Potencial:* ${user.dev}`

  }
  sendMessage(client, message, textMenu, '💃 MEU STAND 🕺🏻')
}

async function setMyStand(client, message) {
  var genres = `Blues
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

  var textMenu = ``
  //SE FOR GRUPO N ACEITA
  if (message.isGroupMsg) {
    textMenu += '\n\n Este comando deve ser enviado no privado!'
  } else {
    //SE FOR NO PRIVADO
    //SE FOR AJUDA:
    if (message.body.replace('#definirstand ', '').length <= 1 || message.body.replace('#definirstand ', '') == 'ajuda' || message.body.replace('#definirstand', '').length <= 1) {
      sendMessage(client, message, `\n\nPara definir seu stand digite o comando abaixo seguido de um genêro musical:\n\n*#definirstand* genêro \n\n${genres}`, '❔ MEU STAND ❔')
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

  sendMessage(client, message, textMenu, '🕺🏻 MEU STAND 💃')
}

async function redefMyStand(client, message) {
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

  var textMenu = ``
  //SE FOR GRUPO N ACEITA
  if (message.isGroupMsg) {
    textMenu += '\n\n Este comando deve ser enviado no privado!\n*Irá consumir 100 de moedinhas!*'
  } else {
    //SE FOR NO PRIVADO
    //SE FOR AJUDA:
    if (message.body.replace('#redefinirstand ', '').length <= 1 || message.body.replace('#redefinirstand ', '') == 'ajuda' || message.body.replace('#redefinirstand', '').length <= 1) {
      sendMessage(client, message, `\n\nPara redefinir seu stand digite o comando abaixo seguido de um genêro musical:\n\n*#redefinirstand* genêro \n\n${genres} \n*Irá consumir 100 de moedinhas!!*`, '❔ MEU STAND ❔')
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

  sendMessage(client, message, textMenu, '🕺🏻 MEU STAND 💃')
}

async function setRandomStats(client, message) {

  var textMenu = ``
  //SE FOR GRUPO N ACEITA
  if (message.isGroupMsg) {
    textMenu += '\n\n Este comando deve ser enviado no privado!'
  } else {
    //SE FOR NO PRIVADO
    //SE FOR AJUDA:
    /*
    if (message.body.replace('#statusstand ', '').length <= 1 || message.body.replace('#statusstand ', '') == 'ajuda' || message.body.replace('#statusstand', '').length <= 1) {
      sendMessage(client, message, `\n\nPara definir os status do seu stand digite o comando abaixo:\n\n*#standstatus* \n\n${genres}`, '❔ MEU STAND ❔')
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

  sendMessage(client, message, textMenu, '🕺🏻 MEU STAND 💃')
}


function getMyProfile(client, message) {
  var textMenu =
    `

Olá *${message.sender.pushname}*\n

*Stand:* ${user.stand}
*Level:* ${user.level}
*Exp:* ${user.exp}/${user.exp_max}
*Moedinhas:* ${user.gold}
 
  
    `
  sendMessage(client, message, textMenu, '👤 MEU PERFIL 👤')
}

function loteryMake(client, message) {
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
  var text = `  \n

*Os números sorteados vão ser :*\n

${numbers.join('  -  ')} \n

~é verdade este bilhete~
  `
  sendMessage(client, message, text, '🍀 MEGA-SENA 🍀')

}


function createMenu(client, message) {
  var textMenu = `Olá *${message.sender.pushname}*\n
*Level:* ${user.level}
  
Escolha uma das categorias de comandos abaixo:

*#menu 1:* 🔨 Utilidades
*#menu 2:* 🎲 Diversão
*#menu 3:* 🕺🏻  Jojo Game

  `
  sendMessage(client, message, textMenu, '🗃️ MENU PRINCIPAL 🗃️')
}

async function createMenuJojo(client, message) {
  var textMenu = `Olá *${message.sender.pushname}*\n

- *#meustand* - Exibe seu fabuloso stand para geral.
- *#stand* @usuario - Retorna o stand da pessoa marcada. 
- *#definirstand* - Define seu stand aleatoriamente *NO PRIVADO*. 
- *#redefinirstand* - Redefine seu stand aleatoriamente *NO PRIVADO*. 
- *#inimigo* - Exibe o inimigo atual. 
- *#atacar* - Realiza ataque ao inimigo *UMA VEZ POR INIMIGO*. 

  `
  sendMessage(client, message, textMenu, '🕺🏻 JOJO GAME 💃')
}


async function createMenuEntertain(client, message) {
  var textMenu = `Olá *${message.sender.pushname}*\n

- *#decida* opcão1,opção2,opção3 - Decide para você entre as opções.
- *#megasena* - Retorna os números para jogar na mega!. 
- *#jogodobicho* - Retorna os números para jogar na mega!. 

  `
  sendMessage(client, message, textMenu, '🎲 Diversão 🎲')
}

function createMenuUtil(client, message) {
  var textMenu = `Olá *${message.sender.pushname}*\n

- *#assistir* - retorna um filme ou série aleatória;
- *#game* nomejogo - Retorna um jogo e seu link para download
- *#steam* nomejogo - Retorna uma lista de jogos na steam 

  `
  sendMessage(client, message, textMenu, '🔨 UTILIDADES 🔨')
}

async function getSteam(client, message) {
  if (message.body.replace('#steam ', '').length <= 1 || message.body.replace('#steam ', '') == 'ajuda' || message.body.replace('#steam', '').length <= 1) {
    sendMessage(client, message, `\n\nEx: *#steam* nome do jogo - Pesquisa jogos na steam. `, '❔ STEAM ❔')
    return true
  }

  sendMessage(client, message, `\n\nAguarde... vou procurar o jogo na Steam para você`, '🕹️ STEAM 👾');
  var gameName = message.body.replace('#steam', '');
  var game = await Steam.data.getSteam(gameName);
  if (!game.error) {
    sendMessage(client, message, game.text, '🕹️ STEAM 👾');
  } else {
    sendMessage(client, message, 'Não foi possivel encontrar o jogo!', '🕹️ STEAM 👾')
  }
}

async function getDecision(client, message) {
  var result = message.body.replace('#decida', '')
  if (result == ' ajuda' || result == '') {
    sendMessage(client, message, `\n\nEx: *#decida* opção1,opção2,opção3 - Escolhe uma opção aleatoriamente dentre as opções. `, '❔ LINEUZINHO DECIDE ❔');
    return true;
  }

  var decisions = message.body.replace('#decida', '').split(',');
  var item = decisions[Math.floor(Math.random() * decisions.length)];
  var text = `\n\nMinha escolha é:  *${item.trim()}* \n\nSe você não queria fazer isto, agora vai!`;
  sendMessage(client, message, text, '🎲 LINEUZINHO DECIDE 🎲');
  return true;
}

async function getMovie(client, message) {
  sendMessage(client, message, 'Aguarde... estou procurando para você', '🎬 Filmes e séries 🎬');
  var movie = await movieRandom.data.getMovie();
  sendImage(client, message, movie, '🎬 Filmes e séries 🎬');
}

async function getGame(client, message) {
  sendMessage(client, message, 'Aguarde... estou procurando o jogo para você');
  var gameName = message.body.replace('#jogo', '');
  var game = await gameSearch.data.getGame(gameName);
  if (!game.error) {
    if (game.poster_path == '') {
      sendMessage(client, message, game.text, '🏴‍☠️ BAÍA DOS PIRATAS 🦜');
    } else {
      sendImage(client, message, game);
    }
  } else {
    sendMessage(client, message, 'Não foi possivel encontrar o jogo!', '🏴‍☠️ BAÍA DOS PIRATAS 🦜')
  }
}

async function sendMessageNormalGroups(client, group, text, title, attackers) {
  console.log(group);
  client
    .sendMentioned(group, title + '\n\n' + text + ' \n\n 🥸 ```Lineuzinho```', attackers)
    .then((result) => {
      console.log('Result: ', result); //return object success
    })
    .catch((erro) => {
      console.error('Error when sending: ', erro); //return object error
    });
}

async function sendMessageNormal(client, message, text, title) {
  client
    .reply(message.from, title + '\n\n' + text + ' \n\n 🥸 ```Lineuzinho```', message.id.toString())
    .then((result) => {
      // console.log('Result: ', result); //return object success
    })
    .catch((erro) => {
      console.error('Error when sending: ', erro); //return object error
    });
}

async function sendMessage(client, message, text, title) {

  buttons = [{
    buttonId: 'id1',
    buttonText: {
      displayText: 'by: Maer Costa',
    },
    type: 1,
  }]

  await client.sendMessageOptions(message.from, '\n\n' + text + '\n\n', {
    title: title,
    footer: '🥸 Lineuzinho',
    quotedMessageId: message.id.toString(),
    isDynamicReplyButtonsMsg: true,
    dynamicReplyButtons: buttons,
  }).then((result) => {
    //  console.log('Result: ', result); //return object success
  })
    .catch((erro) => {
      console.error('Error when sending: ', erro); //return object error
    });;
  /*
    client
      .reply(message.from, text + ' \n\n 🥸 ```Lineuzinho```', message.id.toString())
      .then((result) => {
        // console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });
      */
}

async function sendMessageOptionsEnemy(client, message, textMenu, options) {

  buttons = [{
    buttonId: 'id1',
    buttonText: {
      displayText: '#atacar',
    },
    type: 1,
  }]

  options.forEach(element => {
    buttons.push({
      buttonId: element,
      buttonText: {
        displayText: element,
      },
      type: 1,
    })
  })

  await client.sendMessageOptions(message.from, '\n\n' + textMenu, {
    title: 'Ataque',
    footer: '🥸 Lineuzinho',
    isDynamicReplyButtonsMsg: true,
    dynamicReplyButtons: buttons,
  });


}

async function sendImage(client, message, text) {
  await client
    .sendImage(
      message.from,
      Path.resolve(__dirname, 'images', text.poster_path + '.jpg'),
      text.poster_path,
      text.text + '\n\n 🥸 ```Lineuzinho```',
      message.id.toString()
    )
    .then((result) => {
      console.log('Result: ', result); //return object success
    })
    .catch((erro) => {
      sendMessage(client, message, 'Ocorreu um erro tente novamente mais tarde! ou reporte o erro!')
      console.error('Error when sending: ', erro); //return object error
    });
}

async function sendImageUrl(client, message, text) {
  await client
    .sendImageFromBase64(
      message.from,
      text.img_link,
      text.poster_path,
      text.text,
      message.id.toString()
    )
    .then((result) => {
      console.log('Result: ', result); //return object success
    })
    .catch((erro) => {
      sendMessage(client, message, 'Ocorreu um erro tente novamente mais tarde! ou reporte o erro!')
      console.error('Error when sending: ', erro); //return object error
    });
}


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


function animalGame(client, message) {

  var numArr = new Array("001 - Avestruz", "002 - Avestruz", "003 - Avestruz", "004 - Avestruz", "005 - Águia", "006 - Águia", "007 - Águia", "008 - Águia", "009 - Burro", "010 - Burro", "011 - Burro", "012 - Burro", "013 - Borboleta", "014 - Borboleta", "015 - Borboleta", "016 - Borboleta", "017 - Cachorro", "018 - Cachorro", "019 - Cachorro", "020 - Cachorro", "021 - Cabra", "022 - Cabra", "023 - Cabra", "024 - Cabra", "025 - Carneiro", "026 - Carneiro", "027 - Carneiro", "028 - Carneiro", "029 - Camelo", "030 - Camelo", "031 - Camelo", "032 - Camelo", "033 - Cobra", "034 - Cobra", "035 - Cobra", "036 - Cobra", "037 - Coelho", "038 - Coelho", "039 - Coelho", "040 - Coelho", "041 - Cavalo", "042 - Cavalo", "043 - Cavalo", "044 - Cavalo", "045 - Elefante", "046 - Elefante", "047 - Elefante", "048 - Elefante", "049 - Galo", "050 - Galo", "051 - Galo", "052 - Galo", "053 - Gato", "054 - Gato", "055 - Gato", "056 - Gato", "057 - Jacaré", "058 - Jacaré", "059 - Jacaré", "060 - Jacaré", "061 - Leão", "062 - Leão", "063 - Leão", "064 - Leão", "065 - Macaco", "066 - Macaco", "067 - Macaco", "068 - Macaco", "069 - Porco", "070 - Porco", "071 - Porco", "072 - Porco", "073 - Pavão", "074 - Pavão", "075 - Pavão", "076 - Pavão", "077 - Peru", "078 - Peru", "079 - Peru", "080 - Peru", "081 - Touro", "082 - Touro", "083 - Touro", "084 - Touro", "085 - Tigre", "086 - Tigre", "087 - Tigre", "088 - Tigre", "089 - Urso", "090 - Urso", "091 - Urso", "092 - Urso", "093 - Veado", "094 - Veado", "095 - Veado", "096 - Veado", "097 - Vaca", "098 - Vaca", "099 - Vaca", "100 - Vaca", "101 - Avestruz", "102 - Avestruz", "103 - Avestruz", "104 - Avestruz", "105 - Águia", "106 - Águia", "107 - Águia", "108 - Águia", "109 - Burro", "110 - Burro", "111 - Burro", "112 - Burro", "113 - Borboleta", "114 - Borboleta", "115 - Borboleta", "116 - Borboleta", "117 - Cachorro", "118 - Cachorro", "119 - Cachorro", "120 - Cachorro", "121 - Cabra", "122 - Cabra", "123 - Cabra", "124 - Cabra", "125 - Carneiro", "126 - Carneiro", "127 - Carneiro", "128 - Carneiro", "129 - Camelo", "130 - Camelo", "131 - Camelo", "132 - Camelo", "133 - Cobra", "134 - Cobra", "135 - Cobra", "136 - Cobra", "137 - Coelho", "138- Coelho", "139- Coelho", "140- Coelho", "141 - Cavalo", "142 - Cavalo", "143 - Cavalo", "144 - Cavalo", "145 - Elefante", "146 - Elefante", "147 - Elefante", "148 - Elefante", "149 - Galo", "150 - Galo", "151 - Galo", "152 - Galo", "153 - Gato", "154 - Gato", "155 - Gato", "156 - Gato", "157 - Jacaré", "158 - Jacaré", "159 - Jacaré", "160 - Jacaré", "161 - Leão", "162 - Leão", "163 - Leão", "164 - Leão", "165 - Macaco", "166 - Macaco", "167 - Macaco", "168 - Macaco", "169 - Porco", "170 - Porco", "171 - Porco", "172 - Porco", "173 - Pavão", "174 - Pavão", "175 - Pavão", "176 - Pavão", "177 - Peru", "178 - Peru", "179 - Peru", "180 - Peru", "181 - Touro", "182 - Touro", "183 - Touro", "184 - Touro", "185 - Tigre", "186 - Tigre", "187 - Tigre", "188 - Tigre", "189 - Urso", "190 - Urso", "191 - Urso", "192 - Urso", "193 - Veado", "194 - Veado", "195 - Veado", "196 - Veado", "197 - Vaca", "198 - Vaca", "199 - Vaca", "200 - Vaca", "201 - Avestruz", "202 - Avestruz", "203 - Avestruz", "204 - Avestruz", "205 - Águia", "206 - Águia", "207 - Águia", "208 - Águia", "209 - Burro", "210 - Burro", "211 - Burro", "212 - Burro", "213 - Borboleta", "214 - Borboleta", "215 - Borboleta", "216  - Borboleta", "217 - Cachorro", "218 - Cachorro", "219 - Cachorro", "220 - Cachorro", "221 - Cabra", "222 - Cabra", "223 - Cabra", "224 - Cabra", "225 - Carneiro", "226 - Carneiro", "227 - Carneiro", "228 - Carneiro", "229 - Camelo", "230 - Camelo", "231 - Camelo", "232 - Camelo", "233 - Cobra", "234 - Cobra", "235 - Cobra", "236 - Cobra", "237 - Coelho", "238 - Coelho", "239 - Coelho", "240 - Coelho", "241 - Cavalo", "242 - Cavalo", "243 - Cavalo", "244 - Cavalo", "245 - Elefante", "246 - Elefante", "247 - Elefante", "248 - Elefante", "249 - Galo", "250 - Galo", "251 - Galo", "252 - Galo", "253 - Gato", "254 - Gato", "255 - Gato", "256 - Gato", "257 - Jacaré", "258 - Jacaré", "259 - Jacaré", "260 - Jacaré", "261 - Leão", "262 - Leão", "263 - Leão", "264 - Leão", "265 - Macaco", "266 - Macaco", "267 - Macaco", "268 - Macaco", "269 - Porco", "270 - Porco", "271 - Porco", "272 - Porco", "273 - Pavão", "274 - Pavão", "275 - Pavão", "276 - Pavão", "277 - Peru", "278 - Peru", "279 - Peru", "280 - Peru", "281 - Touro", "282 - Touro", "283 - Touro", "284 - Touro", "285 - Tigre", "286 - Tigre", "287 - Tigre", "288 - Tigre", "289 - Urso", "290 - Urso", "291 - Urso", "292 - Urso", "293 - Veado", "294 - Veado", "295 - Veado", "296 - Veado", "297 - Vaca", "298 - Vaca", "299 - Vaca", "300 - Vaca", "301 - Avestruz", "302 - Avestruz", "303 - Avestruz", "304 - Avestruz", "305 - Águia", "306 - Águia", "307 - Águia", "308 - Águia", "309 - Burro", "310 - Burro", "311 - Burro", "312 - Burro", "313 - Borboleta", "314 - Borboleta", "315 - Borboleta", "316 - Borboleta", "317 - Cachorro", "318 - Cachorro", "319 - Cachorro", "320 - Cachorro", "321 - Cabra", "322 - Cabra", "323 - Cabra", "324 - Cabra", "325 - Carneiro", "326 - Carneiro", "327 - Carneiro", "328 - Carneiro", "329 - Camelo", "330 - Camelo", "331 - Camelo", "332 - Camelo", "333 - Cobra", "334 - Cobra", "335 - Cobra", "336 - Cobra", "337 - Coelho", "338 - Coelho", "339 - Coelho", "340 - Coelho", "341- Cavalo", "342- Cavalo", "343- Cavalo", "344- Cavalo", "345 - Elefante", "346 - Elefante", "347 - Elefante", "348 - Elefante", "349 - Galo", "350 - Galo", "351 - Galo", "352 - Galo", "353 - Gato", "354 - Gato", "355 - Gato", "356 - Gato", "357 - Jacaré", "358 - Jacaré", "359 - Jacaré", "360 - Jacaré", "361 - Leão", "362 - Leão", "363 - Leão", "364 - Leão", "365 - Macaco", "366 - Macaco", "367 - Macaco", "368 - Macaco", "369 - Porco", "370 - Porco", "371 - Porco", "372 - Porco", "373 - Pavão", "374 - Pavão", "375 - Pavão", "376 - Pavão", "377 - Peru", "378 - Peru", "379 - Peru", "380 - Peru", "381 - Touro", "382 - Touro", "383 - Touro", "384 - Touro", "385 - Tigre", "386 - Tigre", "387 - Tigre", "388 - Tigre", "389 - Urso", "390 - Urso", "391 - Urso", "392 - Urso", "393 - Veado", "394 - Veado", "395 - Veado", "396 - Veado", "397 - Vaca", "398 - Vaca", "399 - Vaca", "400 - Vaca", "401 - Avestruz", "402 - Avestruz", "403 - Avestruz", "404 - Avestruz", "405 - Águia", "406 - Águia", "407 - Águia", "408 - Águia", "409 - Burro", "410 - Burro", "411 - Burro", "412 - Burro", "413 - Borboleta", "414 - Borboleta", "415 - Borboleta", "416 - Borboleta", "417 - Cachorro", "418 - Cachorro", "419 - Cachorro", "420 - Cachorro", "421 - Cabra", "422 - Cabra", "423 - Cabra", "424 - Cabra", "425 - Carneiro", "426 - Carneiro", "427 - Carneiro", "428 - Carneiro", "429 - Camelo", "430 - Camelo", "431 - Camelo", "432 - Camelo", "433 - Cobra", "434 - Cobra", "435 - Cobra", "436 - Cobra", "437 - Coelho", "438 - Coelho", "439 - Coelho", "440 - Coelho", "441 - Cavalo", "442 - Cavalo", "443 - Cavalo", "444 - Cavalo", "445 - Elefante", "446 - Elefante", "447 - Elefante", "448 - Elefante", "449 - Galo", "450 - Galo", "451 - Galo", "452 - Galo", "453 - Gato", "454 - Gato", "455 - Gato", "456 - Gato", "457 - Jacaré", "458 - Jacaré", "459 - Jacaré", "460 - Jacaré", "461 - Leão", "462 - Leão", "463 - Leão", "464 - Leão", "465 - Macaco", "466 - Macaco", "467 - Macaco", "468 - Macaco", "469 - Porco", "470 - Porco", "471 - Porco", "472 - Porco", "473 - Pavão", "474 - Pavão", "475 - Pavão", "476 - Pavão", "477 - Peru", "478 - Peru", "479 - Peru", "480 - Peru", "481 - Touro", "482 - Touro", "483 - Touro", "484 - Touro", "485 - Tigre", "486 - Tigre", "487 - Tigre", "488 - Tigre", "489 - Urso", "490 - Urso", "491 - Urso", "492 - Urso", "493 - Veado", "494 - Veado", "495 - Veado", "496 - Veado", "497 - Vaca", "498 - Vaca", "499 - Vaca", "500 - Vaca", "501 - Avestruz", "502 - Avestruz", "503 - Avestruz", "504 - Avestruz", "505 - Águia", "506 - Águia", "507 - Águia", "508 - Águia", "509 - Burro", "510 - Burro", "511 - Burro", "512 - Burro", "513 - Borboleta", "514 - Borboleta", "515 - Borboleta", "516 - Borboleta", "517 - Cachorro", "518 - Cachorro", "519 - Cachorro", "520 - Cachorro", "521 - Cabra", "522 - Cabra", "523 - Cabra", "524 - Cabra", "525 - Carneiro", "526 - Carneiro", "527 - Carneiro", "528 - Carneiro", "529 - Camelo", "530 - Camelo", "531 - Camelo", "532 - Camelo", "533 - Cobra", "534 - Cobra", "535 - Cobra", "536 - Cobra", "537 - Coelho", "538 - Coelho", "539 - Coelho", "540 - Coelho", "541- Cavalo", "542- Cavalo", "543- Cavalo", "544- Cavalo", "545 - Elefante", "546 - Elefante", "547 - Elefante", "548 - Elefante", "549 - Galo", "550 - Galo", "551 - Galo", "552 - Galo", "553 - Gato", "554 - Gato", "555 - Gato", "556 - Gato", "557 - Jacaré", "558 - Jacaré", "559 - Jacaré", "560 - Jacaré", "561 - Leão", "562 - Leão", "563 - Leão", "564 - Leão", "565 - Macaco", "566 - Macaco", "567 - Macaco", "568 - Macaco", "569 - Porco", "570 - Porco", "571 - Porco", "572 - Porco", "573 - Pavão", "574 - Pavão", "575 - Pavão", "576 - Pavão", "577 - Peru", "578 - Peru", "579 - Peru", "580 - Peru", "581 - Touro", "582 - Touro", "583 - Touro", "584 - Touro", "585 - Tigre", "586 - Tigre", "587 - Tigre", "588 - Tigre", "589 - Urso", "590 - Urso", "591 - Urso", "592 - Urso", "593 - Veado", "594 - Veado", "595 - Veado", "596 - Veado", "597 - Vaca", "598 - Vaca", "599 - Vaca", "600 - Vaca", "601 - Avestruz", "602 - Avestruz", "603 - Avestruz", "604 - Avestruz", "605 - Águia", "606 - Águia", "607 - Águia", "608 - Águia", "609 - Burro", "610 - Burro", "611 - Burro", "612 - Burro", "613 - Borboleta", "614 - Borboleta", "615 - Borboleta", "616 - Borboleta", "617 - Cachorro", "618 - Cachorro", "619 - Cachorro", "620 - Cachorro", "621 - Cabra", "622 - Cabra", "623 - Cabra", "624 - Cabra", "625 - Carneiro", "626 - Carneiro", "627 - Carneiro", "628 - Carneiro", "629 - Camelo", "630 - Camelo", "631 - Camelo", "632 - Camelo", "633 - Cobra", "634 - Cobra", "635 - Cobra", "636 - Cobra", "637 - Coelho", "638 - Coelho", "639 - Coelho", "640 - Coelho", "641 - Cavalo", "642 - Cavalo", "643 - Cavalo", "644 - Cavalo", "645 - Elefante", "646 - Elefante", "647 - Elefante", "648 - Elefante", "649 - Galo", "650 - Galo", "651 - Galo", "652 - Galo", "653 - Gato", "654 - Gato", "655 - Gato", "656 - Gato", "657 - Jacaré", "658 - Jacaré", "659 - Jacaré", "660 - Jacaré", "661 - Leão", "662 - Leão", "663 - Leão", "664 - Leão", "665 - Macaco", "666 - Macaco", "667 - Macaco", "668 - Macaco", "669 - Porco", "670 - Porco", "671 - Porco", "672 - Porco", "673 - Pavão", "674 - Pavão", "675 - Pavão", "676 - Pavão", "677 - Peru", "678 - Peru", "679 - Peru", "680 - Peru", "681 - Touro", "682 - Touro", "683 - Touro", "684 - Touro", "685 - Tigre", "686 - Tigre", "687 - Tigre", "688 - Tigre", "689 - Urso", "690 - Urso", "691 - Urso", "692 - Urso", "693 - Veado", "694 - Veado", "695 - Veado", "696 - Veado", "697 - Vaca", "698 - Vaca", "699 - Vaca", "700 - Vaca", "701 - Avestruz", "702 - Avestruz", "703 - Avestruz", "704 - Avestruz", "705 - Águia", "706 - Águia", "707 - Águia", "708 - Águia", "709 - Burro", "710 - Burro", "711 - Burro", "712 - Burro", "713 - Borboleta", "714 - Borboleta", "715 - Borboleta", "716 - Borboleta", "717 - Cachorro", "718 - Cachorro", "719 - Cachorro", "720 - Cachorro", "721 - Cabra", "722 - Cabra", "723 - Cabra", "724 - Cabra", "725 - Carneiro", "726 - Carneiro", "727 - Carneiro", "728 - Carneiro", "729 - Camelo", "730 - Camelo", "731 - Camelo", "732 - Camelo", "733 - Cobra", "734 - Cobra", "735 - Cobra", "736 - Cobra", "737 - Coelho", "738 - Coelho", "739 - Coelho", "740 - Coelho", "741 - Cavalo", "742 - Cavalo", "743 - Cavalo", "744 - Cavalo", "745 - Elefante", "746 - Elefante", "747 - Elefante", "748 - Elefante", "749 - Galo", "750 - Galo", "751 - Galo", "752 - Galo", "753 - Gato", "754 - Gato", "755 - Gato", "756 - Gato", "757 - Jacaré", "758 - Jacaré", "759 - Jacaré", "760 - Jacaré", "761 - Leão", "762 - Leão", "763 - Leão", "764 - Leão", "765 - Macaco", "766 - Macaco", "767 - Macaco", "768 - Macaco", "769 - Porco", "770 - Porco", "771 - Porco", "772 - Porco", "773 - Pavão", "774 - Pavão", "775 - Pavão", "776 - Pavão", "777 - Peru", "778 - Peru", "779 - Peru", "780 - Peru", "781 - Touro", "782 - Touro", "783 - Touro", "784 - Touro", "785 - Tigre", "786 - Tigre", "787 - Tigre", "788 - Tigre", "789 - Urso", "790 - Urso", "791 - Urso", "792 - Urso", "793 - Veado", "794 - Veado", "795 - Veado", "796 - Veado", "797 - Vaca", "798 - Vaca", "799 - Vaca", "800 - Vaca", "801 - Avestruz", "802 - Avestruz", "803 - Avestruz", "804 - Avestruz", "805 - Águia", "806 - Águia", "807 - Águia", "808 - Águia", "809 - Burro", "810 - Burro", "811 - Burro", "812 - Burro", "813 - Borboleta", "814 - Borboleta", "815 - Borboleta", "816 - Borboleta", "817 - Cachorro", "818 - Cachorro", "819 - Cachorro", "820 - Cachorro", "821 - Cabra", "822 - Cabra", "823 - Cabra", "824 - Cabra", "825 - Carneiro", "826 - Carneiro", "827 - Carneiro", "828 - Carneiro", "829 - Camelo", "830 - Camelo", "831 - Camelo", "832 - Camelo", "833 - Cobra", "834 - Cobra", "835 - Cobra", "836 - Cobra", "837 - Coelho", "838 - Coelho", "839 - Coelho", "840 - Coelho", "841 - Cavalo", "842 - Cavalo", "843 - Cavalo", "844 - Cavalo", "845 - Elefante", "846 - Elefante", "847 - Elefante", "848 - Elefante", "849 - Galo", "850 - Galo", "851 - Galo", "852 - Galo", "853 - Gato", "854 - Gato", "855 - Gato", "856 - Gato", "857 - Jacaré", "858 - Jacaré", "859 - Jacaré", "860 - Jacaré", "861 - Leão", "862 - Leão", "863 - Leão", "864 - Leão", "865 - Macaco", "866 - Macaco", "867 - Macaco", "868 - Macaco", "869 - Porco", "870 - Porco", "871 - Porco", "872 - Porco", "873 - Pavão", "874 - Pavão", "875 - Pavão", "876 - Pavão", "877 - Peru", "878 - Peru", "879 - Peru", "880 - Peru", "881 - Touro", "882 - Touro", "883 - Touro", "884 - Touro", "885 - Tigre", "886 - Tigre", "887 - Tigre", "888 - Tigre", "889 - Urso", "890 - Urso", "891 - Urso", "892 - Urso", "893 - Veado", "894 - Veado", "895 - Veado", "896 - Veado", "897 - Vaca", "898 - Vaca", "899 - Vaca", "900 - Vaca", "901 - Avestruz", "902 - Avestruz", "903 - Avestruz", "904 - Avestruz", "905 - Águia", "906 - Águia", "907 - Águia", "908 - Águia", "909 - Burro", "910 - Burro", "911 - Burro", "912 - Burro", "913 - Borboleta", "914 - Borboleta", "915 - Borboleta", "916 - Borboleta", "917 - Cachorro", "918 - Cachorro", "919 - Cachorro", "920 - Cachorro", "921 - Cabra", "922 - Cabra", "923 - Cabra", "924 - Cabra", "925 - Carneiro", "926 - Carneiro", "927 - Carneiro", "928 - Carneiro", "929 - Camelo", "930 - Camelo", "931 - Camelo", "932 - Camelo", "933 - Cobra", "934 - Cobra", "935 - Cobra", "936 - Cobra", "937 - Coelho", "938 - Coelho", "939 - Coelho", "940 - Coelho", "941 - Cavalo", "942 - Cavalo", "943 - Cavalo", "944 - Cavalo", "945 - Elefante", "946 - Elefante", "947 - Elefante", "948 - Elefante", "949 - Galo", "950 - Galo", "951 - Galo", "952 - Galo", "953 - Gato", "954 - Gato", "955 - Gato", "956 - Gato", "957 - Jacaré", "958 - Jacaré", "959 - Jacaré", "960 - Jacaré", "961 - Leão", "962 - Leão", "963 - Leão", "964 - Leão", "965 - Macaco", "966 - Macaco", "967 - Macaco", "968 - Macaco", "969 - Porco", "970 - Porco", "971 - Porco", "972 - Porco", "973 - Pavão", "974 - Pavão", "975 - Pavão", "976 - Pavão", "977 - Peru", "978 - Peru", "979 - Peru", "980 - Peru", "981 - Touro", "982 - Touro", "983 - Touro", "984 - Touro", "985 - Tigre", "986 - Tigre", "987 - Tigre", "988 - Tigre", "989 - Urso", "990 - Urso", "991 - Urso", "992 - Urso", "993 - Veado", "994 - Veado", "995 - Veado", "996 - Veado", "997 - Vaca", "998 - Vaca", "999 - Vaca", "000 - Vaca"); // Add elements here
  var currNum = Math.round((numArr.length - 1) * Math.random());
  console.log(numArr[currNum])

  var text = `\nAposta 10zão no : *${numArr[currNum]}*`
  sendMessage(client, message, text, '🐖 *JOGO DO BICHO* 🐄')
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