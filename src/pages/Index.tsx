import { Navbar } from "@/components/Navbar";
import { VideoCard } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const SAMPLE_VIDEOS = [
  {
    username: "creativecoder",
    description: "Check out this amazing sunset timelapse! 🌅 #nature #photography",
    likes: 1234,
    comments: 89,
    thumbnail: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
  },
  {
    username: "techie_sarah",
    description: "Quick tutorial on React hooks 💻 #coding #webdev",
    likes: 892,
    comments: 56,
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  },
  {
    username: "foodie_mike",
    description: "Making the perfect pasta from scratch 🍝 #cooking #food",
    likes: 2341,
    comments: 167,
    thumbnail: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent animate-fade-in">
            Create Your Wave
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto animate-fade-in">
            Share your moments, inspire others, and be part of something bigger.
            Start your ripple effect today.
          </p>
          <Button size="lg" className="animate-float">
            <Play className="mr-2 h-5 w-5" /> Start Creating
          </Button>
        </div>
      </section>

      {/* Video Feed */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center">Trending Waves</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_VIDEOS.map((video, index) => (
              <VideoCard key={index} {...video} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;