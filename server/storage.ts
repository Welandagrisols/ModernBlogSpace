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
        title: "Sustainable Soil Management: Building Long-Term Farm Productivity",
        excerpt: "Essential strategies for maintaining soil health while maximizing crop yields through sustainable farming practices and modern soil science.",
        content: "# Sustainable Soil Management: Building Long-Term Farm Productivity\n\nSoil health is the foundation of successful agriculture. Modern farming practices must balance immediate productivity needs with long-term sustainability to ensure profitable operations for generations to come.\n\n## Understanding Soil Health\n\nHealthy soil is a living ecosystem that supports plant growth through proper nutrient cycling, water retention, and biological activity. Key indicators include:\n\n- **Organic matter content** - Aim for 3-5% in most agricultural soils\n- **pH balance** - Optimal range varies by crop but generally 6.0-7.0\n- **Nutrient availability** - NPK ratios tailored to specific crop requirements\n- **Microbial activity** - Essential for nutrient cycling and disease suppression\n\n## Best Practices for Soil Conservation\n\n1. **Cover Crops** - Protect soil during off-seasons and add organic matter\n2. **Crop Rotation** - Prevent nutrient depletion and break pest cycles\n3. **Reduced Tillage** - Minimize soil disturbance to preserve structure\n4. **Precision Fertilization** - Apply nutrients based on soil testing results\n\n## Economic Benefits\n\nInvesting in soil health provides measurable returns through reduced input costs, improved water efficiency, and increased crop resilience to weather extremes.",
        featuredImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tags: ["Soil Health", "Sustainability"],
        published: true,
      },
      {
        title: "Precision Agriculture: Technology-Driven Farming Solutions",
        excerpt: "How GPS-guided equipment, soil sensors, and data analytics are revolutionizing modern farming operations for better yields and efficiency.",
        content: "# Precision Agriculture: Technology-Driven Farming Solutions\n\nPrecision agriculture represents a paradigm shift from traditional farming methods, leveraging technology to optimize every aspect of crop production.\n\n## Core Technologies\n\n### GPS and Auto-Guidance Systems\n- Reduce overlap and improve field efficiency\n- Enable accurate field mapping and record keeping\n- Support variable rate applications\n\n### Soil and Crop Sensors\n- Real-time monitoring of soil moisture and nutrients\n- Early detection of pest and disease pressure\n- Automated irrigation scheduling\n\n### Data Analytics and Farm Management Software\n- Integration of multiple data sources\n- Predictive modeling for yield forecasting\n- Financial analysis and profitability tracking\n\n## Implementation Strategy\n\n1. **Start Small** - Begin with one field or crop type\n2. **Focus on Data Quality** - Ensure accurate calibration and maintenance\n3. **Training and Support** - Invest in operator education\n4. **Gradual Expansion** - Scale up based on proven results\n\n## ROI Considerations\n\nWhile initial investment can be substantial, precision agriculture typically pays for itself through:\n- Reduced input costs (seeds, fertilizer, pesticides)\n- Improved yields through optimized management\n- Better record keeping for compliance and certification\n- Enhanced decision-making capabilities",
        featuredImage: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tags: ["Technology", "Precision Agriculture"],
        published: true,
      },
      {
        title: "Crop Rotation Strategies for Maximum Profitability",
        excerpt: "Planning effective crop rotations that improve soil health, reduce pest pressure, and optimize farm income across multiple growing seasons.",
        content: "# Crop Rotation Strategies for Maximum Profitability\n\nWell-planned crop rotations are fundamental to sustainable and profitable farming operations. They provide multiple benefits that extend far beyond simple crop diversification.\n\n## Benefits of Crop Rotation\n\n### Soil Health Improvement\n- Different crops have varying nutrient requirements\n- Legumes fix nitrogen for subsequent crops\n- Diverse root systems improve soil structure\n- Organic matter content increases over time\n\n### Pest and Disease Management\n- Breaks pest life cycles naturally\n- Reduces herbicide resistance development\n- Decreases disease pressure buildup\n- Minimizes need for chemical interventions\n\n### Economic Advantages\n- Spreads market risk across multiple crops\n- Reduces input costs through natural fertility\n- Improves long-term land productivity\n- Creates opportunities for premium markets\n\n## Planning Your Rotation\n\n### 3-Year Rotation Example\n- **Year 1**: Corn (high nitrogen demand)\n- **Year 2**: Soybeans (nitrogen fixing)\n- **Year 3**: Small grains + cover crop\n\n### 4-Year Rotation Example\n- **Year 1**: Corn\n- **Year 2**: Soybeans\n- **Year 3**: Wheat\n- **Year 4**: Forage/pasture\n\n## Implementation Tips\n\n1. **Consider Equipment Compatibility** - Ensure machinery can handle all rotation crops\n2. **Market Analysis** - Research demand and pricing for each crop\n3. **Soil Testing** - Monitor changes in soil health over time\n4. **Record Keeping** - Track yields, costs, and profitability by field\n\nSuccessful crop rotation requires patience and careful planning, but the long-term benefits make it an essential component of sustainable agriculture.",
        featuredImage: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tags: ["Crop Management", "Farm Planning"],
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
