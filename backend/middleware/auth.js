const { forAccessToken } = require('../supabaseClient');

exports.authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const client = forAccessToken(token);
        const { data: { user: authUser }, error: authError } = await client.auth.getUser(token);
        if (authError || !authUser) return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        const { data: profile, error: profileError } = await client.from('users').select('id, username, role').eq('id', authUser.id).single();
        if (profileError || !profile) return res.status(401).json({ error: 'Unauthorized: Profile not found' });
        req.user = profile;
        req.supabase = client;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

exports.authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};
