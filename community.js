// Illustrative community and account states. No OAuth tokens or account data are stored.

try{toolState.demoAccount=sessionStorage.getItem('gmd-demo-account')==='true'}catch{}
function levelCreators(level){const count=level.rank===11?80:level.rank%4===0?16:1;return [level.creator,...Array.from({length:count-1},(_,i)=>'제작자 예시 '+String(i+2).padStart(2,'0'))]}
function creatorCredit(level){const all=levelCreators(level);return `<span>제작 <strong>${esc(all[0])}</strong>${all.length>1?` <button class="creator-more" data-creators aria-label="${esc(level.name)} 제작자 ${all.length}명 전체 보기">외 ${all.length-1}명</button>`:''}</span>`}
function showCreators(){const level=current(),all=levelCreators(level);openModal(`${modalHead(esc(level.name)+' 제작자')}<p class="creator-list-caption">총 ${all.length}명 · 목업용 제작자 목록</p><ul class="creator-list">${all.map((name,i)=>`<li><span>${i+1}</span><strong>${esc(name)}</strong></li>`).join('')}</ul><div class="dialog-actions"><button class="button-primary" data-close>닫기</button></div>`)}
function setDemoAccount(value){toolState.demoAccount=value;if(!value&&typeof resetRococpyDemo==='function')resetRococpyDemo();try{sessionStorage.setItem('gmd-demo-account',String(value))}catch{}renderProfileControl()}
function renderProfileControl(){
 const root=document.getElementById('profile-control');if(!root)return;
 root.innerHTML=`<button class="profile-trigger icon-btn" id="header-profile" aria-label="${toolState.demoAccount?'내 프로필 · 예시 계정':'Discord 로그인'}" ${toolState.demoAccount?'aria-controls="profile-dropdown" aria-expanded="false"':''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/></svg></button>${toolState.demoAccount?'<div class="profile-dropdown" id="profile-dropdown"><small>예시 계정 · 하늘</small><button data-self-profile>프로필</button><button data-account-settings>설정</button><button data-demo-logout>로그아웃</button></div>':''}`;
}
function openSelfProfile(){openUserProfile('하늘')}
function openDemoLogin(){openModal(`${modalHead('Discord 로그인')}<p>실제 서비스에서는 Discord 인증 화면으로 이동합니다.</p><p class="tool-sample">지금은 디자인 목업입니다. 예시 계정으로 프로필과 메뉴를 살펴볼 수 있습니다.</p><div class="dialog-actions"><button class="button-secondary" data-close>닫기</button><button class="button-primary" id="demo-sign-in">예시 계정으로 로그인</button></div>`)}
function openAccountSettings(){openModal(`${modalHead('계정 설정')}<p>하늘 · 예시 계정</p><div class="settings-links"><button class="button-secondary" data-settings-page="account">Discord·포럼 계정 연동</button><button class="button-secondary" data-settings-page="nickname">닉네임 변경 요청</button></div><p class="tool-sample">실제 계정에는 반영되지 않습니다.</p>`)}
const staffGroups=[
 {title:'운영 총괄',role:'사이트 운영',members:['하늘','블루문','네온']},
 {title:'데몬리스트',role:'기록 검증',members:['라임','유성','한별','큐브','새벽','은하','민트','온유','파도','루나','여름','누리','별빛','단풍','호수']},
 {title:'스탯랭킹',role:'스탯 검증',members:['도토리','바다','달빛','이슬','초록','구름','나무','노을']},
 {title:'GDDP',role:'코스 관리',members:['소라','나래','보라','여울','산들','모래','해솔']}
];
function staffRow(name,role){return `<li><button class="staff-person" data-staff-name="${name}" data-staff-role="${role}"><span class="staff-avatar" aria-hidden="true">${name[0]}</span><span><strong>${name}</strong><small>${role}</small></span>${gdImage('medal/admin.png','운영진','staff-medal')}</button></li>`}
function communityHome(){
 const staff=staffGroups.flatMap(group=>group.members.map(name=>({name,role:group.role})));
 main.innerHTML=`<section class="forum-welcome" aria-labelledby="forum-welcome-title"><h1 id="forum-welcome-title"><img src="/gmd-korea-forum-mockup/img/forum-title.png" alt="GMD Korea Forum · Since 2017.07.01" width="1679" height="280"></h1><p>Geometry Dash 한국포럼에 오신 것을 환영합니다!</p></section>
 <div class="community-layout"><section class="staff-roster" aria-labelledby="staff-heading"><header class="staff-roster-heading"><h2 id="staff-heading">한국포럼 운영진 <span>${staff.length}명</span></h2><small>명단 예시</small></header><ul class="staff-roster-list">${staff.map(person=>staffRow(person.name,person.role)).join('')}</ul><p class="staff-note">이름과 담당 업무는 디자인 확인용 예시입니다.</p></section>
 <aside class="discord-widget-preview" aria-label="Discord 서버 위젯 예시"><header>${icon('discord')}<strong>GMD 한국포럼</strong><span>미리보기</span></header><div class="discord-widget-body"><h2>공식 Discord 서버</h2><p>공지, 이벤트와 기록 검증 문의</p><div class="discord-presence"><i aria-hidden="true"></i>온라인 6명 <small>예시</small></div><ul>${['하늘','블루문','라임','유성','큐브','새벽'].map(n=>`<li><span class="discord-user-avatar" aria-hidden="true">${n[0]}</span><span>${n}</span><i aria-hidden="true"></i></li>`).join('')}</ul><a href="https://discord.gg/nnsShzg" target="_blank" rel="noopener noreferrer">Discord 서버 들어가기 ${icon('external')}</a><small class="discord-preview-note">서버 위젯 형태의 목업 · 실시간 접속 정보가 아닙니다.</small></div></aside></div>${footer()}`;
}
function toggleLevelPanel(which){if(which==='advanced'){openAdvancedSearch();return}const panel=document.getElementById('quick-panel');panel.hidden=!panel.hidden;document.getElementById('quick-toggle').setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)panel.querySelector('input').focus({preventScroll:true})}

document.addEventListener('click',e=>{
 const b=e.target.closest('button');
 if(!e.target.closest('.profile-control'))document.getElementById('profile-control')?.classList.remove('menu-open');
 if(!b)return;
 if(b.id==='header-profile'){if(toolState.demoAccount)openSelfProfile();else openDemoLogin()}
 if(b.id==='demo-sign-in'){setDemoAccount(true);document.querySelector('#modal').close();toast('예시 계정으로 로그인했습니다.')}
 if(b.id==='account-demo')setDemoAccount(true);
 if(b.hasAttribute('data-self-profile'))openSelfProfile();
 if(b.hasAttribute('data-account-settings'))openAccountSettings();
 if(b.hasAttribute('data-demo-logout')){document.querySelector('#modal').close();setDemoAccount(false);toolState.linked=false;render();toast('예시 계정에서 로그아웃했습니다.')}
 if(b.dataset.settingsPage){document.querySelector('#modal').close();changePage(b.dataset.settingsPage)}
 if(b.dataset.staffName)openModal(`${modalHead(esc(b.dataset.staffName))}<p>${esc(b.dataset.staffRole)} · 운영진 예시</p><p class="tool-sample">실제 운영진 명단과 담당 업무는 연결 전입니다.</p><div class="dialog-actions"><button class="button-primary" data-close>닫기</button></div>`);
 if(b.hasAttribute('data-creators'))showCreators();
 if(b.dataset.profileRecordPage){profileRecordPage=+b.dataset.profileRecordPage;renderProfileRecords()}
 if(b.dataset.profileTab)setProfileTab(b.dataset.profileTab);
 if(b.hasAttribute('data-profile-best-video'))document.getElementById('profile-best-media').innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/9fsZ014qB3s?autoplay=1" title="Tidal Wave 레벨 참고 영상 · Zoink" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
 if(b.id==='advanced-toggle')toggleLevelPanel('advanced');
 if(b.id==='quick-toggle')toggleLevelPanel('quick');
 if(b.id==='filter-reset'){resetLevelFilters();renderList()}
});
document.addEventListener('submit',e=>{
 if(e.target.id==='quick-panel'){
  e.preventDefault();const level=findToolLevel(document.getElementById('quick-rank').value);if(!level){document.getElementById('quick-error').textContent='1~940위 또는 정확한 레벨 이름을 입력해 주세요.';return}
  resetLevelFilters();state.query='';document.getElementById('level-search').value='';state.level=level.rank;state.recordPage=1;state.recordQuery='';state.recordFilter='all';state.detailTab='records';renderList();changePage('demon');document.querySelector('.level-item.active')?.scrollIntoView({block:'nearest'});document.getElementById('quick-error').textContent='';
 }
});
document.addEventListener('keydown',e=>{
 const control=e.target.closest('.profile-control');if(!control)return;
 if(e.key==='ArrowDown'&&toolState.demoAccount&&matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)').matches){e.preventDefault();control.classList.add('menu-open');document.getElementById('header-profile').setAttribute('aria-expanded','true');control.querySelector('.profile-dropdown button')?.focus()}
 if(e.key==='Escape'){control.classList.remove('menu-open');document.getElementById('header-profile').setAttribute('aria-expanded','false');e.target.blur()}
});

document.addEventListener('keydown',e=>{const tab=e.target.closest('[data-profile-tab]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const all=[...document.querySelectorAll('[data-profile-tab]')],index=all.indexOf(tab);const next=e.key==='Home'?0:e.key==='End'?all.length-1:(index+(e.key==='ArrowRight'?1:-1)+all.length)%all.length;setProfileTab(all[next].dataset.profileTab);all[next].focus()});
