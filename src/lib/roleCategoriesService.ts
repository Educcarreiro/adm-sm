import { supabase } from "./supabase";

export interface RoleCategory {
  id: string;
  name: string;
  created_at: string;
}

export async function fetchRoleCategories(): Promise<RoleCategory[]> {
  const { data, error } = await supabase
    .from("role_categories")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addRoleCategory(name: string): Promise<RoleCategory> {
  const { data, error } = await supabase
    .from("role_categories")
    .insert({ name })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeRoleCategory(id: string): Promise<void> {
  const { error } = await supabase.from("role_categories").delete().eq("id", id);
  if (error) throw error;
}
