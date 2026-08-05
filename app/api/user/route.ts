// app/api/todos/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { issues } from '@/db/schema';

// GET request handler
export async function GET() {
  const todos = [
    { id: 1, text: 'Learn Next.js', completed: false },
    { id: 2, text: 'Build an app', completed: false },
  ];

  return NextResponse.json(todos);
}

// POST request handler
export async function POST(request: Request) {
  const data = await request.json();

  // Process the data (in a real app, you would save to a database)
  console.log('Received data:', data);

  return NextResponse.json(
    {
      message: 'Todo created successfully',
      todo: data,
    },
    { status: 201 },
  );
}

// Other HTTP methods you can implement:
// export async function PUT(request: Request) { ... }
// export async function DELETE(request: Request) { ... }
// export async function PATCH(request: Request) { ... }

// app/api/search/route.ts
// QUERY parameter example

export async function GETwithQueryParams(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '10';

  return NextResponse.json({
    message: `Searching for: ${query}`,
    limit: parseInt(limit),
  });
}

// POST with req body example
// app/api/submit/route.ts

export async function POSTwithBody(request: Request) {
  // Parse JSON body
  const body = await request.json();

  // Or for form data
  // const formData = await request.formData();
  // const name = formData.get('name');

  return NextResponse.json({
    received: body,
    success: true,
  });
}

// Dynamic API route example
// app/api/users/[id]/route.ts
// /api/users/123
export async function dynamicGET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  // In a real app, fetch user data from a database
  const userData = {
    id,
    name: 'John Doe',
    email: 'john@example.com',
  };

  return NextResponse.json(userData);
}

// CATCH-all api route example
// app/api/posts/[...slug]/route.ts
// //This handles requests like /api/posts/2023/01/hello-world
export async function catchAllGET(
  request: Request,
  { params }: { params: { slug: string[] } },
) {
  const slug = params.slug;

  return NextResponse.json({
    slug,
    message: `Handling route: /api/posts/${slug.join('/')}`,
  });
}

// Error handling example
// app/api/protected/route.ts
export async function GETwithTryCatch() {
  const headersList = headers();
  const token = headersList.get('authorization');

  if (!token || token !== 'Bearer valid-token') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Protected data or operations
    return NextResponse.json({ data: 'Protected content' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// CORS and Headers
// app/api/cors-example/route.ts
export async function GETwithCORS() {
  return NextResponse.json(
    { message: 'This endpoint supports CORS' },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    },
  );
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    },
  );
}

// CREATE routes
// /api/issue/route.ts
export async function GET_ISSUES() {
  try {
    const allIssues = await db.query.issues.findMany();
    return NextResponse.json(allIssues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 },
    );
  }
}

export async function POST_ISSUE(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.userId) {
      return NextResponse.json(
        { error: 'Title and userId are required' },
        { status: 400 },
      );
    }

    // Create the issue
    const newIssue = await db
      .insert(issues)
      .values({
        title: data.title,
        description: data.description || null,
        status: data.status || 'backlog',
        priority: data.priority || 'medium',
        userId: data.userId,
      })
      .returning();

    return NextResponse.json(
      { message: 'Issue created successfully', issue: newIssue[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json(
      { error: 'Failed to create issue' },
      { status: 500 },
    );
  }
}

// /app/api/issue/[id]/route.ts

export async function GET_ISSUE(
  request: Request,
  { params }: { params: { id: any } },
) {
  try {
    const id = params.id;

    const issue = await db.query.issues.findFirst({
      where: eq(issues.id, id),
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json(issue);
  } catch (error) {
    console.error('Error fetching issue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issue' },
      { status: 500 },
    );
  }
}
