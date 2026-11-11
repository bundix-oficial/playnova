/* Exact current-match capture. No polling, old-record imports or telemetry parsing. */
(() => {
  'use strict';
  const container=document.getElementById('gameContainer'), error=document.getElementById('slope-error');
  let channel='',active=false,candidate=null,ready=false,lastProgress=performance.now();
  const send=(type,data={})=>{if(channel)parent.postMessage({type,channel,...data},location.origin);};
  function fail(message) { container.dataset.ready='false';error.textContent=message;error.hidden=false; }
  window.addEventListener('message',event=>{
    if(event.source!==parent || event.origin!==location.origin || event.data?.type!=='FRIV_SLOPE_BIND' || typeof event.data.channel!=='string')return;
    if(channel===event.data.channel)return;
    channel=event.data.channel;active=false;candidate=null;
  });
  function begin() { if(!active&&ready&&channel){active=true;candidate=null;send('FRIV_SLOPE_START');} }
  window.addEventListener('pointerdown',begin,{capture:true});
  window.addEventListener('keydown',begin,{capture:true});
  const originalOpen=XMLHttpRequest.prototype.open,originalSend=XMLHttpRequest.prototype.send;
  const requests=new WeakMap();
  XMLHttpRequest.prototype.open=function(method,url){
    try{requests.set(this,{method:String(method).toUpperCase(),url:new URL(url,location.href)});}catch{}
    return originalOpen.apply(this,arguments);
  };
  XMLHttpRequest.prototype.send=function(body){
    const request=requests.get(this);
    if(request?.method==='POST'&&request.url.origin==='https://playtomic.id.net'&&request.url.pathname==='/v1'){
      try{
        const value=JSON.parse(typeof body==='string'?body:new TextDecoder().decode(body));
        if(value.table==='SLOPE LEADERBOARD'&&value.appid==='55961e5ee694aa0ae90003e8'&&value.section==='leaderboards'&&value.action==='list'){
          if(active&&candidate&&performance.now()-candidate.at<12000&&candidate.score>0&&candidate.score<=3000){
            send('FRIV_SLOPE_FINISH',{score:candidate.score});active=false;candidate=null;
          }
        }
      }catch{}
    }
    // Network restrictions continue to block the game's external telemetry.
    return originalSend.apply(this,arguments);
  };
  if(!window.UnityLoader||typeof UnityLoader.playnovaSlopeFramework!=='function'){fail('Arquivos do Slope indisponíveis. Atualize a página.');return;}
  const canvas=document.createElement('canvas');
  if(!canvas.getContext('webgl2')&&!canvas.getContext('webgl')){fail('Este navegador não disponibiliza WebGL. Verifique o suporte gráfico do aparelho com o responsável pelo computador.');return;}
  UnityLoader.processWasmFrameworkJob=function(module,job){
    module.playnovaOnPrefsWrite=function(score){if(active&&Number.isSafeInteger(score))candidate={score,at:performance.now()};};
    UnityLoader.playnovaSlopeFramework(module);job.complete();
  };
  const options={
    onProgress(instance,progress){
      lastProgress=performance.now();
      if(progress===1){ready=true;container.dataset.ready='true';error.hidden=true;}
    },
    onError(message){fail('O Slope não conseguiu iniciar: '+message);}
  };
  window.gameInstance=UnityLoader.instantiate('gameContainer','build/slope.json',options);
  parent.postMessage({type:'FRIV_SLOPE_READY'},location.origin);
  const watchdog=setInterval(()=>{
    if(ready){clearInterval(watchdog);return;}
    if(performance.now()-lastProgress>90000){fail('O motor do Slope parou de responder. Pode faltar memória ou suporte gráfico. Atualize a página para tentar novamente.');clearInterval(watchdog);}
  },10000);
})();
