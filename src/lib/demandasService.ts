import { supabase } from "./supabase";

export interface Demanda {
  id: string;
  title: string;
  priority: "urgent" | "high" | "normal";
  status: "open" | "resolved";
  created_by: string;
  assigned_to: string | null;
  created_at: string;
}

export interface DemandaMessage {
  id: string;
  demanda_id: string;
  author: string;
  content: string;
  created_at: string;
}

export async function fetchDemandas(): Promise<Demanda[]> {
  const { data, error } = await supabase
    .from("demandas")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createDemanda(
  demanda: Omit<Demanda, "id" | "created_at">
): Promise<Demanda> {
  const { data, error } = await supabase
    .from("demandas")
    .insert(demanda)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDemandaStatus(id: string, status: "open" | "resolved"): Promise<void> {
  const { error } = await supabase.from("demandas").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function fetchMessages(demandaId: string): Promise<DemandaMessage[]> {
  const { data, error } = await supabase
    .from("demanda_messages")
    .select("*")
    .eq("demanda_id", demandaId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function sendMessage(
  message: Omit<DemandaMessage, "id" | "created_at">
): Promise<DemandaMessage> {
  const { data, error } = await supabase
    .from("demanda_messages")
    .insert(message)
    .select()
    .single();
  if (error) throw error;
  return data;
}
