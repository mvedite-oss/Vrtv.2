GAMES.push({id:'pintura',name:'Pintura VR',emoji:'🎨',c1:'#fc00ff',c2:'#00dbde',desc:'Faça pinça e mova a mão para pintar no ar.',time:0,bg:'#05050f',
 create:v=>{const o={score:0},st=[];let hue=0,was=false;
  o.update=dt=>{hue=(hue+120*dt)%360;const h=In.H[v.p][0];if(h&&h.pinch){st.push({x:h.x*v.w,y:h.y*v.h,c:hue,s:!was});if(st.length>4000)st.shift()}was=!!(h&&h.pinch);o.score=st.length/10};
  o.draw=g=>{g.lineWidth=12;g.lineCap='round';st.forEach((p,k)=>{const q=st[k-1];if(q&&!p.s){g.strokeStyle=`hsl(${p.c},100%,60%)`;g.beginPath();g.moveTo(q.x,q.y);g.lineTo(p.x,p.y);g.stroke()}});
   g.fillStyle='#fff';In.H[v.p].forEach(h=>{g.beginPath();g.arc(h.x*v.w,h.y*v.h,10,0,7);g.fill()})};return o}});
