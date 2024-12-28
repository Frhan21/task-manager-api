const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Konfigurasi Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Routes
// Middleware: Autentikasi
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split('')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { data: user, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = user;
  next();
}

// 1. Get All Tasks forn log-in user
router.get('/', authenticate, async (req, res) => {
  const { id: userId } = req.user;

  const { data, error } = await supabase.from('task').select("*").eq('user_id', userId);

  if(error) return res.status(500).json({error: error.message});
  res.json(data);
});


// 2. Create Task
router.post('/', authenticate,async (req, res) => {
  const {id: userId} = req.user;
  const { title, description, completed } = req.body;

  const { data, error } = await supabase.from('task').insert([{ title, description, completed, user_id: userId }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// 4. Update Task
router.put('/:id', authenticate,async (req, res) => {
  const { id: userId } = req.user;
  const {id} = req.params;
  const { title, description, completed } = req.body;
  const { data, error } = await supabase.from('task').update({ title, description, completed }).eq('id', id).eq('user_id', userId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
  console.log(res);
});

// 5. Delete Task
router.delete('/:id', authenticate,async (req, res) => {
  const {id: userId} = req.user;
  const { id } = req.params;

  const { data, error } = await supabase.from('task').delete().eq('id', id).eq('user_id', userId);
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
