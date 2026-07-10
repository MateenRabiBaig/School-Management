import { getStoredUser } from "./authStorage";

const getNavbarUser = () => {
    const user = getStoredUser()

    if(!user) {
        return { name: "User", role: "", photo: null }
    }

    return {...user, role: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "" }
}

export default getNavbarUser;