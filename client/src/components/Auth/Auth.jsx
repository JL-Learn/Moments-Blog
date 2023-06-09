import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Avatar, Button, Paper, Grid, Typography, Container, Checkbox } from '@mui/material'
import { GoogleLogin } from 'react-google-login'
import { Link, useNavigate } from 'react-router-dom'
import { Root, classes } from './styles'
import { signin, signup } from '../../actions/auth'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Input from '../Input'
import Icon from './Icon'
import UserIcon from '../UserIcon/UserIcon'

import { styled } from '@mui/material/styles'

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', remember: false }
const CLIENT_ID = "564033717568-bu2nr1l9h31bhk9bff4pqbenvvoju3oq.apps.googleusercontent.com";

const Auth = ({ snackBar }) => {
	const [showPassword, setShowPassword] = useState(false)
	const [isSignup, setIsSignUp] = useState(false)
	const [formData, setFormData] = useState(initialState)
	const [margin, setMargin] = useState('200px')

	const dispatch = useDispatch()
	const history = useNavigate()
	const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)
	const handleRememberMe = () => setFormData({ ...formData, remember: !formData.remember })
	const handleSubmit = (e) => {
		e.preventDefault()
		dispatch((isSignup ? signup : signin)(formData, history, snackBar))
	}
	const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
	const switchMode = () => {
		setIsSignUp((prevIsSignUp) => !prevIsSignUp)
		setShowPassword(false)
	}
	const googleSuccess = async (res) => {
		const result = res?.profileObj
		const token = res?.tokenId

		try {
			dispatch({ type: 'AUTH', data: { result, token } })
			history('/')
			snackBar('success', 'Logado com sucesso')
		} catch (error) {
			snackBar('error', error)
		}
	}
	const googleFailure = ({ error }) => {
		if (error === 'popup_closed_by_user') {
			return snackBar('warning', 'PopUp fechado pelo usuário')
		}
		snackBar('error', 'O login do Google não foi bem-sucedido. Tente mais tarde.')
	}

	useEffect(() => setMargin(isSignup ? '50px' : '200px'), [isSignup])

	return (
		<Root className={classes.root}>
			<Container component="main" maxWidth="xs">
				<Paper className={classes.paper} elevation={6} style={{ marginTop: margin }}>
					{isSignup ? (
						<UserIcon formData={formData} setFormData={setFormData} />
					) : (
						<Avatar className={classes.avatar}>
							<LockOutlinedIcon />
						</Avatar>
					)}
					<Typography variant="h5">{isSignup ? 'Inscrever-se' : 'Entrar'}</Typography>
					<form className={classes.form} onSubmit={handleSubmit}>
						<Grid container spacing={1}>
							{isSignup && (
								<>
									<Input name="firstName" label="Nome" onChange={handleChange} autoFocus half />
									<Input name="lastName" label="Sobrenome" onChange={handleChange} half />
								</>
							)}
							<Input name="email" label="Endereço de email" onChange={handleChange} type="email" />
							<Input name="password" label="Senha" onChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
							{isSignup && <Input name="confirmPassword" label="Repetir senha" onChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />}
						</Grid>

						<Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
							{isSignup ? 'Inscrever-se' : 'Entrar'}
						</Button>
						<GoogleLogin
							clientId={CLIENT_ID}
							render={(renderProps) => (
								<Button className={classes.googleButton} onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} color="primary" variant="contained" fullWidth>
									GOOGLE SIGN IN
								</Button>
							)}
							onSuccess={googleSuccess}
							onFailure={googleFailure}
							cookiePolicy="single_host_origin"
						/>

						<Grid container justifyContent="center">
							<Grid item>
								<Button onClick={switchMode}>{isSignup ? 'Já tem uma conta? Entrar' : "Não tem uma conta? Inscrever-se"}</Button>
							</Grid>
						</Grid>
						<Grid container justifyContent="space-between" display={isSignup ? 'none' : 'flex'}>
							<Button style={{ paddingLeft: 0 }} onClick={handleRememberMe} disableElevation disableRipple>
								<BpCheckbox checked={formData.remember} />
								Lembre de mim
							</Button>
							<Button component={Link} to="forgotPassword">
								Esqueceu sua senha
							</Button>
						</Grid>
					</form>
				</Paper>
			</Container>
		</Root>
	)
}

const BpIcon = styled('span')(({ theme }) => ({
	borderRadius: 3,
	width: 16,
	height: 16,
	boxShadow: theme.palette.mode === 'dark' ? '0 0 0 1px rgb(16 22 26 / 40%)' : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
	backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
	backgroundImage: theme.palette.mode === 'dark' ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))' : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
	'.Mui-focusVisible &': {
		outline: '2px auto rgba(19,124,189,.6)',
		outlineOffset: 2,
	},
	'input:hover ~ &': {
		backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
	},
	'input:disabled ~ &': {
		boxShadow: 'none',
		background: theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
	},
}))

const BpCheckedIcon = styled(BpIcon)({
	backgroundColor: '#137cbd',
	backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
	'&:before': {
		display: 'block',
		width: 16,
		height: 16,
		backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" + " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " + "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
		content: '""',
	},
	'input:hover ~ &': {
		backgroundColor: '#106ba3',
	},
})

const BpCheckbox = (props) => {
	return (
		<Checkbox
			sx={{
				'&:hover': { bgcolor: 'transparent' },
			}}
			checked={props.checked}
			disableRipple
			color="default"
			checkedIcon={<BpCheckedIcon />}
			icon={<BpIcon />}
			inputProps={{ 'aria-label': 'Checkbox demo' }}
			{...props}
		/>
	)
}

export default Auth
