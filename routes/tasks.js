const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Konfigurasi Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Routes

// 1. Get All Tasks
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('task').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2. Get Task by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('task').select('*').eq('id', id).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 3. Create Task
router.post('/', async (req, res) => {
  const { title, description, completed } = req.body;
  const { data, error } = await supabase.from('task').insert([{ title, description, completed }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// 4. Update Task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  const { data, error } = await supabase.from('task').update({ title, description, completed }).eq('id', id);
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
  console.log(res);
});

// 5. Delete Task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('task').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
