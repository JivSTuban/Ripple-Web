import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

interface UploadDialogProps {
  onUploadComplete: () => void;
}

// Maximum file size in bytes (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export function UploadDialog({ onUploadComplete }: UploadDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    video: null as File | null,
    thumbnail: null as File | null,
  });

  const validateFileSize = (file: File | null, maxSize: number) => {
    if (!file) return true;
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: `File size must be less than ${Math.floor(maxSize / (1024 * 1024))}MB`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'thumbnail') => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      if (type === 'video' && !validateFileSize(file, MAX_FILE_SIZE)) {
        e.target.value = ''; // Reset input
        return;
      }
      if (type === 'thumbnail' && !validateFileSize(file, 5 * 1024 * 1024)) { // 5MB limit for thumbnails
        e.target.value = '';
        return;
      }
    }

    setUploadData(prev => ({ ...prev, [type]: file }));
  };

  const uploadVideo = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      if (!uploadData.video || !uploadData.title) {
        throw new Error("Please provide a video and title");
      }

      // Validate file size again before upload
      if (!validateFileSize(uploadData.video, MAX_FILE_SIZE)) {
        return;
      }

      // Upload video
      const videoExt = uploadData.video.name.split(".").pop();
      const videoPath = `${crypto.randomUUID()}.${videoExt}`;
      const { error: videoError } = await supabase.storage
        .from("videos")
        .upload(videoPath, uploadData.video);
      if (videoError) throw videoError;

      // Get video URL
      const { data: { publicUrl: videoUrl } } = supabase.storage
        .from("videos")
        .getPublicUrl(videoPath);

      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (uploadData.thumbnail) {
        const thumbnailExt = uploadData.thumbnail.name.split(".").pop();
        const thumbnailPath = `thumbnails/${crypto.randomUUID()}.${thumbnailExt}`;
        const { error: thumbnailError } = await supabase.storage
          .from("videos")
          .upload(thumbnailPath, uploadData.thumbnail);
        if (thumbnailError) throw thumbnailError;

        const { data: { publicUrl } } = supabase.storage
          .from("videos")
          .getPublicUrl(thumbnailPath);
        thumbnailUrl = publicUrl;
      }

      // Save video data
      const { error: insertError } = await supabase
        .from("videos")
        .insert({
          title: uploadData.title,
          description: uploadData.description,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          user_id: session.user.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Video uploaded successfully",
      });

      // Reset form and notify parent
      setUploadData({
        title: "",
        description: "",
        video: null,
        thumbnail: null,
      });
      onUploadComplete();
    } catch (error) {
      console.error("Error uploading video:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload Video
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={uploadData.title}
              onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
              placeholder="Enter video title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={uploadData.description}
              onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
              placeholder="Enter video description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video">Video (Max 50MB)</Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, 'video')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail (Optional, Max 5MB)</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'thumbnail')}
            />
          </div>
          <Button
            className="w-full"
            onClick={uploadVideo}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}