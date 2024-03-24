class ExpressError extends Error{
    constructor(status, mesg){
        super();
        this.status=status;
        this.mesg=mesg;
    }
}

module.exports=ExpressError;