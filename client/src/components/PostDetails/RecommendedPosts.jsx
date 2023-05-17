import { Typography, Grid } from '@mui/material'
import { Root, classes } from './styles'
import { PostCard, LoadingCard } from '../User/Cards'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getRecommendedPosts } from '../../actions/posts'

const RecommendedPosts = ({ user, tags, post_id }) => {
	const dispatch = useDispatch()
	const userId = user?.result.googleId || user?.result._id
	useEffect(() => dispatch(getRecommendedPosts(tags.join(','))), [tags])
	const { recommendedPosts, isFetchingRecommendedPosts: isLoading } = useSelector((state) => state.posts)

	const posts = recommendedPosts?.filter(({ _id }) => _id !== post_id)
	return (
		<Root className={classes.root} sx={{ width: '100%' }}>
			<Typography variant="h5" styles={{ textAlign: 'left' }}>
				Você pode gostar também:
			</Typography>
			<div className={classes.recommendedPosts}>
				<div style={{ width: '100%' }}>
					{!isLoading && !posts.length ? (
						<Typography className={classes.notFound} gutterBottom variant="h6">
							Nenhuma postagem encontrada com esta etiqueta.
						</Typography>
					) : (
						<Grid className={classes.recommendedPostGrid} container spacing={3}>
							{isLoading ? [...Array(10).keys()].map((key) => <LoadingCard key={key} />) : posts.map((post, key) => <PostCard key={key} post={post} userId={userId} />)}
						</Grid>
					)}
				</div>
			</div>
		</Root>
	)
}

export default RecommendedPosts
