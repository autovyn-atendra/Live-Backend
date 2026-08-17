const Sequelize = require("sequelize");
const _Employee_Reference_Details = function (sequelize, DataTypes) {
  return sequelize.define(
    "EmployeeReferenceDetails",
    {
        UTD: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
          },
          CandidateName: {
            type: DataTypes.STRING(500),
            allowNull: true
          },
          Date_Of_Request: {
            type: DataTypes.DATE,
            allowNull: true
          },
          CandidateAddress: {
            type: DataTypes.STRING(500),
            allowNull: true
          },
          MobileNo: {
            type: DataTypes.STRING(20),
            allowNull: true
          },
          Email: {
            type: DataTypes.STRING(50),
            allowNull: true
          },
          AadharNo: {
            type: DataTypes.STRING(30),
            allowNull: true
          },
          PanCard: {
            type: DataTypes.STRING(30),
            allowNull: true
          },
          City: {
            type: DataTypes.STRING(20),
            allowNull: true
          },
          State: {
            type: DataTypes.STRING(20),
            allowNull: true
          },
          CandidateImage: {
            type: DataTypes.STRING(100),
            allowNull: true
          },
          PositionAppliedFor: {
            type: DataTypes.STRING(100),
            allowNull: true
          },
          PreviousContactName: {
            type: DataTypes.STRING(100),
            allowNull: true
          },
          Date_Of_Reference: {
            type: DataTypes.DATE,
            allowNull: true
          },
          PreviousCompanyName: {
            type: DataTypes.STRING(200),
            allowNull: true
          },
          PreviousAddress: {
            type: DataTypes.STRING(200),
            allowNull: true
          },
          ReferenceMobileNo: {
            type: DataTypes.STRING(20),
            allowNull: true
          },
          ReferenceEmail: {
            type: DataTypes.STRING(50),
            allowNull: true
          },
          RelationToCandidate: {
            type: DataTypes.STRING(50),
            allowNull: true
          },
          EmployeeStartDate: {
            type: DataTypes.DATE,
            allowNull: true
          },
          EmployeeEndDate: {
            type: DataTypes.DATE,
            allowNull: true
          },
          PreviousPosition: {
            type: DataTypes.STRING(50),
            allowNull: true
          },
          PreviousSalary: {
            type: DataTypes.STRING(50),
            allowNull: true
          },
          ReasonForSeperation: {
            type: DataTypes.STRING(500),
            allowNull: true
          },
          SeperationVoluntary: {
            type: DataTypes.STRING(10),
            allowNull: true
          },
          EligileForRehire: {
            type: DataTypes.STRING(200),
            allowNull: true
          },
          LengthTimeKnown: {
            type: DataTypes.STRING(50),
            allowNull: true
          },
          Strength: {
            type: DataTypes.STRING(500),
            allowNull: true
          },
          Weakness: {
            type: DataTypes.STRING(500),
            allowNull: true
          },
          Skills: {
            type: DataTypes.STRING(500),
            allowNull: true
          },
          Issues: {
            type: DataTypes.STRING(500),
            allowNull: true
          },
          LandloardName: {
            type: DataTypes.STRING(100),
            allowNull: true
          },
          LandlordAddress: {
            type: DataTypes.STRING(500),
            allowNull: true
          },
          LandlordMobileNo: {
            type: DataTypes.STRING(20),
            allowNull: true
          },
          LandlordEmail: {
            type: DataTypes.STRING(50),
            allowNull: true
          },
          MoveInDate: {
            type: DataTypes.DATE,
            allowNull: true
          },
          MoveOutDate: {
            type: DataTypes.DATE,
            allowNull: true
          },
          MonthlyRent: {
            type: DataTypes.STRING(50),
            allowNull: true
          },
          DidCandidate_make_Timely_Payement: {
            type: DataTypes.STRING(10),
            allowNull: true
          },
          Candidate_Complaint: {
            type: DataTypes.STRING(500),
            allowNull: true
          },
          LandlordIssues: {
            type: DataTypes.STRING(500),
            allowNull: true
          },
          DidCandidate_give_Proper_Notice: {
            type: DataTypes.STRING(10),
            allowNull: true
          },
          NewCompanyName: {
            type: DataTypes.STRING(200),
            allowNull: true
          },
          NewCompanyContactName: {
            type: DataTypes.STRING(100),
            allowNull: true
          },
          NewCompanyAddress: {
            type: DataTypes.STRING(500),
            allowNull: true
          },
          NewCompanyMobileNo: {
            type: DataTypes.STRING(20),
            allowNull: true
          },
          NewCompanyEmail: {
            type: DataTypes.STRING(50),
            allowNull: true
          },
          Created_By: {
            type: DataTypes.STRING(255),
            allowNull: true
          },
          DOB: {
            type: DataTypes.DATE,
            allowNull: true
          },
          Loc_code: {
            type: DataTypes.STRING(10),
            allowNull: true
          },
          IsReference: {
            type: DataTypes.STRING(10),
            allowNull: true
          },
          Attachments: {
            type: DataTypes.JSON, // Stores an array of file objects
            allowNull: true
          },
          IsLandLord: {
            type: DataTypes.STRING(10),
            allowNull: true
          },
          Verication_Status: {
            type: DataTypes.STRING(10),
            allowNull: true
          },
          Receipt_Date: {
            type: DataTypes.DATE,
            allowNull: true
          },
          Receipt_No: {
            type: DataTypes.STRING(10),
            allowNull: true
          },
          Agency_Remark: {
            type: DataTypes.STRING(200),
            allowNull: true
          },
          Verification_Documents: {
            type: DataTypes.JSON,
            allowNull: true
          },
          
    },
    {
      sequelize,
      tableName: "Employee_Reference_Details",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK__Asset_Is__C5B6F0D21EED522D",
          unique: true,
          fields: [
            { name: "UTD" },
          ]
        },
      ]
    }
  );
};

const Joi = require("joi");

const EmployeeReferenceDetailsSchema = Joi.object({
    CandidateName: Joi.string().max(100).optional().allow(null, ''),
    Date_Of_Request: Joi.date().optional().allow(null, ''),
    CandidateAddress: Joi.string().max(500).optional().allow(null, ''),
    MobileNo: Joi.string().max(20).optional().allow(null, ''),
    Email: Joi.string().email().max(50).optional().allow(null, ''),
    AadharNo: Joi.string().max(30).optional().allow(null, ''),
    PanCard: Joi.string().max(30).optional().allow(null, ''),
    City: Joi.string().max(20).optional().allow(null, ''),
    State: Joi.string().max(20).optional().allow(null, ''),
    CandidateImage: Joi.string().max(500).optional().allow(null, ''),
    PositionAppliedFor: Joi.string().max(100).optional().allow(null, ''),
    PreviousContactName: Joi.string().max(100).optional().allow(null, ''),
    Date_Of_Reference: Joi.date().optional().allow(null, ''),
    PreviousCompanyName: Joi.string().max(200).optional().allow(null, ''),
    PreviousAddress: Joi.string().max(200).optional().allow(null, ''),
    ReferenceMobileNo: Joi.string().max(20).optional().allow(null, ''),
    ReferenceEmail: Joi.string().email().max(50).optional().allow(null, ''),
    RelationToCandidate: Joi.string().max(50).optional().allow(null, ''),
    EmployeeStartDate: Joi.date().optional().allow(null, ''),
    EmployeeEndDate: Joi.date().optional().allow(null, ''),
    PreviousPosition: Joi.string().max(50).optional().allow(null, ''),
    PreviousSalary: Joi.string().max(50).optional().allow(null, ''),
    ReasonForSeperation: Joi.string().max(500).optional().allow(null, ''),
    SeperationVoluntary: Joi.string().max(10).optional().allow(null, ''),
    EligileForRehire: Joi.string().max(200).optional().allow(null, ''),
    LengthTimeKnown: Joi.string().max(50).optional().allow(null, ''),
    Strength: Joi.string().max(500).optional().allow(null, ''),
    Weakness: Joi.string().max(500).optional().allow(null, ''),
    Skills: Joi.string().max(500).optional().allow(null, ''),
    Issues: Joi.string().max(500).optional().allow(null, ''),
    LandloardName: Joi.string().max(100).optional().allow(null, ''),
    LandlordAddress: Joi.string().max(500).optional().allow(null, ''),
    LandlordMobileNo: Joi.string().max(20).optional().allow(null, ''),
    LandlordEmail: Joi.string().email().max(50).optional().allow(null, ''),
    MoveInDate: Joi.date().optional().allow(null, ''),
    MoveOutDate: Joi.date().optional().allow(null, ''),
    MonthlyRent: Joi.string().max(50).optional().allow(null, ''),
    DidCandidate_make_Timely_Payement:  Joi.alternatives().try(
      Joi.string().max(10),
      Joi.number().allow(null)
    ).optional(),
    Candidate_Complaint:  Joi.alternatives().try(
      Joi.string().max(10),
      Joi.number().allow(null)
    ).optional(),
    LandlordIssues: Joi.string().max(500).optional().allow(null, ''),
    DidCandidate_give_Proper_Notice:  Joi.alternatives().try(
      Joi.string().max(10),
      Joi.number().allow(null)
    ).optional(),
    NewCompanyName: Joi.string().max(200).optional().allow(null, ''),
    NewCompanyContactName: Joi.string().max(100).optional().allow(null, ''),
    NewCompanyAddress: Joi.string().max(500).optional().allow(null, ''),
    NewCompanyMobileNo: Joi.string().max(20).optional().allow(null, ''),
    NewCompanyEmail: Joi.string().email().max(50).optional().allow(null, ''),
    Created_By: Joi.string().max(255).optional().allow(null, ''),
    DOB: Joi.date().optional().allow(null, ''),
    Loc_code: Joi.alternatives().try(
      Joi.string().max(10),
      Joi.number().allow(null)
    ).optional(),
    IsReference: Joi.alternatives().try(
      Joi.string().max(10),
      Joi.number().allow(null)
    ).optional(),
    Attachments: Joi.array().items(
      Joi.object({
        imagePath: Joi.string().max(1000).required(),
        description: Joi.string().max(500).optional().allow(null, '')
      })
    ).optional().allow(null, ''),
    IsLandLord: Joi.alternatives().try(
      Joi.string().max(10),
      Joi.number().allow(null)
    ).optional(),
    Verication_Status: Joi.alternatives().try(
      Joi.string().max(10),
      Joi.number().allow(null)
    ).optional(),
    Receipt_Date: Joi.date().optional().allow(null, ''),
    Receipt_No: Joi.alternatives().try(
      Joi.string().max(10),
      Joi.number().allow(null)
    ).optional(),
    Agency_Remark: Joi.alternatives().try(
      Joi.string().max(200),
      Joi.number().allow(null)
    ).optional(),
    Verification_Documents: Joi.array()
    .items(Joi.string().max(1000).optional().allow(null, '')) // Validate each string as a valid URI (file path)
    .optional().allow(null, ''),
});


module.exports = { _Employee_Reference_Details, EmployeeReferenceDetailsSchema };
