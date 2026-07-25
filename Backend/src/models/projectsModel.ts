import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        minlength : 5
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    members : {
        type: [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'users'
        }],
        validate: {
            validator: (array: mongoose.Types.ObjectId[]) => array.length >= 1,
            message: 'At least 1 member is required !'
        }
    },
    priority : {
        type : String,
        enum : ['low', 'medium', 'high'],
        required : true
    },
    deadline : {
        type : Date,
        required : true
    },
    tasks : {
        type : [{
            _id : false,
            title : {
                type : String,
                required : true,
                minlength : 3
            },
            status : {
                type : String,
                enum : ['Completed', 'In progress', 'Cancelled', 'Pending'],
                default : "In progress"
            },
            assignedTo : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'users'
            }
        }],
        validate: {
            validator: (tasks: {title : string, status:string, assignedTo:mongoose.Types.ObjectId}[]) => {
                if (tasks.length < 1) return false
                const titles = tasks.map(task => task.title);
                const uniqueTitles = new Set(titles);
                return titles.length === uniqueTitles.size
            },
            message: 'Please avoid Empty or Duplicate Tasks !'
        }
    },
    status : {
        type : String,
        enum : ['Completed', 'Cancelled', 'In progress'],
        required : true,
        default : 'In progress'
    },
    // Attachment Uploads Will Be Defined On Frontend.
    attachments : {
        type : [{
            type : String
        }]
    }
}, {timestamps : true})

// Enable virtuals
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

// Keeping progress as a virtual field to calculate dynamically based on current progress of members
projectSchema.virtual('progress').get(function(){
    //Calculating progress by total tasks amongst all members and then display percentage.
    const totalTasks : number = this.tasks?.length || 0;
    if(totalTasks == 0) return; // For the case of partially populating 

    let completedTasks : number = 0;
    this.tasks.forEach((task)=>{
        if(task.status == 'Completed'){
            completedTasks++;
        }
    })

    const progress = Math.round((completedTasks/totalTasks) * 100);
    return progress;
})

const Projects = mongoose.model('projects', projectSchema);
export default Projects;