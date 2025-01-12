const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
client.on('ready', () => {
    console.log('Client is ready!');
    const number = "+923324320296";
    const text = "Hey john";
    const chatId = number.substring(1) + "@c.us";
    client.sendMessage(chatId, text);
});

client.initialize();
