import React, { useState } from "react";
import { dbService, storageService } from "fBase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";

const Tweet = ({ tweetObj, isOwner }: any) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const tweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);
  const desertRef = ref(storageService, tweetObj.attachmentUrl);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");
    if (ok) {
      // delete
      try {
        await deleteDoc(tweetTextRef);
        if (tweetObj.attachmentUrl !== "") {
          await deleteObject(desertRef);
        }
      } catch (error) {
        window.alert("delete error");
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (e: any) => {
    e.preventDefault();
    console.log(tweetObj, newTweet);
    await updateDoc(tweetTextRef, { text: newTweet });
    setEditing(false);
  };
  const onChange = (e: any) => {
    const {
      target: { value },
    } = e;
    setNewTweet(value);
  };
  return (
    <div key={tweetObj.id}>
      <h4>{tweetObj.text}</h4>
      {tweetObj.attachmentUrl && (
        <img src={tweetObj.attachmentUrl} width="50px" height="50px" />
      )}
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your tweet"
              value={newTweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Tweet" />
          </form>
          <button onClick={toggleEditing}>cancel</button>
        </>
      ) : (
        <>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
