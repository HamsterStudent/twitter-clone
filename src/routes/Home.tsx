import React, { useEffect, useState } from "react";
import { dbService } from "fBase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  DocumentData,
  query,
} from "firebase/firestore";

interface SnapshotData {
  data: DocumentData;
  id: String;
}

const Home = () => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState<any>([]);
  const getTweets = async () => {
    const q = query(collection(dbService, "tweets"));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      const tweetObj = {
        ...doc.data(),
        id: doc.id,
      };
      setTweets((prev: SnapshotData[]) => [tweetObj, ...prev]);
    });
  };

  useEffect(() => {
    getTweets();
  }, []);

  const onSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "tweets"), {
        tweet,
        createdAt: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    setTweet("");
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setTweet(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={onChange}
          value={tweet}
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Tweet" />
      </form>
      <div>
        {tweets.map((tweet: any) => (
          <div key={tweet.id}>
            <h4>{tweet.tweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
