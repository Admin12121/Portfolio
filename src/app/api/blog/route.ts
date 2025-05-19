import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUserFromToken } from "@/helper/user";

const BlogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(10),
  content: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = body.data;

    if (!data || !data.title || !data.content) {
      return NextResponse.json(
        { error: "Missing required fields: title or content" },
        { status: 400 }
      );
    }

    const generateSlug = (title: string): string => {
      const randomString = Math.random().toString(36).substring(2, 12);
      const sanitizedTitle = title.toLowerCase().replace(/\s+/g, "-");
      const createdDate = new Date().toISOString().split("T")[0];
      const slug = `${sanitizedTitle}-${randomString}-${createdDate}`;
      return slug.substring(0, Math.min(slug.length, 50));
    };

    data.slug = generateSlug(data.title);

    const authorizationHeader = request.headers.get("authorization");
    if (!authorizationHeader) {
      return NextResponse.json(
        { error: "Authorization header is missing" },
        { status: 401 }
      );
    }

    const token = authorizationHeader.replace(/^Bearer\s+/i, "");
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!user.id) {
      return NextResponse.json(
        { error: "User not found or unauthorized" },
        { status: 403 }
      );
    }

    const blog = await db.blog.create({
      data: {
        title: data.title,
        content: data.content,
        slug: data.slug,
        userId: user.id,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50); // max 50 per page
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";

    const sort = searchParams.get("sort") || "createdAt";
    const order = (searchParams.get("order") || "desc").toLowerCase() === "asc" ? "asc" : "desc";

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await db.blog.count({ where });

    const blogs = await db.blog.findMany({
      where,
      orderBy: { [sort]: order },
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    return NextResponse.json({
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const data = body.data;
    const authorizationHeader = request.headers.get("authorization");
    if (!data || !authorizationHeader) {
      return NextResponse.json(
        { error: "Missing data or authorization header" },
        { status: 400 }
      );
    }

    const token = authorizationHeader.replace(/^Bearer\s+/i, "");
    const user = await getUserFromToken(token);

    if (!user?.id) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!data.id) {
      return NextResponse.json(
        { error: "Missing blog id" },
        { status: 400 }
      );
    }

    // Only allow updating fields defined in BlogSchema (except slug)
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.content) updateData.content = data.content;

    // Optionally, regenerate slug if title changes
    if (data.title) {
      const randomString = Math.random().toString(36).substring(2, 12);
      const sanitizedTitle = data.title.toLowerCase().replace(/\s+/g, "-");
      const createdDate = new Date().toISOString().split("T")[0];
      updateData.slug = `${sanitizedTitle}-${randomString}-${createdDate}`.substring(0, 50);
    }

    // Ensure user owns the blog
    const existing = await db.blog.findUnique({
      where: { id: data.id },
      select: { userId: true }
    });
    
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to update this blog" },
        { status: 403 }
      );
    }

    const updated = await db.blog.update({
      where: { id: data.id },
      data: updateData,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const authorizationHeader = request.headers.get("authorization");
    if (!id || !authorizationHeader) {
      return NextResponse.json(
        { error: "Missing blog id or authorization header" },
        { status: 400 }
      );
    }

    const token = authorizationHeader.replace(/^Bearer\s+/i, "");
    const user = await getUserFromToken(token);

    if (!user?.id) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Ensure user owns the blog
    const existing = await db.blog.findUnique({
      where: { id },
      select: { userId: true }
    });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this blog" },
        { status: 403 }
      );
    }

    await db.blog.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}