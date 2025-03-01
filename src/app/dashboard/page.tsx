'use client';

import { useEffect, useState } from 'react';
import Dashboard from '@/components/dashboard';
import { createClient } from '@/lib/supabase';
import { Call } from '@/lib/supabase';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [callData, setCallData] = useState<Call[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCalls() {
      try {
        const { data, error } = await supabase
          .from('calls')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching calls:', error);
        } else {
          setCallData(data || []);
        }
      } catch (error) {
        console.error('Error in fetching calls:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCalls();

    // Set up real-time subscription for new calls
    const subscription = supabase
      .channel('calls_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'calls' }, 
        payload => {
          setCallData(prevData => [payload.new, ...prevData]);
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'calls' }, 
        payload => {
          setCallData(prevData => 
            prevData.map(call => call.id === payload.new.id ? payload.new : call)
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Retell AI Call Dashboard</h1>
      <Dashboard calls={callData} isLoading={loading} />
    </div>
  );
}