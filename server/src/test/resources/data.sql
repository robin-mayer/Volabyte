INSERT INTO users (id, created_at, display_name, last_login_at, password, role, user_name)
VALUES (
        '168bc3b2-5286-4572-a0a1-84f2d414f09c',
        '2025-07-21 12:30:45.000000',
        'Bob',
        '2025-07-21 12:30:45.000000',
        '$2a$10$id00o4644XlZD3MUT/TCO.NNb71aQK/oTfRPaIcNxPDwCVBpCofOy',
        'USER',
        'bob'
       ),
       (
           'e7a7b754-6648-45bd-8e2e-e8afcac887b8',
           '2025-07-23 12:30:45.000000',
           'Admin',
           '2025-07-24 12:30:45.000000',
           '$2a$10$id00o4644XlZD3MUT/TCO.NNb71aQK/oTfRPaIcNxPDwCVBpCofOy',
           'ADMIN',
           'admin'
       );

INSERT INTO sessions (user_id, device_id, device_name, refresh_token, expires_at)
VALUES (
        '168bc3b2-5286-4572-a0a1-84f2d414f09c',
        'device-id',
        'Unit Test Device',
        'expired_refresh_token',
        '2000-01-01 00:00:00.000000'
       );

INSERT INTO files (id, name, is_directory, referenced_file, parent_id, owner_id, uploaded_at)
VALUES ('d0bbdf22-60d3-4362-a32e-e275cd12aa86', 'Directory', true, null, null, '168bc3b2-5286-4572-a0a1-84f2d414f09c', '2025-07-21 14:30:45.000000');

INSERT INTO files (id, name, is_directory, referenced_file, parent_id, owner_id, uploaded_at)
VALUES ('2106bb0e-3429-41ae-84a7-59af82adae87', 'File.pdf', false, '/referenced/file.pdf', null, '168bc3b2-5286-4572-a0a1-84f2d414f09c', '2025-07-21 15:30:45.000000');

INSERT INTO files (id, name, is_directory, referenced_file, parent_id, owner_id, uploaded_at)
VALUES ('e903be49-d43a-4e52-96af-c69dc7e6ebfd', 'Directory_other_user', true, null, null, '168bc3b2-5286-4572-a0a1-84f2d414f09d', '2025-07-21 16:30:45.000000');

INSERT INTO files (id, name, is_directory, referenced_file, parent_id, owner_id, uploaded_at)
VALUES ('e24b75ed-1ad3-49cb-8dc2-9079937114fd', 'File.txt', false, '/referenced/file.txt', 'd0bbdf22-60d3-4362-a32e-e275cd12aa86', '168bc3b2-5286-4572-a0a1-84f2d414f09c', '2025-07-21 15:30:45.000000');

INSERT INTO files (id, name, is_directory, referenced_file, parent_id, owner_id, uploaded_at)
VALUES ('e24b75ed-1ad3-49cb-8dc2-9079937114fe', 'File (1).txt', false, '/referenced/file_1.txt', 'd0bbdf22-60d3-4362-a32e-e275cd12aa86', '168bc3b2-5286-4572-a0a1-84f2d414f09c', '2025-07-21 16:30:45.000000');
