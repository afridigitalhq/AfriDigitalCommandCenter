const http=require('http');
const fs=require('fs');
const WebSocket=require('ws');

const PORT=process.env.PORT||3000;

// ---------- USERS ----------
function getUsers(){return JSON.parse(fs.readFileSync('server/shop/data/users.json'));}
function saveUsers(u){fs.writeFileSync('server/shop/data/users.json',JSON.stringify(u,null,2));}

// ---------- JOBS ----------
function getJobs(){return JSON.parse(fs.readFileSync('server/shop/data/jobs.json'));}
function saveJobs(j){fs.writeFileSync('server/shop/data/jobs.json',JSON.stringify(j,null,2));}

// ---------- SERVER ----------
const server=http.createServer(async (req,res)=>{
  if(req.method==='GET' && req.url==='/users'){
    res.writeHead(200,{'Content-Type':'application/json'});
    return res.end(JSON.stringify(getUsers()));
  }

  if(req.method==='GET' && req.url==='/jobs'){
    res.writeHead(200,{'Content-Type':'application/json'});
    return res.end(JSON.stringify(getJobs()));
  }

  // CREATE JOB
  if(req.method==='POST' && req.url==='/create-job'){
    let body='';
    req.on('data',chunk=>body+=chunk);
    req.on('end',()=>{
      let data=JSON.parse(body);
      let users=getUsers();
      let jobs=getJobs();

      let user=users.find(u=>u.username===data.poster);
      if(!user || user.coins < data.credits) return res.end("❌ Not enough coins");

      // Deduct + 10% fee
      let fee=Math.floor(data.credits*0.1);
      user.coins -= data.credits;

      let job={
        id:Date.now(),
        title:data.title,
        poster:data.poster,
        lockedCredits:data.credits-fee,
        status:'open',
        bids:[]
      };

      jobs.push(job);
      saveUsers(users);
      saveJobs(jobs);

      broadcast({type:'new_job',job});

      res.end("✅ Job created");
    });
    return;
  }

  // PLACE BID
  if(req.method==='POST' && req.url==='/bid'){
    let body='';
    req.on('data',c=>body+=c);
    req.on('end',()=>{
      let data=JSON.parse(body);
      let jobs=getJobs();

      let job=jobs.find(j=>j.id==data.jobId);
      if(!job || job.status!=='open') return res.end("❌ Job not available");

      job.bids.push({bidder:data.bidder,amount:data.amount});
      saveJobs(jobs);

      broadcast({type:'new_bid',jobId:job.id});

      res.end("✅ Bid placed");
    });
    return;
  }

  // ACCEPT BID
  if(req.method==='POST' && req.url==='/accept-bid'){
    let body='';
    req.on('data',c=>body+=c);
    req.on('end',()=>{
      let data=JSON.parse(body);
      let jobs=getJobs();

      let job=jobs.find(j=>j.id==data.jobId);
      if(!job) return res.end("❌ Job not found");

      job.status='assigned';
      job.worker=data.worker;

      saveJobs(jobs);

      broadcast({type:'job_assigned',jobId:job.id});

      res.end("✅ Bid accepted");
    });
    return;
  }

  res.end("AfriDigital Jobs Engine LIVE");
});

// ---------- WEBSOCKET ----------
const wss=new WebSocket.Server({server});
let clients=[];

wss.on('connection',ws=>{
  clients.push(ws);
  ws.send(JSON.stringify({msg:'Connected to AfriDigital WS'}));
});

function broadcast(msg){
  clients.forEach(c=>c.send(JSON.stringify(msg)));
}

// ---------- DAILY COINS ----------
setInterval(()=>{
  let users=getUsers();
  users.forEach(u=>u.coins+=5);
  saveUsers(users);
},86400000);

// ---------- START ----------
server.listen(PORT,()=>console.log('🚀 Jobs Engine running on '+PORT));
