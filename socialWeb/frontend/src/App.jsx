import { Button, Container } from "@chakra-ui/react";
import UserPage from "./Pages/UserPage";
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import PostPage from "./Pages/PostPage";
import Header from "./Components/Header";
import HomePage from "./Pages/HomePage.jsx";
import Auth from "./Pages/Auth.jsx";
import { useRecoilValue } from "recoil";
import userAtom from "./atom/userAtom.js";
import LogoutButton from "./Components/LogoutButton.jsx";
import UpdateProfilePage from "./Pages/UpdateProfilePage.jsx";
import CreatePost from "./Components/CreatePost.jsx";

function App() {
  const user = useRecoilValue(userAtom);
  return (
    <BrowserRouter>
      <Container maxW='620px'>
      <Header/>
        <Routes>
          <Route path="/" element={user ? <HomePage/> : <Navigate to="/auth"/>}/>
          <Route path="/auth" element={!user?  <Auth /> : <Navigate to="/"/>} />
          <Route path="/update" element={user?  <UpdateProfilePage /> : <Navigate to="/"/>} />
          
          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:pid" element={<PostPage/>}/>
        </Routes>
        {user && <LogoutButton/>}
        {user && <CreatePost/>}
      </Container>
    </BrowserRouter>
  );
}

export default App;
