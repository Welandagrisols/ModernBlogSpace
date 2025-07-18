import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Linkedin, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title: string;
  url: string;
  excerpt?: string;
}

export default function SocialShare({ title, url, excerpt }: SocialShareProps) {
  const { toast } = useToast();

  const shareButtons = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: "hover:bg-blue-100 hover:text-blue-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "hover:bg-blue-100 hover:text-blue-800",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "hover:bg-blue-100 hover:text-blue-700",
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The post URL has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {shareButtons.map((button) => (
        <Button
          key={button.name}
          variant="outline"
          size="sm"
          onClick={() => window.open(button.url, "_blank", "noopener,noreferrer")}
          className={button.color}
        >
          <button.icon className="h-4 w-4 mr-2" />
          {button.name}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="hover:bg-gray-100"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy Link
      </Button>
    </div>
  );
}
