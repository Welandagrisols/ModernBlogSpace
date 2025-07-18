import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { z } from "zod";
import { insertPostSchema, type Post } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MarkdownEditor from "@/components/markdown-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Eye } from "lucide-react";

const createPostSchema = insertPostSchema.extend({
  tags: z.array(z.string()).optional(),
});

type CreatePostData = z.infer<typeof createPostSchema>;

export default function CreatePost() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isEditing = Boolean(id);

  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ["/api/posts", id],
    enabled: isEditing,
  });

  const form = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      tags: [],
      published: false,
      featuredImage: undefined,
    },
  });

  // Set form values when editing
  if (isEditing && post && !form.formState.isDirty) {
    form.reset({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags || [],
      published: post.published,
      featuredImage: post.featuredImage || undefined,
    });
    if (post.featuredImage) {
      setImagePreview(post.featuredImage);
    }
  }

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("excerpt", data.excerpt);
      formData.append("content", data.content);
      formData.append("tags", JSON.stringify(data.tags || []));
      formData.append("published", String(data.published));
      
      if (selectedImage) {
        formData.append("featuredImage", selectedImage);
      } else if (data.featuredImage) {
        formData.append("featuredImage", data.featuredImage);
      }

      const url = isEditing ? `/api/posts/${id}` : "/api/posts";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: isEditing ? "Post updated!" : "Post created!",
        description: isEditing ? "Your post has been updated successfully." : "Your post has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setLocation(`/post/${data.slug}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(",").map(tag => tag.trim()).filter(tag => tag);
    form.setValue("tags", tags);
  };

  const onSubmit = (data: CreatePostData) => {
    createPostMutation.mutate(data);
  };

  if (isEditing && isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="h-32 bg-muted rounded mb-4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? "Edit Post" : "Create New Post"}
          </h1>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="Enter an engaging title..."
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  {...form.register("excerpt")}
                  placeholder="Brief description of your post..."
                  rows={3}
                />
                {form.formState.errors.excerpt && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.excerpt.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  defaultValue={form.watch("tags")?.join(", ") || ""}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="technology, web development, react"
                />
              </div>

              <div>
                <Label htmlFor="featuredImage">Featured Image</Label>
                <div className="mt-2">
                  <Input
                    id="featuredImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Featured image preview"
                      className="mt-4 max-w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={form.watch("published")}
                  onCheckedChange={(checked) => form.setValue("published", checked)}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Content</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {previewMode ? "Edit" : "Preview"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MarkdownEditor
                value={form.watch("content")}
                onChange={(value) => form.setValue("content", value)}
                preview={previewMode}
              />
              {form.formState.errors.content && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.content.message}
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPostMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {createPostMutation.isPending
                ? "Saving..."
                : isEditing
                ? "Update Post"
                : "Create Post"}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
