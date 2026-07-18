param(
  [int]$Port = 8080
)

$root = [IO.Path]::GetFullPath($PSScriptRoot)
$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $Port)
$listener.Start()

Write-Host "REFLO local server: http://127.0.0.1:$Port/"

$mimeTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.js'   = 'text/javascript; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.webp' = 'image/webp'
  '.woff2'= 'font/woff2'
  '.ico'  = 'image/x-icon'
}

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::ASCII, $false, 1024, $true)
      $requestLine = $reader.ReadLine()
      if (-not $requestLine) { continue }

      while ($reader.ReadLine() -ne '') { }

      $requestTarget = ($requestLine -split ' ')[1]
      $requestPath = [Uri]::UnescapeDataString(($requestTarget -split '\?')[0]).TrimStart('/')
      if ([string]::IsNullOrWhiteSpace($requestPath)) { $requestPath = 'index.html' }

      $filePath = [IO.Path]::GetFullPath((Join-Path $root $requestPath))
      if (-not $filePath.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
        $status = '403 Forbidden'
        $body = [Text.Encoding]::UTF8.GetBytes('Forbidden')
        $contentType = 'text/plain; charset=utf-8'
      } elseif (Test-Path -LiteralPath $filePath -PathType Leaf) {
        $status = '200 OK'
        $body = [IO.File]::ReadAllBytes($filePath)
        $extension = [IO.Path]::GetExtension($filePath).ToLowerInvariant()
        $contentType = if ($mimeTypes.ContainsKey($extension)) { $mimeTypes[$extension] } else { 'application/octet-stream' }
      } else {
        $status = '404 Not Found'
        $body = [Text.Encoding]::UTF8.GetBytes('Not Found')
        $contentType = 'text/plain; charset=utf-8'
      }

      $header = "HTTP/1.1 $status`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
      $headerBytes = [Text.Encoding]::ASCII.GetBytes($header)
      $stream.Write($headerBytes, 0, $headerBytes.Length)
      $stream.Write($body, 0, $body.Length)
      $stream.Flush()
    } catch {
      Write-Warning $_.Exception.Message
    } finally {
      $client.Close()
    }
  }
} finally {
  $listener.Stop()
}
