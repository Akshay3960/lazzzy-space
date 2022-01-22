const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    image: {
        file : {
            path: String, 
        }
    }
});

module.exports = Files = mongoose.model('files',fileSchema);