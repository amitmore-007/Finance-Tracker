// import { NextRequest, NextResponse } from 'next/server';
// import { MongoClient, ObjectId } from 'mongodb';

// const uri = process.env.MONGODB_URI;
// if (!uri) {
//   throw new Error('Please add your MongoDB URI to .env.local');
// }

// const client = new MongoClient(uri);

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await client.connect();
//     const db = client.db('finance-tracker');
//     const budget = await request.json();
    
//     const result = await db.collection('budgets').updateOne(
//       { _id: new ObjectId(params.id) },
//       { 
//         $set: {
//           ...budget,
//           updatedAt: new Date().toISOString()
//         }
//       }
//     );
    
//     if (result.matchedCount === 0) {
//       return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
//     }
    
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error updating budget:', error);
//     return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
//   } finally {
//     await client.close();
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await client.connect();
//     const db = client.db('finance-tracker');
    
//     const result = await db.collection('budgets').deleteOne({
//       _id: new ObjectId(params.id)
//     });
    
//     if (result.deletedCount === 0) {
//       return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
//     }
    
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error deleting budget:', error);
//     return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
//   } finally {
//     await client.close();
//   }
// }



