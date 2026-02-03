-- Update Travel Buddy Database with 8 packages, destinations, trips, and admin
USE `travelbuddy`;

-- First, add ADMIN role if not exists
INSERT INTO `role` (`role_id`, `rname`) VALUES (4, 'ADMIN') 
ON DUPLICATE KEY UPDATE `rname` = 'ADMIN';

-- Create Admin table if not exists
CREATE TABLE IF NOT EXISTS `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL UNIQUE,
  `admin_name` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE',
  PRIMARY KEY (`admin_id`),
  KEY `fk_admin_user` (`user_id`),
  CONSTRAINT `fk_admin_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert static Admin user (username: admin, password: admin123)
-- First create the user in users table
INSERT INTO `users` (`user_id`, `username`, `fname`, `lname`, `email`, `password`, `role_id`, `status`, `acc_create_date`) 
VALUES (999, 'admin', 'System', 'Administrator', 'admin@travelbuddy.com', 'admin123', 4, 'ACTIVE', NOW())
ON DUPLICATE KEY UPDATE 
  `username` = VALUES(`username`),
  `fname` = VALUES(`fname`),
  `lname` = VALUES(`lname`),
  `email` = VALUES(`email`),
  `password` = VALUES(`password`),
  `role_id` = VALUES(`role_id`),
  `status` = VALUES(`status`);

-- Insert admin record
INSERT INTO `admin` (`admin_id`, `user_id`, `admin_name`, `status`) 
VALUES (1, 999, 'System Administrator', 'ACTIVE')
ON DUPLICATE KEY UPDATE 
  `admin_name` = VALUES(`admin_name`),
  `status` = VALUES(`status`);

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM `trips`;
-- DELETE FROM `packages`;
-- DELETE FROM `destinations`;

-- Insert 8 Destinations
INSERT INTO `destinations` (`destination_id`, `dname`, `description`) VALUES
(1, 'Rajasthan Heritage', 'Explore the royal palaces, forts, and vibrant culture of Rajasthan including Udaipur, Jaipur, and Jaisalmer'),
(2, 'Himalayan Adventure', 'Experience the breathtaking beauty of the Himalayas in Manali, Kullu, and Solang Valley'),
(3, 'Goa Beach Paradise', 'Relax on pristine beaches and enjoy the vibrant nightlife of North and South Goa'),
(4, 'Kerala Backwaters', 'Cruise through serene backwaters and explore the lush green landscapes of Kochi, Munnar, and Alleppey'),
(5, 'Golden Triangle', 'Discover the rich history and architecture of Delhi, Agra, and Fatehpur Sikri'),
(6, 'Himachal Hills', 'Escape to the cool hills of Shimla, Kufri, and Chail with stunning mountain views'),
(7, 'Maharashtra Explorer', 'Explore the bustling city of Mumbai, historic Pune, and scenic Lonavala'),
(8, 'Northeast Wonders', 'Discover the tea gardens and mountain beauty of Darjeeling, Kalimpong, and Gangtok')
ON DUPLICATE KEY UPDATE 
  `dname` = VALUES(`dname`),
  `description` = VALUES(`description`);

-- Insert 8 Packages (package_id 1-8, assigned to 3 company_ids: 1, 2, 3)
INSERT INTO `packages` (`package_id`, `company_id`, `package_name`, `cost`, `duration`, `description`, `destination_id`) VALUES
(1, 1, 'Rajasthan Royal Tour', 25000.00, '5 days 4 nights', 'Experience the grandeur of Rajasthan with visits to Udaipur, Jaipur, and Jaisalmer. Includes palace tours, camel rides, and traditional Rajasthani cuisine.', 1),
(2, 1, 'Manali Adventure Package', 18000.00, '4 days 3 nights', 'Adventure-filled trip to Manali, Kullu, and Solang Valley. Enjoy paragliding, river rafting, and snow activities in the Himalayas.', 2),
(3, 2, 'Goa Beach Getaway', 15000.00, '3 days 2 nights', 'Perfect beach vacation in Goa. Relax on sandy beaches, enjoy water sports, and experience the vibrant Goan nightlife.', 3),
(4, 2, 'Kerala Backwater Cruise', 22000.00, '6 days 5 nights', 'Peaceful journey through Kerala backwaters. Visit Kochi, Munnar tea gardens, and enjoy houseboat stay in Alleppey.', 4),
(5, 3, 'Golden Triangle Heritage', 12000.00, '3 days 2 nights', 'Explore the iconic Golden Triangle covering Delhi, Agra (Taj Mahal), and Fatehpur Sikri. Rich history and architectural marvels.', 5),
(6, 3, 'Shimla Hill Station Retreat', 14000.00, '4 days 3 nights', 'Escape to the hills of Shimla, Kufri, and Chail. Enjoy cool weather, scenic views, and adventure activities.', 6),
(7, 1, 'Mumbai City Explorer', 16000.00, '4 days 3 nights', 'Discover the city of dreams - Mumbai. Visit iconic landmarks, explore Pune, and enjoy the scenic beauty of Lonavala.', 7),
(8, 2, 'Darjeeling Tea Garden Tour', 20000.00, '5 days 4 nights', 'Experience the charm of Darjeeling, Kalimpong, and Gangtok. Visit tea gardens, monasteries, and enjoy mountain views.', 8)
ON DUPLICATE KEY UPDATE 
  `company_id` = VALUES(`company_id`),
  `package_name` = VALUES(`package_name`),
  `cost` = VALUES(`cost`),
  `duration` = VALUES(`duration`),
  `description` = VALUES(`description`),
  `destination_id` = VALUES(`destination_id`);

-- Insert Trips for each package (with future dates) - 3 trips per package
-- Package 1 - Rajasthan Royal Tour (3 trips)
INSERT INTO `trips` (`trip_id`, `start_date`, `end_date`, `package_id`) VALUES
(1, DATE_ADD(CURDATE(), INTERVAL 15 DAY), DATE_ADD(CURDATE(), INTERVAL 19 DAY), 1),
(2, DATE_ADD(CURDATE(), INTERVAL 30 DAY), DATE_ADD(CURDATE(), INTERVAL 34 DAY), 1),
(3, DATE_ADD(CURDATE(), INTERVAL 60 DAY), DATE_ADD(CURDATE(), INTERVAL 64 DAY), 1)
ON DUPLICATE KEY UPDATE 
  `start_date` = VALUES(`start_date`), 
  `end_date` = VALUES(`end_date`),
  `package_id` = VALUES(`package_id`);

-- Package 2 - Manali Adventure Package (3 trips)
INSERT INTO `trips` (`trip_id`, `start_date`, `end_date`, `package_id`) VALUES
(4, DATE_ADD(CURDATE(), INTERVAL 20 DAY), DATE_ADD(CURDATE(), INTERVAL 23 DAY), 2),
(5, DATE_ADD(CURDATE(), INTERVAL 35 DAY), DATE_ADD(CURDATE(), INTERVAL 38 DAY), 2),
(6, DATE_ADD(CURDATE(), INTERVAL 50 DAY), DATE_ADD(CURDATE(), INTERVAL 53 DAY), 2)
ON DUPLICATE KEY UPDATE 
  `start_date` = VALUES(`start_date`), 
  `end_date` = VALUES(`end_date`),
  `package_id` = VALUES(`package_id`);

-- Package 3 - Goa Beach Getaway (3 trips)
INSERT INTO `trips` (`trip_id`, `start_date`, `end_date`, `package_id`) VALUES
(7, DATE_ADD(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 12 DAY), 3),
(8, DATE_ADD(CURDATE(), INTERVAL 25 DAY), DATE_ADD(CURDATE(), INTERVAL 27 DAY), 3),
(9, DATE_ADD(CURDATE(), INTERVAL 55 DAY), DATE_ADD(CURDATE(), INTERVAL 57 DAY), 3)
ON DUPLICATE KEY UPDATE 
  `start_date` = VALUES(`start_date`), 
  `end_date` = VALUES(`end_date`),
  `package_id` = VALUES(`package_id`);

-- Package 4 - Kerala Backwater Cruise (3 trips)
INSERT INTO `trips` (`trip_id`, `start_date`, `end_date`, `package_id`) VALUES
(10, DATE_ADD(CURDATE(), INTERVAL 18 DAY), DATE_ADD(CURDATE(), INTERVAL 23 DAY), 4),
(11, DATE_ADD(CURDATE(), INTERVAL 33 DAY), DATE_ADD(CURDATE(), INTERVAL 38 DAY), 4),
(12, DATE_ADD(CURDATE(), INTERVAL 48 DAY), DATE_ADD(CURDATE(), INTERVAL 53 DAY), 4)
ON DUPLICATE KEY UPDATE 
  `start_date` = VALUES(`start_date`), 
  `end_date` = VALUES(`end_date`),
  `package_id` = VALUES(`package_id`);

-- Package 5 - Golden Triangle Heritage (3 trips)
INSERT INTO `trips` (`trip_id`, `start_date`, `end_date`, `package_id`) VALUES
(13, DATE_ADD(CURDATE(), INTERVAL 12 DAY), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 5),
(14, DATE_ADD(CURDATE(), INTERVAL 28 DAY), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 5),
(15, DATE_ADD(CURDATE(), INTERVAL 45 DAY), DATE_ADD(CURDATE(), INTERVAL 47 DAY), 5)
ON DUPLICATE KEY UPDATE 
  `start_date` = VALUES(`start_date`), 
  `end_date` = VALUES(`end_date`),
  `package_id` = VALUES(`package_id`);

-- Package 6 - Shimla Hill Station Retreat (3 trips)
INSERT INTO `trips` (`trip_id`, `start_date`, `end_date`, `package_id`) VALUES
(16, DATE_ADD(CURDATE(), INTERVAL 22 DAY), DATE_ADD(CURDATE(), INTERVAL 25 DAY), 6),
(17, DATE_ADD(CURDATE(), INTERVAL 37 DAY), DATE_ADD(CURDATE(), INTERVAL 40 DAY), 6),
(18, DATE_ADD(CURDATE(), INTERVAL 52 DAY), DATE_ADD(CURDATE(), INTERVAL 55 DAY), 6)
ON DUPLICATE KEY UPDATE 
  `start_date` = VALUES(`start_date`), 
  `end_date` = VALUES(`end_date`),
  `package_id` = VALUES(`package_id`);

-- Package 7 - Mumbai City Explorer (3 trips)
INSERT INTO `trips` (`trip_id`, `start_date`, `end_date`, `package_id`) VALUES
(19, DATE_ADD(CURDATE(), INTERVAL 14 DAY), DATE_ADD(CURDATE(), INTERVAL 17 DAY), 7),
(20, DATE_ADD(CURDATE(), INTERVAL 29 DAY), DATE_ADD(CURDATE(), INTERVAL 32 DAY), 7),
(21, DATE_ADD(CURDATE(), INTERVAL 44 DAY), DATE_ADD(CURDATE(), INTERVAL 47 DAY), 7)
ON DUPLICATE KEY UPDATE 
  `start_date` = VALUES(`start_date`), 
  `end_date` = VALUES(`end_date`),
  `package_id` = VALUES(`package_id`);

-- Package 8 - Darjeeling Tea Garden Tour (3 trips)
INSERT INTO `trips` (`trip_id`, `start_date`, `end_date`, `package_id`) VALUES
(22, DATE_ADD(CURDATE(), INTERVAL 20 DAY), DATE_ADD(CURDATE(), INTERVAL 24 DAY), 8),
(23, DATE_ADD(CURDATE(), INTERVAL 35 DAY), DATE_ADD(CURDATE(), INTERVAL 39 DAY), 8),
(24, DATE_ADD(CURDATE(), INTERVAL 50 DAY), DATE_ADD(CURDATE(), INTERVAL 54 DAY), 8)
ON DUPLICATE KEY UPDATE 
  `start_date` = VALUES(`start_date`), 
  `end_date` = VALUES(`end_date`),
  `package_id` = VALUES(`package_id`);

-- Note: Make sure you have at least 3 travel companies with company_id 1, 2, 3
-- If not, create them:
-- INSERT INTO `travel_companies` (`company_id`, `userid`, `company_name`, `license_no`) VALUES
-- (1, [user_id], 'Royal Travels', 'LIC001'),
-- (2, [user_id], 'Adventure Tours', 'LIC002'),
-- (3, [user_id], 'Heritage Holidays', 'LIC003')
-- ON DUPLICATE KEY UPDATE `company_name` = VALUES(`company_name`);
