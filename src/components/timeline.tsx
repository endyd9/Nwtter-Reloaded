import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface Tweet {
  id: string;
  photo?: string;
  tweet: string;
  uid: string;
  userName: string;
  createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, uid, imgUrl, userName, createdAt } = doc.data();
      console.log(imgUrl);
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
  };

  useEffect(() => {
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
