import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Search, Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <h1 className="text-2xl font-bold text-foreground hover:text-accent transition-colors">
                Weland Agrisols
              </h1>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className={`transition-colors ${
                location === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}>
                Home
              </Link>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Archive
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>
            <Link href="/create">
              <Button className="hidden sm:flex">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <a href="#" className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#" className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
                Archive
              </a>
              <a href="#" className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
              <Link href="/create">
                <Button className="mx-3 mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
