"use client";

import { useRef } from "react";
import Script from "next/script";

type PlayerJsInstance = {
  on: (event: string, callback: () => void) => void;
};

declare global {
  interface Window {
    playerjs?: {
      Player: new (iframe: HTMLIFrameElement) => PlayerJsInstance;
    };
  }
}

export default function BunnyPlayer({
  libraryId,
  videoId,
  lessonId,
  alreadyCompleted,
}: {
  libraryId: string;
  videoId: string;
  lessonId: string;
  alreadyCompleted: boolean;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasMarkedComplete = useRef(alreadyCompleted);

  function handleScriptLoad() {
    if (!iframeRef.current || !window.playerjs) return;
    const player = new window.playerjs.Player(iframeRef.current);
    player.on("ended", () => {
      if (hasMarkedComplete.current) return;
      hasMarkedComplete.current = true;
      fetch(`/api/student/lessons/${lessonId}/progress`, { method: "POST" }).catch(() => {
        hasMarkedComplete.current = false;
      });
    });
  }

  return (
    <>
      <Script
        src="https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
        <iframe
          ref={iframeRef}
          src={`https://player.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false`}
          className="w-full h-full"
          allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </>
  );
}
