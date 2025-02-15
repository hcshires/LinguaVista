"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import Peer from "peerjs";
import { useUser } from "@/app/_context/UserContext";

const RoomPage = ({ params }) => {
  const p = use(params);
  const [peerInstance, setPeerInstance] = useState(null);
  const userVidRef = useRef(null);
  const callerVidRef = useRef(null);
  const { uid } = useUser();

  const fetcher = useCallback(
    (url) =>
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomID: p.roomID }),
      }).then((r) => r.json()),
    [p.roomID]
  );
  const { data, error, isLoading } = useSWR(
    "http://localhost:3010/api/room/users",
    fetcher
  );

  const filterCallerID = useCallback(
    () => data.filter((user) => user.uid !== uid)[0],
    [data, uid]
  );

  const handleCall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const call = peerInstance?.call(filterCallerID(), stream);
    if (call) {
      call.on("stream", (userVideoStream) => {
        if (callerVidRef.current) {
          callerVidRef.current.srcObject = userVideoStream;
        }
      });
    }
  }, [filterCallerID, peerInstance]);

  const handleStream = async (peer) => {
    setPeerInstance(peer);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (userVidRef.current) {
      userVidRef.current.srcObject = stream;
    }

    peer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userVideoStream) => {
        if (callerVidRef.current) {
          callerVidRef.current.srcObject = userVideoStream;
        }
      });
    });
  };

  useEffect(() => {
    if (p.roomID) {
      let peer;

      // this makes it run ONLY on the client
      if (typeof window !== "undefined") {
        peer = new Peer(p.roomID, {
          host: "localhost",
          port: 8080,
          path: "/api/stream",
        });
        //  Here, we retrieve the camera from the browser
        //  and assign the video stream to the reference of our video tag.
        handleStream(peer);
      }
      return () => {
        if (peer) {
          console.log("kill.");
          peer.destroy();
        }
      };
    }
  }, [p.roomID]);

  useEffect(() => {
    if (data && !isLoading && !error) {
      if (data.length > 1) {
        handleCall();
      }
    }
  }, [data, isLoading, error, handleCall]);

  console.log("data: " + data);
  return (
    <>
      <video playsInline ref={userVidRef} autoPlay />
      <p> SPACER</p>
      <video playsInline ref={callerVidRef} autoPlay />
      <p>{p.roomID}</p>
    </>
  );
};

export default RoomPage;
