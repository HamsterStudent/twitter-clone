import React, { useEffect, useState, useRef } from "react";
import { dbService, storageService } from "fBase";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
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

const Home = ({ userObj }: any) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState<any>([]);
  const [attachment, setAttachment] = useState("");
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
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url",
      );
      attachmentUrl = await getDownloadURL(response.ref);
      const tweetObj = {
        text: tweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl,
      };
      await addDoc(collection(dbService, "tweets"), tweetObj);
      setTweet("");
      setAttachment("");
    }
    // const onClearAttachment = () => {
    //   setAttachment("");
    // };
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setTweet(value);
  };

  const onFileChange = (event: any) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader(); // 파일을 가지고 reader를 만든 다음
    reader.onloadend = (finshedEvent: any) => {
      const {
        currentTarget: { result },
      } = finshedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile); // reader를 읽음
  };
  const fileInput = useRef<HTMLInputElement>(null);
  const onClearAttachment = () => {
    setAttachment("");
    if (fileInput.current) {
      fileInput.current.value = "";
    }
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
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="Tweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" alt="preview" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
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
