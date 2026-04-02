import { supabase } from "./supabase";

export interface Club {
  id: string;
  name: string;
  plan: string;
  monthly_value: number;
  active_users: number;
  active_upsells: number;
  status: "active" | "inactive" | "trial";
  created_at: string;
  responsible: string;
}

export async function fetchClubs(): Promise<Club[]> {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addClub(club: Omit<Club, "id" | "created_at">): Promise<Club> {
  const { data, error } = await supabase
    .from("clubs")
    .insert(club)
    .select()
    .single();
  if (error) throw error;
  return data;
}
