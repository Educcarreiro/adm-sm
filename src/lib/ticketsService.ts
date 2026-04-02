import { supabase } from "./supabase";

export interface Ticket {
  id: string;
  club_id: string;
  club_name: string;
  type: "support" | "bug" | "feature" | "upsell";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  responsible: string | null;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  author_name: string;
  author_role: "admin" | "client";
  content: string;
  created_at: string;
}

export async function fetchTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchTicketById(id: string): Promise<Ticket | null> {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchTicketMessages(ticketId: string): Promise<TicketMessage[]> {
  const { data, error } = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function sendTicketMessage(
  ticketId: string,
  authorName: string,
  content: string
): Promise<TicketMessage> {
  const { data, error } = await supabase
    .from("ticket_messages")
    .insert({
      ticket_id: ticketId,
      author_name: authorName,
      author_role: "admin",
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTicketStatus(
  id: string,
  status: Ticket["status"]
): Promise<void> {
  const { error } = await supabase
    .from("tickets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function updateTicketResponsible(
  id: string,
  responsible: string
): Promise<void> {
  const { error } = await supabase
    .from("tickets")
    .update({ responsible, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export function subscribeToTickets(onChange: () => void) {
  return supabase
    .channel("tickets_changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "tickets" }, onChange)
    .subscribe();
}

export function subscribeToTicketMessages(ticketId: string, onChange: () => void) {
  return supabase
    .channel(`messages_${ticketId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "ticket_messages", filter: `ticket_id=eq.${ticketId}` },
      onChange
    )
    .subscribe();
}
