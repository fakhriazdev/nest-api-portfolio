import * as bcrypt from 'bcrypt';


export const encodePassord = (password:string) => {
    const SALT = bcrypt.genSaltSync()
    return bcrypt.hash(password,SALT)
}

export const comparePassword = async (password: string, hashPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashPassword);
}

export const encoder = (value:string) => {
    const SALT = bcrypt.genSaltSync()
    return bcrypt.hash(value,SALT)
}