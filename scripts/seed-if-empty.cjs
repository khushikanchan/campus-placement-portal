require('dotenv').config();
const {spawnSync}=require('node:child_process');
const {PrismaClient}=require('../generated/prisma');
const {PrismaPg}=require('@prisma/adapter-pg');
const db=new PrismaClient({adapter:new PrismaPg({connectionString:process.env.DATABASE_URL})});
(async()=>{try{if(await db.user.count()===0){const result=spawnSync(process.execPath,['node_modules/tsx/dist/cli.mjs','prisma/seed.ts'],{stdio:'inherit',env:process.env});if(result.status!==0)process.exitCode=result.status||1}}catch(e){console.error('Seed check failed:',e.message);process.exitCode=1}finally{await db.$disconnect()}})();
