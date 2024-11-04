import { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Container,
    Flex,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Text,
    VStack,
    useToast,
    Spinner
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { useRecoilValue } from 'recoil';
import userAtom from '../atom/userAtom';

const UserHeader = ({user}) => {
    const currentUser = useRecoilValue(userAtom);
    const [following, setFollowing] = useState(user?.followers?.includes(currentUser?._id));
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const showToast = (title, description, status) => {
        toast({
            title,
            description,
            status,
            duration: 3000,
            isClosable: true,
            position: 'top',
        });
    };

    const copyUrl = async () => {
        try {
            const currentUrl = window.location.href;
            await navigator.clipboard.writeText(currentUrl);
            showToast(
                'Success',
                'Profile link copied to clipboard',
                'success'
            );
        } catch (err) {
            showToast(
                'Error',
                'Failed to copy link',
                'error'
            );
        }
    };

    const handleFollowUnfollow = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await res.json();
            
            if (data.error) {
                showToast(
                    'Error',
                    data.error,
                    'error'
                );
                return;
            }

            if (following) {
                user.followers = user.followers.filter(id => id !== currentUser?._id);
                showToast(
                    'Success',
                    `Unfollowed ${user.name}`,
                    'success'
                );
            } else {
                user.followers.push(currentUser?._id);
                showToast(
                    'Success',
                    `Started following ${user.name}`,
                    'success'
                );
            }

            setFollowing(!following);

        } catch (error) {
            showToast(
                'Error',
                'Something went wrong. Please try again.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="container.md" py={4}>
            <VStack spacing={6} align="stretch">
                {/* Header Section */}
                <Flex justify="space-between" align="flex-start">
                    <Box>
                        <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            letterSpacing="tight"
                            mb={2}
                        >
                            {user.name}
                        </Text>
                        <Flex align="center" gap={2}>
                            <Text fontSize="sm">{user.username}</Text>
                            <Text
                                fontSize="xs"
                                bg="whiteAlpha.200"
                                color="gray.400"
                                px={2}
                                py={1}
                                borderRadius="full"
                            >
                                threads.next
                            </Text>
                        </Flex>
                    </Box>

                    <Avatar
                        name={user.name}
                        src={user.profilePic}
                        size={{ base: "md", md: "lg" }}
                        border="2px solid"
                        borderColor="gray.700"
                    />
                </Flex>

                {/* Bio Section */}
                <Text color="gray.300" maxW="80%">
                    {user.bio}
                </Text>

                {/* Action Buttons */}
                {currentUser._id === user._id ? (
                    <Link
                        as={RouterLink}
                        to="/update"
                        _hover={{ textDecoration: 'none' }}
                    >
                        <Button
                            size="sm"
                            variant="outline"
                            w={{ base: 'full', sm: 'auto' }}
                        >
                            Update Profile
                        </Button>
                    </Link>
                ) : (
                    <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={handleFollowUnfollow}
                        isLoading={loading}
                        loadingText="Loading"
                        spinner={<Spinner size="sm" />}
                        w={{ base: 'full', sm: 'auto' }}
                    >
                        {following ? "Unfollow" : "Follow"}
                    </Button>
                )}

                {/* Stats & Links Section */}
                <Flex justify="space-between" align="center">
                    <Flex align="center" gap={3}>
                        <Flex align="center" gap={1}>
                            <Text fontWeight="semibold">
                                {user.followers.length}
                            </Text>
                            <Text fontSize="sm" color="gray.400">
                                followers
                            </Text>
                        </Flex>
                        <Box w="1" h="1" bg="gray.500" borderRadius="full" />
                        <Link
                            href="https://instagram.com"
                            fontSize="sm"
                            color="gray.400"
                            _hover={{ color: 'gray.300', textDecoration: 'none' }}
                            isExternal
                        >
                            instagram.com
                        </Link>
                    </Flex>

                    <Flex gap={4}>
                        <IconButton
                            icon={<BsInstagram />}
                            variant="ghost"
                            borderRadius="full"
                            aria-label="Instagram profile"
                            _hover={{ bg: 'whiteAlpha.200' }}
                            size="sm"
                        />
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                icon={<CgMoreO />}
                                variant="ghost"
                                borderRadius="full"
                                aria-label="More options"
                                _hover={{ bg: 'whiteAlpha.200' }}
                                size="sm"
                            />
                            <Portal>
                                <MenuList bg="gray.800" borderColor="gray.700">
                                    <MenuItem
                                        onClick={copyUrl}
                                        _hover={{ bg: 'whiteAlpha.200' }}
                                        _focus={{ bg: 'whiteAlpha.200' }}
                                    >
                                        Copy Link
                                    </MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Flex>
                </Flex>

                {/* Navigation Tabs */}
                <Flex borderBottom="1px" borderColor="gray.700">
                    <Button
                        flex={1}
                        variant="ghost"
                        borderBottom="2px"
                        borderColor="white"
                        borderRadius="none"
                        py={6}
                        fontWeight="semibold"
                        _hover={{ bg: 'transparent' }}
                    >
                        Threads
                    </Button>
                    <Button
                        flex={1}
                        variant="ghost"
                        borderRadius="none"
                        py={6}
                        color="gray.400"
                        _hover={{ bg: 'transparent', color: 'gray.300' }}
                    >
                        Replies
                    </Button>
                </Flex>
            </VStack>
        </Container>
    );
};

export default UserHeader;