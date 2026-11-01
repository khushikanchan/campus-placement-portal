import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, EmploymentType, JobStatus, ApplicationStatus, InterviewMode } from "../generated/prisma/client";
import { scryptSync, randomBytes } from "node:crypto";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });
const hash = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
};
const departments = ["Computer Science", "Information Technology", "Electronics", "Mechanical Engineering", "Business Analytics"];
const studentNames = ["Aarav Mehta", "Isha Kapoor", "Rohan Das", "Mira Nair", "Kabir Singh", "Ananya Joshi", "Dev Shah", "Sana Ali", "Vikram Reddy", "Tara Menon", "Neil Kapoor", "Zoya Khan", "Arjun Bose", "Diya Iyer", "Ishaan Verma", "Meera Sethi", "Reyansh Jain", "Aditi Kulkarni", "Kian Dutta", "Sara Thomas"];
const companies = ["Northstar Labs", "Pixel & Co.", "Greenhouse Finance", "Orbit Systems", "BlueOak Technologies"];
const jobSpecs = [
  ["Product Design Intern", 0, EmploymentType.INTERNSHIP, 7.5, ["Figma", "User research", "Prototyping"]],
  ["Frontend Engineer", 1, EmploymentType.FULL_TIME, 7, ["React", "TypeScript", "CSS"]],
  ["Data Analyst", 2, EmploymentType.FULL_TIME, 7.5, ["SQL", "Python", "Data analysis"]],
  ["Associate Software Developer", 3, EmploymentType.FULL_TIME, 7, ["JavaScript", "SQL", "Git"]],
  ["Backend Developer", 4, EmploymentType.FULL_TIME, 7, ["Node.js", "PostgreSQL", "APIs"]],
  ["UX Research Intern", 0, EmploymentType.INTERNSHIP, 7, ["Figma", "Accessibility", "Research"]],
  ["QA Engineer", 1, EmploymentType.FULL_TIME, 7, ["Testing", "JavaScript", "Automation"]],
  ["Business Analyst", 2, EmploymentType.FULL_TIME, 7, ["SQL", "Data analysis", "Communication"]],
  ["Mobile App Intern", 3, EmploymentType.INTERNSHIP, 7, ["React Native", "Git", "JavaScript"]],
  ["Cloud Support Associate", 4, EmploymentType.FULL_TIME, 7, ["Linux", "Cloud", "Networking"]],
] as const;
const applicationStatuses = [ApplicationStatus.APPLIED, ApplicationStatus.UNDER_REVIEW, ApplicationStatus.SHORTLISTED, ApplicationStatus.INTERVIEW_SCHEDULED, ApplicationStatus.SELECTED, ApplicationStatus.REJECTED];

async function main() {
  const companyRows = await Promise.all(companies.map(name => db.company.upsert({where:{name},create:{name,industry:"Technology",location:"India",description:`${name} is a fictional campus recruiting partner.`},update:{}})));
  const recruiterIds: string[] = [];
  for (let i=0;i<companies.length;i++) {
    const email=i===0?"recruiter@campus.demo":`recruiter${i+1}@campus.demo`, name=["Priya Sharma","Ankit Rao","Nisha Paul","Farhan Khan","Lavanya Sen"][i];
    const user=await db.user.upsert({where:{email},create:{name,email,passwordHash:hash("Recruiter123!"),role:Role.RECRUITER},update:{name,role:Role.RECRUITER}});
    const profile=await db.recruiterProfile.upsert({where:{userId:user.id},create:{userId:user.id,companyId:companyRows[i].id,designation:"Campus Recruiter",verifiedAt:new Date()},update:{companyId:companyRows[i].id}});recruiterIds.push(profile.id);
  }
  const tpo=await db.user.upsert({where:{email:"tpo@campus.demo"},create:{name:"Dr. Kavita Rao",email:"tpo@campus.demo",passwordHash:hash("Tpo123!"),role:Role.TPO},update:{role:Role.TPO}});
  await db.tPOProfile.upsert({where:{userId:tpo.id},create:{userId:tpo.id,title:"Training and Placement Officer"},update:{}});
  const students=[];
  for(let i=0;i<studentNames.length;i++){
    const email=i===0?"student@campus.demo":i===1?"isha@campus.demo":`student${i+1}@campus.demo`;
    const user=await db.user.upsert({where:{email},create:{name:studentNames[i],email,passwordHash:hash("Student123!"),role:Role.STUDENT},update:{name:studentNames[i],role:Role.STUDENT}});
    const profile=await db.studentProfile.upsert({where:{userId:user.id},create:{userId:user.id,rollNumber:`CPP${String(22001+i).slice(-5)}`,college:"Campus University",department:departments[i%departments.length],course:"Bachelor's Degree",graduationYear:2026,cgpa:7.1+(i%29)/10},update:{department:departments[i%departments.length],graduationYear:2026}});students.push(profile);
  }
  const jobs=[];
  for(let i=0;i<jobSpecs.length;i++){
    const [title,companyIndex,employmentType,minimumCgpa,skills]=jobSpecs[i];
    const row=await db.job.findFirst({where:{title,companyId:companyRows[companyIndex].id}});
    const data={recruiterId:recruiterIds[companyIndex],companyId:companyRows[companyIndex].id,title,description:`Join ${companies[companyIndex]} to work on real products with a supportive team and structured mentorship.`,location:["Bengaluru · Hybrid","Remote · India","Mumbai · On-site","Pune · Hybrid"][i%4],employmentType,salaryMin:employmentType===EmploymentType.INTERNSHIP?30000:600000,salaryMax:employmentType===EmploymentType.INTERNSHIP?35000:1200000,vacancies:2+i%5,minimumCgpa,graduationYear:2026,deadline:new Date(Date.UTC(2026,11,10+i)),status:JobStatus.PUBLISHED,publishedAt:new Date()};
    const job=row?await db.job.update({where:{id:row.id},data}):await db.job.create({data:{...data,skills:{create:skills.map(name=>({required:true,skill:{connectOrCreate:{where:{name},create:{name}}}}))},eligibility:{create:{departments:[departments[0],departments[1]],courses:["Bachelor's Degree"],graduationYear:2026,minimumCgpa}}}});jobs.push(job);
  }
  const apps=[];
  for(let i=0;i<30;i++){
    const student=students[i%students.length],job=jobs[Math.floor(i/3)%jobs.length],status=applicationStatuses[i%applicationStatuses.length];
    const app=await db.application.upsert({where:{studentId_jobId:{studentId:student.id,jobId:job.id}},create:{studentId:student.id,jobId:job.id,status,appliedAt:new Date(Date.UTC(2026,9,1+i%28))},update:{status}});apps.push(app);
    await db.applicationStatusHistory.create({data:{applicationId:app.id,status,note:"Fictional seed status"}});
  }
  for(let i=0;i<10;i++){
    const app=apps[i],job=jobs.find(j=>j.id===app.jobId)!;
    await db.interview.create({data:{applicationId:app.id,jobId:job.id,roundName:["Technical interview","Portfolio conversation","HR conversation"][i%3],scheduledAt:new Date(Date.UTC(2026,10,4+i,10+i%5,30)),mode:i%2?InterviewMode.ONLINE:InterviewMode.OFFLINE,meetingUrl:i%2?"https://meet.example.test/campus":null,location:i%2?null:"Placement cell, Room 204",instructions:"Fictional demo interview; join five minutes early."}});
  }
  const announcement=await db.announcement.findFirst({where:{title:"Placement readiness week"}});
  if(!announcement)await db.announcement.create({data:{authorId:tpo.id,title:"Placement readiness week",body:"Resume reviews and mock interviews are open for all final-year students.",publishedAt:new Date(),audienceDepartments:[]}});
  console.log(`Seeded ${students.length} students, ${companies.length} recruiters/companies, ${jobs.length} jobs, ${apps.length} applications and 10 interviews.`);
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>db.$disconnect());
