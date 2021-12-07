const fs = require('fs');
const axios = require('axios');
const Path = require('path')
const cheerio = require('cheerio');
const translate = require('translate');
const { Socket } = require('socket.io-client');

async function teste() {
   

    console.log(items)
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