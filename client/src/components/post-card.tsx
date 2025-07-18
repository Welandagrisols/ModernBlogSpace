import { Link } from "wouter";
import { type Post } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const readingTime = Math.ceil(post.content.split(" ").length / 200);

  return (
    <Card className="bg-card hover:shadow-md transition-shadow duration-300 overflow-hidden border border-border">
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-6">
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <CalendarDays className="h-4 w-4 mr-1" />
          <time dateTime={post.createdAt ? new Date(post.createdAt).toISOString() : undefined}>
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
          </time>
          <span className="mx-2">•</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>{readingTime} min read</span>
        </div>
        
        <h4 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
          {post.title}
        </h4>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags && post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Link href={`/post/${post.slug}`} className="text-accent hover:text-accent/80 transition-colors font-medium text-sm">
            Read More
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
