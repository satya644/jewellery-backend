const mongoose = require('mongoose');
const categoryItemSchema = new mongoose.Schema({ name: { type: String, required: true }, image: { type: String, default: '' } }, { _id: false });
const heroSlideSchema = new mongoose.Schema(
  {
    image: { type: String, default: '' },
    heading: { type: String, default: 'Timeless Jewellery For Every You' },
    subtext: { type: String, default: 'Elegant designs. Premium quality. Made for every moment that matters.' },
    buttonText: { type: String, default: 'Shop now' },
  },
  { _id: false }
);
const siteSettingsSchema = new mongoose.Schema({
  heroSlides: {
    type: [heroSlideSchema],
    default: [{ image: '', heading: 'Timeless Jewellery For Every You', subtext: 'Elegant designs. Premium quality. Made for every moment that matters.', buttonText: 'Shop now' }],
  },
  categories: {
    type: [categoryItemSchema],
    default: [
      { name: 'Necklace', image: '' },
      { name: 'Earrings', image: '' },
      { name: 'Bracelet', image: '' },
      { name: 'Ring', image: '' },
      { name: 'Anklet', image: '' },
    ],
  },
  whatsappNumber: { type: String, default: '916386325046' },
});
module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
