// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../db/client';
import { usersTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { clerkId, name, email, imageUrl } = data; // include imageUrl

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkId));

    if (existingUser.length === 0) {
      // Insert new user
      await db.insert(usersTable).values({ clerkId, name, email, imageUrl });
      return NextResponse.json({ message: 'User created!' });
    } else {
      // Update existing user info
      await db
        .update(usersTable)
        .set({ name, email, imageUrl })
        .where(eq(usersTable.clerkId, clerkId));
      return NextResponse.json({ message: 'User updated!' });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
