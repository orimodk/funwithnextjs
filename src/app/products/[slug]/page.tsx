export async function generateStaticParams() {
    const posts = await fetch('..data/../merged.json').then((res) => res.json())
   
    return posts.map((post: { slug: any }) => ({
      slug: post.slug,
    }))
  }