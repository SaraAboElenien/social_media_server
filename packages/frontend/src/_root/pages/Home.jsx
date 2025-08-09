import React, { useEffect, useState, useContext } from 'react';
import api from '@/api/axios';
import Loader from '@/components/Shared/Loader';
import PostCard from '@/components/Shared/PostCard';
import UserCard from '@/components/Shared/UserCard'; 
import { UserContext } from '@/Context/UserContext';
import { toast } from 'react-hot-toast';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [creators, setCreators] = useState([]);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isErrorPosts, setIsErrorPosts] = useState(false);
  const [isErrorCreators, setIsErrorCreators] = useState(false);
  const { userToken } = useContext(UserContext);

  useEffect(() => {
    api
      .get('/api/v1/auth/post/recent-post', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        if (response.status === 204) {
          setPosts([]); 
        } else {
          setPosts(response.data.documents || []);
        }
        setIsPostLoading(false);
      })
      .catch((error) => {
        toast.error('Error fetching posts.');
        setIsErrorPosts(true);
        setIsPostLoading(false);
      });

    api
      .get('/api/v1/auth/user/list', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        setCreators(response.data.users);
        setIsUserLoading(false);
      })
      .catch((error) => {
        toast.error('Error fetching users.');
        setIsErrorCreators(true);
        setIsUserLoading(false);
      });
  }, [userToken]);

  return (
    <div className="flex flex-1">
      <div className="home-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src='/assets/images/home.svg'
          width={36}
          height={36}
          alt="Saved Icon"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
      </div>
          {isPostLoading ? (
            <Loader />
          ) : isErrorPosts ? (
            <p>Error loading posts.</p>
          ) : (
            <ul className="flex flex-col flex-1 gap-1 w-full">
              {posts?.map((post) => (
                <li key={post._id} className="flex  justify-center mb-4 w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>



      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading ? (
          <Loader />
        ) : isErrorCreators ? (
          <p>Error loading creators.</p>
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.map((creator) => (
              <li key={creator._id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
