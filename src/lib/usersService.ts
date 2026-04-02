import { supabase } from "./supabase";

export interface InternalUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  password: string;
  created_at: string;
}

export async function fetchInternalUsers(): Promise<InternalUser[]> {
  const { data, error } = await supabase
    .from("internal_users")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addInternalUser(
  user: Omit<InternalUser, "id" | "created_at">
): Promise<InternalUser> {
  const { data, error } = await supabase
    .from("internal_users")
    .insert(user)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeInternalUser(id: string): Promise<void> {
  const { error } = await supabase.from("internal_users").delete().eq("id", id);
  if (error) throw error;
}

export async function updateUserPassword(id: string, password: string): Promise<void> {
  const { error } = await supabase
    .from("internal_users")
    .update({ password })
    .eq("id", id);
  if (error) throw error;
}
