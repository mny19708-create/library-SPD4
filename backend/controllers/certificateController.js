const pool = require('../db/test-connection');
const PDFDocument = require('pdfkit');

// 1. Claim certificate: only allowed when the saved reading time (stored by /api/progress)
//    reaches the minutes the admin set. The client-sent minutes are NOT trusted.
exports.claimCertificate = async (req, res) => {
    try {
        const { user_id, ebook_id } = req.body;

        if (!user_id || !ebook_id) {
            return res.status(400).json({ success: false, message: 'user_id and ebook_id are required' });
        }

        const userResult = await pool.query('SELECT username FROM users WHERE id = $1::uuid', [user_id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const userName = userResult.rows[0].username;

        // Required time (admin) vs. time really read (database)
        const check = await pool.query(
            `SELECT COALESCE(NULLIF(e.estimated_reading_time, 0), 10) AS required_minutes,
                    COALESCE(urp.reading_seconds, 0) AS reading_seconds
             FROM ebooks e
             LEFT JOIN user_reading_progress urp
                    ON urp.ebook_id = e.id AND urp.user_id = $1::uuid
             WHERE e.id = $2::uuid`,
            [user_id, ebook_id]
        );
        if (check.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Ebook not found' });
        }

        const requiredSeconds = Number(check.rows[0].required_minutes) * 60;
        const readSeconds = Number(check.rows[0].reading_seconds);
        const TOLERANCE = 30; // the Reader autosaves every 15s, so the last save may lag a little
        if (readSeconds + TOLERANCE < requiredSeconds) {
            return res.status(400).json({
                success: false,
                message: 'You have not read long enough yet to claim this certificate.'
            });
        }

        const result = await pool.query(
            `INSERT INTO user_reading_progress
                 (user_id, ebook_id, is_completed, certificate_issued_at, reading_duration_minutes, reading_seconds, last_read_at)
             VALUES ($1::uuid, $2::uuid, TRUE, NOW(), FLOOR($3::int / 60.0)::int, $3::int, NOW())
             ON CONFLICT (user_id, ebook_id) DO UPDATE SET
                 is_completed = TRUE,
                 certificate_issued_at = COALESCE(user_reading_progress.certificate_issued_at, NOW()),
                 reading_duration_minutes = GREATEST(
                     COALESCE(user_reading_progress.reading_duration_minutes, 0),
                     FLOOR(COALESCE(user_reading_progress.reading_seconds, 0) / 60.0)::int
                 ),
                 last_read_at = NOW()
             RETURNING *`,
            [user_id, ebook_id, Math.floor(readSeconds)]
        );

        res.status(201).json({
            success: true,
            message: 'Congratulations! You earned your certificate!',
            certificate_data: { ...result.rows[0], username: userName }
        });
    } catch (err) {
        console.error('Claim certificate error:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ២. មុខងារទាញយក Certificates របស់អ្នកប្រើប្រាស់ម្នាក់ៗ
exports.getUserCertificates = async (req, res) => {
    try {
        const userId = req.params.userId;
        const query = `
            SELECT urp.*, e.title as ebook_title, urp.reading_duration_minutes 
            FROM user_reading_progress urp
            JOIN ebooks e ON urp.ebook_id = e.id
            WHERE urp.user_id = $1 AND urp.is_completed = TRUE
            ORDER BY urp.certificate_issued_at DESC;
        `;
        const result = await pool.query(query, [userId]);

        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error("🔥 Backend Error Details:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ៣. Function Generate Certificate ជា PDF
exports.generateCertificate = (req, res) => {
    try {
        const { userName, ebookTitle, readingMinutes, readingSeconds } = req.body;

        const doc = new PDFDocument({ layout: 'portrait', size: 'A4', margin: 40 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Certificate.pdf');

        doc.pipe(res);

        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).strokeColor('#c5a059').stroke();
        doc.rect(26, 26, doc.page.width - 52, doc.page.height - 52).lineWidth(1).strokeColor('#c5a059').stroke();

        doc.moveDown(1.5);

        const centerX = doc.page.width / 2;
        let logoY = 70;

        doc.save();
        doc.strokeColor('#c5a059').fillColor('#fef9e7').lineWidth(1.5);
        doc.path(`M ${centerX} ${logoY + 15} Q ${centerX - 25} ${logoY} ${centerX - 50} ${logoY + 10} L ${centerX - 50} ${logoY + 30} Q ${centerX - 25} ${logoY + 20} ${centerX} ${logoY + 35} Z`).fillAndStroke();
        doc.path(`M ${centerX} ${logoY + 15} Q ${centerX + 25} ${logoY} ${centerX + 50} ${logoY + 10} L ${centerX + 50} ${logoY + 30} Q ${centerX + 25} ${logoY + 20} ${centerX} ${logoY + 35} Z`).fillAndStroke();
        doc.fillColor('#c5a059').rect(centerX - 2, logoY + 15, 4, 20).fill();
        doc.restore();

        doc.y = logoY + 45;
        doc.moveDown(1);

        doc.fontSize(11).fillColor('#777777').text('EBOOK LEARNING PLATFORM', { align: 'center', characterSpacing: 2 });
        doc.moveDown(1);

        doc.fontSize(26).fillColor('#c5a059').text('CERTIFICATE', { align: 'center', characterSpacing: 1 });
        doc.fontSize(16).fillColor('#333333').text('OF COMPLETION', { align: 'center', characterSpacing: 2 });
        doc.moveDown(1.5);

        doc.fontSize(12).fillColor('#555555').text('This certificate is proudly presented to', { align: 'center' });
        doc.moveDown(0.8);

        doc.fontSize(22).fillColor('#0f172a').text(userName || 'Valued Student', { align: 'center' });
        doc.moveTo(150, doc.y + 6).lineTo(doc.page.width - 150, doc.y + 6).lineWidth(1.5).strokeColor('#c5a059').stroke();
        doc.moveDown(1.5);

        doc.fontSize(11.5).fillColor('#555555').text('For successfully completing the ebook course', { align: 'center' });
        doc.moveDown(0.8);

        doc.fontSize(18).fillColor('#1e293b').text(ebookTitle || 'Ebook Title', { align: 'center' });
        doc.moveDown(0.8);

        const totalSec = Number(readingSeconds) > 0 ? Math.floor(Number(readingSeconds)) : (Number(readingMinutes) || 0) * 60;
        const mm = Math.floor(totalSec / 60);
        const ss = totalSec % 60;
        const readingText = mm > 0 ? `${mm}m ${ss}s` : `${ss}s`;
        doc.fontSize(11).fillColor('#64748b').text(`Reading Time: ${readingText}`, { align: 'center' });
        doc.moveDown(3);

        const bottomY = doc.y;
        const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

        doc.fontSize(10).fillColor('#333333').text(currentDate, 70, bottomY, { align: 'left' });
        doc.moveTo(70, doc.y + 3).lineTo(190, doc.y + 3).lineWidth(1).strokeColor('#c5a059').stroke();
        doc.fontSize(9).fillColor('#777777').text('Date Issued', 70, doc.y + 5, { align: 'left' });

        doc.fontSize(9).fillColor('#777777').text('Certificate ID: EBL-2026-00001', doc.page.width - 240, bottomY + 12, { align: 'right' });

        doc.end();

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};