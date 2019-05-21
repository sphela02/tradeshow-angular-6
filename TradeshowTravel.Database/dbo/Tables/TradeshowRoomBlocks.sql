CREATE TABLE [dbo].[TradeshowRoomBlocks]
(
	[ID]		   INT		IDENTITY (1,1) NOT NULL,
    [TradeshowID]  INT		NOT NULL,
	[Date]		   DATETIME NOT NULL,
	[EstRoomCount] INT		NOT NULL,
	CONSTRAINT [PK_TradeshowRoomBlocks] PRIMARY KEY CLUSTERED ([ID] ASC),
	CONSTRAINT [FK_TradeshowRoomBlocks_Tradeshows] FOREIGN KEY ([TradeshowID]) REFERENCES [dbo].[Tradeshows] ([ID])
)
