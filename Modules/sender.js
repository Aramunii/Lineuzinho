const Path = require('path')

module.exports = {
  async sendMessageMentioned(client, message, text, title, mentioned) {
    client
      .sendMentioned(message.from, title + '\n\n' + text + ' \n\n 🥸 ```Lineuzinho```', mentioned)
      .then((result) => {
        console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });
  },
  async sendMessageNormalGroups(client, group, text, title, attackers) {
    console.log(group);
    client
      .sendMentioned(group, title + '\n\n' + text + ' \n\n 🥸 ```Lineuzinho```', attackers)
      .then((result) => {
        console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });
  },

  async sendMessageNormal(client, message, text, title) {

    var title = title != '' ? title + '\n\n' : ''

    client
      .reply(message.from, title + text + ' \n\n 🥸 ```Lineuzinho```', message.id.toString())
      .then((result) => {
        // console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });
  },
  async sendMessageTo(client, number, text, title) {
    client
      .sendText(number, title + '\n\n' + text + ' \n\n 🥸 ```Lineuzinho```')
      .then((result) => {
        // console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });

  },

  async sendMessage(client, message, text, title) {
    /*
     buttons = [{
       buttonId: 'id1',
       buttonText: {
         displayText: 'by: Maer Costa',
       },
       type: 1,
     }]
   
     await client.sendMessageOptions(message.from, '\n\n' + text + '\n\n', {
       title: title,
       footer: '🥸 Lineuzinho',
       quotedMessageId: message.id.toString(),
       isDynamicReplyButtonsMsg: true,
       dynamicReplyButtons: buttons,
     }).then((result) => {
       //  console.log('Result: ', result); //return object success
     })
       .catch((erro) => {
         console.error('Error when sending: ', erro); //return object error
       });;*/

    client
      .reply(message.from, title + '\n\n' + text + ' \n\n 🥸 ```Lineuzinho```', message.id.toString())
      .then((result) => {
        // console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });

  },

  async sendMessageOptionsEnemy(client, message, textMenu, options) {
    /*
      buttons = [{
        buttonId: 'id1',
        buttonText: {
          displayText: '#atacar',
        },
        type: 1,
      }]
    
      options.forEach(element => {
        buttons.push({
          buttonId: element,
          buttonText: {
            displayText: element,
          },
          type: 1,
        })
      })
    
      await client.sendMessageOptions(message.from, '\n\n' + textMenu, {
        title: 'Ataque',
        footer: '🥸 Lineuzinho',
        isDynamicReplyButtonsMsg: true,
        dynamicReplyButtons: buttons,
      });
    */

    client
      .reply(message.from, ' *ATAQUE* \n\n' + textMenu + ' \n\n 🥸 ```Lineuzinho```', message.id.toString())
      .then((result) => {
        // console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });



  },

  async sendVideoGif(client, message, image) {
    await client
      .sendVideoAsGif(
        message.from,
        'Modules/images/' + image,
        'img.gif',
        '\n\n 🥸 ```Lineuzinho```',
        message.id.toString()
      )
      .then((result) => {
        console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        //  this.sendMessage(client, message, 'Ocorreu um erro tente novamente mais tarde! ou reporte o erro!')
        console.error('Error when sending: ', erro); //return object error
      });
  },
  
  async sendFile(client, message, file) {
    await client
      .sendFile(
        message.from,
        'Modules/audios/' + file,
        'audio.mp3',
        '\n\n 🥸 ```Lineuzinho```',
        message.id.toString()
      )
      .then((result) => {
        console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        //  this.sendMessage(client, message, 'Ocorreu um erro tente novamente mais tarde! ou reporte o erro!')
        console.error('Error when sending: ', erro); //return object error
      });
  },
  async sendImageName(client, message, image) {
    await client
      .sendImage(
        message.from,
        'Modules/images/' + image,
        'img.jpg',
        '\n\n 🥸 ```Lineuzinho```',
        message.id.toString()
      )
      .then((result) => {
        console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        //  this.sendMessage(client, message, 'Ocorreu um erro tente novamente mais tarde! ou reporte o erro!')
        console.error('Error when sending: ', erro); //return object error
      });
  },

  async sendImage(client, message, text) {
    await client
      .sendImage(
        message.from,
        Path.resolve(__dirname, 'images', text.poster_path + '.jpg'),
        text.poster_path,
        text.text + '\n\n 🥸 ```Lineuzinho```',
        message.id.toString()
      )
      .then((result) => {
        console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        // this.sendMessage(client, message, 'Ocorreu um erro tente novamente mais tarde! ou reporte o erro!')
        console.error('Error when sending: ', erro); //return object error
      });
  },

  async sendSticker(client, message, text) {
    await client
      .sendImageAsSticker(message.from, Path.resolve(__dirname, 'images', 'belinao.jpg'))
      .then((result) => {
        console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });
  },

  async sendImageUrl(client, message, text) {
    await client
      .sendImageFromBase64(
        message.from,
        text.img_link,
        text.poster_path,
        text.text,
        message.id.toString()
      )
      .then((result) => {
        console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        // this.sendMessage(client, message, 'Ocorreu um erro tente novamente mais tarde! ou reporte o erro!')
        console.error('Error when sending: ', erro); //return object error
      });
  }

}