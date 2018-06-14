module.exports = {
    username: {
        type: String,
        index: {unique : true},
        required: true
    },
    password: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    modifiedAt : {
        type: Date,
    },
    deleted: {
        type: Boolean,
        default: false
    }

}