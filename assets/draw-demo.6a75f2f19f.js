// Local screenshot slideshow. No network, tracking, location access or storage.
const labels=['A little night-time inspiration.','Dinner, with the weather in mind.','Brunch starts with a draw.'];
const shots=[...document.querySelectorAll('.app-screenshot')];
const dots=[...document.querySelectorAll('.scene-progress span')];
const demo=document.querySelector('.demo'),pause=document.getElementById('pause-demo');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
let current=0,paused=motion.matches;
function updatePause(){
  demo.classList.toggle('paused',paused);
  pause.textContent=paused?'Play ▷':'Pause Ⅱ';
  pause.setAttribute('aria-label',paused?'Resume automatic preview':'Pause automatic preview');
  pause.setAttribute('aria-pressed',String(paused));
}
function show(index,manual=false){
  current=(index+shots.length)%shots.length;
  shots.forEach((shot,i)=>{shot.classList.toggle('active',i===current);shot.setAttribute('aria-hidden',String(i!==current));});
  dots.forEach((dot,i)=>dot.classList.toggle('active',i===current));
  const label=document.getElementById('screen-label');label.setAttribute('aria-live',manual?'polite':'off');label.textContent=labels[current];
  document.querySelector('.scene-progress').setAttribute('aria-label',`Screenshot ${current+1} of ${shots.length}`);
}
pause.addEventListener('click',()=>{paused=!paused;updatePause();});
function step(direction){paused=true;updatePause();show(current+direction,true);}
document.getElementById('next-screen').addEventListener('click',()=>step(1));
document.getElementById('previous-screen').addEventListener('click',()=>step(-1));
let startX;
const phone=document.getElementById('screenshot-phone');
phone.addEventListener('pointerdown',e=>{startX=e.clientX;phone.setPointerCapture(e.pointerId);});
phone.addEventListener('pointerup',e=>{if(startX!==undefined&&Math.abs(e.clientX-startX)>45)step(e.clientX<startX?1:-1);startX=undefined;});
phone.addEventListener('pointercancel',()=>{startX=undefined;});
motion.addEventListener('change',e=>{if(e.matches){paused=true;updatePause();}});
setInterval(()=>{if(!paused&&!document.hidden)show(current+1);},6500);
updatePause();show(0);
