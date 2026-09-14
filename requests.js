// Form fields follow the existing Korean forum. All actions remain local previews.
let requestStatCodeIssued=false;
const rawVideoState={linked:false,source:'url',uploadId:'',url:''};
const rococpyDemoUploads=[
 {id:'demo-001',name:'Tidal_Wave_100_raw.mp4',date:'2026.09.14',duration:'03:42',url:'https://gmdkf.rococpy.com/redirect/mock-upload-001'},
 {id:'demo-002',name:'Acheron_100_raw.mp4',date:'2026.09.13',duration:'02:36',url:'https://gmdkf.rococpy.com/redirect/mock-upload-002'},
 {id:'demo-003',name:'Limbo_100_raw.mp4',date:'2026.09.12',duration:'04:18',url:'https://gmdkf.rococpy.com/redirect/mock-upload-003'}
];
function resetRococpyDemo(){Object.assign(rawVideoState,{linked:false,source:'url',uploadId:'',url:''})}
function captureRawVideoChoice(){const url=document.getElementById('request-raw-video'),select=document.getElementById('request-upload-select');if(url)rawVideoState.url=url.value;if(select)rawVideoState.uploadId=select.value}
function rawVideoChooserMarkup(){
 const linked=rawVideoState.linked,uploaded=linked&&rawVideoState.source==='uploaded';
 return `<fieldset class="raw-video-chooser"><legend>무편집 원본 영상 <span>필수</span></legend><div class="raw-source-options"><label><input type="radio" name="request-raw-source" value="uploaded" ${uploaded?'checked':''} ${linked?'':'disabled'}><span>업로드된 영상 선택${linked?'':' · 연동 필요'}</span></label><label><input type="radio" name="request-raw-source" value="url" ${uploaded?'':'checked'}><span>외부 URL 입력</span></label></div>
 <div class="raw-account-status"><span>${linked?'Rococpy · 하늘 <small>연동됨 · 예시</small>':'Rococpy 계정을 연동하면 업로드한 영상에서 선택할 수 있습니다.'}</span><button type="button" class="inline-link" ${linked?'data-rococpy-disconnect':'data-rococpy-connect'}>${linked?'예시 연동 해제':'Rococpy 연동'}</button></div>
 ${uploaded?`<div class="form-field"><label for="request-upload-select">업로드한 영상</label><select id="request-upload-select" required ${rococpyDemoUploads.length?'':'disabled'}><option value="">${rococpyDemoUploads.length?'원본 영상을 선택해 주세요':'업로드된 영상이 없습니다'}</option>${rococpyDemoUploads.map(file=>`<option value="${file.id}" ${rawVideoState.uploadId===file.id?'selected':''}>${esc(file.name)} · ${file.date}</option>`).join('')}</select><p id="request-upload-summary" class="raw-upload-summary" aria-live="polite">${rawUploadSummary()}</p><small>연동 상태와 영상 목록은 목업 예시입니다.</small></div>`:`<div class="form-field"><label for="request-raw-video">무편집 원본 영상 URL</label><input id="request-raw-video" type="url" required value="${esc(rawVideoState.url)}" placeholder="https://…"><small>상위 150위는 포럼 업로드·Google Drive·YouTube 링크, 그 외는 HTTPS 링크를 사용합니다.</small></div>`}
 <a class="raw-upload-link inline-link" href="https://gmdkf.rococpy.com/" target="_blank" rel="noopener noreferrer">Rococpy에서 영상 업로드 ↗</a></fieldset>`;
}
function rawUploadSummary(){const file=rococpyDemoUploads.find(item=>item.id===rawVideoState.uploadId);return file?`${esc(file.name)}<br><span>${file.date} 업로드 · ${file.duration} · 예시 영상</span>`:'선택한 영상이 없습니다.'}
function updateRawUploadSummary(){const el=document.getElementById('request-upload-summary');if(el)el.innerHTML=rawUploadSummary()}
function renderRawVideoChooser(){const el=document.getElementById('request-raw-chooser');if(el)el.innerHTML=rawVideoChooserMarkup()}
function openRococpyLinkPreview(){captureRawVideoChoice();openModal(`${modalHead('Rococpy 계정 연동')}<p>연동한 계정에 업로드된 무편집 영상 목록에서 원본을 고릅니다.</p><p class="tool-sample">현재는 디자인 목업입니다. 실제 계정에 연결하지 않고 예시 영상 3개로 선택 방식을 확인합니다.</p><div class="dialog-actions"><button type="button" class="button-secondary" data-close>취소</button><button type="button" class="button-primary" data-rococpy-demo-link>예시 계정으로 연동 체험</button></div>`)}
document.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;
 if(button.hasAttribute('data-rococpy-connect'))openRococpyLinkPreview();
 if(button.hasAttribute('data-rococpy-demo-link')){rawVideoState.linked=true;rawVideoState.source='uploaded';document.querySelector('#modal').close();renderRawVideoChooser()}
 if(button.hasAttribute('data-rococpy-disconnect')){captureRawVideoChoice();rawVideoState.linked=false;rawVideoState.source='url';rawVideoState.uploadId='';renderRawVideoChooser()}
});
function requestFormMarkup(){
 requestStatCodeIssued=false;
 return `<form class="form-panel forum-request-form" id="request-form"><h2>등재 신청</h2>
 <div class="form-field"><label for="request-category">신청 종류</label><select id="request-category"><option value="데몬리스트">데몬리스트 기록 등재</option><option value="스탯랭킹">스탯랭킹 등재</option><option value="GDDP">GDDP 기록 갱신 안내</option></select></div>
 <fieldset id="request-demon-fields"><legend class="sr-only">데몬리스트 기록</legend>
 <div class="form-field"><label for="request-nickname">닉네임 <span>필수</span></label><input id="request-nickname" list="request-user-options" maxlength="32" required value="${toolState.linked?'하늘':''}" placeholder="포럼에 사용할 닉네임"><datalist id="request-user-options">${names.map(n=>`<option value="${esc(n)}">`).join('')}</datalist></div>
 <div class="form-row"><div class="form-field"><label for="request-level">레벨 <span>필수</span></label><input id="request-level" list="request-level-options" required value="${esc(current().name)} (#${current().rank})" autocomplete="off"><datalist id="request-level-options">${levels.map(l=>`<option value="${esc(l.name)} (#${l.rank})">`).join('')}</datalist><small>목록에서 레벨을 선택해 주세요.</small></div><div class="form-field"><label for="request-percent">퍼센트 <span>필수</span></label><input id="request-percent" type="number" min="${current().rank>200?100:70}" max="100" step="1" value="100" required><small id="request-minimum">이 레벨의 목업 인정 기준: ${current().rank>200?100:70}% 이상</small></div></div>
 <div class="form-row"><div class="form-field"><label for="request-version">게임 버전</label><select id="request-version"><option value="2.208">2.208+</option><option value="2.2">2.207</option><option value="2.1">2.1</option></select></div><div class="form-field"><label for="request-device">사용한 기기</label><select id="request-device"><option value="PC">PC</option><option value="Mobile">Mobile</option><option value="iPad">iPad</option></select></div></div>
 <div class="form-row"><div class="form-field"><label for="request-fps">사용한 FPS 혹은 TPS <span>필수</span></label><input id="request-fps" type="number" min="30" max="65535" step="1" placeholder="예: 240" required><small id="request-fps-help">30–65,535 사이 정수</small></div><div class="form-field"><label for="request-modify">CBF / FPS Bypass</label><select id="request-modify"><option value="none">없음</option><option value="cbf">CBF 사용</option><option value="fps-bypass">FPS Bypass 사용</option></select></div></div>
 <div class="form-field"><label for="request-video">공개 기록 영상 링크 <span>필수</span></label><input id="request-video" type="url" required placeholder="https://www.youtube.com/watch?v=…"><small>YouTube 영상 링크만 제출할 수 있습니다.</small></div>
 <div id="request-raw-chooser">${rawVideoChooserMarkup()}</div>
 <div class="form-field"><label for="request-note">전달 사항 <span>선택</span></label><textarea id="request-note" rows="3" maxlength="120" placeholder="운영진에게 전달할 내용"></textarea><small id="request-note-count">0 / 120자</small></div><p class="request-review-time">원본 포럼 안내 기준, 정상적인 기록의 검토는 최대 72시간이 걸릴 수 있습니다.</p></fieldset>
 <fieldset id="request-stats-fields" hidden disabled><legend>스탯랭킹 등재</legend><p>인게임에서 <strong>GMDKoreaForum</strong> 유저에게 인증 코드를 메시지로 보내는 방식입니다.</p><ol class="request-stat-steps"><li>Discord 로그인 후 인증 코드를 발급받습니다.</li><li>메시지 제목 <strong>Subject</strong>에 코드를 입력합니다. 내용 Message는 자유롭게 작성합니다.</li><li>메시지를 전송한 후 등재를 신청합니다.</li></ol><div class="request-code-box"><code id="request-stat-code">인증 코드 발급 전</code><button type="button" class="button-secondary" id="request-issue-code">코드 발급 예시</button></div><p class="tool-sample">목업 코드는 실제 인증에 사용할 수 없습니다. 게임 내 메시지를 보내지 않아도 화면을 확인할 수 있습니다.</p><p>등재 후 비정상적인 스탯 변화, 핵 사용 또는 리더보드 밴이 확인되면 랭킹에서 블라인드 처리됩니다.</p></fieldset>
 <section id="request-gddp-fields" hidden><h3>GDDP는 프로필에서 갱신합니다</h3><p>기존 한국포럼은 GDDP 기록을 이 신청 폼으로 받지 않고, 내 GDDP 프로필의 기록 갱신 기능으로 반영합니다.</p><button type="button" class="button-secondary" data-page="gddp">GDDP로 이동</button></section>
 <p id="request-form-error" class="tool-error" role="alert"></p><div id="request-submit-area"><button class="button-primary" type="submit">등재 신청 미리보기</button><p class="tool-sample">디자인 목업입니다. 실제 기록 전송·인증 코드 발급은 하지 않습니다.</p></div></form>`;
}
function setRequestCategory(category){
 document.getElementById('request-category').value=category;
 for(const [name,value] of [['demon','데몬리스트'],['stats','스탯랭킹']]){const el=document.getElementById('request-'+name+'-fields');el.hidden=category!==value;el.disabled=category!==value}
 document.getElementById('request-gddp-fields').hidden=category!=='GDDP';document.getElementById('request-submit-area').hidden=category==='GDDP';document.getElementById('request-form-error').textContent='';
}
function requestSelectedLevel(value){const match=/^(.*) \(#(\d+)\)$/.exec(value.trim());return match?levels.find(l=>l.rank===+match[2]&&l.name.toLowerCase()===match[1].toLowerCase()):null}
function readRequestDraft(){const val=id=>document.getElementById('request-'+id).value.trim();captureRawVideoChoice();const upload=rococpyDemoUploads.find(file=>file.id===rawVideoState.uploadId);return {nickname:val('nickname'),level:val('level'),percent:+val('percent'),version:val('version'),device:val('device'),fps:+val('fps'),modify:val('modify'),video:val('video'),rawSource:rawVideoState.source,rawUploadId:rawVideoState.uploadId,rawFilename:rawVideoState.source==='uploaded'?upload?.name:'',raw:rawVideoState.source==='uploaded'?upload?.url||'':rawVideoState.url,note:val('note')}}
function validateDemonRequest(d){
 const level=requestSelectedLevel(d.level);if(!level)return '레벨 목록에서 정확한 레벨을 선택해 주세요.';
 if(!d.nickname||d.nickname.length>32)return '닉네임은 1–32자로 입력해 주세요.';
 const minimum=level.rank>200?100:70;if(!Number.isInteger(d.percent)||d.percent<minimum||d.percent>100)return `이 레벨은 ${minimum}–100%의 정수 진행률을 입력해 주세요.`;
 if(!['2.208','2.2','2.1'].includes(d.version)||!['PC','Mobile','iPad'].includes(d.device)||!['none','cbf','fps-bypass'].includes(d.modify))return '게임 버전·기기·수정 도구를 확인해 주세요.';
 const max=d.version==='2.1'?360:65535;if(!Number.isInteger(d.fps)||d.fps<30||d.fps>max)return `FPS/TPS는 30–${max.toLocaleString('en-US')} 사이 정수로 입력해 주세요.`;
 const youtube=/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/))((\w|-){11})(?:\S+)?$/;
 if(!youtube.test(d.video))return '공개 기록 영상은 올바른 YouTube 영상 링크를 입력해 주세요.';
 if(d.rawSource==='uploaded'&&(!rawVideoState.linked||!rococpyDemoUploads.some(file=>file.id===d.rawUploadId&&file.url===d.raw)))return '연동된 Rococpy 계정의 업로드 영상에서 원본을 선택해 주세요.';
 let raw;try{raw=new URL(d.raw)}catch{return '무편집 원본 영상 링크를 입력해 주세요.'}
 if(raw.protocol!=='https:')return '무편집 원본 영상은 HTTPS 링크를 입력해 주세요.';
 if(level.rank<=150&&!((raw.hostname==='gmdkf.rococpy.com'&&raw.pathname.startsWith('/redirect/'))||(raw.hostname==='drive.google.com'&&raw.pathname.startsWith('/file/'))||['www.youtube.com','youtu.be'].includes(raw.hostname)))return '상위 150위 원본 영상은 포럼 업로드·Google Drive·YouTube 공유 링크를 사용해 주세요.';
 if(d.note.length>120)return '전달 사항은 120자 이하로 입력해 주세요.';return '';
}
function previewForumRequest(){
 const category=document.getElementById('request-category').value,error=document.getElementById('request-form-error');error.textContent='';
 if(category==='GDDP')return;
 if(!toolState.demoAccount){openDemoLogin();return}
 if(category==='스탯랭킹'){if(!requestStatCodeIssued){error.textContent='코드 발급 예시를 먼저 확인해 주세요.';return}openModal(`${modalHead('스탯랭킹 등재 신청 미리보기')}<p>인게임 메시지 인증 후 스탯랭킹 등재를 신청하는 화면입니다.</p><p class="tool-sample">실제 인증·등재 신청은 하지 않았습니다.</p><div class="dialog-actions"><button class="button-primary" data-close>입력 화면으로 돌아가기</button></div>`);return}
 const d=readRequestDraft(),message=validateDemonRequest(d);if(message){error.textContent=message;return}
 const values=[['닉네임',d.nickname],['레벨',d.level],['퍼센트',d.percent+'%'],['게임 버전',d.version==='2.2'?'2.207':d.version==='2.208'?'2.208+':d.version],['사용한 기기',d.device],['FPS / TPS',d.fps],['CBF / FPS Bypass',{none:'없음',cbf:'CBF 사용','fps-bypass':'FPS Bypass 사용'}[d.modify]],['공개 영상',d.video],['원본 선택 방식',d.rawSource==='uploaded'?'Rococpy 업로드 영상':'외부 URL'],...(d.rawFilename?[['선택한 영상',d.rawFilename]]:[]),['무편집 원본',d.raw],['전달 사항',d.note||'-']];
 openModal(`${modalHead('데몬리스트 등재 신청 미리보기')}<dl class="request-preview-list">${values.map(([label,value])=>`<div><dt>${label}</dt><dd>${esc(String(value))}</dd></div>`).join('')}</dl><p class="tool-sample">입력 조건을 확인했습니다. 실제 기록은 전송되지 않았습니다.</p><div class="dialog-actions"><button class="button-primary" data-close>입력 화면으로 돌아가기</button></div>`);
}
document.addEventListener('submit',e=>{if(e.target.id==='request-form'){e.preventDefault();previewForumRequest()}});
document.addEventListener('change',e=>{
 if(e.target.name==='request-raw-source'){captureRawVideoChoice();rawVideoState.source=e.target.value==='uploaded'&&rawVideoState.linked?'uploaded':'url';renderRawVideoChooser()}
 if(e.target.id==='request-upload-select'){rawVideoState.uploadId=e.target.value;updateRawUploadSummary()}
 if(e.target.id==='request-category')setRequestCategory(e.target.value);
 if(e.target.id==='request-version'){const max=e.target.value==='2.1'?360:65535;document.getElementById('request-fps').max=max;document.getElementById('request-fps-help').textContent='30–'+max.toLocaleString('en-US')+' 사이 정수'}
 if(e.target.id==='request-level'){const level=requestSelectedLevel(e.target.value),min=level?(level.rank>200?100:70):0;document.getElementById('request-percent').min=min;document.getElementById('request-minimum').textContent=level?'이 레벨의 목업 인정 기준: '+min+'% 이상':'목록에서 레벨을 선택해 주세요.'}
});
document.addEventListener('input',e=>{if(e.target.id==='request-raw-video')rawVideoState.url=e.target.value;if(e.target.id==='request-note')document.getElementById('request-note-count').textContent=e.target.value.length+' / 120자'});
document.addEventListener('click',e=>{if(e.target.closest('#request-issue-code')){if(!toolState.demoAccount){openDemoLogin();return}requestStatCodeIssued=true;document.getElementById('request-stat-code').textContent='GMDKF-DEMO-0000 · 실사용 불가';document.getElementById('request-form-error').textContent=''}});
