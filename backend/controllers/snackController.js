import Snack from "../models/Snack";

export async function createsnack(req, res) {
    const newSnack = new Snack(req.body);
    try {
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
}