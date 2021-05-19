const { extractValidFields } = require('../lib/validation');

/*
 * Schema for a lodging.
 */
exports.LodgingSchema = {
  name: { required: true },
  addy: { required: true },
  city: { required: true },
  state: { required: true },
  zip: { required: true },
  phone: { required: true },  
  website: { required: false },
  email: { required: false }
};

exports.r_LodgingSchema = {
  star: { required: true },
  dollar: { required: true },
  write: { required: true }
};

exports.p_LodgingSchema = {
  p_id: { required: true },
  p_name: { required: true },
  p_desc: { required: true }
};