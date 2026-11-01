const projectKey = process.env.JIRA_PROJECT_KEY || 'CPP';
const epics = [
  'Authentication and User Management','Student Profile and Resume Management','Job Posting and Discovery','Job Application and Tracking','Interview Scheduling','TPO Dashboard and Placement Analytics','Notifications and Announcements','Testing, Security and Deployment'
];
const stories = [
  ['As a student, I want to register and log in so that I can access the portal.','Highest',5,0,'Unique email creates a student account; invalid values are rejected; login establishes a session; public registration cannot grant TPO.'],
  ['As a student, I want to create and update my profile so recruiters can view my qualifications.','High',5,1,'Student can update academic details and skills; server validates fields; other students cannot modify this profile.'],
  ['As a student, I want to upload my résumé so recruiters can review it.','Highest',5,1,'Accept PDF/DOC/DOCX within size limit; reject invalid type; owner downloads or removes; access checks are enforced.'],
  ['As a recruiter, I want to create and publish job posts so eligible students can apply.','Highest',8,2,'Required fields validate; recruiter sees only own roles; published roles appear in student discovery.'],
  ['As a student, I want to browse and filter jobs so I can find suitable opportunities.','High',5,2,'Search title, company, skills; filters apply; reset and no-results states work.'],
  ['As a student, I want to apply for jobs so recruiters can consider me.','Highest',8,3,'Eligible student submits once; duplicate is rejected; confirmation and application date are visible.'],
  ['As a student, I want to track application status so I know my progress.','Highest',5,3,'Only own applications are visible; status history is chronological; current status is prominent.'],
  ['As a recruiter, I want to review applicants and shortlist candidates.','High',8,3,'Recruiter sees applicants to own roles; can filter and update status; student receives an update.'],
  ['As a recruiter, I want to schedule interviews for shortlisted candidates.','High',8,4,'Only own shortlisted applicants can be scheduled; date, mode and location/link validate; student is notified.'],
  ['As a student, I want interview notifications so I do not miss conversations.','High',5,6,'Schedule, reschedule and cancellation appear in unread list with time and application context.'],
  ['As a TPO, I want to view student placement status so I can monitor campus progress.','Highest',8,5,'TPO sees student status; department/year filters apply; unauthorized users are denied.'],
  ['As a TPO, I want to generate placement reports so I can analyze outcomes.','High',8,5,'Totals match filtered records; CSV has headings; empty report is handled.'],
  ['As a TPO, I want to manage recruiter accounts so only trusted recruiters post jobs.','Medium',5,0,'TPO sees verification state; approval actions are audited; recruiter cannot change verification.'],
  ['As a student, I want application update notifications so I can respond promptly.','Medium',3,6,'Status transition creates unread notification; timestamp and context appear; mark-all-read works.'],
  ['As a TPO, I want to publish placement announcements for students.','Medium',5,6,'TPO publishes validated notice; target audience receives it; author and date are recorded.'],
];
const sprints = [
  {name:'Campus Placement Portal - Sprint 1',goal:'Develop the foundation of the Campus Placement Portal by implementing authentication, student profile management, résumé upload, job posting, and initial job discovery functionality.',ids:[1,2,3,4,5]},
  {name:'Campus Placement Portal - Sprint 2',goal:'Complete application tracking, interview scheduling, TPO placement monitoring, notifications, testing, and deployment preparation.',ids:[6,7,8,9,10,11,12,13,14,15]},
];

const dryRun = !process.argv.includes('--apply');
if (dryRun) {
  console.log(`Dry run: would create ${epics.length} epics, ${stories.length} stories and ${sprints.length} sprints in ${projectKey}.`);
  console.log('To make live Jira changes, set JIRA_BASE_URL, JIRA_EMAIL and JIRA_API_TOKEN, then pass --apply.');
  process.exit(0);
}
const {JIRA_BASE_URL,JIRA_EMAIL,JIRA_API_TOKEN}=process.env;
if(!JIRA_BASE_URL||!JIRA_EMAIL||!JIRA_API_TOKEN)throw Error('Set JIRA_BASE_URL, JIRA_EMAIL and JIRA_API_TOKEN before --apply.');
const base=JIRA_BASE_URL.replace(/\/$/,''), auth='Basic '+Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
async function request(route,method='GET',data){const response=await fetch(base+route,{method,headers:{Authorization:auth,Accept:'application/json','Content-Type':'application/json'},...(data?{body:JSON.stringify(data)}:{})});const text=await response.text();let result;try{result=text?JSON.parse(text):{}}catch{result={raw:text}}if(!response.ok)throw Error(`${method} ${route}: ${response.status} ${JSON.stringify(result)}`);return result}
const adf=text=>({version:1,type:'doc',content:[{type:'paragraph',content:[{type:'text',text}]}]});
const self=await request('/rest/api/3/myself');
let project;
try{project=await request(`/rest/api/3/project/${projectKey}`)}catch{project=await request('/rest/api/3/project','POST',{key:projectKey,name:'Campus Placement Portal',projectTypeKey:'software',projectTemplateKey:'com.pyxis.greenhopper.jira:gh-scrum-template',leadAccountId:self.accountId,assigneeType:'PROJECT_LEAD'})}
const issueTypes=project.issueTypes|| (await request(`/rest/api/3/project/${projectKey}`)).issueTypes;
const epicType=issueTypes.find(x=>x.name.toLowerCase()==='epic'),storyType=issueTypes.find(x=>x.name.toLowerCase()==='story');
if(!epicType||!storyType)throw Error('Project did not expose Epic and Story issue types.');
const priorityRows=await request('/rest/api/3/priority');
const epicKeys=[];
for(let i=0;i<epics.length;i++){const created=await request('/rest/api/3/issue','POST',{fields:{project:{key:projectKey},summary:epics[i],issuetype:{id:epicType.id},...(process.env.JIRA_EPIC_NAME_FIELD?{[process.env.JIRA_EPIC_NAME_FIELD]:epics[i]}:{customfield_10011:epics[i]})}});epicKeys.push(created.key);console.log(`Created ${created.key}: ${epics[i]}`)}
const storyKeys=[];
for(let i=0;i<stories.length;i++){const [summary,priority,points,epicIndex,criteria]=stories[i];const priorityRow=priorityRows.find(x=>x.name.toLowerCase()===priority.toLowerCase());const fields={project:{key:projectKey},summary,description:adf(`Acceptance criteria: ${criteria}`),issuetype:{id:storyType.id},priority:priorityRow?{id:priorityRow.id}:undefined,parent:{key:epicKeys[epicIndex]}};const pointsField=process.env.JIRA_STORY_POINTS_FIELD||'customfield_10016';fields[pointsField]=points;const created=await request('/rest/api/3/issue','POST',{fields});storyKeys.push(created.key);console.log(`Created ${created.key}: ${summary}`)}
const filters=await request('/rest/api/3/filter','POST',{name:'Campus Placement Portal board filter',jql:`project = ${projectKey} ORDER BY Rank`,favourite:true});
const board=await request('/rest/agile/1.0/board','POST',{name:'Campus Placement Portal Scrum',type:'scrum',filterId:filters.id});
const now=new Date(),twoWeeks=new Date(now);twoWeeks.setDate(now.getDate()+14);const nextStart=new Date(twoWeeks);nextStart.setDate(nextStart.getDate()+1);const nextEnd=new Date(nextStart);nextEnd.setDate(nextStart.getDate()+13);
const sprint1=await request(`/rest/agile/1.0/board/${board.id}/sprint`,'POST',{name:sprints[0].name,goal:sprints[0].goal,startDate:now.toISOString(),endDate:twoWeeks.toISOString(),originBoardId:board.id});
const sprint2=await request(`/rest/agile/1.0/board/${board.id}/sprint`,'POST',{name:sprints[1].name,goal:sprints[1].goal,startDate:nextStart.toISOString(),endDate:nextEnd.toISOString(),originBoardId:board.id});
for(const [sprint,indexes] of [[sprint1,sprints[0].ids],[sprint2,sprints[1].ids]])await request(`/rest/agile/1.0/sprint/${sprint.id}/issue`,'POST',{issues:indexes.map(n=>storyKeys[n-1])});
await request(`/rest/agile/1.0/sprint/${sprint1.id}`,'PUT',{state:'active',startDate:now.toISOString(),endDate:twoWeeks.toISOString()});
console.log(`Confirmed project ${projectKey}, board ${board.id}, sprints ${sprint1.id}/${sprint2.id}. Stories are unassigned because no real teammate account IDs were provided.`);
