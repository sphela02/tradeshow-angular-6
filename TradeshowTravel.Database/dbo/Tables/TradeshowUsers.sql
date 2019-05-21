CREATE TABLE [dbo].[TradeshowUsers] (
    [ID]          INT           IDENTITY (1, 1) NOT NULL,
    [TradeshowID] INT           NOT NULL,
    [Username]    VARCHAR (8)   NOT NULL,
    [Role]        INT   NOT NULL DEFAULT 0,
    CONSTRAINT [PK_TradeshowUsers] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_TradeshowUsers_Tradeshows] FOREIGN KEY ([TradeshowID]) REFERENCES [dbo].[Tradeshows] ([ID]),
	CONSTRAINT [FK_TradeshowUsers_Users] FOREIGN KEY ([Username]) REFERENCES [dbo].[Users] ([Username])
);



