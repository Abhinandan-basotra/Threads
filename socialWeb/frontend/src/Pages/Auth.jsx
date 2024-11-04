import React from 'react'
import LoginPage from '../Components/LoginPage'
import { useRecoilValue } from 'recoil'
import authScreenAtom from '../atom/authAtom'
import SignupPage from '../Components/SignupPage';

function Auth() {
  const authScreenState = useRecoilValue(authScreenAtom);
  
  return (
    <>
      {authScreenState === "login"? <LoginPage/> : <SignupPage/>}
    </>
  )
}

export default Auth