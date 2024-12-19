import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { VideoList } from "@/components/VideoList";
import { UploadDialog } from "@/components/UploadDialog";

export default function Explore() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Explore Videos</h1>
          <UploadDialog onUploadComplete={() => window.location.reload()} />
        </div>
     
        <VideoList />
       
      </div>
    </div>
  );
}