<?php

function get_bearer_token()
{
    $headers = getallheaders();

    if (!isset($headers['Authorization'])) {
        return null;
    }

    if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
        return $matches[1];
    }

    return null;
}

function require_auth()
{
    $token = get_bearer_token();

    if (!$token) {
        http_response_code(401);
        echo json_encode([
            "error" => "Missing token"
        ]);
        exit;
    }

    // 🔑 TEMP SIMPLE VALIDATION (you will later replace with Phi validation)
    $expected = getenv('WANDER_API_TOKEN');

    if (!$expected || $token !== $expected) {
        http_response_code(403);
        echo json_encode([
            "error" => "Invalid token"
        ]);
        exit;
    }

    return true;
}