<?php
// contact.php — receptor del formulario de la landing (Isis Elinor)
// Requiere PHPMailer. En Hostinger:
//   composer require phpmailer/phpmailer
// o subí la carpeta PHPMailer/src y ajustá los require de abajo.

header('Content-Type: application/json; charset=utf-8');

function salir($ok, $error = null, $code = 200) {
  http_response_code($code);
  echo json_encode(['ok' => $ok, 'error' => $error], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  salir(false, 'Método no permitido.', 405);
}

// --- Datos del formulario ---
$nombre   = trim($_POST['nombre']   ?? '');
$email    = trim($_POST['email']    ?? '');
$telefono = trim($_POST['telefono'] ?? '');
$asunto   = trim($_POST['asunto']   ?? '');
$mensaje  = trim($_POST['mensaje']  ?? '');
$hp       = trim($_POST['website']  ?? ''); // honeypot opcional

if ($hp !== '') salir(true); // bot: fingimos éxito y descartamos

if ($nombre === '' || $mensaje === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  salir(false, 'Completá nombre, un email válido y el mensaje.', 422);
}

// Normalizamos para evitar inyección de cabeceras
$nombre   = str_replace(["\r", "\n"], ' ', $nombre);
$email    = str_replace(["\r", "\n"], ' ', $email);
$telefono = str_replace(["\r", "\n"], ' ', $telefono);
$asunto   = str_replace(["\r", "\n"], ' ', $asunto);
$mensaje  = htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8');

// --- PHPMailer ---
// Opción A (Composer):
require __DIR__ . '/vendor/autoload.php';
// Opción B (manual): descomentá si subiste PHPMailer a mano y borrá la línea de arriba
// require __DIR__ . '/PHPMailer/src/Exception.php';
// require __DIR__ . '/PHPMailer/src/PHPMailer.php';
// require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
  $mail->isSMTP();
  $mail->Host       = 'smtp.hostinger.com';
  $mail->SMTPAuth   = true;
  $mail->Username   = 'produccion@isiselinor.com';
  $mail->Password   = getenv('SMTP_PASS') ?: 'TU_CONTRASEÑA'; // ← poné tu contraseña o una variable de entorno
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // ssl
  $mail->Port       = 465;
  $mail->CharSet    = 'UTF-8';

  // Remitente = tu propia casilla (requisito SPF/DKIM); el visitante va en Reply-To
  $mail->setFrom('produccion@isiselinor.com', 'Landing Isis Elinor');
  $mail->addAddress('produccion@isiselinor.com');
  $mail->addReplyTo($email, $nombre);

  $mail->Subject = ($asunto !== '' ? $asunto : 'Nuevo mensaje desde la Landing Page');
  $mail->isHTML(true);
  $mail->Body =
    '<h2 style="font-family:sans-serif">Nuevo mensaje desde la web</h2>' .
    '<p style="font-family:sans-serif"><strong>Nombre:</strong> ' . htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8') . '<br>' .
    '<strong>Email:</strong> ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '<br>' .
    '<strong>Teléfono:</strong> ' . (htmlspecialchars($telefono, ENT_QUOTES, 'UTF-8') ?: '—') . '<br>' .
    '<strong>Asunto:</strong> ' . (htmlspecialchars($asunto, ENT_QUOTES, 'UTF-8') ?: '—') . '</p>' .
    '<p style="font-family:sans-serif"><strong>Mensaje:</strong><br>' . nl2br($mensaje) . '</p>';
  $mail->AltBody = "Nombre: $nombre\nEmail: $email\nTeléfono: $telefono\nAsunto: $asunto\n\nMensaje:\n" . strip_tags($mensaje);

  $mail->send();
  salir(true);
} catch (Exception $e) {
  // No exponemos el detalle al usuario
  error_log('Landing mail error: ' . $mail->ErrorInfo);
  salir(false, 'No se pudo enviar el mensaje. Probá de nuevo o escribime directo.', 500);
}
