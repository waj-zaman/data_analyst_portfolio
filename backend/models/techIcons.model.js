import mongoose from 'mongoose';

const techIconSchema = new mongoose.Schema({
  name: String,
  iconUrl: String,
});

const TechIcon = mongoose.model('TechIcon', techIconSchema);

export default TechIcon;
