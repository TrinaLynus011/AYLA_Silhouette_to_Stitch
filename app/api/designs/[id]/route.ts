import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch a specific design
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const design = await db.collection('designs').findOne({ _id: new ObjectId(params.id) });
    
    if (!design) {
      return NextResponse.json({ success: false, error: 'Design not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, design });
  } catch (error) {
    console.error('Error fetching design:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch design' }, { status: 500 });
  }
}

// PUT - Update a design
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    
    const result = await db.collection('designs').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          ...body, 
          updated_at: new Date() 
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Design not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating design:', error);
    return NextResponse.json({ success: false, error: 'Failed to update design' }, { status: 500 });
  }
}

// DELETE - Delete a design
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const result = await db.collection('designs').deleteOne({ _id: new ObjectId(params.id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Design not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting design:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete design' }, { status: 500 });
  }
}
