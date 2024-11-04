import { Button } from "@chakra-ui/button";
import { useSetRecoilState } from "recoil";

import useShowToast from "../hooks/useShowToast";
import userAtom from "../atom/userAtom";
import { Navigate, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();
    const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			const res = await fetch("/api/users/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			localStorage.removeItem("user-threads");
			setUser(null);
            navigate('/auth');
		} catch (error) {
			console.log("not entering");
			
			showToast("Error", error, "error");
		}
	};
	return (
		<Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout}>
			<FiLogOut 
			size={20}
			onClick={handleLogout}
			/>
		</Button>
	);
};

export default LogoutButton;