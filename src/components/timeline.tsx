import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  uid: string;
  userName: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      /* const snapshot = await getDocs(tweetQuery);
      const tweets = snapshot.docs.map((doc) => {
        const { tweet, uid, imgUrl, userName, createdAt } = doc.data();
        return {
          tweet,
          photo: imgUrl,
          userName,
          createdAt,
          uid,
          id: doc.id,
        };
      }); */
      unsubscribe = await onSnapshot(tweetQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, uid, imgUrl, userName, createdAt } = doc.data();
          return {
            tweet,
            photo: imgUrl,
            userName,
            createdAt,
            uid,
            id: doc.id,
          };
        });
        setTweets(tweets);
        return () => {
          unsubscribe && unsubscribe();
        };
      });
    };
    fetchTweets();
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
