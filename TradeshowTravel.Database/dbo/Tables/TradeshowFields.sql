CREATE TABLE [dbo].[TradeshowFields] (
    [ID]          INT			IDENTITY (1, 1) NOT NULL,
    [TradeshowID] INT			NOT NULL,
	[Label]		  VARCHAR (256) NOT NULL,
    [Input]       VARCHAR (50)  NOT NULL,
	[Source]	  VARCHAR (50)	NULL,
    [Tooltip]     VARCHAR (256) NULL,
    [Options]     VARCHAR (256) NULL,
    [Format]      VARCHAR (25)  NULL,
    [Order]       INT			CONSTRAINT [DF_TradeshowFields_Order] DEFAULT ((0)) NOT NULL,
    [Required]	  BIT			CONSTRAINT [DF_TradeshowFields_Required] DEFAULT ((0)) NOT NULL,
    [Included]	  BIT			CONSTRAINT [DF_TradeshowFields_Include] DEFAULT ((0)) NOT NULL, 
	[Access]	  INT           CONSTRAINT [DF_TradeshowFields_Access] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_TradeshowFields] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_TradeshowFields_Tradeshows] FOREIGN KEY ([TradeshowID]) REFERENCES [dbo].[Tradeshows] ([ID])
);



