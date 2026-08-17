
const DBQUERIES = [
  {
    comments: "Interview process",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[SHORTLISTED_CANDIDATE](
                        [SRNO] [smallint] NULL,
                        [EMPCODE] [varchar](100) NOT NULL,
                        [MSPIN] [nvarchar](50) NULL,
                        [TITLE] [nvarchar](15) NULL,
                        [EMPFIRSTNAME] [nvarchar](150) NULL,
                        [EMPLASTNAME] [nvarchar](150) NULL,
                        [PERMANENTADDRESS1] [nvarchar](250) NULL,
                        [PERMANENTADDRESS2] [nvarchar](150) NULL,
                        [PCITY] [smallint] NULL,
                        [PPINCODE] [nvarchar](12) NULL,
                        [PSTATE] [smallint] NULL,
                        [CURRENTADDRESS1] [nvarchar](250) NULL,
                        [CURRENTADDRESS2] [nvarchar](150) NULL,
                        [CCITY] [smallint] NULL,
                        [CPINCODE] [nvarchar](12) NULL,
                        [CSTATE] [smallint] NULL,
                        [LANDLINENO] [nvarchar](25) NULL,
                        [MOBILENO] [nvarchar](25) NULL,
                        [EMERGENCYNAME] [nvarchar](100) NULL,
                        [EMERGENCYNO] [nvarchar](25) NULL,
                        [PANNO] [nvarchar](25) NULL,
                        [PFNO] [nvarchar](25) NULL,
                        [ESINO] [nvarchar](25) NULL,
                        [PASSPORTNO] [nvarchar](25) NULL,
                        [PASSEXPIRYDATE] [smalldatetime] NULL,
                        [BLOODGROUP] [nvarchar](15) NULL,
                        [DOB] [smalldatetime] NULL,
                        [GENDER] [nvarchar](15) NULL,
                        [MARITALSTATUS] [nvarchar](15) NULL,
                        [DOM] [smalldatetime] NULL,
                        [SKILLS] [nvarchar](25) NULL,
                        [BASICQUALIFICATION] [nvarchar](50) NULL,
                        [PROFESSIONALQUALIFICATION] [nvarchar](50) NULL,
                        [FATHERNAME] [nvarchar](100) NULL,
                        [FATHEROCCUPATION] [smallint] NULL,
                        [FATHERCONTACTNO] [nvarchar](25) NULL,
                        [MOTHERNAME] [nvarchar](100) NULL,
                        [MOTHERCONTACTNO] [nvarchar](25) NULL,
                        [SPOUSENAME] [nvarchar](100) NULL,
                        [SPOUSECONTACTNO] [nvarchar](25) NULL,
                        [SPOUSEGENDER] [nvarchar](15) NULL,
                        [SIBLINGNAME] [nvarchar](100) NULL,
                        [SIBLINGCONTACTNO] [nvarchar](25) NULL,
                        [PREVIOUSCOMPANYNAME] [nvarchar](100) NULL,
                        [PRECOMPCITY] [smallint] NULL,
                        [PRECOMPCONTACTNO] [nvarchar](25) NULL,
                        [PREJOININGDATE] [smalldatetime] NULL,
                        [PREENDDATE] [smalldatetime] NULL,
                        [PREDESIGNATION] [nvarchar](50) NULL,
                        [EMPREFERENCENAME] [nvarchar](100) NULL,
                        [REFERENCEDESIGNATION] [nvarchar](50) NULL,
                        [ISMEDICALATTENTION] [nvarchar](30) NULL,
                        [ISSERIOUSILLNESS] [nvarchar](30) NULL,
                        [ISALLERGIES] [nvarchar](30) NULL,
                        [CORPORATEMAILID] [nvarchar](70) NULL,
                        [CURRENTJOINDATE] [smalldatetime] NULL,
                        [PAYMENTMODE] [nvarchar](15) NULL,
                        [BANKNAME] [nvarchar](100) NULL,
                        [BANKACCOUNTNO] [nvarchar](30) NULL,
                        [EMPLOYEETYPE] [nvarchar](30) NULL,
                        [ORGANISATIONNAME] [nvarchar](100) NULL,
                        [SBU_FUNCTION] [nvarchar](30) NULL,
                        [DIVISION] [nvarchar](30) NULL,
                        [REGION] [smallint] NULL,
                        [UNIT] [nvarchar](25) NULL,
                        [SECTION] [nvarchar](25) NULL,
                        [LEVEL] [nvarchar](25) NULL,
                        [LOCATION] [nvarchar](30) NULL,
                        [ROLE] [nvarchar](50) NULL,
                        [EMPLOYEEDESIGNATION] [nvarchar](50) NULL,
                        [GRADE] [nvarchar](30) NULL,
                        [SUPERVISORID] [smallint] NULL,
                        [SUPERVISOR] [nvarchar](50) NULL,
                        [ISTIMEVALIDATION] [nvarchar](25) NULL,
                        [ISPAYROLL] [nvarchar](25) NULL,
                        [PAYCYCLEDURATION] [nvarchar](50) NULL,
                        [PROBATIONPERIOD] [nvarchar](20) NULL,
                        [PROBATIONLEAVES] [nvarchar](20) NULL,
                        [NOTICEPERIOD] [nvarchar](20) NULL,
                        [RELCODE] [smallint] NULL,
                        [Exp_Date] [smalldatetime] NULL,
                        [Export_Type] [tinyint] NOT NULL,
                        [Loc_Code] [smallint] NULL,
                        [ServerId] [int] NOT NULL,
                        [DRIVINGLIC_ISSUEDATE] [smalldatetime] NULL,
                        [DRIVINGLIC_ISSUEPALACE] [nvarchar](30) NULL,
                        [ACCOUNT_TYPE] [nvarchar](15) NULL,
                        [PFTRUST_NO] [nvarchar](25) NULL,
                        [EMPHEIGHT] [money] NULL,
                        [EMPWEIGHT] [money] NULL,
                        [P_NATIONALITY] [nvarchar](25) NULL,
                        [UID_NO] [nvarchar](30) NULL,
                        [ALTERNET_MAIL] [nvarchar](30) NULL,
                        [EMPDEPENDENT] [smallint] NULL,
                        [CHILDREN_DETAIL] [nvarchar](150) NULL,
                        [LANGUAGE_DETAIL] [nvarchar](150) NULL,
                        [NOMINEE_DETAIL] [smallint] NULL,
                        [EMP_SHIFT] [nvarchar](30) NULL,
                        [PF] [money] NULL,
                        [PFSALARY_LIMIT] [money] NULL,
                        [LWF] [money] NULL,
                        [ESI_AMOUNT] [money] NULL,
                        [BONUS_AMOUNT] [money] NULL,
                        [MONTHLY_CTC] [money] NULL,
                        [ANNUAL_CTC] [money] NULL,
                        [COMP_NAME] [nvarchar](70) NULL,
                        [JOINING_TYPE] [nvarchar](30) NULL,
                        [BRANCH] [nvarchar](50) NULL,
                        [EMP_STATUS] [nvarchar](20) NULL,
                        [USR_NAME] [nvarchar](50) NULL,
                        [APPLICATION_ID] [nvarchar](30) NULL,
                        [APPROVED_AUTHO] [nvarchar](30) NULL,
                        [CREATED_BY] [nvarchar](20) NULL,
                        [CREATED_ON] [smalldatetime] NULL,
                        [LASTMODI_BY] [nvarchar](20) NULL,
                        [LASTMODI_ON] [smalldatetime] NULL,
                        [BIOMETRIC_ID] [nvarchar](25) NULL,
                        [PROPOSEDRETIRE_DATE] [smalldatetime] NULL,
                        [LASTWOR_DATE] [smalldatetime] NULL,
                        [RELEVE_STATUS] [nvarchar](25) NULL,
                        [ADUSER_NAME] [nvarchar](40) NULL,
                        [EXT_NO] [nvarchar](20) NULL,
                        [AUTOMAILER] [nvarchar](3) NULL,
                        [WEEKLYOFF] [nvarchar](15) NULL,
                        [RESIGN_APPR] [nvarchar](10) NULL,
                        [AX_EMP_CODE] [nvarchar](200) NULL,
                        [AX_BAL] [real] NULL,
                        [Prob_period] [smalldatetime] NULL,
                        [empcode2] [nvarchar](30) NULL,
                        [empcode3] [nvarchar](30) NULL,
                        [empcode4] [nvarchar](30) NULL,
                        [ADHARNO] [nvarchar](50) NULL,
                        [pfnumber] [nvarchar](30) NULL,
                        [esinumber] [nvarchar](30) NULL,
                        [ein] [nvarchar](100) NULL,
                        [mobile_limit] [nvarchar](10) NULL,
                        [Rec_Date] [date] NULL,
                        [ifsc_code] [nvarchar](100) NULL,
                        [MOBILE_NO] [nvarchar](15) NULL,
                        [pre_Exp] [nvarchar](100) NULL,
                        [landline_no] [nvarchar](15) NULL,
                        [uidno] [varchar](20) NULL,
                        [CNATIONALITY] [nvarchar](50) NULL,
                        [Father_Mob] [nvarchar](30) NULL,
                        [Mother_Mob] [nvarchar](30) NULL,
                        [Spouse_Mob] [nvarchar](30) NULL,
                        [pfper] [real] NULL,
                        [esiper] [money] NULL,
                        [IEMI] [nvarchar](15) NULL,
                        [IsRW] [int] NULL,
                        [Reporting_1] [nvarchar](30) NULL,
                        [Reporting_2] [nvarchar](30) NULL,
                        [Reporting_3] [nvarchar](30) NULL,
                        [App_Mispunch] [nvarchar](10) NULL,
                        [App_Leave] [nvarchar](10) NULL,
                        [App_Attendance] [nvarchar](10) NULL,
                        [InBudget] [bit] NULL,
                        [Induction_Done] [bit] NULL,
                        [ExitInterview_Done] [bit] NULL,
                        [Sal_Region] [smallint] NULL,
                        [Tocken_Id] [nvarchar](50) NULL,
                        [Interview_Date] [date] NULL,
                        [LWFNO] [int] NULL,
                        [Emp_Ac_Name] [nvarchar](50) NULL,
                        [PF_Date] [date] NULL,
                        [ESI_Date] [date] NULL,
                        [PASSPORT_EXPDATE] [date] NULL,
                        [Punch_Type] [int] NULL,
                        [PAY_CODE] [nvarchar](30) NULL,
                        [Sal_Hold] [int] NULL,
                        [Relaxation_Type] [int] NULL,
                        [ShiftIn_Relaxation] [money] NULL,
                        [ShiftOut_Relaxation] [money] NULL,
                        [Cumulative_Relaxation] [money] NULL,
                        [Spl_Rem] [nvarchar](500) NULL,
                        [Acnt_Loc] [int] NULL,
                        [UAN_No] [nvarchar](50) NULL,
                        [EmpType] [int] NULL,
                        [FCM_TockenId] [nvarchar](100) NULL,
                        [TCS_Rate] [int] NULL,
                        [MSPN_Id] [nvarchar](30) NULL,
                        [Android_ID] [nvarchar](100) NULL,
                        [multi_loc] [nvarchar](100) NULL,
                        [Ledger_Code] [int] NULL,
                        [IsMSPN] [int] NULL,
                        [MSPN_DTL] [nvarchar](70) NULL,
                        [ESI_DEDUCTION] [int] NULL,
                        [PF_DEDUCTION] [int] NULL,
                        [pro_tax] [int] NULL,
                        [Token] [nvarchar](500) NULL,
                        [Is_Profile_Filled] [int] NULL,
                        [driving_licence] [nvarchar](50) NULL,
                        [columndoc_type] [nvarchar](50) NULL,
                        [mPunch] [nvarchar](1) NULL,
                        [mApprove] [nvarchar](1) NULL,
                        [mMispunch] [nvarchar](1) NULL,
                        [mLeave] [nvarchar](1) NULL,
                        [mCalender] [nvarchar](1) NULL,
                        [mDeviceLog] [nvarchar](1) NULL,
                        [mAttendanceLog] [nvarchar](1) NULL,
                        [mLocationLog] [nvarchar](1) NULL,
                        [mToDoList] [nvarchar](1) NULL,
                        [mSuggestions] [nvarchar](1) NULL,
                        [mUpdateIMEI] [nvarchar](1) NULL,
                        [mTrackingReport] [nvarchar](1) NULL,
                        [mLiveLocation] [nvarchar](1) NULL,
                        [mAssetScan] [nvarchar](1) NULL,
                        [mGeoFenceSetting] [nvarchar](1) NULL
                    ) ON [PRIMARY]
                    `,
      `CREATE TABLE [dbo].[NEW_JOINING](
                    [TRAN_ID] [int] NULL,
                    [NAME] [nvarchar](80) NULL,
                    [MOB_NO] [nvarchar](15) NULL,
                    [WHATSAPP_NO] [nchar](15) NULL,
                    [ADDRESS] [nchar](150) NULL,
                    [PINCODE] [nchar](10) NULL,
                    [STATE] [int] NULL,
                    [CITY] [varchar](40) NULL,
                    [HIGH_QUAL] [nchar](50) NULL,
                    [PASSING_PER] [int] NULL,
                    [FATHERS_NAME] [nchar](80) NULL,
                    [GENDER] [nchar](20) NULL,
                    [MOTHERS_NAME] [nchar](80) NULL,
                    [EXP_IN_YEAR] [int] NULL,
                    [CURRENT_CTC] [money] NULL,
                    [LOC_CODE] [int] NULL,
                    [DESIGNATION] [varchar](50) NULL,
                    [EMAIL] [nchar](50) NULL,
                    [AADHAR_NO] [varchar](20) NULL,
                    [DOB] [date] NULL,
                    [DOM] [date] NULL,
                    [RELIGION] [nchar](10) NULL,
                    [APPLICATION_DATE] [date] NULL,
                    [INT_STATUS] [int] NULL,
                    [INTR1DATE] [date] NULL,
                    [INTR1TIME] [time](7) NULL,
                    [INTR2TIME] [time](7) NULL,
                    [INTR2DATE] [date] NULL,
                    [INTR1BY] [varchar](25) NULL,
                    [INTR2BY] [varchar](25) NULL,
                    [INTR3BY] [varchar](25) NULL,
                    [INTR4BY] [varchar](25) NULL,
                    [INTR4TIME] [time](7) NULL,
                    [INTR3TIME] [time](7) NULL,
                    [INTR3DATE] [date] NULL,
                    [INTR4DATE] [date] NULL,
                    [REJECTION_REMARK] [varchar](200) NULL,
                    [INTR1STATUS] [int] NULL,
                    [INTR2STATUS] [int] NULL,
                    [INTR3STATUS] [int] NULL,
                    [INTR4STATUS] [int] NULL,
                    [SKILLS] [nvarchar](50) NULL,
                    [SOURCE_OF_REG] [int] NULL,
                    [INTR1REMARK] [varchar](100) NULL,
                    [INTR1RATING] [int] NULL,
                    [INTR1SALARY] [money] NULL,
                    [INTR2REMARK] [varchar](100) NULL,
                    [INTR2RATING] [int] NULL,
                    [INTR2SALARY] [money] NULL,
                    [INTR4REMARK] [varchar](100) NULL,
                    [INTR4RATING] [int] NULL,
                    [INTR4SALARY] [money] NULL,
                    [INTR3REMARK] [varchar](100) NULL,
                    [INTR3RATING] [int] NULL,
                    [INTR3SALARY] [money] NULL,
                    [UNIQUE_ID] [varchar](100) NULL                    
                ) ON [PRIMARY]
                `,
    ],
  },

  // add 5 new column HR_EMPCODE IN NEW_JOINING table pending
  {
    comments: "finanace payout",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[newcar_financedetails](
                            [loan_type] [varchar](10) NULL,
                            [financer] [varchar](10) NULL,
                            [fin_dono] [varchar](25) NULL,
                            [fin_do_date] [date] NULL,
                            [fin_doamt] [money] NULL,
                            [fin_paymt_recd] [money] NULL,
                            [finpaymtrec_date] [date] NULL,
                            [losNo] [varchar](50) NULL,
                            [mssf_id] [varchar](50) NULL,
                            [roi] [varchar](50) NULL,
                            [tendermonth] [varchar](50) NULL,
                            [cust_id] [varchar](25) NULL,
                            [vin] [varchar](30) NULL,
                            [inv_no] [varchar](30) NULL,
                            [date] [date] NULL,
                            [entertime] [datetime] NULL,
                            [loc_code] [varchar](10) NULL,
                            [export_type] [varchar](10) NULL,
                            [username] [varchar](50) NULL
                        ) ON [PRIMARY]`,
      `ALTER TABLE [dbo].[newcar_financedetails] ADD  DEFAULT (getdate()) FOR [entertime]`,
      "alter table newcar_financedetails add  [loan_amount] [float] NULL;",
      "alter table newcar_financedetails add  [loan_account_number] [varchar](30) NULL;",
      "alter table newcar_financedetails add  [payoutpertentative] [varchar](20) NULL;",
      `CREATE TABLE [dbo].[icm_ext](
                            [tran_id] [varchar](20) NULL,
                            [fdo_date] [date] NULL,
                            [d_perc] [float] NULL,
                            [fpfcharge] [float] NULL,
                            [invoice_num] [varchar](25) NULL,
                            [date] [date] NULL,
                            [gstAmount1] [float] NULL,
                            [totalfin] [float] NULL,
                            [gstinc] [bit] NULL,
                            [finreceivedate] [date] NULL,
                            [d_amt] [varchar](25) NULL
                        ) ON [PRIMARY]
                        `,
      "alter table icm_ext add	[entertime] [datetime] NULL;",
      "alter table icm_ext add	[createdby] [varchar](50) NULL;",
    ],
  },
  {
    comments: "Employeemaster",
    ID: 1000,
    queries: [
      "ALTER TABLE [Asset_Issue] ADD [Asset_Serial_no] [nvarchar](100) NULL;",
      "ALTER TABLE [Asset_Issue] ADD [Asset_Type] [nvarchar](100) NULL;",
      "ALTER TABLE [Asset_Issue] ADD [Lost_Date] [date] NULL;",
      "ALTER TABLE [Asset_Issue] ADD [sr_no] [int] NULL;",
      `CREATE TABLE [dbo].[Employee_Assesment](
                        [Emp_Code] [nvarchar](10) NULL,
                        [Emp_Srno] [nvarchar](10) NULL,
                        [Emp_K_Name] [nvarchar](30) NULL,
                        [Emp_K_Designation] [datetime] NULL,
                        [Emp_K_Emailid] [nvarchar](30) NULL,
                        [Emp_K_Contact] [nvarchar](30) NULL,
                        [Export_Type] [int] NULL,
                        [Loc_Code] [int] NULL,
                        [Serverid] [int] NULL
                    ) ON [PRIMARY]`,
      `CREATE TABLE [dbo].[Employee_Experience](
                        [Emp_Code] [nvarchar](10) NULL,
                        [Emp_Srno] [nvarchar](10) NULL,
                        [Emp_Company] [nvarchar](30) NULL,
                        [Emp_Designation] [nvarchar](30) NULL,
                        [Emp_Responsibility] [nvarchar](30) NULL,
                        [Emp_From_Date] [datetime] NULL,
                        [Emp_To_Date] [datetime] NULL,
                        [Emp_Settlement_Done] [nvarchar](30) NULL,
                        [Emp_Drawn_Salary] [money] NULL,
                        [Emp_Leaving_Reason] [nvarchar](50) NULL,
                        [Export_Type] [int] NULL,
                        [Loc_Code] [int] NULL,
                        [Serverid] [int] NULL,
                        [SRNO] [int] NULL,
                        [CREATED_BY] [varchar](50) NULL,
                        [CREATED_ON] [date] NULL,
                        [lASTMODI_BY] [varchar](50) NULL,
                        [LASTMODI_ON] [date] NULL
                    ) ON [PRIMARY]
                    `,
      `CREATE TABLE [dbo].[Employee_Family](
                        [Emp_Code] [nvarchar](10) NULL,
                        [Emp_Srno] [nvarchar](10) NULL,
                        [Emp_Family_name] [nvarchar](30) NULL,
                        [Emp_Family_DOB] [datetime] NULL,
                        [Emp_Family_Relation] [nvarchar](30) NULL,
                        [Emp_Family_Address] [nvarchar](30) NULL,
                        [Emp_Family_Bloodgroup] [nvarchar](30) NULL,
                        [Emp_Family_Gender] [nvarchar](30) NULL,
                        [Emp_Family_Mobileno] [nvarchar](30) NULL,
                        [Emp_Family_emailid] [nvarchar](30) NULL,
                        [Emp_Family_Profession] [nvarchar](30) NULL,
                        [Export_Type] [int] NULL,
                        [Loc_Code] [int] NULL,
                        [Serverid] [int] NULL,
                        [Srno] [int] NULL
                    ) ON [PRIMARY]
                    `,
      `CREATE TABLE [dbo].[Employee_Interviewer](
                        [Emp_Code] [nvarchar](10) NULL,
                        [Emp_Srno] [nvarchar](10) NULL,
                        [Emp_Parameter] [nvarchar](30) NULL,
                        [Emp_I_Name] [datetime] NULL,
                        [Emp_I_Desig] [nvarchar](30) NULL,
                        [Emp_I_Remarks] [nvarchar](50) NULL,
                        [Export_Type] [int] NULL,
                        [Loc_Code] [int] NULL,
                        [Serverid] [int] NULL
                    ) ON [PRIMARY]
                    `,
      `CREATE TABLE [dbo].[Employee_ITSkill](
                        [Emp_Code] [nvarchar](10) NULL,
                        [Emp_Srno] [nvarchar](10) NULL,
                        [Emp_Tool] [nvarchar](30) NULL,
                        [Emp_Version] [nvarchar](30) NULL,
                        [Emp_Proficiency] [nvarchar](30) NULL,
                        [Emp_Last_Used] [nvarchar](4) NULL,
                        [Emp_Experience] [nvarchar](4) NULL,
                        [Export_Type] [int] NULL,
                        [Loc_Code] [int] NULL,
                        [Serverid] [int] NULL,
                        [srno] [int] NULL,
                        [CREATED_BY] [varchar](50) NULL,
                        [CREATED_ON] [date] NULL,
                        [lASTMODI_BY] [varchar](50) NULL,
                        [LASTMODI_ON] [date] NULL
                    ) ON [PRIMARY]
                    `,
      `CREATE TABLE [dbo].[Employee_Language](
                        [Emp_Code] [nvarchar](10) NULL,
                        [Emp_Srno] [nvarchar](10) NULL,
                        [Emp_Language] [nvarchar](30) NULL,
                        [Emp_Language_Understand] [nvarchar](30) NULL,
                        [Emp_Language_Speak] [nvarchar](30) NULL,
                        [Emp_Language_Read] [nvarchar](30) NULL,
                        [Emp_Language_Write] [nvarchar](30) NULL,
                        [Export_Type] [int] NULL,
                        [Loc_Code] [int] NULL,
                        [Serverid] [int] NULL,
                        [Srno] [int] NULL,
                        [CREATED_BY] [varchar](50) NULL,
                        [CREATED_ON] [date] NULL,
                        [lASTMODI_BY] [varchar](50) NULL,
                        [LASTMODI_ON] [date] NULL
                    ) ON [PRIMARY]`,
      `CREATE TABLE [dbo].[Employee_Reference](
                        [Emp_Code] [nvarchar](10) NULL,
                        [Emp_Srno] [nvarchar](10) NULL,
                        [Emp_Ref_Name] [nvarchar](30) NULL,
                        [Emp_Ref_Occup] [nvarchar](30) NULL,
                        [Emp_Ref_Address] [nvarchar](30) NULL,
                        [Emp_Ref_Mobile] [nvarchar](30) NULL,
                        [Emp_Ref_emailid] [nvarchar](30) NULL,
                        [Emp_Ref_relation] [nvarchar](30) NULL,
                        [Export_Type] [int] NULL,
                        [Loc_Code] [int] NULL,
                        [Serverid] [int] NULL,
                        [SRNO] [int] NULL
                    ) ON [PRIMARY]`,
      `CREATE TABLE [dbo].[EmployeeInterview](
                        [Applicant_Code] [nvarchar](10) NULL,
                        [Region] [nvarchar](20) NULL,
                        [Location] [nvarchar](20) NULL,
                        [Division] [nvarchar](20) NULL,
                        [Department] [nvarchar](20) NULL,
                        [Designation] [nvarchar](20) NULL,
                        [Applicant_Title] [nvarchar](20) NULL,
                        [Applicant_Firstname] [nvarchar](20) NULL,
                        [Applicant_Lastname] [nvarchar](20) NULL,
                        [Interview_Date] [datetime] NULL,
                        [Applicant_Status] [nvarchar](20) NULL,
                        [Exp_Join_Date] [datetime] NULL,
                        [Induction_Done] [nvarchar](20) NULL,
                        [Prob_Days] [int] NULL,
                        [Prob_Date] [datetime] NULL,
                        [Notice_Days] [int] NULL,
                        [Skills] [nvarchar](20) NULL,
                        [Applicant_Relocate] [int] NULL,
                        [Conveyance_Mode] [nvarchar](20) NULL,
                        [Existing_MSPIN] [nvarchar](20) NULL,
                        [MSIL_Certified] [int] NULL,
                        [Applicant_Certification] [nvarchar](30) NULL,
                        [Training_Done] [nvarchar](30) NULL,
                        [Pan_No] [nvarchar](30) NULL,
                        [Pan_Verified] [int] NULL,
                        [Aadhar_No] [nvarchar](30) NULL,
                        [Aadhar_Verified] [int] NULL,
                        [Passport_No] [nvarchar](30) NULL,
                        [Passport_Expiry_Date] [datetime] NULL,
                        [DL_No] [nvarchar](30) NULL,
                        [DL_Expiry_Date] [datetime] NULL,
                        [DL_Verified] [int] NULL,
                        [Current_Salary] [money] NULL,
                        [Expected_Salary] [money] NULL,
                        [Open_Position_Reason] [nvarchar](30) NULL,
                        [EIN_No] [nvarchar](20) NULL,
                        [P_Address1] [nvarchar](50) NULL,
                        [P_Address2] [nvarchar](50) NULL,
                        [P_City] [nvarchar](30) NULL,
                        [O_email] [nvarchar](30) NULL,
                        [P_pincode] [nvarchar](10) NULL,
                        [P_landline] [nvarchar](11) NULL,
                        [P_mobile] [nvarchar](10) NULL,
                        [P_State] [nvarchar](30) NULL,
                        [IEMI] [nvarchar](16) NULL,
                        [C_Address1] [nvarchar](50) NULL,
                        [C_Address2] [nvarchar](50) NULL,
                        [C_City] [nvarchar](30) NULL,
                        [Uid_no] [nvarchar](30) NULL,
                        [C_pincode] [nvarchar](10) NULL,
                        [C_landline] [nvarchar](11) NULL,
                        [C_mobile] [nvarchar](10) NULL,
                        [C_State] [nvarchar](30) NULL,
                        [Grade] [nvarchar](30) NULL,
                        [Nationality] [nvarchar](30) NULL,
                        [F_Name] [nvarchar](50) NULL,
                        [M_Name] [nvarchar](50) NULL,
                        [Aniv_Date] [datetime] NULL,
                        [Marital_Status] [int] NULL,
                        [Spouse_Name] [nvarchar](50) NULL,
                        [P_Email] [nvarchar](50) NULL,
                        [Height] [nvarchar](10) NULL,
                        [Weight] [nvarchar](10) NULL,
                        [DOB] [datetime] NULL,
                        [Blood_Group] [nvarchar](20) NULL,
                        [Religion] [nvarchar](30) NULL,
                        [Gender] [nvarchar](30) NULL,
                        [Emp_Code2] [nvarchar](30) NULL,
                        [Emp_Code3] [nvarchar](30) NULL,
                        [Emp_Code4] [nvarchar](30) NULL,
                        [Created_By] [nvarchar](30) NULL,
                        [Created_On] [nvarchar](30) NULL,
                        [Last_Modified_by] [nvarchar](30) NULL,
                        [Last_Modified_Date] [datetime] NULL,
                        [Machine_Name] [nvarchar](30) NULL,
                        [Machine_Serialno] [nvarchar](30) NULL,
                        [Machine_driveno] [nvarchar](30) NULL,
                        [PF_App] [int] NULL,
                        [PF_Perc] [money] NULL,
                        [Uan_No] [nvarchar](30) NULL,
                        [ESIC_App] [int] NULL,
                        [ESIC_No] [nvarchar](30) NULL,
                        [LWF_App] [int] NULL,
                        [Bonus_App] [int] NULL,
                        [Weekly_off] [nvarchar](10) NULL,
                        [Emp_Shift] [nvarchar](10) NULL,
                        [Bank_Name] [nvarchar](30) NULL,
                        [Account_Type] [nvarchar](30) NULL,
                        [Account_Number] [nvarchar](30) NULL,
                        [Branch_Name] [nvarchar](30) NULL,
                        [Payment_Mode] [nvarchar](30) NULL,
                        [IFSC_Code] [nvarchar](30) NULL,
                        [BankAccount_Verified] [int] NULL,
                        [BankAccount_Name] [nvarchar](30) NULL,
                        [Salary_Effectivedate] [datetime] NULL,
                        [Salary_Basic] [money] NULL,
                        [Salary_HRA] [money] NULL,
                        [Salary_Conv] [money] NULL,
                        [Salary_Medical] [money] NULL,
                        [Salary_Washing] [money] NULL,
                        [Salary_MGross] [money] NULL,
                        [Salary_YGross] [money] NULL,
                        [Emp_Salary] [money] NULL,
                        [Salary_PF] [money] NULL,
                        [Salary_Esic] [money] NULL,
                        [Salary_LWF] [money] NULL,
                        [PF_Salary_Limit] [money] NULL,
                        [Salary_Bonus] [money] NULL,
                        [Mobile_Limit] [money] NULL,
                        [Export_Type] [int] NULL,
                        [Loc_Code] [int] NULL,
                        [Serverid] [int] NULL
                    ) ON [PRIMARY]`,
      "alter table EMPLOYEEMASTER alter column FCM_TockenId varchar (300)",
      "alter table EMP_DOcs add  Created_Date DATETIME DEFAULT GETDATE();",
      "alter table EMPLOYEEMASTER add mUserGeoLocation varchar (1)",
      "alter table EMP_DOcs ADD Utd INT IDENTITY(1,1);",
      "alter table employeemaster add UTD int identity(1,1)",
    ],
  },
  {
    comments: "templates",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[Templates](
                        [TEMPLATE_NO] [int] IDENTITY(1,1) NOT NULL,
                        [TEMPLATE_NAME] [nvarchar](50) NULL,
                        [CONTENT] [nvarchar](max) NULL,
                        [KEYWORDS] [nvarchar](max) NULL,
                        [SEND_DATE] [nvarchar](50) NULL,
                        [SCHEDULED] [smallint] NULL,
                        [Created_At] [datetime] NOT NULL,
                        [Created_by] [varchar](100) NULL,
                        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
                        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
                    PRIMARY KEY CLUSTERED 
                    (
                        [TEMPLATE_NO] ASC
                    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
                    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
                    WITH
                    (
                    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Templates_Hst])
                    )
                    
                    
                    ALTER TABLE [dbo].[Templates] ADD  DEFAULT (getdate()) FOR [Created_At]
                    
                    
                    ALTER TABLE [dbo].[Templates] ADD  DEFAULT (getdate()) FOR [ValidFrom]
                    
                    `,
      `CREATE TABLE [dbo].[TEMPLATE_GEN](
                        [TEMPLATE_NO] [int] NOT NULL,
                        [TEMPLATE_NAME] [nvarchar](50) NULL,
                        [CONTENT] [nvarchar](max) NULL,
                        [CREATED_DATE] [date] NULL,
                        [SEND_DATE] [nvarchar](50) NULL
                    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
                    `,
    ],
  },
  {
    comments: "fuel slip",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[FuelSlip](
                        [UTD] [int] IDENTITY(1,1) NOT NULL,
                        [TRAN_ID] [int] NULL,
                        [TRAN_TYPE] [nvarchar](50) NULL,
                        [DMS_INV] [nvarchar](50) NULL,
                        [GATEPASS_NO] [nvarchar](50) NULL,
                        [GATEPASS_DATE] [nvarchar](50) NULL,
                        [CUSTOMER_NAME] [nvarchar](200) NULL,
                        [BRANCH] [nvarchar](200) NULL,
                        [DSE_NAME] [nvarchar](50) NULL,
                        [MODEL_NAME] [nvarchar](50) NULL,
                        [DELIVERY_DATE] [date] NULL,
                        [TYPE_OF_FUEL] [nvarchar](50) NULL,
                        [QUANTITY] [int] NULL,
                        [SLIP_GIVEN_TO] [nvarchar](100) NULL,
                        [FUEL_SLIP_FLAG] [int] NULL,
                        [LOC_CODE] [int] NULL,
                        [EXPORT_TYPE] [int] NULL,
                        [SERVER_ID] [int] NULL,
                        [REMARK] [nvarchar](250) NULL,
                        [PRINTED_BY] [nvarchar](100) NULL,
                        [VEH_REGNO] [nvarchar](30) NULL,
                        [DEMO_CAR_ID] [int] NULL,
                        [CHAS_NO] [nvarchar](50) NULL,
                        [ENGINE_NO] [nvarchar](50) NULL,
                        [MODEL_GROUP] [int] NULL,
                        [VEH_COLOUR] [nvarchar](10) NULL,
                        [KM_DRIVEN] [int] NULL,
                        [REG_BRANCH] [nvarchar](100) NULL,
                        [AVERAGE] [int] NULL,
                        [LOC_FROM] [varchar](200) NULL,
                        [LOC_TO] [varchar](200) NULL,
                        [DISTANCE_BET] [int] NULL,
                        [DRIVER_NAME] [nvarchar](100) NULL,
                        [ENQUIRY_NO] [int] NULL,
                        [LAST_KM_DRIVEN] [int] NULL,
                        [REG_LOC_CODE] [nvarchar](100) NULL,
                        [Created_At] [datetime] NOT NULL,
                        [Created_by] [varchar](100) NULL,
                        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
                        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
                        [IMAGE_PATH] [nvarchar](1000) NULL,
                    PRIMARY KEY CLUSTERED 
                    (
                        [UTD] ASC
                    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
                    ) ON [PRIMARY]
                    WITH
                    (
                    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[FuelSlip_Hst])
                    )
                    
                    
                    ALTER TABLE [dbo].[FuelSlip] ADD  DEFAULT (getdate()) FOR [Created_At]
                    
                    
                    ALTER TABLE [dbo].[FuelSlip] ADD  DEFAULT (getdate()) FOR [ValidFrom]
                    `,
      `CREATE TABLE [dbo].[DemoCarMaster](
                        [UTD] [int] IDENTITY(1,1) NOT NULL,
                        [VEH_REGNO] [nvarchar](25) NULL,
                        [CHAS_NO] [nvarchar](30) NULL,
                        [ENGINE_NO] [nvarchar](50) NULL,
                        [MODEL_GROUP] [int] NULL,
                        [MODEL_NAME] [int] NULL,
                        [VEH_COLOUR] [nvarchar](30) NULL,
                        [KM_DRIVEN] [int] NULL,
                        [REG_BRANCH] [int] NULL,
                        [EXPORT_TYPE] [int] NULL,
                        [LOC_CODE] [int] NULL,
                        [SERVER_ID] [int] NULL,
                        [FUEL_TYPE] [nvarchar](25) NULL,
                        [AVERAGE] [int] NULL,
                        [Created_At] [datetime] NOT NULL,
                        [Created_by] [varchar](100) NULL,
                        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
                        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
                    PRIMARY KEY CLUSTERED 
                    (
                        [UTD] ASC
                    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
                    ) ON [PRIMARY]
                    WITH
                    (
                    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[DemoCarMaster_Hst])
                    )
                    
                    
                    ALTER TABLE [dbo].[DemoCarMaster] ADD  DEFAULT (getdate()) FOR [Created_At]
                    
                    
                    ALTER TABLE [dbo].[DemoCarMaster] ADD  DEFAULT (getdate()) FOR [ValidFrom]
                    
                    
                    `,
      `ALTER TABLE FuelSlip ADD FUEL_VENDOR int`,
      `ALTER TABLE DemoCarMaster ADD Available [varchar](10)`,
      `ALTER TABLE DemoCarMaster ADD Image [varchar](100)`,
    ],
  },
  {
    comments: "Reminder",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[reminder_emp](
                        [reminder_id] [int] NOT NULL,
                        [empcode] [varchar](15) NULL,
                        [email] [varchar](50) NULL,
                        [mobile] [varchar](12) NULL
                    ) ON [PRIMARY]
                    `,
      `CREATE TABLE [dbo].[reminder_table](
                        [reminder_id] [int] IDENTITY(1,1) NOT NULL,
                        [reminder_name] [varchar](50) NULL,
                        [date] [date] NULL,
                        [time] [varchar](255) NULL,
                        [frequency] [nvarchar](255) NULL,
                        [validity] [date] NULL,
                        [description] [varchar](255) NULL,
                        [user_id] [int] NULL,
                        [type] [varchar](255) NULL
                    ) ON [PRIMARY]
                    `,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[COMP_KEYDATA](
                        [Comp_Code] [int] NULL,
                        [M1] [bit] NULL,
                        [M2] [bit] NULL,
                        [M3] [bit] NULL,
                        [M4] [bit] NULL,
                        [M5] [bit] NULL,
                        [M6] [bit] NULL,
                        [M7] [bit] NULL,
                        [M8] [bit] NULL,
                        [M9] [bit] NULL,
                        [M10] [bit] NULL,
                        [M11] [bit] NULL,
                        [DISC_DUAL_APRVL] [bit] NULL,
                        [DUAL_APRVL_MSG] [bit] NULL
                    ) ON [PRIMARY]
                    `,
      `alter table Comp_keydata add New_dev_code int`,
    ],
  },
  {
    comments: "User table and rights",
    ID: 1000,
    queries: [
      "alter table user_tbl add emp_dms_code varchar(15)",
      "alter table user_tbl add EMPCODE varchar(15)",
      "alter table user_tbl add seva_item_type varchar(20)",
      "alter table user_tbl add VAS_bookCode varchar(200)",
      "ALTER TABLE user_tbl ADD UTD INT IDENTITY(1,1) PRIMARY KEY;",
      `CREATE TABLE [dbo].[User_Rights](
                            [utd] [int] IDENTITY(1,1) NOT NULL,
                            [User_Code] [int] NOT NULL,
                            [Optn_Name] [nvarchar](255) NOT NULL,
                            [Module_Code] [int] NOT NULL,
                            [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
                            [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
                        PRIMARY KEY CLUSTERED 
                        (
                            [utd] ASC
                        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                            PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
                        ) ON [PRIMARY]
                        WITH
                        (
                        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[User_Rights_Hst])
                        )
                        
                        
                        ALTER TABLE [dbo].[User_Rights] ADD  DEFAULT (getdate()) FOR [ValidFrom]
                        `,
    ],
  },
  // {
  //     comments: "VAS",
  //     ID:1000,
  //     queries: [
  //         `CREATE TABLE [dbo].[SPARE_LAB_MST](
  //             [TRAN_ID] [int] NULL,
  //             [DEPARTMENT] [nvarchar](25) NULL,
  //             [CUST_NAME] [nvarchar](200) NULL,
  //             [MOBILE_NO] [nvarchar](15) NULL,
  //             [VEHREGNO] [nvarchar](25) NULL,
  //             [JOB_NO] [nvarchar](25) NULL,
  //             [MODEL_NAME] [nvarchar](50) NULL,
  //             [CHASS_NO] [nvarchar](50) NULL,
  //             [SERVICE_TYPE] [nvarchar](30) NULL,
  //             [TECHNICIAN] [nvarchar](30) NULL,
  //             [SA_TL] [nvarchar](100) NULL,
  //             [MILAGE_KMS] [int] NULL,
  //             [MODE_Q] [int] NULL,
  //             [LOC_CODE] [int] NULL,
  //             [SERVER_ID] [int] NULL,
  //             [EXPORT_TYPE] [int] NULL,
  //             [REMARKS] [nvarchar](100) NULL,
  //             [DEPARTMENT_CAT] [nvarchar](25) NULL,
  //             [GROSS_PARTS_TOTAL] [money] NULL,
  //             [PARTS_TOTAL_GST] [money] NULL,
  //             [PARTS_NET_TOTAL] [money] NULL,
  //             [GROSS_LAB_TOTAL] [money] NULL,
  //             [LAB_TOTAL_GST] [money] NULL,
  //             [LAB_NET_TOTAL] [money] NULL,
  //             [TTL_INV_AMNT] [money] NULL,
  //             [TTL_GST_AMNT] [money] NULL,
  //             [INV_DATE] [datetime] NULL,
  //             [INV_NO] [varchar](50) NULL,
  //             [GST] [varchar](40) NULL,
  //             [STATE_CODE] [int] NULL,
  //             [VAS_TYPE] [nvarchar](20) NULL,
  //             [book_code] [nvarchar](20) NULL,
  //             [SALES_INV] [nvarchar](20) NULL,
  //             [SALES_INV_DATE] [datetime] NULL,
  //             [CUST_ADD] [varchar](300) NULL,
  //             [PAN_NO] [nvarchar](15) NULL,
  //             [MODEL_DESC] [nvarchar](80) NULL,
  //             [ENGINE_NO] [nvarchar](20) NULL,
  //             [DRD_ID] [varchar](30) NULL,
  //             [CUST_ID] [nvarchar](50) NULL,
  //             [EXECUTIVE] [nvarchar](50) NULL
  //         ) ON [PRIMARY]
  //

  //         ALTER TABLE [dbo].[SPARE_LAB_MST] ADD  DEFAULT (getdate()) FOR [INV_DATE]
  //         `,
  //         `CREATE TABLE [dbo].[VAS_TEMP](
  //             [TRAN_ID] [int] NULL
  //         )`,
  //         `CREATE TABLE [dbo].[SPARE_LAB_DTL](
  //             [TRAN_ID] [int] NULL,
  //             [TRAN_TYPE] [nvarchar](20) NULL,
  //             [CODE] [nvarchar](20) NULL,
  //             [DESCRIPTION] [nvarchar](50) NULL,
  //             [RATE] [money] NULL,
  //             [GST_PERCT] [int] NULL,
  //             [GST_VALUE] [money] NULL,
  //             [QUANTITY] [int] NULL,
  //             [LOC_CODE] [int] NULL,
  //             [EXPORT_TYPE] [int] NULL,
  //             [SERVER_ID] [int] NULL,
  //             [DISCOUNT] [money] NULL,
  //             [SRNO] [int] NULL,
  //             [GST_TYPE] [nvarchar](10) NULL,
  //             [INV_DATE] [datetime] NULL,
  //             [HSN_CODE] [nvarchar](50) NULL,
  //             [ITEM_CODE] [nvarchar](50) NULL
  //         ) ON [PRIMARY]
  //

  //         ALTER TABLE [dbo].[SPARE_LAB_DTL] ADD  DEFAULT (getdate()) FOR [INV_DATE]
  //         `,
  //         `drop PROCEDURE GetPivotedData`,
  //         `CREATE PROCEDURE GetPivotedData
  //      @itemcode INT,
  //      @type INT
  //  AS
  //  BEGIN
  //      DECLARE @columns NVARCHAR(MAX), @sql NVARCHAR(MAX);

  //      -- Create a comma-separated list of distinct modl_code values
  //      SELECT @columns = COALESCE(@columns + ', ', '') + QUOTENAME(modl_code)
  //      FROM (
  //          SELECT DISTINCT modl_code
  //          FROM branchwiseitemmst
  //          WHERE itemcode = @itemcode
  //      ) AS modl_codes;

  //      -- Create the dynamic SQL query
  //      SET @sql = '
  //      SELECT loc_code, ' + @columns + '
  //      FROM (
  //          SELECT modl_code, loc_code, price
  //          FROM branchwiseitemmst
  //          WHERE export_type < 3 and itemcode = ' + CAST(@itemcode AS NVARCHAR) + ' and item_labour = '+ CAST(@type AS NVARCHAR) +'
  //      ) AS SourceData
  //      PIVOT (
  //          MAX(price) FOR modl_code IN (' + @columns + ')
  //      ) AS PivotTable
  //      ORDER BY loc_code;';

  //      -- Execute the dynamic SQL query
  //      EXEC sp_executesql @sql;
  //     END;`,
  //         `drop PROCEDURE SevaSprDrdQuery`,
  //         `CREATE PROCEDURE SevaSprDrdQuery
  //     @tran_id INT,
  //     @location_code INT,
  //     @user_code INT
  // AS
  // BEGIN

  //     DECLARE @billno VARCHAR(255),
  //             @ledgcode INT,
  //             @seq INT,
  //             @drd_id VARCHAR(30),
  //    @rnd_off decimal(19,6),
  //    @total_inv decimal(19,6);
  //    SELECT @total_inv = round(SUM(ROUND(rate, 2) + (ROUND(rate, 2)* gst_value / 100)),0) FROM spare_lab_dtl where tran_id = @tran_id;

  //    SELECT @rnd_off = round(round(SUM(ROUND(rate, 2) + (ROUND(rate, 2)* gst_value / 100)),0)-SUM(ROUND(rate, 2) + (ROUND(rate, 2)* gst_value / 100)),2) FROM spare_lab_dtl where tran_id = @tran_id;

  //     SELECT @seq = ISNULL(MAX(seq_no) + 1, 1)
  //     FROM dms_row_data
  //     WHERE Export_Type < 3 and tran_type collate database_default= (SELECT top 1 book_code FROM spare_lab_mst WHERE tran_id = @tran_id and Export_Type < 3) collate database_default;

  //     SELECT  @drd_id = ISNULL(MAX(tran_id) + 1, 1)
  //     FROM DMS_ROW_DATA;

  //     -- Generate bill number
  //     SELECT @billno = CONCAT(
  //         (SELECT TOP 1 Book_Prefix
  //          FROM book_mst
  //          WHERE book_code  = (SELECT misc_dtl1 FROM misc_mst WHERE misc_code  = (SELECT top 1 book_code FROM spare_lab_mst WHERE tran_id = @tran_id and Export_Type < 3))
  //         ),
  //         @seq
  //     )

  //     -- Get ledger code
  //     SELECT @ledgcode = (SELECT cust_name FROM SPARE_LAB_MST WHERE TRAN_ID = @tran_id AND EXPORT_TYPE < 3);

  //     -- Insert data into dms_row_data table
  //     INSERT INTO dms_row_data (
  //         Tran_Id,
  //         tran_type,
  //         bill_no,
  //         Bill_Date,
  //         state_code,
  //         Item_Code,
  //         hsn,
  //         Basic_Price,
  //         Disc_1,
  //         Taxable,
  //         CGST_Perc,
  //         SGST_Perc,
  //         IGST_Perc,
  //         CGST,
  //         SGST,
  //         IGST,
  //         Export_Type,
  //         Server_id,
  //         Rnd_Ledg,
  //         Rnd_Off,
  //         inv_amt,
  //         Loc_Code,
  //         Sup_Qty,
  //         Catery,
  //         Item_Type,
  //         Sale_Type,
  //         Chassis,
  //         Engine,
  //         Ledger_Id,
  //         Ledger_Name,
  //         Narration,
  //         GST,
  //         LEDG_ACNT,
  //         Seq_No,
  //         PAN_NO,
  //         Executive,
  //         USR_CODE,
  //         ENTR_DATE,
  //         ENTR_TIME
  //     )
  //     SELECT
  //         @drd_id,
  //         (SELECT top 1 book_code FROM spare_lab_mst WHERE tran_id = @tran_id and Export_Type < 3),
  //         @billno,
  //         (SELECT top 1 INV_DATE FROM spare_lab_mst WHERE tran_id = @tran_id and Export_Type < 3),
  //         (SELECT TOP 1 misc_name FROM misc_mst WHERE misc_mst.misc_code = (SELECT TOP 1 State_code FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND misc_type = 3 AND EXPORT_TYPE < 3)),
  //   IIF(tran_type = 'parts', (select top 1 misc_name from misc_mst where misc_code = item_code and misc_type = 604), (select top 1 misc_name from misc_mst where misc_code = item_code and misc_type = 605)),
  //         hsn_code,
  //         rate,
  //         discount,
  //         IIF(quantity IS NULL, 1, quantity) * rate,
  //         IIF((SELECT State FROM down_mst WHERE dw_code = @location_code AND Export_Type < 3) collate database_default = (SELECT TOP 1 misc_name FROM misc_mst WHERE misc_mst.misc_code = (SELECT TOP 1 State_code FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID and export_type<3) AND misc_type = 3 AND EXPORT_TYPE < 3) collate database_default, GST_VALUE / 2, 0),
  //         IIF((SELECT State FROM down_mst WHERE dw_code = @location_code AND Export_Type < 3) collate database_default = (SELECT TOP 1 misc_name FROM misc_mst WHERE misc_mst.misc_code = (SELECT TOP 1 State_code FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID and export_type<3) AND misc_type = 3 AND EXPORT_TYPE < 3) collate database_default, GST_VALUE / 2, 0),
  //         IIF((SELECT State FROM down_mst WHERE dw_code = @location_code AND Export_Type < 3) collate database_default = (SELECT TOP 1 misc_name FROM misc_mst WHERE misc_mst.misc_code = (SELECT TOP 1 State_code FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID and export_type<3) AND misc_type = 3 AND EXPORT_TYPE < 3) collate database_default, 0,GST_VALUE),
  //         ROUND(((IIF(quantity IS NULL, 1, quantity) * rate - DISCOUNT) * IIF((SELECT State FROM down_mst WHERE dw_code = @location_code AND Export_Type < 3) collate database_default = (SELECT TOP 1 misc_name FROM misc_mst WHERE misc_mst.misc_code = (SELECT TOP 1 State_code FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID and export_type<3) AND misc_type = 3 AND EXPORT_TYPE < 3) collate database_default, GST_VALUE / 2, 0))/100,2),
  //         ROUND(((IIF(quantity IS NULL, 1, quantity) * rate - DISCOUNT) * IIF((SELECT State FROM down_mst WHERE dw_code = @location_code AND Export_Type < 3) collate database_default = (SELECT TOP 1 misc_name FROM misc_mst WHERE misc_mst.misc_code = (SELECT TOP 1 State_code FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID and export_type<3) AND misc_type = 3 AND EXPORT_TYPE < 3) collate database_default, GST_VALUE / 2, 0))/100,2),
  //         ROUND(((IIF(quantity IS NULL, 1, quantity) * rate - DISCOUNT) * IIF((SELECT State FROM down_mst WHERE dw_code = @location_code AND Export_Type < 3) collate database_default = (SELECT TOP 1 misc_name FROM misc_mst WHERE misc_mst.misc_code = (SELECT TOP 1 State_code FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID and export_type<3) AND misc_type = 3 AND EXPORT_TYPE < 3) collate database_default, 0,GST_VALUE))/100,2),
  //         0,
  //         1,
  //   '23',
  //   @rnd_off,
  //   @total_inv,
  //   --(SELECT TOP 1 TTL_INV_AMNT FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND EXPORT_TYPE < 3),
  //   @location_code,
  //         IIF(quantity IS NULL, 1, quantity),
  //         0,
  //         IIF(tran_type = 'parts', 2, 3),
  //         IIF(tran_type = 'parts', 'ods', 'Service'),
  //         (SELECT TOP 1 CHASS_NO FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND EXPORT_TYPE < 3),
  //         (SELECT TOP 1 VEHREGNO FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND EXPORT_TYPE < 3),
  //         (SELECT CUST_ID FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND EXPORT_TYPE < 3),
  //         (SELECT TOP 1 ledg_name FROM ledg_mst WHERE ledg_mst.ledg_code = @ledgcode AND Export_Type < 3),
  //         (SELECT TOP 1 REMARKS FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND EXPORT_TYPE < 3),
  //         (SELECT TOP 1 GST FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND EXPORT_TYPE < 3),
  //         @ledgcode,
  //         @seq,
  //         (SELECT TOP 1 Ledg_Pan FROM ledg_mst WHERE ledg_mst.ledg_code = @ledgcode AND Export_Type < 3),
  //         (SELECT TOP 1 SA_TL FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND EXPORT_TYPE < 3),
  //         @user_code,
  //         GETDATE(),
  //         FORMAT(GETDATE(), 'HH.mm')
  //     FROM SPARE_LAB_dtl
  //     WHERE tran_id = @tran_id AND EXPORT_TYPE < 3;
  //         print @billno
  //     -- Update inv_no in SPARE_LAB_mst
  //  UPDATE DMS_ROW_DATA
  //  SET Rnd_Off = inv_amt-(select top 1 sum(taxable + sgst + cgst + igst) from DMS_ROW_DATA where tran_id =@drd_id )
  //  WHERE tran_id = @drd_id;
  //  UPDATE SPARE_LAB_mst
  //     SET inv_no = @billno , DRD_ID = @drd_id
  //     WHERE TRAN_ID = @tran_id AND EXPORT_TYPE < 3;

  //     --Insert drd into VAS_TEMP for Financial Posting
  //     INSERT INTO VAS_TEMP (TRAN_ID, Export_Type) VALUES (@drd_id, 1);
  //     END;`,
  //         `drop PROCEDURE SevaSprDrdQueryServ`,
  //         `CREATE PROCEDURE SevaSprDrdQueryServ
  //     @tran_id INT,
  //     @location_code INT,
  //     @user_code INT
  // AS
  // BEGIN

  //     DECLARE @billno VARCHAR(255),
  //             @customerName VARCHAR(500),
  //             @remark VARCHAR(500),
  //    @narration VARCHAR(500),
  //             @seq INT,
  //             @drd_id VARCHAR(30),
  //    @rnd_off decimal(19,6),
  //    @total_inv decimal(19,6);
  //    SELECT @total_inv = round(SUM(ROUND(rate, 2) + (ROUND(rate, 2)* gst_value / 100)),0) FROM spare_lab_dtl where tran_id = @tran_id;

  //    SELECT @rnd_off = round(round(SUM(ROUND(rate, 2) + (ROUND(rate, 2)* gst_value / 100)),0)-SUM(ROUND(rate, 2) + (ROUND(rate, 2)* gst_value / 100)),2) FROM spare_lab_dtl where tran_id = @tran_id;

  //     SELECT @seq = ISNULL(MAX(seq_no) + 1, 1)
  //     FROM dms_row_data
  //     WHERE Export_Type < 3 and tran_type collate database_default= (SELECT top 1 book_code FROM spare_lab_mst WHERE tran_id = @tran_id and Export_Type < 3) collate database_default;

  //     SELECT  @drd_id = ISNULL(MAX(tran_id) + 1, 1)
  //     FROM DMS_ROW_DATA;

  //     -- Generate bill number
  //     SELECT @billno = CONCAT(
  //         (SELECT TOP 1 Book_Prefix
  //          FROM book_mst
  //          WHERE book_code  = (SELECT misc_dtl1 FROM misc_mst WHERE misc_code  = (SELECT top 1 book_code FROM spare_lab_mst WHERE tran_id = @tran_id and Export_Type < 3))
  //         ),
  //         @seq
  //     )

  //     -- Get ledger code
  //     SELECT @customerName = (SELECT cust_name FROM SPARE_LAB_MST WHERE TRAN_ID = @tran_id AND EXPORT_TYPE < 3);
  //     SELECT @remark = (SELECT REMARKS FROM SPARE_LAB_MST WHERE TRAN_ID = @tran_id AND EXPORT_TYPE < 3);

  //  SELECT @narration = CONCAT(@customerName, CHAR(13) + CHAR(10), @remark);

  //     -- Insert data into dms_row_data table
  //     INSERT INTO dms_row_data (
  //         Tran_Id,
  //         tran_type,
  //         bill_no,
  //         Bill_Date,
  //         state_code,
  //         Item_Code,
  //         hsn,
  //         Basic_Price,
  //         Disc_1,
  //         Taxable,
  //         CGST_Perc,
  //         SGST_Perc,
  //         IGST_Perc,
  //         CGST,
  //         SGST,
  //         IGST,
  //         Export_Type,
  //         Server_id,
  //         Rnd_Ledg,
  //         Rnd_Off,
  //         inv_amt,
  //         Loc_Code,
  //         Sup_Qty,
  //         Catery,
  //         Item_Type,
  //         Sale_Type,
  //         Chassis,
  //         Engine,
  //         Ledger_Name,
  //   Ledg_Add,
  //         Narration,
  //         GST,
  //         LEDG_ACNT,
  //         Seq_No,
  //         PAN_NO,
  //         Executive,
  //         USR_CODE,
  //         ENTR_DATE,
  //         ENTR_TIME
  //     )
  //     SELECT
  //         @drd_id,
  //         (SELECT top 1 book_code FROM spare_lab_mst WHERE tran_id = @tran_id and Export_Type < 3),
  //         @billno,
  //         (SELECT top 1 INV_DATE FROM spare_lab_mst WHERE tran_id = @tran_id and Export_Type < 3),
  //         (SELECT TOP 1 misc_name FROM misc_mst WHERE misc_mst.misc_code = (SELECT TOP 1 State_code FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND misc_type = 3 AND EXPORT_TYPE < 3)),
  //   IIF(tran_type = 'parts', (select top 1 misc_name from misc_mst where misc_code = item_code and misc_type = 604), (select top 1 misc_name from misc_mst where misc_code = item_code and misc_type = 605)),
  //         hsn_code,
  //         rate,
  //         discount,
  //         IIF(quantity IS NULL, 1, quantity) * rate,
  //         IIF((SELECT State FROM down_mst WHERE dw_code = @location_code AND Export_Type < 3) collate database_default = (SELECT TOP 1 misc_name FROM misc_mst WHERE misc_mst.misc_code = (SELECT TOP 1 State_code FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID and export_type<3) AND misc_type = 3 AND EXPORT_TYPE < 3) collate database_default, GST_VALUE / 2, 0),
  //         IIF((SELECT State FROM down_mst WHERE dw_code = @location_code AND Export_Type < 3) collate database_default = (SELECT TOP 1 misc_name FROM misc_mst WHERE misc_mst.misc_code = (SELECT TOP 1 State_code FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID and export_type<3) AND misc_type = 3 AND EXPORT_TYPE < 3) collate database_default, GST_VALUE / 2, 0),
  //         IIF((SELECT State FROM down_mst WHERE dw_code = @location_code AND Export_Type < 3) collate database_default = (SELECT TOP 1 misc_name FROM misc_mst WHERE misc_mst.misc_code = (SELECT TOP 1 State_code FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID and export_type<3) AND misc_type = 3 AND EXPORT_TYPE < 3) collate database_default, 0,GST_VALUE),
  //         ROUND(((IIF(quantity IS NULL, 1, quantity) * rate - DISCOUNT) * IIF((SELECT State FROM down_mst WHERE dw_code = @location_code AND Export_Type < 3) collate database_default = (SELECT TOP 1 misc_name FROM misc_mst WHERE misc_mst.misc_code = (SELECT TOP 1 State_code FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID and export_type<3) AND misc_type = 3 AND EXPORT_TYPE < 3) collate database_default, GST_VALUE / 2, 0))/100,2),
  //         ROUND(((IIF(quantity IS NULL, 1, quantity) * rate - DISCOUNT) * IIF((SELECT State FROM down_mst WHERE dw_code = @location_code AND Export_Type < 3) collate database_default = (SELECT TOP 1 misc_name FROM misc_mst WHERE misc_mst.misc_code = (SELECT TOP 1 State_code FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID and export_type<3) AND misc_type = 3 AND EXPORT_TYPE < 3) collate database_default, GST_VALUE / 2, 0))/100,2),
  //         ROUND(((IIF(quantity IS NULL, 1, quantity) * rate - DISCOUNT) * IIF((SELECT State FROM down_mst WHERE dw_code = @location_code AND Export_Type < 3) collate database_default = (SELECT TOP 1 misc_name FROM misc_mst WHERE misc_mst.misc_code = (SELECT TOP 1 State_code FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID and export_type<3) AND misc_type = 3 AND EXPORT_TYPE < 3) collate database_default, 0,GST_VALUE))/100,2),
  //         0,
  //         1,
  //   '23',
  //   @rnd_off,
  //   @total_inv,
  //   --(SELECT TOP 1 TTL_INV_AMNT FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND EXPORT_TYPE < 3),
  //   @location_code,
  //         IIF(quantity IS NULL, 1, quantity),
  //         0,
  //         IIF(tran_type = 'parts', 2, 3),
  //         IIF(tran_type = 'parts', 'ods', 'Service'),
  //         (SELECT TOP 1 CHASS_NO FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND EXPORT_TYPE < 3),
  //         (SELECT TOP 1 VEHREGNO FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND EXPORT_TYPE < 3),
  //         'VAS SERVICE CUSTOMER CONTROL A/C',
  //   (SELECT TOP 1 CUST_NAME FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND EXPORT_TYPE < 3),
  //         @narration,
  //         (SELECT TOP 1 GST FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND EXPORT_TYPE < 3),
  //         '361634',
  //         @seq,
  //         (SELECT TOP 1 PAN_NO FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND EXPORT_TYPE < 3),
  //         (SELECT TOP 1 SA_TL FROM SPARE_LAB_MST WHERE SPARE_LAB_MST.TRAN_ID = SPARE_LAB_DTL.TRAN_ID AND EXPORT_TYPE < 3),
  //         @user_code,
  //         GETDATE(),
  //         FORMAT(GETDATE(), 'HH.mm')
  //     FROM SPARE_LAB_dtl
  //     WHERE tran_id = @tran_id AND EXPORT_TYPE < 3;
  //         print @billno
  //     -- Update inv_no in SPARE_LAB_mst
  //  UPDATE DMS_ROW_DATA
  //  SET Rnd_Off = inv_amt-(select top 1 sum(taxable + sgst + cgst + igst) from DMS_ROW_DATA where tran_id =@drd_id )
  //  WHERE tran_id = @drd_id;
  //  UPDATE SPARE_LAB_mst
  //     SET inv_no = @billno , DRD_ID = @drd_id
  //     WHERE TRAN_ID = @tran_id AND EXPORT_TYPE < 3;

  //     --Insert drd into VAS_TEMP for Financial Posting
  //     INSERT INTO VAS_TEMP (TRAN_ID, Export_Type) VALUES (@drd_id, 99);
  //     END;`,

  //     ]
  // },
  {
    comments: "Discount",
    ID: 1000,
    queries: [
      `CREATE TABLE Dise_Criteria ( 
                        tran_id INT,
                        optn_id NVARCHAR(255),
                        cell_index int,
                        value NVARCHAR(255),
                        Range_1 INT, 
                        Range_2 INT,
                        color NVARCHAR(50)
                    );`,
      `

                    CREATE TABLE [dbo].[dise_aprvl](
                        [Mob] [varchar](10) NOT NULL,
                        [Pan_No] [varchar](20) NOT NULL,
                        [Cust_Name] [varchar](100) NULL,
                        [Modl_Var] [varchar](20) NOT NULL,
                        [Veh_Clr] [varchar](20) NOT NULL,
                        [Delv_Date] [date] NULL,
                        [Loan] [varchar](20) NOT NULL,
                        [MGA_Amt] [money] NULL,
                        [Insurance] [varchar](10) NOT NULL,
                        [RTO_Chrg] [varchar](20) NOT NULL,
                        [Loyalty_Card] [varchar](20) NOT NULL,
                        [Car_Exch] [varchar](20) NOT NULL,
                        [FastTeg] [varchar](20) NOT NULL,
                        [SRM] [varchar](20) NOT NULL,
                        [RM] [varchar](20) NOT NULL,
                        [Consumer] [money] NULL,
                        [Corporate] [money] NULL,
                        [Exch] [money] NULL,
                        [Aprvl_Offer] [money] NULL,
                        [Dise_Amt] [money] NULL,
                        [Aprvl_By] [varchar](20) NULL,
                        [Status] [varchar](10) NULL,
                        [Remark] [varchar](100) NULL,
                        [Curr_Date] [date] NULL,
                        [location] [varchar](50) NULL,
                        [Approved_amt] [money] NULL,
                        [aprvl_by2] [varchar](50) NULL,
                        [dual_apr] [varchar](2) NULL,
                        [modl_group] [int] NULL,
                        [tran_id] [int] IDENTITY(1,1) NOT NULL,
                        [wa_link] [nvarchar](100) NULL,
                        [apr2_apr] [int] NULL,
                        [export_type] [int] NULL,
                        [remark_dse] [varchar](150) NULL
                        )
                    `,
      "alter table dise_aprvl add[booking_id][varchar](20) NULL;",
      "alter table dise_aprvl add[UTD][varchar](20) NULL;",
      "alter table dise_aprvl add[isapp1][varchar](10) NULL;",
      "alter table dise_aprvl add[is_gd][varchar](10) NULL;",
      "alter table dise_aprvl add[CCP][int] NULL;",
      "alter table dise_aprvl add[EW][int] NULL;",
      "alter table dise_aprvl add[Fuel_Type][varchar](20) NULL;",
      "alter table dise_aprvl add[Var_Cd][varchar](20) NULL;",
      "alter table dise_aprvl add[waiting][int] NULL;",
      "alter table dise_aprvl add[reapp_remark][varchar](100) NULL;",
      "alter table dise_aprvl add[reapp_emp][varchar](20) NULL;",
      "alter table dise_aprvl add[Appr_1_Code][varchar](100) NULL;",
      "alter table dise_aprvl add[Appr_1_Stat][tinyint] NULL;",
      "alter table dise_aprvl add[Appr_1_Rem][varchar](300) NULL;",
      "alter table dise_aprvl add[Appr_2_Code][varchar](100) NULL;",
      "alter table dise_aprvl add[Appr_2_Stat][tinyint] NULL;",
      "alter table dise_aprvl add[Appr_2_Rem][varchar](300) NULL;",
      "alter table dise_aprvl add[Appr_3_Code][varchar](100) NULL;",
      "alter table dise_aprvl add[Appr_3_Stat][tinyint] NULL;",
      "alter table dise_aprvl add[Appr_3_Rem][varchar](300) NULL;",
      "alter table dise_aprvl add[Fin_Appr][tinyint] NULL;",
      "alter table dise_aprvl add[Created_At][datetime] NOT NULL;",
    ],
  },
  {
    comments: "gatepass",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[DIG_GP](
                        [UTD] [int] IDENTITY(1,1) NOT NULL,
                        [GP_TYPE] [int] NULL,
                        [RETURN_STAT] [int] NULL,
                        [OUT_TIME] [datetime] NULL,
                        [IN_TIME] [datetime] NULL,
                        [REASON] [varchar](100) NULL,
                        [REQ_DATE] [datetime] NOT NULL,
                        [APPR_1_CODE_A] [nvarchar](25) NULL,
                        [APPR_1_CODE_B] [nvarchar](25) NULL,
                        [APPR_2_CODE_A] [nvarchar](25) NULL,
                        [APPR_2_CODE_B] [nvarchar](25) NULL,
                        [APPR_3_CODE_A] [nvarchar](25) NULL,
                        [APPR_3_CODE_B] [nvarchar](25) NULL,
                        [APPR_BY_CODE_1] [nvarchar](25) NULL,
                        [APPR_BY_CODE_2] [nvarchar](25) NULL,
                        [APPR_BY_CODE_3] [nvarchar](25) NULL,
                        [APPR_STAT_1] [tinyint] NULL,
                        [APPR_STAT_2] [tinyint] NULL,
                        [APPR_STAT_3] [tinyint] NULL,
                        [ACT_OUT_TIME] [time](7) NULL,
                        [ACT_IN_TIME] [time](7) NULL,
                        [EMPCODE] [varchar](50) NULL,
                        [EMP_NAME] [varchar](100) NULL,
                        [FINAL_STAT] [varchar](1) NULL,
                    PRIMARY KEY CLUSTERED 
                    (
                        [UTD] ASC
                    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                    ) ON [PRIMARY]
                    
                    
                    ALTER TABLE [dbo].[DIG_GP] ADD  DEFAULT (getdate()) FOR [REQ_DATE]
                    
                    `,
    ],
  },
  {
    comments: "Messages",
    ID: 1000,
    queries: [
      `
                    CREATE TABLE [dbo].[MessageLog](
                        [msg_id] [int] IDENTITY(1,1) NOT NULL,
                        [messageDesc] [varchar](max) NULL,
                        [msgReceiverId] [varchar](20) NULL,
                        [msgSenderId] [varchar](20) NULL,
                        [msgTime] [datetime] NULL,
                        [msgTitle] [varchar](255) NULL,
                        [msgSenderName] [varchar](255) NULL,
                        [msgReceiverName] [varchar](255) NULL,
                    PRIMARY KEY CLUSTERED 
                    (
                        [msg_id] ASC
                    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                    ) ON [PRIMARY] TEXTIMAGE_ON 
                    [PRIMARY]
                    
                    
                    ALTER TABLE [dbo].[MessageLog] ADD  DEFAULT (getdate()) FOR [msgTime]
                    
                    `,
    ],
  },
  {
    comments: "Attendance table",
    ID: 1000,
    queries: [
      "ALTER TABLE attendancetable ADD Appr_1_Code VARCHAR(20);",
      "ALTER TABLE attendancetable ADD Appr_1_Stat int;",
      "ALTER TABLE attendancetable ADD Appr_1_Rem VARCHAR(255);",
      "ALTER TABLE attendancetable ADD Appr_2_Code VARCHAR(20);",
      "ALTER TABLE attendancetable ADD Appr_2_Stat int;",
      "ALTER TABLE attendancetable ADD Appr_2_Rem VARCHAR(255);",
      "ALTER TABLE attendancetable ADD Appr_3_Code VARCHAR(20);",
      "ALTER TABLE attendancetable ADD Appr_3_Stat int;",
      "ALTER TABLE attendancetable ADD Appr_3_Rem VARCHAR(255);",
      "ALTER TABLE attendancetable ADD Mi_Type int;",
      "ALTER TABLE attendancetable ADD UTD INT IDENTITY(1,1) PRIMARY KEY;",
      `CREATE TABLE [dbo].[Employee_AtnStatus](
                            [Utd] [int] IDENTITY(1,1) NOT NULL,
                            [Status] [varchar](50) NULL,
                            [Present] [int] NULL,
                            [Absent] [int] NULL,
                            [HalfDay] [int] NULL,
                            [WeekOff] [int] NULL,
                            [Relaxation] [int] NULL,
                            [Holiday] [int] NULL,
                            [colorCode] [varchar](10) NULL,
                            [Created_At] [datetime] NULL,
                            [Created_By] [varchar](255) NULL,
                            [Value] [decimal](10, 2) NULL,
                            [Present_Value] [decimal](10, 2) NULL,
                            [Absent_Value] [decimal](10, 2) NULL,
                            [HalfDay_Value] [decimal](10, 2) NULL,
                            [WeekOff_Value] [decimal](10, 2) NULL,
                            [Relaxation_Value] [decimal](10, 2) NULL,
                            [Holiday_Value] [decimal](10, 2) NULL,
                        ) ON [PRIMARY]

                        ALTER TABLE [dbo].[Employee_AtnStatus] ADD  DEFAULT (getdate()) FOR [Created_At]
                        `,
      `alter table Employee_AtnStatus add [penalty_days] [decimal](19, 2) NULL`,
    ],
  },
  {
    comments: "Approval matrix",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[Approval_Matrix](
                            [UTD] [int] IDENTITY(1,1) NOT NULL,
                            [module_code] [varchar](20) NULL,
                            [empcode] [varchar](20) NULL,
                            [approver1_A] [varchar](20) NULL,
                            [approver1_B] [varchar](20) NULL,
                            [approver2_A] [varchar](20) NULL,
                            [approver2_B] [varchar](20) NULL,
                            [approver3_A] [varchar](25) NULL,
                            [approver3_B] [varchar](25) NULL,
                            [Created_At] [datetime] NOT NULL,
                            [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
                            [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
                            [Created_by] [varchar](30) NULL,
                        PRIMARY KEY CLUSTERED 
                        (
                            [UTD] ASC
                        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                            PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
                        ) ON [PRIMARY]
                        WITH
                        (
                        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Approval_Matrix_Hst])
                        )
                        
                        
                        ALTER TABLE [dbo].[Approval_Matrix] ADD  DEFAULT (getdate()) FOR [Created_At]
                        
                        
                        ALTER TABLE [dbo].[Approval_Matrix] ADD  DEFAULT (getdate()) FOR [ValidFrom]
                        
                        `,
    ],
  },
  {
    comments: "emp track",
    ID: 1000,
    queries: [
      "alter table EMP_TRACK add ID int identity(1,1)",
      "alter table EMP_TRACK add TRACK_DATETIME datetime default getdate()",
      "alter table EMP_TRACK add [GEO_LOCATION] [nvarchar](100) NULL",
    ],
  },
  {
    comments: "Travel",
    ID: 1000,
    queries: [
      "ALTER TABLE TRAVEL_DTL add [Remark] [varchar](200) NULL;",
      "ALTER TABLE TRAVEL_DTL add [Appr_1_Code] [varchar](100) NULL;",
      "ALTER TABLE TRAVEL_DTL add [Appr_2_Code] [varchar](100) NULL;",
      "ALTER TABLE TRAVEL_DTL add [Appr_3_Code] [varchar](100) NULL;",
      "ALTER TABLE TRAVEL_DTL add [Appr_3_Stat] [tinyint] NULL;",
      "ALTER TABLE TRAVEL_DTL add [Appr_2_Stat] [tinyint] NULL;",
      "ALTER TABLE TRAVEL_DTL add [Appr_1_Stat] [tinyint] NULL;",
      "ALTER TABLE TRAVEL_DTL add [Appr_1_Rem] [varchar](300) NULL;",
      "ALTER TABLE TRAVEL_DTL add [Appr_2_Rem] [varchar](300) NULL;",
      "ALTER TABLE TRAVEL_DTL add [Appr_3_Rem] [varchar](300) NULL;",
      "ALTER TABLE TRAVEL_DTL add [Fin_Appr] [tinyint] NULL;",
    ],
  },
  {
    comments: "demo car gatepass",
    ID: 1000,
    queries: [
      `

                    CREATE TABLE [dbo].[Demo_Car_Gatepass](
                      [UTD] [int] IDENTITY(1,1) NOT NULL,
                      [EMPCODE] [varchar](50) NULL,
                      [EMP_NAME] [varchar](100) NULL,
                      [GP_TYPE] [int] NULL,
                      [CUSTOMER_NAME] [varchar](100) NULL,
                      [CUSTOMER_MOBILE] [varchar](100) NULL,
                      [DRIVER_CODE] [varchar](100) NULL,
                      [VEH_REG] [varchar](20) NULL,
                      [MODEL_CODE] [varchar](100) NULL,
                      [REQ_DATE] [datetime] NOT NULL,
                      [ACT_OUT_TIME] [time](7) NULL,
                      [ACT_IN_TIME] [time](7) NULL,
                      [KM] [float] NULL,
                      [LAST_KM] [float] NULL,
                      [OUT_TIME] [datetime] NULL,
                      [IN_TIME] [datetime] NULL,
                      [REMARK] [varchar](100) NULL,
                      [GUARD_CODE] [varchar](50) NULL,
                      [GUARD_CODE_IN] [varchar](255) NULL,
                      [Out_Image] [varchar](100) NULL,
                      [In_Image] [varchar](100) NULL,
                      [Appr_1_Code] [varchar](100) NULL,
                      [Appr_1_Stat] [tinyint] NULL,
                      [Appr_1_Rem] [varchar](300) NULL,
                      [Appr_2_Code] [varchar](100) NULL,
                      [Appr_2_Stat] [tinyint] NULL,
                      [Appr_2_Rem] [varchar](300) NULL,
                      [Appr_3_Code] [varchar](100) NULL,
                      [Appr_3_Stat] [tinyint] NULL,
                      [Appr_3_Rem] [varchar](300) NULL,
                      [Fin_Appr] [tinyint] NULL,
                      [LOC_CODE] [varchar](20) NULL,
                      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
                      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
                    PRIMARY KEY CLUSTERED 
                    (
                  [UTD] ASC
                      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
                      ) ON [PRIMARY]
                      WITH
                      (
                          SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Demo_Car_Gatepass_hst])
                      )`,
      `ALTER TABLE [dbo].[Demo_Car_Gatepass] ADD  DEFAULT (getdate()) FOR [REQ_DATE]`,
    ],
  },
  {
    comments: "Petty cash",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[PETTY_CASH](
                            [UTD] [int] IDENTITY(1,1) NOT NULL,
                            [Requested_Date] [datetime] NOT NULL,
                            [EmpCode] [nvarchar](20) NULL,
                            [Req_Amount] [money] NULL,
                            [Apr_Amt] [money] NULL,
                            [Purpose] [nvarchar](300) NULL,
                            [Remark] [nvarchar](300) NULL,
                            [Loc_Code] [int] NULL,
                            [Pymt_Mode] [int] NULL,
                            [Status] [varchar](50) NULL,
                            [Created_At] [datetime] NOT NULL,
                            [Remark1] [varchar](100) NULL,
                            [Remark2] [varchar](100) NULL,
                            [Remark3] [varchar](100) NULL,
                            [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
                            [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
                            [Created_by] [varchar](50) NULL,
                        PRIMARY KEY CLUSTERED 
                        (
                            [UTD] ASC
                        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                            PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
                        ) ON [PRIMARY]
                        WITH
                        (
                        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PETTY_CASH__HST])
                        )
                        
                        ALTER TABLE [dbo].[PETTY_CASH] ADD  DEFAULT (getdate()) FOR [Requested_Date]
                        
                        ALTER TABLE [dbo].[PETTY_CASH] ADD  DEFAULT (getdate()) FOR [Created_At]
                        
                        ALTER TABLE [dbo].[PETTY_CASH] ADD  DEFAULT (getdate()) FOR [ValidFrom]
                        
                        `,
    ],
  },
  {
    comments: "BUDGET",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[BUDGET](
                            [Utd] [int] IDENTITY(1,1) NOT NULL,
                            [TYPE] [nvarchar](40) NULL,
                            [CATERY] [nvarchar](40) NOT NULL,
                            [LOC_CODE] [int] NULL,
                            [UNIT] [int] NULL,
                            [VALUE] [money] NULL,
                            [Created_by] [nvarchar](30) NOT NULL,
                            [Created_At] [datetime] NOT NULL,
                            [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
                            [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
                        PRIMARY KEY CLUSTERED 
                        (
                            [Utd] ASC
                        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                            PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
                        ) ON [PRIMARY]
                        WITH
                        (
                        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[BUDGET_Hst])
                        )
                        
                        
                        ALTER TABLE [dbo].[BUDGET] ADD  DEFAULT (getdate()) FOR [Created_At]
                        
                        
                        ALTER TABLE [dbo].[BUDGET] ADD  DEFAULT (getdate()) FOR [ValidFrom]
                        
                        `,
    ],
  },
  {
    comments: "Expense Approval",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[Expense_Approval_Matrix](
                            [UTD] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY CLUSTERED,
                            [Branch_Code] [int] NOT NULL,
                            [Approver_1A] [int] NULL,
                            [Approver_1B] [int] NULL,
                            [Approver_1C] [int] NULL,
                            [Approver_2A] [int] NULL,
                            [Approver_2B] [int] NULL,
                            [Approver_2C] [int] NULL,
                            [Approver_3A] [int] NULL,
                            [Approver_3B] [int] NULL,
                            [Approver_3C] [int] NULL,
                            [Created_By] [int] NULL,
                            [Created_At] [datetime] NOT NULL DEFAULT GETDATE(),
                            [ValidFrom] DATETIME2 GENERATED ALWAYS AS ROW START DEFAULT GETDATE(),
                            [ValidTo] DATETIME2 GENERATED ALWAYS AS ROW END,
                            PERIOD FOR SYSTEM_TIME(ValidFrom, ValidTo)
                        )
                        WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.Expense_Approval_Matrix_Hst));
                        `,
      `CREATE TABLE [dbo].[Expense_Approval](
                            [UTD] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY CLUSTERED,
                            [Drd_Id] [int] NOT NULL,
                            [Acnt_Id] [int] NULL,
                            [Utr_no] [varchar](100),
                            [Utr_Date] [date],
                            [Autovyn_Pymt_Vch] varchar(300),
                            [Pymt_Done] [tinyint] NULL,
                            [Appr_1_Code] [int] NULL,
                            [Appr_1_Stat] [tinyint] NULL,
                            [Appr_1_Rem] [varchar](300) NULL,
                            [Appr_2_Code] [int] NULL,
                            [Appr_2_Stat] [tinyint] NULL,
                            [Appr_2_Rem] [varchar](300) NULL,
                            [Appr_3_Code] [int] NULL,
                            [Appr_3_Stat] [tinyint] NULL,
                            [Appr_3_Rem] [varchar](300) NULL,
                            [Fin_Appr] [tinyint] NULL,
                            [Created_By] [int] NULL,
                            [Created_At] [datetime] NOT NULL DEFAULT GETDATE(),
                            [ValidFrom] DATETIME2 GENERATED ALWAYS AS ROW START DEFAULT GETDATE(),
                            [ValidTo] DATETIME2 GENERATED ALWAYS AS ROW END,
                            PERIOD FOR SYSTEM_TIME(ValidFrom, ValidTo)
                        )
                        WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.Expense_Approval_Hst));
                        `,
      `alter table Expense_Approval_Matrix ADD module nvarchar(50)`,
    ],
  },
  {
    comments: "Expense Management",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[Expense_Template](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Template_Id] [int] NOT NULL,
              [Template_Name] [varchar](100) NOT NULL,
              [Field_Name] [varchar](255) NOT NULL,
              [Field_Type] [varchar](255) NULL,
              [Field_Req] [int] NULL,
              [Field_Attr] [int] NULL,
              [Table_field] [varchar](30) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [Export_type] [int] NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Expense_Template_Hst])
            )
            ALTER TABLE [dbo].[Expense_Template] ADD  DEFAULT (getdate()) FOR [Created_At]
            ALTER TABLE [dbo].[Expense_Template] ADD  DEFAULT (getdate()) FOR [ValidFrom]
            `,
      `CREATE TABLE [dbo].[Expense_Mng](
              [Expense_Id] [int] IDENTITY(1,1) NOT NULL,
              [Template_Id] [int] NOT NULL,
              [REMARK] [varchar](100) NULL,
              [EMP_CODE] [varchar](30) NULL,
              [LOCATION] [varchar](20) NULL,
              [Appr_1_Code] [varchar](30) NULL,
              [Appr_1_Stat] [tinyint] NULL,
              [Appr_1_Rem] [varchar](300) NULL,
              [Appr_2_Code] [varchar](30) NULL,
              [Appr_2_Stat] [tinyint] NULL,
              [Appr_2_Rem] [varchar](300) NULL,
              [Appr_3_Code] [varchar](30) NULL,
              [Appr_3_Stat] [tinyint] NULL,
              [Appr_3_Rem] [varchar](300) NULL,
              [Fin_Appr] [tinyint] NULL,
              [Created_By] [varchar](30) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
            PRIMARY KEY CLUSTERED 
            (
              [Expense_Id] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Expense_Mng_Hst])
            )
            ALTER TABLE [dbo].[Expense_Mng] ADD  DEFAULT (getdate()) FOR [Created_At]
            ALTER TABLE [dbo].[Expense_Mng] ADD  DEFAULT (getdate()) FOR [ValidFrom]
            `,
      `CREATE TABLE [dbo].[Expense_Mng_Dtl](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Expense_Id] [int] NOT NULL,
              [Template_Id] [int] NOT NULL,
              [DESCRIPTION] [varchar](100) NULL,
              [LOCATION] [varchar](255) NULL,
              [RATE] [decimal](19, 2) NULL,
              [QTY] [decimal](19, 2) NULL,
              [AMOUNT] [decimal](19, 2) NULL,
              [F_1] [varchar](150) NULL,
              [F_2] [varchar](150) NULL,
              [F_3] [varchar](150) NULL,
              [F_4] [varchar](150) NULL,
              [F_5] [varchar](150) NULL,
              [F_6] [varchar](150) NULL,
              [F_7] [varchar](150) NULL,
              [F_8] [varchar](150) NULL,
              [F_9] [varchar](150) NULL,
              [F_10] [varchar](150) NULL,
              [Export_type] [int] NULL,
              [Created_By] [varchar](30) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Expense_Mng_Dtl_Hst])
            )
            ALTER TABLE [dbo].[Expense_Mng_Dtl] ADD  DEFAULT (getdate()) FOR [Created_At]
            ALTER TABLE [dbo].[Expense_Mng_Dtl] ADD  DEFAULT (getdate()) FOR [ValidFrom]
            `,
    ],
  },
  {
    comments: "mandatory fields",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[Mandatory_Fields](
                            [Utd] [int] IDENTITY(1,1) NOT NULL,
                            [Form_Name] [varchar](255) NOT NULL,
                            [Field_Name] [varchar](255) NOT NULL,
                            [Label_Id] [varchar](255) NULL,
                            [Field_Id] [varchar](255) NOT NULL,
                            [Table_ColumnName] [varchar](255) NULL,
                            [Is_Mandatory] [bit] NOT NULL,
                            [created_by] [varchar](255) NULL,
                            [created_at] [datetime] NOT NULL,
                            [Is_Image] [int] NULL,
                        PRIMARY KEY CLUSTERED 
                        (
                            [Utd] ASC
                        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                        ) ON [PRIMARY]
                        
                        
                        ALTER TABLE [dbo].[Mandatory_Fields] ADD  DEFAULT (getdate()) FOR [created_at]
                        `,
      `drop PROCEDURE CheckMandatoryFields`,
      `CREATE PROCEDURE CheckMandatoryFields  
                        @empCode VARCHAR(50)  
                    AS  
                    BEGIN  
                    DECLARE @sql NVARCHAR(MAX) = '';
                    SELECT @sql = @sql + 
                      'SELECT IIF(' + Table_ColumnName + ' IS NULL OR ' + Table_ColumnName + ' = '''', 1, 0) AS result, ' + 
                      CAST(Utd AS NVARCHAR) + ' AS Utd, ''' + Field_Name + ''' AS Field_Name, ''' + Label_Id + ''' AS Label_Id, ''' + Field_Id + ''' AS Field_Id, ''' + Table_ColumnName + ''' AS Table_ColumnName, ' + 
                      CAST(Is_Mandatory AS NVARCHAR) + ' AS Is_Mandatory FROM employeemaster WHERE empcode  collate database_default = ''' + @empCode + ''' collate database_default UNION ALL ' 
                    FROM Mandatory_Fields
                    WHERE Is_Image = 0 AND Is_Mandatory = 1;
                    
                    select @sql = @sql + 
                      'SELECT IIF((
                      select DOC_PATH from EMP_DOCS where EMP_CODE collate database_default = empcode collate database_default and columndoc_type = ''EMPLOYEE'' and misspunch_inout = ' + Table_ColumnName + ' 
                    ) IS NULL OR (
                      select DOC_PATH from EMP_DOCS where EMP_CODE collate database_default = empcode collate database_default and columndoc_type = ''EMPLOYEE'' and misspunch_inout = ' + Table_ColumnName + ' 
                    ) = '''', 1, 0) AS result, ' + 
                      CAST(Utd AS NVARCHAR) + ' AS Utd, ''' + Field_Name + ''' AS Field_Name, ''' + Label_Id + ''' AS Label_Id, ''' + Field_Id + ''' AS Field_Id, ''' + Table_ColumnName + ''' AS Table_ColumnName, ' + 
                      CAST(Is_Mandatory AS NVARCHAR) + ' AS Is_Mandatory FROM employeemaster WHERE empcode collate database_default = ''' + @empCode + ''' collate database_default UNION ALL ' 
                    FROM Mandatory_Fields
                    WHERE Is_Image = 1 AND Is_Mandatory = 1;
                    
                    IF LEN(@sql) >= LEN(' UNION ALL ')
                    SET @sql = LEFT(@sql, LEN(@sql) - LEN(' UNION ALL '));
                IF LEN(@sql) >= LEN(' UNION ALL ')
                set @sql = 'select * from ('+ @sql +') as dg where result = 1 and Is_Mandatory = 1';
                ELSE set @sql = 'select top 0  1 as result,	Utd	,Field_Name	,Label_Id	,Field_Id	,Table_ColumnName	,Is_Mandatory from Mandatory_Fields'	
                print @sql;
                EXEC sp_executesql @sql;
                  END;`,
    ],
  },
  {
    comments: "Loan Advance",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[Advance_Mst](
                            [UTD] [int] IDENTITY(1,1) NOT NULL,
                            [EMPCODE] [varchar](50) NULL,
                            [SRNO] [int] NULL,
                            [REQUEST_DATE] [date] NULL,
                            [TRAN_TYPE] [varchar](25) NULL,
                            [REQ_AMOUNT] [money] NULL,
                            [SANC_AMOUNT] [money] NULL,
                            [TENURE_MONTH] [int] NULL,
                            [REPAYMENT_START_DATE] [date] NULL,
                            [PENDING_BAL] [money] NULL,
                            [TOTAL_RECIEVED] [money] NULL,
                            [APPR_1_CODE] [varchar](25) NULL,
                            [APPR_1_DATE] [date] NULL,
                            [APPR_2_CODE] [varchar](25) NULL,
                            [APPR_2_DATE] [date] NULL,
                            [APPR_3_CODE] [varchar](25) NULL,
                            [APPR_3_DATE] [date] NULL,
                            [APPR_1_STATUS] [smallint] NULL,
                            [APPR_2_STATUS] [smallint] NULL,
                            [APPR_3_STATUS] [smallint] NULL,
                            [FINAL_APPRV] [smallint] NULL,
                            [REPAYMENT_DONE] [smallint] NULL,
                            [LOC_CODE] [int] NULL,
                            [CREATED_BY] [varchar](200) NULL,
                            [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
                            [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
                            [Reason] [varchar](300) NULL,
                            [appr_1_remark] [varchar](400) NULL,
                            [appr_2_remark] [varchar](400) NULL,
                            [appr_3_remark] [varchar](400) NULL,
                            [account_remark] [varchar](300) NULL,
                        PRIMARY KEY CLUSTERED 
                        (
                            [UTD] ASC
                        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                            PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
                        ) ON [PRIMARY]
                        WITH
                        (
                        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Advance_Mst_Hst])
                        )
                        
                        
                        ALTER TABLE [dbo].[Advance_Mst] ADD  DEFAULT (getdate()) FOR [REQUEST_DATE]
                        
                        
                        ALTER TABLE [dbo].[Advance_Mst] ADD  DEFAULT (getdate()) FOR [ValidFrom]
                        `,
      `CREATE TABLE [dbo].[Advance_Dtl](
                            [UTD] [int] IDENTITY(1,1) NOT NULL,
                            [TRAN_ID] [int] NULL,
                            [INO] [int] NULL,
                            [INST_DATE] [date] NULL,
                            [INST_AMT] [money] NULL,
                            [REM_BAL] [money] NULL,
                            [PYMT_RECVD] [smallint] NULL,
                            [PYMT_REC_DATE] [date] NULL,
                            [CREATED_BY] [varchar](200) NULL,
                            [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
                            [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
                        PRIMARY KEY CLUSTERED 
                        (
                            [UTD] ASC
                        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                            PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
                        ) ON [PRIMARY]
                        WITH
                        (
                        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Advance_Dtl_Hst])
                        )
                        
                        
                        ALTER TABLE [dbo].[Advance_Dtl] ADD  DEFAULT (getdate()) FOR [ValidFrom]
                        `,
    ],
  },
  {
    comments: "Booking Refund",
    ID: 1000,
    queries: [
      `CREATE TABLE [dbo].[Booking_Refund](
                            [Tran_id] [int] IDENTITY(1,1) NOT NULL,
                            [SRM] [varchar](20) NOT NULL,
                            [location] [varchar](50) NULL,
                            [export_type] [int] NULL,
                            [remark_dse] [varchar](150) NULL,
                            [booking_id] [varchar](20) NULL,
                            [UTD] [varchar](20) NULL,
                            [Appr_1_Code] [varchar](100) NULL,
                            [Appr_1_Stat] [tinyint] NULL,
                            [Appr_1_Rem] [varchar](300) NULL,
                            [Appr_2_Code] [varchar](100) NULL,
                            [Appr_2_Stat] [tinyint] NULL,
                            [Appr_2_Rem] [varchar](300) NULL,
                            [Appr_3_Code] [varchar](100) NULL,
                            [Appr_3_Stat] [tinyint] NULL,
                            [Appr_3_Rem] [varchar](300) NULL,
                            [Fin_Appr] [tinyint] NULL,
                            [Created_date] [date] NULL,
                            [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
                            [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
                            [Dms_Code] [varchar](20) NULL,
                            [Created_by] [varchar](40) NULL,
                            [is_gd] [tinyint] NULL,
                            [Booking_Amt] [decimal](19, 2) NULL,
                            [Approved_Amt] [decimal](19, 2) NULL,
                            [Refund_id] [varchar](50) NULL,
                        PRIMARY KEY CLUSTERED 
                        (
                            [Tran_id] ASC
                        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                            PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
                        ) ON [PRIMARY]
                        WITH
                        (
                        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Booking_Refund_Hst])
                        )
                        ALTER TABLE [dbo].[Booking_Refund] ADD  DEFAULT (getdate()) FOR [Created_date]
                        ALTER TABLE [dbo].[Booking_Refund] ADD  DEFAULT (getdate()) FOR [ValidFrom]          
                        `,
      `alter table booking_refund add 	[Booking_Amt_Actual] [decimal](19, 2) NULL;`,
      `alter table booking_refund add 	[Adnl_Amt] [decimal](19, 2) NULL;`,
      `alter table booking_refund add 	[Cncl_Charges] [decimal](19, 2) NULL;`,
      `alter table booking_refund add 	[Final_Amount] [decimal](19, 2) NULL;`,
    ],
  },
  {
    comments: "mandatory Inserts",
    ID: 1000,
    queries: [
      `IF NOT EXISTS (SELECT 1 FROM user_tbl WHERE user_code = 1 AND user_name = 'ADMIN' AND module_code = 10 AND export_type = 1)
                        BEGIN
                            INSERT INTO user_tbl (user_code, user_name, user_pwd, module_code, multi_loc, export_type, serverid)
                            VALUES (1, 'ADMIN', 'user@123', 10, 1, 1, 1)
                        END            
                        `,
      `IF NOT EXISTS (SELECT 1 FROM rights WHERE  User_Code = 1 AND Optn_Name = 'O_ADDUSER' AND Optn_Valu = 1 AND Module_Code = 10)
                        BEGIN
                            INSERT INTO rights (Comp_Code, User_Code, Optn_Name, Optn_Valu, Module_Code, LOC_CODE, USR_CODE, SERVERID)
                            VALUES (1, 1, 'O_ADDUSER', 1, 10, NULL, NULL, 0)
                        END
                        `,
      `IF NOT EXISTS (SELECT 1 FROM user_rights WHERE user_code = 1 AND module_code = 10 AND optn_name = '8.1.1')
                        BEGIN
                            INSERT INTO user_rights (user_code, module_code, optn_name)
                            VALUES (1, 10, '8.1.1')
                        END
                        `,
      `IF NOT EXISTS (SELECT 1 FROM user_rights WHERE user_code = 1 AND module_code = 10 AND optn_name = '8.1.2')
                        BEGIN
                            INSERT INTO user_rights (user_code, module_code, optn_name)
                            VALUES (1, 10, '8.1.2')
                        END
                        `,
      `IF NOT EXISTS (SELECT 1 FROM user_rights WHERE user_code = 1 AND module_code = 10 AND optn_name = '8.1.3')
                        BEGIN
                            INSERT INTO user_rights (user_code, module_code, optn_name)
                            VALUES (1, 10, '8.1.3')
                        END
                        `,
      `IF NOT EXISTS (SELECT 1 FROM user_rights WHERE user_code = 1 AND module_code = 10 AND optn_name = '8.1.4')
                        BEGIN
                            INSERT INTO user_rights (user_code, module_code, optn_name)
                            VALUES (1, 10, '8.1.4')
                        END
                        `,
      `IF NOT EXISTS (SELECT 1 FROM user_rights WHERE user_code = 1 AND module_code = 10 AND optn_name = '8.1.5')
                        BEGIN
                            INSERT INTO user_rights (user_code, module_code, optn_name)
                            VALUES (1, 10, '8.1.5')
                        END
                        `,
      `IF NOT EXISTS (SELECT 1 FROM user_rights WHERE user_code = 1 AND module_code = 10 AND optn_name = '8.1.6')
                        BEGIN
                            INSERT INTO user_rights (user_code, module_code, optn_name)
                            VALUES (1, 10, '8.1.6')
                        END
                        `,
      `IF NOT EXISTS (SELECT 1 FROM user_rights WHERE user_code = 1 AND module_code = 10 AND optn_name = '8.1.7')
                        BEGIN
                            INSERT INTO user_rights (user_code, module_code, optn_name)
                            VALUES (1, 10, '8.1.7')
                        END
                        `,
      `IF NOT EXISTS (SELECT 1 FROM user_rights WHERE user_code = 1 AND module_code = 10 AND optn_name = '8.1.8')
                        BEGIN
                            INSERT INTO user_rights (user_code, module_code, optn_name)
                            VALUES (1, 10, '8.1.8')
                        END
                        `,

      `IF NOT EXISTS (SELECT top 1 1 FROM comp_keydata)
                        BEGIN
                            INSERT INTO comp_keydata (Comp_Code	,M1	,M2	,M3	,M4	,M5	,M6	,M7,M8,	M9,	M10,M11,DISC_DUAL_APRVL,DUAL_APRVL_MSG)
							VALUES (1,1,1,1,1,1,1,1,1,1,1,1,1,1)
                        END
                        `,
      `DECLARE @MandatoryFields TABLE (
                            Utd INT,
                            Form_Name NVARCHAR(255),
                            Field_Name NVARCHAR(255),
                            Label_Id NVARCHAR(255),
                            Field_Id NVARCHAR(255),
                            Table_ColumnName NVARCHAR(255),
                            Is_Mandatory BIT,
                            created_by NVARCHAR(255),
                            created_at DATETIME,
                            Is_Image BIT
                        );

                        INSERT INTO @MandatoryFields (Utd, Form_Name, Field_Name, Label_Id, Field_Id, Table_ColumnName, Is_Mandatory, created_by, created_at, Is_Image)
                        VALUES
                        (1, 'ProfileUpdateMobile', 'Mobile Number', 'input_layout_mobile', 'edtMobileNumber', 'MOBILENO', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (2, 'ProfileUpdateMobile', 'Land Line', 'inputLandLine', 'edtLandLineNumber', 'landline_no', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (3, 'ProfileUpdateMobile', 'Company Email', 'input_layout_email', 'edtEmail', 'CORPORATEMAILID', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (4, 'ProfileUpdateMobile', 'Personal Email', 'input_layout_AlternateEmail', 'edtAlternateEmail', 'ALTERNET_MAIL', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (5, 'ProfileUpdateMobile', 'Gender', 'txtGender', 'spinGender', 'GENDER', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (6, 'ProfileUpdateMobile', 'DOB', 'input_layout_DOB', 'edtDOB', 'DOB', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (7, 'ProfileUpdateMobile', 'Marital Status', 'txtMaritalStatus', 'spinMaritalStatus', 'MARITALSTATUS', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (8, 'ProfileUpdateMobile', 'DOM', 'input_layout_DOM', 'edtDOM', 'DOM', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (9, 'ProfileUpdateMobile', 'Father Name', 'input_layout_fatherName', 'edtFatherName', 'FATHERNAME', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (10, 'ProfileUpdateMobile', 'Father Occupation', 'txtFatherOccupation', 'spinFatherOccupation', 'FATHEROCCUPATION', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (11, 'ProfileUpdateMobile', 'Father Mobile', 'inputFatherMobile', 'edtFatherMobile', 'Father_Mob', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (12, 'ProfileUpdateMobile', 'Mother Name', 'inputMotherName', 'edtMotherName', 'MOTHERNAME', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (13, 'ProfileUpdateMobile', 'Mother Mobile', 'inputMotherMobile', 'edtMotherMobile', 'Mother_Mob', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (14, 'ProfileUpdateMobile', 'Spouse Name', 'inputSpouseName', 'edtSpouseName', 'SPOUSENAME', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (15, 'ProfileUpdateMobile', 'Spouse Mobile', 'inputSpouseMobile', 'edtSpouseMobile', 'Spouse_Mob', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (16, 'ProfileUpdateMobile', 'Spouse Gender', 'txtSpouseGender', 'spinSpouseGender', 'SPOUSEGENDER', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (17, 'ProfileUpdateMobile', 'Sibling Name', 'inputSiblingName', 'edtSiblingName', 'SIBLINGNAME', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (18, 'ProfileUpdateMobile', 'Sibling Mobile', 'inputSiblingMobile', 'edtSiblingMobile', 'SIBLINGCONTACTNO', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (19, 'ProfileUpdateMobile', 'Emergency Name', 'inputEmergencyName', 'edtEmergencyName', 'EMERGENCYNAME', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (20, 'ProfileUpdateMobile', 'Emergency Mobile', 'inputEmergencyMobile', 'edtEmergencyMobile', 'EMERGENCYNO', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (21, 'ProfileUpdateMobile', 'PAN NO', 'input_layout_PANNO', 'edtPANNO', 'PANNO', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (22, 'ProfileUpdateMobile', 'Aadhar No', 'input_layout_ADHARNO', 'edtADHARNO', 'uid_no', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (23, 'ProfileUpdateMobile', 'Permanent Address 1', 'inputPermanentAddress1', 'edtPermanentAddress1', 'PERMANENTADDRESS1', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (24, 'ProfileUpdateMobile', 'Permanent Address 2', 'inputPermanentAddress2', 'edtPermanentAddress2', 'PERMANENTADDRESS2', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (25, 'ProfileUpdateMobile', 'Permanent City', 'txtPCity', 'spinPCity', 'PCITY', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (26, 'ProfileUpdateMobile', 'Permanent State', 'txtPState', 'spinPState', 'PSTATE', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (27, 'ProfileUpdateMobile', 'Permanent Pincode', 'inputPermanentPincode', 'edtPermanentPincode', 'PPINCODE', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (28, 'ProfileUpdateMobile', 'Current Address 1', 'inputCurrentAddress1', 'edtCurrentAddress1', 'CURRENTADDRESS1', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (29, 'ProfileUpdateMobile', 'Current Address 2', 'inputCurrentAddress2', 'edtCurrentAddress2', 'CURRENTADDRESS2', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (30, 'ProfileUpdateMobile', 'Current City', 'txtCCity', 'spinCCity', 'CCITY', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (31, 'ProfileUpdateMobile', 'Current State', 'txtCState', 'spinCState', 'CSTATE', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (32, 'ProfileUpdateMobile', 'CurrentPincode', 'inputCurrentPincode', 'edtCurrentPincode', 'CPINCODE', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (33, 'ProfileUpdateMobile', 'Blood Group', 'txtBloodGroup', 'spinBloodGroup', 'BLOODGROUP', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (34, 'ProfileUpdateMobile', 'Skills', 'inputSKILLS', 'edtSkills', 'SKILLS', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (37, 'ProfileUpdateMobile', 'Previous Company', 'inputPreviousCompanyName', 'edtPreviousCompanyName', 'PREVIOUSCOMPANYNAME', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (38, 'ProfileUpdateMobile', 'Previous Company Contact', 'inputPreviousCompanyContact', 'edtPreviousCompanyContact', 'PRECOMPCONTACTNO', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (39, 'ProfileUpdateMobile', 'Previous Company City', 'txtPreCity', 'spinPreviousCompanyCity', 'PRECOMPCITY', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (40, 'ProfileUpdateMobile', 'Previous Joining', 'inputPreviousJoiningDate', 'edtPreviousJoiningDate', 'PREJOININGDATE', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (41, 'ProfileUpdateMobile', 'Previous Leaving', 'inputPreviousEndDate', 'edtPreviousEndDate', 'PREENDDATE', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (42, 'ProfileUpdateMobile', 'Previous Designation', 'inputPreviousDesignation', 'edtPreviousDesignation', 'PREDESIGNATION', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (43, 'ProfileUpdateMobile', 'Passport No', 'inputPassportNo', 'edtPassportNo', 'PASSPORTNO', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (44, 'ProfileUpdateMobile', 'Passport Expiry', 'input_layout_PassportExpiryDate', 'edtPassportExpiryDate', 'PASSEXPIRYDATE', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (45, 'ProfileUpdateMobile', 'PF', 'input_layout_Pfnumber', 'edtPfnumber', 'pfnumber', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (46, 'ProfileUpdateMobile', 'ESI No', 'input_layout_Esinumber', 'edtEsinumber', 'esinumber', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (47, 'ProfileUpdateMobile', 'Driving License Number', 'inputDrivingLicNumber', 'edtDrivingLicNumber', 'driving_licence', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (48, 'ProfileUpdateMobile', 'Driving License Date', 'inputDrivingLicDate', 'edtDrivingLicDate', 'DRIVINGLIC_ISSUEDATE', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (49, 'ProfileUpdateMobile', 'Driving License', 'inputDrivingLicPlace', 'edtDrivingLicPlace', 'DRIVINGLIC_ISSUEPALACE', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (50, 'ProfileUpdateMobile', 'Employee Height', 'inputEmployeeHeight', 'edtEmployeeHeight', 'EMPHEIGHT', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (51, 'ProfileUpdateMobile', 'Employee Weight', 'inputEmployeeWeight', 'edtEmployeeWeight', 'EMPWEIGHT', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (52, 'ProfileUpdateMobile', 'Children Detail', 'inputChildrenDetail', 'edtChildrenDetail', 'CHILDREN_DETAIL', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (53, 'ProfileUpdateMobile', 'Language Known', 'inputLanguageDetail', 'edtLanguageDetail', 'LANGUAGE_DETAIL', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (54, 'ProfileUpdateMobile', 'Religion', 'txtReligion', 'spinReligion', 'relcode', 0, NULL, '2024-04-18 11:48:05.843', 0),
                        (55, 'ProfileUpdateMobile', 'Upload Aadhar Card Image', 'imgAadharCont', 'imgSelectAadhar', '2', 0, NULL, '2024-04-18 11:48:05.843', 1),
                        (56, 'ProfileUpdateMobile', 'Upload PAN Card Image', 'imgPANCont', 'imgSelectPAN', '3', 0, NULL, '2024-04-18 11:48:05.843', 1),
                        (57, 'ProfileUpdateMobile', 'Upload Salary Slip Image', 'imgSalarySlipCont', 'imgSelectSalarySlip', '4', 0, NULL, '2024-04-18 11:48:05.843', 1),
                        (58, 'ProfileUpdateMobile', 'Upload Other Document', 'imgOtherCont', 'imgSelectOther', '5', 0, NULL, '2024-04-18 11:48:05.843', 1),
                        (59, 'ProfileUpdateMobile', 'Profile Image', 'imgProfileCont', 'imgSelectProfile', '1', 0, NULL, '2024-04-18 11:48:05.843', 1);

                        -- Insert data if not exists
                        INSERT INTO Mandatory_Fields (Form_Name, Field_Name, Label_Id, Field_Id, Table_ColumnName, Is_Mandatory, created_by, created_at, Is_Image)
                        SELECT d.Form_Name, d.Field_Name, d.Label_Id, d.Field_Id, d.Table_ColumnName, d.Is_Mandatory, d.created_by, d.created_at, d.Is_Image
                        FROM @MandatoryFields d
                        WHERE NOT EXISTS (
                            SELECT 1
                            FROM Mandatory_Fields m
                            WHERE m.Label_Id = d.Label_Id
                        );`,
    ],
  },
  {
    comments: "EMP_TRACK",
    ID: 1003,
    queries: [
      `ALTER TABLE [dbo].[EMP_TRACK] ADD  DEFAULT (getdate()) FOR [TRACK_DATETIME]`,
    ],
  },
  {
    comments: "Color theme",
    ID: 1007,
    queries: [
      `CREATE TABLE [dbo].[AppTheme](
              [UTD] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY CLUSTERED,
              [Emp_Code] [varchar](20) NULL,
              [App_theme] [varchar](20) NULL,
              [Date_Time] [datetime] NOT NULL DEFAULT GETDATE(),
            )`,
    ],
  },

  {
    comments: "user_tbl",
    ID: 1008,
    queries: [`alter table User_tbl ADD ERP_User_Code Integer  Null`],
  },
  {
    comments: "mandatory fields",
    ID: 1008,
    queries: [
      `drop PROCEDURE CheckMandatoryFields`,
      `CREATE PROCEDURE CheckMandatoryFields  
                        @empCode VARCHAR(50)  
                    AS  
                    BEGIN  
                    DECLARE @sql NVARCHAR(MAX) = '';
                    SELECT @sql = @sql + 
                      'SELECT IIF(' + Table_ColumnName + ' IS NULL OR ' + Table_ColumnName + ' = '''', 1, 0) AS result, ' + 
                      CAST(Utd AS NVARCHAR) + ' AS Utd, ''' + Field_Name + ''' AS Field_Name, ''' + Label_Id + ''' AS Label_Id, ''' + Field_Id + ''' AS Field_Id, ''' + Table_ColumnName + ''' AS Table_ColumnName, ' + 
                      CAST(Is_Mandatory AS NVARCHAR) + ' AS Is_Mandatory FROM employeemaster WHERE empcode  collate database_default = ''' + @empCode + ''' collate database_default UNION ALL ' 
                    FROM Mandatory_Fields
                    WHERE Is_Image = 0 AND Is_Mandatory = 1;
                    
                    select @sql = @sql + 
                      'SELECT IIF((
                      select DOC_PATH from EMP_DOCS where EMP_CODE collate database_default = empcode collate database_default and columndoc_type = ''EMPLOYEE'' and misspunch_inout = ' + Table_ColumnName + ' 
                    ) IS NULL OR (
                      select DOC_PATH from EMP_DOCS where EMP_CODE collate database_default = empcode collate database_default and columndoc_type = ''EMPLOYEE'' and misspunch_inout = ' + Table_ColumnName + ' 
                    ) = '''', 1, 0) AS result, ' + 
                      CAST(Utd AS NVARCHAR) + ' AS Utd, ''' + Field_Name + ''' AS Field_Name, ''' + Label_Id + ''' AS Label_Id, ''' + Field_Id + ''' AS Field_Id, ''' + Table_ColumnName + ''' AS Table_ColumnName, ' + 
                      CAST(Is_Mandatory AS NVARCHAR) + ' AS Is_Mandatory FROM employeemaster WHERE empcode collate database_default = ''' + @empCode + ''' collate database_default UNION ALL ' 
                    FROM Mandatory_Fields
                    WHERE Is_Image = 1 AND Is_Mandatory = 1;
                    
                    IF LEN(@sql) >= LEN(' UNION ALL ')
                    SET @sql = LEFT(@sql, LEN(@sql) - LEN(' UNION ALL '));
                IF LEN(@sql) >= LEN(' UNION ALL ')
                set @sql = 'select * from ('+ @sql +') as dg where result = 1 and Is_Mandatory = 1';
                ELSE set @sql = 'select top 0  1 as result,	Utd	,Field_Name	,Label_Id	,Field_Id	,Table_ColumnName	,Is_Mandatory from Mandatory_Fields'	
                print @sql;
                EXEC sp_executesql @sql;
                  END;`,
    ],
  },
  {
    comments: "Invetory",
    ID: 1009,
    queries: [
      `CREATE TABLE [dbo].[InventoryItems](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [ITEM_CODE] [nvarchar](50) NULL,
              [ITEM_NAME] [nvarchar](400) NULL,
              [HSN] [nvarchar](50) NULL,
              [ITEM_TYPE] [nvarchar](20) NULL,
              [PROD_TYPE] [nvarchar](100) NULL,
              [ITEM_TYPE_DEPT] [nvarchar](50) NULL,
              [ITEM_CAT] [nvarchar](50) NULL,
              [CLASSIFICATION] [nvarchar](100) NULL,
              [BIN_LOC] [nvarchar](200) NULL,
              [GST_RATE] [float] NULL,
              [DLR_PRICE] [money] NULL,
              [PURCH_PRICE] [money] NULL,
              [DISCOUNT_PERCT] [money] NULL,
              [SALE_PRICE] [money] NULL,
              [MRP_PRICE] [money] NULL,
              [OLD_PRICE] [money] NULL,
              [UOM] [nvarchar](25) NULL,
              [ALLOW_DECIMAL] [int] NULL,
              [CONN_MODELS] [nvarchar](25) NULL,
              [BRAND] [nvarchar](25) NULL,
              [MS] [nvarchar](10) NULL,
              [LOC_CODE] [int] NULL,
              [Created_At] [datetime] NOT NULL,
              [Created_by] [varchar](100) NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [IN_STOCK_QTY] [float] NULL,
              [PRE_VENDOR] [nvarchar](40) NULL,
              [MODEL_VARIANT] [nvarchar](100) NULL,
              [BATCH_TRAN] [int] NULL,
              [OPENING_QTY] [float] NULL,
              [OPENING_VAL] [float] NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[MSSQL_TemporalHistoryFor_1739671649_AA7E38D0])
            )`,
      `ALTER TABLE [dbo].[InventoryItems] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[InventoryItems] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `CREATE TABLE [dbo].[ItemsMst](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [TRAN_ID] [int] NULL,
              [TRAN_TYPE] [int] NULL,
              [BOOK_CODE] [int] NULL,
              [VOUCHER_NO] [int] NULL,
              [VOUCHER_DATE] [datetime] NULL,
              [INV_NO] [nvarchar](30) NULL,
              [PARTY_AC] [int] NULL,
              [DISP_NAME] [nvarchar](150) NULL,
              [REF_NO] [nvarchar](50) NULL,
              [REF_DATE] [datetime] NULL,
              [NARR] [nvarchar](300) NULL,
              [STATE_CODE] [int] NULL,
              [SUPP_GST] [nvarchar](30) NULL,
              [REG_TYPE] [int] NULL,
              [REV_CHRGS] [int] NULL,
              [DISP_ADD] [nvarchar](300) NULL,
              [Created_At] [datetime] NOT NULL,
              [Created_by] [varchar](100) NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [DRD_ID] [int] NULL,
              [Exp_Ledg1] [int] NULL,
              [Exp_Ledg2] [int] NULL,
              [Exp_Ledg3] [int] NULL,
              [Exp_Ledg4] [int] NULL,
              [TDS_Ledg] [int] NULL,
              [Exp_Perc1] [int] NULL,
              [Exp_Perc2] [int] NULL,
              [Exp_Perc3] [int] NULL,
              [Exp_Perc4] [int] NULL,
              [Tds_Perc] [int] NULL,
              [Exp_Amt1] [money] NULL,
              [Exp_Amt2] [money] NULL,
              [Exp_Amt3] [money] NULL,
              [Exp_Amt4] [money] NULL,
              [Tds_Amt] [money] NULL,
              [Inv_Amt] [money] NULL,
              [LOC_CODE] [int] NULL,
              [Export_Type] [int] NULL,
              [ServerId] [int] NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[ItemsMst_Hst])
            )`,

      `ALTER TABLE [dbo].[ItemsMst] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[ItemsMst] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `CREATE TABLE [dbo].[ItemsDtl](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [TRAN_ID] [int] NULL,
              [TRAN_TYPE] [nvarchar](20) NULL,
              [CODE] [nvarchar](20) NULL,
              [DESCRIPTION] [nvarchar](50) NULL,
              [Location] [int] NULL,
              [CATEGORY] [nvarchar](20) NULL,
              [ITEM_TYPE] [nvarchar](20) NULL,
              [UOM] [int] NULL,
              [HSN_CODE] [nvarchar](50) NULL,
              [QUANTITY] [float] NULL,
              [RATE] [money] NULL,
              [SGST_PERCT] [int] NULL,
              [SGST_VALUE] [money] NULL,
              [CGST_PERCT] [int] NULL,
              [CGST_VALUE] [money] NULL,
              [IGST_PERCT] [int] NULL,
              [IGST_VALUE] [money] NULL,
              [CESS_PERCT] [int] NULL,
              [CESS_VALUE] [money] NULL,
              [DISC_PERCT] [int] NULL,
              [DISC_VALUE] [money] NULL,
              [LOC_CODE] [int] NULL,
              [EXPORT_TYPE] [int] NULL,
              [SERVER_ID] [int] NULL,
              [INV_DATE] [datetime] NULL,
              [Created_At] [datetime] NOT NULL,
              [Created_by] [varchar](100) NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [BATCH] [nvarchar](50) NULL,
              [BRAND] [int] NULL,
              [Sale_Ledg] [int] NULL,
              [Cost_Center] [int] NULL,
              [Inv_Amt] [money] NULL,
              [SRNO] [int] NULL,
              [CURR_STOCK] [int] NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[ItemsDtl_Hst])
            )`,

      `ALTER TABLE [dbo].[ItemsDtl] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[ItemsDtl] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1010,
    queries: [
      `CREATE TABLE [dbo].[BranchWiseItemOpening](
              [UTD] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY CLUSTERED,
              [Id] [int] NULL,
              [Item_Code] [nvarchar](75) NULL,
              [Loc_Code] [int] NULL,
              [Opening_Qty] [int] NULL,
              [Opening_Val] [money] NULL,
              [Created_At] [datetime] NOT NULL DEFAULT GETDATE(),
              [Created_by] [varchar](100),
              [ValidFrom] DATETIME2 GENERATED ALWAYS AS ROW START DEFAULT GETDATE(),
                [ValidTo] DATETIME2 GENERATED ALWAYS AS ROW END,
                PERIOD FOR SYSTEM_TIME(ValidFrom, ValidTo)
            )
            WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.BranchWiseItemOpening_Hst));`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1011,
    queries: [
      `ALTER TABLE ItemsMst
                  ADD CUST_PAN nvarchar(15);`,
    ],
  },
  {
    comments: "refund process",
    ID: 1012,
    queries: [`alter table booking_refund add Is_Reapp int`],
  },
  {
    comments: "Attendance procedure",
    ID: 1012,
    queries: [
      `drop procedure GetEmployeeLocation`,
      `CREATE PROCEDURE GetEmployeeLocation    
                @EmployeeCode NVARCHAR(50),    
                @Latitude VARCHAR(20),    
                @Longitude VARCHAR(20)    
            AS    
            BEGIN    
                DECLARE @GeoLocationString NVARCHAR(MAX);    
                DECLARE @Geofence GEOMETRY;    
                DECLARE @Geofence_concat VARCHAR(300);    
                DECLARE @Usergeofence VARCHAR(5);  
                  
                SELECT @Usergeofence = (SELECT mUserGeoLocation FROM EMPLOYEEMASTER  
                                        WHERE EMPCODE = @EmployeeCode AND Export_Type < 3);  
              
                IF ( @Usergeofence = 'Y' OR @Usergeofence = 'y')  
                BEGIN  
                    -- If @Usergeofence is NULL or 'N', return without further processing  
                    SELECT '1' AS Result;  
                    RETURN;  
                END  
                  
                IF (@Usergeofence IS NULL OR @Usergeofence = 'N')  
                BEGIN  
                    SELECT @GeoLocationString = (    
                        SELECT TOP 1 Spl_Rem   
                        FROM Misc_Mst    
                        WHERE Misc_Code = LOCATION and Misc_Type = 85 AND Export_Type < 3    
                    )    
                    FROM EMPLOYEEMASTER    
                    WHERE EMPCODE = @EmployeeCode AND Export_Type < 3;    
              
                    IF @GeoLocationString IS NULL    
                    BEGIN    
                        SELECT 'Geo location is not set for this location' AS Result;    
                        RETURN;    
                    END    
              
                    SET @Geofence_concat = 'POLYGON((' +     
                        (SELECT STRING_AGG(    
                            CONVERT(NVARCHAR, CAST(SUBSTRING(value, 1, CHARINDEX(',', value) - 1) AS DECIMAL(30, 6))) + ' ' +    
                            CONVERT(NVARCHAR, CAST(SUBSTRING(value, CHARINDEX(',', value) + 1, LEN(value)) AS DECIMAL(30, 6))),     
                            ','    
                        )     
                        FROM STRING_SPLIT(@GeoLocationString, '@')) +     
                        '))';    
              
                    SET @Geofence = GEOMETRY::STGeomFromText(@Geofence_concat ,4326);         
                    SELECT @Geofence.STContains(GEOMETRY::STPointFromText('POINT('+ @Latitude + ' ' + @Longitude +')', 4326)) AS Result;    
                END  
            END;`,
    ],
  },
  {
    comments: "interview",
    ID: 1013,
    queries: [
      `CREATE TABLE [dbo].[Interview_sideTables](
              [Utd] [int] IDENTITY(1,1) NOT NULL,
              [SRNO] [int] NULL,
              [SNo] [int] NULL,
              [Tbl_Type] [int] NULL,
              [Emp_Company] [nvarchar](30) NULL,
              [Emp_Designation] [nvarchar](30) NULL,
              [Emp_Responsibility] [nvarchar](30) NULL,
              [Emp_From_Date] [date] NULL,
              [Emp_To_Date] [date] NULL,
              [Emp_Settlement_Done] [nvarchar](30) NULL,
              [Emp_Drawn_Salary] [money] NULL,
              [Emp_Leaving_Reason] [nvarchar](50) NULL,
              [Emp_Degree] [nvarchar](30) NULL,
              [Emp_Board] [nvarchar](30) NULL,
              [Emp_College] [nvarchar](30) NULL,
              [Emp_Passing_year] [nvarchar](4) NULL,
              [Emp_Percentage] [money] NULL,
              [Emp_Tool] [nvarchar](30) NULL,
              [Emp_Version] [nvarchar](30) NULL,
              [Emp_Proficiency] [nvarchar](30) NULL,
              [Emp_Last_Used] [nvarchar](4) NULL,
              [Emp_Experience] [nvarchar](4) NULL,
              [Emp_Language] [nvarchar](30) NULL,
              [Emp_Language_Understand] [nvarchar](30) NULL,
              [Emp_Language_Speak] [nvarchar](30) NULL,
              [Emp_Language_Read] [nvarchar](30) NULL,
              [Emp_Language_Write] [nvarchar](30) NULL,
              [Emp_Ref_Name] [nvarchar](30) NULL,
              [Emp_Ref_Occup] [nvarchar](30) NULL,
              [Emp_Ref_Address] [nvarchar](30) NULL,
              [Emp_Ref_Mobile] [nvarchar](30) NULL,
              [Emp_Ref_emailid] [nvarchar](30) NULL,
              [Emp_Ref_relation] [nvarchar](30) NULL,
              [Nominee_Name] [nvarchar](100) NULL,
              [Member_Name] [nvarchar](100) NULL,
              [Relation] [nvarchar](50) NULL,
              [Percentage] [decimal](5, 2) NULL,
              [Is_Minor] [nvarchar](20) NULL,
              [Created_by] [nvarchar](30) NOT NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
            PRIMARY KEY CLUSTERED 
            (
              [Utd] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Interview_sideTables_Hst])
            )`,
      `ALTER TABLE [dbo].[Interview_sideTables] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[Interview_sideTables] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "interview",
    ID: 1014,
    queries: [
      `alter table new_joining add CASTE nvarchar (30)`,
      `alter table new_joining add CATEGORY nvarchar (30)`,
      `alter table new_joining add DRIVE nvarchar (2)`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1015,
    queries: [
      `CREATE TABLE [dbo].[notification_temp](
              [id] [int] IDENTITY(1,1) NOT NULL,
              [title] [nvarchar](300) NULL,
              [message] [nvarchar](300) NULL,
              [created_at] [datetime] NULL,
            PRIMARY KEY CLUSTERED 
            (
              [id] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
            ) ON [PRIMARY]`,
      `ALTER TABLE [dbo].[notification_temp] ADD  DEFAULT (getdate()) FOR [created_at]`,
    ],
  },
  {
    comments: "OfferMaster",
    ID: 1020,
    queries: [
      `CREATE TABLE [dbo].[ServOffCust](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [CUSTOMER_NAME] [nvarchar](500) NULL,
              [MOBILE] [nvarchar](14) NULL,
              [EMAIL] [nvarchar](200) NULL,
              [VEH_REG_NO] [nvarchar](20) NULL,
              [MODEL] [nvarchar](400) NULL,
              [CUST_ID] [nvarchar](50) NULL,
              [Loc_Code] [smallint] NULL,
              [BATCH_ID] [smallint] NULL,
              [BATCH_NAME] [nvarchar](100) NULL,
              [isApplied] [smallint] NULL,
              [isAppliedDate] [datetime] NULL,
              [isAvailed] [smallint] NULL,
              [isAvailedDate] [datetime] NULL,
              [Created_At] [datetime] NOT NULL,
              [Created_by] [varchar](100) NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [ImportMonth] [int] NULL,
              [OFF_ID] [int] NULL,
              [QR_PATH] [nvarchar](500) NULL,
              [AVAIL_EMP] [nvarchar](100) NULL,
              [VIN_NO] [nvarchar](100) NULL,
              [FIN_INV_AMT] [money] NULL,
              [INV_ON] [nvarchar](20) NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[ServOffCust_Hst])
            )`,
      `ALTER TABLE [dbo].[ServOffCust] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[ServOffCust] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "OfferMaster",
    ID: 1021,
    queries: [
      `CREATE TABLE [dbo].[OfferMaster](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Month] [int] NULL,
              [DateFrom] [date] NULL,
              [DateUpto] [date] NULL,
              [OfferName] [nvarchar](100) NULL,
              [Offers] [nvarchar](50) NULL,
              [OfferValue] [int] NULL,
              [Weightage] [int] NULL,
              [Created_At] [datetime] NOT NULL,
              [Created_by] [varchar](100) NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [LOC_CODE] [int] NULL,
              [MIN_INV_AMT] [int] NULL,
              [OfferOn] [nvarchar](20) NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[OfferMaster_Hst])
            )`,
      `ALTER TABLE [dbo].[OfferMaster] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[OfferMaster] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "OfferMaster",
    ID: 1022,
    queries: [
      `CREATE TABLE [dbo].[OfferDtl](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Mst_ID] [int] NULL,
              [TC_DESC] [nvarchar](1000) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[OfferDtl_Hst])
            )`,
      `ALTER TABLE [dbo].[OfferDtl] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[OfferDtl] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "interview",
    ID: 1023,
    queries: [
      `alter table NEW_JOINING alter column EXP_IN_YEAR decimal(19,2)`,
      `alter table NEW_JOINING alter column PASSING_PER decimal(19,2)`,
      `ALTER TABLE NEW_JOINING ADD HR_REASON nvarchar(200) null;`,
      `ALTER TABLE NEW_JOINING ADD EMPCODE varchar(20) NULL;`,
      `ALTER TABLE SHORTLISTED_CANDIDATE ADD INTR1DATE [datetime] NULL`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1024,
    queries: [`alter table comp_keydata add Comp_Logo nvarchar(60)`],
  },
  {
    comments: "New_dev_Code",
    ID: 1025,
    queries: [`alter table comp_keydata add TV_Mode int`],
  },
  {
    comments: "Asset Managemnet",
    ID: 1028,
    queries: [
      `

            CREATE TABLE [dbo].[Assets_Group](
              [Id] [int] IDENTITY(1,1) NOT NULL,
              [name] [varchar](255) NOT NULL,
              [icon] [varchar](255) NOT NULL,
              [Created_At] [datetime2](7) NULL,
              [Created_by] [varchar](100) NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [Asset_Type] [int] NULL,
            PRIMARY KEY CLUSTERED 
            (
              [Id] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Assets_Group_Hst])
            )


            ALTER TABLE [dbo].[Assets_Group] ADD  DEFAULT (getdate()) FOR [Created_At]




            `,
      `CREATE TABLE [dbo].[Assets_Group_Subcategory](
              [Id] [int] IDENTITY(1,1) NOT NULL,
              [name] [varchar](255) NOT NULL,
              [icon] [varchar](255) NOT NULL,
              [Group_Id] [varchar](255) NOT NULL,
              [Created_At] [datetime2](7) NULL,
              [Created_by] [varchar](100) NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
            PRIMARY KEY CLUSTERED 
            (
              [Id] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Assets_Group_Subcategory_Hst])
            )


            ALTER TABLE [dbo].[Assets_Group_Subcategory] ADD  DEFAULT (getdate()) FOR [Created_At]



            `,
      `CREATE TABLE [dbo].[Asset_Template](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Template_Id] [int] NOT NULL,
              [Field_Name] [varchar](255) NOT NULL,
              [Field_Type] [varchar](255) NULL,
              [Field_Req] [int] NULL,
              [Field_Attr] [int] NULL,
              [Table_field] [varchar](30) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [Export_type] [int] NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Asset_Template_Hst])
            )


            ALTER TABLE [dbo].[Asset_Template] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[Asset_Template] ADD  DEFAULT (getdate()) FOR [ValidFrom]

            `,
      `

            CREATE TABLE [dbo].[Asset_Product](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Name] [varchar](100) NOT NULL,
              [Icon] [varchar](100) NULL,
              [Category] [varchar](10) NOT NULL,
              [Subcategory] [varchar](10) NOT NULL,
              [Location] [varchar](100) NOT NULL,
              [Manufacturer] [varchar](50) NULL,
              [Model] [varchar](50) NULL,
              [Purchase_Date] [datetime2](7) NULL,
              [Purchase_value] [money] NULL,
              [Description] [varchar](200) NULL,
              [Serial_No] [varchar](30) NULL,
              [Asset_Status] [varchar](50) NULL,
              [Asset_Nature] [varchar](10) NULL,
              [Notes] [varchar](400) NULL,
              [Life_Span] [int] NULL,
              [Depreciation_Method] [varchar](30) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [residualValue] [money] NULL,
              [totalUnits] [int] NULL,
              [unitsProduced] [varchar](200) NULL,
              [Attachments] [nvarchar](max) NULL,
              [Due_Date] [datetime2](7) NULL,
              [QRCode] [varchar](4000) NULL,
              [BarCode] [nvarchar](max) NULL,
              [Qty] [float] NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Asset_Product_Hst])
            )


            ALTER TABLE [dbo].[Asset_Product] ADD  DEFAULT (getdate()) FOR [Created_At]

            ALTER TABLE [dbo].[Asset_Product] ADD  DEFAULT (getdate()) FOR [ValidFrom]




            `,
      `

            CREATE TABLE [dbo].[Product_Issue](
              [tran_id] [int] IDENTITY(1,1) NOT NULL,
              [Req_Date] [datetime2](7) NULL,
              [EmpCode] [varchar](10) NULL,
              [Category] [varchar](20) NOT NULL,
              [SubCategory] [varchar](20) NOT NULL,
              [Description] [varchar](200) NOT NULL,
              [Reason] [varchar](200)  NULL,
              [Location] [varchar](10) NULL,
              [Appr_1_Code] [varchar](100) NULL,
              [Appr_1_Stat] [tinyint] NULL,
              [Appr_1_Date] [datetime2](7) NULL,
              [Appr_1_Rem] [varchar](300) NULL,
              [Appr_2_Code] [varchar](100) NULL,
              [Appr_2_Stat] [tinyint] NULL,
              [Appr_2_Date] [datetime2](7) NULL,
              [Appr_2_Rem] [varchar](300) NULL,
              [Appr_3_Code] [varchar](100) NULL,
              [Appr_3_Stat] [tinyint] NULL,
              [Appr_3_Date] [datetime2](7) NULL,
              [Appr_3_Rem] [varchar](300) NULL,
              [Fin_Appr] [tinyint] NULL,
              [srm] [varchar](20) NULL,
              [Issued_Asset] [varchar](4000) NULL,
              [IssuedDate] [datetime2](7) NULL,
              [Returnable] [varchar](50) NULL,
              [Revoke_Reason] [varchar](200) NULL,
              [RevokeDate] [datetime2](7) NULL,
              [Quantity] [varchar](100) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [Appr1_Qty] [varchar](50) NULL,
              [Appr2_Qty] [varchar](50) NULL,
              [Appr3_Qty] [varchar](50) NULL,
              [Revoked_Asset] [varchar](4000) NULL,
              [Type] [varchar](20) NULL,
            PRIMARY KEY CLUSTERED 
            (
              [tran_id] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Product_Issue_Hst])
            )


            ALTER TABLE [dbo].[Product_Issue] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[Product_Issue] ADD  DEFAULT (getdate()) FOR [ValidFrom]


            `,
      `
            CREATE TABLE [dbo].[Product_Finance](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Vendor] [varchar](100) NOT NULL,
              [Purchase_Price] [money] NULL,
              [Purchase] [varchar](10) NULL,
              [Ac_Code] [varchar](20) NULL,
              [Market_value] [money] NULL,
              [In_Service] [varchar](10) NULL,
              [Po_No] [varchar](20) NULL,
              [Scrap_Value] [money] NULL,
              [Warrent_End] [datetime2](7) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [Asset_Product] [varchar](10) NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Product_Finance_Hst])
            )


            ALTER TABLE [dbo].[Product_Finance] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[Product_Finance] ADD  DEFAULT (getdate()) FOR [ValidFrom]


            `,
      `CREATE TABLE [dbo].[Product_Vendor](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Vendor_Name] [varchar](100) NULL,
              [Vendor_Number] [varchar](20) NULL,
              [Contact_Name] [varchar](100) NULL,
              [Email] [varchar](100) NULL,
              [Phone_No] [varchar](20) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [Asset_Product] [varchar](10) NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [city] [varchar](100) NULL,
              [address] [varchar](200) NULL,
              [Invoice_No] [varchar](100) NULL,
              [Vendor_Code] [varchar](100) NULL,
              [Invoice_Date] [datetime2](7) NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Product_Vendor_Hst])
            )


            ALTER TABLE [dbo].[Product_Vendor] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[Product_Vendor] ADD  DEFAULT (getdate()) FOR [ValidFrom]

            `,
      `

            CREATE TABLE [dbo].[Product_Service](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Req_Date] [datetime2](7) NULL,
              [EmpCode] [varchar](10) NULL,
              [Category] [varchar](20) NULL,
              [SubCategory] [varchar](20) NULL,
              [Description] [varchar](100) NOT NULL,
              [Reason] [varchar](200) NULL,
              [Location] [varchar](10) NULL,
              [Priority] [varchar](100) NULL,
              [Service_Date] [datetime2](7) NULL,
              [Part_Amount] [money] NULL,
              [Labour_Amount] [money] NULL,
              [NextDue_Date] [datetime2](7) NULL,
              [Flag] [varchar](10) NULL,
              [Asset_Product] [varchar](4000) NULL,
              [Appr_1_Code] [varchar](100) NULL,
              [Appr_1_Stat] [tinyint] NULL,
              [Appr_1_Date] [datetime2](7) NULL,
              [Appr_1_Rem] [varchar](300) NULL,
              [Appr_2_Code] [varchar](100) NULL,
              [Appr_2_Stat] [tinyint] NULL,
              [Appr_2_Date] [datetime2](7) NULL,
              [Appr_2_Rem] [varchar](300) NULL,
              [Appr_3_Code] [varchar](100) NULL,
              [Appr_3_Stat] [tinyint] NULL,
              [Appr_3_Date] [datetime2](7) NULL,
              [Appr_3_Rem] [varchar](300) NULL,
              [Fin_Appr] [tinyint] NULL,
              [srm] [varchar](20) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [Service_Type] [varchar](100) NULL,
              [EmpDue_Date] [datetime2](7) NULL,
              [New_Description] [varchar](50) NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Product_Service_Hst])
            )


            ALTER TABLE [dbo].[Product_Service] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[Product_Service] ADD  DEFAULT (getdate()) FOR [ValidFrom]



            `,
      `
            CREATE TABLE [dbo].[Product_Extra](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [F_1] [varchar](150) NULL,
              [F_2] [varchar](150) NULL,
              [F_3] [varchar](150) NULL,
              [F_4] [varchar](150) NULL,
              [F_5] [varchar](150) NULL,
              [F_6] [varchar](150) NULL,
              [F_7] [varchar](150) NULL,
              [F_8] [varchar](150) NULL,
              [F_9] [varchar](150) NULL,
              [F_10] [varchar](150) NULL,
              [Asset_Product] [varchar](10) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Product_Extra_Hst])
            )


            ALTER TABLE [dbo].[Product_Extra] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[Product_Extra] ADD  DEFAULT (getdate()) FOR [ValidFrom]


            `,
      `

            CREATE TABLE [dbo].[purchase_request](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Req_Date] [datetime2](7) NULL,
              [Asset_Category] [varchar](20) NULL,
              [Contact_Number] [varchar](20) NOT NULL,
              [Email] [varchar](100) NULL,
              [Address] [varchar](200) NULL,
              [City] [varchar](20) NULL,
              [State] [varchar](20) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [Location] [varchar](10) NULL,
              [Appr_1_Code] [varchar](100) NULL,
              [Appr_1_Stat] [tinyint] NULL,
              [Appr_1_Rem] [varchar](300) NULL,
              [Appr_2_Code] [varchar](100) NULL,
              [Appr_2_Stat] [tinyint] NULL,
              [Appr_2_Rem] [varchar](300) NULL,
              [Appr_3_Code] [varchar](100) NULL,
              [Appr_3_Stat] [tinyint] NULL,
              [Appr_3_Rem] [varchar](300) NULL,
              [Fin_Appr] [tinyint] NULL,
              [srm] [varchar](20) NULL,
              [LocationTo] [varchar](10) NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[purchase_request_Hst])
            )


            ALTER TABLE [dbo].[purchase_request] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[purchase_request] ADD  DEFAULT (getdate()) FOR [ValidFrom]


            `,
      `CREATE TABLE [dbo].[Purchase_Req_Product_Details](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Item] [varchar](50) NOT NULL,
              [Item_Description] [varchar](100) NULL,
              [Asset_Category] [varchar](20) NULL,
              [Quantity] [varchar](20) NULL,
              [Unit_Price] [varchar](20) NULL,
              [Discount] [varchar](20) NULL,
              [Total_Price] [money] NULL,
              [Purchase_Id] [varchar](20) NULL,
              [Issue_Quantity] [varchar](20) NULL,
              [IsIssued] [varchar](10) NULL,
              [Location] [varchar](10) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Purchase_Req_Product_Details_Hst])
            )


            ALTER TABLE [dbo].[Purchase_Req_Product_Details] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[Purchase_Req_Product_Details] ADD  DEFAULT (getdate()) FOR [ValidFrom]


            `,
      `

            CREATE TABLE [dbo].[Purchase_Order](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Req_Date] [datetime2](7) NULL,
              [Asset_Category] [varchar](20) NOT NULL,
              [Contact_Number] [varchar](20) NOT NULL,
              [Email] [varchar](100) NULL,
              [Address] [varchar](200) NULL,
              [City] [varchar](20) NULL,
              [State] [varchar](20) NULL,
              [Location] [varchar](10) NULL,
              [Appr_1_Code] [varchar](100) NULL,
              [Appr_1_Stat] [tinyint] NULL,
              [Appr_1_Rem] [varchar](300) NULL,
              [Appr_2_Code] [varchar](100) NULL,
              [Appr_2_Stat] [tinyint] NULL,
              [Appr_2_Rem] [varchar](300) NULL,
              [Appr_3_Code] [varchar](100) NULL,
              [Appr_3_Stat] [tinyint] NULL,
              [Appr_3_Rem] [varchar](300) NULL,
              [Fin_Appr] [tinyint] NULL,
              [srm] [varchar](20) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [Vendor] [varchar](20) NULL,
              [Subcategory] [varchar](20) NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Purchase_Order_Hst])
            )


            ALTER TABLE [dbo].[Purchase_Order] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[Purchase_Order] ADD  DEFAULT (getdate()) FOR [ValidFrom]

            `,
      `
            CREATE TABLE [dbo].[Purchase_Order_Product_Details](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Product_Code] [varchar](20) NULL,
              [Item_Description] [varchar](100) NULL,
              [Tax] [varchar](20) NULL,
              [Quantity] [varchar](20) NOT NULL,
              [Unit_Price] [varchar](20) NULL,
              [Discount] [varchar](20) NULL,
              [Total_Price] [money] NULL,
              [Purchase_Id] [varchar](20) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [Subcategory] [varchar](20) NULL,
              [ITEM_TYPE] [varchar](20) NULL,
              [HSN] [varchar](20) NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Purchase_Order_Product_Details_Hst])
            )


            ALTER TABLE [dbo].[Purchase_Order_Product_Details] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[Purchase_Order_Product_Details] ADD  DEFAULT (getdate()) FOR [ValidFrom]


            `,
      `
            CREATE TABLE [dbo].[PurchaseEntryMst](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [TRAN_ID] [int] NULL,
              [TRAN_TYPE] [int] NULL,
              [BOOK_CODE] [int] NULL,
              [VOUCHER_NO] [int] NULL,
              [VOUCHER_DATE] [datetime] NULL,
              [INV_NO] [nvarchar](30) NULL,
              [PARTY_AC] [int] NULL,
              [DISP_NAME] [nvarchar](150) NULL,
              [REF_NO] [nvarchar](50) NULL,
              [REF_DATE] [datetime] NULL,
              [NARR] [nvarchar](300) NULL,
              [STATE_CODE] [int] NULL,
              [SUPP_GST] [nvarchar](30) NULL,
              [REG_TYPE] [int] NULL,
              [REV_CHRGS] [int] NULL,
              [DISP_ADD] [nvarchar](300) NULL,
              [Created_At] [datetime] NOT NULL,
              [Created_by] [varchar](100) NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [DRD_ID] [int] NULL,
              [Exp_Ledg1] [int] NULL,
              [Exp_Ledg2] [int] NULL,
              [Exp_Ledg3] [int] NULL,
              [Exp_Ledg4] [int] NULL,
              [TDS_Ledg] [int] NULL,
              [Exp_Perc1] [int] NULL,
              [Exp_Perc2] [int] NULL,
              [Exp_Perc3] [int] NULL,
              [Exp_Perc4] [int] NULL,
              [Tds_Perc] [int] NULL,
              [Exp_Amt1] [money] NULL,
              [Exp_Amt2] [money] NULL,
              [Exp_Amt3] [money] NULL,
              [Exp_Amt4] [money] NULL,
              [Tds_Amt] [money] NULL,
              [Inv_Amt] [money] NULL,
              [LOC_CODE] [int] NULL,
              [Export_Type] [int] NULL,
              [ServerId] [int] NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PurchaseEntryMst_Hst])
            )


            ALTER TABLE [dbo].[PurchaseEntryMst] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[PurchaseEntryMst] ADD  DEFAULT (getdate()) FOR [ValidFrom]


            `,
      `
            CREATE TABLE [dbo].[PurchaseEntryDtl](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [TRAN_ID] [int] NULL,
              [TRAN_TYPE] [nvarchar](20) NULL,
              [CODE] [nvarchar](20) NULL,
              [DESCRIPTION] [nvarchar](50) NULL,
              [Location] [int] NULL,
              [CATEGORY] [nvarchar](20) NULL,
              [ITEM_TYPE] [nvarchar](20) NULL,
              [UOM] [int] NULL,
              [HSN_CODE] [nvarchar](50) NULL,
              [QUANTITY] [float] NULL,
              [RATE] [money] NULL,
              [SGST_PERCT] [int] NULL,
              [SGST_VALUE] [money] NULL,
              [CGST_PERCT] [int] NULL,
              [CGST_VALUE] [money] NULL,
              [IGST_PERCT] [int] NULL,
              [IGST_VALUE] [money] NULL,
              [CESS_PERCT] [int] NULL,
              [CESS_VALUE] [money] NULL,
              [DISC_PERCT] [int] NULL,
              [DISC_VALUE] [money] NULL,
              [LOC_CODE] [int] NULL,
              [EXPORT_TYPE] [int] NULL,
              [SERVER_ID] [int] NULL,
              [INV_DATE] [datetime] NULL,
              [Created_At] [datetime] NOT NULL,
              [Created_by] [varchar](100) NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [BATCH] [nvarchar](50) NULL,
              [BRAND] [int] NULL,
              [Sale_Ledg] [int] NULL,
              [Cost_Center] [int] NULL,
              [Inv_Amt] [money] NULL,
              [SRNO] [int] NULL,
              [CURR_STOCK] [int] NULL,
              [SubCategory] [varchar](20) NULL,
              [CATEGORYGST] [varchar](20) NULL,
              [PO_Number] [varchar](50) NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PurchaseEntryDtl_Hst])
            )


            ALTER TABLE [dbo].[PurchaseEntryDtl] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[PurchaseEntryDtl] ADD  DEFAULT (getdate()) FOR [ValidFrom]


            `,
      `
            CREATE TABLE [dbo].[Product_History](
              [tran_id] [int] IDENTITY(1,1) NOT NULL,
              [Asset_ID] [varchar](10) NULL,
              [Tran_Type] [varchar](10) NULL,
              [Quantity] [float] NULL,
              [Source_Location] [varchar](10) NULL,
              [Destination_Location] [varchar](10) NULL,
              [Issued_To] [varchar](10) NULL,
              [Revoke_Reason] [varchar](100) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [IssueDate] [datetime2](7) NULL,
              [RevokeDate] [datetime2](7) NULL,
              [Category] [varchar](50) NULL,
              [SubCategory] [varchar](50) NULL,
            PRIMARY KEY CLUSTERED 
            (
              [tran_id] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Product_History_Hst])
            )


            ALTER TABLE [dbo].[Product_History] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[Product_History] ADD  DEFAULT (getdate()) FOR [ValidFrom]



            `,
      `
            CREATE TABLE [dbo].[Reminder_Asset](
              [reminder_id] [int] IDENTITY(1,1) NOT NULL,
              [reminder_name] [varchar](50) NULL,
              [date] [date] NULL,
              [time] [varchar](255) NULL,
              [frequency] [nvarchar](255) NULL,
              [validity] [date] NULL,
              [description] [varchar](255) NULL,
              [Category] [varchar](20) NULL,
              [SubCategory] [varchar](20) NULL,
              [Asset] [varchar](20) NULL,
              [user_id] [int] NULL,
              [type] [varchar](255) NULL,
              [Created_By] [nvarchar](30) NOT NULL,
              [Created_At] [datetime] NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
            PRIMARY KEY CLUSTERED 
            (
              [reminder_id] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Reminder_Asset_hst])
            )


            ALTER TABLE [dbo].[Reminder_Asset] ADD  DEFAULT (getdate()) FOR [Created_At]


            `,
      `
            CREATE TABLE [dbo].[Product_Issue_dtl](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Product_Issue] [varchar](10) NOT NULL,
              [Asset_Product] [varchar](20) NOT NULL,
              [Asset_Issue_Qty] [varchar](20) NOT NULL,
              [Revoke] [varchar](20) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Product_Issue_dtl_Hst])
            )


            ALTER TABLE [dbo].[Product_Issue_dtl] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[Product_Issue_dtl] ADD  DEFAULT (getdate()) FOR [ValidFrom]


            `,
      `
            CREATE TABLE [dbo].[Purchase_Req_Product_Details_dtl](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Purchase_Req] [varchar](10) NOT NULL,
              [Asset_Product] [varchar](20) NOT NULL,
              [Asset_Issue_Qty] [varchar](20) NOT NULL,
              [Purchase_Req_Product] [varchar](20) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Purchase_Req_Product_Details_dtl_Hst])
            )


            ALTER TABLE [dbo].[Purchase_Req_Product_Details_dtl] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[Purchase_Req_Product_Details_dtl] ADD  DEFAULT (getdate()) FOR [ValidFrom]


            `,
      `CREATE TABLE [dbo].[Prefix_Name](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Prefix_Name] [varchar](100) NOT NULL,
              [Prefix_Code] [varchar](50) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Prefix_Name_Hst])
            )


            ALTER TABLE [dbo].[Prefix_Name] ADD  DEFAULT (getdate()) FOR [Created_At]


            ALTER TABLE [dbo].[Prefix_Name] ADD  DEFAULT (getdate()) FOR [ValidFrom]
            `,
      `CREATE TABLE [dbo].[PurchaseEntryDtlSR](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [TRAN_ID] [int] NULL,
              [Serial_No] [varchar](50) NULL,
              [isCreated] [varchar](10) NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [Po] [varchar](50) NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PurchaseEntryDtlSR_Hst])
            )
            ALTER TABLE [dbo].[PurchaseEntryDtlSR] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "Asset changes",
    ID: 1031,
    queries: [
      `
                  


            ALTER TABLE [dbo].[Assets_Group] ADD  [DPRATE] [varchar](10) NULL
            ALTER TABLE [dbo].[Assets_Group_Subcategory] ADD  [Series] [bit] NULL
            ALTER TABLE [dbo].[Asset_Product] ADD  [ITEM_TYPE] [varchar](10) NULL
            ALTER TABLE [dbo].[Asset_Product] ADD 	[UOM1] [varchar](10) NULL
            ALTER TABLE [dbo].[Asset_Product] ADD 	[Duration] [varchar](10) NULL
            ALTER TABLE [dbo].[Product_Service] ADD  [Document] [varchar](255) NULL
            ALTER TABLE [dbo].[Purchase_Order] ADD [Document] [varchar](255) NULL
            ALTER TABLE [dbo].[Purchase_Order_Product_Details] ADD  [UOM1] [varchar](10) NULL
            ALTER TABLE [dbo].[PurchaseEntryMst] ADD  [Document] [varchar](255) NULL
            ALTER TABLE [dbo].[PurchaseEntryDtl] ADD  [POPD] [varchar](20) NULL
            ALTER TABLE [dbo].[Product_History] ADD  [PurchaseDtl] [varchar](10) NULL
                  `,
    ],
  },
  {
    comments: "Asset Pooling And Reallocation",
    ID: 1032,
    queries: [
      `
            CREATE TABLE [dbo].[asset_pooling_reallocation](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Transfer_Date] [datetime2] NOT NULL,
              [Category] [varchar](50) NOT NULL,
              [SubCategory] [varchar](50) NOT NULL,
              [Asset_Product] [varchar](50) NOT NULL,
              [Remark] [varchar](200)  NULL,
              [Location] [varchar](50) NOT NULL,
              [Revoke_Date] [datetime] NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Asset_Poolin_Reallocation_Hst])
            )
            ALTER TABLE [dbo].[asset_pooling_reallocation] ADD  DEFAULT (getdate()) FOR [Created_At]
            ALTER TABLE [dbo].[asset_pooling_reallocation] ADD  DEFAULT (getdate()) FOR [ValidFrom]
                  `,
      `
                  

            CREATE TABLE [dbo].[Asset_Pooling_Reallocation_Dtl](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Transfer_Date] [datetime2] NULL,
              [Category] [varchar](50) NOT NULL,
              [SubCategory] [varchar](50) NOT NULL,
              [PoolingId] [varchar](20) NOT NULL,
              [Issue_Quantity] [varchar](50) NOT NULL,
              [Description] [varchar](200) NOT NULL,
              [Revoke] [varchar](10)  NULL,
              [Revoke_Date] [datetime2]  NULL,
              [Reason] [varchar](200)  NULL,
              [Location] [varchar](50) NOT NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Asset_Pooling_Reallocation_Dtl_Hst])
            )

            ALTER TABLE [dbo].[Asset_Pooling_Reallocation_Dtl] ADD  DEFAULT (getdate()) FOR [Created_At]

            ALTER TABLE [dbo].[Asset_Pooling_Reallocation_Dtl] ADD  DEFAULT (getdate()) FOR [ValidFrom]
                  `,
      `
                  


            CREATE TABLE [dbo].[Asset_Pooling_Reallocation_DtlSR](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Asset_Pooling_Id] [varchar](10) NOT NULL,
              [Asset_PoolingDtl_Id] [varchar](10) NOT NULL,
              [Asset_Product] [varchar](20) NOT NULL,
              [Asset_Issue_Qty] [varchar](20) NOT NULL,
              [Asset_Revoke_Qty] [varchar](20)  NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
            PRIMARY KEY CLUSTERED 
            (
              [UTD] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
            ) ON [PRIMARY]
            WITH
            (
            SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Asset_Pooling_Reallocation_DtlSR_Hst])
            )
            ALTER TABLE [dbo].[Asset_Pooling_Reallocation_DtlSR] ADD  DEFAULT (getdate()) FOR [Created_At]

            ALTER TABLE [dbo].[Asset_Pooling_Reallocation_DtlSR] ADD  DEFAULT (getdate()) FOR [ValidFrom]
                  `,
    ],
  },
  {
    comments: "pot cust",
    ID: 1034,
    queries: [
      `
                        CREATE TABLE [dbo].[POT_CUST](
                          [UID] [int] IDENTITY(1,1) NOT NULL,
                          [TRAN_ID] [int] NULL,
                          [VEHREGNO] [nvarchar](20) NULL,
                          [CHASS_NO] [nvarchar](20) NULL,
                          [MOD_GRP] [nvarchar](20) NULL,
                          [MOD_NAME] [nvarchar](20) NULL,
                          [CUST_NAME] [nvarchar](100) NULL,
                          [MOBILE] [nvarchar](20) NULL,
                          [EMAIL] [nvarchar](100) NULL,
                          [PART_DESC] [nvarchar](250) NULL,
                          [QTY] [nvarchar](20) NULL,
                          [PRIORITY] [nvarchar](20) NULL,
                          [CUST_ADV_PYMT] [money] NULL,
                          [EXP_DELV_DATE] [datetime2](7) NULL,
                          [PART_NO] [nvarchar](100) NULL,
                          [DMS_PART_NO] [nvarchar](255) NULL,
                          [DMS_PART_DATE] [datetime2](7) NULL,
                          [Export_Type] [int] NULL,
                          [Server_ID] [int] NULL,
                          [Created_by] [nvarchar](255) NULL,
                          [Id] [nvarchar](20) NULL,
                          [LOC_CODE] [nvarchar](10) NULL,
                          [ORDER_STATUS] [nvarchar](100) NULL,
                          [LAST_STATUS_UP_ON] [datetime2](7) NULL,
                        PRIMARY KEY CLUSTERED 
                        (
                          [UID] ASC
                        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                        ) ON [PRIMARY]
                  `,
      `CREATE TABLE [dbo].[POT_CUST_DTL](
                    [UID] [int] IDENTITY(1,1) NOT NULL,
                    [TRAN_ID] [int] NULL,
                    [SNo] [int] NULL,
                    [PART_NO] [nvarchar](100) NULL,
                    [ORDER_NO] [nvarchar](20) NULL,
                    [ORDER_DATE] [datetime2](7) NULL,
                    [DMS_ORDER_STATUS] [nvarchar](100) NULL,
                    [STATUS_DATE] [datetime2](7) NULL,
                    [LOC_CODE] [nvarchar](10) NULL,
                    [Created_by] [nvarchar](20) NULL,
                    [export_type] [nvarchar](10) NULL,
                  PRIMARY KEY CLUSTERED 
                  (
                    [UID] ASC
                  )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                  ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1035,
    queries: [
      `CREATE TABLE [dbo].[Br_Exp](
                          [TRAN_ID] [int] NULL,
                          [Exp_Ledg_Code] [varchar](50) NULL,
                          [Br_Code] [varchar](50) NULL,
                          [Exp_Amt] [money] NULL,
                          [Export_Type] [varchar](50) NULL,
                          [User_Code] [varchar](50) NULL,
                          [Modify_Date] [datetime2](7) NULL,
                          [Month] [varchar](10) NULL,
                          [Year] [varchar](10) NULL
                        ) ON [PRIMARY]`,
      `CREATE TABLE [dbo].[PPC_PARAM](
                      [Tran_id] [int] NULL,
                      [Interest] [money] NULL,
                      [Payout_Insurance] [money] NULL,
                      [Commission_Ew] [money] NULL,
                      [Commission_CCP] [money] NULL,
                      [Commission_TCU] [money] NULL,
                      [Margin_Card] [money] NULL,
                      [Margin_Fastag] [money] NULL,
                      [Margin_Accessory] [money] NULL,
                      [Margin_VAS] [money] NULL,
                      [Margin_Outsider] [money] NULL,
                      [Loc_code] [int] NULL,
                      [Export_type] [int] NULL,
                      [Modify_date] [datetime2](7) NULL,
                      [Create_by] [nvarchar](50) NULL
                    ) ON [PRIMARY]`,
      `CREATE TABLE [dbo].[Exp_Allot](
                    [UID] [varchar](20) NOT NULL,
                    [Exp_Ledg_Code] [varchar](50) NOT NULL,
                    [Br_code] [varchar](50) NOT NULL,
                    [Exp_perc] [decimal](5, 2) NULL,
                    [Export_type] [varchar](50) NOT NULL,
                    [User_code] [varchar](50) NOT NULL,
                    [Modify_date] [datetime2](7) NULL
                  ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1036,
    queries: [
      ` alter table assets_group_subcategory add [AMC] [bit] NULL`,
      `	alter table assets_group_subcategory add [Depreciation_Method] [varchar](100) NULL`,
      `alter table asset_product add [Start_Date] [datetime2](7) NULL`,
      `alter table asset_product add [End_Date] [datetime2](7) NULL`,
      `alter table asset_product add [Amc_Value] [varchar](20) NULL`,
      `	alter table asset_product add [Amc_Vendor] [varchar](100) NULL`,
      `alter table asset_product add	[AssetCode] [varchar](50) NULL`,
      `alter table asset_product add	[Characteristics] [varchar](255) NULL`,
      `    alter table product_history add [TransferTo] [varchar](20) NULL`,
      `alter table product_history add [Tran_Date] [datetime2](7) NULL`,
      `alter table purchase_request add [Tran_Date] [datetime2](7) NULL`,
      `alter table asset_pooling_reallocation add [reallocation_date] [datetime2](7) NULL`,
      `alter table product_history  add [common] varchar(10) NULL`,
      `CREATE TABLE [dbo].[Asset_Characteristic](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Type] [varchar](100) NULL,
	[Name] [varchar](100) NULL,
	[Category] [varchar](20) NULL,
	[SubCategory] [varchar](20) NULL,
	[AssetProduct] [varchar](20) NULL,
	[Created_At] [datetime2](7) NULL,
	[Created_by] [varchar](100) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Asset_Characteristic_Hst])
)
ALTER TABLE [dbo].[Asset_Characteristic] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `alter table product_issue alter column [Category] [varchar](20)  NULL
              alter table product_issue alter column [SubCategory] [varchar](20)  NULL`,
      `
              alter table Assets_Group_Subcategory add common [bit] NULL`,
      `CREATE TABLE [dbo].[Asset_Characteristic](
                [UTD] [int] IDENTITY(1,1) NOT NULL,
                [Type] [varchar](100) NULL,
                [Name] [varchar](100) NULL,
                [Category] [varchar](20) NULL,
                [SubCategory] [varchar](20) NULL,
                [AssetProduct] [varchar](20) NULL,
                [Created_At] [datetime2](7) NULL,
                [Created_by] [varchar](100) NULL,
                [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
                [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
                [TypeValue] [varchar](10) NULL,
              PRIMARY KEY CLUSTERED 
              (
                [UTD] ASC
              )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
              ) ON [PRIMARY]
              WITH
              (
              SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Asset_Characteristic_Hst])
              )
              ALTER TABLE [dbo].[Asset_Characteristic] ADD  DEFAULT (getdate()) FOR [Created_At]
              
              `,
      `alter table asset_product add Min_Qty varchar(10) null`,
      `
alter table product_service alter column description varchar(200)null`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1037,
    queries: [
      `ALTER TABLE employee_atnstatus
            ADD CONSTRAINT PK_employee_atnstatus_Utd PRIMARY KEY CLUSTERED (Utd);`,
      `ALTER TABLE Employee_AtnStatus
            ADD ValidFrom DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
                ValidTo DATETIME2 NOT NULL DEFAULT CONVERT(DATETIME2, '9999-12-31 23:59:59.9999999');`,
      `ALTER TABLE Employee_AtnStatus
            ADD PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo);`,
      `ALTER TABLE Employee_AtnStatus
            SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.Employee_AtnStatus_History));`,
    ],
  },
  {
    comments: "suggestive order",
    ID: 1038,
    queries: [
      `CREATE TABLE [dbo].[Part_Stock](
	[UID] [int] IDENTITY(1,1) NOT NULL,
	[Tran_id] [int] NULL,
	[Part_No] [nvarchar](50) NULL,
	[Descr] [nvarchar](250) NULL,
	[Stock_Qty] [decimal](18, 0) NULL,
	[Br_Code] [nvarchar](50) NULL,
	[Export_Type] [int] NULL,
	[srno] [int] NULL,
	[Date] [datetime] NULL,
	[Create_By] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[UID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]`,
      `ALTER TABLE [dbo].[Part_Stock] ADD  DEFAULT (getdate()) FOR [Date]`,
      `CREATE TABLE [dbo].[Part_MinStock](
	[UID] [int] IDENTITY(1,1) NOT NULL,
	[Tran_id] [int] NULL,
	[Part_No] [nvarchar](50) NULL,
	[Min_Stock_Qty] [decimal](18, 0) NULL,
	[Br_Code] [nvarchar](50) NULL,
	[Export_Type] [int] NULL,
	[Date] [datetime] NULL,
	[srno] [int] NULL,
	[Descr] [nvarchar](250) NULL,
	[Create_By] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[UID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]`,
      `ALTER TABLE [dbo].[Part_MinStock] ADD  DEFAULT (getdate()) FOR [Date]`,
      `CREATE TABLE [dbo].[Suggestive_Order](
      [UID] [int] IDENTITY(1,1) NOT NULL,
      [Tran_id] [int] NULL,
      [Order_No] [nvarchar](50) NULL,
      [Br_Code] [nvarchar](50) NULL,
      [Part_No] [nvarchar](50) NULL,
      [Descr] [nvarchar](250) NULL,
      [Stock_Qty] [decimal](18, 0) NULL,
      [Min_Stock_Qty] [decimal](18, 0) NULL,
      [Order_Qty] [int] NULL,
      [Export_Type] [int] NULL,
      [Date] [datetime] NULL,
      [srno] [int] NULL,
      [Remark] [nvarchar](250) NULL,
      [Create_By] [nvarchar](255) NULL,
    PRIMARY KEY CLUSTERED 
    (
      [UID] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]`,
      `ALTER TABLE [dbo].[Suggestive_Order] ADD  DEFAULT (getdate()) FOR [Date]`,
    ],
  },
  {
    comments: "finance Payout",
    ID: 1039,
    queries: [
      `alter table newcar_financedetails add icm_tran_id varchar(20) null`,
    ],
  },
  {
    comments: "Misc Mst",
    ID: 1040,
    queries: [`alter table Misc_Mst add UTD int identity (1,1)`],
  },
  {
    comments: "Finance Master",
    ID: 1041,
    queries: [
      `CREATE TABLE [dbo].[Financer_Master](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Financer] [varchar](20) NULL,
	[godw_code] [varchar](50) NULL,
	[amount] [decimal](10, 2) NULL,
	[validfrom] [date] NULL,
	[validTo] [date] NULL,
	[Created_At] [datetime2](7) NULL,
	[CREATED_BY] [varchar](200) NULL,
	[ValidFrom1] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo1] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom1], [ValidTo1])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Financer_Master_Hst])
)

ALTER TABLE [dbo].[Financer_Master] ADD  DEFAULT (getdate()) FOR [Created_At]

ALTER TABLE [dbo].[Financer_Master] ADD  DEFAULT (getdate()) FOR [ValidFrom1]`,
    ],
  },
  {
    comments: "Finance Payout",
    ID: 1042,
    queries: [
      `
  alter table icm_ext add [tPayout_Rate] [float] NULL
	alter table icm_ext add [ttotalfin] [float] NULL
	alter table icm_ext add [executive_payout] [float] NULL
	alter table icm_ext add [vechical_invoice] [varchar](100) NULL
	alter table icm_ext add [insurance_policy] [varchar](100) NULL
	alter table icm_ext add [Taxable_Amt] [float] NULL
  alter table newcar_financedetails add icm_tran_id varchar(20)null
`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1043,
    queries: [
      `alter table SHORTLISTED_CANDIDATE alter column SKILLS nvarchar(300)`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1044,
    queries: [
      `
              CREATE TABLE [dbo].[Daily_Task](
          [Tran_id] [int] IDENTITY(1,1) NOT NULL,
          [Emp_Name] [nvarchar](255) NOT NULL,
          [MorningTask] [nvarchar](max) NULL,
          [Status1] [nvarchar](50) NULL,
          [Remark1] [nvarchar](max) NULL,
          [AfternooTask] [nvarchar](max) NULL,
          [Status2] [nvarchar](50) NULL,
          [Remark2] [nvarchar](max) NULL,
          [Create_by] [nvarchar](255) NULL,
          [Create_at] [datetime] NULL,
          [Loc_Code] [varchar](50) NULL,
          [Emp_Date] [date] NULL,
          [Emp_Code] [varchar](255) NULL,
          [FINAL_STATUS] [int] NULL,
          [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
          [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        PRIMARY KEY CLUSTERED 
        (
          [Tran_id] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
          PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]
        WITH
        (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Daily_Task_Hst])
        )`,
      `ALTER TABLE [dbo].[Daily_Task] ADD  DEFAULT (getdate()) FOR [Create_at]`,
      `ALTER TABLE [dbo].[Daily_Task] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1045,
    queries: [
      `CREATE TABLE [dbo].[Mobile_Rights](
        [utd] [int] IDENTITY(1,1) NOT NULL,
        [Emp_Code] [nvarchar](20) NOT NULL,
        [Optn_Name] [nvarchar](255) NOT NULL,
        [Module_Code] [int] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      PRIMARY KEY CLUSTERED 
      (
        [utd] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Mobile_Rights_Hst])
      )`,
      `ALTER TABLE NEW_JOINING ADD Emgy_No nvarchar (100) null;`,
      `ALTER TABLE NEW_JOINING ADD Emgy_Mob_No nvarchar (20) null;`,
    ],
  },
  {
    comments: "Asset_Request",
    ID: 1046,
    queries: [
      `CREATE TABLE [dbo].[Asset_Request](
      [tran_id] [int] IDENTITY(1,1) NOT NULL,
      [Req_Date] [datetime2](7) NULL,
      [Asset_Category] [varchar](20) NOT NULL,
      [EmpCode] [varchar](20) NULL,
      [OnBehalfEmpCode] [varchar](20) NULL,
      [Reason] [varchar](200) NULL,
      [AssetIssue] [varchar](20) NULL,
      [Quotation] [varchar](255) NULL,
      [Location] [varchar](10) NULL,
      [Created_By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      [IsApproval] [varchar](10) NULL,
    PRIMARY KEY CLUSTERED 
    (
      [tran_id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
    ) ON [PRIMARY]
    WITH
    (
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Asset_Request_Hst])
    )
    
    ALTER TABLE [dbo].[Asset_Request] ADD  DEFAULT (getdate()) FOR [Created_At]
    ALTER TABLE [dbo].[Asset_Request] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "Asset_Request_Dtl",
    ID: 1047,
    queries: [
      `CREATE TABLE [dbo].[Asset_Request_Dtl](
      [tran_id] [int] IDENTITY(1,1) NOT NULL,
      [Product_Code] [varchar](20) NULL,
      [Subcategory] [varchar](20) NULL,
      [Item_Description] [varchar](100) NULL,
      [Quantity] [varchar](20) NOT NULL,
      [Unit_Price] [varchar](20) NULL,
      [Discount] [varchar](20) NULL,
      [Total_Price] [money] NULL,
      [Request_Id] [varchar](20) NULL,
      [ITEM_TYPE] [varchar](20) NULL,
      [HSN] [varchar](20) NULL,
      [UOM1] [varchar](10) NULL,
      [Location] [varchar](10) NULL,
      [Appr_1_Code] [varchar](100) NULL,
      [Appr_1_Stat] [tinyint] NULL,
      [Appr_1_Rem] [varchar](300) NULL,
      [Appr_2_Code] [varchar](100) NULL,
      [Appr_2_Stat] [tinyint] NULL,
      [Appr_2_Rem] [varchar](300) NULL,
      [Appr_3_Code] [varchar](100) NULL,
      [Appr_3_Stat] [tinyint] NULL,
      [Appr_3_Rem] [varchar](300) NULL,
      [Fin_Appr] [tinyint] NULL,
      [srm] [varchar](20) NULL,
      [Created_By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      [IsApproval] [varchar](10) NULL,
    PRIMARY KEY CLUSTERED 
    (
      [tran_id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
    ) ON [PRIMARY]
    WITH
    (
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Asset_Request_Dtl_Hst])
    )
    
    ALTER TABLE [dbo].[Asset_Request_Dtl] ADD  DEFAULT (getdate()) FOR [Created_At]
    
    ALTER TABLE [dbo].[Asset_Request_Dtl] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "MGA_Approval",
    ID: 1048,
    queries: [
      `CREATE TABLE [dbo].[MGA_Approval](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [Req_Date] [datetime2](7) NULL,
      [EmpCode] [varchar](10) NULL,
      [Cust_Id] [varchar](50) NULL,
      [VIN] [varchar](50) NULL,
      [Invoice_No] [varchar](50) NULL,
      [Cust_Name] [varchar](100) NULL,
      [Cust_Mobile] [varchar](15) NULL,
      [MGAIssuedDMS] [varchar](10) NULL,
      [Appr_1_Code] [varchar](100) NULL,
      [Appr_1_Stat] [tinyint] NULL,
      [Appr_1_Date] [datetime2](7) NULL,
      [Appr_1_Rem] [varchar](300) NULL,
      [Appr_2_Code] [varchar](100) NULL,
      [Appr_2_Stat] [tinyint] NULL,
      [Appr_2_Date] [datetime2](7) NULL,
      [Appr_2_Rem] [varchar](300) NULL,
      [Appr_3_Code] [varchar](100) NULL,
      [Appr_3_Stat] [tinyint] NULL,
      [Appr_3_Date] [datetime2](7) NULL,
      [Appr_3_Rem] [varchar](300) NULL,
      [Fin_Appr] [tinyint] NULL,
      [srm] [varchar](20) NULL,
      [Created_By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      [Location] [varchar](10) NULL,
      [Cust_Status] [varchar](10) NULL,
    PRIMARY KEY CLUSTERED 
    (
      [UTD] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
    ) ON [PRIMARY]
    WITH
    (
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[MGA_Approval_Hst])
    )
    
    ALTER TABLE [dbo].[MGA_Approval] ADD  DEFAULT (getdate()) FOR [Created_At]
    
    ALTER TABLE [dbo].[MGA_Approval] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "MGA_Approval_dtl",
    ID: 1049,
    queries: [
      `CREATE TABLE [dbo].[MGA_Approval_dtl](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [MGA_Approval_UTD] [varchar](10) NULL,
      [MGA_Description] [varchar](200) NULL,
      [Quantity] [varchar](10) NULL,
      [Amount] [varchar](10) NULL,
      [Created_By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
    PRIMARY KEY CLUSTERED 
    (
      [UTD] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
    ) ON [PRIMARY]
    WITH
    (
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[MGA_Approval_dtl_Hst])
    )
    
    ALTER TABLE [dbo].[MGA_Approval_dtl] ADD  DEFAULT (getdate()) FOR [Created_At]
    ALTER TABLE [dbo].[MGA_Approval_dtl] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1050,
    queries: [
      `CREATE TABLE [dbo].[announcement_users](
          [id] [int] IDENTITY(1,1) NOT NULL,
          [announcement_id] [int] NOT NULL,
          [employee_code] [nvarchar](255) NOT NULL,
          [status] [nvarchar](10) NULL,
          [ReadDate] [datetime] NULL,
          [created] [datetime] NULL,
        PRIMARY KEY CLUSTERED 
        (
          [id] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        CONSTRAINT [unique_announcement_employee] UNIQUE NONCLUSTERED 
        (
          [announcement_id] ASC,
          [employee_code] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
        ) ON [PRIMARY]`,
      `ALTER TABLE [dbo].[announcement_users] ADD  DEFAULT (getdate()) FOR [created]`,
      `CREATE TABLE [dbo].[announcements](
        [announcement_id] [int] IDENTITY(1,1) NOT NULL,
        [title] [nvarchar](300) NULL,
        [message] [nvarchar](300) NULL,
        [created_by] [nvarchar](15) NULL,
        [send_by] [nvarchar](15) NULL,
        [send_to] [bigint] NOT NULL,
        [status] [varchar](50) NULL,
        [priority] [varchar](50) NULL,
        [attachment_path] [varchar](255) NULL,
        [is_deleted] [bit] NULL,
        [created_at] [datetime] NULL,
      PRIMARY KEY CLUSTERED 
      (
        [announcement_id] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
      ) ON [PRIMARY]`,
      `ALTER TABLE [dbo].[announcements] ADD  DEFAULT ((0)) FOR [is_deleted]`,
      `ALTER TABLE [dbo].[announcements] ADD  DEFAULT (getdate()) FOR [created_at]`,
    ],
  },
  {
    comments: "Demo_Car_Gatepass",
    ID: 1051,
    queries: [
      "alter table demo_car_gatepass add Interbranch_Loc varchar(20) null",
      "alter table demo_car_gatepass add ISFLAG varchar(10) null",
    ],
  },
  {
    comments: "Asset_Request_Dtl",
    ID: 1052,
    queries: [
      "alter table Asset_Request_Dtl add Quotation1 varchar(255) null",
      "alter table Asset_Request_Dtl add Quotation2 varchar(255) null",
      "alter table Asset_Request_Dtl add Quotation3 varchar(255) null",
    ],
  },
  //   {
  //     comments: "Pick_Drop_Collection",
  //     ID: 1053,
  //     queries: [
  //       `CREATE TABLE [dbo].[Pick_Drop_Collection](
  //       [tran_id] [int] IDENTITY(1,1) NOT NULL,
  //       [Req_Date] [datetime2](7) NULL,
  //       [Time] [time](7) NULL,
  //       [Veh_Req] [varchar](50) NULL,
  //       [Customer_Name] [varchar](100) NULL,
  //       [Customer_Mob] [varchar](10) NULL,
  //       [Performa_Inv] [varchar](50) NULL,
  //       [Bill_No] [varchar](50) NULL,
  //       [Inv_Amt] [varchar](50) NULL,
  //       [Driver_Name] [varchar](50) NULL,
  //       [Driver_Mob] [varchar](10) NULL,
  //       [Mode_Payment] [varchar](50) NULL,
  //       [Amount_Paid] [varchar](50) NULL,
  //       [Short_Access] [varchar](50) NULL,
  //       [Location] [varchar](10) NULL,
  //       [Created_By] [varchar](255) NULL,
  //       [Created_At] [datetime] NOT NULL,
  //       [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
  //       [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
  //       [IsUpdate] [varchar](10) NULL,
  //     PRIMARY KEY CLUSTERED
  //     (
  //       [tran_id] ASC
  //     )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
  //       PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
  //     ) ON [PRIMARY]
  //     WITH
  //     (
  //     SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Pick_Drop_Collection_Hst])
  //     )

  //     ALTER TABLE [dbo].[Pick_Drop_Collection] ADD  DEFAULT (getdate()) FOR [Created_At]

  //     ALTER TABLE [dbo].[Pick_Drop_Collection] ADD  DEFAULT (getdate()) FOR [ValidFrom]
  // Alter table Pick_Drop_Collection add UPIPayment varchar (10) null`,
  //       `ALTER TABLE pick_drop_collection ALTER COLUMN UPIPayment VARCHAR(100)`,
  //       `Alter table pick_drop_collection add Remark varchar(200) null`,
  //       `EXEC sp_rename 'pick_drop_collection.req_date', 'Bill_Date', 'COLUMN'`,
  //       `Alter table [Pick_Drop_Collection] ADD Req_Date  [datetime2](7) NULL`,
  //       `ALTER TABLE PICK_DROP_COLLECTION ADD Receipt_Amt VARCHAR(50) NULL`,
  //     ],
  //   },
  {
    comments: "RTO IMport",
    ID: 1055,
    queries: [
      `CREATE TABLE [dbo].[RTO_IMPORT](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Inv_No] [varchar](50) NULL,
	[MI_Date] [datetime2](7) NULL,
	[Month][float] NULL,
	[Reg_No] [varchar](50) NULL,
	[VAH_REGNO] [varchar](50) NULL,
	[VAH_CLASS] [varchar](50) NULL,
	[VAH_MODEL] [varchar](50) NULL,
	[VAH_VEHICLECOLOUR] [varchar](50) NULL,
	[VAH_TYPE] [varchar](50) NULL,
	[VAH_OWNER] [varchar](50) NULL,
	[VAH_PRES_ADD] [varchar](400) NULL,
	[VAH_PRES_ADD_DISTRICT] [varchar](100) NULL,
	[VAH_PRES_ADD_STATE] [varchar](100) NULL,
	[VAH_PRES_ADD_CITY] [varchar](100) NULL,
	[VAH_PRES_ADD_PIN] [varchar](100) NULL,
	[VAH_REGAUTHORITY] [varchar](100) NULL,
	[VAH_REGDATE] [datetime2](7) NULL,
	VAH_VEHICLEINSCOMPNAME[varchar](400) NULL,
	VAH_RCFINANCER[varchar](200) NULL,
	VAH_ISCOMMERCIAL[varchar](200) NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[RTO_IMPORT_HST])
)

ALTER TABLE [dbo].[RTO_IMPORT] ADD  DEFAULT (getdate()) FOR [Created_At]


ALTER TABLE [dbo].[RTO_IMPORT] ADD  DEFAULT (getdate()) FOR [ValidFrom]
`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1057,
    queries: [`alter table Mobile_Rights add USER_CODE int`],
  },
  {
    comments: "Finance Payout New",
    ID: 1058,
    queries: [
      `
  alter table icm_ext add [mssf] [varchar](10) NULL
	alter table icm_ext add [mssf_reason] [varchar](200) NULL
	alter table icm_ext add [Rto_Copy] [varchar](400) NULL
	alter table icm_ext add [Emailto] [varchar](200) NULL
	alter table icm_ext add [Emaildate] [datetime2](7) NULL
	alter table icm_ext add [findse] [varchar](20) NULL
	alter table icm_ext add [otherpayout] [float] NULL
	alter table icm_ext add [Taxable] [float] NULL
	alter table icm_ext add [gst] [float] NULL
	alter table icm_ext add [apayout] [float] NULL
	alter table icm_ext add [preinvoice_by] [varchar](50) NULL
	alter table icm_ext add [preinvoice_date] [datetime2](7) NULL
	alter table icm_ext add [remark] [varchar](200) NULL
	alter table icm_ext add [Payout_Received_Amount] [float] NULL
	alter table icm_ext add [Payout_TDS] [float] NULL
	alter table icm_ext add [Receipt_No] [varchar](20) NULL
	alter table icm_ext add [Receipt_Date] [datetime2](7) NULL
	alter table icm_ext add [preinvoice_num] [varchar](50) NULL
	alter table icm_ext add [loc_code] [varchar](10) NULL
	alter table icm_ext add [fin_branch] [varchar](50) NULL
`,
    ],
  },
  {
    comments: "Payout",
    ID: 1061,
    queries: [`alter table dise_aprvl add mssfoffer float null`],
  },
  // {
  //   comments: "In_Service",
  //   ID: 1062,
  //   queries: [
  //     `CREATE TABLE [dbo].[In_Service](
  //       [UTD] [int] IDENTITY(1,1) NOT NULL,
  //       [Veh_Req] [varchar](50) NULL,
  //       [Customer_Name] [varchar](100) NULL,
  //       [Visit_Purpose] [varchar](10) NULL,
  //       [InTime] [datetime] NULL,
  //       [OutTime] [time](7) NULL,
  //       [Location] [varchar](10) NULL,
  //       [Created_By] [varchar](255) NULL,
  //       [Created_At] [datetime] NOT NULL,
  //       [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
  //       [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
  //       [Req_Date] [datetime2](7) NULL,
  //     PRIMARY KEY CLUSTERED
  //     (
  //       [UTD] ASC
  //     )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
  //       PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
  //     ) ON [PRIMARY]
  //     WITH
  //     (
  //     SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[In_Service_Hst])
  //     )

  //     ALTER TABLE [dbo].[In_Service] ADD  CONSTRAINT [DF_In_Service_InTime]  DEFAULT (getdate()) FOR [InTime]

  //     ALTER TABLE [dbo].[In_Service] ADD  DEFAULT (getdate()) FOR [Created_At]

  //     ALTER TABLE [dbo].[In_Service] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
  //   ],
  // },
  {
    comments: "Employeemaster new fields",
    ID: 1064,
    queries: [
      `alter table employeemaster add
      CATEGORY int,
      CLUSTER int ,
      CHANNEL int ,
      COSTCENTRE int `,
    ],
  },
  {
    comments: "Employeemaster",
    ID: 1066,
    queries: [
      `IF NOT EXISTS (SELECT 1 FROM Asset_Issue)
      BEGIN 
            DROP TABLE Asset_Issue;
      END`,
      `CREATE TABLE [dbo].[Asset_Issue](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[SRNO] [int] NULL,
	[Emp_Code] [nvarchar](50) NULL,
	[Aset_Code] [nvarchar](250) NULL,
	[Emp_Loc] [nvarchar](100) NULL,
	[Issue_Date] [date] NULL,
	[Issue_Rem] [nvarchar](150) NULL,
	[Revoke_Date] [date] NULL,
	[Revoke_User] [int] NULL,
	[Revoke_Cond] [nvarchar](150) NULL,
	[Revoke_Rem] [nvarchar](150) NULL,
	[Export_type] [int] NULL,
	[Loc_Code] [int] NULL,
	[Inv_No] [int] NULL,
	[Emp_Dept] [nvarchar](100) NULL,
	[Asset_Serial_no] [nvarchar](100) NULL,
	[Asset_Type] [nvarchar](100) NULL,
	[Lost_Date] [date] NULL,
	[sr_no] [int] NULL,
	[Created_At] [datetime] NOT NULL,
	[Created_by] [varchar](100) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[Aset_Name] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Asset_Issue_Hst])
)`,
      `ALTER TABLE [dbo].[Asset_Issue] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[Asset_Issue] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `CREATE TABLE [dbo].[Emp_Edu](
	[Utd] [int] IDENTITY(1,1) NOT NULL,
	[SRNO] [int] NULL,
	[Emp_Degree] [nvarchar](30) NULL,
	[Emp_Board] [nvarchar](30) NULL,
	[Emp_College] [nvarchar](30) NULL,
	[Emp_Passing_year] [nvarchar](4) NULL,
	[Emp_Percentage] [money] NULL,
	[Created_by] [nvarchar](30) NOT NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[SNo] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[Utd] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Emp_Edu_Hst])
)`,
      `ALTER TABLE [dbo].[Emp_Edu] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[Emp_Edu] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `CREATE TABLE [dbo].[Emp_Experience](
	[Utd] [int] IDENTITY(1,1) NOT NULL,
	[SRNO] [int] NULL,
	[Emp_Company] [nvarchar](30) NULL,
	[Emp_Designation] [nvarchar](30) NULL,
	[Emp_Responsibility] [nvarchar](30) NULL,
	[Emp_From_Date] [datetime2](7) NULL,
	[Emp_To_Date] [datetime2](7) NULL,
	[Emp_Settlement_Done] [nvarchar](30) NULL,
	[Emp_Drawn_Salary] [money] NULL,
	[Emp_Leaving_Reason] [nvarchar](50) NULL,
	[Created_by] [nvarchar](30) NOT NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[SNo] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[Utd] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Emp_Experience_Hst])
)`,
      `ALTER TABLE [dbo].[Emp_Experience] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[Emp_Experience] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `CREATE TABLE [dbo].[Emp_Family](
	[Utd] [int] IDENTITY(1,1) NOT NULL,
	[SRNO] [int] NULL,
	[Emp_Family_name] [nvarchar](30) NULL,
	[Emp_Family_DOB] [date] NULL,
	[Emp_Family_Relation] [nvarchar](30) NULL,
	[Emp_Family_Address] [nvarchar](30) NULL,
	[Emp_Family_Bloodgroup] [nvarchar](30) NULL,
	[Emp_Family_Gender] [nvarchar](30) NULL,
	[Emp_Family_Mobileno] [nvarchar](30) NULL,
	[Emp_Family_emailid] [nvarchar](30) NULL,
	[Emp_Family_Profession] [nvarchar](30) NULL,
	[Created_by] [nvarchar](30) NOT NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[SNo] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[Utd] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Emp_Family_Hst])
)`,
      `ALTER TABLE [dbo].[Emp_Family] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[Emp_Family] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `CREATE TABLE [dbo].[Emp_ITSkill](
	[Utd] [int] IDENTITY(1,1) NOT NULL,
	[SRNO] [int] NULL,
	[Emp_Tool] [nvarchar](30) NULL,
	[Emp_Version] [nvarchar](30) NULL,
	[Emp_Proficiency] [nvarchar](30) NULL,
	[Emp_Last_Used] [nvarchar](4) NULL,
	[Emp_Experience] [nvarchar](4) NULL,
	[Created_by] [nvarchar](30) NOT NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Utd] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Emp_ITSkill_Hst])
)`,
      `ALTER TABLE [dbo].[Emp_ITSkill] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[Emp_ITSkill] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `CREATE TABLE [dbo].[Emp_Lang](
	[Utd] [int] IDENTITY(1,1) NOT NULL,
	[SRNO] [int] NULL,
	[Emp_Language] [nvarchar](30) NULL,
	[Emp_Language_Understand] [nvarchar](30) NULL,
	[Emp_Language_Speak] [nvarchar](30) NULL,
	[Emp_Language_Read] [nvarchar](30) NULL,
	[Emp_Language_Write] [nvarchar](30) NULL,
	[Created_by] [nvarchar](30) NOT NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[SNo] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[Utd] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Emp_Lang_Hst])
)`,
      `ALTER TABLE [dbo].[Emp_Lang] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[Emp_Lang] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `CREATE TABLE [dbo].[NewCar_AuditLogs](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[qr_id] [int] NULL,
	[User_Code] [varchar](50) NULL,
	[EMPCODE] [varchar](50) NULL,
	[Loc_Code] [int] NULL,
	[AuditTime] [datetime] NULL,
	[Latitude] [nvarchar](20) NULL,
	[Longitude] [nvarchar](20) NULL,
	[VIN] [nvarchar](40) NULL,
	[Remark] [nvarchar](255) NULL
) ON [PRIMARY]`,
      `ALTER TABLE [dbo].[NewCar_AuditLogs] ADD  DEFAULT (getdate()) FOR [AuditTime]`,
      `CREATE TABLE [dbo].[NewCar_StockAudit](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[vin] [nvarchar](50) NULL,
	[chassis] [nvarchar](50) NULL,
	[engine] [nvarchar](50) NULL,
	[model_color] [nvarchar](100) NULL,
	[model_name] [nvarchar](150) NULL,
	[model_code] [nvarchar](50) NULL,
	[Loc_Code] [varchar](100) NULL,
	[created_at] [datetime] NULL
) ON [PRIMARY]`,
      `ALTER TABLE [dbo].[NewCar_StockAudit] ADD  DEFAULT (getdate()) FOR [created_at]`,
    ],
  },
  {
    comments: "Payout 1",
    ID: 1067,
    queries: [
      `alter table icm_ext  add export_type varchar(10) null`,
      `alter table  icm_ext add payout_type varchar(20) null`,
    ],
  },
  {
    comments: "Discount Offer",
    ID: 1068,
    queries: [
      `CREATE TABLE [dbo].[Discount_Offers](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Model_Group] [varchar](20)  NULL,
	[Model_Group_Name] [varchar](200)NULL,
	[Model_Code] [varchar](20)  NULL,
	[Model_Name] [varchar](200)  NULL,
	[MI_Date]date null,
	[Consumer]float null,
	[Exch]float null,
	[Mssf]float null,
	[Corporate1]float null,
	[Corporate2]float null,
	[Valid_From]date null,
	[Valid_Upto]date null,
	[State][varchar](20)  NULL,
	[Region][varchar](20)  NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Discount_Offers_Hst])
)
GO

ALTER TABLE [dbo].[Discount_Offers] ADD  DEFAULT (getdate()) FOR [Created_At]
GO

ALTER TABLE [dbo].[Discount_Offers] ADD  DEFAULT (getdate()) FOR [ValidFrom]
GO`,
    ],
  },
  {
    comments: "Discount Offer 2",
    ID: 1069,
    queries: [
      `
      alter table Discount_OFfers add MarutiEmp float null
alter table Discount_OFfers add MI_Date_Upto date null
alter table Discount_OFfers add MeriMaruti float null
alter table Discount_OFfers add scrappage float null
      `,
    ],
  },
  // {
  //   comments: "Pick_Drop_Collection",
  //   ID: 1070,
  //   queries: [
  //     "ALTER TABLE [Pick_Drop_Collection] ADD CONSTRAINT DF_Pick_Drop_Collection_Time DEFAULT GETDATE() FOR [Time]",
  //     "ALTER TABLE [Pick_Drop_Collection] ADD CONSTRAINT DF_Pick_Drop_Collection_Req_Date DEFAULT GETDATE() FOR [Req_Date]",
  //   ],
  // },
  // {
  //   comments: "In_Service",
  //   ID: 1071,
  //   queries: [
  //     "ALTER TABLE [In_Service] ADD CONSTRAINT DF_In_Service_Req_Date DEFAULT GETDATE() FOR [Req_Date]",
  //   ],
  // },
  {
    comments: "Discount Offer 2",
    ID: 1073,
    queries: [
      `
      alter table Discount_OFfers add MarutiEmp float null
alter table Discount_OFfers add MI_Date_Upto date null
alter table Discount_OFfers add MeriMaruti float null
alter table Discount_OFfers add scrappage float nul
      `,
    ],
  },
  {
    comments: "User Table",
    ID: 1074,
    queries: [
      `
      alter table user_tbl alter column emp_dms_code varchar(100)null

      `,
    ],
  },
  {
    comments: "Demo_Car_Gatepass",
    ID: 1075,
    queries: ["alter table demo_car_gatepass add Enquiry_No varchar(30) null"],
  },
  {
    comments: "User Table",
    ID: 1075,
    queries: [
      `
      CREATE TABLE [dbo].[Dispatch_Dump](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	DELR varchar(10)NULL,
    CITY varchar(10)NULL,
    INVOICETYPE CHAR(1)NULL,
    Fin_No varchar(20)NULL,
    Invoice_GP_No varchar(20)NULL,
    GR_No varchar(20)NULL,
    ACCOUNTCODE CHAR(1)NULL,
    MODELCODE varchar(20)NULL,
    COLOR varchar(10)NULL,
    CHASSISPREFIX varchar(20)NULL,
    CHASSISNO varchar(20)NULL,
    ENGINENO varchar(20)NULL,
    INVOICEDATE DATE NULL,
    INV_DATE_FOR_ROAD_PERMIT DATE NULL,
    Basic_Value float NULL,
    Discount float NULL,
    DRF float NULL,
    Assessable_Value float NULL,
    IGST float NULL,
    Cess float NULL,
    TCS float NULL,
    InvoiceAmt float NULL,
    ORDERCATEGORY varchar(10) NULL,
    PLANT varchar(10) NULL,
    TIN varchar(20)NULL,
    SENTBY varchar(50) NULL,
    TRIPNO varchar(20) NULL,
    TRANSPORTREGNUMBER varchar(20) NULL,
    INDENT varchar(20) NULL,
    TRANSNAME varchar(100) NULL,
    EMAILID varchar(100) NULL,
    FINANCIER varchar(50) NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Dispatch_Dump_Hst])
)
ALTER TABLE [dbo].[Dispatch_Dump] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Dispatch_Dump] ADD  DEFAULT (getdate()) FOR [ValidFrom]
      `,
      `CREATE TABLE [dbo].[CHAS_TRANSIT](
	[Tran_Id] [int] NOT NULL,
	[CHAS_ID] [int] NULL,
	[TRAN_TYPE] [int] NULL,
	[Tran_Date] [date] NULL,
	[Tran_Amt] [money] NULL,
	[Asset_Ledg] [int] NULL,
	[Income_Ledg] [int] NULL,
	[Loc_Code] [int] NULL,
	[Export_Type] [int] NULL,
	[Item_Type] [int] NULL,
	[Item_Seq] [int] NULL
) ON [PRIMARY]`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1076,
    queries: [
      `CREATE TABLE [dbo].[In_Service](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [Veh_Req] [varchar](50) NULL,
        [Customer_Name] [varchar](100) NULL,
        [Visit_Purpose] [varchar](10) NULL,
        [InTime] [datetime] NULL,
        [OutTime] [time](7) NULL,
        [Location] [varchar](10) NULL,
        [Created_By] [varchar](255) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        [Req_Date] [datetime2](7) NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[In_Service_Hst])
      )`,
      `ALTER TABLE [dbo].[In_Service] ADD  CONSTRAINT [DF_In_Service_InTime]  DEFAULT (getdate()) FOR [InTime]`,
      `ALTER TABLE [dbo].[In_Service] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[In_Service] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `ALTER TABLE [dbo].[In_Service] ADD  CONSTRAINT [DF_In_Service_Req_Date]  DEFAULT (getdate()) FOR [Req_Date]`,
      `CREATE TABLE [dbo].[Pick_Drop_Collection](
	[tran_id] [int] IDENTITY(1,1) NOT NULL,
	[Bill_Date] [datetime2](7) NULL,
	[Time] [time](7) NULL,
	[Veh_Req] [varchar](50) NULL,
	[Customer_Name] [varchar](100) NULL,
	[Customer_Mob] [varchar](10) NULL,
	[Performa_Inv] [varchar](50) NULL,
	[Bill_No] [varchar](50) NULL,
	[Inv_Amt] [varchar](50) NULL,
	[Driver_Name] [varchar](50) NULL,
	[Driver_Mob] [varchar](10) NULL,
	[Mode_Payment] [varchar](50) NULL,
	[Amount_Paid] [varchar](50) NULL,
	[Short_Access] [varchar](50) NULL,
	[Location] [varchar](10) NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[IsUpdate] [varchar](10) NULL,
	[UPIPayment] [varchar](100) NULL,
	[Remark] [varchar](200) NULL,
	[Req_Date] [datetime2](7) NULL,
	[Receipt_Amt] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[tran_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Pick_Drop_Collection_Hst])
)`,
      `ALTER TABLE [dbo].[Pick_Drop_Collection] ADD  CONSTRAINT [DF_Pick_Drop_Collection_Time]  DEFAULT (getdate()) FOR [Time]`,
      `ALTER TABLE [dbo].[Pick_Drop_Collection] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[Pick_Drop_Collection] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `ALTER TABLE [dbo].[Pick_Drop_Collection] ADD  CONSTRAINT [DF_Pick_Drop_Collection_Req_Date]  DEFAULT (getdate()) FOR [Req_Date]`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1077,
    queries: [`alter table in_service add Cust_Mob varchar(20) null`],
  },
  {
    comments: "New_dev_Code",
    ID: 1078,
    queries: [
      `ALTER TABLE pot_cust_dtl
    ADD Req_Time TIME NULL,  
    Mrp DECIMAL(18, 2) NULL;`,
    ],
  },
  {
    comments: "Asset new",
    ID: 1079,
    queries: [`alter table Asset_Product add Unit_Rate float`],
  },
  {
    comments: "Assets_Group_Subcategory",
    ID: 1080,
    queries: [
      "alter table Assets_Group_Subcategory add UOM varchar(10) null",
      "alter table Assets_Group_Subcategory add itemType varchar(10) null",
      "alter table Assets_Group_Subcategory add HSN varchar(10) null",
    ],
  },
  {
    comments: "In_Service",
    ID: 1081,
    queries: ["ALTER TABLE In_Service ALTER COLUMN OutTime DATETIME NULL"],
  },
  {
    comments: "VAS_TRAN_TYPE",
    ID: 1082,
    queries: ["ALTER TABLE VAS_TEMP ADD TRAN_TYPE int"],
  },
  {
    comments: "New_dev_Code",
    ID: 1083,
    queries: [
      "alter table rtl_mst alter column [TD_Date] [datetime2](7) NULL",
      "alter table rtl_mst alter column [Book_Date] [datetime2](7) NULL",
      "alter table rtl_mst alter column [Book_Cncl] [datetime2](7) NULL",
      "alter table rtl_mst alter column [Part_Pymt1] [datetime2](7) NULL",
      "alter table rtl_mst alter column [Part_Pymt2] [datetime2](7) NULL",
      "alter table rtl_mst alter column [Lost_Date] [datetime2](7) NULL",
      "alter table rtl_mst alter column [Cncl_Date] [datetime2](7) NULL",
      "alter table rtl_mst alter column [ENTR_DATE] [datetime2](7) NULL",
      "alter table rtl_mst alter column [Reg_Date] [datetime2](7) NULL",
      "alter table rtl_mst alter column [DO_Date] [datetime2](7) NULL",
      "alter table rtl_mst alter column [Exp_Del_Date] [datetime2](7) NULL",
      "alter table rtl_mst alter column [DOB] [datetime2](7) NULL",
      "alter table rtl_mst alter column [DOM] [datetime2](7) NULL",
      "alter table rtl_mst alter column [NDOB] [datetime2](7) NULL",
      "alter table rtl_mst alter column [DSE_Gen] [varchar](50) NULL",
      "alter table rtl_mst alter column [Full_Pymt] [money] NULL",
      "alter table rtl_mst alter column [Soft_Date_1] [datetime2](7) NULL",
      "alter table rtl_mst alter column [Soft_Date_2] [datetime2](7) NULL",
      "alter table rtl_mst alter column [Soft_Date_3] [datetime2](7) NULL",
      "alter table rtl_mst alter column [File_Date_1] [datetime2](7) NULL",
      "alter table rtl_mst alter column [File_Date_2] [datetime2](7) NULL",
      "alter table rtl_mst alter column [File_Date_3] [datetime2](7) NULL",

      `alter table rtl_mst add
        [Exp_Del_Date] [datetime2](7) NULL,
        [Veh_Amt] [money] NULL,
        [Insu_Amt] [money] NULL,
        [RTO_Amt] [money] NULL,
        [war_Amt] [money] NULL,
        [Acc_Amt] [money] NULL,
        [Loy_Card_Amt] [money] NULL,
        [Other_Charge] [money] NULL,
        [Disc_Amt] [money] NULL,
        [Total_Amt] [money] NULL,
        [Book_No] [varchar](50) NULL,
        [Book_Mode] [int] NULL,
        [Lost_Reason] [varchar](200) NULL,
        [enquiry_date] [datetime2](7) NULL,
        [Modl_Var] [int] NULL,
        [ImgSourseArray1] [varchar](5000) NULL,
        [docs] [varchar](5000) NULL,
        [book_attachment] [nvarchar](300) NULL,
        [Alot_chas] [nvarchar](50) NULL
    `,
      `CREATE TABLE [dbo].[QUOTATION](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[tran_id] [int] NULL,
	[quotation_date] [date] NULL,
	[enquiry_no] [varchar](50) NULL,
	[date] [datetime2](7) NULL,
	[party_name] [varchar](255) NULL,
	[address] [varchar](255) NULL,
	[whatsApp_no] [varchar](20) NULL,
	[email] [varchar](255) NULL,
	[dse] [varchar](255) NULL,
	[tl] [varchar](255) NULL,
	[remark] [varchar](max) NULL,
	[model] [varchar](255) NULL,
	[variant] [varchar](255) NULL,
	[color] [varchar](255) NULL,
	[quantity] [varchar](50) NULL,
	[rate] [decimal](18, 2) NULL,
	[consumer_offer] [money] NULL,
	[corporate_offer] [money] NULL,
	[exchange_offer] [money] NULL,
	[additional_offer] [money] NULL,
	[insurance_amount] [money] NULL,
	[rto_amount] [money] NULL,
	[mga] [money] NULL,
	[ew] [money] NULL,
	[ccp] [money] NULL,
	[fastag] [money] NULL,
	[Auto_card] [money] NULL,
	[other_charges] [money] NULL,
	[total_price] [money] NULL,
	[loc_code] [varchar](15) NULL,
	[create_by] [varchar](100) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[pdf] [varchar](255) NULL,
	[ServerId] [nvarchar](10) NULL,
	[export_type] [nvarchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[QUOTATION_Hst])
)`,
      `ALTER TABLE [dbo].[QUOTATION] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[QUOTATION] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `alter table enq_dtl add [Dse_Reg] [varchar](50) NULL,
	[Dse_Reg_Label] [varchar](100) NULL`,
    ],
  },
  {
    comments: "Asset_Request_Dtl",
    ID: 1084,
    queries: [
      "alter table Asset_Request_Dtl add SpecialApr_Code Varchar(20) null",
      "alter table Asset_Request_Dtl add SpecialApr_Stat Varchar(20) null",
      "alter table Asset_Request_Dtl add SpecialApr_Remark Varchar(200) null",
      "alter table Asset_Request_dtl add IsSpecialApr varchar(10) null",
    ],
  },
  {
    comments: "Purchase_Order_Product_Details",
    ID: 1085,
    queries: [
      "alter table Purchase_Order_Product_Details add PurchaseRequest_UTD varchar(20) null",
    ],
  },
  {
    comments: "Asset_Product",
    ID: 1085,
    queries: [
      "alter table Asset_Product add MRP varchar(20) null",
      "alter table Asset_Product add Price varchar(10) null",
    ],
  },
  {
    comments: "Payment Tracker",
    ID: 1086,
    queries: [
      `CREATE TABLE [dbo].[Payment_Tracker](
	[tran_id] [int] IDENTITY(1,1) NOT NULL,
	[Req_Date] [datetime2](7) NULL,
	[Customer_Name] [varchar](100) NULL,
	[Mobile_No] [varchar](20) NULL,
	[Model_Variant] [varchar](20) NULL,
	[Bill_No] [varchar](20) NULL,
	[Mode_OF_Payement] [varchar](20) NULL,
	[Amount] [money] NULL,
	[Location] [varchar](10) NULL,
	[Appr_1_Code] [varchar](100) NULL,
	[Appr_1_Stat] [tinyint] NULL,
	[Appr_1_Date] [datetime2](7) NULL,
	[Appr_1_Rem] [varchar](300) NULL,
	[Appr_2_Code] [varchar](100) NULL,
	[Appr_2_Stat] [tinyint] NULL,
	[Appr_2_Date] [datetime2](7) NULL,
	[Appr_2_Rem] [varchar](300) NULL,
	[Appr_3_Code] [varchar](100) NULL,
	[Appr_3_Stat] [tinyint] NULL,
	[Appr_3_Date] [datetime2](7) NULL,
	[Appr_3_Rem] [varchar](300) NULL,
	[Fin_Appr] [tinyint] NULL,
	[srm] [varchar](20) NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[Dise_Amt] [float] NULL,
	[Approved_amt] [float] NULL,
PRIMARY KEY CLUSTERED 
(
	[tran_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Payment_Tracker_Hst])
)
ALTER TABLE [dbo].[Payment_Tracker] ADD  DEFAULT (getdate()) FOR [Req_Date]
ALTER TABLE [dbo].[Payment_Tracker] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Payment_Tracker] ADD  DEFAULT (getdate()) FOR [ValidFrom]
`,
    ],
  },
  {
    comments: "Asset_MonthWise_PurchaseValue",
    ID: 1087,
    queries: [
      `CREATE TABLE [dbo].[Asset_MonthWise_PurchaseValue](
      [Id] [int] IDENTITY(1,1) NOT NULL,
      [SubcategoryId] [varchar](10) NOT NULL,
      [Month] [varchar](10) NULL,
      [Purchase_Value] [varchar](50) NULL,
      [Created_At] [datetime2](7) NULL,
      [Created_by] [varchar](100) NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
    PRIMARY KEY CLUSTERED 
    (
      [Id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
    ) ON [PRIMARY]
    WITH
    (
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Asset_MonthWise_PurchaseValue_Hst])
    )
    
    ALTER TABLE [dbo].[Asset_MonthWise_PurchaseValue] ADD  DEFAULT (getdate()) FOR [Created_At]
`,
    ],
  },
  {
    comments: "purchase_request",
    ID: 1088,
    queries: [
      "ALTER TABLE purchase_request ALTER COLUMN Contact_Number VARCHAR(20) NULL",
    ],
  },
  {
    comments: "purchase_request",
    ID: 1089,
    queries: [
      "ALTER TABLE PRODUCT_SERVICE ADD [Service_Status] [varchar](50) NULL",
    ],
  },
  {
    comments: "purchase_request",
    ID: 1090,
    queries: ["ALTER TABLE TV_ICM_MST ADD DMS_SALE_INV nvarchar(50)"],
  },
  {
    comments: "purchase_request",
    ID: 1091,
    queries: ["ALTER TABLE TV_ICM_MST ADD SALE_STOCK_TYPE nvarchar(20)"],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1093,
    queries: [
      `alter table Pot_cust_dtl add Spm_Order_Qty [nvarchar](100) NULL;`,
    ],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1094,
    queries: [`ALTER TABLE TV_ICM_MST ADD VEH_STAT nvarchar(20);`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1095,
    queries: [`ALTER TABLE TV_ICM_MST ADD RC_VAL_UPTO SMALLDATETIME;`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1096,
    queries: [`ALTER TABLE TV_ICM_MST ADD INSU_VAL_UPTO SMALLDATETIME;`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1097,
    queries: [`ALTER TABLE TV_ICM_MST ADD LOAN_AMT money;`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1098,
    queries: [`ALTER TABLE TV_ICM_MST ADD CHALLAN_AMT money;`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1099,
    queries: [`ALTER TABLE TV_ICM_MST ADD DOC_TRF_CHRGS money;`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1100,
    queries: [`ALTER TABLE TV_ICM_MST ADD CHALLAN_DATE SMALLDATETIME;`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1101,
    queries: [`ALTER TABLE TV_ICM_MST ADD REG_DATE SMALLDATETIME;`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1102,
    queries: [`ALTER TABLE DemoCarMaster ADD VEH_TYPE nvarchar(200);`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1103,
    queries: [`ALTER TABLE DemoCarMaster ADD RESP_PERSON nvarchar(200);`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1104,
    queries: [`ALTER TABLE DemoCarMaster ADD INSU_POL_NO nvarchar(200);`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1105,
    queries: [`ALTER TABLE DemoCarMaster ADD INSU_POL_DATE SMALLDATETIME;`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1106,
    queries: [`ALTER TABLE DemoCarMaster ADD PUC_ISSUE_DATE SMALLDATETIME;`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1107,
    queries: [`ALTER TABLE DemoCarMaster ADD REGISTRATION_NAME nvarchar(200);`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1108,
    queries: [`ALTER TABLE DemoCarMaster ADD HYP_STAT nvarchar(200);`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1109,
    queries: [`ALTER TABLE DemoCarMaster ADD AUDIT_DATE SMALLDATETIME;`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1110,
    queries: [`ALTER TABLE DemoCarMaster ADD AUDIT_REM nvarchar(400);`],
  },
  {
    comments: "Pot cust Given by Umesh",
    ID: 1111,
    queries: [`ALTER TABLE DemoCarMaster ADD REMARK nvarchar(400);`],
  },
  {
    comments: "Dashboard parameters",
    ID: 1112,
    queries: [
      `CREATE TABLE [dbo].[Dashboard_Master](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](50) NULL,
	[Branch] [varchar](50) NULL,
	[amount] [decimal](10, 2) NULL,
	[validfrom] [date] NULL,
	[validTo] [date] NULL,
	[Created_At] [datetime2](7) NULL,
	[CREATED_BY] [varchar](200) NULL,
	[ValidFrom1] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo1] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom1], [ValidTo1])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Dashboard_Master_Hst])
)
ALTER TABLE [dbo].[Dashboard_Master] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Dashboard_Master] ADD  DEFAULT (getdate()) FOR [ValidFrom1]

`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1113,
    queries: [
      `alter table employeemaster add [PAN_CARD_VER] [bit] NULL,
      [AADHAR_CARD_VER] [bit] NULL,
      [DRIVING_VER] [bit] NULL,
      [PASSPORT_VER] [bit] NULL,
      [RESIGNATION_SUBMISSION_DATE] [date] NULL,
      [REASON_FOR_RESIGNATION] [nvarchar](500) NULL,
      [TEN_LEAVE_DATE] [date] NULL,
      [SEPERATIONREMARKS] [nvarchar](500) NULL,
      [SEPARATION_MODE] [nvarchar](10) NULL,
      [DATE_OF_SETTLEMENT] [date] NULL,
      [INTERVIEWREMAKS] [nvarchar](500) NULL,
      [DATE_OF_EXIT_INTERVIEW] [date] NULL,
      [EXP_IN_YEAR] [nvarchar](10) NULL`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1114,
    queries: [
      `drop procedure GetEmployeeLocation`,
      `CREATE PROCEDURE GetEmployeeLocation 
				        @EmployeeCode NVARCHAR(50),    
                @Latitude VARCHAR(20),    
                @Longitude VARCHAR(20)    
            AS    
            BEGIN  
				DECLARE @GeoLocationStrings NVARCHAR(MAX);    
				DECLARE @Geofence GEOMETRY;    
				DECLARE @Geofence_concat VARCHAR(300);    
				DECLARE @Usergeofence VARCHAR(5);  
				DECLARE @LocationFound BIT = 0;

				-- Check if the user has the right to apply from anywhere
    
				DECLARE @Permission NVARCHAR(5);  
				-- Check user permissions
				SELECT @Permission = COALESCE((
					SELECT TOP 1 
						CASE 
							WHEN Optn_Name = '1.1.1.2' THEN 'ALL'
							WHEN Optn_Name = '1.1.1.1' THEN 'USER'
						END
					FROM Mobile_Rights
					WHERE Emp_Code = @EmployeeCode AND Optn_Name IN ('1.1.1.1', '1.1.1.2')
				), 'ALLOW');

				-- Fetch geofences based on permissions
				IF @Permission = 'ALLOW'
				BEGIN
					-- Return 1 if no permissions are found, implying 'ALLOW'
					SELECT 1 AS Result;
					RETURN;
				END
				ELSE IF @Permission = 'ALL'
				BEGIN
					-- Fetch geofences for all locations
					SELECT @GeoLocationStrings = STRING_AGG(Spl_Rem, '|')
					FROM Misc_Mst
					WHERE Misc_Type = 85 AND Export_Type < 3;
				END
				ELSE IF @Permission = 'USER'
				BEGIN
					-- Fetch geofences only for user's assigned locations
					SELECT @GeoLocationStrings = STRING_AGG(Spl_Rem, '@')
					FROM Misc_Mst
					WHERE Misc_Code IN (
						SELECT Location 
						FROM EMPLOYEEMASTER 
						WHERE EMPCODE = @EmployeeCode AND Export_Type < 3
					)
					AND Misc_Type = 85 AND Export_Type < 3;
				END

				IF @GeoLocationStrings IS NULL    
				BEGIN    
					SELECT 'Geo location is not set for the specified locations' AS Result;    
					RETURN;    
				END    
				-- Loop through each geofence
				DECLARE @GeoString NVARCHAR(300);
				DECLARE GeoCursor CURSOR FOR 
				SELECT value 
				FROM STRING_SPLIT(@GeoLocationStrings, '|');

				OPEN GeoCursor;
				FETCH NEXT FROM GeoCursor INTO @GeoString;

				WHILE @@FETCH_STATUS = 0
				BEGIN
					-- Convert the geofence string into a POLYGON
					SET @Geofence_concat = 'POLYGON((' +     
						(SELECT STRING_AGG(    
							CONVERT(NVARCHAR, CAST(SUBSTRING(value, 1, CHARINDEX(',', value) - 1) AS DECIMAL(30, 6))) + ' ' +    
							CONVERT(NVARCHAR, CAST(SUBSTRING(value, CHARINDEX(',', value) + 1, LEN(value)) AS DECIMAL(30, 6))),     
							','    
						)     
						FROM STRING_SPLIT(@GeoString, '@')) +     
						'))';    

					SET @Geofence = GEOMETRY::STGeomFromText(@Geofence_concat, 4326);

					-- Check if the point is within the geofence
					IF @Geofence.STContains(GEOMETRY::STPointFromText('POINT(' + @Latitude + ' ' + @Longitude + ')', 4326)) = 1
					BEGIN
						SET @LocationFound = 1;
						BREAK;
					END;

					FETCH NEXT FROM GeoCursor INTO @GeoString;
				END;

				CLOSE GeoCursor;
				DEALLOCATE GeoCursor;

				-- Return the result
				IF @LocationFound = 1
					SELECT '1' AS Result;
				ELSE
					SELECT '0' AS Result;
	  END;`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1115,
    queries: [`ALTER TABLE TV_ICM_MST ADD TvDo int;`],
  },
  {
    comments: "New_dev_Code",
    ID: 1116,
    queries: [
      `CREATE TABLE [dbo].[TV_DO](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[VEH_STAT] [nvarchar](20) NULL,
	[MODEL_VARIANT] [nvarchar](100) NULL,
	[MODEL_VAR] [nvarchar](100) NULL,
	[VEHREGNO] [nvarchar](20) NULL,
	[CHAS_NO] [nvarchar](20) NULL,
	[ENGINE_NO] [nvarchar](20) NULL,
	[REG_YEAR] [nvarchar](10) NULL,
	[RC_VAL_UPTO] [smalldatetime] NULL,
	[INSU_VAL_UPTO] [smalldatetime] NULL,
	[LOAN_AMT] [money] NULL,
	[CHALLAN_AMT] [money] NULL,
	[DOC_TRF_CHRGS] [money] NULL,
	[PURCHASE_COST] [money] NULL,
	[CHALLAN_DATE] [smalldatetime] NULL,
	[REG_DATE] [smalldatetime] NULL,
	[KM_DRIVEN] [int] NULL,
	[APPR_21_CODE] [int] NULL,
	[APPR_21_STAT] [int] NULL,
	[APPR_21_REM] [nvarchar](400) NULL,
	[APPR_22_CODE] [int] NULL,
	[APPR_22_STAT] [int] NULL,
	[APPR_22_REM] [nvarchar](400) NULL,
	[APPR_23_CODE] [int] NULL,
	[APPR_23_STAT] [int] NULL,
	[APPR_23_REM] [nvarchar](400) NULL,
	[FIN_APPR_2] [int] NULL,
	[VERF_DATE_2] [smalldatetime] NULL,
	[Created_At] [datetime] NOT NULL,
	[Created_by] [varchar](100) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[Export_Type] [int] NULL,
	[LOC_CODE] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[TV_DO_Hst])
)
ALTER TABLE [dbo].[TV_DO] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[TV_DO] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },

  {
    comments: "New_dev_Code",
    ID: 1117,
    queries: [
      `CREATE TABLE [dbo].[Complaints](
          [ComplaintID] [int] IDENTITY(1,1) NOT NULL,
          [Title] [nvarchar](255) NOT NULL,
          [Description] [nvarchar](max) NOT NULL,
          [CreatedBy] [nvarchar](25) NULL,
          [DOC_PATH] [nvarchar](255) NULL,
          [DateCreated] [datetime] NULL,
          [Status] [nvarchar](50) NULL
        ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]`,
      `ALTER TABLE [dbo].[Complaints] ADD  DEFAULT (getdate()) FOR [DateCreated]`,
      `ALTER TABLE [dbo].[Complaints] ADD  DEFAULT ('Open') FOR [Status]`,
      `CREATE TABLE [dbo].[ComplaintResponse](
      [ResponseID] [int] IDENTITY(1,1) NOT NULL,
      [ComplaintID] [int] NOT NULL,
      [EmployeeID] [varchar](50) NOT NULL,
      [ResponseText] [text] NULL,
      [DateResponded] [datetime] NULL,
      [Status] [varchar](50) NULL,
    PRIMARY KEY CLUSTERED 
    (
      [ResponseID] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]`,
      `ALTER TABLE [dbo].[ComplaintResponse] ADD  DEFAULT ('Pending') FOR [Status]`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1118,
    queries: [
      `alter table Interview_sideTables alter column Percentage nvarchar(100)`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1119,
    queries: [`ALTER TABLE TV_DO ADD FIN_AMT money`],
  },
  {
    comments: "New_dev_Code",
    ID: 1120,
    queries: [`ALTER TABLE TV_DO ADD FUEL_TYPE NVARCHAR(20);`],
  },
  {
    comments: "New_dev_Code",
    ID: 1121,
    queries: [`ALTER TABLE TV_DO ADD FINANCIER_DO int;`],
  },
  {
    comments: "New_dev_Code",
    ID: 1122,
    queries: [`ALTER TABLE TV_DO ADD BUY_TYPE NVARCHAR(20);`],
  },
  {
    comments: "New_dev_Code",
    ID: 1123,
    queries: [`ALTER TABLE TV_DO ADD OWNER_COUNT int;`],
  },
  {
    comments: "New_dev_Code",
    ID: 1124,
    queries: [`ALTER TABLE TV_DO ADD RE_PAINT_STAT NVARCHAR(20);`],
  },
  {
    comments: "New_dev_Code",
    ID: 1125,
    queries: [`ALTER TABLE TV_DO ADD RE_PAINT_RMRK NVARCHAR(250);`],
  },
  {
    comments: "New_dev_Code",
    ID: 1126,
    queries: [`ALTER TABLE TV_DO ADD PARTS_STAT NVARCHAR(20);`],
  },
  {
    comments: "New_dev_Code",
    ID: 1127,
    queries: [`ALTER TABLE TV_DO ADD PARTS_RMRK NVARCHAR(250);`],
  },
  {
    comments: "New_dev_Code",
    ID: 1128,
    queries: [`ALTER TABLE TV_DO ADD REPAIR_STAT NVARCHAR(20);`],
  },
  {
    comments: "New_dev_Code",
    ID: 1129,
    queries: [`ALTER TABLE TV_DO ADD REPAIR_RMRK NVARCHAR(250);`],
  },
  {
    comments: "New_dev_Code",
    ID: 1130,
    queries: [`ALTER TABLE TV_DO ADD STEREO_STAT NVARCHAR(20);`],
  },
  {
    comments: "New_dev_Code",
    ID: 1131,
    queries: [`ALTER TABLE TV_DO ADD HANDOVER_STAT NVARCHAR(20);`],
  },
  {
    comments: "New_dev_Code",
    ID: 1132,
    queries: [`ALTER TABLE TV_DO ADD HANDOVER_PERSON NVARCHAR(100);`],
  },
  {
    comments: "New_dev_Code",
    ID: 1133,
    queries: [
      `CREATE TABLE [dbo].[Daily_Cash_Sum](
        [UID] [int] NULL,
        [Loc_code] [int] NULL,
        [user_code] [nvarchar](255) NULL,
        [Tran_Date] [date] NULL,
        [Opening_Bal] [money] NULL,
        [Today_Coll] [money] NULL,
        [Cash_to_bank] [money] NULL,
        [Cash_to_petty_cash] [money] NULL,
        [Payment_voucher] [money] NULL,
        [Closing_Bal] [money] NULL,
        [Books_Closing_Bal] [money] NULL,
        [Diffe_Bal] [money] NULL,
        [export_type] [nvarchar](255) NULL,
        [Create_at] [datetime] NULL
      ) ON [PRIMARY]`,
      `ALTER TABLE [dbo].[Daily_Cash_Sum] ADD  DEFAULT (getdate()) FOR [Create_at]`,
    ],
  },
  {
    comments: "In_Service",
    ID: 1134,
    queries: [`alter table In_Service add Service_Type varchar(10) null`],
  },
  {
    comments: "New_dev_Code",
    ID: 1135,
    queries: [
      `CREATE TABLE [dbo].[BodyShopClaim](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[VEHREGNO] [varchar](50) NULL,
	[CHASS_NO] [varchar](50) NULL,
	[ENG_NO] [varchar](75) NULL,
	[MOD_GRP] [varchar](12) NULL,
	[MOD_NAME] [varchar](12) NULL,
	[CUST_NAME] [varchar](500) NULL,
	[MOBILE] [varchar](15) NULL,
	[EMAIL] [varchar](250) NULL,
	[EXP_DELV_DATE] [smalldatetime] NULL,
	[SERV_ADV] [varchar](200) NULL,
	[MECHANIC] [varchar](200) NULL,
	[CLAIM_NO] [varchar](50) NULL,
	[CLAIM_SAN_AMT] [decimal](19, 4) NULL,
	[SURV_NAME] [varchar](200) NULL,
	[SURV_MOB_NO] [varchar](15) NULL,
	[FILE_SUB_DATE] [smalldatetime] NULL,
	[RES_DELAY] [varchar](2000) NULL,
	[RPT_RECD_DATE] [smalldatetime] NULL,
	[UTR_DATE] [datetime] NULL,
	[RPT_DELAY_RES] [varchar](2000) NULL,
	[BI_INV] [varchar](50) NULL,
	[BR_INV] [varchar](50) NULL,
	[LOC_CODE] [int] NULL,
	[INS_COMP] [int] NULL,
	[INS_REC_AMT] [decimal](19, 4) NULL,
	[CUST_REC_AMT] [decimal](19, 4) NULL,
	[INS_DO_NO] [varchar](50) NULL,
	[UTR_NO] [int] NULL,
	[VER_DATE] [smalldatetime] NULL,
	[isVerified] [int] NULL,
	[VER_REM] [varchar](400) NULL,
	[PART_EST] [money] NULL,
	[LAB_EST] [money] NULL,
	[TOT_EST] [money] NULL,
	[ACT_AMT_INC] [money] NULL,
	[GST_AMT_INC] [money] NULL,
	[TDS_AMT_INC] [money] NULL,
	[DISC_AMT_INC] [money] NULL,
	[PENDING_INSU] [money] NULL,
	[ACT_AMT_CUST] [money] NULL,
	[PENDING_CUST] [money] NULL,
	[Created_At] [datetime] NOT NULL,
	[Created_by] [varchar](100) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[MAN_APPR_STAT] [int] NULL,
	[MAN_APPR_REM] [varchar](250) NULL,
	[MAN_APPR_DATE] [smalldatetime] NULL,
	[ACC_APPR_CODE] [int] NULL,
	[BSM_APPR_CODE] [int] NULL,
	[JOB_STATUS] [int] NULL,
	[CLAIM_TYPE] [nvarchar](10) NULL,
	[JOB_CARD_NO] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[BodyShopClaim_Hst])
)`,
      `ALTER TABLE [dbo].[BodyShopClaim] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[BodyShopClaim] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1136,
    queries: [
      `CREATE TABLE [dbo].[DmsImportBodyShop](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[SrlNo] [nvarchar](255) NULL,
	[DealerName] [nvarchar](255) NULL,
	[DealerCity] [nvarchar](255) NULL,
	[Location] [nvarchar](255) NULL,
	[JobCardNo] [nvarchar](50) NULL,
	[JCDateTime] [datetime] NULL,
	[ServiceType] [nvarchar](50) NULL,
	[RepeatRevisit] [nvarchar](50) NULL,
	[CustomerName] [nvarchar](255) NULL,
	[Phone] [nvarchar](50) NULL,
	[MobileNo] [nvarchar](50) NULL,
	[CustomerCatg] [nvarchar](50) NULL,
	[Psf_status] [nvarchar](255) NULL,
	[RegistrationNo] [nvarchar](50) NULL,
	[CHASSIS] [nvarchar](50) NULL,
	[ENGINENUM] [nvarchar](50) NULL,
	[Color] [nvarchar](50) NULL,
	[Variant] [nvarchar](100) NULL,
	[Model] [nvarchar](100) NULL,
	[Mi_yn] [nvarchar](1) NULL,
	[SaleDate] [datetime] NULL,
	[Group] [nvarchar](50) NULL,
	[SA] [nvarchar](255) NULL,
	[Technician] [nvarchar](255) NULL,
	[CircularNo] [nvarchar](50) NULL,
	[Mileage] [nvarchar](255) NULL,
	[EstLabAmt] [nvarchar](255) NULL,
	[EstPartAmt] [nvarchar](255) NULL,
	[PromisedDt] [datetime] NULL,
	[RevPromisedDt] [datetime] NULL,
	[ReadyDateTime] [datetime] NULL,
	[RevEstPartAmt] [nvarchar](255) NULL,
	[RevEstLabAmt] [nvarchar](255) NULL,
	[JCSource] [nvarchar](50) NULL,
	[App_sent_date] [datetime] NULL,
	[App_REJ_date] [datetime] NULL,
	[ApprovalStatus] [nvarchar](255) NULL,
	[CustRemarks] [nvarchar](max) NULL,
	[DlrRemarks] [nvarchar](max) NULL,
	[Status] [nvarchar](100) NULL,
	[BillNo] [nvarchar](50) NULL,
	[BillDate] [datetime] NULL,
	[LabourAmt] [nvarchar](255) NULL,
	[PartAmt] [nvarchar](255) NULL,
	[PickupRequired] [nvarchar](10) NULL,
	[PickupDate] [datetime] NULL,
	[PickupLocation] [nvarchar](255) NULL,
	[BillAmount] [nvarchar](255) NULL,
	[Address1] [nvarchar](255) NULL,
	[Address2] [nvarchar](255) NULL,
	[Address3] [nvarchar](255) NULL,
	[City] [nvarchar](100) NULL,
	[Pin] [nvarchar](255) NULL,
	[Dob] [datetime] NULL,
	[DOA] [datetime] NULL,
	[Email] [nvarchar](255) NULL,
	[CHKIN_DT] [datetime] NULL,
	[CHKOUT_DT] [datetime] NULL,
	[Created_At] [datetime] NOT NULL,
	[Created_by] [varchar](100) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[Loc_Code] [int] NULL,
	[ImportDate] [smalldatetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[DmsImportBodyShop_Hst])
)`,
      `ALTER TABLE [dbo].[DmsImportBodyShop] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[DmsImportBodyShop] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1137,
    queries: [
      `CREATE TABLE [dbo].[WA_HST_WEB](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[User_Code] [int] NULL,
	[Temp_Name] [nvarchar](500) NULL,
	[Mobile_No] [nvarchar](14) NULL,
	[Created_At] [datetime] NOT NULL,
	[Created_by] [varchar](200) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[TRAN_ID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[WA_HST_WEB_Hst])
)`,
      `ALTER TABLE [dbo].[WA_HST_WEB] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[WA_HST_WEB] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1138,
    queries: [
      `ALTER TABLE InventoryItems ADD PurchasePostLedg [nvarchar](10);`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1139,
    queries: [`ALTER TABLE InventoryItems ADD SalePostLedg [nvarchar](10);`],
  },
  {
    comments: "New_dev_Code",
    ID: 1140,
    queries: [
      `CREATE TABLE [dbo].[DocketMst](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[BOOKING_ID] [varchar](20) NOT NULL,
	[BOOKING_DATE] [smalldatetime] NULL,
	[MODEL_VAR] [varchar](255) NULL,
	[MODEL_COL] [varchar](255) NULL,
	[CUST_NAME] [varchar](255) NULL,
	[MOD_NAME] [varchar](255) NULL,
	[CUST_MOB] [varchar](15) NULL,
	[ALOT_CHAS] [varchar](20) NULL,
	[ENG_NO] [varchar](20) NULL,
	[ALOT_MOD_VAR] [varchar](255) NULL,
	[ALOT_COLOR] [varchar](255) NULL,
	[SALE_INV] [varchar](20) NULL,
	[SALE_INV_AMT] [money] NULL,
	[MSR_NO] [varchar](20) NULL,
	[MSR_AMT] [money] NULL,
	[EW_NO] [varchar](20) NULL,
	[EW_AMT] [money] NULL,
	[CCP_NO] [varchar](20) NULL,
	[CCP_AMT] [money] NULL,
	[FASTAG_NO] [varchar](20) NULL,
	[FASTAG_AMT] [money] NULL,
	[INS_COMP] [int] NULL,
	[INC_POLICY_NO] [varchar](20) NULL,
	[INC_POLICY_AMT] [money] NULL,
	[INC_POLICY_DATE] [smalldatetime] NULL,
	[MGA_YN] [varchar](3) NULL,
	[MGA_PROM_AMT] [money] NULL,
	[MGA_TOTAL_AMT] [money] NULL,
	[FIN_NAME] [varchar](20) NULL,
	[FIN_TYPE] [varchar](50) NULL,
	[FIN_AMT] [money] NULL,
	[GP_SEQ] [varchar](20) NULL,
	[OLD_CAR_CUST] [varchar](255) NULL,
	[OLD_CAR_REG_NO] [varchar](20) NULL,
	[OLD_CAR_PUR_COST] [money] NULL,
	[EXCH_BONUS] [money] NULL,
	[LOC_CODE] [int] NULL,
	[DSE_FLAG] [int] NULL,
	[EDP_FLAG] [int] NULL,
	[TV_FLAG] [int] NULL,
	[INSU_FLAG] [int] NULL,
	[MGA_FLAG] [int] NULL,
	[FIN_FLAG] [int] NULL,
	[ACNT_FLAG] [int] NULL,
	[QM_FLAG] [int] NULL,
	[Created_by] [varchar](100) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[DocketVerified] [int] NULL,
	[VER_CODE] [int] NULL,
	[VER_REM] [nvarchar](500) NULL,
	[VER_DATE] [smalldatetime] NULL,
	[DSE_CODE] [int] NULL,
	[EDP_CODE] [int] NULL,
	[TV_CODE] [int] NULL,
	[INSU_CODE] [int] NULL,
	[MGA_CODE] [int] NULL,
	[FIN_CODE] [int] NULL,
	[ACNT_CODE] [int] NULL,
	[QM_CODE] [int] NULL,
	[EXCH_YN] [nvarchar](10) NULL,
	[EXP_DOWN_PYMT] [money] NULL,
	[DSE_REM] [nvarchar](1000) NULL,
	[EXP_FIN_NAME] [int] NULL,
	[EXP_DEL_DATE] [smalldatetime] NULL,
	[RtoNocCheck] [int] NULL,
	[BankNocCheck] [int] NULL,
	[CustIdCheck] [int] NULL,
	[OldCarInsuCheck] [int] NULL,
	[OldCarRcCheck] [int] NULL,
	[EXP_FIN_AMT] [money] NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[DocketMst_Hst])
)`,
      `ALTER TABLE [dbo].[DocketMst] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[DocketMst] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "Insurance",
    ID: 1141,
    queries: [
      `CREATE TABLE [dbo].[Insu_Entry](
	[SRNo] [int] IDENTITY(1,1) NOT NULL,
	[Policy_No] [nvarchar](50) NULL,
	[CRE_NAME] [nvarchar](50) NULL,
	[Customer_Name] [nvarchar](100) NULL,
	[Policy_Due] [datetime2](7) NULL,
	[Registration_No] [nvarchar](30) NULL,
	[Engine_No] [nvarchar](20) NULL,
	[Chassis_No] [nvarchar](20) NULL,
	[Year_Manufacture] [nvarchar](10) NULL,
	[Sub_Model] [varchar](200) NULL,
	[Address1] [nvarchar](200) NULL,
	[Address2] [nvarchar](200) NULL,
	[Address3] [nvarchar](200) NULL,
	[Cust_City] [nvarchar](50) NULL,
	[PinCode] [nvarchar](10) NULL,
	[Phone_No] [varchar](50) NULL,
	[MobileNo] [varchar](200) NULL,
	[Policy_Ren_Type] [nvarchar](50) NULL,
	[Policy_Sub_Type] [varchar](200) NULL,
	[Dealer_Code] [nvarchar](10) NULL,
	[TeleCaller] [nvarchar](25) NULL,
	[Field_Executive] [nvarchar](100) NULL,
	[FollowUpDate] [date] NULL,
	[FollowUpTime] [varchar](20) NULL,
	[Status] [nvarchar](20) NULL,
	[Lost_Remark] [nvarchar](100) NULL,
	[Premium] [nvarchar](50) NULL,
	[Discount] [nvarchar](50) NULL,
	[With_Policy] [nvarchar](2) NULL,
	[Claim_Coupon] [nvarchar](2) NULL,
	[Washing_Coupon] [nvarchar](2) NULL,
	[Policy_Issued_Date] [date] NULL,
	[Policy_Dispatch_Date] [date] NULL,
	[Direct_policy_issued] [nvarchar](2) NULL,
	[Format_No] [nvarchar](50) NULL,
	[Cheque_No] [nvarchar](50) NULL,
	[Cheque_Date] [date] NULL,
	[Bank_Name] [nvarchar](50) NULL,
	[Mode_Of_Payment] [nvarchar](50) NULL,
	[Favour_Of] [nvarchar](30) NULL,
	[Coupon_No] [nvarchar](30) NULL,
	[Last_Expiry_date] [date] NULL,
	[Proposal_No] [nvarchar](30) NULL,
	[Delivery_Executive] [nvarchar](30) NULL,
	[Delivery_Date] [date] NULL,
	[Delivered] [nvarchar](2) NULL,
	[Conveyance_Applicable] [nvarchar](10) NULL,
	[Created_By] [nvarchar](30) NOT NULL,
	[Created_At] [datetime] NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[Due_Date] [date] NULL,
	[Cre_Code] [varchar](50) NULL,
	[Act_Delivery_Date] [datetime] NULL,
	[Delv_Remark] [varchar](200) NULL,
	[Payment_Status] [varchar](5) NULL,
	[loc_code] [varchar](30) NULL,
	[Delivery_Copy] [varchar](100) NULL,
	[uploaded_document] [varchar](100) NULL,
	[Insu_Comp] [varchar](100) NULL,
	[Payment_Reconciliation] [varchar](10) NULL,
	[Reconciliation_Instrument_No] [varchar](20) NULL,
	[Reconciliation_Instrument_Drawn_On] [varchar](50) NULL,
	[Reconciliation_Instrument_Date] [varchar](50) NULL,
	[Reconciliation_Instrument_Amount] [varchar](50) NULL,
	[Web_Policy] [varchar](10) NULL,
	[LeadDate] [datetime2](7) NULL,
	[Lead] [int] NULL,
	[NewPolicy_No] [varchar](50) NULL,
	[CancleRemark] [varchar](200) NULL,
	[Remark] [varchar](200) NULL,
	[Location] [varchar](10) NULL,
	[LastUpdatedBy] [varchar](100) NULL,
	[LastUpdatedDate] [datetime2](7) NULL,
	[Closed_By] [varchar](50) NULL,
	[ClosedDate] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[SRNo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Insu_Entry_hst])
)
ALTER TABLE [dbo].[Insu_Entry] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `
CREATE TABLE [dbo].[CRE_TARGETS](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[CRE_CODE] [varchar](100) NULL,
	[MONTH] [nvarchar](10) NULL,
	[YEAR] [nvarchar](10) NULL,
	[TARGET] [int] NULL,
	[Created_At] [datetime] NULL,
	[Created_by] [varchar](100) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[CRE_TARGETS_Hst])
)
ALTER TABLE [dbo].[CRE_TARGETS] ADD  DEFAULT (getdate()) FOR [Created_At]`,
    ],
  },
  {
    comments: "Discount Offers 3",
    ID: 1141,
    queries: [
      `
   alter table Discount_OFfers add [Channel] [varchar](20) NULL
	alter table Discount_OFfers add [Year] [varchar](100) NULL
	alter table Discount_OFfers add [Branch] [varchar](200) NULL
	alter table Discount_OFfers add [Rips] [float] NULL`,
    ],
  },
  {
    comments: "Deal sheet",
    ID: 1141,
    queries: [
      `
   CREATE TABLE [dbo].[Deal_Sheet](
	[tran_id] [int] IDENTITY(1,1) NOT NULL,
	[Req_Date] [datetime2](7) NULL,
	[Customer_Name] [varchar](100) NULL,
	[Mobile_No] [varchar](20) NULL,
	[Email] [varchar](100) NULL,
	[Model] [varchar](50) NULL,
	[Variant] [varchar](50) NULL,
	[Color] [varchar](50) NULL,
	[vehicle_type] [varchar](50) NULL,
	[Customer_Type_Broker] [varchar](50) NULL,
	[MFG_Year] [float] NULL,
	[Booking_Date] [date] NULL,
	[Aadhar_No] [varchar](20) NULL,
	[PAN_No] [varchar](20) NULL,
	[GST_No] [varchar](20) NULL,
	[Address] [varchar](100) NULL,
	[price] [float] NULL,
	[Finance_Type] [varchar](50) NULL,
	[Loan_Amount] [float] NULL,
	[Old_Vehicle] [varchar](20) NULL,
	[Old_Vehicle_Amount] [float] NULL,
	[RTO] [varchar](20) NULL,
	[RTO_Amount] [varchar](20) NULL,
	[RTO_Fency_Number] [float] NULL,
	[Insurance] [varchar](20) NULL,
	[Insurance_Type] [varchar](20) NULL,
	[Preferred_Insurance_Partner] [varchar](100) NULL,
	[Insurance_Amount] [float] NULL,
	[Municipal_Tax] [varchar](20) NULL,
	[Municipal_Tax_Amount] [float] NULL,
	[MGA] [varchar](20) NULL,
	[MGA_Amount] [float] NULL,
	[EW] [varchar](50) NULL,
	[EW_Amount] [float] NULL,
	[Ccp] [varchar](20) NULL,
	[Ccp_Amount] [float] NULL,
	[MCP] [varchar](20) NULL,
	[MCP_Amount] [float] NULL,
	[Loyalty] [varchar](20) NULL,
	[Loyalty_Amount] [float] NULL,
	[FASTAG] [varchar](20) NULL,
	[FASTAG_Amount] [float] NULL,
	[VAS] [varchar](20) NULL,
	[VAS_Amount] [float] NULL,
	[MSSF] [varchar](20) NULL,
	[Tcs] [float] NULL,
	[Consumer] [float] NULL,
	[Corporate] [float] NULL,
	[Exchange] [float] NULL,
	[Loan_Amount_Discount] [float] NULL,
	[Insurance_Amount_Discount] [float] NULL,
	[MGA_Amount_Discount] [float] NULL,
	[EW_Amount_Discount] [float] NULL,
	[Ccp_Amount_Discount] [float] NULL,
	[MCP_Amount_Discount] [float] NULL,
	[VAS_Amount_Discount] [float] NULL,
	[Broker_Discount] [float] NULL,
	[OnRoad_Price] [float] NULL,
	[Max_discount] [float] NULL,
	[Dise_Amt] [float] NULL,
	[Approved_amt] [float] NULL,
	[Location] [varchar](10) NULL,
	[srm] [varchar](20) NULL,
	[Appr_1_Code] [varchar](100) NULL,
	[Appr_1_Stat] [tinyint] NULL,
	[Appr_1_Date] [datetime2](7) NULL,
	[Appr_1_Rem] [varchar](300) NULL,
	[Appr_2_Code] [varchar](100) NULL,
	[Appr_2_Stat] [tinyint] NULL,
	[Appr_2_Date] [datetime2](7) NULL,
	[Appr_2_Rem] [varchar](300) NULL,
	[Appr_3_Code] [varchar](100) NULL,
	[Appr_3_Stat] [tinyint] NULL,
	[Appr_3_Date] [datetime2](7) NULL,
	[Appr_3_Rem] [varchar](300) NULL,
	[Fin_Appr] [tinyint] NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[tran_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Deal_Sheet_Hst])
)
GO

ALTER TABLE [dbo].[Deal_Sheet] ADD  DEFAULT (getdate()) FOR [Req_Date]
ALTER TABLE [dbo].[Deal_Sheet] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Deal_Sheet] ADD  DEFAULT (getdate()) FOR [ValidFrom]
`,
      `CREATE TABLE [dbo].[Deal_Sheet_Price](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[ModelCode] [varchar](50) NULL,
	[ModelName] [varchar](255) NULL,
	[Clr] [varchar](10) NULL,
	[Price] [decimal](15, 4) NULL,
	[Insurance_1_Year] [decimal](15, 2) NULL,
	[Insurance_1_3_Year] [decimal](15, 2) NULL,
	[Permanent] [decimal](15, 2) NULL,
	[Temporary] [decimal](15, 2) NULL,
	[Fastag] [decimal](15, 2) NULL,
	[Basic] [decimal](15, 2) NULL,
	[Tcs] [decimal](15, 2) NULL,
	[MCP_Amount] [decimal](15, 2) NULL,
	[Loyalty_Amount] [decimal](15, 2) NULL,
	[Dealer_EW_Royal_Platinum] [decimal](15, 2) NULL,
	[Solitaire_6th] [decimal](15, 2) NULL,
	[Royal_Platinum_5th] [decimal](15, 2) NULL,
	[Platinum_4th] [decimal](15, 2) NULL,
	[Gold_3th] [decimal](15, 2) NULL,
	[Ccp_Amount] [decimal](15, 2) NULL,
	[Consumer] [decimal](15, 2) NULL,
	[Corporate] [decimal](15, 2) NULL,
	[Exchange] [decimal](15, 2) NULL,
	[MSSF_Amount] [decimal](15, 2) NULL,
	[Broker_Discount] [decimal](15, 2) NULL,
	[Valid_From] [date] NULL,
	[Valid_Upto] [date] NULL,
	[Municipal_Tax_1] [decimal](15, 2) NULL,
	[Municipal_Tax_2] [decimal](15, 2) NULL,
	[Municipal_Tax_3] [decimal](15, 2) NULL,
	[Municipal_Tax_4] [decimal](15, 2) NULL,
	[Municipal_Tax_5] [decimal](15, 2) NULL,
	[Loc_Code] [varchar](100) NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Deal_Sheet_Price_Hst])
)
ALTER TABLE [dbo].[Deal_Sheet_Price] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Deal_Sheet_Price] ADD  DEFAULT (getdate()) FOR [ValidFrom]
`,
      `CREATE TABLE [dbo].[DealSheet_Master](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](50) NULL,
	[Branch] [varchar](50) NULL,
	[amount] [decimal](10, 2) NULL,
	[validfrom] [date] NULL,
	[validTo] [date] NULL,
	[Created_At] [datetime2](7) NULL,
	[CREATED_BY] [varchar](200) NULL,
	[ValidFrom1] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo1] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom1], [ValidTo1])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[DealSheet_Master_Hst])
)
ALTER TABLE [dbo].[DealSheet_Master] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[DealSheet_Master] ADD  DEFAULT (getdate()) FOR [ValidFrom1]
`,
      `CREATE TABLE [dbo].[Insu_Comp](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Insurance_Company] [varchar](100) NULL,
	[Perferred] [varchar](20) NULL,
	[Valid_From] [date] NULL,
	[Valid_Upto] [date] NULL,
	[Loc_Code] [varchar](100) NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Insu_Comp_Hst])
)
ALTER TABLE [dbo].[Insu_Comp] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Insu_Comp] ADD  DEFAULT (getdate()) FOR [ValidFrom]
`,
    ],
  },
  {
    comments: "Manual getpass",
    ID: 1141,
    queries: [
      `CREATE TABLE [dbo].[Car_GetPass](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[getPassNO] [int] NULL,
	[CustDate] [date] NULL,
	[RegNo] [varchar](100) NULL,
	[CustId] [varchar](50) NULL,
	[CustName] [varchar](100) NULL,
	[FatherName] [varchar](100) NULL,
	[Address] [varchar](255) NULL,
	[EW] [bit] NULL,
	[CCP] [bit] NULL,
	[MSR] [bit] NULL,
	[MSSF] [bit] NULL,
	[RTO] [bit] NULL,
	[DRTO] [bit] NULL,
	[EXCHANGE] [bit] NULL,
	[FastagNO] [varchar](100) NULL,
	[Veh_Model] [varchar](100) NULL,
	[EngineNO] [varchar](50) NULL,
	[ChasNo] [varchar](50) NULL,
	[Color] [varchar](50) NULL,
	[Remark] [varchar](255) NULL,
	[ToolKit] [varchar](100) NULL,
	[Stepney] [varchar](100) NULL,
	[JackRod] [varchar](100) NULL,
	[FirstKit] [varchar](100) NULL,
	[Reflector] [varchar](100) NULL,
	[FireExtin] [varchar](100) NULL,
	[Speakers] [varchar](100) NULL,
	[ParcelTray] [varchar](100) NULL,
	[StereoRemote] [varchar](100) NULL,
	[CNGKIT] [varchar](100) NULL,
	[Fastag] [varchar](100) NULL,
	[loc_code] [int] NULL,
	[CREATED_BY] [varchar](200) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[Modl_Var] [varchar](20) NULL,
	[Pin] [varchar](20) NULL,
	[Pan_No] [varchar](20) NULL,
	[FIN_NAME] [varchar](20) NULL,
	[tl] [varchar](20) NULL,
	[Executive] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Car_GetPass_Hst])
)
ALTER TABLE [dbo].[Car_GetPass] ADD  DEFAULT (getdate()) FOR [ValidFrom]
`,
    ],
  },
  {
    comments: "discount",
    ID: 1141,
    queries: [
      `alter table dise_aprvl add [Loan_Amount] [float] NULL
	alter table dise_aprvl add [Bank_Name] [varchar](100) NULL
	alter table dise_aprvl add [Preferred_Insurance] [varchar](100) NULL
	alter table dise_aprvl add [Insurance_Company] [varchar](100) NULL`,
    ],
  },
  {
    comments: "New car stock Managemant",
    ID: 1141,
    queries: [
      `alter table NewCar_AuditLogs add [Remark] [nvarchar](255) NULL
	alter table NewCar_AuditLogs add [Type] [varchar](10) NULL
	alter table NewCar_AuditLogs add [status] [varchar](10) NULL
	alter table NewCar_AuditLogs add [Location] [varchar](10) NULL`,
      `alter table [NewCar_StockAudit] add [Type] [varchar](10) NULL
	alter table [NewCar_StockAudit] add [status] [varchar](10) NULL`,
      `CREATE TABLE [dbo].[CHAS_TRANSIT](
	[Tran_Id] [int] NOT NULL,
	[CHAS_ID] [int] NULL,
	[TRAN_TYPE] [int] NULL,
	[Tran_Date] [date] NULL,
	[Tran_Amt] [money] NULL,
	[Asset_Ledg] [int] NULL,
	[Income_Ledg] [int] NULL,
	[Loc_Code] [int] NULL,
	[Export_Type] [int] NULL,
	[Item_Type] [int] NULL,
	[Item_Seq] [int] NULL
) ON [PRIMARY]
GO`,
      `alter table CHAS_MST add [Int_Location] [varchar](20) NULL`,
    ],
  },
  {
    comments: "Chas Alot",
    ID: 1141,
    queries: [
      `CREATE TABLE [dbo].[Chas_Alot](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[GD_FDI_ID] [int] NULL,
	[Booking_ID] [nvarchar](50) NULL,
	[CHAS_ID] [int] NULL,
	[Alottment_Rem] [nvarchar](500) NULL,
	[EMP_CODE] [nvarchar](20) NULL,
	[DMS_CODE] [nvarchar](20) NULL,
	[DE_ALOT_DMS_CODE] [nvarchar](20) NULL,
	[DeAlot_Res] [nvarchar](500) NULL,
	[DeAlot_Date] [smalldatetime] NULL,
	[Appr_1_Code] [nvarchar](20) NULL,
	[Appr_2_Code] [nvarchar](20) NULL,
	[Appr_3_Code] [nvarchar](20) NULL,
	[Appr_1_Stat] [int] NULL,
	[Appr_2_Stat] [int] NULL,
	[Appr_3_Stat] [int] NULL,
	[Appr_1_Rem] [nvarchar](250) NULL,
	[Appr_2_Rem] [nvarchar](250) NULL,
	[Appr_3_Rem] [nvarchar](250) NULL,
	[Appr_1_Date] [smalldatetime] NULL,
	[Appr_2_Date] [smalldatetime] NULL,
	[Appr_3_Date] [smalldatetime] NULL,
	[Fin_Appr_Stat] [int] NULL,
	[LOC_CODE] [int] NULL,
	[Export_Type] [int] NULL,
	[Created_At] [datetime] NOT NULL,
	[Created_by] [varchar](100) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Chas_Alot_Hst])
)
ALTER TABLE [dbo].[Chas_Alot] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Chas_Alot] ADD  DEFAULT (getdate()) FOR [ValidFrom]
`,
      `CREATE TABLE [dbo].[Chas_Alot_UnAppr](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[GD_FDI_ID] [int] NULL,
	[Booking_ID] [nvarchar](50) NULL,
	[CHAS_ID] [int] NULL,
	[Alottment_Rem] [nvarchar](500) NULL,
	[DMS_CODE] [nvarchar](20) NULL,
	[Appr_1_Code] [nvarchar](20) NULL,
	[Appr_2_Code] [nvarchar](20) NULL,
	[Appr_3_Code] [nvarchar](20) NULL,
	[Appr_1_Stat] [int] NULL,
	[Appr_2_Stat] [int] NULL,
	[Appr_3_Stat] [int] NULL,
	[Appr_1_Rem] [nvarchar](250) NULL,
	[Appr_2_Rem] [nvarchar](250) NULL,
	[Appr_3_Rem] [nvarchar](250) NULL,
	[Appr_1_Date] [smalldatetime] NULL,
	[Appr_2_Date] [smalldatetime] NULL,
	[Appr_3_Date] [smalldatetime] NULL,
	[Fin_Appr_Stat] [int] NULL,
	[LOC_CODE] [int] NULL,
	[Export_Type] [int] NULL,
	[Created_At] [datetime] NOT NULL,
	[Created_by] [varchar](100) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[EMP_CODE] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Chas_Alot_UnAppr_Hst])
)
ALTER TABLE [dbo].[Chas_Alot_UnAppr] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Chas_Alot_UnAppr] ADD  DEFAULT (getdate()) FOR [ValidFrom]
`,
    ],
  },
  {
    comments: "Demo_Cat_Gatepass",
    ID: 1142,
    queries: [
      `ALTER TABLE demo_car_gatepass ALTER COLUMN [ACT_IN_TIME] DATETIME NULL`,
      `ALTER TABLE demo_car_gatepass ALTER COLUMN [ACT_OUT_TIME] DATETIME NULL;`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1143,
    queries: [
      ` alter table pot_cust add [created_at] datetime`,
      `ALTER TABLE [dbo].[POT_CUST] ADD  DEFAULT (getdate()) FOR [created_at]`,
    ],
  },
  {
    comments: "FuelSlip",
    ID: 1144,
    queries: [` ALTER TABLE FuelSlip ADD CURR_ODO_KM INT`],
  },
  {
    comments: "New_dev_Code",
    ID: 1145,
    queries: [
      `alter table Booking_Refund add Appr_1_date datetime;`,
      `alter table Booking_Refund add Appr_2_date datetime;`,
      `alter table Booking_Refund add Appr_3_date datetime;`,
    ],
  },
  {
    comments: "AutoWheels",
    ID: 1146,
    queries: [
      `CREATE TABLE [dbo].[Honda_AutoWheels](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[NetworkType] [varchar](50) NULL,
	[NetworkCode] [varchar](50) NULL,
	[NetworkName] [varchar](255) NULL,
	[InvoiceDate] [datetime] NULL,
	[InvoiceNumber] [varchar](50) NULL,
	[ReferenceNo] [varchar](50) NULL,
	[CustomerName] [varchar](255) NULL,
	[CustomerMobile] [varchar](15) NULL,
	[CustomerState] [varchar](50) NULL,
	[CustomerStateCode] [varchar](10) NULL,
	[AccountName] [varchar](255) NULL,
	[AccountMobile] [varchar](15) NULL,
	[AccountState] [varchar](50) NULL,
	[AccountStateCode] [varchar](10) NULL,
	[AccountGSTIN] [varchar](50) NULL,
	[AccountUIN] [varchar](50) NULL,
	[OrderType] [varchar](50) NULL,
	[PartCategory] [varchar](50) NULL,
	[PartLabourNumber] [varchar](50) NULL,
	[PartLabourDescription] [varchar](255) NULL,
	[HSNSACCode] [varchar](50) NULL,
	[QTYShipped] [varchar](50) NULL,
	[BasicPrice] [decimal](10, 2) NULL,
	[TotalDiscount] [decimal](10, 2) NULL,
	[TaxableAmount] [decimal](10, 2) NULL,
	[CGSTAmount] [decimal](10, 2) NULL,
	[CGSTRate] [varchar](50) NULL,
	[SGSTAmount] [decimal](10, 2) NULL,
	[SGSTRate] [varchar](50) NULL,
	[IGSTAmount] [decimal](10, 2) NULL,
	[IGSTRate] [varchar](50) NULL,
	[UTGSTAmount] [decimal](10, 2) NULL,
	[UTGSTRate] [varchar](50) NULL,
	[TotalTax] [decimal](10, 2) NULL,
	[LineItemInvoiceAmount] [decimal](10, 2) NULL,
	[JobCardNo] [varchar](50) NULL,
	[VehicleNo] [varchar](50) NULL,
	[LedgerName] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[Created_by] [varchar](30) NULL,
	[Location] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Honda_AutoWheels_Hst])
)
ALTER TABLE [dbo].[Honda_AutoWheels] ADD  DEFAULT (getdate()) FOR [Created_At]`,
    ],
  },
  {
    comments: "manual getpass",
    ID: 1147,
    queries: [`alter table Car_GetPass alter column FastagNO bit null`],
  },
  {
    comments: "In_Service",
    ID: 1148,
    queries: [
      `ALTER TABLE In_Service ADD Vehicle_InBy varchar(10) null`,
      `ALTER TABLE In_Service ADD Driver_Name varchar(100) null`,
      `ALTER TABLE In_Service ADD From_Branch varchar(50) null`,
      `ALTER TABLE Pick_Drop_Collection ADD To_Branch varchar(50) null`,
    ],
  },
  {
    comments: "Pick_Drop_Collection",
    ID: 1149,
    queries: [
      `ALTER TABLE Pick_Drop_Collection ADD To_Branch varchar(50) null`,
    ],
  },
  {
    comments: "Payment_Tracker",
    ID: 1150,
    queries: [`alter table Car_GetPass alter column FastagNO bit null`],
  },
  {
    comments: "Honda_AutoWheels",
    ID: 1151,
    queries: [
      `CREATE TABLE [dbo].[Honda_AutoWheels](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[NetworkType] [varchar](50) NULL,
	[NetworkCode] [varchar](50) NULL,
	[NetworkName] [varchar](255) NULL,
	[InvoiceDate] [datetime] NULL,
	[InvoiceNumber] [varchar](50) NULL,
	[ReferenceNo] [varchar](50) NULL,
	[CustomerName] [varchar](255) NULL,
	[CustomerMobile] [varchar](15) NULL,
	[CustomerState] [varchar](50) NULL,
	[CustomerStateCode] [varchar](10) NULL,
	[AccountName] [varchar](255) NULL,
	[AccountMobile] [varchar](15) NULL,
	[AccountState] [varchar](50) NULL,
	[AccountStateCode] [varchar](10) NULL,
	[AccountGSTIN] [varchar](50) NULL,
	[AccountUIN] [varchar](50) NULL,
	[OrderType] [varchar](50) NULL,
	[PartCategory] [varchar](50) NULL,
	[PartLabourNumber] [varchar](50) NULL,
	[PartLabourDescription] [varchar](255) NULL,
	[HSNSACCode] [varchar](50) NULL,
	[QTYShipped] [varchar](50) NULL,
	[BasicPrice] [decimal](10, 2) NULL,
	[TotalDiscount] [decimal](10, 2) NULL,
	[TaxableAmount] [decimal](10, 2) NULL,
	[CGSTAmount] [decimal](10, 2) NULL,
	[CGSTRate] [varchar](50) NULL,
	[SGSTAmount] [decimal](10, 2) NULL,
	[SGSTRate] [varchar](50) NULL,
	[IGSTAmount] [decimal](10, 2) NULL,
	[IGSTRate] [varchar](50) NULL,
	[UTGSTAmount] [decimal](10, 2) NULL,
	[UTGSTRate] [varchar](50) NULL,
	[TotalTax] [decimal](10, 2) NULL,
	[LineItemInvoiceAmount] [decimal](10, 2) NULL,
	[JobCardNo] [varchar](50) NULL,
	[VehicleNo] [varchar](50) NULL,
	[LedgerName] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[Created_by] [varchar](30) NULL,
	[Location] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Honda_AutoWheels_Hst])
)
ALTER TABLE [dbo].[Honda_AutoWheels] ADD  DEFAULT (getdate()) FOR [Created_At]

`,
      `
CREATE TABLE [dbo].[Ew_Import](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[NetworkCode] [varchar](50) NULL,
	[NetworkName] [varchar](255) NULL,
	[CustomerName] [varchar](255) NULL,
	[CustomerMobile] [varchar](15) NULL,
	[OrderDate] [datetime] NULL,
	[ReferenceNumber] [varchar](50) NULL,
	[InvoiceNumber] [varchar](50) NULL,
	[OrderType] [varchar](50) NULL,
	[OrderSubType] [varchar](50) NULL,
	[Status] [varchar](50) NULL,
	[Comments] [varchar](100) NULL,
	[SubmittedDate] [datetime] NULL,
	[CancellationDate] [datetime] NULL,
	[BookletNumber] [varchar](100) NULL,
	[ContractStartDate] [datetime] NULL,
	[ContractEndDate] [datetime] NULL,
	[BalancePayment] [decimal](10, 2) NULL,
	[Price] [decimal](10, 2) NULL,
	[PaymentRealized] [decimal](10, 2) NULL,
	[TotalBillAmount] [decimal](10, 2) NULL,
	[CGST] [decimal](10, 2) NULL,
	[SGST] [decimal](10, 2) NULL,
	[UGST] [decimal](10, 2) NULL,
	[IGST] [decimal](10, 2) NULL,
	[CGSTPer] [decimal](10, 2) NULL,
	[SGSTPer] [decimal](10, 2) NULL,
	[UGSTPer] [decimal](10, 2) NULL,
	[IGSTPer] [decimal](10, 2) NULL,
	[ModelName] [varchar](50) NULL,
	[ModelVariant] [varchar](50) NULL,
	[HSNCode] [varchar](50) NULL,
	[SACCode] [varchar](50) NULL,
	[FrameNumber] [varchar](50) NULL,
	[EngineNumber] [varchar](50) NULL,
	[SellingDealer] [varchar](50) NULL,
	[VehicleInvoiceNumber] [varchar](50) NULL,
	[ServiceProduct] [varchar](50) NULL,
	[LedgerName] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[Created_by] [varchar](30) NULL,
	[Location] [varchar](50) NULL,
	[VehicleSaleDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Ew_Import_Hst])
)
ALTER TABLE [dbo].[Ew_Import] ADD  DEFAULT (getdate()) FOR [Created_At]

`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1152,
    queries: [
      `drop PROCEDURE UpdateOrInsertLeaveBalance`,
      `create PROCEDURE UpdateOrInsertLeaveBalance
@Emp_Code VARCHAR(50),
@Leave_Type INT,
@Leave_Type2 INT,
@Leave_Mnth INT,
@Leave_Yr int
  AS
BEGIN
          SET NOCOUNT ON;

          DECLARE @Op_Bal DECIMAL(10, 2);
          DECLARE @Gen_Lev DECIMAL(10, 2) = 0.00; -- Default value
          DECLARE @Avail_Lev DECIMAL(10, 2) = 0.00; -- Default value
          DECLARE @Cl_Bal DECIMAL(10, 2);
          DECLARE @table_avail DECIMAL(10, 2);
		  DECLARE @Prev_Mnth INT;
		  DECLARE @Prev_Yr INT;
		  
		  select @Avail_Lev = isnull(sum(cast(count_ as float)),0)  from (select (select top 1 isnull(misc_dtl3,0) from Misc_Mst where Misc_Type = 92 and Misc_Code = mipunch_reason)  as count_
		  from attendancetable where mipunch_reason in (@Leave_Type,@Leave_Type2) and emp_code = @Emp_Code 
		  and MONTH(dateoffice) = @Leave_Mnth and year(dateoffice) = @Leave_Yr and MAN_APPR = 'Y' ) as da 
		  
		  -- Calculate previous month and year
		  SET @Prev_Mnth = CASE WHEN @Leave_Mnth = 1 THEN 12 ELSE @Leave_Mnth - 1 END;
		  SET @Prev_Yr = CASE WHEN @Leave_Mnth = 1 THEN @Leave_Yr - 1 ELSE @Leave_Yr END;

          --DECLARE @Leave_Yr INT = Year(getdate());
        
          -- Check if the row exists for the current month
          IF EXISTS (SELECT 1 FROM Leave_bal
                    WHERE Emp_Code = @Emp_Code 
                      AND Leave_Type = @Leave_Type 
                      AND Leave_Mnth = @Leave_Mnth 
                      AND Leave_Yr = @Leave_Yr)
          BEGIN

              -- Get current values if row exists
              SELECT @Op_Bal = Op_Bal, 
                    @Gen_Lev = Gen_Lev, 
                    @Cl_Bal = Cl_Bal,
					@table_avail = Avail_Lev
              FROM Leave_bal
              WHERE Emp_Code = @Emp_Code 
                AND Leave_Type = @Leave_Type 
                AND Leave_Mnth = @Leave_Mnth 
                AND Leave_Yr = @Leave_Yr;

              -- Check if Cl_Bal calculation is correct
              IF @Cl_Bal <> @Op_Bal + @Gen_Lev - @Avail_Lev or @table_avail != @Avail_Lev
              BEGIN
                  -- Update Cl_Bal for current month
                  SET @Cl_Bal = @Op_Bal + @Gen_Lev - @Avail_Lev;

                  UPDATE Leave_bal
                  SET Cl_Bal = @Cl_Bal, Avail_Lev = @Avail_Lev
                  WHERE Emp_Code = @Emp_Code 
                    AND Leave_Type = @Leave_Type 
                    AND Leave_Mnth = @Leave_Mnth 
                    AND Leave_Yr = @Leave_Yr;
              END
          END
          ELSE
          BEGIN
          IF EXISTS (SELECT 1 FROM Leave_bal
                    WHERE Emp_Code = @Emp_Code 
                      AND Leave_Type = @Leave_Type 
                      AND Leave_Yr > @Leave_Yr
                      AND Leave_Mnth > @Leave_Mnth)
          BEGIN
              -- Skip insertion if a future month record exists
              PRINT 'Cannot insert previous month row as a subsequent month record already exists.';
              RETURN;
          END
              -- Insert new row for the current month if it does not exist
              -- Get previous month's Cl_Bal as the Op_Bal

              SELECT @Op_Bal = Cl_Bal
              FROM Leave_bal
              WHERE Emp_Code = @Emp_Code 
                AND Leave_Type = @Leave_Type 
                AND Leave_Mnth = @Prev_Mnth
				AND Leave_Yr = @Prev_Yr;

              IF @Op_Bal IS NULL
                  SET @Op_Bal = 0.00; -- Default to 0 if no previous month exists
		

              -- Calculate Cl_Bal for the new month
              SET @Cl_Bal = @Op_Bal + @Gen_Lev - @Avail_Lev;

              -- Insert the new row
              INSERT INTO Leave_bal (Emp_Code, Leave_Type, Leave_Mnth, Op_Bal, Gen_Lev, Avail_Lev, Cl_Bal, Leave_Yr)
              VALUES (@Emp_Code, @Leave_Type, @Leave_Mnth, @Op_Bal, @Gen_Lev, @Avail_Lev, @Cl_Bal, @Leave_Yr);
          END

          -- Propagate Cl_Bal changes to all subsequent months
          DECLARE @NextMonth INT = @Leave_Mnth + 1;
		  IF @NextMonth = 13
		  BEGIN
		  	SET @NextMonth = 1;
		  	SET @Leave_Yr = @Leave_Yr + 1;  -- Increment the year
		  END
          DECLARE @NewOp_Bal DECIMAL(10, 2) = @Cl_Bal;

          WHILE EXISTS (SELECT 1 FROM Leave_bal
                        WHERE Emp_Code = @Emp_Code 
                          AND Leave_Type = @Leave_Type 
                          AND Leave_Mnth = @NextMonth 
                          AND Leave_Yr = @Leave_Yr)
          BEGIN
              -- Update each subsequent month based on the previous month’s Cl_Bal
			  select @Avail_Lev = isnull(sum(cast(count_ as float)),0)  from (select (select top 1 isnull(misc_dtl3,0) from Misc_Mst where Misc_Type = 92 and Misc_Code = mipunch_reason)  as count_
		  from attendancetable where mipunch_reason in (@Leave_Type,@Leave_Type2) and emp_code = @Emp_Code 
		  and MONTH(dateoffice) = @NextMonth and year(dateoffice) = @Leave_Yr and MAN_APPR = 'Y' ) as da 

              UPDATE Leave_bal
              SET Op_Bal = @NewOp_Bal,
                  Cl_Bal = @NewOp_Bal + Gen_Lev - @Avail_Lev,
				  Avail_Lev = @Avail_Lev
              WHERE Emp_Code = @Emp_Code 
                AND Leave_Type = @Leave_Type 
                AND Leave_Mnth = @NextMonth 
                AND Leave_Yr = @Leave_Yr;

              -- Get the updated Cl_Bal for the next iteration
              SELECT @NewOp_Bal = Cl_Bal
              FROM Leave_bal
              WHERE Emp_Code = @Emp_Code 
                AND Leave_Type = @Leave_Type 
                AND Leave_Mnth = @NextMonth 
                AND Leave_Yr = @Leave_Yr;

              -- Move to the next month
              SET @NextMonth = @NextMonth + 1;
			  IF @NextMonth = 13
			  BEGIN
			  	SET @NextMonth = 1;
			  	SET @Leave_Yr = @Leave_Yr + 1;  -- Increment the year
			  END
          END
      END;`,
    ],
  },
  {
    comments: "discount",
    ID: 1153,
    queries: [
      `
alter table dise_aprvl add Year varchar(100)null`,
    ],
  },
  {
    comments: "discount Offers",
    ID: 1154,
    queries: [
      `
CREATE TABLE [dbo].[Discount_Offers](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Model_Group] [varchar](20) NULL,
	[Model_Group_Name] [varchar](200) NULL,
	[Model_Code] [varchar](20) NULL,
	[Model_Name] [varchar](200) NULL,
	[MI_Date] [date] NULL,
	[Consumer] [float] NULL,
	[Exch] [float] NULL,
	[Mssf] [float] NULL,
	[Corporate1] [float] NULL,
	[Corporate2] [float] NULL,
	[Valid_From] [date] NULL,
	[Valid_Upto] [date] NULL,
	[State] [varchar](20) NULL,
	[Region] [varchar](20) NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[MI_Date_Upto] [date] NULL,
	[MarutiEmp] [float] NULL,
	[MeriMaruti] [float] NULL,
	[scrappage] [float] NULL,
	[Channel] [varchar](20) NULL,
	[Year] [varchar](100) NULL,
	[Branch] [varchar](200) NULL,
	[Rips] [float] NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Discount_Offers_Hst])
)
ALTER TABLE [dbo].[Discount_Offers] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Discount_Offers] ADD  DEFAULT (getdate()) FOR [ValidFrom]

`,
      `CREATE TABLE [dbo].[Deal_Sheet](
	[tran_id] [int] IDENTITY(1,1) NOT NULL,
	[Req_Date] [datetime2](7) NULL,
	[Customer_Name] [varchar](100) NULL,
	[Mobile_No] [varchar](20) NULL,
	[Email] [varchar](100) NULL,
	[Model] [varchar](50) NULL,
	[Variant] [varchar](50) NULL,
	[Color] [varchar](50) NULL,
	[vehicle_type] [varchar](50) NULL,
	[Customer_Type_Broker] [varchar](50) NULL,
	[MFG_Year] [float] NULL,
	[Booking_Date] [date] NULL,
	[Aadhar_No] [varchar](20) NULL,
	[PAN_No] [varchar](20) NULL,
	[GST_No] [varchar](20) NULL,
	[Address] [varchar](100) NULL,
	[price] [float] NULL,
	[Finance_Type] [varchar](50) NULL,
	[Loan_Amount] [float] NULL,
	[Old_Vehicle] [varchar](20) NULL,
	[Old_Vehicle_Amount] [float] NULL,
	[RTO] [varchar](20) NULL,
	[RTO_Amount] [varchar](20) NULL,
	[RTO_Fency_Number] [float] NULL,
	[Insurance] [varchar](20) NULL,
	[Insurance_Type] [varchar](20) NULL,
	[Preferred_Insurance_Partner] [varchar](100) NULL,
	[Insurance_Amount] [float] NULL,
	[Municipal_Tax] [varchar](20) NULL,
	[Municipal_Tax_Amount] [float] NULL,
	[MGA] [varchar](20) NULL,
	[MGA_Amount] [float] NULL,
	[EW] [varchar](50) NULL,
	[EW_Amount] [float] NULL,
	[Ccp] [varchar](20) NULL,
	[Ccp_Amount] [float] NULL,
	[MCP] [varchar](20) NULL,
	[MCP_Amount] [float] NULL,
	[Loyalty] [varchar](20) NULL,
	[Loyalty_Amount] [float] NULL,
	[FASTAG] [varchar](20) NULL,
	[FASTAG_Amount] [float] NULL,
	[VAS] [varchar](20) NULL,
	[VAS_Amount] [float] NULL,
	[MSSF] [varchar](20) NULL,
	[Tcs] [float] NULL,
	[Consumer] [float] NULL,
	[Corporate] [float] NULL,
	[Exchange] [float] NULL,
	[Loan_Amount_Discount] [float] NULL,
	[Insurance_Amount_Discount] [float] NULL,
	[MGA_Amount_Discount] [float] NULL,
	[EW_Amount_Discount] [float] NULL,
	[Ccp_Amount_Discount] [float] NULL,
	[MCP_Amount_Discount] [float] NULL,
	[VAS_Amount_Discount] [float] NULL,
	[Broker_Discount] [float] NULL,
	[OnRoad_Price] [float] NULL,
	[Max_discount] [float] NULL,
	[Dise_Amt] [float] NULL,
	[Approved_amt] [float] NULL,
	[Location] [varchar](10) NULL,
	[srm] [varchar](20) NULL,
	[Appr_1_Code] [varchar](100) NULL,
	[Appr_1_Stat] [tinyint] NULL,
	[Appr_1_Date] [datetime2](7) NULL,
	[Appr_1_Rem] [varchar](300) NULL,
	[Appr_2_Code] [varchar](100) NULL,
	[Appr_2_Stat] [tinyint] NULL,
	[Appr_2_Date] [datetime2](7) NULL,
	[Appr_2_Rem] [varchar](300) NULL,
	[Appr_3_Code] [varchar](100) NULL,
	[Appr_3_Stat] [tinyint] NULL,
	[Appr_3_Date] [datetime2](7) NULL,
	[Appr_3_Rem] [varchar](300) NULL,
	[Fin_Appr] [tinyint] NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[tran_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Deal_Sheet_Hst])
)
ALTER TABLE [dbo].[Deal_Sheet] ADD  DEFAULT (getdate()) FOR [Req_Date]
ALTER TABLE [dbo].[Deal_Sheet] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Deal_Sheet] ADD  DEFAULT (getdate()) FOR [ValidFrom]
`,
    ],
  },
  {
    comments: "TV_DO",
    ID: 1155,
    queries: [`ALTER TABLE TV_DO ADD uploaded_document VARCHAR(100) NULL`],
  },
  {
    comments: "New_dev_Code",
    ID: 1156,
    queries: [
      `alter table attendancetable add Appr_1_date datetime;`,
      `alter table attendancetable add Appr_2_date datetime;`,
      `alter table attendancetable add Appr_3_date datetime;`,
    ],
  },
  {
    comments: "New Car Stock",
    ID: 1157,
    queries: [
      `alter table Approval_Matrix add Branch varchar(10)null`,
      `alter table Chas_Alot add Request_Branch varchar(10)Null`,
    ],
  },
  {
    comments: "MGA_Approval",
    ID: 1158,
    queries: [`alter table MGA_Approval add MGAPromisedAmt varchar(20)null`],
  },
  {
    comments: "New_dev_Code",
    ID: 1159,
    queries: [
      `drop procedure GetEmployeeLocation`,
      `CREATE PROCEDURE GetEmployeeLocation 
				        @EmployeeCode NVARCHAR(50),    
                @Latitude VARCHAR(20),    
                @Longitude VARCHAR(20)    
            AS    
            BEGIN 
				DECLARE @GeoLocationStrings NVARCHAR(MAX);    
				DECLARE @Geofence GEOMETRY;    
				DECLARE @Geofence_concat VARCHAR(300);    
				DECLARE @Usergeofence VARCHAR(5);  
				DECLARE @LocationFound BIT = 0;

				-- Check if the user has the right to apply from anywhere
    
				DECLARE @Permission NVARCHAR(5);  
				-- Check user permissions
				SELECT @Permission = COALESCE((
					SELECT TOP 1 
						CASE 
							WHEN Optn_Name = '1.1.1.2' THEN 'ALL'
							WHEN Optn_Name = '1.1.1.1' THEN 'USER'
						END
					FROM Mobile_Rights
					WHERE Emp_Code = @EmployeeCode AND Optn_Name IN ('1.1.1.1', '1.1.1.2')
				), 'ALLOW');

				-- Fetch geofences based on permissions
				IF @Permission = 'ALLOW'
				BEGIN
					-- Return 1 if no permissions are found, implying 'ALLOW'
					SELECT 1 AS Result;
					RETURN;
				END
				ELSE IF @Permission = 'ALL'
				BEGIN
					-- Fetch geofences for all locations
					SELECT @GeoLocationStrings = STRING_AGG(CAST(Spl_Rem AS NVARCHAR(MAX)), '|')
					FROM Misc_Mst
					WHERE Misc_Type = 85 AND Export_Type < 3;
				END
				ELSE IF @Permission = 'USER'
				BEGIN
					-- Fetch geofences only for user's assigned locations
					SELECT @GeoLocationStrings = STRING_AGG(CAST(Spl_Rem AS NVARCHAR(MAX)), '@')
					FROM Misc_Mst
					WHERE Misc_Code IN (
						SELECT Location 
						FROM EMPLOYEEMASTER 
						WHERE EMPCODE = @EmployeeCode AND Export_Type < 3
					)
					AND Misc_Type = 85 AND Export_Type < 3;
				END

				IF @GeoLocationStrings IS NULL    
				BEGIN    
					SELECT 'Geo location is not set for the specified locations' AS Result;    
					RETURN;    
				END    
				-- Loop through each geofence
				DECLARE @GeoString NVARCHAR(300);
				DECLARE GeoCursor CURSOR FOR 
				SELECT value 
				FROM STRING_SPLIT(@GeoLocationStrings, '|');

				OPEN GeoCursor;
				FETCH NEXT FROM GeoCursor INTO @GeoString;

				WHILE @@FETCH_STATUS = 0
				BEGIN
					-- Convert the geofence string into a POLYGON
					SET @Geofence_concat = 'POLYGON((' +     
						(SELECT STRING_AGG(    
							CONVERT(NVARCHAR, CAST(SUBSTRING(value, 1, CHARINDEX(',', value) - 1) AS DECIMAL(30, 6))) + ' ' +    
							CONVERT(NVARCHAR, CAST(SUBSTRING(value, CHARINDEX(',', value) + 1, LEN(value)) AS DECIMAL(30, 6))),     
							','    
						)     
						FROM STRING_SPLIT(@GeoString, '@')) +     
						'))';    

					SET @Geofence = GEOMETRY::STGeomFromText(@Geofence_concat, 4326);

					-- Check if the point is within the geofence
					IF @Geofence.STContains(GEOMETRY::STPointFromText('POINT(' + @Latitude + ' ' + @Longitude + ')', 4326)) = 1
					BEGIN
						SET @LocationFound = 1;
						BREAK;
					END;

					FETCH NEXT FROM GeoCursor INTO @GeoString;
				END;

				CLOSE GeoCursor;
				DEALLOCATE GeoCursor;

				-- Return the result
				IF @LocationFound = 1
					SELECT '1' AS Result;
				ELSE
					SELECT '0' AS Result;
	  END;
				`,
    ],
  },
  {
    comments: "Chas Alot",
    ID: 1160,
    queries: [
      `ALTER TABLE CHAS_ALOT ADD[Customer_Name] [varchar](100) NULL`,
      `ALTER TABLE CHAS_ALOT ADD[Booking_Date] [date] NULL`,
      `ALTER TABLE CHAS_ALOT ADD[Request_Branch] [varchar](10) NULL`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1161,
    queries: [
      `CREATE TABLE Mobile_Attendance (
              UTD int  primary key clustered identity(1,1),
                EmpCode NVARCHAR(20) NOT NULL,         -- Employee Code
                InTime smalldatetime NULL,                  -- Check-in Time
                OutTime smalldatetime NULL,                     -- Check-out Time
                DateOffice DATE NOT NULL,              -- Date of Attendance
            );`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1162,
    queries: [
      `alter table Employee_AtnStatus add Leave int`,
      `alter table Employee_AtnStatus add Leave_value float`,
    ],
  },
  {
    comments: "Honda Price List",
    ID: 1163,
    queries: [
      `CREATE TABLE [dbo].[Honda_Price_List](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[City] [varchar](50) NULL,
	[State] [varchar](50) NULL,
	[ModelSegment] [varchar](20) NULL,
	[ModelName] [varchar](200) NULL,
	[ModelCode] [varchar](20) NULL,
	[Type] [varchar](20) NULL,
	[Color] [varchar](100) NULL,
	[ModelVariant] [varchar](200) NULL,
	[HSNCode] [varchar](20) NULL,
	[ModelSerialNo] [varchar](100) NULL,
	[ExShowroomPrice] [decimal](10, 2) NULL,
	[InsuranceAmount] [decimal](10, 2) NULL,
	[RegistrationAmount] [decimal](10, 2) NULL,
	[RoadTax] [decimal](10, 2) NULL,
	[OnRoadPrice] [decimal](10, 2) NULL,
	[OtherTaxes] [decimal](10, 2) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[Created_by] [varchar](30) NULL,
	[Location] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Honda_Price_List_Hst])
)
ALTER TABLE [dbo].[Honda_Price_List] ADD  DEFAULT (getdate()) FOR [Created_At]

`,
    ],
  },
  {
    comments: "Honda AutoWheels ShowRoom",
    ID: 1164,
    queries: [
      `
alter table Honda_AutoWheels add FrameNumber varchar(50)Null`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1165,
    queries: [
      `ALTER TABLE DocketMst ADD Insurance_Mobile varchar(50) null`,
      `ALTER TABLE DocketMst ADD Insurance_Document varchar(100) null`,
      `ALTER TABLE DocketMst ADD MGA_Document varchar(100) null`,
      `ALTER TABLE DocketMst ADD Financiar_Document varchar(100) null`,
      `ALTER TABLE DocketMst ADD EmpCode varchar(20) null`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1166,
    queries: [
      `CREATE TABLE [dbo].[DocketMst_Details](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [MGA_Name] [varchar](500) NULL,
      [Quantity] [varchar](20) NOT NULL,
      [Rate] [varchar](20) NULL,
      [DocketMst_Id] [varchar](20) NULL,
      [Created_By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
    PRIMARY KEY CLUSTERED 
    (
      [UTD] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
    ) ON [PRIMARY]
    WITH
    (
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[DocketMst_Details_Hst])
    )
    
    ALTER TABLE [dbo].[DocketMst_Details] ADD  DEFAULT (getdate()) FOR [Created_At]
    
    ALTER TABLE [dbo].[DocketMst_Details] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "DocketMst",
    ID: 1167,
    queries: [`alter table DocketMst add Deal_Document VARCHAR(100) NULL;`],
  },
  {
    comments: "DocketMst",
    ID: 1168,
    queries: [`ALTER TABLE DocketMst ADD CUST_ID VARCHAR(100) NULL`],
  },
  {
    comments: "TV_ICM_MST",
    ID: 1169,
    queries: [
      `ALTER TABLE TV_ICM_MST ADD InsuStatus VARCHAR(100) NULL`,
      `ALTER TABLE TV_ICM_MST ADD OwnerStat VARCHAR(100) NULL`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1170,
    queries: [
      `CREATE TABLE [dbo].[PurchaseListImport](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [Frame] [nvarchar](250) NULL,
      [EngineNo] [nvarchar](250) NULL,
      [RegistrationNo] [nvarchar](250) NULL,
      [ModelCategory] [nvarchar](250) NULL,
      [ModelName] [nvarchar](250) NULL,
      [ModelVariant] [nvarchar](250) NULL,
      [PhysicalStatus] [nvarchar](250) NULL,
      [ProductName] [nvarchar](250) NULL,
      [WarrantyEndDate] [nvarchar](250) NULL,
      [WarrantyExpiryKm] [nvarchar](250) NULL,
      [SellingDealerName] [nvarchar](250) NULL,
      [LastServiceDealer] [nvarchar](250) NULL,
      [LastServiceDate] [nvarchar](250) NULL,
      [LastServiceKms] [nvarchar](250) NULL,
      [LastServiceDivision] [nvarchar](250) NULL,
      [NextServiceDate] [nvarchar](250) NULL,
      [PDIDone] [nvarchar](250) NULL,
      [PDIDoneDate] [nvarchar](250) NULL,
      [CustomerName] [nvarchar](250) NULL,
      [ContactNumber] [nvarchar](250) NULL,
      [AccountName] [nvarchar](250) NULL,
      [PlantCode] [nvarchar](250) NULL,
      [TransporterCode] [nvarchar](250) NULL,
      [TransporterName] [nvarchar](250) NULL,
      [SellingDealerCode] [nvarchar](250) NULL,
      [TAXABLEVALUE] [nvarchar](250) NULL,
      [HMSIInvoiceAmount] [nvarchar](250) NULL,
      [HMSILoadReferenceNo] [nvarchar](250) NULL,
      [EmissionNorms] [nvarchar](250) NULL,
      [TruckNumber] [nvarchar](250) NULL,
      [ReferenceNo] [nvarchar](250) NULL,
      [PurchaseOrderNo] [nvarchar](250) NULL,
      [PaymentAmount] [nvarchar](250) NULL,
      [DispatchDate] [nvarchar](250) NULL,
      [DestinationLocation] [nvarchar](250) NULL,
      [ModelCode] [nvarchar](250) NULL,
      [TypeCode] [nvarchar](250) NULL,
      [OrderNo] [nvarchar](250) NULL,
      [Color] [nvarchar](250) NULL,
      [ColorCode] [nvarchar](250) NULL,
      [ManufacturingDate] [nvarchar](250) NULL,
      [VehicleStatus] [nvarchar](250) NULL,
      [Remarks] [nvarchar](250) NULL,
      [HMSIInvoiceNo] [nvarchar](250) NULL,
      [InvoiceDate] [nvarchar](250) NULL,
      [InventoryLocation] [nvarchar](250) NULL,
      [SalesCertificateDate] [nvarchar](250) NULL,
      [MTOC] [nvarchar](250) NULL,
      [HSNCode] [nvarchar](250) NULL,
      [KeyNo] [nvarchar](250) NULL,
      [GRNo] [nvarchar](250) NULL,
      [GRDate] [nvarchar](250) NULL,
      [ReferenceNumber] [nvarchar](250) NULL,
      [EWStartDate] [nvarchar](250) NULL,
      [EWEndDate] [nvarchar](250) NULL,
      [AMCDealer] [nvarchar](250) NULL,
      [AMCStartDate] [nvarchar](250) NULL,
      [AMCEndDate] [nvarchar](250) NULL,
      [EHAStartDate] [nvarchar](250) NULL,
      [EHAEndDate] [nvarchar](250) NULL,
      [RSAStartDate] [nvarchar](250) NULL,
      [RSAEndDate] [nvarchar](250) NULL,
      [PickDropDealer] [nvarchar](250) NULL,
      [PickDropStartDate] [nvarchar](250) NULL,
      [PickDropEndDate] [nvarchar](250) NULL,
      [ActualDeliveryDate] [nvarchar](250) NULL,
      [LastServiceType] [nvarchar](250) NULL,
      [DealerInvoiceNo] [nvarchar](250) NULL,
      [DlrInvoiceDate] [nvarchar](250) NULL,
      [TestRideVehicle] [nvarchar](250) NULL,
      [DivisionRegion] [nvarchar](250) NULL,
      [DivisionZone] [nvarchar](250) NULL,
      [DealerCity] [nvarchar](250) NULL,
      [State] [nvarchar](250) NULL,
      [MRNDate] [nvarchar](250) NULL,
      [MissedServiceDate] [nvarchar](250) NULL,
      [NextServiceType] [nvarchar](250) NULL,
      [CurrentMainDealerCode] [nvarchar](250) NULL,
      [DispatchDealerCode] [nvarchar](250) NULL,
      [DispatchDealerName] [nvarchar](250) NULL,
      [NetDealerPrice] [nvarchar](250) NULL,
      [CreditOfGST] [nvarchar](250) NULL,
      [DealerBillingPrice] [nvarchar](250) NULL,
      [CGSTAmount] [nvarchar](250) NULL,
      [SGSTAmount] [nvarchar](250) NULL,
      [IGSTAmount] [nvarchar](250) NULL,
      [EXShowroomPrice] [nvarchar](250) NULL,
      [GSTIN] [nvarchar](250) NULL,
      [LoyaltyID] [nvarchar](250) NULL,
      [LoyaltyRegisteredPhNo] [nvarchar](250) NULL,
      [LoyaltyFlag] [nvarchar](250) NULL,
      [EnrolDate] [nvarchar](250) NULL,
      [DeEnrolDate] [nvarchar](250) NULL,
      [RecallFlag] [nvarchar](250) NULL,
      [CurrentNetworkCode] [nvarchar](250) NULL,
      [CurrentNetworkName] [nvarchar](250) NULL,
      [CustomerFlag] [nvarchar](250) NULL,
      [CustomerCategory] [nvarchar](250) NULL,
      [CurrentNetworkType] [nvarchar](250) NULL,
      [CurrentMainDealerName] [nvarchar](250) NULL,
      [PermiumAMCPeriod] [nvarchar](250) NULL,
      [EWPLUSDealer] [nvarchar](250) NULL,
      [EWPLUSStartDate] [nvarchar](250) NULL,
      [EWPLUSEndDate] [nvarchar](250) NULL,
      [DataMask] [nvarchar](250) NULL,
      [Created_At] [datetime] NOT NULL,
      [Created_by] [varchar](100) NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      [Loc_code] [int] NULL,
      [batch_id] [nvarchar](50) NULL,
        PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PurchaseListImport_Hst])
      )`,
      `ALTER TABLE [dbo].[PurchaseListImport] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE [dbo].[PurchaseListImport] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `CREATE TABLE [dbo].[WifiDetails](
        [WifiID] [int] IDENTITY(1,1) NOT NULL,
        [SSID] [nvarchar](255) NULL,
        [BSSID] [nvarchar](50) NULL,
        [Capabilities] [nvarchar](500) NULL,
        [SignalStrength] [nvarchar](200) NULL,
        [Frequency] [nvarchar](200) NULL,
        [ChannelWidth] [nvarchar](200) NULL,
        [EmpCode] [nvarchar](50) NULL,
        [BranchName] [nvarchar](255) NULL,
        [BranchCode] [nvarchar](50) NULL,
        [DeviceType] [nvarchar](50) NULL,
        [Created_date] [datetime] NULL,
        [Min_Strength_Allowed] [varchar](10) NULL,
        [Max_Strength_Allowed] [varchar](10) NULL,
        [Is_Activited] [varchar](5) NULL,
        PRIMARY KEY CLUSTERED 
        (
          [WifiID] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
        ) ON [PRIMARY]`,
      `ALTER TABLE [dbo].[WifiDetails] ADD  DEFAULT (getdate()) FOR [Created_date]`,
      `ALTER TABLE [dbo].[WifiDetails] ADD  DEFAULT ((0)) FOR [Min_Strength_Allowed]`,
      `ALTER TABLE [dbo].[WifiDetails] ADD  DEFAULT ((100)) FOR [Max_Strength_Allowed]`,
      `ALTER TABLE [dbo].[WifiDetails] ADD  DEFAULT ((1)) FOR [Is_Activited]`,
      `alter table Mobile_Attendance add
        [Wifi_SSID] [varchar](100) NULL,
        [Wifi_BSSID] [varchar](50) NULL,
        [Wifi_Signal_Strength] [varchar](10) NULL`,
      `alter table Mobile_Attendance add
        [Wifi_SSID_out] [varchar](100) NULL,
        [Wifi_BSSID_out] [varchar](50) NULL,
        [Wifi_Signal_Strength_out] [varchar](10) NULL`,
    ],
  },
  {
    comments: "TV_ICM_MST",
    ID: 1171,
    queries: [`ALTER TABLE TV_ICM_MST ADD Running_Date [date] NULL`],
  },
  {
    comments: "TV_ICM_MST",
    ID: 1172,
    queries: [
      `CREATE TABLE Expense_Budget (
        BudgetID INT IDENTITY(1,1) PRIMARY KEY, -- Unique identifier for each record
        template_id NVARCHAR(255) NOT NULL,   -- Name of the template
        Year_ INT NOT NULL,                    -- Budget year (e.g., 2024)
        AprilBudget DECIMAL(18, 2) NOT NULL,   -- Budget for April
        MayBudget DECIMAL(18, 2) NOT NULL,     -- Budget for May
        JuneBudget DECIMAL(18, 2) NOT NULL,    -- Budget for June
        JulyBudget DECIMAL(18, 2) NOT NULL,    -- Budget for July
        AugustBudget DECIMAL(18, 2) NOT NULL,  -- Budget for August
        SeptemberBudget DECIMAL(18, 2) NOT NULL, -- Budget for September
        OctoberBudget DECIMAL(18, 2) NOT NULL,   -- Budget for October
        NovemberBudget DECIMAL(18, 2) NOT NULL,  -- Budget for November
        DecemberBudget DECIMAL(18, 2) NOT NULL,  -- Budget for December
        JanuaryBudget DECIMAL(18, 2) NOT NULL,   -- Budget for January
        FebruaryBudget DECIMAL(18, 2) NOT NULL,  -- Budget for February
        MarchBudget DECIMAL(18, 2) NOT NULL,     -- Budget for March
        YearlyBudget DECIMAL(18, 2) NULL,    -- Sum of monthly budgets
        CreatedBy NVARCHAR(255) NOT NULL,        -- User who created the entry
        CreatedAt DATETIME DEFAULT GETDATE(),    -- Timestamp of record creation
        ValidFrom DATETIME2 GENERATED ALWAYS AS ROW START NOT NULL, -- System-versioning start time
        ValidTo DATETIME2 GENERATED ALWAYS AS ROW END NOT NULL,     -- System-versioning end time
        PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)                 -- Define period columns
    )
    WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.Expense_Budget_Hst));`,
    ],
  },
  {
    comments: "Doc Management",
    ID: 1173,
    queries: [
      `CREATE TABLE [dbo].[DocManage](
	[Utd] [int] IDENTITY(1,1) NOT NULL,
	[DocType] [nvarchar](100) NOT NULL,
	[RefId] [nvarchar](255) NOT NULL,
	[Keywords] [nvarchar](max) NULL,
	[OriginalName] [nvarchar](255) NOT NULL,
	[SMBPath] [nvarchar](1024) NOT NULL,
	[EmpCode] [varchar](30) NULL,
	[UploadedBy] [nvarchar](255) NULL,
	[CreatedAt] [datetime] NULL,
	[Export_Type] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[Utd] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
ALTER TABLE [dbo].[DocManage] ADD  DEFAULT (getdate()) FOR [CreatedAt]`,
      `CREATE TABLE [dbo].[EmployeeSeparation](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[EmpCode] [varchar](50) NOT NULL,
	[CreatedBy] [varchar](100) NOT NULL,
	[CreatedAt] [datetime] NULL,
	[Laft_Date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

ALTER TABLE [dbo].[EmployeeSeparation] ADD  DEFAULT (getdate()) FOR [CreatedAt]`,
      `CREATE TABLE [dbo].[EmployeeTransfers](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[EmpCode] [varchar](50) NOT NULL,
	[CurrtBranch] [int] NOT NULL,
	[TransferTo] [int] NOT NULL,
	[CreatedAt] [datetime] NULL,
	[CreatedBy] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
ALTER TABLE [dbo].[EmployeeTransfers] ADD  DEFAULT (getdate()) FOR [CreatedAt]`,
    ],
  },
  {
    comments: "TDS Calculation",
    ID: 1174,
    queries: [
      `alter table tds_calc add Tax_Slab Int Null`,
      `CREATE TABLE [dbo].[Manpower_Budget](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Budget_Type] [nvarchar](50) NULL,
	[name] [nvarchar](100) NULL,
	[value] [nvarchar](100) NULL,
	[positions] [float] NULL,
	[salary] [float] NULL,
	[Created_At] [datetime] NOT NULL,
	[Created_by] [varchar](100) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Manpower_Budget_Hst])
)
ALTER TABLE [dbo].[Manpower_Budget] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Manpower_Budget] ADD  DEFAULT (getdate()) FOR [ValidFrom]

`,
    ],
  },
  {
    comments: "Emp_Atnrun",
    ID: 1180,
    queries: [
      `CREATE TABLE [dbo].[Emp_Atnrun](
	[Emp_Code] [nvarchar](10) NULL,
	[Rerun] [int] NULL,
) ON [PRIMARY]
GO`,
    ],
  },
  {
    comments: "Emp_Ded",
    ID: 1181,
    queries: [
      `ALTER TABLE EMP_DED ADD Export_Type varchar(10) null`,
      `ALTER TABLE EMP_DED ADD Export_Date date null`,
    ],
  },
  {
    comments: "Employee apprisal",
    ID: 1182,
    queries: [
      `CREATE TABLE [dbo].[Emp_Performance_Review](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [Empcode] [varchar](20) NULL,
      [Emp_Name] [varchar](200) NULL,
      [Region] [varchar](100) NULL,
      [Location] [varchar](20) NULL,
      [Department] [varchar](200) NULL,
      [Designation] [varchar](200) NULL,
      [Gender] [varchar](100) NULL,
      [JoiningDate] [datetime2](7) NULL,
      [DOB] [datetime2](7) NULL,
      [Reporting_1] [varchar](200) NULL,
      [Reporting_2] [varchar](200) NULL,
      [Reporting_3] [varchar](200) NULL,
      [ApraisalDateFrom] [datetime2](7) NULL,
      [ApraisalDateTo] [datetime2](7) NULL,
      [LastPromotionDate] [datetime2](7) NULL,
      [TotalAbsentDays] [varchar](20) NULL,
      [TotalPresentDays] [varchar](20) NULL,
      [Attn_age_per] [varchar](50) NULL,
      [Last_Year_Rating] [varchar](50) NULL,
      [Apraisal_Cycle] [varchar](50) NULL,
      [Created_By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
      [UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Emp_Performance_Review_Hst])
)

ALTER TABLE [dbo].[Emp_Performance_Review] ADD  DEFAULT (getdate()) FOR [Created_At]

ALTER TABLE [dbo].[Emp_Performance_Review] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `CREATE TABLE [dbo].[Emp_Performance_Review_Dtl](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [ReviewUtd] [varchar](20) NULL,
      [Empcode] [varchar](20) NULL,
      [Tran_Type] [varchar](20) NULL,
      [Training_Name] [varchar](500) NULL,
      [Training_Date] [datetime2](7) NULL,
      [Award_Name] [varchar](500) NULL,
      [Award_Date] [datetime2](7) NULL,
      [Counselling_Desc] [varchar](500) NULL,
      [Counselling_Date] [datetime2](7) NULL,
      [Review_Code] [varchar](50) NULL,
      [Review_Rating] [varchar](50) NULL,
      [Created_By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
      [UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Emp_Performance_Review_Dtl_Hst])
)

ALTER TABLE [dbo].[Emp_Performance_Review_Dtl] ADD  DEFAULT (getdate()) FOR [Created_At]

ALTER TABLE [dbo].[Emp_Performance_Review_Dtl] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "Employee_Reference_Details",
    ID: 1183,
    queries: [
      `CREATE TABLE [dbo].[Employee_Reference_Details](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [CandidateName] [varchar](100) NULL,
      [Date_Of_Request] [datetime2](7) NULL,
      [CandidateAddress] [varchar](500) NULL,
      [MobileNo] [varchar](20) NULL,
      [Email] [varchar](50) NULL,
      [AadharNo] [varchar](30) NULL,
      [PanCard] [varchar](30) NULL,
      [City] [varchar](20) NULL,
      [State] [varchar](20) NULL,
      [CandidateImage] [varchar](500) NULL,
      [PositionAppliedFor] [varchar](100) NULL,
      [PreviousContactName] [varchar](100) NULL,
      [Date_Of_Reference] [datetime2](7) NULL,
      [PreviousCompanyName] [varchar](200) NULL,
      [PreviousAddress] [varchar](200) NULL,
      [ReferenceMobileNo] [varchar](20) NULL,
      [ReferenceEmail] [varchar](50) NULL,
      [RelationToCandidate] [varchar](50) NULL,
      [EmployeeStartDate] [datetime2](7) NULL,
      [EmployeeEndDate] [datetime2](7) NULL,
      [PreviousPosition] [varchar](50) NULL,
      [PreviousSalary] [varchar](50) NULL,
      [ReasonForSeperation] [varchar](500) NULL,
      [SeperationVoluntary] [varchar](10) NULL,
      [EligileForRehire] [varchar](200) NULL,
      [LengthTimeKnown] [varchar](50) NULL,
      [Strength] [varchar](500) NULL,
      [Weakness] [varchar](500) NULL,
      [Skills] [varchar](500) NULL,
      [Issues] [varchar](500) NULL,
      [LandloardName] [varchar](100) NULL,
      [LandlordAddress] [varchar](500) NULL,
      [LandlordMobileNo] [varchar](20) NULL,
      [LandlordEmail] [varchar](50) NULL,
      [MoveInDate] [datetime2](7) NULL,
      [MoveOutDate] [datetime2](7) NULL,
      [MonthlyRent] [varchar](50) NULL,
      [DidCandidate_make_Timely_Payement] [varchar](10) NULL,
      [Candidate_Complaint] [varchar](500) NULL,
      [LandlordIssues] [varchar](500) NULL,
      [DidCandidate_give_Proper_Notice] [varchar](10) NULL,
      [NewCompanyName] [varchar](200) NULL,
      [NewCompanyContactName] [varchar](100) NULL,
      [NewCompanyAddress] [varchar](500) NULL,
      [NewCompanyMobileNo] [varchar](20) NULL,
      [NewCompanyEmail] [varchar](50) NULL,
      [Created_By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      [DOB] [date] NULL,
      [Loc_code] [varchar](10) NULL,
      [IsReference] [varchar](10) NULL,
      [Attachments] [nvarchar](max) NULL,
      [IsLandLord] [varchar](10) NULL,
      [Verication_Status] [varchar](10) NULL,
      [Receipt_Date] [datetime2](7) NULL,
      [Receipt_No] [varchar](50) NULL,
      [Agency_Remark] [varchar](200) NULL,
      [Verification_Documents] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED
(
      [UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Employee_Reference_Details_Hst])
)

ALTER TABLE [dbo].[Employee_Reference_Details] ADD  DEFAULT (getdate()) FOR [Created_At]

ALTER TABLE [dbo].[Employee_Reference_Details] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "honda_autowheels",
    ID: 1184,
    queries: [
      `
alter table honda_autowheels  add FrameNumber varchar(50) null`,
    ],
  },
  {
    comments: "DemoCarMaster",
    ID: 1185,
    queries: [
      `
    ALTER TABLE DemoCarMaster ADD Department_Type varchar(50) NULL`,
    ],
  },
  {
    comments: "Demo_Car_Gatepass",
    ID: 1186,
    queries: [
      `
    ALTER TABLE Demo_Car_Gatepass ADD Department_Type varchar(20) NULL`,
    ],
  },
  {
    comments: "Demo_Car_Gatepass",
    ID: 1188,
    queries: [
      `
alter table docmanage add TableField varchar(50) NULL`,
    ],
  },
  {
    comments: "Dtl",
    ID: 1189,
    queries: [
      `
 alter table Asset_Request_Dtl add  Department varchar(10)null`,
    ],
  },
  {
    comments: "Dtl",
    ID: 1190,
    queries: [
      `
alter table Asset_Request add Quotation1 varchar(100) null`,
      `alter table Asset_Request add Quotation2 varchar(100) null`,
      `alter table Asset_Request add Quotation3 varchar(100) null`,
      `alter table Asset_Request add Quotation4 varchar(100) null`,
      `alter table Asset_Request add PrefferedQuatation varchar(10) null`,
    ],
  },
  {
    comments: "ASSETS_GROUP",
    ID: 1190,
    queries: [`ALTER TABLE ASSETS_GROUP ADD DEPARTMENT VARCHAR(20) NULL`],
  },
  {
    comments: "Ledg_RCN",
    ID: 1191,
    queries: [`ALTER TABLE Ledg_RCN ADD IsActive VARCHAR(20) NULL`],
  },
  {
    comments: "Ledg_RCN",
    ID: 1192,
    queries: [`ALTER TABLE LEDG_RCN ADD IsActive VARCHAR(20) NULL`],
  },
  {
    comments: "rto_import",
    ID: 1193,
    queries: [
      `alter table rto_import alter column VAH_OWNER varchar(200)null`,
      `alter table rto_import alter column VAH_TYPE varchar(200) null`,
      `alter table rto_import alter column VAH_VEHICLECOLOUR varchar(200)null`,
      `alter table rto_import alter column VAH_MODEL varchar(200)null
`,
    ],
  },
  {
    comments: "Consumer_Offer_MSIL",
    ID: 1194,
    queries: [
      `CREATE TABLE [dbo].[Consumer_Offer_MSIL](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Model_Code] [varchar](50) NULL,
	[Model_Name] [varchar](200) NULL,
	[Offer] [float] NULL,
	[Dealer_Share] [float] NULL,
	[MSIL_Share] [float] NULL,
	[Offer_Type] [varchar](50) NULL,
	[Location] [varchar](50) NULL,
	[region] [varchar](50) NULL,
	[Date_From] [date] NULL,
	[Date_Upto] [date] NULL,
	[Created_By] [varchar](200) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Consumer_Offer_MSIL_Hst])
)
ALTER TABLE [dbo].[Consumer_Offer_MSIL] ADD  DEFAULT (getdate()) FOR [ValidFrom]
ALTER TABLE [dbo].[Consumer_Offer_MSIL] ADD  DEFAULT (getdate()) FOR [created_at]`,
    ],
  },
  {
    comments: "Rto Import",
    ID: 1195,
    queries: [
      `
alter table RTO_IMPORT add Vin varchar(50) null`,
    ],
  },
  {
    comments: "ASSET_REQUEST",
    ID: 1196,
    queries: [`ALTER TABLE ASSET_REQUEST ADD Request_Type VARCHAR(20) NULL`],
  },
  {
    comments: "ASSET_PRODUCT",
    ID: 1196,
    queries: [`ALTER TABLE ASSET_PRODUCT ADD ITEM_SUB_TYPE VARCHAR (20) NULL`],
  },
  {
    comments: "Msil Receivable",
    ID: 1198,
    queries: [
      `CREATE TABLE [dbo].[Consumer_Receivable](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[DMS_INVOICE] [varchar](30) NULL,
	[DMS_INVOICE_DATE] [date] NULL,
	[CUSTOMER_NAME] [varchar](100) NULL,
	[VIN_NUMBER] [varchar](30) NULL,
	[MODEL_CODE] [varchar](30) NULL,
	[LOC_CODE] [varchar](15) NULL,
	[DMS_LOC_CODE] [varchar](20) NULL,
	[DATE_FROM] [date] NULL,
	[DATE_UPTO] [date] NULL,
	[TRACKING_STATUS] [varchar](10) NULL,
	[VAH_REGDATE] [date] NULL,
	[Created_At] [datetime] NOT NULL,
	[Created_by] [varchar](100) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[RIPS_1_Offer] [float] NULL,
	[RIPS_1_Dealer_Share] [float] NULL,
	[RIPS_1_MSIL_Share] [float] NULL,
	[RIPS_2_Offer] [float] NULL,
	[RIPS_2_Dealer_Share] [float] NULL,
	[RIPS_2_MSIL_Share] [float] NULL,
	[RIPS_3_Offer] [float] NULL,
	[RIPS_3_Dealer_Share] [float] NULL,
	[RIPS_3_MSIL_Share] [float] NULL,
	[ADNL_1_Offer] [float] NULL,
	[ADNL_1_Dealer_Share] [float] NULL,
	[ADNL_1_MSIL_Share] [float] NULL,
	[ADNL_2_Offer] [float] NULL,
	[ADNL_2_MSIL_Share] [float] NULL,
	[ADNL_3_Offer] [float] NULL,
	[ADNL_3_Dealer_Share] [float] NULL,
	[ADNL_3_MSIL_Share] [float] NULL,
	[ADNL_2_Dealer_Share] [float] NULL,
	[TCN_AMOUNT] [float] NULL,
	[Total_Offer] [float] NULL,
	[Total_Dealer_Share] [float] NULL,
	[Total_MSIL_Share] [float] NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Consumer_Receivable_Hst])
)
ALTER TABLE [dbo].[Consumer_Receivable] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Consumer_Receivable] ADD  DEFAULT (getdate()) FOR [ValidFrom]
`,
      `CREATE TABLE [dbo].[Consumer_Offer_MSIL](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Model_Code] [varchar](50) NULL,
	[Model_Name] [varchar](200) NULL,
	[Offer] [float] NULL,
	[Dealer_Share] [float] NULL,
	[MSIL_Share] [float] NULL,
	[Offer_Type] [varchar](50) NULL,
	[Location] [varchar](50) NULL,
	[region] [varchar](50) NULL,
	[Date_From] [date] NULL,
	[Date_Upto] [date] NULL,
	[Created_By] [varchar](200) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Consumer_Offer_MSIL_Hst])
)
ALTER TABLE [dbo].[Consumer_Offer_MSIL] ADD  DEFAULT (getdate()) FOR [ValidFrom]
ALTER TABLE [dbo].[Consumer_Offer_MSIL] ADD  DEFAULT (getdate()) FOR [created_at]

`,
      ``,
    ],
  },
  {
    comments: "Labour_Analysis_Report",
    ID: 1199,
    queries: [
      `CREATE TABLE [dbo].[Labour_Analysis_Report](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	DealerName VARCHAR(255),
    DealerCity VARCHAR(100),
    Location VARCHAR(100),
    LabourCode VARCHAR(50),
    LabourDesc VARCHAR(255),
    BillNo VARCHAR(50),
    ServiceAdvisorTechnicianName VARCHAR(100),
    JcNum VARCHAR(50),
    JcDate DATETIME,
    CustomerName VARCHAR(100),
    RegistrationNo VARCHAR(20),
    Model VARCHAR(100),
    BillDate DATETIME,
    BillDesc VARCHAR(100),
    BasicAmt DECIMAL(10,2),
    DiscountAmt DECIMAL(10,2),
    ChargesAmt DECIMAL(10,2),
    BillAmt DECIMAL(10,2),
    NetLabour DECIMAL(10,2),
    Loc_Code VARCHAR(20),
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Labour_Analysis_Report_Hst])
)
ALTER TABLE [dbo].[Labour_Analysis_Report] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Labour_Analysis_Report] ADD  DEFAULT (getdate()) FOR [ValidFrom]

`,
    ],
  },
  {
    comments: "Labour_Master",
    ID: 1200,
    queries: [
      `
CREATE TABLE [dbo].[Labour_Master](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	LabourName VARCHAR(255)  NULL,
    LabourCode VARCHAR(50)   NULL,
    Machother [varchar] (100)  NULL,
    Loc_Code [varchar] (10)  NULL,
	Created_By [varchar](200) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Labour_Master_Hst])
)
ALTER TABLE [dbo].[Labour_Master] ADD  DEFAULT (getdate()) FOR [ValidFrom]
ALTER TABLE [dbo].[Labour_Master] ADD  DEFAULT (getdate()) FOR [Created_At]`,
    ],
  },
  {
    comments: "labour_master",
    ID: 1201,
    queries: [
      `

alter table  labour_master add IncentivePercentage float null`,
      `
alter table workshop_incentive_team add  MainGroup varchar(50)null
`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1201,
    queries: [
      `CREATE TABLE BANK_TEMPLATES (
          UTD INT IDENTITY(1,1) PRIMARY KEY,
        Template_Name nvarchar(100) NOT NULL,
          Template_Type VARCHAR(100) NOT NULL,
          From_Acc VARCHAR(255) NOT NULL,
          To_Acc VARCHAR(255) NOT NULL,
          Created_Date DATETIME DEFAULT GETDATE(),
          Created_By VARCHAR(100) NOT NULL,
          Valid_From DATETIME2 GENERATED ALWAYS AS ROW START NOT NULL,
          Valid_To DATETIME2 GENERATED ALWAYS AS ROW END NOT NULL,
          PERIOD FOR SYSTEM_TIME (Valid_From, Valid_To)
      )
      WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.BANK_TEMPLATES_HST));`,
    ],
  },
  {
    comments: "shortcuts",
    ID: 1202,
    queries: [
      `CREATE TABLE user_shortcuts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usercode VARCHAR(50) NOT NULL,
    shortcut VARCHAR(20) NOT NULL,
    url NVARCHAR(MAX) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT unique_user_shortcut UNIQUE (usercode, shortcut)
);`,
    ],
  },
  {
    comments: "Alignment",
    ID: 1203,
    queries: [
      `CREATE TABLE [dbo].[Workshop_Incentive_Team_Alignment](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Groups] [varchar](10) NULL,
	[EMPCODE] [varchar](20) NULL,
	[LEDGERCODE] [float] NULL,
	[Designation] [varchar](50) NULL,
	[DMSName] [varchar](255) NULL,
	[ERPName] [varchar](255) NULL,
	[ACTIVE] [varchar](10) NULL,
	[IncentivePercentage] [float] NULL,
	[IncentiveCalculatedOn] [varchar](10) NULL,
	[Location] [varchar](20) NULL,
	[DateFrom] [date] NULL,
	[DateUpto] [date] NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[MainGroup] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Workshop_Incentive_Team_Alignment_Hst])
)
ALTER TABLE [dbo].[Workshop_Incentive_Team_Alignment] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Workshop_Incentive_Team_Alignment] ADD  DEFAULT (getdate()) FOR [ValidFrom]
`,
      `CREATE TABLE [dbo].[Workshop_Incentive_Team_Electric](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Groups] [varchar](10) NULL,
	[EMPCODE] [varchar](20) NULL,
	[LEDGERCODE] [float] NULL,
	[Designation] [varchar](50) NULL,
	[DMSName] [varchar](255) NULL,
	[ERPName] [varchar](255) NULL,
	[ACTIVE] [varchar](10) NULL,
	[IncentivePercentage] [float] NULL,
	[IncentiveCalculatedOn] [varchar](10) NULL,
	[Location] [varchar](20) NULL,
	[DateFrom] [date] NULL,
	[DateUpto] [date] NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[MainGroup] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Workshop_Incentive_Team_Electric_Hst])
)
ALTER TABLE [dbo].[Workshop_Incentive_Team_Electric] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Workshop_Incentive_Team_Electric] ADD  DEFAULT (getdate()) FOR [ValidFrom]

`,
      `CREATE TABLE [dbo].[Workshop_Incentive_Team_Other](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Groups] [varchar](10) NULL,
	[EMPCODE] [varchar](20) NULL,
	[LEDGERCODE] [float] NULL,
	[Designation] [varchar](50) NULL,
	[DMSName] [varchar](255) NULL,
	[ERPName] [varchar](255) NULL,
	[ACTIVE] [varchar](10) NULL,
	[IncentivePercentage] [float] NULL,
	[IncentiveCalculatedOn] [varchar](10) NULL,
	[Location] [varchar](20) NULL,
	[DateFrom] [date] NULL,
	[DateUpto] [date] NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[MainGroup] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Workshop_Incentive_Team_Other_Hst])
)
ALTER TABLE [dbo].[Workshop_Incentive_Team_Other] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Workshop_Incentive_Team_Other] ADD  DEFAULT (getdate()) FOR [ValidFrom]

`,
    ],
  },
  {
    comments: "Workshop_Incentive_Team_Other",
    ID: 1204,
    queries: [
      `
alter table Workshop_Incentive_Team_Other alter column IncentiveCalculatedOn varchar(100)null`,
    ],
  },
  {
    comments: "Workshop Incentive Team Other Staff",
    ID: 1205,
    queries: [
      `
CREATE TABLE [dbo].[Workshop_Incentive_Team_Other_Staff](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Base1] [float] NULL,
	[Base2] [float] NULL,
	[EMPCODE] [varchar](20) NULL,
	[LEDGERCODE] [float] NULL,
	[Designation] [varchar](50) NULL,
	[DMSName] [varchar](255) NULL,
	[ERPName] [varchar](255) NULL,
	[ACTIVE] [varchar](10) NULL,
	[IncentivePercentage] [float] NULL,
	[IncentiveCalculatedOn] [varchar](100) NULL,
	[Location] [varchar](20) NULL,
	[DateFrom] [date] NULL,
	[DateUpto] [date] NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Workshop_Incentive_Team_Other_Staff_Hst])
)
ALTER TABLE [dbo].[Workshop_Incentive_Team_Other_Staff] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Workshop_Incentive_Team_Other_Staff] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `
alter table workshop_incentive_team_other_staff alter column ledgercode [varchar](20) NULL`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1206,
    queries: [
      `
CREATE PROCEDURE trialbalancequery  
  @group_code INT,  
  @start_date DATE,  
  @end_date DATE,  
  @loc_code varchar (255)  
  AS  
 BEGIN  
 declare @sql NVARCHAR(MAX)  
SET @sql = '  
WITH RecursiveHierarchy AS (  
    SELECT Group_Code, Group_Code  AS Second_Hierarchy_Code , Group_Name  
    FROM Grup_Mst  
    WHERE   sub_Group in ('+ CAST(@group_code AS NVARCHAR) +')  
    UNION ALL  
    SELECT gm.Group_Code,rh.Second_Hierarchy_Code,rh.Group_Name  
    FROM Grup_Mst gm  
    INNER JOIN RecursiveHierarchy rh ON gm.Sub_Group = rh.Group_Code  
)  
SELECT   group_code,group_name collate database_default as group_name,    Sum(Opening) as Opening,    Sum(Debit) as Debit,    Sum(credit) as Credit,    Sum(Opening) + Sum(Debit) - Sum(credit) as Closing    ,''Group'' as Type   FROM (  
SELECT  
 0.00 as Opening,  
    Sum(iif(Amt_Drcr = 1, Post_Amt, 0)) as Debit,  
    Sum(iif(Amt_Drcr = 2, Post_Amt, 0)) as Credit,  
    rh.Second_Hierarchy_Code as group_code,rh.group_name,lm.ledg_code,lm.ledg_name  
     
FROM   
    acnt_post ap  
JOIN   
    ledg_mst lm ON ap.Ledg_Ac = lm.ledg_code  
JOIN   
    RecursiveHierarchy rh ON lm.group_code = rh.Group_Code  
WHERE    
    ap.Loc_Code IN ('+ @loc_code +') AND  
     ap.Acnt_Date BETWEEN ''' + CONVERT(NVARCHAR, @start_date, 120) + ''' AND ''' + CONVERT(NVARCHAR, @end_date, 120) + '''  
    AND ap.Export_Type < 5   
    AND ap.Ledg_Ac <> 10   
    AND ap.Acnt_Type NOT IN (16, 14)  
GROUP BY  
    rh.Second_Hierarchy_Code, rh.group_name,lm.ledg_code,lm.ledg_name  
 union all  
SELECT  
    Sum(iif(Amt_Drcr = 1, Post_Amt, Post_Amt * -1)) as Opening,  
        0.00 as Debit,  
        0.00 as Credit,  
    rh.Second_Hierarchy_Code as group_code,  
 rh.group_name,lm.ledg_code,lm.ledg_name  
FROM   
    acnt_post ap  
JOIN   
    ledg_mst lm ON ap.Ledg_Ac = lm.ledg_code  
JOIN   
    RecursiveHierarchy rh ON lm.group_code = rh.Group_Code  
WHERE    
    ap.Loc_Code IN ('+ @loc_code +') and  
 ap.Acnt_Date < ''' + CONVERT(NVARCHAR, @start_date, 120) + '''  
    AND ap.Export_Type < 5   
    AND ap.Ledg_Ac <> 10   
    AND ap.Acnt_Type NOT IN (16, 14)  
GROUP BY  
    rh.Second_Hierarchy_Code , rh.group_name ,lm.ledg_code,lm.ledg_name  
 )  As A  
GROUP BY  
   A.group_code,A.group_name  
   union all   
SELECT ledg_code as group_code, ledg_name collate database_default as group_name,    Sum(Opening) as Opening,    Sum(Debit) as Debit,    Sum(credit) as Credit,    Sum(Opening) + Sum(Debit) - Sum(credit) as Closing    ,''Ledger'' as Type   FROM (  
SELECT  
 0.00 as Opening,  
    Sum(iif(Amt_Drcr = 1, Post_Amt, 0)) as Debit,  
    Sum(iif(Amt_Drcr = 2, Post_Amt, 0)) as Credit,  
    lm.ledg_code,lm.ledg_name  
     
FROM   
    acnt_post ap  
JOIN   
    ledg_mst lm ON ap.Ledg_Ac = lm.ledg_code  
WHERE    
    ap.Loc_Code IN ('+ @loc_code +') AND  
     ap.Acnt_Date BETWEEN ''' + CONVERT(NVARCHAR, @start_date, 120) + ''' AND ''' + CONVERT(NVARCHAR, @end_date, 120) + '''  
    AND ap.Export_Type < 5   
    AND ap.Ledg_Ac <> 10   
    AND ap.Acnt_Type NOT IN (16, 14)  
 AND lm.Group_Code in ('+ CAST(@group_code AS NVARCHAR) +')  
GROUP BY  
    lm.ledg_code,lm.ledg_name  
 union all  
SELECT  
    Sum(iif(Amt_Drcr = 1, Post_Amt, Post_Amt * -1)) as Opening,  
        0.00 as Debit,  
        0.00 as Credit  
  ,lm.ledg_code,lm.ledg_name  
FROM   
    acnt_post ap  
JOIN   
    ledg_mst lm ON ap.Ledg_Ac = lm.ledg_code  
WHERE    
    ap.Loc_Code IN ('+ @loc_code +') and  
 ap.Acnt_Date < ''' + CONVERT(NVARCHAR, @start_date, 120) + '''  
    AND ap.Export_Type < 5   
    AND ap.Ledg_Ac <> 10   
    AND ap.Acnt_Type NOT IN (16, 14)  
 AND lm.Group_Code in ('+ CAST(@group_code AS NVARCHAR) +')  
GROUP BY  
     lm.ledg_code,lm.ledg_name  
 )  As B    
GROUP BY  
   B.Ledg_Code,B.Ledg_Name  
   order by type , group_code'  
  EXEC sp_executesql @sql  
  print @sql  
 END;  `,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1207,
    queries: [
      `-- Table for BodyShop_A (BI_Part_Issue.xlsx)
              CREATE TABLE BodyShop_A (
                id INT identity(1,1) PRIMARY KEY,
                batch_id nvarchar(30),
                Region NVARCHAR(500),
                Consignee_Code NVARCHAR(500),
                Dealer_Code NVARCHAR(500),
                FOR_Code NVARCHAR(500),
                Outlet_code NVARCHAR(500),
                Location_Code NVARCHAR(500),
                Part_Category NVARCHAR(500),
                Part_Num NVARCHAR(500),
                Root_Part_Num NVARCHAR(500),
                Part_Description NVARCHAR(500),
                Financial_Year NVARCHAR(500),
                Financial_Month NVARCHAR(500),
                Month_Year NVARCHAR(500),
                Day NVARCHAR(500),
                Sale_Type NVARCHAR(500),
                Service_Description NVARCHAR(500),
                Variant_Name NVARCHAR(500),
                Variant_Code NVARCHAR(500),
                JobCard_Num NVARCHAR(500),
                Dealer_Seq_No NVARCHAR(500),
                Document_Num NVARCHAR(500),
                Service_Advisor NVARCHAR(500),
                Vehicle_Registration_Num NVARCHAR(500),
                Base_Model_Name NVARCHAR(500),
                Net_Retail_DDL_wo_CO_DDL_DDT NVARCHAR(500),
                Net_Retail_Qty_wo_CO_DDL_DDT NVARCHAR(500),
                Created_date datetime default getdate()
              );
              `,
      `
              -- Table for BodyShop_B (Extranet_Allocation_Status.xlsx)
              CREATE TABLE BodyShop_B (
                id INT identity(1,1) PRIMARY KEY,
                batch_id nvarchar(30),
                DEALER_CODE NVARCHAR(500),
                CONSIGNEE_CODE NVARCHAR(500),
                MARUTI_ORDER_NO NVARCHAR(500),
                DEALER_ORDER_NO NVARCHAR(500),
                ORDER_TYPE NVARCHAR(500),
                PART_NUMBER NVARCHAR(500),
                PART_NAME NVARCHAR(500),
                ALLOCATED_QTY NVARCHAR(500),
                LOCATION NVARCHAR(500),
                Created_date datetime default getdate()
              );
              `,
      `
              -- Table for BodyShop_C (Extranet_Back_Order_Status.xlsx)
              CREATE TABLE BodyShop_C (
                id INT identity(1,1) PRIMARY KEY,
                batch_id nvarchar(30),
                Dealer_Code NVARCHAR(500),
                Consignee_Code NVARCHAR(500),
                Maruti_Order_No NVARCHAR(500),
                Dealer_Order_No NVARCHAR(500),
                Part_Number NVARCHAR(500),
                Part_Name NVARCHAR(500),
                Order_Type NVARCHAR(500),
                Order_Qty NVARCHAR(500),
                Advanced_Order_Qty NVARCHAR(500),
                Back_Order_Qty NVARCHAR(500),
                Location NVARCHAR(500),
                Created_date datetime default getdate()
              );
              `,
      `
              -- Table for BodyShop_D (Extranet_Dispatch_Status.xlsx)
              CREATE TABLE BodyShop_D (
                id INT identity(1,1) PRIMARY KEY,
                batch_id nvarchar(30),
                Dealer_Code NVARCHAR(500),
                Consignee_Code NVARCHAR(500),
                Type NVARCHAR(500),
                FIN_Ctrl_No NVARCHAR(500),
                Invoice_Date NVARCHAR(500),
                Value NVARCHAR(500),
                Gate_Pass_No NVARCHAR(500),
                Gate_Pass_Date NVARCHAR(500),
                Goods_Reciept_No NVARCHAR(500),
                Goods_Reciept_Date NVARCHAR(500),
                Transporter NVARCHAR(500),
                Truck_No NVARCHAR(500),
                Location NVARCHAR(500),
              Created_date datetime default getdate()
              );
              `,
      `
              -- Table for BodyShop_E (Extranet_Invoice_Status.xlsx)
              CREATE TABLE BodyShop_E (
                id INT identity(1,1) PRIMARY KEY,
                batch_id nvarchar(30),
                Dlr_Code NVARCHAR(500),
                Con_Code NVARCHAR(500),
                MSIL_Order_No NVARCHAR(500),
                Dlr_Order_No NVARCHAR(500),
                Part_No NVARCHAR(500),
                Part_Name NVARCHAR(500),
                Pick_Qty NVARCHAR(500),
                Pick_Ticket_No NVARCHAR(500),
                Type NVARCHAR(500),
                FIN_Ctrl_No NVARCHAR(500),
                Invoice_No NVARCHAR(500),
                Invoice_Date NVARCHAR(500),
                Gate_Pass_No NVARCHAR(500),
                Gate_Pass_Date NVARCHAR(500),
                Location NVARCHAR(500),
              Created_date datetime default getdate()
              );
              `,
      `
              -- Table for BodyShop_F (Extranet_Order_Received_Status.xlsx)
              CREATE TABLE BodyShop_F (
                id INT identity(1,1) PRIMARY KEY,
                batch_id nvarchar(30),
                Category NVARCHAR(500),
                Dlr_Code NVARCHAR(500),
                Cons_Code NVARCHAR(500),
                MSIL_Batch_No NVARCHAR(500),
                Batch_Date NVARCHAR(500),
                Dealer_Order_No NVARCHAR(500),
                Order_Category NVARCHAR(500),
                Order_Type NVARCHAR(500),
                VALUE NVARCHAR(500),
                Status NVARCHAR(500),
                Location NVARCHAR(500),
              Created_date datetime default getdate()
              );
              `,
      `
              -- Table for BodyShop_G (Extranet_Under_Picking_Status.xlsx)
              CREATE TABLE BodyShop_G (
                id INT identity(1,1) PRIMARY KEY,
                batch_id nvarchar(30),
                Maruti_Ord_No NVARCHAR(500),
                Dlr_Ord_No NVARCHAR(500),
                ORD_DATE NVARCHAR(500),
                ORD_TYPE NVARCHAR(500),
                Pick_Ticket_No NVARCHAR(500),
                Part_No NVARCHAR(500),
                PART_NAME NVARCHAR(500),
                ALLOC_QTY NVARCHAR(500),
                LOCATION NVARCHAR(500),
              Created_date datetime default getdate()
              );
              `,
      `
              -- Table for BodyShop_H (Holdup.xlsx)
              CREATE TABLE BodyShop_H (
                id INT identity(1,1) PRIMARY KEY,
                batch_id nvarchar(30),
                Dealer_Region_Code NVARCHAR(500),
                Dealer_City NVARCHAR(500),
                MSIL_Service_Dealer_Code NVARCHAR(500),
                Dealer_FOR_Code NVARCHAR(500),
                Dealer_Outlet_Code NVARCHAR(500),
                Dealer_Name NVARCHAR(500),
                Service_Type_Description NVARCHAR(500),
                Holdup_JobCard_No NVARCHAR(500),
                JobCard_Status NVARCHAR(500),
                JobCard_Open_Date NVARCHAR(500),
                Promised_Date NVARCHAR(500),
                Date NVARCHAR(500),
                Holdup_Reason NVARCHAR(500),
                Odometer_Reading NVARCHAR(500),
                Model_Name NVARCHAR(500),
                Repeat_Flag NVARCHAR(500),
                Revised_Sugg_Promise_Date NVARCHAR(500),
                Suggested_Promise_Date NVARCHAR(500),
                Eng_Tran_Repair NVARCHAR(500),
                Part_Replacement NVARCHAR(500),
                Cutting_Welding NVARCHAR(500),
                No_of_Panels NVARCHAR(500),
                Type_of_Insurance NVARCHAR(500),
                Revised_Promise_Date NVARCHAR(500),
                Insurance_Approval_Date NVARCHAR(500),
                Payable_By NVARCHAR(500),
                Reg_Num NVARCHAR(500),
                HoldUp_days_from_JC_opening NVARCHAR(500),
                Holdup_day_Beyond_Promise_Time NVARCHAR(500),
                Colour_Code NVARCHAR(500),
                Colour_Description NVARCHAR(500),
              Created_date datetime default getdate()
              );
              `,
      `
              -- Table for BodyShop_I (Part_Requisition_Details.xlsx)
              CREATE TABLE BodyShop_I (
                id INT identity(1,1) PRIMARY KEY,
                batch_id nvarchar(30),
                DMS_Loc NVARCHAR(500),
                Requisition_No NVARCHAR(500),
                Requisition_Dt NVARCHAR(500),
                Reg_No NVARCHAR(500),
                Job_Card_No NVARCHAR(500),
                Customer_Name NVARCHAR(500),
                Part_No NVARCHAR(500),
                Part_Desc NVARCHAR(500),
                Bin_Location NVARCHAR(500),
                Requested_Qty NVARCHAR(500),
                Issued_Qty NVARCHAR(500),
                Pending_Qty NVARCHAR(500),
                Stock_Qty NVARCHAR(500),
                Selling_Price NVARCHAR(500),
                Part_Flagging NVARCHAR(500),
                DMS_Order_No NVARCHAR(500),
                Order_Date NVARCHAR(500),
              Created_date datetime default getdate()
              );
              `,
      `
              -- Table for BodyShop_J (Extranet_Under_Invoicing_Status.xlsx)
              CREATE TABLE BodyShop_J (
                id INT identity(1,1) PRIMARY KEY,
                batch_id nvarchar(30),
                DLR_CODE NVARCHAR(500),
                CONS_CODE NVARCHAR(500),
                Maruti_Ord_No NVARCHAR(500),
                DlrOrd_No NVARCHAR(500),
                ORD_TYPE NVARCHAR(500),
                Pick_Ticket_No NVARCHAR(500),
                PART_NUMBER NVARCHAR(500),
                PART_NAME NVARCHAR(500),
                PICKED_QTY NVARCHAR(500),
                LOCATION NVARCHAR(500),
              Created_date datetime default getdate()
              );
              `,
      `
              CREATE TABLE BodyShop_K (
                id INT identity(1,1) PRIMARY KEY,
                batch_id nvarchar(30),
                Dealer_Ord_No NVARCHAR(500),
                MSIL_Batch_No NVARCHAR(500),
                MSIL_Ord_No NVARCHAR(500),
                Ord_Date NVARCHAR(500),
                Part_No NVARCHAR(500),
                Error NVARCHAR(500),
                Created_date datetime default getdate()
              );
              `,
      `
              CREATE TABLE BodyShop_L (
                id INT identity(1,1) PRIMARY KEY,
                batch_id nvarchar(30),
                  LOCATION NVARCHAR(256),
                  STAGE NVARCHAR(256),
                  CUSTOMER NVARCHAR(256),
                  CONSIGNEE NVARCHAR(256),
                  ORDER_REFRENCE_NO NVARCHAR(256),
                  BATCH_NUMBER NVARCHAR(256),
                  ORDER_NUMBER NVARCHAR(256),
                  ORDER_CATG NVARCHAR(256),
                  ORDER_TYPE NVARCHAR(256),
                  BATCH_ORDER_DATE NVARCHAR(256),  -- 'BATCH/ORDER_DATE' renamed for valid column naming
                  ORDER_PART_NUMBER NVARCHAR(256),
                  SERVE_PART_NUMBER NVARCHAR(256),
                  ORDER_QTY NVARCHAR(256),
                  ACTUAL_QTY NVARCHAR(256),
                  PICT_TICKET_NO NVARCHAR(256),
                  PICT_TICKET_DATE NVARCHAR(256),
                  INVOICE_NUMBER NVARCHAR(256),
                  INVOICE_DATE NVARCHAR(256),
                  GRVR_NUMBER NVARCHAR(256),
                  GRVR_DATE NVARCHAR(256),
                  MGPA_NUMBER NVARCHAR(256),
                  MGPA_DATE NVARCHAR(256),
                  EXPECTED_TIME_OF_ARRIVAL NVARCHAR(256) ,
                Created_date DATETIME default getdate()
              );`,
    ],
  },
  {
    comments: "RTO API",
    ID: 1208,
    queries: [
      `
    CREATE TABLE [dbo].[RTO_API](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [Tran_id] [int] NULL,
      [Cust_Id] [nvarchar](20) NOT NULL,
      [DMS_Inv] [nvarchar](50) NOT NULL,
      [Invoice_Date] [date] NULL,
      [Customer_Name] [nvarchar](255) NOT NULL,
      [Model_Name] [nvarchar](100) NULL,
      [Colour_Name] [nvarchar](100) NULL,
      [Pan_No] [nvarchar](20) NULL,
      [Aadhar_No] [nvarchar](20) NULL,
      [Address1] [nvarchar](500) NULL,
      [Address2] [nvarchar](500) NULL,
      [Pin_Code] [nvarchar](10) NULL,
      [Village] [nvarchar](100) NULL,
      [StateName] [nvarchar](100) NULL,
      [Finance_Name] [nvarchar](255) NULL,
      [Finance_Address] [nvarchar](255) NULL,
      [Mobile_No] [nvarchar](20) NULL,
      [Email_ID] [nvarchar](255) NULL,
      [Engine_No] [nvarchar](50) NULL,
      [VIN] [nvarchar](50) NULL,
      [Basic_Price] [decimal](18, 2) NULL,
      [Policy_Date] [date] NULL,
      [Policy_No] [nvarchar](50) NULL,
      [exp_date] [date] NULL,
      [Booking_No] [nvarchar](50) NULL,
      [Owner_Type] [nvarchar](10) NULL,
      [OwnerCategory] [nvarchar](50) NULL,
      [Manufacutring_Date] [date] NULL,
      [Sale_Certificate_Date] [date] NULL,
      [Sales_Certificate_Amount] [decimal](18, 2) NULL,
      [Insurance_Type] [nvarchar](50) NULL,
      [Hypothication] [nvarchar](100) NULL,
      [IDV] [nvarchar](50) NULL,
      [Body_Type] [nvarchar](50) NULL,
      [Registration_Purpose] [nvarchar](50) NULL,
      [Vehicle_Type] [nvarchar](50) NULL,
      [Permit_Category] [nvarchar](50) NULL,
      [RTO_Office_List] [nvarchar](50) NULL,
      [Permit_Type] [nvarchar](50) NULL,
      [Avaliable_For_Rto] [int] NULL,
      [Fetched_Rto] [int] NULL,
      [CreatedBy] [nvarchar](50) NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      [Application_no] [nvarchar](200) NULL,
    PRIMARY KEY CLUSTERED 
    (
      [UTD] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
    ) ON [PRIMARY]
    WITH
    (
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[RTO_API_HST])
    )
    
    ALTER TABLE [dbo].[RTO_API] ADD  DEFAULT ((0)) FOR [Avaliable_For_Rto]
    
    ALTER TABLE [dbo].[RTO_API] ADD  DEFAULT ((0)) FOR [Fetched_Rto]`,
    ],
  },
  {
    comments: "Labour_Analysis_Report_SA",
    ID: 1209,
    queries: [
      `
    CREATE TABLE [dbo].[Labour_Analysis_Report_SA](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [DealerName] [varchar](255) NULL,
      [DealerCity] [varchar](100) NULL,
      [Location] [varchar](100) NULL,
      [LabourCode] [varchar](50) NULL,
      [LabourDesc] [varchar](255) NULL,
      [BillNo] [varchar](50) NULL,
      [ServiceAdvisorTechnicianName] [varchar](100) NULL,
      [JcNum] [varchar](50) NULL,
      [JcDate] [datetime] NULL,
      [CustomerName] [varchar](100) NULL,
      [RegistrationNo] [varchar](20) NULL,
      [Model] [varchar](100) NULL,
      [BillDate] [datetime] NULL,
      [BillDesc] [varchar](100) NULL,
      [BasicAmt] [decimal](10, 2) NULL,
      [DiscountAmt] [decimal](10, 2) NULL,
      [ChargesAmt] [decimal](10, 2) NULL,
      [BillAmt] [decimal](10, 2) NULL,
      [NetLabour] [decimal](10, 2) NULL,
      [Loc_Code] [varchar](20) NULL,
      [Created_By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
    PRIMARY KEY CLUSTERED 
    (
      [UTD] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
    ) ON [PRIMARY]
    WITH
    (
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Labour_Analysis_Report_SA_Hst])
    )
    
    ALTER TABLE [dbo].[Labour_Analysis_Report_SA] ADD  DEFAULT (getdate()) FOR [Created_At]
    
    ALTER TABLE [dbo].[Labour_Analysis_Report_SA] ADD  DEFAULT (getdate()) FOR [ValidFrom]
    `,
    ],
  },
  {
    comments: "icm_ext",
    ID: 1210,
    queries: [`alter table icm_ext add Description varchar(200) NULL`],
  },
  {
    comments: "Cloud_Post",
    ID: 1211,
    queries: [
      `
    CREATE TABLE [dbo].[Cloud_Post](
      [Acnt_Id] [int] NULL,
      [Acnt_No] [int] NULL,
      [Seq_No] [int] NULL,
      [Acnt_Date] [smalldatetime] NULL,
      [Acnt_Type] [int] NULL,
      [Book_Code] [smallint] NULL,
      [Ledg_Ac] [int] NULL,
      [Ledg_Ac2] [int] NULL,
      [Post_Amt] [money] NULL,
      [Amt_drcr] [tinyint] NULL,
      [Chq_No] [nvarchar](50) NULL,
      [Chq_Date] [smalldatetime] NULL,
      [Link_id] [int] NULL,
      [Ref_No] [nvarchar](50) NULL,
      [Cost_Cntr] [tinyint] NULL,
      [Ledg_Narr] [nvarchar](2000) NULL,
      [Comn_Narr] [nvarchar](2000) NULL,
      [Loc_Code] [smallint] NULL,
      [ServerId] [tinyint] NULL,
      [Export_Type] [int] NULL,
      [Bil_Pay] [int] NULL,
      [Due_Amt] [money] NULL,
      [Ref_Id] [nvarchar](50) NULL,
      [Cr_Days] [money] NULL,
      [Bank_Date] [smalldatetime] NULL,
      [Bill_Ref] [nvarchar](100) NULL,
      [Ref_No2] [nvarchar](50) NULL,
      [Ref_Id2] [nvarchar](250) NULL,
      [ON_AC] [money] NULL,
      [Sup_RefNo] [nvarchar](50) NULL,
      [Sup_RefDate] [smalldatetime] NULL,
      [RefType] [tinyint] NULL,
      [NewRef] [nvarchar](20) NULL,
      [ISRCM] [int] NULL,
      [reason] [nvarchar](50) NULL,
      [USR_CODE] [int] NULL,
      [ENTR_DATE] [smalldatetime] NULL,
      [ENTR_TIME] [real] NULL,
      [MOD_USER] [int] NULL,
      [MOD_DATE] [smalldatetime] NULL,
      [MOD_TIME] [real] NULL,
      [IsNot_Return] [int] NULL,
      [Party_Bank] [nvarchar](35) NULL,
      [Party_Branch] [nvarchar](35) NULL,
      [Audit_LockDate] [date] NULL,
      [Audit_Remark] [nvarchar](250) NULL,
      [DMS_REF1] [nvarchar](200) NULL,
      [DMS_REF2] [nvarchar](200) NULL,
      [DMS_REF3] [nvarchar](200) NULL,
      [DMS_REF4] [nvarchar](200) NULL,
      [Region_Code] [int] NULL,
      [TALLY_Export] [date] NULL,
      [Tally_Import] [date] NULL,
      [IsHypo] [int] NULL,
      [Is_InterBranch] [int] NULL,
      [IB_Aproved] [int] NULL,
      [Ledg_Narr2] [nvarchar](300) NULL,
      [Insu_Rect] [money] NULL,
      [TV_RegNo] [nvarchar](80) NULL,
      [TV_Modl] [nvarchar](80) NULL,
      [TV_Yr] [nvarchar](30) NULL,
      [TV_NTV] [int] NULL,
      [Exe_Ver] [nvarchar](20) NULL,
      [Is_Ineligible] [int] NULL,
      [Cost_Center] [int] NULL,
      [INC_BATCH] [nvarchar](50) NULL,
      [UTD] [int] NULL,
      [PC_NAME] [nvarchar](100) NULL,
      [ENTRY_BATCH] [nvarchar](50) NULL,
      [Doc_Upload] [int] NULL,
      [POST_GUID] [nvarchar](80) NULL,
      [RECT_TYPE] [int] NULL,
      [GST_RECO_DATE] [date] NULL,
      [TDS_RECO_DATE] [date] NULL,
      [TDS_RECO_REM] [nvarchar](200) NULL,
      [Auto_Vch_Link_Id] [int] NULL,
      [Bank_Api] [int] NULL,
      [API_Book] [int] NULL,
      [ICM_ID] [int] NULL
    ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "[NEW_JOINING]",
    ID: 1212,
    queries: [
      `alter table [NEW_JOINING] add [HR_EMPCODE] [int] NOT NULL`,
      `alter table [NEW_JOINING] add [RESCHEDULE_REMARK1] [varchar](100) NULL`,
      `alter table [NEW_JOINING] add [RESCHEDULE_REMARK2] [varchar](100) NULL`,
      `alter table [NEW_JOINING] add [RESCHEDULE_REMARK3] [varchar](100) NULL`,
      `alter table [NEW_JOINING] add [RESCHEDULE_REMARK4] [varchar](100) NULL`,
    ],
  },
  {
    comments: "[NEW_JOINING]",
    ID: 1213,
    queries: [
      `ALTER TABLE NEW_JOINING DROP CONSTRAINT DF_NEW_JOINIHR_EM_589043CE;`,
      `ALTER TABLE NEW_JOINING ALTER COLUMN HR_EMPCODE VARCHAR(20) NULL`,
      `ALTER TABLE Asset_Issue ALTER COLUMN [uploaded_document] [varchar](500) NULL`,
    ],
  },
  {
    comments: "emp_varify",
    ID: 1214,
    queries: [
      `  
  CREATE TABLE [dbo].[emp_varify](
	[SRNO] [int] IDENTITY(1,1) NOT NULL,
	[EMPCODE] [varchar](100) NOT NULL,
	[pan_card_ver] [varchar](50) NULL,
	[pan_name_match_ver] [varchar](50) NULL,
	[aadhaar_linked_ver] [varchar](50) NULL,
	[aadhaar_card_ver] [varchar](50) NULL,
	[aadhaar_linked_pan_ver] [varchar](50) NULL,
	[aadhaar_name_match_emp_name] [varchar](50) NULL,
	[Created_At] [datetime] NOT NULL,
	[Created_by] [varchar](30) NULL,
	[Location] [varchar](50) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[SRNO] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[emp_varify_Hst])
)
ALTER TABLE [dbo].[emp_varify] ADD  DEFAULT (getdate()) FOR [Created_At] `,
    ],
  },
  {
    comments: "PAN_API",
    ID: 1215,
    queries: [
      `
CREATE TABLE [dbo].[PAN_API](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	pan [varchar](20) NULL,
	status [varchar](20) NULL,
	remarks [varchar](100) NULL,
	name_as_per_pan_match [bit] NULL,
	date_of_birth_match [bit] NULL,
	category [varchar](50) NULL,
	aadhaar_seeding_status [varchar](10) NULL,
	transaction_id [varchar](50) NULL,
	[Created_At] [datetime] NULL,
	[Created_by] [varchar](100) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PAN_API_Hst])
)
ALTER TABLE [dbo].[PAN_API] ADD  DEFAULT (getdate()) FOR [Created_At] `,
    ],
  },
  {
    comments: "AADHAAR_API",
    ID: 1216,
    queries: [
      `
      CREATE TABLE [dbo].[AADHAAR_API](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        transaction_id [varchar](100) NULL,
        entity [varchar](100) NULL,
        reference_id [BIGINT] NULL,	
        status [varchar](50) NULL,
        message [varchar](255) NULL,
        care_of [varchar](255) NULL,
        full_address [TEXT] NULL,
        date_of_birth [varchar](20) NULL,
        email_hash [varchar](255) NULL,
        gender [CHAR](1) NULL,
        name [varchar](255) NULL,
        country [varchar](100) NULL,
        district [varchar](100) NULL,
        house [varchar](255) NULL,
        landmark [varchar](255) NULL,
        pincode [INT] NULL,
        post_office [varchar](100) NULL,
        state [varchar](100) NULL,
        street [varchar](255) NULL,
        subdistrict [varchar](255) NULL,
        vtc [varchar](100) NULL,
        year_of_birth [INT] NULL,
        mobile_hash [varchar](255) NULL,
        photo [varchar](max) NULL,
        share_code [varchar](10) NULL,
        [Created_At] [datetime] NULL,
        [Created_by] [varchar](100) NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        [timestamp] [datetime] NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[AADHAAR_API_Hst])
      )
      ALTER TABLE [dbo].[AADHAAR_API] ADD  DEFAULT (getdate()) FOR [Created_At]`,
    ],
  },
  {
    comments: "DOCKETMST",
    ID: 1217,
    queries: [
      `ALTER TABLE DOCKETMST ADD [EMP_NAME] [varchar](100) NULL`,
      `ALTER TABLE DOCKETMST ADD [EMP_CODE] [varchar](50) NULL`,
      `ALTER TABLE DOCKETMST ADD [BRANCH] [varchar](100) NULL`,
      `ALTER TABLE DOCKETMST ADD [RTO_FLAG] [int] NULL`,
      `ALTER TABLE DOCKETMST ADD [RTO_CODE] [int] NULL`,
    ],
  },
  {
    comments: "Workshop_Incentive_Team_Alignment",
    ID: 1218,
    queries: [
      `ALTER TABLE [dbo].[Workshop_Incentive_Team_Alignment] DROP COLUMN [LEDGERCODE]`,
      `ALTER TABLE [dbo].[Workshop_Incentive_Team_Alignment] ADD [LEDGERCODE] VARCHAR(50) NULL`,
    ],
  },
  {
    comments: "DOCKETMST",
    ID: 1219,
    queries: [
      `ALTER TABLE DOCKETMST ADD [RTO_DATE] [smalldatetime] NULL`,
      `ALTER TABLE DOCKETMST ADD [RTO_AMOUNT] [int] NULL`,
      `ALTER TABLE DOCKETMST ADD [RTO_Document] [varchar](100) NULL`,
      `ALTER TABLE DOCKETMST ADD [QCM_DATE] [smalldatetime] NULL`,
    ],
  },
  {
    comments: "Salary_Approver",
    ID: 1220,
    queries: [
      `
      CREATE TABLE [dbo].[Salary_Approver](
        [Tran_id] [int] IDENTITY(1,1) NOT NULL,
        [Emp_Code] [varchar](20) NOT NULL,
        [Salary_Type] [varchar](20) NULL,
        [Effective_date] [datetime] NULL,
        [Rec_date] [datetime] NULL,
        [Basic] [varchar](50) NULL,
        [HRA] [varchar](50) NULL,
        [Conveyance] [varchar](50) NULL,
        [Medical] [varchar](50) NULL,
        [DA] [varchar](50) NULL,
        [Other] [varchar](50) NULL,
        [Washing] [varchar](50) NULL,
        [Uniform] [varchar](50) NULL,
        [Gross_Salary] [varchar](50) NULL,
        [Proposed_Salary] [varchar](50) NULL,
        [Appr_1_Code] [varchar](100) NULL,
        [Appr_1_Stat] [tinyint] NULL,
        [Appr_1_Rem] [varchar](300) NULL,
        [Appr_1_date] [datetime] NULL,
        [Appr_1_ApproverSalary] [varchar](50) NULL,
        [Appr_2_Code] [varchar](100) NULL,
        [Appr_2_Stat] [tinyint] NULL,
        [Appr_2_Rem] [varchar](300) NULL,
        [Appr_2_date] [datetime] NULL,
        [Appr_2_ApproverSalary] [varchar](50) NULL,
        [Appr_3_Code] [varchar](100) NULL,
        [Appr_3_Stat] [tinyint] NULL,
        [Appr_3_Rem] [varchar](300) NULL,
        [Appr_3_date] [datetime] NULL,
        [Appr_3_ApproverSalary] [varchar](50) NULL,
        [Fin_Appr] [tinyint] NULL,
        [Created_by] [varchar](40) NULL,
        [location] [varchar](50) NULL,
        [export_type] [int] NULL,
        [Created_date] [date] NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        [Mod_User] [varchar](50) NULL,
        [Mod_Date] [datetime] NULL,
        [Mod_Time] [datetime] NULL,
      PRIMARY KEY CLUSTERED 
      (
        [Tran_id] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Salary_Approver_Hst])
      )
      ALTER TABLE [dbo].[Salary_Approver] ADD  DEFAULT (getdate()) FOR [Created_date]
      
      ALTER TABLE [dbo].[Salary_Approver] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "DocketMst",
    ID: 1221,
    queries: [
      `ALTER TABLE DOCKETMST ADD [DSE_DATE] [smalldatetime] NULL`,
      `alter table [Emp_Atnrun] alter column [Emp_Code] nvarchar(20) null`,
      `alter table TV_ICM_mst alter column SALE_REMARKS nvarchar(max) null`,
    ],
  },
  {
    comments: "Salary_Approver",
    ID: 1222,
    queries: [
      `CREATE TABLE [dbo].[Approver_Remark_Msg](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [Type] [varchar](10) NULL,
        [Type_Name] [varchar](100) NULL,
        [Send_Empcode] [varchar](50) NULL,
        [Recieve_Empcode] [varchar](50) NULL,
        [Remark] [varchar](300) NULL,
        [Details] [varchar](max) NULL,
        [Message] [varchar](max) NULL,
        [Created_By] [varchar](255) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        [Acnt_Id] [varchar](50) NULL,
        [Acnt_Date] [date] NULL,
        [Party_Name] [varchar](200) NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Approver_Remark_Msg_Hst])
      )
      
      ALTER TABLE [dbo].[Approver_Remark_Msg] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[Approver_Remark_Msg] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1223,
    queries: [
      `ALTER TABLE comp_keydata ADD [DemoCar_Otp] [INT] NULL`,
      `ALTER TABLE Bank_Post ADD [Is_Hold] INT NULL`,
      `ALTER TABLE [Emp_Atnrun] ADD [Type] NVARCHAR(10) NULL`,
    ],
  },
  {
    comments: "Demo_Car_Gatepass",
    ID: 1224,
    queries: [
      `ALTER TABLE Demo_Car_Gatepass ADD [test_drive_type] [varchar](20) NULL`,
      `ALTER TABLE Demo_Car_Gatepass ADD [test_drive_location] [varchar](255) NULL`,
      `ALTER TABLE comp_keydata ADD [Booking_Payment_Link] INT NULL`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1227,
    queries: [
      `ALTER TABLE AADHAAR_API ADD [aadhaar_number] [varchar](50) NULL`,
      `ALTER TABLE comp_keydata ADD [SalAppr_NewJoin] INT NULL`,
      `ALTER TABLE comp_keydata ADD [SalAppr_Appraisal] INT NULL`,
    ],
  },
  {
    comments: "cloud_Criteria",
    ID: 1228,
    queries: [
      `create table  cloud_Criteria (
        [tran_id] [int] NULL,
        module_code [nvarchar](50) NULL,
         value [nvarchar](50) NULL,
         Range_1  [int] NULL,
         Range_2 [int] NULL,
         color [nvarchar](50) NULL)`,
    ],
  },
  {
    comments: "otp_verify",
    ID: 1229,
    queries: [
      `CREATE TABLE [dbo].[otp_verify](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Mobile_No] [BigInt] NULL,
              [otp] [Int] NULL,
              [Expory_Type] [Int] NULL,
              [CREATED_BY] [varchar](20) NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        PRIMARY KEY CLUSTERED
        (
              [UTD] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]
        WITH
        (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[otp_verify_Hst])
        )
        
        
        ALTER TABLE [dbo].[otp_verify] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "DemoCar_Ans",
    ID: 1230,
    queries: [
      `ALTER TABLE DemoCar_Ans ADD DemoCarUTD VARCHAR(20) NULL`,
      `alter table cloud_Criteria add Type nvarchar(50) null`,
    ],
  },
  {
    comments: "DemoCar_Ans",
    ID: 1231,
    queries: [
      `CREATE TABLE [dbo].[DemoCar_Ans](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [name] [varchar](500) NULL,
        [Dlr_id] [varchar](20) NULL,
        [Questions] [varchar](500) NULL,
        [Ratings] [varchar](500) NULL,
        [Date] [datetime] NULL,
        [Created_By] [varchar](100) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        [DemoCarUTD] [varchar](20) NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[DemoCar_Ans_Hst])
      )
      
      ALTER TABLE [dbo].[DemoCar_Ans] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[DemoCar_Ans] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "DemoCar_Ques",
    ID: 1232,
    queries: [
      `CREATE TABLE [dbo].[DemoCar_Ques](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [Dlr_id] [varchar](20) NULL,
        [Questions] [varchar](500) NULL,
        [Created_By] [varchar](100) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        [Location] [varchar](10) NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[DemoCar_Ques_Hst])
      )
      
      ALTER TABLE [dbo].[DemoCar_Ques] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[DemoCar_Ques] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "DemoCar_Ques",
    ID: 1233,
    queries: [
      `CREATE TABLE [dbo].[MOBILE_OTP](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [Mobile_No] [bigint] NULL,
        [otp] [int] NULL,
        [Expory_Type] [int] NULL,
                                [CREATED_BY] [varchar](20) NULL,
        [DateFrom] DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
        [DateUpto] DATETIME2(7) NOT NULL,

        [ValidFrom] DATETIME2(7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] DATETIME2(7) GENERATED ALWAYS AS ROW END NOT NULL,

        PRIMARY KEY CLUSTERED ([UTD] ASC),
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
         );
    -- Required semicolon before SYSTEM_VERSIONING clause
    ALTER TABLE [dbo].[MOBILE_OTP]
    SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[MOBILE_OTP_HST]))`,
    ],
  },
  {
    comments: "democar_ans",
    ID: 1234,
    queries: [`ALTER TABLE democar_ans ADD URL VARCHAR(MAX)`],
  },
  {
    comments: "DocketMst",
    ID: 1235,
    queries: [`ALTER TABLE DocketMst ADD MGA_12 NVARCHAR(3) NULL;`],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1236,
    queries: [`ALTER TABLE COMP_KEYDATA ADD GP_KM_IMG INT NULL`],
  },
  {
    comments: "DOC_UPLOAD",
    ID: 1237,
    queries: [`ALTER TABLE DOC_UPLOAD ADD Keywords VARCHAR(200) null`],
  },
  {
    comments: "New_dev_Code",
    ID: 1238,
    queries: [
      `ALTER TABLE RTO_API ADD INSURANCE_COMPANY_NAME VARCHAR(300) NULL`,
      `ALTER TABLE RTO_API ADD [Vehicle_Class] [nvarchar](50) NULL`,
      `ALTER TABLE RTO_API ADD [Vehicle_Category] [nvarchar](50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  EXCH_BONUS VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  EXCH_BONUS_REMARK VARCHAR(500) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  FORECLOSE_AMT VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  FORECLOSE_AMT_REMARK VARCHAR(500) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  HP_CANCEL VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  HP_CANCEL_REMARK VARCHAR(500) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  NOC_DEPOSIT VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  NOC_DEPOSIT_REMARK VARCHAR(500) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  RC_DEPOSIT VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  RC_DEPOSIT_REMARK VARCHAR(500) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  BACKLOG VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  BACKLOG_REMARK VARCHAR(500) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  TAX_ERROR VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  TAX_ERROR_REMARK VARCHAR(500) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  CHALLAN_REQ VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  CHALLAN_REQ_REMARK VARCHAR(500) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  CNG_RETESTING VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  CNG_RETESTING_REMARK VARCHAR(500) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  CNG_ENTRY_CHRG VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  CNG_ENTRY_CHRG_REMARK VARCHAR(500) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  TRNSFER_NEW_CAR VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  TRNSFER_NEW_CAR_REMARK VARCHAR(500) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  TRNSFER_NEW_CAR_DOC VARCHAR(MAX) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  NOC_DEPOSIT_DOC VARCHAR(MAX) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  RC_DEPOSIT_DOC VARCHAR(MAX) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  FORCLOSE_AMT_DOC VARCHAR(MAX) NULL`,
    ],
  },
  {
    comments: "RTO_API",
    ID: 1239,
    queries: [
      `EXEC sp_rename 'RTO_API.DMS_Inv', 'Invoice_No', 'COLUMN'`,
      `ALTER TABLE RTO_API ALTER COLUMN Invoice_No NVARCHAR(50) NULL`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1240,
    queries: [
      `Alter Table ICM_MST add Ledg_Add3 NVarchar(120) Null`,
      `ALTER TABLE TV_ICM_MST ADD  VEHICLE_PRICE VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  VEHICLE_PRICE_REMARK VARCHAR(500) NULL`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1241,
    queries: [
      `ALTER TABLE TV_ICM_MST ADD  NOC_DEPOSIT_REFUND VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  NOC_DEPOSIT_REMARK_REFUND VARCHAR(500) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  RC_DEPOSIT_REFUND VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  RC_DEPOSIT_REMARK_REFUND VARCHAR(500) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  FORECLOSE_AMT_REFUND VARCHAR(50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD  FORECLOSE_AMT_REMARK_REFUND VARCHAR(500) NULL`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1242,
    queries: [
      `ALTER TABLE demo_car_gatepass ADD Amount INT, Quantity INT`,
      `ALTER TABLE DOC_UPLOAD ADD SOURCE VARCHAR(100)  NULL`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1243,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD FINANCE_PAYMENT_MODE VARCHAR(50) NULL`,
      `ALTER TABLE COMP_KEYDATA ADD FINANCE_DATE VARCHAR(100) NULL`,
    ],
  },
  {
    comments: "Rtl_Booking",
    ID: 1244,
    queries: [
      `CREATE TABLE [dbo].[Rtl_Booking](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [Tran_Id] [int] NULL,
        [Tran_Type] [int] NULL,
          [SNo] [smallint] NULL,
        [book_date] [datetime] NULL,
        [book_mode] [varchar](50) NULL,
        [book_Amt] [money] NULL,
        [book_total_Amt] [money] NULL,
        [Loc_Code] [int] NULL,
        [ServerId] [int] NULL,
        [Export_Type] [varchar](20) NULL,
        [Created_By] [varchar](255) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Rtl_Booking_Hst])
      )
      ALTER TABLE [dbo].[Rtl_Booking] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[Rtl_Booking] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "Rtl_Booking",
    ID: 1245,
    queries: [
      `ALTER TABLE RTL_MST ADD [Enq_id] [varchar](10) NULL`,
      `ALTER TABLE RTL_MST
      ADD 
        cust_meet_date [DATETIME] NULL,
        cust_activity [VARCHAR](255) NULL,
        nxt_pln_date [DATETIME] NULL,
        cust_feed [VARCHAR](1000) NULL,
        tl [VARCHAR](255) NULL,
        color [VARCHAR](255) NULL,
        consumer_offer [MONEY] NULL,
        corporate_offer [MONEY] NULL,
        exchange_offer [MONEY] NULL,
        additional_offer [MONEY] NULL,
        insurance_amount [MONEY] NULL,
        mga [MONEY] NULL,
        ew [MONEY] NULL,
        ccp [MONEY] NULL,
        fastag [MONEY] NULL,
        Auto_card [MONEY] NULL,
        other_charges [MONEY] NULL,
        pdf [VARCHAR](255) NULL,
        Quotation_rate [money] NULL,
        Quotation_remark [VARCHAR](255) NULL,
        Allot_Modl_Code [varchar](50) NULL,
	      Allot_Branch [varchar](100) NULL`,
    ],
  },
  {
    comments: "TV_ICM_MST",
    ID: 1246,
    queries: [`ALTER TABLE TV_ICM_MST ADD  Remaining_Amt VARCHAR(50) NULL`],
  },
  {
    comments: "APPROVAL_MATRIX",
    ID: 1247,
    queries: [
      `ALTER TABLE [Approval_Matrix] ADD [APPROVER1_MINLIMIT] [int] NULL`,
      `ALTER TABLE [Approval_Matrix] ADD	[APPROVER1_MAXLIMIT] [int] NULL`,
      `ALTER TABLE [Approval_Matrix] ADD	[APPROVER2_MINLIMIT] [int] NULL`,
      `ALTER TABLE [Approval_Matrix] ADD	[APPROVER2_MAXLIMIT] [int] NULL`,
      `ALTER TABLE [Approval_Matrix] ADD	[APPROVER3_MINLIMIT] [int] NULL`,
      `ALTER TABLE [Approval_Matrix] ADD	[APPROVER3_MAXLIMIT] [int] NULL`,
    ],
  },
  {
    comments: "Hyundai_Counter_Sale_Import",
    ID: 1248,
    queries: [
      `CREATE TABLE [dbo].[Hyundai_Counter_Sale_Import](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Invoice_No_RO_Bill_No] [varchar](50) NULL,
              [Sales_Date] [date] NULL,
              [Sales_Type] [varchar](50) NULL,
              [Invoice_Type] [varchar](50) NULL,
              [Ro_Type] [varchar](50) NULL,
              [Cash_Credit] [varchar](50) NULL,
              [Customer_Code] [varchar](50) NULL,
              [Veh_Reg_No] [varchar](50) NULL,
              [VIN] [varchar](50) NULL,
              [Part_Cat] [varchar](50) NULL,
              [GST] [varchar](50) NULL,
              [Rate_Perc] [varchar](50) NULL,
              [UQC] [varchar](50) NULL,
              [Place_of_Supply] [varchar](50) NULL,
              [Part_No] [varchar](50) NULL,
              [HSN] [varchar](50) NULL,
              [Part_Name] [varchar](50) NULL,
              [BATCH_CD] [varchar](50) NULL,
              [BATCH_DT] [date] NULL,
              [Qty] [varchar](50) NULL,
              [Unit_Price] [varchar](50) NULL,
              [Discount_Amount] [varchar](50) NULL,
              [Value] [varchar](50) NULL,
              [PART_TAX] [varchar](50) NULL,
              [K_CESS_Amount] [varchar](50) NULL,
              [PART_TAX_SGST] [varchar](50) NULL,
              [PART_TAX_CGST] [varchar](50) NULL,
              [PART_TAX_IGST] [varchar](50) NULL,
              [PART_TAX_TGST] [varchar](50) NULL,
              [FRG_INS_TAX_SGST] [varchar](50) NULL,
              [FRG_INS_TAX_CGST] [varchar](50) NULL,
              [FRG_INS_TAX_IGST] [varchar](50) NULL,
              [FRG_INS_TAX_TGST] [varchar](50) NULL,
              [INVOICE_VALUE] [varchar](50) NULL,
              [IRN_NO] [varchar](100) NULL,
              [IRN_DT] [date] NULL,
              [EWB] [varchar](50) NULL,
              [EWB_DT] [date] NULL,
              [PROMO_NO] [varchar](50) NULL,
              [SALES_CAT] [varchar](50) NULL,
              [MEMBER_CD] [varchar](50) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [location] [varchar](20) NULL,
        PRIMARY KEY CLUSTERED
        (
              [UTD] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]
        WITH
        (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Hyundai_Counter_Sale_Import_Hst])
        )
        
        ALTER TABLE [dbo].[Hyundai_Counter_Sale_Import] ADD  DEFAULT (getdate()) FOR [Created_At]
        
        ALTER TABLE [dbo].[Hyundai_Counter_Sale_Import] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "Hyundai_Part_Purchase_Import",
    ID: 1249,
    queries: [
      `CREATE TABLE [dbo].[Hyundai_Part_Purchase_Import](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Invoice_No] [varchar](50) NULL,
              [Invoice_Date] [date] NULL,
              [Supplier] [varchar](50) NULL,
              [PO_No] [varchar](50) NULL,
              [GR_No] [varchar](50) NULL,
              [GR_Type] [varchar](50) NULL,
              [GR_Date] [date] NULL,
              [LS_OS_Type] [varchar](50) NULL,
              [HSN_CD] [varchar](50) NULL,
              [GSTNO] [varchar](50) NULL,
              [RATE_Perc] [varchar](50) NULL,
              [UQC] [varchar](50) NULL,
              [Place_of_supply] [varchar](50) NULL,
              [Part_No] [varchar](50) NULL,
              [Part_Name] [varchar](50) NULL,
              [Part_Type] [varchar](50) NULL,
              [Model] [varchar](50) NULL,
              [Source] [varchar](50) NULL,
              [RCV_QTY] [varchar](50) NULL,
              [List_Price] [varchar](50) NULL,
              [LIST_PRC_AMT] [varchar](50) NULL,
              [PCC_DC_AMT] [varchar](50) NULL,
              [AEP_DC_AMT] [varchar](50) NULL,
              [HDR_DC_AMT] [varchar](50) NULL,
              [ADD_DC_AMT] [varchar](50) NULL,
              [SPCL_DC_AMT] [varchar](50) NULL,
              [PSIR_DC_AMT] [varchar](50) NULL,
              [NDP] [varchar](50) NULL,
              [NDP_AMT] [varchar](50) NULL,
              [VSC] [varchar](50) NULL,
              [DSC] [varchar](50) NULL,
              [PSC] [varchar](50) NULL,
              [OSC] [varchar](50) NULL,
              [Material_Value] [varchar](50) NULL,
              [TCS_RT] [varchar](50) NULL,
              [TCS_AMT] [varchar](50) NULL,
              [Sales_Tax_Amt] [varchar](50) NULL,
              [Freight] [varchar](50) NULL,
              [Insurance] [varchar](50) NULL,
              [TXBL_AMOUNT] [varchar](50) NULL,
              [SGST] [varchar](50) NULL,
              [CGST] [varchar](50) NULL,
              [IGST] [varchar](50) NULL,
              [LDC] [varchar](50) NULL,
              [Total_ED_Value] [varchar](50) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [location] [varchar](20) NULL,
        PRIMARY KEY CLUSTERED
        (
              [UTD] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]
        WITH
        (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Hyundai_Part_Purchase_Import_Hst])
        )
        
        ALTER TABLE [dbo].[Hyundai_Part_Purchase_Import] ADD  DEFAULT (getdate()) FOR [Created_At]
        
        ALTER TABLE [dbo].[Hyundai_Part_Purchase_Import] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "Hyundai_Veh_Purc_Import",
    ID: 1250,
    queries: [
      `CREATE TABLE [dbo].[Hyundai_Veh_Purc_Import](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Main_Dealer] [varchar](50) NULL,
              [Dealer] [varchar](50) NULL,
              [HMI_Invoice_Date] [date] NULL,
              [HMI_Invoice_No] [varchar](50) NULL,
              [Excise_Invoice_No] [varchar](50) NULL,
              [Order_Date] [date] NULL,
              [Order_No] [varchar](50) NULL,
              [Model] [varchar](50) NULL,
              [Variant] [varchar](50) NULL,
              [Color] [varchar](50) NULL,
              [Vin_No] [varchar](50) NULL,
              [FSC] [varchar](50) NULL,
              [Variant_Code] [varchar](50) NULL,
              [Engine_No] [varchar](50) NULL,
              [Financier_Name] [varchar](50) NULL,
              [Departure_Date] [date] NULL,
              [Lot_Number] [varchar](50) NULL,
              [Transporter_Name] [varchar](50) NULL,
              [Transporter_Vehicle_No] [varchar](50) NULL,
              [Basic_Price] [varchar](50) NULL,
              [Freight_Insurance] [varchar](50) NULL,
              [Total_Invoice_value] [varchar](50) NULL,
              [IGST_Perc] [varchar](50) NULL,
              [IGST] [varchar](50) NULL,
              [SGST_Perc] [varchar](50) NULL,
              [SGST] [varchar](50) NULL,
              [CGST_Perc] [varchar](50) NULL,
              [CGST] [varchar](50) NULL,
              [Comp_Cess_Perc] [varchar](50) NULL,
              [Comp_Cess] [varchar](50) NULL,
              [TCS_Perc] [varchar](50) NULL,
              [TCS_Value] [varchar](50) NULL,
              [HMI_Invoice_Amount] [varchar](50) NULL,
              [HSN_Code] [varchar](50) NULL,
              [Emission_Type] [varchar](50) NULL,
              [Quantity] [varchar](50) NULL,
              [GRN_No] [varchar](50) NULL,
              [GRN_Date] [date] NULL,
              [Sale_Tax] [varchar](50) NULL,
              [FOB_Key] [varchar](50) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [location] [varchar](20) NULL,
        PRIMARY KEY CLUSTERED
        (
              [UTD] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]
        WITH
        (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Hyundai_Veh_Purc_Import_Hst])
        )
        
        ALTER TABLE [dbo].[Hyundai_Veh_Purc_Import] ADD  DEFAULT (getdate()) FOR [Created_At]
        
        ALTER TABLE [dbo].[Hyundai_Veh_Purc_Import] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "demo_car_gatepass",
    ID: 1251,
    queries: [`ALTER TABLE demo_car_gatepass ALTER COLUMN Quantity FLOAT`],
  },
  {
    comments: "Hyundai_Workshop_Bill_Import",
    ID: 1252,
    queries: [
      `CREATE TABLE [dbo].[Hyundai_Workshop_Bill_Import](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Main_Dealer] [varchar](200) NULL,
              [Dealer] [varchar](200) NULL,
              [GST_Invoice_No] [varchar](100) NULL,
              [GST_Invoice_Date] [date] NULL,
              [Payment_Type] [varchar](100) NULL,
              [Invoiced_To] [varchar](100) NULL,
              [GSTN_Number] [varchar](100) NULL,
              [Customer_Type] [varchar](100) NULL,
              [Type_of_Party] [varchar](100) NULL,
              [GST_Invoice_Type] [varchar](100) NULL,
              [Customer_Name] [varchar](200) NULL,
              [State] [varchar](100) NULL,
              [Country] [varchar](100) NULL,
              [Mobile_No] [varchar](100) NULL,
              [VIN] [varchar](100) NULL,
              [Vehicle_Reg_No] [varchar](100) NULL,
              [Model] [varchar](100) NULL,
              [Work_Type] [varchar](100) NULL,
              [R_O_No] [varchar](100) NULL,
              [Service_Advisor] [varchar](100) NULL,
              [R_O_Close_Date] [varchar](100) NULL,
              [Total_Amt] [varchar](100) NULL,
              [Total_Amt_TCS_Tax_Included] [varchar](100) NULL,
              [Spares_5_Perc] [varchar](100) NULL,
              [Spares_12_Perc] [varchar](100) NULL,
              [Spares_18_Perc] [varchar](100) NULL,
              [Spares_28_Perc] [varchar](100) NULL,
              [Spares_Bodyshop_5_Perc] [varchar](100) NULL,
              [Spares_Bodyshop_12_Perc] [varchar](100) NULL,
              [Spares_Bodyshop_18_Perc] [varchar](100) NULL,
              [Spares_Bodyshop_28_Perc] [varchar](100) NULL,
              [Accessories_6_Perc] [varchar](100) NULL,
              [Accessories_12_Perc] [varchar](100) NULL,
              [Accessories_18_Perc] [varchar](100) NULL,
              [Accessories_28_Perc] [varchar](100) NULL,
              [Number_Plate] [varchar](100) NULL,
              [Battery_Tyres_Tube] [varchar](100) NULL,
              [Warranty_Spares] [varchar](100) NULL,
              [Antirust_Treatment] [varchar](100) NULL,
              [Consumables_5_Perc] [varchar](100) NULL,
              [Consumables_18_Perc] [varchar](100) NULL,
              [Consumables_28_Perc] [varchar](100) NULL,
              [Oil_Lubricants_5_Perc] [varchar](100) NULL,
              [Oil_Lubricants_18_Perc] [varchar](100) NULL,
              [Oil_Lubricants_28_Perc] [varchar](100) NULL,
              [Paint_Material] [varchar](100) NULL,
              [Surface_Refinement_Material] [varchar](100) NULL,
              [Taflon_Coating] [varchar](100) NULL,
              [Under_Chessis_Coating] [varchar](100) NULL,
              [Uphoistery_Cleaning] [varchar](100) NULL,
              [UV_Coating_Material] [varchar](100) NULL,
              [Lacquer_Coating] [varchar](100) NULL,
              [Labour_Service] [varchar](100) NULL,
              [Labour_Bodyshop] [varchar](100) NULL,
              [CGST_Labor] [varchar](100) NULL,
              [SGST_Labor] [varchar](100) NULL,
              [IGST_Labor] [varchar](100) NULL,
              [One_Perc_Cess_Lbr] [varchar](100) NULL,
              [Labour_Warranty] [varchar](100) NULL,
              [Labour_Free_Service] [varchar](100) NULL,
              [Car_Care] [varchar](100) NULL,
              [Breakdown_ERS] [varchar](100) NULL,
              [Emission_Testing] [varchar](100) NULL,
              [Parking_Estimation] [varchar](100) NULL,
              [Labour_Towing] [varchar](100) NULL,
              [CGST_Part_0_Perc] [varchar](100) NULL,
              [SGST_Part_0_Perc] [varchar](100) NULL,
              [IGST_Part_0_Perc] [varchar](100) NULL,
              [CGST_Part_5_Perc] [varchar](100) NULL,
              [SGST_Part_5_Perc] [varchar](100) NULL,
              [IGST_Part_5_Perc] [varchar](100) NULL,
              [CGST_Part_12_Perc] [varchar](100) NULL,
              [SGST_Part_12_Perc] [varchar](100) NULL,
              [IGST_Part_12_Perc] [varchar](100) NULL,
              [CGST_Part_18_Perc] [varchar](100) NULL,
              [SGST_Part_18_Perc] [varchar](100) NULL,
              [IGST_Part_18_Perc] [varchar](100) NULL,
              [CGST_Part_28_Perc] [varchar](100) NULL,
              [SGST_Part_28_Perc] [varchar](100) NULL,
              [IGST_Part_28_Perc] [varchar](100) NULL,
              [CGST_Part] [varchar](100) NULL,
              [SGST_Part] [varchar](100) NULL,
              [One_Perc_Cess_Part] [varchar](100) NULL,
              [Round_Off] [varchar](100) NULL,
              [TCS_Tax] [varchar](100) NULL,
              [EInvoice_IRN_No] [varchar](100) NULL,
              [EInvoice_Acknowledgement_Date] [date] NULL,
              [HSN_SAC_Code] [varchar](100) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [location] [varchar](100) NULL,
        PRIMARY KEY CLUSTERED
        (
              [UTD] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]
        WITH
        (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Hyundai_Workshop_Bill_Import_Hst])
        )
        
        ALTER TABLE [dbo].[Hyundai_Workshop_Bill_Import] ADD  DEFAULT (getdate()) FOR [Created_At]
        
        
        ALTER TABLE [dbo].[Hyundai_Workshop_Bill_Import] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "Hyundai_Purchase_Summary_Import",
    ID: 1253,
    queries: [
      `CREATE TABLE [dbo].[Hyundai_Purchase_Summary_Import](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Invoice_No] [varchar](50) NULL,
              [Invoice_Date] [date] NULL,
              [Supplier] [varchar](50) NULL,
              [Code_Name] [varchar](50) NULL,
              [GC] [varchar](50) NULL,
              [Transpoter] [varchar](50) NULL,
              [GR_No] [varchar](50) NULL,
              [GR_Type] [varchar](50) NULL,
              [GR_Date] [date] NULL,
              [Materail_Value] [varchar](20) NULL,
              [CST_VAT] [varchar](20) NULL,
              [Insurance] [varchar](20) NULL,
              [Freight] [varchar](20) NULL,
              [Other] [varchar](20) NULL,
              [TXBL_AMT] [varchar](20) NULL,
              [SGST] [varchar](20) NULL,
              [CGST] [varchar](20) NULL,
              [IGST] [varchar](20) NULL,
              [TCS] [varchar](20) NULL,
              [Total] [varchar](20) NULL,
              [IRN_NO] [varchar](100) NULL,
              [IRN_DT] [date] NULL,
              [location] [varchar](20) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        PRIMARY KEY CLUSTERED
        (
              [UTD] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]
        WITH
        (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Hyundai_Purchase_Summary_Import_Hst])
        )
        
        
        ALTER TABLE [dbo].[Hyundai_Purchase_Summary_Import] ADD  DEFAULT (getdate()) FOR [Created_At]
        
        
        ALTER TABLE [dbo].[Hyundai_Purchase_Summary_Import] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "Hyundai_Counter_Summary_Import",
    ID: 1254,
    queries: [
      `CREATE TABLE [dbo].[Hyundai_Counter_Summary_Import](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Invoice_No_Ro_Bill_No] [varchar](100) NULL,
              [Sales_Date] [date] NULL,
              [Sales_Type] [varchar](100) NULL,
              [Invoice_Type] [varchar](100) NULL,
              [RO_Type] [varchar](100) NULL,
              [Cash_Credit] [varchar](100) NULL,
              [Customer_Code] [varchar](100) NULL,
              [Veh_Regn_No_Pan_No] [varchar](100) NULL,
              [Discount_Amount] [varchar](100) NULL,
              [Taxable_Value_VAT] [varchar](100) NULL,
              [Taxable_Value_CST] [varchar](100) NULL,
              [Taxable_Value] [varchar](100) NULL,
              [Workshop_Labor] [varchar](100) NULL,
              [Service_Tax] [varchar](100) NULL,
              [Cess] [varchar](100) NULL,
              [VAT_Value] [varchar](100) NULL,
              [CST_Value] [varchar](100) NULL,
              [Value_K_CESS_Amount] [varchar](100) NULL,
              [Value_SGST] [varchar](50) NULL,
              [Value_CGST] [varchar](100) NULL,
              [Value_IGST] [varchar](100) NULL,
              [Value_TCS] [varchar](100) NULL,
              [Freight_insurance] [varchar](100) NULL,
              [VAT_on_Labour] [varchar](100) NULL,
              [Value_FRG_INS_SGST] [varchar](100) NULL,
              [Value_FRG_INS_CGST] [varchar](100) NULL,
              [Value_FRG_INS_IGST] [varchar](100) NULL,
              [H_Cess] [varchar](100) NULL,
              [Invoice_Value] [varchar](100) NULL,
              [IRN_NO] [varchar](100) NULL,
              [IRN_DT] [date] NULL,
              [location] [varchar](100) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        PRIMARY KEY CLUSTERED
        (
              [UTD] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]
        WITH
        (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Hyundai_Counter_Summary_Import_Hst])
        )
        
        
        ALTER TABLE [dbo].[Hyundai_Counter_Summary_Import] ADD  DEFAULT (getdate()) FOR [Created_At]
        
        
        ALTER TABLE [dbo].[Hyundai_Counter_Summary_Import] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1255,
    queries: [`ALTER TABLE PURCHASE_ORDER ADD department VARCHAR(20) NULL`],
  },
  {
    comments: "New_dev_Code",
    ID: 1256,
    queries: [
      `ALTER TABLE InventoryItems ADD [Root_Part_No] [nvarchar](40) NULL`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1257,
    queries: [
      `ALTER TABLE RTL_MST ADD [PURCHASE_DATE] [datetime] NULL`,
      `ALTER TABLE COMP_KEYDATA ADD [Allot_Chassis_Appr] [int] NULL`,
      `ALTER TABLE COMP_KEYDATA ADD [Auto_DeAllot_Days] [int] NULL`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1258,
    queries: [`ALTER TABLE COMP_KEYDATA ADD [Auto_DeAllot_Days] [int] NULL`],
  },
  {
    comments: "New_dev_Code",
    ID: 1259,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD [Allot_Appr_All] [Int](10) NULL`,
      `ALTER TABLE COMP_KEYDATA ADD [Min_Ageing_Appr] [Int](10) NULL`,
      `ALTER TABLE rtl_mst ADD [Extend_Flag] [varchar](10) NULL`,
      `ALTER TABLE COMP_KEYDATA ADD [Safe_Allot_Per] [Int] NULL`,
      `ALTER TABLE rtl_mst ADD [create_by] [varchar](100) NULL`,
      `ALTER TABLE rtl_mst ADD [Mob_Ver] [varchar](10) NULL`,
      `ALTER TABLE rtl_mst ADD [Is_Old_Car] [varchar](10) NULL`,
      `ALTER TABLE rtl_mst ADD [Old_Car_Remark] [varchar](300) NULL`,
    ],
  },
  {
    comments: "Rtl_Cost_Dtl",
    ID: 1260,
    queries: [
      `CREATE TABLE [dbo].[Rtl_Cost_Dtl](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [TRAN_ID] [int] NULL,
        
              [Is_Add_On1] [int] NULL,
              [Sub_Add_On1] [int] NULL,
              [Price1] [Money] NULL,
        
              [Is_Add_On2] [int] NULL,
              [Sub_Add_On2] [int] NULL,
              [Price2] [Money] NULL,
        
              [Is_Add_On3] [int] NULL,
              [Sub_Add_On3] [int] NULL,
              [Price3] [Money] NULL,
        
              [Is_Add_On4] [int] NULL,
              [Sub_Add_On4] [int] NULL,
              [Price4] [Money] NULL,
        
              [Is_Add_On5] [int] NULL,
              [Sub_Add_On5] [int] NULL,
              [Price5] [Money] NULL,
        
              [Is_Add_On6] [int] NULL,
              [Sub_Add_On6] [int] NULL,
              [Price6] [Money] NULL,
        
              [Is_Add_On7] [int] NULL,
              [Sub_Add_On7] [int] NULL,
              [Price7] [Money] NULL,
        
              [Is_Add_On8] [int] NULL,
              [Sub_Add_On8] [int] NULL,
              [Price8] [Money] NULL,
        
              [Is_Add_On9] [int] NULL,
              [Sub_Add_On9] [int] NULL,
              [Price9] [Money] NULL,
        
              [Is_Add_On10] [int] NULL,
              [Sub_Add_On10] [int] NULL,
              [Price10] [Money] NULL,
        
              [Is_Add_On11] [int] NULL,
              [Sub_Add_On11] [int] NULL,
              [Price11] [Money] NULL,
        
              [Is_Add_On12] [int] NULL,
              [Sub_Add_On12] [int] NULL,
              [Price12] [Money] NULL,
        
              [Is_Add_On13] [int] NULL,
              [Sub_Add_On13] [int] NULL,
              [Price13] [Money] NULL,
        
              [Is_Add_On14] [int] NULL,
              [Sub_Add_On14] [int] NULL,
              [Price14] [Money] NULL,
        
              [Is_Add_On15] [int] NULL,
              [Sub_Add_On15] [int] NULL,
              [Price15] [Money] NULL,
        
              Loc_Code [int] NULL,
              Export_Type [int] NULL,
              [Created_At] [datetime] NULL,
              [Created_by] [varchar](100) NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
              [timestamp] [datetime] NULL,
        PRIMARY KEY CLUSTERED
        (
              [UTD] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]
        WITH
        (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Rtl_Cost_Dtl_Hst])
        )
        
        ALTER TABLE [dbo].[Rtl_Cost_Dtl] ADD  DEFAULT (getdate()) FOR [Created_At]`,
    ],
  },
  {
    comments: "Hyundai_Price_List",
    ID: 1262,
    queries: [
      `CREATE TABLE [dbo].[Hyundai_Price_List](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [Model_Code] [varchar](300) NULL,
        [Add_On] [varchar](50) NULL,
        [Sub_Add_On] [varchar](50) NULL,
        [Price] [varchar](30) NULL,
        [With_Effective_From] [datetime] NULL,
        [Enter_Date] [datetime] NULL,
        [Created_By] [varchar](255) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Hyundai_Price_List_Hst])
      )
      
      ALTER TABLE [dbo].[Hyundai_Price_List] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[Hyundai_Price_List] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "Hyundai_whatsapp_message_schedular",
    ID: 1263,
    queries: [
      `CREATE TABLE [dbo].[Hyundai_whatsapp_message_schedular](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [Dlr_Name] [varchar](10) NULL,
        [Message_Type] [varchar](200) NULL,
        [Days] [int] NULL,
        [Hours] [varchar](10) NULL,
        [Created_By] [varchar](255) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        [Dlr_Type] [varchar](200) NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Hyundai_whatsapp_message_schedular_Hst])
      )
      
      ALTER TABLE [dbo].[Hyundai_whatsapp_message_schedular] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[Hyundai_whatsapp_message_schedular] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "DemoCar_Ques",
    ID: 1264,
    queries: [
      `ALTER TABLE DemoCar_ans ADD Module_Code varchar(200) null`,
      `ALTER TABLE DemoCar_Ques ADD Module_Code varchar(200) null`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1265,
    queries: [
      `ALTER TABLE rtl_mst ALTER COLUMN DSE_Gen NVARCHAR(20) null`,
      `ALTER TABLE rtl_mst ALTER COLUMN DSE_Reg NVARCHAR(20) null`,
      `ALTER TABLE [Asset_Issue] ADD [Asset_category] [varchar](200) NULL`,
      `ALTER TABLE [Asset_Issue] ADD [It_category] [varchar](200) NULL`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1266,
    queries: [
      `ALTER TABLE RTL_MST ADD IS_CUSTOMER_FEEDBACK VARCHAR(20) NULL`,
      `ALTER TABLE RTL_MST ADD IS_CATELOG VARCHAR(20) NULL`,
      `ALTER TABLE RTL_MST ADD IS_PRICE_LIST VARCHAR(20) NULL`,
      `ALTER TABLE RTL_MST ADD IS_VIDEO VARCHAR(20) NULL`,
      `ALTER TABLE DealSheet_Master ADD [Export_Type] [int] NULL`,
      `ALTER TABLE RTL_MST ALTER COLUMN Old_Car_Remark VARCHAR(500)`,
      `ALTER TABLE Demo_Car_Gatepass ADD DOCUMENT_PATH VARCHAR(200)`,
      `ALTER TABLE Rtl_Mst ADD [Dlv_Add1] [varchar](300) NULL`,
      `ALTER TABLE Rtl_Mst ADD [Dlv_Add2] [varchar](300) NULL`,
      `ALTER TABLE Rtl_Mst ADD [Dlv_Add3] [varchar](300) NULL`,
      `ALTER TABLE Rtl_Mst ADD [HSN_No] [varchar](30) NULL`,
      `ALTER TABLE Rtl_Mst ADD [Cess_Perc] INT NULL`,
      `ALTER TABLE Rtl_Mst ADD [Gst_Perc] INT NULL`,
    ],
  },
  {
    comments: "Department_Branch_Approval_Matrix",
    ID: 1267,
    queries: [
      `CREATE TABLE [dbo].[Department_Branch_Approval_Matrix](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [module_code] [varchar](20) NULL,
        [department] [varchar](20) NULL,
        [branch] [varchar](20) NULL,
        [approver1_A] [varchar](20) NULL,
        [approver1_B] [varchar](20) NULL,
        [approver1_C] [varchar](20) NULL,
        [approver2_A] [varchar](20) NULL,
        [approver2_B] [varchar](20) NULL,
        [approver2_C] [varchar](20) NULL,
        [approver3_A] [varchar](25) NULL,
        [approver3_B] [varchar](25) NULL,
        [approver3_C] [varchar](25) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        [Created_by] [varchar](30) NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Department_Branch_Approval_Matrix_Hst])
      )
      
      ALTER TABLE [dbo].[Department_Branch_Approval_Matrix] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[Department_Branch_Approval_Matrix] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "New_dev_Code",
    ID: 1268,
    queries: [
      `ALTER TABLE RTL_MST ADD IS_PAN VARCHAR(20) NULL`,
      `ALTER TABLE RTL_MST ADD IS_AADHAR VARCHAR(20) NULL`,
      `ALTER TABLE rtl_mst ADD DO_REC_AMT VARCHAR(20) NULL`,
      `ALTER TABLE rtl_mst ADD DO_REC_DATE DATETIME NULL`,
      `ALTER TABLE  rtl_mst ADD VIN_NO VARCHAR(50) NULL`,
      `ALTER TABLE Enq_Dtl ALTER COLUMN ColumnName NVARCHAR(NewLength)`,
      `ALTER TABLE rtl_mst ADD [Pre_Invoice_Dtl] [varchar](500) NULL`,
      `ALTER TABLE rtl_mst ADD [Invoice_Dtl] [varchar](500) NULL`,
      `ALTER TABLE rtl_mst ALTER COLUMN INV_No NVARCHAR(20) NULL`,
      `ALTER TABLE ASSET_PRODUCT ADD [AssetCode] [varchar](50) NULL`,
      `ALTER TABLE ASSET_PRODUCT ADD	[Min_Qty] [varchar](10) NULL`,
      `ALTER TABLE assets_group ALTER COLUMN [icon] VARCHAR(255) NULL`,
      `ALTER TABLE assets_group_subcategory  ALTER COLUMN [icon] VARCHAR(255) NULL`,
      `ALTER TABLE APPROVER_LINK ADD LINK_TYPE VARCHAR(100) NULL`,
      `ALTER TABLE APPROVER_LINK ADD LOC_CODE VARCHAR(20) NULL`,
    ],
  },
  {
    comments: "APPROVER_LINK",
    ID: 1269,
    queries: [
      `CREATE TABLE [dbo].[APPROVER_LINK](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [TRAN_ID] [Nvarchar](10) NULL,
              [Module_Type] [Nvarchar](100) NULL,
              [Appr_Empcode] [Nvarchar](20) NULL,
              [Appr_page_link] [Nvarchar](500) NULL,
              [Created_By] [varchar](255) NULL,
              [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        PRIMARY KEY CLUSTERED
        (
              [UTD] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]
        WITH
        (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[APPROVER_LINK_Hst])
        )
        
        
        ALTER TABLE [dbo].[APPROVER_LINK] ADD  DEFAULT (getdate()) FOR [Created_At]
        
        
        ALTER TABLE [dbo].[APPROVER_LINK] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "APPROVER_LINK",
    ID: 1270,
    queries: [`ALTER TABLE Purchase_Order ADD Vendor_Email VARCHAR(100) NULL`],
  },
  {
    comments: "RTL_MST",
    ID: 1271,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD PO_Automail VARCHAR(20) NULL`,
      `ALTER TABLE rtl_mst ALTER COLUMN ENQ_ID INT`,
      `ALTER TABLE PURCHASE_ORDER ADD PdfPath VARCHAR(255) NULL`,
      `ALTER TABLE RTL_MST ADD Prefix NVARCHAR(30)`,
    ],
  },
  {
    comments: "APPROVER_LINK",
    ID: 1272,
    queries: [
      `CREATE TABLE [dbo].[Doc_prefix](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [Comp_Code] [INT] NULL,
        [Enq_Prefix] [varchar](50) NULL,
          [Quotation_Pefix] [varchar](50) NULL,
        [DelvChalan_Prefix] [varchar](50) NULL,
          [Veh_Inv_Prefix] [varchar](50) NULL,
           [Loc_Code] [varchar](50) NULL,
        [Created_By] [varchar](255) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Doc_prefix_Hst])
      )
      
      ALTER TABLE [dbo].[Doc_prefix] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[Doc_prefix] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "DocketMst",
    ID: 1273,
    queries: [
      `ALTER TABLE DocketMst ADD Export_type VARCHAR(50);`,
      `ALTER TABLE DocketMst ADD DELETED_BY VARCHAR(50)`,
    ],
  },
  {
    comments: "User_Rights",
    ID: 1274,
    queries: [`ALTER TABLE User_Rights ADD Comp_Usercode int null`],
  },
  {
    comments: "User_Rights",
    ID: 1275,
    queries: [
      `ALTER TABLE attendancetable ALTER COLUMN Short_Lev DECIMAL(12, 2)`,
    ],
  },
  {
    comments: "rtl_mst",
    ID: 1276,
    queries: [
      ` ALTER TABLE rtl_mst ADD [Irn_No] [varchar](300) NULL`,
      `ALTER TABLE rtl_mst ADD [Ack_No] [BIGINT] NULL`,
      `ALTER TABLE rtl_mst ADD [Ack_Date] [datetime] NULL`,
    ],
  },
  {
    comments: "User_Rights",
    ID: 1283,
    queries: [
      `CREATE TABLE [RTL_CLOUD](
        [TRAN_ID] [int] NULL,
        [Export_Type] [int] NULL,
      Irn_Flag [int] NULL)`,
    ],
  },
  {
    comments: "rtl_mst",
    ID: 1284,
    queries: [
      `ALTER TABLE CHAS_MST alter column  Clr_Abbr NVARCHAR(50)`,
      `alter table Hyundai_Price_List ADD [Modl_Grp] [varchar](500) NULL`,
      `alter table Hyundai_Price_List ADD [Modl_Variant] [varchar](500) NULL`,
      `alter table Hyundai_Price_List ADD [Export_Type] [int] NULL`,
      `alter table Rtl_Cost_Dtl ADD [IS_QUOTATION_Y_N] [nvarchar](10) NULL`,
    ],
  },
  {
    comments: "STK_TRF",
    ID: 1285,
    queries: [
      `CREATE TABLE [dbo].[STK_TRF](
            [Tran_id] [int] NULL,
            [Tran_type] [int] NULL,
            [Export_type] [int] NULL
      ) ON [PRIMARY] 
      GO`,
    ],
  },
  {
    comments: "EMP_DOCS",
    ID: 1286,
    queries: [
      `ALTER TABLE [EMP_DOCS] ADD [Seq_No] [int] NULL`,
      `ALTER TABLE  [EMP_DOCS] ADD [refindex] [varchar](20) NULL`,
    ],
  },
  {
    comments: "RTL_MST",
    ID: 1287,
    queries: [
      `ALTER TABLE RTL_MST ADD HOT_WARM_STATUS VARCHAR(20) NULL`,
      `ALTER TABLE rtl_mst ADD [Cancel_Invoice_Dtl] [varchar](700) NULL`,
      `ALTER TABLE comp_keydata ADD HOD_HR VARCHAR(20) NULL`,
      `ALTER TABLE comp_keydata ADD HOD_Sales VARCHAR(20) NULL`,
      `ALTER TABLE comp_keydata ADD HOD_Service VARCHAR(20) NULL`,
      `ALTER TABLE comp_keydata ADD HOD_TV VARCHAR(20) NULL`,
      `ALTER TABLE Employeemaster ADD BONUS VARCHAR(25) NULL`,
    ],
  },
  {
    comments: "INSU_ENTRY",
    ID: 1288,
    queries: [
      `ALTER TABLE INSU_ENTRY ADD EXPORT_TYPE INT NULL`,
      `ALTER TABLE COMP_KEYDATA ADD [Banking_Payment_Link] [int] NULL`,
    ],
  },
  {
    comments: "Purchase_Order",
    ID: 1289,
    queries: [
      `ALTER TABLE Purchase_Order ADD Vendor_Address VARCHAR(700)NULL`,
      `ALTER TABLE Purchase_Order ADD Vendor_Contact_Name VARCHAR(200)NULL`,
      `ALTER TABLE Purchase_Order ADD Vendor_Phone_No VARCHAR(20)NULL`,
    ],
  },
  {
    comments: "Purchase_Order",
    ID: 1290,
    queries: [
      `ALTER TABLE Purchase_Order ADD [AutoMailerStatus] [varchar](20) NULL`,
    ],
  },
  {
    comments: "Employee_Education",
    ID: 1291,
    queries: [
      `ALTER TABLE Employee_ITSkill ADD Utd INT IDENTITY(1,1) PRIMARY KEY`,
      `ALTER TABLE Employee_Language ADD Utd INT IDENTITY(1,1) PRIMARY KEY`,
      `ALTER TABLE Employee_Experience ADD Utd INT IDENTITY(1,1) PRIMARY KEY`,
      `ALTER TABLE Employee_Family ADD Utd INT IDENTITY(1,1) PRIMARY KEY`,
      `ALTER TABLE Employee_Reference ADD Utd INT IDENTITY(1,1) PRIMARY KEY`,
      `ALTER TABLE [COMP_KEYDATA] ADD [Maruti_Logo] [varchar](500) NULL`,
      `CREATE TABLE [dbo].[Employee_Education](
        [Emp_Code] [nvarchar](10) NULL,
        [Emp_Srno] [nvarchar](10) NULL,
        [Emp_Degree] [nvarchar](30) NULL,
        [Emp_Board] [nvarchar](30) NULL,
        [Emp_College] [nvarchar](30) NULL,
        [Emp_Passing_year] [nvarchar](4) NULL,
        [Emp_Percentage] [money] NULL,
        [Export_Type] [int] NULL,
        [Loc_Code] [int] NULL,
        [Serverid] [int] NULL,
        [SrNo] [int] NULL,
        [LASTMODI_BY] [varchar](50) NULL,
        [LASTMODI_ON] [date] NULL,
        [CREATED_BY] [varchar](50) NULL,
        [CREATED_ON] [date] NULL,
        [Utd] [int] IDENTITY(1,1) NOT NULL,
      PRIMARY KEY CLUSTERED 
      (
        [Utd] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
      ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "TV_ICM_MST",
    ID: 1292,
    queries: [
      `ALTER TABLE TV_ICM_MST ADD [Purchase_Type] [VARCHAR](20) NULL`,
      `CREATE FUNCTION [dbo].[SplitString]
      (
          @String NVARCHAR(MAX),
          @Delimiter CHAR(1)
      )
      RETURNS @Results TABLE (Item NVARCHAR(MAX))
      AS
      BEGIN
          DECLARE @Index INT
          DECLARE @Slice NVARCHAR(MAX)

          SELECT @Index = 1
          WHILE @Index != 0
          BEGIN
              SELECT @Index = CHARINDEX(@Delimiter, @String)
              IF @Index != 0
                  SELECT @Slice = LEFT(@String, @Index - 1)
              ELSE
                  SELECT @Slice = @String

              INSERT INTO @Results(Item) VALUES(@Slice)
              SELECT @String = RIGHT(@String, LEN(@String) - @Index)
              IF LEN(@String) = 0 BREAK
          END
          RETURN
      END`,
      `ALTER PROCEDURE [dbo].[GetEmployeeLocation]
      @EmployeeCode NVARCHAR(50),
      @Latitude VARCHAR(20),
      @Longitude VARCHAR(20),
      @BufferMeters FLOAT = 30 -- New parameter for buffer (default 30 meters)
  AS
  BEGIN
      SET NOCOUNT ON;

      DECLARE @GeoLocationStrings NVARCHAR(MAX);
      DECLARE @Geofence GEOMETRY;
      DECLARE @Geofence_concat VARCHAR(300);
      DECLARE @Usergeofence VARCHAR(5);
      DECLARE @LocationFound BIT = 0;
      DECLARE @BufferDegrees FLOAT = @BufferMeters / 111000; -- Convert meters to degrees (~111km per degree)

      -- Check if the user has the right to apply from anywhere
      DECLARE @Permission NVARCHAR(5);

      -- Check user permissions
      SELECT @Permission = COALESCE((
          SELECT TOP 1
              CASE
                  WHEN Optn_Name = '1.1.1.2' THEN 'ALL'
                  WHEN Optn_Name = '1.1.1.1' THEN 'USER'
              END
          FROM Mobile_Rights
          WHERE Emp_Code = @EmployeeCode AND Optn_Name IN ('1.1.1.1', '1.1.1.2')
      ), 'ALLOW');

      -- Fetch geofences based on permissions
      IF @Permission = 'ALLOW'
      BEGIN
          -- Return 1 if no permissions are found, implying 'ALLOW'
          SELECT 1 AS Result;
          RETURN;
      END
      ELSE IF @Permission = 'ALL'
      BEGIN
          -- Fetch geofences for all locations
          SELECT @GeoLocationStrings = STUFF((
              SELECT '|' + CAST(Spl_Rem AS NVARCHAR(MAX))
              FROM Misc_Mst
              WHERE Misc_Type = 85 AND Export_Type < 3
              FOR XML PATH('')), 1, 1, '')
      END
      ELSE IF @Permission = 'USER'
      BEGIN
          -- Fetch geofences only for user's assigned locations
          SELECT @GeoLocationStrings = STUFF((
              SELECT '@' + CAST(Spl_Rem AS NVARCHAR(MAX))
              FROM Misc_Mst
              WHERE Misc_Code IN (
                  SELECT Location
                  FROM EMPLOYEEMASTER
                  WHERE EMPCODE = @EmployeeCode AND Export_Type < 3
              )
              AND Misc_Type = 85 AND Export_Type < 3
              FOR XML PATH('')), 1, 1, '')
      END

      IF @GeoLocationStrings IS NULL
      BEGIN
          SELECT 'Geo location is not set for the specified locations' AS Result;
          RETURN;
      END

      -- Loop through each geofence using the custom split function
      DECLARE @GeoString NVARCHAR(300);
      DECLARE GeoCursor CURSOR FOR
      SELECT Item FROM dbo.SplitString(@GeoLocationStrings, '|');

      OPEN GeoCursor;
      FETCH NEXT FROM GeoCursor INTO @GeoString;

      WHILE @@FETCH_STATUS = 0
      BEGIN
          -- Create a temporary table to hold the coordinates
          CREATE TABLE #TempCoords (Coord NVARCHAR(100));

          -- Split the coordinate string using the custom function
          INSERT INTO #TempCoords
          SELECT Item FROM dbo.SplitString(@GeoString, '@');

          -- Build the polygon string (FIXED THIS SECTION)
          SELECT @Geofence_concat = 'POLYGON((' + STUFF((
              SELECT ',' +
                  CONVERT(NVARCHAR(MAX), CAST(SUBSTRING(Coord, 1, CHARINDEX(',', Coord) - 1) AS DECIMAL(30, 6))) + ' ' +
                  CONVERT(NVARCHAR(MAX), CAST(SUBSTRING(Coord, CHARINDEX(',', Coord) + 1, LEN(Coord)) AS DECIMAL(30, 6)))
              FROM #TempCoords
              FOR XML PATH('')), 1, 1, '') + '))';

          DROP TABLE #TempCoords;

          -- Create geometry with buffer
          SET @Geofence = GEOMETRY::STGeomFromText(@Geofence_concat, 4326).STBuffer(@BufferDegrees);

          -- Check if the point is within the buffered geofence
          IF @Geofence.STContains(GEOMETRY::STPointFromText('POINT(' + @Latitude + ' ' + @Longitude + ')', 4326)) = 1
          BEGIN
              SET @LocationFound = 1;
              BREAK;
          END;

          FETCH NEXT FROM GeoCursor INTO @GeoString;
      END;

      CLOSE GeoCursor;
      DEALLOCATE GeoCursor;

      -- Return the result
      IF @LocationFound = 1
          SELECT '1' AS Result;
      ELSE
          SELECT '0' AS Result;
  END`,
    ],
  },
  {
    comments: "RTL_MST",
    ID: 1293,
    queries: [
      `ALTER TABLE RTL_MST ADD DSE_TL VARCHAR(100) NULL`,
      `	 ALTER TABLE NewCar_AuditLogs ADD [Type] [varchar](10) NULL`,
      `ALTER TABLE NewCar_AuditLogs ADD [status] [varchar](10) NULL`,
      `CREATE TABLE [dbo].[CHAS_TRANSIT](
        [Tran_Id] [int] NOT NULL,
        [CHAS_ID] [int] NULL,
        [TRAN_TYPE] [int] NULL,
        [Tran_Date] [date] NULL,
        [Tran_Amt] [money] NULL,
        [Asset_Ledg] [int] NULL,
        [Income_Ledg] [int] NULL,
        [Loc_Code] [int] NULL,
        [Export_Type] [int] NULL,
        [Item_Type] [int] NULL,
        [Item_Seq] [int] NULL
      ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "RTL_MST",
    ID: 1294,
    queries: [
      `ALTER TABLE NEWCAR_AUDITLOGS ADD [Location] [varchar](10) NULL`,
      `alter table Emp_Ded ADD [UTD] INT IDENTITY(1,1)`,
      `alter table Emp_Ded ADD  [Created_by] [nvarchar](30) NULL`,
      `alter table Emp_Ded ADD [Created_At] [datetime] NULL`,
    ],
  },
  {
    comments: "HR_POLICY_VIEW_LOGS",
    ID: 1295,
    queries: [
      `CREATE TABLE [dbo].[HR_POLICY_VIEW_LOGS](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [TRAN_ID] [int] NULL,
        [Req_Date] [datetime] NULL,
        [SRNO] [int] NULL,
        [EMP_CODE] [nvarchar](100) NULL,
        [DOC_NAME] [nvarchar](100) NULL,
        [POLICY_VIEW_FLAG] [int] NULL,
        [LOC_CODE] [int] NULL,
        [Created_By] [varchar](100) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[HR_POLICY_VIEW_LOGS_Hst])
      )
      
      ALTER TABLE [dbo].[HR_POLICY_VIEW_LOGS] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[HR_POLICY_VIEW_LOGS] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,

      `CREATE TABLE [dbo].[Emp_Exit](
        [UID] [int] IDENTITY(1,1) NOT NULL,
        [Tran_id] [int] NULL,
        [Emp_Name] [nvarchar](100) NULL,
        [Emp_Code] [nvarchar](50) NULL,
        [Email] [nvarchar](100) NULL,
        [Mobile_no] [nvarchar](15) NULL,
        [Designation] [nvarchar](100) NULL,
        [Department] [nvarchar](100) NULL,
        [Address] [nvarchar](200) NULL,
        [Joining_Date] [date] NULL,
        [Left_Date] [date] NULL,
        [Emp_Reason] [nvarchar](500) NULL,
        [Emp_Attachment] [nvarchar](500) NULL,
        [HOD_Reason] [nvarchar](500) NULL,
        [HOD_Attachment] [nvarchar](500) NULL,
        [HR_Reason] [nvarchar](500) NULL,
        [HR_Attachment] [nvarchar](500) NULL,
        [Status] [nvarchar](20) NULL,
        [Export_type] [int] NULL,
        [Loc_Code] [int] NULL,
        [Exit_Feedback] [nvarchar](250) NULL,
        [Notice_Period] [nvarchar](50) NULL,
        [NOC_HOD] [nvarchar](10) NULL,
        [NOC_HR] [nvarchar](10) NULL,
        [Actual_Left_Date] [date] NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UID] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
      ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "RTL_MST",
    ID: 1296,
    queries: [`ALTER TABLE RTL_MST ALTER COLUMN INV_NO INT`],
  },
  {
    comments: "RTL_MST",
    ID: 1297,
    queries: [
      `CREATE TABLE [dbo].[Emp_Slryrun](
        [Utd] [int] IDENTITY(1,1) NOT NULL,
        [Emp_Code] [nvarchar](20) NULL,
        [Rerun] [int] NULL,
        [Type] [nvarchar](10) NULL,
        [Created_by] [nvarchar](30) NOT NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        [SNo] [varchar](10) NULL,
      PRIMARY KEY CLUSTERED 
      (
        [Utd] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Emp_Slryrun_Hst])
      )
      
      ALTER TABLE [dbo].[Emp_Slryrun] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[Emp_Slryrun] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "RTL_MST",
    ID: 1298,
    queries: [
      `ALTER TABLE RTL_MST
    ADD ENTR_TIME  TIME, MOD_DATE   DATE, MOD_TIME   TIME`,
    ],
  },
  {
    comments: "RTL_MST",
    ID: 1299,
    queries: [
      `ALTER TABLE Godown_Mst ADD User_Id VARCHAR(50) NULL`,
      `ALTER TABLE Godown_Mst ADD AroraToken VARCHAR(200) NULL`,
    ],
  },
  {
    comments: "RTL_MST",
    ID: 1300,
    queries: [
      `ALTER TABLE Asset_issue ADD [uploaded_document] [varchar](500) NULL`,
      `ALTER TABLE EMPLOYEE_EDUCATION ADD  [Utd] [int] IDENTITY(1,1) NOT NULL`,
    ],
  },
  {
    comments: "icm_ext",
    ID: 1301,
    queries: [
      `ALTER TABLE [icm_ext] ALTER COLUMN [preinvoice_num] INT NULL`,
      `ALTER TABLE COMP_KEYDATA ADD EmpMasterOtp INT NULL`,
    ],
  },
  {
    comments: "SalaryReportTemplate",
    ID: 1303,
    queries: [
      `CREATE TABLE SalaryReportTemplate (
      id INT PRIMARY KEY IDENTITY,
      user_code VARCHAR(50),
      template_name VARCHAR(100),
      selected_fields VARCHAR(MAX),
      location_fields VARCHAR(MAX),
      created_at DATETIME DEFAULT GETDATE()
    )`,
      `CREATE TABLE [dbo].[Bank_Details](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [BANKNAME] [varchar](100) NULL,
      [ACCOUNT_TYPE] [varchar](100) NULL,
      [BANKACCOUNTNO] [varchar](50) NULL,
      [BRANCH] [varchar](100) NULL,
      [PAYMENTMODE] [varchar](100) NULL,
      [ifsc_code] [varchar](100) NULL,
      [Emp_Ac_Name] [varchar](100) NULL,
      [Sal_Hold] [int] NULL,
      [Export_Type] [int] NULL,
      [Is_Verified] [int] NULL,
      [Created_By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      [EMPCODE] [varchar](100) NULL,
    PRIMARY KEY CLUSTERED 
    (
      [UTD] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
    ) ON [PRIMARY]
    WITH
    (
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Bank_Details_Hst])
    )
    
    ALTER TABLE [dbo].[Bank_Details] ADD  DEFAULT (getdate()) FOR [Created_At]
    
    ALTER TABLE [dbo].[Bank_Details] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "comp_keydata",
    ID: 1304,
    queries: [`ALTER TABLE comp_keydata ADD TVIICM_DELV_CHALLAN INT NULL`],
  },
  {
    comments: "comp_keydata",
    ID: 1305,
    queries: [
      ` ALTER TABLE SALARY_APPROVER ADD LWF VARCHAR (30) NULL`,
      `ALTER TABLE SALARY_APPROVER ADD PFSALARY_LIMIT VARCHAR (30) NULL`,
      ` ALTER TABLE SALARY_APPROVER ADD BONUS_AMOUNT VARCHAR (30) NULL`,
    ],
  },
  {
    comments: "ICM_EXT",
    ID: 1306,
    queries: [`ALTER TABLE ICM_EXT ADD INVOICE_BRANCH VARCHAR(200) NULL`],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1307,
    queries: [`ALTER TABLE COMP_KEYDATA ADD TV_SCRAP INT NULL`],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1307,
    queries: [
      `ALTER TABLE NewCar_AuditLogs ADD Phy_Location1 INT, Phy_Location2 INT`,
      `ALTER TABLE USER_TBL ADD PHY_LOC_CODE VARCHAR(50)`,
      `ALTER TABLE CHAS_MST ADD InTransit INT`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1308,
    queries: [`ALTER TABLE COMP_KEYDATA ADD TV_MODLCODE INT  NULL`],
  },
  {
    comments: "Pan_Aadhar_Log",
    ID: 1309,
    queries: [
      `CREATE TABLE [dbo].[Pan_Aadhar_Log](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
          [Type] [varchar](20) NULL,
                                [Value] [varchar](20) NULL,
                                [Date] [datetime] NULL,
                                [Time] [datetime] NULL, 
                                [user] [varchar](30) NULL,
                                [Export_Type] [int] NULL,
                                [Loc_Code] [int] NULL,
          
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        PRIMARY KEY CLUSTERED 
        (
              [UTD] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]
        WITH
        (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Pan_Aadhar_Log_Hst])
        )
        ALTER TABLE [dbo].[Pan_Aadhar_Log] ADD  DEFAULT (getdate()) FOR [Created_At] `,
    ],
  },
  {
    comments: "Pan_Aadhar_Log",
    ID: 1310,
    queries: [
      `ALTER TABLE ITEM_MST ADD Model_code INT
      ALTER TABLE ITEM_MST ADD DEPR_PERC INT
      ALTER TABLE ITEM_MST ADD ORDR_TYPE INT`,
    ],
  },
  {
    comments: "New_dev_code",
    ID: 1311,
    queries: [
      `CREATE TABLE [dbo].[BANK_ACC_SELECTION](
                [UTD] [int] IDENTITY(1,1) NOT NULL,
                [Loc_code] [int] NULL,
                [From_Account] [int] NULL
              ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "New_dev_code",
    ID: 1312,
    queries: [`Alter table BANK_ACC_SELECTION add Payment_Type nvarchar(10)`],
  },
  {
    comments: "ICM_EXT",
    ID: 1313,
    queries: [
      `Alter table ICM_EXT add INVOICE_BRANCH nvarchar(100)`,
      `EXEC sp_rename 'ICM_EXT.INVOICE_BRANCH', 'PREINVOICE_BRANCH', 'COLUMN'`,
    ],
  },
  {
    comments: "EmployeeMaster",
    ID: 1314,
    queries: [
      `ALTER TABLE EmployeeMaster ADD Dlv_Type VARCHAR(25) NULL`,
      `ALTER TABLE EmployeeMaster ADD DRIVINGLIC_EXPDATE DATE NULL`,
      `ALTER TABLE EmployeeMaster ADD LIN_NO VARCHAR(20) NULL`,
      `ALTER TABLE COMP_KEYDATA ADD LIVE_STOCK_GEOFENCE_FLAG INT, PHY_LOC_FIXED INT`,
      `alter table CHAS_TRF add Out_Time time,In_Time time, Item_Type int`,
      `alter table STK_TRF add Item_Type int`,
      `CREATE PROCEDURE [dbo].[CheckLiveStockLocation]
      @EmployeeCode NVARCHAR(50),
      @Latitude VARCHAR(20),
      @Longitude VARCHAR(20),
      @Login_locCode INT,
      @BufferMeters FLOAT = 30
  AS
  BEGIN
      SET NOCOUNT ON;
  
      DECLARE @SplRem NVARCHAR(MAX);
      DECLARE @Geofence GEOMETRY;
      DECLARE @Geofence_concat VARCHAR(300);
      DECLARE @BufferDegrees FLOAT = @BufferMeters / 111000;
      DECLARE @LocationFound BIT = 0;
  
      -- Step 1: Check LIVE_STOCK_GEOFENCE_FLAG
      IF ISNULL((SELECT TOP 1 LIVE_STOCK_GEOFENCE_FLAG FROM COMP_KEYDATA), 0) <> 1
      BEGIN
          SELECT '1' AS Result;
          RETURN;
      END
  
      -- Step 2: Check SPL_REM for location
      SELECT @SplRem = Spl_Rem
      FROM Misc_Mst
      WHERE Misc_Type = 631 AND Misc_Code = @Login_locCode AND Export_Type < 3;
  
      IF @SplRem IS NULL OR LTRIM(RTRIM(@SplRem)) = ''
      BEGIN
          SELECT '1' AS Result;
          RETURN;
      END
  
      -- Step 3: Build Polygon & Check Location
      CREATE TABLE #TempCoords (Coord NVARCHAR(100));
  
      INSERT INTO #TempCoords
      SELECT Item FROM dbo.SplitString(@SplRem, '@');
  
      SELECT @Geofence_concat = 'POLYGON((' + STUFF((
          SELECT ',' +
              CONVERT(NVARCHAR(MAX), CAST(SUBSTRING(Coord, 1, CHARINDEX(',', Coord) - 1) AS DECIMAL(30, 6))) + ' ' +
              CONVERT(NVARCHAR(MAX), CAST(SUBSTRING(Coord, CHARINDEX(',', Coord) + 1, LEN(Coord)) AS DECIMAL(30, 6)))
          FROM #TempCoords
          FOR XML PATH('')), 1, 1, '') + '))';
  
      DROP TABLE #TempCoords;
  
      SET @Geofence = GEOMETRY::STGeomFromText(@Geofence_concat, 4326).STBuffer(@BufferDegrees);
  
      IF @Geofence.STContains(GEOMETRY::STPointFromText('POINT(' + @Latitude + ' ' + @Longitude + ')', 4326)) = 1
      BEGIN
          SET @LocationFound = 1;
      END
  
      IF @LocationFound = 1
          SELECT '1' AS Result;
      ELSE
          SELECT '0' AS Result;
  END`,
    ],
  },
  {
    comments: "STK_TRF",
    ID: 1315,
    queries: [
      `CREATE TABLE [dbo].[STK_TRF](
            [Tran_id] [int] NULL,
            [Tran_type] [int] NULL,
            [Export_type] [int] NULL,
            [Item_Type] [int] NULL
      ) ON [PRIMARY] `,
    ],
  },
  {
    comments: "STK_TRF",
    ID: 1316,
    queries: [
      `CREATE TABLE [dbo].[STK_TRF](
            [Tran_id] [int] NULL,
            [Tran_type] [int] NULL,
            [Export_type] [int] NULL,
            [Item_Type] [int] NULL
      ) ON [PRIMARY] `,
    ],
  },
  {
    comments: "BANK_POST_UNAPPROVE",
    ID: 1317,
    queries: [
      `CREATE TABLE [dbo].[BANK_POST_UNAPPROVE](
      UTD int identity (1,1),
      [Acnt_Id] [int] NOT NULL,
      [Book_Code] [int] NULL,
      [Approver_1] [int] NULL,
      [App1_Date] [date] NULL,
      [App1_Time] [money] NULL,
      [App1_Rem] [nvarchar](200) NULL,
      [Approver_2] [int] NULL,
      [App2_Date] [date] NULL,
      [App2_Time] [money] NULL,
      [App2_Rem] [nvarchar](200) NULL,
      [Loc_Code] [int] NULL,
      [Export_Type] [int] NULL,
      [ACCOUNT_No] [nvarchar](50) NULL,
      [IFSC] [nvarchar](50) NULL,
      Created_date datetime default getdate()
    ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "ICM_EXT",
    ID: 1318,
    queries: [`Alter table ICM_EXT add INVOICE_BRANCH nvarchar(100)`],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1319,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD TV_SCARP_MODLCODE VARCHAR (100) NULL`,
    ],
  },
  {
    comments: "INV_MST",
    ID: 1320,
    queries: [
      `IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[INV_MST]') AND type in (N'U'))
      DROP TABLE [dbo].[INV_MST]`,
      `CREATE TABLE [dbo].[INV_MST](
        [Tran_Id] [int] NULL,
        [INV_No] [int] NULL,
        [INV_Date] [datetime] NULL,
        [Book_Code] [int] NULL,
        [Tran_Type] [tinyint] NULL,
        [Ledg_Code] [int] NULL,
        [Ledg_Name] [nvarchar](70) NULL,
        [Ledg_Add1] [nvarchar](70) NULL,
        [Ledg_Add2] [nvarchar](70) NULL,
        [Ledg_Add3] [nvarchar](70) NULL,
        [Ordr_No] [nvarchar](15) NULL,
        [Ordr_Date] [datetime] NULL,
        [Sale_Ac] [int] NULL,
        [Spl_Note] [nvarchar](100) NULL,
        [Job_Id] [int] NULL,
        [Req_Id] [int] NULL,
        [Bill_Id] [int] NULL,
        [Est_Id] [int] NULL,
        [Exp_Ledg1] [smallint] NULL,
        [Exp_Perc1] [money] NULL,
        [Exp_Amt1] [money] NULL,
        [Exp_Ledg2] [smallint] NULL,
        [Exp_Perc2] [money] NULL,
        [Exp_Amt2] [money] NULL,
        [Exp_Ledg3] [smallint] NULL,
        [Exp_Perc3] [money] NULL,
        [Exp_Amt3] [money] NULL,
        [Exp_Ledg4] [smallint] NULL,
        [Exp_Perc4] [money] NULL,
        [Exp_Amt4] [money] NULL,
        [Exp_Ledg5] [smallint] NULL,
        [Exp_Perc5] [money] NULL,
        [Exp_Amt5] [nvarchar](255) NULL,
        [Exp_Ledg6] [smallint] NULL,
        [Exp_Perc6] [money] NULL,
        [Exp_Amt6] [money] NULL,
        [Exp_Ledg7] [smallint] NULL,
        [Exp_Perc7] [money] NULL,
        [Exp_Amt7] [money] NULL,
        [Disc1_Ledg] [int] NULL,
        [Disc1_Perc] [nvarchar](15) NULL,
        [Disc1_Amt] [money] NULL,
        [Disc2_Ledg] [int] NULL,
        [Disc2_Perc] [nvarchar](15) NULL,
        [Disc2_Amt] [money] NULL,
        [Disc3_Ledg] [int] NULL,
        [Disc3_Perc] [nvarchar](15) NULL,
        [Disc3_Amt] [money] NULL,
        [Disc4_Ledg] [int] NULL,
        [Disc4_Perc] [nvarchar](15) NULL,
        [Disc4_Amt] [money] NULL,
        [Item_Amt] [money] NULL,
        [Lbr_Amt] [money] NULL,
        [Exp_Amt] [money] NULL,
        [Disc_Amt] [money] NULL,
        [Bill_Amt] [money] NULL,
        [Chas_Id] [int] NULL,
        [Item_Code] [int] NULL,
        [Srv_Type] [int] NULL,
        [Srv_Adv] [int] NULL,
        [Srv_Sup] [int] NULL,
        [Teh_Code] [int] NULL,
        [Dist_Code] [int] NULL,
        [Stat_Code] [int] NULL,
        [Pin_Code] [nvarchar](10) NULL,
        [Ph1] [nvarchar](50) NULL,
        [Ph2] [nvarchar](12) NULL,
        [Ph3] [nvarchar](12) NULL,
        [Ph4] [nvarchar](12) NULL,
        [Cpn_No] [nvarchar](12) NULL,
        [Cpn_Amt] [money] NULL,
        [Lbr_Estm] [money] NULL,
        [Part_Estm] [money] NULL,
        [Km_Read] [nvarchar](15) NULL,
        [Avj_Km] [nvarchar](15) NULL,
        [Sale_Date] [datetime] NULL,
        [Insu_Co] [int] NULL,
        [Insu_Date] [datetime] NULL,
        [Op_Date] [datetime] NULL,
        [Op_Time] [money] NULL,
        [St_Date] [datetime] NULL,
        [St_Time] [money] NULL,
        [Prom_Date] [datetime] NULL,
        [Prom_Time] [money] NULL,
        [PI_Date] [datetime] NULL,
        [PI_Time] [money] NULL,
        [Cl_Date] [datetime] NULL,
        [Cl_Time] [money] NULL,
        [Bill_Stat] [nvarchar](12) NULL,
        [Bill_Date] [datetime] NULL,
        [Bill_Time] [money] NULL,
        [DQty] [int] NULL,
        [IQty] [int] NULL,
        [Clm_Grup] [int] NULL,
        [Comp_Clm] [nvarchar](50) NULL,
        [Spl_Rem1] [nvarchar](200) NULL,
        [Spl_Rem2] [nvarchar](100) NULL,
        [Job_No] [int] NULL,
        [Ret_Doc] [int] NULL,
        [Due_Date] [datetime] NULL,
        [Retro_Flag] [int] NULL,
        [LOC_CODE] [tinyint] NULL,
        [USR_CODE] [tinyint] NULL,
        [MOD_USER] [tinyint] NULL,
        [ENTR_DATE] [datetime] NULL,
        [Server_id] [tinyint] NULL,
        [Export_Type] [int] NULL,
        [ServerId] [int] NULL,
        [Menu_Id] [smallint] NULL,
        [Card_No] [nvarchar](20) NULL,
        [Policy_No] [nvarchar](30) NULL,
        [EstNext_Srv] [money] NULL,
        [Diff_Hrs] [money] NULL,
        [Diff_Km] [money] NULL,
        [Inv_Type] [tinyint] NULL,
        [VAP_No] [nvarchar](50) NULL,
        [Tank_No] [nvarchar](50) NULL,
        [Suply_Place] [int] NULL,
        [EXP_TAX] [int] NULL,
        [ITEM_TAX] [int] NULL,
        [ISRCM] [money] NULL,
        [Sold_by] [nvarchar](50) NULL,
        [GSTIN] [nvarchar](20) NULL,
        [COUNTRY] [smallint] NULL,
        [REGTYPE] [smallint] NULL,
        [Wrty_PL] [int] NULL,
        [Wrty_Mnth] [int] NULL,
        [Wrty_Year] [int] NULL,
        [WInv_No] [nvarchar](35) NULL,
        [WInv_Date] [date] NULL,
        [ENTR_TIME] [real] NULL,
        [MOD_DATE] [datetime] NULL,
        [MOD_TIME] [real] NULL,
        [Pymt_Mode] [nvarchar](30) NULL,
        [Chq_No] [nvarchar](20) NULL,
        [Chq_Date] [date] NULL,
        [Amt_Recd] [money] NULL,
        [Pymt_Rem] [nvarchar](100) NULL,
        [IsInsu_Billing] [int] NULL,
        [Claim_No] [nvarchar](25) NULL,
        [IsTCS] [int] NULL,
        [TCS] [money] NULL,
        [IRN] [nvarchar](150) NULL
      ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "LABR_DTL",
    ID: 1321,
    queries: [
      `ALTER TABLE [LABR_DTL] ADD [LABR_OC] [nvarchar](255) NULL`,
      `ALTER TABLE [LABR_DTL] ADD [Vch_No] [smallint] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [MRP] [money] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [Disc_Val] [money] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [Job_Start] [money] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [Job_End] [money] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [Job_Progress] [smallint] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [Job_Remark] [nvarchar](50) NULL`,
      `ALTER TABLE [LABR_DTL] ADD [Post_Acnt] [int] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [CGST_PERC] [money] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [CGST_AMT] [money] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [SGST_PERC] [money] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [SGST_AMT] [money] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [IGST_PERC] [money] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [IGST_AMT] [money] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [CGST_ACNT] [int] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [CGST_Post] [int] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [SGST_ACNT] [int] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [SGST_Post] [int] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [IGST_ACNT] [int] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [IGST_POST] [int] NULL`,
      `ALTER TABLE [LABR_DTL] ADD [TAXABLE] [money] NULL`,
    ],
  },
  {
    comments: "ITEM_DTL",
    ID: 1322,
    queries: [
      `ALTER TABLE [ITEM_DTL] ADD [MRP] [money] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[Disc_Val] [money] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[Depr_Perc] [money] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[ITEM_OC] [nvarchar](50) NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[CGST_PERC] [money] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[CGST_AMT] [money] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[SGST_PERC] [money] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[SGST_AMT] [money] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[IGST_PERC] [money] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[IGST_AMT] [money] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[CGST_ACNT] [int] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[CGST_Post] [int] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[SGST_ACNT] [int] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[SGST_Post] [int] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[IGST_ACNT] [int] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[IGST_POST] [int] NULL`,
      `ALTER TABLE [ITEM_DTL] ADD	[TAXABLE] [money] NULL`,
      `ALTER TABLE [LABR_MST] ADD [GST] [int] NULL`,
      `ALTER TABLE [LABR_MST] ADD [CESS] [int] NULL`,
      `ALTER TABLE [LABR_MST] ADD [Chap_Head] [nvarchar](30) NULL`,
      `ALTER TABLE [LABR_MST] ADD	[Model_Code] [int] NULL`,
    ],
  },
  {
    comments: "Asset_Characteristic",
    ID: 1323,
    queries: [
      `CREATE TABLE [dbo].[Asset_Characteristic](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [Type] [varchar](100) NULL,
        [Name] [varchar](100) NULL,
        [Category] [varchar](20) NULL,
        [SubCategory] [varchar](20) NULL,
        [AssetProduct] [varchar](20) NULL,
        [Created_At] [datetime2](7) NULL,
        [Created_by] [varchar](100) NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        [TypeValue] [varchar](10) NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Asset_Characteristic_Hst])
      )
      ALTER TABLE [dbo].[Asset_Characteristic] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE asset_characteristic ADD  [TypeValue] [varchar](10) NULL`,
      `CREATE TABLE [dbo].[employee_hierarchy](
        [empcode] [varchar](20) NOT NULL,
        [headempcode] [varchar](20) NULL,
        [hierarchy_level] [int] NULL
      ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "CASH_SHEET",
    ID: 1324,
    queries: [
      `ALTER TABLE CASH_SHEET ADD bank_deposit DECIMAL(18,2) NULL `,
      `ALTER TABLE CASH_SHEET ADD export_type INT NULL`,
      `CREATE TABLE [dbo].[Insu_Payout_Policy](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [EmpCode] [varchar](100) NULL,
        [Insu_Co_Name] [varchar](100) NULL,
        [FirstYear_PayoutPer] [varchar](50) NULL,
        [Renewal_PayoutPer] [varchar](50) NULL,
        [Created_By] [varchar](255) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        [DATE_FROM] [datetime] NULL,
        [DATE_TO] [datetime] NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Insu_Payout_Policy_Hst])
      )
      
      ALTER TABLE [dbo].[Insu_Payout_Policy] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[Insu_Payout_Policy] ADD  DEFAULT (getdate()) FOR [ValidFrom]
      `,
    ],
  },
  {
    comments: "Attendance_Tracking",
    ID: 1325,
    queries: [
      `CREATE TABLE [dbo].[Attendance_Tracking](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [Emp_Code] [varchar](50) NOT NULL,
        [Emp_Name] [varchar](100) NOT NULL,
        [EMPLOYEEDESIGNATION] [varchar](100) NULL,
        [DIVISION] [varchar](100) NULL,
        [Attendance_Date] [date] NOT NULL,
        [EmpTime] [time](7) NOT NULL,
        [Mispunch_Reason] [varchar](255) NULL,
        [created_at] [datetime] NULL,
      PRIMARY KEY CLUSTERED 
      (
        [id] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
      ) ON [PRIMARY]
      
      ALTER TABLE [dbo].[Attendance_Tracking] ADD  DEFAULT (getdate()) FOR [created_at]
      `,
    ],
  },
  {
    comments: "Ifsc & account_no verification api",
    ID: 1326,
    queries: [
      `CREATE TABLE IFSC_CODE_API (
        UTD INT IDENTITY(1,1) PRIMARY KEY,
        IFSC VARCHAR(20) NOT NULL,
        MICR VARCHAR(20) NULL,
        BRANCH VARCHAR(100) NOT NULL,
        ADDRESS VARCHAR(255) NOT NULL,
        STATE VARCHAR(100) NOT NULL,
        CONTACT VARCHAR(20) NULL,
        UPI BIT NOT NULL,
        RTGS BIT NOT NULL,
        CITY VARCHAR(100) NOT NULL,
        CENTRE VARCHAR(100) NOT NULL,
        DISTRICT VARCHAR(100) NOT NULL,
        NEFT BIT NOT NULL,
        IMPS BIT NOT NULL,
        SWIFT VARCHAR(20) NULL,
        ISO3166 VARCHAR(10) NOT NULL,
        BANK VARCHAR(100) NOT NULL,
        BANKCODE VARCHAR(10) NOT NULL,
        CreatedDate DATETIME DEFAULT GETDATE()
      );`,
      `CREATE TABLE Account_No_Api (
        UTD INT IDENTITY(1,1) PRIMARY KEY,
        Ifsc VARCHAR(20) NOT NULL,
        account_number VARCHAR(30) NOT NULL,
        code INT NOT NULL,
        timestamp BIGINT NOT NULL,
        message VARCHAR(255),
        account_exists BIT,
        name_at_bank VARCHAR(100),
        transaction_id VARCHAR(100),
        raw_response NVARCHAR(MAX),
        Created_At DATETIME DEFAULT GETDATE()
      );`,
    ],
  },
  {
    comments: "IVR_Call_Logs",
    ID: 1329,
    queries: [
      `CREATE TABLE [dbo].[IVR_Call_Logs](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Req_Date] [datetime2](7) NULL,
        [call_id ] [varchar](100) NULL,
        [from_number] [varchar](15) NULL,
        [to_number] [varchar](15) NULL,
        [Location] [varchar](10) NULL,
        [status] [varchar](50) NULL,
        [Created_By] [varchar](255) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      PRIMARY KEY CLUSTERED 
      (
        [Id] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[IVR_Call_Logs_Hst])
      )
      
      ALTER TABLE [dbo].[IVR_Call_Logs] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[IVR_Call_Logs] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "EMPLOYEEMASTER_hst1",
    ID: 1330,
    queries: [
      `CREATE TABLE [dbo].[EMPLOYEEMASTER_hst1](
              [SRNO] [smallint] NULL,
              [EMPCODE] [varchar](100) NOT NULL,
              [MSPIN] [nvarchar](50) NULL,
              [TITLE] [nvarchar](15) NULL,
              [EMPFIRSTNAME] [nvarchar](150) NULL,
              [EMPLASTNAME] [nvarchar](150) NULL,
              [PERMANENTADDRESS1] [nvarchar](250) NULL,
              [PERMANENTADDRESS2] [nvarchar](150) NULL,
              [PCITY] [smallint] NULL,
              [PPINCODE] [nvarchar](12) NULL,
              [PSTATE] [smallint] NULL,
              [CURRENTADDRESS1] [nvarchar](250) NULL,
              [CURRENTADDRESS2] [nvarchar](150) NULL,
              [CCITY] [smallint] NULL,
              [CPINCODE] [nvarchar](12) NULL,
              [CSTATE] [smallint] NULL,
              [LANDLINENO] [nvarchar](25) NULL,
              [MOBILENO] [nvarchar](25) NULL,
              [EMERGENCYNAME] [nvarchar](100) NULL,
              [EMERGENCYNO] [nvarchar](25) NULL,
              [PANNO] [nvarchar](25) NULL,
              [PFNO] [nvarchar](25) NULL,
              [ESINO] [nvarchar](25) NULL,
              [PASSPORTNO] [nvarchar](25) NULL,
              [PASSEXPIRYDATE] [smalldatetime] NULL,
              [BLOODGROUP] [nvarchar](15) NULL,
              [DOB] [smalldatetime] NULL,
              [GENDER] [nvarchar](15) NULL,
              [MARITALSTATUS] [nvarchar](15) NULL,
              [DOM] [smalldatetime] NULL,
              [SKILLS] [nvarchar](25) NULL,
              [BASICQUALIFICATION] [nvarchar](50) NULL,
              [PROFESSIONALQUALIFICATION] [nvarchar](50) NULL,
              [FATHERNAME] [nvarchar](100) NULL,
              [FATHEROCCUPATION] [smallint] NULL,
              [FATHERCONTACTNO] [nvarchar](25) NULL,
              [MOTHERNAME] [nvarchar](100) NULL,
              [MOTHERCONTACTNO] [nvarchar](25) NULL,
              [SPOUSENAME] [nvarchar](100) NULL,
              [SPOUSECONTACTNO] [nvarchar](25) NULL,
              [SPOUSEGENDER] [nvarchar](15) NULL,
              [SIBLINGNAME] [nvarchar](100) NULL,
              [SIBLINGCONTACTNO] [nvarchar](25) NULL,
              [PREVIOUSCOMPANYNAME] [nvarchar](100) NULL,
              [PRECOMPCITY] [smallint] NULL,
              [PRECOMPCONTACTNO] [nvarchar](25) NULL,
              [PREJOININGDATE] [smalldatetime] NULL,
              [PREENDDATE] [smalldatetime] NULL,
              [PREDESIGNATION] [nvarchar](50) NULL,
              [EMPREFERENCENAME] [nvarchar](100) NULL,
              [REFERENCEDESIGNATION] [nvarchar](50) NULL,
              [ISMEDICALATTENTION] [nvarchar](30) NULL,
              [ISSERIOUSILLNESS] [nvarchar](30) NULL,
              [ISALLERGIES] [nvarchar](30) NULL,
              [CORPORATEMAILID] [nvarchar](70) NULL,
              [CURRENTJOINDATE] [smalldatetime] NULL,
              [PAYMENTMODE] [nvarchar](15) NULL,
              [BANKNAME] [nvarchar](100) NULL,
              [BANKACCOUNTNO] [nvarchar](30) NULL,
              [EMPLOYEETYPE] [nvarchar](30) NULL,
              [ORGANISATIONNAME] [nvarchar](100) NULL,
              [SBU_FUNCTION] [nvarchar](30) NULL,
              [DIVISION] [nvarchar](30) NULL,
              [REGION] [smallint] NULL,
              [UNIT] [nvarchar](25) NULL,
              [SECTION] [nvarchar](25) NULL,
              [LEVEL] [nvarchar](25) NULL,
              [LOCATION] [nvarchar](30) NULL,
              [ROLE] [nvarchar](50) NULL,
              [EMPLOYEEDESIGNATION] [nvarchar](50) NULL,
              [GRADE] [nvarchar](30) NULL,
              [SUPERVISORID] [smallint] NULL,
              [SUPERVISOR] [nvarchar](50) NULL,
              [ISTIMEVALIDATION] [nvarchar](25) NULL,
              [ISPAYROLL] [nvarchar](25) NULL,
              [PAYCYCLEDURATION] [nvarchar](50) NULL,
              [PROBATIONPERIOD] [nvarchar](20) NULL,
              [PROBATIONLEAVES] [nvarchar](20) NULL,
              [NOTICEPERIOD] [nvarchar](20) NULL,
              [RELCODE] [smallint] NULL,
              [Exp_Date] [smalldatetime] NULL,
              [Export_Type] [tinyint] NOT NULL,
              [Loc_Code] [smallint] NULL,
              [ServerId] [int] NOT NULL,
              [DRIVINGLIC_ISSUEDATE] [smalldatetime] NULL,
              [DRIVINGLIC_ISSUEPALACE] [nvarchar](30) NULL,
              [ACCOUNT_TYPE] [nvarchar](15) NULL,
              [PFTRUST_NO] [nvarchar](25) NULL,
              [EMPHEIGHT] [money] NULL,
              [EMPWEIGHT] [money] NULL,
              [P_NATIONALITY] [nvarchar](25) NULL,
              [UID_NO] [nvarchar](30) NULL,
              [ALTERNET_MAIL] [nvarchar](30) NULL,
              [EMPDEPENDENT] [smallint] NULL,
              [CHILDREN_DETAIL] [nvarchar](150) NULL,
              [LANGUAGE_DETAIL] [nvarchar](150) NULL,
              [NOMINEE_DETAIL] [smallint] NULL,
              [EMP_SHIFT] [nvarchar](30) NULL,
              [PF] [money] NULL,
              [PFSALARY_LIMIT] [money] NULL,
              [LWF] [money] NULL,
              [ESI_AMOUNT] [money] NULL,
              [BONUS_AMOUNT] [money] NULL,
              [MONTHLY_CTC] [money] NULL,
              [ANNUAL_CTC] [money] NULL,
              [COMP_NAME] [nvarchar](70) NULL,
              [JOINING_TYPE] [nvarchar](30) NULL,
              [BRANCH] [nvarchar](50) NULL,
              [EMP_STATUS] [nvarchar](20) NULL,
              [USR_NAME] [nvarchar](50) NULL,
              [APPLICATION_ID] [nvarchar](30) NULL,
              [APPROVED_AUTHO] [nvarchar](30) NULL,
              [CREATED_BY] [nvarchar](20) NULL,
              [CREATED_ON] [smalldatetime] NULL,
              [LASTMODI_BY] [nvarchar](20) NULL,
              [LASTMODI_ON] [smalldatetime] NULL,
              [BIOMETRIC_ID] [nvarchar](25) NULL,
              [PROPOSEDRETIRE_DATE] [smalldatetime] NULL,
              [LASTWOR_DATE] [smalldatetime] NULL,
              [RELEVE_STATUS] [nvarchar](25) NULL,
              [ADUSER_NAME] [nvarchar](40) NULL,
              [EXT_NO] [nvarchar](20) NULL,
              [AUTOMAILER] [nvarchar](3) NULL,
              [WEEKLYOFF] [nvarchar](15) NULL,
              [RESIGN_APPR] [nvarchar](10) NULL,
              [AX_EMP_CODE] [nvarchar](200) NULL,
              [AX_BAL] [real] NULL,
              [Prob_period] [smalldatetime] NULL,
              [empcode2] [nvarchar](30) NULL,
              [empcode3] [nvarchar](30) NULL,
              [empcode4] [nvarchar](30) NULL,
              [ADHARNO] [nvarchar](50) NULL,
              [pfnumber] [nvarchar](30) NULL,
              [esinumber] [nvarchar](30) NULL,
              [ein] [nvarchar](100) NULL,
              [mobile_limit] [nvarchar](10) NULL,
              [Rec_Date] [date] NULL,
              [ifsc_code] [nvarchar](100) NULL,
              [MOBILE_NO] [nvarchar](15) NULL,
              [pre_Exp] [nvarchar](100) NULL,
              [landline_no] [nvarchar](15) NULL,
              [uidno] [varchar](20) NULL,
              [CNATIONALITY] [nvarchar](50) NULL,
              [Father_Mob] [nvarchar](30) NULL,
              [Mother_Mob] [nvarchar](30) NULL,
              [Spouse_Mob] [nvarchar](30) NULL,
              [pfper] [real] NULL,
              [esiper] [money] NULL,
              [IEMI] [nvarchar](15) NULL,
              [IsRW] [int] NULL,
              [Reporting_1] [nvarchar](30) NULL,
              [Reporting_2] [nvarchar](30) NULL,
              [Reporting_3] [nvarchar](30) NULL,
              [App_Mispunch] [nvarchar](10) NULL,
              [App_Leave] [nvarchar](10) NULL,
              [App_Attendance] [nvarchar](10) NULL,
              [InBudget] [bit] NULL,
              [Induction_Done] [bit] NULL,
              [ExitInterview_Done] [bit] NULL,
              [Sal_Region] [smallint] NULL,
              [Tocken_Id] [nvarchar](50) NULL,
              [Interview_Date] [date] NULL,
              [LWFNO] [int] NULL,
              [Emp_Ac_Name] [nvarchar](50) NULL,
              [PF_Date] [date] NULL,
              [ESI_Date] [date] NULL,
              [PASSPORT_EXPDATE] [date] NULL,
              [Punch_Type] [int] NULL,
              [PAY_CODE] [nvarchar](30) NULL,
              [Sal_Hold] [int] NULL,
              [Relaxation_Type] [int] NULL,
              [ShiftIn_Relaxation] [money] NULL,
              [ShiftOut_Relaxation] [money] NULL,
              [Cumulative_Relaxation] [money] NULL,
              [Spl_Rem] [nvarchar](500) NULL,
              [Acnt_Loc] [int] NULL,
              [UAN_No] [nvarchar](50) NULL,
              [EmpType] [int] NULL,
              [FCM_TockenId] [varchar](300) NULL,
              [TCS_Rate] [int] NULL,
              [MSPN_Id] [nvarchar](30) NULL,
              [Android_ID] [nvarchar](100) NULL,
              [multi_loc] [nvarchar](100) NULL,
              [Ledger_Code] [int] NULL,
              [IsMSPN] [int] NULL,
              [MSPN_DTL] [nvarchar](70) NULL,
              [ESI_DEDUCTION] [int] NULL,
              [PF_DEDUCTION] [int] NULL,
              [pro_tax] [int] NULL,
              [Token] [nvarchar](500) NULL,
              [Is_Profile_Filled] [int] NULL,
              [driving_licence] [nvarchar](50) NULL,
              [columndoc_type] [nvarchar](50) NULL,
              [mPunch] [nvarchar](1) NULL,
              [mApprove] [nvarchar](1) NULL,
              [mMispunch] [nvarchar](1) NULL,
              [mLeave] [nvarchar](1) NULL,
              [mCalender] [nvarchar](1) NULL,
              [mDeviceLog] [nvarchar](1) NULL,
              [mAttendanceLog] [nvarchar](1) NULL,
              [mLocationLog] [nvarchar](1) NULL,
              [mToDoList] [nvarchar](1) NULL,
              [mSuggestions] [nvarchar](1) NULL,
              [mUpdateIMEI] [nvarchar](1) NULL,
              [mTrackingReport] [nvarchar](1) NULL,
              [mLiveLocation] [nvarchar](1) NULL,
              [mAssetScan] [nvarchar](1) NULL,
              [mGeoFenceSetting] [nvarchar](1) NULL,
              [mUserGeoLocation] [varchar](1) NULL,
              [IsNightShift] [int] NULL,
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [CATEGORY] [int] NULL,
              [CLUSTER] [int] NULL,
              [CHANNEL] [int] NULL,
              [COSTCENTRE] [int] NULL,
              [PAN_CARD_VER] [bit] NULL,
              [AADHAR_CARD_VER] [bit] NULL,
              [DRIVING_VER] [bit] NULL,
              [PASSPORT_VER] [bit] NULL,
              [RESIGNATION_SUBMISSION_DATE] [date] NULL,
              [REASON_FOR_RESIGNATION] [nvarchar](500) NULL,
              [TEN_LEAVE_DATE] [date] NULL,
              [SEPERATIONREMARKS] [nvarchar](500) NULL,
              [SEPARATION_MODE] [nvarchar](10) NULL,
              [DATE_OF_SETTLEMENT] [date] NULL,
              [INTERVIEWREMAKS] [nvarchar](500) NULL,
              [DATE_OF_EXIT_INTERVIEW] [date] NULL,
              [EXP_IN_YEAR] [nvarchar](10) NULL,
              [BONUS] [varchar](25) NULL,
              [Dlv_Type] [varchar](25) NULL,
              [DRIVINGLIC_EXPDATE] [date] NULL,
              [LIN_NO] [varchar](20) NULL
        ) ON [PRIMARY]`,
      `ALTER TABLE NEW_JOINING ALTER COLUMN INTR1RATING FLOAT`,
      `ALTER TABLE NEW_JOINING ALTER COLUMN INTR2RATING FLOAT`,
      `ALTER TABLE NEW_JOINING ALTER COLUMN INTR3RATING FLOAT`,
      `ALTER TABLE NEW_JOINING ALTER COLUMN INTR4RATING FLOAT`,
    ],
  },
  {
    comments: "employeemaster",
    ID: 1331,
    queries: [
      `alter table employeemaster alter column [SKILLS] [nvarchar](300) NULL
      `,
    ],
  },
  {
    comments: "Doc_prefix",
    ID: 1332,
    queries: [`ALTER TABLE Doc_prefix ADD Booking_No_Prefix NVARCHAR(20)`],
  },
  {
    comments: "RTL_MST",
    ID: 1333,
    queries: [`ALTER TABLE RTL_MST ADD Dlv_Challan_Id INT, Invoice_Id INT`],
  },
  {
    comments: "employeemaster_hst1",
    ID: 1334,
    queries: [
      `alter table employeemaster_hst1 alter column [SKILLS] [nvarchar](300) NULL`,
    ],
  },
  {
    comments: "enq_dtl",
    ID: 1335,
    queries: [
      `ALTER TABLE enq_dtl ADD PLAN_TIME TIME `,
      `ALTER TABLE [BranchWiseItemOpening] ALTER COLUMN Opening_Qty DECIMAL(18,2) NULL`,
    ],
  },
  {
    comments: "newcar_financedetails",
    ID: 1336,
    queries: [
      `ALTER TABLE newcar_financedetails ADD Agrement1 VARCHAR(100) NULL`,
      `ALTER TABLE newcar_financedetails ADD Agrement2 VARCHAR(100) NULL`,
      `ALTER TABLE COMP_KEYDATA ADD Banking_AccountNo_Verify INT NULL`,
      `ALTER TABLE COMP_KEYDATA ADD Banking_IFSC_Verfy INT NULL`,
    ],
  },
  {
    comments: "expense_template",
    ID: 1337,
    queries: [
      `ALTER TABLE expense_template ADD Cr_Ledg VARCHAR(20) NULL`,
      `ALTER TABLE expense_template ADD Dr_Ledg VARCHAR(20) NULL`,
      `CREATE TABLE [dbo].[PERFORMANCE_TARGET_DATA](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [EmpCode] [varchar](100) NULL,
        [Target] [varchar](100) NULL,
        [Target_Mnth] [INT]  NOT NULL,
        [Target_Yr] [INT]  NOT NULL,
  [ServerId] INT NOT NULL DEFAULT 1,
  [Export_Type] INT NOT NULL DEFAULT 1,
        [Created_By] [varchar](255) NULL,
		 [Modified_By] [varchar](255) NULL,
        [Modified_Date] [datetime] NULL,
        [Loc_Code] VARCHAR(50) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
     
      PRIMARY KEY CLUSTERED
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PERFORMANCE_TARGET_DATA_Hst])
      )

	  ALTER TABLE [dbo].[PERFORMANCE_TARGET_DATA] ADD  DEFAULT (getdate()) FOR [Created_At]

      ALTER TABLE [dbo].[PERFORMANCE_TARGET_DATA] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "newcar_financedetails",
    ID: 1338,
    queries: [
      `ALTER TABLE  newcar_financedetails ADD LoanReceiptNo VARCHAR(100) NULL`,
    ],
  },
  {
    comments: "newcar_financedetails",
    ID: 1339,
    queries: [
      `ALTER TABLE RTL_MST ADD Approved_Disc_Amt DECIMAL(18,2) NULL`,
      `ALTER TABLE RTL_MST ADD [Appr_1_Code] [varchar](100) NULl`,
      `ALTER TABLE RTL_MST ADD [Appr_1_Stat] [tinyint] NULL`,
      `ALTER TABLE RTL_MST ADD [Appr_1_Date] [datetime2](7) NULL`,
      `ALTER TABLE RTL_MST ADD [Appr_1_Rem] [varchar](300) NULL`,
      `ALTER TABLE RTL_MST ADD [Appr_2_Code] [varchar](100) NULL`,
      `ALTER TABLE RTL_MST ADD [Appr_2_Stat] [tinyint] NULL`,
      `ALTER TABLE RTL_MST ADD [Appr_2_Date] [datetime2](7) NULL`,
      `ALTER TABLE RTL_MST ADD [Appr_2_Rem] [varchar](300) NULL`,
      `ALTER TABLE RTL_MST ADD [Appr_3_Code] [varchar](100) NULL`,
      `ALTER TABLE RTL_MST ADD [Appr_3_Stat] [tinyint] NULL`,
      `ALTER TABLE RTL_MST ADD [Appr_3_Date] [datetime2](7) NULL`,
      `ALTER TABLE RTL_MST ADD [Appr_3_Rem] [varchar](300) NULL`,
      `ALTER TABLE RTL_MST ADD [Fin_Appr] [tinyint] NULL`,
      `ALTER TABLE RTL_MST ADD [vehicle_type] [varchar](50) NULL`,
      `ALTER TABLE RTL_MST ADD [Customer_Type_Broker] [varchar](50) NULL`,
      `ALTER TABLE RTL_MST ADD MFG_Year [INT] NULL`,
      `ALTER TABLE EMPLOYEEMASTER ADD disable_whats_new INT NULL`,
    ],
  },
  {
    comments: "Booster_ext",
    ID: 1340,
    queries: [
      `CREATE TABLE [dbo].[Booster_ext](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [DisbAmt] [varchar](100) NULL,
        [ffin_code] [varchar](100) NULL,
        [invoice_no] [varchar](100) NULL,
        [invoice_date] [datetime] NULL,
        [location] [varchar](10) NULL,
        [Created_By] [varchar](255) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        [FBank_Name] [varchar](300) NULL,
        [FCredit_Ref] [varchar](300) NULL,
        [FRemark] [varchar](300) NULL,
        [FRecd_Amt] [varchar](100) NULL,
        [FAccount_No] [varchar](100) NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Booster_ext_Hst])
      )
      
      ALTER TABLE [dbo].[Booster_ext] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[Booster_ext] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "Expense_Template",
    ID: 1341,
    queries: [
      `ALTER TABLE Expense_Template ADD Emp_Related_Expense varchar(20) null
      ALTER TABLE Expense_Template ADD Vch_Type varchar(20) null
      ALTER TABLE Expense_Template ADD Vch_Type_Code varchar(50) null`,
      `ALTER TABLE Expense_Mng ADD Cr_Ledg varchar(20) null`,
      ` ALTER TABLE Expense_Mng ADD Dr_Ledg varchar(20) null`,
      `  ALTER TABLE Expense_Mng ADD Vch_Type_Code varchar(50) null`,
    ],
  },
  {
    comments: "MRN_MST",
    ID: 1342,
    queries: [` ALTER TABLE MRN_MST ALTER COLUMN SUPP_CODE INTEGER NULL`],
  },
  {
    comments: "MRN_MST",
    ID: 1343,
    queries: [
      ` ALTER TABLE MRN_MST ALTER COLUMN Exp_Ledg4 INTEGER NULL
      ALTER TABLE MRN_MST ALTER COLUMN Exp_Ledg5 INTEGER NULL
      ALTER TABLE MRN_MST ALTER COLUMN Exp_Ledg6 INTEGER NULL`,
    ],
  },
  {
    comments: "IX_ICM_MST_Filter",
    ID: 1344,
    queries: [
      `CREATE INDEX IX_ICM_MST_Filter
      ON ICM_MST (Pymt_Mode, EXPORT_TYPE, fin_code, loc_code, BHATIA_INV_DATE)
      INCLUDE (TRAN_ID, Tran_Type, DRD_ID, INV_No, Cust_Id, Fin_Dono, Ledg_Name, Chas_No, ffin_code);
      
      CREATE INDEX IX_ICM_EXT_TranID
      ON ICM_EXT (tran_id)
      INCLUDE (totalfin, vechical_invoice, Emaildate, tPayout_Rate, insurance_policy,
               Rto_Copy, gstAmount1, fin_branch, d_amt, invoice_num, preinvoice_num, date);
      
      
                   CREATE INDEX IX_BHATIA_INVOICE_ICM
      ON BHATIA_INVOICE (ICM_ID)
      INCLUDE (Sale_INV_Prefix, Invoice_no, Invoice_Date);`,
      `ALTER TABLE [icm_ext] ADD [Final_GSTInvoice] [varchar](500) NULL`,
    ],
  },
  {
    comments: "Booster_ext",
    ID: 1345,
    queries: [
      `ALTER TABLE [dbo].[Booster_ext] SET ( SYSTEM_VERSIONING = OFF  )
      GO
      
      /****** Object:  Table [dbo].[Booster_ext]    Script Date: 17-09-2025 19:25:57 ******/
      IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Booster_ext]') AND type in (N'U'))
      DROP TABLE [dbo].[Booster_ext]
      GO
      
      /****** Object:  Table [dbo].[Booster_ext_Hst]    Script Date: 17-09-2025 19:25:57 ******/
      IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Booster_ext_Hst]') AND type in (N'U'))
      DROP TABLE [dbo].[Booster_ext_Hst]
      GO`,
    ],
  },
  {
    comments: "Booster_ext",
    ID: 1346,
    queries: [
      `CREATE TABLE [dbo].[Booster_ext](
        [UTD] [int] IDENTITY(10001,1) NOT NULL,
        [DisbAmt] [varchar](100) NULL,
        [ffin_code] [varchar](100) NULL,
        [invoice_no] [varchar](100) NULL,
        [invoice_date] [datetime] NULL,
        [location] [varchar](10) NULL,
        [Created_By] [varchar](255) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        [FBank_Name] [varchar](300) NULL,
        [FCredit_Ref] [varchar](300) NULL,
        [FRemark] [varchar](300) NULL,
        [FRecd_Amt] [varchar](100) NULL,
        [FAccount_No] [varchar](100) NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Booster_ext_Hst])
      )
      
      ALTER TABLE [dbo].[Booster_ext] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[Booster_ext] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "ICM_EXT",
    ID: 1348,
    queries: [
      `ALTER TABLE  ICM_EXT ADD [ACCOUNT_CONFIRMATION] [varchar](20) NULL`,
      `ALTER TABLE  ICM_EXT ADD [confirmation_date] [datetime] NULL`,
      `ALTER TABLE  ICM_EXT ADD [confirmed_by] [varchar](20) NULL`,
    ],
  },
  {
    comments: "Expense_Mng",
    ID: 1349,
    queries: [
      `Alter Table Expense_Mng add Acnt_Id Integer Null`,
      `ALTER TABLE COMP_KEYDATA ADD Expense_Financial_Posting VARCHAR(20) NULL`,
    ],
  },
  {
    comments: "NEW_JOINING",
    ID: 1350,
    queries: [
      `ALTER TABLE  NEW_JOINING ALTER COLUMN	[SKILLS] [nvarchar](300) NULL`,
      `ALTER TABLE ICM_EXT ADD [INVOICE_TYPE] [varchar](10) NULL`,
      `ALTER TABLE Payment_Tracker ADD [Document] [nvarchar](400) NULL`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1351,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD Digilocker_Linked VARCHAR(10) NULL`,
    ],
  },
  {
    comments: "GSTRATE",
    ID: 1355,
    queries: [
      ` ALTER TABLE GSTRATE ADD WEF1 DATE NULL`,
      ` ALTER TABLE GSTRATE ADD WEF1 DATE NULL`,
      ` ALTER TABLE rtl_mst ADD Dlv_Challan_Date DATE, Invoice_Date DATE`,
    ],
  },
  {
    comments: "Digilocker_Api",
    ID: 1356,
    queries: [
      `CREATE TABLE [dbo].[Digilocker_Api](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [mobile_number] [varchar](15) NOT NULL,
        [authorization_url] [nvarchar](max) NOT NULL,
        [session_id] [nvarchar](40) NOT NULL,
        [created_date] [datetime] NULL,
        [pan_number] [varchar](20) NULL,
        [aadharData] [nvarchar](max) NULL,
        [panData] [nvarchar](max) NULL,
        [drivingLicenseData] [nvarchar](max) NULL,
        [Regenerate] [int] NULL,
        [aadhaar_number] [varchar](50) NULL,
        [driving_license] [varchar](100) NULL,
        aadhaar_number [varchar](50) null,
        driving_license [varchar](100) null,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
      ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
      
      ALTER TABLE [dbo].[Digilocker_Api] ADD  DEFAULT (getdate()) FOR [created_date]`,
    ],
  },
  {
    comments: "INV_MST",
    ID: 1357,
    queries: [
      `ALTER TABLE INV_MST ALTER COLUMN Exp_Ledg4 INTEGER NULL`,
      `ALTER TABLE INV_MST ALTER COLUMN Exp_Ledg5 INTEGER NULL`,
      `ALTER TABLE INV_MST ALTER COLUMN Exp_Ledg6 INTEGER NULL`,
      `ALTER TABLE  INV_MST ALTER COLUMN ITEM_TAX MONEY NULL`,
    ],
  },
  {
    comments: "INV_MST",
    ID: 1358,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD Show_Job_Card SMALLINT `,
      `ALTER TABLE USER_TBL ADD PHY_LOC_CODE VARCHAR(50) `,
    ],
  },
  {
    comments: "InventoryItems",
    ID: 1359,
    queries: [
      `ALTER TABLE InventoryItems
      SET (SYSTEM_VERSIONING = OFF);
      
      EXEC sp_rename 
          'MSSQL_TemporalHistoryFor_1739671649_AA7E38D0',
          'InventoryItems_HST';       
      ALTER TABLE InventoryItems
      SET (SYSTEM_VERSIONING = ON 
          (HISTORY_TABLE = dbo.InventoryItems_HST))`,
    ],
  },
  {
    comments: "InventoryItems",
    ID: 1359,
    queries: [
      ` 
      CREATE TABLE [dbo].[Autonet_Temp](
            [UTD] [int] IDENTITY(1,1) NOT NULL,
        [Tran_id] [varchar](20) NOT NULL,
                    [Tbl_Name] [varchar](50) NULL,
                    [Export_Type] [int] NULL,
            [Created_By] [varchar](255) NULL,
            [Created_At] [datetime] NOT NULL,
            [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
            [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      PRIMARY KEY CLUSTERED
      (
            [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
            PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Autonet_Temp_Hst])
      )
      
      ALTER TABLE [dbo].[Autonet_Temp] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[Autonet_Temp] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "ITEMSMST",
    ID: 1360,
    queries: [`ALTER TABLE ITEMSMST ADD SeqNo  int null`],
  },
  {
    comments: "Dms_Row_Data_Utd",
    ID: 1361,
    queries: [
      `
      CREATE TABLE [dbo].[Dms_Row_Data_Utd](
        [UTD] [int] IDENTITY(30604510,1) NOT NULL,
        [Random_key] [int] NULL,
        [Export_type] [int] NULL,
        [Created_date] [datetime] NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
      ) ON [PRIMARY]
      
      ALTER TABLE [dbo].[Dms_Row_Data_Utd] ADD  DEFAULT (getdate()) FOR [Created_date]
      
      `,
    ],
  },
  {
    comments: "GSTRATE",
    ID: 1363,
    queries: [
      `ALTER TABLE GSTRATE ADD [WEF1] [date] NULL`,
      `ALTER TABLE GSTRATE ADD [WEF2] [date] NULL`,
    ],
  },
  {
    comments: "Expense_Budget",
    ID: 1364,
    queries: [
      `CREATE TABLE [dbo].[Expense_Budget](
        [BudgetID] [int] IDENTITY(1,1) NOT NULL,
        [template_id] [nvarchar](255) NOT NULL,
        [Year_] [int] NOT NULL,
        [AprilBudget] [decimal](18, 2) NOT NULL,
        [MayBudget] [decimal](18, 2) NOT NULL,
        [JuneBudget] [decimal](18, 2) NOT NULL,
        [JulyBudget] [decimal](18, 2) NOT NULL,
        [AugustBudget] [decimal](18, 2) NOT NULL,
        [SeptemberBudget] [decimal](18, 2) NOT NULL,
        [OctoberBudget] [decimal](18, 2) NOT NULL,
        [NovemberBudget] [decimal](18, 2) NOT NULL,
        [DecemberBudget] [decimal](18, 2) NOT NULL,
        [JanuaryBudget] [decimal](18, 2) NOT NULL,
        [FebruaryBudget] [decimal](18, 2) NOT NULL,
        [MarchBudget] [decimal](18, 2) NOT NULL,
        [YearlyBudget] [decimal](18, 2) NULL,
        [CreatedBy] [nvarchar](255) NOT NULL,
        [CreatedAt] [datetime] NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      PRIMARY KEY CLUSTERED 
      (
        [BudgetID] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Expense_Budget_Hst])
      )
      
      ALTER TABLE [dbo].[Expense_Budget] ADD  DEFAULT (getdate()) FOR [CreatedAt]`,
    ],
  },
  {
    comments: "ICM_EXT",
    ID: 1366,
    queries: [
      `ALTER TABLE ICM_EXT ADD FRecd_Amt  [money] NULL`,
      `ALTER TABLE ICM_EXT ADD FAccount_No  [nvarchar] (70) NULL`,
      `ALTER TABLE ICM_EXT ADD FBank_Name [nvarchar] (70) NULL`,
      `ALTER TABLE ICM_EXT ADD FCredit_Ref [nvarchar] (70) NULL`,
      `ALTER TABLE ICM_EXT ADD FRemark [nvarchar](150) NULL`,
    ],
  },
  {
    comments: "LABR_DTL",
    ID: 1368,
    queries: [
      `CREATE TABLE [dbo].[LABR_DTL](
        [Tran_Id] [int] NULL,
        [Tran_type] [tinyint] NULL,
        [SrNo] [int] NULL,
        [Lbr_Code] [int] NULL,
        [Sup_Catg] [nvarchar](1) NULL,
        [Unit_Rate] [money] NULL,
        [Lbr_time] [money] NULL,
        [Lbr_Disc] [money] NULL,
        [Lbr_Rate] [money] NULL,
        [STax_Perc] [money] NULL,
        [Lbr_STax] [money] NULL,
        [Lbr_Amt] [money] NULL,
        [Mech_Code] [int] NULL,
        [Bay_No] [nvarchar](10) NULL,
        [Entry_Date] [datetime] NULL,
        [Entry_User] [smallint] NULL,
        [Edit_Date] [datetime] NULL,
        [Edit_User] [smallint] NULL,
        [Loc_Code] [smallint] NULL,
        [Comp_Code] [smallint] NULL,
        [ServerId] [int] NULL,
        [Export_Type] [int] NULL,
        [LABR_OC] [nvarchar](255) NULL,
        [Vch_No] [smallint] NULL,
        [MRP] [money] NULL,
        [Disc_Val] [money] NULL,
        [Job_Start] [money] NULL,
        [Job_End] [money] NULL,
        [Job_Progress] [smallint] NULL,
        [Job_Remark] [nvarchar](50) NULL,
        [Post_Acnt] [int] NULL,
        [CGST_PERC] [money] NULL,
        [CGST_AMT] [money] NULL,
        [SGST_PERC] [money] NULL,
        [SGST_AMT] [money] NULL,
        [IGST_PERC] [money] NULL,
        [IGST_AMT] [money] NULL,
        [CGST_ACNT] [int] NULL,
        [CGST_Post] [int] NULL,
        [SGST_ACNT] [int] NULL,
        [SGST_Post] [int] NULL,
        [IGST_ACNT] [int] NULL,
        [IGST_POST] [int] NULL,
        [TAXABLE] [money] NULL
      ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "LABR_MST",
    ID: 1369,
    queries: [
      `CREATE TABLE [dbo].[LABR_MST](
        [Labr_Code] [int] NULL,
        [Labr_No] [nvarchar](50) NULL,
        [Labr_Name] [nvarchar](70) NULL,
        [Labr_Group] [int] NULL,
        [Model_Code] [int] NULL,
        [Labr_Catg] [smallint] NULL,
        [STax_App] [bit] NULL,
        [Altr_Labr] [int] NULL,
        [Cust_Rate] [money] NULL,
        [Wrty_Rate] [money] NULL,
        [Purc_Rate] [money] NULL,
        [Lbr_Time] [money] NULL,
        [Labr_Amt] [money] NULL,
        [Lbr_Share] [money] NULL,
        [Lbr_Inst] [smallint] NULL,
        [Inside_Ledg] [int] NULL,
        [Outside_Ledg] [int] NULL,
        [Wrty_Ledg] [int] NULL,
        [Price_Amnd] [datetime] NULL,
        [Vat_App] [nvarchar](50) NULL,
        [Entry_Date] [datetime] NULL,
        [Entry_User] [smallint] NULL,
        [Edit_Date] [datetime] NULL,
        [Edit_User] [smallint] NULL,
        [Loc_Code] [smallint] NULL,
        [Comp_Code] [smallint] NULL,
        [ServerId] [tinyint] NULL,
        [Export_Type] [tinyint] NULL,
        [Exp_Date] [datetime] NULL,
        [GST] [int] NULL,
        [CESS] [int] NULL,
        [Chap_Head] [nvarchar](30) NULL
      ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "INV_MST",
    ID: 1370,
    queries: [
      `CREATE TABLE [dbo].[INV_MST](
        [Tran_Id] [int] NULL,
        [INV_No] [int] NULL,
        [INV_Date] [datetime] NULL,
        [Book_Code] [int] NULL,
        [Tran_Type] [tinyint] NULL,
        [Ledg_Code] [int] NULL,
        [Ledg_Name] [nvarchar](70) NULL,
        [Ledg_Add1] [nvarchar](70) NULL,
        [Ledg_Add2] [nvarchar](70) NULL,
        [Ledg_Add3] [nvarchar](70) NULL,
        [Ordr_No] [nvarchar](15) NULL,
        [Ordr_Date] [datetime] NULL,
        [Sale_Ac] [int] NULL,
        [Spl_Note] [nvarchar](100) NULL,
        [Job_Id] [int] NULL,
        [Req_Id] [int] NULL,
        [Bill_Id] [int] NULL,
        [Est_Id] [int] NULL,
        [Exp_Ledg1] [smallint] NULL,
        [Exp_Perc1] [money] NULL,
        [Exp_Amt1] [money] NULL,
        [Exp_Ledg2] [smallint] NULL,
        [Exp_Perc2] [money] NULL,
        [Exp_Amt2] [money] NULL,
        [Exp_Ledg3] [smallint] NULL,
        [Exp_Perc3] [money] NULL,
        [Exp_Amt3] [money] NULL,
        [Exp_Ledg4] [int] NULL,
        [Exp_Perc4] [money] NULL,
        [Exp_Amt4] [money] NULL,
        [Exp_Ledg5] [int] NULL,
        [Exp_Perc5] [money] NULL,
        [Exp_Amt5] [nvarchar](255) NULL,
        [Exp_Ledg6] [int] NULL,
        [Exp_Perc6] [money] NULL,
        [Exp_Amt6] [money] NULL,
        [Exp_Ledg7] [smallint] NULL,
        [Exp_Perc7] [money] NULL,
        [Exp_Amt7] [money] NULL,
        [Disc1_Ledg] [int] NULL,
        [Disc1_Perc] [nvarchar](15) NULL,
        [Disc1_Amt] [money] NULL,
        [Disc2_Ledg] [int] NULL,
        [Disc2_Perc] [nvarchar](15) NULL,
        [Disc2_Amt] [money] NULL,
        [Disc3_Ledg] [int] NULL,
        [Disc3_Perc] [nvarchar](15) NULL,
        [Disc3_Amt] [money] NULL,
        [Disc4_Ledg] [int] NULL,
        [Disc4_Perc] [nvarchar](15) NULL,
        [Disc4_Amt] [money] NULL,
        [Item_Amt] [money] NULL,
        [Lbr_Amt] [money] NULL,
        [Exp_Amt] [money] NULL,
        [Disc_Amt] [money] NULL,
        [Bill_Amt] [money] NULL,
        [Chas_Id] [int] NULL,
        [Item_Code] [int] NULL,
        [Srv_Type] [int] NULL,
        [Srv_Adv] [int] NULL,
        [Srv_Sup] [int] NULL,
        [Teh_Code] [int] NULL,
        [Dist_Code] [int] NULL,
        [Stat_Code] [int] NULL,
        [Pin_Code] [nvarchar](10) NULL,
        [Ph1] [nvarchar](50) NULL,
        [Ph2] [nvarchar](12) NULL,
        [Ph3] [nvarchar](12) NULL,
        [Ph4] [nvarchar](12) NULL,
        [Cpn_No] [nvarchar](12) NULL,
        [Cpn_Amt] [money] NULL,
        [Lbr_Estm] [money] NULL,
        [Part_Estm] [money] NULL,
        [Km_Read] [nvarchar](15) NULL,
        [Avj_Km] [nvarchar](15) NULL,
        [Sale_Date] [datetime] NULL,
        [Insu_Co] [int] NULL,
        [Insu_Date] [datetime] NULL,
        [Op_Date] [datetime] NULL,
        [Op_Time] [money] NULL,
        [St_Date] [datetime] NULL,
        [St_Time] [money] NULL,
        [Prom_Date] [datetime] NULL,
        [Prom_Time] [money] NULL,
        [PI_Date] [datetime] NULL,
        [PI_Time] [money] NULL,
        [Cl_Date] [datetime] NULL,
        [Cl_Time] [money] NULL,
        [Bill_Stat] [nvarchar](12) NULL,
        [Bill_Date] [datetime] NULL,
        [Bill_Time] [money] NULL,
        [DQty] [int] NULL,
        [IQty] [int] NULL,
        [Clm_Grup] [int] NULL,
        [Comp_Clm] [nvarchar](50) NULL,
        [Spl_Rem1] [nvarchar](200) NULL,
        [Spl_Rem2] [nvarchar](100) NULL,
        [Job_No] [int] NULL,
        [Ret_Doc] [int] NULL,
        [Due_Date] [datetime] NULL,
        [Retro_Flag] [int] NULL,
        [LOC_CODE] [tinyint] NULL,
        [USR_CODE] [tinyint] NULL,
        [MOD_USER] [tinyint] NULL,
        [ENTR_DATE] [datetime] NULL,
        [Server_id] [tinyint] NULL,
        [Export_Type] [int] NULL,
        [ServerId] [int] NULL,
        [Menu_Id] [smallint] NULL,
        [Card_No] [nvarchar](20) NULL,
        [Policy_No] [nvarchar](30) NULL,
        [EstNext_Srv] [money] NULL,
        [Diff_Hrs] [money] NULL,
        [Diff_Km] [money] NULL,
        [Inv_Type] [tinyint] NULL,
        [VAP_No] [nvarchar](50) NULL,
        [Tank_No] [nvarchar](50) NULL,
        [Suply_Place] [int] NULL,
        [EXP_TAX] [int] NULL,
        [ITEM_TAX] [money] NULL,
        [ISRCM] [money] NULL,
        [Sold_by] [nvarchar](50) NULL,
        [GSTIN] [nvarchar](20) NULL,
        [COUNTRY] [smallint] NULL,
        [REGTYPE] [smallint] NULL,
        [Wrty_PL] [int] NULL,
        [Wrty_Mnth] [int] NULL,
        [Wrty_Year] [int] NULL,
        [WInv_No] [nvarchar](35) NULL,
        [WInv_Date] [date] NULL,
        [ENTR_TIME] [real] NULL,
        [MOD_DATE] [datetime] NULL,
        [MOD_TIME] [real] NULL,
        [Pymt_Mode] [nvarchar](30) NULL,
        [Chq_No] [nvarchar](20) NULL,
        [Chq_Date] [date] NULL,
        [Amt_Recd] [money] NULL,
        [Pymt_Rem] [nvarchar](100) NULL,
        [IsInsu_Billing] [int] NULL,
        [Claim_No] [nvarchar](25) NULL,
        [IsTCS] [int] NULL,
        [TCS] [money] NULL,
        [IRN] [nvarchar](150) NULL
      ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "JOB_PARA",
    ID: 1371,
    queries: [
      `CREATE TABLE [dbo].[JOB_PARA](
        [Tran_Id] [int] NULL,
        [chk_para1] [nvarchar](255) NULL,
        [chk_para2] [nvarchar](255) NULL,
        [chk_para3] [nvarchar](255) NULL,
        [chk_para4] [nvarchar](255) NULL,
        [chk_para5] [nvarchar](255) NULL,
        [chk_para6] [nvarchar](255) NULL,
        [chk_para7] [nvarchar](255) NULL,
        [chk_para8] [nvarchar](255) NULL,
        [chk_para9] [nvarchar](255) NULL,
        [chk_para10] [nvarchar](255) NULL,
        [chk_para11] [nvarchar](255) NULL,
        [chk_para12] [nvarchar](255) NULL,
        [chk_para13] [nvarchar](255) NULL,
        [chk_para14] [nvarchar](255) NULL,
        [chk_para15] [nvarchar](255) NULL,
        [chk_para16] [nvarchar](255) NULL,
        [chk_para17] [nvarchar](255) NULL,
        [chk_para18] [nvarchar](255) NULL,
        [chk_para19] [nvarchar](255) NULL,
        [chk_para20] [nvarchar](255) NULL,
        [chk_para21] [nvarchar](255) NULL,
        [chk_para22] [nvarchar](255) NULL,
        [chk_para23] [nvarchar](255) NULL,
        [chk_para24] [nvarchar](255) NULL,
        [chk_para25] [nvarchar](255) NULL,
        [chk_para26] [nvarchar](255) NULL,
        [chk_para27] [nvarchar](255) NULL,
        [chk_para28] [nvarchar](255) NULL,
        [chk_para29] [nvarchar](255) NULL,
        [chk_para30] [nvarchar](255) NULL,
        [chk_para31] [nvarchar](255) NULL,
        [chk_para32] [nvarchar](255) NULL,
        [chk_para33] [nvarchar](255) NULL,
        [chk_para34] [nvarchar](255) NULL,
        [ServerId] [int] NULL,
        [Loc_code] [int] NULL,
        [Export_Type] [int] NULL
      ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "JOB_CMPL",
    ID: 1372,
    queries: [
      `CREATE TABLE [dbo].[JOB_CMPL](
        [Tran_Id] [int] NULL,
        [Tran_Type] [tinyint] NULL,
        [Cust_Cmpl1] [nvarchar](50) NULL,
        [Cust_Cmpl2] [nvarchar](50) NULL,
        [Cust_Cmpl3] [nvarchar](50) NULL,
        [Cust_Cmpl4] [nvarchar](50) NULL,
        [Cust_Cmpl5] [nvarchar](50) NULL,
        [Cust_Cmpl6] [nvarchar](50) NULL,
        [Cust_Cmpl7] [nvarchar](50) NULL,
        [Cust_Cmpl8] [nvarchar](50) NULL,
        [Cust_Cmpl9] [nvarchar](50) NULL,
        [Cust_Cmpl10] [nvarchar](50) NULL,
        [Road_Test1] [nvarchar](50) NULL,
        [Road_Test2] [nvarchar](50) NULL,
        [Road_Test3] [nvarchar](50) NULL,
        [Road_Test4] [nvarchar](50) NULL,
        [Road_Test5] [nvarchar](50) NULL,
        [Cmpl_Obsr1] [nvarchar](50) NULL,
        [Cmpl_Obsr2] [nvarchar](50) NULL,
        [Cmpl_Obsr3] [nvarchar](50) NULL,
        [Cmpl_Obsr4] [nvarchar](50) NULL,
        [Cmpl_Obsr5] [nvarchar](50) NULL,
        [Cmpl_Obsr6] [nvarchar](50) NULL,
        [Cmpl_Obsr7] [nvarchar](50) NULL,
        [Cmpl_Obsr8] [nvarchar](50) NULL,
        [Cmpl_Obsr9] [nvarchar](50) NULL,
        [Cmpl_Obsr10] [nvarchar](50) NULL,
        [Server_id] [tinyint] NULL,
        [Export_Type] [tinyint] NULL,
        [Loc_code] [int] NULL,
        [ServerId] [int] NULL
      ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "ITEM_DTL",
    ID: 1373,
    queries: [
      `CREATE TABLE [dbo].[ITEM_DTL](
        [Tran_Id] [int] NULL,
        [Tran_type] [tinyint] NULL,
        [SrNo] [int] NULL,
        [Item_Code] [int] NULL,
        [Item_Catg] [tinyint] NULL,
        [Sup_Catg] [nvarchar](1) NULL,
        [Dmd_Qty] [money] NULL,
        [Sup_Qty] [money] NULL,
        [Unit_Rate] [money] NULL,
        [Item_Disc] [money] NULL,
        [Item_Rate] [money] NULL,
        [Vat_Perc] [money] NULL,
        [Item_Vat] [money] NULL,
        [Amount] [money] NULL,
        [Rtn_Qty] [money] NULL,
        [Item_Ref] [nvarchar](50) NULL,
        [Ref_Date] [datetime] NULL,
        [Post_Acnt] [int] NULL,
        [Mech_Code] [int] NULL,
        [Entry_Date] [datetime] NULL,
        [Entry_User] [smallint] NULL,
        [Edit_Date] [datetime] NULL,
        [Edit_User] [smallint] NULL,
        [Loc_Code] [smallint] NULL,
        [Comp_Code] [smallint] NULL,
        [ServerId] [int] NULL,
        [Export_Type] [int] NULL,
        [MRP] [money] NULL,
        [Disc_Val] [money] NULL,
        [Depr_Perc] [money] NULL,
        [ITEM_OC] [nvarchar](50) NULL,
        [CGST_PERC] [money] NULL,
        [CGST_AMT] [money] NULL,
        [SGST_PERC] [money] NULL,
        [SGST_AMT] [money] NULL,
        [IGST_PERC] [money] NULL,
        [IGST_AMT] [money] NULL,
        [CGST_ACNT] [int] NULL,
        [CGST_Post] [int] NULL,
        [SGST_ACNT] [int] NULL,
        [SGST_Post] [int] NULL,
        [IGST_ACNT] [int] NULL,
        [IGST_POST] [int] NULL,
        [TAXABLE] [money] NULL
      ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "item_mst",
    ID: 1374,
    queries: [
      `ALTER TABLE item_mst ADD Ordr_Type SMALLINT`,
      `ALTER TABLE item_mst ADD Depr_Perc MONEY`,
      `ALTER TABLE item_mst  ADD OldStk MONEY`,
      `ALTER TABLE item_mst ADD Goods_Desc NVARCHAR(35)`,
    ],
  },
  {
    comments: "MRN_MST",
    ID: 1375,
    queries: [
      `CREATE TABLE [dbo].[MRN_MST](
        [Tran_Id] [int] NULL,
        [MRN_No] [int] NULL,
        [MRN_Date] [datetime] NULL,
        [Book_Code] [int] NULL,
        [Tran_Type] [tinyint] NULL,
        [Supp_No] [nvarchar](15) NULL,
        [Supp_Code] [int] NULL,
        [Supp_Date] [datetime] NULL,
        [Chln_Id] [int] NULL,
        [Ordr_Id] [int] NULL,
        [GR_Name] [nvarchar](50) NULL,
        [GR_No] [nvarchar](50) NULL,
        [GR_Date] [datetime] NULL,
        [Spl_Note] [nvarchar](100) NULL,
        [Exp_Ledg1] [smallint] NULL,
        [Exp_Amt1] [money] NULL,
        [Exp_Ledg2] [smallint] NULL,
        [Exp_Amt2] [money] NULL,
        [Exp_Ledg3] [smallint] NULL,
        [Exp_Amt3] [money] NULL,
        [Exp_Ledg4] [int] NULL,
        [Exp_Amt4] [money] NULL,
        [Exp_Ledg5] [int] NULL,
        [Exp_Amt5] [money] NULL,
        [Exp_Ledg6] [int] NULL,
        [Exp_Amt6] [money] NULL,
        [Exp_Ledg7] [smallint] NULL,
        [Exp_Amt7] [money] NULL,
        [Item_Amt] [money] NULL,
        [Exp_Amt] [money] NULL,
        [Bill_Amt] [money] NULL,
        [Ret_Doc] [int] NULL,
        [Loc_Code] [tinyint] NULL,
        [USR_CODE] [tinyint] NULL,
        [MOD_USER] [tinyint] NULL,
        [ENTR_DATE] [datetime] NULL,
        [Server_id] [tinyint] NULL,
        [Export_Type] [tinyint] NULL,
        [Post_Ac] [int] NULL,
        [ServerId] [int] NULL,
        [CF_No] [nvarchar](25) NULL,
        [CF_Date] [datetime] NULL,
        [Purc_Type] [smallint] NULL,
        [Exp_Ledg8] [smallint] NULL,
        [Exp_Amt8] [money] NULL,
        [Exp_Ledg9] [smallint] NULL,
        [Exp_Amt9] [money] NULL,
        [Exp_Ledg10] [smallint] NULL,
        [Exp_Amt10] [money] NULL,
        [Exp_Ledg11] [smallint] NULL,
        [Exp_Amt11] [money] NULL,
        [Exp_Perc1] [money] NULL,
        [Exp_Perc2] [money] NULL,
        [Exp_Perc3] [money] NULL,
        [Exp_Perc4] [money] NULL,
        [Exp_Perc5] [money] NULL,
        [Exp_Perc6] [money] NULL,
        [Exp_Perc7] [money] NULL,
        [Exp_Perc8] [money] NULL,
        [Exp_Perc9] [money] NULL,
        [Exp_Perc10] [money] NULL,
        [Exp_Perc11] [money] NULL,
        [Chln_Ref] [nvarchar](25) NULL,
        [Suply_Place] [int] NULL,
        [EXP_TAX] [money] NULL,
        [ITEM_TAX] [money] NULL,
        [ISRCM] [int] NULL,
        [COUNTRY] [int] NULL,
        [REGTYPE] [int] NULL,
        [GSTIN] [nvarchar](20) NULL,
        [ENTR_TIME] [real] NULL,
        [MOD_DATE] [datetime] NULL,
        [MOD_TIME] [real] NULL
      ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "MRN_DTL",
    ID: 1376,
    queries: [
      `CREATE TABLE [dbo].[MRN_DTL](
        [Tran_Id] [int] NOT NULL,
        [Tran_type] [tinyint] NULL,
        [SrNo] [smallint] NULL,
        [Item_Code] [int] NULL,
        [Ordr_Qty] [money] NULL,
        [Recd_Qty] [money] NULL,
        [Ordr_No] [nvarchar](50) NULL,
        [Unit_Rate] [money] NULL,
        [Item_Rate] [money] NULL,
        [Item_Disc] [money] NULL,
        [Item_Amt] [money] NULL,
        [Item_MRP] [money] NULL,
        [Inv_Id] [int] NULL,
        [Inv_Qty] [money] NULL,
        [Bal_Qty] [money] NULL,
        [Item_Rem] [nvarchar](25) NULL,
        [Post_Acnt] [int] NULL,
        [ServerId] [tinyint] NULL,
        [Export_Type] [tinyint] NULL,
        [Loc_code] [int] NULL,
        [Bin_Loc] [nvarchar](20) NULL,
        [UOM] [nvarchar](25) NULL,
        [Disc_Amt] [money] NULL,
        [Vat_Perc] [money] NULL,
        [Vat_Amt] [money] NULL,
        [Exc_Unit] [money] NULL,
        [Eduty_Perc] [money] NULL,
        [Eduty_Amt] [money] NULL,
        [Cvd_Perc] [money] NULL,
        [Cvd_Amt] [money] NULL,
        [Oth_Perc] [money] NULL,
        [Oth_Amt] [money] NULL,
        [CGST_PERC] [money] NULL,
        [CGST_AMT] [money] NULL,
        [SGST_PERC] [money] NULL,
        [SGST_AMT] [money] NULL,
        [IGST_PERC] [money] NULL,
        [IGST_AMT] [money] NULL,
        [CGST_ACNT] [int] NULL,
        [CGST_Post] [int] NULL,
        [SGST_ACNT] [int] NULL,
        [SGST_Post] [int] NULL,
        [IGST_ACNT] [int] NULL,
        [IGST_POST] [int] NULL,
        [TAXABLE] [money] NULL,
        [Laps_Qty] [real] NULL
      ) ON [PRIMARY]`,
    ],
  },
  {
    comments: "DMS_ROW_DATA_UTD",
    ID: 1377,
    queries: [
      `DECLARE @AcntId INT;

      -- Get the maximum Tran_Id from DMS_ROW_DATA
      SELECT @AcntId = ISNULL(MAX(Tran_Id), 0) + 1000
      FROM DMS_ROW_DATA;
      
      -- Build dynamic SQL for table creation
      DECLARE @SQL NVARCHAR(MAX);
      
      SET @SQL = '
      CREATE TABLE DMS_ROW_DATA_UTD (
          UTD INT IDENTITY(' + CAST(@AcntId AS NVARCHAR(10)) + ', 1) PRIMARY KEY,
          Random_key INT,
          Export_type INT,
          Created_date DATETIME DEFAULT GETDATE()
      );';
      
      -- Execute the dynamic SQL
      EXEC sp_executesql @SQL;`,
    ],
  },
  {
    comments: "icm_ext_dtl",
    ID: 1378,
    queries: [
      `CREATE TABLE [dbo].[icm_ext_dtl](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[ext_Invoice_num] [varchar](50) NULL,
	[Receipt_Amt] [money] NULL,
	[TDS_Amt] [money] NULL,
	[GST_Amount] [money] NULL,
	[Receipt_No] [varchar](100) NULL,
	[Receipt_Date] [datetime] NULL,
	[Account_No] [varchar](50) NULL,
	[Bank_Name] [varchar](200) NULL,
	[Credit_Ref] [varchar](200) NULL,
	[Remark] [varchar](500) NULL,
	[INVOICE_TYPE] VARCHAR(50) NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[icm_ext_dtl_Hst])
)

ALTER TABLE [dbo].[icm_ext_dtl] ADD  DEFAULT (getdate()) FOR [Created_At]

ALTER TABLE [dbo].[icm_ext_dtl] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "icm_ext",
    ID: 1379,
    queries: [
      `ALTER TABLE icm_ext ADD GST_Amount MONEY NULL`,
      `ALTER TABLE booster_ext ADD GST_Amount MONEY NULL`,
      `ALTER TABLE booster_ext ADD Outstanding MONEY NULL`,
      `ALTER TABLE icm_ext_dtl ADD INVOICE_TYPE INT NULL`,
      `ALTER TABLE Booster_ext ADD Payout_TDS MONEY NULL`,
      `ALTER TABLE COMP_KEYDATA ADD Discount_Appr_Column INT NULL`,
    ],
  },
  {
    comments: "icm_ext",
    ID: 1380,
    queries: [`ALTER TABLE icm_ext ADD Outstanding MONEY NULL`],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1381,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD Whatsapp_Module_Code VARCHAR(500)`,
      `CREATE TABLE [dbo].[PPC_Margin](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Seq_No] [int]NULL,
              [Criteria] [int] NULL,
              [Perc_Amt] [money] NULL,
              [Export_Type] [varchar](10) NULL,
          [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        PRIMARY KEY CLUSTERED
        (
              [UTD] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]
        WITH
        (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PPC_Margin_Hst])
        )
         
        
        ALTER TABLE [dbo].[PPC_Margin] ADD  DEFAULT (getdate()) FOR [Created_At]
         
        
        ALTER TABLE [dbo].[PPC_Margin] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "LumSum_Offer",
    ID: 1382,
    queries: [
      `CREATE TABLE [dbo].[LumSum_Offer](
              [UTD] [int] IDENTITY(1,1) NOT NULL,
              [Offer_Head_1] [varchar](30) NULL ,
              [Offer_Head_1Amt] [money] NULL,
                [Offer_Head_2] [varchar](30) NULL ,
              [Offer_Head_2Amt] [money] NULL,
                [SalMnth] [int] NULL ,
               [SalYear] [int] NULL,
              [Export_Type] [varchar](10) NULL,
                [Created_At] [datetime] NOT NULL,
              [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
              [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        PRIMARY KEY CLUSTERED
        (
              [UTD] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
              PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]
        WITH
        (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[LumSum_Offer_Hst])
        )
         
        
        ALTER TABLE [dbo].[LumSum_Offer] ADD  DEFAULT (getdate()) FOR [Created_At]
         
        
        ALTER TABLE [dbo].[LumSum_Offer] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `ALTER TABLE COMP_KEYDATA ADD IS_PAST_MP_ALLOW INT;`,
    ],
  },
  {
    comments: "misc_mst",
    ID: 1383,
    queries: [
      `ALTER TABLE misc_mst ADD MIN_VALUE int,Continuous_Max INT`,
      `CREATE TABLE [dbo].[WhatsappRights](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [compcode] [varchar](20) NULL,
        [Module_Code] [varchar](20) NULL,
        [Module_Name] [varchar](200) NULL,
        [Date] [datetime] NULL,
        [Flag] [varchar](10) NULL,
        [Created_By] [varchar](255) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[WhatsappRights_Hst])
      )
      
      ALTER TABLE [dbo].[WhatsappRights] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[WhatsappRights] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "EMPLOYEEMASTER",
    ID: 1384,
    queries: [
      `ALTER TABLE EMPLOYEEMASTER ADD MOBILE_RIGHTS [money] NULL`,
      `ALTER TABLE EMPLOYEEMASTER_hst1 ADD MOBILE_RIGHTS [money] NULL`,
    ],
  },
  {
    comments: "EMPLOYEEMASTER",
    ID: 1384,
    queries: [
      `CREATE TABLE [dbo].[Shift_Import](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [Empcode] [varchar](50) NULL,
        [DateFrom] [date] NULL,
        [DateTo] [date] NULL,
        [Start_Time] [varchar](10) NULL,
        [End_Time] [varchar](10) NULL,
        [Loc_Code] [varchar](10) NULL,
        [Created_By] [varchar](255) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Shift_Import_Hst])
      )
      
      ALTER TABLE [dbo].[Shift_Import] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      
      ALTER TABLE [dbo].[Shift_Import] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "EmployeeMaster_Salary_BreakUp",
    ID: 1385,
    queries: [
      `CREATE TABLE [dbo].[EmployeeMaster_Salary_BreakUp](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [Basic] [decimal](10, 2) NULL,
        [HRA] [float] NULL,
        [Conveyance] [float] NULL,
        [Medical] [float] NULL,
        [DA] [float] NULL,
        [Washing] [float] NULL,
        [Uniform] [float] NULL,
        [Created_By] [varchar](255) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[EmployeeMaster_Salary_BreakUp_Hst])
      )
      
      ALTER TABLE [dbo].[EmployeeMaster_Salary_BreakUp] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      ALTER TABLE [dbo].[EmployeeMaster_Salary_BreakUp] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `ALTER TABLE Emp_Ded ADD INCENTIVE_AMT [money] NULL`,
      `CREATE TABLE [dbo].[Shift_Change_Hst](
        [UTD] INT IDENTITY(1,1) NOT NULL,
        [EMPCODE] VARCHAR(30) NULL,
        [Atn_Date] DATETIME NULL,
        [Shift] VARCHAR(100) NULL,
        [Created_By] VARCHAR(50) NULL,
        [Created_At] DATETIME NOT NULL CONSTRAINT DF_Shift_Change_Hst_CreatedAt DEFAULT (GETDATE()),
        [MOD_DATE] DATETIME NULL,
        [MOD_TIME] REAL NULL,
        [MOD_USER] INT NULL,
        [Loc_Code] [int] NULL,
        [Export_Type] VARCHAR(10) NULL,
        [ValidFrom] DATETIME2(7) NOT NULL CONSTRAINT DF_Shift_Change_Hst_ValidFrom DEFAULT (GETDATE()),
        [ValidTo] DATETIME2(7) NULL,
        CONSTRAINT PK_Shift_Change_Hst PRIMARY KEY CLUSTERED ([UTD] ASC));`,
      `ALTER TABLE [Shift_Import] ADD [Weekly_Off] [nvarchar] (20) NULL`,
      `ALTER TABLE icm_ext_dtl ADD Receipt_Image VARCHAR(500) NULL;`,
    ],
  },
  {
    comments: "EmployeeMaster_History",
    ID: 1386,
    queries: [
      `CREATE TABLE EmployeeMaster_History (
        History_ID INT IDENTITY(1,1) PRIMARY KEY,
        EmpCode VARCHAR(20) NOT NULL,
        Field_Name VARCHAR(50) NOT NULL,
        Old_Value VARCHAR(255) NULL,
        New_Value VARCHAR(255) NULL,
        Updated_By VARCHAR(50) NOT NULL,
        Updated_On DATETIME NOT NULL DEFAULT GETDATE());`,
      `ALTER TABLE AttendanceTable ADD mp_in1 SMALLDATETIME NULL, mp_out1 SMALLDATETIME NULL;`,
      `ALTER TABLE comp_keydata ADD   attendace_keyword NVARCHAR(50) NOT NULL DEFAULT N'attdence', mp_keyword NVARCHAR(50) NOT NULL DEFAULT N'attdence', leave_keyword NVARCHAR(50) NOT NULL DEFAULT N'attdence';`,
    ],
  },
  {
    comments: "misc_mst",
    ID: 1387,
    queries: [
      `INSERT INTO misc_mst (misc_type, misc_code, misc_name, misc_hod, export_type, serverid, loc_code)
      VALUES
      -- STATE mapping
      (656, 1, 'CSTATE', 3, 1, 1, 1),
      -- CITY mapping
      (656, 2, 'CCITY', 1, 1, 1, 1),
      -- STATE mapping
      (656, 3, 'PSTATE', 3, 1, 1, 1),
      -- CITY mapping
      (656, 4, 'PCITY', 1, 1, 1, 1),
      -- LOCATION mapping
      (656, 5, 'LOCATION', 85, 1, 1, 1),
      -- SECTION mapping
      (656, 6, 'SECTION', 81, 1, 1, 1),
      -- DIVISION mapping
      (656, 7, 'DIVISION', 68, 1, 1, 1),
      -- Sal_Region mapping
      (656, 8, 'Sal_Region', 91, 1, 1, 1),
      -- EMP_SHIFT mapping
      (656, 9, 'EMP_SHIFT', 90, 1, 1, 1),
      -- PFPERC mapping
      (656, 10, 'pfper', 654, 1, 1, 1);`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1388,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD FINANCE_GST_INCLUDED INT NULL`,
      `ALTER TABLE ICM_EXT ADD [gPayout] [money] NULL`,
    ],
  },
  {
    comments: "icm_ext_preinvoice_cancel",
    ID: 1389,
    queries: [
      `CREATE TABLE [dbo].[icm_ext_preinvoice_cancel](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [icm_ext_tranid] [int] NULL,
        [location] [varchar](30) NULL,
        [Cancelled_Date] [datetime] NULL,
        [Cancelled_By] [varchar](200) NULL,
        [preinvoice_num] [int] NULL,
        [preinvoice_branch] [int] NULL,
        invoice_num varchar(200) null,
        invoice_branch int null	
      ) ON [PRIMARY]
      
      ALTER TABLE [dbo].[icm_ext_preinvoice_cancel] ADD  DEFAULT (getdate()) FOR [Cancelled_Date]`,
      `ALTER TABLE comp_keydata ADD disable_ratting_dialog int`,
    ],
  },
  {
    comments: "icm_ext_dtl",
    ID: 1390,
    queries: [
      `ALTER TABLE icm_ext_dtl ADD EXPORT_TYPE INT NULL`,
      `ALTER TABLE Booster_ext ADD EXPORT_TYPE INT NULL`,
      `ALTER TABLE icm_ext_preinvoice_cancel ADD Invoice_type INT NULL`,
      `DBCC CHECKIDENT ('dbo.Booster_ext', RESEED, 1000000);`,
      `ALTER TABLE icm_ext_preinvoice_cancel ADD totalfin money null`,
      `ALTER TABLE icm_ext_preinvoice_cancel ADD gstinc int null`,
    ],
  },
  {
    comments: "BodyShopClaim",
    ID: 1392,
    queries: [`ALTER TABLE BodyShopClaim ALTER COLUMN UTR_NO VARCHAR(100);`],
  },
  {
    comments: "Shift_Change_Hst",
    ID: 1393,
    queries: [
      ` ALTER TABLE Shift_Change_Hst ALTER COLUMN MOD_TIME DECIMAL(10, 2)`,
      ` ALTER TABLE comp_keydata ADD MP_IMG_REQUIRED int`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1394,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD FINANCE_DISABLE_FIELDS INT NULL`,
      `ALTER TABLE icm_ext ADD Address varchar(500) null`,
      `ALTER TABLE icm_ext ADD GST_No varchar(50) null`,
      `ALTER TABLE icm_ext ADD GST_Inv_No varchar(100) null`,
      `ALTER TABLE icm_ext ADD HSN varchar(20) null`,
      `ALTER TABLE Discount_Offers ADD VAHAN_DATE_FROM DATE NULL`,
      `ALTER TABLE Discount_Offers ADD VAHAN_DATE_UPTO DATE NULL`,
    ],
  },
  {
    comments: "Discount_Offers",
    ID: 1395,
    queries: [
      `ALTER TABLE Discount_Offers ADD MI_Based INT NULL`,
      `ALTER TABLE Discount_Offers ADD Vahan_Based INT NULL`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1396,
    queries: [
      `update COMP_KEYDATA set disable_ratting_dialog = 1 where Comp_Code = 1`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1397,
    queries: [
      `update COMP_KEYDATA set disable_ratting_dialog = 1 where Comp_Code = 1`,
    ],
  },
  {
    comments: "RTO_API",
    ID: 1398,
    queries: [
      `ALTER TABLE RTO_API ADD Registration_Type int null`,
      `ALTER TABLE RTO_API ADD Owner_Registration_Type int null`,
      `ALTER TABLE RTO_API ADD Son_Of varchar(200) null`,
      `ALTER TABLE RTO_API ADD Ownership_serial varchar(100) null`,
      `ALTER TABLE RTO_API ADD RationCard_No varchar(100) null`,
      `ALTER TABLE RTO_API ADD Voter_Id varchar(100) null`,
      `ALTER TABLE RTO_API ADD DL_No varchar(100) null`,
      `ALTER TABLE RTO_API ADD District varchar(100) null`,
      `ALTER TABLE RTO_API ADD Landmark varchar(500) null`,
      `ALTER TABLE RTO_API ADD Permanent_Address varchar(500) null`,
      `ALTER TABLE RTO_API ADD Permanent_Village varchar(100) null`,
      `ALTER TABLE RTO_API ADD Permanent_District varchar(100) null`,
      `ALTER TABLE RTO_API ADD Permanent_Landmark varchar(500) null`,
      `ALTER TABLE RTO_API ADD Permanent_State varchar(100) null`,
      `ALTER TABLE RTO_API AD1398D Permanent_PinCode varchar(20) null`,
      `EXEC sp_rename 'RTO_API.VIN', 'Frame_No', 'COLUMN'`,
      `ALTER TABLE RTO_API ADD [MI_Date] [date] NULL`,
    ],
  },
  {
    comments: "TV_ICM_Post_Ac",
    ID: 1399,
    queries: [
      `CREATE TABLE [dbo].[TV_ICM_Post_Ac](
	[Seq_No] [int] NULL,
	[Payable_Ac] [int] NULL,
	[Voucher_Code] [int] NULL,
	[Voucher_Type] [int] NULL,
	[Loc_Code] [int] NULL,
	[Bank_Ref] [int] NULL,
	[GP_Prefix] [nvarchar](12) NULL,
	[Print_UTPD] [int] NULL
) ON [PRIMARY]`,
      `CREATE TABLE [dbo].[TV_ICM_Post](
	[Tran_Id] [int] NULL,
	[Seq_No] [int] NULL,
	[Payable_Ac] [int] NULL,
	[Voucher_Code] [int] NULL,
	[Voucher_Type] [int] NULL,
	[Amount] [money] NULL,
	[Export_Type] [int] NULL,
	[Loc_Code] [int] NULL,
	[Acnt_Id] [int] NULL,
	[ENTRY_BATCH] [nvarchar](100) NULL,
	[Text_1] [nvarchar](60) NULL,
	[Text_2] [nvarchar](60) NULL,
	[Number_1] [int] NULL,
	[Number_2] [int] NULL,
	[Post_Date] [date] NULL
) ON [PRIMARY]`,
      `ALTER TABLE RTO_API ADD Permanent_PinCode varchar(20) null`,
      `alter table Misc_Mst add restricted_days int`,
      `UPDATE misc_mst SET assessable_column = 3 WHERE misc_type = 92 AND misc_code IN (10, 104, 120, 121);`,
    ],
  },
  {
    comments: "dise_aprvl",
    ID: 1400,
    queries: [
      `ALTER TABLE dise_aprvl ADD CHASSIS_NO VARCHAR(50);`,
      `ALTER TABLE dise_aprvl ADD VIN VARCHAR(50)`,
      `ALTER TABLE dise_aprvl ADD ENGINE_NO VARCHAR(50);`,
      `ALTER TABLE dise_aprvl ADD ExshowromPrice VARCHAR(50);`,
    ],
  },
  {
    comments: "COMP_OFF_DTL",
    ID: 1401,
    queries: [
      `CREATE TABLE [dbo].[COMP_OFF_DTL](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
    [EMPCODE] NVARCHAR(20) NOT NULL,
    [DATE] [datetime] NOT NULL,
    [CO_TYPE] NVARCHAR(20),          
    [CO_VAL] DECIMAL(10,2),          
    [LAPS_VAL] DECIMAL(10,2),        
    [CO_AVAILED] DECIMAL(10,2),      
    [CO_BAL] DECIMAL(10,2),          
    [APPR_BY] NVARCHAR(20),
    [APPR_STAT] NVARCHAR(10),
    [APPR_DATE] DATETIME,
    [APPR_REM] NVARCHAR(100),
    [REJ_BY] NVARCHAR(20),
    [REJ_STAT] NVARCHAR(10),
    [REJ_DATE] DATETIME,
    [REJ_REM] NVARCHAR(100),
        [Created_By] [varchar] (100) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[COMP_OFF_DTL_Hst])
      )
      
      ALTER TABLE [dbo].[COMP_OFF_DTL] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      
      ALTER TABLE [dbo].[COMP_OFF_DTL] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "comp_keydata",
    ID: 1402,
    queries: [`ALTER TABLE comp_keydata ADD ENABLE_CO_GENERATION int`],
  },
  {
    comments: "BankingSalaryLock",
    ID: 1403,
    queries: [
      `CREATE TABLE [dbo].[BankingSalaryLock](
	[EMPCODE] [varchar](50) NULL,
	[ISLOCK] [int] NULL,
	[DATE_CREATED] [datetime] NULL,
	[CREATEDBY] [varchar](50) NULL
) ON [PRIMARY]`,
    ],
  },
  {
    comments: "Emp_Atnrun",
    ID: 1404,
    queries: [` ALTER TABLE Emp_Atnrun ADD [Loc_Code] [int] NULL`],
  },
  {
    comments: "Sal_Attn_Data_Excel",
    ID: 1405,
    queries: [
      `CREATE TABLE [dbo].[Sal_Attn_Data_Excel](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Emp_Code] [varchar](20) NULL,
	[Monthdays] [varchar](10) NULL,
	[SalMnth] [varchar](20) NULL,
	[Present_days] [varchar](10) NULL,
	[Off_days] [varchar](10) NULL,
	[Holiday_Leaves] [varchar](10) NULL,
	[WO_days] [varchar](10) NULL,
	[Absent_days] [varchar](10) NULL,
	[salyr] [varchar](10) NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Sal_Attn_Data_Excel_Hst])
)

ALTER TABLE [dbo].[Sal_Attn_Data_Excel] ADD  DEFAULT (getdate()) FOR [Created_At]

ALTER TABLE [dbo].[Sal_Attn_Data_Excel] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `ALTER TABLE COMP_KEYDATA ADD Is_Shift_PastDate_Updation int null`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1406,
    queries: [`ALTER TABLE comp_keydata ADD Show_Address_On_MP_Img int`],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1407,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD [Allot_Appr_All] [Int](10) NULL`,
      `ALTER TABLE COMP_KEYDATA ADD [Min_Ageing_Appr] [Int](10) NULL`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1408,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD [Allot_Appr_All] [Int] NULL`,
      `ALTER TABLE COMP_KEYDATA ADD [Min_Ageing_Appr] [Int] NULL`,
    ],
  },
  {
    comments: "Sal_Attn_Data_Excel",
    ID: 1409,
    queries: [
      `EXEC sp_rename 'Sal_Attn_Data_Excel.Present_days', 'presentvalue', 'COLUMN'`,
      `EXEC sp_rename 'Sal_Attn_Data_Excel.WO_days', 'WO_Value', 'COLUMN'`,
      `EXEC sp_rename 'Sal_Attn_Data_Excel.Holiday_Leaves', 'Holiday_Value', 'COLUMN'`,
      `EXEC sp_rename 'Sal_Attn_Data_Excel.Absent_days', 'ABSENTVALUE', 'COLUMN'`,
      `ALTER TABLE Sal_Attn_Data_Excel ADD [LEAVEVALUE] [varchar](20) NULL`,
      `ALTER TABLE Sal_Attn_Data_Excel ADD Export_Type int null`,
      `ALTER TABLE [Sal_Attn_Data_Excel] SET (SYSTEM_VERSIONING = OFF)`,
      `drop table [Sal_Attn_Data_Excel_Hst]`,
      `drop table [Sal_Attn_Data_Excel]`,
      `CREATE TABLE [dbo].[Sal_Attn_Data_Excel](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [Emp_Code] [varchar](20) NULL,
      [Monthdays] int NULL,
      [SalMnth] money NULL,
      [presentvalue] money NULL,
      [Off_days] money NULL,
      [Holiday_Value] money NULL,
      [WO_Value] money NULL,
      [ABSENTVALUE] money NULL,
      [salyr] integer NULL,
      [Created_By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL,
      [ValidFrom] [datetime2](7) NOT NULL,
      [ValidTo] [datetime2](7) NOT NULL,
      [LEAVEVALUE] money NULL,
      [Export_Type] [int] NULL,
PRIMARY KEY CLUSTERED
(
      [UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

ALTER TABLE [dbo].[Sal_Attn_Data_Excel] ADD  DEFAULT (getdate()) FOR [Created_At]

ALTER TABLE [dbo].[Sal_Attn_Data_Excel] ADD  DEFAULT (getdate()) FOR [ValidTo]
ALTER TABLE [dbo].[Sal_Attn_Data_Excel] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "dise_aprvl",
    ID: 1410,
    queries: [
      `ALTER TABLE dise_aprvl ALTER COLUMN remark_dse VARCHAR(300) NULL;`,
    ],
  },
  {
    comments: "EMPLOYEEMASTER_hst",
    ID: 1411,
    queries: [
      `drop table EMPLOYEEMASTER_hst`,
      ` drop table EMPLOYEEMASTER_hst1`,
      `CREATE TABLE [dbo].[EMPLOYEEMASTER_hst](
	[SRNO] [smallint] NULL,
	[EMPCODE] [varchar](100) NOT NULL,
	[MSPIN] [nvarchar](50) NULL,
	[TITLE] [nvarchar](15) NULL,
	[EMPFIRSTNAME] [nvarchar](150) NULL,
	[EMPLASTNAME] [nvarchar](150) NULL,
	[PERMANENTADDRESS1] [nvarchar](250) NULL,
	[PERMANENTADDRESS2] [nvarchar](150) NULL,
	[PCITY] [smallint] NULL,
	[PPINCODE] [nvarchar](12) NULL,
	[PSTATE] [smallint] NULL,
	[CURRENTADDRESS1] [nvarchar](250) NULL,
	[CURRENTADDRESS2] [nvarchar](150) NULL,
	[CCITY] [smallint] NULL,
	[CPINCODE] [nvarchar](12) NULL,
	[CSTATE] [smallint] NULL,
	[LANDLINENO] [nvarchar](25) NULL,
	[MOBILENO] [nvarchar](25) NULL,
	[EMERGENCYNAME] [nvarchar](100) NULL,
	[EMERGENCYNO] [nvarchar](25) NULL,
	[PANNO] [nvarchar](25) NULL,
	[PFNO] [nvarchar](25) NULL,
	[ESINO] [nvarchar](25) NULL,
	[PASSPORTNO] [nvarchar](25) NULL,
	[PASSEXPIRYDATE] [smalldatetime] NULL,
	[BLOODGROUP] [nvarchar](15) NULL,
	[DOB] [smalldatetime] NULL,
	[GENDER] [nvarchar](15) NULL,
	[MARITALSTATUS] [nvarchar](15) NULL,
	[DOM] [smalldatetime] NULL,
	[SKILLS] [nvarchar](300) NULL,
	[BASICQUALIFICATION] [nvarchar](50) NULL,
	[PROFESSIONALQUALIFICATION] [nvarchar](50) NULL,
	[FATHERNAME] [nvarchar](100) NULL,
	[FATHEROCCUPATION] [smallint] NULL,
	[FATHERCONTACTNO] [nvarchar](25) NULL,
	[MOTHERNAME] [nvarchar](100) NULL,
	[MOTHERCONTACTNO] [nvarchar](25) NULL,
	[SPOUSENAME] [nvarchar](100) NULL,
	[SPOUSECONTACTNO] [nvarchar](25) NULL,
	[SPOUSEGENDER] [nvarchar](15) NULL,
	[SIBLINGNAME] [nvarchar](100) NULL,
	[SIBLINGCONTACTNO] [nvarchar](25) NULL,
	[PREVIOUSCOMPANYNAME] [nvarchar](100) NULL,
	[PRECOMPCITY] [smallint] NULL,
	[PRECOMPCONTACTNO] [nvarchar](25) NULL,
	[PREJOININGDATE] [smalldatetime] NULL,
	[PREENDDATE] [smalldatetime] NULL,
	[PREDESIGNATION] [nvarchar](50) NULL,
	[EMPREFERENCENAME] [nvarchar](100) NULL,
	[REFERENCEDESIGNATION] [nvarchar](50) NULL,
	[ISMEDICALATTENTION] [nvarchar](30) NULL,
	[ISSERIOUSILLNESS] [nvarchar](30) NULL,
	[ISALLERGIES] [nvarchar](30) NULL,
	[CORPORATEMAILID] [nvarchar](70) NULL,
	[CURRENTJOINDATE] [smalldatetime] NULL,
	[PAYMENTMODE] [nvarchar](15) NULL,
	[BANKNAME] [nvarchar](100) NULL,
	[BANKACCOUNTNO] [nvarchar](30) NULL,
	[EMPLOYEETYPE] [nvarchar](30) NULL,
	[ORGANISATIONNAME] [nvarchar](100) NULL,
	[SBU_FUNCTION] [nvarchar](30) NULL,
	[DIVISION] [nvarchar](30) NULL,
	[REGION] [smallint] NULL,
	[UNIT] [nvarchar](25) NULL,
	[SECTION] [nvarchar](25) NULL,
	[LEVEL] [nvarchar](25) NULL,
	[LOCATION] [nvarchar](30) NULL,
	[ROLE] [nvarchar](50) NULL,
	[EMPLOYEEDESIGNATION] [nvarchar](50) NULL,
	[GRADE] [nvarchar](30) NULL,
	[SUPERVISORID] [smallint] NULL,
	[SUPERVISOR] [nvarchar](50) NULL,
	[ISTIMEVALIDATION] [nvarchar](25) NULL,
	[ISPAYROLL] [nvarchar](25) NULL,
	[PAYCYCLEDURATION] [nvarchar](50) NULL,
	[PROBATIONPERIOD] [nvarchar](20) NULL,
	[PROBATIONLEAVES] [nvarchar](20) NULL,
	[NOTICEPERIOD] [nvarchar](20) NULL,
	[RELCODE] [smallint] NULL,
	[Exp_Date] [smalldatetime] NULL,
	[Export_Type] [tinyint] NOT NULL,
	[Loc_Code] [smallint] NULL,
	[ServerId] [int] NOT NULL,
	[DRIVINGLIC_ISSUEDATE] [smalldatetime] NULL,
	[DRIVINGLIC_ISSUEPALACE] [nvarchar](30) NULL,
	[ACCOUNT_TYPE] [nvarchar](15) NULL,
	[PFTRUST_NO] [nvarchar](25) NULL,
	[EMPHEIGHT] [money] NULL,
	[EMPWEIGHT] [money] NULL,
	[P_NATIONALITY] [nvarchar](25) NULL,
	[UID_NO] [nvarchar](30) NULL,
	[ALTERNET_MAIL] [nvarchar](30) NULL,
	[EMPDEPENDENT] [smallint] NULL,
	[CHILDREN_DETAIL] [nvarchar](150) NULL,
	[LANGUAGE_DETAIL] [nvarchar](150) NULL,
	[NOMINEE_DETAIL] [smallint] NULL,
	[EMP_SHIFT] [nvarchar](30) NULL,
	[PF] [money] NULL,
	[PFSALARY_LIMIT] [money] NULL,
	[LWF] [money] NULL,
	[ESI_AMOUNT] [money] NULL,
	[BONUS_AMOUNT] [money] NULL,
	[MONTHLY_CTC] [money] NULL,
	[ANNUAL_CTC] [money] NULL,
	[COMP_NAME] [nvarchar](70) NULL,
	[JOINING_TYPE] [nvarchar](30) NULL,
	[BRANCH] [nvarchar](50) NULL,
	[EMP_STATUS] [nvarchar](20) NULL,
	[USR_NAME] [nvarchar](50) NULL,
	[APPLICATION_ID] [nvarchar](30) NULL,
	[APPROVED_AUTHO] [nvarchar](30) NULL,
	[CREATED_BY] [nvarchar](20) NULL,
	[CREATED_ON] [smalldatetime] NULL,
	[LASTMODI_BY] [nvarchar](20) NULL,
	[LASTMODI_ON] [smalldatetime] NULL,
	[BIOMETRIC_ID] [nvarchar](25) NULL,
	[PROPOSEDRETIRE_DATE] [smalldatetime] NULL,
	[LASTWOR_DATE] [smalldatetime] NULL,
	[RELEVE_STATUS] [nvarchar](25) NULL,
	[ADUSER_NAME] [nvarchar](40) NULL,
	[EXT_NO] [nvarchar](20) NULL,
	[AUTOMAILER] [nvarchar](3) NULL,
	[WEEKLYOFF] [nvarchar](15) NULL,
	[RESIGN_APPR] [nvarchar](10) NULL,
	[AX_EMP_CODE] [nvarchar](200) NULL,
	[AX_BAL] [real] NULL,
	[Prob_period] [smalldatetime] NULL,
	[empcode2] [nvarchar](30) NULL,
	[empcode3] [nvarchar](30) NULL,
	[empcode4] [nvarchar](30) NULL,
	[ADHARNO] [nvarchar](50) NULL,
	[pfnumber] [nvarchar](30) NULL,
	[esinumber] [nvarchar](30) NULL,
	[ein] [nvarchar](100) NULL,
	[mobile_limit] [nvarchar](10) NULL,
	[Rec_Date] [date] NULL,
	[ifsc_code] [nvarchar](100) NULL,
	[MOBILE_NO] [nvarchar](15) NULL,
	[pre_Exp] [nvarchar](100) NULL,
	[landline_no] [nvarchar](15) NULL,
	[uidno] [varchar](20) NULL,
	[CNATIONALITY] [nvarchar](50) NULL,
	[Father_Mob] [nvarchar](30) NULL,
	[Mother_Mob] [nvarchar](30) NULL,
	[Spouse_Mob] [nvarchar](30) NULL,
	[pfper] [real] NULL,
	[esiper] [money] NULL,
	[IEMI] [nvarchar](15) NULL,
	[IsRW] [int] NULL,
	[Reporting_1] [nvarchar](30) NULL,
	[Reporting_2] [nvarchar](30) NULL,
	[Reporting_3] [nvarchar](30) NULL,
	[App_Mispunch] [nvarchar](10) NULL,
	[App_Leave] [nvarchar](10) NULL,
	[App_Attendance] [nvarchar](10) NULL,
	[InBudget] [bit] NULL,
	[Induction_Done] [bit] NULL,
	[ExitInterview_Done] [bit] NULL,
	[Sal_Region] [smallint] NULL,
	[Tocken_Id] [nvarchar](50) NULL,
	[Interview_Date] [date] NULL,
	[LWFNO] [int] NULL,
	[Emp_Ac_Name] [nvarchar](50) NULL,
	[PF_Date] [date] NULL,
	[ESI_Date] [date] NULL,
	[PASSPORT_EXPDATE] [date] NULL,
	[Punch_Type] [int] NULL,
	[PAY_CODE] [nvarchar](30) NULL,
	[Sal_Hold] [int] NULL,
	[Relaxation_Type] [int] NULL,
	[ShiftIn_Relaxation] [money] NULL,
	[ShiftOut_Relaxation] [money] NULL,
	[Cumulative_Relaxation] [money] NULL,
	[Spl_Rem] [nvarchar](500) NULL,
	[Acnt_Loc] [int] NULL,
	[UAN_No] [nvarchar](50) NULL,
	[EmpType] [int] NULL,
	[FCM_TockenId] [varchar](300) NULL,
	[TCS_Rate] [int] NULL,
	[MSPN_Id] [nvarchar](30) NULL,
	[Android_ID] [nvarchar](100) NULL,
	[multi_loc] [nvarchar](100) NULL,
	[Ledger_Code] [int] NULL,
	[IsMSPN] [int] NULL,
	[MSPN_DTL] [nvarchar](70) NULL,
	[ESI_DEDUCTION] [int] NULL,
	[PF_DEDUCTION] [int] NULL,
	[pro_tax] [int] NULL,
	[Token] [nvarchar](500) NULL,
	[Is_Profile_Filled] [int] NULL,
	[driving_licence] [nvarchar](50) NULL,
	[columndoc_type] [nvarchar](50) NULL,
	[mPunch] [nvarchar](1) NULL,
	[mApprove] [nvarchar](1) NULL,
	[mMispunch] [nvarchar](1) NULL,
	[mLeave] [nvarchar](1) NULL,
	[mCalender] [nvarchar](1) NULL,
	[mDeviceLog] [nvarchar](1) NULL,
	[mAttendanceLog] [nvarchar](1) NULL,
	[mLocationLog] [nvarchar](1) NULL,
	[mToDoList] [nvarchar](1) NULL,
	[mSuggestions] [nvarchar](1) NULL,
	[mUpdateIMEI] [nvarchar](1) NULL,
	[mTrackingReport] [nvarchar](1) NULL,
	[mLiveLocation] [nvarchar](1) NULL,
	[mAssetScan] [nvarchar](1) NULL,
	[mGeoFenceSetting] [nvarchar](1) NULL,
	[mUserGeoLocation] [varchar](1) NULL,
	[IsNightShift] [int] NULL,
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[CATEGORY] [int] NULL,
	[CLUSTER] [int] NULL,
	[CHANNEL] [int] NULL,
	[COSTCENTRE] [int] NULL,
	[PAN_CARD_VER] [bit] NULL,
	[AADHAR_CARD_VER] [bit] NULL,
	[DRIVING_VER] [bit] NULL,
	[PASSPORT_VER] [bit] NULL,
	[RESIGNATION_SUBMISSION_DATE] [date] NULL,
	[REASON_FOR_RESIGNATION] [nvarchar](500) NULL,
	[TEN_LEAVE_DATE] [date] NULL,
	[SEPERATIONREMARKS] [nvarchar](500) NULL,
	[SEPARATION_MODE] [nvarchar](10) NULL,
	[DATE_OF_SETTLEMENT] [date] NULL,
	[INTERVIEWREMAKS] [nvarchar](500) NULL,
	[DATE_OF_EXIT_INTERVIEW] [date] NULL,
	[EXP_IN_YEAR] [nvarchar](10) NULL,
	[BONUS] [varchar](25) NULL,
	[Dlv_Type] [varchar](25) NULL,
	[DRIVINGLIC_EXPDATE] [date] NULL,
	[LIN_NO] [varchar](20) NULL,
	[MOBILE_RIGHTS] [money] NULL
) ON [PRIMARY]
GO`,
      `alter table COMP_KEYDATA add [Allow_Shift_Aprvl] INT NULL`,
      `ALTER TABLE comp_keydata ADD Enable_Multiple_Punch_Out int`,
    ],
  },
  {
    comments: "EMPLOYEEMASTER_hst",
    ID: 1412,
    queries: [
      ` CREATE TABLE [dbo].[EMPLOYEEMASTER_hst](
	[SRNO] [smallint] NULL,
	[EMPCODE] [varchar](100) NOT NULL,
	[MSPIN] [nvarchar](50) NULL,
	[TITLE] [nvarchar](15) NULL,
	[EMPFIRSTNAME] [nvarchar](150) NULL,
	[EMPLASTNAME] [nvarchar](150) NULL,
	[PERMANENTADDRESS1] [nvarchar](250) NULL,
	[PERMANENTADDRESS2] [nvarchar](150) NULL,
	[PCITY] [smallint] NULL,
	[PPINCODE] [nvarchar](12) NULL,
	[PSTATE] [smallint] NULL,
	[CURRENTADDRESS1] [nvarchar](250) NULL,
	[CURRENTADDRESS2] [nvarchar](150) NULL,
	[CCITY] [smallint] NULL,
	[CPINCODE] [nvarchar](12) NULL,
	[CSTATE] [smallint] NULL,
	[LANDLINENO] [nvarchar](25) NULL,
	[MOBILENO] [nvarchar](25) NULL,
	[EMERGENCYNAME] [nvarchar](100) NULL,
	[EMERGENCYNO] [nvarchar](25) NULL,
	[PANNO] [nvarchar](25) NULL,
	[PFNO] [nvarchar](25) NULL,
	[ESINO] [nvarchar](25) NULL,
	[PASSPORTNO] [nvarchar](25) NULL,
	[PASSEXPIRYDATE] [smalldatetime] NULL,
	[BLOODGROUP] [nvarchar](15) NULL,
	[DOB] [smalldatetime] NULL,
	[GENDER] [nvarchar](15) NULL,
	[MARITALSTATUS] [nvarchar](15) NULL,
	[DOM] [smalldatetime] NULL,
	[SKILLS] [nvarchar](300) NULL,
	[BASICQUALIFICATION] [nvarchar](50) NULL,
	[PROFESSIONALQUALIFICATION] [nvarchar](50) NULL,
	[FATHERNAME] [nvarchar](100) NULL,
	[FATHEROCCUPATION] [smallint] NULL,
	[FATHERCONTACTNO] [nvarchar](25) NULL,
	[MOTHERNAME] [nvarchar](100) NULL,
	[MOTHERCONTACTNO] [nvarchar](25) NULL,
	[SPOUSENAME] [nvarchar](100) NULL,
	[SPOUSECONTACTNO] [nvarchar](25) NULL,
	[SPOUSEGENDER] [nvarchar](15) NULL,
	[SIBLINGNAME] [nvarchar](100) NULL,
	[SIBLINGCONTACTNO] [nvarchar](25) NULL,
	[PREVIOUSCOMPANYNAME] [nvarchar](100) NULL,
	[PRECOMPCITY] [smallint] NULL,
	[PRECOMPCONTACTNO] [nvarchar](25) NULL,
	[PREJOININGDATE] [smalldatetime] NULL,
	[PREENDDATE] [smalldatetime] NULL,
	[PREDESIGNATION] [nvarchar](50) NULL,
	[EMPREFERENCENAME] [nvarchar](100) NULL,
	[REFERENCEDESIGNATION] [nvarchar](50) NULL,
	[ISMEDICALATTENTION] [nvarchar](30) NULL,
	[ISSERIOUSILLNESS] [nvarchar](30) NULL,
	[ISALLERGIES] [nvarchar](30) NULL,
	[CORPORATEMAILID] [nvarchar](70) NULL,
	[CURRENTJOINDATE] [smalldatetime] NULL,
	[PAYMENTMODE] [nvarchar](15) NULL,
	[BANKNAME] [nvarchar](100) NULL,
	[BANKACCOUNTNO] [nvarchar](30) NULL,
	[EMPLOYEETYPE] [nvarchar](30) NULL,
	[ORGANISATIONNAME] [nvarchar](100) NULL,
	[SBU_FUNCTION] [nvarchar](30) NULL,
	[DIVISION] [nvarchar](30) NULL,
	[REGION] [smallint] NULL,
	[UNIT] [nvarchar](25) NULL,
	[SECTION] [nvarchar](25) NULL,
	[LEVEL] [nvarchar](25) NULL,
	[LOCATION] [nvarchar](30) NULL,
	[ROLE] [nvarchar](50) NULL,
	[EMPLOYEEDESIGNATION] [nvarchar](50) NULL,
	[GRADE] [nvarchar](30) NULL,
	[SUPERVISORID] [smallint] NULL,
	[SUPERVISOR] [nvarchar](50) NULL,
	[ISTIMEVALIDATION] [nvarchar](25) NULL,
	[ISPAYROLL] [nvarchar](25) NULL,
	[PAYCYCLEDURATION] [nvarchar](50) NULL,
	[PROBATIONPERIOD] [nvarchar](20) NULL,
	[PROBATIONLEAVES] [nvarchar](20) NULL,
	[NOTICEPERIOD] [nvarchar](20) NULL,
	[RELCODE] [smallint] NULL,
	[Exp_Date] [smalldatetime] NULL,
	[Export_Type] [tinyint] NOT NULL,
	[Loc_Code] [smallint] NULL,
	[ServerId] [int] NOT NULL,
	[DRIVINGLIC_ISSUEDATE] [smalldatetime] NULL,
	[DRIVINGLIC_ISSUEPALACE] [nvarchar](30) NULL,
	[ACCOUNT_TYPE] [nvarchar](15) NULL,
	[PFTRUST_NO] [nvarchar](25) NULL,
	[EMPHEIGHT] [money] NULL,
	[EMPWEIGHT] [money] NULL,
	[P_NATIONALITY] [nvarchar](25) NULL,
	[UID_NO] [nvarchar](30) NULL,
	[ALTERNET_MAIL] [nvarchar](30) NULL,
	[EMPDEPENDENT] [smallint] NULL,
	[CHILDREN_DETAIL] [nvarchar](150) NULL,
	[LANGUAGE_DETAIL] [nvarchar](150) NULL,
	[NOMINEE_DETAIL] [smallint] NULL,
	[EMP_SHIFT] [nvarchar](30) NULL,
	[PF] [money] NULL,
	[PFSALARY_LIMIT] [money] NULL,
	[LWF] [money] NULL,
	[ESI_AMOUNT] [money] NULL,
	[BONUS_AMOUNT] [money] NULL,
	[MONTHLY_CTC] [money] NULL,
	[ANNUAL_CTC] [money] NULL,
	[COMP_NAME] [nvarchar](70) NULL,
	[JOINING_TYPE] [nvarchar](30) NULL,
	[BRANCH] [nvarchar](50) NULL,
	[EMP_STATUS] [nvarchar](20) NULL,
	[USR_NAME] [nvarchar](50) NULL,
	[APPLICATION_ID] [nvarchar](30) NULL,
	[APPROVED_AUTHO] [nvarchar](30) NULL,
	[CREATED_BY] [nvarchar](20) NULL,
	[CREATED_ON] [smalldatetime] NULL,
	[LASTMODI_BY] [nvarchar](20) NULL,
	[LASTMODI_ON] [smalldatetime] NULL,
	[BIOMETRIC_ID] [nvarchar](25) NULL,
	[PROPOSEDRETIRE_DATE] [smalldatetime] NULL,
	[LASTWOR_DATE] [smalldatetime] NULL,
	[RELEVE_STATUS] [nvarchar](25) NULL,
	[ADUSER_NAME] [nvarchar](40) NULL,
	[EXT_NO] [nvarchar](20) NULL,
	[AUTOMAILER] [nvarchar](3) NULL,
	[WEEKLYOFF] [nvarchar](15) NULL,
	[RESIGN_APPR] [nvarchar](10) NULL,
	[AX_EMP_CODE] [nvarchar](200) NULL,
	[AX_BAL] [real] NULL,
	[Prob_period] [smalldatetime] NULL,
	[empcode2] [nvarchar](30) NULL,
	[empcode3] [nvarchar](30) NULL,
	[empcode4] [nvarchar](30) NULL,
	[ADHARNO] [nvarchar](50) NULL,
	[pfnumber] [nvarchar](30) NULL,
	[esinumber] [nvarchar](30) NULL,
	[ein] [nvarchar](100) NULL,
	[mobile_limit] [nvarchar](10) NULL,
	[Rec_Date] [date] NULL,
	[ifsc_code] [nvarchar](100) NULL,
	[MOBILE_NO] [nvarchar](15) NULL,
	[pre_Exp] [nvarchar](100) NULL,
	[landline_no] [nvarchar](15) NULL,
	[uidno] [varchar](20) NULL,
	[CNATIONALITY] [nvarchar](50) NULL,
	[Father_Mob] [nvarchar](30) NULL,
	[Mother_Mob] [nvarchar](30) NULL,
	[Spouse_Mob] [nvarchar](30) NULL,
	[pfper] [real] NULL,
	[esiper] [money] NULL,
	[IEMI] [nvarchar](15) NULL,
	[IsRW] [int] NULL,
	[Reporting_1] [nvarchar](30) NULL,
	[Reporting_2] [nvarchar](30) NULL,
	[Reporting_3] [nvarchar](30) NULL,
	[App_Mispunch] [nvarchar](10) NULL,
	[App_Leave] [nvarchar](10) NULL,
	[App_Attendance] [nvarchar](10) NULL,
	[InBudget] [bit] NULL,
	[Induction_Done] [bit] NULL,
	[ExitInterview_Done] [bit] NULL,
	[Sal_Region] [smallint] NULL,
	[Tocken_Id] [nvarchar](50) NULL,
	[Interview_Date] [date] NULL,
	[LWFNO] [int] NULL,
	[Emp_Ac_Name] [nvarchar](50) NULL,
	[PF_Date] [date] NULL,
	[ESI_Date] [date] NULL,
	[PASSPORT_EXPDATE] [date] NULL,
	[Punch_Type] [int] NULL,
	[PAY_CODE] [nvarchar](30) NULL,
	[Sal_Hold] [int] NULL,
	[Relaxation_Type] [int] NULL,
	[ShiftIn_Relaxation] [money] NULL,
	[ShiftOut_Relaxation] [money] NULL,
	[Cumulative_Relaxation] [money] NULL,
	[Spl_Rem] [nvarchar](500) NULL,
	[Acnt_Loc] [int] NULL,
	[UAN_No] [nvarchar](50) NULL,
	[EmpType] [int] NULL,
	[FCM_TockenId] [varchar](300) NULL,
	[TCS_Rate] [int] NULL,
	[MSPN_Id] [nvarchar](30) NULL,
	[Android_ID] [nvarchar](100) NULL,
	[multi_loc] [nvarchar](100) NULL,
	[Ledger_Code] [int] NULL,
	[IsMSPN] [int] NULL,
	[MSPN_DTL] [nvarchar](70) NULL,
	[ESI_DEDUCTION] [int] NULL,
	[PF_DEDUCTION] [int] NULL,
	[pro_tax] [int] NULL,
	[Token] [nvarchar](500) NULL,
	[Is_Profile_Filled] [int] NULL,
	[driving_licence] [nvarchar](50) NULL,
	[columndoc_type] [nvarchar](50) NULL,
	[mPunch] [nvarchar](1) NULL,
	[mApprove] [nvarchar](1) NULL,
	[mMispunch] [nvarchar](1) NULL,
	[mLeave] [nvarchar](1) NULL,
	[mCalender] [nvarchar](1) NULL,
	[mDeviceLog] [nvarchar](1) NULL,
	[mAttendanceLog] [nvarchar](1) NULL,
	[mLocationLog] [nvarchar](1) NULL,
	[mToDoList] [nvarchar](1) NULL,
	[mSuggestions] [nvarchar](1) NULL,
	[mUpdateIMEI] [nvarchar](1) NULL,
	[mTrackingReport] [nvarchar](1) NULL,
	[mLiveLocation] [nvarchar](1) NULL,
	[mAssetScan] [nvarchar](1) NULL,
	[mGeoFenceSetting] [nvarchar](1) NULL,
	[mUserGeoLocation] [varchar](1) NULL,
	[IsNightShift] [int] NULL,
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[CATEGORY] [int] NULL,
	[CLUSTER] [int] NULL,
	[CHANNEL] [int] NULL,
	[COSTCENTRE] [int] NULL,
	[PAN_CARD_VER] [bit] NULL,
	[AADHAR_CARD_VER] [bit] NULL,
	[DRIVING_VER] [bit] NULL,
	[PASSPORT_VER] [bit] NULL,
	[RESIGNATION_SUBMISSION_DATE] [date] NULL,
	[REASON_FOR_RESIGNATION] [nvarchar](500) NULL,
	[TEN_LEAVE_DATE] [date] NULL,
	[SEPERATIONREMARKS] [nvarchar](500) NULL,
	[SEPARATION_MODE] [nvarchar](10) NULL,
	[DATE_OF_SETTLEMENT] [date] NULL,
	[INTERVIEWREMAKS] [nvarchar](500) NULL,
	[DATE_OF_EXIT_INTERVIEW] [date] NULL,
	[EXP_IN_YEAR] [nvarchar](10) NULL,
	[BONUS] [varchar](25) NULL,
	[Dlv_Type] [varchar](25) NULL,
	[DRIVINGLIC_EXPDATE] [date] NULL,
	[LIN_NO] [varchar](20) NULL,
	[MOBILE_RIGHTS] [money] NULL
) ON [PRIMARY]`,
    ],
  },
  {
    comments: "comp_keydata",
    ID: 1413,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD force_update_flag tinyint`,
      `ALTER TABLE comp_keydata ADD Enable_Successive_Leave_Val int`,
      `ALTER TABLE RTO_API ADD Permanent_Address2 VARCHAR(500) NULL`,
    ],
  },
  {
    comments: "RTO_Office",
    ID: 1414,
    queries: [
      ` ALTER TABLE Emp_Slryrun ADD [Loc_Code] [int] NULL`,
      `alter table COMP_KEYDATA add [Allow_Shift_Aprvl] INT NULL`,
    ],
  },
  {
    comments: "employeemaster",
    ID: 1415,
    queries: [
      `alter table employeemaster add [Confirmation_Date] [smalldatetime] NULL`,
      `alter table employeemaster_hst add [Confirmation_Date] [smalldatetime] NULL`,
      `alter table employeemaster_hst add [Marital_Status] INT NULL`,
      `alter table employeemaster add [Marital_Status] INT NULL`,
      `ALTER TABLE EMPLOYEEMASTER ADD Confirmed_By Varchar(100) null`,
      `ALTER TABLE EMPLOYEEMASTER_HST ADD Confirmed_By Varchar(100) null`,
      `CREATE TABLE [dbo].[Incentive_Paid_Outside_Salary](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Emp_Code] [varchar](20) NULL,
	[Emp_Name] [varchar](300) NULL,
	[IncMnth] int null,
	[Inc_Yr] [int] NULL,
	[Inc_Name] [varchar](300) NULL,
	[Remark] [varchar](500) NULL,
	[Amount] [decimal](18, 2) NULL,
	[Location] [varchar](10) NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[Disb_Amt] [decimal](18, 2) NULL,
	[Disb_Location] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Incentive_Paid_Outside_Salary_Hst])
)

ALTER TABLE [dbo].[Incentive_Paid_Outside_Salary] ADD  DEFAULT (getdate()) FOR [Created_At]

ALTER TABLE [dbo].[Incentive_Paid_Outside_Salary] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `CREATE TABLE [dbo].[Overtime_Policy](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[MinMinutes] [int] NULL,
	[MaxMinutes] [int] NULL,
	[PValue] [decimal](5, 2) NULL,
	[Created_by] [varchar](40) NULL,
	[Created_Date] [datetime] NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Overtime_Policy] ADD  DEFAULT (getdate()) FOR [Created_Date]`,
    ],
  },
  {
    comments: "New_dev_code",
    ID: 1416,
    queries: [
      `ALTER TABLE EMP_DED ADD Deleted_By VARCHAR(50) NULL`,
      `ALTER TABLE EMP_DED ADD Deleted_On SMALLDATETIME NULL`,
    ],
  },
  {
    comments: "comp_keydata",
    ID: 1417,
    queries: [
      ` alter table comp_keydata add laps_days int`,
      `alter table attendancetable add Leave_applied_on [datetime2](7) NULL`,
    ],
  },
  {
    comments: "AttendanceTable",
    ID: 1418,
    queries: [
      `ALTER TABLE AttendanceTable
ADD 
    Canc_Fin INT NULL,
    Canc_Date DATETIME NULL,
    Canc_Rem NVARCHAR(255) NULL,
    Canc_By NVARCHAR(50) NULL,

    Canc_1_Code NVARCHAR(50) NULL,
    Canc_1_Stat NVARCHAR(50) NULL,
    Canc_1_Rem NVARCHAR(255) NULL,
    Canc_1_Date DATETIME NULL,

    Canc_2_Code NVARCHAR(50) NULL,
    Canc_2_Stat NVARCHAR(50) NULL,
    Canc_2_Rem NVARCHAR(255) NULL,
    Canc_2_Date DATETIME NULL,

    Canc_3_Code NVARCHAR(50) NULL,
    Canc_3_Stat NVARCHAR(50) NULL,
    Canc_3_Rem NVARCHAR(255) NULL,
    Canc_3_Date DATETIME NULL`,
      `ALTER TABLE comp_keydata ADD Enable_Cancelltion int`,
      `CREATE TABLE [dbo].[CANCELLATION_DATA_TBL](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
    [EMPCODE] NVARCHAR(20) NOT NULL,
    [DATEOFFICE] [datetime] NOT NULL,
    [STATUS] NVARCHAR(10),          
    [MAN_APPR] NVARCHAR(10),          
    [In1Mannual] NVARCHAR(10),        
    [Man_Recomend] NVARCHAR(10),      
    [MAN_REJ] NVARCHAR(10),          
    [Mipunch_Reason] NVARCHAR(20),
    [MI_Remark] NVARCHAR(200),
    [Spl_Remark] NVARCHAR(10),
    [Appr_1_Code] NVARCHAR(20),
    [Appr_2_Code] NVARCHAR (20),
    [Appr_3_Code] NVARCHAR (20),
    [Appr_3_Stat] NVARCHAR (20),
    [Appr_2_Stat] NVARCHAR (20),
    [Appr_1_Stat] NVARCHAR (20),
    [Appr_1_Rem ] NVARCHAR (200),
    [Appr_2_Rem ] NVARCHAR (200),
    [Appr_3_Rem ] NVARCHAR (200),
    [APPR_1_DATE] DATETIME,
    [APPR_2_DATE] DATETIME,
    [APPR_3_DATE] DATETIME,
    [MI_TYPE] NVARCHAR(10),
    [MIS_ENTERBY] NVARCHAR(30),
    [SHORT_LEV] NVARCHAR(10),
    [IN2] DATETIME,
    [IN1] DATETIME,
    [MP_IN1] DATETIME,
    [OUT1] DATETIME,
    [MP_OUT1] DATETIME,
        [Created_By] [NVARCHAR] (100) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
      ) ON [PRIMARY]
      WITH
      (
      SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[CANCELLATION_DATA_TBL_Hst])
      )
      
      ALTER TABLE [dbo].[CANCELLATION_DATA_TBL] ADD  DEFAULT (getdate()) FOR [Created_At]
      
      
      ALTER TABLE [dbo].[CANCELLATION_DATA_TBL] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `ALTER TABLE COMP_OFF_DTL ADD Availed_date DATETIME`,
      `ALTER TABLE comp_keydata ADD Mnd_Add_Rmk int`,
      `ALTER TABLE comp_keydata ADD Disable_Gallary_option int`,
    ],
  },
  {
    comments: "CANCELLATION_DATA_TBL",
    ID: 1419,
    queries: [
      ` ALTER TABLE CANCELLATION_DATA_TBL ADD out1mannual NVARCHAR(10),out2 DATETIME`,
      `alter table attendancetable add Mispunch_applied_on [datetime2](7) NULL`,
    ],
  },
  {
    comments: "CANCELLATION_DATA_TBL",
    ID: 1420,
    queries: [`ALTER TABLE CANCELLATION_DATA_TBL ADD export_type int`],
  },
  {
    comments: "CANCELLATION_DATA_TBL",
    ID: 1421,
    queries: [
      `CREATE TABLE [dbo].[BOOKING_DETAILS_GDFDIAUTOVYN](
      [LOC_CD] [varchar](50) NULL,
      [ORDER_NUM] [varchar](50) NULL,
      [ORDER_DATE] [date] NULL,
      [CUST_CD] [varchar](50) NULL,
      [SALUTATION] [varchar](20) NULL,
      [CUSTOMER_NAME] [varchar](200) NULL,
      [ADDRESS1] [varchar](200) NULL,
      [ADDRESS2] [varchar](200) NULL,
      [ADDRESS3] [varchar](200) NULL,
      [CITY_DESC] [varchar](100) NULL,
      [PIN] [varchar](20) NULL,
      [PIN_DESC] [varchar](100) NULL,
      [PHONE1] [varchar](20) NULL,
      [PHONE2] [varchar](20) NULL,
      [EMAIL_ID] [varchar](100) NULL,
      [MODEL_DESC] [varchar](100) NULL,
      [FUEL_DESC] [varchar](50) NULL,
      [VARIANT_CD] [varchar](50) NULL,
      [VARIANT_DESC] [varchar](100) NULL,
      [COLOR_CODE] [varchar](50) NULL,
      [COLOR_DESC] [varchar](50) NULL,
      [FINANCER] [varchar](200) NULL,
      [DSA_NAME] [varchar](100) NULL,
      [DSA] [varchar](50) NULL,
      [TEAM_LEAD_NAME] [varchar](100) NULL,
      [SALES_MAN_CD] [varchar](50) NULL,
      [EMP_NAME] [varchar](100) NULL,
      [SALE_TYPE] [varchar](50) NULL,
      [ORDER_STATUS] [varchar](50) NULL,
      [BUYER_TYPE] [varchar](50) NULL,
      [PREFERED_DELIVERY_DATE] [date] NULL,
      [ENQUIRY_TO_ORDER_NO_OF_DAYS] [int] NULL,
      [PENDING_DAYS] [int] NULL,
      [NO_OF_FOLLOWS] [int] NULL,
      [SELLING_PRICE] [decimal](18, 2) NULL,
      [RECEIVED_AMOUNT] [decimal](18, 2) NULL,
      [PROMISED_DELV_DATE] [date] NULL,
      [BALANCE_AMT] [decimal](18, 2) NULL,
      [ENQUIRY_NO] [varchar](50) NULL,
      [ENQUIRY_SOURCE] [varchar](100) NULL,
      [ENQUIRY_SUB_SOURCE] [varchar](100) NULL,
      [SPECIAL_REQUEST] [varchar](500) NULL,
      [MGA_NET_AMT] [decimal](18, 2) NULL,
      [MGA_SOLD_AMT] [decimal](18, 2) NULL,
      [EW_YES_NO] [varchar](5) NULL,
      [EW_TYPE] [varchar](50) NULL,
      [LOYALTY_CARD_YES_NO] [varchar](5) NULL,
      [LAST_ACTION_DATE] [datetime] NULL,
      [LAST_ACTION_TAKEN] [varchar](200) NULL,
      [NEXT_ACTION_PLAN] [varchar](200) NULL,
      [NEXT_FOLLOWUP_PURPOSE] [varchar](200) NULL,
      [ACTION_DATE_TIME] [datetime] NULL,
      [EVALUATOR_NAME] [varchar](100) NULL,
      [EVALUATOR_MSPIN] [varchar](50) NULL,
      [OLD_CAR_STATUS] [varchar](50) NULL,
      [OLD_CAR_REG_NO] [varchar](50) NULL,
      [OLD_CAR_MODEL] [varchar](100) NULL,
      [OLD_CAR_SUB_MODEL] [varchar](100) NULL,
      [EVALUATION_DATE] [date] NULL,
      [BUYING_DATE] [date] NULL,
      [CUSTOMER_EXPECTED_PRICE] [decimal](18, 2) NULL,
      [OFFERED_PRICE] [decimal](18, 2) NULL,
      [REFERENCE_PRICE] [decimal](18, 2) NULL,
      [OLD_CAR_CUSTOMER_NAME] [varchar](100) NULL,
      [TV_NTV_CATEGORY] [varchar](50) NULL,
      [REFERENCE_TYPE] [varchar](50) NULL,
      [REFERENCE_BY] [varchar](100) NULL,
      [REFERENCE_NO] [varchar](50) NULL,
      [REF_VEHICLE_REGN_NO] [varchar](50) NULL,
      [REF_MOBILE_NO] [varchar](20) NULL,
      [STATE] [varchar](50) NULL,
      [DISTRICT] [varchar](50) NULL,
      [TEHSIL] [varchar](50) NULL,
      [VILLAGE] [varchar](50) NULL,
      [CORPORATE] [varchar](50) NULL,
      [DELAYED_FLAG] [varchar](10) NULL,
      [DELAY_REMARKS] [varchar](200) NULL,
      [DELAY_FLG_DATE] [date] NULL,
      [DELAY_EXPEC_DELV_DATE] [date] NULL,
      [DELAY_DE_FLG_DATE] [date] NULL,
      [ORIGINAL_HSN] [varchar](50) NULL,
      [AMENDED_HSN] [varchar](50) NULL,
      [SUBSCRIBER_ID] [varchar](50) NULL,
      [SUBSCRIBER_NAME] [varchar](100) NULL,
      [SUBSCRIPTION_ORDER_STATUS] [varchar](50) NULL,
      [Created_By] [varchar](50) NULL,
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [Export_Type] [tinyint] NULL,
PRIMARY KEY CLUSTERED
(
      [UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]`,
      `CREATE TABLE [dbo].[GD_FDI_TRANS_AUTOVYN](
      [PARENT_GROUP] [varchar](200) NULL,
      [DEALER_MAP_CD] [int] NULL,
      [LOC_CD] [varchar](200) NULL,
      [COMP_FA] [varchar](200) NULL,
      [MUL_DEALER_CD] [varchar](200) NULL,
      [OUTLET_CD] [varchar](200) NULL,
      [TRANS_TYPE] [varchar](200) NULL,
      [TRANS_DATE] [varchar](200) NULL,
      [TRANS_ID] [varchar](200) NULL,
      [TRANS_REF_NUM] [varchar](200) NULL,
      [TRANS_REF_DATE] [varchar](200) NULL,
      [TRANS_QTY] [float] NULL,
      [TRANS_SEGMENT] [varchar](200) NULL,
      [VIN] [varchar](200) NULL,
      [MODEL_CD] [varchar](200) NULL,
      [VARIANT_CD] [varchar](200) NULL,
      [ECOLOR_CD] [varchar](200) NULL,
      [BASIC_PRICE] [float] NULL,
      [DISCOUNT] [float] NULL,
      [TAXABLE_VALUE] [float] NULL,
      [SERVICE_AMOUNT] [float] NULL,
      [GST_NO] [varchar](200) NULL,
      [PLACE_OF_SUPPLY] [varchar](200) NULL,
      [CUST_NAME] [varchar](100) NULL,
      [EXECUTIVE] [varchar](120) NULL,
      [TEAM_HEAD] [varchar](100) NULL,
      [FINC_NAME] [varchar](100) NULL,
      [PAYMENT_MODE] [varchar](100) NULL,
      [DEPOSIT_BANK] [varchar](100) NULL,
      [PAYMENT_FOR] [varchar](100) NULL,
      [GE1] [varchar](250) NULL,
      [GE2] [varchar](250) NULL,
      [GE3] [varchar](250) NULL,
      [GE4] [varchar](250) NULL,
      [GE5] [varchar](250) NULL,
      [GE6] [varchar](250) NULL,
      [GE7] [varchar](250) NULL,
      [GE8] [varchar](250) NULL,
      [GE9] [varchar](250) NULL,
      [GE10] [varchar](250) NULL,
      [GE11] [varchar](250) NULL,
      [GE12] [varchar](250) NULL,
      [GE13] [varchar](250) NULL,
      [GE14] [varchar](250) NULL,
      [GE15] [varchar](250) NULL,
      [created_date] [varchar](200) NULL,
      [ENGINE_NUM] [varchar](200) NULL,
      [CHASSIS_NUM] [varchar](200) NULL,
      [CUST_ID] [varchar](200) NULL,
      [HSN_NO] [varchar](200) NULL,
      [AX_FLAG] [varchar](1) NULL,
      [AUTOVYN_FLAG] [int] NULL,
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [Export_Type] [tinyint] NULL,
PRIMARY KEY CLUSTERED
(
      [UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
`,
      `ALTER TABLE EMPLOYEEMASTER ALTER COLUMN BANKACCOUNTNO VARCHAR(100)`,
      `ALTER TABLE comp_keydata ADD Lev_Auto_Rej int`,
      `ALTER TABLE CANCELLATION_DATA_TBL ALTER COLUMN Spl_Remark NVARCHAR(255)`,
      `CREATE TABLE [dbo].[PYR_REJ_REQ](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[EMPCODE] [nvarchar](20) NOT NULL,
	[DATEOFFICE] [datetime] NOT NULL,
	[STATUS] [nvarchar](10) NULL,
	[MAN_APPR] [nvarchar](10) NULL,
	[In1Mannual] [nvarchar](10) NULL,
	[out1mannual] [nvarchar](10) NULL,
	[Man_Recomend] [nvarchar](10) NULL,
	[MAN_REJ] [nvarchar](10) NULL,
	[Mipunch_Reason] [nvarchar](20) NULL,
	[MI_Remark] [nvarchar](200) NULL,
	[Spl_Remark] [nvarchar](255) NULL,
	[Appr_1_Code] [nvarchar](20) NULL,
	[Appr_2_Code] [nvarchar](20) NULL,
	[Appr_3_Code] [nvarchar](20) NULL,
	[Appr_3_Stat] [nvarchar](20) NULL,
	[Appr_2_Stat] [nvarchar](20) NULL,
	[Appr_1_Stat] [nvarchar](20) NULL,
	[Appr_1_Rem ] [nvarchar](200) NULL,
	[Appr_2_Rem ] [nvarchar](200) NULL,
	[Appr_3_Rem ] [nvarchar](200) NULL,
	[APPR_1_DATE] [datetime] NULL,
	[APPR_2_DATE] [datetime] NULL,
	[APPR_3_DATE] [datetime] NULL,
	[MI_TYPE] [nvarchar](10) NULL,
	[MIS_ENTERBY] [nvarchar](30) NULL,
	[SHORT_LEV] [nvarchar](10) NULL,
	[IN2] [datetime] NULL,
	[IN1] [datetime] NULL,
	[MP_IN1] [datetime] NULL,
	[OUT1] [datetime] NULL,
	[MP_OUT1] [datetime] NULL,
	[out2] [datetime] NULL,
	[export_type] [int] NULL,
	[Created_By] [nvarchar](100) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PYR_REJ_REQ_Hst])
)

ALTER TABLE [dbo].[PYR_REJ_REQ] ADD  DEFAULT (getdate()) FOR [Created_At]

ALTER TABLE [dbo].[PYR_REJ_REQ] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `ALTER TABLE COMP_OFF_DTL Add laps_date datetime`,
      `ALTER TABLE SALARYFILE ADD [IT_DED] [money] NULL`,
    ],
  },
  {
    comments: "CANCELLATION_DATA_TBL",
    ID: 1422,
    queries: [
      `ALTER TABLE SALARYFILE ADD [IT_DED] [money] NULL`,
      `ALTER TABLE RTO_API ADD KIT_Serial_No VARCHAR(100) NULL`,
      `ALTER TABLE RTO_API ADD KIT_Type VARCHAR(300) NULL`,
      `ALTER TABLE RTO_API ADD KIT_Manufacturer_Name VARCHAR(300) `,
      `ALTER TABLE RTO_API ADD Workshop VARCHAR(400) NULL`,
      `ALTER TABLE RTO_API ADD License_No VARCHAR(100) NULL`,
      `ALTER TABLE RTO_API ADD Cylinder_No VARCHAR(100) NULL`,
      `ALTER TABLE RTO_API ADD Installation_Date [date] NULL`,
      `ALTER TABLE RTO_API ADD Pollution_Norms  VARCHAR(200) NULL`,
      `ALTER TABLE RTO_API ADD Hydro_Validity_Upto [date] NULL`,
      `ALTER TABLE RTO_API ADD Approval_Letter_No VARCHAR(100) NUL`,
      `ALTER TABLE RTO_API ADD Approval_Letter_Date [date] NULL`,
      `alter table EMPLOYEEMASTER add  [CDIST] [smallint] NULL`,
      ` alter table EMPLOYEEMASTER add  [PDIST] [smallint] NULL`,
      ` alter table EMPLOYEEMASTER_hst add  [PDIST] [smallint] NULL`,
      ` alter table EMPLOYEEMASTER_hst add  [CDIST] [smallint] NULL`,
    ],
  },
  {
    comments: "CANCELLATION_DATA_TBL",
    ID: 1423,
    queries: [
      `ALTER TABLE comp_keydata ADD Show_Shift_Time int`,
      `CREATE TABLE [dbo].[WO_Changes_dtl](
	[Tran_id] [int] IDENTITY(1,1) NOT NULL,
	[EMPCODE] [varchar](50) NOT NULL,
	[Change_Date] [date] NULL,
	[Prev_WO] [varchar](200) NULL,
	[New_WO] [varchar](200) NULL,
    [Remark] [varchar](200) NULL,
	[Appr_1_Code] [varchar](100) NULL,
	[Appr_1_Stat] [tinyint] NULL,
	[Appr_1_Rem] [varchar](300) NULL,
	[Appr_1_date] [datetime] NULL,
	[Appr_2_Code] [varchar](100) NULL,
	[Appr_2_Stat] [tinyint] NULL,
	[Appr_2_Rem] [varchar](300) NULL,
	[Appr_2_date] [datetime] NULL,
	[Appr_3_Code] [varchar](100) NULL,
	[Appr_3_Stat] [tinyint] NULL,
	[Appr_3_Rem] [varchar](300) NULL,
	[Appr_3_date] [datetime] NULL,
	[Fin_Appr] [tinyint] NULL,
	[Created_by] [varchar](40) NULL,
	[location] [varchar](50) NULL,
	[export_type] [int] NULL,
	[Created_date] [date] NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Tran_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[WO_Changes_dtl_Hst])
)

ALTER TABLE [dbo].[WO_Changes_dtl] ADD  DEFAULT (getdate()) FOR [Created_date]

ALTER TABLE [dbo].[WO_Changes_dtl] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `CREATE TABLE [dbo].[Emp_Wo](
	[Tran_id] [int] ,
	[EMPCODE] [varchar](50) NOT NULL,
	[Applicable_Date] [date] NULL,
	[Prev_WO] int,
	[New_WO] int,
    Created_date datetime)`,
      `ALTER TABLE RTO_API ADD Fuel_Type INT NULL`,
    ],
  },
  {
    comments: "EMPLOYEEMASTER",
    ID: 1424,
    queries: [
      `Alter table EMPLOYEEMASTER add LASTWOR_DATE2 Date null`,
      `Alter table EMPLOYEEMASTER add DOJ2 Date null`,
      `Alter table EMPLOYEEMASTER add LastSalary Money null`,
      `Alter table EMPLOYEEMASTER add Resign_Date Date null`,
      `Alter table EMPLOYEEMASTER add ExitInt_Date Date null`,
      `Alter table EMPLOYEEMASTER_HST add LASTWOR_DATE2 Date null`,
      `Alter table EMPLOYEEMASTER_HST add DOJ2 Date null`,
      `Alter table EMPLOYEEMASTER_HST add LastSalary Money null`,
      `Alter table EMPLOYEEMASTER_HST add Resign_Date Date null`,
      `Alter table EMPLOYEEMASTER_HST add ExitInt_Date Date null`,
    ],
  },
  {
    comments: "Comp_keydata",
    ID: 1425,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD STOCK_INVENTORY_QR_WIDTH VARCHAR(50)`,
      `ALTER TABLE COMP_KEYDATA ADD STOCK_INVENTORY_QR_HEIGHT VARCHAR(50)`,
    ],
  },
  {
    comments: "Comp_keydata",
    ID: 1426,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD STOCK_INVENTORY_QR_WIDTH VARCHAR(50)`,
      `ALTER TABLE COMP_KEYDATA ADD STOCK_INVENTORY_QR_HEIGHT VARCHAR(50)`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1427,
    queries: [`ALTER TABLE COMP_KEYDATA ADD By_Pass_PreInv_Approval INT NULL`],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1428,
    queries: [
      `ALTER TABLE TV_ICM_MST ADD [PYMT_TO_CUSTOMER] [varchar](50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD [INSU_CHARGES] [varchar](50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD [DUPLICATE_KEY] [varchar](50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD [RC_BOOK_ERROR] [varchar](50) NULL`,
      `ALTER TABLE GODOWN_MST ADD APP_FLAG INT NULL`,
      `ALTER TABLE DISE_APRVL ADD KEY_NO VARCHAR(100) NULL`,
    ],
  },
  {
    comments: "DISE_APRVL",
    ID: 1429,
    queries: [
      `ALTER TABLE DISE_APRVL ADD	[OnRoad_Price] [decimal](18, 2) NULL`,
      `ALTER TABLE DISE_APRVL ADD	[FinanceType] [int] NULL`,
      `ALTER TABLE DISE_APRVL ADD	[FinanceName] [varchar](300) NULL`,
      `ALTER TABLE DISE_APRVL ADD	[Exchange] [int] NULL`,
      `ALTER TABLE DISE_APRVL ADD	[Old_Model] [varchar](300) NULL`,
      `ALTER TABLE DISE_APRVL ADD	[RegNo] [varchar](100) NULL`,
      `ALTER TABLE DISE_APRVL ADD	[Total_Dise_Amt] [decimal](18, 2) NULL`,
      `ALTER TABLE DISE_APRVL ADD	[Price_List_Modl_Var] [varchar](100) NULL`,
      `ALTER TABLE DISE_APRVL ADD	[Account_Code] [varchar](100) NULL`,
      `ALTER TABLE DISE_APRVL ADD	[Account_Stat] [tinyint] NULL`,
      `ALTER TABLE DISE_APRVL ADD	[Account_Rem] [varchar](300) NULL`,
      `ALTER TABLE DISE_APRVL ADD	[Account_Date] [date] NULL`,
      `ALTER TABLE DISE_APRVL ADD	[Next_Level_Appr_Code] [varchar](100) NULL`,
      `ALTER TABLE DISE_APRVL ADD	[KEY_NO] [varchar](100) NULL`,
    ],
  },
  {
    comments: "SALARYFILE",
    ID: 1430,
    queries: [`ALTER TABLE SALARYFILE ADD DD_CLUB MONEY NULL`],
  },
  {
    comments: "SALARYFILE",
    ID: 1431,
    queries: [
      `ALTER TABLE rtl_mst ADD frz_stat INT DEFAULT 0, frz_date DATETIME DEFAULT NULL, frz_by NVARCHAR(15) DEFAULT NULL`,
      `ALTER TABLE Rtl_Cost_Dtl ADD fin_price1  NVARCHAR(30), fin_price2  NVARCHAR(30), fin_price3  NVARCHAR(30),fin_price4  NVARCHAR(30), fin_price5  NVARCHAR(30), fin_price6  NVARCHAR(30), fin_price7  NVARCHAR(30),fin_price8  NVARCHAR(30),fin_price9  NVARCHAR(30), fin_price10 NVARCHAR(30), fin_price11 NVARCHAR(30), fin_price12 NVARCHAR(30), fin_price13 NVARCHAR(30), fin_price14 NVARCHAR(30),fin_price15 NVARCHAR(30)`,
      `ALTER TABLE rtl_mst ADD [PO_Date] [datetime2](7) NULL, [PO_NUMBER] [varchar](50) NULL,[PO_AMOUNT] [varchar](50) NULL,[PO_REC_AMT] [varchar](20) NULL,[PO_REC_DATE] [datetime] NULL`,
      `ALTER TABLE rtl_mst ADD veh_fin_amt NVARCHAR(15), Total_fin_amt NVARCHAR(15)`,
      `ALTER TABLE SALARYFILE ADD DD_CLUB MONEY NULL`,
    ],
  },
  {
    comments: "Emp_Ded",
    ID: 1432,
    queries: [
      `ALTER TABLE Emp_Ded ADD IMPORT_LOCATION INT NULL;`,
      `ALTER TABLE TV_ICM_MST ADD New_Car_Cust_Id VARCHAR(100) NULL`,
      `ALTER TABLE TV_ICM_MST ADD New_Car_Cust_Name VARCHAR(100) NULLL`,
    ],
  },
  {
    comments: "TV_ICM_MST",
    ID: 1433,
    queries: [`ALTER TABLE TV_ICM_MST ADD New_Car_Cust_Name VARCHAR(100) NULL`],
  },
  {
    comments: "USER_CLOUD_ACT_HST",
    ID: 1434,
    queries: [
      `CREATE TABLE [dbo].[USER_CLOUD_ACT_HST](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [USER_COde] [int] NULL,
      [Login_Batch] [nvarchar](20) NULL,
      [Action_Taken] [nvarchar](100) NULL,
      [Action_Date] [date] NULL,
      [Action_Time] [money] NULL,
      [Ledg_Code] [int] NULL,
      [Group_Code] [int] NULL,
      [Book_Code] [int] NULL,
      [Loc_Code] [int] NULL,
      [Action_LMode] [int] NULL,
      [Src_Portal] [int] NOT NULL,
      [Emp_Code] [nvarchar](50) NULL
) ON [PRIMARY]`,
      `
CREATE TABLE [dbo].[USER_MOB_ACT_HST](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [USER_COde] [int] NULL,
      [Login_Batch] [nvarchar](20) NULL,
      [Action_Taken] [nvarchar](100) NULL,
      [Action_Date] [date] NULL,
      [Action_Time] [money] NULL,
      [Ledg_Code] [int] NULL,
      [Group_Code] [int] NULL,
      [Book_Code] [int] NULL,
      [Loc_Code] [int] NULL,
      [Action_LMode] [int] NULL,
      [Src_Portal] [int] NOT NULL,
      [Emp_Code] [nvarchar](50) NULL
) ON [PRIMARY]`,
      `ALTER TABLE EMPLOYEEMASTER 
ALTER COLUMN IEMI VARCHAR(20)`,
    ],
  },
  {
    comments: "comp_keydata",
    ID: 1435,
    queries: [
      `alter table comp_keydata add UnlockSlryChngBtnMOB [nvarchar] (15) null`,
    ],
  },
  {
    comments: "Expense_Mng_Dtl",
    ID: 1436,
    queries: [
      `alter table [Expense_Mng_Dtl] alter column [DESCRIPTION] [varchar](200) NULL`,
      `alter table [Expense_Mng] alter column remark [varchar](200) NULL`,
      `CREATE TABLE [dbo].[IDTO_VERIFICATION_API](
	[utd] [int] IDENTITY(1,1) NOT NULL,
	[api_name] [varchar](100) NOT NULL,
	[payload_hash] [varchar](200) NOT NULL,
	[payload_json] [nvarchar](max) NOT NULL,
	[vendor_response] [nvarchar](max) NULL,
	[is_success] [bit] NOT NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[utd] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

ALTER TABLE [dbo].[IDTO_VERIFICATION_API] ADD  DEFAULT ((0)) FOR [is_success]

ALTER TABLE [dbo].[IDTO_VERIFICATION_API] ADD  DEFAULT (getdate()) FOR [created_at]

ALTER TABLE [dbo].[IDTO_VERIFICATION_API] ADD  DEFAULT (getdate()) FOR [updated_at]`,
    ],
  },
  {
    comments: "Erp_Notification",
    ID: 1437,
    queries: [
      `
 CREATE TABLE [dbo].[Erp_Notification](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [EMPCODE] [varchar](50) NULL,
      [User_Code] [int] NULL,
      [Message] [varchar](500) NULL,
      [Type] [varchar](50) NULL,
       [IsRead] [int] NULL DEFAULT 0,  
      [Created_By] [varchar](50) NULL,
      CreatedAt DATETIME DEFAULT GETDATE(),
[ReadDate] [datetime]  NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
    PRIMARY KEY CLUSTERED
    (
      [UTD] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
    ) ON [PRIMARY]
    WITH
    (
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Erp_Notification_Hst])
    )`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1438,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD exp_mng_dept_wise INT NULL`,
      `ALTER TABLE Expense_Mng ADD DEPARTMENT VARCHAR(50) NULL`,
    ],
  },
  {
    comments: "chas_mst",
    ID: 1439,
    queries: [
      `alter table chas_mst add [InTransit] [int] NULL`,
      `ALTER TABLE NewCar_AuditLogs ADD [Phy_Location1] INT NULL, [Phy_Location2] INT NULL`,
    ],
  },
  {
    comments: "DocketMst_Details",
    ID: 1440,
    queries: [`ALTER TABLE [DocketMst_Details] ADD [MGA_12] [varchar](3) NULL`],
  },
  {
    comments: "Url_Shortener",
    ID: 1441,
    queries: [
      `CREATE TABLE [dbo].[Url_Shortener](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [Short_Code] VARCHAR(20) UNIQUE,
      [Long_Url] VARCHAR(MAX),
      [Cust_Id] [varchar](50) NULL,
      [Export_type] [int] NULL,
      [Created_By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL
    PRIMARY KEY CLUSTERED
    (
      [UTD] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
    ) ON [PRIMARY]
    WITH
    (
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Url_Shortener_Hst])
    )
   
    ALTER TABLE [dbo].[Url_Shortener] ADD  DEFAULT (getdate()) FOR [Created_At]
   
    ALTER TABLE [dbo].[Url_Shortener] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `ALTER TABLE dise_aprvl ADD CustLast_Name VARCHAR(200) NULL`,
    ],
  },
  {
    comments: "Url_Shortener",
    ID: 1442,
    queries: [
      `alter table rtl_mst add [taxable_amt] [money] NULL`,
      `alter table rtl_mst add [disc_exd_amt] [money] NULL`,
      `alter table rtl_mst add [accessable_amt] [money] NULL`,
      `alter table rtl_mst add [igst_amt] [money] NULL`,
      `alter table rtl_mst add [cgst_amt] [money] NULL`,
      `alter table rtl_mst add [sgst_amt] [money] NULL`,
      `alter table rtl_mst add [tcs_per] [money] NULL`,
      `alter table rtl_mst add [tcs_amt] [money] NULL`,
      `alter table rtl_mst add [Total_Amount] [money] NULL`,
      `ALTER TABLE dise_aprvl ADD CustLast_Name VARCHAR(200) NULL`,
      `ALTER TABLE comp_keydata ADD Exp_brnch_sel INT DEFAULT 0`,
      `ALTER TABLE comp_keydata ADD [Enable_Mail_Leave_Punch] [INT] NULL`,
      `ALTER TABLE dise_aprvl ADD Relation INT NULL`,
      `ALTER TABLE dise_aprvl ADD CustMiddle_Name VARCHAR(200) NULL`,
    ],
  },
  {
    comments: "SALARYFILE",
    ID: 1443,
    queries: [`ALTER TABLE SALARYFILE ADD oth_earn5 Money NULL`],
  },
  {
    comments: "Bank_post",
    ID: 1444,
    queries: [
      `alter table Bank_post add is_process INT default 0`,
      `alter table Bank_post add process_time DATETIME`,
    ],
  },
  {
    comments: "Discount_Offers",
    ID: 1445,
    queries: [
      `ALTER TABLE Discount_Offers ADD EXPORT_TYPE INT NULL`,
      `ALTER TABLE Discount_Offers ADD [Item_Code] [int] NULL `,
      `ALTER TABLE Hyundai_Price_List ADD  Cust_Type VARCHAR(50)`,
      `ALTER TABLE Hyundai_Price_List ADD CSD_Price DECIMAL(15,2) NULL`,
      `alter TABLE Shift_Approver add Reason NVARCHAR(200)`,
      `alter TABLE rtl_mst add POS NVARCHAR(10);`,
    ],
  },
  {
    comments: "dise_aprvl",
    ID: 1446,
    queries: [`ALTER TABLE dise_aprvl ADD Cust_ID VARCHAR(50)  ;`],
  },
  {
    comments: "EMPLOYEEMASTER",
    ID: 1447,
    queries: [`alter table EMPLOYEEMASTER add DD_CLUB [NVARCHAR](50) NULL`],
  },
  {
    comments: "EMPLOYEEMASTER_HST",
    ID: 1448,
    queries: [`alter table EMPLOYEEMASTER_HST add DD_CLUB [NVARCHAR](50) NULL`],
  },
  {
    comments: "DISE_APRVL",
    ID: 1449,
    queries: [`EXEC sp_rename 'DISE_APRVL.CUST_ID', 'CUSTOMER_ID', 'COLUMN';`],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1450,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD TV_PENDING_EXCESS_AMT MONEY NULL`,
      `ALTER TABLE TV_ICM_MST ADD [EVALUATOR_FORM] [varchar](50) NULL`,
      `ALTER TABLE TV_ICM_MST ADD [EVALUATOR_FORM_REMARK] [varchar](500) NULL`,
      `ALTER TABLE TV_ICM_MST ADD [EVALUATOR_FORM_DOC] [varchar](max) NULL`,
      `ALTER TABLE EMPLOYEEMASTER ALTER COLUMN [ALTERNET_MAIL] NVARCHAR(50) NULL`,
      `ALTER TABLE EMPLOYEEMASTER_HST ALTER COLUMN [ALTERNET_MAIL] NVARCHAR(50) NULL`,
    ],
  },
  {
    comments: "TERMS_MST",
    ID: 1451,
    queries: [
      `ALTER TABLE [TERMS_MST] ALTER COLUMN [TERMS1]  NVARCHAR(500) NULL`,
      `ALTER TABLE [TERMS_MST] ALTER COLUMN [TERMS2]  NVARCHAR(500) NULL`,
      `ALTER TABLE [TERMS_MST] ALTER COLUMN [TERMS3]  NVARCHAR(500) NULL`,
      `ALTER TABLE [TERMS_MST] ALTER COLUMN [TERMS4]  NVARCHAR(500) NULL`,
      `ALTER TABLE [TERMS_MST] ALTER COLUMN [TERMS5]  NVARCHAR(500) NULL`,
      `ALTER TABLE [TERMS_MST] ALTER COLUMN [TERMS6]  NVARCHAR(500) NULL`,
      `ALTER TABLE [TERMS_MST] ALTER COLUMN [TERMS7]  NVARCHAR(500) NULL`,
      `ALTER TABLE [TERMS_MST] ALTER COLUMN [TERMS8]  NVARCHAR(500) NULL`,
      `ALTER TABLE [TERMS_MST] ALTER COLUMN [TERMS9]  NVARCHAR(500) NULL`,
      `ALTER TABLE [TERMS_MST] ALTER COLUMN [TERMS10] NVARCHAR(500) NULL`,
    ],
  },
  {
    comments: "Mand_Mst",
    ID: 1452,
    queries: [
      `CREATE TABLE [dbo].[Mand_Mst](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [misc_code] [int] NULL,
      [misc_name] [varchar](100) NULL,
      [field_name] [varchar](100) NULL,
      [field_Abbr] [varchar](100) NULL,
      [IsMandtory] [varchar](10) NULL,
      [Created_By] [varchar](50) NULL,
      [CreatedAt] DATETIME DEFAULT GETDATE(),
      [ModifiedAt] [datetime] NULL,
      [Modified_By] [varchar](50) NULL
      [Export_Type] [varchar](10) NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
    PRIMARY KEY CLUSTERED
    (
      [UTD] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
    ) ON [PRIMARY]
    WITH
    (
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Mand_Mst_Hst])
    )
`,
      `ALTER TABLE SHORTLISTED_CANDIDATE ALTER COLUMN [ALTERNET_MAIL] NVARCHAR(50) NULL`,
    ],
  },
  {
    comments: "USER_TBL",
    ID: 1453,
    queries: [`ALTER TABLE USER_TBL ADD PHY_LOC_CODE VARCHAR(50)`],
  },
  {
    comments: "RTO_API",
    ID: 1454,
    queries: [
      `ALTER TABLE RTO_API ADD Finance_PinCode VARCHAR(20) NULL`,
      `CREATE TABLE [dbo].[Mand_Mst](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [misc_code] [int] NULL,
      [misc_name] [varchar](100) NULL,
      [field_name] [varchar](100) NULL,
      [field_Abbr] [varchar](100) NULL,
      [IsMandtory] [varchar](10) NULL,
      [Created_By] [varchar](50) NULL,
      [CreatedAt] DATETIME DEFAULT GETDATE(),
      [ModifiedAt] [datetime] NULL,
      [Modified_By] [varchar](50) NULL,
      [Export_Type] [varchar](10) NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
    PRIMARY KEY CLUSTERED
    (
      [UTD] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
    ) ON [PRIMARY]
    WITH
    (
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Mand_Mst_Hst])
    )`,
      `INSERT INTO Mand_Mst (misc_code, misc_name, field_name, field_Abbr, Created_By, Export_Type)
VALUES
(1,'EMPLOYEEMASTER','EMPCODE','Emp Code','SYSTEM',1),
(1,'EMPLOYEEMASTER','MSPIN','MSPIN','SYSTEM',1),
(1,'EMPLOYEEMASTER','TITLE','Title','SYSTEM',1),
(1,'EMPLOYEEMASTER','EMPFIRSTNAME','First Name','SYSTEM',1),
(1,'EMPLOYEEMASTER','Sal_Region','REGION','SYSTEM',1),
(1,'EMPLOYEEMASTER','CHANNEL','Channel:','SYSTEM',1),
(1,'EMPLOYEEMASTER','CLUSTER','Cluster:','SYSTEM',1),
(1,'EMPLOYEEMASTER','LOCATION','Location','SYSTEM',1),
(1,'EMPLOYEEMASTER','EMPLOYEEDESIGNATION','EMPLOYEE DESIGNATION','SYSTEM',1),
(1,'EMPLOYEEMASTER','EMPLASTNAME','Last Name','SYSTEM',1),
(1,'EMPLOYEEMASTER','PAY_CODE','Emp. Punch Code','SYSTEM',1),
(1,'EMPLOYEEMASTER','Interview_Date','Date of Interview','SYSTEM',1),
(1,'EMPLOYEEMASTER','PERMANENTADDRESS1','Permanent Address 1','SYSTEM',1),
(1,'EMPLOYEEMASTER','PERMANENTADDRESS2','Permanent Address 2','SYSTEM',1),
(1,'EMPLOYEEMASTER','MOBILE_NO','Mobile No','SYSTEM',1),
(1,'EMPLOYEEMASTER','landline_no','Landline No','SYSTEM',1),
(1,'EMPLOYEEMASTER','Father_Mob','Father Mob No.','SYSTEM',1),
(1,'EMPLOYEEMASTER','Mother_Mob','Mother Mobile','SYSTEM',1),
(1,'EMPLOYEEMASTER','Spouse_Mob','Spouse Mobile','SYSTEM',1),
(1,'EMPLOYEEMASTER','CNATIONALITY','Nationality:','SYSTEM',1),
(1,'EMPLOYEEMASTER','PRECOMPCITY','Company City','SYSTEM',1),
(1,'EMPLOYEEMASTER','PCITY','Permanent City','SYSTEM',1),
(1,'EMPLOYEEMASTER','PPINCODE','Permanent Pincode','SYSTEM',1),
(1,'EMPLOYEEMASTER','PSTATE','Permanent State','SYSTEM',1),
(1,'EMPLOYEEMASTER','PDIST','Permanent District','SYSTEM',1),
(1,'EMPLOYEEMASTER','CURRENTADDRESS1','Current Address 1','SYSTEM',1),
(1,'EMPLOYEEMASTER','CURRENTADDRESS2','Current Address 2','SYSTEM',1),
(1,'EMPLOYEEMASTER','CCITY','Current City','SYSTEM',1),
(1,'EMPLOYEEMASTER','CPINCODE','Current Pincode','SYSTEM',1),
(1,'EMPLOYEEMASTER','CSTATE','Current State','SYSTEM',1),
(1,'EMPLOYEEMASTER','CDIST','Current District','SYSTEM',1),
(1,'EMPLOYEEMASTER','LANDLINENO','Landline','SYSTEM',1),
(1,'EMPLOYEEMASTER','MOBILENO','Official Mobile Number','SYSTEM',1),
(1,'EMPLOYEEMASTER','EMERGENCYNAME','Emergency Contact Name','SYSTEM',1),
(1,'EMPLOYEEMASTER','EMERGENCYNO','Emergency Contact No','SYSTEM',1),
(1,'EMPLOYEEMASTER','PANNO','PAN Card No.','SYSTEM',1),
(1,'EMPLOYEEMASTER','PASSPORTNO','Passport No','SYSTEM',1),
(1,'EMPLOYEEMASTER','PASSEXPIRYDATE','Passport Expiry Date','SYSTEM',1),
(1,'EMPLOYEEMASTER','driving_licence','Driving Licence','SYSTEM',1),
(1,'EMPLOYEEMASTER','BLOODGROUP','Blood Group','SYSTEM',1),
(1,'EMPLOYEEMASTER','EMPHEIGHT','Height (In Feet)','SYSTEM',1),
(1,'EMPLOYEEMASTER','EMPWEIGHT','Weight (In Kg)','SYSTEM',1),
(1,'EMPLOYEEMASTER','DOB','Date Of Birth','SYSTEM',1),
(1,'EMPLOYEEMASTER','GENDER','Gender','SYSTEM',1),
(1,'EMPLOYEEMASTER','MARITALSTATUS','Marital Status','SYSTEM',1),
(1,'EMPLOYEEMASTER','SKILLS','Skills','SYSTEM',1),
(1,'EMPLOYEEMASTER','BASICQUALIFICATION','High. Quali.:','SYSTEM',1),
(1,'EMPLOYEEMASTER','EXP_IN_YEAR','Prev. Exp.:','SYSTEM',1),
(1,'EMPLOYEEMASTER','PROFESSIONALQUALIFICATION','Professional Qualification','SYSTEM',1),
(1,'EMPLOYEEMASTER','FATHERNAME','Father Name','SYSTEM',1),
(1,'EMPLOYEEMASTER','MOTHERNAME','Mother Name','SYSTEM',1),
(1,'EMPLOYEEMASTER','MOTHERCONTACTNO','Mother Mob No.','SYSTEM',1),
(1,'EMPLOYEEMASTER','SPOUSENAME','Spouse Name','SYSTEM',1),
(1,'EMPLOYEEMASTER','SPOUSECONTACTNO','Spouse Mob No.','SYSTEM',1),
(1,'EMPLOYEEMASTER','RELCODE','Religion','SYSTEM',1),
(1,'EMPLOYEEMASTER','ALTERNET_MAIL','Email Address','SYSTEM',1),
(1,'EMPLOYEEMASTER','DOM','Date of Anniversary','SYSTEM',1),
(1,'EMPLOYEEMASTER','Marital_Status','Marital Status','SYSTEM',1),
(1,'EMPLOYEEMASTER','PREVIOUSCOMPANYNAME','Previous Company','SYSTEM',1),
(1,'EMPLOYEEMASTER','COSTCENTRE','Cost center:','SYSTEM',1),
(1,'EMPLOYEEMASTER','PREJOININGDATE','Previous Joining Date','SYSTEM',1),
(1,'EMPLOYEEMASTER','PREENDDATE','Previous End Date','SYSTEM',1),
(1,'EMPLOYEEMASTER','PREDESIGNATION','Previous Designation','SYSTEM',1),
(1,'EMPLOYEEMASTER','Acnt_Loc','Branch:(EMP OTHER DTL.)','SYSTEM',1),
(1,'EMPLOYEEMASTER','USR_NAME','Username:(EMP OTHER DTL.)','SYSTEM',1),
(1,'EMPLOYEEMASTER','APPLICATION_ID','Application ID:(EMP OTHER DTL.)','SYSTEM',1),
(1,'EMPLOYEEMASTER','EXT_NO','Extension No:(EMP OTHER DTL.)','SYSTEM',1),
(1,'EMPLOYEEMASTER','PROPOSEDRETIRE_DATE','Proposed Retirement Date:(EMP OTHER DTL.)','SYSTEM',1),
(1,'EMPLOYEEMASTER','AX_EMP_CODE','Old Empcode(EMP OTHER DTL.)','SYSTEM',1),
(1,'EMPLOYEEMASTER','LASTMODI_BY','Last Modified By:','SYSTEM',1),
(1,'EMPLOYEEMASTER','ROLE','Roles and Responsibility:','SYSTEM',1),
(1,'EMPLOYEEMASTER','RESIGNATION_SUBMISSION_DATE','Resignation Submission Date:','SYSTEM',1),
(1,'EMPLOYEEMASTER','TEN_LEAVE_DATE','Tentative Leaving Date','SYSTEM',1),
(1,'EMPLOYEEMASTER','NOTICEPERIOD','Shortfall in Notice Period:','SYSTEM',1),
(1,'EMPLOYEEMASTER','SEPERATIONREMARKS','Remarks:(Resignation Details)','SYSTEM',1),
(1,'EMPLOYEEMASTER','SEPARATION_MODE','Separation Mode:','SYSTEM',1),
(1,'EMPLOYEEMASTER','ExitInterview_Done','Exit Interview Done:','SYSTEM',1),
(1,'EMPLOYEEMASTER','LASTWOR_DATE','Last Working Date:','SYSTEM',1),
(1,'EMPLOYEEMASTER','DATE_OF_EXIT_INTERVIEW','Date of Exit Interview:','SYSTEM',1),
(1,'EMPLOYEEMASTER','DATE_OF_SETTLEMENT','Date of Settlement:','SYSTEM',1),
(1,'EMPLOYEEMASTER','INTERVIEWREMAKS','Exit Interview Remarks','SYSTEM',1),
(1,'EMPLOYEEMASTER','CORPORATEMAILID','Official Email','SYSTEM',1),
(1,'EMPLOYEEMASTER','CURRENTJOINDATE','Date of Joining','SYSTEM',1),
(1,'EMPLOYEEMASTER','BANKNAME','Bank Name','SYSTEM',1),
(1,'EMPLOYEEMASTER','Cnf_BANKACCOUNTNO','Confirm Account No.','SYSTEM',1),
(1,'EMPLOYEEMASTER','ifsc_code','IFSC Code:','SYSTEM',1),
(1,'EMPLOYEEMASTER','BRANCH','Bank Branch Name:','SYSTEM',1),
(1,'EMPLOYEEMASTER','Emp_Ac_Name','Bank Account Holder Name:','SYSTEM',1),
(1,'EMPLOYEEMASTER','BANKACCOUNTNO','Bank Account No','SYSTEM',1),
(1,'EMPLOYEEMASTER','PAYMENTMODE','Payment Mode:','SYSTEM',1),
(1,'EMPLOYEEMASTER','EmpType','Employee Type','SYSTEM',1),
(1,'EMPLOYEEMASTER','ORGANISATIONNAME','Organisation','SYSTEM',1),
(1,'EMPLOYEEMASTER','DIVISION','Department','SYSTEM',1),
(1,'EMPLOYEEMASTER','UNIT','Unit','SYSTEM',1),
(1,'EMPLOYEEMASTER','SECTION','Section','SYSTEM',1),
(1,'EMPLOYEEMASTER','LEVEL','Employee Level:(EMP OTHER DTL.)','SYSTEM',1),
(1,'EMPLOYEEMASTER','PFNO','PF (Yes/No)','SYSTEM',1),
(1,'EMPLOYEEMASTER','pfper','PF%','SYSTEM',1),
(1,'EMPLOYEEMASTER','PF_Date','PF Effective from','SYSTEM',1),
(1,'EMPLOYEEMASTER','ESINO','ESIC (Yes/No)','SYSTEM',1),
(1,'EMPLOYEEMASTER','ESI_Date','ESIC Effective From','SYSTEM',1),
(1,'EMPLOYEEMASTER','UAN_No','UAN No','SYSTEM',1),
(1,'EMPLOYEEMASTER','LWFNO','LWF','SYSTEM',1),
(1,'EMPLOYEEMASTER','WEEKLYOFF','Weekly Off:','SYSTEM',1),
(1,'EMPLOYEEMASTER','BONUS','Bonus','SYSTEM',1),
(1,'EMPLOYEEMASTER','pro_tax','Professional Tax','SYSTEM',1),
(1,'EMPLOYEEMASTER','EMP_SHIFT','EMP. Shift','SYSTEM',1),
(1,'EMPLOYEEMASTER','LIN_NO','LIN NO','SYSTEM',1),
(1,'EMPLOYEEMASTER','DD_CLUB','DD CLUB','SYSTEM',1),
(1,'EMPLOYEEMASTER','Punch_Type','Employee Punch Type:','SYSTEM',1),
(1,'EMPLOYEEMASTER','MONTHLY_CTC','Monthly CTC','SYSTEM',1),
(1,'EMPLOYEEMASTER','ANNUAL_CTC','Annual CTC','SYSTEM',1),
(1,'EMPLOYEEMASTER','EMP_STATUS','Emp. Status','SYSTEM',1),
(1,'EMPLOYEEMASTER','BIOMETRIC_ID','Biometric Id: (EMP OTHER DTL.)','SYSTEM',1),
(1,'EMPLOYEEMASTER','PROPOSEDRETIRE_DATE','Proposed Retirement Date','SYSTEM',1),
(1,'EMPLOYEEMASTER','LASTWOR_DATE','Last Working Date','SYSTEM',1),
(1,'EMPLOYEEMASTER','UID_NO','Aadhar Card No.','SYSTEM',1),
(1,'EMPLOYEEMASTER','pfnumber','PF NO:','SYSTEM',1),
(1,'EMPLOYEEMASTER','esinumber','ESIC NO','SYSTEM',1),
(1,'EMPLOYEEMASTER','Reporting_1','Reporting Manager 1','SYSTEM',1),
(1,'EMPLOYEEMASTER','Reporting_2','Reporting Manager 2','SYSTEM',1),
(1,'EMPLOYEEMASTER','Reporting_3','Reporting Manager 3','SYSTEM',1),
(1,'EMPLOYEEMASTER','Is_Profile_Filled','Profile Filled','SYSTEM',1),
(1,'EMPLOYEEMASTER','PROBATIONPERIOD','Prob. Period (days)','SYSTEM',1),
(1,'EMPLOYEEMASTER','Prob_period','Probation Period','SYSTEM',1),
(1,'EMPLOYEEMASTER','Confirmation_Date','Confirmation Date','SYSTEM',1),
(1,'EMPLOYEEMASTER','DRIVINGLIC_ISSUEPALACE','Driving Lic. No.','SYSTEM',1),
(1,'EMPLOYEEMASTER','Dlv_Type','Driving Lic. Type','SYSTEM',1),
(1,'EMPLOYEEMASTER','DRIVINGLIC_ISSUEDATE','Driving Lic. Issus Date','SYSTEM',1),
(1,'EMPLOYEEMASTER','DRIVINGLIC_EXPDATE','Driving Lic. Expiry Date','SYSTEM',1),
(1,'EMPLOYEEMASTER','App_Attendance','Allow App Attendance','SYSTEM',1),
(1,'EMPLOYEEMASTER','IEMI','Mobile IMEI Number:','SYSTEM',1),
(1,'EMPLOYEEMASTER','Android_ID','Android Mobile id:','SYSTEM',1),
(1,'EMPLOYEEMASTER','mPunch','Allow Mobile App Punch In/Out:','SYSTEM',1),
(1,'EMPLOYEEMASTER','MOBILE_RIGHTS','MOBILE RIGHTS','SYSTEM',1),
(1,'EMPLOYEEMASTER','mMispunch','Allow Mobile Misspunch Request:','SYSTEM',1),
(1,'EMPLOYEEMASTER','mApprove','Allow Mobile App Punch Approval:','SYSTEM',1),
(1,'EMPLOYEEMASTER','mLeave','Allow Mobile App Leave Request:','SYSTEM',1),
(1,'EMPLOYEEMASTER','mCalender','Allow Attendance Calendar View:','SYSTEM',1),
(1,'EMPLOYEEMASTER','MSPN_Id','MSPN Id','SYSTEM',1),
(1,'EMPLOYEEMASTER','IsMSPN','MSPN Certified (YES/NO)','SYSTEM',1),
(1,'EMPLOYEEMASTER','MSPN_DTL','MSPN DTL','SYSTEM',1),
(1,'EMPLOYEEMASTER','Relaxation_Type','Relaxation Type:','SYSTEM',1),
(1,'EMPLOYEEMASTER','ShiftIn_Relaxation','Shift In Relation (in hrs):','SYSTEM',1),
(1,'EMPLOYEEMASTER','ShiftOut_Relaxation','Shift Out Relation (in hrs):','SYSTEM',1),
(1,'EMPLOYEEMASTER','Cumulative_Relaxation','Cumulative Shift Relation:','SYSTEM',1),
(1,'EMPLOYEEMASTER','empcode2','EMP Code2:','SYSTEM',1),
(1,'EMPLOYEEMASTER','empcode3','EMP Code3:','SYSTEM',1),
(1,'EMPLOYEEMASTER','empcode4','EMP Code4:','SYSTEM',1),
(1,'EMPLOYEEMASTER','IsiphoneUser','IPHONE USER(YES/NO)','SYSTEM',1),
(1,'EMPLOYEEMASTER','empcode4','EMP Code4:','SYSTEM',1)`,
    ],
  },
  {
    comments: "RTO_API",
    ID: 1456,
    queries: [
      `ALTER TABLE dbo.Mand_Mst SET (SYSTEM_VERSIONING = OFF); GO`,
      `DROP TABLE MAND_MST`,
      `CREATE TABLE [dbo].[Mand_Mst](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[misc_code] [int] NULL,
	[misc_name] [varchar](100) NULL,
	[field_name] [varchar](100) NULL,
	[field_Abbr] [varchar](100) NULL,
	[IsMandtory] [varchar](10) NULL,
	[Created_By] [varchar](50) NULL,
	[CreatedAt] [datetime] NULL,
	[ModifiedAt] [datetime] NULL,
	[Modified_By] [varchar](50) NULL,
	[Export_Type] [varchar](10) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Mand_Mst_Hst])
)

ALTER TABLE [dbo].[Mand_Mst] ADD  DEFAULT (getdate()) FOR [CreatedAt]`,
      `INSERT INTO Mand_Mst (misc_code, misc_name, field_name, field_Abbr, Created_By, Export_Type ,IsMandtory)
VALUES
(1,'EMPLOYEEMASTER','EMPCODE','Emp Code','SYSTEM',1,1),
(1,'EMPLOYEEMASTER','MSPIN','MSPIN','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','TITLE','Title','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','EMPFIRSTNAME','First Name','SYSTEM',1 ,1),
(1,'EMPLOYEEMASTER','Sal_Region','REGION','SYSTEM',1,1),
(1,'EMPLOYEEMASTER','CHANNEL','Channel:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','CLUSTER','Cluster:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','LOCATION','Location','SYSTEM',1,1),
(1,'EMPLOYEEMASTER','EMPLOYEEDESIGNATION','EMPLOYEE DESIGNATION','SYSTEM',1,1),
(1,'EMPLOYEEMASTER','EMPLASTNAME','Last Name','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PAY_CODE','Emp. Punch Code','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Interview_Date','Date of Interview','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PERMANENTADDRESS1','Permanent Address 1','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PERMANENTADDRESS2','Permanent Address 2','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','MOBILE_NO','Mobile No','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','landline_no','Landline No','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Father_Mob','Father Mob No.','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Mother_Mob','Mother Mobile','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Spouse_Mob','Spouse Mobile','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','CNATIONALITY','Nationality:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PRECOMPCITY','Company City','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PCITY','Permanent City','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PPINCODE','Permanent Pincode','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PSTATE','Permanent State','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PDIST','Permanent District','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','CURRENTADDRESS1','Current Address 1','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','CURRENTADDRESS2','Current Address 2','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','CCITY','Current City','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','CPINCODE','Current Pincode','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','CSTATE','Current State','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','CDIST','Current District','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','LANDLINENO','Landline','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','MOBILENO','Official Mobile Number','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','EMERGENCYNAME','Emergency Contact Name','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','EMERGENCYNO','Emergency Contact No','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PANNO','PAN Card No.','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PASSPORTNO','Passport No','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PASSEXPIRYDATE','Passport Expiry Date','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','driving_licence','Driving Licence','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','BLOODGROUP','Blood Group','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','EMPHEIGHT','Height (In Feet)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','EMPWEIGHT','Weight (In Kg)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','DOB','Date Of Birth','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','GENDER','Gender','SYSTEM',1,1),
(1,'EMPLOYEEMASTER','MARITALSTATUS','Marital Status','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','SKILLS','Skills','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','BASICQUALIFICATION','High. Quali.:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','EXP_IN_YEAR','Prev. Exp.:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PROFESSIONALQUALIFICATION','Professional Qualification','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','FATHERNAME','Father Name','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','MOTHERNAME','Mother Name','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','MOTHERCONTACTNO','Mother Mob No.','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','SPOUSENAME','Spouse Name','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','SPOUSECONTACTNO','Spouse Mob No.','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','RELCODE','Religion','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','ALTERNET_MAIL','Email Address','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','DOM','Date of Anniversary','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Marital_Status','Marital Status','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PREVIOUSCOMPANYNAME','Previous Company','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','COSTCENTRE','Cost center:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PREJOININGDATE','Previous Joining Date','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PREENDDATE','Previous End Date','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PREDESIGNATION','Previous Designation','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Acnt_Loc','Branch:(EMP OTHER DTL.)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','USR_NAME','Username:(EMP OTHER DTL.)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','APPLICATION_ID','Application ID:(EMP OTHER DTL.)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','EXT_NO','Extension No:(EMP OTHER DTL.)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PROPOSEDRETIRE_DATE','Proposed Retirement Date:(EMP OTHER DTL.)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','AX_EMP_CODE','Old Empcode(EMP OTHER DTL.)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','LASTMODI_BY','Last Modified By:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','ROLE','Roles and Responsibility:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','RESIGNATION_SUBMISSION_DATE','Resignation Submission Date:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','TEN_LEAVE_DATE','Tentative Leaving Date','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','NOTICEPERIOD','Shortfall in Notice Period:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','SEPERATIONREMARKS','Remarks:(Resignation Details)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','SEPARATION_MODE','Separation Mode:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','ExitInterview_Done','Exit Interview Done:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','LASTWOR_DATE','Last Working Date:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','DATE_OF_EXIT_INTERVIEW','Date of Exit Interview:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','DATE_OF_SETTLEMENT','Date of Settlement:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','INTERVIEWREMAKS','Exit Interview Remarks','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','CORPORATEMAILID','Official Email','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','CURRENTJOINDATE','Date of Joining','SYSTEM',1,1),
(1,'EMPLOYEEMASTER','BANKNAME','Bank Name','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Cnf_BANKACCOUNTNO','Confirm Account No.','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','ifsc_code','IFSC Code:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','BRANCH','Bank Branch Name:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Emp_Ac_Name','Bank Account Holder Name:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','BANKACCOUNTNO','Bank Account No','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','ACCOUNT_TYPE','Account Type:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PAYMENTMODE','Payment Mode:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','EmpType','Employee Type','SYSTEM',1,1),
(1,'EMPLOYEEMASTER','ORGANISATIONNAME','Organisation','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','DIVISION','Department','SYSTEM',1,1),
(1,'EMPLOYEEMASTER','UNIT','Unit','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','SECTION','Section','SYSTEM',1,1),
(1,'EMPLOYEEMASTER','LEVEL','Employee Level:(EMP OTHER DTL.)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PFNO','PF (Yes/No)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','pfper','PF%','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PF_Date','PF Effective from','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','ESINO','ESIC (Yes/No)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','ESI_Date','ESIC Effective From','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','UAN_No','UAN No','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','LWFNO','LWF','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','WEEKLYOFF','Weekly Off:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','BONUS','Bonus','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','pro_tax','Professional Tax','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','EMP_SHIFT','EMP. Shift','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','LIN_NO','LIN NO','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','DD_CLUB','DD CLUB','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Punch_Type','Employee Punch Type:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','MONTHLY_CTC','Monthly CTC','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','ANNUAL_CTC','Annual CTC','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','EMP_STATUS','Emp. Status','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','BIOMETRIC_ID','Biometric Id: (EMP OTHER DTL.)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PROPOSEDRETIRE_DATE','Proposed Retirement Date','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','LASTWOR_DATE','Last Working Date','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','UID_NO','Aadhar Card No.','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','pfnumber','PF NO:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','esinumber','ESIC NO','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Reporting_1','Reporting Manager 1','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Reporting_2','Reporting Manager 2','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Reporting_3','Reporting Manager 3','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Is_Profile_Filled','Profile Filled','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','PROBATIONPERIOD','Prob. Period (days)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Prob_period','Probation Period','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Confirmation_Date','Confirmation Date','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','DRIVINGLIC_ISSUEPALACE','Driving Lic. No.','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Dlv_Type','Driving Lic. Type','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','DRIVINGLIC_ISSUEDATE','Driving Lic. Issus Date','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','DRIVINGLIC_EXPDATE','Driving Lic. Expiry Date','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','App_Attendance','Allow App Attendance','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','IEMI','Mobile IMEI Number:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Android_ID','Android Mobile id:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','mPunch','Allow Mobile App Punch In/Out:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','MOBILE_RIGHTS','MOBILE RIGHTS','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','mMispunch','Allow Mobile Misspunch Request:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','mApprove','Allow Mobile App Punch Approval:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','mLeave','Allow Mobile App Leave Request:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','mCalender','Allow Attendance Calendar View:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','MSPN_Id','MSPN Id','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','IsMSPN','MSPN Certified (YES/NO)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','MSPN_DTL','MSPN DTL','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Relaxation_Type','Relaxation Type:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','ShiftIn_Relaxation','Shift In Relation (in hrs):','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','ShiftOut_Relaxation','Shift Out Relation (in hrs):','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','Cumulative_Relaxation','Cumulative Shift Relation:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','empcode2','EMP Code2:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','empcode3','EMP Code3:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','empcode4','EMP Code4:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','IsiphoneUser','IPHONE USER(YES/NO)','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','empcode4','EMP Code4:','SYSTEM',1,0),
(1,'EMPLOYEEMASTER','LASTMODI_ON','Last Modified On:','SYSTEM',1,0)`,
    ],
  },
  {
    comments: "RTO_API",
    ID: 1457,
    queries: [`ALTER TABLE RTO_API ADD AC_Fitted INT NULL`],
  },
  {
    comments: "User_Session_Mst",
    ID: 1458,
    queries: [
      `CREATE TABLE User_Session_Mst (
    Session_Id UNIQUEIDENTIFIER PRIMARY KEY,
    User_Code INT NOT NULL,
    User_Name VARCHAR(100),
    Comp_Code VARCHAR(50),

    Login_Time DATETIME DEFAULT GETDATE(),
    Last_Activity_Time DATETIME NOT NULL,
    Logout_Time DATETIME NULL,

    Is_Active BIT DEFAULT 1,

    IP_Address VARCHAR(50),
    Browser_Info VARCHAR(255)
);`,
      `alter table RTL_MST add [Shft_Cust_Name] [varchar](50) NULL`,
      `alter table RTL_MST add [Shft_Cust_Ph] [varchar](20) NULL`,
    ],
  },
  {
    comments: "User_Session_Mst",
    ID: 1459,
    queries: [
      `SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[UpdateOrInsertLeaveBalance]
@Emp_Code VARCHAR(50),
@Leave_Type INT,
@Leave_Type2 INT,
@Leave_Mnth INT,
@Leave_Yr INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Op_Bal DECIMAL(10, 2);
    DECLARE @Gen_Lev DECIMAL(10, 2) = 0.00;
    DECLARE @Avail_Lev DECIMAL(10, 2) = 0.00;
    DECLARE @Cl_Bal DECIMAL(10, 2);
    DECLARE @table_avail DECIMAL(10, 2);
    DECLARE @Prev_Mnth INT;
    DECLARE @Prev_Yr INT;
    DECLARE @UsePayrollMonth BIT = 0;
    DECLARE @NextMonth INT;
    DECLARE @NextYear INT;
    DECLARE @NewOp_Bal DECIMAL(10, 2);
    DECLARE @NextAvail_Lev DECIMAL(10, 2);
    DECLARE @CustomMonth INT;
    DECLARE @CustomYear INT;
    DECLARE @DayOfMonth INT;
    
    -- Check if company uses 26-25 payroll month system
    IF EXISTS (SELECT 1 FROM Misc_Mst WHERE Misc_Type = 25)
    BEGIN
        SET @UsePayrollMonth = 1;
    END
    
    -- Calculate @Avail_Lev for CURRENT month/year
    IF @UsePayrollMonth = 1
    BEGIN
        -- For 26-25 payroll month system
        -- Calculate custom month from dates in attendancetable
        -- Logic: If day >= 26, use next month, else use current month
        SELECT @Avail_Lev = ISNULL(SUM(CAST(count_ AS FLOAT)), 0)  
        FROM (
            SELECT (SELECT TOP 1 ISNULL(misc_dtl3, 0) 
                    FROM Misc_Mst 
                    WHERE Misc_Type = 92 AND Misc_Code = att.mipunch_reason) AS count_
            FROM attendancetable att
            INNER JOIN Misc_Mst pm ON pm.Misc_Type = 25
            WHERE att.mipunch_reason IN (@Leave_Type, @Leave_Type2) 
              AND att.emp_code = @Emp_Code 
              AND att.MAN_APPR = 'Y'
              -- Calculate custom month from date
              AND (
                  -- If day >= 26, use next month; else use current month
                  (DAY(att.dateoffice) >= 26 AND pm.Misc_Code = CASE WHEN MONTH(att.dateoffice) + 1 > 12 THEN 1 ELSE MONTH(att.dateoffice) + 1 END
                   AND YEAR(CONVERT(DATE, pm.Misc_Dtl2, 103)) = CASE WHEN MONTH(att.dateoffice) + 1 > 12 THEN YEAR(att.dateoffice) + 1 ELSE YEAR(att.dateoffice) END)
                  OR
                  (DAY(att.dateoffice) < 26 AND pm.Misc_Code = MONTH(att.dateoffice)
                   AND YEAR(CONVERT(DATE, pm.Misc_Dtl2, 103)) = YEAR(att.dateoffice))
              )
              -- Match with the requested month and year
              AND pm.Misc_Code = @Leave_Mnth
              AND YEAR(CONVERT(DATE, pm.Misc_Dtl2, 103)) = @Leave_Yr
              -- Also check if date falls within the payroll month range
              AND CAST(att.dateoffice AS DATE) >= CONVERT(DATE, pm.Misc_Dtl1, 103)
              AND CAST(att.dateoffice AS DATE) <= CONVERT(DATE, pm.Misc_Dtl2, 103)
        ) AS da;
    END
    ELSE
    BEGIN
        -- For normal 1-31 calendar month system (no change)
        SELECT @Avail_Lev = ISNULL(SUM(CAST(count_ AS FLOAT)), 0)  
        FROM (
            SELECT (SELECT TOP 1 ISNULL(misc_dtl3, 0) 
                    FROM Misc_Mst 
                    WHERE Misc_Type = 92 AND Misc_Code = mipunch_reason) AS count_
            FROM attendancetable 
            WHERE mipunch_reason IN (@Leave_Type, @Leave_Type2) 
              AND emp_code = @Emp_Code 
              AND MONTH(dateoffice) = @Leave_Mnth 
              AND YEAR(dateoffice) = @Leave_Yr 
              AND MAN_APPR = 'Y'
        ) AS da;
    END
    
    -- Calculate previous month and year
    SET @Prev_Mnth = CASE WHEN @Leave_Mnth = 1 THEN 12 ELSE @Leave_Mnth - 1 END;
    SET @Prev_Yr = CASE WHEN @Leave_Mnth = 1 THEN @Leave_Yr - 1 ELSE @Leave_Yr END;

    -- Check if the row exists for the current month
    IF EXISTS (SELECT 1 FROM Leave_bal
               WHERE Emp_Code = @Emp_Code 
                 AND Leave_Type = @Leave_Type 
                 AND Leave_Mnth = @Leave_Mnth 
                 AND Leave_Yr = @Leave_Yr)
    BEGIN
        -- Get current values if row exists
        SELECT @Op_Bal = Op_Bal, 
               @Gen_Lev = Gen_Lev, 
               @Cl_Bal = Cl_Bal,
               @table_avail = Avail_Lev
        FROM Leave_bal
        WHERE Emp_Code = @Emp_Code 
          AND Leave_Type = @Leave_Type 
          AND Leave_Mnth = @Leave_Mnth 
          AND Leave_Yr = @Leave_Yr;

        -- Check if Cl_Bal calculation is correct
        IF @Cl_Bal <> @Op_Bal + @Gen_Lev - @Avail_Lev OR @table_avail <> @Avail_Lev
        BEGIN
            -- Update Cl_Bal for current month
            SET @Cl_Bal = @Op_Bal + @Gen_Lev - @Avail_Lev;

            UPDATE Leave_bal
            SET Cl_Bal = @Cl_Bal, 
                Avail_Lev = @Avail_Lev
            WHERE Emp_Code = @Emp_Code 
              AND Leave_Type = @Leave_Type 
              AND Leave_Mnth = @Leave_Mnth 
              AND Leave_Yr = @Leave_Yr;
        END
    END
    ELSE
    BEGIN
        -- Check if future month record exists
        IF EXISTS (SELECT 1 FROM Leave_bal
                   WHERE Emp_Code = @Emp_Code 
                     AND Leave_Type = @Leave_Type 
                     AND (
                         (Leave_Yr = @Leave_Yr AND Leave_Mnth > @Leave_Mnth)
                         OR Leave_Yr > @Leave_Yr
                     ))
        BEGIN
            -- Skip insertion if a future month record exists
            PRINT 'Cannot insert previous month row as a subsequent month record already exists.';
            RETURN;
        END
        
        -- Insert new row for the current month if it does not exist
        -- Get previous month's Cl_Bal as the Op_Bal
        SELECT @Op_Bal = Cl_Bal
        FROM Leave_bal
        WHERE Emp_Code = @Emp_Code 
          AND Leave_Type = @Leave_Type 
          AND Leave_Mnth = @Prev_Mnth
          AND Leave_Yr = @Prev_Yr;

        IF @Op_Bal IS NULL
            SET @Op_Bal = 0.00;

        -- Calculate Cl_Bal for the new month
        SET @Cl_Bal = @Op_Bal + @Gen_Lev - @Avail_Lev;

        -- Insert the new row
        INSERT INTO Leave_bal (Emp_Code, Leave_Type, Leave_Mnth, Op_Bal, Gen_Lev, Avail_Lev, Cl_Bal, Leave_Yr)
        VALUES (@Emp_Code, @Leave_Type, @Leave_Mnth, @Op_Bal, @Gen_Lev, @Avail_Lev, @Cl_Bal, @Leave_Yr);
    END

    -- Propagate Cl_Bal changes to all subsequent months
    SET @NextMonth = @Leave_Mnth + 1;
    SET @NextYear = @Leave_Yr;
    
    IF @NextMonth = 13
    BEGIN
        SET @NextMonth = 1;
        SET @NextYear = @NextYear + 1;
    END
    
    SET @NewOp_Bal = @Cl_Bal;

    WHILE EXISTS (SELECT 1 FROM Leave_bal
                  WHERE Emp_Code = @Emp_Code 
                    AND Leave_Type = @Leave_Type 
                    AND Leave_Mnth = @NextMonth 
                    AND Leave_Yr = @NextYear)
    BEGIN
        -- Calculate @Avail_Lev for the NEXT month
        IF @UsePayrollMonth = 1
        BEGIN
            -- For 26-25 payroll month system
            SELECT @NextAvail_Lev = ISNULL(SUM(CAST(count_ AS FLOAT)), 0)  
            FROM (
                SELECT (SELECT TOP 1 ISNULL(misc_dtl3, 0) 
                        FROM Misc_Mst 
                        WHERE Misc_Type = 92 AND Misc_Code = att.mipunch_reason) AS count_
                FROM attendancetable att
                INNER JOIN Misc_Mst pm ON pm.Misc_Type = 25
                WHERE att.mipunch_reason IN (@Leave_Type, @Leave_Type2) 
                  AND att.emp_code = @Emp_Code 
                  AND att.MAN_APPR = 'Y'
                  -- Calculate custom month from date
                  AND (
                      -- If day >= 26, use next month; else use current month
                      (DAY(att.dateoffice) >= 26 AND pm.Misc_Code = CASE WHEN MONTH(att.dateoffice) + 1 > 12 THEN 1 ELSE MONTH(att.dateoffice) + 1 END
                       AND YEAR(CONVERT(DATE, pm.Misc_Dtl2, 103)) = CASE WHEN MONTH(att.dateoffice) + 1 > 12 THEN YEAR(att.dateoffice) + 1 ELSE YEAR(att.dateoffice) END)
                      OR
                      (DAY(att.dateoffice) < 26 AND pm.Misc_Code = MONTH(att.dateoffice)
                       AND YEAR(CONVERT(DATE, pm.Misc_Dtl2, 103)) = YEAR(att.dateoffice))
                  )
                  -- Match with the next month and year
                  AND pm.Misc_Code = @NextMonth
                  AND YEAR(CONVERT(DATE, pm.Misc_Dtl2, 103)) = @NextYear
                  -- Also check if date falls within the payroll month range
                  AND CAST(att.dateoffice AS DATE) >= CONVERT(DATE, pm.Misc_Dtl1, 103)
                  AND CAST(att.dateoffice AS DATE) <= CONVERT(DATE, pm.Misc_Dtl2, 103)
            ) AS da;
        END
        ELSE
        BEGIN
            -- For normal 1-31 calendar month system (no change)
            SELECT @NextAvail_Lev = ISNULL(SUM(CAST(count_ AS FLOAT)), 0)  
            FROM (
                SELECT (SELECT TOP 1 ISNULL(misc_dtl3, 0) 
                        FROM Misc_Mst 
                        WHERE Misc_Type = 92 AND Misc_Code = mipunch_reason) AS count_
                FROM attendancetable 
                WHERE mipunch_reason IN (@Leave_Type, @Leave_Type2) 
                  AND emp_code = @Emp_Code 
                  AND MONTH(dateoffice) = @NextMonth 
                  AND YEAR(dateoffice) = @NextYear 
                  AND MAN_APPR = 'Y'
            ) AS da;
        END

        UPDATE Leave_bal
        SET Op_Bal = @NewOp_Bal,
            Cl_Bal = @NewOp_Bal + Gen_Lev - @NextAvail_Lev,
            Avail_Lev = @NextAvail_Lev
        WHERE Emp_Code = @Emp_Code 
          AND Leave_Type = @Leave_Type 
          AND Leave_Mnth = @NextMonth 
          AND Leave_Yr = @NextYear;

        -- Get the updated Cl_Bal for the next iteration
        SELECT @NewOp_Bal = Cl_Bal
        FROM Leave_bal
        WHERE Emp_Code = @Emp_Code 
          AND Leave_Type = @Leave_Type 
          AND Leave_Mnth = @NextMonth 
          AND Leave_Yr = @NextYear;

        -- Move to the next month
        SET @NextMonth = @NextMonth + 1;
        IF @NextMonth = 13
        BEGIN
            SET @NextMonth = 1;
            SET @NextYear = @NextYear + 1;
        END
    END
END;
GO`,
      `ALTER TABLE rtl_mst ADD Inv_Ledg int`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1460,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD Wtsp_markting_per_msz_chrg MONEY NULL`,
      `ALTER TABLE COMP_KEYDATA ADD Wtsp_utility_per_msz_chrg MONEY NULL`,
      `CREATE TABLE [dbo].[attendancetable_logs](
      [Emp_Code] [char](20) NOT NULL,
      [dateoffice] [varchar](50) NULL,
      [rescd] [char](3) NULL,
      [media] [char](1) NULL,
      [shiftstarttime] [money] NULL,
      [shiftendtime] [money] NULL,
      [lunchstarttime] [varchar](50) NULL,
      [lunchendtime] [varchar](50) NULL,
      [hoursworked] [decimal](5, 2) NULL,
      [exclunchhours] [decimal](5, 2) NULL,
      [otduration] [decimal](5, 2) NULL,
      [osduration] [decimal](5, 2) NULL,
      [otamount] [decimal](11, 2) NULL,
      [earlyarrival] [decimal](5, 2) NULL,
      [earlydeparture] [decimal](5, 2) NULL,
      [latearrival] [decimal](5, 2) NULL,
      [lunchearlydeparture] [decimal](5, 2) NULL,
      [lunchlatearrival] [decimal](5, 2) NULL,
      [totallosshrs] [decimal](5, 2) NULL,
      [status] [char](6) NULL,
      [reason] [varchar](50) NULL,
      [shift] [char](3) NULL,
      [shiftattended] [char](3) NULL,
      [in1] [varchar](50) NULL,
      [in2] [varchar](50) NULL,
      [out1] [varchar](50) NULL,
      [out2] [varchar](50) NULL,
[BM_IN1] [varchar](50) NULL,
[BM_OUT1] [varchar](50) NULL,
      [in1mannual] [char](1) NULL,
      [in2mannual] [char](1) NULL,
      [out1mannual] [char](1) NULL,
      [out2mannual] [char](1) NULL,
      [leavevalue] [decimal](5, 2) NULL,
      [presentvalue] [decimal](5, 2) NULL,
      [absentvalue] [decimal](5, 2) NULL,
      [holiday_value] [decimal](5, 2) NULL,
      [wo_value] [decimal](5, 2) NULL,
      [outworkduration] [decimal](5, 2) NULL,
      [leavetype] [char](1) NULL,
      [leavecode] [char](3) NULL,
      [leaveamount] [decimal](5, 2) NULL,
      [flag] [char](4) NULL,
      [leaveaprdate] [varchar](50) NULL,
      [voucher_no] [char](10) NULL,
      [firsthalfleavecode] [char](3) NULL,
      [secondhalfleavecode] [char](3) NULL,
      [leavetype1] [char](1) NULL,
      [leavetype2] [char](1) NULL,
      [leaveamount1] [decimal](5, 2) NULL,
      [leaveamount2] [decimal](5, 2) NULL,
      [tlflag] [char](1) NULL,
      [vearlydeparture] [decimal](5, 2) NULL,
      [vlatearrival] [decimal](5, 2) NULL,
      [vlunchearlydeparture] [decimal](5, 2) NULL,
      [vlunchlatearrival] [decimal](5, 2) NULL,
      [vtotallosshrs] [decimal](5, 2) NULL,
      [os2otvflag] [char](1) NULL,
      [votduration] [decimal](5, 2) NULL,
      [votamount] [decimal](11, 2) NULL,
      [againstdate1] [varchar](50) NULL,
      [against1] [decimal](3, 2) NULL,
      [againstdate2] [varchar](50) NULL,
      [against2] [decimal](3, 2) NULL,
      [otapproval] [char](1) NULL,
      [cardot] [decimal](8, 2) NULL,
      [appot] [decimal](6, 2) NULL,
      [appothod] [decimal](6, 2) NULL,
      [otapprovalhod] [char](1) NULL,
      [assshift] [char](3) NULL,
      [approve] [char](1) NULL,
      [intype] [char](1) NULL,
      [gatepass] [char](1) NULL,
      [Priority_Code] [tinyint] NULL,
      [IsManual] [nvarchar](1) NULL,
      [MAN_APPR] [nvarchar](1) NULL,
      [mipunch_reason] [nvarchar](40) NULL,
      [Mis_Enterby] [nvarchar](20) NULL,
      [Mis_Aprby] [nvarchar](20) NULL,
      [Shift_Enterby] [nvarchar](20) NULL,
      [MI_Remark] [int] NULL,
      [DriveSerial] [nvarchar](50) NULL,
      [SystemSerial] [nvarchar](50) NULL,
      [Reject_By] [nvarchar](50) NULL,
      [Computer_name] [nvarchar](200) NULL,
      [Man_Entry_Date] [nvarchar](200) NULL,
      [CO_Value] [int] NULL,
      [In_Latitude] [nvarchar](50) NULL,
      [Out_Latitude] [nvarchar](50) NULL,
      [In_Longitude] [nvarchar](50) NULL,
      [Out_Longitude] [nvarchar](50) NULL,
      [MAN_REJ] [nvarchar](10) NULL,
      [Man_Recomend] [nvarchar](10) NULL,
      [App_in1] [varchar](50) NULL,
      [App_out1] [varchar](50) NULL,
      [NightShift] [int] NULL,
      [SPL_REMARK] [nvarchar](200) NULL,
      [Short_Lev] [decimal](12, 2) NULL,
      [In_Add] [nvarchar](300) NULL,
      [Out_Add] [nvarchar](300) NULL,
      [In_Photo] [nvarchar](200) NULL,
      [Out_Photo] [nvarchar](200) NULL,
      [Device_in1] [varchar](50) NULL,
      [Device_Out1] [varchar](50) NULL,
      [Appr_1_Code] [varchar](20) NULL,
      [Appr_1_Stat] [int] NULL,
      [Appr_1_Rem] [varchar](255) NULL,
      [Appr_2_Code] [varchar](20) NULL,
      [Appr_2_Stat] [int] NULL,
      [Appr_2_Rem] [varchar](255) NULL,
      [Appr_3_Code] [varchar](20) NULL,
      [Appr_3_Stat] [int] NULL,
      [Appr_3_Rem] [varchar](255) NULL,
      [TRAN_ID] [int] IDENTITY(1,1) NOT NULL,
      [UTD] [int]  NOT NULL,
      [Mi_Type] [int] NULL,
      [Appr_1_date] [varchar](50) NULL,
      [Appr_2_date] [varchar](50) NULL,
      [Appr_3_date] [varchar](50) NULL,
      [mp_in1] [varchar](50) NULL,
      [mp_out1] [varchar](50) NULL,
      [Leave_applied_on] [varchar](50) NULL,
      [Canc_Fin] [int] NULL,
      [Canc_Date] [varchar](50) NULL,
      [Canc_Rem] [nvarchar](255) NULL,
      [Canc_By] [nvarchar](50) NULL,
      [Canc_1_Code] [nvarchar](50) NULL,
      [Canc_1_Stat] [nvarchar](50) NULL,
      [Canc_1_Rem] [nvarchar](255) NULL,
      [Canc_1_Date] [varchar](50) NULL,
      [Canc_2_Code] [nvarchar](50) NULL,
      [Canc_2_Stat] [nvarchar](50) NULL,
      [Canc_2_Rem] [nvarchar](255) NULL,
      [Canc_2_Date] [varchar](50) NULL,
      [Canc_3_Code] [nvarchar](50) NULL,
      [Canc_3_Stat] [nvarchar](50) NULL,
      [Canc_3_Rem] [nvarchar](255) NULL,
      [Canc_3_Date] [varchar](50) NULL,
      [Mispunch_applied_on] [varchar](50) NULL,
      [Inserted_by] [nvarchar](30) NULL,
      Inserted_At [varchar](50) NULL,
      Logs_Type [nvarchar](10) NULL,
PRIMARY KEY NONCLUSTERED
(
      [TRAN_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
`,
      `alter table Emp_Atnrun add [Created_by] [varchar](20) NULL`,
    ],
  },
  {
    comments: "RTO_API",
    ID: 1461,
    queries: [
      `update  COMP_KEYDATA set Wtsp_markting_per_msz_chrg='0.84' ,Wtsp_utility_per_msz_chrg='0.21'`,
    ],
  },
  {
    comments: "RTO_API",
    ID: 1462,
    queries: [
      `ALTER TABLE rtl_mst ADD Shipping_GST_No NVARCHAR(20),Shipping_POS INT`,
    ],
  },
  {
    comments: "RTO_API",
    ID: 1463,
    queries: [
      `ALTER TABLE ITEMSDTL ALTER COLUMN CGST_PERCT MONEY NULL`,
      `ALTER TABLE ITEMSDTL ALTER COLUMN SGST_PERCT MONEY NULL`,
      `ALTER TABLE ITEMSDTL ALTER COLUMN IGST_PERCT MONEY NULL`,
    ],
  },
  {
    comments: "Advance_Mst",
    ID: 1464,
    queries: [
      `ALTER TABLE Advance_Mst ADD OnBehalfEmpCode VARCHAR(30) NULL`,
      `ALTER TABLE Advance_Mst ADD MobileNo VARCHAR(10) NULL`,
      `ALTER TABLE Advance_Mst ADD Designation VARCHAR(200) NULL`,
      `ALTER TABLE Advance_Mst ADD Emp_Location VARCHAR(400) NULL `,
    ],
  },

  {
    comments: "attendancetable_log",
    ID: 1465,
    queries: [
      `CREATE TABLE [dbo].[attendancetable_log](
[Emp_Code] [char](20) NOT NULL,
[dateoffice] [smalldatetime] NULL,
[rescd] [char](3) NULL,
[media] [char](1) NULL,
[shiftstarttime] [money] NULL,
[shiftendtime] [money] NULL,
[lunchstarttime] [smalldatetime] NULL,
[lunchendtime] [smalldatetime] NULL,
[hoursworked] [decimal](5, 2) NULL,
[exclunchhours] [decimal](5, 2) NULL,
[otduration] [decimal](5, 2) NULL,
[osduration] [decimal](5, 2) NULL,
[otamount] [decimal](11, 2) NULL,
[earlyarrival] [decimal](5, 2) NULL,
[earlydeparture] [decimal](5, 2) NULL,
[latearrival] [decimal](5, 2) NULL,
[lunchearlydeparture] [decimal](5, 2) NULL,
[lunchlatearrival] [decimal](5, 2) NULL,
[totallosshrs] [decimal](5, 2) NULL,
[status] [char](6) NULL,
[reason] [varchar](50) NULL,
[shift] [char](3) NULL,
[shiftattended] [char](3) NULL,
[in1] [smalldatetime] NULL,
[in2] [smalldatetime] NULL,
[out1] [smalldatetime] NULL,
[out2] [smalldatetime] NULL,
[in1mannual] [char](1) NULL,
[in2mannual] [char](1) NULL,
[out1mannual] [char](1) NULL,
[out2mannual] [char](1) NULL,
[leavevalue] [decimal](5, 2) NULL,
[presentvalue] [decimal](5, 2) NULL,
[absentvalue] [decimal](5, 2) NULL,
[holiday_value] [decimal](5, 2) NULL,
[wo_value] [decimal](5, 2) NULL,
[outworkduration] [decimal](5, 2) NULL,
[leavetype] [char](1) NULL,
[leavecode] [char](3) NULL,
[leaveamount] [decimal](5, 2) NULL,
[flag] [char](4) NULL,
[leaveaprdate] [smalldatetime] NULL,
[voucher_no] [char](10) NULL,
[firsthalfleavecode] [char](3) NULL,
[secondhalfleavecode] [char](3) NULL,
[leavetype1] [char](1) NULL,
[leavetype2] [char](1) NULL,
[leaveamount1] [decimal](5, 2) NULL,
[leaveamount2] [decimal](5, 2) NULL,
[tlflag] [char](1) NULL,
[vearlydeparture] [decimal](5, 2) NULL,
[vlatearrival] [decimal](5, 2) NULL,
[vlunchearlydeparture] [decimal](5, 2) NULL,
[vlunchlatearrival] [decimal](5, 2) NULL,
[vtotallosshrs] [decimal](5, 2) NULL,
[os2otvflag] [char](1) NULL,
[votduration] [decimal](5, 2) NULL,
[votamount] [decimal](11, 2) NULL,
[againstdate1] [smalldatetime] NULL,
[against1] [decimal](3, 2) NULL,
[againstdate2] [smalldatetime] NULL,
[against2] [decimal](3, 2) NULL,
[otapproval] [char](1) NULL,
[cardot] [decimal](8, 2) NULL,
[appot] [decimal](6, 2) NULL,
[appothod] [decimal](6, 2) NULL,
[otapprovalhod] [char](1) NULL,
[assshift] [char](3) NULL,
[approve] [char](1) NULL,
[intype] [char](1) NULL,
[gatepass] [char](1) NULL,
[Priority_Code] [tinyint] NULL,
[IsManual] [nvarchar](1) NULL,
[MAN_APPR] [nvarchar](1) NULL,
[mipunch_reason] [nvarchar](40) NULL,
[Mis_Enterby] [nvarchar](20) NULL,
[Mis_Aprby] [nvarchar](20) NULL,
[Shift_Enterby] [nvarchar](20) NULL,
[MI_Remark] [int] NULL,
[DriveSerial] [nvarchar](50) NULL,
[SystemSerial] [nvarchar](50) NULL,
[Reject_By] [nvarchar](50) NULL,
[Computer_name] [nvarchar](200) NULL,
[Man_Entry_Date] [nvarchar](200) NULL,
[CO_Value] [int] NULL,
[In_Latitude] [nvarchar](50) NULL,
[Out_Latitude] [nvarchar](50) NULL,
[In_Longitude] [nvarchar](50) NULL,
[Out_Longitude] [nvarchar](50) NULL,
[MAN_REJ] [nvarchar](10) NULL,
[Man_Recomend] [nvarchar](10) NULL,
[App_in1] [smalldatetime] NULL,
[App_out1] [smalldatetime] NULL,
[NightShift] [int] NULL,
[SPL_REMARK] [nvarchar](200) NULL,
[Short_Lev] [decimal](12, 2) NULL,
[In_Add] [nvarchar](300) NULL,
[Out_Add] [nvarchar](300) NULL,
[In_Photo] [nvarchar](200) NULL,
[Out_Photo] [nvarchar](200) NULL,
[Device_in1] [smalldatetime] NULL,
[Device_Out1] [smalldatetime] NULL,
[Appr_1_Code] [varchar](20) NULL,
[Appr_1_Stat] [int] NULL,
[Appr_1_Rem] [varchar](255) NULL,
[Appr_2_Code] [varchar](20) NULL,
[Appr_2_Stat] [int] NULL,
[Appr_2_Rem] [varchar](255) NULL,
[Appr_3_Code] [varchar](20) NULL,
[Appr_3_Stat] [int] NULL,
[Appr_3_Rem] [varchar](255) NULL,
[TRAN_ID] [int] IDENTITY(1,1) NOT NULL,
[UTD] [int] NOT NULL,
[Mi_Type] [int] NULL,
[Appr_1_date] [smalldatetime] NULL,
[Appr_2_date] [smalldatetime] NULL,
[Appr_3_date] [smalldatetime] NULL,
[mp_in1] [smalldatetime] NULL,
[mp_out1] [smalldatetime] NULL,
[Leave_applied_on] [smalldatetime] NULL,
[Canc_Fin] [int] NULL,
[Canc_Date] [smalldatetime] NULL,
[Canc_Rem] [nvarchar](255) NULL,
[Canc_By] [nvarchar](50) NULL,
[Canc_1_Code] [nvarchar](50) NULL,
[Canc_1_Stat] [nvarchar](50) NULL,
[Canc_1_Rem] [nvarchar](255) NULL,
[Canc_1_Date] [smalldatetime] NULL,
[Canc_2_Code] [nvarchar](50) NULL,
[Canc_2_Stat] [nvarchar](50) NULL,
[Canc_2_Rem] [nvarchar](255) NULL,
[Canc_2_Date] [smalldatetime] NULL,
[Canc_3_Code] [nvarchar](50) NULL,
[Canc_3_Stat] [nvarchar](50) NULL,
[Canc_3_Rem] [nvarchar](255) NULL,
[Canc_3_Date] [smalldatetime] NULL,
[Mispunch_applied_on] [smalldatetime] NULL,
[Inserted_by] [nvarchar](30) NULL,
[Inserted_At] [smalldatetime] NULL,
[Logs_Type] [nvarchar](10) NULL,
[BM_IN1] [smalldatetime] NULL,
[BM_OUT1] [smalldatetime] NULL,
PRIMARY KEY NONCLUSTERED
(
[TRAN_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1466,
    queries: [`ALTER TABLE COMP_KEYDATA ADD SET_TENURE_MONTH INT NULL`],
  },
  {
    comments: "aadhar_api_per_msz_chrg",
    ID: 1467,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD aadhar_api_per_msz_chrg MONEY NULL`,
      `ALTER TABLE COMP_KEYDATA ADD pan_api_per_msz_chrg MONEY NULL`,
    ],
  },
  {
    comments: "New_dev_code",
    ID: 1468,
    queries: [
      `CREATE TABLE [dbo].[Digilocker_Api](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [mobile_number] [varchar](15) NOT NULL,
        [authorization_url] [nvarchar](max) NOT NULL,
        [session_id] [nvarchar](40) NOT NULL,
        [created_date] [datetime] NULL,
        [pan_number] [varchar](20) NULL,
        [aadharData] [nvarchar](max) NULL,
        [panData] [nvarchar](max) NULL,
        [drivingLicenseData] [nvarchar](max) NULL,
        [Regenerate] [int] NULL,
        [aadhaar_number] [varchar](50) NULL,
        [driving_license] [varchar](100) NULL,
      PRIMARY KEY CLUSTERED 
      (
        [UTD] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
      ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
      
      ALTER TABLE [dbo].[Digilocker_Api] ADD  DEFAULT (getdate()) FOR [created_date]`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1469,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD Ac_No_per_msz_chrg MONEY NULL`,
      `ALTER TABLE COMP_KEYDATA ADD Ifsc_No_per_msz_chrg MONEY NULL`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1470,
    queries: [`alter TABLE ACNT_POST_EXT add Loc_Code Int`],
  },
  {
    comments: "Hyundai_Warranty_Import",
    ID: 1471,
    queries: [
      `CREATE TABLE dbo.Hyundai_Warranty_Import (
    UTD INT IDENTITY(1,1) PRIMARY KEY,

    Name NVARCHAR(255) NULL,
    GST_No NVARCHAR(50) NULL,
    Address NVARCHAR(500) NULL,
    Invoice_No NVARCHAR(100) NULL,
    Branch NVARCHAR(100) NULL,

    Invoice_Date DATE NULL,
    Claim_No NVARCHAR(100) NULL,
    Claim_Date DATE NULL,

    Total_Approved_Amt_Without_Tax MONEY NULL,
    Total_Approved_Tax_Amt MONEY NULL,
    Total_Approved_Amt MONEY NULL,

    Tax_Rate MONEY NULL,

    HSN_SAC_Code NVARCHAR(50) NULL,
    Narration NVARCHAR(500) NULL,

    Created_By NVARCHAR(255) NULL,
    location NVARCHAR(100) NULL
);`,
    ],
  },
  {
    comments: "Hyundai_Warranty_Import",
    ID: 1473,
    queries: [
      `CREATE TABLE [dbo].[Actual_Booking_Utd](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[GDFDI_UTD] BIGINT  NULL,
	[EXPORT_TYPE] INT NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Actual_Booking_Utd_Hst])
)

ALTER TABLE [dbo].[Actual_Booking_Utd] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[Actual_Booking_Utd] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `ALTER TABLE IFSC_CODE_API ALTER COLUMN UPI bit NULL`,
      `ALTER TABLE IFSC_CODE_API ALTER COLUMN RTGS bit NULL`,
      `ALTER TABLE IFSC_CODE_API ALTER COLUMN NEFT bit NULL`,
      `ALTER TABLE IFSC_CODE_API ALTER COLUMN IMPS bit NULL`,
      `ALTER TABLE IFSC_CODE_API ALTER COLUMN CENTRE varchar(100) NULL`,
      `ALTER TABLE IFSC_CODE_API ALTER COLUMN DISTRICT varchar(100) NULL`,
      `ALTER TABLE IFSC_CODE_API ALTER COLUMN ISO3166 varchar(10) NULL`,
      `CREATE TABLE [dbo].[ItemsMst_UTD](
        TRAN_ID INTEGER,
    TRAN_TYPE INT NOT NULL,                  
    Random_key INT NULL,
    Export_type INT NULL,
    Created_date DATETIME NULL,
      PRIMARY KEY CLUSTERED 
      (
        TRAN_TYPE,[TRAN_ID] ASC
      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
      ) ON [PRIMARY]
      
      ALTER TABLE [dbo].[ItemsMst_UTD ] ADD  DEFAULT (getdate()) FOR [Created_date]`,
      `ALTER TABLE rtl_mst ADD finaciar_type INT, payout_perc NVARCHAR(10);`,
      `ALTER TABLE rtl_mst ADD tol_recipt_amt NVARCHAR(20);`,
    ],
  },
  {
    comments: "TV_ICM_DTL",
    ID: 1473,
    queries: [
      `ALTER TABLE TV_ICM_DTL ADD [SALE_MNGMNT_FEES] [money] NULL`,
      `CREATE TABLE dbo.Hyundai_Discount_List_Import (
    UTD INT IDENTITY(1,1) PRIMARY KEY,

    Model NVARCHAR(100),
    Fuel NVARCHAR(50),
    Variant NVARCHAR(100),

    Total_Tax_Percent MONEY,

    Dealer_Purchase_Cost MONEY,
    GST MONEY,
    GST_Comp_Cess MONEY,
    Total_Tax_Credit MONEY,

    Dealer_Booking_Price MONEY,
    Total_Dealer_Margin MONEY,
    Base_Price_To_Customer MONEY,

    CGST MONEY,
    SGST MONEY,
    GST_Comp_Cess_2 MONEY,

    Total_Tax MONEY,
    Ex_SR_Price MONEY,

    Scheme MONEY,
    HMIL_Part MONEY,
    Dealer_Part MONEY,

    Exchange_Discount MONEY,
    Scrap_Discount MONEY,
    Corporate_Discount MONEY,
    Government_Discount MONEY,

    Final_Ex_Showroom MONEY,
    Max_Discount MONEY,

    Export_Type INT,

    Created_By NVARCHAR(255),
    location NVARCHAR(100),
    Created_At DATETIME
);`,
    ],
  },
  {
    comments: "dise_aprvl",
    ID: 1474,
    queries: [
      ` ALTER TABLE dise_aprvl ADD [CHAS_ID] [int] NULL`,
      `ALTER TABLE dise_aprvl ADD [Stock_booking] [varchar](10) NULL`,
      `ALTER TABLE dise_aprvl ADD CorporateYN VARCHAR(10) NULL`,
      `ALTER TABLE dise_aprvl ADD CorporateType VARCHAR(100) NULL`,
      `ALTER TABLE dise_aprvl ADD ExchangeYN VARCHAR(10) NULL`,
      `ALTER TABLE dise_aprvl ADD ExchangeType VARCHAR(100) NULL`,
      `ALTER TABLE  Interview_sideTables ALTER COLUMN [Is_Minor] [nvarchar](100) NULL`,
      `ALTER TABLE Rtl_Mst ADD consumer_discount MONEY NULL , exchange_disc MONEY NULL,scrap_disc MONEY NULL,corporate_disc MONEY NULL,government_disc MONEY NULL,upgrade_disc MONEY NULL,additional_disc MONEY NULL,total_all_discounts MONEY NULL`,
      `ALTER TABLE Rtl_Mst ADD exchangeScrapeFlag NVARCHAR(5) , corporateGovtFlag NVARCHAR(5) ,upgradeYesNoFlag NVARCHAR(5)`,
      `CREATE TABLE [dbo].[cost_offers_unfreeze_history](
    [UTD] [int] IDENTITY(1,1) NOT NULL,
    [TRAN_ID] [int] NULL,
    
    [veh_amt_current] [money] DEFAULT 0.00,
    [veh_amt_new] [money] DEFAULT 0.00,
    
    [consumer_discount_current] [money] DEFAULT 0.00,
    [consumer_discount_new] [money] DEFAULT 0.00,
    
    [exchange_disc_current] [money] DEFAULT 0.00,
    [exchange_disc_new] [money] DEFAULT 0.00,
    
    [scrap_disc_current] [money] DEFAULT 0.00,
    [scrap_disc_new] [money] DEFAULT 0.00,
    
    [corporate_disc_current] [money] DEFAULT 0.00,
    [corporate_disc_new] [money] DEFAULT 0.00,
    
    [government_disc_current] [money] DEFAULT 0.00,
    [government_disc_new] [money] DEFAULT 0.00,
    
    [upgrade_disc_current] [money] DEFAULT 0.00,
    [upgrade_disc_new] [money] DEFAULT 0.00,
    
    [additional_disc_current] [money] DEFAULT 0.00,
    [additional_disc_new] [money] DEFAULT 0.00,

    [is_add_on1_current] [nvarchar](50) NULL,
    [sub_add_on1_current] [nvarchar](50) NULL,
    [price1_current] [money] DEFAULT 0.00,
    [yesno1_current] [nvarchar](10) DEFAULT '0',
    
    [is_add_on2_current] [nvarchar](50) NULL,
    [sub_add_on2_current] [nvarchar](50) NULL,
    [price2_current] [money] DEFAULT 0.00,
    [yesno2_current] [nvarchar](10) DEFAULT '0',
    
    [is_add_on3_current] [nvarchar](50) NULL,
    [sub_add_on3_current] [nvarchar](50) NULL,
    [price3_current] [money] DEFAULT 0.00,
    [yesno3_current] [nvarchar](10) DEFAULT '0',
    
    [is_add_on4_current] [nvarchar](50) NULL,
    [sub_add_on4_current] [nvarchar](50) NULL,
    [price4_current] [money] DEFAULT 0.00,
    [yesno4_current] [nvarchar](10) DEFAULT '0',
    
    [is_add_on5_current] [nvarchar](50) NULL,
    [sub_add_on5_current] [nvarchar](50) NULL,
    [price5_current] [money] DEFAULT 0.00,
    [yesno5_current] [nvarchar](10) DEFAULT '0',
    
    [is_add_on6_current] [nvarchar](50) NULL,
    [sub_add_on6_current] [nvarchar](50) NULL,
    [price6_current] [money] DEFAULT 0.00,
    [yesno6_current] [nvarchar](10) DEFAULT '0',
    
    [is_add_on7_current] [nvarchar](50) NULL,
    [sub_add_on7_current] [nvarchar](50) NULL,
    [price7_current] [money] DEFAULT 0.00,
    [yesno7_current] [nvarchar](10) DEFAULT '0',
    
    [is_add_on8_current] [nvarchar](50) NULL,
    [sub_add_on8_current] [nvarchar](50) NULL,
    [price8_current] [money] DEFAULT 0.00,
    [yesno8_current] [nvarchar](10) DEFAULT '0',
    
    [is_add_on9_current] [nvarchar](50) NULL,
    [sub_add_on9_current] [nvarchar](50) NULL,
    [price9_current] [money] DEFAULT 0.00,
    [yesno9_current] [nvarchar](10) DEFAULT '0',
    
    [is_add_on10_current] [nvarchar](50) NULL,
    [sub_add_on10_current] [nvarchar](50) NULL,
    [price10_current] [money] DEFAULT 0.00,
    [yesno10_current] [nvarchar](10) DEFAULT '0',
    
    [is_add_on11_current] [nvarchar](50) NULL,
    [sub_add_on11_current] [nvarchar](50) NULL,
    [price11_current] [money] DEFAULT 0.00,
    [yesno11_current] [nvarchar](10) DEFAULT '0',
    
    [is_add_on12_current] [nvarchar](50) NULL,
    [sub_add_on12_current] [nvarchar](50) NULL,
    [price12_current] [money] DEFAULT 0.00,
    [yesno12_current] [nvarchar](10) DEFAULT '0',
    
    [is_add_on13_current] [nvarchar](50) NULL,
    [sub_add_on13_current] [nvarchar](50) NULL,
    [price13_current] [money] DEFAULT 0.00,
    [yesno13_current] [nvarchar](10) DEFAULT '0',
    
    [is_add_on14_current] [nvarchar](50) NULL,
    [sub_add_on14_current] [nvarchar](50) NULL,
    [price14_current] [money] DEFAULT 0.00,
    [yesno14_current] [nvarchar](10) DEFAULT '0',
    
    [is_add_on15_current] [nvarchar](50) NULL,
    [sub_add_on15_current] [nvarchar](50) NULL,
    [price15_current] [money] DEFAULT 0.00,
    [yesno15_current] [nvarchar](10) DEFAULT '0',
    
    -- Dynamic Add-ons New Values (1-15)
    [is_add_on1_new] [nvarchar](50) NULL,
    [sub_add_on1_new] [nvarchar](50) NULL,
    [price1_new] [money] DEFAULT 0.00,
    [yesno1_new] [nvarchar](10) DEFAULT '0',
    
    [is_add_on2_new] [nvarchar](50) NULL,
    [sub_add_on2_new] [nvarchar](50) NULL,
    [price2_new] [money] DEFAULT 0.00,
    [yesno2_new] [nvarchar](10) DEFAULT '0',
    
    [is_add_on3_new] [nvarchar](50) NULL,
    [sub_add_on3_new] [nvarchar](50) NULL,
    [price3_new] [money] DEFAULT 0.00,
    [yesno3_new] [nvarchar](10) DEFAULT '0',
    
    [is_add_on4_new] [nvarchar](50) NULL,
    [sub_add_on4_new] [nvarchar](50) NULL,
    [price4_new] [money] DEFAULT 0.00,
    [yesno4_new] [nvarchar](10) DEFAULT '0',
    
    [is_add_on5_new] [nvarchar](50) NULL,
    [sub_add_on5_new] [nvarchar](50) NULL,
    [price5_new] [money] DEFAULT 0.00,
    [yesno5_new] [nvarchar](10) DEFAULT '0',
    
    [is_add_on6_new] [nvarchar](50) NULL,
    [sub_add_on6_new] [nvarchar](50) NULL,
    [price6_new] [money] DEFAULT 0.00,
    [yesno6_new] [nvarchar](10) DEFAULT '0',
    
    [is_add_on7_new] [nvarchar](50) NULL,
    [sub_add_on7_new] [nvarchar](50) NULL,
    [price7_new] [money] DEFAULT 0.00,
    [yesno7_new] [nvarchar](10) DEFAULT '0',
    
    [is_add_on8_new] [nvarchar](50) NULL,
    [sub_add_on8_new] [nvarchar](50) NULL,
    [price8_new] [money] DEFAULT 0.00,
    [yesno8_new] [nvarchar](10) DEFAULT '0',
    
    [is_add_on9_new] [nvarchar](50) NULL,
    [sub_add_on9_new] [nvarchar](50) NULL,
    [price9_new] [money] DEFAULT 0.00,
    [yesno9_new] [nvarchar](10) DEFAULT '0',
    
    [is_add_on10_new] [nvarchar](50) NULL,
    [sub_add_on10_new] [nvarchar](50) NULL,
    [price10_new] [money] DEFAULT 0.00,
    [yesno10_new] [nvarchar](10) DEFAULT '0',
    
    [is_add_on11_new] [nvarchar](50) NULL,
    [sub_add_on11_new] [nvarchar](50) NULL,
    [price11_new] [money] DEFAULT 0.00,
    [yesno11_new] [nvarchar](10) DEFAULT '0',
    
    [is_add_on12_new] [nvarchar](50) NULL,
    [sub_add_on12_new] [nvarchar](50) NULL,
    [price12_new] [money] DEFAULT 0.00,
    [yesno12_new] [nvarchar](10) DEFAULT '0',
    
    [is_add_on13_new] [nvarchar](50) NULL,
    [sub_add_on13_new] [nvarchar](50) NULL,
    [price13_new] [money] DEFAULT 0.00,
    [yesno13_new] [nvarchar](10) DEFAULT '0',
    
    [is_add_on14_new] [nvarchar](50) NULL,
    [sub_add_on14_new] [nvarchar](50) NULL,
    [price14_new] [money] DEFAULT 0.00,
    [yesno14_new] [nvarchar](10) DEFAULT '0',
    
    [is_add_on15_new] [nvarchar](50) NULL,
    [sub_add_on15_new] [nvarchar](50) NULL,
    [price15_new] [money] DEFAULT 0.00,
    [yesno15_new] [nvarchar](10) DEFAULT '0',
    
    [exchange_type_current] [nvarchar](50) NULL,
    [exchange_type_new] [nvarchar](50) NULL,
    
    [corporate_type_current] [nvarchar](50) NULL,
    [corporate_type_new] [nvarchar](50) NULL,
    
    [upgrade_yesno_current] [nvarchar](10) NULL,
    [upgrade_yesno_new] [nvarchar](10) NULL,
    
    [total_amount_current] [money] DEFAULT 0.00,
    [total_amount_new] [money] DEFAULT 0.00,
    
    [fin_stat] [nvarchar](10) DEFAULT '0',
    [remark] [nvarchar](max) NULL,
    
    [Loc_Code] [int] NULL,
    [Export_Type] [int] NULL,
    [Created_At] [datetime] NULL,
    [Created_by] [varchar](100) NULL,
    [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
    [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
    [timestamp] [datetime] NULL,
    
    PRIMARY KEY CLUSTERED 
    (
        [UTD] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
    PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[cost_offers_unfreeze_history_Hst])
)

ALTER TABLE [dbo].[cost_offers_unfreeze_history] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[cost_offers_unfreeze_history] ADD  DEFAULT (getdate()) FOR [timestamp]`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1475,
    queries: [
      `ALTER TABLE Rtl_Mst ADD corporateGovtYesNo NVARCHAR(5) , exchangeScrapeYesNo NVARCHAR(5)`,
      `ALTER TABLE cost_offers_unfreeze_history ADD corporateGovtYesNo NVARCHAR(5) , exchangeScrapeYesNo NVARCHAR(5)`,
      `ALTER TABLE cost_offers_unfreeze_history ADD corporateGovtYesNo_current NVARCHAR(5) , exchangeScrapeYesNo_current NVARCHAR(5),corporateGovtYesNo_new NVARCHAR(5) , exchangeScrapeYesNo_new NVARCHAR(5)`,
      `ALTER TABLE cost_offers_unfreeze_history ADD Appr_by NVARCHAR(20)`,
    ],
  },
  {
    comments: "TV_ICM_DTL",
    ID: 1476,
    queries: [
      `CREATE TABLE [dbo].[SALES_TEAM](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [Mnth] [int] NULL,
      [Yr] [int] NULL,
      [RM_Code] [varchar](20) NULL,
      [SRM_Code] [varchar](20) NULL,
      [ASM_Code] [varchar](20) NULL,
      [SM_Code] [varchar](20) NULL,
      [GM_Code] [varchar](20) NULL,
      [CGM_Code] [varchar](20) NULL,
      [Created_By] [varchar](255) NULL,
      [Created_On] [datetime] NULL,
      [Export_Type] [int] NULL,
      [Location] [varchar](100) NULL,
      [REGION] [varchar](50) NULL,
      [MODIFIED_BY] [varchar](255) NULL,
      [MODIFIED_ON] [datetime] NULL,
PRIMARY KEY CLUSTERED
(
      [UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
`,
      `CREATE TABLE [dbo].[SALES_TEAM_HST](
      [HST_ID] [int] IDENTITY(1,1) NOT NULL,
      [UTD] [int] NULL,
      [Mnth] [int] NULL,
      [Yr] [int] NULL,
      [REGION] [varchar](50) NULL,
      [RM_Code] [varchar](20) NULL,
      [SRM_Code] [varchar](20) NULL,
      [ASM_Code] [varchar](20) NULL,
      [SM_Code] [varchar](20) NULL,
      [GM_Code] [varchar](20) NULL,
      [CGM_Code] [varchar](20) NULL,
      [Created_By] [varchar](255) NULL,
      [Created_On] [datetime] NULL,
      [Modified_By] [varchar](255) NULL,
      [Modified_On] [datetime] NULL,
      [Export_Type] [int] NULL,
      [Location] [varchar](100) NULL,
PRIMARY KEY CLUSTERED
(
      [HST_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]`,
    ],
  },
  {
    comments: "TV_ICM_DTL",
    ID: 1477,
    queries: [
      `ALTER TABLE comp_keydata ADD [VALD_CRITERIA_CAND] [INT] NULL`,
      `ALTER TABLE SHORTLISTED_CANDIDATE ADD VisitStatus [nvarchar](10) NULL`,
      `ALTER TABLE SHORTLISTED_CANDIDATE ADD VisitType [nvarchar](10) NULL`,
      `ALTER TABLE SHORTLISTED_CANDIDATE ADD fbackground [nvarchar](10) NULL`,
      `ALTER TABLE SHORTLISTED_CANDIDATE ADD IsHouse [nvarchar](10) NULL`,
      `ALTER TABLE SHORTLISTED_CANDIDATE ADD IsCar [nvarchar](10) NULL`,
      `ALTER TABLE SHORTLISTED_CANDIDATE ADD FMember [nvarchar](10) NULL`,
      `ALTER TABLE SHORTLISTED_CANDIDATE ADD Foccupation [nvarchar](200) NULL`,
      `ALTER TABLE SHORTLISTED_CANDIDATE ADD FCondition [nvarchar](200) NULL`,
      `ALTER TABLE SHORTLISTED_CANDIDATE ADD conclusion [nvarchar](200) NULL`,
      `alter table cost_offers_unfreeze_history add [exShow_aft_disc_current] [money] DEFAULT 0.00,[exShow_aft_disc_new] [money] DEFAULT 0.00`,
      `alter table rtl_mst add ExshowroomAfterDisc money`,
      `alter table DIG_GP add IS_ACTIVE NVARCHAR(5),IS_CLOSE NVARCHAR(5),CLOSE_BY NVARCHAR(20),CLOSE_DATE DATETIME, CLOSE_REM NVARCHAR(255),REJ_STAT NVARCHAR(5),REJ_BY NVARCHAR(20),REJ_DATE DATETIME,REJ_REM NVARCHAR(255)`,
    ],
  },
  {
    comments: "misc_mst",
    ID: 1478,
    queries: [
      `INSERT INTO misc_mst (misc_type, misc_code, misc_name,Misc_Abbr, export_type, serverid, loc_code)
      VALUES
      (661, 1, 'Communication & Presentation Skills','CPS',  1, 1, 1),
      (661, 2, 'Sales/Customer Handling Skills','CHS', 1, 1, 1),
      (661, 3, 'Skills Required for Position','SRP', 1, 1, 1),
      (661, 4, 'Product Knowledge (Automobile)','PK', 1, 1, 1),
      (661, 5, 'Confidence & Grooming','CG', 1, 1, 1),
      (661, 6, 'Attitude & Willingness to Learn','AWL', 1, 1, 1),
      (661, 7, 'Language Proficiency (Local + English)','LPK', 1, 1, 1),
      (661, 8, 'Technical/Mechanical Knowledge (if applicable)','TK', 1, 1, 1),
      (661, 9, 'Past Experience (Relevant)','PE', 1, 1, 1),
      (661, 10, 'Cultural Fit/Team Compatibility','CF', 1, 1, 1),
      (661, 11, 'Overall Suitability','OS', 1, 1, 1)`,
      `INSERT INTO misc_mst (misc_type, misc_code, misc_name,Misc_Abbr, export_type, serverid, loc_code)
      VALUES
      (662, 1, 'In/Out Both Punch','0',  1, 1, 1),
      (662, 2, 'Single Punch (Full Day)','1', 1, 1, 1),
      (662, 3, 'Single Punch (Half Day)','2', 1, 1, 1),
      (662, 4, 'No Punch (Full Day)','3', 1, 1, 1),
      (662, 5, 'No Punch (Half Day)','4', 1, 1, 1)`,
    ],
  },
  {
    comments: "misc_mst",
    ID: 1479,
    queries: [
      `ALTER TABLE COMP_KEYDATA 
ADD  import_type INT NULL`,
    ],
  },
  {
    comments: "EMPLOYEEMASTER",
    ID: 1480,
    queries: [
      `ALTER TABLE EMPLOYEEMASTER ALTER COLUMN BRANCH VARCHAR(500);`,
      `ALTER PROCEDURE [dbo].[UpdateOrInsertLeaveBalance]
@Emp_Code VARCHAR(50),
@Leave_Type INT,
@Leave_Type2 INT,
@Leave_Mnth INT,
@Leave_Yr INT
AS
BEGIN
SET NOCOUNT ON;

DECLARE @Op_Bal DECIMAL(10, 2);
DECLARE @Gen_Lev DECIMAL(10, 2) = 0.00;
DECLARE @Avail_Lev DECIMAL(10, 2) = 0.00;
DECLARE @Cl_Bal DECIMAL(10, 2);
DECLARE @table_avail DECIMAL(10, 2);
DECLARE @Prev_Mnth INT;
DECLARE @Prev_Yr INT;
DECLARE @UsePayrollMonth BIT = 0;
DECLARE @NextMonth INT;
DECLARE @NextYear INT;
DECLARE @NewOp_Bal DECIMAL(10, 2);
DECLARE @NextAvail_Lev DECIMAL(10, 2);
DECLARE @CustomMonth INT;
DECLARE @CustomYear INT;
DECLARE @DayOfMonth INT;
DECLARE @IsCarryForward BIT = 0; -- NEW VARIABLE
-- Check if this leave type should be carried forward
SELECT @IsCarryForward = ISNULL(is_carry, 0)
FROM Misc_Mst
WHERE Misc_Type = 92
AND Misc_Code = @Leave_Type;
-- Check if company uses 26-25 payroll month system
IF EXISTS (SELECT 1 FROM Misc_Mst WHERE Misc_Type = 25)
BEGIN
SET @UsePayrollMonth = 1;
END
-- Calculate @Avail_Lev for CURRENT month/year
IF @UsePayrollMonth = 1
BEGIN
-- For 26-25 payroll month system
-- Calculate custom month from dates in attendancetable
-- Logic: If day >= 26, use next month, else use current month
SELECT @Avail_Lev = ISNULL(SUM(CAST(count_ AS FLOAT)), 0)
FROM (
SELECT (SELECT TOP 1 ISNULL(misc_dtl3, 0)
FROM Misc_Mst
WHERE Misc_Type = 92 AND Misc_Code = att.mipunch_reason) AS count_
FROM attendancetable att
INNER JOIN Misc_Mst pm ON pm.Misc_Type = 25
WHERE att.mipunch_reason IN (@Leave_Type, @Leave_Type2)
AND att.emp_code = @Emp_Code
AND att.MAN_APPR = 'Y'
-- Calculate custom month from date
AND (
-- If day >= 26, use next month; else use current month
(DAY(att.dateoffice) >= 26 AND pm.Misc_Code = CASE WHEN MONTH(att.dateoffice) + 1 > 12 THEN 1 ELSE MONTH(att.dateoffice) + 1 END
AND YEAR(CONVERT(DATE, pm.Misc_Dtl2, 103)) = CASE WHEN MONTH(att.dateoffice) + 1 > 12 THEN YEAR(att.dateoffice) + 1 ELSE YEAR(att.dateoffice) END)
OR
(DAY(att.dateoffice) < 26 AND pm.Misc_Code = MONTH(att.dateoffice)
AND YEAR(CONVERT(DATE, pm.Misc_Dtl2, 103)) = YEAR(att.dateoffice))
)
-- Match with the requested month and year
AND pm.Misc_Code = @Leave_Mnth
AND YEAR(CONVERT(DATE, pm.Misc_Dtl2, 103)) = @Leave_Yr
-- Also check if date falls within the payroll month range
AND CAST(att.dateoffice AS DATE) >= CONVERT(DATE, pm.Misc_Dtl1, 103)
AND CAST(att.dateoffice AS DATE) <= CONVERT(DATE, pm.Misc_Dtl2, 103)
) AS da;
END
ELSE
BEGIN
-- For normal 1-31 calendar month system (no change)
SELECT @Avail_Lev = ISNULL(SUM(CAST(count_ AS FLOAT)), 0)
FROM (
SELECT (SELECT TOP 1 ISNULL(misc_dtl3, 0)
FROM Misc_Mst
WHERE Misc_Type = 92 AND Misc_Code = mipunch_reason) AS count_
FROM attendancetable
WHERE mipunch_reason IN (@Leave_Type, @Leave_Type2)
AND emp_code = @Emp_Code
AND MONTH(dateoffice) = @Leave_Mnth
AND YEAR(dateoffice) = @Leave_Yr
AND MAN_APPR = 'Y'
) AS da;
END
-- Calculate previous month and year
SET @Prev_Mnth = CASE WHEN @Leave_Mnth = 1 THEN 12 ELSE @Leave_Mnth - 1 END;
SET @Prev_Yr = CASE WHEN @Leave_Mnth = 1 THEN @Leave_Yr - 1 ELSE @Leave_Yr END;

-- Check if the row exists for the current month
IF EXISTS (SELECT 1 FROM Leave_bal
WHERE Emp_Code = @Emp_Code
AND Leave_Type = @Leave_Type
AND Leave_Mnth = @Leave_Mnth
AND Leave_Yr = @Leave_Yr)
BEGIN
-- Get current values if row exists
SELECT @Op_Bal = Op_Bal,
@Gen_Lev = Gen_Lev,
@Cl_Bal = Cl_Bal,
@table_avail = Avail_Lev
FROM Leave_bal
WHERE Emp_Code = @Emp_Code
AND Leave_Type = @Leave_Type
AND Leave_Mnth = @Leave_Mnth
AND Leave_Yr = @Leave_Yr;

-- Check if Cl_Bal calculation is correct
IF @Cl_Bal <> @Op_Bal + @Gen_Lev - @Avail_Lev OR @table_avail <> @Avail_Lev
BEGIN
-- Update Cl_Bal for current month
SET @Cl_Bal = @Op_Bal + @Gen_Lev - @Avail_Lev;

UPDATE Leave_bal
SET Cl_Bal = @Cl_Bal,
Avail_Lev = @Avail_Lev
WHERE Emp_Code = @Emp_Code
AND Leave_Type = @Leave_Type
AND Leave_Mnth = @Leave_Mnth
AND Leave_Yr = @Leave_Yr;
END
END
ELSE
BEGIN
-- Check if future month record exists
IF EXISTS (SELECT 1 FROM Leave_bal
WHERE Emp_Code = @Emp_Code
AND Leave_Type = @Leave_Type
AND (
(Leave_Yr = @Leave_Yr AND Leave_Mnth > @Leave_Mnth)
OR Leave_Yr > @Leave_Yr
))
BEGIN
-- Skip insertion if a future month record exists
PRINT 'Cannot insert previous month row as a subsequent month record already exists.';
RETURN;
END
-- Insert new row for the current month if it does not exist
-- Get previous month's Cl_Bal as the Op_Bal ONLY IF @IsCarryForward = 1
IF @IsCarryForward = 1
BEGIN
SELECT @Op_Bal = Cl_Bal
FROM Leave_bal
WHERE Emp_Code = @Emp_Code
AND Leave_Type = @Leave_Type
AND Leave_Mnth = @Prev_Mnth
AND Leave_Yr = @Prev_Yr;
END
IF @Op_Bal IS NULL
SET @Op_Bal = 0.00;

-- Calculate Cl_Bal for the new month
SET @Cl_Bal = @Op_Bal + @Gen_Lev - @Avail_Lev;

-- Insert the new row
INSERT INTO Leave_bal (Emp_Code, Leave_Type, Leave_Mnth, Op_Bal, Gen_Lev, Avail_Lev, Cl_Bal, Leave_Yr)
VALUES (@Emp_Code, @Leave_Type, @Leave_Mnth, @Op_Bal, @Gen_Lev, @Avail_Lev, @Cl_Bal, @Leave_Yr);
END

-- ***** IMPORTANT CHANGE HERE *****
-- Propagate Cl_Bal changes to all subsequent months ONLY IF @IsCarryForward = 1
IF @IsCarryForward = 1
BEGIN
SET @NextMonth = @Leave_Mnth + 1;
SET @NextYear = @Leave_Yr;
IF @NextMonth = 13
BEGIN
SET @NextMonth = 1;
SET @NextYear = @NextYear + 1;
END
SET @NewOp_Bal = @Cl_Bal;

WHILE EXISTS (SELECT 1 FROM Leave_bal
WHERE Emp_Code = @Emp_Code
AND Leave_Type = @Leave_Type
AND Leave_Mnth = @NextMonth
AND Leave_Yr = @NextYear)
BEGIN
-- Calculate @Avail_Lev for the NEXT month
IF @UsePayrollMonth = 1
BEGIN
-- For 26-25 payroll month system
SELECT @NextAvail_Lev = ISNULL(SUM(CAST(count_ AS FLOAT)), 0)
FROM (
SELECT (SELECT TOP 1 ISNULL(misc_dtl3, 0)
FROM Misc_Mst
WHERE Misc_Type = 92 AND Misc_Code = att.mipunch_reason) AS count_
FROM attendancetable att
INNER JOIN Misc_Mst pm ON pm.Misc_Type = 25
WHERE att.mipunch_reason IN (@Leave_Type, @Leave_Type2)
AND att.emp_code = @Emp_Code
AND att.MAN_APPR = 'Y'
-- Calculate custom month from date
AND (
-- If day >= 26, use next month; else use current month
(DAY(att.dateoffice) >= 26 AND pm.Misc_Code = CASE WHEN MONTH(att.dateoffice) + 1 > 12 THEN 1 ELSE MONTH(att.dateoffice) + 1 END
AND YEAR(CONVERT(DATE, pm.Misc_Dtl2, 103)) = CASE WHEN MONTH(att.dateoffice) + 1 > 12 THEN YEAR(att.dateoffice) + 1 ELSE YEAR(att.dateoffice) END)
OR
(DAY(att.dateoffice) < 26 AND pm.Misc_Code = MONTH(att.dateoffice)
AND YEAR(CONVERT(DATE, pm.Misc_Dtl2, 103)) = YEAR(att.dateoffice))
)
-- Match with the next month and year
AND pm.Misc_Code = @NextMonth
AND YEAR(CONVERT(DATE, pm.Misc_Dtl2, 103)) = @NextYear
-- Also check if date falls within the payroll month range
AND CAST(att.dateoffice AS DATE) >= CONVERT(DATE, pm.Misc_Dtl1, 103)
AND CAST(att.dateoffice AS DATE) <= CONVERT(DATE, pm.Misc_Dtl2, 103)
) AS da;
END
ELSE
BEGIN
-- For normal 1-31 calendar month system (no change)
SELECT @NextAvail_Lev = ISNULL(SUM(CAST(count_ AS FLOAT)), 0)
FROM (
SELECT (SELECT TOP 1 ISNULL(misc_dtl3, 0)
FROM Misc_Mst
WHERE Misc_Type = 92 AND Misc_Code = mipunch_reason) AS count_
FROM attendancetable
WHERE mipunch_reason IN (@Leave_Type, @Leave_Type2)
AND emp_code = @Emp_Code
AND MONTH(dateoffice) = @NextMonth
AND YEAR(dateoffice) = @NextYear
AND MAN_APPR = 'Y'
) AS da;
END

UPDATE Leave_bal
SET Op_Bal = @NewOp_Bal,
Cl_Bal = @NewOp_Bal + Gen_Lev - @NextAvail_Lev,
Avail_Lev = @NextAvail_Lev
WHERE Emp_Code = @Emp_Code
AND Leave_Type = @Leave_Type
AND Leave_Mnth = @NextMonth
AND Leave_Yr = @NextYear;

-- Get the updated Cl_Bal for the next iteration
SELECT @NewOp_Bal = Cl_Bal
FROM Leave_bal
WHERE Emp_Code = @Emp_Code
AND Leave_Type = @Leave_Type
AND Leave_Mnth = @NextMonth
AND Leave_Yr = @NextYear;

-- Move to the next month
SET @NextMonth = @NextMonth + 1;
IF @NextMonth = 13
BEGIN
SET @NextMonth = 1;
SET @NextYear = @NextYear + 1;
END
END
END
-- ***** END OF CARRY FORWARD LOGIC *****
END;`,
      `alter table misc_mst add is_carry INT DEFAULT 0 , year_laps INT DEFAULT 0`,
      `ALTER TABLE dise_aprvl ADD ADDRESS VARCHAR(255);`,
    ],
  },
  {
    comments: "Leave_Dtl",
    ID: 1481,
    queries: [
      `CREATE TABLE Leave_Dtl
            (            UTD INTEGER IDENTITY PRIMARY KEY,
                        Emp_Code VARCHAR(60),      
                       Tran_Type Int Null,
                                 Leave_Type Int Null,
                                 Leave_Date Date Null,
                                 Leave_Val Decimal Null,
                        User_Code VARCHAR(60),
                        Export_Type Int Null,
                        Entr_Date DATETIME DEFAULT GETDATE()
            )  `,
    ],
  },
  {
    comments: "RTL_COST_MST",
    ID: 1482,
    queries: [
      `ALTER TABLE DISE_APRVL ADD [Rips] [money] NULL`,
      `ALTER TABLE Modl_Mst ADD [GST_Rate] [decimal](18, 0) NULL`,
      `ALTER TABLE USER_CLOUD_ACT_HST ALTER COLUMN ACTION_TAKEN VARCHAR(500)`,
      `ALTER TABLE DIG_GP ADD [Interbranch_Loc] INT NULL`,
      `ALTER TABLE DIG_GP ADD [Loc_Code] INT NULL`,
      `/*
TRAN_TYPE = 1 + EXPORT_TYPE = 1 ===> INSERT THE GDFDIUTD IN BOOKING_ALLOTMENT_DEAL TABLE WITH EXPORT_TYPE 
TRAN_TYPE = 2 + EXPORT_TYPE = 1 ===> MAKE PRE-INVOICE IN BOOKING_ALLOTMENT_DEAL THAT HAS ALL THE DISE_APRVL COLUMNS DATA AND ALSO RTL_COST_DTL DATA
TRAN_TYPE = 2 + EXPORT_TYPE = 9 ===> GONE FOR REAPPROVAL PROCESS
TRAN_TYPE = 3 + EXPORT_TYPE = 1 ===> BOOKING ALLOTMENT THAT HAS COLUMN OF CHAS_ALOT
TRAN_TYPE = 4 + EXPORT_TYPE = 1 ===> BOOKING CANCELLATION WITH APPROVAL
TRAN_TYPE = 5 + EXPORT_TYPE = 1 ===> BOOKING REFUND THAT HAS COULMN OF BOOKING_REFUND

*/
CREATE TABLE [dbo].[RTL_COST_MST](
	[TRAN_ID] [int] IDENTITY(1,1) NOT NULL,
	[TRAN_TYPE] [int] NOT NULL,
	[CURR_DATE] [datetime] NULL,
	[GDFDI_UTD] [bigint] NULL,
	[EMPCODE] [varchar](50) NULL,
	[BOOKING_ID] [varchar](50) NULL,
	[BOOKING_DATE] [datetime] NULL,
	[CUST_ID] [varchar](50) NULL,
	[CUST_NAME] [varchar](100) NULL,
	[CUST_MIDDLENAME] [varchar](100) NULL,
	[CUST_LASTNAME] [varchar](100) NULL,
	[CUST_MOB] [varchar](10) NULL,
	[PAN_NO] [varchar](20) NULL,
	[MODL_GRP] [varchar](20) NULL,
	[MODL_VAR] [varchar](20) NULL,
	[VEH_CLR] [varchar](20) NULL,
	[VAR_CODE] [varchar](50) NULL,
	[FUEL_TYPE] [varchar](50) NULL,
	[RM] [varchar](20) NULL,
	[DEAL_ID] [int] NULL,
	[ALOT_ID] [int] NULL,
	[CANCEL_ID] [int] NULL,
	[REFUND_ID] [int] NULL,
	[LOC_CODE] [varchar](20) NULL,
	[GD_LOC] [varchar](20) NULL,
	[PRICE_LIST_MODL_VAR] [varchar](50) NULL,
	[CUST_TYPE] [varchar](50) NULL,
	[EXSHOWROOM_PRICE] [money] NULL,
	[CHASSIS_NO] [varchar](50) NULL,
	[VIN] [varchar](100) NULL,
	[ENGINE_NO] [varchar](50) NULL,
	[KEY_NO] [varchar](50) NULL,
	[BILL_DATE] [datetime] NULL,
	[VEH_AGEING] [int] NULL,
	[ONROAD_PRICE] [money] NULL,
	[FIN_TYPE] [int] NULL,
	[FIN_CODE] [int] NULL,
	[LOAN_TYPE] [int] NULL,
	[EXCH] [int] NULL,
	[OLD_MODL] [varchar](200) NULL,
	[OLD_REGNO] [varchar](50) NULL,
	[OLD_MARGIN] [money] NULL,
	[ON_WAITING] [int] NULL,
	[APPROVED_AMT] [money] NULL,
	[RELATION] [varchar](100) NULL,
	[MANUFACTURE_YEAR] [varchar](20) NULL,
	[CONSUMER] [money] NULL,
	[Rips] [money] NULL,
	[CORPORATE_YN] [varchar](20) NULL,
	[CORPORATE_TYPE] [varchar](100) NULL,
	[CORPORATE] [money] NULL,
	[EXCHANGE_YN] [varchar](20) NULL,
	[EXCHANGE_TYPE] [varchar](100) NULL,
	[EXCHANGE] [money] NULL,
	[MSSF] [money] NULL,
	[MGA] [money] NULL,
	[OVC] [money] NULL,
	[ADNL_DISCOUNT] [money] NULL,
	[TOTAL_ADNL_DISCOUNT] [money] NULL,
	[REMARK] [varchar](100) NULL,
	[OTHER_REASON] [varchar](300) NULL,
	[IS_GD] [varchar](30) NULL,
	[REAPPR_EMPCODE] [varchar](100) NULL,
	[REAPPR_REMARK] [varchar](20) NULL,
	[DOCUMENT] [varchar](max) NULL,
	[CHAS_NO] [varchar](50) NULL,
	[CHAS_ID] [int] NULL,
	[ALLOTMENT_REM] [varchar](200) NULL,
	[DE_ALOT_DMS_CODE] [varchar](20) NULL,
	[DEALOT_REMARK] [varchar](300) NULL,
	[DEALOT_DATE] [datetime] NULL,
	[CANCEL_REMARK] [varchar](300) NULL,
	[CANCEL_DATE] [datetime] NULL,
	[DMS_CODE] [varchar](20) NULL,
	[BOOKING_AMT] [decimal](19, 2) NULL,
	[CANCEL_APPROVED_AMT] [decimal](19, 2) NULL,
	[REFUND_REF_ID] [varchar](50) NULL,
	[BOOKING_AMT_ACTUAL] [decimal](19, 2) NULL,
	[ADNL_AMT] [decimal](19, 2) NULL,
	[CANCEL_CHARGES] [decimal](19, 2) NULL,
	[FINAL_AMT] [decimal](19, 2) NULL,
	[IS_REAPP] [int] NULL,
	[EXPORT_TYPE] [int] NULL,
	[APPR_1_CODE] [varchar](100) NULL,
	[APPR_1_STAT] [tinyint] NULL,
	[APPR_1_REM] [varchar](300) NULL,
	[APPR_1_DATE] [datetime] NULL,
	[APPR_2_CODE] [varchar](100) NULL,
	[APPR_2_STAT] [tinyint] NULL,
	[APPR_2_REM] [varchar](300) NULL,
	[APPR_2_DATE] [datetime] NULL,
	[APPR_3_CODE] [varchar](100) NULL,
	[APPR_3_STAT] [tinyint] NULL,
	[APPR_3_REM] [varchar](300) NULL,
	[APPR_3_DATE] [datetime] NULL,
	[Fin_Appr] [tinyint] NULL,
	[ACCOUNT_CODE] [varchar](100) NULL,
	[ACCOUNT_STAT] [tinyint] NULL,
	[ACCOUNT_REM] [varchar](300) NULL,
	[ACCOUNT_DATE] [date] NULL,
	[NEXT_LEVEL_APPR_CODE] [varchar](100) NULL,
	[CREATED_BY] [varchar](100) NULL,
	[Created_date] [datetime2](7) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[REFUND_REMARK_DSE] [varchar](150) NULL,
	[AGEING_IN_DAYS] [varchar](150) NULL,
	[REFUND_REMARK_DSE1] [varchar](150) NULL,
PRIMARY KEY CLUSTERED 
(
	[TRAN_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[RTL_COST_MST_hst])
)

ALTER TABLE [dbo].[RTL_COST_MST] ADD  DEFAULT (getdate()) FOR [Created_date]

ALTER TABLE [dbo].[RTL_COST_MST] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `ALTER TABLE Expense_Approval_Matrix ADD [APPROVER1_MINLIMIT] [int] NULL`,
      `ALTER TABLE Expense_Approval_Matrix ADD [APPROVER1_MAXLIMIT] [int] NULL`,
      `ALTER TABLE Expense_Approval_Matrix ADD [APPROVER2_MINLIMIT] [int] NULL`,
      `ALTER TABLE Expense_Approval_Matrix ADD [APPROVER2_MAXLIMIT] [int] NULL`,
      `ALTER TABLE Expense_Approval_Matrix ADD [APPROVER3_MINLIMIT] [int] NULL`,
      `ALTER TABLE Expense_Approval_Matrix ADD [APPROVER3_MAXLIMIT] [int] NULL`,
    ],
  },
  {
    comments: "[RTL_COST_MST]",
    ID: 1483,
    queries: [
      `ALTER TABLE [RTL_COST_MST] SET (SYSTEM_VERSIONING = OFF);`,
      `DROP TABLE [RTL_COST_MST];`,
      `DROP TABLE [RTL_COST_MST_HST];`,
    ],
  },
  {
    comments: "[RTL_COST_MST]",
    ID: 1484,
    queries: [
      `CREATE TABLE [dbo].[RTL_COST_MST](
	[TRAN_ID] [int] IDENTITY(1,1) NOT NULL,
	[TRAN_TYPE] [int] NOT NULL,
	[CURR_DATE] [datetime] NULL,
	[GDFDI_UTD] [bigint] NULL,
	[EMPCODE] [varchar](50) NULL,
	[BOOKING_ID] [varchar](50) NULL,
	[BOOKING_DATE] [datetime] NULL,
	[CUST_ID] [varchar](50) NULL,
	[CUST_NAME] [varchar](100) NULL,
	[CUST_MIDDLENAME] [varchar](100) NULL,
	[CUST_LASTNAME] [varchar](100) NULL,
	[CUST_MOB] [varchar](10) NULL,
	[PAN_NO] [varchar](20) NULL,
	[MODL_GRP] [varchar](20) NULL,
	[MODL_VAR] [varchar](20) NULL,
	[VEH_CLR] [varchar](20) NULL,
	[VAR_CODE] [varchar](50) NULL,
	[FUEL_TYPE] [varchar](50) NULL,
	[RM] [varchar](20) NULL,
	[DEAL_ID] [int] NULL,
	[ALOT_ID] [int] NULL,
	[CANCEL_ID] [int] NULL,
	[REFUND_ID] [int] NULL,
	[LOC_CODE] [varchar](20) NULL,
	[GD_LOC] [varchar](20) NULL,
	[PRICE_LIST_MODL_VAR] [varchar](50) NULL,
	[CUST_TYPE] [varchar](50) NULL,
	[EXSHOWROOM_PRICE] [money] NULL,
	[CHASSIS_NO] [varchar](50) NULL,
	[VIN] [varchar](100) NULL,
	[ENGINE_NO] [varchar](50) NULL,
	[KEY_NO] [varchar](50) NULL,
	[BILL_DATE] [datetime] NULL,
	[VEH_AGEING] [int] NULL,
	[ONROAD_PRICE] [money] NULL,
	[FIN_TYPE] [int] NULL,
	[FIN_CODE] [int] NULL,
	[LOAN_TYPE] [int] NULL,
	[EXCH] [int] NULL,
	[OLD_MODL] [varchar](200) NULL,
	[OLD_REGNO] [varchar](50) NULL,
	[OLD_MARGIN] [money] NULL,
	[ON_WAITING] [int] NULL,
	[APPROVED_AMT] [money] NULL,
	[RELATION] [varchar](100) NULL,
	[MANUFACTURE_YEAR] [varchar](20) NULL,
	[CONSUMER] [money] NULL,
	[Rips] [money] NULL,
	[CORPORATE_YN] [varchar](20) NULL,
	[CORPORATE_TYPE] [varchar](100) NULL,
	[CORPORATE] [money] NULL,
	[EXCHANGE_YN] [varchar](20) NULL,
	[EXCHANGE_TYPE] [varchar](100) NULL,
	[EXCHANGE] [money] NULL,
	[OFFER_1] [money] NULL,
	[OFFER_2] [money] NULL,
	[OFFER_3] [money] NULL,
	[OFFER_4] [money] NULL,
	[OFFER_5] [money] NULL,
	[ADNL_DISCOUNT] [money] NULL,
	[TOTAL_ADNL_DISCOUNT] [money] NULL,
	[REMARK] [varchar](100) NULL,
	[OTHER_REASON] [varchar](300) NULL,
	[IS_GD] [varchar](30) NULL,
	[REAPPR_EMPCODE] [varchar](100) NULL,
	[REAPPR_REMARK] [varchar](20) NULL,
	[DOCUMENT] [varchar](max) NULL,
	[CHAS_NO] [varchar](50) NULL,
	[CHAS_ID] [int] NULL,
	[ALLOTMENT_REM] [varchar](200) NULL,
	[DE_ALOT_DMS_CODE] [varchar](20) NULL,
	[DEALOT_REMARK] [varchar](300) NULL,
	[DEALOT_DATE] [datetime] NULL,
	[CANCEL_REMARK] [varchar](300) NULL,
	[CANCEL_DATE] [datetime] NULL,
	[DMS_CODE] [varchar](20) NULL,
	[BOOKING_AMT] [decimal](19, 2) NULL,
	[CANCEL_APPROVED_AMT] [decimal](19, 2) NULL,
	[REFUND_REF_ID] [varchar](50) NULL,
	[BOOKING_AMT_ACTUAL] [decimal](19, 2) NULL,
	[ADNL_AMT] [decimal](19, 2) NULL,
	[CANCEL_CHARGES] [decimal](19, 2) NULL,
	[FINAL_AMT] [decimal](19, 2) NULL,
	[IS_REAPP] [int] NULL,
	[EXPORT_TYPE] [int] NULL,
	[APPR_1_CODE] [varchar](100) NULL,
	[APPR_1_STAT] [tinyint] NULL,
	[APPR_1_REM] [varchar](300) NULL,
	[APPR_1_DATE] [datetime] NULL,
	[APPR_2_CODE] [varchar](100) NULL,
	[APPR_2_STAT] [tinyint] NULL,
	[APPR_2_REM] [varchar](300) NULL,
	[APPR_2_DATE] [datetime] NULL,
	[APPR_3_CODE] [varchar](100) NULL,
	[APPR_3_STAT] [tinyint] NULL,
	[APPR_3_REM] [varchar](300) NULL,
	[APPR_3_DATE] [datetime] NULL,
	[Fin_Appr] [tinyint] NULL,
	[ACCOUNT_CODE] [varchar](100) NULL,
	[ACCOUNT_STAT] [tinyint] NULL,
	[ACCOUNT_REM] [varchar](300) NULL,
	[ACCOUNT_DATE] [date] NULL,
	[NEXT_LEVEL_APPR_CODE] [varchar](100) NULL,
	[CREATED_BY] [varchar](100) NULL,
	[Created_date] [datetime2](7) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[REFUND_REMARK_DSE] [varchar](150) NULL,
	[AGEING_IN_DAYS] [varchar](150) NULL,
	[REFUND_REMARK_DSE1] [varchar](150) NULL,
	[INV_NO] [varchar](100) NULL,
	[HSN] [int] NULL,
	[LEDG_CODE] [int] NULL,
	[LEDG_CUST_NAME] [varchar](200) NULL,
	[LEDG_PLACE_OF_SUPPLY] [int] NULL,
	[LEDG_GST_NO] [varchar](100) NULL,
	[PERMANENT_ADDR1] [varchar](300) NULL,
	[PERMANENT_ADDR2] [varchar](300) NULL,
	[PERMANENT_ADDR3] [varchar](300) NULL,
	[CUST_PLACE_OF_SUPPLY] [int] NULL,
	[CUST_GST_NO] [varchar](100) NULL,
	[SHIPPING_ADDR1] [varchar](300) NULL,
	[SHIPPING_ADDR2] [varchar](300) NULL,
	[SHIPPING_ADDR3] [varchar](300) NULL,
	[BASIC_PRICE] [money] NULL,
	[DISCOUNT_EXC_GST] [money] NULL,
	[TAXABLE_VALUE] [money] NULL,
	[IGST_Amt] [money] NULL,
	[CGST_Amt] [money] NULL,
	[SGST_Amt] [money] NULL,
	[TCS_PERC] [money] NULL,
	[Total_Amt] [money] NULL,
	[DLV_CHALLAN_DATE] [datetime] NULL,
	[FINAL_INVOICE_DATE] [datetime] NULL,
	[GST_PERCT] [money] NULL,
	[Irn_No] [varchar](300) NULL,
	[SHIP_CUST_NAME] [varchar](100) NULL,
	[SHIP_CUST_MOB] [varchar](20) NULL,
	[TCS_AMT] [money] NULL,
PRIMARY KEY CLUSTERED 
(
	[TRAN_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[RTL_COST_MST_hst])
)

ALTER TABLE [dbo].[RTL_COST_MST] ADD  DEFAULT (getdate()) FOR [Created_date]

ALTER TABLE [dbo].[RTL_COST_MST] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "[RTL_COST_MST]",
    ID: 1485,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD IS_ALLOTMENT_ALLOWED_AMOUNT MONEY NULL`,
      `ALTER TABLE COMP_KEYDATA ADD IS_ADJUSTMENT INT NULL`,
      `ALTER TABLE COMP_KEYDATA ADD MODEL_EDIT_FLAG INT NULL`,
      `ALTER TABLE COMP_KEYDATA ADD IsCustRefundForm INT NULL`,
      `ALTER TABLE COMP_KEYDATA ADD IsCancellationApproval INT NULL`,
      `ALTER TABLE COMP_KEYDATA ADD CANCELLATION_VALUE INT NULL`,
      `CREATE TABLE [dbo].[REFUND_CUST_FORM](
	     [TRAN_ID] [int] NOT NULL,
	     [LINK_ID] [int] NOT NULL,
	     [CUSTOMER_ID] [varchar](50) NULL,
	     [CUSTOMER_NAME] [varchar](150) NULL,
	     [BOOKING_ID] [varchar](50) NULL,
	     [CUST_MOB] [varchar](20) NULL,
	     [MODEL] [varchar](100) NULL,
	     [VARIANT] [varchar](100) NULL,
	     [COLOR] [varchar](50) NULL,
	     [BOOKING_AMT] [decimal](18, 2) NULL,
	     [CANCEL_DATE] [datetime] NULL,
	     [REMARK] [varchar](500) NULL,
	     [STATUS] [int] NULL,
	     [CREATED_BY] [varchar](50) NULL,
	     [EXPORT_TYPE] [int] NULL,
	     [CREATED_DATE] [datetime] NULL,
	     [REMARK_REASON] [varchar](100) NULL,
       PRIMARY KEY CLUSTERED 
       (
       	[TRAN_ID] ASC
       )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
       ) ON [PRIMARY]
       
       ALTER TABLE [dbo].[REFUND_CUST_FORM] ADD  DEFAULT ((1)) FOR [STATUS]
       
       ALTER TABLE [dbo].[REFUND_CUST_FORM] ADD  DEFAULT (getdate()) FOR [CREATED_DATE]`,
      `ALTER TABLE IFSC_CODE_API ADD ACCOUNT_NO VARCHAR(50) NULL`,
    ],
  },
  {
    comments: "[COMP_KEYDATA]",
    ID: 1486,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD IS_ALLOTMENT_ALLOWED_AMOUNT MONEY NULL`,
    ],
  },
  {
    comments: "[COMP_KEYDATA]",
    ID: 1487,
    queries: [`ALTER TABLE COMP_KEYDATA ADD IS_ACTIVE_GP_DUPLI INT DEFAULT 0`],
  },
  {
    comments: "[COMP_KEYDATA]",
    ID: 1488,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD Auto_booking INT DEFAULT 0`,
      `ALTER TABLE Rtl_Cost_Dtl ADD BOOKING_ID VARCHAR(100) NULL`,
    ],
  },
  {
    comments: "[DIG_GP]",
    ID: 1489,
    queries: [`ALTER TABLE DIG_GP ALTER COLUMN	[REASON] [varchar](500) NULL`],
  },
  {
    comments: "[RTL_MST]",
    ID: 1490,
    queries: [
      `ALTER TABLE RTL_MST ADD cost_modl_grp NVARCHAR(50) NULL`,
      `ALTER TABLE RTL_MST ADD cost_modl_varient NVARCHAR(200) NULL`,
      `CREATE TABLE [dbo].[IVR_Arora_Msg](
	[Utd] [int] IDENTITY(1,1) NOT NULL,
	[callId] [nvarchar](100) NOT NULL,
	[did] [varchar](100) NULL,
	[cType] [nvarchar](10) NULL,
	[callLiveStatus] [int] NULL,
	[callStatus] [int] NULL,
	[campId] [nvarchar](20) NULL,
	[userId] [nvarchar](50) NULL,
	[cNumber] [nvarchar](20) NULL,
	[cNumber10] [nvarchar](20) NULL,
	[masterNumCTC] [nvarchar](20) NULL,
	[masterAgent] [nvarchar](20) NULL,
	[masterAgentNumber] [nvarchar](20) NULL,
	[ivrExecuteFlow] [nvarchar](200) NULL,
	[HangupBySourceDetected] [int] NULL,
	[ivrSTime] [datetime] NULL,
	[ivrETime] [datetime] NULL,
	[ivrDuration] [int] NULL,
	[talkDuration] [int] NULL,
	[agentOnCallDuration] [nvarchar](10) NULL,
	[firstAttended] [nvarchar](20) NULL,
	[firstAnswerTime] [datetime] NULL,
	[lastHangupTime] [datetime] NULL,
	[lastFirstDuration] [int] NULL,
	[custAnswerSTime] [datetime] NULL,
	[custAnswerETime] [datetime] NULL,
	[custAnswerDuration] [int] NULL,
	[totalHoldDuration] [nvarchar](10) NULL,
	[callBack] [nvarchar](10) NULL,
	[queueDuration] [nvarchar](10) NULL,
	[callDisposition] [nvarchar](500) NULL,
	[exitCode] [int] NULL,
	[contactId] [nvarchar](20) NULL,
	[CTC] [nvarchar](max) NULL,
	[totalCreditsUsed] [nvarchar](max) NULL,
	[cliArr] [nvarchar](max) NULL,
	[ivrIdArr] [nvarchar](max) NULL,
	[aH] [nvarchar](max) NULL,
	[DTMF] [nvarchar](max) NULL,
	[contactInfo] [nvarchar](max) NULL,
	[contactListData] [nvarchar](max) NULL,
	[aHDetail] [nvarchar](max) NULL,
	[nH] [nvarchar](max) NULL,
	[nHDetail] [nvarchar](max) NULL,
	[aAnsH] [nvarchar](max) NULL,
	[recordings] [nvarchar](max) NULL,
	[voiceMail] [nvarchar](max) NULL,
	[Created_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Utd] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

ALTER TABLE [dbo].[IVR_Arora_Msg] ADD  DEFAULT (getdate()) FOR [Created_date]`,
      `ALTER TABLE RTL_MST ADD DO_NUMBER VARCHAR(50) NULL`,
      `ALTER TABLE RTL_MST ADD DO_AMOUNT VARCHAR(50) NULL`,
      `ALTER TABLE Enq_Dtl ADD
    UTD INT IDENTITY(1,1),
    Tran_Type INT NULL,
    Created_By VARCHAR(255) NULL,
    Created_At DATETIME NULL DEFAULT GETDATE()`,
      `ALTER TABLE dig_gp ADD Latitude [nvarchar](50) NULL, Longitude [nvarchar](50) NULL , Loc_Address [nvarchar](500) NULL`,
      `ALTER TABLE COMP_KEYDATA ADD is_gp_location int DEFAULT 0, is_gp_emp_img int DEFAULT 0`,
      `ALTER TABLE RTL_COST_MST ADD LOGIN_LOC_CODE INT NULL`,
      `ALTER TABLE COMP_KEYDATA ADD IS_OFFER_LAPS INT NULL`,
      `alter table COMP_KEYDATA add Auto_close_GP int DEFAULT 0`,
      `ALTER TABLE COMP_KEYDATA ADD RECEIPT_FLAG INT`,
    ],
  },
  {
    comments: "[TV_ICM_MST]",
    ID: 1491,
    queries: [
      `ALTER TABLE TV_ICM_MST ADD [DRIVING_LICENSE_DOC] [varchar](max) NULL`,
      `ALTER TABLE TV_ICM_MST ADD [CUSTOMER_ID_DOC] [varchar](max) NULL`,
      `ALTER TABLE TV_ICM_MST ADD [INSURANCE_POLICY_DOC] [varchar](max) NULL`,
      `ALTER TABLE TV_ICM_MST ADD [CAR_PAPERS_DOC] [varchar](max) NULL`,
      `ALTER TABLE TV_ICM_MST ADD [SURVEY_REPORT_DOC] [varchar](max) NULL`,
    ],
  },
  {
    comments: "[EMP_DOCS]",
    ID: 1492,
    queries: [
      `ALTER TABLE dbo.EMP_DOCS ALTER COLUMN EMP_CODE [nvarchar](20) COLLATE SQL_Latin1_General_CP1_CI_AS;`,
    ],
  },
  {
    comments: "IX_dise_aprvl_filter",
    ID: 1493,
    queries: [
      `CREATE INDEX IX_dise_aprvl_filter
ON dise_aprvl (Curr_Date, location, export_type, SRM)
INCLUDE (UTD, Next_Level_Appr_Code, Appr_1_Stat, Appr_2_Stat, Appr_3_Stat, Appr_1_Code, Appr_2_Code, Appr_3_Code, fin_appr, Modl_Group, Veh_Clr, Loan, Modl_Var,CustMiddle_Name, CustLast_Name);`,
      `CREATE INDEX IX_Approval_Matrix_discount_emp
ON Approval_Matrix (module_code, empcode)
INCLUDE (approver1_A, approver1_B, approver2_A, approver2_B, approver3_A, approver3_B);`,
      `CREATE INDEX IX_GDFDI_ORDBK_utd_type_date
ON GDFDI_ORDBK (utd, trans_type, trans_date)
INCLUDE (AX_FLAG, TAXABLE_VALUE, CUST_ID, CUST_NAME,  EXECUTIVE, TEAM_HEAD);`,
    ],
  },
  {
    comments: "IX_dise_aprvl_filter",
    ID: 1494,
    queries: [`ALTER TABLE COMP_KEYDATA ADD Print_flag INT NULL`],
  },
  {
    comments: "[EMP_DOCS]",
    ID: 1495,
    queries: [
      `ALTER TABLE RTL_COST_MST ADD SEQ_NO INT NULL`,
      `alter table COMP_KEYDATA add is_leave_emp_img int default 0`,
    ],
  },
  {
    comments: "dig_gp",
    ID: 1496,
    queries: [
      `alter TABLE dig_gp add HR_CODE NVARCHAR(20) ,IN_BY NVARCHAR(20) ,OUT_BY NVARCHAR(20)`,
    ],
  },
  {
    comments: "EMPLOYEEMASTER",
    ID: 1497,
    queries: [
      `ALTER TABLE EMPLOYEEMASTER ADD Apprentice_Date_From DATE NULL`,
      `ALTER TABLE EMPLOYEEMASTER ADD Apprentice_Date_To DATE NULL`,
      `ALTER TABLE EMPLOYEEMASTER_HST ADD Apprentice_Date_From DATE NULL`,
      `ALTER TABLE EMPLOYEEMASTER_HST ADD Apprentice_Date_To DATE NULL`,
      `ALTER TABLE misc_mst ADD Shift_Date smalldatetime NULL`,
    ],
  },
  {
    comments: "Hyundai_Discount_List_Import",
    ID: 1498,
    queries: [
      `ALTER TABLE Hyundai_Discount_List_Import ADD Valid_To  date NULL`,
      `ALTER TABLE Hyundai_Discount_List_Import ADD Valid_From date NULL`,
      `INSERT INTO Mand_Mst 
      (misc_code, misc_name, field_name, field_Abbr, Created_By, Export_Type, IsMandtory)
      VALUES
      (2,'Recruitment Process','NAME','CANDIDATE NAME','SYSTEM',1,1),
      (2,'Recruitment Process','MOB_NO','Mobile No','SYSTEM',1,1),
      (2,'Recruitment Process','WHATSAPP_NO','WhatsApp Number','SYSTEM',1,1),
      (2,'Recruitment Process','EMAIL','EMAIL','SYSTEM',1,1),
      (2,'Recruitment Process','AADHAR_NO','Aadhar Number','SYSTEM',1,1),
      (2,'Recruitment Process','FATHERS_NAME','FATHERS NAME','SYSTEM',1,1),
      (2,'Recruitment Process','MOTHERS_NAME','MOTHERS NAME','SYSTEM',1,1),
      (2,'Recruitment Process','GENDER','GENDER','SYSTEM',1,1),
      (2,'Recruitment Process','ADDRESS','ADDRESS','SYSTEM',1,1),
      (2,'Recruitment Process','CITY','CITY','SYSTEM',1,1),
      (2,'Recruitment Process','STATE','STATE','SYSTEM',1,1),
      (2,'Recruitment Process','relCode','Religion','SYSTEM',1,1),
      (2,'Recruitment Process','CATEGORY','CATEGORY','SYSTEM',1,1),
      (2,'Recruitment Process','CASTE','CASTE','SYSTEM',1,1),
      (2,'Recruitment Process','DOB','DOB','SYSTEM',1,1),
      (2,'Recruitment Process','DESIGNATION','DESIGNATION','SYSTEM',1,1),
      (2,'Recruitment Process','LOC_CODE','BRANCH','SYSTEM',1,1),
      (2,'Recruitment Process','SKILLS','KEY SKILLS','SYSTEM',1,1),
      (2,'Recruitment Process','HIGH_QUAL','HIGHEST QUALIFICATION','SYSTEM',1,1),
      (2,'Recruitment Process','PASSING_PER','Highest Qualification %','SYSTEM',1,1),
      (2,'Recruitment Process','EXP_IN_YEAR','Experience','SYSTEM',1,1),
      (2,'Recruitment Process','CURRENT_CTC','CURRENT CTC','SYSTEM',1,1),
      (2,'Recruitment Process','SOURCE_OF_REG','Source','SYSTEM',1,1),
      (2,'Recruitment Process','Emgy_No','Emergency Number','SYSTEM',1,1),
      (2,'Recruitment Process','Emgy_Mob_No','Emergency Mobile Number','SYSTEM',1,1),
      (2,'Recruitment Process','COMP_KNOWN','Remark','SYSTEM',1,0),
      (2,'Recruitment Process','DRIVE','Driving Skills','SYSTEM',1,0),
      (2,'Recruitment Process','ppimg','Profile Image','SYSTEM',1,0),
      (2,'Recruitment Process','adhar','Aadhar Card','SYSTEM',1,0),
      (2,'Recruitment Process','pancard','PAN Card','SYSTEM',1,0),
      (2,'Recruitment Process','salslip','Salary Slip','SYSTEM',1,0),
      (2,'Recruitment Process','cv','CV','SYSTEM',1,1),
      (2,'Recruitment Process','explett','Experience Letter','SYSTEM',1,0)`,
      `ALTER TABLE TV_ICM_DTL ADD FINAL_SALE_INV_AMT MONEY NULL`,
    ],
  },
  {
    comments: "Hyundai_Discount_List_Import",
    ID: 1499,
    queries: [`ALTER TABLE NEW_JOINING ADD EXPECTED_CTC MONEY NULL`],
  },
  {
    comments: "Hyundai_Discount_List_Import",
    ID: 1500,
    queries: [
      `ALTER TABLE NEW_JOINING ADD SUB_SOURCE VARCHAR(200) NULL`,
      `ALTER TABLE NEW_JOINING ADD SUITABLE_DESIGNATION VARCHAR(150) NULL`,
      `
CREATE TABLE [dbo].[WO_MST](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[EMPCODE] [NVARCHAR] (20) NULL,
	[WO_MNTH] [int] NULL,
	[WO_DAY] [NVARCHAR] (20) NULL,
	[WO_DATE] [date] NULL,
	[WO_YEAR] [int] NULL,
	[CREATED_AT] [datetime] NULL,
	[CREATED_BY] [Nvarchar](50) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[WO_MST_Hst])
)

ALTER TABLE [dbo].[WO_MST] ADD  DEFAULT (getdate()) FOR [ValidFrom]
`,
    ],
  },
  {
    comments: "RTL_COST_MST",
    ID: 1501,
    queries: [
      `ALTER TABLE RTL_COST_MST ADD ALLOT_LOC_CODE INT NULL`,
      `ALTER TABLE COMP_KEYDATA ADD AUTO_STOCK_TRANSFER INT NULL`,
    ],
  },
  {
    comments: "RTL_COST_MST",
    ID: 1502,
    queries: [
      `ALTER TABLE RTL_COST_MST ALTER COLUMN REAPPR_REMARK VARCHAR(300) NULL`,
    ],
  },
  {
    comments: "RTL_COST_MST",
    ID: 1503,
    queries: [
      `alter table comp_off_dtl add export_type int DEFAULT 1`,
      `update COMP_OFF_DTL set export_type = 1 where export_type is null`,
      `ALTER TABLE WO_MST ADD export_type int default 1`,
    ],
  },
  {
    comments: "RTL_COST_MST",
    ID: 1504,
    queries: [
      `ALTER TABLE RTL_COST_MST ADD LEDG_PAN_NO VARCHAR(20) NULL`,
      `ALTER TABLE RTL_COST_MST ADD GST_TYPE VARCHAR(10) NULL`,
    ],
  },
  {
    comments: "FullFinal_Adjustments",
    ID: 1505,
    queries: [
      `CREATE TABLE FullFinal_Adjustments (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    EmpCode VARCHAR(50) NOT NULL,
    SalMonth INT NOT NULL,
    SalYear INT NOT NULL,
    Bonus_Payable DECIMAL(18,2) DEFAULT 0,
    Notice_Pay_Lieu DECIMAL(18,2) DEFAULT 0,
    Other_Payable DECIMAL(18,2) DEFAULT 0,
    Other_Outstanding DECIMAL(18,2) DEFAULT 0,
    Notice_Pay_Deduction DECIMAL(18,2) DEFAULT 0,
    Created_By VARCHAR(50),
    Created_On DATETIME DEFAULT GETDATE(),
    	EXPORT_TYPE int NULL,
);`,
    ],
  },
  {
    comments: "user_tbl",
    ID: 1506,
    queries: [
      `ALTER TABLE user_tbl ALTER COLUMN [Phy_Loc] [nvarchar](500) NULL`,
      `ALTER TABLE DOC_PREFIX ADD Phy_Loc_Code INT NULL`,
      `ALTER TABLE COMP_OFF_DTL 
add APPR_1_BY NVARCHAR (20),	APPR_1_STAT int,	APPR_1_DATE DATETIME,	APPR_1_REM NVARCHAR (255),
APPR_2_BY NVARCHAR (20),	APPR_2_STAT int,	APPR_2_DATE DATETIME,	APPR_2_REM NVARCHAR (255),
APPR_3_BY NVARCHAR (20),	APPR_3_STAT int,	APPR_3_DATE DATETIME,	APPR_3_REM NVARCHAR (255)`,
      `ALTER TABLE COMP_KEYDATA add alw_interbranch_gp int , limit_pers_gp int`,
      `CREATE TABLE app_module_version_control (
    module_key VARCHAR(50) PRIMARY KEY,
    min_version INT NOT NULL
);`,
      `INSERT INTO app_module_version_control (module_key, min_version) VALUES
('1', 35),
('2', 35),
('3', 35),
('4', 35),
('5', 35),
('6', 35),
('7', 35),
('8', 35),
('9', 35),
('10', 35),
('11', 35),
('12', 35),
('13', 35),
('14', 35),
('15', 35),
('15.1', 35),
('15.2', 35),
('15.3', 35),
('15.4', 35),
('15.5', 35),
('15.6', 35),
('15.7', 35),
('15.8', 35),
('15.9', 35),
('15.10', 35),
('16', 35),
('17', 35),
('18', 35),
('19', 35),
('20', 35),
('21', 35),
('22', 35),
('23', 35),
('24', 35),
('26', 35),
('26.1', 35),
('26.2', 35),
('26.3', 35),
('26.4', 35),
('26.5', 35),
('26.6', 35),
('26.7', 35),
('26.8', 35),
('27', 35),
('28', 35),
('1.1', 35),
('1.1.1', 35),
('1.1.2', 35),
('1.1.3', 35),
('1.1.4', 35),
('1.1.7', 35),
('1.2', 35),
('1.2.1', 35),
('1.2.2', 35),
('1.3', 35),
('1.3.1', 35),
('1.3.2', 35),
('1.4', 35),
('1.5', 35),
('1.6', 35),
('1.7', 35),
('1.18', 35),
('1.19', 35),
('1.20', 35),
('1.21', 35),
('1.22', 35),
('25', 35),
('19.1', 35),
('19.2', 35),
('19.3', 35),
('1.7.1', 35),
('1.8', 35),
('1.8.1', 35),
('1.9', 35),
('1.10', 35),
('1.11', 35),
('1.12', 35),
('1.13', 35),
('1.14', 35),
('1.15', 35),
('1.16', 35),
('1.17', 35),
('1.1.1.1.1', 35),
('18.1', 35),
('18.2', 35),
('18.3', 35),
('18.4', 35),
('18.2.1', 35),
('18.2.2', 35),
('18.2.3', 35),
('18.2.4', 35),
('29.1', 35),
('29.2', 35);`,
      `ALTER TABLE COMP_OFF_DTL
ADD CO_RESERVED DECIMAL(10,2) DEFAULT 0;`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1507,
    queries: [
      `ALTER TABLE user_tbl ADD [Phy_Loc] [nvarchar](500) NULL`,
      `ALTER TABLE COMP_KEYDATA ADD WHATSAPP_DEALER_CODE INT NULL`,
      `ALTER TABLE COMP_KEYDATA ALTER COLUMN Whatsapp_Module_Code VARCHAR(MAX) NULL`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1508,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD WHATSAPP_DEALER_CODE INT NULL`,
      `ALTER TABLE COMP_KEYDATA ALTER COLUMN Whatsapp_Module_Code VARCHAR(MAX) NULL`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1509,
    queries: [
      `ALTER TABLE CHAS_TRF ADD Driver_Mob VARCHAR(20) NULL`,
      `CREATE TABLE [dbo].[GLB_LEAVE_BAL](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[EMPCODE] [NVARCHAR] (20) NULL,
	[DATEOFFICE] [DATE] NULL,
	[LEAVE_TYPE] [int] NULL,
	[LEAVE_VAL] DECIMAL(10,2) NULL,
	[TRAN_TYPE] [INT] NULL,
	[CREATED_AT] [datetime] NULL,
	[CREATED_BY] [NVARCHAR](50) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[GLB_LEAVE_BAL_Hst])
)

ALTER TABLE [dbo].[GLB_LEAVE_BAL] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "comp_keydata",
    ID: 1510,
    queries: [
      `ALTER TABLE CHAS_MST ADD Acc_Amt [money] NULL`,
      `alter TABLE comp_keydata add back_date_mipunch_allowed int`,
    ],
  },
  {
    comments: "comp_keydata",
    ID: 1511,
    queries: [
      `alter table attendancetable add Mispunch_out_applied_on [datetime] NULL`,
    ],
  },
  {
    comments: "comp_keydata",
    ID: 1512,
    queries: [
      `alter TABLE misc_mst add dis_back_date int`,
      `UPDATE COMP_KEYDATA set back_date_mipunch_allowed = 1 where Comp_Code = 1`,
      `ALTER TABLE COMP_KEYDATA ADD IsCustBookingForm INT NULL`,
    ],
  },
  {
    comments: "comp_keydata",
    ID: 1513,
    queries: [`alter TABLE comp_keydata add MP_REMARK_MIN_LENGTH int`],
  },
  {
    comments: "TID_MST",
    ID: 1514,
    queries: [
      `CREATE TABLE [dbo].[TID_MST](
	[TID] [int] IDENTITY(1,1) NOT NULL,
	[SRNO] INT NULL,
	[TERMS] [varchar](MAX) NULL,
	[SEGMENT_CODE] INT NULL,
	[EXPORT_TYPE] INT NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[TID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[TID_MST_Hst])
)

ALTER TABLE [dbo].[TID_MST] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[TID_MST] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    ],
  },
  {
    comments: "TID_DTL",
    ID: 1515,
    queries: [
      `CREATE TABLE [dbo].[TID_DTL](
	[TID] [int] IDENTITY(1,1) NOT NULL,
	[MST_TID] INT NULL,
	[SRNO] INT NULL,
	[SEQ_NO] INT NULL,
	[SUB_SEQ_NO] INT NULL,
	[TERMS] [varchar](MAX) NULL,
	[SEGMENT_CODE] INT NULL,
	[EXPORT_TYPE] INT NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[TID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[TID_DTL_Hst])
)

ALTER TABLE [dbo].[TID_DTL] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[TID_DTL] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `ALTER TABLE RTL_MST ALTER COLUMN Ledg_Name nvarchar(300) NULL`,
      `ALTER TABLE RTL_MST ADD Financer_Code INT NULL`,
      `ALTER TABLE RTL_MST ADD Loan_Amt MONEY NULL`,
      `ALTER TABLE RTL_MST ADD Down_Payment MONEY NULL`,
      `ALTER TABLE RTL_MST ADD Tenure FLOAT NULL`,
      `ALTER TABLE RTL_MST ADD ROI MONEY NULL`,
      `ALTER TABLE RTL_MST ADD Special_Terms VARCHAR(300) NULL`,
      `alter table NEW_JOINING add CLUSTER int , CHANNEL int`,
      `alter table SHORTLISTED_CANDIDATE add CLUSTER int , CHANNEL int`,
    ],
  },
  {
    comments: "TID_DTL",
    ID: 1516,
    queries: [
      `alter TABLE comp_keydata add QUOTATION_PDF int`,
      `alter TABLE rtl_mst add QUOT_PREFIX NVARCHAR (20),QUOT_SEQ INT,ALTER_MODL_VER NVARCHAR(20)`,
      `alter TABLE comp_keydata add hide_deal_frz int,enb_summer_btn int`,
      `ALTER TABLE RTL_COST_MST ALTER COLUMN OLD_MARGIN VARCHAR(50) NULL
EXEC sp_rename 'RTL_COST_MST.OLD_MARGIN', 'OLD_YEAR', 'COLUMN';
ALTER TABLE RTL_COST_MST ALTER COLUMN ON_WAITING MONEY NULL
EXEC sp_rename 'RTL_COST_MST.ON_WAITING', 'OLD_PRICE', 'COLUMN'`,
      `CREATE TABLE [dbo].[ALTER_MODL_Cost](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[TRAN_ID] [int] NULL,
	[Is_Add_On1] [int] NULL,
	[Sub_Add_On1] [int] NULL,
	[Price1] [money] NULL,
	[Is_Add_On2] [int] NULL,
	[Sub_Add_On2] [int] NULL,
	[Price2] [money] NULL,
	[Is_Add_On3] [int] NULL,
	[Sub_Add_On3] [int] NULL,
	[Price3] [money] NULL,
	[Is_Add_On4] [int] NULL,
	[Sub_Add_On4] [int] NULL,
	[Price4] [money] NULL,
	[Is_Add_On5] [int] NULL,
	[Sub_Add_On5] [int] NULL,
	[Price5] [money] NULL,
	[Is_Add_On6] [int] NULL,
	[Sub_Add_On6] [int] NULL,
	[Price6] [money] NULL,
	[Is_Add_On7] [int] NULL,
	[Sub_Add_On7] [int] NULL,
	[Price7] [money] NULL,
	[Is_Add_On8] [int] NULL,
	[Sub_Add_On8] [int] NULL,
	[Price8] [money] NULL,
	[Is_Add_On9] [int] NULL,
	[Sub_Add_On9] [int] NULL,
	[Price9] [money] NULL,
	[Is_Add_On10] [int] NULL,
	[Sub_Add_On10] [int] NULL,
	[Price10] [money] NULL,
	[Is_Add_On11] [int] NULL,
	[Sub_Add_On11] [int] NULL,
	[Price11] [money] NULL,
	[Is_Add_On12] [int] NULL,
	[Sub_Add_On12] [int] NULL,
	[Price12] [money] NULL,
	[Is_Add_On13] [int] NULL,
	[Sub_Add_On13] [int] NULL,
	[Price13] [money] NULL,
	[Is_Add_On14] [int] NULL,
	[Sub_Add_On14] [int] NULL,
	[Price14] [money] NULL,
	[Is_Add_On15] [int] NULL,
	[Sub_Add_On15] [int] NULL,
	[Price15] [money] NULL,
	[Loc_Code] [int] NULL,
	[Export_Type] [int] NULL,
	[Created_At] [datetime] NULL,
	[Created_by] [varchar](100) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[timestamp] [datetime] NULL,
	[IS_QUOTATION_Y_N] [nvarchar](10) NULL,
	[fin_price1] [nvarchar](30) NULL,
	[fin_price2] [nvarchar](30) NULL,
	[fin_price3] [nvarchar](30) NULL,
	[fin_price4] [nvarchar](30) NULL,
	[fin_price5] [nvarchar](30) NULL,
	[fin_price6] [nvarchar](30) NULL,
	[fin_price7] [nvarchar](30) NULL,
	[fin_price8] [nvarchar](30) NULL,
	[fin_price9] [nvarchar](30) NULL,
	[fin_price10] [nvarchar](30) NULL,
	[fin_price11] [nvarchar](30) NULL,
	[fin_price12] [nvarchar](30) NULL,
	[fin_price13] [nvarchar](30) NULL,
	[fin_price14] [nvarchar](30) NULL,
	[fin_price15] [nvarchar](30) NULL,
	[BOOKING_ID] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[ALTER_MODL_Cost_Hst])
)

ALTER TABLE [dbo].[ALTER_MODL_Cost] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE CHAS_MST ADD [Audit_Date] [smalldatetime] NULL`,
      `alter TABLE rtl_mst add QUOT_Date date`,
      `CREATE TABLE [dbo].[Chas_Audit](
	[TRAN_ID] [int] NOT NULL,
	[CHAS_ID] [int] NOT NULL,
	[CHAS_NO] [varchar](50) NULL,
	[REMARK] [varchar](300) NULL,
	[AUDIT_DATE] [datetime] NULL,
	[CREATED_BY] [varchar](50) NULL,
	[AUDIT_TYPE] [int] NULL,
	[EXPORT_TYPE] [int] NULL,
	[Created_At] [datetime] NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[TRAN_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Chas_Audit_hst])
)

ALTER TABLE [dbo].[Chas_Audit] ADD  DEFAULT (getdate()) FOR [Created_At]`,
    ],
  },
  {
    comments: "comp_keydata",
    ID: 1517,
    queries: [`alter TABLE ALTER_MODL_Cost add alter_exshowroom money,consumer_offer money,exchange_discount money,scrap_discount money,corporate_discount money,government_discount money,additional_discount money,msga_discount money`],
  },
  {
    comments: "EMPLOYEEMASTER",
    ID: 1518,
    queries: [`ALTER TABLE EMPLOYEEMASTER ALTER COLUMN	[EMPLOYEEDESIGNATION] [nvarchar](200)`,
      `ALTER TABLE EMPLOYEEMASTER_HST ALTER COLUMN	[EMPLOYEEDESIGNATION] [nvarchar](200)`,
      `ALTER TABLE Hyundai_Counter_Summary_Import ADD LEDG_ACNT VARCHAR(100) NULL;`
    ],
  },
  {
    comments: "TID_DTL",
    ID: 1519,
    queries: [`ALTER TABLE TID_DTL ALTER COLUMN TERMS NVARCHAR(MAX)`,
      `ALTER TABLE rtl_mst ALTER COLUMN ALTER_MODL_VER NVARCHAR(200)`,
      `alter table rtl_mst add Fuel_Type NVARCHAR (20);`
    ],
  },
  {
    comments: "EMPLOYEEMASTER",
    ID: 1520,
    queries: [`alter table EMPLOYEEMASTER add  [Inserted_By] [varchar](50) NULL`,
      `alter table EMPLOYEEMASTER_hst add  [Inserted_By] [varchar](50) NULL`,
      `alter table rtl_mst add csd_po_date date,csd_po_amount money`
    ],
  },
  {
    comments: "Approval_Matrix",
    ID: 1521,
    queries: [`ALTER TABLE Approval_Matrix ALTER COLUMN [module_code] [varchar](100)`,
      `ALTER TABLE EMPLOYEEMASTER ADD [GEOOFFENCELOC] [nvarchar](500) NULL`,
      `ALTER TABLE EMPLOYEEMASTER_HST ADD [GEOOFFENCELOC] [nvarchar](500) NULL`,
      `ALTER TABLE dise_aprvl ADD NewCar_Doc VARCHAR(500)`,
      `ALTER TABLE dise_aprvl ADD Delivery_Log_Doc VARCHAR(500)`,
      `ALTER TABLE DOC_PREFIX ADD 	[DelvChalan_lastYr_Prefix] [varchar](50) NULL`,
      `ALTER TABLE DOC_PREFIX ADD 	[Veh_Inv_lastYr_Prefix] [varchar](50) NULL`,
      `ALTER TABLE DOC_PREFIX ADD 	[MaxSeq_DelvChallan] [varchar](50) NULL`,
      `ALTER TABLE DOC_PREFIX ADD 	[MaxSeq_FinalInv] [varchar](50) NULL`,
      `ALTER PROCEDURE [dbo].[GetEmployeeLocation]
      @EmployeeCode NVARCHAR(50),
      @Latitude VARCHAR(20),
      @Longitude VARCHAR(20),
      @BufferMeters FLOAT = 30 -- New parameter for buffer (default 30 meters)
  AS
  BEGIN
      SET NOCOUNT ON;
     
      DECLARE @GeoLocationStrings NVARCHAR(MAX);
      DECLARE @Geofence GEOMETRY;
      DECLARE @Geofence_concat VARCHAR(300);
      DECLARE @Usergeofence VARCHAR(5);
      DECLARE @LocationFound BIT = 0;
      DECLARE @BufferDegrees FLOAT = @BufferMeters / 111000; -- Convert meters to degrees (~111km per degree)
      DECLARE @GeoFenceLoc NVARCHAR(MAX);
  
      -- Check if the user has the right to apply from anywhere
      DECLARE @Permission NVARCHAR(5);
     
      -- Check user permissions
      SELECT @Permission = COALESCE((
          SELECT TOP 1
              CASE
                  WHEN Optn_Name = '1.1.1.2' THEN 'ALL'
                  WHEN Optn_Name = '1.1.1.1' THEN 'USER'
              END
          FROM Mobile_Rights
          WHERE Emp_Code = @EmployeeCode AND Optn_Name IN ('1.1.1.1', '1.1.1.2')
      ), 'ALLOW');
  
      -- Fetch geofences based on permissions
      IF @Permission = 'ALLOW'
      BEGIN
          -- Return 1 if no permissions are found, implying 'ALLOW'
          SELECT 1 AS Result;
          RETURN;
      END
      ELSE IF @Permission = 'ALL'
BEGIN

    -- employee master se GEOOFFENCELOC lo
    SELECT @GeoFenceLoc = GEOOFFENCELOC
    FROM EMPLOYEEMASTER
    WHERE EMPCODE = @EmployeeCode AND Export_Type < 3

    -- agar GEOOFFENCELOC NULL nahi hai
    IF ISNULL(@GeoFenceLoc,'') <> ''
    BEGIN
        SELECT @GeoLocationStrings = STUFF((
            SELECT '|' + CAST(Spl_Rem AS NVARCHAR(MAX))
            FROM Misc_Mst
            WHERE Misc_Type = 85 
            AND Export_Type < 3
            AND Misc_Code IN (SELECT Item FROM dbo.SplitString(@GeoFenceLoc, ','))
            FOR XML PATH('')), 1, 1, '')
    END
    ELSE
    BEGIN
        -- old logic (assigned location)
        SELECT @GeoLocationStrings = STUFF((
            SELECT '@' + CAST(Spl_Rem AS NVARCHAR(MAX))
            FROM Misc_Mst
            WHERE Misc_Code IN (
                SELECT Location
                FROM EMPLOYEEMASTER
                WHERE EMPCODE = @EmployeeCode AND Export_Type < 3
            )
            AND Misc_Type = 85 AND Export_Type < 3
            FOR XML PATH('')), 1, 1, '')
    END

END
      ELSE IF @Permission = 'USER'
      BEGIN
          -- Fetch geofences only for user's assigned locations
          SELECT @GeoLocationStrings = STUFF((
              SELECT '@' + CAST(Spl_Rem AS NVARCHAR(MAX))
              FROM Misc_Mst
              WHERE Misc_Code IN (
                  SELECT Location
                  FROM EMPLOYEEMASTER
                  WHERE EMPCODE = @EmployeeCode AND Export_Type < 3
              )
              AND Misc_Type = 85 AND Export_Type < 3
              FOR XML PATH('')), 1, 1, '')
      END
  
      IF @GeoLocationStrings IS NULL
      BEGIN
          SELECT 'Geo location is not set for the specified locations' AS Result;
          RETURN;
      END
     
      -- Loop through each geofence using the custom split function
      DECLARE @GeoString NVARCHAR(300);
      DECLARE GeoCursor CURSOR FOR
      SELECT Item FROM dbo.SplitString(@GeoLocationStrings, '|');
  
      OPEN GeoCursor;
      FETCH NEXT FROM GeoCursor INTO @GeoString;
  
      WHILE @@FETCH_STATUS = 0
      BEGIN
          -- Create a temporary table to hold the coordinates
          CREATE TABLE #TempCoords (Coord NVARCHAR(100));
         
          -- Split the coordinate string using the custom function
          INSERT INTO #TempCoords
          SELECT Item FROM dbo.SplitString(@GeoString, '@');
         
          -- Build the polygon string (FIXED THIS SECTION)
          SELECT @Geofence_concat = 'POLYGON((' + STUFF((
              SELECT ',' +
                  CONVERT(NVARCHAR(MAX), CAST(SUBSTRING(Coord, 1, CHARINDEX(',', Coord) - 1) AS DECIMAL(30, 6))) + ' ' +
                  CONVERT(NVARCHAR(MAX), CAST(SUBSTRING(Coord, CHARINDEX(',', Coord) + 1, LEN(Coord)) AS DECIMAL(30, 6)))
              FROM #TempCoords
              FOR XML PATH('')), 1, 1, '') + '))';
         
          DROP TABLE #TempCoords;
         
          -- Create geometry with buffer
          SET @Geofence = GEOMETRY::STGeomFromText(@Geofence_concat, 4326).STBuffer(@BufferDegrees);
  
          -- Check if the point is within the buffered geofence
          IF @Geofence.STContains(GEOMETRY::STPointFromText('POINT(' + @Latitude + ' ' + @Longitude + ')', 4326)) = 1
          BEGIN
              SET @LocationFound = 1;
              BREAK;
          END;
  
          FETCH NEXT FROM GeoCursor INTO @GeoString;
      END;
  
      CLOSE GeoCursor;
      DEALLOCATE GeoCursor;
  
      -- Return the result
      IF @LocationFound = 1
          SELECT '1' AS Result;
      ELSE
          SELECT '0' AS Result;
  END`
    ],
  },
  {
    comments: "EMP_DEVATION",
    ID: 1522,
    queries: [`CREATE TABLE [dbo].[EMP_DEVATION](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [EMPCODE] [nvarchar](100) NULL,
      [SAL_MNTH] INT NULL,
      [SAL_YR] INT NULL,
        [DEV_DAYS] [nvarchar](20) NULL,
        [APPR_1_DEV_DAYS] [varchar](10) NULL,   
        [APPR_2_DEV_DAYS] [varchar](10) NULL,   
        [APPR_3_DEV_DAYS] [varchar](10) NULL,   
        [APPR_DEV_DAYS] [varchar](10) NULL,     
        [APPR_1_CODE] [varchar](100) NULL,
        [APPR_1_STAT] [tinyint] NULL,
        [APPR_1_REM] [varchar](300) NULL,
      [APPR_1_DATE] [datetime] NULL,
      [APPR_2_CODE] [varchar](100) NULL,
      [APPR_2_STAT] [tinyint] NULL,
      [APPR_2_REM] [varchar](300) NULL,
      [APPR_2_DATE] [datetime] NULL,
        [APPR_3_CODE] [varchar](100) NULL,
      [APPR_3_STAT] [tinyint] NULL,
      [APPR_3_REM] [varchar](300) NULL,
      [APPR_3_DATE] [datetime] NULL,
      [FIN_APPR] [tinyint] NULL,
      [Created By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL,
        [LASTMODI_BY] [nvarchar](20) NULL,
      [LASTMODI_ON] [smalldatetime] NULL,
        [EXPORT_TYPE] [int] NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED
(
      [UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[EMP_DEVATION_Hst])
)

ALTER TABLE [dbo].[EMP_DEVATION] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[EMP_DEVATION] ADD  DEFAULT (getdate()) FOR [ValidFrom]`
    ],
  },
  {
    comments: "Asset_QR_Audit",
    ID: 1523,
    queries: [`CREATE TABLE [dbo].[Asset_QR_Audit](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Empcode] [varchar](100) NULL,
	[Audit_Date] DATETIME NULL DEFAULT GETDATE(),
	[Asset_Id] [int] NULL,
	[Asset_Name] [varchar](255) NULL,
	[AssetCode] [varchar](200) NULL,
	[Category] [int] NULL,
	[SubCategory] [int] NULL,
	[Location] [int] NULL,
	[Export_Type] [int] NULL,
	[Device_Id] [varchar](255) NULL,
	[Created_At] [datetime] NULL,
	[Created_by] [varchar](100) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Asset_QR_Audit_Hst])
)
ALTER TABLE [dbo].[Asset_QR_Audit] ADD  DEFAULT (getdate()) FOR [Created_At]`,
      `EXEC sp_rename 'EMP_DEVATION.[Created By]', 'Created_By', 'COLUMN';`,
      `CREATE TABLE [dbo].[vendor_message](
      [id] [int] IDENTITY(1,1) NOT NULL,
      [vendor_name] [varchar](200) NULL,
      [mobile] [varchar](20) NULL,
      [email] [varchar](200) NULL,
      [token] [varchar](200) NULL,
      [status] [varchar](50) NULL,
      [created_by] [varchar](50) NULL,
      [created_date] [datetime] NULL,
      [contact_person] [varchar](200) NULL,
      [vendor_type] [varchar](100) NULL,
      [remarks] [varchar](500) NULL,
      [Ledger_NAME] [nvarchar](200) NULL,
      [AbbrName] [nvarchar](100) NULL,
      [LedgerGroup] [int] NULL,
      [Branch] [int] NULL,
      [PrintName] [nvarchar](200) NULL,
      [LedgerState] [int] NULL,
      [Pan] [nvarchar](20) NULL,
      [RegistrationType] [int] NULL,
      [LedgerGstin] [nvarchar](50) NULL,
      [partyType] [int] NULL,
      [EMAIL_ID] [nvarchar](200) NULL,
      [Pincode] [nvarchar](20) NULL,
      [MobileNo] [nvarchar](20) NULL,
      [ADDRESS1] [nvarchar](300) NULL,
      [ADDRESS2] [nvarchar](300) NULL,
      [MSME] [int] NULL,
      [ECC_No] [nvarchar](100) NULL,
      [DOC_PATH] [nvarchar](500) NULL,
      [Export_Type] [int] NULL,
      [APPR_1_CODE] [varchar](100) NULL,
      [APPR_1_STAT] [int] NULL,
      [APPR_1_REM] [nvarchar](500) NULL,
      [APPR_1_DATE] [datetime] NULL,
      [APPR_2_CODE] [varchar](100) NULL,
      [APPR_2_STAT] [int] NULL,
      [APPR_2_REM] [nvarchar](500) NULL,
      [APPR_2_DATE] [datetime] NULL,
      [APPR_3_CODE] [varchar](100) NULL,
      [APPR_3_STAT] [int] NULL,
      [APPR_3_REM] [nvarchar](500) NULL,
      [APPR_3_DATE] [datetime] NULL,
      [FIN_APPR] [int] NULL,
      [Ledg_Code] [int] NULL,
      [Loc_Code] [int] NULL,
PRIMARY KEY CLUSTERED
(
      [id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]


ALTER TABLE [dbo].[vendor_message] ADD  DEFAULT (getdate()) FOR [created_date]
ALTER TABLE [dbo].[vendor_message] ADD  DEFAULT ((1)) FOR [Export_Type]`,
    ],
  },
  {
    comments: "Asset_QR_Audit",
    ID: 1524,
    queries: [`ALTER TABLE Asset_QR_Audit ADD Audit_Address VARCHAR(MAX) NULL`,
      `ALTER table comp_keydata ADD REQ_ASSET_ADDRESS INT`,
      `ALTER table comp_keydata ADD REQ_ASSET_IMG INT`
    ],
  },
  {
    comments: "USER_TBL",
    ID: 1525,
    queries: [` ALTER TABLE USER_TBL ADD [Mod_User] VARCHAR(50)`,
      `ALTER TABLE USER_TBL ADD [Mod_Date] [datetime] NULL`,
      `update Misc_Mst set Misc_HOD = 4 where Misc_Type = 92 and Misc_Code = 10`,
      `update Misc_Mst set Misc_HOD = 5 where Misc_Type = 92 and Misc_Code = 120`,
      `update Misc_Mst set Misc_HOD = 6 where Misc_Type = 92 and Misc_Code = 121`,
      `update Misc_Mst set Misc_HOD = 9 where Misc_Type = 92 and Misc_Code = 104`
    ],
  },
  {
    comments: "CheckMandatoryFields",
    ID: 1526,
    queries: [`ALTER PROCEDURE [dbo].[CheckMandatoryFields]  
                        @empCode VARCHAR(50)  
                    AS  
                    BEGIN  
                    DECLARE @sql NVARCHAR(MAX) = '';
                    SELECT @sql = @sql + 
                      'SELECT IIF(' + Table_ColumnName + ' IS NULL OR ' + Table_ColumnName + ' = '''', 1, 0) AS result, ' + 
                      CAST(Utd AS NVARCHAR) + ' AS Utd, ''' + Field_Name + ''' AS Field_Name, ''' + Label_Id + ''' AS Label_Id, ''' + Field_Id + ''' AS Field_Id, ''' + Table_ColumnName + ''' AS Table_ColumnName, ' + 
                      CAST(Is_Mandatory AS NVARCHAR) + ' AS Is_Mandatory FROM employeemaster WHERE empcode  collate database_default = ''' + @empCode + ''' collate database_default UNION ALL ' 
                    FROM Mandatory_Fields
                    WHERE Is_Image = 0 AND Is_Mandatory = 1;
                    
                    select @sql = @sql + 
                      'SELECT IIF((
                      select DOC_PATH from EMP_DOCS where EMP_CODE collate database_default = empcode collate database_default and columndoc_type = ''EMPLOYEE'' and Seq_No = ' + Table_ColumnName + ' 
                    ) IS NULL OR (
                      select DOC_PATH from EMP_DOCS where EMP_CODE collate database_default = empcode collate database_default and columndoc_type = ''EMPLOYEE'' and Seq_No = ' + Table_ColumnName + ' 
                    ) = '''', 1, 0) AS result, ' + 
                      CAST(Utd AS NVARCHAR) + ' AS Utd, ''' + Field_Name + ''' AS Field_Name, ''' + Label_Id + ''' AS Label_Id, ''' + Field_Id + ''' AS Field_Id, ''' + Table_ColumnName + ''' AS Table_ColumnName, ' + 
                      CAST(Is_Mandatory AS NVARCHAR) + ' AS Is_Mandatory FROM employeemaster WHERE empcode collate database_default = ''' + @empCode + ''' collate database_default UNION ALL ' 
                    FROM Mandatory_Fields
                    WHERE Is_Image = 1 AND Is_Mandatory = 1;
                    
                    IF LEN(@sql) >= LEN(' UNION ALL ')
                    SET @sql = LEFT(@sql, LEN(@sql) - LEN(' UNION ALL '));
                IF LEN(@sql) >= LEN(' UNION ALL ')
                set @sql = 'select * from ('+ @sql +') as dg where result = 1 and Is_Mandatory = 1';
                ELSE set @sql = 'select top 0  1 as result,	Utd	,Field_Name	,Label_Id	,Field_Id	,Table_ColumnName	,Is_Mandatory from Mandatory_Fields'	
                print @sql;
                EXEC sp_executesql @sql;
                  END;`
    ],
  },
  {
    comments: "USER_TBL",
    ID: 1527,
    queries: [
      `alter table comp_keydata alter column comp_logo NVARCHAR (200)`
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1528,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD DEFAULT_ASSET_CATEGORY_IMAGE VARCHAR(500) NULL`,
      `ALTER TABLE COMP_KEYDATA ADD DEFAULT_ASSET_SUBCATEGORY_IMAGE VARCHAR(500) NULL`,
      `ALTER TABLE COMP_KEYDATA ADD DEFAULT_ASSET_IMAGE VARCHAR(500) NULL`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1529,
    queries: [
      `alter table product_history add [TransferTo] [varchar](20) NULL`,
      `alter table product_history add [Tran_Date] [datetime2](7) NULL`,
      `alter table product_history  add [common] varchar(10) NULL`,
    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1530,
    queries: [
      `ALTER TABLE SHORTLISTED_CANDIDATE ADD SUB_SOURCE VARCHAR(200) NULL`,
      `ALTER TABLE SHORTLISTED_CANDIDATE ADD SOURCE_OF_REG [int] NULL`,

    ],
  },
  {
    comments: "EMPLOYEEMASTER",
    ID: 1531,
    queries: [
      `ALTER TABLE EMPLOYEEMASTER ADD CONTRACT_NUMBER VARCHAR(25) NULL`,
      `ALTER TABLE EMPLOYEEMASTER_hst ADD CONTRACT_NUMBER VARCHAR(25) NULL`,

    ],
  },
  {
    comments: "expense",
    ID: 1532,
    queries: [
      `ALTER TABLE Department_Branch_Approval_Matrix ADD 
    APPROVER1_MINLIMIT DECIMAL(18,2) NULL,
    APPROVER1_MAXLIMIT DECIMAL(18,2) NULL,
    APPROVER2_MINLIMIT DECIMAL(18,2) NULL,
    APPROVER2_MAXLIMIT DECIMAL(18,2) NULL,
    APPROVER3_MINLIMIT DECIMAL(18,2) NULL,
    APPROVER3_MAXLIMIT DECIMAL(18,2) NULL;`,
    ],
  }, {
    comments: "comp_keydata",
    ID: 1533,
    queries: [
      `ALTER TABLE comp_keydata ADD expense_templates INT NULL;`,
      `ALTER TABLE Expense_Template ADD DropdownOptions VARCHAR(500) NULL;`,
      `ALTER TABLE Expense_Mng_DTL ADD 
                          F_11 VARCHAR(150) NULL,
                          F_12 VARCHAR(150) NULL,
                          F_13 VARCHAR(150) NULL,
                          F_14 VARCHAR(150) NULL,
                          F_15 VARCHAR(150) NULL,
                          F_16 VARCHAR(150) NULL,
                          F_17 VARCHAR(150) NULL,
                          F_18 VARCHAR(150) NULL,
                          F_19 VARCHAR(150) NULL,
                          F_20 VARCHAR(150) NULL;`,

    ],
  },
  {
    comments: "RTL_COST_MST",
    ID: 1533,
    queries: [
      `ALTER TABLE RTL_COST_MST ADD ERP_DSE VARCHAR(200) NULL`,
      `ALTER TABLE RTL_COST_MST ADD ERP_TL VARCHAR(200) NULL`,
    ],
  },
  {
    comments: "RTL_COST_MST",
    ID: 1534,
    queries: [
      `alter TABLE COMP_OFF_DTL add CO_AVAILED_LOG NVARCHAR(200)`,
      `ALTER table comp_keydata ADD HRMS_AUTO_REJ_DAYS INT`,
      `ALTER TABLE EMPLOYEEMASTER ADD [RESIGNED_STATUS] [nvarchar](200) NULL`,
      `ALTER TABLE EMPLOYEEMASTER_hst ADD [RESIGNED_STATUS] [nvarchar](200) NULL`,

      `ALTER TABLE EMPLOYEEMASTER ADD [SEPRATION_CATE] [nvarchar](200) NULL`,
      `ALTER TABLE EMPLOYEEMASTER_hst ADD [SEPRATION_CATE] [nvarchar](200) NULL`,

      `ALTER TABLE EMPLOYEEMASTER ALTER COLUMN NOTICEPERIOD NVARCHAR(200)`,
      `ALTER TABLE EMPLOYEEMASTER_hst ALTER COLUMN NOTICEPERIOD NVARCHAR(200)`,


      `ALTER TABLE EMPLOYEEMASTER ALTER COLUMN ExitInterview_Done NVARCHAR(200)`,
      `ALTER TABLE EMPLOYEEMASTER_hst ALTER COLUMN ExitInterview_Done NVARCHAR(200)`,


      `ALTER TABLE EMPLOYEEMASTER ALTER COLUMN SEPARATION_MODE NVARCHAR(200)`,
      `ALTER TABLE EMPLOYEEMASTER_hst ALTER COLUMN SEPARATION_MODE NVARCHAR(200)`,
      `ALTER TABLE Expense_Budget ADD Location VARCHAR(255) NULL`,
      `ALTER TABLE Expense_Budget ADD Export_type VARCHAR(255) NULL`,
      `ALTER TABLE Expense_Budget ADD UpdatedBy VARCHAR(200) NULL`,
      `ALTER TABLE Expense_Budget ADD UpdatedAt DATETIME NULL`,
    ],
  },
  {
    comments: "RTL_COST_MST",
    ID: 1535,
    queries: [
      `ALTER TABLE RTL_COST_MST ADD GATEPASS_SEQNO VARCHAR(50) NULL`,
      `ALTER TABLE RTL_COST_MST ADD GATEPASS_DATE DATETIME NULL`,
      `INSERT INTO Mobile_Rights (Emp_Code, Optn_Name, Module_Code, USER_CODE)
SELECT 
    m1.Emp_Code,
    '1.2.3',
    m1.Module_Code,
    '1'
FROM Mobile_Rights m1
WHERE 
    m1.Optn_Name = '1.2.1'
    AND m1.Module_Code = 10
    AND NOT EXISTS (
        SELECT 1 
        FROM Mobile_Rights m2
        WHERE m2.Emp_Code = m1.Emp_Code
          AND m2.Optn_Name = '1.2.3'
          AND m2.Module_Code = m1.Module_Code
    );`,
      `INSERT INTO Mobile_Rights (Emp_Code, Optn_Name, Module_Code, USER_CODE)
SELECT 
    m1.Emp_Code,
    '1.3.3',
    m1.Module_Code,
    '1'
FROM Mobile_Rights m1
WHERE 
    m1.Optn_Name = '1.3.1'
    AND m1.Module_Code = 10
    AND NOT EXISTS (
        SELECT 1 
        FROM Mobile_Rights m2
        WHERE m2.Emp_Code = m1.Emp_Code
          AND m2.Optn_Name = '1.3.3'
          AND m2.Module_Code = m1.Module_Code
    );`,
      `alter TABLE comp_keydata add mand_SL_Img INT`,
      `INSERT INTO misc_mst (misc_type, misc_code, misc_name, export_type, serverid, loc_code)
      VALUES
      (666, 1, 'ONE MONTH',  1, 1, 1),
      (666, 2, 'PARTIAL GIVEN', 1, 1, 1),
      (666, 3, 'NOT GIVEN', 1, 1, 1),
      (666, 4, 'NOT REQUIRED', 1, 1, 1)`,
      `INSERT INTO misc_mst (misc_type, misc_code, misc_name, export_type, serverid, loc_code)
      VALUES
      (667, 1, 'RESIGNED',  1, 1, 1),
      (667, 2, 'TERMINATED', 1, 1, 1),
      (667, 3, 'ABSCOND', 1, 1, 1),
      (667, 4, 'INTIMATED LEFT', 1, 1, 1)`,
      `INSERT INTO misc_mst (misc_type, misc_code, misc_name, export_type, serverid, loc_code)
      VALUES
      (668, 1, 'ON CALL',  1, 1, 1),
      (668, 2, 'FACE TO FACE', 1, 1, 1),
      (668, 3, 'NOT ATTENDED', 1, 1, 1),
      (668, 4, 'ONLINE FEEDBACK FORM', 1, 1, 1)`,
      `INSERT INTO misc_mst (misc_type, misc_code, misc_name, export_type, serverid, loc_code)
      VALUES
      (669, 1, 'INTIMATED LEFT',  1, 1, 1),
      (669, 2, 'ABSCOND', 1, 1, 1),
      (669, 3, 'TERMINATED', 1, 1, 1),
      (669, 4, 'JOIN & LEFT', 1, 1, 1) ,
      (669, 5, 'RESIGNED', 1, 1, 1) ,
      (669, 6, 'DEATH', 1, 1, 1) ,
      (669, 7, 'TRANSFER', 1, 1, 1)`,
      `INSERT INTO misc_mst (misc_type, misc_code, misc_name, export_type, serverid, loc_code)
      VALUES
      (670, 1, 'PERSONAL ISSUE',  1, 1, 1),
      (670, 2, 'MANPOWER HANDLING', 1, 1, 1),
      (670, 3, 'PERFORMANCE ISSUE', 1, 1, 1),
      (670, 4, 'BETTER OPPORTUNITY', 1, 1, 1),
      (670, 5, 'Termination TERMINATION', 1, 1, 1),
      (670, 6, 'OPERATIONAL ISSUE',  1, 1, 1),
      (670, 7, 'PROFILE ISSUE', 1, 1, 1),
      (670, 8, 'WRONG ASSESEMENT', 1, 1, 1),
      (670, 9, 'WORK PRESSURE', 1, 1, 1),
      (670, 10, 'HEALTH ISSUE', 1, 1, 1),
      (670, 11, 'TRANSFER',  1, 1, 1),
      (670, 12, 'FURTHER STUDIES', 1, 1, 1),
      (670, 13, 'DISSATISFACTION WITH SUPERVISOR', 1, 1, 1),
      (670, 14, 'WILL REJOIN', 1, 1, 1),
      (670, 15, 'OTHER MENTION IN REMARK SECTION', 1, 1, 1),
      (670, 16, 'LEFT WITHOUT INTIMATION',  1, 1, 1),
      (670, 17, 'SALARY HIKE AT OTHER COMPANY ', 1, 1, 1),
      (670, 18, 'MATERNITY', 1, 1, 1)`

    ],
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1536,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD IS_PARTIAL_POSTING INT NULL`,
      `ALTER TABLE RTL_COST_MST ADD DMS_DSE VARCHAR(200) NULL`,
      `ALTER TABLE RTL_COST_MST ADD DMS_TL VARCHAR(200) NULL`
    ],
  },
  {
    comments: "RTL_COST_MST",
    ID: 1537,
    queries: [
      `ALTER TABLE RTL_COST_MST ADD BOOKING_SOURCE VARCHAR(200) NULL`,
      ` ALTER TABLE RTL_COST_MST ADD CARTAL_DISCOUNT [money] NULL`
    ],
  },
  {
    comments: "RTL_COST_MST",
    ID: 1537,
    queries: [
      `ALTER TABLE RTL_COST_MST ADD BOOKING_SOURCE VARCHAR(200) NULL`,
      ` ALTER TABLE RTL_COST_MST ADD CARTAL_DISCOUNT [money] NULL`
    ],
  },
  {
    comments: "RTL_COST_MST",
    ID: 1538,
    queries: [
      `ALTER TABLE Expense_Mng ADD PAYMENT_COMPLETED INT NULL ;`,
      `ALTER TABLE Expense_Mng ADD PAYMENT_COMPLETED_BY VARCHAR(100) NULL;`,
      `ALTER TABLE Expense_Mng ADD PAYMENT_COMPLETED_ON DATETIME NULL`
    ],
  },
  {
    comments: "HYUNDAI_PRICE_LIST",
    ID: 1539,
    queries: [
      `ALTER TABLE HYUNDAI_PRICE_LIST ADD [With_Effective_To] [datetime] NULL`,
      `ALTER TABLE COMP_KEYDATA ADD IS_PRICE_LIST_EFFECTIVE INT NULL`,
      `ALTER TABLE RTL_COST_MST ADD DELV_CUST_ID VARCHAR(50) NULL`,
      `alter TABLE comp_keydata add Mand_send_ver_message INT , disc_open INT`,
      `alter TABLE Mandatory_Fields add Table_Name NVARCHAR(20)`,
      `UPDATE Mandatory_Fields set Table_Name = 'EMPLOYEEMASTER' where utd BETWEEN 1 and 57`,
      `ALTER PROCEDURE [dbo].[CheckMandatoryFields]  
    @empCode VARCHAR(50)  
AS  
BEGIN  
    DECLARE @sql NVARCHAR(MAX) = '';

    ---------------------------------------------------
    -- NON IMAGE FIELDS
    ---------------------------------------------------
    SELECT @sql = @sql + 
      'SELECT 
        IIF(' + 
            CASE 
                WHEN Table_ColumnName LIKE '%_ver' 
                    THEN 'ISNULL(CAST(' + Table_ColumnName + ' AS INT),0) = 0'
                ELSE '(' + Table_ColumnName + ' IS NULL OR ' + Table_ColumnName + ' = '''')'
            END +
      ', 1, 0) AS result, ' + 

      CAST(Utd AS NVARCHAR) + ' AS Utd, ''' + Field_Name + ''' AS Field_Name, ''' + Label_Id + ''' AS Label_Id, ''' + Field_Id + ''' AS Field_Id, ''' + Table_ColumnName + ''' AS Table_ColumnName, ' + 
      CAST(Is_Mandatory AS NVARCHAR) + ' AS Is_Mandatory 

      FROM ' + Table_Name + ' 

      WHERE ' + 
      CASE 
          WHEN Table_Name = 'EMPLOYEEMASTER' THEN 'empcode'
          ELSE 'EMPCODE'
      END + ' COLLATE DATABASE_DEFAULT = ''' + @empCode + ''' COLLATE DATABASE_DEFAULT 

      UNION ALL '

    FROM Mandatory_Fields
    WHERE Is_Image = 0 AND Is_Mandatory = 1;


    ---------------------------------------------------
    -- IMAGE FIELDS
    ---------------------------------------------------
    SELECT @sql = @sql + 
      'SELECT 
        IIF((
            SELECT DOC_PATH 
            FROM EMP_DOCS 
            WHERE EMP_CODE COLLATE DATABASE_DEFAULT = ' + 
                CASE 
                    WHEN Table_Name = 'EMPLOYEEMASTER' THEN 'empcode'
                    ELSE 'EMPCODE'
                END + ' COLLATE DATABASE_DEFAULT 
            AND columndoc_type = ''EMPLOYEE'' 
            AND Seq_No = ' + Table_ColumnName + '
        ) IS NULL OR (
            SELECT DOC_PATH 
            FROM EMP_DOCS 
            WHERE EMP_CODE COLLATE DATABASE_DEFAULT = ' + 
                CASE 
                    WHEN Table_Name = 'EMPLOYEEMASTER' THEN 'empcode'
                    ELSE 'EMPCODE'
                END + ' COLLATE DATABASE_DEFAULT 
            AND columndoc_type = ''EMPLOYEE'' 
            AND Seq_No = ' + Table_ColumnName + '
        ) = '''', 1, 0) AS result, ' + 

      CAST(Utd AS NVARCHAR) + ' AS Utd, ''' + Field_Name + ''' AS Field_Name, ''' + Label_Id + ''' AS Label_Id, ''' + Field_Id + ''' AS Field_Id, ''' + Table_ColumnName + ''' AS Table_ColumnName, ' + 
      CAST(Is_Mandatory AS NVARCHAR) + ' AS Is_Mandatory 

      FROM ' + Table_Name + ' 

      WHERE ' + 
      CASE 
          WHEN Table_Name = 'EMPLOYEEMASTER' THEN 'empcode'
          ELSE 'EMPCODE'
      END + ' COLLATE DATABASE_DEFAULT = ''' + @empCode + ''' COLLATE DATABASE_DEFAULT 

      UNION ALL '

    FROM Mandatory_Fields
    WHERE Is_Image = 1 AND Is_Mandatory = 1;


    ---------------------------------------------------
    -- REMOVE LAST UNION
    ---------------------------------------------------
    IF LEN(@sql) >= LEN(' UNION ALL ')
        SET @sql = LEFT(@sql, LEN(@sql) - LEN(' UNION ALL '));


    ---------------------------------------------------
    -- FINAL EXECUTION
    ---------------------------------------------------
    IF LEN(@sql) > 0
        SET @sql = 'SELECT * FROM (' + @sql + ') AS dg WHERE result = 1 AND Is_Mandatory = 1';
    ELSE
        SET @sql = 'SELECT TOP 0 1 AS result, Utd, Field_Name, Label_Id, Field_Id, Table_ColumnName, Is_Mandatory FROM Mandatory_Fields';

    PRINT @sql;
    EXEC sp_executesql @sql;

END`,
      `CREATE TABLE [dbo].[EMP_LETTER_CONFIRMATION](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [EMPCODE] [nvarchar](100) NULL,
      [TEMPLATE_NAME] [NVARCHAR](100) NULL,
      [pdf_path] [NVARCHAR](300) NULL, 
      [APPROVAL_LINK] [NVARCHAR] (300) NULL,   
      [STATUS] INT NULL,
      [Created_By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL,
      [EXPORT_TYPE] [int] NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED
(
      [UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[EMP_LETTER_CONFIRMATION_Hst])
)

ALTER TABLE [dbo].[EMP_LETTER_CONFIRMATION] ADD  DEFAULT (getdate()) FOR [Created_At]
ALTER TABLE [dbo].[EMP_LETTER_CONFIRMATION] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
      `ALTER TABLE DOC_UPLOAD ALTER COLUMN path NVARCHAR(300) NULL`,
      `ALTER TABLE DOC_UPLOAD ALTER COLUMN File_Name NVARCHAR(300) NULL`
    ],
  },
  {
    comments: "RTL_COST_MST",
    ID: 1540,
    queries: [
      `ALTER TABLE RTL_MST ALTER COLUMN USR_CODE INT`,
      `ALTER TABLE RTL_MST ALTER COLUMN mod_user INT`,
      `alter TABLE cost_offers_unfreeze_history add Cost_Modl_Grp_current NVARCHAR(100),Cost_Modl_Grp_new NVARCHAR(100),Cost_Modl_Var_current NVARCHAR(100),Cost_Modl_Var_new NVARCHAR(100)`,
      `ALTER TABLE rtl_cost_mst ALTER COLUMN [DE_ALOT_DMS_CODE] [varchar](100) NULL`,
      `
ALTER PROCEDURE [dbo].[CheckMandatoryFields]  
    @empCode VARCHAR(50)  
AS  
BEGIN  
    DECLARE @sql NVARCHAR(MAX) = '';

    ---------------------------------------------------
    -- NON IMAGE FIELDS
    ---------------------------------------------------
    SELECT @sql = @sql + 
      'SELECT 
        IIF(' + 
            CASE 
                -- For verification fields (pan_card_ver, aadhaar_card_ver etc.) - they store 'true'/'false' strings
                WHEN Table_ColumnName IN ('pan_card_ver', 'aadhaar_card_ver', 'pan_name_match_ver', 'aadhaar_linked_ver') 
                    THEN '(ISNULL(' + Table_ColumnName + ', ''false'') = ''false'' OR ' + Table_ColumnName + ' = ''0'' OR ' + Table_ColumnName + ' = ''false'')'
                WHEN Table_ColumnName LIKE '%_ver' 
                    THEN 'ISNULL(TRY_CAST(' + Table_ColumnName + ' AS INT),0) = 0'
                ELSE '(' + Table_ColumnName + ' IS NULL OR ' + Table_ColumnName + ' = '''')'
            END +
      ', 1, 0) AS result, ' + 

      CAST(Utd AS NVARCHAR) + ' AS Utd, ''' + Field_Name + ''' AS Field_Name, ''' + Label_Id + ''' AS Label_Id, ''' + Field_Id + ''' AS Field_Id, ''' + Table_ColumnName + ''' AS Table_ColumnName, ' + 
      CAST(Is_Mandatory AS NVARCHAR) + ' AS Is_Mandatory 

      FROM ' + Table_Name + ' 

      WHERE ' + 
      CASE 
          WHEN Table_Name = 'EMPLOYEEMASTER' THEN 'empcode'
          ELSE 'EMPCODE'
      END + ' COLLATE DATABASE_DEFAULT = ''' + @empCode + ''' COLLATE DATABASE_DEFAULT 

      UNION ALL '

    FROM Mandatory_Fields
    WHERE Is_Image = 0 AND Is_Mandatory = 1;


    ---------------------------------------------------
    -- IMAGE FIELDS
    ---------------------------------------------------
    SELECT @sql = @sql + 
      'SELECT 
        IIF((
            SELECT DOC_PATH 
            FROM EMP_DOCS 
            WHERE EMP_CODE COLLATE DATABASE_DEFAULT = ' + 
                CASE 
                    WHEN Table_Name = 'EMPLOYEEMASTER' THEN 'empcode'
                    ELSE 'EMPCODE'
                END + ' COLLATE DATABASE_DEFAULT 
            AND columndoc_type = ''EMPLOYEE'' 
            AND Seq_No = ' + Table_ColumnName + '
        ) IS NULL OR (
            SELECT DOC_PATH 
            FROM EMP_DOCS 
            WHERE EMP_CODE COLLATE DATABASE_DEFAULT = ' + 
                CASE 
                    WHEN Table_Name = 'EMPLOYEEMASTER' THEN 'empcode'
                    ELSE 'EMPCODE'
                END + ' COLLATE DATABASE_DEFAULT 
            AND columndoc_type = ''EMPLOYEE'' 
            AND Seq_No = ' + Table_ColumnName + '
        ) = '''', 1, 0) AS result, ' + 

      CAST(Utd AS NVARCHAR) + ' AS Utd, ''' + Field_Name + ''' AS Field_Name, ''' + Label_Id + ''' AS Label_Id, ''' + Field_Id + ''' AS Field_Id, ''' + Table_ColumnName + ''' AS Table_ColumnName, ' + 
      CAST(Is_Mandatory AS NVARCHAR) + ' AS Is_Mandatory 

      FROM ' + Table_Name + ' 

      WHERE ' + 
      CASE 
          WHEN Table_Name = 'EMPLOYEEMASTER' THEN 'empcode'
          ELSE 'EMPCODE'
      END + ' COLLATE DATABASE_DEFAULT = ''' + @empCode + ''' COLLATE DATABASE_DEFAULT 

      UNION ALL '

    FROM Mandatory_Fields
    WHERE Is_Image = 1 AND Is_Mandatory = 1;


    ---------------------------------------------------
    -- REMOVE LAST UNION
    ---------------------------------------------------
    IF LEN(@sql) >= LEN(' UNION ALL ')
        SET @sql = LEFT(@sql, LEN(@sql) - LEN(' UNION ALL '));


    ---------------------------------------------------
    -- FINAL EXECUTION
    ---------------------------------------------------
    IF LEN(@sql) > 0
        SET @sql = 'SELECT * FROM (' + @sql + ') AS dg WHERE result = 1 AND Is_Mandatory = 1';
    ELSE
        SET @sql = 'SELECT TOP 0 1 AS result, Utd, Field_Name, Label_Id, Field_Id, Table_ColumnName, Is_Mandatory FROM Mandatory_Fields';

    PRINT @sql;
    EXEC sp_executesql @sql;

END`
    ],
  },
  {
    comments: "tv_icm_mst",
    ID: 1541,
    queries: [
      `alter table tv_icm_mst add New_Car_Ledg_Code INT NULL`,
      `INSERT INTO Mandatory_Fields 
(Form_Name, Field_Name, Label_Id, Field_Id, Table_ColumnName, Is_Mandatory, created_by,created_at,  Is_Image, Table_Name)
VALUES
('ProfileUpdateMobile', 'PAN Verify', 'input_layout_pan_verify', 'edtPanVerify', 'pan_card_ver', 0, NULL, GETDATE(), 0, 'emp_varify'),
('ProfileUpdateMobile', 'Aadhaar Verify', 'input_layout_aadhaar_verify', 'edtAadhaarVerify', 'aadhaar_card_ver', 0, NULL, GETDATE(), 0, 'emp_varify')`
    ],
  },
  {
    comments: "cost_offers_unfreeze_history",
    ID: 1542,
    queries: [
      `ALTER TABLE cost_offers_unfreeze_history add Created_User INT`,
      `ALTER TABLE ICM_EXT ADD PO_Follow VARCHAR(300) NULL`,
      `ALTER TABLE ICM_EXT ADD PO_Mob VARCHAR(20) NULL`,
      `ALTER TABLE ICM_EXT_DTL ADD Gross_Amt [money] NULL`
    ],
  },
  {
    comments: "icm_tracker",
    ID: 1543,
    queries: [
      `ALTER TABLE DocketMst ADD LOAN_TYPE VARCHAR(50) NULL;`,
      `ALTER TABLE DocketMst ADD MSSF VARCHAR(3) NULL;`,
      `ALTER TABLE DocketMst ADD MSSF_ID VARCHAR(100) NULL;`,
      `ALTER TABLE DocketMst ADD MGA_INVOICE_NO VARCHAR(50) NULL;`,
      `ALTER TABLE DocketMst ADD MGA_Invoice_Document VARCHAR(100) NULL;`
    ],
  },
  {
    comments: "USER_tBL",
    ID: 1544,
    queries: [
      `ALTER TABLE USER_tBL ALTER COLUMN [Multi_loc] [nvarchar](1100) NULL`
    ],
  },
  {
    comments: "USER_tBL",
    ID: 1545,
    queries: [
      `ALTER TABLE RTL_COST_MST ADD IS_MANUAL INT NULL`,
      `CREATE TABLE [dbo].[Appr_Rej_History](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
    [TRAN_TYPE] [INT],
	[EMPCODE] [Nvarchar](20) NOT NULL,
	[DATEOFFICE] [smalldatetime] NULL,
    [LINK_UTD] [NVARCHAR](100) NULL,
    [Mipunch_Reason] [NVARCHAR](40) NULL,
    [MI_Remark] [NVARCHAR] (300) NULL,
    [SPL_REMARK] [NVARCHAR] (500) NULL,
    [APPLIED_DATE] [datetime] NULL,
    [REMARK] [NVARCHAR] (500) NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Appr_Rej_History_Hst])
)

ALTER TABLE [dbo].[Appr_Rej_History] ADD  DEFAULT (getdate()) FOR [Created_At]

ALTER TABLE [dbo].[Appr_Rej_History] ADD  DEFAULT (getdate()) FOR [ValidFrom]`
    ],
  },
  {
    comments: "RTL_MST",
    ID: 1546,
    queries: [
      `ALTER TABLE RTL_MST ALTER COLUMN Spot_Desig1 NVARCHAR(255)`,
      `ALTER TABLE RTL_MST ALTER COLUMN Spot_Desig2 NVARCHAR(255)`,
      `ALTER TABLE RTL_MST ALTER COLUMN Spot_Desig3 NVARCHAR(255)`,
      `ALTER TABLE RTL_MST ALTER COLUMN Spot_Desig4 NVARCHAR(255)`,
      `ALTER TABLE RTL_MST ALTER COLUMN Spot_Desig5 NVARCHAR(255)`
    ],
  },
  {
    comments: "ItemsDtl",
    ID: 1547,
    queries: [
      `ALTER TABLE ItemsDtl ALTER COLUMN DISC_PERCT MONEY;`
    ]
  },
  {
    comments: "RTL_COST_MST",
    ID: 1549,
    queries: [
      `ALTER TABLE RTL_COST_MST ADD CANCEL_BY VARCHAR(100) NULL`,
      `ALTER TABLE Expense_Mng ADD Appr_1_Time DATETIME NULL`,
      `ALTER TABLE Expense_Mng ADD Appr_2_Time DATETIME NULL`,
      `ALTER TABLE Expense_Mng ADD Appr_3_Time DATETIME NULL`,
      `CREATE TABLE user_tutorial_views (                        
      id          INT           IDENTITY(1,1) PRIMARY KEY,
      user_id     VARCHAR(100)  NOT NULL,                                                                                                                                                                                                                    
      module_key  VARCHAR(100)  NOT NULL,
      viewed_at   DATETIME      NOT NULL DEFAULT GETDATE()                                                                                                                                                                                                                                                                                                                                                                                    
  );`
    ]
  },
  {
    comments: "RTL_COST_MST",
    ID: 1550,
    queries: [
      `ALTER TABLE RTL_COST_MST ADD USER_CODE INT NULL`,
      `ALTER TABLE CHAS_TRF ADD Phy_Location INT NULL`
    ]
  },
  {
    comments: "expense_mng_dtl",
    ID: 1551,
    queries: [
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_1  VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_2  VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_3  VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_4  VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_5  VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_6  VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_7  VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_8  VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_9  VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_10 VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_11 VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_12 VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_13 VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_14 VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_15 VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_16 VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_17 VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_18 VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_19 VARCHAR(300)`,
      `ALTER TABLE expense_mng_dtl ALTER COLUMN F_20 VARCHAR(300)`,
    ]
  },
  {
    comments: "dise_aprvl",
    ID: 1552,
    queries: [
      `ALTER TABLE dise_aprvl ADD LTCP VARCHAR(10) NULL`
    ]
  },
  {
    comments: "USER_TBL",
    ID: 1553,
    queries: [
      `ALTER TABLE USER_TBL ADD [TV_POSTING_LOC_DATE] [datetime] NULL`
    ]
  },
  {
    comments: "RTL_COST_MST",
    ID: 1554,
    queries: [
      `ALTER TABLE RTL_COST_MST ADD LOAN_AMOUNT [decimal](19, 2) NULL`,
      `ALTER TABLE RTL_COST_MST ADD LOAN_DISBURSEMENT_AMOUNT [decimal](19, 2) NULL`
    ]
  },
  {
    comments: "GODOWN_MST",
    ID: 1555,
    queries: [
      `ALTER TABLE GODOWN_MST ADD [SAW_LEDG_AC] [int] NULL;`,
      `ALTER TABLE Godown_Mst ADD SAW_BOOK_CODE INT`
    ]
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1556,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD expense_template_master INT`,
      `ALTER TABLE comp_keydata ADD [Show_Attn_Summary] INT NULL`
    ]
  },
   {
    comments: "COMP_KEYDATA",
    ID: 1557,
    queries: [
      `ALTER TABLE [GP_MST] ALTER COLUMN [Ledg_Name] [nvarchar](300) NULL`,
        `ALTER TABLE [GP_MST] ALTER COLUMN [Cust_Id] [nvarchar](50) NULL`,
        `ALTER TABLE [GP_MST] ALTER COLUMN [Job_No] [nvarchar](50) NULL`,
        `ALTER TABLE [GP_MST] ALTER COLUMN [GP_Reason] [nvarchar](400) NULL`,
        `ALTER TABLE [GP_MST] ALTER COLUMN [Acnt_Remark] [nvarchar](400) NULL`,
        `ALTER TABLE [GP_MST] ALTER COLUMN [Surveyor_Name] [nvarchar](150) NULL`,
        `ALTER TABLE [GP_MST] ALTER COLUMN [Insu_Name] [nvarchar](300) NULL`,
        `ALTER TABLE [GP_MST] ALTER COLUMN [Delay_Reason] [nvarchar](200) NULL`,
        `ALTER TABLE [GP_MST] ALTER COLUMN [Claim_No] [nvarchar](100) NULL`,
        `CREATE TABLE [dbo].[EMPLOYEE_BALANCE](
        	[EMPCODE] [nvarchar](50) NOT NULL,
        	[LOCATION] [int] NULL,
        	[OPENING_BALANCE] [int] NULL,
        	[EXPORT_TYPE] [int] NULL,
        	[CREATED_BY] [nvarchar](50) NULL,
        	[CREATED_DATE] [datetime] NULL
        ) ON [PRIMARY]
        `
    ]
  },
  {
    comments: "dise_aprvl",
    ID: 1558,
    queries: [
      `ALTER TABLE dise_aprvl ADD Invoice_Date DATETIME NULL`,
      `ALTER TABLE GP_DTL ADD EXPORT_TYPE INT NULL`,
      `ALTER TABLE COMP_KEYDATA ADD IS_BODYSHOP_GP_PRINT INT NULL`,
      `ALTER TABLE GP_MST ADD DO_Amt MONEY NULL`,
      `ALTER TABLE GP_MST ADD OS_Amt MONEY NULL`,
      `ALTER TABLE GP_MST ADD Rec_Amt_Ins_Led INT NULL`,
      `ALTER TABLE GP_MST ADD Rec_Amt_Cus_Led INT NULL`,
      `ALTER TABLE GP_MST ADD JV_Ledg_Code INT NULL`,
      `ALTER TABLE GP_MST ADD JV_Ledg_Name VARCHAR(300) NULL`,
      `ALTER TABLE GP_MST ADD JV_No VARCHAR(100) NULL`,
      `ALTER TABLE GP_MST ADD JV_Date DATE NULL`,
      `ALTER TABLE GP_MST ADD Created_By VARCHAR(100) NULL`,
      `ALTER TABLE GP_MST ADD Created_At DATETIME NULL`,
      `ALTER TABLE GP_MST ADD CONSTRAINT DF_GP_MST_Created_At DEFAULT(GETDATE()) FOR Created_At`,
      `ALTER TABLE GP_MST ADD Modified_By VARCHAR(100) NULL`,
      `ALTER TABLE GP_MST ADD Modified_At DATE NULL`,
      `ALTER TABLE EMPLOYEE_BALANCE ADD UPDATED_BY VARCHAR(100),UPDATED_DATE DATETIME`,
      `ALTER TABLE EMPLOYEE_BALANCE ADD MNTH INT,YR INT`,
    ]
  },
  {
    comments: "GP_DTL",
    ID: 1559,
    queries: [
      `ALTER TABLE GP_DTL ADD EXPORT_TYPE INT NULL`,
      `ALTER TABLE COMP_KEYDATA ADD IS_BODYSHOP_GP_PRINT INT NULL`,
      `alter TABLE COMP_KEYDATA add CO_FULL_HOUR NVARCHAR(10) , CO_HALF_HOURS  NVARCHAR(10)`
    ]
  },
  {
    comments: "Emp_Atnrun_Temp",
    ID: 1560,
    queries: [
      `CREATE TABLE [dbo].[Emp_Atnrun_Temp](
    	[Emp_Code] [nvarchar](20) NULL,
    	[Rerun] [int] NULL,
    	[Type] [nvarchar](10) NULL,
    	[Seq_No] [int] NULL,
    	[Loc_Code] [int] NULL,
    	[Created_by] [varchar](255) NULL,
    	[Created_At] [datetime] NULL
    ) ON [PRIMARY]`,
      `ALTER TABLE Emp_Atnrun_Temp ADD Created_At DATETIME DEFAULT GETDATE()`
    ]
  },
  {
    comments: "Emp_Atnrun_Temp",
    ID: 1561,
    queries: [
      `ALTER TABLE Emp_Atnrun_Temp ADD Created_At DATETIME DEFAULT GETDATE()`
    ]
  },
  {
    comments: "Emp_Atnrun_Temp",
    ID: 1562,
    queries: [
      `CREATE TABLE [dbo].[GP_Claim_dtl](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[GP_SEQ] [varchar](50) NULL,
	[Receipt_Amt] [money] NULL,
	[GST_Amount] [money] NULL,
	[Receipt_No] [varchar](100) NULL,
	[Receipt_Date] [datetime] NULL,
	[Account_No] [varchar](50) NULL,
	[Bank_Name] [varchar](200) NULL,
	[Credit_Ref] [varchar](200) NULL,
	[Remark] [varchar](500) NULL,
	[Receipt_Image] [varchar](500) NULL,
	[EXPORT_TYPE] [int] NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[Modified_By] [varchar](255) NULL,
	[Modified_At] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[GP_Claim_dtl_Hst])
)

ALTER TABLE [dbo].[GP_Claim_dtl] ADD  DEFAULT (getdate()) FOR [Created_At]

ALTER TABLE [dbo].[GP_Claim_dtl] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
`ALTER TABLE GP_MST ADD GRecd_Amt MONEY NULL`,
`ALTER TABLE GP_MST ADD GST_AMT MONEY NULL`,
`ALTER TABLE GP_MST ADD Outstanding MONEY NULL`
    ]
  },
    {
    comments: "Emp_Atnrun_Temp",
    ID: 1563,
    queries: [
      `alter table comp_keydata add mispunch_shift int`,
      `ALTER TABLE rtl_mst ADD AADHAR_WARNING_ACCEPT BIT NULL DEFAULT 0`,
      `ALTER TABLE comp_keydata ADD aadhaar_seeding_war INT NULL DEFAULT 0`
    ]
  },
   {
    comments: "Emp_Atnrun_Temp",
    ID: 1564,
    queries: [
      `alter table comp_keydata add Book_code NVARCHAR(10)`
    ]
  },
   {
    comments: "comp_keydata",
    ID: 1565,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD FINANCE_FINAL_INV_MANDATORY INT NULL`,
      `ALTER TABLE EMP_DOCS ADD export_type INT`,
      `ALTER TABLE NEW_JOINING ALTER COLUMN [ADDRESS] [NVARCHAR](255)`
    ]
  },
  {
    comments: "comp_keydata",
    ID: 1566,
    queries: [
      `ALTER TABLE attendancetable ALTER COLUMN appr_1_rem NVARCHAR(500)`,
      `ALTER TABLE attendancetable ALTER COLUMN appr_2_rem NVARCHAR(500)`,
      `ALTER TABLE attendancetable ALTER COLUMN appr_3_rem NVARCHAR(500);`,
      `alter TABLE gp_mst add JV_Amt NVARCHAR (20)`
    ]
  },
  {
    comments: "COMP_KEYDATA_DTL",
    ID: 1567,
    queries: [
      `CREATE TABLE COMP_KEYDATA_DTL (
          id INT PRIMARY KEY IDENTITY(1,1),
          column_name VARCHAR(100) NOT NULL UNIQUE,
          display_name VARCHAR(200) NOT NULL,
          category VARCHAR(100) NOT NULL,
          description TEXT,
          valid_values VARCHAR(500),
          impact TEXT,
          data_type VARCHAR(20) ,
          icon VARCHAR(10) ,
          created_at DATETIME ,
          updated_at DATETIME 
      )`,
      `ALTER TABLE RTL_COST_MST ADD TOTAL_DEBIT_BAL MONEY NULL`,
      `ALTER TABLE RTL_COST_MST ADD TOTAL_LEDG_BAL MONEY NULL`,
      `ALTER TABLE RTL_COST_MST ADD TOTAL_RECEIVED_BAL MONEY NULL`,
      `ALTER TABLE Interview_sideTables ALTER COLUMN [Created_by] NVARCHAR(200)`
    ]
  },
  {
    comments: "COMP_KEYDATA_DTL",
    ID: 1568,
    queries: [
      `alter table godown_mst add Cluster_Code int`,
      `INSERT INTO Mand_Mst (misc_code, misc_name, field_name, field_Abbr,
        Created_By, Export_Type, IsMandtory)
        VALUES
        (3,'DEMO CAR GATEPASS','VEH_REGNO','Vehicle Reg. No.','SYSTEM',1,1),
        (3,'DEMO CAR GATEPASS','CHAS_NO','Chassis No.','SYSTEM',1,1),
        (3,'DEMO CAR GATEPASS','ENGINE_NO','Engine No.','SYSTEM',1,1),
        (3,'DEMO CAR GATEPASS','MODEL_GROUP','Model Group','SYSTEM',1,1),
        (3,'DEMO CAR GATEPASS','MODEL_NAME','Model Name','SYSTEM',1,1),
        (3,'DEMO CAR GATEPASS','FUEL_TYPE','Fuel Type:','SYSTEM',1,1),
        (3,'DEMO CAR GATEPASS','AVERAGE','Average:','SYSTEM',1,1),
        (3,'DEMO CAR GATEPASS','VEH_COLOUR','Colour','SYSTEM',1,1),
        (3,'DEMO CAR GATEPASS','KM_DRIVEN','KM''s Driven','SYSTEM',1,1),
        (3,'DEMO CAR GATEPASS','REG_BRANCH','Registered Branch','SYSTEM',1,1),
        (3,'DEMO CAR GATEPASS','Department_Type','Department Type','SYSTEM',1,1),
        (3,'DEMO CAR GATEPASS','VEH_TYPE','Vehicle Type','SYSTEM',1,0),
        (3,'DEMO CAR GATEPASS','RESP_PERSON','Responsible Person','SYSTEM',1,0),
        (3,'DEMO CAR GATEPASS','INSU_POL_NO','Insurance Policy No.','SYSTEM',1,0),
        (3,'DEMO CAR GATEPASS','INSU_POL_DATE','Insurance Policy
        Date','SYSTEM',1,0),
        (3,'DEMO CAR GATEPASS','PUC_ISSUE_DATE','PUC Issue Date','SYSTEM',1,0),
        (3,'DEMO CAR GATEPASS','REGISTRATION_NAME','Registration
        Name','SYSTEM',1,0),
        (3,'DEMO CAR GATEPASS','HYP_STAT','Hypothecation Status','SYSTEM',1,0),
        (3,'DEMO CAR GATEPASS','AUDIT_DATE','Audit Date','SYSTEM',1,0),
        (3,'DEMO CAR GATEPASS','AUDIT_REM','Audit Remark:','SYSTEM',1,0),
        (3,'DEMO CAR GATEPASS','REMARK','Remark','SYSTEM',1,0),
        (3,'DEMO CAR GATEPASS','uploadDoc','upload Document','SYSTEM',1,0)`
    ]
  },  
  {
    comments: "RTL_COST_MST",
    ID: 1569,
    queries: [
      `ALTER TABLE RTL_COST_MST ALTER COLUMN GATEPASS_SEQNO INT`,
      `
      CREATE TABLE EXP_TRF (
          UTD INT IDENTITY(1,1) PRIMARY KEY,
          TRAN_ID INT NOT NULL,
          TRAN_TYPE INT,
          MAIN_LOC VARCHAR(50),
          HO_LOC VARCHAR(50),
          TRF_DATE DATE,
         TRF_AMT DECIMAL(18,2) NULL,
          TRF_TIME TIME,
          EXPORT_TYPE INT DEFAULT 1,
          USER_CODE VARCHAR(50),
          CREATED_DATE DATETIME DEFAULT GETDATE()
      )`,
          
          
      `alter TABLE COMP_KEYDATA add trf_book_code int`
    ]
  },  
  {
    comments: "EMPLOYEEMASTER",
    ID: 1570,
    queries: [
      `ALTER TABLE Templates ADD SHOW_HEADER INT ;`,
      `ALTER TABLE EMPLOYEEMASTER ADD FACE_EMBEDDING NVARCHAR(MAX) NULL`,
      `CREATE TABLE [dbo].[Insu_Ofr_Mst](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [Month] [int] NULL,
        [DateFrom] [date] NULL,
        [DateUpto] [date] NULL,
        [OfferName] [nvarchar](255) NULL,
        [OfferValue] [decimal](18, 2) NULL,
        [ValidityInDays] [nvarchar](20) NULL,
        [couponValidityType] [int] NULL,
        [LOC_CODE] [nvarchar](50) NULL,
        [Export_type] [int] NULL,
        [Created_by] [nvarchar](100) NULL,
        [Created_At] [datetime] NOT NULL,
        [Updated_At] [datetime] NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,

        PRIMARY KEY CLUSTERED
        (
        [UTD] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY =
        OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]

        ALTER TABLE [dbo].[Insu_Ofr_Mst] ADD DEFAULT (getdate()) FOR [Created_At]

        ALTER TABLE [dbo].[Insu_Ofr_Mst] ADD DEFAULT (getdate()) FOR [ValidFrom]`,
          
          
      `CREATE TABLE [dbo].[Insu_Coupon](
        [Coupan_UTD] [int] IDENTITY(5000,1) NOT NULL,
        [TRANSACTION_ID] [bigint] NULL,
        [Registration_No] [nvarchar](50) NULL,
        [VIN] [nvarchar](50) NULL,
        [Customer_Id] [nvarchar](50) NULL,
        [Coupan_Date] [datetime] NULL,
        [Valid_Upto] [datetime] NULL,
        [Coupan_Amt] [money] NULL,
        [Coupan_Time] [datetime] NULL,
        [OfferValue] [decimal](18, 2) NULL,
        [QR_PATH] [varchar](500) NULL,
        [Msz_Send] [varchar](20) NULL,
        [Coupan_Availed] [nvarchar](20) NULL,
        [Availed_Date] [datetime] NULL,
        [Availed_by] [nvarchar](100) NULL,
        [Bill_Regn_No] [nvarchar](50) NULL,
        [Bill_No] [nvarchar](50) NULL,
        [Coupan_Expiry_Date] [datetime] NULL,
        [Created_by] [nvarchar](50) NULL,
        [Created_At] [datetime] NOT NULL,
        [Updated_At] [datetime] NULL,
        [Export_type] [int] NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
        PRIMARY KEY CLUSTERED
        (
        [Coupan_UTD] ASC
        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY =
        OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
        ) ON [PRIMARY]
        WITH
        (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Insu_Coupon_Hst])
        )

        ALTER TABLE [dbo].[Insu_Coupon] ADD DEFAULT (getdate()) FOR [Created_At]

        ALTER TABLE [dbo].[Insu_Coupon] ADD DEFAULT (getdate()) FOR [ValidFrom]`
    ]
  }, 
  {
    comments: "RTL_COST_MST",
    ID: 1571,
    queries: [
      `ALTER TABLE EXP_TRF ADD PAYMENT_AT INT NULL`,
      `alter TABLE COMP_KEYDATA add ENABLE_FACE_MATCHING INT`,
    ]
  },  
  {
    comments: "RTL_COST_MST",
    ID: 1572,
    queries: [
      `ALTER TABLE EMPLOYEE_BALANCE ADD DEDUCTIONS NUMERIC(18, 2) NULL`,
    ]
  },  
  {
    comments: "Daily_HR_Executive_Report",
    ID: 1573,
    queries: [
      `CREATE TABLE[dbo].[Daily_HR_Executive_Report](
    [UTD][int] IDENTITY(1, 1) NOT NULL,
    [Report_Date][date] NULL,
    [Attendance_Reivew][nvarchar](20) NULL,
    [Recruitment_Follow_up][nvarchar](20) NULL,
    [Joining_Formalities][nvarchar](20) NULL,
    [Employee_Documents][nvarchar](20) NULL,
    [Leave_Update][nvarchar](20) NULL,
    [Uniform_ID_Card][nvarchar](20) NULL,
    [Payroll_Input][nvarchar](20) NULL,
    [Employee_Grievance][nvarchar](20) NULL,
    [Training_Induction][nvarchar](20) NULL,
    [Department][nvarchar](100) NULL,
    [Branch_Visit][nvarchar](20) NULL,
    [Remarks][nvarchar](500) NULL,
    [Created_by][nvarchar](50) NULL,
    [Created_At][datetime] NOT NULL,
    [Updated_At][datetime] NULL,
    [Export_type][int] NULL,
    [ValidFrom][datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
    [ValidTo][datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
    PRIMARY KEY CLUSTERED
    (
      [UTD] ASC
    )WITH(PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON[PRIMARY],
    PERIOD FOR SYSTEM_TIME([ValidFrom], [ValidTo])
  ) ON[PRIMARY]
WITH
    (
      SYSTEM_VERSIONING = ON(HISTORY_TABLE = [dbo].[Daily_HR_Executive_Report_Hst])
    )
 
ALTER TABLE[dbo].[Daily_HR_Executive_Report] ADD DEFAULT(getdate()) FOR[Created_At]
 
ALTER TABLE[dbo].[Daily_HR_Executive_Report] ADD DEFAULT(getdate()) FOR[ValidFrom]`,
    ]
  }, 
  {
    comments: "EXPENSE_REQUEST",
    ID: 1574,
    queries: [
      `CREATE TABLE EXPENSE_REQUEST (
    REQ_ID        VARCHAR(20)      NOT NULL PRIMARY KEY,
    USER_ID       VARCHAR(50)      ,
    REQUESTOR     VARCHAR(100)    ,
    REQUEST_TO    VARCHAR(100)     ,
    REQUEST_TEXT  NVARCHAR(MAX)    ,
    BRANCH        VARCHAR(50)      ,
    REMARK        VARCHAR(500)     ,
    REQUEST_DATE  DATETIME         ,
    STATUS        VARCHAR(20)      ,
    EXPENSE_ID    INT              ,
    CONVERTED_AT  DATETIME         ,
    CONVERTED_BY  VARCHAR(50)      ,
    Created_By    VARCHAR(50)      ,
    Created_At    DATETIME         
)`,
`ALTER TABLE COMP_KEYDATA ADD OPENING_BALANCE INT NULL`,
`CREATE TABLE [RTL_CUST](
        [TRAN_ID] [int] NULL,
        [ENQUIRY_NO] [varchar](100) NULL,
        [BOOKING_ID] [varchar](50) NULL,
        [CUST_ID] [varchar](50) NULL,
        [LEDG_CODE] [int] NULL,
  	    [LOC_CODE] [int] NULL,
        [Export_Type] [int] NULL
  )`
    ]
  },   
  {
    comments: "EXPENSE_REQUEST",
    ID: 1575,
    queries: [
      `
CREATE TABLE [dbo].[HRMS_Lead_Master](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Lead_No] [int] NOT NULL,
	[Name] [varchar](255) NULL,
	[Contact] [varchar](20) NULL,
	[Alt_Contact] [varchar](20) NULL,
	[Email] [varchar](255) NULL,
	[Company] [varchar](255) NULL,
	[Designation] [varchar](255) NULL,
	[Industry] [varchar](100) NULL,
	[Employees] [int] NULL,
	[Location] [varchar](255) NULL,
	[State] [varchar](100) NULL,
	[City] [varchar](100) NULL,
	[Lead_Source] [varchar](100) NULL,
	[Product] [varchar](100) NULL,
	[Lead_Status] [varchar](100) NULL,
	[Priority] [varchar](20) NULL,
	[Demo_Required] [varchar](5) NULL,
	[Demo_Date] [date] NULL,
	[Follow_Up_Date] [date] NULL,
	[Expected_Closure] [date] NULL,
	[Deal_Value] [decimal](18, 2) NULL,
	[Notes] [varchar](max) NULL,
	[Remarks] [varchar](max) NULL,
	[Created_By] [varchar](255) NULL,
	[Created_At] [datetime] NOT NULL,
	[Updated_By] [varchar](255) NULL,
	[Updated_At] [datetime] NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[HRMS_Lead_Master_Hst])
)

ALTER TABLE [dbo].[HRMS_Lead_Master] ADD  DEFAULT (getdate()) FOR [Created_At]

ALTER TABLE [dbo].[HRMS_Lead_Master] ADD  DEFAULT (getdate()) FOR [ValidFrom]

`
    ]
  },   
    {
    comments: "EXPENSE_REQUEST",
    ID: 1576,
    queries: [
      `alter TABLE KeyData add Manual_Gst int`,
      `ALTER TABLE RTL_COST_MST ADD IS_SEZ_SUPPLY INT NULL`,
      `ALTER TABLE COMP_KEYDATA ADD IS_REAPPROVAL INT NULL`
    ]
  },
    {
    comments: "EXPENSE_REQUEST",
    ID: 1577,
    queries: [
      `ALTER TABLE RTL_COST_MST ADD MODIFIED_LEDG_BAL MONEY NULL`,
      `Alter table icm_ext_preinvoice_cancel add Remark varchar(20) null`
    ]
  },
  {
    comments: "FINANCE_PAYOUT",
    ID: 1578,
    queries: [
      `ALTER TABLE icm_ext_preinvoice_cancel ADD INVOICE_DATE DATE NULL`,
      `ALTER TABLE icm_ext_dtl ADD Icm_ext_top_tran_id int NULL`,
      `ALTER TABLE icm_ext_preinvoice_cancel ALTER COLUMN Remark VARCHAR(200) NULL`,
      
    ]
  },
   {
    comments: "app_module_version_control",
    ID: 1579,
    queries: [
      `update  app_module_version_control set min_version = 100 where module_key = '1.1.1'`
      
    ]
  },
   {
    comments: "Godown_Mst_Ext",
    ID: 1580,
    queries: [
      `
  CREATE TABLE [dbo].[Godown_Mst_Ext](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Godw_Code] [int] NULL,
	[Export_Type] [int] NULL,
    [Bill_Mob_No] [Nvarchar] (20) NULL,
    [Bill_Email] [Nvarchar] (20) NULL,
	[CREATED_BY] [varchar](200) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Godown_Mst_Ext_Hst])
)

ALTER TABLE [dbo].[Godown_Mst_Ext] ADD  DEFAULT (getdate()) FOR [ValidFrom]
`,
`INSERT INTO Godown_Mst_Ext
(
    Godw_Code,
    Export_Type,
    Bill_Mob_No,
    Bill_Email,
    CREATED_BY
)
SELECT
    gm.Godw_Code,
    gm.Export_Type,
    NULL,
    NULL,
    'admin'
FROM Godown_Mst gm
WHERE NOT EXISTS
(
    SELECT 1
    FROM Godown_Mst_Ext gme
    WHERE gme.Godw_Code = gm.Godw_Code
)`
      
    ]
  },
  {
    comments: "app_module_version_control",
    ID: 1581,
    queries: [
      `INSERT INTO Mand_Mst
(
    misc_code, misc_name, field_name, field_Abbr,
    Created_By, Export_Type, IsMandtory
)
VALUES
-- Insurance Expiry Date
(3,'DEMO CAR GATEPASS','INSU_EXPIRY_DATE','Insurance Expiry Date','SYSTEM',1,0),

-- Date of Purchase
(3,'DEMO CAR GATEPASS','DATE_OF_PURCHASE','Date of Purchase','SYSTEM',1,0),

-- Hypothecation Master
(3,'DEMO CAR GATEPASS','HYPOTHECATION','Hypothecation','SYSTEM',1,0),

-- Loan / Subscription Dates
(3,'DEMO CAR GATEPASS','LOAN_SUB_FROM','Loan/Subscription From','SYSTEM',1,0),
(3,'DEMO CAR GATEPASS','LOAN_SUB_TO','Loan/Subscription To','SYSTEM',1,0),

-- RTO Refund
(3,'DEMO CAR GATEPASS','RTO_REFUND_AMT','RTO Refund Amount','SYSTEM',1,0),
(3,'DEMO CAR GATEPASS','RTO_REFUND_DATE','RTO Refund Date','SYSTEM',1,0),

-- Claim Details
(3,'DEMO CAR GATEPASS','CLAIM_SUBMITTED_DATE','Claim Submitted Date','SYSTEM',1,0),
(3,'DEMO CAR GATEPASS','CLAIM_RECEIVED_DATE','Claim Received Date','SYSTEM',1,0),
(3,'DEMO CAR GATEPASS','CLAIM_AMT','Claim Amount','SYSTEM',1,0)`,
`ALTER TABLE DemoCarMaster ADD INSU_EXPIRY_DATE SMALLDATETIME NULL`,
`ALTER TABLE DemoCarMaster ADD DATE_OF_PURCHASE SMALLDATETIME NULL`,
`ALTER TABLE DemoCarMaster ADD HYPOTHECATION INT NULL`,
`ALTER TABLE DemoCarMaster ADD LOAN_SUB_FROM SMALLDATETIME NULL`,
`ALTER TABLE DemoCarMaster ADD LOAN_SUB_TO SMALLDATETIME NULL`,
`ALTER TABLE DemoCarMaster ADD RTO_REFUND_AMT DECIMAL(10, 2) NULL`,

`ALTER TABLE DemoCarMaster ADD RTO_REFUND_DATE SMALLDATETIME NULL`,
`ALTER TABLE DemoCarMaster ADD CLAIM_SUBMITTED_DATE SMALLDATETIME NULL`,
`ALTER TABLE DemoCarMaster ADD CLAIM_RECEIVED_DATE SMALLDATETIME NULL`,
`ALTER TABLE DemoCarMaster ADD CLAIM_AMT DECIMAL(10, 2) NULL`
      
    ]
  },
  {
    comments: "ICM_MST",
    ID: 1582,
    queries: [
      `ALTER TABLE ICM_MST ADD BANK_BRANCH_CODE NVARCHAR(100)`,
        `ALTER TABLE ICM_MST ADD RCPT_NO NVARCHAR(50)`,
        `ALTER TABLE ICM_MST ADD REGN_NO NVARCHAR(50)`,
        `ALTER TABLE ICM_MST ADD HYPO_DTL NVARCHAR(255)`
      
    ]
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1583,
    queries: [
      `ALTER TABLE COMP_KEYDATA ADD BANKING_ENTRY INT NULL`
    ]
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1584,
    queries: [
      `
CREATE TABLE [dbo].[leave_policies](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[company_code] [varchar](20) NOT NULL,
	[policy_name] [varchar](100) NOT NULL,
	[description] [text] NULL,
	[leave_code] [varchar](10) NOT NULL,
	[is_active] [bit] NULL,
	[effective_from] [date] NOT NULL,
	[effective_to] [date] NOT NULL,
	[leave_calendar] [varchar](20) NULL,
	[year_end_close] [varchar](20) NULL,
	[allow_next_calendar_leave] [bit] NULL,
	[leave_generated_on] [varchar](20) NULL,
	[leave_from_value] [int] NULL,
	[leave_from_period] [varchar](20) NULL,
	[leave_from_option] [varchar](20) NULL,
	[no_of_leave_based_on] [varchar](30) NULL,
	[basis_type] [varchar](20) NULL,
	[pro_rata_days] [int] NULL,
	[leave_alloted_on] [varchar](20) NULL,
	[leave_from_value_alloted] [int] NULL,
	[leave_from_period_alloted] [varchar](20) NULL,
	[min_leave_days] [int] NULL,
	[max_leave_days] [int] NULL,
	[advance_notice_required] [int] NULL,
	[backdated_leave_allowed] [bit] NULL,
	[backdated_days] [int] NULL,
	[future_leave_allowed] [bit] NULL,
	[future_days] [int] NULL,
	[proof_of_leave] [varchar](20) NULL,
	[leave_balance_visibility] [varchar](20) NULL,
	[min_gap_between_applications] [int] NULL,
	[max_instances_per_year] [int] NULL,
	[max_leaves_per_month] [int] NULL,
	[holiday_leave_holiday] [bit] NULL,
	[leave_holiday_leave] [bit] NULL,
	[weekoff_leave_weekoff] [bit] NULL,
	[leave_weekoff_leave] [bit] NULL,
	[weekoff_holiday_leave_weekoff_holiday] [bit] NULL,
	[oth_leave_leave_oth] [bit] NULL,
	[carry_forward_allowed] [bit] NULL,
	[carry_forward_maximum] [int] NULL,
	[carry_forward_lapse] [varchar](20) NULL,
	[encashment_allowed] [bit] NULL,
	[encashment_min_balance] [int] NULL,
	[encashment_max_limit] [int] NULL,
	[encashment_frequency] [varchar](20) NULL,
	[expiry_allowed] [bit] NULL,
	[expiry_frequency] [varchar](20) NULL,
	[expiry_limit] [int] NULL,
	[auto_lapse_process] [varchar](20) NULL,
	[location] [varchar](500) NULL,
	[Created_by] [varchar](50) NULL,
	[Created_At] [datetime] NOT NULL,
	[Updated_At] [datetime] NULL,
	[Updated_by] [varchar](50) NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[export_type] [int] NULL
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[leave_policies_Hst])
)

ALTER TABLE [dbo].[leave_policies] ADD  DEFAULT ((1)) FOR [is_active]

ALTER TABLE [dbo].[leave_policies] ADD  DEFAULT ((0)) FOR [allow_next_calendar_leave]

ALTER TABLE [dbo].[leave_policies] ADD  DEFAULT ((0)) FOR [backdated_leave_allowed]

ALTER TABLE [dbo].[leave_policies] ADD  DEFAULT ((0)) FOR [future_leave_allowed]

ALTER TABLE [dbo].[leave_policies] ADD  DEFAULT ((0)) FOR [holiday_leave_holiday]

ALTER TABLE [dbo].[leave_policies] ADD  DEFAULT ((0)) FOR [leave_holiday_leave]

ALTER TABLE [dbo].[leave_policies] ADD  DEFAULT ((0)) FOR [weekoff_leave_weekoff]

ALTER TABLE [dbo].[leave_policies] ADD  DEFAULT ((0)) FOR [leave_weekoff_leave]

ALTER TABLE [dbo].[leave_policies] ADD  DEFAULT ((0)) FOR [weekoff_holiday_leave_weekoff_holiday]

ALTER TABLE [dbo].[leave_policies] ADD  DEFAULT ((0)) FOR [oth_leave_leave_oth]

ALTER TABLE [dbo].[leave_policies] ADD  DEFAULT ((0)) FOR [carry_forward_allowed]

ALTER TABLE [dbo].[leave_policies] ADD  DEFAULT ((0)) FOR [encashment_allowed]

ALTER TABLE [dbo].[leave_policies] ADD  DEFAULT ((0)) FOR [expiry_allowed]

`,
`CREATE TABLE [dbo].[icm_ext_follow_up](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[next_meeting_date] [date] NULL,
	[remark] [varchar](1000) NULL,
	[meeting_date] [date] NULL,
	[employee_name] [varchar](100) NULL,
	[Created_by] [varchar](50) NULL,
	[Created_At] [datetime] NOT NULL,
	[Updated_by] [varchar](50) NULL,
	[Updated_At] [datetime] NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[ext_tran_id] [int] NOT NULL,
 CONSTRAINT [PK_icm_ext_follow_up] PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[icm_ext_follow_up_Hst])
)

ALTER TABLE [dbo].[icm_ext_follow_up] ADD  DEFAULT (getdate()) FOR [Created_At]

`,
`CREATE TABLE [dbo].[ClientIntake_Mst](
    [UTD]               [int] IDENTITY(1,1) NOT NULL,
    [COMPANY_NAME]      [varchar](250)  NULL,
    [INDUSTRY]          [varchar](150)  NULL,
    [EMPLOYEE_COUNT]    [varchar](20)   NULL,
    [STAKEHOLDER_NAME]  [varchar](200)  NULL,
    [DESIGNATION]       [varchar](150)  NULL,
    [EMAIL]             [varchar](150)  NULL,
    [MOBILE]            [varchar](15)   NULL,
    [HEADQUARTERS]      [varchar](200)  NULL,
    [LEGACY_CONTEXT]    [varchar](500)  NULL,
    [STATUS]            [varchar](20)   NULL,
    [EXPORT_TYPE]       [int]           NULL,  
    [CREATED_BY]        [varchar](200)  NULL,
    [CREATED_AT]        [datetime]      NULL,
    [UPDATED_BY]        [varchar](200)  NULL,
    [UPDATED_AT]        [datetime]      NULL,
    [ValidFrom]         [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
    [ValidTo]           [datetime2](7) GENERATED ALWAYS AS ROW END   NOT NULL,

 PRIMARY KEY CLUSTERED
(
    [UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
    PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[ClientIntake_Mst_Hst])
)

ALTER TABLE [dbo].[ClientIntake_Mst] ADD DEFAULT (getdate()) FOR [CREATED_AT]

ALTER TABLE [dbo].[ClientIntake_Mst] ADD DEFAULT ((0))       FOR [EXPORT_TYPE]

ALTER TABLE [dbo].[ClientIntake_Mst] ADD DEFAULT ('draft')   FOR [STATUS]

ALTER TABLE [dbo].[ClientIntake_Mst] ADD DEFAULT (getdate()) FOR [ValidFrom]
`
    ]
  },
  {
    comments: "RTL_Exch_Veh",
    ID: 1585,
    queries: [
      `
CREATE TABLE [dbo].[RTL_Exch_Veh](
	[Tran_Id] [int] NULL,
	[NewChasNo] [nvarchar](30) NULL,
	[OldChasNo_1] [nvarchar](30) NULL,
	[OldRegno_1] [nvarchar](15) NULL,
	[oldEngno_1] [nvarchar](30) NULL,
	[OldModel_1] [nvarchar](70) NULL,
	[OldMfgYr_1] [nvarchar](10) NULL,
	[OldKm_1] [nvarchar](10) NULL,
	[OldAmount_1] [money] NULL,
	[NewChasno_1] [nvarchar](30) NULL,
	[Notes_1] [nvarchar](250) NULL,
	[NewEngno_1] [nvarchar](25) NULL,
	[Party_Name_1] [nvarchar](200) NULL,
	[Relation_1] [nvarchar](25) NULL,
	[TV_Evaluator_1] [nvarchar](40) NULL,
	[TVCust_Id_1] [nvarchar](20) NULL,
	[TV_PAN_1] [nvarchar](10) NULL,
	[TV_PurcAmt_1] [money] NULL,
	[Loan_Paid_1] [money] NULL,
	[TV_NetAmt_1] [money] NULL,
	[Refurb_Est_1] [money] NULL,
	[Refurb_Act_1] [money] NULL,
	[Thirdparty_InsuAmt_1] [money] NULL,
	[OldChasNo_2] [nvarchar](30) NULL,
	[OldRegno_2] [nvarchar](15) NULL,
	[oldEngno_2] [nvarchar](30) NULL,
	[OldModel_2] [nvarchar](70) NULL,
	[OldMfgYr_2] [nvarchar](10) NULL,
	[OldKm_2] [nvarchar](10) NULL,
	[OldAmount_2] [money] NULL,
	[NewChasno_2] [nvarchar](30) NULL,
	[Notes_2] [nvarchar](250) NULL,
	[NewEngno_2] [nvarchar](25) NULL,
	[Party_Name_2] [nvarchar](200) NULL,
	[Relation_2] [nvarchar](25) NULL,
	[TV_Evaluator_2] [nvarchar](40) NULL,
	[TVCust_Id_2] [nvarchar](20) NULL,
	[TV_PAN_2] [nvarchar](10) NULL,
	[TV_PurcAmt_2] [money] NULL,
	[Loan_Paid_2] [money] NULL,
	[TV_NetAmt_2] [money] NULL,
	[Refurb_Est_2] [money] NULL,
	[Refurb_Act_2] [money] NULL,
	[Thirdparty_InsuAmt_2] [money] NULL,
	[OldChasNo_3] [nvarchar](30) NULL,
	[OldRegno_3] [nvarchar](15) NULL,
	[oldEngno_3] [nvarchar](30) NULL,
	[OldModel_3] [nvarchar](70) NULL,
	[OldMfgYr_3] [nvarchar](10) NULL,
	[OldKm_3] [nvarchar](10) NULL,
	[OldAmount_3] [money] NULL,
	[NewChasno_3] [nvarchar](30) NULL,
	[Notes_3] [nvarchar](250) NULL,
	[NewEngno_3] [nvarchar](25) NULL,
	[Party_Name_3] [nvarchar](200) NULL,
	[Relation_3] [nvarchar](25) NULL,
	[TV_Evaluator_3] [nvarchar](40) NULL,
	[TVCust_Id_3] [nvarchar](20) NULL,
	[TV_PAN_3] [nvarchar](10) NULL,
	[TV_PurcAmt_3] [money] NULL,
	[Loan_Paid_3] [money] NULL,
	[TV_NetAmt_3] [money] NULL,
	[Refurb_Est_3] [money] NULL,
	[Refurb_Act_3] [money] NULL,
	[Thirdparty_InsuAmt_3] [money] NULL,
	[Loc_Code] [int] NULL,
	[Export_Type] [int] NULL,
	[Exch_Type_1] [int] NULL,
	[Exch_Type_2] [int] NULL,
	[Exch_Type_3] [int] NULL,
	[TV_Evaluator] [nvarchar](40) NULL,
	[Thirdparty_InsuAmt] [money] NULL,
	[TVCust_Id] [nvarchar](20) NULL,
	[TV_PAN] [nvarchar](10) NULL,
	[TV_PurcAmt] [money] NULL,
	[Loan_Paid] [money] NULL,
	[TV_NetAmt] [money] NULL,
	[Refurb_Est] [money] NULL,
	[Refurb_Act] [money] NULL,
	[TV_Pymt_Recd] [money] NULL,
	[TV_Pymt_Date] [date] NULL,
	[TV_JV_No] [nvarchar](50) NULL,
	[TV_Pymt_Recd2] [money] NULL,
	[TV_Pymt_Date2] [date] NULL,
	[TV_JV_No2] [nvarchar](30) NULL,
	[TV_Pymt_Recd3] [money] NULL,
	[TV_Pymt_Date3] [date] NULL,
	[TV_JV_No3] [nvarchar](30) NULL,
	[IsEBR] [int] NULL,
	[VIN] [nvarchar](20) NULL,
	[ENG_No] [nvarchar](20) NULL
) ON [PRIMARY]
`,
`CREATE TABLE [dbo].[salary_policies](
  [UTD] [int] IDENTITY(1,1) NOT NULL,
     company_code VARCHAR(20) NOT NULL,
    policy_name VARCHAR(200) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE NULL,
    description VARCHAR(500) NULL,
    salary_structure VARCHAR(30) NULL,
    pay_frequency VARCHAR(20) NULL,
    payroll_calendar VARCHAR(20) NULL,
    employee_type VARCHAR(30) NULL,
    locations VARCHAR(MAX) NULL,
    salary_config_mode VARCHAR(30) NULL,
    earning_components VARCHAR(MAX) NULL,
    special_allowances VARCHAR(MAX) NULL,
    pf_applicable BIT DEFAULT(0),
    pf_prem_base VARCHAR(MAX) NULL,
    pf_emp_rate DECIMAL(10,2) NULL,
    pf_emp_cap DECIMAL(10,2) NULL,
    pf_eps_rate DECIMAL(10,2) NULL,
    pf_eps_cap DECIMAL(10,2) NULL,
    pf_epf_rate DECIMAL(10,2) NULL,
    pf_epf_cap DECIMAL(10,2) NULL,
    pf_admin_rate DECIMAL(10,2) NULL,
    pf_admin_cap DECIMAL(10,2) NULL,
    pf_edli_rate DECIMAL(10,2) NULL,
    pf_edli_cap DECIMAL(10,2) NULL,
    esi_applicable BIT DEFAULT(0),
    esi_wage_base VARCHAR(MAX) NULL,
    esi_employee_rate DECIMAL(10,2) NULL,
    esi_employer_rate DECIMAL(10,2) NULL,
    esi_ceiling DECIMAL(10,2) NULL,
    pt_applicable BIT DEFAULT(0),
    pt_state VARCHAR(20) NULL,
    pt_wage_base VARCHAR(MAX) NULL,
    pt_slabs VARCHAR(MAX) NULL,
    lwf_applicable BIT DEFAULT(0),
    lwf_region VARCHAR(50) NULL,
    lwf_frequency VARCHAR(20) NULL,
    lwf_month VARCHAR(5) NULL,
    lwf_employee_amount DECIMAL(10,2) NULL,
    lwf_employer_amount DECIMAL(10,2) NULL,
    lwf_ceiling DECIMAL(10,2) NULL,
    ot_applicable BIT DEFAULT(0),
    ot_wage_base VARCHAR(MAX) NULL,
    ot_rate VARCHAR(20) NULL,
    ot_max_hours INT NULL,
    tds_wage_base VARCHAR(MAX) NULL,
    tax_calc_frequency VARCHAR(20) NULL,
    education_cess_rate DECIMAL(10,2) NULL,
    bonus_applicable BIT DEFAULT(0),
    bonus_wage_base VARCHAR(MAX) NULL,
    bonus_type VARCHAR(30) NULL,
    bonus_percentage DECIMAL(10,2) NULL,
    export_type TINYINT NOT NULL DEFAULT(1),
  [Created_At] [datetime] NOT NULL,
  [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
  [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
  [Created_by] [varchar](30) NULL,
                        PRIMARY KEY CLUSTERED
                        (
                            [UTD] ASC
                        )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                            PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
                        ) ON [PRIMARY]
                        WITH
                        (
                        SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[salary_policies_Hst])
                        )
                       
                       
                        ALTER TABLE [dbo].[salary_policies] ADD  DEFAULT (getdate()) FOR [Created_At]
                       
                       
                        ALTER TABLE [dbo].[salary_policies] ADD  DEFAULT (getdate()) FOR [ValidFrom]
                       
                       
ALTER TABLE dbo.salary_policies
ADD
    Updated_At DATETIME NULL,
    Updated_by VARCHAR(30) NULL;

`,
`ALTER TABLE COMP_KEYDATA ADD Enb_Dupli_Mob BIT NOT NULL DEFAULT 0`
      
    ]
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1586,
    queries: [
      `alter table icm_ext add [Final_Inv_Emailto] [varchar](200) NULL`,
	      `alter table icm_ext add [Final_Inv_Cc] [varchar](200) NULL`,
	      `alter table icm_ext add [Final_Inv_EmailFinName] [varchar](300) NULL`,
	      `alter table icm_ext add [Final_Inv_BankerName] [varchar](200) NULL`,
	      `alter table icm_ext add [Final_Inv_BankerNo] [varchar](20) NULL`,
	      `alter table icm_ext add [Final_Inv_Emaildate] [datetime2](7) NULL`,
        `CREATE TABLE [dbo].[PRINT_TEMPLATES](
      [TRAN_ID] [int] IDENTITY(1,1) NOT NULL,
      [TEMPLATE_ID] [int] NULL,
      [EMPCODE] [varchar](20) NULL,
      [REQ_DATE] [datetime] NULL,
      [LOC_CODE] [int] NULL,
      [APPR_1_CODE] [varchar](100) NULL,
      [APPR_1_STAT] [tinyint] NULL,
      [APPR_1_DATE] [datetime2](7) NULL,
      [APPR_1_REM] [varchar](300) NULL,
      [APPR_2_CODE] [varchar](100) NULL,
      [APPR_2_STAT] [tinyint] NULL,
      [APPR_2_DATE] [datetime2](7) NULL,
      [APPR_2_REM] [varchar](300) NULL,
      [APPR_3_CODE] [varchar](100) NULL,
      [APPR_3_STAT] [tinyint] NULL,
      [APPR_3_DATE] [datetime2](7) NULL,
      [APPR_3_REM] [varchar](300) NULL,
      [FIN_APPR] [tinyint] NULL,
      [Created_By] [varchar](255) NULL,
      [Created_At] [datetime] NOT NULL DEFAULT (getdate()),
      [PDF_PATH] [varchar](500) NULL,
      [EXPORT_TYPE] [int] NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
         PRIMARY KEY CLUSTERED
                    (
                  [TRAN_ID] ASC
                      )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
                      ) ON [PRIMARY]
                      WITH
                      (
                          SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PRINT_TEMPLATES_hst])
                      )`,
      `ALTER TABLE ClientIntake_Mst ADD IS_EMPLOYEE_WISE VARCHAR(10) NULL, EXACT_EMPLOYEE_COUNT INT NULL`
    ]
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1587,
    queries: [
      `ALTER TABLE ClientIntake_Mst ADD GST_NUMBER NVARCHAR(50) NULL;`,
        `ALTER TABLE ClientIntake_Mst ADD PRODUCT_NAME NVARCHAR(100) NULL;`,
        `ALTER TABLE ClientIntake_Mst ADD SELECTED_PLAN NVARCHAR(50) NULL;`,
        `ALTER TABLE ClientIntake_Mst ADD OTP_CODE NVARCHAR(10) NULL;`,
        `ALTER TABLE ClientIntake_Mst ADD OTP_VERIFIED BIT DEFAULT 0 NULL;`,
        `ALTER TABLE ClientIntake_Mst ADD COMPANY_ADDRESS NVARCHAR(500) NULL; `,
        `ALTER TABLE ClientIntake_Mst ADD TOKEN_NUMBER NVARCHAR(10) NULL;`,
        `ALTER TABLE ClientIntake_Mst ADD PDF_PATH NVARCHAR(500) NULL`,
        `ALTER TABLE ClientIntake_Mst
ADD
    PAYMENT_TERMS_CODE INT NULL,
    NO_MNTH INT NULL,
    PER_MONTH_RATE DECIMAL(18,2) NULL,
    AMOUNT DECIMAL(18,2) NULL,
    DISCOUNT_PER DECIMAL(18,2) NULL,
    DISCOUNT_AMOUNT DECIMAL(18,2) NULL,
    TAXABLE_AMOUNT DECIMAL(18,2) NULL,
    GST_AMOUNT DECIMAL(18,2) NULL`
    ]
  },
  {
    comments: "COMP_KEYDATA",
    ID: 1588,
    queries: [
      `alter TABLE Shift_Approver add SHIFT_CODE INT`,
        `
CREATE TABLE [dbo].[attendance_policies_table](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[company_code] [varchar](20) NOT NULL,
	[policy_name] [varchar](100) NOT NULL,
	[description] [text] NULL,
	[is_active] [int] NULL,
	[effective_from] [date] NOT NULL,
	[effective_to] [date] NOT NULL,
	[location] [varchar](500) NULL,
	[employee_types] [varchar](200) NULL,
	[shift_code] [varchar](20) NULL,
	[shift_type] [varchar](20) NULL,
	[break_duration] [int] NULL,
	[break_type] [varchar](20) NULL,
	[working_hours] [decimal](5, 2) NULL,
	[weekly_working_days] [varchar](100) NULL,
	[overtime_allowed] [int] NULL,
	[overtime_rate] [decimal](5, 2) NULL,
	[max_overtime_per_day] [decimal](5, 2) NULL,
	[max_overtime_per_month] [decimal](5, 2) NULL,
	[overtime_compensatory_off] [int] NULL,
	[comp_off_validity_days] [int] NULL,
	[max_comp_off_balance] [int] NULL,
	[minimum_hours_for_comp_off] [decimal](5, 2) NULL,
	[missing_punch_allowed] [int] NULL,
	[regularization_allowed] [int] NULL,
	[regularization_period] [int] NULL,
	[regularization_max_days] [int] NULL,
	[regularization_document_required] [int] NULL,
	[weekly_off_pattern] [varchar](20) NULL,
	[weekly_off_days] [varchar](100) NULL,
	[weekly_off_alternative] [int] NULL,
	[weekly_off_compensatory] [int] NULL,
	[enable_sandwich_policy] [int] NULL,
	[holiday_list] [varchar](500) NULL,
	[enable_geo_fence] [int] NULL,
	[allowed_radius] [int] NULL,
	[latitude] [varchar](30) NULL,
	[longitude] [varchar](30) NULL,
	[allow_mobile_punch] [int] NULL,
	[allow_web_punch] [int] NULL,
	[allow_biometric_punch] [int] NULL,
	[allow_face_recognition] [int] NULL,
	[attendance_source_priority] [varchar](50) NULL,
	[predefined_rules] [varchar](2000) NULL,
	[created_by] [varchar](50) NULL,
	[created_at] [datetime] NOT NULL,
	[updated_by] [varchar](50) NULL,
	[updated_at] [datetime] NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[export_type] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[attendance_policies_table_Hst])
)

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT ((1)) FOR [is_active]

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT ((0)) FOR [overtime_allowed]

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT ((0)) FOR [overtime_compensatory_off]

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT ((0)) FOR [missing_punch_allowed]

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT ((0)) FOR [regularization_allowed]

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT ((0)) FOR [regularization_document_required]

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT ((0)) FOR [weekly_off_alternative]

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT ((0)) FOR [weekly_off_compensatory]

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT ((0)) FOR [enable_sandwich_policy]

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT ((0)) FOR [enable_geo_fence]

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT ((1)) FOR [allow_mobile_punch]

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT ((1)) FOR [allow_web_punch]

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT ((1)) FOR [allow_biometric_punch]

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT ((0)) FOR [allow_face_recognition]

ALTER TABLE [dbo].[attendance_policies_table] ADD  DEFAULT (getdate()) FOR [created_at]

`,
`
CREATE TABLE [dbo].[attendance_status_rules_table](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[policy_utd] [int] NOT NULL,
	[company_code] [varchar](20) NOT NULL,
	[desc_code] [varchar](10) NOT NULL,
	[early_] [int] NULL,
	[late_come] [int] NULL,
	[allow_days] [int] NULL,
	[priority_code] [int] NULL,
	[region] [varchar](20) NULL,
	[half] [varchar](10) NULL,
	[half_val] [int] NULL,
	[wef] [date] NULL,
	[absent] [varchar](10) NULL,
	[Created_By] [varchar](50) NULL,
	[Created_At] [datetime] NOT NULL,
	[Updated_By] [varchar](50) NULL,
	[Updated_At] [datetime] NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	[export_type] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[attendance_status_rules_Hst])
)

ALTER TABLE [dbo].[attendance_status_rules_table] ADD  DEFAULT ((0)) FOR [early_]

ALTER TABLE [dbo].[attendance_status_rules_table] ADD  DEFAULT ((0)) FOR [late_come]

ALTER TABLE [dbo].[attendance_status_rules_table] ADD  DEFAULT ((0)) FOR [allow_days]

ALTER TABLE [dbo].[attendance_status_rules_table] ADD  DEFAULT (getdate()) FOR [Created_At]

`
    ]
  },
   {
    comments: "HRMS_Lead_Master",
    ID: 1589,
    queries: [
       `ALTER TABLE HRMS_Lead_Master ADD Attachment VARCHAR(500) NULL`,
        `ALTER TABLE EMPLOYEE_BALANCE ADD DEDUCTION_TYPE INT NULL`,
        `alter TABLE COMP_KEYDATA ALTER COLUMN HOD_Sales [varchar](50) NULL`,
        `ALTER TABLE ClientIntake_Mst
ADD
    PLAN_CODE INT NULL,
    TOTAL_AMOUNT DECIMAL(12,2) NULL,
    TERMS_SELECTED NVARCHAR(MAX) NULL,
    TERMS_DETAILS NVARCHAR(MAX) NULL,
    OPTIONAL_TERMS NVARCHAR(MAX) NULL,
    PER_EMP_RATE DECIMAL(18,2) NULL,
    ACT_PER_EMP_RATE DECIMAL(18,2) NULL,
    EMP_MULTIPLIER DECIMAL(18,2) NULL,
    CUSTOM_DISCOUNT_PER DECIMAL(18,2) NULL,
    ONETIME_SETUP DECIMAL(18,2) NULL,
    ONETIME_DISCOUNT DECIMAL(18,2) NULL,
    ONETIME_TOTAL DECIMAL(18,2) NULL,
    QUOTATION_PREFIX VARCHAR(50) NULL,
    QUOT_NO INT NULL,
    GST_NO VARCHAR(50) NULL;`
    ]
  },
  {
    comments: "HRMS_Lead_Master",
    ID: 1590,
    queries: [
       `ALTER TABLE HRMS_Lead_Master ALTER COLUMN EMPLOYEES NVARCHAR(50);`,
    ]
  },
  {
    comments: "HRMS_Lead_Master",
    ID: 1591,
    queries: [
       `ALTER TABLE salary_policies ADD  pt_slabs_male VARCHAR(MAX) NULL`,
        `ALTER TABLE salary_policies ADD  pt_slabs_female VARCHAR(MAX) NULL`,
        `ALTER TABLE COMP_KEYDATA ADD is_cust_unique_ledger BIT NOT NULL DEFAULT(0);`,
        `INSERT INTO Mand_Mst
          (misc_code, misc_name, field_name, field_Abbr, Created_By, Export_Type, IsMandtory)
          VALUES
          (4,'Lead Management','INV_Date','Lead Date','SYSTEM',1,1),
          (4,'Lead Management','Ledg_Name','Customer Name','SYSTEM',1,1),
          (4,'Lead Management','Ph1','Mobile No','SYSTEM',1,1),
          (4,'Lead Management','PriceModelGroup','Price Model Group','SYSTEM',1,1),
          (4,'Lead Management','pricelistvariant','Price List Variant','SYSTEM',1,1),
          (4,'Lead Management','Color','Color','SYSTEM',1,1),
          (4,'Lead Management','DSE_TL','Team Leader','SYSTEM',1,1),
          (4,'Lead Management','DSE_Gen','follow-Up By ( DSE )','SYSTEM',1,1),
          (4,'Lead Management','Qty','Quantity','SYSTEM',1,1),

          (4,'Lead Management','Status','Status','SYSTEM',1,0),
          (4,'Lead Management','Enq_Stat','Enquiry Current Stage','SYSTEM',1,0),
          (4,'Lead Management','Customer_Type','Customer Type','SYSTEM',1,0),
          (4,'Lead Management','Exp_Del_Date','Exp.Delv. Date','SYSTEM',1,0),
          (4,'Lead Management','Old_Car_Yes_No','Old Car Exchange','SYSTEM',1,0),
          (4,'Lead Management','Ledg_Add1','Customer Address','SYSTEM',1,0),
          (4,'Lead Management','Email_Id','Email','SYSTEM',1,0),
          (4,'Lead Management','Pin_Code','PIN Code','SYSTEM',1,0),
          (4,'Lead Management','Dist_Code','City','SYSTEM',1,0),
          (4,'Lead Management','Stat_Code','State','SYSTEM',1,0),
          (4,'Lead Management','Cust_Ocu','Customer Occupation','SYSTEM',1,0),
          (4,'Lead Management','Pymt_Mode','Payment Mode','SYSTEM',1,0),
          (4,'Lead Management','Fin_Code','Preferred Financier','SYSTEM',1,0),
          (4,'Lead Management','GST_No','GST Number','SYSTEM',1,0),
          (4,'Lead Management','Financer_Code','Financer Name','SYSTEM',1,0),
          (4,'Lead Management','Loan_Amt','Loan Amount','SYSTEM',1,0),
          (4,'Lead Management','Down_Payment','Down Payment','SYSTEM',1,0),
          (4,'Lead Management','Tenure','Tenure ( In Years )','SYSTEM',1,0),
          (4,'Lead Management','ROI','Rate of Interest ( ROI )','SYSTEM',1,0),
          (4,'Lead Management','Special_Terms','Special Terms Scheme','SYSTEM',1,0),
          (4,'Lead Management','csd_po_date','CSD PO Date','SYSTEM',1,0),
          (4,'Lead Management','csd_po_amount','CSD PO Amount','SYSTEM',1,0),
          (4,'Lead Management','oldReg','Veh. Reg. No.','SYSTEM',1,0),
          (4,'Lead Management','oldChassis','Chassis No.','SYSTEM',1,0),
          (4,'Lead Management','oldEngine','Veh. Engine No.','SYSTEM',1,0),
          (4,'Lead Management','relation','Relation With Customer','SYSTEM',1,0),
          (4,'Lead Management','exchangeType','Exchange Type','SYSTEM',1,0),
          (4,'Lead Management','evaluator','Evaluator Name','SYSTEM',1,0),
          (4,'Lead Management','modl_comp','Model Company','SYSTEM',1,0),
          (4,'Lead Management','oldModel','Model Variant','SYSTEM',1,0),
          (4,'Lead Management','ex_color','Model Color','SYSTEM',1,0),
          (4,'Lead Management','oldYear','MFG. Year','SYSTEM',1,0),
          (4,'Lead Management','oldKm','KM.','SYSTEM',1,0),
          (4,'Lead Management','purchaseAmount','Purchase Amount','SYSTEM',1,0),
          (4,'Lead Management','loanPaid','Loan Paid By Dlr.','SYSTEM',1,0),
          (4,'Lead Management','insurance','3rd Party Insu.Amount','SYSTEM',1,0),
          (4,'Lead Management','oldNetAmt','Net Amount','SYSTEM',1,0),
          (4,'Lead Management','Fuel_Type','Fuel Type','SYSTEM',1,0)`,
          `alter TABLE salary_policies ALTER COLUMN lwf_month [varchar](100) NULL`,
            `ALTER TABLE salary_policies ADD lwf_contribution_type VARCHAR(30) NULL`,
            `ALTER TABLE salary_policies
            ADD
                ewf_applicable      BIT             NOT NULL DEFAULT 0,
                ewf_wage_base        VARCHAR(MAX)    NULL,
                ewf_employee_rate   DECIMAL(5,2)    NULL,
                ewf_employer_rate   DECIMAL(5,2)    NULL,
                ewf_ceiling         DECIMAL(10,2)   NULL`,


            `ALTER TABLE salary_policies ADD ot_calc_type NVARCHAR(20) NULL `,
            `
              CREATE TABLE [dbo].[REPORT_MST](
              	[UTD] [int] IDENTITY(1,1) NOT NULL,
              	[block_id] [varchar](50) NULL,
              	[block_name] [varchar](100) NULL,
              	[block_seq] [int] NULL,
              	[table_name] [varchar](50) NULL,
              	[column_name] [varchar](100) NULL,
              	[display_name] [varchar](200) NULL,
              	[field_seq] [int] NULL,
              	[export_type] [int] NULL,
              	[created_by] [varchar](50) NULL,
              	[created_at] [datetime] NULL,
              	[updated_by] [varchar](50) NULL,
              	[updated_at] [datetime] NULL,
              	[header_color] [varchar](50) NULL,
              	[data_color] [varchar](50) NULL,
              PRIMARY KEY CLUSTERED 
              (
              	[UTD] ASC
              )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
              ) ON [PRIMARY]
                  
              ALTER TABLE [dbo].[REPORT_MST] ADD  DEFAULT ((0)) FOR [field_seq]
                  
              ALTER TABLE [dbo].[REPORT_MST] ADD  DEFAULT ((1)) FOR [export_type]
                  
              `
    ]
  },
  {
    comments: "HRMS_Lead_Master",
    ID: 1592,
    queries: [
       `ALTER TABLE EmployeeMaster_hst ADD Source_Code VARCHAR(20) NULL;`,
       `ALTER TABLE EmployeeMaster ADD Source_Code VARCHAR(20) NULL;`,
      `
CREATE TABLE [dbo].[facemachinerawpunch](
	[cardno] [char](30) NOT NULL,
	[officepunch] [smalldatetime] NOT NULL,
	[ISIMPORT] [int] NULL,
	[img_path] [varchar](500) NULL
) ON [PRIMARY]

`
    ]
  },
  {
    comments: "HRMS_Lead_Master",
    ID: 1593,
    queries: [
       `CREATE TABLE [dbo].[Master_User_Right](
        [UTD] [int] IDENTITY(1,1) NOT NULL,
        [ID] [int] NOT NULL,
        [MISC_NAME] [nvarchar](100) NOT NULL,
        [Optn_Name] [nvarchar](255) NULL,
        [Module_Code] [int] NULL,
         [Created_By] [varchar](50) NULL,
        [Created_At] [datetime] NOT NULL,
        [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
        [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
       
    PRIMARY KEY CLUSTERED
    (
        [UTD] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
        PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
    ) ON [PRIMARY]
    WITH
    (
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Master_User_Right_Hst])
    )

      ALTER TABLE [dbo].[Master_User_Right] ADD DEFAULT (getdate()) FOR [ValidFrom]

      ALTER TABLE [dbo].[Master_User_Right] ADD DEFAULT (getdate()) FOR [Created_At]`,
      `ALTER TABLE COMP_KEYDATA ADD COMP_LEAVE_VALUE VARCHAR(10) NULL;`,
      `CREATE TABLE [dbo].[PAYROLL_COMP_SETUP](
    [UTD] [int] IDENTITY(1,1) NOT NULL,
    [ID] [int] NOT NULL,
    [STATUS] [int] NOT NULL,
    [Created_By] [varchar](50) NULL,
    [Created_At] [datetime] NOT NULL,
    [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
    [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,

    PRIMARY KEY CLUSTERED
    (
        [UTD] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
    SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PAYROLL_COMP_SETUP_Hst])
)`,
`ALTER TABLE [dbo].[PAYROLL_COMP_SETUP] ADD DEFAULT (getdate()) FOR [ValidFrom]`,
`ALTER TABLE [dbo].[PAYROLL_COMP_SETUP] ADD DEFAULT (getdate()) FOR [Created_At]`
    ]
  },
  {
    comments: "Campain_Variables",
    ID: 1594,
    queries: [
      `
CREATE TABLE [dbo].[Campain_Variables](
	[UTD] [int] IDENTITY(1,1) NOT NULL,
	[Campain_ID] [varchar](50) NULL,
	[Campain_Name] [nvarchar](255) NULL,
	[Campain_Seq] [int] NULL,
	[Campain_Lable] [nvarchar](255) NULL,
	[RTL_Column] [varchar](100) NULL,
	[Created_By] [varchar](50) NULL,
	[Created_At] [datetime] NOT NULL,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Campain_Variables_Hst])
)

ALTER TABLE [dbo].[Campain_Variables] ADD  DEFAULT (getdate()) FOR [Created_At]

ALTER TABLE [dbo].[Campain_Variables] ADD  DEFAULT (getdate()) FOR [ValidFrom]

`,
`ALTER TABLE HRSetu_Module_Mst ADD IN_ATTENDANCE BIT DEFAULT 0 NULL`,

    ],
  },
  {
  ID: 1595,
  queries: [
    `ALTER TABLE SALARYSTRUCTURE ADD Daily_Wages MONEY NULL`
  ]
},
{
  ID: 1596,
  queries: [
    `ALTER TABLE ItemsDtl ADD Returned_Qty DECIMAL(18,2)  NULL;`,
    `alter TABLE comp_keydata add Auto_Appr_Bulk_MP int DEFAULT 1`,
    `update COMP_KEYDATA set Auto_Appr_Bulk_MP = 1`
  ]
},
{
  ID: 1597,
  queries: [
    `ALTER TABLE COMP_KEYDATA ADD ISRANGECODESAME BIT NOT NULL DEFAULT 0`
  ]
},
{
  ID: 1598,
  queries: [
    `ALTER TABLE Salary_Approver ADD Daily_Wages MONEY NULL`
  ]
},
{
  ID: 1599,
  comments: "SalaryReportTemplate",
  queries: [
    `ALTER TABLE SalaryReportTemplate
ADD EXPORT_TYPE INT NULL,
    CREATED_BY VARCHAR(50) NULL,
    UPDATED_BY VARCHAR(50) NULL,
    UPDATED_AT DATETIME NULL`,
    `ALTER TABLE COMP_KEYDATA
ADD ALLOW_TASK_MANAGEMENT INT NULL`,
`ALTER TABLE EmployeeTransfers
            ADD
    [APPR_1_CODE] [varchar](100) NULL,
      [APPR_1_STAT] [tinyint] NULL,
      [APPR_1_DATE] [datetime2](7) NULL,
      [APPR_1_REM] [varchar](300) NULL,
      [APPR_2_CODE] [varchar](100) NULL,
      [APPR_2_STAT] [tinyint] NULL,
      [APPR_2_DATE] [datetime2](7) NULL,
      [APPR_2_REM] [varchar](300) NULL,
      [APPR_3_CODE] [varchar](100) NULL,
      [APPR_3_STAT] [tinyint] NULL,
      [APPR_3_DATE] [datetime2](7) NULL,
      [APPR_3_REM] [varchar](300) NULL,
      [FIN_APPR] [tinyint] NULL`
  ]
},
{
  ID: 1600,
  comments: "SalaryReportTemplate",
  queries: [
    `ALTER TABLE leave_policies ALTER COLUMN leave_from_value DECIMAL(5,2) NULL;`,
`ALTER TABLE leave_policies ALTER COLUMN leave_from_value_alloted DECIMAL(5,2) NULL;`,
    `CREATE TABLE Tour_Master (
    Tour_ID INT IDENTITY(1,1) PRIMARY KEY,
    EMP_Code VARCHAR(50) NOT NULL,
    Company_Code VARCHAR(50) NOT NULL,
    Trip_Name NVARCHAR(200) NOT NULL,
    Planned_Start_Time DATETIME NOT NULL,
    Planned_End_Time DATETIME NOT NULL,
    Actual_Start_DateTime DATETIME NOT NULL,
    Actual_End_DateTime DATETIME NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, COMPLETED, AUTO_ENDED
    End_Reason VARCHAR(50) NULL,                    -- MANUAL, MIDNIGHT_AUTO, MAX_DURATION_AUTO
    Created_At DATETIME DEFAULT GETDATE()
);`,

`CREATE TABLE Tour_Location_Log (
    Log_ID INT IDENTITY(1,1) PRIMARY KEY,
    Tour_ID INT NOT NULL,
    EMP_Code VARCHAR(50) NOT NULL,
    Company_Code VARCHAR(50) NOT NULL,
    Latitude VARCHAR(50) NOT NULL,
    Longitude VARCHAR(50) NOT NULL,
    Address NVARCHAR(500) NULL,
    Fetched_At DATETIME NOT NULL,
    Created_At DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Tour_Location_Log_Tour FOREIGN KEY (Tour_ID) REFERENCES Tour_Master(Tour_ID)
);

CREATE INDEX IX_Tour_Master_Emp_Status ON Tour_Master(EMP_Code, Company_Code, Status);
CREATE INDEX IX_Tour_Location_Log_TourID ON Tour_Location_Log(Tour_ID);`

  ]
},
{
  ID: 1601,
  comments: "SalaryReportTemplate",
  queries: [
    `ALTER TABLE leave_policies ALTER COLUMN leave_from_value DECIMAL(5,2) NULL`,
    `ALTER TABLE leave_policies ADD leave_value DECIMAL(3,1) `,     
      `ALTER TABLE leave_policies ADD emp_type VARCHAR(50) `,
      `ALTER TABLE leave_policies ADD fixed_date VARCHAR(2) `,
      `ALTER TABLE leave_policies ADD leave_from_option_alloted VARCHAR(10) `,
    `CREATE INDEX IX_Tour_Location_Log_TourID ON Tour_Location_Log(Tour_ID)`

  ]
},
{
  ID: 1602,
  comments: "Active_Module_Report",
  queries: [
    `CREATE TABLE [dbo].[Active_Module_Report](
      [UTD] [int] IDENTITY(1,1) NOT NULL,
      [DLR_ID] [varchar](50) NULL,
      [DB_Name] [varchar](50) NULL,
      [Module] [nvarchar](255) NULL,
    [Module_Key] [varchar](50) NULL,
    [Sub_Module] [nvarchar](255) NULL,
    [Sub_Module_Key] [varchar](50) NULL,
      [Compay_Nmae] [nvarchar](255) NULL,
      [is_Active] [bit] NULL,
      [Export_type] [int] NULL,
      [Created_By] [varchar](50) NULL,
      [Created_At] [datetime] NOT NULL,
      [ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
      [ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
PRIMARY KEY CLUSTERED 
(
      [UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
      PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])
) ON [PRIMARY]
WITH
(
SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[Active_Module_Report_Hst])
)

ALTER TABLE [dbo].[Active_Module_Report] ADD  DEFAULT (getdate()) FOR [Created_At]

ALTER TABLE [dbo].[Active_Module_Report] ADD  DEFAULT (getdate()) FOR [ValidFrom]`,
    `ALTER TABLE COMP_KEYDATA ADD is_Daily_Wages VARCHAR(10) NULL`     

  ]
},
{
  ID: 1603,
  comments: "SalaryReportTemplate",
  queries: [
    `ALTER TABLE DemoCarMaster ADD EXP_FUEL_QTY DECIMAL(10,2) NULL;`,
`ALTER TABLE COMP_KEYDATA ADD FUEL_VARIANCE_THRESHOLD_PCT DECIMAL(10,2) NULL;`,
`ALTER TABLE FuelSlip ADD PP_LAST_KM INT NULL;`,
`ALTER TABLE FuelSlip ADD EXP_FUEL_QTY DECIMAL(10,2) NULL;`,
`ALTER TABLE FuelSlip ADD LastFilledQty DECIMAL(10,2) NULL;`,
`ALTER TABLE FuelSlip ADD ACTUAL_AVG DECIMAL(10,2) NULL;`,
`ALTER TABLE FuelSlip ADD VARIANCE_PCT DECIMAL(10,2) NULL;`,
`ALTER TABLE FuelSlip ADD THRESHOLD_APPLIED DECIMAL(10,2) NULL;`,
`ALTER TABLE FuelSlip ADD EMPCODE INT NULL;`,

`ALTER TABLE FuelSlip ADD APPR_1_CODE VARCHAR(50) NULL;`,
`ALTER TABLE FuelSlip ADD APPR_1_STAT INT NULL ;`,
`ALTER TABLE FuelSlip ADD APPR_1_DATE DATETIME NULL;`,
`ALTER TABLE FuelSlip ADD APPR_1_REMARK VARCHAR(250) NULL;`,

`ALTER TABLE FuelSlip ADD APPR_2_CODE VARCHAR(50) NULL;`,
`ALTER TABLE FuelSlip ADD APPR_2_STAT INT NULL ;`,
`ALTER TABLE FuelSlip ADD APPR_2_DATE DATETIME NULL;`,
`ALTER TABLE FuelSlip ADD APPR_2_REMARK VARCHAR(250) NULL;`,
`ALTER TABLE FuelSlip ADD APPR_3_CODE VARCHAR(50) NULL`,
`ALTER TABLE FuelSlip ADD APPR_3_STAT INT NULL;`,
`ALTER TABLE FuelSlip ADD APPR_3_DATE DATETIME NULL;`,
`ALTER TABLE FuelSlip ADD APPR_3_REMARK VARCHAR(250) NULL`,
`ALTER TABLE FuelSlip ADD APPR_REQUIRED INT NULL `,
`ALTER TABLE FuelSlip ADD FIN_APPR INT NULL ;`,

`ALTER TABLE DemoCarMaster ADD PP_LAST_KM INT NULL`,
`ALTER TABLE COMP_KEYDATA ADD fuel_module int NULL`

  ]
},
{
  ID: 1604,
  comments: "SalaryReportTemplate",
  queries: [
    `ALTER TABLE COMP_KEYDATA ADD allow_chng_Date_EmpDed INT NULL`,
`CREATE TABLE [dbo].[Leave_Generation_Log](
    [UTD] [int] IDENTITY(1,1) NOT NULL,
    [PolicyId] [int] NULL,
    [EmpCode] [varchar](50) NULL,
    [Leave_Mnth] [int] NULL,
    [Leave_Yr] [int] NULL,
    [LeaveType] [varchar](50) NULL,
    [Generated_Value] [decimal](18, 2) NULL,
    [Generated_On] [datetime] NULL,
    [export_type] [int] NULL,
    [created_by] [varchar](50) NULL,
    [created_at] [datetime] NULL,
    [updated_by] [varchar](50) NULL,
    [updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED
(
    [UTD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

ALTER TABLE [dbo].[Leave_Generation_Log] ADD  DEFAULT ((1)) FOR [export_type]

ALTER TABLE [dbo].[Leave_Generation_Log] ADD  DEFAULT (getdate()) FOR [created_at]

ALTER TABLE [dbo].[Leave_Generation_Log] ADD  DEFAULT (getdate()) FOR [Generated_On]`,
`CREATE TABLE Leave_Encashment (
    UTD                 INT IDENTITY(1,1) PRIMARY KEY,
    Emp_Code            NVARCHAR(20)    NOT NULL,
    Leave_Type          INT             NOT NULL,
    Leave_Mnth          INT             NOT NULL,
    Leave_Yr            INT             NOT NULL,
    Encashed_Days       DECIMAL(10,2)   NOT NULL DEFAULT 0,
    Encashment_Rate     DECIMAL(10,2)   NULL,           -- per-day rate if needed for payroll calc
    Encashment_Amount   DECIMAL(12,2)   NULL,           -- Encashed_Days * Encashment_Rate
    Status              NVARCHAR(20)    NOT NULL DEFAULT 'PENDING',  -- PENDING / PROCESSED / PAID
    Processed_In_Payroll BIT            NOT NULL DEFAULT 0,
    Company_Code        NVARCHAR(50)    NULL,
    Created_By          NVARCHAR(50)    NULL,
    Created_At          DATETIME        NOT NULL DEFAULT GETDATE(),
    Updated_By          NVARCHAR(50)    NULL,
    Updated_At          DATETIME        NULL,
    export_type         INT             NOT NULL DEFAULT 1
);

-- Helpful index for lookups by employee/month/year
CREATE INDEX IX_Leave_Encashment_Emp_Month_Year
ON Leave_Encashment (Emp_Code, Leave_Type, Leave_Mnth, Leave_Yr);`,
`ALTER TABLE FuelSlip ALTER COLUMN EMPCODE VARCHAR(50)`,
`ALTER TABLE Salary_Approver ADD GRATUITY DECIMAL(18,2) NULL`,
`ALTER TABLE SALARYSTRUCTURE ADD GRATUITY DECIMAL(18,2) NULL;`,
`ALTER TABLE COMP_KEYDATA ADD GRATUITY INT NULL ;`

  ]
},
{
  ID: 1604,
  queries: [
    `UPDATE Comp_keydata SET New_dev_code = 1604`
  ]
}
];

module.exports = DBQUERIES;
