import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT /api/transactions/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  console.log('Received PUT request');
  console.log('Params:', params);

  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db('finance-tracker');
    console.log('Connected to MongoDB');

    const body = await request.json();
    console.log('Request Body:', body);

    const { amount, description, category, date, type } = body;

    if (!amount || !description || !category || !date || !type) {
      console.warn('Validation failed: Missing fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await db.collection('transactions').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          amount: parseFloat(amount),
          description,
          category,
          date: new Date(date),
          type,
          updatedAt: new Date(),
        },
      }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

// DELETE /api/transactions/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  console.log('Received DELETE request');
  console.log('Params:', params);

  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db('finance-tracker');
    console.log('Connected to MongoDB');

    const result = await db.collection('transactions').deleteOne({
      _id: new ObjectId(id),
    });

    console.log('Delete result:', result);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
