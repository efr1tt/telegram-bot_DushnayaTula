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
    { command: '/game', description: 'go game' },
    { command: '/list', description: 'Посмотреть уровни душнил' },
  ])

  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id

    if (text === '/start') {
      // await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4a4/f28/4a4f2880-e005-3f8f-ab47-2bb189e7d263/1.webp')
      await bot.sendPhoto(chatId, 'https://www.tripzaza.com/ru/destinations/wp-content/uploads/2018/08/1-Tula_Kremlin-e1534289585300.jpg')
      return bot.sendMessage(chatId, 'Где спрятан Тульский пряник?')
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name} ${msg.from.username}`)
    }
    if (text === '/game') {
      return startGame(chatId)
    }
    if (text === '/list') {
      const messageSend =
        `Руслан, Спас, Мишган, Балда, Гам, Максимальный лайт - самый приятный уровень`
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4a4/f28/4a4f2880-e005-3f8f-ab47-2bb189e7d263/1.webp')
      return bot.sendMessage(chatId, `${messageSend}`)
    }
    return bot.sendMessage(chatId, 'Будьте любезны не флудить!')

  })

  bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
      return startGame(chatId)
    }
    if (Number(data) === chats[chatId]) {
      return await bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)
    } else {
      return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
    }
  })
}

start()
