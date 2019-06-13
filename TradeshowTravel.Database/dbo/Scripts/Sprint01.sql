-- TSTRAV-11 Add Passport Expiration date to attendee profile
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'PassportExpirationDate')
BEGIN
	ALTER TABLE Users ADD PassportExpirationDate VARCHAR(MAX) NULL
END