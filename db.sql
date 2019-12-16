DROP TABLE [dbo].[AppUser];
DROP TABLE [dbo].[Book];
DROP TABLE [dbo].[Author];
DROP TABLE [dbo].[Genre];



SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppUser](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](255) NULL,
	[LastName] [nvarchar](255) NULL,
	[Email] [nvarchar](255) NOT NULL,
	[Password] [nvarchar](255) NOT NULL,
	[Role] [nvarchar](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Category]    Script Date: 19/09/2019 09:51:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Genre](
	[GenreId] [int] IDENTITY(1,1) NOT NULL,
	[Genre] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[GenreId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Category]    Script Date: 19/09/2019 09:51:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Author](
	[AuthorId] [int] IDENTITY(1,1) NOT NULL,
	[AuthorName] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[AuthorId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product]    Script Date: 19/09/2019 09:51:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Book](
	[BookId] [int] IDENTITY(1,1) NOT NULL,
	[GenreId] [int] NULL,
    [AuthorId] [int] NULL,
	[BookName] [nvarchar](255) NOT NULL,
	[BookDescription] [nvarchar](255) NULL,
	[BookStock] [int] NOT NULL,
	[BookPrice] [decimal](10, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[BookId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[AppUser] ON 
GO
INSERT [dbo].[AppUser] ([UserId], [FirstName], [LastName], [Email], [Password], [Role]) VALUES (1, N'Alice', N'Admin', N'alice@web.com', N'password', N'admin')
GO
INSERT [dbo].[AppUser] ([UserId], [FirstName], [LastName], [Email], [Password], [Role]) VALUES (2, N'Bob', N'Manager', N'bob@web.com', N'password', N'manager')
GO
INSERT [dbo].[AppUser] ([UserId], [FirstName], [LastName], [Email], [Password], [Role]) VALUES (3, N'Eve', N'User', N'eve@web.com', N'password', N'user')
GO
SET IDENTITY_INSERT [dbo].[AppUser] OFF
GO
SET IDENTITY_INSERT [dbo].[Genre] ON 
GO
INSERT [dbo].[Genre] ([GenreId], [Genre]) VALUES (1, N'Horror')
GO
INSERT [dbo].[Genre] ([GenreId], [Genre]) VALUES (2, N'Surrealism')
GO
INSERT [dbo].[Genre] ([GenreId], [Genre]) VALUES (3, N'History')
GO
INSERT [dbo].[Genre] ([GenreId], [Genre]) VALUES (4, N'Thriller')
GO
INSERT [dbo].[Genre] ([GenreId], [Genre]) VALUES (5, N'Music')
GO
INSERT [dbo].[Genre] ([GenreId], [Genre]) VALUES (6, N'Art')
GO
INSERT [dbo].[Genre] ([GenreId], [Genre]) VALUES (7, N'Philosophy')
GO
SET IDENTITY_INSERT [dbo].[Genre] OFF
GO
SET IDENTITY_INSERT [dbo].[Author] ON 
GO
INSERT [dbo].[Author] ([AuthorId], [AuthorName]) VALUES (1, N'Dan Brown')
GO
INSERT [dbo].[Author] ([AuthorId], [AuthorName]) VALUES (2, N'Haruki Murakami')
GO
INSERT [dbo].[Author] ([AuthorId], [AuthorName]) VALUES (3, N'Karl Marx')
GO
INSERT [dbo].[Author] ([AuthorId], [AuthorName]) VALUES (4, N'Hegel')
GO
INSERT [dbo].[Author] ([AuthorId], [AuthorName]) VALUES (5, N'Patti Smith')
GO
INSERT [dbo].[Author] ([AuthorId], [AuthorName]) VALUES (6, N'Bram Stoker')
GO
SET IDENTITY_INSERT [dbo].[Author] OFF
GO
SET IDENTITY_INSERT [dbo].[Book] ON 
GO
INSERT [dbo].[Book] ([BookId], [AuthorId], [GenreId], [BookName], [BookDescription], [BookStock], [BookPrice]) VALUES (1, 2, 1, N'Kafka on the Shore', N'Metaphysical cat shenanigans. Colonel Sanders is in it.', 100, CAST(55.00 AS Decimal(10, 2)))
GO

SET IDENTITY_INSERT [dbo].[Book] OFF
GO
ALTER TABLE [dbo].[Book] ADD  DEFAULT ((0)) FOR [BookStock]
GO
ALTER TABLE [dbo].[Book] ADD  DEFAULT ((0.00)) FOR [BookPrice]
GO
ALTER TABLE [dbo].[Book]  WITH CHECK ADD FOREIGN KEY([AuthorId])
REFERENCES [dbo].[Author] ([AuthorId])
GO
ALTER TABLE [dbo].[Book]  WITH CHECK ADD FOREIGN KEY([GenreId])
REFERENCES [dbo].[Genre] ([GenreId])
GO

GRANT SELECT,INSERT,UPDATE,ALTER,DELETE ON OBJECT::dbo.AppUser to webUser;
GRANT SELECT,INSERT,UPDATE,ALTER,DELETE ON OBJECT::dbo.Author to webUser;
GRANT SELECT,INSERT,UPDATE,ALTER,DELETE ON OBJECT::dbo.Genre to webUser;
GRANT SELECT,INSERT,UPDATE,ALTER,DELETE ON OBJECT::dbo.Book to webUser;
