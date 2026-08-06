import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { issues } from '@/db/schema';
import { revalidateTag } from 'next/cache';

// CREATE routes
// /api/issue/route.ts
export const GET = async (req: NextRequest) => {
  try {
    const allIssues = await db.query.issues.findMany({});
    return NextResponse.json(allIssues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 },
    );
  }
};

// const response = await fetch('/api/issues', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     title: 'Login issue',
//     description: 'Cannot sign in',
//     status: 'open',
//     priority: 'high',
//     userId: 'some-user-id',
//   }),
// });
// const result = await response.json();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const [newIssue] = await db
      .insert(issues)
      .values(body)
      .returning();

    revalidateTag('issues', { expire: 0 });
    return NextResponse.json({ data: newIssue }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'nah' }, { status: 500 });
  }
};
