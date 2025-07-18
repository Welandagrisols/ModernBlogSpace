import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { type Post } from "@shared/schema";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MarkdownRenderer from "@/components/markdown-renderer";
import Comments from "@/components/comments";
import SocialShare from "@/components/social-share";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";

export default function PostPage() {
  const { slug } = useParams();
  
  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ["/api/posts", slug],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded mb-8 w-1/2"></div>
            <div className="h-64 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Post not found</h1>
            <p className="text-muted-foreground">The post you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const readingTime = Math.ceil(post.content.split(" ").length / 200);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <time dateTime={post.createdAt ? new Date(post.createdAt).toISOString() : undefined}>
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
              </time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
            />
          )}
        </header>
        
        <div className="prose prose-lg max-w-none mb-12">
          <MarkdownRenderer content={post.content} />
        </div>
        
        <div className="border-t border-border pt-8 mb-8">
          <h3 className="text-lg font-semibold mb-4">Share this post</h3>
          <SocialShare
            title={post.title}
            url={window.location.href}
            excerpt={post.excerpt}
          />
        </div>
        
        <Comments postId={post.id} />
      </article>
      
      <Footer />
    </div>
  );
}
