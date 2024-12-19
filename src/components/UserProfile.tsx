import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function UserProfile() {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFullName(data.full_name || "");
        setUsername(data.username || "");
        setAvatarUrl(data.avatar_url);
      } else {
        // Create a new profile if one doesn't exist
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: session.user.id,
            username: "",
            full_name: "",
            avatar_url: null,
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;

        toast({
          title: "Profile created",
          description: "Please update your profile information",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      let newAvatarUrl = avatarUrl;
      if (avatar) {
        newAvatarUrl = await uploadAvatar(avatar);
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          username,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <div className="relative inline-block">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatarUrl || ""} />
            <AvatarFallback>
              {fullName?.charAt(0) || username?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 p-1 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 transition-colors"
          >
            <Camera className="w-4 h-4 text-white" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAvatar(file);
                  setAvatarUrl(URL.createObjectURL(file));
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <Button
          className="w-full"
          onClick={updateProfile}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </div>
  );
}