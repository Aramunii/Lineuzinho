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
    var typeSpeak = splited[1];

    splited = splited.filter(function (item) {
        return item !== language
    }, language)

    var languages = [
        { name: 'pt', voice: 'Camila', engine: 'neural' },
        { name: 'gb', voice: 'Emma', engine: 'neural' },
        { name: 'gbm', voice: 'Brian', engine: 'neural' },
        { name: 'au', voice: 'Olivia', engine: 'neural' },
        { name: 'za', voice: 'Ayanda', engine: 'neural' },
        { name: 'en', voice: 'Joanna', engine: 'neural' },
        { name: 'enk', voice: 'Ivy', engine: 'neural' },
        { name: 'enm', voice: 'Matthew', engine: 'neural' },
        { name: 'enmk', voice: 'Kevin', engine: 'neural' },
        { name: 'fr', voice: 'Léa', engine: 'neural' },
        { name: 'it', voice: 'Bianca', engine: 'neural' },
        { name: 'jpm', voice: 'Takumi', engine: 'neural' },
        { name: 'ko', voice: 'Seoyeon', engine: 'neural' },
        { name: 'es', voice: 'Lucia', engine: 'neural' },
        { name: 'ptm', voice: 'Ricardo', engine: 'standard' },
        { name: 'jp', voice: 'Mizuki', engine: 'standard' },
        { name: 'arb', voice: 'Zeina', engine: 'standard' },
        { name: 'cmn', voice: 'Zhiyu', engine: 'standard' },
        { name: 'da', voice: 'Naja', engine: 'standard' },
        { name: 'dam', voice: 'Mads', engine: 'standard' },
        { name: 'nl', voice: 'Lotte', engine: 'standard' },
        { name: 'nlm', voice: 'Ruben', engine: 'standard' },
        { name: 'ein', voice: 'Raveena', engine: 'standard' },
        { name: 'de', voice: 'Vicki', engine: 'standard' },
        { name: 'itm', voice: 'Giorgio', engine: 'standard' },
        { name: 'za', voice: 'Ayanda', engine: 'standard' },

    ]

    people = languages.filter(element => {
        return element.name == language
    }, language)

    console.log(splited, people, language)

    const Polly = new AWS.Polly({
        signatureVersion: 'v4',
        region: 'us-east-1',
    })

    var engine = people[0].engine;



    if (typeSpeak == 'news') {
        splited = splited.filter(function (item) {
            return item !== typeSpeak
        }, language)
        speakText = `<amazon:domain name="news">  ${splited.join(' ')} </amazon:domain>`
    } else if (typeSpeak == 'real') {
        splited = splited.filter(function (item) {
            return item !== typeSpeak
        }, language)
        speakText = `<amazon:auto-breaths volume="x-soft">  ${splited.join(' ')} </amazon:auto-breaths>`
        engine = 'standard'
    } else {
        speakText = replaceAll(splited.join(' '), '##', ' <break time="1s"/> ')
    }


    let params = {
        'Engine': engine,
        'Text': '<speak> ' + speakText + '</speak>',
        'OutputFormat': 'mp3',
        'VoiceId': people[0].voice,
        'TextType': 'ssml'
    }

    await Polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
            console.log(err.code)
            Sender.sendMessage(client, message, 'Ocorreu um erro! verifique o que você digitou e tente novamente!\n\n' + err, '*ERRO*')
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

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

methods.getSpeech = async function getSpeech() {



}


exports.data = methods;
