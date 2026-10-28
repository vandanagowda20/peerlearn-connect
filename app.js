const app = document.getElementById('app');
const toast = document.getElementById('toast');
let currentPage = 'dashboard';
const AUTH_KEY = 'peerlearnConnectDemoUsers';
const SESSION_KEY = 'peerlearnConnectDemoSession';
let currentUser = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
let authMode = 'signup';
const skills = [
 {title:'Python Programming',category:'Technology',level:'Beginner friendly',teacher:'Ananya Sharma',initials:'AS',icon:'⌘',description:'Build a strong foundation in Python, functions, and problem solving.'},
 {title:'UI/UX Design',category:'Design',level:'Intermediate',teacher:'Rohan Mehta',initials:'RM',icon:'✎',description:'Explore wireframes, design systems, and user-centred thinking.'},
 {title:'Public Speaking',category:'Communication',level:'All levels',teacher:'Meera Rao',initials:'MR',icon:'◉',description:'Practise clear presentations and speak with more confidence.'},
 {title:'Web Development',category:'Technology',level:'Beginner friendly',teacher:'Kiran Patel',initials:'KP',icon:'⌘',description:'Learn HTML, CSS, and JavaScript by building small projects.'},
 {title:'Photography',category:'Creative',level:'Beginner friendly',teacher:'Pooja Nair',initials:'PN',icon:'▧',description:'Understand composition, lighting, and visual storytelling.'},
 {title:'SQL Fundamentals',category:'Technology',level:'Intermediate',teacher:'Arjun Das',initials:'AD',icon:'▤',description:'Learn queries, joins, grouping, and relational data concepts.'}
];
let requests = [
 {title:'Learn Python basics',person:'Kiran Patel',initials:'KP',status:'Pending'},
 {title:'Exchange: UI/UX for SQL',person:'Pooja Nair',initials:'PN',status:'Accepted'},
 {title:'Practise public speaking',person:'Meera Rao',initials:'MR',status:'Pending'}
];
const exchanges = [
 {title:'Python Programming',person:'Ananya Sharma',progress:60,next:'Practise lists and dictionaries'},
 {title:'UI/UX Design',person:'Rohan Mehta',progress:35,next:'Create a low-fidelity wireframe'},
 {title:'Public Speaking',person:'Meera Rao',progress:100,next:'Completed — great work!'}
];
function getDemoUsers(){try{return JSON.parse(localStorage.getItem(AUTH_KEY)||'[]')}catch{return []}}
function setAuthMode(mode){authMode=mode;renderAuth();}
function renderAuth(){
 document.body.classList.add('auth-mode');
 const loggedIn=!!currentUser;
 document.getElementById('accountActions').style.display=loggedIn?'flex':'none';
 app.innerHTML=`<section class="auth-shell"><div class="auth-intro"><span class="brand-mark">P</span><div class="eyebrow" style="color:#e0e8ff">PEERLEARN CONNECT</div><h1>Learn together.<br>Grow together.</h1><p>Connect with fellow learners, exchange skills, and turn curiosity into confidence.</p><div class="auth-points"><span>✓ Discover skills from your peers</span><span>✓ Share what you already know</span><span>✓ Keep your learning journey organised</span></div></div><div class="auth-card"><div class="auth-tabs"><button type="button" data-auth-mode="login" class="${authMode==='login'?'active':''}">Log in</button><button type="button" data-auth-mode="signup" class="${authMode==='signup'?'active':''}">Sign up</button></div><h2>${authMode==='signup'?'Create your account':'Welcome back'}</h2><p class="auth-subtitle">${authMode==='signup'?'Join the community and start learning from your peers.':'Log in to continue your learning journey.'}</p><form id="authForm" class="auth-form">${authMode==='signup'?'<div class="form-field"><label for="authName">Full name</label><input id="authName" name="name" autocomplete="name" placeholder="Enter your name" required maxlength="70"></div>':''}<div class="form-field"><label for="authEmail">Email address</label><input id="authEmail" name="email" type="email" autocomplete="email" placeholder="you@example.com" required></div><div class="form-field"><label for="authPassword">Password</label><input id="authPassword" name="password" type="password" autocomplete="${authMode==='signup'?'new-password':'current-password'}" minlength="6" placeholder="At least 6 characters" required></div><div id="authError" class="auth-error" role="alert"></div><button class="primary" type="submit">${authMode==='signup'?'Create account':'Log in'}</button></form><p class="auth-switch">${authMode==='signup'?'Already have an account?':'New to PeerLearn Connect?'} <button type="button" data-auth-mode="${authMode==='signup'?'login':'signup'}">${authMode==='signup'?'Log in':'Sign up'}</button></p><p class="auth-note">Prototype note: this static demo stores account details only in this browser. It is not secure production authentication. Do not use a real or reused password.</p></div></section>`;
 document.querySelectorAll('[data-auth-mode]').forEach(b=>b.addEventListener('click',()=>setAuthMode(b.dataset.authMode)));
 document.getElementById('authForm').addEventListener('submit',handleAuthSubmit);
}
async function passwordDigest(password){if(window.crypto&&crypto.subtle){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(password));return Array.from(new Uint8Array(bytes)).map(b=>b.toString(16).padStart(2,'0')).join('')}return password;}
async function handleAuthSubmit(e){e.preventDefault();const email=document.getElementById('authEmail').value.trim().toLowerCase();const password=document.getElementById('authPassword').value;const users=getDemoUsers();const error=document.getElementById('authError');
 if(authMode==='signup'){const name=document.getElementById('authName').value.trim();if(users.some(u=>u.email===email)){error.textContent='An account with this email already exists. Please log in.';return}const user={name,email,passwordDigest:await passwordDigest(password)};users.push(user);localStorage.setItem(AUTH_KEY,JSON.stringify(users));currentUser={name,email};localStorage.setItem(SESSION_KEY,JSON.stringify(currentUser));enterApp();showToast('Account created for this demo');return}
 const user=users.find(u=>u.email===email);if(!user||user.passwordDigest!==await passwordDigest(password)){error.textContent='Email or password is incorrect. If this is your first time, please sign up.';return}currentUser={name:user.name,email:user.email};localStorage.setItem(SESSION_KEY,JSON.stringify(currentUser));enterApp();showToast('Logged in successfully');
}
function enterApp(){document.body.classList.remove('auth-mode');document.getElementById('accountActions').style.display='flex';document.getElementById('profileButton').hidden=false;document.getElementById('logoutButton').hidden=false;document.querySelector('.topnav').style.display='flex';document.querySelector('.sidebar').style.display='flex';document.getElementById('profileButton').textContent=(currentUser.name||'U').split(/\s+/).map(s=>s[0]).join('').slice(0,2).toUpperCase();currentPage='dashboard';render();}
function logout(){currentUser=null;localStorage.removeItem(SESSION_KEY);authMode='login';document.getElementById('profileButton').hidden=true;document.getElementById('logoutButton').hidden=true;renderAuth();}
function showToast(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400)}
function head(kicker,title,description,button=''){return `<div class="page-head"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${description}</p></div>${button}</div>`}
function skillCard(s,buttonLabel='View details'){return `<article class="skill-card"><div class="skill-icon">${s.icon}</div><h3>${s.title}</h3><p>${s.description}</p><div class="skill-meta"><span>${s.teacher}</span><span class="tag">${s.category}</span></div><button class="secondary" style="margin-top:13px" data-request="${s.title}">${buttonLabel}</button></article>`}
function renderDashboard(){

app.innerHTML=head('YOUR SPACE',`Welcome back, ${currentUser?.name || 'Learner'}`,'Keep growing by sharing knowledge and learning from your peers.',`<button class="primary" data-page="skills">＋ Explore skills</button>`)+
 `<section class="hero"><div><div class="eyebrow" style="color:#dce5ff">YOUR NEXT STEP</div><h2>Small skills can lead to big opportunities.</h2><p>Find a learning partner, exchange practical knowledge, and make progress together — one session at a time.</p><button class="primary" data-page="my-skills">Share a skill</button></div><div style="font-size:82px;opacity:.85;padding:0 22px">✧</div></section>
 <section class="stats"><div class="stat"><div class="stat-top">Skills shared <span class="stat-icon">✦</span></div><strong>08</strong><small>↑ 2 added this month</small></div><div class="stat"><div class="stat-top">Learning requests <span class="stat-icon">↔</span></div><strong>04</strong><small>2 need your response</small></div><div class="stat"><div class="stat-top">Active exchanges <span class="stat-icon">◎</span></div><strong>03</strong><small>Keep your momentum</small></div></section>
 <div class="section-head"><h2>Skills you might like</h2><button class="text-link" data-page="skills">Browse all skills →</button></div><div class="skill-grid">${skills.slice(0,3).map(s=>skillCard(s,'Request exchange')).join('')}</div>
 <div class="section-head"><h2>Recent activity</h2><button class="text-link" data-page="requests">View requests →</button></div><div class="panel"><table class="table"><thead><tr><th>Learning goal</th><th>Partner</th><th>Status</th></tr></thead><tbody>${requests.map(r=>`<tr><td>${r.title}</td><td><div class="person"><span class="person-icon">${r.initials}</span>${r.person}</div></td><td><span class="tag" style="${r.status==='Pending'?'background:#fff5df;color:#a66b00':''}">${r.status}</span></td></tr>`).join('')}</tbody></table></div>`;
}
function renderSkills(){
 app.innerHTML=head('DISCOVER','Explore skills','Search for a peer who can help you learn something new.')+`<div class="searchbar"><input id="skillSearch" placeholder="Search a skill, category, or teacher..." aria-label="Search skills"><button class="primary" id="searchButton">Search</button></div><div class="skill-list" id="skillResults">${skills.map(s=>`<article class="skill-card"><div class="skill-icon">${s.icon}</div><div class="skill-body"><h3>${s.title}</h3><p>${s.description}</p><div class="skill-meta"><span>${s.teacher} · ${s.level}</span><span class="tag">${s.category}</span></div><button class="primary" data-request="${s.title}">Request exchange</button></div></article>`).join('')}</div>`;
 const filter=()=>{const q=document.getElementById('skillSearch').value.toLowerCase();const found=skills.filter(s=>[s.title,s.category,s.teacher,s.description].join(' ').toLowerCase().includes(q));document.getElementById('skillResults').innerHTML=found.length?found.map(s=>`<article class="skill-card"><div class="skill-icon">${s.icon}</div><div class="skill-body"><h3>${s.title}</h3><p>${s.description}</p><div class="skill-meta"><span>${s.teacher} · ${s.level}</span><span class="tag">${s.category}</span></div><button class="primary" data-request="${s.title}">Request exchange</button></div></article>`).join(''):'<div class="empty">No skills match your search. Try another keyword.</div>';};
 document.getElementById('searchButton').onclick=filter;document.getElementById('skillSearch').oninput=filter;
}
function renderMySkills(){
 app.innerHTML=head('CONTRIBUTE','My skills','Manage the knowledge you can share with other learners.',`<button class="primary" id="addSkill">＋ Add a skill</button>`)+`<div class="panel"><table class="table"><thead><tr><th>Skill</th><th>Category</th><th>Level</th><th>Action</th></tr></thead><tbody>${skills.slice(0,3).map((s,i)=>`<tr><td><div class="person"><span class="person-icon">${s.icon}</span><strong>${s.title}</strong></div></td><td>${s.category}</td><td>${s.level}</td><td><button class="text-link" data-remove="${i}">Remove</button></td></tr>`).join('')}</tbody></table></div><div class="section-head"><h2>Add a new skill</h2></div><form class="panel form-panel" id="skillForm"><div class="form-grid"><div class="form-field"><label for="skillTitle">Skill name</label><input id="skillTitle" required placeholder="e.g. Java basics"></div><div class="form-field"><label for="skillCategory">Category</label><select id="skillCategory"><option>Technology</option><option>Design</option><option>Communication</option><option>Creative</option></select></div><div class="form-field full"><label for="skillDescription">Short description</label><input id="skillDescription" required placeholder="What can you teach?"></div></div><button class="primary" style="margin-top:17px">Save skill</button></form>`;
 document.getElementById('addSkill').onclick=()=>document.getElementById('skillTitle').focus();
 document.getElementById('skillForm').onsubmit=e=>{e.preventDefault();skills.unshift({title:document.getElementById('skillTitle').value,category:document.getElementById('skillCategory').value,level:'All levels',teacher:'Ananya Sharma',initials:'AS',icon:'✦',description:document.getElementById('skillDescription').value});showToast('Skill added to this demo session');renderMySkills();};
}
function renderRequests(){
 app.innerHTML=head('COORDINATE','Learning requests','Accept or decline requests and keep learning exchanges organised.')+`<div class="section-head"><h2>Incoming and outgoing</h2><span class="muted" style="font-size:11px">${requests.length} requests</span></div>${requests.map((r,i)=>`<article class="request-card"><div class="person"><span class="person-icon">${r.initials}</span><div><h3>${r.title}</h3><p>${r.person} · Peer learning request</p></div></div><div class="actions"><span class="tag" style="align-self:center;${r.status==='Pending'?'background:#fff5df;color:#a66b00':''}">${r.status}</span>${r.status==='Pending'?`<button class="primary" data-accept="${i}">Accept</button><button class="secondary" data-decline="${i}">Decline</button>`:''}</div></article>`).join('')}`;
}
function renderExchanges(){
 app.innerHTML=head('KEEP MOVING','My exchanges','Track your progress and decide what to practise next.')+`<div class="skill-grid">${exchanges.map(x=>`<article class="skill-card"><div class="skill-icon">◎</div><h3>${x.title}</h3><p>Learning partner: ${x.person}</p><div class="section-head"><span class="muted" style="font-size:11px">Progress</span><strong>${x.progress}%</strong></div><div class="progress"><span style="width:${x.progress}%"></span></div><p>${x.next}</p><button class="secondary" data-progress="${x.title}">Update progress</button></article>`).join('')}</div>`;
}
function renderProfile(){
 app.innerHTML=head('YOUR DETAILS','Profile','A quick overview of your learning interests.')+`<div class="panel form-panel"><div class="person" style="margin-bottom:25px"><div class="person-icon" style="width:58px;height:58px;font-size:16px">AS</div><div><h2 style="font-size:20px;margin:0 0 5px">${currentUser?.name || 'Learner'}</h2><p class="muted" style="font-size:12px;margin:0">Student learner · Bengaluru</p></div></div><div class="form-grid"><div class="form-field full"><label>Learning interests</label><input value="Web development, UI/UX, SQL" readonly></div><div class="form-field full"><label>Skills I can share</label><input value="Python, Java, Presentation skills" readonly></div><div class="form-field full"><label>About me</label><input value="I enjoy learning by building projects and helping peers." readonly></div></div><button class="primary" style="margin-top:18px" id="editProfile">Edit profile</button></div>`;
 document.getElementById('editProfile').onclick=()=>showToast('Profile editing is a future feature in this prototype');
}
function render(){document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('selected',b.dataset.page===currentPage));document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.page===currentPage));({dashboard:renderDashboard,skills:renderSkills,'my-skills':renderMySkills,requests:renderRequests,exchanges:renderExchanges,profile:renderProfile}[currentPage]||renderDashboard)();app.focus({preventScroll:true});}
document.addEventListener('click',e=>{
 const page=e.target.closest('[data-page]');if(page){currentPage=page.dataset.page;render();return;}
 const req=e.target.closest('[data-request]');if(req){requests.unshift({title:'Learn '+req.dataset.request,person:'Ananya Sharma',initials:'AS',status:'Pending'});showToast('Demo learning request created');return;}
 const accept=e.target.closest('[data-accept]');if(accept){requests[+accept.dataset.accept].status='Accepted';showToast('Request accepted');renderRequests();return;}
 const decline=e.target.closest('[data-decline]');if(decline){requests.splice(+decline.dataset.decline,1);showToast('Request declined');renderRequests();return;}
 const remove=e.target.closest('[data-remove]');if(remove){showToast('Removal is simulated in this prototype');return;}
 const prog=e.target.closest('[data-progress]');if(prog){showToast('Progress update saved for this demo session');return;}
});
document.getElementById('profileButton').onclick=()=>{currentPage='profile';render()};
document.getElementById('logoutButton').onclick=logout;
document.addEventListener('click',e=>{const auth=e.target.closest('[data-auth]');if(auth){authMode=auth.dataset.auth;renderAuth();}});
if(currentUser){enterApp()}else{renderAuth()}
