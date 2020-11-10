const router = require('express').Router();

const userRouter = require('./user');

router.use('/user', userRouter);

router.use('/', (_, res) => {
    res.send({ message: 'pende back-end' });
});

module.exports = router;
