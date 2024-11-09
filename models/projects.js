const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        uppercase: true,
        minLength: 2
    },
    projectDescription: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 5
    },
    projetGitHubLink: {
        type: String
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'STUDENT'
    },
    projectImgs: [
        {
            type: String
        }
    ]
});

// // Query middleware 

projectSchema.post('findOneAndDelete', async (projectInfo) => {
    const STUDENT = require('./student');
    const studId = projectInfo.owner;
    const projectId = projectInfo._id;
    const studentInfo = await STUDENT.findById(studId);
    if(studentInfo){
        await STUDENT.findByIdAndUpdate(studId, { $pull: { projects: projectId } });
    }
}); 

const PROJECT = mongoose.model("PROJECT", projectSchema);

module.exports = PROJECT;  