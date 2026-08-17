const SequelizeAuto = require('sequelize-auto');
const path = require('path');
const fs = require("fs");

async function generateModels(compCode) {
    try {
        const configPath = path.join(__dirname, "../config/config.json");
        const databaseConfigs = JSON.parse(fs.readFileSync(configPath, "utf8"));
        const dbConfig = databaseConfigs[compCode.toUpperCase()];


        const auto = new SequelizeAuto(dbConfig.database, dbConfig.username, dbConfig.password, {
            host: dbConfig.host,
            port: dbConfig.port,
            dialect: dbConfig.dialect,
            directory: path.join(__dirname, 'models'), // Output directory for generated models
            additional: {
                timestamps: false // Disable timestamps for generated models
            },
            caseFile: 'p', // Use 'pascal' case for model filenames
            caseModel: 'p', // Use 'pascal' case for model names,
            tables: ['Leave_Policy']
        });
        await auto.run();

        console.log('Models generated successfully.');
    } catch (error) {
        console.error('Error generating models:', error);
    }
}

generateModels('stest'); // Replace 'demo' with the desired compCode

//Adding comments in mohit branch
//commment in Main branch