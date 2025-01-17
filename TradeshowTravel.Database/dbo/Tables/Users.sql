﻿CREATE TABLE [dbo].[Users] (
    [Username]					VARCHAR (8)   NOT NULL,
	[DelegateUsername]			VARCHAR (8)   NULL,
	[EmplID]					VARCHAR (11)  NULL,
    [FirstName]					VARCHAR (50)  NOT NULL,
    [LastName]					VARCHAR (50)  NOT NULL,
    [Email]						VARCHAR (256) NOT NULL,
    [Segment]					VARCHAR (30)  NULL,
    [Title]						VARCHAR (100) NULL,
    [Mobile]					VARCHAR (24)  NULL,
    [Telephone]					VARCHAR (24)  NULL,
    [BadgeName]					VARCHAR (100) NULL,
    [PassportNumber]			VARCHAR (MAX) NULL,
    [PassportName]				VARCHAR (MAX) NULL,
	[PassportExpirationDate]	VARCHAR (MAX) NULL,
    [DOB]						VARCHAR (MAX) NULL,
    [Nationality]				VARCHAR (MAX) NULL,
    [COB]						VARCHAR (MAX) NULL,
    [COR]						VARCHAR (MAX) NULL,
    [COI]						VARCHAR (MAX) NULL,
    [Privileges]				INT			  CONSTRAINT [DF_Users_Privileges] DEFAULT ((0)) NOT NULL, 
	[Visa]						VARCHAR (11)	 NULL
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Username] ASC),
    CONSTRAINT [FK_Users_Delegate] FOREIGN KEY ([DelegateUsername]) REFERENCES [dbo].[Users] ([Username])
);

