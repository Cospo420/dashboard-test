import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export type Call = {
  id: string;
  call_id: string;
  call_type: string;
  from_number: string;
  to_number: string;
  duration: number;
  rating: number;
  appointment_booked: boolean;
  summary: string;
  start_time: string;
  end_time: string;
  sentiment: string;
  created_at: string;
};

// Initialize database if it doesn't exist
export const initializeDatabase = async () => {
  // Check if the calls table exists
  const { data: tablesData, error: tablesError } = await supabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public')
    .eq('tablename', 'calls');

  if (tablesError) {
    console.error('Error checking for tables:', tablesError);
    return;
  }

  // If the calls table doesn't exist, create it
  if (!tablesData || tablesData.length === 0) {
    // Create calls table
    const { error: createTableError } = await supabase.rpc('create_calls_table');
    
    if (createTableError) {
      console.error('Error creating calls table:', createTableError);
    } else {
      console.log('Calls table created successfully');
    }
  }
};

// Functions to interact with the database
export const storeCallData = async (callData: Omit<Call, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('calls')
    .insert([callData])
    .select();

  if (error) {
    console.error('Error storing call data:', error);
    return null;
  }

  return data?.[0] || null;
};

export const getCallsForTimeframe = async (days: number) => {
  const currentDate = new Date();
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - days);

  const { data, error } = await supabase
    .from('calls')
    .select('*')
    .gte('start_time', pastDate.toISOString())
    .lte('start_time', currentDate.toISOString())
    .order('start_time', { ascending: false });

  if (error) {
    console.error('Error fetching calls:', error);
    return [];
  }

  return data || [];
};