const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { dbname } = require("./dbconfig");
const DBQUERIES = require("./query");



exports.dbauthenticate = async function (compCode, Id) {
    try {
        async function runQueries() {
            let errorLogs = [];
            const sequelize = await dbname("", compCode);

            for (let abcd of DBQUERIES) {
                
                if (abcd.ID > Id) {
                    console.log(compCode, " DBQUERIES ", Id);
                    for (let query of abcd.queries) {
                        try {
                            await sequelize.query(query);
                            console.log(`Executed: ${query}`);
                        } catch (error) {
                            console.error(`Error executing: ${query}`);
                            errorLogs.push({ query: query, error: error.message });
                        }
                    }
                }
            }

            if (errorLogs.length > 0) {
                const errorLogDir = path.join(__dirname, 'errorLogs');
                if (!fs.existsSync(errorLogDir)) {
                    fs.mkdirSync(errorLogDir, { recursive: true });
                }
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const errorLogFile = path.join(errorLogDir, `errorLog-${sequelize?.config?.database}-${timestamp}.json`);
                fs.writeFileSync(errorLogFile, JSON.stringify(errorLogs, null, 2), 'utf8');
                console.log(`Errors logged to ${errorLogFile}`);
            }
        }
        runQueries();
        return true;
    } catch (e) {
        console.log(e);
        return true
    }
};


