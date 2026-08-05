import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    members: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }],
        validate: {
            validator: (array: mongoose.Types.ObjectId[]) => array.length >= 1,
            message: 'At least 1 member is required !'
        }
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    tasks: {
        type: [{
            title: {
                type: String,
                required: true,
                minlength: 3
            },
            status: {
                type: String,
                enum: ['Completed', 'In progress', 'Cancelled', 'Pending'],
                default: "In progress"
            },
            assignedTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            department: {
                type: String,
                minlength: 3,
                maxlength: 20,
            }
        }],
        validate: {
            validator: (tasks: { title: string, status: string, assignedTo: mongoose.Types.ObjectId }[]) => {
                if (tasks.length < 1) return false
                const titles = tasks.map(task => task.title);
                const uniqueTitles = new Set(titles);
                return titles.length === uniqueTitles.size
            },
            message: 'Please avoid Empty or Duplicate Tasks !'
        }
    },
    status: {
        type: String,
        enum: ['Completed', 'Cancelled', 'In progress'],
        required: true,
        default: 'In progress'
    },
    // Attachment Uploads Will Be Defined On Frontend.
    attachments: {
        type: [{
            type: String
        }]
    },
    departments: [{
        name: {
            type: String,
            minlength: 5,
            maxlength: 20,
        },
        head: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

projectSchema.virtual('progress').get(function () {
    if (!this.tasks || this.tasks.length === 0) {
        return 0
    }
    else {
        const completed = this.tasks.filter(t => t.status === "Completed").length
        const total = this.tasks.length

        return Math.round((100 * (completed / total)))
    }
})

const Projects = mongoose.model('projects', projectSchema);
export default Projects;