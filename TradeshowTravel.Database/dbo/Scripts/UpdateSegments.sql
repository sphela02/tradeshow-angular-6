update segments set name = 'SAS' where name = 'ES'
update segments set name = 'IMS' where name = 'SIS'

if not exists (select 1 from segments where name = 'AS')
begin
	insert into segments (name) values ('AS')
end