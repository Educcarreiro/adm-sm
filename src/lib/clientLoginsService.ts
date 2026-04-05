import { supabase } from "./supabase";

export interface ClientLogin {
  id: string;
  club_id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
}

export async function fetchClientLogins(clubId: string): Promise<ClientLogin[]> {
  const { data, error } = await supabase
    .from("club_logins")
    .select("*")
    .eq("club_id", clubId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addClientLogin(
  login: Omit<ClientLogin, "id" | "created_at">
): Promise<ClientLogin> {
  const { data, error } = await supabase
    .from("club_logins")
    .insert(login)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeClientLogin(id: string): Promise<void> {
  const { error } = await supabase.from("club_logins").delete().eq("id", id);
  if (error) throw error;
}
