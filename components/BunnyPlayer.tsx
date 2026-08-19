"use client";

import { useEffect, useRef } from "react";
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

  function attachPlayer() {
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

  // next/script's onLoad only fires the first time this script src loads on the
  // page — client-side navigation to a new lesson remounts this component with a
  // fresh iframe, but the shared playerjs script won't re-fire onLoad, so we also
  // attach directly whenever the script is already present.
  useEffect(() => {
    if (window.playerjs) attachPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Script
        src="https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js"
        strategy="afterInteractive"
        onLoad={attachPlayer}
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
