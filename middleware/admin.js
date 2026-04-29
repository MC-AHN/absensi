export const adminOnly = async (c, next) => {
    const user = c.get('user');

    if (user.role !== 'admin') {
        return c.json({ message: 'Forbidden: Admin Only' }, 403);
    }

    await next();
};