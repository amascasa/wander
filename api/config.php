<?php

function loadEnv($path)
{
    if (!file_exists($path)) {
        die("Missing .env file at: " . $path);
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) {
            continue;
        }

        [$name, $value] = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

loadEnv(__DIR__ . '/../.env');

$duffelToken = $_ENV['DUFFEL_ACCESS_TOKEN'] ?? null;
$duffelVersion = $_ENV['DUFFEL_API_VERSION'] ?? 'v2';

if (!$duffelToken) {
    die("DUFFEL_ACCESS_TOKEN is missing from .env");
}