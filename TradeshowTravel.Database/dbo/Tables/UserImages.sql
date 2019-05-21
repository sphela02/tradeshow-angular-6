CREATE TABLE [dbo].[UserImages] (
    [Username]    VARCHAR (8)   NOT NULL,
    [Image]       IMAGE         NOT NULL,
    [ImageType]   VARCHAR (20)  NOT NULL,
    [Category]    VARCHAR (50)  NOT NULL,
    [Description] VARCHAR (500) NULL,
    CONSTRAINT [PK_UserImages] PRIMARY KEY CLUSTERED ([Username] ASC, [Category] ASC)
);


