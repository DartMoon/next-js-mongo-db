"use client"

import {useState, useEffect} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation'
import Profile from "@components/profile";

const MyProfilePage = () => {
  const router = useRouter();
  const {data: session} = useSession();
  const [posts, setPosts] = useState([])

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`)
  }
  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure?")

    if(hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE"
        });

        const filteredPosts = posts.filter(p => p._id !== post._id)

        setPosts(filteredPosts);
      } catch (e) {
        console.log(e);
      }
    }

  }


  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await res.json();

      setPosts(data);
    }


    if (session?.user.id) {
      console.log(2);
      fetchPosts();
    }
  }, []);

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfilePage;
