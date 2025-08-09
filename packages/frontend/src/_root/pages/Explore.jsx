import React, { useEffect, useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import GridPostList from "@/components/Shared/GridPostList";
import Loader from "@/components/Shared/Loader";
import useDebounce from "@/hooks/useDebounce";
import { UserContext } from '@/Context/UserContext';
import { toast } from 'react-hot-toast';
import api from "@/api/axios";



const SearchResults = ({ isSearchFetching, searchedPosts }) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchedPosts, setSearchedPosts] = useState(null);
  const [isSearchFetching, setIsSearchFetching] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [inView, setInView] = useState(false);
  const { userToken } = useContext(UserContext);
  const debouncedSearch = useDebounce(searchValue, 500);


  const fetchPosts = async () => {
    try {
      const response = await api.get("/api/v1/auth/post/recent-post", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setPosts(response.data.documents || []); 
      setHasNextPage(response.data.hasNextPage); 
    } catch (error) {
      toast.error("Error fetching posts.");
    }
  };


  const searchPosts = async (searchQuery) => {
    if (!searchQuery) return;
    setIsSearchFetching(true);
    try {
      const response = await api.get(`/api/v1/auth/post/recent-post?search=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setSearchedPosts(response.data);
    } catch (error) {
      toast.error("Error fetching search results.");
    } finally {
      setIsSearchFetching(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      searchPosts(debouncedSearch);
    } else {
      setSearchedPosts(null); 
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !searchValue && hasNextPage) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      {
        rootMargin: "100px", 
      }
    );

    const element = document.getElementById("load-more");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [searchValue, hasNextPage]);

  useEffect(() => {
    if (inView) {
      fetchPosts();
    }
  }, [inView]);

  if (!posts.length && !isSearchFetching) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults && posts.length > 0;

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/images/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/images/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <GridPostList posts={posts} />
        ) : (
          <p className="text-light-4 mt-10 text-center w-full">No posts available</p>
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div id="load-more" className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
