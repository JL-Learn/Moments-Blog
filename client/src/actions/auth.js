import { AUTH } from '../constants/actionTypes'
import * as api from '../api'

export const signin = (formData, history, snackBar) => async (dispatch) => {
	try {
		// log in the user ...
		const { data } = await api.signIn(formData)
		dispatch({ type: AUTH, data })
		snackBar('success', 'Logado com sucesso')
		history('/')
	} catch (error) {
		snackBar('error', error.response.data.message)
	}
}

export const signup = (formData, history, snackBar) => async (dispatch) => {
	try {
		// sign up the user ...
		const { data } = await api.signUp(formData)
		dispatch({ type: AUTH, data })
		snackBar('success', 'Inscrito(a) com sucesso! Bem-Vindo(a) a Moments!')
		history('/')
	} catch (error) {
		snackBar('error', error.response.data.message)
	}
}

export const forgotPassword = (formData, history, snackBar) => async () => {
	try {
		await api.sendResetLink(formData)
		snackBar('success', 'Um link de redefinição de senha foi enviado para seu email. Acesse e clique no link')
		history('/')
	} catch (error) {
		snackBar('error', error.response.data.message)
	}
}

export const setNewPassword = (formData, history, snackBar) => async () => {
	try {
		await api.setNewPassword(formData)
		snackBar('success', 'Senha redefinida com sucesso.')
		history('/')
	} catch (error) {
		snackBar('error', error.response.data.message)
	}
}
