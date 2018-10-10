//Implements express to handle HTTP requests from the users and posts from the host server
var express = require("express");
var app = express();

//Prof Fredericks:
//I am pretty sure you need to expose your root web directory to Express
/*Since the Content is static: meaning that you do not need to generate these files on the fly, as their content does not change.
	However, ExpressJS does not handle static content, so ExpressJS needs to be instructed to deliver the content as static content.
	app.use(express.static("public")) delivers all static content to the user from the directory 'public'*/
//app.use(express.static(__dirname + '/'));




app.use(express.static("public"));
											
//Implements body parser to help express extract the entire body of request and post message
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


var mongoose = require("mongoose");
//Implements mongoose to communicate with MongoDB from within node.js

mongoose.connect("mongodb://localhost/bliss_db");
//Specifies the directory for the finance database

//Creates a template for expense report entries
var expenseSchema = new mongoose.Schema({
	name: String,
	amount: Number,
	date: {
		type: Date,
		default: Date.now(),
	},
	category: String
});

/*Implements a variable for sending info to the mongoDB database by creating
	instances of the Schema Model: expenseSchema*/
var personalBudget = mongoose.model("personal_budget", expenseSchema);
var businessBudget = mongoose.model("business_budget", expenseSchema);


// app.set("view engine", "ejs");
//Sets .ejs as the default file extension for serving up requests
//OPTIONAL depending on what file extension we use

// app.get("/", function(req, res){
// 	res.redirect("/budget");
// });
//Serves up home.ejs

/*Requesting to view the root page. Javascript executes in a top down fashion and by default, this web page is accessed first when the user enters the url*/
app.get("/", function(req, res){
	res.render("home.ejs");
});





app.get("/homebudget", function(req, res){
    res.render("HomeBudgetPg.ejs");
});

app.post("/homebudget", function(req, res){
	res.attachment("home.ejs");
	var newPersonalBudget = {
		name:req.body.FirstName,
		amount:req.body.Amount,
		category:req.body.Category
	} 
	personalBudget.create(newPersonalBudget, function(err, budget){
		if(err){
			console.log(err);
		} else {
			console.log(budget);
			console.log("added to personal_budget");
		}
		
		res.redirect("/homebudget");
	});
});





app.get("/businessbudget", function(req, res){
    res.render("BusinessBudgetPg.ejs");
});


// app.get("/budget", function(req, res){
//     personalBudget.find({}, function(err, thisBudget){
//         if(err){
//             console.log("Database error");
//             console.log(err);
//         } else {
//             res.render("budget.ejs", {budgets:thisBudget})
//             //Serves up budget.ejs and collects user input
//         }
//     });
    
// 	//This is where the database information will be served up
// 	//Into graphs
// });

// app.post("/addbudget", function(req, res){
// 	var newBudget = {
// 		name:req.body.name,
// 		amount:req.body.amount,
// 		category:req.body.category
// 	} 
// 	//Constructs a JS object based on user input from
// 	if(req.body.isPersonal == "1") {
// 		personalBudget.create(newBudget, function(err, budget){
// 		if(err){
// 			console.log(err);
// 			//Handles any possible errors
// 		} else {
// 			console.log(budget);
// 			console.log("personal_budget");
// 			//Logs new database entry in terminal for housekeeping
// 		}
		
//         res.redirect("/budget");
//         //Re-directs to budget page with the new database entry
// 	});
		
// 	} else {
		
// 		businessBudget.create(newBudget, function(err, budget){
// 		if(err){
// 			console.log(err);
// 			//Handles any possible errors
// 		} else {
// 			console.log(budget);
// 			console.log("business_budget");
// 			//Logs new databse entry in terminal for housekeeping
// 		}
		
//         res.redirect("/budget");
//         //Re-directs to budget page with the new database entry
// 	});
// 	}
	
// });

app.get("*", function(req, res){
    res.redirect("/");
    //Catches any unknown gibberish and re-directs back to "/"
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is listening...");
    //Vooodoo magic that needs to be reviewed; can't use port 80 without
    //sudo, but mongoose gets pissy about sudo so stuck back with port
    //8080 for now
    
});