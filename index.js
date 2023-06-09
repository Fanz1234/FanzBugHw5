/*
› Create By fanz
› Base Ori fanz

🌷 KALAU MAU RENAME TARO CREDITS GUA : HW MODS WA☆ */

require('./hwfanz')
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@adiwajshing/baileys")
const fs = require('fs')
const pino = require('pino')
const chalk = require('chalk')
const path = require('path')
const axios = require('axios')
const FileType = require('file-type')
const yargs = require('yargs/yargs')
const _ = require('lodash')
const { Boom } = require('@hapi/boom')
const { state, saveState } = useSingleFileAuthState(`./fanz.json`)
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./baseikal/lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./baseikal/lib/myfunc')
//=================================================//
const owner = JSON.parse(fs.readFileSync('./database/owner.json'))
var low
try {
low = require('lowdb')
} catch (e) {
low = require('./baseikal/lib/lowdb')}
//=================================================//
const { Low, JSONFile } = low
const mongoDB = require('./baseikal/lib/mongoDB')
//=================================================//
//=================================================//
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
//=================================================//
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
/https?:\/\//.test(opts['db'] || '') ?
new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
new mongoDB(opts['db']) :
new JSONFile(`baseikal/dbnye/database.json`)
)
global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
if (global.db.data !== null) return
global.db.READ = true
await global.db.read()
global.db.READ = false
global.db.data = {
users: {},
chats: {},
game: {},
database: {},
settings: {},
setting: {},
others: {},
sticker: {},
...(global.db.data || {})}
  global.db.chain = _.chain(global.db.data)}
loadDatabase()
//=================================================//
//=================================================//
async function startfanz() {
const fanz = makeWASocket({
logger: pino({ level: 'silent' }),
printQRInTerminal: true,
browser: ['Fanz Multi Device','Safari','1.0.0'],
auth: state})
//=================================================//
fanz.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}
//=================================================//
fanz.ev.on('messages.upsert', async chatUpdate => {
try {
mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') return
if (!fanz.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
m = smsg(fanz, mek, store)
require("./fanz")(fanz, m, chatUpdate, store)
} catch (err) {
console.log(err)}})
//=================================================//
    fanz.ev.on('group-participants.update', async (anu) => {
    if (!wlcm.includes(anu.id)) return
        console.log(anu)
        try {
            let metadata = await fanz.groupMetadata(anu.id)
            let participants = anu.participants
            for (let num of participants) {
                // Get Profile Picture User
                try {
                    ppuser = await fanz.profilePictureUrl(num, 'image')
                } catch {
                    ppuser = 'https://tinyurl.com/yx93l6da'
                }

                // Get Profile Picture Group
                try {
                    ppgroup = await fanz.profilePictureUrl(anu.id, 'image')
                } catch {
                    ppgroup = 'https://tinyurl.com/yx93l6da'
                }

                if (anu.action == 'add') {
                    fanz.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `Selamat Datang Di Group ${metadata.subject} ${metadata.desc} @${num.split("@")[0]}` })
                } else if (anu.action == 'remove') {
                    fanz.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `@${num.split("@")[0]} Selamat Tinggal Di Group ${metadata.subject} ${metadata.desc}` })
                } else if (anu.action == 'promote') {
                    fanz.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `@${num.split('@')[0]} Ciee Jadi Admin Di Group ${metadata.subject} ${metadata.desc}` })
                } else if (anu.action == 'demote') {
                    fanz.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `@${num.split('@')[0]} Ciee Di Hapus Jadi Admin Di Group ${metadata.subject} ${metadata.desc}` })
              }
            }
        } catch (err) {
            /*console.log(err)*/
        }
    })	
//=================================================//
//=================================================//
fanz.ev.on('contacts.update', update => {
for (let contact of update) {
let id = fanz.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }}})
//=================================================//
fanz.getName = (jid, withoutContact  = false) => {
id = fanz.decodeJid(jid)
withoutContact = fanz.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = fanz.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === fanz.decodeJid(fanz.user.id) ?
fanz.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')}
//=================================================//
fanz.sendContact = async (jid, kon, quoted = '', opts = {}) => {
let list = []
for (let i of kon) {
list.push({
displayName: await fanz.getName(i + '@s.whatsapp.net'),
vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await fanz.getName(i + '@s.whatsapp.net')}\nFN:${await fanz.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:denyp857@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://https://www.instagram.com/hikal_857/?hl=id\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`})}
//=================================================//
fanz.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })}
//=================================================//
//=================================================//
//Kalau Mau Self Lu Buat Jadi false
fanz.public = true
//=================================================//
fanz.serializeM = (m) => smsg(fanz, m, store)
fanz.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
let reason = new Boom(lastDisconnect?.error)?.output.statusCode
if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); fanz.logout(); }
else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); startfanz(); }
else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); startfanz(); }
else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); fanz.logout(); }
else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Scan Again And Run.`); fanz.logout(); }
else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); startfanz(); }
else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); startfanz(); }
else fanz.end(`Unknown DisconnectReason: ${reason}|${connection}`)}
console.log('Connected...', update)})

//=================================================//
fanz.ev.on('creds.update', saveState)
// Add Other

  /**
  *
  * @param {*} jid
  * @param {*} url
  * @param {*} caption
  * @param {*} quoted
  * @param {*} options
  */
  //=================================================//
fanz.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
let mime = '';
let res = await axios.head(url)
mime = res.headers['content-type']
if (mime.split("/")[1] === "gif") {
return fanz.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback:true, ...options}, { quoted: quoted, ...options})}
let type = mime.split("/")[0]+"Message"
if(mime === "application/pdf"){
return fanz.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options}, { quoted: quoted, ...options })}
if(mime.split("/")[0] === "image"){
return fanz.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options}, { quoted: quoted, ...options})}
if(mime.split("/")[0] === "video"){
return fanz.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options}, { quoted: quoted, ...options })}
if(mime.split("/")[0] === "audio"){
return fanz.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options}, { quoted: quoted, ...options })}}
//=================================================//
/** Send List Messaage
  *
  *@param {*} jid
  *@param {*} text
  *@param {*} footer
  *@param {*} title
  *@param {*} butText
  *@param [*] sections
  *@param {*} quoted
  */
  //=================================================//
fanz.sendListMsg = (jid, text = '', footer = '', title = '' , butText = '', sects = [], quoted) => {
let sections = sects
var listMes = {
text: text,
footer: footer,
title: title,
buttonText: butText,
sections}
fanz.sendMessage(jid, listMes, { quoted: quoted })}
//=================================================//
/** Send Button 5 Message
 * 
 * @param {*} jid
 * @param {*} text
 * @param {*} footer
 * @param {*} button
 * @returns 
 */
 //=================================================//
fanz.send5ButMsg = (jid, text = '' , footer = '', but = []) =>{
let templateButtons = but
var templateMessage = {
text: text,
footer: footer,
templateButtons: templateButtons}
fanz.sendMessage(jid, templateMessage)}
//=================================================//
/** Send Button 5 Image
 *
 * @param {*} jid
 * @param {*} text
 * @param {*} footer
 * @param {*} image
 * @param [*] button
 * @param {*} options
 * @returns
 */
 //=================================================//
fanz.send5ButImg = async (jid , text = '' , footer = '', img, but = [], options = {}) =>{
let message = await prepareWAMessageMedia({ image: img }, { upload: fanz.waUploadToServer })
var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
imageMessage: message.imageMessage,
"hydratedContentText": text,
"hydratedFooterText": footer,
"hydratedButtons": but}}
}), options)
fanz.relayMessage(jid, template.message, { messageId: template.key.id })}
//=================================================//
/** Send Button 5 Video
 *
 * @param {*} jid
 * @param {*} text
 * @param {*} footer
 * @param {*} Video
 * @param [*] button
 * @param {*} options
 * @returns
 */
 //=================================================//
fanz.send5ButVid = async (jid , text = '' , footer = '', vid, but = [], options = {}) =>{
let message = await prepareWAMessageMedia({ video: vid }, { upload: fanz.waUploadToServer })
var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
videoMessage: message.videoMessage,
"hydratedContentText": text,
"hydratedFooterText": footer,
"hydratedButtons": but}}
}), options)
fanz.relayMessage(jid, template.message, { messageId: template.key.id })}
//=================================================//
/** Send Button 5 Gif
 *
 * @param {*} jid
 * @param {*} text
 * @param {*} footer
 * @param {*} Gif
 * @param [*] button
 * @param {*} options
 * @returns
 */
 //=================================================//
fanz.send5ButGif = async (jid , text = '' , footer = '', gif, but = [], options = {}) =>{
let message = await prepareWAMessageMedia({ video: gif, gifPlayback: true }, { upload: fanz.waUploadToServer })
var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
videoMessage: message.videoMessage,
"hydratedContentText": text,
"hydratedFooterText": footer,
"hydratedButtons": but}}
}), options)
fanz.relayMessage(jid, template.message, { messageId: template.key.id })}
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} buttons 
 * @param {*} caption 
 * @param {*} footer 
 * @param {*} quoted 
 * @param {*} options 
 */
 //=================================================//
fanz.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
let buttonMessage = {
text,
footer,
buttons,
headerType: 2,
...options}
fanz.sendMessage(jid, buttonMessage, { quoted, ...options })}
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} text 
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
fanz.sendText = (jid, text, quoted = '', options) => fanz.sendMessage(jid, { text: text, ...options }, { quoted })
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} caption 
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
fanz.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await fanz.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })}
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} caption 
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
fanz.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await fanz.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted })}
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} quoted 
 * @param {*} mime 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
fanz.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await fanz.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })}
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} text 
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
fanz.sendTextWithMentions = async (jid, text, quoted, options = {}) => fanz.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
fanz.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)}
//=================================================//
await fanz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
fanz.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)}
//=================================================//
await fanz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}
//=================================================//
/**
 * 
 * @param {*} message 
 * @param {*} filename 
 * @param {*} attachExtension 
 * @returns 
 */
 //=================================================//
fanz.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
// save to file
await fs.writeFileSync(trueFileName, buffer)
return trueFileName}
//=================================================//
fanz.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
return buffer} 
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} path 
 * @param {*} filename
 * @param {*} caption
 * @param {*} quoted 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
fanz.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
let types = await fanz.getFile(path, true)
let { mime, ext, res, data, filename } = types
if (res && res.status !== 200 || file.length <= 65536) {
try { throw { json: JSON.parse(file.toString()) } }
catch (e) { if (e.json) throw e.json }}
let type = '', mimetype = mime, pathFile = filename
if (options.asDocument) type = 'document'
if (options.asSticker || /webp/.test(mime)) {
let { writeExif } = require('./baseikal/lib/exif')
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
type = 'sticker'
mimetype = 'image/webp'}
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else if (/audio/.test(mime)) type = 'audio'
else type = 'document'
await fanz.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
return fs.promises.unlink(pathFile)}
//=================================================//
/**
 * 
 * @param {*} jid 
 * @param {*} message 
 * @param {*} forceForward 
 * @param {*} options 
 * @returns 
 */
 //=================================================//
fanz.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message}}
let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo}} : {})} : {})
await fanz.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
return waMessage}
//=================================================//
fanz.cMod = (jid, copy, text = '', sender = fanz.user.id, options = {}) => {
//let copy = message.toJSON()
let mtype = Object.keys(copy.message)[0]
let isEphemeral = mtype === 'ephemeralMessage'
if (isEphemeral) {
mtype = Object.keys(copy.message.ephemeralMessage.message)[0]}
let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
let content = msg[mtype]
if (typeof content === 'string') msg[mtype] = text || content
else if (content.caption) content.caption = text || content.caption
else if (content.text) content.text = text || content.text
if (typeof content !== 'string') msg[mtype] = {
...content,
...options}
if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
copy.key.remoteJid = jid
copy.key.fromMe = sender === fanz.user.id
return proto.WebMessageInfo.fromObject(copy)}
fanz.sendFile = async(jid, PATH, fileName, quoted = {}, options = {}) => {
let types = await fanz.getFile(PATH, true)
let { filename, size, ext, mime, data } = types
let type = '', mimetype = mime, pathFile = filename
if (options.asDocument) type = 'document'
if (options.asSticker || /webp/.test(mime)) {
let { writeExif } = require('./baseikal/lib/sticker.js')
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: global.packname, author: global.packname2, categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
type = 'sticker'
mimetype = 'image/webp'}
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else if (/audio/.test(mime)) type = 'audio'
else type = 'document'
await fanz.sendMessage(jid, { [type]: { url: pathFile }, mimetype, fileName, ...options }, { quoted, ...options })
return fs.promises.unlink(pathFile)}
fanz.parseMention = async(text) => {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}
//=================================================//
/**
 * 
 * @param {*} path 
 * @returns 
 */
 //=================================================//
fanz.getFile = async (PATH, save) => {
let res
let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
//if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
let type = await FileType.fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'}
filename = path.join(__filename, '../baseikal/dbnye/' + new Date * 1 + '.' + type.ext)
if (data && save) fs.promises.writeFile(filename, data)
return {
res,
filename,
size: await getSizeMedia(data),
...type,
data}}
return fanz}
//=================================================//
startfanz()
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})
