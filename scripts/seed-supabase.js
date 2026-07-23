/* Creates Supabase Auth demo users and their linked public profiles. Run after schema.sql + seed.sql. */
require(require('path').join(__dirname, '../backend/node_modules/dotenv')).config({ path: require('path').join(__dirname, '../backend/.env') });
const { createClient } = require(require('path').join(__dirname, '../backend/node_modules/@supabase/supabase-js'));
const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SECRET_KEY;
if(!url||!key) throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY are required');
const db=createClient(url,key,{auth:{persistSession:false}});const email=u=>`${u}@users.primegenetics.local`;
const accounts=[
 ['admin','securepassword','admin'],['vet_john','password123','vet',{full_name:'Dr. John Doe',phone_number:'0711111111',county:'Nairobi',sub_county:'Westlands',latitude:-1.264,longitude:36.804,service_radius_km:50,service_fee:1500,verified:true,rating:4.5}],
 ['vet_jane','password123','vet',{full_name:'Dr. Jane Smith',phone_number:'0722222222',county:'Kiambu',sub_county:'Thika',latitude:-1.033,longitude:37.069,service_radius_km:50,service_fee:2000,verified:true,rating:4.5}],
 ['vet_peter','password123','vet',{full_name:'Dr. Peter Kamau',phone_number:'0733333333',county:'Nakuru',sub_county:'Naivasha',latitude:-.717,longitude:36.431,service_radius_km:50,service_fee:1800,verified:true,rating:4.5}],
 ['sup_agro','password123','agri-supplier',{business_name:'Agrovet Central',phone_number:'0744444444',address:'Nairobi CBD',latitude:-1.286,longitude:36.821}],
 ['sup_rift','password123','agri-supplier',{business_name:'Rift Valley Supplies',phone_number:'0755555555',address:'Nakuru Town',latitude:-.303,longitude:36.08}],
 ['sup_mt','password123','agri-supplier',{business_name:'Mt Kenya Genetics',phone_number:'0766666666',address:'Nyeri Center',latitude:-.416,longitude:36.951}]
];
(async()=>{for(const [username,password,role,profile] of accounts){let {data,error}=await db.auth.admin.createUser({email:email(username),password,email_confirm:true,user_metadata:{username,role}});if(error&& !/already been registered/i.test(error.message))throw error;let id=data.user?.id;if(!id){const r=await db.auth.admin.listUsers();id=r.data.users.find(u=>u.email===email(username))?.id}if(role==='admin')await db.from('users').update({role:'admin'}).eq('id',id);if(profile){const table=role==='vet'?'vets':'agri_suppliers';const {error:e}=await db.from(table).upsert({...profile,user_id:id},{onConflict:'user_id'});if(e)throw e}}console.log('Demo accounts seeded');})().catch(e=>{console.error(e);process.exitCode=1});
