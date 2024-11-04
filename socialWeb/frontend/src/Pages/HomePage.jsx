import { Button, Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast';
import Post from '../Components/Post';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  useEffect(()=>{
    const getFeed = async () => {
      setLoading(true);
      try{
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        console.log(data);
        setPosts(data);
        if(data.error){
          showToast("Error", data.error, "error");
          return;
        }
        
      }catch(e){
        showToast("Error", e.message, "error");
      }finally{
        setLoading(false);
      }
    }
    getFeed();
  },[showToast,setPosts]);
  return (
    <>
    {!loading && posts.length===0 && <h1>follow some users to see the posts</h1>}
    {loading && (
      <Flex justify="center">
        <Spinner size="xl"/>
      </Flex>
    )}
    {/* {posts.map((post)=>(
      <Post key={post._id} post = {post} postedBy = {post.postedBy}/>
    ))} */}
    </>
  )
}

export default HomePage