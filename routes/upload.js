const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const path = require('path');

// Upload documents
router.post('/documents', auth, upload.array('documents', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
            uploadedAt: new Date()
        }));

        res.json({
            success: true,
            message: 'Files uploaded successfully',
            data: uploadedFiles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error.message
        });
    }
});

// Get uploaded file
router.get('/files/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../uploads', filename);

        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving file',
            error: error.message
        });
    }
});

module.exports = router;