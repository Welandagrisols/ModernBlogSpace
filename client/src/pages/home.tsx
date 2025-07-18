import { useQuery } from "@tanstack/react-query";
import { type Post } from "@shared/schema";
import Header from "@/components/header";
import Hero from "@/components/hero";
import PostCard from "@/components/post-card";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";

export default function Home() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold text-foreground">Recent Posts</h3>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl shadow-sm border border-border p-6">
                  <div className="h-48 bg-muted rounded-lg mb-4 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded mb-2 animate-pulse"></div>
                  <div className="h-6 bg-muted rounded mb-3 animate-pulse"></div>
                  <div className="h-16 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts available yet. Create your first post!</p>
            </div>
          )}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
