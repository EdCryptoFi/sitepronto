import { createClient } from '@supabase/supabase-js';

export const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  : null;

export const insertBriefing = async (data: any) => {
  if (!supabase) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      created_at: new Date().toISOString(),
    };
  }

  const { data: insertedData, error } = await supabase
    .from('briefings')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error('Error inserting briefing:', error);
    throw error;
  }

  return insertedData;
};

export const getBriefingById = async (id: string) => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('briefings')
    .select('id, segment, goal, palette, template, selected_modules, domain, domain_choice, payment_status, created_at')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
};

export const updatePaymentStatus = async (briefingId: string, status: 'pending' | 'approved' | 'rejected') => {
  if (!supabase) {
    return {
      id: briefingId,
      payment_status: status,
      updated_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from('briefings')
    .update({ 
      payment_status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', briefingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }

  return data;
};