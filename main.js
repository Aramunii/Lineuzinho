const wppconnect = require('@wppconnect-team/wppconnect');
const axios = require('axios');
const ApiRequest = require('./api.js');
const cheerio = require('cheerio');
const Path = require('path')
const Sender = require('./Modules/sender.js')

const Jojo = require('./Modules/Jojo/controller.js')
const Entertainment = require('./Modules/Entertainment/controller.js')
const Util = require('./Modules/Utility/controller.js')

var user = [];

wppconnect
  .create({
    session: 'ZapWatch22',
    puppeteerOptions: {
      userDataDir: './tokens/ZapWatch22', // or your custom directory
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
      var body = '';
      if (typeof message.body != 'undefined') {
        body = message.body.toLowerCase();
      }

      if (body.includes('#menu')) {
        var menu = body.replace('#menu', '').trim();
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
      } else if (body.includes('#jojo')) {
        await createMenuJojo(client, message);
      } else if (body.includes('#meuperfil')) {
        await getMyProfile(client, message)
      } else if (body === '#assistir') {
        await Util.data.getMovie(client, message);
      } else if (body.includes('#decida')) {
        await Entertainment.data.getDecision(client, message);
      }  else if (body.includes('#megasena')) {
        await Entertainment.data.loteryMake(client, message)
      } else if (body.includes('#jogodobicho')) {
        await Entertainment.data.animalGame(client, message)
      } else if (body.includes('#meustand')) {
        await Jojo.data.getMyStand(client, message, user)
      } else if (body.includes('#definirstand')) {
        await Jojo.data.setMyStand(client, message, user)
      } else if (body.includes('#redefinirstand')) {
        await Jojo.data.redefMyStand(client, message, user)
      } else if (body.includes('#stand')) {
        await Jojo.data.showStand(client, message, user)
      } else if (body.includes('#statusstand')) {
        await Jojo.data.setRandomStats(client, message, user)
      } else if (body.includes('#criarinimigo')) {
        await Jojo.data.createEnemy(client, message, user)
      } else if (body.includes('#inimigo')) {
        await Jojo.data.getEnemy(client, message, user);
      } else if (body.includes('#atacar')) {
        await Jojo.data.attackEnemy(client, message, user)
      } else if (body.includes('#desciclopedia2')) {
        await Entertainment.data.desciclopedia(client, message);
      } else if (body.includes('#gato')) {
        await Entertainment.data.getCat(client, message);
      } else if (body.includes('#inutil')) {
        await Entertainment.data.getRandomFact(client, message);
      } else if (body.includes('#espaço')) {
        await Util.data.data.getPeopleInSpace(client, message);
      } else if (body.includes('belina')) {
        Sender.sendImageName(client, message, 'belinao.jpg')
      } else if (message.mentionedJidList.length > 0) {
        if (message.mentionedJidList[0].replace('@c.us', '') == '553187208431') {
          Sender.sendImageName(client, message, 'belinao.jpg')
        }
      }

      await quintaSerie(client, message);

    } catch (error) {
      console.log(error);
    }
    //  console.log(await client.getAllGroups());
  });
}


function createMenu(client, message) {
  var textMenu = `Olá *${message.sender.pushname}*\n
*Level:* ${user.level}
  
Escolha uma das categorias de comandos abaixo:

*#menu 1:* 🔨 Utilidades
*#menu 2:* 🎲 Diversão
*#menu 3:* 🕺🏻  Jojo Game

  `
  Sender.sendMessage(client, message, textMenu, '🗃️ MENU PRINCIPAL 🗃️')
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
  Sender.sendMessage(client, message, textMenu, '🕺🏻 JOJO GAME 💃')
}

async function createMenuEntertain(client, message) {
  var textMenu = `Olá *${message.sender.pushname}*\n

- *#decida* opcão1,opção2,opção3 - Decide para você entre as opções.
- *#megasena* - Retorna os números para jogar na mega!. 
- *#jogodobicho* - Retorna os números para jogar na mega!. 
- *#gato* - Envia uma foto de um gato!.
- *#inutil* - Envia um Fato inutil da vida.
- *#desciclopedia* - Envia um artigo da desciclopedia.

  `
  Sender.sendMessage(client, message, textMenu, '🎲 Diversão 🎲')
}

function createMenuUtil(client, message) {
  var textMenu = `Olá *${message.sender.pushname}*\n

- *#assistir* - retorna um filme ou série aleatória;
- *#espaço* - Retorna quantas pessoas está no espaço.

  `
  Sender.sendMessage(client, message, textMenu, '🔨 UTILIDADES 🔨')
}


async function getMyProfile(client, message) {

  var user_id = message.sender.id;
  var pushname = message.sender.pushname;
  user = await ApiRequest.data.api('register', { user_id, pushname })
  var textMenu =
    `

Olá *${message.sender.pushname}*\n

*Stand:* ${user.stand}
*Level:* ${user.level}
*Exp:* ${user.exp}/${user.exp_max}
*Moedinhas:* ${user.gold}
 
  
    `
  Sender.sendMessage(client, message, textMenu, '👤 MEU PERFIL 👤')
}


async function quintaSerie(client, message) {
  var groups = [
    '553187113376-1392129124@g.us',
    '553195566348-1586988509@g.us',
    '553187574760-1577398055@g.us',
    '553194977335@c.us'
  ]

  if (groups.includes(message.from)) {
    var body = message.body.toLowerCase();
    var last2 = body.slice(-2);
    var last3 = body.slice(-3);
    if (['bom dia', 'bomdia'].includes(body)) {
      Sender.sendMessageNormal(client, message, `*Mermão bom dia é o caralho 😡😡😡 parceiro*\n*Isso aqui é o grupo da torcida jovem 🧑🏿🧑🏿, entendeu ?🤔*\n*Tu quer dar bom dia cria um grupo pra tua família👨‍👩‍👧‍👦👨‍👩‍👦‍👦👨‍👩‍👧👨‍👩‍👧‍👧 ai tu fica dando bom dia😡*`, '');
    }

    if (['ão', 'ao'].includes(last2)) {
      Sender.sendMessageNormal(client, message, '*Meu pau no seu butão!*', '');
    } else if (['sto', 'udo', 'uto', 'uco'].includes(last3)) {
      Sender.sendMessageNormal(client, message, '*Com meu pau te cutuco!*', '');
    } else if (['sta', 'ssa?', 'ssa', 'ssa!'].includes(last3)) {
      Sender.sendMessageNormal(client, message, '*Meu pau te atravessa!*', '');
    } else if (['ido',].includes(last3)) {
      Sender.sendMessageNormal(client, message, '*Meu pau no teu ouvido!*', '');
    } else if (['ota', 'ota!'].includes(last3)) {
      Sender.sendMessageNormal(client, message, '*Meu pau te sufoca!*', '');
    }
  }
}
