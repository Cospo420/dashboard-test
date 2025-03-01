import { NextResponse } from 'next/server';
import { storeCallData } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const webhookData = await req.json();
    console.log('Received webhook data:', webhookData);

    // Verify the webhook is from Retell (you may want to add more security here)
    if (!webhookData || !webhookData.call_id) {
      return NextResponse.json(
        { error: 'Invalid webhook data' },
        { status: 400 }
      );
    }

    // Process the call data
    const callData = {
      call_id: webhookData.call_id,
      call_type: webhookData.call_type || 'unknown',
      from_number: webhookData.from_number || 'unknown',
      to_number: webhookData.to_number || 'unknown',
      duration: webhookData.duration || 0,
      rating: webhookData.rating || 0,
      appointment_booked: webhookData.appointment_booked || false,
      summary: webhookData.summary || '',
      start_time: webhookData.start_time || new Date().toISOString(),
      end_time: webhookData.end_time || new Date().toISOString(),
      sentiment: webhookData.sentiment || 'neutral',
    };

    // Store the call data in Supabase
    const storedData = await storeCallData(callData);

    if (!storedData) {
      return NextResponse.json(
        { error: 'Failed to store call data' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Call data received and stored', id: storedData.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}