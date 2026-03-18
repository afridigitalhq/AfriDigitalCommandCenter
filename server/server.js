const express=require('express'); const bodyParser=require('body-parser'); const cors=require('cors');
const {loadJobs,saveJobs}=require('./jobs/jobsEngine');
const {loadShop,saveShop}=require('./shop/shopEngine');
const {loadChat,saveChat}=require('./chat/chatEngine');
const {loadUrls,saveUrls}=require('./urls/urlEngine');
const {loadRefs,saveRefs}=require('./referrals/referralEngine');
const {loadForum,saveForum}=require('./forum/forumEngine');
const fs=require('fs'); const app=express(); const PORT=3000; app.use(cors()); app.use(bodyParser.json()); app.use(express.static('server/public'));

// === Jobs Routes ===
app.post('/create-job',(req,res)=>{ let {poster,title,credits}=req.body; let jobs=loadJobs(); let id=Date.now(); jobs.push({id,title,poster,lockedCredits:credits,status:'open',bids:[]}); saveJobs(jobs); res.json({success:true,jobId:id});});
app.get('/jobs',(req,res)=>res.json(loadJobs()));

// === Shop Routes ===
app.get('/shop',(req,res)=>res.json(loadShop()));

// === Chat Routes ===
app.post('/chat/send',(req,res)=>{let {username,badge,country,message}=req.body; let chat=loadChat(); chat.push({username,badge,country,message,timestamp:Date.now()}); saveChat(chat); res.json({success:true});});
app.get('/chat',(req,res)=>res.json(loadChat()));

// === Forum Routes ===
app.post('/forum/send',(req,res)=>{let {username,country,message}=req.body; let forum=loadForum(); forum.push({username,country,message,timestamp:Date.now()}); saveForum(forum); res.json({success:true});});
app.get('/forum',(req,res)=>res.json(loadForum()));

// === URL Watchdog Routes ===
app.post('/add-url',(req,res)=>{let {user,url,subscriptionMonths}=req.body; let urls=loadUrls(); urls.push({user,url,subscriptionMonths,start:Date.now()}); saveUrls(urls); res.json({success:true});});

// === Referral Routes ===
app.post('/add-referral',(req,res)=>{let {referrer,newUser,amount}=req.body; let refs=loadRefs(); refs.push({referrer,newUser,amount,timestamp:Date.now()}); saveRefs(refs); res.json({success:true});});
app.get('/referrals',(req,res)=>res.json(loadRefs()));

// === Admin chat lock example ===
let chatLock={locked:false,unlockTime:null};
app.post('/admin/chat-lock',(req,res)=>{let {duration}=req.body; chatLock.locked=true; chatLock.unlockTime=Date.now()+duration*60*1000; res.json({success:true,lockedUntil:chatLock.unlockTime});});
setInterval(()=>{if(chatLock.locked && Date.now()>chatLock.unlockTime) chatLock.locked=false;},60000);

// === Credit System ===
const creditsFile='server/data/credits.json';
function loadCredits(){return fs.existsSync(creditsFile)?JSON.parse(fs.readFileSync(creditsFile)):{};}
function saveCredits(data){fs.writeFileSync(creditsFile,JSON.stringify(data,null,2));}
// Spend logic: platform first, then revenue
function spendCredits(user,amount){
  let data=loadCredits(); if(!data[user])data[user]={platform:0,revenue:0};
  let remaining=amount;
  if(data[user].platform>=remaining){data[user].platform-=remaining; remaining=0;}else{remaining-=data[user].platform; data[user].platform=0;}
  if(remaining>0){data[user].revenue=Math.max(0,data[user].revenue-remaining);}
  saveCredits(data);
}
module.exports={loadCredits,saveCredits,spendCredits};

// Start Server
app.listen(PORT,()=>console.log('🚀 Ultra Mega Bootstrap AfriDigital running on',PORT));
