import { sign, verify } from 'hono/jwt';

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    throw new Error("JWT_SECRET not found in enviroment variable");
}

/**
 * for JWT token from data user
 * @param ({ id: number, name: String, role: String }) payload
 * @returns {Promise<string>} token
*/

export async function createToken(payload) {
    return await sign({
        ...payload,
        exp: Math.floor(Date.now() / 1000) * 60 * 60 * 24,
    },
        SECRET,
        'HS256',
    );
}

/**
 * Verifikasi and decode JWT token.
 * throw error if token invalid or expired.
 * @param {string} token
 * @returns {Promise<{ id: number, name: string, role: string }>}
*/
export async function verifyToken(token) {
    return await verify(token, SECRET, { alg: "HS256" });
}