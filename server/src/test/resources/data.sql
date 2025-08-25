insert into users (created_at, display_name, last_login_at, password, role, user_id, user_name)
values ('2025-07-21 12:30:45.000000',
        'Bob',
        '2025-07-21 12:30:45.000000',
        '$2a$10$id00o4644XlZD3MUT/TCO.NNb71aQK/oTfRPaIcNxPDwCVBpCofOy',
        'USER', '168bc3b2-5286-4572-a0a1-84f2d414f09c',
        'bob');


insert into files (name, is_directory, referenced_file, parent_id, owner_id, uploaded_at)
values ('Directory', true, null, null, '168bc3b2-5286-4572-a0a1-84f2d414f09c', '2025-07-21 14:30:45.000000');

insert into files (name, is_directory, referenced_file, parent_id, owner_id, uploaded_at)
values ('File', false, '/referenced/file.pdf', null, '168bc3b2-5286-4572-a0a1-84f2d414f09c', '2025-07-21 14:30:45.000000');

insert into files (name, is_directory, referenced_file, parent_id, owner_id, uploaded_at)
values ('Directory_other_user', true, null, null, '168bc3b2-5286-4572-a0a1-84f2d414f09d', '2025-07-21 14:30:45.000000');