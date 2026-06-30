import { NextResponse } from 'next/server';

export async function GET(req) {
  // Ye simple response bhejega browser pe check karne ke liye
  return NextResponse.json({
    success: true,
    message: "hello paym,enr sms",
    status: "API is working perfectly!"
  });
}