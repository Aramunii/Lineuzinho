const wppconnect = require('@wppconnect-team/wppconnect');
const axios = require('axios');
const cheerio = require('cheerio');
const Path = require('path')
const ApiRequest = require('./api.js');
const Sender = require('./Modules/sender.js')
const Jojo = require('./Modules/Jojo/controller.js')
const Entertainment = require('./Modules/Entertainment/controller.js')
const Util = require('./Modules/Utility/controller.js');
const BattleRoyale = require('./Modules/BattleRoyale/controller.js');
//const wa = require('@open-wa/wa-automate');

var user = [];
var groups = [];

wppconnect
  .create({
    session: 'ZapWatch22',
    puppeteerOptions: {
      userDataDir: './tokens/ZapWatch22', // or your custom directory
    },
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));

/*
wa.create({
  sessionId: "Lineuzinho",
  multiDevice: false, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: 'PT_BR',
  logConsole: true,
  popup: true,
  useChrome: true,
      chromeOptions: {
      userDataDir: './tokens/ZapWatch22', // or your custom directory
    },
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));
*/
async function start(client) {


  client.onMessage(async (message) => {
    try {
      console.log(message);
      var user_id = message.sender.id;
      var pushname = message.sender.pushname
      groups = await client.getAllGroups();
      user = await ApiRequest.data.api('register', { user_id, pushname, message, groups })
      groups = user.groups;
      var body = '';
      if (typeof message.body != 'undefined') {
        body = message.body.toLowerCase();
      }

      if (body.includes('#teste')) {
        Sender.sendSticker(client, message, '');
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
      } else if (body.includes('#assistir')) {
        var ver = body.replace('#assistir', '').trim();
        console.log(ver);
        if (ver == '') {
          await Util.data.getMovie(client, message);
        } else {
          if (ver.length < 2) {
            Sender.sendMessage(client, message, 'Digite o nome do filme completo por favor!', '*ERRO*')
          } else {
            await Util.data.getMovieSearch(client, message, ver);
          }
        }
      } else if (body.includes('#decida')) {
        await Entertainment.data.getDecision(client, message);
      } else if (body.includes('#megasena')) {
        await Entertainment.data.loteryMake(client, message)
      } else if (body.includes('#jogodobicho')) {
        await Entertainment.data.animalGame(client, message)
      }
      else if (body.includes('#meustand')) {
        await Jojo.data.getMyStand(client, message, user)
      } else if (body.includes('#definirstand')) {
        await Jojo.data.setMyStand(client, message, user)
      } else if (body.includes('#redefinirstand')) {
        await Jojo.data.redefMyStand(client, message, user)
      } else if (body.includes('#stand')) {
        await Jojo.data.showStand(client, message, user)
      } else if (body.includes('#statusstand')) {
        await Jojo.data.setRandomStats(client, message, user)
      }  /*else if (body.includes('#criarinimigo')) {
        await Jojo.data.createEnemy(client, message, user)
      } else if (body.includes('#inimigo')) {
        await Jojo.data.getEnemy(client, message, user);
      } else if (body.includes('#atacar')) {
        await Jojo.data.attackEnemy(client, message, user)
      }*/ else if (body.includes('#desciclopedia2')) {
        await Entertainment.data.desciclopedia(client, message);
      } else if (body.includes('#gato')) {
        await Entertainment.data.getCat(client, message);
      } else if (body.includes('#dog')) {
        await Entertainment.data.getDog(client, message);
      } else if (body.includes('#quack')) {
        await Entertainment.data.getDuck(client, message);
      } else if (body.includes('#inutil')) {
        await Entertainment.data.getRandomFact(client, message);
      } else if (body.includes('#espa??o')) {
        await Util.data.getPeopleInSpace(client, message);
      } else if (body.includes('belina')) {
        Sender.sendImageName(client, message, 'belinao.jpg')
      } else if (message.mentionedJidList.length > 0) {
        if (message.mentionedJidList[0].replace('@c.us', '') == '553187208431') {
          Sender.sendImageName(client, message, 'belinao.jpg')
        }
      } else if (body.includes('#netflix')) {
        await Util.data.JustWatch(client, message, 'netflix')
      } else if (body.includes('#primevideo')) {
        await Util.data.JustWatch(client, message, 'primevideo')
      } else if (body.includes('#disney')) {
        await Util.data.JustWatch(client, message, 'disney')
      } else if (body.includes('#starplus')) {
        await Util.data.JustWatch(client, message, 'starplus')
      } else if (body.includes('#hbo')) {
        await Util.data.JustWatch(client, message, 'hbo')
      } else if (body.includes('#paramount')) {
        await Util.data.JustWatch(client, message, 'paramount')
      } else if (body.includes('#hojenahistoria')) {
        await Util.data.TodayHistory(client, message);
      } else if (body.includes('#quintaserie')) {
        var status = body.replace('#quintaserie', '').trim()
        var responseg = await ApiRequest.data.api('setQuinta', { message, status })
        groups = responseg.groups;
        Sender.sendMessage(client, message, responseg.message, '*QUINTA S??RIE*')
      } else if (body.includes('#desmotiva')) {
        await Entertainment.data.desmotive(client, message);
      } else if (message.caption == '#s') {
        await Sender.sendSticker(client, message, message.body);
      } else if (body.includes('#converte')) {
        await Util.data.getCurrency(client, message);
      } else if (body.includes('#fala')) {
        await Util.data.getPolly(client, message);
      }else if (body.includes('#musica')) {
        await Util.data.getLyric(client, message);
      }

      await BattleRoyale.data.battleRoyale(client, message);

      await quintaSerie(client, message, groups);

    } catch (error) {
      console.log(error);
    }
    //  console.log(await client.getAllGroups());
  });
}

async function battleRoyale(client, message) {
  var user_id = message.sender.id;
  var group_id = message.from;
  var responsebr = await ApiRequest.data.api('registerBattle', { user_id, group_id })
  console.log(responsebr);
  Sender.sendMessage(client, message, `*Stands vivos nesta rodada:* ${responsebr.players}\n\n` + responsebr.message, `Battle Royale \n\nRound *${responsebr.round.id}*`)
}

async function killBattle(client, message) {
  var responsebr = await ApiRequest.data.api('killPlayer')
  Sender.sendMessage(client, message, responsebr.message, `Battle Royale Round *${responsebr.round.id}*`)
}

async function startBattle(client, message) {
  var responsebr = await ApiRequest.data.api('startBattle')
  console.log(responsebr);
  Sender.sendMessage(client, message, responsebr.message, `Battle Royale`)
}



function createMenu(client, message) {
  var textMenu = `Ol?? *${message.sender.pushname}*\n
*Level:* ${user.level}
  
Escolha uma das categorias de comandos abaixo:

*#menu 1:* ???? Utilidades
*#menu 2:* ???? Divers??o
*#menu 3:* ????????  Jojo Game

  `
  Sender.sendMessage(client, message, textMenu, '??????? MENU PRINCIPAL ???????')
}

async function createMenuJojo(client, message) {
  var textMenu = `Ol?? *${message.sender.pushname}*\n

- *#meustand* - Exibe seu fabuloso stand para geral.
- *#stand* @usuario - Retorna o stand da pessoa marcada. 
- *#definirstand* - Define seu stand aleatoriamente *NO PRIVADO*. 
- *#redefinirstand* - Redefine seu stand aleatoriamente *NO PRIVADO*. 
- *#battleroyale* - Entra no Round atual se tiver.
- *#statsbr* - Verifica o status do round atual.

GRUPO PARA JOGAR: 
https://chat.whatsapp.com/HaMLdzRCYBwF2VoQHT7Bo7

`
  Sender.sendMessage(client, message, textMenu, '???????? JOJO GAME ????')
}

async function createMenuEntertain(client, message) {
  var textMenu = `Ol?? *${message.sender.pushname}*\n

- *#decida* opc??o1,op????o2,op????o3 - Decide para voc?? entre as op????es.
- *#megasena* - Retorna os n??meros para jogar na mega!. 
- *#jogodobicho* - Retorna os n??meros para jogar na mega!. 
- *#gato* - Envia uma foto de um gato!.
- *#dog* - Envia uma foto de um cachorro!.
- *#quack* - Envia uma foto de um pato!.
- *#inutil* - Envia um Fato inutil da vida.
- *#desmotiva* - Coach reverso!

  `
  Sender.sendMessage(client, message, textMenu, '???? Divers??o ????')
}

function createMenuUtil(client, message) {
  var textMenu = `Ol?? *${message.sender.pushname}*\n

- *#assistir* - retorna um filme ou s??rie aleat??ria;
- *#assistir* nome filme - retorna informa????es sobre o filme;
- *#espa??o* - Retorna quantas pessoas est?? no espa??o.
- *#netflix*  - Retorna novidades da Netflix
- *#primevideo* - Retorna novidades da Prime video 
- *#disney* - Retorna novidades da Disney Plus
- *#hbo* - Retorna novidades da Hbo Max
- *#paramount* - Retorna novidades da Paramount
- *#starplus* - Retorna novidades da Star Plus
- *#hojenahistoria* - Retorna acontecimentos hist??ricos no dia de hoje
- *#converte* *VALOR* *MOEDA1* *MOEDA2* - faz a taxa de convers??o.
- *#converte ajuda* - verifica as moedas disponiveis.
- *#fala jp texto* -  fala em japones (colocando jpm fala com voz de homem)
- *#fala pt texto* -  fala em portugu??s (colocando ptm fala com voz de homem)
  `
  Sender.sendMessage(client, message, textMenu, '???? UTILIDADES ????')
}


async function getMyProfile(client, message) {

  var user_id = message.sender.id;
  var pushname = message.sender.pushname;
  user = await ApiRequest.data.api('register', { user_id, pushname })
  var textMenu =
    `

Ol?? *${message.sender.pushname}*\n

*Stand:* ${user.stand}
*Level:* ${user.level}
*Exp:* ${user.exp}/${user.exp_max}
*Moedinhas:* ${user.gold}

*Battle Royale*

*???? Venceu:* ${user.playerWinner}
*?????? Matou:* ${user.playerKills}
*?????? Morreu:* ${user.playerDeath}
  
    `
  Sender.sendMessage(client, message, textMenu, '???? MEU PERFIL ????')
}


async function quintaSerie(client, message, groups) {
  if (groups.includes(message.from)) {
    if (message.body) {
      var body = message.body.toLowerCase();
      var last2 = body.slice(-2);
      var last3 = body.slice(-3);
      var last4 = body.slice(-4);
      if (['bom dia', 'bomdia'].includes(body)) {
        Sender.sendMessageNormal(client, message, `*Merm??o bom dia ?? o caralho ???????????? parceiro*\n*Isso aqui ?? o grupo da torcida jovem ????????????????, entendeu ?????*\n*Tu quer dar bom dia cria um grupo pra tua fam??lia????????????????????????????????????????????????????????????????????????????????????????????? ai tu fica dando bom dia????* *Aqui ?? psicopata????????????, ladr??o????bandido????????????????????????cheirador????????????????????????, vendedor de droga????????, pol??cia maluco????????????????????????????????  pol??cia assaltante??????????????????????????????, aqui tem a porra???? toda merm??o, isso aqui ?? a torcidav????????????????jovem???????do FLAMENGO???????, bom dia ?? o caralho rap??????????, vtnc ????*`, '');
      }

      if (['??o', 'ao'].includes(last2)) {
        var frases = ['Meu pau na tua m??o', 'Meu pau no seu but??o!']
        Sender.sendMessageNormal(client, message, `*${frases[Math.round((frases.length - 1) * Math.random())]}*`, '');
      } else if (['uto', 'uco'].includes(last3)) {
        Sender.sendMessageNormal(client, message, '*Com meu pau te cutuco!*', '');
      } else if (['ssa?', 'ssa', 'ssa!'].includes(last3)) {
        Sender.sendMessageNormal(client, message, '*Meu pau te atravessa!*', '');
      } else if (['vido',].includes(last4)) {
        Sender.sendMessageNormal(client, message, '*Meu pau no teu ouvido!*', '');
      } else if (['ota', 'ota!'].includes(last3)) {
        Sender.sendMessageNormal(client, message, '*Meu pau te sufoca!*', '');
      } else if (['undo', 'undo!'].includes(last4)) {
        Sender.sendMessageNormal(client, message, '*Meu pau no seu fundo!*', '');
      } else if (['ente', 'ente!'].includes(last4)) {
        Sender.sendMessageNormal(client, message, '*Meu pau no seu dente!*', '');
      }
    }

  }
}


