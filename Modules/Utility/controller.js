const axios = require('axios');
const cheerio = require('cheerio');
const Sender = require('../sender.js')
const movieRandom = require('./movie.js');
const gameSearch = require('./game.js');
const Steam = require('./steam.js');
const Path = require('path')
const fs = require('fs');
var methods = {};

methods.getSteam = async function getSteam(client, message) {
    if (message.body.replace('#steam ', '').length <= 1 || message.body.replace('#steam ', '') == 'ajuda' || message.body.replace('#steam', '').length <= 1) {
        Sender.sendMessage(client, message, `\n\nEx: *#steam* nome do jogo - Pesquisa jogos na steam. `, '❔ STEAM ❔')
        return true
    }

    Sender.sendMessage(client, message, `\n\nAguarde... vou procurar o jogo na Steam para você`, '🕹️ STEAM 👾');
    var gameName = message.body.replace('#steam', '');
    var game = await Steam.data.getSteam(gameName);
    if (!game.error) {
        Sender.sendMessage(client, message, game.text, '🕹️ STEAM 👾');
    } else {
        Sender.sendMessage(client, message, 'Não foi possivel encontrar o jogo!', '🕹️ STEAM 👾')
    }
}

methods.getMovie = async function getMovie(client, message) {
    Sender.sendMessage(client, message, 'Aguarde... estou procurando para você', '🎬 Filmes e séries 🎬');
    var movie = await movieRandom.data.getMovie();
    Sender.sendImage(client, message, movie, '🎬 Filmes e séries 🎬');
}

methods.getGame = async function getGame(client, message) {
    Sender.sendMessage(client, message, 'Aguarde... estou procurando o jogo para você', '🏴‍☠️ BAÍA DOS PIRATAS 🦜');
    var gameName = message.body.replace('#jogo', '');
    var game = await gameSearch.data.getGame(gameName);
    if (!game.error) {
        if (game.poster_path == '') {
            Sender.sendMessage(client, message, game.text, '🏴‍☠️ BAÍA DOS PIRATAS 🦜');
        } else {
            Sender.sendImage(client, message, game);
        }
    } else {
        Sender.sendMessage(client, message, 'Não foi possivel encontrar o jogo!', '🏴‍☠️ BAÍA DOS PIRATAS 🦜')
    }
}

methods.getPeopleInSpace = async function getPeopleInSpace(client, message) {
    var response = await axios.get('https://www.howmanypeopleareinspacerightnow.com/peopleinspace.json');
    var json = response.data;
    var text = `Atualmente *${json.number}* pessoas estão no espaço!\n\n`;

    var peoples = json.people.map(people => {
        return `*${people.name}*\n*País:* ${capitalizeFirstLetter(people.country)}\n*Cargo:* ${people.title}\n*Dias no espaço:* ${diffDays(people.launchdate)}\n\n`;
    })


    text += peoples.join('\n');

    Sender.sendMessage(client, message, text, '👩🏻‍🚀 PESSOAS NO ESPAÇO 🚀')

}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function diffDays(date) {
    const date1 = new Date(date);
    const date2 = new Date();
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays + ' dias';
}



exports.data = methods;
