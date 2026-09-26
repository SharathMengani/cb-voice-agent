/* ChatBucket demo embed. The host website requests its own scoped session. */
(function () {
  var script=document.currentScript;
  if(!script||!script.dataset.widgetId)return;
  var host=new URL(script.src).origin;
  var api=script.dataset.apiOrigin||host;
  var id=script.dataset.widgetId;
  var frame=document.createElement('iframe');
  frame.title='ChatBucket Voice Support';
  frame.src=host+'/flow/28?widget='+encodeURIComponent(id)+'&origin='+encodeURIComponent(location.origin);
  frame.allow='microphone';
  frame.setAttribute('aria-label','ChatBucket voice support');
  frame.style.cssText='border:0;position:fixed;right:16px;bottom:76px;width:min(390px,calc(100vw - 32px));height:min(700px,calc(100vh - 100px));border-radius:14px;box-shadow:0 20px 65px rgba(0,0,0,.3);z-index:2147483646;background:#1b1927;display:none;';
  var button=document.createElement('button');
  button.type='button';button.setAttribute('aria-label','Open voice support');button.textContent='☎  Voice support';
  button.style.cssText='position:fixed;right:18px;bottom:17px;z-index:2147483647;border:0;border-radius:99px;background:#7145e7;color:white;padding:14px 19px;font:600 14px system-ui,sans-serif;box-shadow:0 8px 25px rgba(76,36,170,.35);cursor:pointer;';
  var token='',loaded=false;
  window.addEventListener('message',function(event){if(event.source!==frame.contentWindow||event.origin!==host||event.data?.type!=='chatbucket:widget-ready'||event.data.widgetId!==id||!token)return;frame.contentWindow.postMessage({type:'chatbucket:widget-session',widgetId:id,token:token},host)});
  frame.addEventListener('load',function(){loaded=true;if(token)frame.contentWindow.postMessage({type:'chatbucket:widget-session',widgetId:id,token:token},host)});
  button.addEventListener('click',async function(){
    if(frame.style.display!=='none'){frame.style.display='none';button.textContent='☎  Voice support';return}
    button.disabled=true;button.textContent='Opening…';
    try{
      var response=await fetch(api+'/api/demo/widget/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({widgetId:id})});
      var data=await response.json();if(!response.ok)throw Error(data.error||'Widget unavailable.');
      token=data.token;frame.style.display='block';button.textContent='×  Close support';if(loaded)frame.contentWindow.postMessage({type:'chatbucket:widget-session',widgetId:id,token:token},host);
    }catch(error){button.textContent='Voice support unavailable';button.title=error.message}
    finally{button.disabled=false}
  });
  document.body.appendChild(frame);document.body.appendChild(button);
})();
