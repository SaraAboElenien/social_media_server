import { Button } from "../ui/button";
import React, { useContext } from "react";
import { UserContext } from "@/Context/UserContext";
import { toast } from "react-hot-toast";
import api from "@/api/axios";
import { Link } from "react-router-dom";
const UserCard = ({ user }) => {
  const { userToken } = useContext(UserContext);

  const handleFollow = async () => {
    if (!userToken) {
      toast.error("You need to be logged in to follow a user.");
      return;
    }
    try {
      const response = await api.put(
        `/api/v1/auth/user/${user._id}/follow`,
        { action: "follow" },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      toast.success(response.data.message || "Successfully followed the user!");
    } catch (err) {
      toast.error("Error following user. Please try again.");
    }
  };

  return (
    <div className="user-card">
      <Link to={`/profile/${user._id}`} className="flex-center flex-col gap-2">
        <img
          src={user.profileImage.secure_url || '/assets/images/profile-placeholder.svg'}
          alt={`${user.firstName}'s Profile`}
          className="rounded-full w-14 h-14"
        />
        <div className="flex-center flex-col gap-1">
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.firstName} {user.lastName}
          </p>
          <p className="small-regular text-light-3 text-center line-clamp-1">
            @{user.firstName.toLowerCase()}
          </p>
        </div>
      </Link>
      <Button
        type="button"
        size="sm"
        className="shad-button_primary px-5"
        onClick={handleFollow}
      >
        Follow
      </Button>
    </div>
  );
};

export default UserCard;
