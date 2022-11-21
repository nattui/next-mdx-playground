import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import path from "path";

export default function Blog(props) {
  console.log(":::: props.posts:", props.posts);
  return (
    <div>
      {props.posts.map((post, index) => {
        return (
          <Link
            className="flex flex-col rounded-md border border-solid border-gray-4 bg-gray-900 p-4 transition-colors hover:bg-gray-800"
            href={`blog/${post.slug}`}
            key={index}
          >
            <p>{post.author}</p>
            <p>{post.date}</p>
            <p>{post.description}</p>
            <p>{post.slug}</p>
            <p>{post.title}</p>
          </Link>
        );
      })}
    </div>
  );
}

export async function getStaticProps() {
  // Gets files in `markdown/blog` directory
  const files = fs.readdirSync(path.join("markdown", "blog"));

  // Format data
  const posts = files.map((filename) => {
    // Get file content
    const content = fs.readFileSync(
      path.join("markdown", "blog", filename),
      "utf-8"
    );
    const { data } = matter(content);
    data.slug = filename.split(".")[0];
    return data;
  });

  return {
    props: {
      posts: posts,
    },
  };
}
