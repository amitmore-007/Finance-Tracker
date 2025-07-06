import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Proper typing for dynamic route parameters
interface DynamicParams {
  params: {
    id: string;
  };
}

export async function PUT(
  request: NextRequest,
  { params }: DynamicParams
): Promise<NextResponse> {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db('finance-tracker');

    const body = await request.json();
    const { amount, description, category, date, type } = body;

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
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: DynamicParams
): Promise<NextResponse> {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db('finance-tracker');

    const result = await db.collection('transactions').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const client = await clientPromise;
    const db = client.db('finance-tracker');
    
    const transactions = await db
      .collection('transactions')
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const client = await clientPromise;
    const db = client.db('finance-tracker');
    
    const body = await request.json();
    const { amount, description, category, date, type } = body;

    if (!amount || !description || !category || !date || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transaction = {
      amount: parseFloat(amount),
      description,
      category,
      date: new Date(date),
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('transactions').insertOne(transaction);
    
    return NextResponse.json(
      { ...transaction, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}