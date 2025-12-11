CREATE DATABASE  IF NOT EXISTS `e_ticket_pro` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `e_ticket_pro`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: e_ticket_pro
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos` (
  `id_evento` int NOT NULL AUTO_INCREMENT,
  `id_organizador` int NOT NULL,
  `nombre_evento` varchar(200) NOT NULL,
  `descripcion` text,
  `categoria` enum('Musica','Deportes','Teatro','Stand-up') NOT NULL,
  `fecha_evento` date NOT NULL,
  `hora_evento` time NOT NULL,
  `lugar` varchar(200) NOT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `estado` enum('Activo','Finalizado','Cancelado') DEFAULT 'Activo',
  PRIMARY KEY (`id_evento`),
  KEY `id_organizador` (`id_organizador`),
  CONSTRAINT `eventos_ibfk_1` FOREIGN KEY (`id_organizador`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
INSERT INTO `eventos` VALUES (3,2,'concierto','evento esperado','Musica','2026-10-20','22:00:00','estadio nacional','https://ddclalibertad.gob.pe/wp-content/uploads/2016/06/internet-rock.jpg','Activo'),(4,2,'rock en lima','rock en el peru','Musica','2026-12-04','22:00:00','estadio nacional','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpT6Szi_pTtXKD2wxaOBkKyIGj-16w-XafKg&s','Activo'),(5,2,'PERU VS BRASIL','FUTBOL','Deportes','2026-05-20','17:00:00','estadio nacional','https://e.rpp-noticias.io/xlarge/2019/09/05/221922_836862.jpg','Activo'),(6,6,'hablando huevadas','hablando huevadas','Stand-up','2026-05-25','21:00:00','estadio nacional','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpQvsXS0nLQfstJqGjBURCubTXh6s1USa_Ug&s','Activo');
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promociones`
--

DROP TABLE IF EXISTS `promociones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promociones` (
  `id_promocion` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `descuento` decimal(5,2) NOT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_promocion`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promociones`
--

LOCK TABLES `promociones` WRITE;
/*!40000 ALTER TABLE `promociones` DISABLE KEYS */;
/*!40000 ALTER TABLE `promociones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id_ticket` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_zona` int NOT NULL,
  `codigo_qr` varchar(255) NOT NULL,
  `fecha_compra` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Valido','Usado','Reembolsado') DEFAULT 'Valido',
  `promocion_aplicada` int DEFAULT NULL,
  PRIMARY KEY (`id_ticket`),
  UNIQUE KEY `codigo_qr` (`codigo_qr`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_zona` (`id_zona`),
  KEY `promocion_aplicada` (`promocion_aplicada`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`id_zona`) REFERENCES `zonas_evento` (`id_zona`),
  CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`promocion_aplicada`) REFERENCES `promociones` (`id_promocion`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,1,4,'TICKET-1-1765416241279','2025-12-10 20:24:01','Valido',NULL),(2,4,5,'TICKET-4-1765416768606','2025-12-10 20:32:48','Valido',NULL),(3,4,4,'TICKET-4-1765417256572','2025-12-10 20:40:56','Valido',NULL);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transacciones`
--

DROP TABLE IF EXISTS `transacciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transacciones` (
  `id_transaccion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `metodo_pago` enum('Tarjeta','Yape','Transferencia','Efectivo') NOT NULL,
  `fecha_pago` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado_pago` enum('Pendiente','Completado','Fallido') DEFAULT 'Pendiente',
  PRIMARY KEY (`id_transaccion`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `transacciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transacciones`
--

LOCK TABLES `transacciones` WRITE;
/*!40000 ALTER TABLE `transacciones` DISABLE KEYS */;
INSERT INTO `transacciones` VALUES (1,1,70.00,'Transferencia','2025-12-10 20:24:01','Completado'),(2,4,150.00,'Yape','2025-12-10 20:32:48','Completado'),(3,4,70.00,'Yape','2025-12-10 20:40:56','Completado');
/*!40000 ALTER TABLE `transacciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `rol` enum('Cliente','Organizador','Administrador') NOT NULL DEFAULT 'Cliente',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Juan','Perez','cliente@demo.com','123456',NULL,'Cliente','2025-12-10 16:33:00'),(2,'Carlos','Eventos','organizador@demo.com','123456',NULL,'Organizador','2025-12-10 16:33:00'),(3,'Super','Admin','admin@ticketpro.com','admin123','999888777','Administrador','2025-12-10 18:21:04'),(4,'Maria','Gomez','maria@gmail.com','cliente123','999111222','Cliente','2025-12-10 18:21:04'),(6,'Jose','Benites','joseger.benitesgarcia@gmail.com','123456','950473381','Organizador','2025-12-10 19:35:18'),(9,'juan','Benavides','abcd@gmail.com','123456','952321545','Organizador','2025-12-10 20:13:44');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zonas_evento`
--

DROP TABLE IF EXISTS `zonas_evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zonas_evento` (
  `id_zona` int NOT NULL AUTO_INCREMENT,
  `id_evento` int NOT NULL,
  `nombre_zona` varchar(50) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `capacidad` int NOT NULL,
  `disponibles` int NOT NULL,
  PRIMARY KEY (`id_zona`),
  KEY `id_evento` (`id_evento`),
  CONSTRAINT `zonas_evento_ibfk_1` FOREIGN KEY (`id_evento`) REFERENCES `eventos` (`id_evento`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zonas_evento`
--

LOCK TABLES `zonas_evento` WRITE;
/*!40000 ALTER TABLE `zonas_evento` DISABLE KEYS */;
INSERT INTO `zonas_evento` VALUES (2,3,'General',50.00,1000000,1000000),(3,4,'General',60.00,100000,100000),(4,5,'General',70.00,200000,199998),(5,6,'General',150.00,1000000,999999);
/*!40000 ALTER TABLE `zonas_evento` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-11 13:45:01
