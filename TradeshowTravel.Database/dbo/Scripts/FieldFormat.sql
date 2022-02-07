
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Fields') AND name = 'Format')
BEGIN
	ALTER TABLE Fields ADD [Format] VARCHAR(25) NULL;
END
go

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('TradeshowFields') AND name = 'Format')
BEGIN
	ALTER TABLE TradeshowFields ADD [Format] VARCHAR(25) NULL;
END
go

update [Fields] set [Format] = 'MM/yyyy' where [Input] = 'Date' and [Source] = 'CCExpiration';
update [TradeshowFields] set [Format] = 'MM/yyyy' where [Input] = 'Date' and [Source] = 'CCExpiration';
update [Fields] set [Format] = 'MM/dd/yyyy' where [Input] = 'Date' and [Format] is null;
update [TradeshowFields] set [Format] = 'MM/dd/yyyy' where [Input] = 'Date' and [Format] is null;
go
