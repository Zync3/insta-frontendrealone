"use client";
 
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { User } from "../types";
import { Grid3X3, Verified } from "lucide-react";
import { BadgeCheck } from "lucide-react";
import { Post } from "../types";
import { PostCard } from "../components/PostCard";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProfilePostCard } from "../components/profilepostcard";
import Link from "next/link";
import { Heart } from "lucide-react";
const Page = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();
  const [posts, setPosts] = useState<Post[]>([]);
  const router=useRouter()
  useEffect(() => {
    fetch("http://localhost:5500/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, []);
 
  useEffect(() => {
    axios
      .get(`/users/${username}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((res) => {
        if (res.status === 404) {
          setIsNotFound(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
  fetch("http://localhost:5500/posts")
    .then((res) => res.json())
    .then((data) => {
      const userPosts = data.filter(
        (post: Post) => post.createdBy?.username === username
      );
      setPosts(userPosts);
    });
}, [username]);
 
  if (loading) return <>Loading...</>;
  if (isNotFound) return <>User with username {username} not found!</>;
 
  return <><div className="flex items-center flex-col gap-4">
    <Link href={"/"}>
    <div><Home/></div></Link>
  <div className="w-[150px] h-[150px] border-2 border-black-300 rounded-[50%] overflow-hidden">
    <img src="data:image/jpeg;base64,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"
      alt="avatar"
      className="w-full h-full object-cover" />
  </div>
     <div className="flex items-center text-2xl font-bold gap-1 pt-10"><BadgeCheck className="mt-0.5" />{username}</div>
     <div className="flex gap-1">
     <div className=""> {username}</div>
     <div className="text-gray-500">he/him</div>
     </div>
     <div className="flex gap-2">
     <div>{posts.length} posts</div>
     <div>0 followers</div>
     <div>0 following</div>
     </div>
     <div className="font-bold flex gap-1"> {username}</div>
     <Grid3X3/>
     <hr className="w-400"></hr>
     <div className="w-[1300px] flex flex-wrap gap-10">
        {posts.map((post) => (
          <ProfilePostCard key={post._id} post={post} />
        ))}</div>
     </div></>
  
};
 
export default Page;
