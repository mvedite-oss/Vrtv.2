// MONKEY TAG (versão vista de cima): balance os braços para andar, incline o corpo para virar,
// pinça perto de uma árvore = escalar/esconder (ninguém te pega). Pegue os outros para passar o "pega".
GAMES.push({id:'macaco',name:'Monkey Tag 🐵',emoji:'🐵',c1:'#56ab2f',c2:'#a8e063',desc:'Balance os braços para andar. Pegue os macacos! Pinça na árvore = esconder.',bg:'#12301a',
 create:v=>{const W=v.w,H=v.h,o={score:0},tr=[...Array(7)].map(()=>({x:W*(.1+.8*Math.random()),y:H*(.2+.7*Math.random()),r:55}));
  const mk=(x,y)=>({x,y,it:false,cd:0,a:Math.random()*6.28}),me=mk(W/2,H/2),bots=[...Array(8)].map(()=>mk(Math.random()*W,Math.random()*H)),all=[me,...bots];bots[0].it=true;
  o.update=dt=>{const hs=In.H[v.p],s=In.S[v.p];
   me.a+=((s?(s[11].x+s[12].x)/2:.5)-.5)*5*dt;const sp=Math.min(320,hs.reduce((a,h)=>a+h.sp,0)*260);me.x+=Math.cos(me.a)*sp*dt;me.y+=Math.sin(me.a)*sp*dt;
   me.safe=hs.some(h=>h.pinch&&tr.some(q=>Math.hypot(h.x*W-q.x,h.y*H-q.y)<q.r+40));
   bots.forEach(b=>{let n=null,d0=1e9;all.forEach(m=>{if(m===b||(b.it&&(m.it||m.safe))||(!b.it&&!m.it))return;const d=Math.hypot(m.x-b.x,m.y-b.y);if(d<d0){d0=d;n=m}});
    if(n)b.a=Math.atan2(n.y-b.y,n.x-b.x)+(b.it?0:Math.PI);else b.a+=dt;const s2=b.it?200:230;b.x+=Math.cos(b.a)*s2*dt;b.y+=Math.sin(b.a)*s2*dt});
   all.forEach(m=>{m.cd-=dt;m.x=Math.max(30,Math.min(W-30,m.x));m.y=Math.max(30,Math.min(H-30,m.y));
    tr.forEach(q=>{const d=Math.hypot(m.x-q.x,m.y-q.y);if(d<q.r&&d>1){m.x=q.x+(m.x-q.x)/d*q.r;m.y=q.y+(m.y-q.y)/d*q.r}})});
   all.forEach(a=>{if(!a.it||a.cd>0)return;all.forEach(m=>{if(m!==a&&!m.it&&!m.safe&&a.cd<=0&&Math.hypot(a.x-m.x,a.y-m.y)<45){a.it=false;m.it=true;m.cd=2;
     if(a===me){o.score+=50;sfx('perf')}if(m===me)sfx('bad')}})});
   if(!me.it)o.score+=dt*5};
  o.draw=g=>{g.textAlign='center';g.textBaseline='middle';g.font='120px serif';tr.forEach(q=>g.fillText('🌳',q.x,q.y));
   all.forEach(m=>{g.globalAlpha=m.safe?.4:1;g.font=(m===me?'70px':'54px')+' serif';g.fillText('🐵',m.x,m.y);g.globalAlpha=1;if(m.it)g.fillText('🔴',m.x,m.y-45);if(m===me){g.font='22px system-ui';g.fillStyle='#fff';g.fillText('VOCÊ',m.x,m.y+48)}})};return o}});
