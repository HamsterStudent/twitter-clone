import React, { useEffect, useState, useRef } from "react";
import { dbService, storageService } from "fBase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  DocumentData,
  query,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";

const Home = ({ userObj }: any) => {
  const [tweets, setTweets] = useState<any>([]);

  useEffect(() => {
    const qu = query(
      collection(dbService, "tweets"),
      orderBy("createdAt", "desc"), // 시간순으로 정렬
    );
    onSnapshot(qu, (snapshot) => {
      const tweetArr = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArr);
    });
  }, []);

  return (
    <div className="container">
      <TweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {tweets.map((eachTweet: any) => (
          <Tweet
            key={eachTweet.id}
            tweetObj={eachTweet}
            isOwner={eachTweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
