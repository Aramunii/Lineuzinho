const fs = require('fs');
const axios = require('axios');
const Path = require('path')
const cheerio = require('cheerio');
const translate = require('translate');
const { Socket } = require('socket.io-client');

async function teste() {

    var response = await axios.get('https://pt.wikipedia.org/wiki/Wikip%C3%A9dia:P%C3%A1gina_principal');
    var $ = cheerio.load(response.data);
    var maincontent = $('.main-page-block-contents').toArray()[2]
    var link_today = $(maincontent).find('.mw-redirect').attr('href')
    response = await axios.get('https://pt.wikipedia.org' + link_today);
    $ = cheerio.load(response.data);
    var historical = $('#Eventos_hist\\.C3\\.B3ricos').closest('h2').next().next().next().toArray();
    historical = $(historical).find('li').toArray();
    historical2 = historical.map(element => {
        var boldText = $(element).find('a').toArray().map(element => {
            return $(element).text()
        })

        var text = $(element).text();

        boldText.forEach(element => {
            text = text.replace(element, `*${element}*`)
        })
        return text;
    })
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