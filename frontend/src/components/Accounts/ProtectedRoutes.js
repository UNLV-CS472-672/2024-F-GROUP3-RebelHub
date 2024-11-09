import { jwtDecode } from "jwt-decode";
import api from "@/utils/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "@/utils/constants";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTokenRefreshUserUrl, gotoLoginPage } from "@/utils/url-segments";

//This handles authentication for users on certain pages that need to be
//protected from access if not logged in. Access tokens are good for 30 minutes
//and refresh tokens are good for a day. Therefore following login you should stay
//logged in for a day. Whenever rendering a page that is associated with user it must be
//wrapped in this function
function ProtectedRoute( {children} ) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const router = useRouter();

 useEffect(() => {
        if ( children.type.name == "register") {
            localStorage.clear();  // Clear local storage
        }
    }, [children]);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        console.log("Refreshing Token")
        try {
            const res = await api.post(getTokenRefreshUserUrl(), {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                console.log("Refresh Succesful")
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };
    //This will get the access token present in local storage if it is there
    //If there is no token in localstorage then set authorize to false
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000; //date in seconds

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        router.push(gotoLoginPage());  // Redirect to login if unauthorized
        return null;  // Prevent rendering the children
    }
    return children;
}
export default ProtectedRoute
