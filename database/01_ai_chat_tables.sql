CREATE TABLE [dbo].[AI_Conversation_Tbl]
(
    [UTD] BIGINT IDENTITY(1,1) NOT NULL,
    [Conversation_Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [Comp_Code] VARCHAR(50) NOT NULL,
    [User_Id] VARCHAR(100) NULL,
    [User_Code] VARCHAR(100) NULL,
    [Title] NVARCHAR(300) NULL,
    [Is_Active] BIT NOT NULL DEFAULT ((1)),
    [Created_By] VARCHAR(100) NULL,
    [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME(),
    [Updated_At] DATETIME2(7) NULL,
    CONSTRAINT [PK_AI_Conversation_Tbl] PRIMARY KEY CLUSTERED ([UTD] ASC),
    CONSTRAINT [UQ_AI_Conversation_Tbl_Conversation_Id] UNIQUE ([Conversation_Id])
);
GO

CREATE INDEX [IX_AI_Conversation_User]
ON [dbo].[AI_Conversation_Tbl]
(
    [Comp_Code],
    [User_Code],
    [Is_Active],
    [Updated_At]
);
GO

CREATE TABLE [dbo].[AI_Conversation_Message_Tbl]
(
    [UTD] BIGINT IDENTITY(1,1) NOT NULL,
    [Conversation_Id] UNIQUEIDENTIFIER NOT NULL,
    [Message_Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [Role] VARCHAR(20) NOT NULL,
    [Content] NVARCHAR(MAX) NOT NULL,
    [Mode] VARCHAR(30) NULL,
    [Intent] VARCHAR(100) NULL,
    [Sources_JSON] NVARCHAR(MAX) NULL,
    [Metadata_JSON] NVARCHAR(MAX) NULL,
    [Provider_Response_Id] VARCHAR(200) NULL,
    [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT [PK_AI_Conversation_Message_Tbl] PRIMARY KEY CLUSTERED ([UTD] ASC),
    CONSTRAINT [UQ_AI_Conversation_Message_Message_Id] UNIQUE ([Message_Id]),
    CONSTRAINT [FK_AI_Message_Conversation] FOREIGN KEY ([Conversation_Id])
        REFERENCES [dbo].[AI_Conversation_Tbl] ([Conversation_Id]),
    CONSTRAINT [CK_AI_Message_Role] CHECK ([Role] IN ('user', 'assistant', 'system'))
);
GO

CREATE INDEX [IX_AI_Conversation_Message]
ON [dbo].[AI_Conversation_Message_Tbl]
(
    [Conversation_Id],
    [UTD]
);
GO

/* Add these columns to your existing document master if equivalent columns do not exist. */
/*
ALTER TABLE [dbo].[AI_Knowledge_Document_Tbl] ADD
    [File_Path] NVARCHAR(1000) NULL,
    [File_Extension] VARCHAR(20) NULL,
    [RAG_Status] VARCHAR(30) NOT NULL CONSTRAINT [DF_AI_Doc_RAG_Status] DEFAULT ('PENDING'),
    [RAG_Error] NVARCHAR(MAX) NULL,
    [RAG_Chunk_Count] INT NULL,
    [RAG_Processed_At] DATETIME2(7) NULL,
    [RAG_Index_Version] INT NOT NULL CONSTRAINT [DF_AI_Doc_Index_Ver] DEFAULT ((1)),
    [Branch_Code] VARCHAR(50) NULL,
    [Allowed_Role_Flags] VARCHAR(200) NULL;
*/
