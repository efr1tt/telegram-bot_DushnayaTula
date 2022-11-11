const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')
const token = `5559021779:AAH6zRXHI7__3iQOVbz73NViwsZxqrG2ZV4`

const bot = new TelegramApi(token, { polling: true })

const chats = {}



const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать')
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие!' },
    { command: '/info', description: 'Получить информацию о пользователе!' },
    { command: '/game', description: 'Игра угадай цифру!' },
  ])

  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4a4/f28/4a4f2880-e005-3f8f-ab47-2bb189e7d263/1.webp')
      return bot.sendMessage(chatId, 'Добро пожаловать!')
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name} ${msg.from.username}`)
    }
    if (text === '/game') {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')

  })

  bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
      return startGame(chatId)
    }
    if (Number(data) === chats[chatId]) {
      console.log('data: ', data)
      return await bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)
    } else {
      return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
    }
  })
}

start()