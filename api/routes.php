<?php

function handle_request($method, $uri)
{
    header('Content-Type: application/json');

    // public health check
    if ($method === 'GET' && $uri === '/api/health') {
        echo json_encode([
            "status" => "ok",
            "service" => "wander"
        ]);
        return;
    }

    // 🔐 protected route example
    if ($method === 'GET' && $uri === '/api/trips') {
        require_auth();

        echo json_encode([
            "trips" => [
                ["id" => 1, "name" => "Test Trip"]
            ]
        ]);
        return;
    }

    http_response_code(404);
    echo json_encode([
        "error" => "Route not found"
    ]);
}