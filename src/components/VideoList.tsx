import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoCard } from "@/components/VideoCard";
import { useToast } from "@/components/ui/use-toast";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideoList() {
  const { toast } = useToast();
  const [videos, setVideos] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVideos(data || []);
      console.log("Videos:", data);
    } catch (error) {
      console.error("Error loading videos:", error);
      toast({
        title: "Error",
        description: "Failed to load videos",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (e.key === "ArrowDown") {
      setCurrentIndex((prevIndex) => (prevIndex < videos.length - 1 ? prevIndex + 1 : prevIndex));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [videos]);

  if (videos.length === 0) return <div>Loading videos...</div>;

  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="flex-grow">
        <VideoCard
          key={videos[currentIndex].id}
          username={videos[currentIndex].profiles?.username || "Anonymous"}
          description={videos[currentIndex].description || ""}
          likes={0}
          videoUrl={videos[currentIndex].video_url}
          avatarUrl={videos[currentIndex].profiles?.avatar_url}
          comments={0}
          thumbnail={videos[currentIndex].thumbnail_url || "https://images.unsplash.com/photo-1472214103451-9374bd1c798e"}
        />
      </div>
      <div className="flex flex-col space-y-4">
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full w-16 h-16"
          onClick={() => setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex))}
        >
          <ChevronUp className="h-8 w-8" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full w-16 h-16"
          onClick={() => setCurrentIndex((prevIndex) => (prevIndex < videos.length - 1 ? prevIndex + 1 : prevIndex))}
        >
          <ChevronDown className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}