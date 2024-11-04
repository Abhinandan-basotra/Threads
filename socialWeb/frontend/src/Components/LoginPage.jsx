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
  FormHelperText,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atom/authAtom";
import userAtom from "../atom/userAtom";  // Import userAtom
import useShowToast from "../hooks/useShowToast"; // Assume you have this hook for showing toasts
import { useNavigate } from "react-router-dom";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);  // Loading state
  const toast = useShowToast();
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userAtom);  // Initialize the userAtom

  const handleShowClick = () => setShowPassword(!showPassword);
  
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const boxBgColor = useColorModeValue("white", "gray.800");
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const validateForm = () => {
    if (!input.username || !input.password) {
      toast("Error", "Username and password are required.", "error");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    console.log(input);
    
    e.preventDefault();  // Prevent page reload
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (data.error) {
        toast("Error", data.error, "error");
        return;
      }

      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);  // Update user state
      navigate('/home');  // Redirect to the home page

    } catch (error) {
      console.error("Login error:", error);
      toast("Error", error.message || "An error occurred during login", "error");  // Pass the error message
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
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" size="xl" mb={4} />
        <Heading color="teal.400" mb={2}>
          Welcome Back
        </Heading>
        <Text fontSize="lg" color="gray.500" mb={4}>
          Please login to continue
        </Text>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleLogin}>  {/* Add onSubmit to form */}
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
                    placeholder="Username"
                    value={input.username}
                    onChange={(e) =>
                      setInput({ ...input, username: e.target.value })
                    }
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.400"
                    children={<CFaLock color="gray.400" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) =>
                      setInput({ ...input, password: e.target.value })}
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
                <FormHelperText textAlign="right">
                  <Link color="teal.500">Forgot password?</Link>
                </FormHelperText>
              </FormControl>
              <Button
                borderRadius="full"
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                isLoading={loading}
                loadingText="Logging in"
                _hover={{ backgroundColor: "teal.600" }}
                _active={{ backgroundColor: "teal.700" }}
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box mt={4}>
        <Text fontSize="sm">
          New to us?{" "}
          <Link
            color="teal.500"
            onClick={() => setAuthScreen("signup")}
            cursor="pointer"
          >
            Sign Up
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default LoginPage;
