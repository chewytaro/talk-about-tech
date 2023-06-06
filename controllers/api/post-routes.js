const router = require('express').Router();
const { Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// create a post
router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id
        });
        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

// post a comment
router.post('/:id', withAuth, async (req, res) => {
    try {
        const newComment = await Comment.create({
            content: req.body.content,
            user_id: req.session.user_id,
            post_id: req.params.id,
            date_created: new Date()
        });
        res.status(200).json(newComment);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// update post title or content
router.put('/:id', withAuth, async (req, res) => {
    try {
        const updatePost = await Post.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });

        if (!updatePost[0]) {
            res.status(404).json({ message: 'No post found with this id' })
            return;
        }

        res.status(200).json(updatePost);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// delete a post
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!postData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    };
});

module.exports = router;