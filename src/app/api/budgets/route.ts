import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db('finance-tracker');
    
    // Get budgets
    const budgets = await db.collection('budgets').find({}).toArray();
    
    // Calculate spent amounts from transactions
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await db.collection('transactions').aggregate([
          {
            $match: {
              category: budget.category,
              type: 'expense',
              date: {
                $gte: new Date(budget.year, budget.month - 1, 1).toISOString(),
                $lt: new Date(budget.year, budget.month, 1).toISOString()
              }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]).toArray();
        
        return {
          ...budget,
          spent: spent.length > 0 ? spent[0].total : 0
        };
      })
    );
    
    return NextResponse.json(budgetsWithSpent);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db('finance-tracker');
    const budget = await request.json();
    
    // Check if budget already exists for this category/month/year
    const existing = await db.collection('budgets').findOne({
      category: budget.category,
      month: budget.month,
      year: budget.year
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'Budget already exists for this category and month' },
        { status: 400 }
      );
    }
    
    const result = await db.collection('budgets').insertOne({
      ...budget,
      period: 'monthly',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ _id: result.insertedId, ...budget });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  } finally {
    await client.close();
  }
}
      