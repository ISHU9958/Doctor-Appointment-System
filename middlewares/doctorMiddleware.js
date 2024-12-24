module.exports = async (req, res, next) => {
    try {
        const isDoctor =( req.body.isDoctor === true); 

        if (isDoctor) {
            next();
        } else {
            res.status(403).send({
                message: 'You are not a doctor',
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
