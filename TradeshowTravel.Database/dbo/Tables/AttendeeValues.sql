CREATE TABLE [dbo].[AttendeeValues] (
    [ID]               INT           IDENTITY (1, 1) NOT NULL,
    [AttendeeID]       INT           NOT NULL,
    [TradeshowFieldID] INT           NOT NULL,
    [Value]            VARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_AttendeeValues] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_AttendeeValues_Attendees] FOREIGN KEY ([AttendeeID]) REFERENCES [dbo].[Attendees] ([ID]),
    CONSTRAINT [FK_AttendeeValues_TradeshowFields] FOREIGN KEY ([TradeshowFieldID]) REFERENCES [dbo].[TradeshowFields] ([ID])
);




