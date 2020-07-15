const router = require('express').Router();

const Topic = require('../models/Topic');
const { isAuthenticated } = require('../helpers/auth');

router.get('/topics/add', isAuthenticated, (req, res) => {
    res.render('topics/new-topic');
});

router.post('/topics/new-topic', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Porfavor escriba un titulo' });
    }
    if (!description) {
        errors.push({ text: 'Porfavor escriba una descripción' });
    }
    if (errors.length > 0) {
        res.render('topics/new-topic', {
            errors,
            title,
            description
        });
    } else {
        const newTopic = new Topic({ title, description });
        await newTopic.save();
        req.flash('success_msg', 'Tema agregado satisfactoriamente');
        res.redirect('/topics');

    }
});

router.get('/topics', isAuthenticated, async(req, res) => {

    const topics = await Topic.find().sort({ date: 'desc' });
    res.render('topics/all-topics', { topics });

});

router.get('/topics/edit/:id', isAuthenticated, async(req, res) => {
    const topic = await Topic.findById(req.params.id).lean();
    res.render('topics/edit-topic', { topic });
});

router.put('/topics/edit-topic/:id', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    await Topic.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success_msg', 'Tema editado satisfactoriamente');
    res.redirect('/topics');
});

router.delete('/topics/delete/:id', isAuthenticated, async(req, res) => {
    await Topic.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Tema eliminada satisfactoriamente');
    res.redirect('/topics');
});

module.exports = router;