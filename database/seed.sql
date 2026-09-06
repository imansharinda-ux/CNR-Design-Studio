USE cnr_design_studio;
SET SQL_SAFE_UPDATES = 0;

DELETE FROM project_images;
DELETE FROM projects;

INSERT INTO projects (slug, name, type, location, cover_image, description, featured, sort_order) VALUES
('shadow-villa', 'Shadow Villa', 'Renovation', 'Ahangama, Galle', 'sv10', 'A single-storey coastal home in Ahangama, reworked around an arched entry, a rooftop cactus garden and a kidney-shaped pool with a shaded cabana. Inside, fluted timber joinery, soft pink plaster and brushed brass carry the same calm palette from the kitchen through to the bathrooms.', TRUE, 1),
('the-breeze-house', 'The Breeze House', 'New Build', 'Negombo, Sri Lanka', 'bh07p', NULL, TRUE, 2),
('driftwood-villa', 'Driftwood Villa', 'New Build', 'Matara, Sri Lanka', 'dw16', NULL, TRUE, 3),
('villa-unawatuna', 'Villa Unawatuna', 'Concept', 'Galle, Sri Lanka', 'vu13', NULL, TRUE, 4),
('galle-loft', 'Galle Loft', 'Interior', 'Galle Fort, Sri Lanka', 'gl15', NULL, TRUE, 5),
('kandy-hillside', 'Kandy Hillside', 'New Build', 'Kandy, Sri Lanka', 'kh19', NULL, TRUE, 6),
('mirissa-bay-house', 'Mirissa Bay House', 'New Build', 'Mirissa, Sri Lanka', 'pr7', NULL, FALSE, 7),
('the-last-resort', 'The Last Resort', 'Renovation', 'Nuwara Eliya, Sri Lanka', 'pr8', NULL, FALSE, 8),
('sunset-heaven', 'Sunset Heaven', 'Interior', 'Colombo 05, Sri Lanka', 'pr9', NULL, FALSE, 9),
('dusk-villa', 'Dusk Villa', 'Concept', 'Bentota, Sri Lanka', 'pr10', NULL, FALSE, 10),
('villa-rosa', 'Villa Rosa', 'Concept', 'Kurunegala, Sri Lanka', 'pr11', NULL, FALSE, 11),
('the-moon-house', 'The Moon House', 'Interior', 'Colombo 03, Sri Lanka', 'pr12', NULL, FALSE, 12);

SET @p = (SELECT id FROM projects WHERE slug = 'shadow-villa');
INSERT INTO project_images (project_id, file_name, width, height, sort_order) VALUES
(@p, 'sv01', 800, 534, 1),
(@p, 'sv02', 800, 1199, 2),
(@p, 'sv03', 800, 534, 3),
(@p, 'sv04', 800, 1199, 4),
(@p, 'sv05', 800, 534, 5),
(@p, 'sv06', 800, 534, 6),
(@p, 'sv07', 800, 599, 7),
(@p, 'sv08', 800, 1199, 8),
(@p, 'sv09', 800, 534, 9),
(@p, 'sv10', 800, 1199, 10),
(@p, 'sv11', 800, 1199, 11),
(@p, 'sv12', 800, 1199, 12),
(@p, 'sv13', 800, 1199, 13),
(@p, 'sv14', 800, 1199, 14);

SET @p = (SELECT id FROM projects WHERE slug = 'the-breeze-house');
INSERT INTO project_images (project_id, file_name, width, height, sort_order) VALUES
(@p, 'bh01', 800, 474, 1),
(@p, 'bh02', 800, 534, 2),
(@p, 'bh03', 800, 534, 3),
(@p, 'bh04', 800, 534, 4),
(@p, 'bh05', 800, 534, 5),
(@p, 'bh06', 800, 533, 6),
(@p, 'bh07', 800, 534, 7),
(@p, 'bh08', 800, 534, 8);

SET @p = (SELECT id FROM projects WHERE slug = 'driftwood-villa');
INSERT INTO project_images (project_id, file_name, width, height, sort_order) VALUES
(@p, 'dw01', 800, 600, 1),
(@p, 'dw02', 800, 600, 2),
(@p, 'dw03', 800, 533, 3),
(@p, 'dw04', 800, 533, 4),
(@p, 'dw05', 800, 533, 5),
(@p, 'dw06', 800, 599, 6),
(@p, 'dw07', 800, 1067, 7),
(@p, 'dw08', 800, 1200, 8),
(@p, 'dw09', 800, 533, 9),
(@p, 'dw10', 800, 600, 10),
(@p, 'dw11', 800, 600, 11),
(@p, 'dw12', 800, 600, 12),
(@p, 'dw13', 800, 600, 13),
(@p, 'dw14', 800, 1067, 14),
(@p, 'dw15', 800, 534, 15),
(@p, 'dw16', 800, 1067, 16);

SET @p = (SELECT id FROM projects WHERE slug = 'villa-unawatuna');
INSERT INTO project_images (project_id, file_name, width, height, sort_order) VALUES
(@p, 'vu01', 800, 533, 1),
(@p, 'vu02', 800, 598, 2),
(@p, 'vu03', 800, 780, 3),
(@p, 'vu04', 800, 1200, 4),
(@p, 'vu05', 800, 533, 5),
(@p, 'vu06', 800, 533, 6),
(@p, 'vu07', 800, 1200, 7),
(@p, 'vu08', 800, 533, 8),
(@p, 'vu09', 800, 533, 9),
(@p, 'vu10', 800, 533, 10),
(@p, 'vu11', 800, 1200, 11),
(@p, 'vu12', 800, 801, 12),
(@p, 'vu13', 800, 1200, 13),
(@p, 'vu14', 800, 1200, 14),
(@p, 'vu15', 800, 597, 15),
(@p, 'vu16', 800, 620, 16);

SET @p = (SELECT id FROM projects WHERE slug = 'galle-loft');
INSERT INTO project_images (project_id, file_name, width, height, sort_order) VALUES
(@p, 'gl01', 800, 600, 1),
(@p, 'gl02', 800, 600, 2),
(@p, 'gl03', 800, 600, 3),
(@p, 'gl04', 800, 1067, 4),
(@p, 'gl05', 800, 600, 5),
(@p, 'gl06', 800, 600, 6),
(@p, 'gl07', 800, 600, 7),
(@p, 'gl08', 800, 600, 8),
(@p, 'gl09', 800, 600, 9),
(@p, 'gl10', 800, 600, 10),
(@p, 'gl11', 800, 600, 11),
(@p, 'gl12', 800, 600, 12),
(@p, 'gl13', 800, 600, 13),
(@p, 'gl14', 800, 1067, 14),
(@p, 'gl15', 800, 1067, 15);

SET @p = (SELECT id FROM projects WHERE slug = 'kandy-hillside');
INSERT INTO project_images (project_id, file_name, width, height, sort_order) VALUES
(@p, 'kh01', 800, 600, 1),
(@p, 'kh02', 800, 600, 2),
(@p, 'kh03', 800, 600, 3),
(@p, 'kh04', 800, 600, 4),
(@p, 'kh05', 800, 1067, 5),
(@p, 'kh06', 800, 1067, 6),
(@p, 'kh07', 800, 600, 7),
(@p, 'kh08', 800, 600, 8),
(@p, 'kh09', 800, 600, 9),
(@p, 'kh10', 800, 600, 10),
(@p, 'kh11', 800, 600, 11),
(@p, 'kh12', 800, 600, 12),
(@p, 'kh13', 800, 1067, 13),
(@p, 'kh14', 800, 600, 14),
(@p, 'kh15', 800, 1067, 15),
(@p, 'kh16', 800, 1067, 16),
(@p, 'kh17', 800, 1067, 17),
(@p, 'kh18', 800, 600, 18),
(@p, 'kh19', 800, 1067, 19),
(@p, 'kh20', 800, 1067, 20);

SET @p = (SELECT id FROM projects WHERE slug = 'mirissa-bay-house');
INSERT INTO project_images (project_id, file_name, width, height, sort_order) VALUES
(@p, 'mb01', 1600, 1200, 1),
(@p, 'mb02', 800, 1067, 2),
(@p, 'mb03', 800, 600, 3),
(@p, 'mb04', 800, 600, 4),
(@p, 'mb05', 800, 1067, 5),
(@p, 'mb06', 800, 1067, 6),
(@p, 'mb07', 800, 1067, 7),
(@p, 'mb08', 800, 1067, 8),
(@p, 'mb09', 800, 1067, 9),
(@p, 'mb10', 800, 1067, 10),
(@p, 'mb11', 800, 1067, 11),
(@p, 'mb12', 800, 1067, 12),
(@p, 'mb13', 800, 600, 13),
(@p, 'mb14', 800, 1067, 14),
(@p, 'mb15', 800, 1067, 15),
(@p, 'mb16', 800, 1067, 16),
(@p, 'mb17', 800, 1067, 17);

SET @p = (SELECT id FROM projects WHERE slug = 'the-last-resort');
INSERT INTO project_images (project_id, file_name, width, height, sort_order) VALUES
(@p, 'lr01', 800, 534, 1),
(@p, 'lr02', 800, 534, 2),
(@p, 'lr03', 800, 534, 3),
(@p, 'lr04', 800, 1199, 4),
(@p, 'lr05', 800, 533, 5),
(@p, 'lr06', 800, 534, 6),
(@p, 'lr07', 800, 534, 7),
(@p, 'lr08', 800, 534, 8),
(@p, 'lr09', 800, 534, 9),
(@p, 'lr10', 800, 534, 10),
(@p, 'lr11', 800, 534, 11),
(@p, 'lr12', 800, 534, 12),
(@p, 'lr13', 800, 534, 13),
(@p, 'lr14', 800, 534, 14),
(@p, 'lr15', 800, 534, 15),
(@p, 'lr16', 800, 534, 16),
(@p, 'lr17', 800, 1199, 17),
(@p, 'lr18', 800, 1199, 18);

SET @p = (SELECT id FROM projects WHERE slug = 'sunset-heaven');
INSERT INTO project_images (project_id, file_name, width, height, sort_order) VALUES
(@p, 'sh01', 800, 533, 1),
(@p, 'sh02', 800, 533, 2),
(@p, 'sh03', 800, 1200, 3),
(@p, 'sh04', 800, 1200, 4),
(@p, 'sh05', 800, 533, 5),
(@p, 'sh06', 800, 533, 6),
(@p, 'sh07', 800, 1200, 7),
(@p, 'sh08', 800, 1200, 8),
(@p, 'sh09', 800, 1200, 9),
(@p, 'sh10', 800, 533, 10),
(@p, 'sh11', 800, 533, 11),
(@p, 'sh12', 800, 1200, 12),
(@p, 'sh13', 800, 533, 13),
(@p, 'sh14', 800, 533, 14),
(@p, 'sh15', 800, 1200, 15),
(@p, 'sh16', 800, 1200, 16);

SET @p = (SELECT id FROM projects WHERE slug = 'dusk-villa');
INSERT INTO project_images (project_id, file_name, width, height, sort_order) VALUES
(@p, 'dv01', 800, 534, 1),
(@p, 'dv02', 800, 534, 2),
(@p, 'dv03', 800, 533, 3),
(@p, 'dv04', 800, 534, 4),
(@p, 'dv05', 800, 534, 5),
(@p, 'dv06', 800, 534, 6),
(@p, 'dv07', 800, 534, 7),
(@p, 'dv08', 800, 1199, 8),
(@p, 'dv09', 800, 1199, 9),
(@p, 'dv10', 800, 534, 10),
(@p, 'dv11', 800, 1200, 11),
(@p, 'dv12', 800, 534, 12),
(@p, 'dv13', 800, 534, 13),
(@p, 'dv14', 800, 534, 14),
(@p, 'dv15', 800, 534, 15),
(@p, 'dv16', 800, 534, 16),
(@p, 'dv17', 800, 1199, 17),
(@p, 'dv18', 800, 534, 18),
(@p, 'dv19', 800, 1199, 19);

SET @p = (SELECT id FROM projects WHERE slug = 'villa-rosa');
INSERT INTO project_images (project_id, file_name, width, height, sort_order) VALUES
(@p, 'vr01', 800, 533, 1),
(@p, 'vr02', 800, 533, 2),
(@p, 'vr03', 800, 533, 3),
(@p, 'vr04', 800, 449, 4),
(@p, 'vr05', 800, 1200, 5),
(@p, 'vr06', 800, 533, 6),
(@p, 'vr07', 800, 533, 7),
(@p, 'vr08', 800, 533, 8),
(@p, 'vr09', 800, 1200, 9),
(@p, 'vr10', 800, 1200, 10),
(@p, 'vr11', 800, 533, 11),
(@p, 'vr12', 800, 533, 12),
(@p, 'vr13', 800, 533, 13),
(@p, 'vr14', 800, 533, 14),
(@p, 'vr15', 800, 1066, 15),
(@p, 'vr16', 800, 533, 16),
(@p, 'vr17', 800, 1200, 17),
(@p, 'vr18', 800, 533, 18);

SET @p = (SELECT id FROM projects WHERE slug = 'the-moon-house');
INSERT INTO project_images (project_id, file_name, width, height, sort_order) VALUES
(@p, 'mh01', 800, 533, 1),
(@p, 'mh02', 800, 534, 2),
(@p, 'mh03', 800, 533, 3),
(@p, 'mh04', 800, 1199, 4),
(@p, 'mh05', 800, 534, 5),
(@p, 'mh06', 800, 533, 6),
(@p, 'mh07', 800, 534, 7),
(@p, 'mh08', 800, 533, 8),
(@p, 'mh09', 800, 534, 9),
(@p, 'mh10', 800, 533, 10),
(@p, 'mh11', 800, 533, 11),
(@p, 'mh12', 800, 534, 12),
(@p, 'mh13', 800, 533, 13),
(@p, 'mh14', 800, 1199, 14),
(@p, 'mh15', 800, 1199, 15),
(@p, 'mh16', 800, 534, 16);
