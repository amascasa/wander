<?php
// 123
require_once 'config.php';




$url = 'https://api.duffel.com/air/offer_requests';
$origin = strtoupper($_GET['origin'] ?? 'LAX');
$destination = strtoupper($_GET['destination'] ?? 'SFO');

$requestBody = [
    "data" => [
        "slices" => [
            [
                "origin" => $origin,
                "destination" => $destination,
                "departure_date" => date('Y-m-d')
            ]
        ],
        "passengers" => [
            ["type" => "adult"]
        ],
        "cabin_class" => "economy"
    ]
];

$ch = curl_init($url);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $duffelToken",
        "Duffel-Version: $duffelVersion",
        "Content-Type: application/json",
        "Accept: application/json"
    ],
    CURLOPT_POSTFIELDS => json_encode($requestBody)
]);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    die(json_encode([
        "error" => curl_error($ch)
    ]));
}

$result = json_decode($response, true);

$offers = $result['data']['offers'] ?? [];

if (empty($offers)) {
    header('Content-Type: application/json');
    echo json_encode([
        "success" => false,
        "message" => "No offers found",
        "raw" => $result
    ], JSON_PRETTY_PRINT);
    exit;
}

usort($offers, function ($a, $b) {
    return (float)$a['total_amount'] <=> (float)$b['total_amount'];
});

$cheapest = $offers[0];
$slice = $cheapest['slices'][0] ?? [];
$segment = $slice['segments'][0] ?? [];

$output = [
    "success" => true,
    "route" => [
        "origin" => $slice['origin']['iata_code'] ?? "SFO",
        "destination" => $slice['destination']['iata_code'] ?? "LAX"
    ],
    "cheapest_offer" => [
        "amount" => $cheapest['total_amount'] ?? null,
        "currency" => $cheapest['total_currency'] ?? null,
        "airline" => $cheapest['owner']['name'] ?? null,
        "departing_at" => $segment['departing_at'] ?? null,
        "arriving_at" => $segment['arriving_at'] ?? null
    ]
];

header('Content-Type: application/json');
echo json_encode($output, JSON_PRETTY_PRINT);