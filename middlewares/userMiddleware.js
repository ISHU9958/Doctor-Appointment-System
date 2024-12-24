module.exports = async (req, res, next) => {
    try {
        const isDoctor =( req.body.isDoctor === true); 
        const isAdmin =( req.body.isAdmin === true); 
        if (!isDoctor && !isAdmin) {
            next();
        } else if(isDoctor) {
            res.status(403).send({
                message: 'You are Doctor',
                success: false
            });
        }
        else if(isAdmin) {
            res.status(403).send({
                message: 'You are Admin',
                success: false
            });
        }
        else {
            res.status(403).send({
                message: 'You are Admin and Doctor',
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
