import { useEffect, useState } from 'react'
import { Root, classes } from './styles'
import { Paper, Typography, Divider, Avatar, LinearProgress, Box, Chip, Tabs, Tab, Button, Tooltip } from '@mui/material'
import { PublishedWithChanges } from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import Avaatar from 'avataaars'
import { getUserDetails, getPostsBySearch } from '../../../actions/posts'
import { getUserPostsByType } from '../../../actions/posts'
import TabPage from '../TabPage'
import { useNavigate, Link } from 'react-router-dom'

import SwipeableViews from 'react-swipeable-views'
import { useTheme } from '@mui/material/styles'

const LinearProgressWithLabel = (props) => (
	<Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
		<Box sx={{ width: '100%', mr: 1 }}>
			<LinearProgress variant="determinate" {...props} color="success" />
		</Box>
		<Box sx={{ minWidth: 35 }}>
			<Typography variant="body2" color="white">{`${Math.round(props.value)}%`}</Typography>
		</Box>
	</Box>
)
const TabPanel = ({ children, value, index, ...other }) => (
	<div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
		{value === index && <Box>{children}</Box>}
	</div>
)

const CREATED = 'created'
const LIKED = 'liked'
const PRIVATE = 'private'

const UserDetails = ({ user }) => {
	const theme = useTheme()
	const history = useNavigate()
	const dispatch = useDispatch()

	const [value, setValue] = useState(0)
	const [progress, setProgress] = useState(0)
	const [likedPage, setLikedPage] = useState(1)
	const [createdPage, setCreatedPage] = useState(1)
	const [privatePage, setPrivatePage] = useState(1)

	const { data, isLoading } = useSelector((state) => state.posts)
	const { createdPosts, createdNumberOfPages, isFetchingCreatedPosts } = useSelector((state) => state.posts)
	const { likedPosts, likedNumberOfPages, isFetchingLikedPosts } = useSelector((state) => state.posts)
	const { privatePosts, privateNumberOfPages, isFetchingPrivatePosts } = useSelector((state) => state.posts)
	const userId = user.result._id || user.result.googleId

	useEffect(() => dispatch(getUserDetails(userId)), [user])
	useEffect(() => dispatch(getUserPostsByType(userId, createdPage, CREATED)), [createdPage])
	useEffect(() => dispatch(getUserPostsByType(userId, likedPage, LIKED)), [likedPage])
	useEffect(() => dispatch(getUserPostsByType(userId, privatePage, PRIVATE)), [privatePage])

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prevProgress) => (prevProgress >= 90 ? (isLoading ? 90 : 100) : prevProgress + 10))
		}, 300)
		return () => clearInterval(timer)
	}, [isLoading])
	const openPostsWithTag = (tag) => {
		dispatch(getPostsBySearch({ tags: tag }))
		history(`/posts/search?searchQuery=none&tags=${tag}`)
	}

	const { postsCreated, postsLiked, privatePosts: numberOfPrivatePosts, totalLikesRecieved, longestPostWords, top5Tags, longestPostId } = data
	const labels = {
		Email: user.result.email,
		'Postagens criadas': postsCreated,
		'Postagens com gostou': postsLiked,
		'Postagens privadas': numberOfPrivatePosts,
		'Gostou recebido': totalLikesRecieved,
	}
	const createdProps = {
		page: createdPage,
		setPage: setCreatedPage,
		posts: createdPosts,
		numberOfPages: createdNumberOfPages,
		isLoading: isFetchingCreatedPosts,
		userId: userId,
		notDoneText: 'Nenhuma postagem criada',
	}
	const likedProps = {
		page: likedPage,
		setPage: setLikedPage,
		posts: likedPosts,
		numberOfPages: likedNumberOfPages,
		isLoading: isFetchingLikedPosts,
		userId: userId,
		notDoneText: 'Nenhuma postagem com gostou',
	}
	const privateProps = {
		page: privatePage,
		setPage: setPrivatePage,
		posts: privatePosts,
		numberOfPages: privateNumberOfPages,
		isLoading: isFetchingPrivatePosts,
		user: user,
		notDoneText: 'Nenhuma postagem privada',
	}
	return (
		<Root className={classes.root}>
			<div className={classes.userContainer}>
				<Paper className={classes.userIcon} elevation={6}>
					{user.result.avatar ? (
						<Avaatar className={classes.avatar} {...user.result.avatar} />
					) : (
						<Avatar className={classes.avatar} alt={user.result.name} src={user.result.imageUrl}>
							<Typography variant="h1" color="white">
								{user.result.name.charAt(0)}
							</Typography>
						</Avatar>
					)}
					<Button variant="contained" disabled={Boolean(user.result.googleId)} component={Link} to="/user/update" startIcon={<PublishedWithChanges />}>
						ATUALIZAR DETALHES
					</Button>
				</Paper>
				<Paper className={classes.userDetails} elevation={6}>
					{progress < 100 || isLoading ? (
						<Box className={classes.loadingLine}>
							<Typography color="white">Carregando detalhes do usuário ...</Typography>
							<LinearProgressWithLabel value={progress} />
						</Box>
					) : (
						<div>
							{Object.entries(labels).map(([label, data], key) => (
								<Box key={key}>
									<Typography color="white">
										<strong style={{ color: 'black' }}>{label}: </strong>
										{data}
									</Typography>
									<Divider />
								</Box>
							))}
							<Box>
								<Typography color="white">
									<strong style={{ color: 'black' }}>Postagem mais longa escrita: </strong>
									<Tooltip title="Post with longest message">
										<Link to={`/posts/${longestPostId}`} style={{ color: 'white', textDecoration: 'none' }}>{`${longestPostWords} palavras`}</Link>
									</Tooltip>
								</Typography>
								<Divider />
							</Box>
							<div className={classes.tagsContainer}>
								<Typography color="white" style={{ whiteSpace: 'nowrap' }}>
									<strong style={{ color: 'black' }}>Top 5 Etiquetas: </strong>
								</Typography>
								<Box sx={{ marginLeft: 1 }}>{top5Tags.length ? top5Tags.map((tag, key) => <Chip key={key} label={tag} onClick={() => openPostsWithTag(tag)} className={classes.chips} />) : <Chip label="Nenhuma etiqueta" className={classes.chips} />}</Box>
							</div>
						</div>
					)}
					<Typography variant="h5" className={classes.newUser} sx={{ display: !postsCreated && !(progress < 100 || isLoading) ? 'initial' : 'none' }}>
						🎉Novo Usuário🎉
					</Typography>
				</Paper>
			</div>
			<Paper className={classes.loadingPaper} elevation={6}>
				<Box sx={{ width: '100%' }}>
					<Tabs value={value} onChange={(_, newValue) => setValue(newValue)} aria-label="basic tabs">
						<Tab label="CRIADO" />
						<Tab label="COM GOSTOU" />
						<Tab label="PRIVADO" />
					</Tabs>
					<SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={(index) => setValue(index)}>
						<TabPanel value={value} index={0} dir={theme.direction}>
							<TabPage {...createdProps} />
						</TabPanel>
						<TabPanel value={value} index={1} dir={theme.direction}>
							<TabPage {...likedProps} />
						</TabPanel>
						<TabPanel value={value} index={2} dir={theme.direction}>
							<TabPage {...privateProps} />
						</TabPanel>
					</SwipeableViews>
				</Box>
			</Paper>
		</Root>
	)
}

export default UserDetails
