// JUST DANCE VR: copie a pose do bonequinho antes do círculo fechar. Usa o CORPO (braços, joelhos). Multiplayer: CONVIDAR AMIGO.
// Para criar mais coreografias, adicione poses em D (pulsos relativos aos ombros; largura do ombro = 1; k = joelho levantado).
const D=[{n:'MÃOS PRO ALTO',L:[-.5,-1.7],R:[.5,-1.7]},{n:'BRAÇOS EM T',L:[-2,0],R:[2,0]},{n:'ESQUERDA ALTO',L:[-.6,-1.8],R:[1.2,1.3]},{n:'DIREITA ALTO',L:[-1.2,1.3],R:[.6,-1.8]},
 {n:'MÃOS NA CINTURA',L:[-.9,1.5],R:[.9,1.5]},{n:'JOELHO ESQUERDO',L:[-1.2,-.4],R:[1.2,-.4],k:'L'},{n:'JOELHO DIREITO',L:[-1.2,-.4],R:[1.2,-.4],k:'R'},{n:'PALMAS NA FRENTE',L:[-.3,.7],R:[.3,.7]}];
GAMES.push({id:'danca',name:'Just Dance VR',emoji:'💃',c1:'#ff0099',c2:'#493240',desc:'Copie os passos com o corpo todo! PERFEITO, BOM ou ERROU.',invite:true,bg:'#14002b',
 create:v=>{const o={score:0},B=2.5,sw=s=>Math.max(.05,Math.abs(s[11].x-s[12].x));let t=0,i=0,msg='',mt=0;
  const rel=s=>{const mx=(s[11].x+s[12].x)/2,my=(s[11].y+s[12].y)/2,w=sw(s);return q=>[(q.x-mx)/w,(q.y-my)/w]};
  o.update=dt=>{t+=dt;mt-=dt;const old=t-dt;
   if(t>=B){t-=B;const p=D[i%D.length],s=In.S[v.p];i++;let r='ERROU',pts=0;
    if(s){const f=rel(s),a=f(s[15]),b=f(s[16]),e=Math.hypot(a[0]-p.L[0],a[1]-p.L[1])+Math.hypot(b[0]-p.R[0],b[1]-p.R[1]);let ok=1;
     if(p.k)ok=(s[p.k=='L'?25:26].y-s[p.k=='L'?23:24].y)/sw(s)<1;
     if(ok&&e<1.2){r='PERFEITO';pts=100}else if(ok&&e<2.2){r='BOM';pts=50}}
    o.score+=pts;msg=r;mt=1;sfx(pts>99?'perf':pts?'ok':'bad')}
   if(v.p==0&&Math.floor(t*2)!=Math.floor(old*2))sfx('tick')};
  o.draw=g=>{const p=D[i%D.length],sc=Math.min(v.w,v.h)*.075,cx=v.w/2,cy=v.h*.32,s=In.S[v.p];g.lineCap='round';g.lineWidth=9;g.strokeStyle='#f0f';
   const ln=(a,b)=>{g.beginPath();g.moveTo(cx+a[0]*sc,cy+a[1]*sc);g.lineTo(cx+b[0]*sc,cy+b[1]*sc);g.stroke()};
   ln([-.5,0],[.5,0]);ln([0,0],[0,2.2]);ln([-.5,0],p.L);ln([.5,0],p.R);ln([-.4,2.2],[.4,2.2]);
   [-1,1].forEach(sd=>{const up=p.k&&((sd<0)==(p.k=='L'));if(up){ln([sd*.4,2.2],[sd*1,3.2]);ln([sd*1,3.2],[sd*.5,4])}else ln([sd*.4,2.2],[sd*.5,4.3])});
   g.beginPath();g.arc(cx,cy-.8*sc,.45*sc,0,7);g.stroke();
   if(s){const f=rel(s);[15,16].forEach(k=>{const q=f(s[k]);g.fillStyle='#0ff';g.beginPath();g.arc(cx+q[0]*sc,cy+q[1]*sc,16,0,7);g.fill()})}
   g.strokeStyle='#0ff';g.lineWidth=8;g.beginPath();g.arc(cx,v.h*.85,50,-1.57,-1.57+6.28*t/B);g.stroke();
   g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff';g.font='bold '+Math.round(v.w*.05)+'px system-ui';g.fillText(p.n,cx,v.h*.7);
   if(mt>0){g.fillStyle=msg=='PERFEITO'?'#0f8':msg=='BOM'?'#ff0':'#f44';g.font='bold '+Math.round(v.w*.09)+'px system-ui';g.fillText(msg,cx,v.h*.5)}
   if(!s){g.fillStyle='#fff';g.font='28px system-ui';g.fillText('Corpo inteiro na câmera do celular!',cx,v.h*.93)}};return o}});
