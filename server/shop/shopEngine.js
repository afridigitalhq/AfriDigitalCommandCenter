const fs=require('fs'); const shopFile='server/data/shop.json';
function loadShop(){return fs.existsSync(shopFile)?JSON.parse(fs.readFileSync(shopFile)):[];}
function saveShop(items){fs.writeFileSync(shopFile,JSON.stringify(items,null,2));}
module.exports={loadShop,saveShop};
