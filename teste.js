//var another = require('./movie.js');
var another = require('./steam.js');
const fs = require('fs');
const axios = require('axios');
const Path = require('path')
const cheerio = require('cheerio');

async function teste() {

    var response = await axios.get('https://cataas.com/cat/cute', {
        responseType: 'arraybuffer'
    })

    console.log(Buffer.from(response.data, 'binary').toString('base64'));



}

teste();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function replaceToEmoji(number) {

}