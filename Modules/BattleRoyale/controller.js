const axios = require('axios');
const ApiRequest = require('../../api.js');
const cheerio = require('cheerio');
const Stand = require('../../stand.js');
const Sender = require('../sender.js')


var methods = {};

methods.battleRoyale = async function battle(client, message) {
    var body = '';
    if (typeof message.body != 'undefined') {
        body = message.body.toLowerCase();
    }

    if (body.includes('#battleroyale')) {
        if (message.from == '553175782682-1476567802@g.us' || message.from == '553194977335-1602187003@g.us') {
            await battleRoyale(client, message);
        }
    } else if (body.includes('#matarbr')) {
        if (message.sender.id == '553194977335@c.us') {
            await killBattle(client, message);
        }
    } else if (body.includes('#startbr')) {
        if (message.sender.id == '553194977335@c.us') {
            await startBattle(client, message);
        }
    } else if (body.includes('#avisarbr')) {
        if (message.sender.id == '553194977335@c.us') {
            await alertBattle(client, message);
        }
    } else if (body.includes('#statsbr')) {
        if (message.from == '553175782682-1476567802@g.us' || message.from == '553194977335-1602187003@g.us') {
            await statsBattle(client, message);
        }
    }


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

async function alertBattle(client, message) {
    var responsebr = await ApiRequest.data.api('alertBattle')
    console.log(responsebr);
    Sender.sendMessageMentioned(client, message, responsebr.message, `Battle Royale`, responsebr.mentioneds)
}

async function statsBattle(client, message) {
    var responsebr = await ApiRequest.data.api('statsBattle')
    Sender.sendMessage(client, message, responsebr.message, `Battle Royale`)
}



exports.data = methods;
