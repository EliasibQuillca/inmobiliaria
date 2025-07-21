$files = Get-ChildItem -Path 'resources/js/Pages' -Recurse -Filter "*.jsx"
foreach ($file in $files) {
    $content = Get-Content $file.FullName
    $newContent = $content -replace "import Layout from '@/Components/Layout/Layout';", "import Layout from '@/components/layout/Layout';"
    Set-Content -Path $file.FullName -Value $newContent
}
