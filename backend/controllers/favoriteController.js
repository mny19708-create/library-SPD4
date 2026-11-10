const pool = require('../db/test-connection');

const addFavorite = async (req, res) => {
  try {
    const { user_id, book_id } = req.body;

    if (!user_id || !book_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'សូមបញ្ចូល user_id និង book_id ឱ្យបានត្រឹមត្រូវ!' 
      });
    }

    const queryText = `
      INSERT INTO favorites (user_id, book_id) 
      VALUES ($1, $2) 
      ON CONFLICT (user_id, book_id) DO NOTHING
      RETURNING *;
    `;
    const values = [user_id, book_id];
    
    const result = await pool.query(queryText, values);

    res.status(201).json({
      success: true,
      message: 'បានបន្ថែមចូលចិត្ត (Favorite) ជោគជ័យ!',
      data: result.rows[0] || { user_id, book_id }
    });

  } catch (err) {
    console.error('Error adding favorite:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFavoritesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const queryText = `
      SELECT
        f.*,
        e.title,
        e.description,
        e.category_id,
        e.image_url,
        c.name AS category_name
      FROM favorites f
      JOIN ebooks e ON f.book_id = e.id
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC;
    `;

    const result = await pool.query(queryText, [userId]);

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { user_id, book_id } = req.body;

    const queryText = `
      DELETE FROM favorites 
      WHERE user_id = $1 AND book_id = $2 
      RETURNING *;
    `;
    
    const result = await pool.query(queryText, [user_id, book_id]);

    res.status(200).json({
      success: true,
      message: 'បានលុបចេញពី Favorites ជោគជ័យ!',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error removing favorite:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🟢 ត្រូវ Export តាមទម្រង់ CommonJS ແບບនេះ
module.exports = {
  addFavorite,
  getFavoritesByUser,
  removeFavorite
};