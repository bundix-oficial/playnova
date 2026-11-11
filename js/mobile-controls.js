/* Touch keyboard bridge for local games; native touch games keep their own controls. */
(() => {
  'use strict';
  const frame = document.getElementById('game-frame');
  if (!frame) return;
  const panel = document.createElement('details'); panel.className = 'friv-touch-controls';
  panel.open = matchMedia('(pointer: coarse)').matches || innerWidth < 700;
  const summary = document.createElement('summary'); summary.textContent = 'Controles de toque';
  const note = document.createElement('p'); note.textContent = 'Para jogos de teclado. Alguns motores exigem controles próprios; escolha as teclas que o jogo usa.';
  const layout = document.createElement('select'); layout.setAttribute('aria-label','Layout dos controles de toque');
  for (const [value,text] of [['arrows','Setas + espaço'],['wasd','WASD + espaço'],['zx','Setas + Z/X']]) layout.add(new Option(text,value));
  const pad = document.createElement('div'); pad.className = 'friv-touch-pad';
  const pressed = new Map();
  function targetWindow() {
    let w = frame.contentWindow;
    for (let i=0;i<4;i++) { const nested = w.document.querySelector('#game-frame, iframe'); if (!nested?.contentDocument?.body || nested.src.includes('/ads/')) break; w=nested.contentWindow; }
    return w;
  }
  function send(type, key) {
    try {
      const w=targetWindow(), d=w.document;
      const event=new w.KeyboardEvent(type,{key:key[0],code:key[1],keyCode:key[2],which:key[2],bubbles:true,cancelable:true});
      if (event.keyCode!==key[2]) { Object.defineProperty(event,'keyCode',{get:()=>key[2]}); Object.defineProperty(event,'which',{get:()=>key[2]}); }
      const target=d.querySelector('canvas') || d.body;
      if (type==='keydown') { target?.focus?.({preventScroll:true}); w.focus(); }
      target?.dispatchEvent(event);
    } catch { note.textContent='O jogo não permite receber teclas por toque. Use os controles próprios dele.'; }
  }
  function release(pointer) { const item=pressed.get(pointer);if(item){send('keyup',item.key);item.button.setAttribute('aria-pressed','false');pressed.delete(pointer);} }
  const releaseAll=()=>{for(const id of [...pressed.keys()])release(id);};
  function render() {
    releaseAll(); pad.replaceChildren();
    const wasd=layout.value==='wasd';
    const keys=wasd?[['w','KeyW',87],['a','KeyA',65],['s','KeyS',83],['d','KeyD',68]]:[['ArrowUp','ArrowUp',38],['ArrowLeft','ArrowLeft',37],['ArrowDown','ArrowDown',40],['ArrowRight','ArrowRight',39]];
    keys.push(...(layout.value==='zx'?[['z','KeyZ',90],['x','KeyX',88]]:[[' ','Space',32]]),['Enter','Enter',13]);
    for(const key of keys){
      const button=document.createElement('button');button.type='button';button.textContent=({ArrowUp:'↑',ArrowLeft:'←',ArrowDown:'↓',ArrowRight:'→',' ':'Espaço'})[key[0]]||key[0].toUpperCase();button.setAttribute('aria-label',key[0]===' '?'Espaço':key[0]);button.setAttribute('aria-pressed','false');
      button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);pressed.set(e.pointerId,{key,button});button.setAttribute('aria-pressed','true');send('keydown',key);};
      for(const name of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(name,e=>release(e.pointerId));
      pad.append(button);
    }
  }
  layout.onchange=render;panel.addEventListener('toggle',()=>{if(!panel.open)releaseAll();});window.addEventListener('blur',releaseAll);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseAll();});frame.addEventListener('load',releaseAll);
  panel.append(summary,note,layout,pad);(frame.closest('.game-play-area')||frame).after(panel);render();
})();
