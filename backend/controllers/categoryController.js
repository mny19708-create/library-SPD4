const pool = require('../db/test-connection'); // ឬដាក់ path ទៅកាន់ឯកសារ pool របស់អ្នក

// ១. បង្កើត Category ថ្មី (POST)
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'សូមបញ្ចូលឈ្មោះ Category ឱ្យបានត្រឹមត្រូវ!' 
      });
    }

    // ប្រើ SQL Query ជំនួស Supabase SDK
    const queryText = `
      INSERT INTO categories (name, description) 
      VALUES ($1, $2) 
      RETURNING *;
    `;
    const values = [name, description || ''];
    
    const result = await pool.query(queryText, values);

    res.status(201).json({
      success: true,
      message: 'បានបង្កើត Category ជោគជ័យ!',
      data: result.rows[0] // ទិន្នន័យដែលទើបនឹងបញ្ចូល
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ២. ទាញយកបញ្ជី Categories ទាំងអស់ (GET)
exports.getAllCategories = async (req, res) => {
  try {
    // ប្រើ SQL Query ដើម្បីទាញយកទិន្នន័យទាំងអស់តម្រៀបតាម created_at ថ្មីបំផុត
    const queryText = `
      SELECT * FROM categories 
      ORDER BY created_at DESC;
    `;
    
    const result = await pool.query(queryText);

    res.status(200).json({
      success: true,
      data: result.rows // បញ្ជីទិន្នន័យទាំងអស់
    });
  

  } 
  
  catch (err) {
    console.error('ព័ត៌មានលម្អិតអំពីកំហុស (Error) ពេញលេញ៖', err);
    res.status(500).json({ 
      success: false, 
      message: err.message, 
      detail: err.detail || 'គ្មានព័ត៌មានបន្ថែមទេ' 
    });
  }
};
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'សូមបញ្ចូលឈ្មោះ Category ដែលត្រូវកែប្រែ!' 
      });
    }

    const queryText = `
      UPDATE categories 
      SET name = $1, description = $2 
      WHERE id = $3 
      RETURNING *;
    `;
    const values = [name, description || '', id];
    
    const result = await pool.query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'រកមិនឃើញ Category ដែលត្រូវកែប្រែទេ!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'បានកែប្រែ Category ជោគជ័យ!',
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ៤. លុប Category តាម ID (DELETE)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const queryText = `
      DELETE FROM categories 
      WHERE id = $1 
      RETURNING *;
    `;
    
    const result = await pool.query(queryText, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'រកមិនឃើញ Category ដែលត្រូវលុបទេ!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'បានលុប Category ជោគជ័យ!',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};