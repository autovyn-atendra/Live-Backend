const Sequelize = require('sequelize');
const _IncPolicy = function (sequelize, DataTypes) {
  return sequelize.define('IncPolicy', {
    UTD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    INC_TYPE: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Yr: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Mnth: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Segment: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_dse: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_dse_nos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_dse_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_dse_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_dse_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_dse_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_dse_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_dse_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_dse_7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_dse_8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_dse_9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_dse_10: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_dse_11: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_tl: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_tl_nos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_tl_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_tl_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_tl_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_tl_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_tl_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_tl_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_tl_7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_tl_8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_tl_9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_tl_10: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_tl_11: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_dse: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_dse_nos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_dse_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_dse_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_dse_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_dse_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_dse_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_dse_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_dse_7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_dse_8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_dse_9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_dse_10: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_dse_11: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_tl: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_tl_nos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_tl_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_tl_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_tl_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_tl_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_tl_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_tl_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_tl_7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_tl_8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_tl_9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_tl_10: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rto_tl_11: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_dse: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_dse_nos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_dse_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_dse_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_dse_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_dse_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_dse_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_dse_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_dse_7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_dse_8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_dse_9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_dse_10: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_dse_11: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_tl: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_tl_nos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_tl_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_tl_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_tl_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_tl_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_tl_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_tl_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_tl_7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_tl_8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_tl_9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_tl_10: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_tl_11: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_dse: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_dse_nos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_dse_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_dse_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_dse_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_dse_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_dse_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_dse_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_dse_7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_dse_8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_dse_9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_dse_10: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_dse_11: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_tl: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_tl_nos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_tl_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_tl_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_tl_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_tl_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_tl_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_tl_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_tl_7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_tl_8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_tl_9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_tl_10: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_tl_11: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_dse: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_dse_nos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_dse_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_dse_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_dse_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_dse_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_dse_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_dse_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_dse_7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_dse_8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_dse_9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_dse_10: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_dse_11: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_tl: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_tl_nos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_tl_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_tl_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_tl_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_tl_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_tl_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_tl_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_tl_7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_tl_8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_tl_9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_tl_10: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_tl_11: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ENTR_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ENTR_TIME: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Usr_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MOD_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    MOD_TIME: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true
    },
    Mod_USER: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Loc_Code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Export_Type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_dse_Penetration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RTO_dse_Penetration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_dse_Penetration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_dse_Penetration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_dse_Penetration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_tl_Penetration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RTO_tl_Penetration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MI_tl_Penetration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MCP_tl_Penetration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MSR_tl_Penetration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ew_dse: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_dse_nos: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_dse_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_dse_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_dse_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_dse_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_dse_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_dse_6: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_dse_7: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_dse_8: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_dse_9: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_dse_10: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_dse_11: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_tl: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_tl_nos: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_tl_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_tl_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_tl_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_tl_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_tl_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_tl_6: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_tl_7: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_tl_8: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_tl_9: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_tl_10: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    ew_tl_11: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_dse: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_dse_nos: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_dse_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_dse_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_dse_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_dse_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_dse_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_dse_6: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_dse_7: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_dse_8: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_dse_9: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_dse_10: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_dse_11: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_tl: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_tl_nos: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_tl_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_tl_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_tl_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_tl_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_tl_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_tl_6: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_tl_7: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_tl_8: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_tl_9: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_tl_10: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    exch_tl_11: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_dse: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_dse_nos: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_dse_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_dse_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_dse_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_dse_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_dse_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_dse_6: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_dse_7: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_dse_8: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_dse_9: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_dse_10: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_dse_11: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_tl: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_tl_nos: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_tl_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_tl_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_tl_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_tl_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_tl_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_tl_6: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_tl_7: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_tl_8: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_tl_9: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_tl_10: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_tl_11: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    EW_dse_Penetration: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    EXCH_dse_Penetration: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_dse_Penetration: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    EW_tl_Penetration: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    EXCH_tl_Penetration: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    MGA_tl_Penetration: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    FOCUS_MODEL: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    TV_Pen_dse_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_Pen_dse_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_Pen_dse_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_Pen_dse_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_Pen_dse_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_MV_dse_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_MV_dse_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_MV_dse_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_MV_dse_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_MV_dse_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_IncAmt_dse_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_IncAmt_dse_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_IncAmt_dse_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_IncAmt_dse_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_IncAmt_dse_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_Pen_dse_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_Pen_dse_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_Pen_dse_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_Pen_dse_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_Pen_dse_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_MV_dse_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_MV_dse_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_MV_dse_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_MV_dse_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_MV_dse_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_IncAmt_dse_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_IncAmt_dse_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_IncAmt_dse_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_IncAmt_dse_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_IncAmt_dse_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_Pen_TL_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_Pen_TL_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_Pen_TL_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_Pen_TL_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_Pen_TL_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_MV_TL_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_MV_TL_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_MV_TL_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_MV_TL_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_MV_TL_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_IncAmt_TL_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_IncAmt_TL_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_IncAmt_TL_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_IncAmt_TL_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    TV_IncAmt_TL_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_Pen_TL_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_Pen_TL_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_Pen_TL_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_Pen_TL_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_Pen_TL_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_MV_TL_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_MV_TL_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_MV_TL_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_MV_TL_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_MV_TL_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_IncAmt_TL_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_IncAmt_TL_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_IncAmt_TL_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_IncAmt_TL_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NTV_IncAmt_TL_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    GP_DSE_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    GP_DSE_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    GP_DSE_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    GP_DSE_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    GP_DSE_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    LP_DSE_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    LP_DSE_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    LP_DSE_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    LP_DSE_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    LP_DSE_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    PENULTY_DSE_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    PENULTY_DSE_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    PENULTY_DSE_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    PENULTY_DSE_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    PENULTY_DSE_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    GP_TL_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    GP_TL_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    GP_TL_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    GP_TL_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    GP_TL_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    LP_TL_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    LP_TL_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    LP_TL_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    LP_TL_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    LP_TL_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    PENULTY_TL_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    PENULTY_TL_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    PENULTY_TL_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    PENULTY_TL_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    PENULTY_TL_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_dse: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_dse_nos: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_dse_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_dse_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_dse_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_dse_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_dse_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_dse_6: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_dse_7: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_dse_8: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_dse_9: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_dse_10: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_dse_11: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_tl: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_tl_nos: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_tl_1: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_tl_2: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_tl_3: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_tl_4: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_tl_5: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_tl_6: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_tl_7: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_tl_8: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_tl_9: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_tl_10: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_tl_11: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_dse_Penetration: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    Cmpl_tl_Penetration: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true
    },
    NF_sale_dse_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_dse_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_dse_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_dse_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_dse_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_dse_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_dse_7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_dse_8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_dse_9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_dse_10: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_dse_11: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_tl_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_tl_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_tl_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_tl_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_tl_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_tl_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_tl_7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_tl_8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_tl_9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_tl_10: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NF_sale_tl_11: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'INC_POLICY',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['Mnth', 'Yr']
      },
    ]
  });
};
module.exports = { _IncPolicy }