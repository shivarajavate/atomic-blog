import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { PostProvider, usePostContext } from "./PostContext";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

function App() {
  return (
    <PostProvider>
      <section>
        <Button />
        <Header />
        <Main />
        <Archive />
        <Footer />
      </section>
    </PostProvider>
  );
}

function Button() {
  const [isFakeDark, setIsFakeDark] = useState(false);

  // Whenever `isFakeDark` changes,
  // we toggle the `fake-dark-mode` class on the HTML element (see in "Elements" dev tool).
  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );
  return (
    <button
      onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
      className="btn-fake-dark-mode"
    >
      {isFakeDark ? "☀️" : "🌙"}
    </button>
  );
}

function Header() {
  const { onClearPosts } = usePostContext();
  return (
    <header>
      <Title />
      <div>
        <Results />
        <SearchPosts />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function Title() {
  return (
    <h1>
      <span>⚛️</span>The Atomic Blog
    </h1>
  );
}

function Results() {
  const { posts } = usePostContext();
  return <p>🚀 {posts.length} atomic posts found</p>;
}

function SearchPosts() {
  const { searchQuery, setSearchQuery } = usePostContext();
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Main() {
  return (
    <main>
      <FormAddPost />
      <Posts />
    </main>
  );
}

function FormAddPost() {
  const { onAddPost } = usePostContext();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!body || !title) return;
    onAddPost({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
      />
      <button>Add post</button>
    </form>
  );
}

function Posts() {
  return (
    <section>
      <List />
    </section>
  );
}

function List() {
  const { posts } = usePostContext();
  return (
    <ul>
      {posts.map((post, i) => (
        <li key={i}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

function Archive() {
  const { onAddPost } = usePostContext();
  // Here we don't need the setter function.
  // We're only using state to store these posts
  // because the callback function passed into useState (which generates the posts)
  // is only called once, on the initial render.
  // So we use this trick as an optimization technique,
  // because if we just used a regular variable,
  // these posts would be re-created on every render.
  // We could also move the posts outside the components,
  // but I wanted to show you this trick 😉
  const [posts] = useState(() =>
    // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
    Array.from({ length: 10000 }, () => createRandomPost())
  );

  const [showArchive, setShowArchive] = useState(false);

  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>

      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button onClick={() => onAddPost(post)}>Add as new post</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;
