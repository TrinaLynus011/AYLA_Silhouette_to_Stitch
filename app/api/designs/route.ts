import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch all designs for a user
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const designs = await db.collection('designs').find({}).sort({ updated_at: -1 }).toArray();
    
    return NextResponse.json({ success: true, designs });
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch designs' }, { status: 500 });
  }
}

// POST - Create a new design
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    
    const design = {
      ...body,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await db.collection('designs').insertOne(design);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId.toString(),
      design: { ...design, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating design:', error);
    return NextResponse.json({ success: false, error: 'Failed to create design' }, { status: 500 });
  }
}
