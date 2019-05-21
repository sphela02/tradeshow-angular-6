CREATE TABLE [dbo].[Attendees] (
    [ID]                INT           IDENTITY (1, 1) NOT NULL,
    [TradeshowID]       INT           NOT NULL,
    [Username]          VARCHAR (8)   NOT NULL,
    [Status]            VARCHAR (10)  NOT NULL,
    [Arrival]           DATETIME      NULL,
    [Departure]         DATETIME      NULL,
    [TravelMethod]		VARCHAR(50)	  NULL, 
	[CCNumber]			VARCHAR(MAX)  NULL,
	[CCExpiration]		VARCHAR(MAX)  NULL,
	[CVVNumber]			VARCHAR(MAX)  NULL,
	[IsHotelNeeded]		BIT			  NULL,
	[SendRSVP]			BIT			  CONSTRAINT [DF_Attendees_SendRSVP] DEFAULT ((0)) NOT NULL,
    [DateCreated]		DATETIME	  NOT NULL, 
	[DateRSVP]			DATETIME	  NULL,
    [DateAccepted]		DATETIME	  NULL, 
    [DateCancelled]		DATETIME	  NULL, 
    [DateCompleted]		DATETIME	  NULL, 
    CONSTRAINT [PK_Attendees] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Attendees_Tradeshows] FOREIGN KEY ([TradeshowID]) REFERENCES [dbo].[Tradeshows] ([ID]),
	CONSTRAINT [FK_Attendees_Users] FOREIGN KEY ([Username]) REFERENCES [dbo].[Users] ([Username])
);



