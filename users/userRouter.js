const express = require('express');
const router = express.Router();
const Users = require('./userDb');
const Posts = require('../posts/postDb')


router.use(validateUser)

router.post('/', (req, res) => {
    Users.insert(req.body)
    .then(newUser => {
        console.log(newUser)
        res.status(201).json({data: newUser})
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {

    // Create the structure of a new post
    const userPost = {
        user_id: req.body.user_id,
        text: req.body.text
    }

   Posts.insert(userPost)
    .then(newPost => {
        console.log(newPost)
        res.status(201).json({data: newPost})
    })

});

router.get('/', (req, res) => {
    Users.get()
    .then(users => {
        res.status(200).json({data: users})
    })
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json({user: req.user})
});

router.get('/:id/posts', validateUserId, (req, res) => {
    Users.getUserPosts(req.params.id)
    .then( userPosts => {
        res.status(200).json({data: userPosts})
    })
});

router.delete('/:id', validateUserId, (req, res) => {
    Users.remove(req.params.id)
    .then( () => { 
        res.status(200).json({data: "User was successfully deleted"})
    })
    .catch(err => res.status(500).json({data: "The database was unable to delete the user"}))
});

router.put('/:id', validateUserId , (req, res) => {

    Users.update(req.params.id, req.body)
    .then( () => {
        res.status(200).json({data: "The user's name was updated correctly"})
    })
    .catch(err => res.status(500).json({data: "The server was unable to update the users name", err: err}))
});

//custom middleware

function validateUserId(req, res, next) {
    const userId = req.params.id;
    Users.getById(userId)
    .then(user => {
        if(user){
            req.user = user
            next()
        } else {
            res.status(400).json({ message: "invalid user id" })
        }
    })

};

function validateUser(req, res, next) {
    // Check there is a req body and also a name field
    if(!req.body){
        res.status(400).json({ message: "missing user data" });
    } else if (!req.body.name){
        res.status(400).json({ message: "missing required name field" });
    }
    next();
};

function validatePost(req, res, next) {
    // checking for the req body and also text field
    if(!req.body){
        res.status(400).json({ message: "missing post data" });
    } else if (!req.body.text){
       res.status(400).json({ message: "missing required text field" });
    }

    next();
};

module.exports = router;
