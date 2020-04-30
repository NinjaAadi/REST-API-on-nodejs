class errorResponce extends Error{
    constructor(messege,statuscode){
        super(messege),
        this.msg = messege,
        this.statuscode = statuscode;
    }
}
module.exports = errorResponce;