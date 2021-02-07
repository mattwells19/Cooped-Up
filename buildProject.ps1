Remove-Item .\build -Recurse -ErrorAction Ignore
New-Item -Path . -Name "build" -ItemType "directory"
Set-Location .\server\
npm run build
Copy-Item -Path .\package.json -Destination ..\build
Move-Item -Path .\src\server.js -Destination ..\build
Set-Location ..\web\
npm run build
Set-Location ..\build
npm i
Set-Location ..\