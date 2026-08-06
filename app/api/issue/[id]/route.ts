// /app/api/issue/[id]/route.ts

import { issues } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

// export async function GET_ISSUE(
//   request: Request,
//   { params }: { params: { id: any } },
// ) {
//   try {
//     const id = params.id;
//
//     const issue = await db.query.issues.findFirst({
//       where: eq(issues.id, id),
//     });
//
//     if (!issue) {
//       return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
//     }
//
//     return NextResponse.json(issue);
//   } catch (error) {
//     console.error('Error fetching issue:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch issue' },
//       { status: 500 },
//     );
//   }
// }

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const issue = await db.query.issues.findFirst({
      where: eq(issues.id, parseInt(id)),
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json({ data: issue });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'fetch failed' }, { status: 500 });
  }
};
