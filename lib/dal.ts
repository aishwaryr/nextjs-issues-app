import { db } from '@/db';
import { getSession } from './auth';
import { eq } from 'drizzle-orm';
import { cache } from 'react';
import { issues, users } from '@/db/schema';
import { mockDelay } from './utils';
import { cacheTag } from 'next/cache';

// Current user
export const getCurrentUser = cache(async () => {
  await mockDelay(700);
  const session = await getSession();
  if (!session) return null;

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId));
    return result[0] || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
});

// Get user by email
// export const getUserByEmail = async (email: string) => {
//   try {
//     const result = await db
//       .select()
//       .from(users)
//       .where(eq(users.email, email))
//     return result[0] || null
//   } catch (error) {
//     console.error('Error getting user by email: ', error)
//     return null
//   }
// }

// no difference in above and below functions
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user ?? null;
  } catch (error) {
    console.error('Error getting user by email: ', error);
    return null;
  }
};

export const getIssues = async () => {
  'use cache';
  cacheTag('issues');
  try {
    await mockDelay(1000);
    // fix data leak, as currently returning all issues with whole user object
    const result = await db.query.issues.findMany({
      with: {
        user: true,
      },
      orderBy: (issues, { desc }) => [desc(issues.createdAt)],
    });
    return result;
  } catch (error) {
    console.error('Error fetching issues: ', error);
    throw new Error('Failed to fetch issues');
  }
};

export const getIssue = async (id: number) => {
  try {
    const issue = await db.query.issues.findFirst({
      where: eq(issues.id, id),
      with: { user: true },
    });
    return issue;
  } catch (error) {
    console.error(error);
    return null;
  }
};
