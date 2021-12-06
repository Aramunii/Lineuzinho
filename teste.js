//var another = require('./movie.js');
var another = require('./steam.js');
const fs = require('fs');
const axios = require('axios');
const Path = require('path')
const cheerio = require('cheerio');

async function teste() {


    var member = "auhsdahdaushd ão";

    var last2 = member.slice(-2);

    if (last2 == 'ão' || last2 == 'ao') {
        console.log('Meu pau no seu butão');
    }


}

teste();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function replaceToEmoji(number) {

}