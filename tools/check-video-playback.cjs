// Real Chromium playback check using an isolated, temporary browser profile.
const {spawn} = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const {createServer} = require('./preview.cjs');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'sjf-video-check-'));
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'
  ], {windowsHide:true, stdio:['ignore','ignore','pipe']});
  let socket;
  try {
    const endpoint = await new Promise((resolve, reject) => {
      let output = '';
      const timeout = setTimeout(() => reject(new Error('Browser did not start')), 20000);
      chrome.on('error', reject);
      chrome.stderr.on('data', chunk => {
        output += chunk;
        const match = output.match(/DevTools listening on (ws:\/\/\S+)/);
        if (match) { clearTimeout(timeout); resolve(match[1]); }
      });
    });
    socket = new WebSocket(endpoint);
    await new Promise(resolve => socket.addEventListener('open', resolve, {once:true}));
    let nextId=0;
    const pending = new Map();
    socket.addEventListener('message', event => {
      const data=JSON.parse(event.data), call=pending.get(data.id);
      if (call) { pending.delete(data.id); data.error ? call.reject(data.error) : call.resolve(data.result); }
    });
    const send=(method,params={},sessionId) => new Promise((resolve,reject) => {
      const id=++nextId; pending.set(id,{resolve,reject});
      socket.send(JSON.stringify({id,method,params,sessionId}));
    });
    const {targetId}=await send('Target.createTarget',{url:'about:blank'});
    const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
    const evaluate=async expression => {
      const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);
      if(result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    await send('Page.enable',{},sessionId);
    await send('Page.navigate',{url:base+'/3.html'},sessionId);
    for(let i=0;i<40;i++) {
      if(await evaluate('Boolean(document.querySelector(".hero-kids-frame video"))')) break;
      await sleep(500);
    }
    const snapshot=() => evaluate(`['.hero-kids-frame video','#homeFeaturedVideo video'].map(s=>{
      const v=document.querySelector(s);return v && {src:v.currentSrc,time:v.currentTime,paused:v.paused,muted:v.muted,loop:v.loop,ready:v.readyState,error:v.error && v.error.message};})`);
    await sleep(2000);
    const first=await snapshot();
    await sleep(1500);
    const next=await snapshot();
    assert(next[0] && next[0].src.endsWith('/1003.mp4') && !next[0].paused && next[0].time > first[0].time, 'Hero must actually advance: '+JSON.stringify({first,next}));
    assert(next[1] && next[1].src.endsWith('/sjf-day-13.mp4') && !next[1].paused && next[1].time > first[1].time, 'Story must actually advance');
    // Seek near the end to verify a real native loop, not just a loop attribute.
    await evaluate('document.querySelector(".hero-kids-frame video").currentTime=9.5');
    await sleep(1600);
    const looped=await snapshot();
    assert(looped[0].time < 5 && !looped[0].paused,'Hero must wrap around and keep playing');
    await evaluate('document.querySelector("[data-id=\"sjf-day-15\"].home-video-row").click()');
    await sleep(1000);
    const switched=await snapshot();
    assert(switched[1].src.endsWith('/sjf-day-15.mp4') && switched[1].loop,'Day 15 selection must loop');
    assert(!switched[0].paused,'Selecting a story must not pause the hero');
    await send('Page.navigate',{url:base+'/videos.html'},sessionId);
    for(let i=0;i<40;i++) {
      if(await evaluate('Boolean(document.querySelector("#videos .vframe"))')) break;
      await sleep(500);
    }
    const gallery=await evaluate('[...document.querySelectorAll("#videos .vframe")].map(v=>v.dataset.id)');
    assert.deepEqual(gallery,[11,12,13,14,15,16,17,19].map(n=>'sjf-day-'+n));
    console.log(JSON.stringify({result:'PASS',first,next,looped:looped[0],gallery},null,2));
    await send('Browser.close');
  } finally {
    if(socket) socket.close();
    chrome.kill(); server.close();
  }
})().catch(error => {console.error(error);process.exitCode=1;});
