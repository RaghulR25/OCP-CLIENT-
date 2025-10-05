import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams, useLocation } from "react-router-dom";

const Videocall = () => {
  const { id } = useParams(); // bookingId as roomId
  const location = useLocation();
  const { booking, user, counselor } = location.state || {};
  const meetingContainer = useRef(null);

  const randomID = (len = 5) => {
    let result = "";
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
    const initMeeting = async () => {
      const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
      const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;
       console.log("Room ID:", id);
  console.log("Booking:", booking);

      if (!appID || !serverSecret) {
        console.error("Missing Zego credentials in .env");
        return;
      }

      const loggedInPerson = user || counselor;
      const userID = loggedInPerson?._id || randomID(8);
      const userName = loggedInPerson?.name || "Guest_" + randomID(5);

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        id,
        userID,
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: meetingContainer.current,
        sharedLinks: [
          {
            name: "Invite Link",
            url: `${window.location.origin}/videocall/${id}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: true,
      });
    };

    initMeeting();
  }, [id, user, counselor]);

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      <div className="p-4 text-lg font-semibold">
        📅 {booking?.date} ⏰ {booking?.time} <br />
        👤 Client: {booking?.user?.name} <br />
        🎓 Counselor: {booking?.counselor?.name}
      </div>
      <div ref={meetingContainer} className="flex-1" />
    </div>
  );
};

export default Videocall;
