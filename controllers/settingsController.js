const SiteSettings = require('../models/SiteSettings');
async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  return settings;
}
exports.getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    const { heroSlides, categories, whatsappNumber } = req.body;
    if (heroSlides !== undefined) settings.heroSlides = heroSlides;
    if (categories !== undefined) settings.categories = categories;
    if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber;
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
