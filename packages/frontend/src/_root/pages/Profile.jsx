import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { UserContext } from "@/Context/UserContext";
import { Button } from "@/components/ui/button";
import GridPostList from "@/components/Shared/GridPostList";
import Loader from "@/components/Shared/Loader";
import { toast } from "react-hot-toast";
import api from "@/api/axios";

const StatBlock = ({ value, label }) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { userData, userToken } = useContext(UserContext);
  const { pathname } = useLocation();

  const [currentUser, setCurrentUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [showLikedPosts, setShowLikedPosts] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchUserProfile = async () => {
        try {
          const response = await api.get(
            `/api/v1/auth/user/userByID/${id}`,
            {
              headers: { Authorization: `Bearer ${userToken}` },
            }
          );
          setCurrentUser(response.data);
        } catch (error) {
          toast.error(error.response?.data?.message || "Error fetching user profile");
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [id, userToken]);

  useEffect(() => {
    if (id) {
      const fetchPosts = async () => {
        setPostsLoading(true);
        try {
          const [userPostsResponse, likedPostsResponse] = await Promise.all([
            api.get(`/api/v1/auth/post/user-post/${id}`, {
              headers: { Authorization: `Bearer ${userToken}` },
            }),
            api.get(`/api/v1/auth/post/user/${id}/liked`, {
              headers: { Authorization: `Bearer ${userToken}` },
            }),
          ]);
      
          setUserPosts(userPostsResponse.data.posts || []);
          setLikedPosts(likedPostsResponse.data.likedPosts || []);
        } catch (error) {
          if (error.response?.status === 404) {
            console.error("This user hasn't posted anything yet");
          } else {
            console.error("Error fetching posts:", error);
          }
        } finally {
          setPostsLoading(false);
        }
      };   
         fetchPosts();
    }
  }, [id, userToken]);

  if (loading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  if (!currentUser) return <p>User not found</p>;

  const isCurrentUser = userData?._id === currentUser._id;

  const postsToDisplay = showLikedPosts ? likedPosts : userPosts;

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={currentUser.profileImage.secure_url}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {`${currentUser.firstName} ${currentUser.lastName}`}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{`${currentUser.firstName} ${currentUser.lastName}`}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={userPosts.length} label="Posts" />
              <StatBlock value={likedPosts.length} label="Liked Posts" />
              <StatBlock value={currentUser.followersCount} label="Followers" />
              <StatBlock value={currentUser.following.length} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio || "No bio available"}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {isCurrentUser ? (
              <Link
                to={`/update-profile/${currentUser._id}`}
                className="h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg"
              >
                <img
                  src={"/assets/images/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            ) : (
              <Button type="button" className="shad-button_primary px-8">
                Follow
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex max-w-5xl w-full">
        <button
          onClick={() => setShowLikedPosts(false)}
          className={`profile-tab rounded-l-lg ${!showLikedPosts && "!bg-dark-3"}`}
        >
          <img src={"/assets/images/posts.svg"} alt="posts" width={20} height={20} />
          Posts
        </button>
        <button
          onClick={() => setShowLikedPosts(true)}
          className={`profile-tab rounded-r-lg ${showLikedPosts && "!bg-dark-3"}`}
        >
          <img src={"/assets/images/like.svg"} alt="like" width={20} height={20} />
          Liked Posts
        </button>
      </div>

      {postsLoading ? (
        <Loader />
      ) : (
        <GridPostList posts={postsToDisplay} showUser={false} />
      )}
    </div>
  );
};

export default Profile;