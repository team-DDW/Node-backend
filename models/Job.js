const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
    {
        title: String,
        description: String,
        budget: Number,
        technologies:[{type:String}],
        deadline:Date,
        status:String,
        requests:[{
            type: Schema.Types.ObjectId,
            ref: "Users"
        }],
        emp_id:{
            type: Schema.Types.ObjectId,
            ref: "Users"
        },
        dev_id:{
            type: Schema.Types.ObjectId,
            ref: "Users"
        }
    },
    { timestamps: true });





const Jobs = mongoose.model("Jobs", jobSchema);
module.exports = Jobs;
