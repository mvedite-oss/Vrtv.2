GAMES.push({id:'desvia',name:'Desvia VR',emoji:'🚧',c1:'#00c6ff',c2:'#0072ff',desc:'Mova o corpo para passar pelas aberturas das barreiras.',
 create:v=>{const o={score:0,lives:3},bs=[],py=v.h*.8;let cd=1,px=v.w/2,t=0;
  o.update=dt=>{t+=dt;cd-=dt;const s=In.S[v.p],h=In.H[v.p][0],tx=s?(s[11].x+s[12].x)/2:h?h.x:.5;px+=(tx*v.w-px)*.25;
   if(cd<=0){cd=1.6;bs.push({y:-30,g:v.w*(.2+.6*Math.random()),w:v.w*.28,ok:0})}
   bs.forEach(b=>{b.y+=(300+t*5)*v.h/700*dt;if(!b.ok&&b.y>py){b.ok=1;if(Math.abs(px-b.g)<b.w/2){o.score+=10;sfx('ok')}else{o.lives--;sfx('bad')}}});
   while(bs.length&&bs[0].y>v.h+40)bs.shift()};
  o.draw=g=>{g.fillStyle='#f0f';bs.forEach(b=>{g.fillRect(0,b.y-15,b.g-b.w/2,30);g.fillRect(b.g+b.w/2,b.y-15,v.w,30)});g.font='90px serif';g.textAlign='center';g.fillText('🏃',px,py)};return o}});
