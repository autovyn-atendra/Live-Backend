/* Run against every tenant database that contains AI_Knowledge_Document_Tbl. */
IF COL_LENGTH('dbo.AI_Knowledge_Document_Tbl', 'File_Path') IS NULL
  ALTER TABLE [dbo].[AI_Knowledge_Document_Tbl] ADD [File_Path] NVARCHAR(1000) NULL;
GO
IF COL_LENGTH('dbo.AI_Knowledge_Document_Tbl', 'File_Extension') IS NULL
  ALTER TABLE [dbo].[AI_Knowledge_Document_Tbl] ADD [File_Extension] VARCHAR(20) NULL;
GO
IF COL_LENGTH('dbo.AI_Knowledge_Document_Tbl', 'RAG_Status') IS NULL
  ALTER TABLE [dbo].[AI_Knowledge_Document_Tbl] ADD [RAG_Status] VARCHAR(30) NOT NULL CONSTRAINT [DF_AI_Doc_RAG_Status] DEFAULT ('PENDING');
GO
IF COL_LENGTH('dbo.AI_Knowledge_Document_Tbl', 'RAG_Error') IS NULL
  ALTER TABLE [dbo].[AI_Knowledge_Document_Tbl] ADD [RAG_Error] NVARCHAR(MAX) NULL;
GO
IF COL_LENGTH('dbo.AI_Knowledge_Document_Tbl', 'RAG_Chunk_Count') IS NULL
  ALTER TABLE [dbo].[AI_Knowledge_Document_Tbl] ADD [RAG_Chunk_Count] INT NULL;
GO
IF COL_LENGTH('dbo.AI_Knowledge_Document_Tbl', 'RAG_Processed_At') IS NULL
  ALTER TABLE [dbo].[AI_Knowledge_Document_Tbl] ADD [RAG_Processed_At] DATETIME2(7) NULL;
GO
IF COL_LENGTH('dbo.AI_Knowledge_Document_Tbl', 'RAG_Index_Version') IS NULL
  ALTER TABLE [dbo].[AI_Knowledge_Document_Tbl] ADD [RAG_Index_Version] INT NOT NULL CONSTRAINT [DF_AI_Doc_Index_Ver] DEFAULT ((1));
GO
IF COL_LENGTH('dbo.AI_Knowledge_Document_Tbl', 'Branch_Code') IS NULL
  ALTER TABLE [dbo].[AI_Knowledge_Document_Tbl] ADD [Branch_Code] VARCHAR(50) NULL;
GO
IF COL_LENGTH('dbo.AI_Knowledge_Document_Tbl', 'Allowed_Role_Flags') IS NULL
  ALTER TABLE [dbo].[AI_Knowledge_Document_Tbl] ADD [Allowed_Role_Flags] VARCHAR(200) NULL;
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name = 'IX_AI_Knowledge_Document_RAG' AND object_id = OBJECT_ID('dbo.AI_Knowledge_Document_Tbl')
)
BEGIN
  CREATE INDEX [IX_AI_Knowledge_Document_RAG]
  ON [dbo].[AI_Knowledge_Document_Tbl] ([Comp_Code], [RAG_Status], [Is_Active], [Module_Name]);
END
GO
