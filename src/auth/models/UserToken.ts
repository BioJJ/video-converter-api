export interface UserToken {
	access_token: string
	sub: number
	email: string
	name: string
	role?: UserRole
}

export enum UserRole {
	USER = 'user',
	ADMIN = 'admin'
}
