//var another = require('./movie.js');
var another = require('./steam.js');
const fs = require('fs');
const axios = require('axios');
const Path = require('path')
const cheerio = require('cheerio');
const translate = require('translate');
const skybiometry = require('skybiometry');

async function teste() {
    var response = await axios.get('https://www.howmanypeopleareinspacerightnow.com/peopleinspace.json');
    var json = response.data;
    var text = `Atualmente ${json.number} pessoas estão no espaço!\n\n`;

    var peoples = json.people.map(people => {
        return `*${people.name}*\n*País:* ${capitalizeFirstLetter(people.country)}\n*Cargo:*${people.title}\n*Dias no espaço:* ${diffDays(people.launchdate)}`;
    })


    text += peoples.join('\n');


    console.log(text);

}

teste();


function diffDays(date) {
    const date1 = new Date(date);
    const date2 = new Date();
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays + ' dias';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function replaceToEmoji(number) {

}