/* One-time export utility. Run this BEFORE removing the old SQLite npm packages:
 * node scripts/export-sqlite-to-json.js backend/database.sqlite migration-data.json
 * It intentionally lives outside the application runtime and has no production dependency. */
const fs=require('fs'); const sqlite3=require('sqlite3'); const input=process.argv[2],output=process.argv[3]||'migration-data.json';
if(!input) throw new Error('Usage: node scripts/export-sqlite-to-json.js <sqlite-file> [output.json]');
const db=new sqlite3.Database(input); db.all("select name from sqlite_master where type='table' and name not like 'sqlite_%'",async(e,tables)=>{if(e)throw e;const result={};let left=tables.length;for(const {name} of tables)db.all(`select * from ${name}`,(err,rows)=>{if(err)throw err;result[name]=rows;if(!--left){fs.writeFileSync(output,JSON.stringify(result,null,2));db.close();console.log(`Exported ${Object.keys(result).length} tables to ${output}`)}})});
