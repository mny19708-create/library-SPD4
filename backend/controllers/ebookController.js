const pool = require('../db/test-connection');

// ១. បន្ថែម Ebook ថ្មី (CREATE)
exports.addEbook = async (req, res) => {
    try {
        // 🟢 បន្ថែម image_url ចូលមកជាមួយ req.body ផង
        const { title, description, drive_link, image_url, category_id, estimated_reading_time } = req.body;

        if (!title || !drive_link) {
            return res.status(400).json({
                success: false,
                message: 'សូមបញ្ចូលចំណងជើង និង Google Drive Link ឱ្យបានត្រឹមត្រូវ!'
            });
        }

        // ប្រសិនបើមានការបញ្ជូន category_id មក ត្រូវឆែកមើលថាតើវាមានក្នុងតារាង categories ឬអត់
        if (category_id) {
            const checkCategory = await pool.query(
                'SELECT * FROM categories WHERE id = $1',
                [category_id]
            );

            if (checkCategory.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Category ID (${category_id}) នេះមិនមាននៅក្នុងប្រព័ន្ធទេ សូមពិនិត្យមើលម្ដងទៀត!`
                });
            }
        }

        // 🟢 បន្ថែម image_url ចូលទៅក្នុង INSERT Query
        const queryText = `
            INSERT INTO ebooks (title, description, pdf_url, image_url, category_id, estimated_reading_time)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [
            title, 
            description || '', 
            drive_link, 
            image_url || null, // Cloudinary Image URL
            category_id || null, 
            estimated_reading_time || 0
        ];

        const result = await pool.query(queryText, values);

        res.status(201).json({
            success: true,
            message: 'បានបន្ថែម Ebook ជោគជ័យ!',
            data: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ២. ទាញយកបញ្ជី Ebooks ទាំងអស់ (READ)
exports.getAllEbooks = async (req, res) => {
    try {
        const queryText = `
            SELECT ebooks.*, categories.name AS category_name 
            FROM ebooks 
            LEFT JOIN categories ON ebooks.category_id = categories.id 
            ORDER BY ebooks.created_at DESC;
        `;
        const result = await pool.query(queryText);

        res.status(200).json({ 
            success: true, 
            data: result.rows 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ទាញតាម id book
exports.getEbookById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM ebooks WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'រកមិនឃើញសៀវភៅទេ' });
        }

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ៣. កែប្រែ Ebook តាម ID (UPDATE)
exports.updateEbook = async (req, res) => {
    try {
        const { id } = req.params;
        // 🟢 បន្ថែម image_url ត្រង់នេះផង
        const { title, description, drive_link, image_url, category_id, estimated_reading_time } = req.body;

        // 🟢 បន្ថែម image_url = $4 ចូលទៅក្នុង UPDATE Query
        const queryText = `
            UPDATE ebooks 
            SET title = $1, description = $2, pdf_url = $3, image_url = $4, category_id = $5, estimated_reading_time = $6 
            WHERE id = $7 
            RETURNING *;
        `;
        const values = [
            title, 
            description, 
            drive_link, 
            image_url || null, // Cloudinary Image URL
            category_id, 
            estimated_reading_time || 0, 
            id
        ];

        const result = await pool.query(queryText, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'រកមិនឃើញ Ebook ដែលត្រូវកែប្រែទេ!'
            });
        }

        res.status(200).json({
            success: true,
            message: 'បានកែប្រែ Ebook ជោគជ័យ!',
            data: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ៤. លុប Ebook តាម ID (DELETE)
exports.deleteEbook = async (req, res) => {
    try {
        const { id } = req.params;

        const queryText = `DELETE FROM ebooks WHERE id = $1 RETURNING *;`;
        const result = await pool.query(queryText, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'រកមិនឃើញ Ebook ដែលត្រូវលុបទេ!'
            });
        }

        res.status(200).json({
            success: true,
            message: 'បានលុប Ebook ជោគជ័យ!',
            data: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};