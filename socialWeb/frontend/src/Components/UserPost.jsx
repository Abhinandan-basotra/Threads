import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import Actions from './Actions'
import Comment from './Comment'

function UserPost({likes, replies, postImg, postTitles}) {
    const [liked, setLiked] = useState(false);
  return (
    <Link to={"/markzuckerberg/post/1"}>
        <Flex gap={3} mb={4} py={8}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size="md" name='Mark Zukerberg' src='/zuck-avatar.png'/>
                <Box w="1px" h={"full"} bg={"gray.light"} my={"2"}>

                </Box>
                <Box position={"relative"} w={"full"}>
                    <Avatar 
                    size="xs" 
                    name='Abhinandan' 
                    src="https://bit.ly/dan-abramov" 
                    position={"absolute"}
                    padding={"2px"}
                    top={"-30px"}
                    left={"15px"}
                    />
                    <Avatar 
                    size="xs"
                    name='Abhinandan' 
                    src="https://bit.ly/prosper-baba" 
                    position={"absolute"}
                    padding={"2px"}
                    bottom={"6px"}
                    right={"-3px"}
                    />
                    <Avatar 
                    size="xs" 
                    name='Abhinandan' 
                    src="https://bit.ly/kent-c-dodds" 
                    position={"absolute"}
                    padding={"2px"}
                    top={"-31px"}
                    left={"37px"}
                    />
                </Box>
            </Flex>
            <Flex flex={1} flexDirection={'column'} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                    <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            Mark Zukerberg
                        </Text>
                        <Image src='/verified.png' w={4} h={4} ml={"2px"}/>
                    </Flex>
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
                        <BsThreeDots/>
                    </Flex>
                </Flex>

                <Text fontSize={"sm"}>{postTitles}</Text>
                <Box
                borderRadius={6}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"gray.light"}
                >
                    <Image src={postImg} w={"full"}/>
                </Box>
                <Flex gap={3} my={1}>
                    <Actions liked={liked} setLiked={setLiked}/>
                </Flex>
                <Flex alignItems={"center"} gap={1}>
                    <Text fontSize={"sm"} color={"gray.light"}>{replies} replies</Text>
                    <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                    <Text fontSize={"sm"} color={"gray.light"}>{likes} likes</Text>
                </Flex>
                <Box borderBottom={"0.1px solid"} borderColor={"gray.light"}></Box>
            </Flex>
        </Flex>
    </Link>
  )
}

export default UserPost