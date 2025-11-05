import { Post } from "../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Heart, Verified } from "lucide-react";
import { useAxios } from "../hooks/useAxios";
import { useUser } from "../providers/UserProvider";
import Link from "next/link";
import { Road_Rage } from "next/font/google";
import { getNamedRouteRegex } from "next/dist/shared/lib/router/utils/route-regex";
dayjs.extend(relativeTime);
 
export const ProfilePostCard = ({ post }: { post: Post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [totalComments, setTotalComments] = useState(3);
 
  const axios = useAxios();
 
  const [text, setText] = useState("");
  const [comments, setComments] = useState(post.comments);
 
  const { user } = useUser();
 
  useEffect(() => {
    if (user) {
      const userId = user._id;
      setIsLiked(
        post.likes.some((like) => {
          const createdBy: any = like.createdBy;
          return (createdBy && createdBy._id === userId) || (typeof createdBy === "string" && createdBy === userId);
        })
      );
    }
  }, [user]);
 
  const handleSubmitComment = async () => {
    const response = await axios.post(`/posts/${post._id}/comments`, { text });
 
    if (response.status === 200) {
      setText("");
      setComments([...comments, response.data]);
    } else {
      toast.error("Алдаа гарлаа");
    }
  };
 
  return (
    <div key={post._id} className="relative">
      <img className="w-[400px] h-[350px] object-cover" src={post.imageUrl} alt="" />
      <div className="absolute right-2 bottom-2  text-white rounded-md px-2 py-1 flex items-center gap-2 font-semibold bg-opacity-100 bg-black">
        {isLiked ? (
          <Heart fill="red" stroke="red" size={20} />
        ) : (
          <Heart size={20} />
        )}
        <span className="text-sm">{likeCount}</span>
      </div>
    </div>
  );
}