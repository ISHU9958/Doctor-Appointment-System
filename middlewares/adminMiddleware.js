module.exports = async (req, res, next) => {
    try {
        
        const isAdmin =( req.body.isAdmin === true); 
        if (isAdmin) {
            next();
        } else {
            res.status(403).send({
                message: 'You are not an admin',
                success: false
            });
        }
    } catch (error) {
        res.status(500).send({ 
            message: 'An error occurred',
            success: false
        });
    }
};
