import styled from "styled-components";
import { Tweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import { TextArea } from "./post-tweet-form";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Photo = styled.img`
  margin: 20px 20px 20px 20px;
  width: 120px;
  height: 120px;
  border-radius: 15px;
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  word-break: break-all;
`;

const ChangePhotoInput = styled.input`
  width: 100%;
  height: 100%;
  background-color: white;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  margin-right: 5px;
  background-color: lime;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 5px;
`;

export default function Tweet({ userName, photo, tweet, uid, id }: Tweet) {
  const [editMode, setEditMode] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);
  const [file, setFile] = useState<File | null>(null);

  const user = auth.currentUser;

  const onDelete = async () => {
    if (!confirm("Are you sure Delete this tweet?") || user?.uid !== uid)
      return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const onEdit = async () => {
    setEditMode((prev) => !prev);
    if (!editMode) return;
    try {
      if (file !== null) {
        //기존 이미지 삭제
        const photoRef = ref(storage, `tweets/${uid}/${id}`);
        await deleteObject(photoRef);
        //새 이미지 트윗 업데이트
        const locationRef = ref(storage, `tweets/${uid}/${id}`);
        const result = await uploadBytes(locationRef, file);
        const imgUrl = await getDownloadURL(result.ref);
        updateDoc(doc(db, "tweets", id), {
          tweet: editTweet,
          imgUrl,
        });
      } else {
        //트윗만 업데이트
        updateDoc(doc(db, "tweets", id), {
          tweet: editTweet,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setEditMode(false);
      setFile(null);
    }
  };

  const onTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = event;
    setEditTweet(value);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length === 1) {
      if (files[0].size > 1000000) {
        event.target.value = "";
        return alert("Photo size too big! \n you can upload under 1MB");
      }
      setFile(files[0]);
    }
  };

  return (
    <Wrapper>
      <Column>
        <UserName>{userName}</UserName>
        {editMode ? (
          <TextArea onChange={onTextChange} value={editTweet}></TextArea>
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === uid ? (
          <>
            <EditButton onClick={onEdit}>
              {editMode ? "save" : "edit"}
            </EditButton>
            <DeleteButton onClick={onDelete}>delete</DeleteButton>
          </>
        ) : null}
      </Column>

      <Column>
        {editMode ? (
          <ChangePhotoInput
            onChange={onFileChange}
            id="file"
            accept="image/*"
            type="file"
          />
        ) : (
          photo && <Photo src={photo} />
        )}
      </Column>
    </Wrapper>
  );
}
