import { Avatar,Flex, Text,Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import Actions from './Actions'

function Comment({likes, name, text, commentedDate, img}) {
    const [liked, setLiked] = useState(false);
  return (
    <>
        <Flex gap={4} py={2} my={2} w={"full"}>
            <Avatar src={img} size={"sm"}/>
            <Flex gap={1} w={"full"} flexDirection={"column"}>
            <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}>{name}</Text>
                <Flex gap={2} alignItems={"center"}>
                  <Text fontSize={"sm"} color={"gray.light"}>{commentedDate}</Text>
                  <BsThreeDots/>
                </Flex>
            </Flex>
            
            <Text>{text}</Text>
            <Actions liked={liked} setLiked={setLiked}/>
            <Text fontSize={"sm"} color={"gray.light"}>{likes+(liked? 1 : 0)} Likes</Text>
            </Flex>
        </Flex>
        <Box height="1px" backgroundColor="gray.light" my={2} />
        </>
  )
}

export default Comment