// ===== VR ARCADE — núcleo (conexão, entrada por gestos, biblioteca, motor dos jogos) =====
const $=id=>document.getElementById(id),show=(id,on=true)=>$(id).classList.toggle('hidden',!on);
window.GAMES=[];                              // cada arquivo games/*.js faz GAMES.push({...})
const P=[null,null],conns=[null,null],peers=[null,null],mouse={x:.5,y:.5,down:false};
let AC;
// ---- Sons (Web Audio) ----
function sfx(k){try{AC=AC||new AudioContext();AC.resume();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;
 const [f,f2,ty,d]={ok:[660,990,'sine',.15],bad:[200,80,'sawtooth',.3],tick:[440,440,'square',.05],perf:[880,1320,'triangle',.25]}[k]||[500,500,'sine',.1];
 o.connect(g);g.connect(AC.destination);o.type=ty;o.frequency.setValueAtTime(f,t);o.frequency.linearRampToValueAtTime(f2,t+d);
 g.gain.setValueAtTime(.2,t);g.gain.linearRampToValueAtTime(0,t+d);o.start(t);o.stop(t+d)}catch(e){}}
// ---- Entrada: In.H[jogador] = mãos {x,y,pinch,sp...} (0..1) ; In.S[jogador] = corpo (33 pontos {x,y}) ----
const In={H:[[],[]],S:[null,null],prev:[[],[]],update(dt){for(let p=0;p<2;p++){const d=P[p],live=d&&performance.now()-d.ts<600,hs=[];
 if(live)(d.h||[]).forEach((h,i)=>{const x=1-h[2][0],y=h[2][1],o=this.prev[p][i]||{x,y},sx=o.x+(x-o.x)*.6,sy=o.y+(y-o.y)*.6;
  hs.push({x:sx,y:sy,pinch:Math.hypot(h[1][0]-h[2][0],h[1][1]-h[2][1])<.045,sp:Math.hypot(sx-o.x,sy-o.y)/dt})});
 else if(p==0&&!conns[0]){const o=this.prev[0][0]||mouse;hs.push({x:mouse.x,y:mouse.y,pinch:mouse.down,sp:Math.hypot(mouse.x-o.x,mouse.y-o.y)/dt,fake:1})} // mouse = teste sem celular
 this.prev[p]=this.H[p]=hs;this.S[p]=live&&d.p?d.p.map(q=>({x:1-q[0],y:q[1]})):null}}};
addEventListener('mousemove',e=>{mouse.x=e.clientX/innerWidth;mouse.y=e.clientY/innerHeight});
addEventListener('mousedown',()=>mouse.down=true);addEventListener('mouseup',()=>mouse.down=false);
// ---- Cursor / pinça = clique ----
let wasP=false;
function cursor(){const h=In.H[0][0],c=$('cur');if(!h){c.style.display='none';return}
 const X=h.x*innerWidth,Y=h.y*innerHeight;c.style.display='block';c.style.left=X+'px';c.style.top=Y+'px';c.classList.toggle('pin',h.pinch);
 const el=document.elementFromPoint(X,Y)?.closest('[data-hit]');
 document.querySelectorAll('.hov').forEach(e=>e!==el&&e.classList.remove('hov'));el?.classList.add('hov');
 if(h.pinch&&!wasP&&el&&!h.fake){sfx('ok');el.click()}wasP=h.pinch;
 if(!$('lib').classList.contains('hidden')&&!$('modal').offsetParent){$('lib').scrollBy(0,h.y>.92?14:h.y<.08?-14:0)}}
// ---- Modal e status ----
const modal=html=>{$('mbox').innerHTML=html||'';show('modal',!!html)};
function status(){$('st').textContent=`📱 J1 ${conns[0]?'✔':'—'}   J2 ${conns[1]?'✔':'—'}`;show('bDisc',!!conns[0]);show('bConn',!conns[0])}
// ---- TV: gera código, celular conecta, TV pede PERMITIR ----
function host(slot,done){const code=String(1000+Math.floor(Math.random()*9000));
 modal(`<p class="sub">${slot?'JOGADOR 2 — no celular: ENTRAR COMO JOGADOR 2':'No celular: MODO CÂMERA'}</p><div class="code">${code}</div><button data-hit class="btn" onclick="cancelHost(${slot})">CANCELAR</button>`);
 const pr=peers[slot]=new Peer('vrlib-'+code);
 pr.on('error',e=>{if(e.type=='unavailable-id')host(slot,done)});
 pr.on('connection',c=>{if(conns[slot])return c.close();
  modal(`<p class="big">UM CELULAR QUER CONECTAR</p><div class="row"><button data-hit class="btn ok" id="allow">PERMITIR</button><button data-hit class="btn" id="deny">NEGAR</button></div>`);
  $('allow').onclick=()=>{conns[slot]=c;c.on('data',d=>{d.ts=performance.now();P[slot]=d});c.on('close',()=>drop(slot));c.send({t:'ok'});
   modal('<p class="big">CONECTADO COM SUCESSO ✔</p>');status();setTimeout(()=>{modal('');done&&done()},1800)};
  $('deny').onclick=()=>{c.close();modal('')}})}
function cancelHost(s){peers[s]?.destroy();peers[s]=null;modal('')}
function drop(s){conns[s]?.close();conns[s]=null;P[s]=null;peers[s]?.destroy();peers[s]=null;status()}
const desconectar=()=>[0,1].forEach(drop);
// ---- Celular: digita código, abre câmera + MediaPipe e envia mãos/corpo ----
function showCam(t){show('home',false);show('cam');$('camTitle').textContent=t;$('vid').style.display='none'}
function joinCode(){const code=$('codeIn').value.trim();$('camMsg').textContent='Conectando...';
 const pr=new Peer();pr.on('error',()=>$('camMsg').textContent='ERRO, TENTE NOVAMENTE');
 pr.on('open',()=>{const c=pr.connect('vrlib-'+code,{serialization:'json',reliable:false});
  c.on('open',()=>$('camMsg').textContent='Aguardando a TV clicar em PERMITIR...');
  c.on('data',d=>d.t=='ok'&&startCam(c));c.on('close',()=>$('camMsg').textContent='DESCONECTADO')})}
async function startCam(c){show('codeBox',false);show('camOff');$('camMsg').textContent='Carregando câmera e IA...';
 const L=s=>new Promise(r=>{const e=document.createElement('script');e.src=s;e.crossOrigin='anonymous';e.onload=r;document.head.appendChild(e)});
 const B='https://cdn.jsdelivr.net/npm/@mediapipe/';await L(B+'hands@0.4.1675469240/hands.js');await L(B+'pose@0.5.1675469404/pose.js');
 const vid=$('vid');vid.srcObject=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:480,height:360},audio:false});await vid.play();vid.style.display='block';
 let Hh=[],Ss=null;const r3=v=>+v.toFixed(3);
 const hands=new Hands({locateFile:f=>B+'hands@0.4.1675469240/'+f}),pose=new Pose({locateFile:f=>B+'pose@0.5.1675469404/'+f});
 hands.setOptions({maxNumHands:2,modelComplexity:0});pose.setOptions({modelComplexity:0,smoothLandmarks:true});
 hands.onResults(r=>Hh=(r.multiHandLandmarks||[]).map(l=>[0,4,8].map(i=>[r3(l[i].x),r3(l[i].y)]))); // pulso, ponta do polegar, ponta do indicador
 pose.onResults(r=>Ss=r.poseLandmarks?r.poseLandmarks.map(q=>[r3(q.x),r3(q.y)]):null);
 $('camMsg').textContent='CÂMERA ATIVA ✔ Fique a 2 m do celular, corpo inteiro visível.';
 (async function loop(){if(!c.open)return;await hands.send({image:vid});await pose.send({image:vid});c.send({h:Hh,p:Ss});requestAnimationFrame(loop)})()}
// ---- Biblioteca ----
function enterTV(){show('home',false);show('lib');document.documentElement.requestFullscreen?.().catch(()=>{});
 $('grid').innerHTML=GAMES.map((g,i)=>`<button data-hit class="card" onclick="openGame(${i})" style="--a:${g.c1};--b:${g.c2}"><div class="cover">${g.emoji}</div><h3>${g.name}</h3><p>${g.desc}</p></button>`).join('');status()}
// ---- Motor dos jogos: cada jogo = {name,emoji,c1,c2,desc,time?,create(v)->{score,lives?,update(dt),draw(ctx)}} ----
const cv=$('cv');let G,views=[],tEnd=0,running=false,last=0;
const fit=()=>{cv.width=innerWidth;cv.height=innerHeight};addEventListener('resize',fit);fit();
function openGame(i){G=GAMES[i];show('lib',false);show('cv');show('exit');pre()}
function pre(){modal(`<p class="big">${G.emoji} ${G.name}</p><p class="sub">${G.desc}</p>${conns[1]?'<p class="sub">Jogador 2 conectado ✔ — tela dividida</p>':''}<div class="row"><button data-hit class="btn ok" onclick="play()">JOGAR</button>${G.invite?'<button data-hit class="btn" onclick="host(1,pre)">CONVIDAR AMIGO</button>':''}</div>`)}
function play(){modal('');const n=G.invite&&conns[1]?2:1,w=innerWidth/n;
 views=[...Array(n)].map((_,p)=>{const v={x:p*w,w,h:innerHeight,p};v.g=G.create(v);return v});
 tEnd=G.time===0?1e9:performance.now()/1000+(G.time||60);running=true}
function end(){running=false;const s=views.map(v=>v.g.score|0);
 modal(`<p class="big">FIM!</p>${s.length>1?`<p class="big">${s[0]==s[1]?'EMPATE':'JOGADOR '+(s[0]>s[1]?1:2)+' VENCEU 🏆'}</p>`:''}<p class="sub">${s.map((x,i)=>'J'+(i+1)+': '+x+' pts').join('   ×   ')}</p><div class="row"><button data-hit class="btn ok" onclick="play()">JOGAR DE NOVO</button><button data-hit class="btn" onclick="closeGame()">SAIR</button></div>`)}
function closeGame(){running=false;modal('');show('cv',false);show('exit',false);show('lib')}
function frame(ts){const dt=Math.min(.05,(ts-last)/1000||.016);last=ts;In.update(dt);
 if(running){const c=cv.getContext('2d'),left=tEnd-ts/1000;c.clearRect(0,0,cv.width,cv.height);
  views.forEach(v=>{c.save();c.translate(v.x,0);c.beginPath();c.rect(0,0,v.w,v.h);c.clip();c.fillStyle=G.bg||'#0a0a22';c.fillRect(0,0,v.w,v.h);
   v.g.update(dt);v.g.draw(c);c.textBaseline='alphabetic';c.fillStyle='#fff';c.font='bold 44px system-ui';c.textAlign='left';
   c.fillText('⭐ '+(v.g.score|0)+(v.g.lives!=null?'  '+'❤️'.repeat(Math.max(0,v.g.lives)):''),24,60);
   if(G.time!==0){c.textAlign='center';c.fillText('⏱ '+Math.max(0,left|0),v.w/2,60)}
   if(views.length>1){c.fillStyle='#0ff';c.textAlign='center';c.fillText('JOGADOR '+(v.p+1),v.w/2,110)}c.restore()});
  if(views.length>1){c.fillStyle='#0ff';c.fillRect(cv.width/2-2,0,4,cv.height)}
  if(left<=0||views.some(v=>v.g.lives===0))end()}
 cursor();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
// ---- Fábrica de jogos de "objetos": c={e:[emojis],dir:1 cai|-1 sobe|0 fica parado,spd,rate,bad,mode:'touch'|'pinch'|'swipe',missLife,lives,ttl,r,he:emoji da mão} ----
function arcade(c){return v=>{const it=[],o={score:0,lives:c.lives,t:0},k=v.h/700;let cd=1;
 o.update=dt=>{o.t+=dt;cd-=dt;
  if(cd<=0){cd=c.rate*(.6+Math.random()*.8);const bad=Math.random()<(c.bad||0),r=c.r||40;
   it.push({x:v.w*(.1+.8*Math.random()),y:c.dir?(c.dir>0?-r:v.h+r):v.h*(.25+.6*Math.random()),vy:c.dir*(c.spd+o.t*4)*k,r,ttl:c.ttl,bad,e:bad?'💣':c.e[Math.random()*c.e.length|0]})}
  const hs=In.H[v.p];
  for(let i=it.length-1;i>=0;i--){const m=it[i];m.y+=m.vy*dt;m.ttl-=dt;
   const hit=hs.some(h=>Math.hypot(h.x*v.w-m.x,h.y*v.h-m.y)<m.r+30&&(c.mode=='pinch'?h.pinch:c.mode=='swipe'?h.sp>1.3:1));
   if(hit){it.splice(i,1);if(m.bad){sfx('bad');o.lives!=null?o.lives--:o.score-=20}else{sfx('ok');o.score+=10}}
   else if(m.y<-m.r-20||m.y>v.h+m.r+20||m.ttl<0){it.splice(i,1);if(!m.bad&&c.missLife){o.lives--;sfx('bad')}}}};
 o.draw=g=>{g.textAlign='center';g.textBaseline='middle';g.font='80px serif';it.forEach(m=>g.fillText(m.e,m.x,m.y));
  g.font='64px serif';In.H[v.p].forEach(h=>g.fillText(c.he,h.x*v.w,h.y*v.h))};return o}}
