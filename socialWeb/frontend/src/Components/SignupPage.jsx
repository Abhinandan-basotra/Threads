import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock, FaEnvelope } from "react-icons/fa";
import authScreenAtom from "../atom/authAtom";
import { useSetRecoilState } from "recoil";
import userAtom from "../atom/userAtom";
import useShowToast from "../hooks/useShowToast";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
const CFaEnvelope = chakra(FaEnvelope);

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const toast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const boxBgColor = useColorModeValue("white", "gray.800");

  const handleShowClick = () => setShowPassword(!showPassword);

  // Form validation
  const validateForm = () => {
    const { name, username, email, password } = input;
    if (!name || !username || !email || !password) {
      toast("Error", "All fields are required.", "error");
      return false;
    }
    return true;
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      // Check response status
      if (!res.ok) {
        let errorMessage = "An error occurred";
        const contentType = res.headers.get("content-type");

        // Check if response is JSON
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } else {
          // Handle non-JSON responses
          const errorText = await res.text(); // Capture the raw response
          console.error("Server returned non-JSON response:", errorText);
          errorMessage = "Unexpected response from server.";
        }

        toast("Error", errorMessage, "error");
        return;
      }

      const data = await res.json(); // Parse JSON response
      console.log(data); // Log for debugging

      localStorage.setItem("user-threads", JSON.stringify(data));
      toast("Success", "Signup successful!", "success");
    } catch (err) {
      console.error("Error during signup:", err); // Log error for debugging
      toast("Error", err.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor={bgColor}
      justifyContent="center"
      alignItems="center"
    >
      <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
        <Avatar bg="teal.500" size="xl" mb={4} />
        <Heading color="teal.400" mb={2}>
          Create an Account
        </Heading>
        <Text fontSize="lg" color="gray.500" mb={4}>
          Please fill in the form to sign up
        </Text>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSignup}>
            <Stack
              spacing={4}
              p="1.5rem"
              backgroundColor={boxBgColor}
              boxShadow="2xl"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.300"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.400" />}
                  />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    onChange={(e) =>
                      setInput({ ...input, name: e.target.value })
                    }
                    value={input.name}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.400" />}
                  />
                  <Input
                    type="text"
                    placeholder="Username"
                    onChange={(e) =>
                      setInput({ ...input, username: e.target.value })
                    }
                    value={input.username}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaEnvelope color="gray.400" />}
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    onChange={(e) => setInput({ ...input, email: e.target.value })}
                    value={input.email}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaLock color="gray.400" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => setInput({ ...input, password: e.target.value })}
                    value={input.password}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleShowClick}
                      variant="ghost"
                      _hover={{ backgroundColor: "teal.100", color: "black" }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                borderRadius="full"
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                isLoading={loading}
                loadingText="Signing up"
                _hover={{ backgroundColor: "teal.600" }}
                _active={{ backgroundColor: "teal.700" }}
              >
                Sign Up
              </Button>
            </Stack>
          </form>
        </Box>
        <Box mt={4}>
          <Text fontSize="sm">
            Already have an account?{" "}
            <Link color="teal.500" href="#" onClick={() => setAuthScreen("login")}>
              Login here
            </Link>
          </Text>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignupPage;
