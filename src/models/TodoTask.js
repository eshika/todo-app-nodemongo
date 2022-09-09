// Mongoose dependency for the database connection
const mongoose = require('mongoose');
// Define schema for a new todotask
const todoTaskSchema = new mongoose.Schema({
    // Content field stores the task text as a string
    content: {
        type: String,
        required: true
    },
    // Date field stores the date in Date format and defaults to current
    date: {
        type: Date,
        default: Date.now
    }
})
// Create a "model" using the schema we just defined and call it TodoTask
// This model will be used to create tasks
module.exports = mongoose.model('TodoTask',todoTaskSchema);