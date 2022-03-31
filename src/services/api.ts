// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function loadPosts(post: string) {
  // Call an external API endpoint to get posts
  const res = await fetch(post);
  const data = await res.json();

  return data;
}
