GAMES.push({id:'arco',name:'Arco e Flecha VR',emoji:'🏹',c1:'#11998e',c2:'#38ef7d',desc:'Pinça e puxe a mão para trás, solte para atirar no alvo.',
 create:v=>{const o={score:0},ar=[],tx=v.w*.85;let a=null,pull=null,ty=v.h/2,t=0;
  o.update=dt=>{t+=dt;ty=v.h/2+Math.sin(t*1.2)*v.h*.3;const h=In.H[v.p][0];
   if(h){const x=h.x*v.w,y=h.y*v.h;if(h.pinch&&!a)a={x,y};if(h.pinch&&a)pull={x,y};
    if(!h.pinch&&a){const dx=a.x-x,dy=a.y-y;if(Math.hypot(dx,dy)>60){ar.push({x:a.x,y:a.y,vx:dx*5,vy:dy*5});sfx('tick')}a=pull=null}}
   for(let i=ar.length-1;i>=0;i--){const r=ar[i];r.x+=r.vx*dt;r.y+=r.vy*dt;r.vy+=500*dt;
    if(Math.hypot(r.x-tx,r.y-ty)<70){o.score+=10;sfx('perf');ar.splice(i,1)}else if(r.x>v.w+50||r.y>v.h+50)ar.splice(i,1)}};
  o.draw=g=>{g.textAlign='center';g.textBaseline='middle';g.font='140px serif';g.fillText('🎯',tx,ty);g.font='44px serif';ar.forEach(r=>g.fillText('➡️',r.x,r.y));
   if(a&&pull){g.strokeStyle='#0ff';g.lineWidth=6;g.beginPath();g.arc(a.x,a.y,60,-1.2,1.2);g.moveTo(a.x,a.y-60);g.lineTo(pull.x,pull.y);g.lineTo(a.x,a.y+60);g.stroke()}
   In.H[v.p].forEach(h=>{g.font='50px serif';g.fillText('✋',h.x*v.w,h.y*v.h)})};return o}});
