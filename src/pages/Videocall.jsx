import React, { useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const Videocall = () => {
  const { id: bookingId } = useParams();
  const location = useLocation();
  const { booking, sender, receiver } = location.state || {};
  const containerRef = useRef(null);

  useEffect(() => {
    const initMeeting = async () => {
      const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
      const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

      if (!appID || !serverSecret) {
        console.error("Missing Zego credentials");
        return;
      }

      const userID = sender?._id || "user_" + Math.random().toString(36).slice(2, 8);
      const userName = sender?.name || "Guest_" + Math.floor(Math.random() * 1000);

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        bookingId, // ✅ Use booking._id as roomID
        userID,
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: "Join Call",
            url: `${window.location.origin}/videocall/${bookingId}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: true,
      });
    };

    initMeeting();
  }, [bookingId, sender]);

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      <div className="p-4 text-lg font-semibold">
        📅 {booking?.date} ⏰ {booking?.time} <br />
        👤 Client: {booking?.user?.name} <br />
        🎓 Counselor: {booking?.counselor?.name}
      </div>
      <div ref={containerRef} className="flex-1" />
    </div>
  );
};

export default Videocall;
