import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-muted to-background py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Welcome to My Digital Space
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Thoughts, ideas, and stories from a creative mind. Join me on this journey of exploration and discovery.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="px-8">
            Explore Posts
          </Button>
          <Button variant="outline" size="lg" className="px-8">
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
}
