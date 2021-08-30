const express= require('express');
const router= express.Router();


router.get("/", (req, res) =>
{   
    res.render('index.html', {title: 'Welcome to lets chat now!'});
})

router.get("/chatroom", (req, res) =>
{   
    res.render('chatroom.html', {title: 'Welcome to lets chat now!'});
})
module.exports= router;