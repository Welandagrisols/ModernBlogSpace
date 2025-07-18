import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { insertCommentSchema, type Comment } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, Trash2 } from "lucide-react";

const commentSchema = insertCommentSchema.pick({
  author: true,
  email: true,
  content: true,
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentsProps {
  postId: number;
}

export default function Comments({ postId }: CommentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["/api/posts", postId, "comments"],
  });

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      author: "",
      email: "",
      content: "",
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: CommentFormData) => {
      const response = await apiRequest("POST", `/api/posts/${postId}/comments`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Comment added!",
        description: "Your comment has been posted successfully.",
      });
      form.reset();
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId, "comments"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await apiRequest("DELETE", `/api/comments/${commentId}`);
    },
    onSuccess: () => {
      toast({
        title: "Comment deleted",
        description: "The comment has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId, "comments"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete comment.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CommentFormData) => {
    createCommentMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          Comments ({comments?.length || 0})
        </h3>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            Add Comment
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Leave a Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Name</Label>
                  <Input
                    id="author"
                    {...form.register("author")}
                    placeholder="Your name"
                  />
                  {form.formState.errors.author && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.author.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="your@email.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="content">Comment</Label>
                <Textarea
                  id="content"
                  {...form.register("content")}
                  placeholder="Share your thoughts..."
                  rows={4}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createCommentMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{comment.author}</h4>
                      <span className="text-sm text-muted-foreground">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Unknown date'}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{comment.content}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                    disabled={deleteCommentMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
