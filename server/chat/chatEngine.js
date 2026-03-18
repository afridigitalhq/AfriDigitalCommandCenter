const fs=require('fs'); const chatFile='server/data/chat.json';
function loadChat(){return fs.existsSync(chatFile)?JSON.parse(fs.readFileSync(chatFile)):[];}
function saveChat(chat){fs.writeFileSync(chatFile,JSON.stringify(chat,null,2));}
module.exports={loadChat,saveChat};
