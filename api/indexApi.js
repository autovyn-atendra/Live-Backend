


const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const multer = require("multer");
const FormData = require("form-data");
const { dbname } = require("../utils/dbconfig");
const { SMB_PATH, BASE_URL } = require("../config/envConfig");
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 100 * 1024 * 1024, // 100 MB in bytes
    },
}).any();
const upload6 = multer();
const sharp = require("sharp");
const { PDFDocument } = require("pdf-lib");
const archiver = require("archiver");

router.post("/upload-photo", upload, async (req, res) => {
    try {
        if (req.files) {
            let dataArray = [];
            req.files?.map(async (file, index) => {
                const customPath = req.body.customPath;
                const filePath = path.join(
                    SMB_PATH,
                    customPath,
                    file.originalname
                );
                console.log(filePath, "filePath");
                try {
                    await fs.mkdir(path.dirname(filePath), { recursive: true });
                    await fs.writeFile(filePath, file.buffer);

                    console.log("File uploaded successfully to SMB share");
                    const data = {
                        SRNO: index,
                        User_Name: req.body.name,
                        DOC_NAME: file.originalname,
                        fieldname: file.fieldname,
                        path: path.join(customPath, file.originalname),
                    };
                    dataArray.push(data);
                } catch (error) {
                    console.error("Error:", error);
                    res.status(500).send("Error uploading file");
                }
                console.log(dataArray, "dataArray");
                res.status(200).send(dataArray[0].path);
            });
        } else {
            res.status(200).send("No File Uploaded");
        }
    } catch (e) {
        console.log(e);
    }
});
router.get("/fetchAllpaths", async (req, res) => {
    try {
        const filePath = req.query.path;
        const directoryPath1 = path.dirname(filePath)
        const directoryPath = path.join(SMB_PATH, directoryPath1);
        const identifier = path.basename(filePath); // Get the last part of the path as the identifier
        console.log("Directory Path:", directoryPath);

        // Array to hold file paths
        const filePaths = [];

        // Asynchronous function to find files
        const findFiles = async (dir) => {
            try {
                const files = await fs.readdir(dir); // Asynchronously read the directory
                for (const file of files) {
                    const fullPath = path.join(dir, file);
                    const stat = await fs.stat(fullPath);
                    if (stat.isDirectory()) {
                        // Recursion for directories
                        await findFiles(fullPath);
                    } else if (file.includes(identifier)) { // Replace with your identifier logic
                        // If filename contains the identifier, add it to the list
                        console.log("Found file:", fullPath);
                        const cleanedPath = fullPath.replace(SMB_PATH, '');
                        // Construct the URL for the file
                        const fileUrl = BASE_URL + "/fetch?filePath=" + encodeURIComponent(cleanedPath);
                        filePaths.push(fileUrl);
                    }
                }
            } catch (error) {
                console.error("Error reading directory:", error);
                throw error; // Rethrow error to be caught in the outer catch block
            }
        };

        // Start finding files in the specified directory
        await findFiles(directoryPath);

        res.status(200).json({ files: filePaths });

    } catch (e) {
        return res.status(200).json({ files: [] });
    }
});
router.get("/delete-file", async (req, res) => {
    const { filePath } = req.query;

    if (!filePath) {
        return res.status(400).send("File path is required");
    }

    try {
        const filePathServer = path.join(
            SMB_PATH,
            filePath
        );
        // Check if the file exists before trying to delete it
        const fileExists = await fs.access(filePathServer, fs.constants.F_OK)
            .then(() => true)
            .catch(() => false);

        if (!fileExists) {
            return res.status(404).send("File not found");
        }

        // Delete the file

        await fs.unlink(filePathServer);

        console.log("File deleted successfully");
        res.send("File deleted successfully");
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).send("Error deleting file");
    }
});
router.get("/fetch", async (req, res) => {
    try {

        let filePath = req.query.filePath || "";
        try { filePath = decodeURIComponent(filePath); } catch (_) {}
        const normalizedPath = filePath.replace(/\\/g, "/");
        const imagePath = path.join(SMB_PATH, normalizedPath);
        
        console.log("Image path:", imagePath);
        const fileExists = await fs.access(imagePath, fs.constants.F_OK)
            .then(() => true)
            .catch(() => false);

        if (!fileExists) {
            return res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 Not Found</title>
                </head>
                <body style="font-family:Arial;text-align:center;padding-top:100px;background:#f5f5f5;">
                    <h1 style="font-size:60px;color:#e74c3c;">404</h1>
                    <p>File Not Found</p>
                </body>
                </html>
            `);
        }

        res.sendFile(imagePath);

    } catch (error) {

        console.error("Error:", error);

        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Server Error</title>
            </head>
            <body style="font-family:Arial;text-align:center;padding-top:100px;background:#f5f5f5;">
                <h1 style="font-size:60px;color:#c0392b;">500</h1>
                <p>Internal Server Error</p>
            </body>
            </html>
        `);
    }
});

router.post("/upload-photo-compress", upload6.single("photo"), async (req, res) => {
    try {
        const customPath = req.body.customPath;
        const filePath = path.join(SMB_PATH, customPath, req.file.originalname);
        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        console.log(filePath, "filePath");
        let buffer;

        // Compress the file based on its type
        if (fileExtension === ".jpg" || fileExtension === ".jpeg" || fileExtension === ".png") {
            // Compress image using sharp
            buffer = await sharp(req.file.buffer)
                .resize(800, 800, { fit: sharp.fit.inside, withoutEnlargement: true })
                .toBuffer();
        } else if (fileExtension === ".pdf") {
            // Compress PDF using pdf-lib
            const pdfDoc = await PDFDocument.load(req.file.buffer);
            const pages = pdfDoc.getPages();

            for (const page of pages) {
                const { width, height } = page.getSize();
                page.scaleContent(0.8, 0.8, { x: width / 2, y: height / 2 });
            }

            buffer = await pdfDoc.save();
        } else {
            // If the file is neither image nor PDF, use the original buffer
            buffer = req.file.buffer;
        }

        try {
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, buffer);

            console.log("File uploaded successfully to SMB share");
            res.send(filePath);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Error uploading file");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
router.post("/fetchMultiple", async (req, res) => {
    try {
        const files = req.body.files; // Expecting an array of objects with a "name" property
        console.log(files);
        if (!Array.isArray(files) || files.length === 0 || !files.every(file => file.name)) {
            return res.status(400).send("Invalid input. Each object must have a 'name' property.");
        }

        const zipFileName = "files.zip";

        // Create a zip archive
        const archive = archiver("zip", {
            zlib: { level: 9 } // Sets the compression level
        });

        res.attachment(zipFileName);

        // Pipe the archive to the response
        archive.pipe(res);

        // Append each file to the archive
        for (const file of files) {
            console.log(file.path)
            const imagePath = path.join(SMB_PATH, file.path);
            archive.file(imagePath, { name: file.name }); // Use the name from the object
        }

        // Finalize the archive (i.e., finish the ZIP file)
        archive.finalize();
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/s/:encodedComp/:code", async (req, res) => {
    const { encodedComp, code } = req.params;
    console.log(encodedComp)
    // OPTIONAL: if you need compcode decoded
    const compcode = Buffer.from(encodedComp, "base64").toString("utf8");
    console.log(compcode, "compcode")
    const sequelize = await dbname("", compcode);
    console.log("Decoded compcode:", compcode);

    const [url] = await sequelize.query(
        `SELECT Long_Url FROM url_shortener WHERE Short_Code = :code`,
        { replacements: { code } }
    );

    if (!url.length) {
        return res.status(404).send("Invalid URL");
    }

    res.redirect(url[0].Long_Url);
});




router.get("/s/getDaTaByTranId", async function (req, res) {
    const sequelize = await dbname(req, "autovyn");

    try {
        const { TRAN_ID } = req.query; // GET => req.query

        if (!TRAN_ID) {
            return res.status(400).json({
                success: false,
                message: "TRAN_ID is required"
            });
        }

           const SQL = `
SELECT 
    r.TRAN_ID,

    -- DSE Info
    (
        SELECT TOP 1 CONCAT(EMPFIRSTNAME, ' ', EMPLASTNAME)
        FROM EMPLOYEEMASTER
        WHERE EMPCODE = r.DSE_REG
    ) AS DSE_Name,

    (
        SELECT TOP 1 MOBILE_NO
        FROM EMPLOYEEMASTER
        WHERE EMPCODE = r.DSE_REG
    ) AS DSE_Mobile,

    cost_modl_varient AS Varient_Name,
    cost_modl_grp AS Model_Name,
ISNULL(Veh_Amt, 0) AS ExShowroom_Price,
ISNULL(Book_Amt, 0) AS Booking_Amount,
CASE
    WHEN ISNULL((
        SELECT SUM(CASE
                    WHEN amt_drcr = 1 THEN Post_Amt
                    ELSE -Post_Amt
                END)
        FROM ACNT_POST
        WHERE Ledg_Ac = r.LEDG_CODE
          AND Export_Type < 3
    ), 0) < 0
    THEN CONCAT(
            FORMAT(ABS(ISNULL((
                SELECT SUM(CASE
                            WHEN amt_drcr = 1 THEN Post_Amt
                            ELSE -Post_Amt
                        END)
                FROM ACNT_POST
                WHERE Ledg_Ac = r.LEDG_CODE
                  AND Export_Type < 3
            ), 0)), 'N2'),
            ' Cr'
         )
    ELSE CONCAT(
            FORMAT(ISNULL((
                SELECT SUM(CASE
                            WHEN amt_drcr = 1 THEN Post_Amt
                            ELSE -Post_Amt
                        END)
                FROM ACNT_POST
                WHERE Ledg_Ac = r.LEDG_CODE
                  AND Export_Type < 3
            ), 0), 'N2'),
            ' Dr'
         )
END AS Total_Receipt_Amount

FROM RTL_MST r
WHERE r.TRAN_ID = :TRAN_ID AND EXPORT_TYPE < 3;
`;

        const [data] = await sequelize.query(SQL, {
            replacements: { TRAN_ID }
        });

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    } finally {
        await sequelize.close();
    }
});

   



module.exports = router;  