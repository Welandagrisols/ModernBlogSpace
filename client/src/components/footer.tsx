import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-2xl font-bold mb-4">BlogSpace</h4>
            <p className="text-muted mb-6 max-w-md">
              A space for sharing thoughts, ideas, and stories that inspire and educate. Join our community of curious minds.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted hover:text-background transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted hover:text-background transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted hover:text-background transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted hover:text-background transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-muted">
              <li><a href="#" className="hover:text-background transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-background transition-colors">About</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Archive</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Categories</h5>
            <ul className="space-y-2 text-muted">
              <li><a href="#" className="hover:text-background transition-colors">Technology</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Design</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Lifestyle</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Travel</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-muted mt-12 pt-8 text-center text-muted">
          <p>&copy; 2024 BlogSpace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
