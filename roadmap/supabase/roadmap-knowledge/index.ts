import { createClient } from 'npm:@supabase/supabase-js@2.112.4';
import { createHandler } from './handler.mjs';
const url = Deno.env.get('SUPABASE_URL')!;
const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const service = createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
// verify_jwt=false: 관리자 JWT와 DOCSSAM 역할을 이 함수가 직접 확인한다(roadmap-members와 같은 방식).
Deno.serve(createHandler({service}));
