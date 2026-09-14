/* Shared motion: preserve native dialog focus trapping until exit completes. */
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const modalMotion={timer:0,finish:null,callbacks:[]};
function clearModalMotion(){clearTimeout(modalMotion.timer);modalMotion.timer=0;const dialog=document.getElementById('modal');if(modalMotion.finish)dialog.removeEventListener('animationend',modalMotion.finish);modalMotion.finish=null;modalMotion.callbacks=[];dialog.classList.remove('is-opening','is-closing');dialog.inert=false}
function openModal(content){
 const dialog=document.getElementById('modal');clearModalMotion();document.getElementById('modal-content').innerHTML=content;
 if(!dialog.open)dialog.showModal();
 if(!motionPreference.matches){void dialog.offsetWidth;dialog.classList.add('is-opening')}
}
function closeModal(afterClose){
 const dialog=document.getElementById('modal');
 if(!dialog.open){if(typeof afterClose==='function')afterClose();return}
 if(typeof afterClose==='function')modalMotion.callbacks.push(afterClose);
 if(modalMotion.finish)return;
 const finish=event=>{
  if(event&&(event.target!==dialog||event.animationName!=='gmd-dialog-out'))return;
  const callbacks=modalMotion.callbacks.slice();clearModalMotion();dialog.close();document.getElementById('modal-content').innerHTML='';callbacks.forEach(callback=>callback());
 };
 if(motionPreference.matches){finish();return}
 modalMotion.finish=finish;dialog.classList.remove('is-opening');dialog.classList.add('is-closing');dialog.inert=true;
 dialog.addEventListener('animationend',finish);modalMotion.timer=setTimeout(()=>finish(),240);
}
const motionDialog=document.getElementById('modal');
motionDialog.addEventListener('cancel',event=>{event.preventDefault();closeModal()});
motionDialog.addEventListener('click',event=>{if(event.target!==motionDialog)return;const rect=motionDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeModal()});
motionDialog.addEventListener('close',()=>{if(!motionDialog.open)clearModalMotion()});

const surfaceMotions=new Map();
function animateSurface(element,delay=0){
 if(!element||motionPreference.matches||typeof element.animate!=='function')return;
 surfaceMotions.get(element)?.cancel();
 const animation=element.animate([{opacity:.35,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,delay,fill:'backwards',easing:'cubic-bezier(.2,.7,.25,1)'});
 surfaceMotions.set(element,animation);
 animation.finished.catch(()=>{}).finally(()=>{if(surfaceMotions.get(element)===animation)surfaceMotions.delete(element)});
}
const panelMotions=new Map();
function setMotionPanelOpen(panel,open,trigger){
 const previous=panelMotions.get(panel);previous?.animation?.cancel();
 const entry={open,animation:null,finish:null};panelMotions.set(panel,entry);
 trigger?.setAttribute('aria-expanded',String(open));
 if(!open&&panel.contains(document.activeElement))trigger?.focus({preventScroll:true});
 if(open)panel.hidden=false;
 const finish=()=>{if(panelMotions.get(panel)!==entry)return;panel.hidden=!open;panelMotions.delete(panel)};entry.finish=finish;
 if(motionPreference.matches||typeof panel.animate!=='function'){finish();return}
 entry.animation=panel.animate(open?[{opacity:0,transform:'translateY(-5px)'},{opacity:1,transform:'translateY(0)'}]:[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-5px)'}],{duration:open?200:140,easing:'ease-out'});
 entry.animation.finished.then(finish,()=>{});
 if(open)panel.querySelector('input')?.focus({preventScroll:true});
}
function toggleMotionPanel(panel,trigger){setMotionPanelOpen(panel,!(panelMotions.get(panel)?.open??!panel.hidden),trigger)}

// Animate content replacements, not individual rows changing during a search.
const motionMain=document.getElementById('main');
const contentMotionObserver=new MutationObserver(records=>{
 for(const [element,animation] of surfaceMotions){if(!element.isConnected){animation.cancel();surfaceMotions.delete(element)}}
 if(records.some(record=>record.target===motionMain)){
  [...motionMain.children].filter(element=>!element.matches('nav,footer,.page-heading,.page-intro,.request-page-heading,.stats-tabs,.tabs-row,.table-toolbar,.overview')).forEach((element,index)=>animateSurface(element,Math.min(index,3)*25));return;
 }
 const surfaces=new Set(records.map(record=>record.target).filter(element=>element.matches?.('#detail-content,#profile-record-list,#calculator-result,#request-raw-chooser')));
 surfaces.forEach(element=>animateSurface(element));
});
contentMotionObserver.observe(motionMain,{childList:true,subtree:true});
motionPreference.addEventListener('change',()=>{
 if(!motionPreference.matches)return;
 if(modalMotion.finish)modalMotion.finish();
 surfaceMotions.forEach(animation=>animation.cancel());surfaceMotions.clear();
 panelMotions.forEach(entry=>{entry.animation?.cancel();entry.finish()});
});
