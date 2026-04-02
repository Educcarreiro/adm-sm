import { supabase } from "./supabase";

export interface Contract {
  id: string;
  club_name: string;
  plan: string;
  monthly_value: number;
  start_date: string;
  end_date: string;
  location: string;
  email: string;
  phone: string;
  upsells: string[];
  status: "active" | "pending" | "expired";
  created_at: string;
}

export async function fetchContracts(): Promise<Contract[]> {
  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addContract(
  contract: Omit<Contract, "id" | "created_at">
): Promise<Contract> {
  const { data, error } = await supabase
    .from("contracts")
    .insert(contract)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteContract(id: string): Promise<void> {
  const { error } = await supabase.from("contracts").delete().eq("id", id);
  if (error) throw error;
}
