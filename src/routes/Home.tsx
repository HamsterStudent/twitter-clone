import React, { useEffect, useState } from "react";
import { dbService } from "fBase";
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

interface SnapshotData {
  data: DocumentData;
  id: String;
}
interface tweetType {
  id?: string;
  text?: string;
  createdAt?: Timestamp;
  author?: string;
}

const Home = ({ userObj }: any) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState<any>([]);

  // 예전방식이라 안씀
  // const getTweets = async () => {
  //   const q = query(collection(dbService, "tweets"));
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.id, " => ", doc.data());
  //     const tweetObj = {
  //       ...doc.data(),
  //       id: doc.id,
  //     };
  //     setTweets((prev: SnapshotData[]) => [tweetObj, ...prev]);
  //   });
  // };

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

  const onSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "tweets"), {
        text: tweet,
        createdAt: serverTimestamp(),
        creatorId: userObj.uid,
      });
      console.log(tweet);
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
