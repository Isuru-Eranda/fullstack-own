const { checkIsAdmin } = require('../middleware/auth');
const Snack = require('../models/Snack');
const { deleteFromB2, uploadToB2, generateUniqueFileName } = require('../config/b2Storage');
const axios = require('axios');
const path = require('path');

const createSnack = async (req, res) => {
    try {
        const snackData = { ...req.body };

        // Handle uploaded images
        if (req.files && req.files.length > 0) {
            snackData.ProductImage = req.files.map(file => file.b2Url);
        } else {
            snackData.ProductImage = [];
        }

        const newSnack = new Snack(snackData);
        const savedSnack = await newSnack.save();
        res.status(200).json(
            {
                message: "snack created successfully",
                snack: savedSnack
            }
        );
    } catch (err) {
        res.status(500).json({ 
            message: "Failed to create snack", 
            error: err.message
         });

    }
};

const getproducts = async (req, res) => {
    try {
        if(checkIsAdmin(req)){
            const snacks = await Snack.find();
            res.status(200).json(
                {
                    message: "snacks fetched successfully",
                    snacks: snacks
                }
            );
        }else{
            const snacks = await Snack.find({ isAvailable: true });
            res.status(200).json(
                {
                    message: "snacks fetched successfully",
                    snacks: snacks
                }
            );
            
        } 
    } catch (err) {
        res.status(500).json({ 
            message: "Failed to fetch snacks", 
            error: err.message
         });
    }
};

const deleteSnack = async (req, res) => {
    if (!checkIsAdmin(req)) {
        return res.status(403).json({ 
            message: 'Access denied. Admin privileges required.',
            error: 'Forbidden'
         });
    }
    
    try {
        const snackId = req.params.snackid;
        const snack = await Snack.findById(snackId);
        
        if (!snack) {
            return res.status(404).json({ 
                message: 'Snack not found',
                error: 'Not Found'
             });
        }
        
        // Delete images from B2 storage
        if (snack.ProductImage && snack.ProductImage.length > 0) {
            for (const imageUrl of snack.ProductImage) {
                await deleteFromB2(imageUrl);
            }
        }
        
        const result = await Snack.findByIdAndDelete(snackId);
        
        res.status(200).json({ 
            message: 'Snack deleted successfully'
         });
         
    } catch (err) {
        console.error('Error deleting snack:', err);
        res.status(500).json({ 
            message: "Failed to delete snack", 
            error: err.message
         });
    }
};
const updatesnack = async (req, res) => {
    if (!checkIsAdmin(req)) {
        return res.status(403).json({ 
            message: 'Access denied. Admin privileges required.',
            error: 'Forbidden'
         });
    }
    
    try {
        const data = { ...req.body };
        const snackId = req.params.snackid;
        
        // Handle uploaded images - append to existing images
        if (req.files && req.files.length > 0) {
            const existingSnack = await Snack.findById(snackId);
            if (existingSnack) {
                const newImages = req.files.map(file => file.b2Url);
                data.ProductImage = [...(existingSnack.ProductImage || []), ...newImages];
            }
        }
        
        const result = await Snack.updateOne({ _id: snackId }, data);
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ 
                message: 'Snack not found',
                error: 'Not Found'
             });
        }
        
        res.status(200).json({ 
            message: 'Snack updated successfully'
         });
    } catch (err) {
        console.error('Error updating snack:', err);
        res.status(500).json({ 
            message: "Failed to update snack", 
            error: err.message
         });
    }
};

const getSnackinfo = async (req, res) => {
    try {
        const snackid = req.params.snackid;
        let snack;
        
        // For public access, only show available snacks
        // Admin access would require authentication
        snack = await Snack.findOne({
            _id: snackid,
            isAvailable: true
        });
        
        if (snack == null) {
            return res.status(404).json({
                message: "Snack not found",
                error: "Not Found"
            });
        }
        
        res.status(200).json({
            message: "Snack fetched successfully",
            snack: snack
        });
        
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch snack",
            error: err.message
        });
    }
};

// Migration function to move Supabase images to B2
const migrateSnackImagesToB2 = async (req, res) => {
    if (!checkIsAdmin(req)) {
        return res.status(403).json({ 
            message: 'Access denied. Admin privileges required.',
            error: 'Forbidden'
         });
    }
    
    try {
        console.log('Starting snack image migration from Supabase to B2...');
        
        // Find all snacks with Supabase URLs
        const supabaseUrlPattern = /https:\/\/ztxgzbdttejsjsipqfle\.supabase\.co/;
        const snacksWithSupabaseImages = await Snack.find({
            ProductImage: { $regex: supabaseUrlPattern }
        });
        
        console.log(`Found ${snacksWithSupabaseImages.length} snacks with Supabase images`);
        
        let migratedCount = 0;
        let errorCount = 0;
        const results = [];
        
        for (const snack of snacksWithSupabaseImages) {
            try {
                console.log(`Migrating snack: ${snack.ProductName} (${snack._id})`);
                
                const newImageUrls = [];
                
                for (const imageUrl of snack.ProductImage) {
                    if (supabaseUrlPattern.test(imageUrl)) {
                        // Download image from Supabase
                        console.log(`Downloading image from Supabase: ${imageUrl}`);
                        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                        const buffer = Buffer.from(response.data);
                        
                        // Generate unique filename
                        const urlParts = imageUrl.split('/');
                        const originalFileName = urlParts[urlParts.length - 1];
                        const fileExtension = path.extname(originalFileName) || '.jpg';
                        const baseName = path.basename(originalFileName, fileExtension);
                        const uniqueFileName = generateUniqueFileName(`${baseName}${fileExtension}`);
                        
                        // Upload to B2
                        console.log(`Uploading to B2: ${uniqueFileName}`);
                        const b2Url = await uploadToB2(buffer, uniqueFileName, response.headers['content-type'] || 'image/jpeg', 'snacks');
                        
                        newImageUrls.push(b2Url);
                        console.log(`Successfully migrated: ${imageUrl} -> ${b2Url}`);
                    } else {
                        // Keep B2 URLs as they are
                        newImageUrls.push(imageUrl);
                    }
                }
                
                // Update snack with new B2 URLs
                await Snack.updateOne(
                    { _id: snack._id },
                    { ProductImage: newImageUrls }
                );
                
                migratedCount++;
                results.push({
                    snackId: snack._id,
                    snackName: snack.ProductName,
                    oldImages: snack.ProductImage,
                    newImages: newImageUrls,
                    status: 'success'
                });
                
            } catch (error) {
                console.error(`Error migrating snack ${snack._id}:`, error);
                errorCount++;
                results.push({
                    snackId: snack._id,
                    snackName: snack.ProductName,
                    error: error.message,
                    status: 'error'
                });
            }
        }
        
        res.status(200).json({
            message: `Migration completed. ${migratedCount} snacks migrated successfully, ${errorCount} errors.`,
            results: results,
            summary: {
                totalSnacks: snacksWithSupabaseImages.length,
                migrated: migratedCount,
                errors: errorCount
            }
        });
        
    } catch (err) {
        console.error('Error during snack image migration:', err);
        res.status(500).json({ 
            message: "Failed to migrate snack images", 
            error: err.message
         });
    }
};

module.exports = {
    createSnack,
    getproducts,
    deleteSnack,
    updatesnack,
    getSnackinfo,
    migrateSnackImagesToB2
};