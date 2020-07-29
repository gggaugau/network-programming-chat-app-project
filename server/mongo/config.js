var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);



mongoose.connect('mongodb+srv://url', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}); 


var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose
