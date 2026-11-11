/* Stream local file parts in order; do not retain entire Unity files in a global cache. */
(() => {
  'use strict';
  const config=window.PlaynovaChunkFiles;
  if(!config||window.PlaynovaChunksInstalled)return;
  window.PlaynovaChunksInstalled=true;
  const root=new URL(config.root,location.href),nativeFetch=window.fetch.bind(window);
  function find(input){
    try{
      const url=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url,location.href);
      if(url.origin!==root.origin||!url.pathname.startsWith(root.pathname))return;
      return config.files[decodeURIComponent(url.pathname.slice(root.pathname.length))];
    }catch{}
  }
  function stream(info,signal,progress){
    let reader=null,part=0,loaded=0,ended=false,outputController;
    const request=new AbortController();
    const cleanup=()=>signal?.removeEventListener('abort',cancel);
    const cancel=()=>{
      request.abort();reader?.cancel().catch(()=>{});
      if(!ended&&outputController){ended=true;outputController.error(new DOMException('Aborted','AbortError'));}
      cleanup();
    };
    signal?.addEventListener('abort',cancel,{once:true});
    return new ReadableStream({
      start(output){outputController=output;if(signal?.aborted)cancel();},
      async pull(output){
        try{
          while(!ended){
            if(!reader){
              if(part>=info.parts.length){
                if(loaded!==info.size)throw new Error('Incomplete game file');
                ended=true;cleanup();output.close();return;
              }
              const name=info.parts[part++];
              const response=await nativeFetch(new URL(name,root),{signal:request.signal});
              if(!response.ok)throw new Error('Missing game part: '+name);
              reader=response.body.getReader();
            }
            const {done,value}=await reader.read();
            if(ended)return;
            if(done){reader.releaseLock();reader=null;continue;}
            loaded+=value.byteLength;
            if(loaded>info.size)throw new Error('Invalid game file size');
            output.enqueue(value);progress?.(loaded);return;
          }
        }catch(error){if(!ended){ended=true;cleanup();output.error(error);}}
      },
      cancel(){ended=true;request.abort();reader?.cancel().catch(()=>{});cleanup();}
    });
  }
  window.fetch=(input,init)=>{
    const info=find(input),method=String(init?.method||input?.method||'GET').toUpperCase();
    if(!info||method!=='GET')return nativeFetch(input,init);
    const signal=init?.signal||input?.signal;
    if(signal?.aborted)return Promise.reject(new DOMException('Aborted','AbortError'));
    return Promise.resolve(new Response(stream(info,signal),{headers:{'Content-Type':info.type,'Content-Length':String(info.size)}}));
  };
  const open=XMLHttpRequest.prototype.open,send=XMLHttpRequest.prototype.send,abort=XMLHttpRequest.prototype.abort;
  XMLHttpRequest.prototype.open=function(method,url,...args){
    this.playnovaChunkInfo=String(method).toUpperCase()==='GET'?find(url):null;
    this.playnovaChunkURL=new URL(url,location.href).href;
    this.playnovaChunkAborted=false;
    return open.call(this,method,url,...args);
  };
  XMLHttpRequest.prototype.send=function(...args){
    const info=this.playnovaChunkInfo;if(!info)return send.apply(this,args);
    const xhr=this,request=new AbortController();this.playnovaChunkRequest=request;
    let timer,timedOut=false;
    if(xhr.timeout)timer=setTimeout(()=>{timedOut=true;request.abort();},xhr.timeout);
    const progress=loaded=>{if(!xhr.playnovaChunkAborted)xhr.dispatchEvent(new ProgressEvent('progress',{lengthComputable:true,loaded,total:info.size}));};
    xhr.dispatchEvent(new ProgressEvent('loadstart',{lengthComputable:true,total:info.size}));
    const response=new Response(stream(info,request.signal,progress),{headers:{'Content-Type':info.type}});
    const body=xhr.responseType==='blob'?response.blob():xhr.responseType==='arraybuffer'?response.arrayBuffer():response.text();
    body.then(value=>{
      if(xhr.playnovaChunkAborted||timedOut)return;
      const text=typeof value==='string'?value:'';
      Object.defineProperties(xhr,{
        status:{configurable:true,get:()=>200},statusText:{configurable:true,get:()=>'OK'},readyState:{configurable:true,get:()=>4},
        response:{configurable:true,get:()=>xhr.responseType==='json'?JSON.parse(text):value},responseText:{configurable:true,get:()=>text},responseURL:{configurable:true,get:()=>xhr.playnovaChunkURL}
      });
      xhr.getResponseHeader=name=>name.toLowerCase()==='content-length'?String(info.size):name.toLowerCase()==='content-type'?info.type:null;
      xhr.getAllResponseHeaders=()=>`content-type: ${info.type}\r\ncontent-length: ${info.size}\r\n`;
      xhr.dispatchEvent(new Event('readystatechange'));xhr.dispatchEvent(new ProgressEvent('load',{lengthComputable:true,loaded:info.size,total:info.size}));
    }).catch(()=>{
      if(!xhr.playnovaChunkAborted){
        Object.defineProperties(xhr,{readyState:{configurable:true,get:()=>4},status:{configurable:true,get:()=>0}});
        xhr.dispatchEvent(new Event('readystatechange'));xhr.dispatchEvent(new ProgressEvent(timedOut?'timeout':'error'));
      }
    }).finally(()=>{clearTimeout(timer);if(!xhr.playnovaChunkAborted)xhr.dispatchEvent(new ProgressEvent('loadend'));xhr.playnovaChunkRequest=null;});
  };
  XMLHttpRequest.prototype.abort=function(){
    const pending=this.playnovaChunkRequest;this.playnovaChunkAborted=true;pending?.abort();
    const result=abort.call(this);
    if(pending){this.dispatchEvent(new ProgressEvent('abort'));this.dispatchEvent(new ProgressEvent('loadend'));}
    return result;
  };
})();
