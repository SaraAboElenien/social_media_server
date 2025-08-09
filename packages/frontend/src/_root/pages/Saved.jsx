import React, { useEffect, useState, useContext } from 'react';
import Loader from '@/components/Shared/Loader';
import { UserContext } from '@/Context/UserContext';
import GridPostList from '@/components/Shared/GridPostList';
import { toast } from 'react-hot-toast';
import api from '@/api/axios';


const Saved = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useContext(UserContext);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await api.get(
          '/api/v1/auth/post/saved-posts',
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setSavedPosts(response.data.savedPosts.reverse());
      } catch (err) {
        toast.error(
          err.response?.data?.message || 'Failed to load saved posts.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, [userToken]);

  if (loading) return <Loader />;

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/images/saved.svg"
          width={36}
          height={36}
          alt="Saved Icon"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {savedPosts.length === 0 ? (
        <p className="text-light-4">No available posts</p>
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          <GridPostList posts={savedPosts} showStats={false} />
        </ul>
      )}
    </div>
  );
};

export default Saved;
