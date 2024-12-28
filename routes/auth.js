const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Konfigurasi Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY); 

// login dengan Google Auth 
router.post('/login', async(req, res) => {
    const { provider } = req.body; 
    if (provider !== 'google') {
        return res.status(400).json({error: 'Only google supported'});
    }

    const {data, errpr} = await supabase.auth.signInWithOAuth({
        provider: 'google',
    })

    if (error) return res.status(500).json({errpr: error.message});
    res.json(data);
})

// Logout scene
router.post('/logout', async(req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    if(!token) {
        return res.status(400).json({error: "No Token provided"});
    }

    // Menghapus session 
    const {error} = await supabase.auth.signOut();
    if (error) { 
        return res.status(500).json({error: error.message});
    } else {
        return res.status(200).json({message: "Logout successful"})
    }
})

// add user scene
router.get('/user', async(req, res) => {
    const token = req.headers.authorization?.split('')[1];
    if(!token) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    const {data: user, error} = await supabase.auth.getUser(token); 
    if(error || !user) {
        return res.status(401).json({error: "Invalid or expired token"});
    }

    res.json(user);
})

module.exports = router;

