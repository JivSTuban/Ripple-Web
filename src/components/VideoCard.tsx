import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface VideoCardProps {
  username: string;
  description: string;
  likes: number;
  comments: number;
  videoUrl: string;
  avatarUrl?: string;
  thumbnail?: string;
}

export function VideoCard({
  username,
  description,
  likes: initialLikes,
  comments,
  videoUrl,
  avatarUrl,
  thumbnail,
}: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked(!isLiked);
  };

  const handleComment = () => {
    // Implement comment modal or navigation
    console.log("Comment clicked");
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${username}'s video`,
        text: description,
        url: window.location.href,
      });
    } catch (err) {
      console.log("Share failed:", err);
    }
  };

  return (
    <div className="overflow-hidden animate-fade-in hover:shadow-lg transition-shadow duration-300">
      <div
        className="aspect-video relative bg-slate-100"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        <video
          src={videoUrl}
          poster={thumbnail}
          className="w-full h-full object-cover"
          loop
          playsInline
          autoPlay={isPlaying}
          controls
        />
        <div className="absolute top-4 right-4 flex space-x-3">
          <Button
            size="icon"
            variant="secondary"
            className={`rounded-full ${isLiked ? "bg-red-100 text-red-500" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleComment();
            }}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-5">
          <Avatar>
            <AvatarImage
              src={avatarUrl}
              alt={username}
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;
              }}
            />
            <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold">@{username}</h3>
          </div>
          <p className="text-sm text-slate-600 mb-2">{description}</p>
          <div className="flex">
              <div className="flex space-x-4 mt-3 text-sm text-slate-500">
                <span>{likes} likes</span>
                <span>{comments} comments</span>
              </div>
              
              
          </div>  
         
          
      </div>
    </div>
  );
}