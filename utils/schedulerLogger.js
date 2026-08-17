class SchedulerLogger {
  constructor(sequelizeMain, schedulerType, dealerId) {
  this.sequelizeMain = sequelizeMain;
  this.schedulerType = schedulerType;
  this.dealerId = dealerId;

  this.startTime = new Date();
  this.endTime = null;

  this.impactLog = {};
  this.totalUpdated = 0;
  this.updatedTables = new Set();
  this.status = "SUCCESS";
  this.errorMessage = null;

  this.skipped = 0;
}
addSkip(count = 1) {
  this.skipped += count;
}

toJSON() {
  this.endTime = new Date();

  return {
    schedulerType: this.schedulerType,
    dealerId: this.dealerId,
    startTime: this.formatDate(this.startTime),
    endTime: this.formatDate(this.endTime),
    duration_seconds: Math.floor((this.endTime - this.startTime) / 1000),
    status: this.totalUpdated === 0 ? "NOT_RUN" : this.status,
    errorMessage: this.errorMessage,
    totalUpdatedRows: this.totalUpdated,
    skippedRows: this.skipped,
    updatedTables: Array.from(this.updatedTables),
    impactDetails: this.impactLog
  };
}



  // ✅ Safe date formatter (no timezone)
  formatDate(date) {
    const pad = (n) => n.toString().padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  // table-wise logging
  addImpact(tableName, tranId, affectedRows = 1) {
    if (!this.impactLog[tableName]) {
      this.impactLog[tableName] = {
        tran_ids: [],
        updated_rows: 0
      };
    }

    if (tranId) {
      this.impactLog[tableName].tran_ids.push(String(tranId));
    }

    this.impactLog[tableName].updated_rows += affectedRows;
    this.totalUpdated += affectedRows;
    this.updatedTables.add(tableName);
  }

  setError(err) {
    this.status = "FAILED";
    this.errorMessage = err?.message || String(err);
  }

  // async save() {
  //   try {
  //     await this.sequelizeMain.query(`
  //       INSERT INTO Scheduler_Logs (
  //         Scheduler_Type,
  //         Dealer_Id,
  //         Impact_Details,
  //         Total_Updated_Rows,
  //         Updated_Tables,
  //         Start_Time,
  //         End_Time,
  //         Status,
  //         Error_Message
  //       )
  //       VALUES (
  //         :Scheduler_Type,
  //         :Dealer_Id,
  //         :Impact_Details,
  //         :Total_Updated_Rows,
  //         :Updated_Tables,
  //         :Start_Time,
  //         :End_Time,
  //         :Status,
  //         :Error_Message
  //       )
  //     `, {
  //       replacements: {
  //         Scheduler_Type: this.schedulerType,
  //         Dealer_Id: this.dealerId,
  //         Impact_Details: JSON.stringify(this.impactLog),
  //         Total_Updated_Rows: this.totalUpdated,
  //         Updated_Tables: Array.from(this.updatedTables).join(","),
  //         Start_Time: this.formatDate(this.startTime),
  //         End_Time: this.formatDate(new Date()),
  //         Status: this.totalUpdated === 0 ? "NOT_RUN" : this.status,
  //         Error_Message: this.errorMessage
  //       }
  //     });
  //   } catch (logErr) {
  //     console.error("⚠ Logger insert failed but scheduler continues:", logErr.message);
  //   }
  // }
  async save() {
  // DB logging disabled intentionally
  return;
}

}

module.exports = SchedulerLogger;
