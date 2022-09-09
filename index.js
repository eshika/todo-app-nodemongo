// Require the express dependency
const express = require("express");
const app = express();

const dotenv = require("dotenv");
// Mongoose dependency for the database connection
const mongoose = require("mongoose");

// Add the models dependency with the TodoTask definition
const TodoTask = require("./models/TodoTask");

dotenv.config();

// Allows us to access the css stylesheet in the public folder
app.use("/static", express.static("public"));
// Allows us to extract form data as strings or arrays
app.use(express.urlencoded({ extended: true }));

// Get port from the .env file or default to 5000
const PORT = process.env.PORT ||5000;

// Connect to the database stored in the DB_CONNECT variable in our .env file
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    // Tells express app to listen to the provided port number
    // Log a message when successfully connected to the port
    app.listen(PORT, () => console.log("Server Up and running"));
});

// This command enables us to use static template files with the ejs template engine
// These template engines render the ejs files as HTML
app.set("view engine", "ejs");

// Get method: used for passing information 
app.get("/", (req, res) => {
    // Find all tasks and render them using todo template
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// Post method: for sending information once form is submitted
app.post('/',async (req, res) => {
    // Create a new task with the content from the text box
    // when the add button is clicked
    const todoTask = new TodoTask({
        content: req.body.content
    });
    // Save and redirect to homepage
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

// Update method for when edit is clicked 
app.route("/edit/:id").get((req, res) => {
    // Get id of the task that the user wants to edit
    const id = req.params.id;
    // Find the corresponding task and render the edit template for that task id
    TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
    })
    // Send post request to update the task
    .post((req, res) => {
        // Get id for task that was edited
        const id = req.params.id;
        // Find corresponding task and update the content
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            // Return error if update fails
            if (err) return res.send(500, err);
            // Redirect to main page after editing
            res.redirect("/");
        });
    });

// Delete method for deleting tasks
app.route("/remove/:id").get((req, res) => {
    // Store id of the task to be removed
    const id = req.params.id;
    // Find corresponding task and remove it
    TodoTask.findByIdAndRemove(id, err => {
        // If can't find task to remove then return err
        if (err) return res.send(500, err);
        // Redirect to main page after deleting
        res.redirect("/");
    });
});
