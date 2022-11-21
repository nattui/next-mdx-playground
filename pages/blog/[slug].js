import fs from "fs";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Link from "next/link";
import path from "path";

export default function BlogPost(props) {
  console.log(":::: posts:", props);
  return (
    <div>
      <Link href="/blog">← Back</Link>

      <h1>{props.data.title}</h1>
      <p>{props.data.description}</p>
      <p>{props.data.author}</p>
      <p>{props.data.date}</p>
      <p>{props.slug}</p>

      <MDXRemote {...props.content} />
    </div>
  );
}

export async function getStaticPaths() {
  // Gets files in `markdown/blog` directory
  const files = fs.readdirSync(path.join("markdown", "blog"));

  // Get paths with slug
  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(".mdx", ""),
    },
  }));

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  // Get file contents
  const slug = context.params.slug;
  const fileName = path.join("markdown", "blog", slug + ".mdx");
  const fileContent = fs.readFileSync(fileName, "utf-8");

  // Create matter object
  const matterObject = matter(fileContent);
  // Front matter data
  const data = matterObject.data;
  // Parses and compiles the provided MDX string. Returns a result which can be passed into to be rendered.
  const content = await serialize(matterObject.content);

  return {
    props: {
      content: content,
      data: data,
      slug: slug,
    },
  };
}
