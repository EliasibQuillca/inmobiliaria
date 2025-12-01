<?php

$files = [
    __DIR__ . '/../tests/Feature/CatalogoTest.php',
    __DIR__ . '/../tests/Unit/DepartamentoTest.php'
];

foreach ($files as $file) {
    $content = file_get_contents($file);
    $content = str_replace('/** @test */', '#[Test]', $content);
    file_put_contents($file, $content);
}

echo "Tests actualizados correctamente.\n";