import { atom } from "recoil";

const authScreenAtom = atom({
    key: 'auth ScreenAtom',
    default: "login",
})

export default authScreenAtom;