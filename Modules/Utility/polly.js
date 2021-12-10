const AWS = require('aws-sdk')

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const Path = require('path')
const Sender = require('../sender.js')

var methods = {};

methods.getPolly = async function getPolly(client, message, text) {
    AWS.config.loadFromPath('Modules/Utility/config.json');
    var splited = text.split(' ');
    var language = splited[0];

    splited = splited.filter(function (item) {
        return item !== language
    }, language)

    var languages = [
        { name: 'pt', voice: 'Camila' },
        { name: 'ptm', voice: 'Ricardo' },
        { name: 'jp', voice: 'Mizuki' },
        { name: 'jpm', voice: 'Takumi' },
        { name: 'arb', voice: 'Zeina' },
        { name: 'cmn', voice: 'Zhiyu' },
        { name: 'da', voice: 'Naja' },
        { name: 'dam', voice: 'Mads' },
        { name: 'nl', voice: 'Lotte' },
        { name: 'nlm', voice: 'Ruben' },
        { name: 'gb', voice: 'Emma' },
        { name: 'gbm', voice: 'Brian' },
        { name: 'ein', voice: 'Raveena' },
        { name: 'en', voice: 'Joanna' },
        { name: 'enm', voice: 'Matthew' },
        { name: 'fr', voice: 'Léa' },
        { name: 'de', voice: 'Vicki' },
        { name: 'it', voice: 'Bianca' },
        { name: 'itm', voice: 'Giorgio' },
        { name: 'ko', voice: 'Seoyeon' },
        { name: 'es', voice: 'Lucia' },
        { name: 'za', voice: 'Ayanda' },
        
    ]

    people = languages.filter(element => {
        return element.name == language
    }, language)

    console.log(splited, people, language)

    const Polly = new AWS.Polly({
        signatureVersion: 'v4',
        region: 'us-east-1'
    })

    let params = {
        'Text': splited.join(' '),
        'OutputFormat': 'mp3',
        'VoiceId': people[0].voice
    }

    await Polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
            console.log(err.code)
        } else if (data) {
            if (data.AudioStream instanceof Buffer) {
                fs.writeFile("Modules/audios/audio.mp3", data.AudioStream, function (err) {
                    if (err) {
                        return console.log(err)
                    }
                    Sender.sendFile(client, message, 'audio.mp3')
                })
            }
        }
    })

    return true;
}

methods.getSpeech = async function getSpeech() {



}


exports.data = methods;
