if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); 
const Product = require("./models/product");
const Review = require("./models/reveiew");
const Order = require("./models/order");

//Passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

//Using the mongo store
const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 12*3600
});
store.on("error", () => {
    console.log("Error in mongo session store");
})
//Declaring the session options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions)); //Middleware for using sessions
app.use(flash()); //Middleware for flash

//Middleware for passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // use static authenticate method of model in LocalStrategy
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware for defining our locals
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
});

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


//Setting up the MongoDB Connection
main()
    .then((res) => {
        console.log("Connected to database");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

//Signup Route
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});
app.post("/signup", async(req,res)=>{
    try{
        let {email, username, password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err){
                next(err);
            }else{
                req.flash("success", "You are registered successfully, Welcome to Maid In India");
                res.redirect("/home");
            }
            
        })
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

//Login Route
app.get("/login", (req, res) => {
    res.render("login.ejs");
});
const saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
app.post("/login", saveRedirectUrl, passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true
    }), (req,res)=>{
    req.flash("success", "Welcome back, You are logged-in");
    res.redirect("/home");
});
//Logout Route
app.get("/logout", (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }else{
            req.flash("success", "You are logged-out");
            res.redirect("/home");
        }
    })
})

//CRUD OPERATIONS (FOR SELLERS)
//Creating the product
app.get("/seller", (req, res) => {
    if(req.user){
        res.render("seller.ejs");
    }else{
        req.flash("error", "You must be logged-in");
        res.redirect("/login");
    }
   
});
app.post("/seller", async(req, res) => {
    let {category, name, image, description, price} = req.body;
    let newProduct = new Product({
        category: category,
        name: name,
        image: image,
        price: price,
        description: description,
    });
    await newProduct.save();
    req.flash("success", "Product added successfully");
    res.redirect("/home");
});
//Showing the product in detail
app.get("/show/:id", async(req, res) => {
    let {id} = req.params;
    let product = await Product.findById(id).populate({path: "reviews", populate: {path: "author"}});
    res.render("product-detail.ejs", {product});
})

//Show Route for different products
//Phones
app.get("/phone", async(req, res) => {
    if(req.user){
        let products = await Product.find({category: "phone"});
        let user = await User.findById(req.user.id).populate("cart");
        res.render("product.ejs", {products, user});
    }else{
        req.flash("error", "You must be logged-in");
        res.redirect("/login");
    }
    
});
//Men Fashion
app.get("/men", async(req, res) => {
    if(req.user){
        let products = await Product.find({category: "men"});
        let user = await User.findById(req.user.id).populate("cart");
        res.render("product.ejs", {products, user});
    }else{
        req.flash("error", "You must be logged-in");
        res.redirect("/login");
    }
    
});
//Women Fashion
app.get("/women", async(req, res) => {
        if(req.user){
        let products = await Product.find({category: "women"});
        let user = await User.findById(req.user.id).populate("cart");
        res.render("product.ejs", {products, user});
    }else{
        req.flash("error", "You must be logged-in");
        res.redirect("/login");
    }
});
//Children Fashion
app.get("/children", async(req, res) => {
    if(req.user){
        let products = await Product.find({category: "children"});
        let user = await User.findById(req.user.id).populate("cart");
        res.render("product.ejs", {products, user});
    }else{
        req.flash("error", "You must be logged-in");
        res.redirect("/login");
    }
    
});
//Electronics
app.get("/electronics", async(req, res) => {
    if(req.user){
        let products = await Product.find({category: "electronics"});
        let user = await User.findById(req.user.id).populate("cart");
        res.render("product.ejs", {products, user});
    }else{
        req.flash("error", "You must be logged-in");
        res.redirect("/login");
    } 
});
//Appliances
app.get("/appliances", async(req, res) => {
    if(req.user){
        let products = await Product.find({category: "appliances"});
        let user = await User.findById(req.user.id).populate("cart");
        res.render("product.ejs", {products, user});
    }else{
        req.flash("error", "You must be logged-in");
        res.redirect("/login");
    }
});
//Handicrafts
app.get("/handicrafts", async(req, res) => {
    if(req.user){
        let products = await Product.find({category: "handicrafts"});
        let user = await User.findById(req.user.id).populate("cart");
        res.render("product.ejs", {products, user});
    }else{
        req.flash("error", "You must be logged-in");
        res.redirect("/login");
    }
});

//CART FUNCTIONALITY
app.get("/cart/:id", async(req, res) => {
    if(req.user){
        let user = req.user;
        let {id} = req.params;
        let product = await Product.findById(id);
        user.cart.push(product);
        await user.save();
        res.redirect("/cart");
    }else{
        req.flash("error", "You must be logged-in");
        res.redirect("/login");
    }
    
});
//Cart Show Page
app.get("/cart", async(req, res) => {
    if(req.user){
        let user = await User.findById(req.user.id).populate("cart");
        res.render("cart.ejs", {user});
    }else{
        req.flash("error", "You must be logged-in");
        res.redirect("/login");
    }
   
});
//Delete route for the added item in the cart
app.get("/cart/:userId/remove/:productId", async(req, res) => {
    let {userId, productId} = req.params;
    await User.findByIdAndUpdate(userId, {$pull: {cart: productId}});
    res.redirect("/cart");
});
//Reviews
app.post("/product/:id/review", async(req,res)=>{
    let {id} = req.params;
    let product = await Product.findById(id);
    let {rating, comment} = req.body;
    let newReview = new Review({
        rating: rating,
        comment: comment
    });
    newReview.author = req.user._id;
    product.reviews.push(newReview);
    await newReview.save();
    await product.save();
    req.flash("success", "Review added successfully");
    res.redirect(`/show/${id}`);
});
//Destroy route for reviews
app.post("/product/:id/review/:reviewId", async(req,res)=>{
    let {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Product.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash("success", "Review deleted successfully");
    res.redirect(`/show/${id}`);
});

//Buying Route
app.get("/product/:id/buy", async(req,res) => {
    let {id} = req.params;
    let product = await Product.findById(id);
    res.render("buy.ejs", {product});
});
app.post("/product/:id/buy", async(req, res) => {
    let {name, phone, address} = req.body;
    let newOrder = new Order({
        name: name,
        phone: phone,
        address: address
    });
    let {id} = req.params;
    let product = await Product.findById(id);
    newOrder.product.push(product);
    let userId = req.user._id;
    let user = await User.findById(userId);
    user.orders.push(newOrder);
    await newOrder.save();
    await user.save();
    req.flash("success", "Your order has been placed successfully");
    res.redirect("/home");
});
//Orders Show Page
app.get("/orders", async(req, res) => {
    if(req.user){
        let user = await User.findById(req.user.id).populate({path: "orders", populate: {path: "product"}});
        res.render("order.ejs", {user});
    }else{
        req.flash("error", "You must be logged-in");
        res.redirect("/login");
    }
})

app.get("/home", (req, res) => {
    res.render("home.ejs", {user: req.user});
});
app.listen(port, (req, res) => {
    console.log(`App is listening on port ${port}`);
});
