import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { faker } from "@faker-js/faker";
import { useSearchContext } from "./SearchContext";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

const PostContext = createContext();

function PostContextProvider({ children }) {
  const { searchQuery } = useSearchContext();
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  const handleAddPost = useCallback(function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }, []);

  const handleClearPosts = useCallback(function handleClearPosts() {
    setPosts([]);
  }, []);

  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onAddPost: handleAddPost,
      onClearPosts: handleClearPosts,
    };
  }, [searchedPosts, handleAddPost, handleClearPosts]);

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

function usePostContext() {
  return useContext(PostContext);
}

export { PostContextProvider, usePostContext };
