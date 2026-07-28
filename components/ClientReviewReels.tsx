"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Volume2, VolumeX, Play } from "lucide-react";

const clientVideos = [
  {
    id: 1,
    src: "/reels/yogavideo-1.mp4",
    title: "Client Review",
    description: "Real transformation stories from our yoga community",
  },
  {
    id: 2,
    src: "/reels/yogavideo-2.mp4",
    title: "Client Review",
    description: "Real transformation stories from our yoga community",
  },
];

export default function ClientReviewReels() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [mutedStates, setMutedStates] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
  });
  const [playingStates, setPlayingStates] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
  });
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  useEffect(() => {
    // Autoplay all videos when section is in view (muted)
    if (isInView) {
      Object.keys(videoRefs.current).forEach((key) => {
        const video = videoRefs.current[Number(key)];
        if (video) {
          video.muted = true;
          video.volume = 1.0;
          video.play()
            .then(() => {
              setPlayingStates((prev) => ({ ...prev, [Number(key)]: true }));
            })
            .catch(() => {
              // Autoplay might fail, that's okay
            });
        }
      });
    }
  }, [isInView]);

  // Sync muted state with video elements whenever it changes
  useEffect(() => {
    Object.keys(videoRefs.current).forEach((key) => {
      const video = videoRefs.current[Number(key)];
      if (video) {
        const videoId = Number(key);
        video.muted = mutedStates[videoId] ?? true;
        video.volume = 1.0;
      }
    });
  }, [mutedStates]);

  useEffect(() => {
    // Listen to video play/pause events
    const cleanupFunctions: (() => void)[] = [];

    Object.keys(videoRefs.current).forEach((key) => {
      const video = videoRefs.current[Number(key)];
      if (video) {
        const handlePlay = () => {
          setPlayingStates((prev) => ({ ...prev, [Number(key)]: true }));
        };
        const handlePause = () => setPlayingStates((prev) => ({ ...prev, [Number(key)]: false }));

        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);

        cleanupFunctions.push(() => {
          video.removeEventListener("play", handlePlay);
          video.removeEventListener("pause", handlePause);
        });
      }
    });

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [isInView]);

  const handleVideoClick = (videoId: number) => {
    const video = videoRefs.current[videoId];
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlayingStates((prev) => ({ ...prev, [videoId]: true }));
    } else {
      video.pause();
      setPlayingStates((prev) => ({ ...prev, [videoId]: false }));
    }
  };

  const handleMuteToggle = async (videoId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const video = videoRefs.current[videoId];
    if (!video) return;

    const currentlyMuted = mutedStates[videoId];
    
    // If unmuting this video
    if (currentlyMuted) {
      // First, mute all other videos
      Object.keys(videoRefs.current).forEach((key) => {
        const otherVideo = videoRefs.current[Number(key)];
        if (otherVideo && Number(key) !== videoId) {
          otherVideo.muted = true;
          otherVideo.volume = 1.0;
        }
      });
      
      // Update state to mute all others
      const newMutedStates: { [key: number]: boolean } = {};
      clientVideos.forEach((v) => {
        newMutedStates[v.id] = v.id !== videoId;
      });
      
      // CRITICAL: Set properties in correct order
      video.volume = 1.0;
      video.muted = false;
      
      // Update state
      setMutedStates(newMutedStates);
      
      // Ensure video is playing - user interaction allows audio
      try {
        if (video.paused) {
          // Video is paused, just play it
          await video.play();
        } else {
          // Video is playing, reload to trigger audio with user interaction
          const wasPlaying = !video.paused;
          const currentTime = video.currentTime;
          
          // Pause, unmute, then play
          video.pause();
          video.muted = false;
          video.volume = 1.0;
          
          // Small delay to ensure state is set
          await new Promise(resolve => setTimeout(resolve, 50));
          
          video.currentTime = currentTime;
          await video.play();
          
          // Final check
          if (video.muted) {
            video.muted = false;
          }
        }
      } catch (error) {
        console.error("Error playing video with audio:", error);
        // Ensure unmuted even if play fails
        video.muted = false;
        video.volume = 1.0;
      }
    } else {
      // Muting this video
      video.muted = true;
      setMutedStates((prev) => ({ ...prev, [videoId]: true }));
    }
  };

  const handleVideoRef = (videoId: number, element: HTMLVideoElement | null) => {
    videoRefs.current[videoId] = element;
    if (element) {
      element.muted = true;
      element.volume = 1.0; // Set volume to max
      element.loop = true;
      element.playsInline = true;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-gradient-to-b from-[#ede8e0] to-[#f5f1eb] py-16 sm:py-20 md:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1a3a1a] mb-4">
            Client Reviews
          </h2>
          <p className="text-lg sm:text-xl text-[#2d2d2d]/80 max-w-2xl mx-auto">
            Real transformation stories from our yoga community
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#e8745b] to-[#c9a227] mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Video Reels Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-5xl mx-auto"
        >
          {clientVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="group relative"
            >
              {/* Video Container */}
              <div
                className="relative w-full aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#1a3a1a] shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => handleVideoClick(video.id)}
              >
                {/* Video Element */}
                <video
                  ref={(el) => handleVideoRef(video.id, el)}
                  src={video.src}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  preload="auto"
                  onLoadedMetadata={(e) => {
                    const videoEl = e.currentTarget;
                    videoEl.muted = mutedStates[video.id] ?? true;
                    videoEl.volume = 1.0;
                  }}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play/Pause Indicator */}
                {!playingStates[video.id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#2d5a2d] ml-1" fill="currentColor" />
                    </div>
                  </div>
                )}

                {/* Mute/Unmute Button */}
                <button
                  onClick={(e) => handleMuteToggle(video.id, e)}
                  className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 z-10 group-hover:scale-110"
                  aria-label={mutedStates[video.id] ? "Unmute video" : "Mute video"}
                >
                  {mutedStates[video.id] ? (
                    <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </button>

                {/* Video Info Overlay (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-1">
                    {video.title}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm">
                    {video.description}
                  </p>
                </div>

                {/* Click to Play Hint */}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                  <span className="text-white text-xs font-medium">
                    Click to {playingStates[video.id] ? "pause" : "play"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
