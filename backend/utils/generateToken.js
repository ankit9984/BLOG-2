import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
    res.cookie('jwt', token), {
        maxAge: 15*24*60*60*1000,
        httponly: true,
        sameSite: 'strict'
    }
}