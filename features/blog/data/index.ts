import { source } from "@/lib/source";
import { Blog } from "../types/blog";

export function getAllBlogs(): Blog[] {
    const pages = source.getPages();
    
    return pages.map((page) => {
        const data = page.data as any;
        
        return {
            title: data.title || "",
            description: data.description || "",
            image: data.image,
            category: data.category,
            icon: data.icon,
            new: data.new || false,
            createdAt: data.date || data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || data.date || new Date().toISOString(),
            url: page.url,
        };
    });
}

export function getBlogBySlug(slug: string) {
    return source.getPage([slug]);
}

export function getRecentBlogs(limit: number = 5): Blog[] {
    const blogs = getAllBlogs();
    return blogs
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
}