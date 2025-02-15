"use client";
import {
  useMemo,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";
import { LANGUAGE_OPTIONS } from "../_utils/Lang";

const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const [uid] = useState(Date.now());
  const [userName, setUserName] = useState("");
  const [primaryLang, setPrimaryLang] = useState(LANGUAGE_OPTIONS[0]);
  const [learningLang, setLearningLang] = useState(LANGUAGE_OPTIONS[0]);
  const [roomID, setRoomID] = useState(null);

  const queueUser = useCallback(async () => {
    console.log("queueing user");
    try {
      const res = await fetch("http://localhost:3010/api/user/queue", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          userName: userName,
          primaryLanguage: primaryLang,
          learningLanguage: learningLang,
        }),
      });

      setRoomID((await res.json()).roomID);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [learningLang, primaryLang, uid, userName]);

  console.log(roomID);

  const UserContextValue = useMemo(
    () => ({
      uid,
      userName,
      primaryLang,
      learningLang,
      roomID,
      setUserName,
      setPrimaryLang,
      setLearningLang,
      queueUser,
    }),
    [learningLang, primaryLang, queueUser, roomID, uid, userName]
  );

  console.log(uid, userName, primaryLang, learningLang);
  return (
    <UserContext.Provider value={UserContextValue}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export { UserContext, UserContextProvider, useUser };
