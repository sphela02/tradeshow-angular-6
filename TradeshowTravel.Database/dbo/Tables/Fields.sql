CREATE TABLE [dbo].[Fields] (
    [ID]		INT				IDENTITY (1, 1) NOT NULL,
	[Label]		VARCHAR (256)	NOT NULL,
    [Input]     VARCHAR (50)	NOT NULL,
	[Source]	VARCHAR (50)	NULL,
    [Tooltip]   VARCHAR (256)	NULL,
    [Options]   VARCHAR (256)	NULL,
    [Format]    VARCHAR (25)    NULL,
    [Order]		INT				CONSTRAINT [DF_Fields_Order] DEFAULT ((0)) NOT NULL,
	[Required]	BIT				CONSTRAINT [DF_Fields_Required] DEFAULT ((0)) NOT NULL,
    [Included]	BIT				CONSTRAINT [DF_Fields_Include] DEFAULT ((0)) NOT NULL, 
	[Access]	INT				CONSTRAINT [DF_Fields_Access] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_Fields] PRIMARY KEY CLUSTERED ([ID] ASC)
);



