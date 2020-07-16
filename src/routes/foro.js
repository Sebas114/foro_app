const router = require('express').Router();
const Topic = require('../models/Topic');
const Comment = require('../models/Comment');
const md5 = require('md5');
const { isAuthenticated } = require('../helpers/auth');


router.get('/foro/:topic_id', isAuthenticated, async(req, res) => {
    const topic = await Topic.findById(req.params.topic_id);
    topic.views = topic.views + 1;
    topic.save();
    const comment = await Comment.find({ dir: topic._id }).sort({ date: -1 });
    const tot_comment = [];
    for (i = 0; i < comment.length; i++) {
        tot_comment.push({ pri_comment: comment[i], sub_comment: await Comment.find({ dir: comment[i]._id }).sort({ date: 1 }) });
    };
    res.render('foro/developing', { topic, tot_comment });
});

router.post('/foro/new-comment/:topic_id/:dir', isAuthenticated, async(req, res) => {
    const { comentario } = req.body;
    if (!comentario) {
        req.flash('error', 'Porfavor escriba un comentario');
        res.redirect('/foro/' + req.params.topic_id);
    } else {
        dir = req.params.dir;
        const newComment = new Comment({ dir, comentario });
        newComment.user = req.user.id;
        newComment.email = req.user.email;
        newComment.gravatar = md5(newComment.email);
        await newComment.save();
        fun = '/foro/' + req.params.topic_id;
        req.flash('success_msg', 'Comentario agregada satisfactoriamente');
        res.redirect(fun);
    }
});

router.get('/comment/edit/:topic/:comment_id', isAuthenticated, async(req, res) => {
    const comment = await Comment.findById(req.params.comment_id);
    const topic = req.params.topic;
    res.render('foro/edit-comment', { comment, topic });
});

router.put('/comment/edit-comment/:topic/:comment_id', isAuthenticated, async(req, res) => {
    const { comentario } = req.body;
    await Comment.findByIdAndUpdate(req.params.comment_id, { comentario });
    req.flash('success_msg', 'Comentario editada satisfactoriamente');
    res.redirect('/foro/' + req.params.topic);
});

router.delete('/comment/delete/:topic/:comment_id', isAuthenticated, async(req, res) => {
    await Comment.findByIdAndDelete(req.params.comment_id);
    req.flash('success_msg', 'Comentario eliminada satisfactoriamente');
    fun = '/foro/' + req.params.topic;
    res.redirect(fun);
});

router.post('/comment/like/:comment_id', isAuthenticated, async(req, res) => {
    const comment = await Comment.findById(req.params.comment_id);
    const topic = await Topic.findById(req.params.comment_id);
    if (comment) {
        const user = comment.likes.user_id;
        const cond2 = comment.dislikes.user_id.indexOf(req.user.id);
        const condition = user.indexOf(req.user.id);
        if (condition == -1) {
            if (cond2 != -1) {
                comment.dislikes.number = comment.dislikes.number - 1;
                comment.dislikes.user_id.splice(cond2, 1);
            }
            user.push(req.user.id);
            comment.likes.number = comment.likes.number + 1;
            await comment.save();
            res.json({ likes: comment.likes.number, dislikes: comment.dislikes.number });
        } else {
            user.splice(condition, 1);
            comment.likes.number = comment.likes.number - 1;
            await comment.save();
            res.json({ likes: comment.likes.number });
        }

    }
    if (topic) {
        const user = topic.likes.user_id;
        const cond2 = topic.dislikes.user_id.indexOf(req.user.id);
        const condition = user.indexOf(req.user.id);
        if (condition == -1) {
            if (cond2 != -1) {
                topic.dislikes.number = topic.dislikes.number - 1;
                topic.dislikes.user_id.splice(cond2, 1);
            }
            user.push(req.user.id);
            topic.likes.number = topic.likes.number + 1;
            await topic.save();
            res.json({ likes: topic.likes.number, dislikes: topic.dislikes.number });
        } else {
            user.splice(condition, 1);
            topic.likes.number = topic.likes.number - 1;
            await topic.save();
            res.json({ likes: topic.likes.number });
        }

    } else {
        res.status(500).json({ error: 'Internal Error' });
    }
});

router.post('/comment/dislike/:comment_id', isAuthenticated, async(req, res) => {
    const comment = await Comment.findById(req.params.comment_id);
    const topic = await Topic.findById(req.params.comment_id);
    if (comment) {
        const user = comment.dislikes.user_id;
        const cond2 = comment.likes.user_id.indexOf(req.user.id);
        const condition = user.indexOf(req.user.id);
        if (condition == -1) {
            if (cond2 != -1) {
                comment.likes.number = comment.likes.number - 1;
                comment.likes.user_id.splice(cond2, 1);
            }
            user.push(req.user.id);
            comment.dislikes.number = comment.dislikes.number + 1;
            await comment.save();
            res.json({ likes: comment.likes.number, dislikes: comment.dislikes.number });
        } else {
            user.splice(condition, 1);
            comment.dislikes.number = comment.dislikes.number - 1;
            await comment.save();
            res.json({ dislikes: comment.dislikes.number });
        }
    }
    if (topic) {
        const user = topic.dislikes.user_id;
        const cond2 = topic.likes.user_id.indexOf(req.user.id);
        const condition = user.indexOf(req.user.id);
        if (condition == -1) {
            if (cond2 != -1) {
                topic.likes.number = topic.likes.number - 1;
                topic.likes.user_id.splice(cond2, 1);
            }
            user.push(req.user.id);
            topic.dislikes.number = topic.dislikes.number + 1;
            await topic.save();
            res.json({ likes: topic.likes.number, dislikes: topic.dislikes.number });
        } else {
            user.splice(condition, 1);
            topic.dislikes.number = topic.dislikes.number - 1;
            await topic.save();
            res.json({ dislikes: topic.dislikes.number });
        }

    } else {
        res.status(500).json({ error: 'Internal Error' });
    }
});

module.exports = router;