-- Productos
INSERT INTO "Productos" (nombre, descripcion, precio, moneda, stock) VALUES
('Centro de Mesa Floral', 'Elegante centro de mesa con flores frescas de temporada, perfecto para cualquier tipo de boda.', 840.00, 'BS', 40),
('Vela Aromática de Lavanda', 'Vela aromática de lavanda para crear un ambiente relajante y acogedor.', 56.00, 'BS', 150),
('Invitaciones de Boda Clásicas', 'Invitaciones de boda con diseño clásico y elegante, personalizadas con los nombres de los novios.', 17.50, 'BS', 1000),
('Libro de Firmas de Lujo', 'Libro de firmas con cubierta de cuero y detalles dorados, para que los invitados dejen sus mensajes.', 245.00, 'BS', 80),
('Arco Floral para Ceremonia', 'Arco decorativo con flores artificiales de alta calidad, ideal para la ceremonia de la boda.', 1400.00, 'BS', 15),
('Cojines para Anillos', 'Cojines de satén blanco para llevar los anillos durante la ceremonia.', 105.00, 'BS', 50),
('Letras Gigantes LOVE', 'Letras gigantes iluminadas con luces LED, formando la palabra LOVE.', 1750.00, 'BS', 5),
('Confeti Biodegradable', 'Paquetes de confeti biodegradable para lanzar a los novios al salir de la ceremonia.', 70.00, 'BS', 300),
('Vasos Personalizados', 'Vasos personalizados con los nombres de los novios y la fecha de la boda.', 28.00, 'BS', 200),
('Cajas de Regalo para Invitados', 'Cajas de regalo con recuerdos y dulces para los invitados.', 42.00, 'BS', 250);

-- Servicios
INSERT INTO "Servicios" (nombre, descripcion, tarifa, moneda, duracion_en_horas) VALUES
('Coordinación del Día de la Boda', 'Coordinación completa del día de la boda para asegurar que todo salga perfecto.', 7000.00, 'BS', 48),
('Planificación Completa de la Boda', 'Servicio integral de planificación de la boda, desde la selección del lugar hasta la coordinación con proveedores.', 42000.00, 'BS', 24*30*3),
('Decoración y Diseño del Evento', 'Diseño y decoración del lugar del evento de acuerdo a los gustos y preferencias de los novios.', 12600.00, 'BS', 24*21),
('Servicio de Catering Gourmet', 'Servicio de catering con menús gourmet personalizados para los invitados.', 21000.00, 'BS', 24*7),
('Fotografía y Video Profesional', 'Servicio de fotografía y video profesional para capturar los momentos más especiales de la boda.', 17500.00, 'BS', 12),
('Música y Entretenimiento en Vivo', 'Contratación de DJ, banda o músicos en vivo para amenizar la boda.', 10500.00, 'BS', 1),
('Asesoría de Estilo para los Novios', 'Asesoría personalizada para la elección de vestuario y accesorios de los novios.', 4900.00, 'BS', 24*30),
('Transporte de Invitados', 'Servicio de transporte de lujo para los invitados desde y hacia el lugar del evento.', 8400.00, 'BS', 2),
('Organización de Ceremonia Civil y Religiosa', 'Organización y coordinación de la ceremonia civil y/o religiosa.', 5950.00, 'BS', 60),
('Planificación de Luna de Miel', 'Asesoramiento y planificación de la luna de miel perfecta según los deseos de los novios.', 18000.00, 'BS', 24*7);



-- Paquetes
INSERT INTO "Paquetes" (nombre, descripcion, precio, moneda) VALUES
('Paquete Esencial', 'Incluye la coordinación del día de la boda y la decoración básica del lugar.', 7000.00, 'BS'),
('Paquete Romántico', 'Decoración romántica con velas aromáticas y flores frescas, ideal para bodas íntimas.', 10500.00, 'BS'),
('Paquete Elegante', 'Invitaciones personalizadas, libro de firmas de lujo y cojines para anillos.', 8400.00, 'BS'),
('Paquete Floral', 'Centro de mesa floral, arco floral para ceremonia y confeti biodegradable.', 15400.00, 'BS'),
('Paquete Fotografía y Video', 'Servicio completo de fotografía y video profesional para capturar todos los momentos especiales.', 21000.00, 'BS'),
('Paquete Musical', 'Música en vivo con banda o DJ, sistema de sonido y luces para la pista de baile.', 15000.00, 'BS'),
('Paquete Gourmet', 'Servicio de catering gourmet con menú personalizado para todos los invitados.', 30000.00, 'BS'),
('Paquete Transporte', 'Transporte de lujo para los invitados y los novios.', 8400.00, 'BS'),
('Paquete Completo', 'Planificación completa de la boda incluyendo todos los servicios: decoración, catering, fotografía, música, y transporte.', 100000.00, 'BS'),
('Paquete Económico', 'Servicios esenciales de coordinación y decoración básica a un precio accesible.', 5600.00, 'BS'),
('Paquete Ceremonia', 'Organización y decoración de la ceremonia civil y religiosa.', 12600.00, 'BS'),
('Paquete Luna de Miel', 'Planificación de la luna de miel y asesoría de estilo para los novios.', 14000.00, 'BS'),
('Paquete Deluxe', 'Incluye todos los servicios del paquete completo más detalles adicionales y exclusivos.', 150000.00, 'BS'),
('Paquete Decoración', 'Servicios completos de decoración y diseño del evento, incluyendo centro de mesa floral y letras gigantes LOVE.', 42000.00, 'BS'),
('Paquete Infantil', 'Decoración especial para bodas con invitados niños, incluyendo áreas de juego y animadores.', 28000.00, 'BS'),
('Paquete Vintage', 'Decoración con temática vintage, invitaciones personalizadas y detalles de época.', 21000.00, 'BS'),
('Paquete Playa', 'Decoración temática de playa, transporte para los invitados y catering con menú de mariscos.', 56000.00, 'BS'),
('Paquete Jardín', 'Decoración al aire libre con temática de jardín, centro de mesa floral y arco floral.', 35000.00, 'BS'),
('Paquete Personalizado', 'Planificación de boda a medida según las preferencias y gustos específicos de los novios.', 50000.00, 'BS'),
('Paquete VIP', 'Servicio exclusivo para bodas de lujo, incluyendo planificación completa, transporte de lujo y detalles personalizados.', 200000.00, 'BS'),
('Paquete Express', 'Planificación rápida y efectiva para bodas con poco tiempo de preparación, incluye los servicios básicos.', 35000.00, 'BS'),
('Paquete Clásico', 'Servicios tradicionales y elegantes, incluyendo invitaciones, libro de firmas y música clásica.', 28000.00, 'BS'),
('Paquete Moderno', 'Decoración y servicios con un toque moderno y vanguardista, ideal para bodas urbanas.', 45000.00, 'BS');


-- ElementosPaquetes
-- ElementosPaquetes
INSERT INTO "ElementosPaquetes" (paquete_id, tipo_elemento, cantidad, producto_id, servicio_id) VALUES
-- Paquete Esencial
-- Coordinación del Día de la Boda
(1, 'Servicio', 1, NULL, 1), 
-- Centro de Mesa Floral
(1, 'Producto', 10, 1, NULL), 

-- Paquete Romántico
-- Vela Aromática de Lavanda
(2, 'Producto', 50, 2, NULL), 
-- Centro de Mesa Floral
(2, 'Producto', 10, 1, NULL), 

-- Paquete Elegante
-- Invitaciones Personalizadas
(3, 'Producto', 100, 3, NULL), 
-- Libro de Firmas
(3, 'Producto', 1, 4, NULL), 
-- Cojines para Anillos
(3, 'Producto', 1, 6, NULL), 

-- Paquete Floral
-- Centro de Mesa Floral
(4, 'Producto', 20, 1, NULL), 
-- Arco Floral
(4, 'Producto', 1, 5, NULL), 
-- Confeti Biodegradable
(4, 'Producto', 50, 8, NULL), 

-- Paquete Fotografía y Video
-- Fotografía y Video Profesional
(5, 'Servicio', 1, NULL, 5), 

-- Paquete Musical
-- Música y Entretenimiento en Vivo
(6, 'Servicio', 1, NULL, 6), 
-- Fotografía y Video Profesional
(6, 'Servicio', 1, NULL, 5), 

-- Paquete Gourmet
-- Servicio de Catering Gourmet
(7, 'Servicio', 1, NULL, 4), 

-- Paquete Transporte
-- Transporte de Invitados
(8, 'Servicio', 2, NULL, 8), 

-- Paquete Completo
-- Planificación Completa de la Boda
(9, 'Servicio', 1, NULL, 2), 
-- Servicio de Catering Gourmet
(9, 'Servicio', 1, NULL, 4), 
-- Fotografía y Video Profesional
(9, 'Servicio', 1, NULL, 5), 
-- Música y Entretenimiento en Vivo
(9, 'Servicio', 1, NULL, 6), 
-- Transporte de Invitados
(9, 'Servicio', 2, NULL, 8), 

-- Paquete Económico
-- Coordinación del Día de la Boda
(10, 'Servicio', 1, NULL, 1), 
-- Centro de Mesa Floral
(10, 'Producto', 5, 1, NULL), 

-- Paquete Ceremonia
-- Ceremonia Civil y Religiosa
(11, 'Servicio', 1, NULL, 9), 
-- Arco Floral
(11, 'Producto', 1, 5, NULL), 

-- Paquete Luna de Miel
-- Planificación de la Luna de Miel
(12, 'Servicio', 1, NULL, 10), 
-- Asesoría de Estilo para los Novios
(12, 'Servicio', 1, NULL, 7), 

-- Paquete Deluxe
-- Planificación Completa de la Boda
(13, 'Servicio', 1, NULL, 2), 
-- Servicio de Catering Gourmet
(13, 'Servicio', 1, NULL, 4), 
-- Fotografía y Video Profesional
(13, 'Servicio', 1, NULL, 5), 
-- Música y Entretenimiento en Vivo
(13, 'Servicio', 1, NULL, 6), 
-- Transporte de Invitados
(13, 'Servicio', 2, NULL, 8), 
-- Centro de Mesa Floral
(13, 'Producto', 20, 1, NULL), 
-- Arco Floral
(13, 'Producto', 2, 5, NULL), 

-- Paquete Decoración
-- Centro de Mesa Floral
(14, 'Producto', 30, 1, NULL), 
-- Letras Gigantes LOVE
(14, 'Producto', 1, 7, NULL), 

-- Paquete Infantil
-- Vasos Personalizados
(15, 'Producto', 100, 9, NULL), 
-- Música y Entretenimiento en Vivo
(15, 'Servicio', 1, NULL, 6), 

-- Paquete Vintage
-- Invitaciones Personalizadas
(16, 'Producto', 100, 3, NULL), 
-- Libro de Firmas
(16, 'Producto', 1, 4, NULL), 

-- Paquete Playa
-- Centro de Mesa Floral
(17, 'Producto', 30, 1, NULL), 
-- Servicio de Catering Gourmet
(17, 'Servicio', 1, NULL, 4), 
-- Transporte de Invitados
(17, 'Servicio', 2, NULL, 8), 

-- Paquete Jardín
-- Centro de Mesa Floral
(18, 'Producto', 20, 1, NULL), 
-- Arco Floral
(18, 'Producto', 1, 5, NULL), 

-- Paquete Personalizado
-- Planificación Completa de la Boda
(19, 'Servicio', 1, NULL, 2), 

-- Paquete VIP
-- Planificación Completa de la Boda
(20, 'Servicio', 1, NULL, 2), 
-- Servicio de Catering Gourmet
(20, 'Servicio', 1, NULL, 4), 
-- Fotografía y Video Profesional
(20, 'Servicio', 1, NULL, 5), 
-- Música y Entretenimiento en Vivo
(20, 'Servicio', 1, NULL, 6), 
-- Transporte de Invitados
(20, 'Servicio', 2, NULL, 8), 
-- Centro de Mesa Floral
(20, 'Producto', 30, 1, NULL), 
-- Arco Floral
(20, 'Producto', 2, 5, NULL), 
-- Letras Gigantes LOVE
(20, 'Producto', 1, 7, NULL), 
-- Vasos Personalizados
(20, 'Producto', 200, 9, NULL), 

-- Paquete Express
-- Coordinación del Día de la Boda
(21, 'Servicio', 1, NULL, 1), 
-- Invitaciones Personalizadas
(21, 'Producto', 50, 3, NULL), 

-- Paquete Clásico
-- Invitaciones Personalizadas
(22, 'Producto', 100, 3, NULL), 
-- Libro de Firmas
(22, 'Producto', 1, 4, NULL), 
-- Música y Entretenimiento en Vivo
(22, 'Servicio', 1, NULL, 6), 

-- Paquete Moderno
-- Centro de Mesa Floral
(23, 'Producto', 20, 1, NULL), 
-- Letras Gigantes LOVE
(23, 'Producto', 1, 7, NULL), 
(23, 'Servicio', 1, NULL, 6); -- Música y Entretenimiento en Vivo