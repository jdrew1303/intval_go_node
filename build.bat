@echo "Building for Windows"

#https://www.microsoft.com/en-us/download/details.aspx?id=15354

electron-packager . --overwrite --asar --platform=win32 --arch=x64 --prune=true --out=release-builds 
--version-string.CompanyName=sixteenmillimeter.com --version-string.FileDescription=mcopy --version-string.ProductName=\"mcopy_digital\"
