-- TSTRAV-11 Add Passport Expiration date to attendee profile
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'PassportExpirationDate')
BEGIN
	ALTER TABLE Users ADD PassportExpirationDate VARCHAR(MAX) NULL
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('TradeShows') AND name = 'LastBcdUpdatedUsername')
BEGIN
	ALTER TABLE TradeShows ADD LastBcdUpdatedUsername VARCHAR(8) FOREIGN KEY REFERENCES [dbo].[Users] ([Username]) 
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('TradeShows') AND name = 'LastBcdUpdatedDateTime')
BEGIN
	ALTER TABLE TradeShows ADD LastBcdUpdatedDateTime DATETIME NULL
END