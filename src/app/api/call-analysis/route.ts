import { NextResponse } from 'next/server';
import { getCallsForTimeframe } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Get the days parameter from the URL query string
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);

    // Get call data from Supabase
    const calls = await getCallsForTimeframe(days);

    // Process the call data for the dashboard
    const stats = calculateStats(calls);
    const volumeData = calculateVolumeData(calls, days);
    const recentCalls = formatRecentCalls(calls.slice(0, 10));
    const typeDistribution = calculateTypeDistribution(calls);
    const customerData = calculateCustomerData(calls);
    const securityData = calculateSecurityData(calls);
    const timeSeriesData = calculateTimeSeriesData(calls, days);

    return NextResponse.json({
      stats,
      volumeData,
      recentCalls,
      typeDistribution,
      customerData,
      securityData,
      timeSeriesData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing call analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions for data processing
function calculateStats(calls: any[]) {
  const totalCalls = calls.length;
  const appointmentsBooked = calls.filter(call => call.appointment_booked).length;
  
  // Calculate average duration
  const totalDuration = calls.reduce((sum, call) => sum + (call.duration || 0), 0);
  const averageDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;
  
  // Calculate average rating
  const totalRating = calls.reduce((sum, call) => sum + (call.rating || 0), 0);
  const averageRating = totalCalls > 0 ? totalRating / totalCalls : 0;
  
  // Calculate conversion rate (appointments booked / total calls)
  const conversionRate = totalCalls > 0 ? (appointmentsBooked / totalCalls) * 100 : 0;
  
  return {
    totalCalls,
    appointmentsBooked,
    averageDuration,
    averageRating,
    conversionRate: parseFloat(conversionRate.toFixed(2)),
  };
}

function calculateVolumeData(calls: any[], days: number) {
  const volumeData = [];
  const today = new Date();
  
  // Generate dates for the last 'days' days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    
    // Count calls for this date
    const callsForDate = calls.filter(call => {
      const callDate = new Date(call.start_time).toISOString().split('T')[0];
      return callDate === formattedDate;
    }).length;
    
    volumeData.push({
      date: formattedDate,
      calls: callsForDate,
    });
  }
  
  return volumeData;
}

function formatRecentCalls(calls: any[]) {
  return calls.map(call => ({
    ...call,
    formatted_start_time: new Date(call.start_time).toLocaleString(),
  }));
}

function calculateTypeDistribution(calls: any[]) {
  const types: Record<string, number> = {};
  
  // Count calls by type
  calls.forEach(call => {
    const type = call.call_type || 'unknown';
    types[type] = (types[type] || 0) + 1;
  });
  
  // Convert to array format for pie chart
  return Object.entries(types).map(([name, value]) => ({
    name,
    value,
  }));
}

function calculateCustomerData(calls: any[]) {
  // Calculate customer satisfaction (average rating as a percentage)
  const totalRating = calls.reduce((sum, call) => sum + (call.rating || 0), 0);
  const averageRating = calls.length > 0 ? totalRating / calls.length : 0;
  const satisfaction = parseFloat(((averageRating / 5) * 100).toFixed(2));
  
  // Calculate NPS (Net Promoter Score)
  // NPS is typically calculated based on a "How likely are you to recommend..." question
  // Here we'll simulate it based on ratings: 9-10 (4.5-5) are promoters, 7-8 (3.5-4.4) are passives, 0-6 (0-3.4) are detractors
  const promoters = calls.filter(call => call.rating >= 4.5).length;
  const passives = calls.filter(call => call.rating >= 3.5 && call.rating < 4.5).length;
  const detractors = calls.filter(call => call.rating < 3.5).length;
  
  const nps = calls.length > 0 ? 
    parseFloat((((promoters / calls.length) - (detractors / calls.length)) * 100).toFixed(2)) : 0;
  
  // Calculate first call resolution rate (simulated for demo purposes)
  // For this example, we'll consider appointments_booked as a proxy for resolution
  const firstCallResolution = calls.length > 0 ? 
    parseFloat(((calls.filter(call => call.appointment_booked).length / calls.length) * 100).toFixed(2)) : 0;
  
  return {
    satisfaction,
    nps,
    firstCallResolution,
  };
}

function calculateSecurityData(calls: any[]) {
  // For demonstration purposes, we'll simulate security/compliance data
  // In a real application, you would derive this from actual call transcripts or metadata
  
  // Compliance rate: percentage of calls that adhered to compliance guidelines
  const complianceRate = 98.5; // Fixed value for demo
  
  // Security issues: number of detected security concerns
  const securityIssues = Math.floor(calls.length * 0.02); // 2% of calls have issues
  
  // Data protection score: 1-10 rating
  const dataProtection = 9.2; // Fixed value for demo
  
  return {
    complianceRate,
    securityIssues,
    dataProtection,
  };
}

function calculateTimeSeriesData(calls: any[], days: number) {
  const timeSeriesData = [];
  const today = new Date();
  
  // Generate time series data for the last 'days' days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    
    // Get calls for this date
    const callsForDate = calls.filter(call => {
      const callDate = new Date(call.start_time).toISOString().split('T')[0];
      return callDate === formattedDate;
    });
    
    // Calculate metrics for this date
    const callCount = callsForDate.length;
    
    // Resolution rate (using appointment_booked as proxy)
    const resolutionRate = callCount > 0 ? 
      (callsForDate.filter(call => call.appointment_booked).length / callCount) * 100 : 0;
    
    // Satisfaction (average rating as percentage)
    const totalRating = callsForDate.reduce((sum, call) => sum + (call.rating || 0), 0);
    const averageRating = callCount > 0 ? totalRating / callCount : 0;
    const satisfaction = (averageRating / 5) * 100;
    
    // NPS calculation
    const promoters = callsForDate.filter(call => call.rating >= 4.5).length;
    const detractors = callsForDate.filter(call => call.rating < 3.5).length;
    const nps = callCount > 0 ? ((promoters / callCount) - (detractors / callCount)) * 100 : 0;
    
    // Security metrics (simulated)
    const complianceRate = 95 + Math.random() * 5; // Random between 95-100%
    const securityIssues = Math.floor(callCount * 0.03); // 3% of calls have issues
    
    timeSeriesData.push({
      name: formattedDate,
      resolutionRate: parseFloat(resolutionRate.toFixed(2)),
      calls: callCount,
      satisfaction: parseFloat(satisfaction.toFixed(2)),
      nps: parseFloat(nps.toFixed(2)),
      complianceRate: parseFloat(complianceRate.toFixed(2)),
      securityIssues,
    });
  }
  
  return timeSeriesData;
}