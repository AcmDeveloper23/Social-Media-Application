import { useRouter } from 'next/router';

const PostPage = () => {

    const router = useRouter();

    const { postId } = router.query;

    return (
        <>
        {postId}
        </>
    )
}

export default PostPage