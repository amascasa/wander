<?php

ob_start();
include __DIR__ . '/api/flights.php';
$response = ob_get_clean();

// Override the JSON header sent by flights.php
header('Content-Type: text/html; charset=UTF-8');

$data = json_decode($response, true);

$offer = $data['cheapest_offer'] ?? null;
$route = $data['route'] ?? null;

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wander</title>

    <!-- <style>
        body{
            font-family: Arial, Helvetica, sans-serif;
            background-color:red;
            margin:40px;
        }

        .card{
            border: 1px solid purple;
            max-width:600px;
            margin:auto;
            color:red;
            padding:30px;
            border-radius:12px;
            box-shadow:0 5px 20px rgba(0,0,0,.15);
        }

        h1{
            margin-top:0;
        }

        .price{
              border: 1px solid orange;
            font-size:40px;
            color:green;
            font-weight:bold;
        }

        .route{
            font-size:24px;
            margin-bottom:20px;
        }

        .label{
            font-weight:bold;
            color: red;
        }
    </style> -->
</head>

<body>

<div class="card">

    <h1>✈ Wander</h1>

<?php if($offer && $route): ?>

    <div class="route">
        <?= htmlspecialchars($route['origin']) ?>
        →
        <?= htmlspecialchars($route['destination']) ?>
    </div>

    <div class="price">
        $<?= htmlspecialchars($offer['amount']) ?>
    </div>

    <p><span class="label">Currency:</span> <?= htmlspecialchars($offer['currency']) ?></p>

    <p><span class="label">Airline:</span> <?= htmlspecialchars($offer['airline']) ?></p>

    <p><span class="label">Departure:</span> <?= htmlspecialchars($offer['departing_at']) ?></p>

    <p><span class="label">Arrival:</span> <?= htmlspecialchars($offer['arriving_at']) ?></p>

<?php else: ?>

    <h2>No flights found.</h2>

<?php endif; ?>

</div>

</body>
</html>