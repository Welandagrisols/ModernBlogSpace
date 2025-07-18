import { users, posts, comments, type User, type InsertUser, type Post, type InsertPost, type Comment, type InsertComment } from "@shared/schema";

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllPosts(): Promise<Post[]>;
  getPublishedPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  
  getCommentsByPostId(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private currentUserId: number;
  private currentPostId: number;
  private currentCommentId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.currentUserId = 1;
    this.currentPostId = 1;
    this.currentCommentId = 1;
    
    // Add some sample posts for demonstration
    this.initializeSamplePosts();
  }

  private initializeSamplePosts() {
    const samplePosts = [
      {
        title: "The Future of Web Development: Trends to Watch",
        excerpt: "Exploring the latest trends in web development, from AI integration to new frameworks that are reshaping how we build digital experiences.",
        content: "# The Future of Web Development: Trends to Watch\n\nWeb development is evolving at an unprecedented pace. From artificial intelligence integration to new frameworks that promise better performance and developer experience, the landscape is constantly shifting.\n\n## AI Integration\n\nArtificial intelligence is no longer a futuristic concept but a present reality in web development. Tools like GitHub Copilot and ChatGPT are already transforming how developers write code.\n\n## New Frameworks\n\nFrameworks like Astro, SvelteKit, and Next.js 13+ are pushing the boundaries of what's possible with web applications.",
        featuredImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tags: ["Technology", "Web Dev"],
        published: true,
      },
      {
        title: "Design Thinking: A Creative Approach to Problem Solving",
        excerpt: "How design thinking methodology can transform the way we approach challenges and create innovative solutions in any field.",
        content: "# Design Thinking: A Creative Approach to Problem Solving\n\nDesign thinking is more than just a methodology—it's a mindset that can revolutionize how we approach problems and create solutions.\n\n## The Five Stages\n\n1. **Empathize** - Understand your users\n2. **Define** - Frame the problem\n3. **Ideate** - Generate solutions\n4. **Prototype** - Build and test\n5. **Test** - Validate and iterate\n\nThis human-centered approach ensures that solutions are not just technically feasible but also desirable and viable.",
        featuredImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tags: ["Design", "Creativity"],
        published: true,
      },
      {
        title: "Finding Balance: Lessons from a Digital Detox",
        excerpt: "My journey of disconnecting from technology for a week and the surprising insights I gained about productivity and well-being.",
        content: "# Finding Balance: Lessons from a Digital Detox\n\nLast month, I decided to take a week-long break from all digital devices. What started as an experiment in mindfulness became a profound journey of self-discovery.\n\n## The Challenge\n\nIn our hyper-connected world, the idea of disconnecting completely seems almost impossible. Yet, the constant stream of notifications, emails, and social media updates was taking a toll on my mental health and productivity.\n\n## The Results\n\nAfter just three days, I noticed significant improvements in my sleep quality, focus, and overall well-being. The silence was initially uncomfortable, but it soon became a source of peace and clarity.",
        featuredImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tags: ["Lifestyle", "Wellness"],
        published: true,
      },
    ];

    samplePosts.forEach(post => {
      const id = this.currentPostId++;
      const slug = createSlug(post.title);
      const fullPost: Post = {
        id,
        slug,
        ...post,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.posts.set(id, fullPost);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getPublishedPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.published)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getPostById(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return Array.from(this.posts.values()).find(post => post.slug === slug);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const slug = createSlug(insertPost.title);
    const post: Post = {
      id,
      slug,
      ...insertPost,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, updates: Partial<InsertPost>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;

    const updatedPost: Post = {
      ...post,
      ...updates,
      updatedAt: new Date(),
    };

    if (updates.title && updates.title !== post.title) {
      updatedPost.slug = createSlug(updates.title);
    }

    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    const deleted = this.posts.delete(id);
    // Also delete associated comments
    Array.from(this.comments.entries()).forEach(([commentId, comment]) => {
      if (comment.postId === id) {
        this.comments.delete(commentId);
      }
    });
    return deleted;
  }

  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = {
      id,
      ...insertComment,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    return this.comments.delete(id);
  }
}

export const storage = new MemStorage();
