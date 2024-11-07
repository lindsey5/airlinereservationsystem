const Admin = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    uniquePin: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    choosenQuestion: {
        type: String,
        required: true
    },
    answerToQuestion: {
        type: String,
        required: true
    },
}, { timestamps: true });

export default Admin