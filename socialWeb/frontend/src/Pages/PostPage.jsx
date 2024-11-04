import { Avatar, Box, Button, Divider, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../Components/Actions'
import Comment from '../Components/Comment';

function PostPage() {
  const [liked, setLiked] = React.useState(false);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src='/zuck-avatar.png' size={"md"} name='Mark Zuckerberg'/>
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>markzukerberg</Text>
            <Image src='/verified.png' w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex alignItems={"center"} gap={2}>
          <Text fontSize={"s"} color={"gray.light"}>1d</Text>
          <BsThreeDots/>
        </Flex>
      </Flex>
      <Text fontSize={"l"} mt={3}>Let's talk about Threads.</Text>
      <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"} mt={2}>
        <Image src='/post1.png' w={"full"}/>
      </Box>

      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked}/>
      </Flex>
      <Flex alignItems={"center"} gap={2}>
        <Text fontSize={"sm"} color={"gray.light"}>238 replies</Text>
        <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
        <Text fontSize={"sm"} color={"gray.light"}>{200 + (liked ? 1 : 0)} likes</Text>
      </Flex>
      <Divider mt={4}/>
      <Flex justifyContent={"space-between"} mt={4}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text fontSize={"s"} color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider mt={4}/>
      <Comment name={"johndoe"} likes={10} text={"Looks really good!"} commentedDate={"1d"} img={"https://bit.ly/sage-adebayo"}/>
      <Comment name={"Abhi"} likes={111} text={"Amazing!"} commentedDate={"2d"} img={"https://bit.ly/code-beast"}/>
      <Comment name={"Atul"} likes={99} text={"Looks Good!"} commentedDate={"3d"} img={"https://bit.ly/prosper-baba"}/>

    </>
  )
}

export default PostPage