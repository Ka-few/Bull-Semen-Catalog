const { supabase, supabaseAdmin } = require('../supabaseClient');
const { throwIfError } = require('../lib/http');
const emailFor = (username) => `${String(username).trim().toLowerCase()}@users.primegenetics.local`;
exports.register = async (req, res) => { try {
  const username = String(req.body.username || '').trim().toLowerCase();
  const { password } = req.body; const role = String(req.body.role || 'farmer').toLowerCase();
  if (!/^[a-z0-9_.-]{3,64}$/.test(username)) return res.status(400).json({ error: 'Username must be 3–64 characters: letters, numbers, dot, underscore, or hyphen.' });
  if (typeof password !== 'string' || password.length < 6 || !['farmer', 'vet', 'agri-supplier'].includes(role)) return res.status(400).json({ error: 'Use a password of at least 6 characters and a valid role.' });
  // The trusted backend provisions accounts so this username-only UI does not depend on email delivery.
  if (!supabaseAdmin) return res.status(500).json({ error: 'Server is missing SUPABASE_SECRET_KEY; registration cannot be provisioned safely.' });
  const result = await supabaseAdmin.auth.admin.createUser({
    email: emailFor(username), password, email_confirm: true, user_metadata: { username, role }
  });
  const { data, error } = result; throwIfError(error);
  res.status(201).json({ id: data.user?.id, username, role, message: 'Registration successful.' });
} catch (error) { console.error('Register error:', error.message); res.status(error.status || 500).json({ error: error.message || 'Registration failed' }); } };
exports.login = async (req, res) => { try {
  const { username, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email: emailFor(username), password }); throwIfError(error);
  const { data: user, error: profileError } = await supabase.from('users').select('id,username,role').eq('id', data.user.id).single(); throwIfError(profileError);
  res.json({ token: data.session.access_token, user });
} catch (error) { res.status(401).json({ error: 'Invalid username or password' }); } };
