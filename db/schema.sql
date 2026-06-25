CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  points INT NOT NULL DEFAULT 0,
  wins INT NOT NULL DEFAULT 0,
  losses INT NOT NULL DEFAULT 0
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tournaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  event_date DATE NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'анонс'
) DEFAULT CHARSET=utf8mb4;

-- Тестовые данные
INSERT INTO players (name, points, wins, losses) VALUES
  ('Игрок А', 120, 12, 3),
  ('Игрок Б', 95, 9, 5),
  ('Игрок В', 80, 7, 6);

INSERT INTO tournaments (title, event_date, status) VALUES
  ('Открытый турнир «Драйв»', '2026-07-12', 'анонс'),
  ('Кубок Белгородской области', '2026-05-18', 'завершён');
