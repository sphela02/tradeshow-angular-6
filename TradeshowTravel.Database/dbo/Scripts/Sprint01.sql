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


-- TSTRAV-89 Fix VISA field in the Event grid
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'Visa')
BEGIN
-- add new column
	ALTER TABLE Users ADD Visa bit NOT NULL DEFAULT(0)
END

-- required GO
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'Visa')
BEGIN
-- set Visa to yes where the image exist
  Update [TradeshowTravel].[dbo].[Users] 
  set Visa = 1
  from [TradeshowTravel].[dbo].[UserImages] i
  where i.Category = 'VISA' and i.Username = [TradeshowTravel].[dbo].[Users].Username
END

-- reset email addresses so site will grab them from ldap
UPDATE Users SET Email = NULL WHERE Email LIKE '%harris.com'