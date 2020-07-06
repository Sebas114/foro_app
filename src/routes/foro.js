const router = require('express').Router();
const Topic = require('../models/Topic');
const Comment = require('../models/Comment');
const { isAuthenticated } = require('../helpers/auth');


router.get('/foro/:id', isAuthenticated, async(req, res) => {
    const topic = await Topic.findById(req.params.id).lean();
    const comment = await Comment.find({ dir: topic._id }).lean();
    const sub_comment = [];
    for (i = 0; i < comment.length; i++) {
        sub_comment.push({ pri_comment: comment[i], sec_comment: await Comment.find({ dir: comment[i]._id }).lean() });
    };
    res.render('foro/developing', { topic, sub_comment });
});

router.post('/foro/new-comment/:id/:dir', isAuthenticated, async(req, res) => {
    const { comentario } = req.body;
    const errors = [];
    if (!comentario) {
        errors.push({ text: 'Porfavor escriba un comentario' });
    }
    if (errors.length > 0) {
        res.render('foro', {
            errors,
            description
        });
    } else {
        dir = req.params.dir;
        const newComment = new Comment({ dir, comentario });
        newComment.user = req.user.id;
        newComment.email = req.user.email;
        await newComment.save();
        fun = '/foro/' + req.params.id;
        req.flash('success_msg', 'Comentario agregada satisfactoriamente');
        res.redirect(fun);
    }
});

router.put('/comment/edit-comment/:id', isAuthenticated, async(req, res) => {
    const { title, description } = await Note.findById(req.params.id).lean();
    await Note.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success_msg', 'Comentario editada satisfactoriamente');
    res.redirect('/notes');
});

router.delete('/comment/delete/:topic/:id', isAuthenticated, async(req, res) => {
    await Comment.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Comentario eliminada satisfactoriamente');
    fun = '/foro/' + req.params.topic;
    res.redirect(fun);
});
module.exports = router;