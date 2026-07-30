<?php

set_time_limit(60);

require_once 'config.php';

// *==============================================================
//     DEV MODE
// ==============================================================*/
$DEV_MODE = true;

if ($DEV_MODE) {

    header('Content-Type: application/json');

   echo json_encode([

    "success" => true,

    "origin" => "LAX",

    "departure_date" => date('Y-m-d'),

    "cheapest_overall" => [
        "origin" => "LAX",
        "destination" => "LAS",
        "city" => "Las Vegas",
        "country" => "United States",
        "amount" => "79",
        "currency" => "USD",
        "airline" => "Southwest",
        "departing_at" => "2026-08-01T08:00:00",
        "arriving_at" => "2026-08-01T09:15:00"
    ],

    "regions" => [

        "usa" => [

            [
                "origin" => "LAX",
                "destination" => "LAS",
                "city" => "Las Vegas",
                "country" => "United States",
                "amount" => "79",
                "currency" => "USD",
                "airline" => "Southwest"
            ],

            [
                "origin" => "LAX",
                "destination" => "SFO",
                "city" => "San Francisco",
                "country" => "United States",
                "amount" => "89",
                "currency" => "USD",
                "airline" => "United"
            ],

            [
                "origin" => "LAX",
                "destination" => "SEA",
                "city" => "Seattle",
                "country" => "United States",
                "amount" => "109",
                "currency" => "USD",
                "airline" => "Alaska"
            ]

        ],

        "europe" => [

            [
                "origin" => "LAX",
                "destination" => "LHR",
                "city" => "London",
                "country" => "United Kingdom",
                "amount" => "429",
                "currency" => "USD",
                "airline" => "British Airways"
            ],

            [
                "origin" => "LAX",
                "destination" => "CDG",
                "city" => "Paris",
                "country" => "France",
                "amount" => "449",
                "currency" => "USD",
                "airline" => "Air France"
            ]

        ],

        "asia" => [

            [
                "origin" => "LAX",
                "destination" => "NRT",
                "city" => "Tokyo",
                "country" => "Japan",
                "amount" => "599",
                "currency" => "USD",
                "airline" => "ANA"
            ],

            [
                "origin" => "LAX",
                "destination" => "ICN",
                "city" => "Seoul",
                "country" => "South Korea",
                "amount" => "639",
                "currency" => "USD",
                "airline" => "Korean Air"
            ],

            [
                "origin" => "LAX",
                "destination" => "TPE",
                "city" => "Taipei",
                "country" => "Taiwan",
                "amount" => "669",
                "currency" => "USD",
                "airline" => "China Airlines"
            ]

        ]

    ]

], JSON_PRETTY_PRINT);

    exit;
}
// *==============================================================
//     END DEV MODE
// ==============================================================*/

$origin = strtoupper($_GET['origin'] ?? 'LAX');
$departureDate = date('Y-m-d');

$destinations = [

    "usa" => [

        "LAS",
        "SFO",
        "SEA",
        "DEN"

    ],

    "europe" => [

        "LHR",
        "CDG",
        "AMS"

    ],

    "asia" => [

        "NRT",
        "ICN",
        "TPE"

    ],

    "africa" => [

        "CPT",
        "JNB",
        "CAI"

    ]

];

// Load airport database

$airports = json_decode(
    file_get_contents("../data/airports.json"),
    true
);


function getAirportInfo($iata, $airports)
{

    foreach ($airports as $airport) {


        if ($airport["iata"] === $iata) {


            return [

                "city" => $airport["city"],

                "country" => $airport["country"]

            ];

        }

    }


    return [

        "city" => $iata,

        "country" => ""

    ];

}



function searchDuffelOffer($origin, $destination, $departureDate, $duffelToken, $duffelVersion, $airports)
{
    $url = 'https://api.duffel.com/air/offer_requests';

    $requestBody = [
        "data" => [
            "slices" => [
                [
                    "origin" => $origin,
                    "destination" => $destination,
                    "departure_date" => $departureDate
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
        CURLOPT_TIMEOUT => 20,
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
        return null;
    }

    $result = json_decode($response, true);
    $offers = $result['data']['offers'] ?? [];

    if (empty($offers)) {
        return null;
    }

    usort($offers, function ($a, $b) {
        return (float)$a['total_amount'] <=> (float)$b['total_amount'];
    });

    $cheapest = $offers[0];
    $slice = $cheapest['slices'][0] ?? [];
    $segment = $slice['segments'][0] ?? [];

    $airport = getAirportInfo($destination, $airports);


    return [

        "origin" => $origin,

        "destination" => $destination,

        "city" => $airport["city"],

        "country" => $airport["country"],
            "amount" => $cheapest['total_amount'] ?? null,
            "currency" => $cheapest['total_currency'] ?? "USD",
            "airline" => $cheapest['owner']['name'] ?? null,
            "departing_at" => $segment['departing_at'] ?? null,
            "arriving_at" => $segment['arriving_at'] ?? null
    ];
}

$results = [];

foreach ($destinations as $region => $airportList) {
    $results[$region] = [];

    foreach ($airportList as $destination) {
        $offer = searchDuffelOffer(
            $origin,
            $destination,
            $departureDate,
            $duffelToken,
            $duffelVersion,
            $airports,
        );

        if ($offer) {
            $results[$region][] = $offer;
        }
    }

    usort($results[$region], function ($a, $b) {
        return (float)$a['amount'] <=> (float)$b['amount'];
    });
}

$allOffers = [];

foreach ($results as $regionOffers) {
    foreach ($regionOffers as $offer) {
        $allOffers[] = $offer;
    }
}

usort($allOffers, function ($a, $b) {
    return (float)$a['amount'] <=> (float)$b['amount'];
});

$output = [
    "success" => true,
    "origin" => $origin,
    "departure_date" => $departureDate,
    "cheapest_overall" => $allOffers[0] ?? null,
    "regions" => [

    "usa" => array_slice($results["usa"], 0, 3),

    "europe" => array_slice($results["europe"], 0, 2),

    "asia" => array_slice($results["asia"], 0, 3),

    "africa" => array_slice($results["africa"], 0, 3)

]
];

header('Content-Type: application/json');
echo json_encode($output, JSON_PRETTY_PRINT);