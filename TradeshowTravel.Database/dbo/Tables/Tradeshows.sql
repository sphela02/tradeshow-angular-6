CREATE TABLE [dbo].[Tradeshows] (
    [ID]				INT           IDENTITY (1, 1) NOT NULL,
    [Name]				VARCHAR (256) NOT NULL,
    [Description]		VARCHAR (MAX) NULL,
    [Venue]				VARCHAR (256) NULL,
	[Location]			VARCHAR (256) NULL,
    [StartDate]			DATETIME      NOT NULL,
    [EndDate]			DATETIME      NOT NULL,
	[Segments]			VARCHAR (50)  NULL,
	[Tier]				VARCHAR (50)  NULL,
    [ShowType]			VARCHAR (50)  NOT NULL,
	[RosterDueDate]		DATETIME	  NULL,
    [RsvpDueDate]		DATETIME      NULL,
	[BureauLink]		VARCHAR (256) NULL,
	[Hotels]			VARCHAR (MAX) NULL,
	[EstAttendeeCount]	INT			  NULL,
	[OwnerUsername]		VARCHAR (8)	  NOT NULL,
	[CreatedDate]		DATETIME	  NOT NULL,
	[SendReminders]		BIT			  CONSTRAINT [DF_Tradeshow_SendReminders] DEFAULT ((1)) NOT NULL,
    [Archived]			BIT			  CONSTRAINT [DF_Tradeshow_Archived] DEFAULT ((0)) NOT NULL, 
    CONSTRAINT [PK_Tradeshows] PRIMARY KEY CLUSTERED ([ID] ASC),
	CONSTRAINT [FK_Tradeshows_Users] FOREIGN KEY ([OwnerUsername]) REFERENCES [dbo].[Users] ([Username])
);

