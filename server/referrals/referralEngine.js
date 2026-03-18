const fs=require('fs'); const refFile='server/data/referrals.json';
function loadRefs(){return fs.existsSync(refFile)?JSON.parse(fs.readFileSync(refFile)):[];}
function saveRefs(refs){fs.writeFileSync(refFile,JSON.stringify(refs,null,2));}
module.exports={loadRefs,saveRefs};
