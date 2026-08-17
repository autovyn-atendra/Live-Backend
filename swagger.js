

const swaggerAutogen = require('swagger-autogen')();
const fs = require('fs');
const path = require('path');
const { apiModules } = require('./utils/apiModules')
const swaggerFilePath = path.join(__dirname, 'index.js');
const commonDoc = {
    info: {
        title: "Your API",
        description: "API Documentation",
    },
    host: "localhost:5000",
    schemes: ["http"],
    securityDefinitions: {
        bearerAuth: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
            description: "Enter your token with the prefix 'Bearer '"
        }
    },
    security: [{ bearerAuth: [] }],
};

const swaggerFolder = path.join(__dirname, 'swagger');
if (!fs.existsSync(swaggerFolder)) {
    fs.mkdirSync(swaggerFolder, { recursive: true });
}

async function generateSwaggerDocs(apiName) {
    try {
        let content = fs.readFileSync(swaggerFilePath, 'utf8');
        let lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith(`  // app.use("/`) && lines[i].toLowerCase().includes(`${apiName});`.toLowerCase())) {
                lines[i] = lines[i].replace('// ', '');
                break;
            }
        }
        await fs.writeFileSync(swaggerFilePath, lines.join('\n'), 'utf8');
        console.log(`Swagger docs generated for: ${apiName}`);

        const outputFile = path.join(swaggerFolder, `${apiName}.json`);
        let content2 = fs.readFileSync(swaggerFilePath, 'utf8');
        await swaggerAutogen(outputFile, [swaggerFilePath], {
            ...commonDoc,
            info: { title: `${apiName} API` }
        });

        await resetSwaggerFile(apiName);
    } catch (error) {
        console.error(`Error generating Swagger for ${apiName}:`, error);
    }
}

async function resetSwaggerFile(apiName) {
    try {
        let content = fs.readFileSync(swaggerFilePath, 'utf8');
        let lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith(`  app.use("/`)) {
                lines[i] = '  // ' + lines[i].trim();
                break;
            }
        }
        fs.writeFileSync(swaggerFilePath, lines.join('\n'), 'utf8');
    } catch (error) {
        console.error(`Error resetting Swagger file for ${apiName}:`, error);
    }
}

async function processModulesSequentially() {
    let content2 = fs.readFileSync(swaggerFilePath, 'utf8');
    let lines2 = content2.split('\n');

    for (let i = 0; i < lines2.length; i++) {
        if (lines2[i].startsWith(`  app.use("/`)) {
            lines2[i] = '  // ' + lines2[i].trim();
        }
    }
    fs.writeFileSync(swaggerFilePath, lines2.join('\n'), 'utf8');

    for (const module of apiModules) {
        await generateSwaggerDocs(module);
    }
    let content = fs.readFileSync(swaggerFilePath, 'utf8');
    let lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(`  // app.use("/`)) {
            lines[i] = lines[i].replace('// ', '');
        }
    }
    fs.writeFileSync(swaggerFilePath, lines.join('\n'), 'utf8');

    console.log('All API modules processed.');
}

processModulesSequentially();