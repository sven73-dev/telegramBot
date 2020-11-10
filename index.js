const TelegramBot = require('node-telegram-bot-api')
const request = require('request')
const fs = require('fs')
const _ = require('lodash')

const TOKEN = '1322660814:AAHln-S-XcYRf2J1ZhRgm1Z46MY1WcOauqE'

const bot = new TelegramBot(TOKEN, {
    polling: true
})

const KB = {
    picture: 'Картинка',
    cat: 'Котик',
    car: 'Машина',
    back: 'Назад'
}

const PicScrs = {
    [KB.cat]: [
        'cat1.jpg',
        'cat2.jpg',
        'cat3.jpg'
    ],
    [KB.car]: [
        'car1.jpg',
        'car2.jpg',
        'car3.jpg'
    ]
}

bot.onText(/\/start/, msg => {
    sendGreeting(msg)
})

bot.on('message', msg => {
    switch (msg.text) {
        case KB.picture:
            sendPictureScreen(msg.chat.id)
            break
        case KB.back:
            sendGreeting(msg, false)
            break
        case KB.car:
        case KB.cat:
            sendPictureByName(msg.chat.id, msg.text)
            break
    }
})

function sendPictureScreen(chatId) {
    bot.sendMessage(chatId, 'Выберите тип картинки: ', {
        reply_markup: {
            keyboard: [
                [KB.car, KB.cat],
                [KB.back]
            ]
        }
    })
}

function sendGreeting(msg, sayHello = true) {
    const text = sayHello
        ? `Приветствую, ${msg.from.first_name}\nЧто вы хотите сделать?`
        : `Что вы хотите сделать?`

    bot.sendMessage(msg.chat.id, text, {
        reply_markup: {
            keyboard: [
                [KB.picture]
            ]
        }
    })
}

function sendPictureByName(chatId, picName) {
    const srcs = PicScrs[picName]

    const src = srcs[_.random(0, srcs.length - 1)]

    bot.sendMessage(chatId, `Загружаю....`)

    fs.readFile(`${__dirname}/pictures/${src}`, (error, picture) => {
        if (error) throw new Error(error)

        bot.sendPhoto(chatId, picture).then(() => {
            bot.sendMessage(chatId, `Отправлено!`)
        })
    })
}