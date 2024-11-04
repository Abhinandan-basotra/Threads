import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  VStack,
  Center,
  Spinner,
  Text,
  Flex
} from '@chakra-ui/react';
import UserHeader from '../Components/UserHeader';
import UserPost from '../Components/UserPost';
import useShowToast from '../hooks/useShowToast';
import {UserX} from "lucide-react";

function UserPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        
        if (data.error) {
          setError(data.error);
          showToast("Error", data.error, "error");
          return;
        }
        
        setUser(data);
      } catch (error) {
        setError("Error fetching user profile");
        showToast("Error", "Error fetching user profile", "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  if(!user && !loading) return <div>User not found</div>


  // Loading skeleton UI
  if (loading) {
    return (
      <Container maxW="container.md" py={4}>
        <VStack spacing={6} align="stretch">
          {/* Header Skeleton */}
          <Box padding="6" boxShadow="lg" bg="whiteAlpha.50" borderRadius="md">
            <Flex justify="space-between">
              <Box flex="1">
                <SkeletonText noOfLines={2} spacing="4" skeletonHeight="3" />
                <Skeleton height="4" mt={4} width="60%" />
              </Box>
              <SkeletonCircle size="16" />
            </Flex>
          </Box>

          {/* Posts Skeletons */}
          {[1, 2, 3].map((i) => (
            <Box key={i} padding="6" boxShadow="lg" bg="whiteAlpha.50" borderRadius="md">
              <SkeletonText noOfLines={4} spacing="4" skeletonHeight="2" />
              <Skeleton height="200px" mt={4} />
              <Flex gap={3} mt={4}>
                <Skeleton height="8" width="16" />
                <Skeleton height="8" width="16" />
              </Flex>
            </Box>
          ))}
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={4}>
      <VStack spacing={6} align="stretch">
        <UserHeader user={user} />
        
        {/* Posts */}
        {[
          { likes: 1200, replies: 234, postImg: "/post1.png", postTitles: "Let's talk about threads." },
          { likes: 101, replies: 124, postImg: "/post2.png", postTitles: "Nice Tutorial." },
          { likes: 110, replies: 123, postImg: "/post3.png", postTitles: "I love this Guy." },
          { likes: 120, replies: 114, postTitles: "Let's talk about threads." }
        ].map((post, index) => (
          <UserPost
            key={index}
            likes={post.likes}
            replies={post.replies}
            postImg={post.postImg}
            postTitles={post.postTitles}
            user={user}
          />
        ))}
      </VStack>
    </Container>
  );
}

export default UserPage;