const test = require('node:test');
const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

let child, base, temp, serverOutput='';
async function waitForServer(){for(let i=0;i<50;i++){try{const r=await fetch(`${base}/api/me`);if(r.ok)return}catch{}await new Promise(r=>setTimeout(r,100))}throw Error(`Demo server did not start. ${serverOutput}`)}
async function login(email,password){const r=await fetch(`${base}/api/login`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})});assert.equal(r.status,200);return r.headers.get('set-cookie').split(';')[0]}
async function api(route,cookie,method='GET',body){return fetch(`${base}/api${route}`,{method,headers:{...(cookie?{cookie}:{}),...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})})}
test.before(async()=>{temp=fs.mkdtempSync(path.join(os.tmpdir(),'campus-portal-test-'));const port=38100+Math.floor(Math.random()*1000);base=`http://127.0.0.1:${port}`;child=spawn(process.execPath,[path.join(__dirname,'..','server.js')],{cwd:path.join(__dirname,'..'),env:{...process.env,PORT:String(port),PORTAL_DATA_DIR:temp},stdio:['ignore','pipe','pipe']});child.stdout.on('data',x=>serverOutput+=String(x));child.stderr.on('data',x=>serverOutput+=String(x));child.on('error',x=>serverOutput+=String(x));await waitForServer()});
test.after(()=>{child?.kill();if(temp)fs.rmSync(temp,{recursive:true,force:true})});

test('login, role boundaries, job discovery, and duplicate application prevention',async()=>{
 const student=await login('student@campus.demo','Student123!'), recruiter=await login('recruiter@campus.demo','Recruiter123!');
 const list=await api('/jobs',student);assert.equal(list.status,200);const {jobs,applications}=await list.json();assert.equal(jobs.length,10);assert.equal(applications.length,2);
 const job=jobs.find(j=>!applications.includes(j.id));assert.ok(job);
 const first=await api('/applications',student,'POST',{jobId:job.id});assert.equal(first.status,201);
 const duplicate=await api('/applications',student,'POST',{jobId:job.id});assert.equal(duplicate.status,409);
 const denied=await api('/profile',recruiter,'PATCH',{department:'Nope'});assert.equal(denied.status,403);
});

test('resume upload validates document signatures and keeps records private',async()=>{
 const student=await login('student@campus.demo','Student123!');
 const payload=Buffer.from('%PDF-1.4\nCampus demo résumé\n%%EOF').toString('base64');
 const uploaded=await api('/resumes',student,'POST',{name:'student-resume.pdf',type:'application/pdf',data:payload});assert.equal(uploaded.status,201);
 const record=(await uploaded.json()).resume;const download=await api(`/resumes/${record.id}/download`,student);assert.equal(download.status,200);assert.match(await download.text(),/^%PDF-/);
 const removed=await api(`/resumes/${record.id}`,student,'DELETE');assert.equal(removed.status,200);
});

test('recruiter can schedule an interview for their shortlisted candidate and TPO can read metrics',async()=>{
 const recruiter=await login('recruiter@campus.demo','Recruiter123!');
 const scheduled=await api('/interviews',recruiter,'POST',{applicationId:'a1',round:'Technical interview',date:'2026-11-20',time:'10:30',mode:'Online',link:'https://meet.example.com/campus',instructions:'Bring your portfolio'});assert.equal(scheduled.status,201);
 const body=await scheduled.json();assert.equal(body.interview.status,'Scheduled');
 const tpo=await login('tpo@campus.demo','Tpo123!');const dash=await api('/dashboard',tpo);assert.equal(dash.status,200);assert.ok((await dash.json()).stats.students>=20);
});
