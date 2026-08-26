import { createClient, type SupabaseClient, type User } from "npm:@supabase/supabase-js@2.112.3";

function required(name: string): string {
  const value = String(Deno.env.get(name) || "").trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function findUserByEmail(
  service: SupabaseClient,
  email: string
): Promise<User | null> {
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const found = data.users.find(user => String(user.email || "").toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (data.users.length < 1000) return null;
  }
  throw new Error("Admin lookup exceeded the supported page limit.");
}

const projectUrl = required("SUPABASE_URL");
const secretKey = required("SUPABASE_SECRET_KEY");
const adminEmail = required("HF_ADMIN_EMAIL").toLowerCase();
const adminPassword = required("HF_ADMIN_PASSWORD");
if (adminPassword.length < 16) throw new Error("HF_ADMIN_PASSWORD must be at least 16 characters.");

const service = createClient(projectUrl, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});

let user = await findUserByEmail(service, adminEmail);
if (!user) {
  const { data, error } = await service.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    app_metadata: { hf_role: "admin" }
  });
  if (error || !data.user) throw error || new Error("Admin account creation failed.");
  user = data.user;
} else {
  const { data, error } = await service.auth.admin.updateUserById(user.id, {
    app_metadata: { ...(user.app_metadata || {}), hf_role: "admin" }
  });
  if (error || !data.user) throw error || new Error("Admin role update failed.");
  user = data.user;
}

const { error: registryError } = await service.from("hf_admin_accounts").upsert({
  user_id: user.id,
  role: "admin",
  account_status: "active"
}, { onConflict: "user_id" });
if (registryError) throw registryError;

console.log(`Hyper Focus admin bootstrap complete: ${adminEmail} (${user.id})`);
console.log("Next required step: sign in as DOCSSAM and complete TOTP enrollment before using admin functions.");
