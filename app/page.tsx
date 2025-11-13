
import styles from "@/app/page.module.css"

import TreeView from "@/components/Posts/PostTreeView/PostTreeView";
import AddPostButton from "@/components/Posts/AddPostButton/AddPostButton";
import { getCurrentUser } from "./action/user";
import { getAllPosts } from "./action/post";
import { IPost } from "@/types/post";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { AvatarUpload } from "@/components/AvatarUpload/AvatarUpload";

export const revalidate = 0;

export default async function Home() {

  const user = await getCurrentUser();
  const posts = await getAllPosts();

  return (
    <>
      <Header />

      <main className={styles['main-content']}>
        {user && (
          <div className={styles['hero-section']}>
            <AvatarUpload
              currentAvatar={user.avatar}
              userName={user.name}
              userEmail={user.email}
            />
            <AddPostButton />
          </div>
        )}

        <TreeView currentUserId={user?.id} posts={posts as IPost[]} isAuthenticated={!!user} />
      </main>

      <Footer />
    </>
  );
}

