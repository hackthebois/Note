import { useAuth } from "~/lib/auth";
import { ProfilePage } from "../(feed,home,search,profile)/[handle]";

const Profile = () => {
	const profile = useAuth((s) => s.profile);
	return <ProfilePage handle={profile!.handle} />;
};

export default Profile;
