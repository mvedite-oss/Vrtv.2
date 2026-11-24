// Exemplo de jogo simples usando a fábrica arcade() (veja script.js)
GAMES.push({id:'frutas',name:'Pega Frutas VR',emoji:'🍉',c1:'#ff5f6d',c2:'#ffc371',desc:'Pegue as frutas com a mão. Cuidado com as bombas!',
 create:arcade({e:['🍎','🍌','🍇','🍉','🍓'],dir:1,spd:260,rate:.8,bad:.15,mode:'touch',missLife:true,lives:3,he:'🖐️'})});
